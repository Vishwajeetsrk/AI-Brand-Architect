"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Activity, DollarSign, Zap, Clock, AlertTriangle, BarChart3, Cpu, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Btn, Card, StatCard, PageHeader, Badge } from "../components/shared";
import { monitoringService } from "@/services/monitoring";
import type { MonitoringStats, ModelQuality, ErrorAnalytics, RealtimeMetrics } from "@/services/monitoring";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

type Tab = "overview" | "tokens" | "models" | "errors";

export default function MonitoringDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<MonitoringStats | null>(null);
  const [realtime, setRealtime] = useState<RealtimeMetrics | null>(null);
  const [modelQuality, setModelQuality] = useState<ModelQuality[]>([]);
  const [errorAnalytics, setErrorAnalytics] = useState<ErrorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, r, m, e] = await Promise.all([
        monitoringService.getStats(),
        monitoringService.getRealtime(),
        monitoringService.getModelQuality(),
        monitoringService.getErrorAnalytics(),
      ]);
      setStats(s);
      setRealtime(r);
      setModelQuality(m);
      setErrorAnalytics(e);
    } catch (err) {
      console.error("Failed to load monitoring data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const tabs: { id: Tab; label: string; icon: typeof Activity }[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "tokens", label: "Token & Cost Usage", icon: DollarSign },
    { id: "models", label: "Model Performance", icon: Cpu },
    { id: "errors", label: "Error Analytics", icon: AlertTriangle },
  ];

  const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#22d3ee", "#10b981", "#f59e0b", "#ef4444", "#475569"];

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="AI Monitoring" subtitle="Observability & telemetry for AI model usage"
        actions={<Btn variant="secondary" size="sm" icon={RefreshCw} onClick={fetchData}>Refresh</Btn>}
      />
      <div className="flex items-center gap-1 mb-6 bg-white/[0.03] rounded-lg p-1 w-fit border border-white/[0.06]">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === t.id ? 'bg-violet-600/20 text-violet-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {loading && !stats ? (
        <div className="flex items-center justify-center h-64 text-slate-500 text-sm">Loading monitoring data...</div>
      ) : (
        <>
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-5 gap-4 mb-6">
                <StatCard label="Executions" value={stats?.totalExecutions.toLocaleString() || "0"} delta={`${realtime?.executionsLastMinute || 0} in last min`} icon={Zap} color="violet" />
                <StatCard label="Total Tokens" value={stats?.totalTokens.toLocaleString() || "0"} icon={BarChart3} color="blue" />
                <StatCard label="Total Cost" value={`$${(stats?.totalCost || 0).toFixed(4)}`} delta={`$${(realtime?.costLastHour || 0).toFixed(4)} last hr`} icon={DollarSign} color="cyan" />
                <StatCard label="Avg Latency" value={`${stats?.avgLatencyMs || 0}ms`} icon={Clock} color="emerald" />
                <StatCard label="Success Rate" value={`${stats?.successRate || 100}%`} delta={`${realtime?.errorsLastHour || 0} errors last hr`} icon={Activity} color={stats && stats.successRate > 95 ? "emerald" : "yellow"} />
              </div>
              <div className="grid grid-cols-3 gap-5 mb-6">
                <Card className="col-span-2 p-5">
                  <h3 className="font-bold text-white text-sm mb-4">Daily Usage & Cost</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={stats?.dailyUsage || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 11 }} />
                      <Area yAxisId="left" type="monotone" dataKey="executions" stroke="#8b5cf6" fill="url(#execGrad)" strokeWidth={2} />
                      <Area yAxisId="right" type="monotone" dataKey="cost" stroke="#22d3ee" fill="url(#costGrad)" strokeWidth={2} />
                      <defs>
                        <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                        <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
                <Card className="p-5">
                  <h3 className="font-bold text-white text-sm mb-4">Top Models</h3>
                  <div className="space-y-3">
                    {(stats?.topModels || []).map(m => (
                      <div key={m.model} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-violet-500" />
                          <span className="text-xs text-slate-300 truncate max-w-[120px]">{m.model}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white font-medium">{m.executions}</div>
                          <div className="text-[10px] text-slate-500">${m.cost.toFixed(4)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <Card className="p-5">
                  <h3 className="font-bold text-white text-sm mb-4">Real-Time (Last Hour)</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Executions", value: realtime?.executionsLastHour || 0, color: "violet" },
                      { label: "Tokens", value: (realtime?.tokensLastHour || 0).toLocaleString(), color: "blue" },
                      { label: "Cost", value: `$${(realtime?.costLastHour || 0).toFixed(4)}`, color: "cyan" },
                      { label: "Errors", value: realtime?.errorsLastHour || 0, color: realtime && realtime.errorsLastHour > 0 ? "red" : "emerald" },
                      { label: "Avg Latency", value: `${realtime?.avgLatencyMsLastHour || 0}ms`, color: "yellow" },
                    ].map(d => (
                      <div key={d.label} className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{d.label}</span>
                        <span className={`text-xs font-bold text-${d.color === 'red' ? 'red' : d.color === 'emerald' ? 'emerald' : d.color === 'yellow' ? 'yellow' : 'slate'}-300`}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-5">
                  <h3 className="font-bold text-white text-sm mb-4">Latency Percentiles</h3>
                  <div className="space-y-3">
                    {[
                      { label: "p50", value: `${stats?.latencyPercentiles.p50 || 0}ms`, color: "emerald" },
                      { label: "p95", value: `${stats?.latencyPercentiles.p95 || 0}ms`, color: "yellow" },
                      { label: "p99", value: `${stats?.latencyPercentiles.p99 || 0}ms`, color: "red" },
                    ].map(d => {
                      const maxVal = Math.max(stats?.latencyPercentiles.p99 || 1, 1);
                      const pct = d.label === "p50" ? ((stats?.latencyPercentiles.p50 || 0) / maxVal * 100) : d.label === "p95" ? ((stats?.latencyPercentiles.p95 || 0) / maxVal * 100) : 100;
                      return (
                        <div key={d.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-500">{d.label}</span>
                            <span className={`text-xs font-bold text-${d.color}-300`}>{d.value}</span>
                          </div>
                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full bg-${d.color}-500`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                <Card className="p-5">
                  <h3 className="font-bold text-white text-sm mb-4">Provider Cost Share</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={(stats?.topModels || []).slice(0, 5).map((m, i) => ({ name: m.model, value: Math.max(m.cost * 100, 0.1), color: PIE_COLORS[i % PIE_COLORS.length] }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                        {(stats?.topModels || []).slice(0, 5).map((m, i) => (
                          <Cell key={m.model} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </>
          )}

          {activeTab === "tokens" && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Tokens Used" value={stats?.totalTokens.toLocaleString() || "0"} delta={`${stats?.dailyUsage?.[stats.dailyUsage.length - 1]?.tokens.toLocaleString() || 0} today`} icon={BarChart3} color="violet" />
                <StatCard label="Total Cost" value={`$${(stats?.totalCost || 0).toFixed(4)}`} icon={DollarSign} color="cyan" />
                <StatCard label="Avg Tokens/Request" value={stats && stats.totalExecutions > 0 ? Math.round(stats.totalTokens / stats.totalExecutions).toLocaleString() : "0"} icon={Cpu} color="blue" />
              </div>
              <Card className="p-5 mb-5">
                <h3 className="font-bold text-white text-sm mb-4">Daily Token Consumption</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={stats?.dailyUsage || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="tokens" stroke="#3b82f6" fill="url(#tokenGrad)" strokeWidth={2} />
                    <defs><linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-5">
                <h3 className="font-bold text-white text-sm mb-4">Daily Cost</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats?.dailyUsage || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="cost" fill="#22d3ee" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}

          {activeTab === "models" && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Models Active" value={(modelQuality?.length || 0).toString()} icon={Cpu} color="violet" />
                <StatCard label="Best Success Rate" value={modelQuality?.length ? `${Math.max(...modelQuality.map(m => m.successRate))}%` : "0%"} icon={Activity} color="emerald" />
                <StatCard label="Fastest Model" value={modelQuality?.length ? `${Math.min(...modelQuality.map(m => m.avgLatencyMs))}ms` : "0ms"} icon={Zap} color="cyan" />
              </div>
              <Card className="p-5">
                <h3 className="font-bold text-white text-sm mb-4">Model Quality Metrics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-slate-500">
                        <th className="text-left py-2 px-2 font-medium">Model</th>
                        <th className="text-left py-2 px-2 font-medium">Provider</th>
                        <th className="text-right py-2 px-2 font-medium">Executions</th>
                        <th className="text-right py-2 px-2 font-medium">Success Rate</th>
                        <th className="text-right py-2 px-2 font-medium">Avg Latency</th>
                        <th className="text-right py-2 px-2 font-medium">Avg Tokens</th>
                        <th className="text-right py-2 px-2 font-medium">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modelQuality.map(m => (
                        <tr key={m.model} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                          <td className="py-2 px-2 text-white font-medium">{m.model}</td>
                          <td className="py-2 px-2 text-slate-400">{m.provider}</td>
                          <td className="py-2 px-2 text-right text-slate-300">{m.executions}</td>
                          <td className="py-2 px-2 text-right">
                            <span className={m.successRate >= 98 ? 'text-emerald-400' : m.successRate >= 90 ? 'text-yellow-400' : 'text-red-400'}>{m.successRate}%</span>
                          </td>
                          <td className="py-2 px-2 text-right text-slate-300">{m.avgLatencyMs}ms</td>
                          <td className="py-2 px-2 text-right text-slate-300">{m.avgTokens.toLocaleString()}</td>
                          <td className="py-2 px-2 text-right text-slate-300">${m.totalCost.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {activeTab === "errors" && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Failed" value={errorAnalytics?.totalFailed.toLocaleString() || "0"} icon={AlertTriangle} color="red" />
                <StatCard label="Models with Errors" value={errorAnalytics?.byModel.length.toString() || "0"} icon={Cpu} color="yellow" />
                <StatCard label="Success Rate" value={`${stats?.successRate || 100}%`} icon={Activity} color="emerald" />
                <StatCard label="Total Executions" value={stats?.totalExecutions.toLocaleString() || "0"} icon={Zap} color="violet" />
              </div>
              <div className="grid grid-cols-2 gap-5 mb-5">
                <Card className="p-5">
                  <h3 className="font-bold text-white text-sm mb-4">Errors by Model</h3>
                  <div className="space-y-3">
                    {(errorAnalytics?.byModel || []).map(m => {
                      const maxErrors = Math.max(...(errorAnalytics?.byModel.map(e => e.errors) || [1]), 1);
                      return (
                        <div key={m.model}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-300 truncate max-w-[180px]">{m.model}</span>
                            <span className="text-xs text-red-400 font-medium">{m.errors}</span>
                          </div>
                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-red-500" style={{ width: `${(m.errors / maxErrors) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                <Card className="p-5">
                  <h3 className="font-bold text-white text-sm mb-4">Errors by Provider</h3>
                  <div className="space-y-3">
                    {(errorAnalytics?.byProvider || []).map(p => {
                      const maxErrors = Math.max(...(errorAnalytics?.byProvider.map(e => e.errors) || [1]), 1);
                      return (
                        <div key={p.provider}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-300">{p.provider}</span>
                            <span className="text-xs text-red-400 font-medium">{p.errors}</span>
                          </div>
                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-orange-500" style={{ width: `${(p.errors / maxErrors) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
              <Card className="p-5">
                <h3 className="font-bold text-white text-sm mb-4">Error Trend (Hourly)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={(errorAnalytics?.hourlyErrors || []).map(h => ({ ...h, hour: h.hour.slice(11, 16) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="hour" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="url(#errGrad)" strokeWidth={2} />
                    <defs><linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} /></linearGradient></defs>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}
        </>
      )}
    </motion.div>
  );
}
