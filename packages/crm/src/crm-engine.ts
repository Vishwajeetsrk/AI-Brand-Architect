import { Contact, Deal, Campaign, Ticket, Pipeline, ContactStatus, DealStage, TicketPriority, TicketStatus } from './types';

export class CrmEngine {
  private contacts: Map<string, Contact> = new Map();
  private deals: Map<string, Deal> = new Map();
  private campaigns: Map<string, Campaign> = new Map();
  private tickets: Map<string, Ticket> = new Map();
  private pipelines: Map<string, Pipeline> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    const contacts: Contact[] = [
      { id: 'c1', name: 'Sarah Chen', email: 'sarah@acme.com', phone: '+1-555-0101', company: 'Acme Corp', position: 'CEO', avatar: '', tags: ['vip', 'tech'], source: 'referral', status: 'active', score: 95, lastContacted: '2026-06-20', assignedTo: 'Alex', notes: 'Key decision maker', createdAt: '2026-01-15' },
      { id: 'c2', name: 'Marcus Johnson', email: 'marcus@globex.io', phone: '+1-555-0102', company: 'Globex Inc', position: 'CTO', avatar: '', tags: ['tech', 'enterprise'], source: 'website', status: 'active', score: 88, lastContacted: '2026-06-18', assignedTo: 'Jordan', notes: 'Interested in AI solutions', createdAt: '2026-02-03' },
      { id: 'c3', name: 'Emily Rodriguez', email: 'emily@novateck.com', phone: '+1-555-0103', company: 'NovaTeck', position: 'Marketing Director', avatar: '', tags: ['marketing'], source: 'linkedin', status: 'lead', score: 62, lastContacted: '2026-06-10', assignedTo: 'Alex', notes: 'Budget approval pending', createdAt: '2026-03-22' },
      { id: 'c4', name: 'James Kim', email: 'james@quantum.dev', phone: '+1-555-0104', company: 'Quantum Dev', position: 'Founder', avatar: '', tags: ['startup', 'tech'], source: 'referral', status: 'active', score: 91, lastContacted: '2026-06-22', assignedTo: 'Morgan', notes: 'Rapid growth phase', createdAt: '2026-01-28' },
      { id: 'c5', name: 'Priya Patel', email: 'priya@stellar.ai', phone: '+1-555-0105', company: 'Stellar AI', position: 'VP Engineering', avatar: '', tags: ['ai', 'enterprise'], source: 'event', status: 'active', score: 85, lastContacted: '2026-06-15', assignedTo: 'Jordan', notes: 'Pilot program engaged', createdAt: '2026-02-14' },
      { id: 'c6', name: 'Tom Williams', email: 'tom@dataforge.com', phone: '+1-555-0106', company: 'DataForge', position: 'Analytics Lead', avatar: '', tags: ['data'], source: 'website', status: 'lead', score: 45, lastContacted: '2026-05-28', assignedTo: 'Alex', notes: 'Needs demo', createdAt: '2026-04-05' },
      { id: 'c7', name: 'Lisa Thompson', email: 'lisa@bluemoon.co', phone: '+1-555-0107', company: 'BlueMoon Co', position: 'Brand Manager', avatar: '', tags: ['brand', 'design'], source: 'ads', status: 'churned', score: 30, lastContacted: '2026-04-01', assignedTo: 'Morgan', notes: 'Budget cuts', createdAt: '2025-11-10' },
      { id: 'c8', name: 'David Garcia', email: 'david@cyberdyne.systems', phone: '+1-555-0108', company: 'Cyberdyne Systems', position: 'Head of Product', avatar: '', tags: ['product', 'enterprise'], source: 'referral', status: 'active', score: 78, lastContacted: '2026-06-21', assignedTo: 'Jordan', notes: 'Expanding team', createdAt: '2026-03-01' },
      { id: 'c9', name: 'Aisha Mohammed', email: 'aisha@greentech.eco', phone: '+1-555-0109', company: 'GreenTech Eco', position: 'Sustainability Lead', avatar: '', tags: ['eco', 'startup'], source: 'linkedin', status: 'lead', score: 55, lastContacted: '2026-06-08', assignedTo: 'Alex', notes: 'Q3 planning', createdAt: '2026-04-18' },
      { id: 'c10', name: 'Ryan O\'Brien', email: 'ryan@omega.dev', phone: '+1-555-0110', company: 'Omega Dev', position: 'CEO', avatar: '', tags: ['vip', 'startup'], source: 'event', status: 'active', score: 93, lastContacted: '2026-06-23', assignedTo: 'Morgan', notes: 'Ready to sign', createdAt: '2026-01-05' },
      { id: 'c11', name: 'Nina Kowalski', email: 'nina@polymath.io', phone: '+1-555-0111', company: 'Polymath Inc', position: 'Creative Director', avatar: '', tags: ['design', 'creative'], source: 'ads', status: 'lead', score: 58, lastContacted: '2026-06-05', assignedTo: 'Jordan', notes: 'Design tool interest', createdAt: '2026-05-12' },
      { id: 'c12', name: 'Carlos Mendez', email: 'carlos@nexus.ventures', phone: '+1-555-0112', company: 'Nexus Ventures', position: 'Partner', avatar: '', tags: ['investor', 'vip'], source: 'referral', status: 'active', score: 97, lastContacted: '2026-06-24', assignedTo: 'Alex', notes: 'Portfolio company intro', createdAt: '2025-12-01' },
    ];
    contacts.forEach(c => this.contacts.set(c.id, c));

