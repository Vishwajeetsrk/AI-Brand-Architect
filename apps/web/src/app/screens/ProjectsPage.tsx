"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Filter, Plus, Grid, List, Wand2, MoreHorizontal, Search, Star, Clock, Users, FolderOpen, ArrowUpDown } from "lucide-react";
import { Btn, Card, Badge, PageHeader } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const PROJECTS = [
  { name: "Travelora Brand Kit", type: "Brand Studio", updated: "2h ago", status: "active" as const, thumb: "from-violet-500 to-blue-500", members: 3, progress: 78, starred: true },
  { name: "Q4 Marketing Campaign", type: "Marketing", updated: "5h ago", status: "active" as const, thumb: "from-pink-500 to-rose-500", members: 5, progress: 45, starred: false },
  { name: "Website Redesign v2", type: "Website Builder", updated: "1d ago", status: "review" as const, thumb: "from-blue-500 to-cyan-500", members: 4, progress: 92, starred: true },
  { name: "Social Media Pack", type: "Social Media", updated: "2d ago", status: "complete" as const, thumb: "from-emerald-500 to-teal-500", members: 2, progress: 100, starred: false },
  { name: "Logo Exploration", type: "Logo Maker", updated: "3d ago", status: "complete" as const, thumb: "from-amber-500 to-orange-500", members: 2, progress: 100, starred: false },
  { name: "Email Campaign Set", type: "Email Builder", updated: "1w ago", status: "complete" as const, thumb: "from-slate-500 to-slate-400", members: 3, progress: 100, starred: false },
  { name: "Brand Guidelines v3", type: "Brand Studio", updated: "4h ago", status: "active" as const, thumb: "from-purple-500 to-violet-500", members: 4, progress: 34, starred: false },
  { name: "Product Launch Deck", type: "Presentation", updated: "6h ago", status: "active" as const, thumb: "from-teal-500 to-cyan-500", members: 2, progress: 61, starred: true },
  { name: "Mobile App UI Kit", type: "UI/UX", updated: "2d ago", status: "review" as const, thumb: "from-orange-500 to-amber-500", members: 3, progress: 88, starred: false },
];

const STATUS_COLORS: Record<string, "violet" | "yellow" | "green"> = { active: "violet", review: "yellow", complete: "green" };
const SORT_OPTIONS = ["Name", "Updated", "Progress"];

export default function ProjectsPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Updated");
  const [starred, setStarred] = useState<string[]>(PROJECTS.filter(p => p.starred).map(p => p.name));

  const filtered = PROJECTS
    .filter(p => (tab === "all" || p.status === tab) && p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "Name") return a.name.localeCompare(b.name);
      if (sort === "Progress") return b.progress - a.progress;
      return 0;
    });

  const activeCount = PROJECTS.filter(p => p.status === "active").length;
  const toggleStar = (name: string) => setStarred(p => p.includes(name) ? p.filter(n => n !== name) : [...p, name]);

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Projects" subtitle={`${PROJECTS.length} total · ${activeCount} active`}
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
                className="w-40 bg-[#0c1022] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none" />
            </div>
            <Btn variant="primary" icon={Plus}>New Project</Btn>
          </div>
        }
      />
      <div className="grid grid-cols-4 gap-3 mb-6">
        <Card className="p-3 flex items-center gap-3"><FolderOpen size={18} className="text-violet-400" /><div><p className="text-sm font-bold text-white">24</p><p className="text-[10px] text-slate-500">Total</p></div></Card>
        <Card className="p-3 flex items-center gap-3"><Clock size={18} className="text-emerald-400" /><div><p className="text-sm font-bold text-white">{activeCount}</p><p className="text-[10px] text-slate-500">Active</p></div></Card>
        <Card className="p-3 flex items-center gap-3"><Star size={18} className="text-amber-400" /><div><p className="text-sm font-bold text-white">{starred.length}</p><p className="text-[10px] text-slate-500">Starred</p></div></Card>
        <Card className="p-3 flex items-center gap-3"><Users size={18} className="text-blue-400" /><div><p className="text-sm font-bold text-white">{PROJECTS.reduce((s, p) => s + p.members, 0)}</p><p className="text-[10px] text-slate-500">Contributors</p></div></Card>
      </div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1 bg-[#111336] p-1 rounded-lg">
          {["all", "active", "review", "complete"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${tab === t ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}
            >{t} {t === "all" ? `(${PROJECTS.length})` : t === "active" ? `(${activeCount})` : ""}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <ArrowUpDown size={12} /> Sort:
            {SORT_OPTIONS.map(s => (
              <button key={s} onClick={() => setSort(s)} className={`px-2 py-0.5 rounded ${sort === s ? "text-violet-400 bg-violet-500/10" : "hover:text-slate-300"}`}>{s}</button>
            ))}
          </div>
          <div className="flex gap-1 ml-2">
            <button onClick={() => setView("grid")} className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-violet-600/20 text-violet-400" : "text-slate-500 hover:text-slate-300"}`}><Grid size={15} /></button>
            <button onClick={() => setView("list")} className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-violet-600/20 text-violet-400" : "text-slate-500 hover:text-slate-300"}`}><List size={15} /></button>
          </div>
        </div>
      </div>
      <div className={view === "grid" ? "grid grid-cols-3 gap-4" : "space-y-2"}>
        {filtered.map((p, i) => {
          const isStarred = starred.includes(p.name);
          return (
            <motion.div key={p.name} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card onClick={() => navigate("brand-studio")} className={`cursor-pointer overflow-hidden group ${view === "list" ? "p-3 flex items-center gap-3" : ""}`}>
                {view === "grid" ? (
                  <>
                    <div className={`h-28 bg-gradient-to-br ${p.thumb} flex items-center justify-center relative`}>
                      <Wand2 size={24} className="text-white/60" />
                      <button onClick={e => { e.stopPropagation(); toggleStar(p.name); }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm transition-all ${isStarred ? "text-amber-400" : "text-white/60 hover:text-white opacity-0 group-hover:opacity-100"}`}
                      ><Star size={13} fill={isStarred ? "currentColor" : "none"} /></button>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="h-1 rounded-full bg-black/30 overflow-hidden">
                          <div className={`h-full rounded-full bg-white/60`} style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white text-sm">{p.name}</p>
                        <button className="text-slate-600 hover:text-slate-400"><MoreHorizontal size={14} /></button>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{p.type} · {p.updated}</p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge color={STATUS_COLORS[p.status]}>{p.status}</Badge>
                        <span className="text-[10px] text-slate-600 flex items-center gap-1"><Users size={10} />{p.members}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.thumb} flex-shrink-0 flex items-center justify-center`}>
                      <Wand2 size={16} className="text-white/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white text-sm">{p.name}</p>
                        {isStarred && <Star size={11} className="text-amber-400 fill-amber-400" />}
                      </div>
                      <p className="text-xs text-slate-500">{p.type} · {p.updated}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20">
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                      <Badge color={STATUS_COLORS[p.status]}>{p.status}</Badge>
                      <span className="text-xs text-slate-500"><Users size={12} className="inline mr-1" />{p.members}</span>
                      <button className="text-slate-600 hover:text-slate-400"><MoreHorizontal size={14} /></button>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
