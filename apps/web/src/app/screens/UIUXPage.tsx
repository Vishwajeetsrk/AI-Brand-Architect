"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Layout, Palette, Type, Square, Circle, Triangle, Grid3x3,
  Download, Eye, Edit2, MoreHorizontal, Plus, Search, Users,
  Monitor, Smartphone, Tablet, Layers, Paintbrush, SlidersHorizontal,
  ChevronRight, Check, Copy, ArrowRight,
} from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader, Input, Avatar, Toggle } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const colors = [
  { name: "Primary", hex: "#8b5cf6", css: "violet-500" },
  { name: "Secondary", hex: "#3b82f6", css: "blue-500" },
  { name: "Accent", hex: "#22d3ee", css: "cyan-400" },
  { name: "Background", hex: "#07081a", css: "slate-900" },
  { name: "Surface", hex: "#111336", css: "indigo-950" },
  { name: "Error", hex: "#ef4444", css: "red-500" },
  { name: "Success", hex: "#10b981", css: "emerald-500" },
  { name: "Warning", hex: "#f59e0b", css: "amber-500" },
];

const typography = [
  { name: "Heading 1", family: "Inter", size: "32px", weight: "800", line: "1.1" },
  { name: "Heading 2", family: "Inter", size: "24px", weight: "700", line: "1.2" },
  { name: "Heading 3", family: "Inter", size: "18px", weight: "600", line: "1.3" },
  { name: "Body", family: "Inter", size: "14px", weight: "400", line: "1.5" },
  { name: "Small", family: "Inter", size: "12px", weight: "400", line: "1.5" },
  { name: "Caption", family: "Inter", size: "10px", weight: "500", line: "1.4" },
];

const components = [
  { name: "Button", variants: "4", icon: Square, gradient: "from-violet-500 to-blue-500" },
  { name: "Card", variants: "3", icon: Layout, gradient: "from-cyan-500 to-blue-500" },
  { name: "Input", variants: "5", icon: Type, gradient: "from-pink-500 to-violet-500" },
  { name: "Badge", variants: "10", icon: Circle, gradient: "from-emerald-500 to-cyan-500" },
  { name: "Navigation", variants: "3", icon: Grid3x3, gradient: "from-amber-500 to-orange-500" },
  { name: "Modal", variants: "2", icon: Layers, gradient: "from-red-500 to-pink-500" },
];

const recentDesigns = [
  { name: "Dashboard v3", type: "Web App", updated: "1h ago", thumb: "from-violet-800 to-blue-900", collaborators: ["AJ", "SW", "MB"] },
  { name: "Landing Page", type: "Marketing", updated: "3h ago", thumb: "from-cyan-800 to-blue-900", collaborators: ["AJ", "SW"] },
  { name: "Mobile App UI", type: "iOS", updated: "1d ago", thumb: "from-pink-800 to-violet-900", collaborators: ["AJ"] },
  { name: "Admin Panel", type: "Web App", updated: "2d ago", thumb: "from-emerald-800 to-teal-900", collaborators: ["MB", "SW"] },
  { name: "Email Template", type: "Email", updated: "3d ago", thumb: "from-amber-800 to-orange-900", collaborators: ["AJ"] },
  { name: "Onboarding Flow", type: "Mobile", updated: "5d ago", thumb: "from-slate-800 to-slate-900", collaborators: ["AJ", "MB", "SW", "LD"] },
];

