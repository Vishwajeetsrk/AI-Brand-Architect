"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Shield, ShieldAlert, ShieldCheck, Activity, Search, AlertTriangle,
  CheckCircle, XCircle, Clock, Users, Eye, FileText, SlidersHorizontal,
} from "lucide-react";
import { Btn, Card, StatCard, PageHeader, Badge } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const TABS = ["Overview", "Events", "Policies", "Audit Log", "Compliance"] as const;
type Tab = (typeof TABS)[number];

const severityColor: Record<string, string> = {
  low: "bg-slate-500", medium: "bg-amber-500", high: "bg-orange-500", critical: "bg-red-500",
};
const severityBadgeColor: Record<string, string> = {
  low: "gray", medium: "yellow", high: "orange", critical: "red",
};

const events = [
  { id: "evt-1", type: "Login", severity: "low", source: "web-ui", description: "Successful login from known IP", ip: "192.168.1.100", time: "2 min ago" },
  { id: "evt-2", type: "Login", severity: "medium", source: "api", description: "Login from new device detected", ip: "10.0.0.45", time: "15 min ago" },
  { id: "evt-3", type: "Access Denied", severity: "high", source: "admin-panel", description: "Unauthorized access attempt to admin panel", ip: "203.0.113.50", time: "1 hr ago" },
  { id: "evt-4", type: "Data Export", severity: "critical", source: "api", description: "Mass data export detected exceeding threshold", ip: "198.51.100.23", time: "2 hr ago" },
  { id: "evt-5", type: "Threat Detected", severity: "critical", source: "waf", description: "SQL injection attempt blocked", ip: "45.33.32.156", time: "3 hr ago" },
  { id: "evt-6", type: "Policy Violation", severity: "high", source: "dlp", description: "Sensitive data shared externally", ip: "10.0.2.50", time: "5 hr ago" },
  { id: "evt-7", type: "Permission Change", severity: "medium", source: "iam", description: "API key permissions updated", ip: "10.0.1.100", time: "8 hr ago" },
  { id: "evt-8", type: "Config Change", severity: "high", source: "database", description: "Database encryption settings changed", ip: "10.0.3.1", time: "12 hr ago" },
  { id: "evt-9", type: "Threat Detected", severity: "critical", source: "email-gateway", description: "Phishing email detected with malicious attachment", ip: "185.220.101.42", time: "1 day ago" },
  { id: "evt-10", type: "Threat Detected", severity: "high", source: "ids", description: "Port scan detected from external IP", ip: "89.248.165.12", time: "1 day ago" },
  { id: "evt-11", type: "Login", severity: "critical", source: "auth0", description: "Brute force attack blocked", ip: "192.0.2.45", time: "2 days ago" },
  { id: "evt-12", type: "Data Export", severity: "medium", source: "storage", description: "Unusual download pattern from storage", ip: "172.16.0.99", time: "2 days ago" },
];

const policies = [
  { id: "pol-1", name: "MFA Enforcement", category: "Auth", status: "active", enforced: true },
  { id: "pol-2", name: "Data Classification", category: "Data", status: "active", enforced: true },
  { id: "pol-3", name: "IP Whitelisting", category: "Access", status: "active", enforced: true },
  { id: "pol-4", name: "Rate Limiting", category: "Network", status: "active", enforced: true },
  { id: "pol-5", name: "AI Model Governance", category: "AI", status: "inactive", enforced: false },
  { id: "pol-6", name: "Session Timeout", category: "Auth", status: "active", enforced: true },
  { id: "pol-7", name: "Encryption at Rest", category: "Data", status: "active", enforced: true },
  { id: "pol-8", name: "Audit Logging", category: "Access", status: "active", enforced: true },
];

const auditLogs = [
  { id: "aud-1", action: "user.login", entity: "session", actor: "user-1", ip: "192.168.1.100", time: "10 min ago" },
  { id: "aud-2", action: "policy.update", entity: "policy", actor: "user-2", ip: "10.0.0.1", time: "30 min ago" },
  { id: "aud-3", action: "user.create", entity: "user", actor: "user-1", ip: "192.168.1.100", time: "1 hr ago" },
  { id: "aud-4", action: "data.export", entity: "report", actor: "user-3", ip: "203.0.113.50", time: "2 hr ago" },
  { id: "aud-5", action: "config.change", entity: "firewall", actor: "user-2", ip: "10.0.1.5", time: "3 hr ago" },
  { id: "aud-6", action: "api.key_rotate", entity: "api_key", actor: "user-4", ip: "172.16.0.88", time: "4 hr ago" },
  { id: "aud-7", action: "permission.grant", entity: "role", actor: "user-1", ip: "192.168.1.100", time: "5 hr ago" },
  { id: "aud-8", action: "threat.resolve", entity: "incident", actor: "user-2", ip: "10.0.0.1", time: "6 hr ago" },
];

