import { motion } from "motion/react";
import { Bot, BrainCircuit, CheckCircle, TrendingUp, DollarSign, ListChecks, GitBranch, Lightbulb } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageHeader, Card, StatCard, Badge, Btn } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function MissionControlPage({ navigate: _nav }: { navigate: (s: Screen) => void }) {
  const perfData = [
    { t: "00:00", cpu: 42, mem: 68, tasks: 120 }, { t: "02:00", cpu: 55, mem: 72, tasks: 145 },
    { t: "04:00", cpu: 38, mem: 65, tasks: 98 }, { t: "06:00", cpu: 67, mem: 78, tasks: 178 },
    { t: "08:00", cpu: 71, mem: 80, tasks: 203 }, { t: "10:00", cpu: 58, mem: 74, tasks: 167 },
    { t: "12:00", cpu: 85, mem: 86, tasks: 241 }, { t: "14:00", cpu: 79, mem: 83, tasks: 219 },
    { t: "16:00", cpu: 64, mem: 76, tasks: 185 }, { t: "18:00", cpu: 53, mem: 70, tasks: 152 },
    { t: "20:00", cpu: 46, mem: 68, tasks: 134 }, { t: "22:00", cpu: 41, mem: 65, tasks: 118 },
  ];
  const taskQueue = [
    { agent: "Brand Content Agent", type: "Blog Post", priority: "High", status: "running" },
    { agent: "Data Analysis Agent", type: "Market Report", priority: "Med", status: "queued" },
    { agent: "Image Creator", type: "Social Assets", priority: "High", status: "running" },
    { agent: "Code Assistant", type: "API Integration", priority: "Low", status: "queued" },
    { agent: "SEO Agent", type: "Keyword Analysis", priority: "Med", status: "running" },
  ];
  const agentDir = [
    { name: "Brand Architect", tasks: 1248, rate: "99.1%", uptime: "99.9%", status: "active" },
    { name: "Content Writer", tasks: 892, rate: "98.3%", uptime: "99.7%", status: "active" },
    { name: "Data Analyst", tasks: 634, rate: "97.8%", uptime: "98.5%", status: "active" },
    { name: "Code Assistant", tasks: 421, rate: "99.5%", uptime: "100%", status: "active" },
    { name: "Image Creator", tasks: 312, rate: "96.2%", uptime: "97.8%", status: "maintenance" },
  ];
  const liveFeed = [
    { type: "success", msg: "Brand Content Pipeline completed", t: "Just now" },
    { type: "info", msg: "New agent task assigned: Market Research", t: "1m" },
    { type: "warning", msg: "GPT-4o API rate limit at 80%", t: "3m" },
    { type: "success", msg: "Blog post published successfully", t: "5m" },
    { type: "info", msg: "Workflow triggered: Daily SEO Report", t: "8m" },
    { type: "error", msg: "Image generation timed out - retrying", t: "12m" },
    { type: "success", msg: "MCP Figma sync complete", t: "15m" },
    { type: "info", msg: "New team member joined workspace", t: "22m" },
  ];
  return (
    <motion.div {...pageAnim}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-bold text-white">AI Mission Control</h1>
          <p className="text-[10px] text-slate-600">Real-time command center for all AI agents, tasks, and operations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-slate-600">SYSTEM TIME</p>
            <p className="text-xs font-mono text-violet-400">08:42:15 UTC</p>
          </div>
          <Btn variant="secondary" size="sm" icon={undefined}>Refresh</Btn>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {[
          { label: "Active Agents", value: "28", icon: Bot, color: "violet" },
          { label: "Running Tasks", value: "156", icon: ListChecks, color: "cyan" },
          { label: "Success Rate", value: "97.8%", icon: CheckCircle, color: "emerald" },
          { label: "Revenue Impact", value: "1.42x", icon: TrendingUp, color: "blue" },
          { label: "Infra Cost", value: "$48.72", icon: DollarSign, color: "yellow" },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="grid grid-cols-12 gap-3 mb-3">
        <Card className="col-span-4 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white">Mission Overview</h3>
            <Badge color="green">● All Systems Go</Badge>
          </div>
          <div className="relative h-48 flex items-center justify-center">
            {[80, 56, 32].map((r, i) => (
              <div key={r} className="absolute rounded-full border border-violet-500/20" style={{ width: r * 2, height: r * 2, left: `calc(50% - ${r}px)`, top: `calc(50% - ${r}px)` }}>
                {[0, 1, 2].map(j => {
                  const angle = (j * (360 / 3) + i * 30) * (Math.PI / 180);
                  const x = r * Math.cos(angle);
                  const y = r * Math.sin(angle);
                  return <div key={j} className="absolute w-2.5 h-2.5 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" style={{ left: `calc(50% + ${x}px - 5px)`, top: `calc(50% + ${y}px - 5px)` }} />;
                })}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center z-10 shadow-xl shadow-violet-900/60">
              <BrainCircuit size={16} className="text-white" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {[{ l: "Agents", v: "28" }, { l: "Models", v: "8" }, { l: "MCP Tools", v: "14" }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-sm font-bold text-violet-400">{s.v}</p>
                <p className="text-[9px] text-slate-600">{s.l}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="col-span-5 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white">System Performance</h3>
            <div className="flex gap-3">
              {[{ c: "#7c3aed", l: "CPU %" }, { c: "#0ea5e9", l: "Memory %" }, { c: "#10b981", l: "Tasks" }].map(l => (
                <div key={l.l} className="flex items-center gap-1">
                  <div className="w-2 h-1 rounded" style={{ background: l.c }} /><span className="text-[9px] text-slate-600">{l.l}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={perfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="t" tick={{ fill: "#475569", fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 8 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111830", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8, fontSize: 10 }} />
              <Line type="monotone" dataKey="cpu" stroke="#7c3aed" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="mem" stroke="#0ea5e9" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="col-span-3 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white">Live Feed</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
              <span className="text-[9px] text-slate-600">Live</span>
            </div>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-48">
            {liveFeed.map((f, i) => {
              const dotColors: Record<string, string> = {
                emerald: "bg-emerald-500 shadow-emerald-500/50",
                blue: "bg-blue-500 shadow-blue-500/50",
                yellow: "bg-amber-500 shadow-amber-500/50",
                red: "bg-red-500 shadow-red-500/50",
              };
              const colMap: Record<string, string> = { success: "emerald", info: "blue", warning: "yellow", error: "red" };
              const dotColor = dotColors[colMap[f.type] ?? "gray"] ?? "bg-white/20";
              return (
                <div key={i} className="flex items-start gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 shadow-lg ${dotColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 leading-relaxed">{f.msg}</p>
                  </div>
                  <span className="text-[9px] text-slate-700 flex-shrink-0">{f.t}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-12 gap-3">
        <Card className="col-span-5 overflow-hidden">
          <div className="p-3 border-b border-white/[0.05] flex items-center justify-between">
            <h3 className="text-xs font-bold text-white">Task Queue</h3>
            <Badge color="violet">{taskQueue.length} tasks</Badge>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {taskQueue.map((t, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/[0.02] transition-colors">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-lg ${t.status === "running" ? "bg-emerald-500 shadow-emerald-500/50" : "bg-white/20"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white truncate">{t.agent}</p>
                  <p className="text-[9px] text-slate-600">{t.type}</p>
                </div>
                <Badge color={t.priority === "High" ? "red" : t.priority === "Med" ? "yellow" : "gray"}>{t.priority}</Badge>
                <Badge color={t.status === "running" ? "cyan" : "gray"}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="col-span-4 overflow-hidden">
          <div className="p-3 border-b border-white/[0.05]"><h3 className="text-xs font-bold text-white">Agent Directory</h3></div>
          <div className="divide-y divide-white/[0.04]">
            {agentDir.map(a => (
              <div key={a.name} className="flex items-center gap-2 px-3 py-2 hover:bg-white/[0.02]">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-lg ${a.status === "active" ? "bg-emerald-500 shadow-emerald-500/50" : "bg-amber-500 shadow-amber-500/50"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white truncate">{a.name}</p>
                  <p className="text-[9px] text-slate-600">{a.tasks} tasks</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-emerald-400">{a.rate}</p>
                  <p className="text-[9px] text-slate-600">{a.uptime}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="col-span-3 space-y-3">
          <Card className="p-3">
            <h3 className="text-[11px] font-bold text-white mb-2">AI Insights</h3>
            <div className="space-y-1.5">
              {["Content Writer at 94% capacity", "GPT-4o costs up 18% - switch to Claude Haiku", "42 hours saved via automation this week", "Success rate +2.1% after optimization"].map((t, i) => (
                <div key={i} className="flex items-start gap-1.5 p-1.5 rounded-md bg-violet-500/5 border border-violet-500/10">
                  <Lightbulb size={9} className="text-violet-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] text-slate-400">{t}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-3">
            <h3 className="text-[11px] font-bold text-white mb-2">Shortcuts</h3>
            <div className="space-y-1">
              {([["New Agent", Bot], ["New Workflow", GitBranch], ["Playground", BrainCircuit]] as [string, React.ElementType][]).map(([l, Ic]) => (
                <button key={l} className="flex items-center gap-1.5 w-full p-1.5 rounded-md hover:bg-white/[0.04] transition-colors">
                  <Ic size={10} className="text-violet-400" />
                  <span className="text-[10px] text-slate-500 hover:text-white transition-colors">{l}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
