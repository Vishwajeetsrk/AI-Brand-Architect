"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, Sparkles, Download, Save } from "lucide-react";
import { Btn, Card, Input } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function LogoMakerPage() {
  const [prompt, setPrompt] = useState("Travelora - Explore the World");
  const [style, setStyle] = useState("modern");
  const [color, setColor] = useState("#6366f1");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);
  const styles = ["Modern", "Minimal", "Bold", "Luxury", "Playful", "Classic"];
  const logos = [
    { name: "Travelora", letter: "T", gradient: "from-violet-600 to-blue-600" },
    { name: "TRAVELORA", letter: "T", gradient: "from-cyan-500 to-blue-600" },
    { name: "Travelora", letter: "T", gradient: "from-emerald-500 to-cyan-500" },
    { name: "Travelora", letter: "T", gradient: "from-pink-500 to-violet-600" },
  ];
  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };
  return (
    <motion.div {...pageAnim} className="flex gap-5 h-full">
      <Card className="w-64 flex-shrink-0 p-4 space-y-4 overflow-y-auto">
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Brand Name</label>
          <Input value={prompt} onChange={setPrompt} placeholder="Enter brand name..." />
        </div>
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Style</label>
          <div className="grid grid-cols-2 gap-1.5">
            {styles.map((s) => (
              <button key={s} onClick={() => setStyle(s.toLowerCase())} className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${style === s.toLowerCase() ? "bg-violet-600/30 text-violet-300 border border-violet-500/40" : "bg-[#111336] text-slate-500 hover:text-slate-300 border border-white/[0.05]"}`}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Primary Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
            <span className="text-xs text-slate-400 font-mono">{color}</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {["#6366f1", "#3b82f6", "#22d3ee", "#10b981", "#f59e0b", "#ef4444"].map((c) => (
              <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${color === c ? "ring-2 ring-white ring-offset-1 ring-offset-[#0d0f2a]" : ""}`} style={{ background: c }} />
            ))}
          </div>
        </div>
        <Btn variant="primary" className="w-full justify-center" icon={generating ? RefreshCw : Sparkles} onClick={handleGenerate} disabled={generating}>
          {generating ? "Generating..." : "Generate Logo"}
        </Btn>
      </Card>

      <div className="flex-1 space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Preview</h3>
            <div className="flex gap-2">
              <Btn variant="secondary" size="sm" icon={Download}>Export</Btn>
              <Btn variant="primary" size="sm" icon={Save}>Save</Btn>
            </div>
          </div>
          {generated ? (
            <div className="flex items-center justify-center h-48 bg-gradient-to-br from-[#111336] to-[#0d0f2a] rounded-xl border border-white/[0.06]">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xl shadow-violet-900/50">
                  <span className="text-3xl font-black text-white">T</span>
                </div>
                <p className="text-lg font-black text-white tracking-wide">TRAVELORA</p>
                <p className="text-xs text-slate-600 mt-1">EXPLORE MORE WORLD, LTD.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 bg-[#111336] rounded-xl border border-dashed border-white/10">
              <p className="text-slate-600 text-sm">Generate a logo to preview</p>
            </div>
          )}
        </Card>
        {generated && (
          <Card className="p-4">
            <h3 className="font-bold text-white text-sm mb-3">Variations</h3>
            <div className="grid grid-cols-4 gap-3">
              {logos.map((l, i) => (
                <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-[#111336] to-[#0d0f2a] border border-white/[0.06] flex items-center justify-center hover:border-violet-500/40 transition-colors cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${l.gradient} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <span className="text-lg font-black text-white">{l.letter}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
