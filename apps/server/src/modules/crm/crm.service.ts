import { Injectable, NotFoundException } from '@nestjs/common';
import { CrmEngine, crm, DealStage, TicketStatus } from '@nexora/crm';

@Injectable()
export class CrmService {
  private engine: CrmEngine;

  constructor() {
    this.engine = crm;
  }

  getContacts() { return this.engine.getContacts(); }

  getContact(id: string) {
    const c = this.engine.getContact(id);
    if (!c) throw new NotFoundException('Contact not found');
    return c;
  }

  createContact(data: any) { return this.engine.addContact(data); }

  updateContact(id: string, data: any) {
    const c = this.engine.updateContact(id, data);
    if (!c) throw new NotFoundException('Contact not found');
    return c;
  }

  deleteContact(id: string) {
    if (!this.engine.deleteContact(id)) throw new NotFoundException('Contact not found');
    return { deleted: true };
  }

  getDeals() { return this.engine.getDeals(); }

  createDeal(data: any) { return this.engine.addDeal(data); }

  updateDealStage(id: string, stage: DealStage) {
    const d = this.engine.updateDealStage(id, stage);
    if (!d) throw new NotFoundException('Deal not found');
    return d;
  }

  getPipelines() { return this.engine.getPipelines(); }

  getCampaigns() { return this.engine.getCampaigns(); }

  createCampaign(data: any) { return this.engine.addCampaign(data); }

  getTickets() { return this.engine.getTickets(); }

  createTicket(data: any) { return this.engine.addTicket(data); }

  updateTicketStatus(id: string, status: TicketStatus) {
    const t = this.engine.updateTicketStatus(id, status);
    if (!t) throw new NotFoundException('Ticket not found');
    return t;
  }

  getDashboard() { return this.engine.getDashboard(); }
}
