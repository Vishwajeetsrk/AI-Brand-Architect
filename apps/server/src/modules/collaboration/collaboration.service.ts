import { Injectable, NotFoundException } from '@nestjs/common';
import { collaboration, CollaborationEngine } from '@nexora/collaboration';
import type { Team, Channel, Message, Event } from '@nexora/collaboration';

@Injectable()
export class CollaborationService {
  private engine: CollaborationEngine;

  constructor() {
    this.engine = collaboration;
  }

  getTeams() { return this.engine.getTeams(); }

  getTeam(id: string) {
    const team = this.engine.getTeam(id);
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  createTeam(data: Partial<Team> & { name: string; organizationId: string }) {
    return this.engine.createTeam(data);
  }

  getChannels(teamId: string) { return this.engine.getChannels(teamId); }

  createChannel(data: Partial<Channel> & { name: string; teamId: string }) {
    return this.engine.createChannel(data);
  }

  getMessages(channelId: string) { return this.engine.getMessages(channelId); }

  createMessage(data: Partial<Message> & { content: string; channelId: string; userId: string }) {
    return this.engine.createMessage(data);
  }

  getCalendar() { return this.engine.getCalendars(); }

  getEvents(calendarId?: string) { return this.engine.getEvents(calendarId); }

  createEvent(data: Partial<Event> & { title: string; startTime: string; endTime: string; calendarId: string; organizerId: string }) {
    return this.engine.createEvent(data);
  }
}
