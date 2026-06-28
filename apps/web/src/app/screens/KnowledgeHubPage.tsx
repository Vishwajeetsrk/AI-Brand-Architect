"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Search, BookOpen, Plus, FileText, Video, FileSpreadsheet, BarChart3, Download, Heart, Clock, Filter, Bookmark } from "lucide-react";
import { Btn, PageHeader, Card, Badge } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const CATEGORIES = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "articles", label: "Articles", icon: FileText },
  { id: "guides", label: "Guides", icon: BookOpen },
  { id: "videos", label: "Videos", icon: Video },
  { id: "pdfs", label: "PDFs", icon: FileSpreadsheet },
  { id: "datasets", label: "Datasets", icon: BarChart3 },
];

const ITEMS = [
  { title: "Introduction to AI Agents", type: "Article", date: "Nov 1", views: "2.8K", reads: "1.2K", featured: true, color: "from-violet-500 to-blue-500" },
  { title: "Building with LLMs", type: "Guide", date: "Oct 28", views: "2.3K", reads: "980", featured: true, color: "from-blue-500 to-cyan-500" },
  { title: "Prompt Engineering Guide", type: "Video", date: "Oct 25", views: "4.1K", reads: "2.3K", color: "from-pink-500 to-rose-500" },
  { title: "Brand Strategy 101", type: "PDF", date: "Oct 22", views: "1.9K", reads: "740", color: "from-amber-500 to-orange-500" },
  { title: "Data Analysis Methods", type: "Dataset", date: "Oct 20", views: "3.2K", reads: "1.5K", color: "from-emerald-500 to-teal-500" },
  { title: "Content Marketing Playbook", type: "Article", date: "Oct 18", views: "1.7K", reads: "680", color: "from-cyan-500 to-blue-500" },
  { title: "API Integration Patterns", type: "Guide", date: "Oct 15", views: "2.1K", reads: "890", color: "from-violet-500 to-purple-500" },
  { title: "SEO Fundamentals", type: "Video", date: "Oct 12", views: "5.6K", reads: "3.1K", color: "from-green-500 to-emerald-500" },
  { title: "UX Design Principles", type: "Article", date: "Oct 10", views: "3.8K", reads: "1.9K", color: "from-orange-500 to-red-500" },
  { title: "Machine Learning Basics", type: "PDF", date: "Oct 8", views: "4.2K", reads: "2.1K", color: "from-teal-500 to-cyan-500" },
  { title: "Email Marketing Guide", type: "Guide", date: "Oct 5", views: "1.4K", reads: "520", color: "from-blue-500 to-indigo-500" },
  { title: "Social Media Strategy", type: "Article", date: "Oct 3", views: "2.6K", reads: "1.1K", color: "from-pink-500 to-fuchsia-500" },
];

const TYPE_COLORS: Record<string, "violet" | "cyan" | "red" | "yellow" | "emerald"> = {
  Article: "violet", Guide: "cyan", Video: "red", PDF: "yellow", Dataset: "emerald",
};

export default function KnowledgeHubPage() {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const filtered = ITEMS.filter(i => (tab === "all" || i.type.toLowerCase() === tab) && i.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Knowledge Hub" subtitle="AI-powered content library with 48 resources"
        actions={<Btn variant="primary" size="sm" icon={Plus}>Add Content</Btn>}
      />
      <div className="grid grid-cols-4 gap-3 mb-6">
        <Card className="p-3 flex items-center gap-3"><FileText size={18} className="text-violet-400 flex-shrink-0" /><div><p className="text-sm font-bold text-white">48</p><p className="text-[10px] text-slate-500">Total Resources</p></div></Card>
        <Card className="p-3 flex items-center gap-3"><Download size={18} className="text-emerald-400 flex-shrink-0" /><div><p className="text-sm font-bold text-white">12.4K</p><p className="text-[10px] text-slate-500">Total Downloads</p></div></Card>
        <Card className="p-3 flex items-center gap-3"><Heart size={18} className="text-pink-400 flex-shrink-0" /><div><p className="text-sm font-bold text-white">3.2K</p><p className="text-[10px] text-slate-500">Favorites</p></div></Card>
        <Card className="p-3 flex items-center gap-3"><Clock size={18} className="text-amber-400 flex-shrink-0" /><div><p className="text-sm font-bold text-white">8</p><p className="text-[10px] text-slate-500">New this week</p></div></Card>
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search knowledge base..."
            className="w-full bg-[#0c1022] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none transition-colors" />
        </div>
        <Btn variant="secondary" size="sm" icon={Filter}>Filters</Btn>
      </div>
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {CATEGORIES.map(c => {
          const Icon = c.icon;
          return (
            <button key={c.id} onClick={() => setTab(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                tab === c.id ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "bg-[#0c1022] text-slate-600 hover:text-slate-300 border border-white/[0.05]"
              }`}
            >
              <Icon size={12} /> {c.label}
            </button>
          );
        })}
      </div>
      {filtered.filter(i => i.featured).length > 0 && tab === "all" && (
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Bookmark size={12} /> Featured</h3>
          <div className="grid grid-cols-2 gap-3">
            {filtered.filter(i => i.featured).map(f => (
              <Card key={f.title} className="p-0 overflow-hidden cursor-pointer group">
                <div className={`h-24 bg-gradient-to-br ${f.color} flex items-center justify-center relative`}>
                  <BookOpen size={22} className="text-white/40" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>
                <div className="p-4">
                  <Badge color={TYPE_COLORS[f.type]}>{f.type}</Badge>
                  <p className="font-bold text-white text-sm mt-1.5 mb-1">{f.title}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-600">
                    <span>{f.views} views</span> <span>{f.reads} reads</span> <span>{f.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-4 gap-3">
        {filtered.map(it => (
          <Card key={it.title} className="p-0 overflow-hidden cursor-pointer group">
            <div className={`h-20 bg-gradient-to-br ${it.color} flex items-center justify-center`}>
              <BookOpen size={18} className="text-white/40 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-3">
              <Badge color={TYPE_COLORS[it.type]}>{it.type}</Badge>
              <p className="font-semibold text-white text-xs mt-1.5 mb-1 line-clamp-2">{it.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-600">{it.date}</span>
                <span className="text-[10px] text-slate-600">{it.views} views</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
