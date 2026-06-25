import { useState } from "react";
import { motion } from "motion/react";
import { Search, Wand2 } from "lucide-react";
import { Btn, Card, Badge, Input, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function TemplatesPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const cats = ["All", "Logo", "Website", "Social", "Email", "Presentation", "Marketing"];
  const templates = Array.from({ length: 12 }, (_, i) => ({
    name: ["Modern Brand Kit", "Startup Logo", "Portfolio Site", "Product Launch", "Newsletter", "Pitch Deck", "Social Pack", "Ad Campaign", "Brand Guide", "Mobile App UI", "E-commerce", "Corporate"][i],
    cat: cats[1 + (i % 6)],
    thumb: ["from-violet-600 to-blue-600", "from-pink-600 to-violet-600", "from-cyan-600 to-blue-600", "from-emerald-600 to-teal-600", "from-amber-600 to-orange-600", "from-red-600 to-pink-600"][i % 6],
    uses: `${(i + 1) * 234}`,
  }));
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Templates" subtitle="1,248 professional templates" actions={<Input icon={Search} placeholder="Search templates..." value={search} onChange={setSearch} className="w-56" />} />
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {cats.map((c) => (
          <button key={c} onClick={() => setTab(c)} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${tab === c ? "bg-violet-600/30 text-violet-300 border border-violet-500/40" : "bg-[#111336] text-slate-500 hover:text-slate-300 border border-white/[0.05]"}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {templates.filter((t) => tab === "All" || t.cat === tab).map((t) => (
          <motion.div key={t.name} whileHover={{ y: -3 }} className="group">
            <Card className="overflow-hidden cursor-pointer">
              <div className={`h-36 bg-gradient-to-br ${t.thumb} flex items-center justify-center relative`}>
                <Wand2 size={24} className="text-white/50" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Btn variant="primary" size="sm">Use Template</Btn>
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-white text-xs">{t.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge color="gray">{t.cat}</Badge>
                  <span className="text-[10px] text-slate-600">{t.uses} uses</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
