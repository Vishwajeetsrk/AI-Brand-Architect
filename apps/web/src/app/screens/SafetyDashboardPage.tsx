"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, AlertTriangle, Ban, Flag, Eye, Settings, RefreshCw, Search, Lock, Key, MessageSquare, UserCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Btn, Card, StatCard, PageHeader, Badge } from "../components/shared";
import { safetyService } from "@/services/safety";
import type { SafetyEvent, SafetyStats, SafetyDashboard } from "@/services/safety";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const SEVERITY_COLORS: Record<string, string> = { low: "#22c55e", medium: "#eab308", high: "#f97316", critical: "#ef4444" };
const ACTION_COLORS: Record<string, string> = { block: "#ef4444", flag: "#eab308", allow: "#22c55e" };

type Tab = "overview" | "events" | "config";

export default function SafetyDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [dashboard, setDashboard] = useState<SafetyDashboard | null>(null);
  const [stats, setStats] = useState<SafetyStats | null>(null);
  const [events, setEvents] = useState<SafetyEvent[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [d, s, e, c] = await Promise.all([
        safetyService.getDashboard(),
        safetyService.getStats(),
        safetyService.getEvents({ limit: "20" }),
        safetyService.getConfig(),
      ]);
      setDashboard(d);
      setStats(s);
      setEvents(e.items as SafetyEvent[]);
      setConfig(c);
    } catch (err) {
      console.error("Failed to fetch safety data", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: Shield },
    { key: "events", label: "Events", icon: AlertTriangle },
    { key: "config", label: "Configuration", icon: Settings },
  ];

  const filteredEvents = events.filter(e =>
    !search || e.type?.includes(search) || e.category?.includes(search) || e.severity?.includes(search)
  );

  const severityChart = stats ? [
    { name: "Low", value: stats.bySeverity.find(s => s.severity === "low")?._count || 0 },
    { name: "Medium", value: stats.bySeverity.find(s => s.severity === "medium")?._count || 0 },
    { name: "High", value: stats.bySeverity.find(s => s.severity === "high")?._count || 0 },
    { name: "Critical", value: stats.bySeverity.find(s => s.severity === "critical")?._count || 0 },
  ] : [];

  const detectorChart = stats?.byDetector.map(d => ({ name: d.detectedBy, value: d._count })) || [];

  return (
    <motion.div {...pageAnim} className="p-6 max-w-7xl mx-auto">
      <PageHeader title="AI Safety Dashboard" subtitle="Monitor prompt injections, content violations, PII leaks, and unsafe outputs"
        actions={<Btn variant="secondary" size="sm" icon={RefreshCw} onClick={fetchData}>Refresh</Btn>}
      />

      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] mb-6 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.key ? "bg-violet-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <RefreshCw size={20} className="animate-spin mr-2" /> Loading...
        </div>
      ) : (
        <>
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <StatCard label="Events (24h)" value={String(dashboard?.total24h || 0)} icon={AlertTriangle} color="violet" />
                <StatCard label="Critical (24h)" value={String(dashboard?.critical24h || 0)} icon={Ban} color="cyan" />
                <StatCard label="Total Blocked" value={String(stats?.blocked || 0)} icon={Lock} color="blue" />
                <StatCard label="Total Flagged" value={String(stats?.flagged || 0)} icon={Flag} color="emerald" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Events by Severity</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={severityChart} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {severityChart.map((e, i) => (
                          <Cell key={i} fill={SEVERITY_COLORS[e.name.toLowerCase()] || "#6366f1"} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {severityChart.filter(s => s.value > 0).map(s => (
                      <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: SEVERITY_COLORS[s.name.toLowerCase()] }} />
                        {s.name}: {s.value}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">By Detector</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={detectorChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {dashboard && dashboard.timeline24h.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">24h Timeline</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={dashboard.timeline24h}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="hour" tick={{ fill: "#94a3b8", fontSize: 11 }}
                        tickFormatter={(v) => new Date(v).toLocaleTimeString([], { hour: '2-digit' })} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                        labelFormatter={(v) => new Date(v).toLocaleString()} />
                      <Area type="monotone" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {dashboard && dashboard.byCategory24h.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Top Categories (24h)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {dashboard.byCategory24h.map(c => (
                      <div key={c.category} className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2">
                        <Badge color={c.category.includes('injection') || c.category.includes('jailbreak') ? 'red' : c.category.includes('pii') ? 'yellow' : 'blue'}>
                          {c.count}
                        </Badge>
                        <span className="text-xs text-slate-400 capitalize">{c.category.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Safety Events</h3>
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search events..." 
                    className="w-full bg-[#111336] border border-white/[0.07] rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50" />
                </div>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredEvents.length === 0 ? (
                  <p className="text-center text-slate-500 py-8 text-sm">No safety events found</p>
                ) : filteredEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className={`p-1.5 rounded-lg ${
                      event.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      event.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      event.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {event.action === 'block' ? <Ban size={14} /> : <Flag size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-white capitalize">{event.category.replace(/_/g, ' ')}</span>
                        <Badge color={event.severity === 'critical' ? 'red' : event.severity === 'high' ? 'orange' : event.severity === 'medium' ? 'yellow' : 'green'}>
                          {event.severity}
                        </Badge>
                        <Badge color={event.action === 'block' ? 'red' : 'yellow'}>{event.action}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {event.detectedBy} &middot; {new Date(event.createdAt).toLocaleString()}
                        {event.input && ` · "${event.input.substring(0, 80)}${event.input.length > 80 ? '...' : ''}"`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "config" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-white mb-4">Safety Engine Configuration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Status</span>
                    <Badge color={config?.enabled ? 'green' : 'red'}>{config?.enabled ? 'Enabled' : 'Disabled'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Mode</span>
                    <Badge color="blue">{config?.mode || 'moderate'}</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-sm font-semibold text-white mb-4">Detector Status</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Prompt Injection', key: 'prompt_injection', icon: MessageSquare, desc: 'Detects prompt override, jailbreak, role escape attacks' },
                    { name: 'Content Moderation', key: 'content_moderation', icon: Eye, desc: 'Filters hate speech, violence, sexual content, self-harm' },
                    { name: 'PII Detector', key: 'pii_detector', icon: Key, desc: 'Detects emails, phones, SSNs, credit cards, API keys' },
                    { name: 'Output Guardrail', key: 'output_guardrail', icon: UserCheck, desc: 'Validates LLM output for unsafe content and leaks' },
                  ].map(det => {
                    const cfg = config?.detectors?.[det.key];
                    return (
                      <div key={det.key} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                        <div className={`p-1.5 rounded-lg ${cfg?.enabled !== false ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-500/20 text-slate-500'}`}>
                          <det.icon size={14} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white">{det.name}</span>
                            <Badge color={cfg?.enabled !== false ? 'green' : 'red'}>{cfg?.enabled !== false ? 'Active' : 'Off'}</Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{det.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
