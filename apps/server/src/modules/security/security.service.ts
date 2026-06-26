import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, SecurityEvent, SecurityPolicy, AuditLog, ComplianceReport } from '@nexora/database';

@Injectable()
export class SecurityService {
  async getEvents(severity?: string, type?: string, startDate?: string, endDate?: string): Promise<SecurityEvent[]> {
    const where: any = {};
    if (severity) where.severity = severity;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    return prisma.securityEvent.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async getEvent(id: string): Promise<SecurityEvent | null> {
    const event = await prisma.securityEvent.findUnique({ where: { id } });
    if (!event) return null;
    return event;
  }

  async getPolicies(category?: string): Promise<SecurityPolicy[]> {
    const where = category ? { category } : {};
    return prisma.securityPolicy.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async togglePolicy(id: string): Promise<SecurityPolicy> {
    const policy = await prisma.securityPolicy.findUnique({ where: { id } });
    if (!policy) throw new NotFoundException('Policy not found');
    return prisma.securityPolicy.update({
      where: { id },
      data: { enabled: !policy.enabled },
    });
  }

  async getAuditLogs(query?: string): Promise<AuditLog[]> {
    if (query) {
      return prisma.auditLog.findMany({
        where: {
          OR: [
            { action: { contains: query, mode: 'insensitive' } },
            { entity: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    return prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getCompliance(): Promise<ComplianceReport[]> {
    return prisma.complianceReport.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getDashboard(): Promise<any> {
    const [totalEvents, criticalEvents, highEvents, totalPolicies, enabledPolicies, recentLogs] = await Promise.all([
      prisma.securityEvent.count(),
      prisma.securityEvent.count({ where: { severity: 'CRITICAL' } }),
      prisma.securityEvent.count({ where: { severity: 'HIGH' } }),
      prisma.securityPolicy.count(),
      prisma.securityPolicy.count({ where: { enabled: true } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);
    return { totalEvents, criticalEvents, highEvents, totalPolicies, enabledPolicies, recentLogs };
  }

  async runThreatSimulation(): Promise<any> {
    return { status: 'completed', message: 'Threat simulation completed successfully', timestamp: new Date().toISOString() };
  }
}