    const deals: Deal[] = [
      { id: 'd1', name: 'Acme Corp Enterprise Suite', contactId: 'c1', value: 120000, stage: 'negotiation', probability: 75, expectedCloseDate: '2026-07-15', products: ['Brand Suite', 'Analytics Pro'], notes: 'Final review', createdAt: '2026-03-10' },
      { id: 'd2', name: 'Globex AI Integration', contactId: 'c2', value: 85000, stage: 'proposal', probability: 55, expectedCloseDate: '2026-08-01', products: ['AI Engine', 'API Access'], notes: 'Technical eval', createdAt: '2026-04-05' },
      { id: 'd3', name: 'Quantum Dev Startup Pack', contactId: 'c4', value: 35000, stage: 'negotiation', probability: 85, expectedCloseDate: '2026-07-01', products: ['Startup Bundle', 'Support'], notes: 'Almost closed', createdAt: '2026-05-01' },
      { id: 'd4', name: 'Stellar AI Partnership', contactId: 'c5', value: 200000, stage: 'discovery', probability: 30, expectedCloseDate: '2026-09-15', products: ['Enterprise License', 'Custom Model'], notes: 'Initial talks', createdAt: '2026-06-01' },
      { id: 'd5', name: 'Cyberdyne Brand Refresh', contactId: 'c8', value: 65000, stage: 'proposal', probability: 60, expectedCloseDate: '2026-08-15', products: ['Brand Studio', 'Design System'], notes: 'Proposal sent', createdAt: '2026-05-15' },
      { id: 'd6', name: 'Omega Dev Growth Package', contactId: 'c10', value: 95000, stage: 'closed_won', probability: 100, expectedCloseDate: '2026-06-28', products: ['Growth Suite', 'Training'], notes: 'Contract signed', createdAt: '2026-04-20' },
      { id: 'd7', name: 'NovaTeck Marketing Stack', contactId: 'c3', value: 45000, stage: 'discovery', probability: 25, expectedCloseDate: '2026-10-01', products: ['Marketing Studio', 'Analytics'], notes: 'Early stage', createdAt: '2026-06-10' },
      { id: 'd8', name: 'Nexus Ventures Strategic', contactId: 'c12', value: 300000, stage: 'closed_won', probability: 100, expectedCloseDate: '2026-06-01', products: ['Enterprise Suite', 'Dedicated Support'], notes: 'Multi-year deal', createdAt: '2026-02-15' },
    ];
    deals.forEach(d => this.deals.set(d.id, d));

