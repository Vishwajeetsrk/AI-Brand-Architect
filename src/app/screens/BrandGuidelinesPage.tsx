import { motion } from "motion/react";
import { Palette, Type, Move, Eye } from "lucide-react";
import { Card, Badge, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const COLORS = [
  { name: "Primary Purple", hex: "#7C3AED", text: "#7C3AED" },
  { name: "Dark Navy", hex: "#0F172A", text: "#0F172A" },
  { name: "Electric Blue", hex: "#3B82F6", text: "#3B82F6" },
  { name: "Cyan", hex: "#06B6D4", text: "#06B6D4" },
  { name: "Warm White", hex: "#F8FAFC", text: "#F8FAFC" },
  { name: "Slate Gray", hex: "#64748B", text: "#64748B" },
];

const TYPOGRAPHY = [
  { name: "Plus Jakarta Sans", weight: "ExtraLight 200", size: "12px", usage: "Small captions" },
  { name: "Plus Jakarta Sans", weight: "Regular 400", size: "14-16px", usage: "Body text" },
  { name: "Plus Jakarta Sans", weight: "SemiBold 600", size: "18-24px", usage: "Subheadings" },
  { name: "Plus Jakarta Sans", weight: "Bold 700", size: "24-36px", usage: "Headings" },
  { name: "Plus Jakarta Sans", weight: "ExtraBold 800", size: "36-72px", usage: "Hero titles" },
];

const SPACING = [
  { name: "xs", px: "4px", rem: "0.25rem" },
  { name: "sm", px: "8px", rem: "0.5rem" },
  { name: "md", px: "16px", rem: "1rem" },
  { name: "lg", px: "24px", rem: "1.5rem" },
  { name: "xl", px: "32px", rem: "2rem" },
  { name: "2xl", px: "48px", rem: "3rem" },
  { name: "3xl", px: "64px", rem: "4rem" },
];

export default function BrandGuidelinesPage() {
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Brand Guidelines" subtitle="Travelora - Explore the World" />
      <Card className="p-6 mb-5 bg-gradient-to-br from-violet-600/10 via-blue-600/5 to-transparent border-violet-500/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-xl shadow-violet-900/30">
            <span className="text-2xl font-black text-white">T</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Travelora</h2>
            <p className="text-sm text-slate-400">Explore the World · Brand Identity v2.0</p>
          </div>
          <Badge color="violet" className="ml-auto">Current Version</Badge>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><Palette size={14} className="text-violet-400" /> Color Palette</h3>
            <div className="grid grid-cols-3 gap-3">
              {COLORS.map((c) => (
                <div key={c.name} className="text-center">
                  <div className="w-full aspect-square rounded-xl border border-white/[0.06] mb-2" style={{ background: c.hex }} />
                  <p className="text-xs font-semibold text-white">{c.name}</p>
                  <p className="text-[10px] font-mono text-slate-500">{c.hex}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><Move size={14} className="text-violet-400" /> Spacing Scale</h3>
            <div className="space-y-2">
              {SPACING.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-12 text-xs font-mono text-slate-500">{s.name}</div>
                  <div className="flex-1 h-4 rounded bg-violet-500/20 flex items-center" style={{ width: s.rem }} />
                  <div className="w-24 text-right text-xs font-mono text-slate-500">{s.px} / {s.rem}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><Type size={14} className="text-violet-400" /> Typography</h3>
            <p className="text-xs text-slate-500 mb-3">Primary font: <span className="font-semibold text-white">Plus Jakarta Sans</span></p>
            <div className="space-y-2">
              {TYPOGRAPHY.map((t) => (
                <div key={t.weight} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <p className="text-sm text-white font-semibold">{t.weight}</p>
                    <p className="text-xs text-slate-500">{t.size}</p>
                  </div>
                  <span className="text-xs text-slate-500">{t.usage}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><Eye size={14} className="text-violet-400" /> Preview</h3>
            <div className="space-y-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <h1 className="text-4xl font-extrabold text-white">Heading 1</h1>
              <h2 className="text-2xl font-bold text-white">Heading 2</h2>
              <h3 className="text-xl font-semibold text-white">Heading 3</h3>
              <p className="text-base text-slate-400">Body text using Plus Jakarta Sans at 16px with regular weight. This is how standard body copy appears across all brand materials.</p>
              <p className="text-sm text-slate-500">Caption text appears in a smaller size with lighter color.</p>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
