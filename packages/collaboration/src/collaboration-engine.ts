import type { Team, Channel, Message, Thread, Event, Calendar } from './types';

class CollaborationEngine {
  private teams: Team[] = [];
  private channels: Channel[] = [];
  private messages: Message[] = [];
  private threads: Thread[] = [];
  private calendars: Calendar[] = [];
  private events: Event[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    const now = new Date().toISOString();
    const orgId = 'org-1';

    this.teams = [
      { id: 'team-1', name: 'Design Team', description: 'UI/UX and brand design', avatar: '', memberCount: 8, createdAt: now, organizationId: orgId },
      { id: 'team-2', name: 'Engineering', description: 'Platform development', avatar: '', memberCount: 12, createdAt: now, organizationId: orgId },
      { id: 'team-3', name: 'Marketing', description: 'Growth and campaigns', avatar: '', memberCount: 6, createdAt: now, organizationId: orgId },
    ];

    this.channels = [
      { id: 'ch-1', teamId: 'team-1', name: 'general', topic: 'Team announcements', type: 'general', lastActivity: now },
      { id: 'ch-2', teamId: 'team-1', name: 'design-reviews', topic: 'Design critique', type: 'project', lastActivity: now },
      { id: 'ch-3', teamId: 'team-1', name: 'brand-assets', topic: 'Asset library discussion', type: 'project', lastActivity: now },
      { id: 'ch-4', teamId: 'team-2', name: 'general', topic: 'Engineering chat', type: 'general', lastActivity: now },
      { id: 'ch-5', teamId: 'team-2', name: 'sprint-planning', topic: 'Sprint discussions', type: 'project', lastActivity: now },
      { id: 'ch-6', teamId: 'team-2', name: 'random', topic: 'Watercooler', type: 'random', lastActivity: now },
      { id: 'ch-7', teamId: 'team-3', name: 'general', topic: 'Marketing central', type: 'general', lastActivity: now },
      { id: 'ch-8', teamId: 'team-3', name: 'campaigns', topic: 'Campaign coordination', type: 'project', lastActivity: now },
    ];

    const msgs: Message[] = [];
    const users = [
      { id: 'user-1', name: 'Alice Chen' }, { id: 'user-2', name: 'Bob Martinez' },
      { id: 'user-3', name: 'Catherine Lee' }, { id: 'user-4', name: 'David Kim' },
      { id: 'user-5', name: 'Emma Wilson' },
    ];
    const contents = [
      'Hey team, just pushed the new mockups to the review board!',
      'Great work on the latest sprint everyone!',
      'Can we schedule a quick sync on the brand guidelines update?',
      'The new analytics dashboard is live on staging.',
      'Meeting notes from today are attached.',
      'Who can review the Q3 campaign assets?',
      'Deploying v2.1 to production in 10 minutes.',
      'Nice catch on that edge case! Fixed in latest PR.',
      'Updated the style guide with new color tokens.',
      'Let me know if anyone needs access to the design system repo.',
      'Heads up — deadline for the homepage redesign is Friday.',
      'The social media calendar is ready for review.',
      'Just ran a Lighthouse audit — scores are looking good.',
      'Added dark mode variants for all core components.',
      'New brand photography pack is available in the asset library.',
    ];
    const reactions = [':heart:', ':rocket:', ':eyes:', ':clap:', ':fire:'];
    let msgId = 1;
    for (let ci = 0; ci < this.channels.length; ci++) {
      const count = ci === 0 ? 10 : ci <= 3 ? 7 : 5;
      for (let i = 0; i < count; i++) {
        const mid = `msg-${msgId++}`;
        const user = users[(ci + i) % users.length];
        const date = new Date(Date.now() - (count - i) * 3600000).toISOString();
        const rCount = Math.floor(Math.random() * 3);
        const msgReactions = [];
        for (let r = 0; r < rCount; r++) {
          const ri = (i + r) % reactions.length;
          msgReactions.push({ emoji: reactions[ri], userIds: [users[(ri + 1) % users.length].id] });
        }
        msgs.push({
          id: mid,
          channelId: this.channels[ci].id,
          userId: user.id,
          content: contents[(ci + i) % contents.length],
          mentions: [],
          attachments: i % 4 === 0 ? ['file-1.png'] : [],
          reactions: msgReactions,
          createdAt: date,
          editedAt: i % 7 === 0 ? date : undefined,
        });
      }
    }
    this.messages = msgs;

    this.events = [
      { id: 'evt-1', title: 'Sprint Review', description: 'Review sprint deliverables', startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), organizerId: 'user-1', participants: ['user-2', 'user-3'], recurring: true, calendarId: 'cal-1' },
      { id: 'evt-2', title: 'Brand Workshop', description: 'Q3 brand strategy session', startTime: new Date(Date.now() + 172800000).toISOString(), endTime: new Date(Date.now() + 172800000 + 7200000).toISOString(), organizerId: 'user-3', participants: ['user-1', 'user-4', 'user-5'], recurring: false, calendarId: 'cal-1' },
      { id: 'evt-3', title: 'Design Critique', description: 'Monthly design review', startTime: new Date(Date.now() + 259200000).toISOString(), endTime: new Date(Date.now() + 259200000 + 3600000).toISOString(), organizerId: 'user-2', participants: ['user-1', 'user-4'], recurring: true, calendarId: 'cal-2' },
      { id: 'evt-4', title: 'Marketing Sync', description: 'Weekly campaign check-in', startTime: new Date(Date.now() + 43200000).toISOString(), endTime: new Date(Date.now() + 43200000 + 1800000).toISOString(), organizerId: 'user-5', participants: ['user-2', 'user-3'], recurring: true, calendarId: 'cal-3' },
      { id: 'evt-5', title: 'All Hands', description: 'Company-wide quarterly update', startTime: new Date(Date.now() + 345600000).toISOString(), endTime: new Date(Date.now() + 345600000 + 5400000).toISOString(), organizerId: 'user-1', participants: ['user-2', 'user-3', 'user-4', 'user-5'], recurring: false, calendarId: 'cal-1' },
    ];

