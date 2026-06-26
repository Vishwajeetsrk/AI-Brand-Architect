import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@nexora/database';
import { CrmEngine, crm, DealStage, TicketStatus } from '@nexora/crm';

@Injectable()
export class CrmService {
  private engine: CrmEngine;

  constructor() {
    this.engine = crm;
  }

  async getContacts() { return this.engine.getContacts(); }

  async getContact(id: string) {
    const c = this.engine.getContact(id);
    if (!c) throw new NotFoundException('Contact not found');
    return c;
  }

  async createContact(data: any) { return this.engine.addContact(data); }

  async updateContact(id: string, data: any) {
    const c = this.engine.updateContact(id, data);
    if (!c) throw new NotFoundException('Contact not found');
    return c;
  }

  async deleteContact(id: string) {
    if (!this.engine.deleteContact(id)) throw new NotFoundException('Contact not found');
    return { deleted: true };
  }

  async getDeals() { return this.engine.getDeals(); }

  async createDeal(data: any) { return this.engine.addDeal(data); }

  async updateDealStage(id: string, stage: DealStage) {
    const d = this.engine.updateDealStage(id, stage);
    if (!d) throw new NotFoundException('Deal not found');
    return d;
  }

  async getPipelines() { return this.engine.getPipelines(); }

  async getCampaigns() { return this.engine.getCampaigns(); }

  async createCampaign(data: any) { return this.engine.addCampaign(data); }

  async getTickets() { return this.engine.getTickets(); }

  async createTicket(data: any) { return this.engine.addTicket(data); }

  async updateTicketStatus(id: string, status: TicketStatus) {
    const t = this.engine.updateTicketStatus(id, status);
    if (!t) throw new NotFoundException('Ticket not found');
    return t;
  }

  async getDashboard() { return this.engine.getDashboard(); }
}
