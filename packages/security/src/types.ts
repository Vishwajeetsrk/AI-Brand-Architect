export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type PolicyCategory = 'access' | 'auth' | 'data' | 'network' | 'ai';
export type PolicyStatus = 'active' | 'inactive';
export type ComplianceFramework = 'SOC2' | 'GDPR' | 'HIPAA' | 'PCI';
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'in_progress';
export type Permission = 'allow' | 'deny';
export type ThreatType = 'malware' | 'phishing' | 'bad_bot' | 'data_exfil' | 'brute_force' | 'insider_threat';
export type EventType = 'login' | 'logout' | 'access_denied' | 'permission_change' | 'data_export' | 'api_call' | 'config_change' | 'user_create' | 'threat_detected' | 'policy_violation';

export interface SecurityEvent {
  id: string;
  type: EventType;
  severity: Severity;
  source: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  rules: PolicyRule[];
  status: PolicyStatus;
  enforced: boolean;
}

export interface PolicyRule {
  id: string;
  condition: string;
  action: string;
  priority: number;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  actorId: string;
  changes: Record<string, unknown>;
  ipAddress: string;
  timestamp: string;
}

export interface ComplianceReport {
  id: string;
  name: string;
  framework: ComplianceFramework;
  status: ComplianceStatus;
  checks: ComplianceCheck[];
  score: number;
  generatedAt: string;
}

export interface ComplianceCheck {
  id: string;
  name: string;
  passed: boolean;
  details: string;
}

export interface AccessControl {
  id: string;
  resource: string;
  principal: string;
  permission: Permission;
  conditions: string[];
}

export interface ThreatIntel {
  id: string;
  type: ThreatType;
  indicator: string;
  confidence: number;
  source: string;
  reportedAt: string;
}

export interface SecurityDashboard {
  activeThreats: number;
  openIncidents: number;
  compliantScore: number;
  securityScore: number;
  eventsBySeverity: Record<Severity, number>;
  topThreats: ThreatIntel[];
}