export default function UIUXPage() {
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "components">("colors");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <motion.div {...pageAnim}>
      <PageHeader
        title="UI/UX Designer"
        subtitle="Design system management and component library"
        actions={<><Btn variant="secondary" size="sm" icon={Download}>Export Specs</Btn><Btn variant="primary" icon={Plus}>New Design</Btn></>}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Design Systems" value="3" icon={Palette} color="violet" />
        <StatCard label="Components" value="48" delta="+6 this month" icon={Layers} color="blue" />
        <StatCard label="Team Members" value="12" icon={Users} color="cyan" />
        <StatCard label="Designs" value="156" delta="+24 this month" icon={Layout} color="emerald" />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Design System</h3>
            <div className="flex gap-1 bg-[#111336] p-0.5 rounded-lg">
              {(["colors", "typography", "components"] as const).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${activeTab === t ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>{t}</button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "colors" && (
              <motion.div key="colors" {...pageAnim}>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => copyColor(c.hex)}
                      className="text-left rounded-xl border border-white/[0.06] overflow-hidden hover:border-violet-500/30 transition-colors group"
                    >
                      <div className="h-14 flex items-center justify-center relative" style={{ background: c.hex }}>
                        {copiedColor === c.hex && (
                          <span className="text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur flex items-center gap-1">
                            <Check size={10} /> Copied
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 bg-card">
                        <p className="text-xs font-semibold text-white">{c.name}</p>
                        <p className="text-[10px] font-mono text-slate-500">{c.hex}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "typography" && (
              <motion.div key="type" {...pageAnim}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {["Style", "Family", "Size", "Weight", "Line Height", ""].map((h) => (
                          <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {typography.map((t) => (
                        <tr key={t.name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                          <td className="px-3 py-3 text-sm font-semibold text-white">{t.name}</td>
                          <td className="px-3 py-3 text-xs text-slate-400">{t.family}</td>
                          <td className="px-3 py-3 text-xs text-slate-400">{t.size}</td>
                          <td className="px-3 py-3 text-xs text-slate-400">{t.weight}</td>
                          <td className="px-3 py-3 text-xs text-slate-400">{t.line}</td>
                          <td className="px-3 py-3"><Badge color="gray">Inter</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "components" && (
              <motion.div key="comp" {...pageAnim}>
                <div className="grid grid-cols-3 gap-2">
                  {components.map((c) => {
                    const Icon = c.icon;
                    return (
                      <button key={c.name} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-left">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={15} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white">{c.name}</p>
                          <p className="text-[10px] text-slate-500">{c.variants} variants</p>
                        </div>
                        <ChevronRight size={12} className="text-slate-600" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-4">Spacing Scale</h3>
          <div className="space-y-2">
            {[
              { name: "4xs", px: "2px", size: 2 },
              { name: "3xs", px: "4px", size: 4 },
              { name: "2xs", px: "8px", size: 8 },
              { name: "xs", px: "12px", size: 12 },
              { name: "sm", px: "16px", size: 16 },
              { name: "md", px: "20px", size: 20 },
              { name: "lg", px: "24px", size: 24 },
              { name: "xl", px: "32px", size: 32 },
              { name: "2xl", px: "40px", size: 40 },
              { name: "3xl", px: "48px", size: 48 },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-3 py-1">
                <span className="text-xs text-slate-500 w-12">{s.name}</span>
                <div className="flex-1">
                  <div className="h-2 bg-violet-500/30 rounded" style={{ width: `${Math.min(s.size, 100)}%`, maxWidth: `${s.size}px`, minWidth: s.size > 8 ? s.size : 4 }} />
                </div>
                <span className="text-[10px] text-slate-600 w-12 text-right">{s.px}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm">Recent Designs</h3>
          <Btn variant="ghost" size="sm">View All <ChevronRight size={12} /></Btn>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {recentDesigns.map((d) => (
            <div key={d.name} className="group cursor-pointer">
              <Card className="overflow-hidden">
                <div className={`h-24 bg-gradient-to-br ${d.thumb} flex items-center justify-center relative`}>
                  <Layout size={22} className="text-white/30" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button className="p-1.5 bg-white/20 rounded-md backdrop-blur"><Eye size={12} className="text-white" /></button>
                    <button className="p-1.5 bg-white/20 rounded-md backdrop-blur"><Edit2 size={12} className="text-white" /></button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{d.name}</p>
                      <p className="text-[10px] text-slate-500">{d.type} · {d.updated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {d.collaborators.map((c, i) => (
                      <Avatar key={i} name={c} size="sm" />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
