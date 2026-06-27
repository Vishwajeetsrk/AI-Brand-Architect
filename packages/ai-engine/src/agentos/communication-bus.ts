import { AgentMessage } from './agentos-types';

type MessageHandler = (message: AgentMessage) => Promise<void> | void;

export class CommunicationBus {
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private history: AgentMessage[] = [];
  private maxHistory: number;

  constructor(maxHistory: number = 1000) {
    this.maxHistory = maxHistory;
  }

  subscribe(topic: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(topic)) this.handlers.set(topic, new Set());
    this.handlers.get(topic)!.add(handler);
    return () => this.handlers.get(topic)?.delete(handler);
  }

  subscribeToAgent(agentId: string, handler: MessageHandler): () => void {
    return this.subscribe(`agent:${agentId}`, handler);
  }

  async publish(message: AgentMessage): Promise<void> {
    message.timestamp = Date.now();
    this.history.push(message);
    if (this.history.length > this.maxHistory) this.history.shift();

    const topicHandlers = this.handlers.get(message.topic);
    if (topicHandlers) {
      const promises: Promise<void>[] = [];
      for (const handler of topicHandlers) {
        promises.push(Promise.resolve(handler(message)));
      }
      await Promise.allSettled(promises);
    }

    if (message.toAgentId) {
      const directHandlers = this.handlers.get(`agent:${message.toAgentId}`);
      if (directHandlers) {
        const promises: Promise<void>[] = [];
        for (const handler of directHandlers) {
          promises.push(Promise.resolve(handler(message)));
        }
        await Promise.allSettled(promises);
      }
    }

    if (message.type === 'broadcast') {
      const broadcastHandlers = this.handlers.get('broadcast');
      if (broadcastHandlers) {
        const promises: Promise<void>[] = [];
        for (const handler of broadcastHandlers) {
          promises.push(Promise.resolve(handler(message)));
        }
        await Promise.allSettled(promises);
      }
    }
  }

  async request(agentId: string, topic: string, payload: unknown, priority: number = 50): Promise<AgentMessage> {
    const requestId = crypto.randomUUID();
    const request: AgentMessage = {
      id: requestId,
      fromAgentId: 'system',
      toAgentId: agentId,
      topic,
      type: 'request',
      payload,
      priority,
      timestamp: Date.now(),
    };

    return new Promise((resolve) => {
      const unsubscribe = this.subscribeToAgent(agentId, async (response) => {
        if (response.replyTo === requestId && response.type === 'response') {
          unsubscribe();
          resolve(response);
        }
      });

      this.publish(request);

      setTimeout(() => {
        unsubscribe();
        resolve({
          id: crypto.randomUUID(),
          fromAgentId: agentId,
          toAgentId: 'system',
          topic: 'timeout',
          type: 'error',
          payload: { error: 'Request timed out' },
          replyTo: requestId,
          priority: 0,
          timestamp: Date.now(),
        });
      }, 30000);
    });
  }

  async delegate(fromAgentId: string, toAgentId: string, taskDescription: string, context?: unknown): Promise<AgentMessage> {
    const delegationId = crypto.randomUUID();
    const message: AgentMessage = {
      id: delegationId,
      fromAgentId,
      toAgentId,
      topic: `delegation:${toAgentId}`,
      type: 'delegation',
      payload: { task: taskDescription, context },
      priority: 75,
      timestamp: Date.now(),
    };

    return new Promise((resolve) => {
      const unsubscribe = this.subscribeToAgent(fromAgentId, async (response) => {
        if (response.replyTo === delegationId) {
          unsubscribe();
          resolve(response);
        }
      });
      this.publish(message);
    });
  }

  broadcast(fromAgentId: string, topic: string, payload: unknown): void {
    this.publish({
      id: crypto.randomUUID(),
      fromAgentId,
      topic,
      type: 'broadcast',
      payload,
      priority: 25,
      timestamp: Date.now(),
    });
  }

  getHistory(topic?: string, limit: number = 50): AgentMessage[] {
    let messages = this.history;
    if (topic) messages = messages.filter(m => m.topic === topic);
    return messages.slice(-limit);
  }

  getHistoryForAgent(agentId: string, limit: number = 50): AgentMessage[] {
    return this.history
      .filter(m => m.fromAgentId === agentId || m.toAgentId === agentId)
      .slice(-limit);
  }

  clearHistory(): void {
    this.history = [];
  }
}
