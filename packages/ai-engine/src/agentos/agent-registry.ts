import { AgentProfile, AgentStatus } from './agentos-types';

export class AgentRegistry {
  private agents: Map<string, AgentProfile> = new Map();

  register(profile: AgentProfile): void {
    this.agents.set(profile.id, { ...profile, status: 'registered', updatedAt: Date.now() });
  }

  get(id: string): AgentProfile | undefined {
    return this.agents.get(id);
  }

  getAll(): AgentProfile[] {
    return Array.from(this.agents.values());
  }

  findByRole(role: string): AgentProfile[] {
    return Array.from(this.agents.values()).filter(a => a.role === role);
  }

  findByCapability(capability: string): AgentProfile[] {
    return Array.from(this.agents.values()).filter(a => a.capabilities.includes(capability));
  }

  findByStatus(status: AgentStatus): AgentProfile[] {
    return Array.from(this.agents.values()).filter(a => a.status === status);
  }

  updateStatus(id: string, status: AgentStatus): void {
    const agent = this.agents.get(id);
    if (agent) {
      agent.status = status;
      agent.updatedAt = Date.now();
    }
  }

  recordHeartbeat(id: string): void {
    const agent = this.agents.get(id);
    if (agent) agent.lastHeartbeat = Date.now();
  }

  remove(id: string): boolean {
    return this.agents.delete(id);
  }

  getHealthyAgentIds(): string[] {
    const now = Date.now();
    const timeout = 60000;
    return Array.from(this.agents.values())
      .filter(a => a.status === 'idle' || a.status === 'executing')
      .filter(a => !a.lastHeartbeat || (now - a.lastHeartbeat) < timeout)
      .map(a => a.id);
  }

  getStats(): { total: number; byRole: Record<string, number>; byStatus: Record<string, number> } {
    const byRole: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    for (const agent of this.agents.values()) {
      byRole[agent.role] = (byRole[agent.role] || 0) + 1;
      byStatus[agent.status] = (byStatus[agent.status] || 0) + 1;
    }
    return { total: this.agents.size, byRole, byStatus };
  }
}
