"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Search, Wand2, Heart, Download, TrendingUp, Clock, Grid, LayoutList, Filter } from "lucide-react";
import { Btn, Card, Badge, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const CATEGORIES = ["All", "Logo", "Website", "Social", "Email", "Presentation", "Marketing", "Print", "Branding"];

const TEMPLATES = [
  { name: "Modern Brand Kit", cat: "Branding", gradient: "from-violet-600 to-blue-600", uses: "12.4K", save: "2.3K", badge: "Popular" },
  { name: "Startup Logo Pack", cat: "Logo", gradient: "from-pink-600 to-violet-600", uses: "9.8K", save: "1.8K", badge: "New" },
  { name: "Portfolio Site", cat: "Website", gradient: "from-cyan-600 to-blue-600", uses: "8.2K", save: "1.5K" },
  { name: "Product Launch", cat: "Marketing", gradient: "from-emerald-600 to-teal-600", uses: "7.1K", save: "1.2K", badge: "Popular" },
  { name: "Newsletter Pro", cat: "Email", gradient: "from-amber-600 to-orange-600", uses: "6.5K", save: "980" },
  { name: "Pitch Deck", cat: "Presentation", gradient: "from-red-600 to-pink-600", uses: "5.9K", save: "890" },
  { name: "Social Media Pack", cat: "Social", gradient: "from-blue-600 to-indigo-600", uses: "5.2K", save: "760", badge: "Trending" },
  { name: "Ad Campaign", cat: "Marketing", gradient: "from-fuchsia-600 to-purple-600", uses: "4.8K", save: "720" },
  { name: "Brand Guide", cat: "Branding", gradient: "from-slate-600 to-slate-500", uses: "4.1K", save: "650" },
  { name: "Mobile App UI", cat: "Website", gradient: "from-teal-600 to-cyan-600", uses: "3.7K", save: "590" },
  { name: "E-commerce Store", cat: "Website", gradient: "from-green-600 to-emerald-600", uses: "3.2K", save: "540" },
  { name: "Corporate Identity", cat: "Branding", gradient: "from-gray-600 to-slate-600", uses: "2.9K", save: "490" },
];

const BADGE_COLORS: Record<string, "violet" | "blue" | "emerald" | "amber"> = {
  Popular: "violet", New: "blue", Trending: "emerald",
};

export default function TemplatesPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);
  const filtered = TEMPLATES.filter(t => (tab === "All" || t.cat === tab) && t.name.toLowerCase().includes(search.toLowerCase()));
  const toggleFav = (name: string) => setFavorites(p => p.includes(name) ? p.filter(n => n !== name) : [...p, name]);

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Templates" subtitle="1,248 professional templates · Updated weekly"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                className="w-44 bg-[#0c1022] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none" />
            </div>
            <Btn variant="primary" size="sm" icon={Wand2}>Use AI</Btn>
          </div>
        }
      />
      <div className="grid grid-cols-4 gap-3 mb-6">
        <Card className="p-3 flex items-center gap-3"><Wand2 size={18} className="text-violet-400" /><div><p className="text-sm font-bold text-white">1,248</p><p className="text-[10px] text-slate-500">Templates</p></div></Card>
        <Card className="p-3 flex items-center gap-3"><Download size={18} className="text-emerald-400" /><div><p className="text-sm font-bold text-white">84.6K</p><p className="text-[10px] text-slate-500">Total Uses</p></div></Card>
        <Card className="p-3 flex items-center gap-3"><TrendingUp size={18} className="text-blue-400" /><div><p className="text-sm font-bold text-white">24</p><p className="text-[10px] text-slate-500">New This Week</p></div></Card>
        <Card className="p-3 flex items-center gap-3"><Clock size={18} className="text-amber-400" /><div><p className="text-sm font-bold text-white">{favorites.length}</p><p className="text-[10px] text-slate-500">Saved</p></div></Card>
      </div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setTab(c)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                tab === c ? "bg-violet-600/25 text-violet-300 border border-violet-500/40" : "bg-[#0c1022] text-slate-500 hover:text-slate-300 border border-white/[0.05]"
              }`}
            >{c}</button>
          ))}
        </div>
        <div className="flex gap-1 ml-3">
          <button onClick={() => setView("grid")} className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-violet-600/20 text-violet-400" : "text-slate-500 hover:text-slate-300"}`}><Grid size={14} /></button>
          <button onClick={() => setView("list")} className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-violet-600/20 text-violet-400" : "text-slate-500 hover:text-slate-300"}`}><LayoutList size={14} /></button>
        </div>
      </div>
      <div className={view === "grid" ? "grid grid-cols-4 gap-4" : "space-y-2"}>
        {filtered.map(t => {
          const isFav = favorites.includes(t.name);
          return (
            <motion.div key={t.name} layout whileHover={{ y: view === "grid" ? -3 : 0 }}>
              <Card className={`overflow-hidden cursor-pointer group ${view === "list" ? "p-3 flex items-center gap-3" : ""}`}>
                {view === "grid" ? (
                  <>
                    <div className={`h-36 bg-gradient-to-br ${t.gradient} flex items-center justify-center relative`}>
                      <Wand2 size={22} className="text-white/50" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Btn variant="primary" size="sm">Use Template</Btn>
                      </div>
                      {t.badge && (
                        <div className="absolute top-2 left-2">
                          <Badge color={BADGE_COLORS[t.badge] || "violet"}>{t.badge}</Badge>
                        </div>
                      )}
                      <button onClick={e => { e.stopPropagation(); toggleFav(t.name); }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm transition-all ${isFav ? "text-pink-400" : "text-white/60 hover:text-white"}`}
                      ><Heart size={13} fill={isFav ? "currentColor" : "none"} /></button>
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-white text-xs">{t.name}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <Badge color="gray">{t.cat}</Badge>
                        <span className="text-[10px] text-slate-600">{t.uses} uses</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${t.gradient} flex-shrink-0 flex items-center justify-center`}>
                      <Wand2 size={16} className="text-white/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.cat} · {t.uses} uses</p>
                    </div>
                    {t.badge && <Badge color={BADGE_COLORS[t.badge] || "violet"} className="mr-2">{t.badge}</Badge>}
                    <Btn variant="primary" size="sm">Use</Btn>
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
