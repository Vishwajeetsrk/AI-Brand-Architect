import { useState } from "react";
import { motion } from "motion/react";
import { Monitor, Plus, Download, Play, Star, Clock } from "lucide-react";
import { PageHeader, Card, Btn, Badge } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function PresentationPage() {
  const [tab, setTab] = useState("all");
  const templates = [
    { name: "Brand Deck", slides: 12, thumb: "from-violet-600 to-blue-600" },
    { name: "Pitch Deck", slides: 10, thumb: "from-pink-600 to-rose-600" },
    { name: "Marketing Report", slides: 8, thumb: "from-blue-600 to-cyan-600" },
    { name: "Product Launch", slides: 15, thumb: "from-emerald-600 to-teal-600" },
    { name: "Portfolio Review", slides: 6, thumb: "from-amber-600 to-orange-600" },
    { name: "Annual Report", slides: 20, thumb: "from-slate-600 to-slate-500" },
  ];
  const recent = [
    { name: "Q4 Brand Strategy", slides: 14, updated: "2h ago", status: "draft" },
    { name: "Product Launch 2024", slides: 18, updated: "1d ago", status: "review" },
    { name: "Monthly Marketing Report", slides: 10, updated: "3d ago", status: "complete" },
    { name: "Investor Pitch v2", slides: 12, updated: "1w ago", status: "complete" },
  ];
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Presentations" subtitle="Create stunning slide decks"
        actions={<Btn variant="primary" icon={Plus}>New Presentation</Btn>}
      />
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center"><Monitor size={18} className="text-violet-400" /></div>
          <div><p className="text-lg font-bold text-white">24</p><p className="text-xs text-slate-500">Total Decks</p></div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center"><Star size={18} className="text-emerald-400" /></div>
          <div><p className="text-lg font-bold text-white">156</p><p className="text-xs text-slate-500">Total Slides</p></div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center"><Download size={18} className="text-cyan-400" /></div>
          <div><p className="text-lg font-bold text-white">18</p><p className="text-xs text-slate-500">Exported</p></div>
        </Card>
      </div>
      <h3 className="text-sm font-bold text-white mb-3">Templates</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {templates.map((t) => (
          <Card key={t.name} className="overflow-hidden group cursor-pointer">
            <div className={`h-24 bg-gradient-to-br ${t.thumb} flex items-center justify-center relative`}>
              <Monitor size={20} className="text-white/50" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Btn variant="primary" size="sm" icon={Play}>Preview</Btn>
              </div>
            </div>
            <div className="p-3">
              <p className="font-semibold text-white text-sm">{t.name}</p>
              <p className="text-xs text-slate-500">{t.slides} slides</p>
            </div>
          </Card>
        ))}
      </div>
      <h3 className="text-sm font-bold text-white mb-3">Recent Presentations</h3>
      <Card className="overflow-hidden">
        <div className="divide-y divide-white/[0.04]">
          {recent.map((r) => (
            <div key={r.name} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/30 to-blue-600/20 flex items-center justify-center">
                <Monitor size={14} className="text-violet-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{r.name}</p>
                <p className="text-xs text-slate-500">{r.slides} slides · {r.updated}</p>
              </div>
              <Badge color={r.status === "complete" ? "green" : r.status === "review" ? "yellow" : "gray"}>{r.status}</Badge>
              <Btn variant="ghost" size="sm" icon={Play} />
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