const complianceData = [
  { name: "SOC 2", score: 87, status: "compliant", color: "bg-emerald-500" },
  { name: "GDPR", score: 52, status: "in_progress", color: "bg-amber-500" },
  { name: "PCI DSS", score: 41, status: "non_compliant", color: "bg-red-500" },
];

const complianceStatusBadge: Record<string, { label: string; color: string }> = {
  compliant: { label: "Compliant", color: "green" },
  in_progress: { label: "In Progress", color: "yellow" },
  non_compliant: { label: "Non-Compliant", color: "red" },
};

export default function SecurityPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [policyStates, setPolicyStates] = useState<Record<string, string>>(
    Object.fromEntries(policies.map(p => [p.id, p.status]))
  );
  const [auditSearch, setAuditSearch] = useState("");

  const togglePolicy = (id: string) => {
    setPolicyStates(prev => ({ ...prev, [id]: prev[id] === "active" ? "inactive" : "active" }));
  };

  const filteredAudit = auditLogs.filter(l =>
    !auditSearch || l.action.includes(auditSearch) || l.entity.includes(auditSearch) || l.actor.includes(auditSearch)
  );

  const renderOverview = () => (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Threats" value="4" delta="2 high confidence" icon={ShieldAlert} color="red" />
        <StatCard label="Open Incidents" value="7" delta="3 critical" icon={AlertTriangle} color="orange" />
        <StatCard label="Compliant Score" value="60%" delta="Needs improvement" icon={ShieldCheck} color="emerald" />
        <StatCard label="Security Score" value="84%" delta="Good standing" icon={Shield} color="violet" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <Card className="col-span-2 p-5">
          <h3 className="font-bold text-white text-sm mb-3">Recent Security Events</h3>
          <div className="space-y-1 max-h-80 overflow-y-auto pr-1 custom-scroll">
            {events.slice(0, 8).map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">
                <div className={`w-2 h-2 rounded-full ${severityColor[e.severity]} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{e.type}</span>
                    <Badge color={severityBadgeColor[e.severity]}>{e.severity}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{e.description}</p>
                </div>
                <span className="text-xs text-slate-600 shrink-0">{e.time}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-3">Threat Intelligence</h3>
          <div className="space-y-3">
            {[
              { indicator: "suspicious.domain.com", confidence: 92, type: "Phishing", color: "red" },
              { indicator: "185.220.101.42", confidence: 88, type: "Malware", color: "red" },
              { indicator: "192.0.2.45", confidence: 95, type: "Brute Force", color: "orange" },
              { indicator: "exfil.example.com", confidence: 84, type: "Data Exfil", color: "yellow" },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-white/[0.03]">
                <ShieldAlert size={14} className="text-red-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{t.indicator}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge color={t.color as any}>{t.type}</Badge>
                    <span className="text-xs text-slate-500">{t.confidence}% confidence</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderEvents = () => (
    <Card className="p-5">
      <h3 className="font-bold text-white text-sm mb-4">Security Events Timeline</h3>
      <div className="space-y-0.5">
        {events.map((e) => (
          <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors">
            <div className={`w-2.5 h-2.5 rounded-full ${severityColor[e.severity]} shrink-0`} />
            <div className="flex-1 min-w-0 grid grid-cols-5 gap-2 items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">{e.type}</span>
                <Badge color={severityBadgeColor[e.severity]}>{e.severity}</Badge>
              </div>
              <span className="text-xs text-slate-400 col-span-2 truncate">{e.description}</span>
              <span className="text-xs text-slate-500">{e.source}</span>
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-slate-600">{e.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderPolicies = () => (
    <Card className="p-5">
      <h3 className="font-bold text-white text-sm mb-4">Security Policies</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3 px-3 text-slate-500 font-medium">Policy Name</th>
              <th className="text-left py-3 px-3 text-slate-500 font-medium">Category</th>
              <th className="text-left py-3 px-3 text-slate-500 font-medium">Status</th>
              <th className="text-left py-3 px-3 text-slate-500 font-medium">Enforced</th>
              <th className="text-right py-3 px-3 text-slate-500 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => {
              const current = policyStates[p.id];
              return (
                <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <p className="text-white font-medium">{p.name}</p>
                  </td>
                  <td className="py-3 px-3">
                    <Badge color={p.category === "AI" ? "cyan" : p.category === "Auth" ? "violet" : p.category === "Data" ? "blue" : p.category === "Access" ? "pink" : "gray"}>
                      {p.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge color={current === "active" ? "green" : "gray"}>
                      {current === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    {p.enforced ? <CheckCircle size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-slate-600" />}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => togglePolicy(p.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        current === "active"
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                    >
                      {current === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderAuditLog = () => (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text" placeholder="Search audit logs..."
            value={auditSearch} onChange={(e) => setAuditSearch(e.target.value)}
            className="w-full bg-[#111336] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40 transition-colors"
          />
        </div>
      </div>
      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 px-3 text-slate-500 font-medium">Action</th>
                <th className="text-left py-3 px-3 text-slate-500 font-medium">Entity</th>
                <th className="text-left py-3 px-3 text-slate-500 font-medium">Actor</th>
                <th className="text-left py-3 px-3 text-slate-500 font-medium">IP Address</th>
                <th className="text-right py-3 px-3 text-slate-500 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudit.map((l) => (
                <tr key={l.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 text-white font-medium">{l.action}</td>
                  <td className="py-3 px-3 text-slate-400">{l.entity}</td>
                  <td className="py-3 px-3 text-slate-400">{l.actor}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{l.ip}</td>
                  <td className="py-3 px-3 text-right text-slate-500">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderCompliance = () => (
    <div className="grid grid-cols-3 gap-5">
      {complianceData.map((c) => {
        const badge = complianceStatusBadge[c.status];
        return (
          <Card key={c.name} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">{c.name}</h3>
              <Badge color={badge.color}>{badge.label}</Badge>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">Compliance Score</span>
                <span className="text-xs font-bold text-white">{c.score}%</span>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${c.color}`} style={{ width: `${c.score}%` }} />
              </div>
            </div>
            {c.name === "SOC 2" && (
              <div className="space-y-1.5 mt-4">
                {[
                  { name: "Access Control", passed: true }, { name: "Data Encryption", passed: true },
                  { name: "Incident Response", passed: false }, { name: "Change Management", passed: true },
                ].map((ch) => (
                  <div key={ch.name} className="flex items-center gap-2 text-xs">
                    {ch.passed ? <CheckCircle size={12} className="text-emerald-400" /> : <XCircle size={12} className="text-red-400" />}
                    <span className={ch.passed ? "text-slate-400" : "text-slate-500"}>{ch.name}</span>
                  </div>
                ))}
              </div>
            )}
            {c.name === "GDPR" && (
              <div className="space-y-1.5 mt-4">
                {[
                  { name: "Data Processing Records", passed: true }, { name: "Consent Management", passed: false },
                  { name: "Data Subject Rights", passed: true }, { name: "Breach Notification", passed: false },
                ].map((ch) => (
                  <div key={ch.name} className="flex items-center gap-2 text-xs">
                    {ch.passed ? <CheckCircle size={12} className="text-emerald-400" /> : <XCircle size={12} className="text-red-400" />}
                    <span className={ch.passed ? "text-slate-400" : "text-slate-500"}>{ch.name}</span>
                  </div>
                ))}
              </div>
            )}
            {c.name === "PCI DSS" && (
              <div className="space-y-1.5 mt-4">
                {[
                  { name: "Cardholder Data Encryption", passed: false }, { name: "Network Segmentation", passed: true },
                  { name: "Access Control", passed: true },
                ].map((ch) => (
                  <div key={ch.name} className="flex items-center gap-2 text-xs">
                    {ch.passed ? <CheckCircle size={12} className="text-emerald-400" /> : <XCircle size={12} className="text-red-400" />}
                    <span className={ch.passed ? "text-slate-400" : "text-slate-500"}>{ch.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Security" subtitle="Security platform &middot; Monitoring, policies & compliance"
        actions={
          <Btn variant="secondary" size="sm" icon={SlidersHorizontal}>Configure</Btn>
        }
      />
      <div className="flex items-center gap-1 mb-6 p-1 bg-[#111336] rounded-xl w-fit">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === t ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30" : "text-slate-500 hover:text-white"
            }`}
          >{t}</button>
        ))}
      </div>
      {tab === "Overview" && renderOverview()}
      {tab === "Events" && renderEvents()}
      {tab === "Policies" && renderPolicies()}
      {tab === "Audit Log" && renderAuditLog()}
      {tab === "Compliance" && renderCompliance()}
    </motion.div>
  );
}
