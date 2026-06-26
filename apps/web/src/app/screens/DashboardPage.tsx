import { useState } from "react";
import { motion } from "motion/react";
import {
  FolderOpen, Layers, Sparkles, Users, Wand2, Star, Globe,
  Megaphone, ChevronRight, Crown, Plus, UserPlus, Download, BarChart3,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Btn, Card, Badge, StatCard, PageHeader } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function DashboardPage({ navigate }: { navigate: (s: Screen) => void }) {
  const stats = [
    { label: "Projects", value: "24", delta: "+3 this week", icon: FolderOpen, color: "violet" },
    { label: "Assets", value: "1,248", delta: "+156 this month", icon: Layers, color: "blue" },
    { label: "AI Generations", value: "3,672", delta: "+892 this month", icon: Sparkles, color: "cyan" },
    { label: "Team Members", value: "12", delta: "+2 this week", icon: Users, color: "emerald" },
  ];
  const recentProjects = [
    { name: "Travelora Brand Kit", type: "Brand Studio", updated: "2h ago", status: "active", progress: 75 },
    { name: "Marketing Campaign Q4", type: "Marketing Studio", updated: "5h ago", status: "active", progress: 40 },
    { name: "Website Redesign v2", type: "Website Builder", updated: "1d ago", status: "review", progress: 90 },
    { name: "Social Media Pack", type: "Social Media", updated: "2d ago", status: "complete", progress: 100 },
  ];
  const quickActions = [
    { label: "Make Coffee Brand Logo", icon: Sparkles, screen: "logo-maker" },
    { label: "AI Brand Generator", icon: Wand2, screen: "brand-studio" },
    { label: "Logo Maker", icon: Star, screen: "logo-maker" },
    { label: "Website Builder", icon: Globe, screen: "website-builder" },
    { label: "Marketing Studio", icon: Megaphone, screen: "marketing" },
  ] as const;
  const activityData = [
    { month: "Jan", projects: 4, assets: 120, generations: 280 },
    { month: "Feb", projects: 6, assets: 185, generations: 420 },
    { month: "Mar", projects: 8, assets: 240, generations: 580 },
    { month: "Apr", projects: 7, assets: 310, generations: 720 },
    { month: "May", projects: 11, assets: 390, generations: 890 },
    { month: "Jun", projects: 15, assets: 480, generations: 1100 },
    { month: "Jul", projects: 18, assets: 620, generations: 1480 },
    { month: "Aug", projects: 24, assets: 780, generations: 1820 },
  ];
  const recentActivity = [
    { action: "Logo Maker completed", time: "2m ago", icon: Sparkles, color: "violet" },
    { action: "Team member invited", time: "1h ago", icon: UserPlus, color: "blue" },
    { action: "Brand kit exported", time: "3h ago", icon: Download, color: "cyan" },
    { action: "Website published", time: "1d ago", icon: Globe, color: "emerald" },
    { action: "Analytics report ready", time: "2d ago", icon: BarChart3, color: "yellow" },
  ];

  return (
    <motion.div {...pageAnim}>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Alex! Here's what's happening."
        actions={<Btn variant="primary" icon={Plus} onClick={() => navigate("projects")}>New Project</Btn>}
      />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Growth Overview</h3>
              <div className="flex gap-2">
                {["7d", "30d", "90d", "1y"].map((t) => (
                  <button key={t} className={`text-xs px-2.5 py-1 rounded-md transition-all ${t === "30d" ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>{t}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="gen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="generations" stroke="#8b5cf6" fill="url(#gen)" strokeWidth={2} />
                <Area type="monotone" dataKey="assets" stroke="#3b82f6" fill="url(#ast)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Recent Projects</h3>
              <Btn variant="ghost" size="sm" onClick={() => navigate("projects")}>View all <ChevronRight size={12} /></Btn>
            </div>
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/30 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                    <Wand2 size={14} className="text-violet-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.type} &middot; {p.updated}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20">
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                    <Badge color={p.status === "complete" ? "green" : p.status === "review" ? "yellow" : "violet"}>
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.label} onClick={() => navigate(a.screen as Screen)} className="flex items-center gap-2.5 w-full p-2.5 rounded-lg hover:bg-white/[0.05] text-left transition-colors group">
                    <div className="w-6 h-6 rounded-md bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={12} className="text-violet-400" />
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-white transition-colors flex-1">{a.label}</span>
                    <ChevronRight size={11} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((a) => {
                const Icon = a.icon;
                const colorMap: Record<string, string> = {
                  violet: "bg-violet-500/15 text-violet-400",
                  blue: "bg-blue-500/15 text-blue-400",
                  cyan: "bg-cyan-500/15 text-cyan-400",
                  emerald: "bg-emerald-500/15 text-emerald-400",
                  yellow: "bg-amber-500/15 text-amber-400",
                };
                return (
                  <div key={a.action} className="flex items-start gap-2.5">
                    <div className={`w-6 h-6 rounded-lg ${colorMap[a.color] || "bg-white/5 text-slate-400"} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={11} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300">{a.action}</p>
                      <p className="text-[10px] text-slate-600">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-violet-600/15 to-blue-600/5 border-violet-500/20">
            <div className="flex items-start gap-3">
              <Crown size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">Upgrade to Pro</p>
                <p className="text-xs text-slate-500 mt-0.5 mb-3">Unlock unlimited AI generations and team features.</p>
                <Btn variant="primary" size="sm" onClick={() => navigate("billing")}>Upgrade Now</Btn>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
