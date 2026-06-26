"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Globe, Plus, Sparkles, Download, Upload, Eye, Edit2, MoreHorizontal,
  Search, Grid, List, Layout, Monitor, Smartphone, Trash2, Copy, ExternalLink,
  ChevronRight, FileText, Users, TrendingUp, Clock,
} from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader, Input, Toggle, Avatar } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const templates = [
  { name: "Portfolio Pro", desc: "Showcase your work", gradient: "from-violet-600 to-blue-600", pages: "6", style: "Modern" },
  { name: "Startup Launch", desc: "Tech & SaaS landing", gradient: "from-cyan-600 to-blue-600", pages: "8", style: "Bold" },
  { name: "E-commerce", desc: "Online storefront", gradient: "from-emerald-600 to-teal-600", pages: "12", style: "Clean" },
  { name: "Agency", desc: "Creative agency site", gradient: "from-pink-600 to-violet-600", pages: "10", style: "Premium" },
  { name: "Blog", desc: "Content publishing", gradient: "from-amber-600 to-orange-600", pages: "5", style: "Minimal" },
  { name: "Landing Page", desc: "High-conversion page", gradient: "from-red-600 to-pink-600", pages: "3", style: "Dynamic" },
];

const recentSites = [
  { name: "Travelora", url: "travelora.nexora.io", pages: 8, visitors: "12.4K", updated: "2h ago", status: "Published", progress: 100 },
  { name: "DesignStudio Pro", url: "designstudio.nexora.io", pages: 6, visitors: "8.2K", updated: "1d ago", status: "Published", progress: 100 },
  { name: "GreenLeaf Organics", url: "greenleaf.nexora.io", pages: 4, visitors: "—", updated: "3d ago", status: "Draft", progress: 45 },
  { name: "TechFlow SaaS", url: "techflow.nexora.io", pages: 10, visitors: "—", updated: "1w ago", status: "Draft", progress: 70 },
];

