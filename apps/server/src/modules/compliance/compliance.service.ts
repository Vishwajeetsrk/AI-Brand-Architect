import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReportDto, AuditLogFiltersDto } from './dto/compliance.dto';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  private reports: any[] = [
    { id: '1', name: 'GDPR Compliance Q1', type: 'gdpr', dateRange: { start: '2026-01-01', end: '2026-03-31' }, status: 'completed', createdAt: '2026-04-01T10:00:00Z' },
    { id: '2', name: 'SOC2 Audit 2025', type: 'soc2', dateRange: { start: '2025-01-01', end: '2025-12-31' }, status: 'completed', createdAt: '2026-01-15T08:30:00Z' },
    { id: '3', name: 'HIPAA Internal Review', type: 'hipaa', dateRange: { start: '2026-02-01', end: '2026-04-30' }, status: 'in_progress', createdAt: '2026-05-01T14:00:00Z' },
  ];

  private auditLogs: any[] = [
    { id: '1', userId: 'user-1', action: 'LOGIN', entityType: 'user', entityId: 'user-1', timestamp: '2026-06-29T08:00:00Z', details: { ip: '192.168.1.1' } },
    { id: '2', userId: 'user-2', action: 'UPDATE_FLAG', entityType: 'feature_flag', entityId: 'flag-1', timestamp: '2026-06-29T08:15:00Z', details: { changes: ['enabled'] } },
    { id: '3', userId: 'user-1', action: 'DELETE_PROJECT', entityType: 'project', entityId: 'proj-3', timestamp: '2026-06-29T09:00:00Z', details: { projectName: 'Test Project' } },
    { id: '4', userId: 'user-3', action: 'EXPORT_DATA', entityType: 'report', entityId: 'report-2', timestamp: '2026-06-28T16:45:00Z', details: { format: 'pdf' } },
    { id: '5', userId: 'user-1', action: 'CREATE_USER', entityType: 'user', entityId: 'user-4', timestamp: '2026-06-28T11:30:00Z', details: { role: 'viewer' } },
  ];

  async getReports(): Promise<any> {
    return this.reports;
  }

  async getReport(id: string): Promise<any> {
    const report = this.reports.find(r => r.id === id);
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async createReport(dto: CreateReportDto): Promise<any> {
    const report = {
      id: String(this.reports.length + 1),
      ...dto,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.reports.push(report);
    return report;
  }

  async getAuditLogs(filters?: AuditLogFiltersDto): Promise<any> {
    let logs = [...this.auditLogs];
    if (filters?.userId) logs = logs.filter(l => l.userId === filters.userId);
    if (filters?.action) logs = logs.filter(l => l.action === filters.action);
    if (filters?.entityType) logs = logs.filter(l => l.entityType === filters.entityType);
    return logs;
  }

  async getAuditLog(id: string): Promise<any> {
    const log = this.auditLogs.find(l => l.id === id);
    if (!log) throw new NotFoundException('Audit log not found');
    return log;
  }

  async getOverview(): Promise<any> {
    const totalReports = this.reports.length;
    const completedReports = this.reports.filter(r => r.status === 'completed').length;
    const inProgressReports = this.reports.filter(r => r.status === 'in_progress').length;
    return {
      totalReports,
      completedReports,
      inProgressReports,
      totalAuditLogs: this.auditLogs.length,
      complianceScore: 87,
      lastAuditDate: '2026-06-28T00:00:00Z',
    };
  }
}
