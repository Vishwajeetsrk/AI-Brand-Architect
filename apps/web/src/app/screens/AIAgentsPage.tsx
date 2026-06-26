"use client";
import { motion } from "motion/react";
import { Bot, CheckCircle, Zap, Activity, Sparkles, Globe, PenTool, Image, Code2 } from "lucide-react";
import { Card, Badge, StatCard, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const AGENTS = [
  { name: "Brand Architect", desc: "Designs complete brand identities", icon: Sparkles, color: "from-violet-600 to-blue-600", status: "active" as const, tasks: 1247, progress: 82 },
  { name: "Logo Generator", desc: "Creates professional logos", icon: PenTool, color: "from-cyan-600 to-blue-600", status: "active" as const, tasks: 892, progress: 65 },
  { name: "Website Builder", desc: "Builds responsive websites", icon: Globe, color: "from-emerald-600 to-teal-600", status: "active" as const, tasks: 567, progress: 91 },
  { name: "Content Writer", desc: "Generates marketing copy", icon: PenTool, color: "from-pink-600 to-violet-600", status: "idle" as const, tasks: 2103, progress: 24 },
  { name: "Image Generator", desc: "Creates stunning visuals", icon: Image, color: "from-amber-600 to-orange-600", status: "active" as const, tasks: 3456, progress: 78 },
  { name: "Code Assistant", desc: "Helps with code generation", icon: Code2, color: "from-red-600 to-pink-600", status: "idle" as const, tasks: 789, progress: 45 },
];

export default function AIAgentsPage() {
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="AI Agents" subtitle="Autonomous AI workers that handle your tasks" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Active Agents" value="4" icon={Bot} color="violet" />
        <StatCard label="Tasks Completed" value="8,054" delta="+342 today" icon={CheckCircle} color="emerald" />
        <StatCard label="Avg Response" value="1.2s" icon={Zap} color="cyan" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card key={agent.name} className="p-5">
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
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-emerald-400" : "bg-slate-500"}`} />
                    {agent.status}
                  </span>
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>{agent.tasks.toLocaleString()} tasks completed</span>
                <span>{agent.progress}% load</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                />
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
