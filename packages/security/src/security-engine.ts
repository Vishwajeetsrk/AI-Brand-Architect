import {
  SecurityEvent, SecurityPolicy, AuditLog, ComplianceReport, AccessControl, ThreatIntel,
  SecurityDashboard, Severity, PolicyCategory, EventType, ThreatType, ComplianceFramework,
} from './types';

const SEVERITY_WEIGHTS: Record<Severity, number> = { low: 1, medium: 5, high: 15, critical: 30 };

export class SecurityEngine {
  readonly events: SecurityEvent[] = [];
  readonly policies: SecurityPolicy[] = [];
  readonly auditLogs: AuditLog[] = [];
  readonly complianceReports: ComplianceReport[] = [];
  readonly accessControls: AccessControl[] = [];
  readonly threatIntel: ThreatIntel[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    this.events.push(...this.generateSampleEvents());
    this.policies.push(...this.generateSamplePolicies());
    this.auditLogs.push(...this.generateSampleAuditLogs());
    this.complianceReports.push(...this.generateSampleCompliance());
    this.accessControls.push(...this.generateSampleAccessControls());
    this.threatIntel.push(...this.generateSampleThreatIntel());
  }

  private generateSampleEvents(): SecurityEvent[] {
    const sample: Array<{ type: EventType; severity: Severity; source: string; description: string; ip: string }> = [
      { type: 'login', severity: 'low', source: 'web-ui', description: 'Successful login from known IP', ip: '192.168.1.100' },
      { type: 'login', severity: 'medium', source: 'api', description: 'Login from new device detected', ip: '10.0.0.45' },
      { type: 'access_denied', severity: 'high', source: 'admin-panel', description: 'Unauthorized access attempt to admin panel', ip: '203.0.113.50' },
      { type: 'data_export', severity: 'critical', source: 'api', description: 'Mass data export detected exceeding threshold', ip: '198.51.100.23' },
      { type: 'permission_change', severity: 'high', source: 'rbac-service', description: 'Privilege escalation detected', ip: '172.16.0.88' },
      { type: 'api_call', severity: 'low', source: 'public-api', description: 'Rate limit warning for API key', ip: '203.0.113.77' },
      { type: 'threat_detected', severity: 'critical', source: 'waf', description: 'SQL injection attempt blocked', ip: '45.33.32.156' },
      { type: 'config_change', severity: 'medium', source: 'security-hub', description: 'Firewall rule modified', ip: '10.0.1.5' },
      { type: 'user_create', severity: 'low', source: 'user-service', description: 'New user account created', ip: '192.168.1.200' },
      { type: 'logout', severity: 'low', source: 'web-ui', description: 'User logged out', ip: '192.168.1.100' },
      { type: 'policy_violation', severity: 'high', source: 'dlp', description: 'Sensitive data shared externally', ip: '10.0.2.50' },
      { type: 'threat_detected', severity: 'high', source: 'ids', description: 'Port scan detected from external IP', ip: '89.248.165.12' },
      { type: 'access_denied', severity: 'medium', source: 'api-gateway', description: 'Invalid JWT token used', ip: '198.51.100.200' },
      { type: 'data_export', severity: 'medium', source: 'storage', description: 'Unusual download pattern from storage', ip: '172.16.0.99' },
      { type: 'login', severity: 'critical', source: 'auth0', description: 'Brute force attack blocked', ip: '192.0.2.45' },
      { type: 'api_call', severity: 'low', source: 'webhook', description: 'Webhook call failed authentication', ip: '203.0.113.120' },
      { type: 'permission_change', severity: 'medium', source: 'iam', description: 'API key permissions updated', ip: '10.0.1.100' },
      { type: 'config_change', severity: 'high', source: 'database', description: 'Database encryption settings changed', ip: '10.0.3.1' },
      { type: 'threat_detected', severity: 'critical', source: 'email-gateway', description: 'Phishing email detected with malicious attachment', ip: '185.220.101.42' },
      { type: 'policy_violation', severity: 'low', source: 'compliance', description: 'Password policy not met by user', ip: '192.168.1.150' },
      { type: 'user_create', severity: 'medium', source: 'admin', description: 'Bulk user import completed', ip: '10.0.0.1' },
      { type: 'logout', severity: 'low', source: 'mobile', description: 'Session expired due to inactivity', ip: '10.0.4.20' },
    ];
    return sample.map((s, i) => ({
      id: `evt-${i + 1}`,
      type: s.type,
      severity: s.severity,
      source: s.source,
      description: s.description,
      ipAddress: s.ip,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      userId: `user-${(i % 5) + 1}`,
      metadata: { location: i % 2 === 0 ? 'US-EAST' : 'EU-WEST' },
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    }));
  }

