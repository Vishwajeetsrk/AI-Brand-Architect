import { Injectable } from '@nestjs/common';
import { SecurityEngine, security } from '@nexora/security';
import { Severity, EventType, PolicyCategory } from '@nexora/security';

@Injectable()
export class SecurityService {
  private engine: SecurityEngine;

  constructor() {
    this.engine = security;
  }

  async getEvents(severity?: Severity, type?: EventType, startDate?: string, endDate?: string) {
    return this.engine.getEvents({ severity, type, startDate, endDate });
  }

  async getEvent(id: string) {
    return this.engine.getEvent(id);
  }

  async getPolicies(category?: PolicyCategory) {
    return this.engine.getPolicies(category);
  }

  async togglePolicy(id: string) {
    return this.engine.togglePolicy(id);
  }

  async getAuditLogs(query?: string) {
    return this.engine.searchAuditLogs(query);
  }

  async getCompliance() {
    return this.engine.getComplianceReports();
  }

  async getDashboard() {
    return this.engine.getDashboard();
  }

  async runThreatSimulation() {
    return this.engine.runThreatSimulation();
  }
}
