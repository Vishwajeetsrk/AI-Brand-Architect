"use client";
import { motion } from "motion/react";
import { Sparkles, Globe, Megaphone, ImagePlus, Layout, Monitor, ArrowRight } from "lucide-react";
import { Btn, Card, PageHeader } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function BrandStudioPage({ navigate }: { navigate: (s: Screen) => void }) {
  const tools = [
    { id: "logo-maker", name: "Logo Maker", desc: "Generate logos in seconds", icon: Sparkles, color: "from-violet-600 to-purple-600", count: "2.3K logos" },
    { id: "website-builder", name: "Website Builder", desc: "Build responsive websites", icon: Globe, color: "from-blue-600 to-cyan-600", count: "1.2K sites" },
    { id: "marketing", name: "Marketing Studio", desc: "Create marketing assets", icon: Megaphone, color: "from-pink-600 to-rose-600", count: "890 assets" },
    { id: "ai-image", name: "AI Image Generator", desc: "Generate stunning visuals", icon: ImagePlus, color: "from-cyan-600 to-blue-600", count: "5.6K images" },
    { id: "uiux", name: "UI/UX Designer", desc: "Design beautiful interfaces", icon: Layout, color: "from-amber-600 to-orange-600", count: "340 designs" },
    { id: "presentation", name: "Presentations", desc: "Create slide decks", icon: Monitor, color: "from-emerald-600 to-teal-600", count: "156 decks" },
  ] as const;
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Brand Studio" subtitle="AI-powered design tools for your brand" />
      <div className="grid grid-cols-3 gap-4">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <Card key={t.id} onClick={() => navigate(t.id as Screen)} glow className="p-5 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-white mb-1">{t.name}</h3>
              <p className="text-sm text-slate-500 mb-3">{t.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{t.count}</span>
                <Btn variant="outline" size="sm" onClick={() => navigate(t.id as Screen)}>Open <ArrowRight size={12} /></Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
