import { ComplianceService } from './compliance.service';

describe('ComplianceService', () => {
  let service: ComplianceService;

  beforeEach(() => {
    service = new ComplianceService();
  });

  describe('getReports', () => {
    it('should return all reports', async () => {
      const result = await service.getReports();
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('id', '1');
      expect(result[1]).toHaveProperty('id', '2');
      expect(result[2]).toHaveProperty('id', '3');
    });

    it('each report should have required fields', async () => {
      const reports = await service.getReports();
      for (const report of reports) {
        expect(report).toHaveProperty('id');
        expect(report).toHaveProperty('name');
        expect(report).toHaveProperty('type');
        expect(report).toHaveProperty('dateRange');
        expect(report).toHaveProperty('status');
        expect(report).toHaveProperty('createdAt');
      }
    });
  });

  describe('getReport', () => {
    it('should return a report by id', async () => {
      const result = await service.getReport('2');
      expect(result).toHaveProperty('id', '2');
      expect(result).toHaveProperty('name', 'SOC2 Audit 2025');
      expect(result).toHaveProperty('type', 'soc2');
      expect(result).toHaveProperty('status', 'completed');
    });

    it('should throw NotFoundException for missing report', async () => {
      await expect(service.getReport('non-existent')).rejects.toThrow('Report not found');
    });
  });

  describe('createReport', () => {
    it('should create a new report with pending status', async () => {
      const dto = { name: 'New Report', type: 'gdpr' as const, dateRange: { start: '2026-01-01', end: '2026-06-30' } };
      const result = await service.createReport(dto);

      expect(result).toHaveProperty('id', '4');
      expect(result).toHaveProperty('name', 'New Report');
      expect(result).toHaveProperty('type', 'gdpr');
      expect(result).toHaveProperty('status', 'pending');
      expect(result).toHaveProperty('createdAt');
      expect(result.dateRange).toEqual({ start: '2026-01-01', end: '2026-06-30' });
    });

    it('should have id 4 after three existing reports', async () => {
      const dto = { name: 'Another Report', type: 'hipaa' as const, dateRange: { start: '2026-03-01', end: '2026-05-31' } };
      const result = await service.createReport(dto);
      expect(result).toHaveProperty('id', '4');
      const all = await service.getReports();
      expect(all).toHaveLength(4);
    });
  });

  describe('getAuditLogs', () => {
    it('should return all audit logs without filters', async () => {
      const result = await service.getAuditLogs();
      expect(result).toHaveLength(5);
    });

    it('should filter by userId', async () => {
      const result = await service.getAuditLogs({ userId: 'user-1' });
      expect(result).toHaveLength(3);
      for (const log of result) {
        expect(log.userId).toBe('user-1');
      }
    });

    it('should filter by action', async () => {
      const result = await service.getAuditLogs({ action: 'LOGIN' });
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('action', 'LOGIN');
    });

    it('should filter by entityType', async () => {
      const result = await service.getAuditLogs({ entityType: 'user' });
      expect(result).toHaveLength(2);
      for (const log of result) {
        expect(log.entityType).toBe('user');
      }
    });

    it('should combine multiple filters', async () => {
      const result = await service.getAuditLogs({ userId: 'user-1', action: 'LOGIN' });
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('userId', 'user-1');
      expect(result[0]).toHaveProperty('action', 'LOGIN');
    });

    it('should return empty array for non-matching filters', async () => {
      const result = await service.getAuditLogs({ userId: 'does-not-exist' });
      expect(result).toHaveLength(0);
    });
  });

  describe('getAuditLog', () => {
    it('should return an audit log by id', async () => {
      const result = await service.getAuditLog('1');
      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('action', 'LOGIN');
      expect(result).toHaveProperty('userId', 'user-1');
    });

    it('should throw NotFoundException for missing audit log', async () => {
      await expect(service.getAuditLog('non-existent')).rejects.toThrow('Audit log not found');
    });
  });

  describe('getOverview', () => {
    it('should return overview metrics', async () => {
      const result = await service.getOverview();
      expect(result).toHaveProperty('totalReports', 3);
      expect(result).toHaveProperty('completedReports', 2);
      expect(result).toHaveProperty('inProgressReports', 1);
      expect(result).toHaveProperty('totalAuditLogs', 5);
      expect(result).toHaveProperty('complianceScore', 87);
      expect(result).toHaveProperty('lastAuditDate');
    });
  });
});
