"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Search, BookOpen, Plus } from "lucide-react";
import { Btn, PageHeader, Card, Input, Badge } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function KnowledgeHubPage() {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const cats = ["All", "Articles", "Guides", "Videos", "PDFs", "Datasets"];
  const items = Array.from({ length: 12 }, (_, i) => ({
    title: ["Introduction to AI Agents", "Building with LLMs", "Prompt Engineering Guide", "Brand Strategy 101", "Data Analysis Methods", "Content Marketing Playbook", "API Integration Patterns", "SEO Fundamentals", "UX Design Principles", "Machine Learning Basics", "Email Marketing Guide", "Social Media Strategy"][i],
    type: ["Article", "Guide", "Video", "PDF", "Dataset", "Article", "Guide", "Video", "Article", "PDF", "Guide", "Article"][i],
    date: ["Nov 1", "Oct 28", "Oct 25", "Oct 22", "Oct 20", "Oct 18", "Oct 15", "Oct 12", "Oct 10", "Oct 8", "Oct 5", "Oct 3"][i],
    views: `${(i + 1) * 234}`,
  }));
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Knowledge Hub" subtitle="Your AI-powered content library"
        actions={<Btn variant="primary" size="sm" icon={Plus}>Add Content</Btn>}
      />
      <Card className="p-3 mb-4"><Input icon={Search} placeholder="Search knowledge base..." value={q} onChange={setQ} /></Card>
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {cats.map(c => (
          <button key={c} onClick={() => setTab(c.toLowerCase())} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${tab === c.toLowerCase() ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "bg-[#0c1022] text-slate-600 hover:text-slate-300 border border-white/[0.05]"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {items.map(it => (
          <Card key={it.title} className="p-4 group cursor-pointer">
            <div className="h-20 rounded-lg bg-gradient-to-br from-violet-600/20 to-blue-600/10 flex items-center justify-center mb-3 group-hover:from-violet-600/30 transition-all">
              <BookOpen size={20} className="text-violet-400" />
            </div>
            <Badge color={it.type === "Video" ? "red" : it.type === "PDF" ? "yellow" : it.type === "Guide" ? "cyan" : "violet"}>{it.type}</Badge>
            <p className="font-semibold text-white text-xs mt-1.5 mb-1 line-clamp-2">{it.title}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600">{it.date}</span>
              <span className="text-[10px] text-slate-600">{it.views} views</span>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