    this.calendars = [
      { id: 'cal-1', name: 'Team Events', color: '#8b5cf6', userId: 'user-1', events: this.events.filter(e => e.calendarId === 'cal-1') },
      { id: 'cal-2', name: 'Design Reviews', color: '#22d3ee', userId: 'user-2', events: this.events.filter(e => e.calendarId === 'cal-2') },
      { id: 'cal-3', name: 'Marketing', color: '#10b981', userId: 'user-3', events: this.events.filter(e => e.calendarId === 'cal-3') },
    ];
  }

  getTeams() { return this.teams; }
  getTeam(id: string) { return this.teams.find(t => t.id === id) || null; }
  createTeam(data: Partial<Team> & { name: string; organizationId: string }) {
    const team: Team = { id: `team-${Date.now()}`, name: data.name, description: data.description, avatar: data.avatar || '', memberCount: data.memberCount || 1, createdAt: new Date().toISOString(), organizationId: data.organizationId };
    this.teams.push(team);
    return team;
  }

  getChannels(teamId: string) { return this.channels.filter(c => c.teamId === teamId); }
  createChannel(data: Partial<Channel> & { name: string; teamId: string }) {
    const channel: Channel = { id: `ch-${Date.now()}`, teamId: data.teamId, name: data.name, topic: data.topic, type: data.type || 'general', lastActivity: new Date().toISOString() };
    this.channels.push(channel);
    return channel;
  }

  getMessages(channelId: string) { return this.messages.filter(m => m.channelId === channelId); }
  createMessage(data: Partial<Message> & { content: string; channelId: string; userId: string }) {
    const message: Message = { id: `msg-${Date.now()}`, channelId: data.channelId, userId: data.userId, content: data.content, mentions: data.mentions || [], attachments: data.attachments || [], reactions: data.reactions || [], createdAt: new Date().toISOString() };
    this.messages.push(message);
    return message;
  }

  getCalendars() { return this.calendars; }
  getEvents(calendarId?: string) { return calendarId ? this.events.filter(e => e.calendarId === calendarId) : this.events; }
  createEvent(data: Partial<Event> & { title: string; startTime: string; endTime: string; calendarId: string; organizerId: string }) {
    const event: Event = { id: `evt-${Date.now()}`, title: data.title, description: data.description, startTime: data.startTime, endTime: data.endTime, organizerId: data.organizerId, participants: data.participants || [], recurring: data.recurring || false, calendarId: data.calendarId };
    this.events.push(event);
    return event;
  }
}

export const collaboration = new CollaborationEngine();
export { CollaborationEngine };