    const campaigns: Campaign[] = [
      { id: 'cp1', name: 'Q2 Enterprise Outreach', type: 'email', status: 'completed', budget: 25000, spent: 22300, reach: 45000, conversions: 1200, roi: 320, scheduledAt: '2026-04-01', endedAt: '2026-06-15', segments: ['enterprise', 'tech'] },
      { id: 'cp2', name: 'Summer Brand Awareness', type: 'social', status: 'running', budget: 15000, spent: 7200, reach: 82000, conversions: 3400, roi: 180, scheduledAt: '2026-06-01', segments: ['brand', 'design'] },
      { id: 'cp3', name: 'Product Hunt Launch', type: 'ads', status: 'draft', budget: 8000, spent: 0, reach: 0, conversions: 0, roi: 0, scheduledAt: '2026-07-15', segments: ['startup', 'tech'] },
      { id: 'cp4', name: 'AI Summit 2026', type: 'events', status: 'paused', budget: 35000, spent: 18500, reach: 15000, conversions: 450, roi: 95, scheduledAt: '2026-05-10', endedAt: '2026-05-12', segments: ['ai', 'enterprise'] },
    ];
    campaigns.forEach(c => this.campaigns.set(c.id, c));

    const tickets: Ticket[] = [
      { id: 't1', subject: 'API rate limiting issue', description: 'Receiving 429 errors on batch requests', priority: 'high', status: 'in_progress', contactId: 'c2', assignee: 'Engineering', category: 'api', createdAt: '2026-06-22' },
      { id: 't2', subject: 'Billing discrepancy', description: 'Invoice #INV-0425 shows wrong amount', priority: 'urgent', status: 'open', contactId: 'c1', assignee: 'Billing', category: 'billing', createdAt: '2026-06-24' },
      { id: 't3', subject: 'Feature request: Dark mode', description: 'Would like dark mode for dashboard', priority: 'low', status: 'resolved', contactId: 'c4', assignee: 'Product', category: 'feature', createdAt: '2026-06-10', resolvedAt: '2026-06-20' },
      { id: 't4', subject: 'Integration with Slack failing', description: 'OAuth token expired, re-auth loop', priority: 'high', status: 'open', contactId: 'c8', assignee: 'Engineering', category: 'integration', createdAt: '2026-06-23' },
      { id: 't5', subject: 'Onboarding help needed', description: 'Team needs walkthrough of brand studio', priority: 'medium', status: 'in_progress', contactId: 'c5', assignee: 'Customer Success', category: 'onboarding', createdAt: '2026-06-19' },
      { id: 't6', subject: 'Export not working for PDF', description: 'PDF export timeout for large projects', priority: 'medium', status: 'resolved', contactId: 'c10', assignee: 'Engineering', category: 'export', createdAt: '2026-06-15', resolvedAt: '2026-06-21' },
      { id: 't7', subject: 'Account access for new hire', description: 'Add user to enterprise account', priority: 'low', status: 'closed', contactId: 'c12', assignee: 'Support', category: 'account', createdAt: '2026-06-08', resolvedAt: '2026-06-09' },
      { id: 't8', subject: 'Data export request GDPR', description: 'Customer requesting all personal data', priority: 'urgent', status: 'in_progress', contactId: 'c3', assignee: 'Legal', category: 'compliance', createdAt: '2026-06-24' },
      { id: 't9', subject: 'Template rendering bug', description: 'Images not loading in email templates', priority: 'high', status: 'open', contactId: 'c11', assignee: 'Engineering', category: 'bug', createdAt: '2026-06-25' },
      { id: 't10', subject: 'Performance slow on dashboard', description: 'Dashboard takes >10s to load', priority: 'medium', status: 'resolved', contactId: 'c7', assignee: 'Engineering', category: 'performance', createdAt: '2026-06-18', resolvedAt: '2026-06-22' },
    ];
    tickets.forEach(t => this.tickets.set(t.id, t));

