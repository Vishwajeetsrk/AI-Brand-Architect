"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Filter, Plus, Grid, List, Wand2, MoreHorizontal } from "lucide-react";
import { Btn, Card, Badge, PageHeader } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function ProjectsPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [tab, setTab] = useState("all");
  const projects = [
    { name: "Travelora Brand Kit", type: "Brand Studio", updated: "2h ago", status: "active", thumb: "from-violet-500 to-blue-500" },
    { name: "Marketing Campaign Q4", type: "Marketing", updated: "5h ago", status: "active", thumb: "from-pink-500 to-rose-500" },
    { name: "Website Redesign v2", type: "Website Builder", updated: "1d ago", status: "review", thumb: "from-blue-500 to-cyan-500" },
    { name: "Social Media Pack", type: "Social Media", updated: "2d ago", status: "complete", thumb: "from-emerald-500 to-teal-500" },
    { name: "Logo Exploration", type: "Logo Maker", updated: "3d ago", status: "complete", thumb: "from-amber-500 to-orange-500" },
    { name: "Email Campaign Set", type: "Email Builder", updated: "1w ago", status: "complete", thumb: "from-slate-500 to-slate-400" },
  ];
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Projects" subtitle="24 projects &middot; 12 active"
        actions={<><Btn variant="secondary" icon={Filter} size="sm">Filter</Btn><Btn variant="primary" icon={Plus}>New Project</Btn></>}
      />
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1 bg-[#111336] p-1 rounded-lg">
          {["all", "active", "review", "complete"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${tab === t ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>{t}</button>
          ))}
        </div>
        <div className="flex gap-1">
          <button onClick={() => setView("grid")} className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-violet-600/20 text-violet-400" : "text-slate-500 hover:text-slate-300"}`}><Grid size={15} /></button>
          <button onClick={() => setView("list")} className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-violet-600/20 text-violet-400" : "text-slate-500 hover:text-slate-300"}`}><List size={15} /></button>
        </div>
      </div>
      <div className={view === "grid" ? "grid grid-cols-3 gap-4" : "space-y-2"}>
        {projects.filter((p) => tab === "all" || p.status === tab).map((p) => (
          <Card key={p.name} onClick={() => navigate("brand-studio")} className={view === "grid" ? "overflow-hidden" : "p-3 flex items-center gap-3"}>
            {view === "grid" ? (
              <>
                <div className={`h-28 bg-gradient-to-br ${p.thumb} flex items-center justify-center`}>
                  <Wand2 size={28} className="text-white/60" />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-white text-sm">{p.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{p.type} &middot; {p.updated}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge color={p.status === "complete" ? "green" : p.status === "review" ? "yellow" : "violet"}>{p.status}</Badge>
                    <button className="text-slate-600 hover:text-slate-400"><MoreHorizontal size={14} /></button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.thumb} flex-shrink-0`} />
                <div className="flex-1"><p className="font-semibold text-white text-sm">{p.name}</p><p className="text-xs text-slate-500">{p.type}</p></div>
                <Badge color={p.status === "complete" ? "green" : p.status === "review" ? "yellow" : "violet"}>{p.status}</Badge>
                <span className="text-xs text-slate-600">{p.updated}</span>
                <button className="text-slate-600 hover:text-slate-400"><MoreHorizontal size={14} /></button>
              </>
            )}
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
