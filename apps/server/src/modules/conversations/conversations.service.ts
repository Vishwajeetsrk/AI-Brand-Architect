import { Injectable } from '@nestjs/common';
import { prisma } from '@nexora/database';
import { pushAIStream, completeAIStream, failAIStream } from '../realtime/sse.controller';

const MAX_TOKENS = 128000;
const SUMMARY_TRIGGER = 40000;
const RATIO = 0.7;

interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  toolCallId?: string;
}

@Injectable()
export class ConversationsService {
  async create(userId: string, data: { title?: string; projectId?: string; organizationId?: string; metadata?: any; systemPrompt?: string }): Promise<any> {
    const conv = await prisma.conversation.create({
      data: {
        title: data.title || 'New Conversation',
        userId, projectId: data.projectId || null, organizationId: data.organizationId || null,
        metadata: data.metadata || undefined,
      },
    });
    if (data.systemPrompt) {
      await prisma.conversationMessage.create({
        data: { conversationId: conv.id, role: 'SYSTEM', content: data.systemPrompt },
      });
      await prisma.conversation.update({ where: { id: conv.id }, data: { messageCount: 1 } });
    }
    return conv;
  }

  async get(id: string): Promise<any> {
    return prisma.conversation.findUnique({ where: { id }, include: { messages: { orderBy: { createdAt: 'asc' } } } });
  }

  async list(userId: string, limit = 50, offset = 0): Promise<any> {
    const [items, total] = await Promise.all([
      prisma.conversation.findMany({ where: { userId, archived: false }, orderBy: { updatedAt: 'desc' }, take: limit, skip: offset }),
      prisma.conversation.count({ where: { userId, archived: false } }),
    ]);
    return { items, total };
  }

  async update(id: string, data: { title?: string; metadata?: any }): Promise<any> {
    return prisma.conversation.update({ where: { id }, data });
  }

  async archive(id: string): Promise<any> {
    return prisma.conversation.update({ where: { id }, data: { archived: true } });
  }

  async delete(id: string): Promise<any> {
    return prisma.conversation.delete({ where: { id } });
  }

  async addMessage(conversationId: string, data: { role: string; content: string; parentId?: string; tokens?: number; metadata?: any; sources?: any }): Promise<any> {
    const msg = await prisma.conversationMessage.create({
      data: { conversationId, role: data.role as any, content: data.content, parentId: data.parentId || null, tokens: data.tokens || null, metadata: data.metadata || undefined, sources: data.sources || undefined },
    });
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { messageCount: { increment: 1 }, tokenCount: { increment: data.tokens || 0 } },
    });
    if (data.role === 'USER') await this.detectTopic(conversationId, data.content);
    return msg;
  }

  async getMessages(conversationId: string, limit = 100, offset = 0): Promise<any> {
    return prisma.conversationMessage.findMany({
      where: { conversationId }, orderBy: { createdAt: 'asc' }, take: limit, skip: offset,
    });
  }

  async getThread(messageId: string): Promise<any> {
    const root = await prisma.conversationMessage.findUnique({ where: { id: messageId } });
    if (!root) return null;
    const thread = await prisma.conversationMessage.findMany({
      where: { OR: [{ id: messageId }, { parentId: messageId }] },
      orderBy: { createdAt: 'asc' },
    });
    return { root, messages: thread };
  }

  async buildContext(conversationId: string, tokenBudget = MAX_TOKENS): Promise<any> {
    const msgs = await prisma.conversationMessage.findMany({
      where: { conversationId }, orderBy: { createdAt: 'asc' },
    });
    const originalCount = msgs.length;
    const mapped: LLMMessage[] = msgs.map(m => ({ role: m.role.toLowerCase() as any, content: m.content }));
    const estimated = mapped.reduce((s, m) => s + m.content.length / 4, 0);
    if (estimated <= tokenBudget) return { messages: mapped, truncated: false, originalCount };
    const systemIdx = mapped.findIndex(m => m.role === 'system');
    const system = systemIdx >= 0 ? mapped.splice(systemIdx, 1)[0] : null;
    while (mapped.length > 1 && mapped.reduce((s, m) => s + m.content.length / 4, 0) > tokenBudget * RATIO) {
      mapped.splice(0, 2);
    }
    if (system) mapped.unshift(system);
    return { messages: mapped, truncated: originalCount !== mapped.length, originalCount };
  }

  async compressContext(conversationId: string): Promise<any> {
    const msgs = await prisma.conversationMessage.findMany({
      where: { conversationId, role: { not: 'SYSTEM' } }, orderBy: { createdAt: 'asc' },
    });
    const totalTokens = msgs.reduce((s, m) => s + (m.tokens || m.content.length / 4), 0);
    if (totalTokens < SUMMARY_TRIGGER) return { compressed: false };
    const cutoff = Math.floor(msgs.length * 0.5);
    const toSummarize = msgs.slice(0, cutoff);
    const summary = toSummarize.map(m => `[${m.role.toLowerCase()}: ${m.content.slice(0, 200)}]`).join('\n');
    const summaryTokens = Math.ceil(summary.length / 4);
    await prisma.conversationMessage.create({
      data: { conversationId, role: 'SYSTEM', content: `[Summary of earlier conversation]\n${summary}`, tokens: summaryTokens },
    });
    await prisma.conversationMessage.deleteMany({ where: { id: { in: toSummarize.map(m => m.id) } } });
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { tokenCount: summaryTokens },
    });
    return { compressed: true, removedCount: cutoff };
  }

  private async detectTopic(conversationId: string, content: string): Promise<void> {
    const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv || conv.topic) return;
    if (conv.messageCount > 1) return;
    const words = content.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
    const common = ['this', 'that', 'with', 'from', 'what', 'tell', 'about', 'help', 'need', 'want', 'have', 'make', 'like', 'just', 'some', 'more', 'very', 'well'];
    const filtered = words.filter(w => !common.includes(w));
    if (filtered.length === 0) return;
    const freq = new Map<string, number>();
    for (const w of filtered) freq.set(w, (freq.get(w) || 0) + 1);
    const topic = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]).join(' ');
    await prisma.conversation.update({ where: { id: conversationId }, data: { topic } });
  }

  async getSessionState(userId: string): Promise<any> {
    const last = await prisma.conversation.findFirst({
      where: { userId, archived: false }, orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    return last;
  }

  async search(userId: string, query: string, limit = 20): Promise<any> {
    const conversations = await prisma.conversation.findMany({
      where: { userId, archived: false, OR: [{ title: { contains: query, mode: 'insensitive' } }, { topic: { contains: query, mode: 'insensitive' } }] },
      orderBy: { updatedAt: 'desc' }, take: limit,
    });
    const messages = await prisma.conversationMessage.findMany({
      where: { conversation: { userId, archived: false }, content: { contains: query, mode: 'insensitive' } },
      include: { conversation: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' }, take: limit,
    });
    return { conversations, messages };
  }

  async getStats(userId: string): Promise<any> {
    const [total, totalMessages, totalTokens] = await Promise.all([
      prisma.conversation.count({ where: { userId } }),
      prisma.conversationMessage.count({ where: { conversation: { userId } } }),
      prisma.conversation.aggregate({ where: { userId }, _sum: { tokenCount: true } }),
    ]);
    return { total, totalMessages, totalTokens: totalTokens._sum.tokenCount || 0 };
  }
}