    this.pipelines.set('p1', {
      id: 'p1', name: 'Enterprise Sales Pipeline',
      stages: ['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
      deals: deals,
      totalValue: deals.reduce((s, d) => s + d.value, 0),
    });
    this.pipelines.set('p2', {
      id: 'p2', name: 'SMB Pipeline',
      stages: ['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
      deals: deals.filter(d => d.value < 100000),
      totalValue: deals.filter(d => d.value < 100000).reduce((s, d) => s + d.value, 0),
    });
  }

  getContacts(): Contact[] { return Array.from(this.contacts.values()); }
  getContact(id: string): Contact | undefined { return this.contacts.get(id); }
  addContact(contact: Omit<Contact, 'id' | 'createdAt'>): Contact {
    const c: Contact = { ...contact, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    this.contacts.set(c.id, c);
    return c;
  }
  updateContact(id: string, data: Partial<Contact>): Contact | undefined {
    const c = this.contacts.get(id);
    if (!c) return undefined;
    Object.assign(c, data);
    return c;
  }
  deleteContact(id: string): boolean { return this.contacts.delete(id); }

  getDeals(): Deal[] { return Array.from(this.deals.values()); }
  getDeal(id: string): Deal | undefined { return this.deals.get(id); }
  addDeal(deal: Omit<Deal, 'id' | 'createdAt'>): Deal {
    const d: Deal = { ...deal, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    this.deals.set(d.id, d);
    return d;
  }
  updateDealStage(id: string, stage: DealStage): Deal | undefined {
    const d = this.deals.get(id);
    if (!d) return undefined;
    d.stage = stage;
    if (stage === 'closed_won') d.probability = 100;
    if (stage === 'closed_lost') d.probability = 0;
    return d;
  }

  getCampaigns(): Campaign[] { return Array.from(this.campaigns.values()); }
  addCampaign(campaign: Omit<Campaign, 'id'>): Campaign {
    const c: Campaign = { ...campaign, id: crypto.randomUUID() };
    this.campaigns.set(c.id, c);
    return c;
  }

  getTickets(): Ticket[] { return Array.from(this.tickets.values()); }
  addTicket(ticket: Omit<Ticket, 'id' | 'createdAt'>): Ticket {
    const t: Ticket = { ...ticket, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    this.tickets.set(t.id, t);
    return t;
  }
  updateTicketStatus(id: string, status: TicketStatus): Ticket | undefined {
    const t = this.tickets.get(id);
    if (!t) return undefined;
    t.status = status;
    if (status === 'resolved' || status === 'closed') t.resolvedAt = new Date().toISOString();
    return t;
  }

  getPipelines(): Pipeline[] { return Array.from(this.pipelines.values()); }

  getDashboard() {
    const contacts = this.getContacts();
    const deals = this.getDeals();
    const campaigns = this.getCampaigns();
    const tickets = this.getTickets();
    const activeDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
    const wonDeals = deals.filter(d => d.stage === 'closed_won');
    return {
      totalContacts: contacts.length,
      activeContacts: contacts.filter(c => c.status === 'active').length,
      activeDeals: activeDeals.length,
      pipelineValue: activeDeals.reduce((s, d) => s + d.value, 0),
      totalRevenue: wonDeals.reduce((s, d) => s + d.value, 0),
      conversionRate: deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0,
      activeCampaigns: campaigns.filter(c => c.status === 'running').length,
      openTickets: tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length,
      urgentTickets: tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved' && t.status !== 'closed').length,
      topContacts: contacts.sort((a, b) => b.score - a.score).slice(0, 5),
    };
  }

  scoreContact(contactId: string): number {
    const c = this.contacts.get(contactId);
    if (!c) return 0;
    const statusScore = c.status === 'active' ? 40 : c.status === 'lead' ? 20 : 5;
    const tagBonus = c.tags.includes('vip') ? 25 : c.tags.includes('enterprise') ? 15 : 0;
    const recency = Math.max(0, 30 - Math.floor((Date.now() - new Date(c.lastContacted).getTime()) / 86400000));
    return Math.min(100, statusScore + tagBonus + recency + Math.round(Math.random() * 10));
  }
}

export const crm = new CrmEngine();
