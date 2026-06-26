"use client";
import { motion } from "motion/react";
import { Sparkles, RefreshCw } from "lucide-react";
import { PageHeader, Card, Btn, EmptyPlaceholder } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export function GenericToolPage({ title, icon: Icon, desc, color: _color }: { title: string; icon: React.ElementType; desc: string; color: string }) {
  return (
    <motion.div {...pageAnim}>
      <PageHeader title={title} subtitle={desc}
        actions={<><Btn variant="secondary" size="sm" icon={RefreshCw}>Reset</Btn><Btn variant="primary" size="sm" icon={Sparkles}>Generate</Btn></>}
      />
      <div className="grid grid-cols-3 gap-5">
        <Card className="p-5 space-y-4">
          <h3 className="font-bold text-white text-sm">Settings</h3>
          {["Style", "Tone", "Format", "Length"].map((s) => (
            <div key={s}>
              <label className="text-xs text-slate-500 mb-1.5 block">{s}</label>
              <select className="w-full bg-[#111336] border border-white/[0.07] rounded-lg px-3 py-2 text-xs text-slate-300 outline-none">
                <option>Automatic</option><option>Custom</option>
              </select>
            </div>
          ))}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Prompt</label>
            <textarea className="w-full bg-[#111336] border border-white/[0.07] rounded-lg p-3 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 resize-none h-20" placeholder="Describe what you want to create..." />
          </div>
          <Btn variant="primary" className="w-full justify-center" icon={Sparkles}>Generate</Btn>
        </Card>
        <div className="col-span-2">
          <Card className="h-full flex items-center justify-center">
            <EmptyPlaceholder
              icon={Icon}
              title={`${title} Preview`}
              desc={`Configure your settings and click Generate to create your ${title.toLowerCase()} output.`}
              action={<Btn variant="primary" icon={Sparkles}>Generate Now</Btn>}
            />
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
