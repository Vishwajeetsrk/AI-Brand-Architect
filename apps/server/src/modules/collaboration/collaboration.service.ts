import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@nexora/database';

@Injectable()
export class CollaborationService {
  async getTeams() {
    return prisma.team.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getTeam(id: string) {
    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async createTeam(data: { name: string; description?: string; organizationId: string }) {
    return prisma.team.create({
      data: {
        name: data.name,
        description: data.description || null,
        organizationId: data.organizationId,
      },
    });
  }

  async getChannels(teamId: string) {
    return prisma.channel.findMany({ where: { teamId }, orderBy: { createdAt: 'desc' } });
  }

  async createChannel(data: { name: string; teamId: string; topic?: string; type?: string }) {
    return prisma.channel.create({
      data: {
        name: data.name,
        topic: data.topic || null,
        type: data.type || null,
        teamId: data.teamId,
      },
    });
  }

  async getMessages(channelId: string) {
    return prisma.message.findMany({ where: { channelId }, orderBy: { createdAt: 'asc' } });
  }

  async createMessage(data: { content: string; channelId: string; userId: string; mentions?: string[]; attachments?: string[] }) {
    return prisma.message.create({
      data: {
        content: data.content,
        channelId: data.channelId,
        userId: data.userId,
        mentions: data.mentions || [],
        attachments: data.attachments || [],
      },
    });
  }

  async getCalendar() {
    const calendars = await prisma.calendar.findMany({ orderBy: { createdAt: 'desc' } });
    return calendars;
  }

  async getEvents(calendarId?: string) {
    const where = calendarId ? { calendarId } : {};
    return prisma.calendarEvent.findMany({ where, orderBy: { startTime: 'asc' } });
  }

  async createEvent(data: { title: string; description?: string; startTime: string; endTime: string; calendarId: string; organizerId: string; participants?: string[]; recurring?: boolean }) {
    return prisma.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description || null,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        calendarId: data.calendarId,
        organizerId: data.organizerId,
        participants: data.participants || [],
        recurring: data.recurring || false,
      },
    });
  }
}
