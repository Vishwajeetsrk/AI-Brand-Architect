import { useState } from "react";
import { motion } from "motion/react";
import { Plus, FileText, CheckCircle, Folder, ImagePlus, Activity, Upload, Download, Code2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageHeader, Card, StatCard, Badge, Btn } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function CMSDashboardPage() {
  const contentData = [
    { d: "May 1", entries: 24, published: 18 }, { d: "May 5", entries: 32, published: 25 },
    { d: "May 10", entries: 28, published: 22 }, { d: "May 15", entries: 41, published: 35 },
    { d: "May 20", entries: 38, published: 31 }, { d: "May 25", entries: 45, published: 39 },
    { d: "May 30", entries: 52, published: 48 },
  ];
  const collections = [
    { name: "Blog Posts", entries: 932 }, { name: "Landing Pages", entries: 245 },
    { name: "Products", entries: 118 }, { name: "Authors", entries: 24 },
    { name: "Case Studies", entries: 67 },
  ];
  const recent = [
    { title: "AI in Education: 2024 Trends", type: "Blog Post", status: "published", date: "May 31" },
    { title: "AI-Powered Learning Platform", type: "Landing Page", status: "draft", date: "May 30" },
    { title: "Project Management with AI", type: "Blog Post", status: "published", date: "May 29" },
    { title: "10 Ways AI Saves Time", type: "Blog Post", status: "review", date: "May 28" },
    { title: "Build Your AI Dream Team", type: "Blog Post", status: "published", date: "May 27" },
  ];
  const totalEntries = 1248;
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="CMS Dashboard" subtitle="All your content data in one place"
        actions={<Btn variant="primary" size="sm" icon={Plus}>New Entry</Btn>}
      />
      <div className="grid grid-cols-5 gap-3 mb-4">
        {[
          { l: "Total Stories", v: "1,248", i: FileText, c: "violet" }, { l: "Published", v: "932", i: CheckCircle, c: "emerald" },
          { l: "Collections", v: "24", i: Folder, c: "blue" }, { l: "Media Files", v: "3,672", i: ImagePlus, c: "cyan" },
          { l: "API Requests", v: "24,891", i: Activity, c: "yellow" },
        ].map(s => <StatCard key={s.l} label={s.l} value={s.v} icon={s.i} color={s.c} />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">Content Overview</h3>
              <div className="flex gap-2">
                {[{ c: "#7c3aed", l: "Entries" }, { c: "#10b981", l: "Published" }].map(l => (
                  <div key={l.l} className="flex items-center gap-1">
                    <div className="w-2 h-1 rounded" style={{ background: l.c }} /><span className="text-[9px] text-slate-600">{l.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={contentData}>
                <defs>
                  <linearGradient id="cme" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} /><stop offset="100%" stopColor="#7c3aed" stopOpacity={0} /></linearGradient>
                  <linearGradient id="cmp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="d" tick={{ fill: "#475569", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#111830", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8, fontSize: 10 }} />
                <Area type="monotone" dataKey="entries" stroke="#7c3aed" fill="url(#cme)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="published" stroke="#10b981" fill="url(#cmp)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card className="overflow-hidden">
            <div className="p-3 border-b border-white/[0.05]"><h3 className="text-xs font-bold text-white">Recent Entries</h3></div>
            <div className="divide-y divide-white/[0.04]">
              {recent.map(e => (
                <div key={e.title} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-6 h-6 rounded-md bg-violet-500/15 flex items-center justify-center flex-shrink-0"><FileText size={11} className="text-violet-400" /></div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">{e.title}</p><p className="text-[10px] text-slate-600">{e.type}</p></div>
                  <Badge color={e.status === "published" ? "green" : e.status === "review" ? "yellow" : "gray"}>{e.status}</Badge>
                  <span className="text-[10px] text-slate-600">{e.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-3">Top Collections</h3>
            <div className="space-y-2.5">
              {collections.map((c, idx) => {
                const pct = Math.round((c.entries / totalEntries) * 100);
                const barColors = ["violet", "blue", "cyan", "emerald", "yellow"];
                const bc = barColors[idx % barColors.length];
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300">{c.name}</span>
                      <span className="text-[10px] font-bold text-violet-400">{c.entries}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full">
                      <div className={`h-1.5 bg-${bc}-500 rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-3">Quick Actions</h3>
            <div className="space-y-1.5">
              {([["New Blog Post", FileText], ["Upload Media", Upload], ["Create Collection", Folder], ["Import CSV", Download], ["API Docs", Code2]] as [string, React.ElementType][]).map(([l, Ic]) => (
                <button key={l} className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-white/[0.05] transition-colors group">
                  <div className="w-5 h-5 rounded-md bg-violet-500/15 flex items-center justify-center"><Ic size={10} className="text-violet-400" /></div>
                  <span className="text-[11px] text-slate-500 group-hover:text-white transition-colors">{l}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