  private generateSamplePolicies(): SecurityPolicy[] {
    return [
      {
        id: 'pol-1', name: 'MFA Enforcement', description: 'Require multi-factor authentication for all admin accounts',
        category: 'auth', rules: [{ id: 'rule-1', condition: 'role == admin', action: 'require_mfa', priority: 1 }], status: 'active', enforced: true,
      },
      {
        id: 'pol-2', name: 'Data Classification', description: 'Classify all stored data by sensitivity level',
        category: 'data', rules: [{ id: 'rule-2', condition: 'data_type == pii', action: 'encrypt_at_rest', priority: 2 }], status: 'active', enforced: true,
      },
      {
        id: 'pol-3', name: 'IP Whitelisting', description: 'Restrict access to internal tools from corporate IPs only',
        category: 'access', rules: [{ id: 'rule-3', condition: 'ip_range != 10.0.0.0/8', action: 'deny', priority: 3 }], status: 'active', enforced: true,
      },
      {
        id: 'pol-4', name: 'Rate Limiting', description: 'Limit API requests per key to prevent abuse',
        category: 'network', rules: [{ id: 'rule-4', condition: 'requests_per_min > 1000', action: 'throttle', priority: 4 }], status: 'active', enforced: true,
      },
      {
        id: 'pol-5', name: 'AI Model Governance', description: 'Ensure AI models are validated before deployment',
        category: 'ai', rules: [{ id: 'rule-5', condition: 'model_accuracy < 0.85', action: 'block_deployment', priority: 5 }], status: 'inactive', enforced: false,
      },
      {
        id: 'pol-6', name: 'Session Timeout', description: 'Force logout after 30 minutes of inactivity',
        category: 'auth', rules: [{ id: 'rule-6', condition: 'inactivity > 1800s', action: 'terminate_session', priority: 6 }], status: 'active', enforced: true,
      },
      {
        id: 'pol-7', name: 'Encryption at Rest', description: 'All databases must use AES-256 encryption',
        category: 'data', rules: [{ id: 'rule-7', condition: 'storage_type == database', action: 'enable_encryption', priority: 7 }], status: 'active', enforced: true,
      },
      {
        id: 'pol-8', name: 'Audit Logging', description: 'All admin actions must be logged for compliance',
        category: 'access', rules: [{ id: 'rule-8', condition: 'action_type == admin', action: 'log_event', priority: 8 }], status: 'active', enforced: true,
      },
    ];
  }

