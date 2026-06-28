"use client";
import { motion } from "motion/react";
import { Sparkles, Globe, Megaphone, ImagePlus, Layout, Monitor, ArrowRight, Clock, TrendingUp, Palette, Layers, Zap, Star } from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const TOOLS = [
  { id: "logo-maker" as Screen, name: "Logo Maker", desc: "Generate professional logos in seconds", icon: Sparkles, color: "from-violet-600 to-purple-600", count: "2.3K created", gradient: "via-purple-500/10" },
  { id: "website-builder" as Screen, name: "Website Builder", desc: "Build responsive, stunning websites", icon: Globe, color: "from-blue-600 to-cyan-600", count: "1.2K sites", gradient: "via-blue-500/10" },
  { id: "marketing" as Screen, name: "Marketing Studio", desc: "Multi-channel campaign assets", icon: Megaphone, color: "from-pink-600 to-rose-600", count: "890 assets", gradient: "via-pink-500/10" },
  { id: "ai-image" as Screen, name: "AI Image Generator", desc: "Create photorealistic visuals", icon: ImagePlus, color: "from-cyan-600 to-blue-600", count: "5.6K images", gradient: "via-cyan-500/10" },
  { id: "uiux" as Screen, name: "UI/UX Designer", desc: "Design beautiful interfaces & prototypes", icon: Layout, color: "from-amber-600 to-orange-600", count: "340 designs", gradient: "via-amber-500/10" },
  { id: "presentation" as Screen, name: "Presentations", desc: "Create compelling slide decks", icon: Monitor, color: "from-emerald-600 to-teal-600", count: "156 decks", gradient: "via-emerald-500/10" },
];

const RECENT = [
  { action: "Logo generated", project: "Travelora", time: "2m ago", icon: Sparkles },
  { action: "Website updated", project: "Portfolio v3", time: "15m ago", icon: Globe },
  { action: "Campaign created", project: "Q4 Launch", time: "1h ago", icon: Megaphone },
  { action: "Image generated", project: "Hero Banner", time: "3h ago", icon: ImagePlus },
];

export default function BrandStudioPage({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Brand Studio" subtitle="AI-powered design tools for your brand"
        actions={<Btn variant="primary" icon={Sparkles} onClick={() => navigate("ai-image")}>Quick Create</Btn>}
      />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Projects" value="24" icon={Layers} color="violet" />
        <StatCard label="AI Generations" value="8,054" delta="+342 today" icon={Zap} color="blue" />
        <StatCard label="Team Members" value="12" icon={Star} color="amber" />
        <StatCard label="Avg Rating" value="4.8" icon={TrendingUp} color="emerald" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {TOOLS.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card onClick={() => navigate(t.id)} glow className="p-5 group cursor-pointer relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-0.5 text-sm">{t.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{t.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-600">{t.count}</span>
                    <Btn variant="outline" size="sm" onClick={() => navigate(t.id)}>Open <ArrowRight size={11} /></Btn>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><Clock size={14} className="text-violet-400" /> Recent Activity</h3>
          <div className="space-y-3">
            {RECENT.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300">{r.action} <span className="text-white font-semibold">{r.project}</span></p>
                  </div>
                  <span className="text-[10px] text-slate-600">{r.time}</span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><Palette size={14} className="text-violet-400" /> Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "New Logo", screen: "logo-maker" as Screen, icon: Sparkles },
              { label: "New Site", screen: "website-builder" as Screen, icon: Globe },
              { label: "New Campaign", screen: "marketing" as Screen, icon: Megaphone },
              { label: "New Image", screen: "ai-image" as Screen, icon: ImagePlus },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button key={a.label} onClick={() => navigate(a.screen)}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-violet-500/10 hover:border-violet-500/30 transition-all text-left group"
                >
                  <Icon size={16} className="text-violet-400 mb-1.5" />
                  <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">{a.label}</p>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