export default function WebsiteBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <motion.div {...pageAnim}>
      <PageHeader
        title="Website Builder"
        subtitle="Create stunning websites with AI-powered drag & drop"
        actions={<><Btn variant="secondary" size="sm" icon={Download}>Export</Btn><Btn variant="primary" icon={Sparkles}>AI Generate Site</Btn></>}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Sites" value="12" delta="+2 this month" icon={Globe} color="violet" />
        <StatCard label="Live Sites" value="8" icon={Monitor} color="emerald" />
        <StatCard label="Total Pages" value="86" delta="+12 this week" icon={FileText} color="blue" />
        <StatCard label="Total Visitors" value="28.6K" delta="+18.2%" icon={TrendingUp} color="cyan" />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Template Gallery</h3>
            <div className="flex items-center gap-2">
              <Input icon={Search} placeholder="Search templates..." value={search} onChange={setSearch} className="w-44" />
              <div className="flex gap-1">
                <button onClick={() => setView("grid")} className={`p-1.5 rounded-md ${view === "grid" ? "bg-violet-600/20 text-violet-400" : "text-slate-500"}`}><Grid size={14} /></button>
                <button onClick={() => setView("list")} className={`p-1.5 rounded-md ${view === "list" ? "bg-violet-600/20 text-violet-400" : "text-slate-500"}`}><List size={14} /></button>
              </div>
            </div>
          </div>
          <div className={view === "grid" ? "grid grid-cols-3 gap-3" : "space-y-2"}>
            {templates.map((t, i) => (
              view === "grid" ? (
                <button
                  key={t.name}
                  onClick={() => setSelectedTemplate(i)}
                  className={`text-left rounded-xl border overflow-hidden transition-all ${selectedTemplate === i ? "border-violet-500/50 ring-1 ring-violet-500/30" : "border-white/[0.06] hover:border-violet-500/30"}`}
                >
                  <div className={`h-24 bg-gradient-to-br ${t.gradient} flex items-center justify-center`}>
                    <Globe size={28} className="text-white/40" />
                  </div>
                  <div className="p-3 bg-card">
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge color="gray">{t.style}</Badge>
                      <span className="text-[10px] text-slate-600">{t.pages} pages</span>
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  key={t.name}
                  onClick={() => setSelectedTemplate(i)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedTemplate === i ? "border-violet-500/50 bg-violet-500/10" : "border-white/[0.06] hover:border-white/20"}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Globe size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.desc}</p>
                  </div>
                  <Badge color="gray">{t.style}</Badge>
                  <span className="text-xs text-slate-600">{t.pages} pages</span>
                </button>
              )
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-4">Site Preview</h3>
          <div className="flex items-center gap-1 mb-3 bg-[#111336] rounded-lg p-1 w-fit">
            {[
              { id: "desktop" as const, icon: Monitor },
              { id: "mobile" as const, icon: Smartphone },
            ].map((d) => {
              const Icon = d.icon;
              return (
                <button
                  key={d.id}
                  onClick={() => setPreviewDevice(d.id)}
                  className={`p-1.5 rounded-md transition-colors ${previewDevice === d.id ? "bg-violet-600/30 text-violet-400" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
          <div className={`bg-white/5 rounded-xl border border-white/[0.06] flex items-center justify-center relative ${previewDevice === "mobile" ? "w-[140px] h-[240px] mx-auto" : "h-[200px]"}`}>
            <div className="text-center">
              <Layout size={24} className="text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                {selectedTemplate !== null ? `Previewing "${templates[selectedTemplate].name}"` : "Select a template"}
              </p>
              {selectedTemplate !== null && (
                <Btn variant="outline" size="sm" className="mt-3" icon={Eye}>Live Preview</Btn>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm">Recent Sites</h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-[#111336] p-0.5 rounded-lg">
              {["all", "published", "draft"].map((t) => (
                <button key={t} className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-all ${t === "all" ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Site", "URL", "Pages", "Visitors", "Updated", "Status", "Progress", ""].map((h) => (
                  <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSites.map((s) => (
                <tr key={s.name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-3 py-3 text-sm font-semibold text-white">{s.name}</td>
                  <td className="px-3 py-3 text-xs text-slate-500">{s.url}</td>
                  <td className="px-3 py-3 text-xs text-slate-400">{s.pages}</td>
                  <td className="px-3 py-3 text-xs text-slate-400">{s.visitors}</td>
                  <td className="px-3 py-3 text-xs text-slate-500">{s.updated}</td>
                  <td className="px-3 py-3"><Badge color={s.status === "Published" ? "green" : "gray"}>{s.status}</Badge></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-500 hover:text-white"><Edit2 size={12} /></button>
                      <button className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-500 hover:text-white"><ExternalLink size={12} /></button>
                      <button className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-500 hover:text-white"><MoreHorizontal size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-5">
        <Card className="p-5 bg-gradient-to-br from-violet-600/15 to-blue-600/5 border-violet-500/20 flex items-center gap-4">
          <Sparkles size={24} className="text-violet-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-white">AI Site Generator</p>
            <p className="text-xs text-slate-500 mt-0.5">Describe your brand and let AI build it.</p>
          </div>
          <Btn variant="primary" size="sm" icon={Sparkles}>Generate</Btn>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-cyan-600/15 to-blue-600/5 border-cyan-500/20 flex items-center gap-4">
          <Download size={24} className="text-cyan-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Export Site</p>
            <p className="text-xs text-slate-500 mt-0.5">Download as HTML, React, or ZIP.</p>
          </div>
          <Btn variant="secondary" size="sm" icon={Download}>Export</Btn>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-emerald-600/15 to-teal-600/5 border-emerald-500/20 flex items-center gap-4">
          <Upload size={24} className="text-emerald-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Deploy Site</p>
            <p className="text-xs text-slate-500 mt-0.5">One-click deploy to your domain.</p>
          </div>
          <Btn variant="primary" size="sm" icon={Upload}>Deploy</Btn>
        </Card>
      </div>
    </motion.div>
  );
}