  private generateSampleAuditLogs(): AuditLog[] {
    return [
      { id: 'aud-1', action: 'user.login', entity: 'session', entityId: 'sess-001', actorId: 'user-1', changes: { method: 'oauth' }, ipAddress: '192.168.1.100', timestamp: new Date(Date.now() - 600000).toISOString() },
      { id: 'aud-2', action: 'policy.update', entity: 'policy', entityId: 'pol-3', actorId: 'user-2', changes: { status: 'active' }, ipAddress: '10.0.0.1', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { id: 'aud-3', action: 'user.create', entity: 'user', entityId: 'user-6', actorId: 'user-1', changes: { role: 'admin' }, ipAddress: '192.168.1.100', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'aud-4', action: 'data.export', entity: 'report', entityId: 'rpt-042', actorId: 'user-3', changes: { records: 15000 }, ipAddress: '203.0.113.50', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: 'aud-5', action: 'config.change', entity: 'firewall', entityId: 'fw-01', actorId: 'user-2', changes: { rule: 'block_port_22' }, ipAddress: '10.0.1.5', timestamp: new Date(Date.now() - 10800000).toISOString() },
      { id: 'aud-6', action: 'api.key_rotate', entity: 'api_key', entityId: 'key-xyz', actorId: 'user-4', changes: {}, ipAddress: '172.16.0.88', timestamp: new Date(Date.now() - 14400000).toISOString() },
      { id: 'aud-7', action: 'permission.grant', entity: 'role', entityId: 'role-admin', actorId: 'user-1', changes: { added: ['billing.write', 'users.delete'] }, ipAddress: '192.168.1.100', timestamp: new Date(Date.now() - 18000000).toISOString() },
      { id: 'aud-8', action: 'threat.resolve', entity: 'incident', entityId: 'inc-003', actorId: 'user-2', changes: { resolution: 'false_positive' }, ipAddress: '10.0.0.1', timestamp: new Date(Date.now() - 21600000).toISOString() },
    ];
  }

  private generateSampleCompliance(): ComplianceReport[] {
    return [
      {
        id: 'comp-1', name: 'SOC 2 Type II Audit', framework: 'SOC2', status: 'compliant',
        checks: [
          { id: 'ck-1', name: 'Access Control', passed: true, details: 'All access requests authenticated and authorized' },
          { id: 'ck-2', name: 'Data Encryption', passed: true, details: 'AES-256 enabled across all storage' },
          { id: 'ck-3', name: 'Incident Response', passed: false, details: 'Response time exceeds SLA for critical events' },
          { id: 'ck-4', name: 'Change Management', passed: true, details: 'All changes tracked in audit log' },
        ], score: 87, generatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'comp-2', name: 'GDPR Compliance Check', framework: 'GDPR', status: 'in_progress',
        checks: [
          { id: 'ck-5', name: 'Data Processing Records', passed: true, details: 'Records maintained per Art. 30' },
          { id: 'ck-6', name: 'Consent Management', passed: false, details: 'Cookie consent not granular enough' },
          { id: 'ck-7', name: 'Data Subject Rights', passed: true, details: 'DSAR process implemented' },
          { id: 'ck-8', name: 'Data Breach Notification', passed: false, details: '72h notification process not documented' },
        ], score: 52, generatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'comp-3', name: 'PCI DSS Assessment', framework: 'PCI', status: 'non_compliant',
        checks: [
          { id: 'ck-9', name: 'Cardholder Data Encryption', passed: false, details: 'Primary account numbers stored without encryption' },
          { id: 'ck-10', name: 'Network Segmentation', passed: true, details: 'CDE properly isolated' },
          { id: 'ck-11', name: 'Access Control', passed: true, details: 'Need-to-know access implemented' },
        ], score: 41, generatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ];
  }

  private generateSampleAccessControls(): AccessControl[] {
    return [
      { id: 'ac-1', resource: 'admin-panel', principal: 'role:admin', permission: 'allow', conditions: ['ip_range:10.0.0.0/8', 'mfa:required'] },
      { id: 'ac-2', resource: 'api/v2/billing', principal: 'role:finance', permission: 'allow', conditions: ['mfa:required'] },
      { id: 'ac-3', resource: 'api/v2/users', principal: 'role:user', permission: 'deny', conditions: ['resource_owner:true'] },
      { id: 'ac-4', resource: 'storage/exports', principal: 'role:admin', permission: 'allow', conditions: ['time:business_hours'] },
      { id: 'ac-5', resource: 'ai/models/deploy', principal: 'role:ml-engineer', permission: 'deny', conditions: ['approval:required'] },
    ];
  }

  private generateSampleThreatIntel(): ThreatIntel[] {
    return [
      { id: 'threat-1', type: 'phishing', indicator: 'suspicious.domain.com', confidence: 92, source: 'abuse.ch', reportedAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'threat-2', type: 'malware', indicator: '185.220.101.42', confidence: 88, source: 'virustotal', reportedAt: new Date(Date.now() - 7200000).toISOString() },
      { id: 'threat-3', type: 'brute_force', indicator: '192.0.2.45', confidence: 95, source: 'crowdsec', reportedAt: new Date(Date.now() - 14400000).toISOString() },
      { id: 'threat-4', type: 'bad_bot', indicator: 'Mozilla/5.0 (compatible; BadBot/1.0)', confidence: 76, source: 'cloudflare', reportedAt: new Date(Date.now() - 28800000).toISOString() },
      { id: 'threat-5', type: 'data_exfil', indicator: 'exfil.example.com:8443', confidence: 84, source: 'misp', reportedAt: new Date(Date.now() - 43200000).toISOString() },
      { id: 'threat-6', type: 'insider_threat', indicator: 'user-3', confidence: 45, source: 'ueba', reportedAt: new Date(Date.now() - 86400000).toISOString() },
    ];
  }

  logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    const newEvent: SecurityEvent = { id: crypto.randomUUID(), ...event, timestamp: new Date().toISOString() };
    this.events.unshift(newEvent);
    return newEvent;
  }

  getEvents(filters?: { severity?: Severity; type?: EventType; startDate?: string; endDate?: string }): SecurityEvent[] {
    let result = [...this.events];
    if (filters?.severity) result = result.filter(e => e.severity === filters.severity);
    if (filters?.type) result = result.filter(e => e.type === filters.type);
    if (filters?.startDate) result = result.filter(e => e.timestamp >= filters.startDate!);
    if (filters?.endDate) result = result.filter(e => e.timestamp <= filters.endDate!);
    return result;
  }

  getEvent(id: string): SecurityEvent | undefined {
    return this.events.find(e => e.id === id);
  }

  getPolicies(category?: PolicyCategory): SecurityPolicy[] {
    return category ? this.policies.filter(p => p.category === category) : [...this.policies];
  }

  togglePolicy(id: string): SecurityPolicy | undefined {
    const policy = this.policies.find(p => p.id === id);
    if (policy) {
      policy.status = policy.status === 'active' ? 'inactive' : 'active';
      this.auditLogs.unshift({
        id: `aud-${crypto.randomUUID().slice(0, 4)}`,
        action: 'policy.update',
        entity: 'policy',
        entityId: id,
        actorId: 'system',
        changes: { status: policy.status } as Record<string, unknown>,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });
    }
    return policy;
  }

  searchAuditLogs(query?: string): AuditLog[] {
    if (!query) return [...this.auditLogs];
    const q = query.toLowerCase();
    return this.auditLogs.filter(l =>
      l.action.toLowerCase().includes(q) ||
      l.entity.toLowerCase().includes(q) ||
      l.actorId.toLowerCase().includes(q) ||
      l.ipAddress.includes(q)
    );
  }

  getComplianceReports(): ComplianceReport[] {
    return [...this.complianceReports];
  }

  evaluateAccess(resource: string, principal: string): { allowed: boolean; matchedRules: AccessControl[] } {
    const matchedRules = this.accessControls.filter(ac => ac.resource === resource || ac.principal === principal);
    const allowRules = matchedRules.filter(r => r.permission === 'allow');
    const denyRules = matchedRules.filter(r => r.permission === 'deny');
    const allowed = denyRules.length === 0 && allowRules.length > 0;
    return { allowed, matchedRules };
  }

  getThreatIntel(type?: ThreatType): ThreatIntel[] {
    return type ? this.threatIntel.filter(t => t.type === type) : [...this.threatIntel];
  }

  getDashboard(): SecurityDashboard {
    const severityCounts = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const event of this.events) severityCounts[event.severity]++;

    const activeThreats = this.threatIntel.filter(t => t.confidence >= 70).length;
    const openIncidents = this.events.filter(e => e.severity === 'critical' || e.severity === 'high').length;
    const totalScore = this.events.reduce((sum, e) => sum + SEVERITY_WEIGHTS[e.severity], 0);
    const maxScore = this.events.length * SEVERITY_WEIGHTS.critical;
    const securityScore = Math.round(100 - (totalScore / maxScore) * 100);

    return {
      activeThreats,
      openIncidents,
      compliantScore: Math.round(this.complianceReports.reduce((s, r) => s + r.score, 0) / this.complianceReports.length),
      securityScore: Math.max(0, securityScore),
      eventsBySeverity: severityCounts,
      topThreats: this.threatIntel.sort((a, b) => b.confidence - a.confidence).slice(0, 4),
    };
  }

  runThreatSimulation(): SecurityEvent[] {
    const simulated: SecurityEvent[] = [
      {
        id: `sim-${crypto.randomUUID().slice(0, 4)}`, type: 'threat_detected', severity: 'critical',
        source: 'simulation', description: 'Simulated ransomware encryption attempt blocked',
        ipAddress: '45.33.22.100', userAgent: 'Simulation-Agent/1.0', userId: 'system',
        metadata: { simulation: true, technique: 'ransomware' }, timestamp: new Date().toISOString(),
      },
      {
        id: `sim-${crypto.randomUUID().slice(0, 4)}`, type: 'threat_detected', severity: 'high',
        source: 'simulation', description: 'Simulated credential stuffing attack detected',
        ipAddress: '89.248.165.50', userAgent: 'Simulation-Agent/1.0', userId: 'system',
        metadata: { simulation: true, technique: 'credential_stuffing' }, timestamp: new Date().toISOString(),
      },
    ];
    this.events.unshift(...simulated);
    return simulated;
  }
}

export const security = new SecurityEngine();
