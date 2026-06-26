export type ContactStatus = 'lead' | 'active' | 'churned';
export type DealStage = 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type CampaignType = 'email' | 'social' | 'ads' | 'events';
export type CampaignStatus = 'draft' | 'running' | 'paused' | 'completed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  avatar: string;
  tags: string[];
  source: string;
  status: ContactStatus;
  score: number;
  lastContacted: string;
  assignedTo: string;
  notes: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  name: string;
  contactId: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  products: string[];
  notes: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  budget: number;
  spent: number;
  reach: number;
  conversions: number;
  roi: number;
  scheduledAt: string;
  endedAt?: string;
  segments: string[];
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  contactId: string;
  assignee: string;
  category: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: DealStage[];
  deals: Deal[];
  totalValue: number;
}
