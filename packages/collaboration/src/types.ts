export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  memberCount: number;
  createdAt: string;
  organizationId: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface Channel {
  id: string;
  teamId: string;
  name: string;
  topic?: string;
  type: 'general' | 'project' | 'random' | 'private';
  lastActivity: string;
}

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  mentions: string[];
  attachments: string[];
  reactions: { emoji: string; userIds: string[] }[];
  createdAt: string;
  editedAt?: string;
}

export interface Thread {
  id: string;
  messageId: string;
  replies: Message[];
  participantCount: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  organizerId: string;
  participants: string[];
  recurring?: boolean;
  calendarId: string;
}

export interface Calendar {
  id: string;
  name: string;
  color: string;
  userId: string;
  events: Event[];
}
