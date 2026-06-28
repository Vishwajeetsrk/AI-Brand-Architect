"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Bot, CheckCircle, Zap, Activity, Sparkles, Globe, PenTool, Image, Code2, Plus, Play, Pause, Clock, BarChart3, Settings } from "lucide-react";
import { Card, Badge, StatCard, PageHeader, Btn } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const AGENTS = [
  { name: "Brand Architect", desc: "Designs complete brand identities", icon: Sparkles, color: "from-violet-600 to-blue-600", status: "active" as const, tasks: 1247, progress: 82, model: "GPT-4o", uptime: "99.8%" },
  { name: "Logo Generator", desc: "Creates professional logos", icon: PenTool, color: "from-cyan-600 to-blue-600", status: "active" as const, tasks: 892, progress: 65, model: "DALL-E 3", uptime: "99.2%" },
  { name: "Website Builder", desc: "Builds responsive websites", icon: Globe, color: "from-emerald-600 to-teal-600", status: "active" as const, tasks: 567, progress: 91, model: "Claude 3.5", uptime: "100%" },
  { name: "Content Writer", desc: "Generates marketing copy", icon: PenTool, color: "from-pink-600 to-violet-600", status: "idle" as const, tasks: 2103, progress: 24, model: "GPT-4o", uptime: "99.5%" },
  { name: "Image Generator", desc: "Creates stunning visuals", icon: Image, color: "from-amber-600 to-orange-600", status: "active" as const, tasks: 3456, progress: 78, model: "Stable Diffusion", uptime: "98.9%" },
  { name: "Code Assistant", desc: "Helps with code generation", icon: Code2, color: "from-red-600 to-pink-600", status: "idle" as const, tasks: 789, progress: 45, model: "Claude 3.5", uptime: "99.7%" },
];

const ACTIVITY = [
  { agent: "Brand Architect", action: "Completed brand kit for 'Travelora'", time: "2m ago" },
  { agent: "Logo Generator", action: "Generated 12 logo variations", time: "15m ago" },
  { agent: "Image Generator", action: "Created hero banner assets", time: "1h ago" },
  { agent: "Website Builder", action: "Published site update v2.4", time: "3h ago" },
];

export default function AIAgentsPage() {
  const [agentFilter, setAgentFilter] = useState("all");
  const filtered = agentFilter === "all" ? AGENTS : AGENTS.filter(a => a.status === agentFilter);

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="AI Agents" subtitle="Autonomous AI workers that handle your tasks"
        actions={<Btn variant="primary" icon={Plus}>Deploy New Agent</Btn>}
      />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Agents" value={AGENTS.filter(a => a.status === "active").length.toString()} icon={Bot} color="violet" />
        <StatCard label="Tasks Completed" value="8,054" delta="+342 today" icon={CheckCircle} color="emerald" />
        <StatCard label="Avg Response Time" value="1.2s" icon={Zap} color="cyan" />
        <StatCard label="Uptime" value="99.5%" icon={Activity} color="blue" />
      </div>
      <div className="flex gap-1.5 mb-5">
        {[{ id: "all", label: "All Agents" }, { id: "active", label: "Active" }, { id: "idle", label: "Idle" }].map(f => (
          <button key={f.id} onClick={() => setAgentFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              agentFilter === f.id ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "bg-[#0c1022] text-slate-500 hover:text-slate-300 border border-white/[0.05]"
            }`}
          >{f.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {filtered.map((agent, i) => {
          const Icon = agent.icon;
          return (
            <motion.div key={agent.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${agent.color}`} />
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{agent.name}</h3>
                      <p className="text-xs text-slate-500">{agent.desc}</p>
                    </div>
                  </div>
                  <Badge color={agent.status === "active" ? "green" : "gray"}>
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                      {agent.status}
                    </span>
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-white/[0.03]"><p className="text-[10px] text-slate-600">Model</p><p className="text-xs font-semibold text-white mt-0.5">{agent.model}</p></div>
                  <div className="p-2 rounded-lg bg-white/[0.03]"><p className="text-[10px] text-slate-600">Uptime</p><p className="text-xs font-semibold text-white mt-0.5">{agent.uptime}</p></div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>{agent.tasks.toLocaleString()} tasks</span>
                  <span>{agent.progress}% load</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 mb-4">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${agent.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-1.5 rounded-full bg-gradient-to-r ${agent.color}`}
                  />
                </div>
                <div className="flex gap-2">
                  <Btn variant="primary" size="sm" className="flex-1 justify-center" icon={agent.status === "active" ? Pause : Play}>
                    {agent.status === "active" ? "Pause" : "Resume"}
                  </Btn>
                  <Btn variant="outline" size="sm" icon={BarChart3} />
                  <Btn variant="outline" size="sm" icon={Settings} />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <Card className="p-5">
        <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><Clock size={14} className="text-violet-400" /> Recent Activity</h3>
        <div className="space-y-3">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-sm pb-3 border-b border-white/[0.04] last:border-0">
              <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                <Activity size={12} className="text-violet-400" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-white text-xs">{a.agent}</span>
                <span className="text-slate-400 text-xs"> {a.action}</span>
              </div>
              <span className="text-[10px] text-slate-600">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
