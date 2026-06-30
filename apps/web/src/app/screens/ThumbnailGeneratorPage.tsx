"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Image, Download, Palette, Type, Sparkles } from "lucide-react";
import { Btn, Card, Badge, PageHeader, Input } from "../components/shared";
import { mediaService } from "@/services/media";

const pageAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }, exit: { opacity: 0, y: -8, transition: { duration: 0.15 } } };

const STYLES = [
  { id: "modern", label: "Modern", color: "violet" },
  { id: "minimal", label: "Minimal", color: "gray" },
  { id: "bold", label: "Bold", color: "amber" },
  { id: "gradient", label: "Gradient", color: "blue" },
  { id: "neon", label: "Neon", color: "cyan" },
  { id: "corporate", label: "Corporate", color: "emerald" },
];

export default function ThumbnailGeneratorPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [style, setStyle] = useState("modern");
  const [brandColor, setBrandColor] = useState("#7c3aed");
  const [generated, setGenerated] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const result = await mediaService.thumbnails.generate({ title, subtitle, style, brandColor });
      setGenerated(result);
    } catch {}
    setLoading(false);
  };

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Thumbnail Generator" subtitle="Create stunning video thumbnails with AI" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Design Settings</h2>
            <div className="space-y-4">
              <Input label="Title" value={title} onChange={setTitle} placeholder="Your awesome video title" />
              <Input label="Subtitle (optional)" value={subtitle} onChange={setSubtitle} placeholder="A catchy subtitle" />
              <div>
                <label className="block text-sm text-gray-400 mb-2">Style</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => setStyle(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${style === s.id ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "bg-[#0c1022] text-slate-500 hover:text-slate-300 border border-white/[0.05]"}`}
                    >{s.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Brand Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" />
                  <span className="text-sm text-gray-400">{brandColor}</span>
                </div>
              </div>
              <Btn variant="primary" onClick={handleGenerate} loading={loading} icon={Sparkles} className="w-full">Generate Thumbnail</Btn>
            </div>
          </Card>
        </div>
        <div>
          <Card className="p-6 min-h-[300px] flex items-center justify-center">
            {generated ? (
              <div className="text-center">
                <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-white/10 flex items-center justify-center mb-4" style={{ borderColor: brandColor + "40" }}>
                  <div className="text-center p-6">
                    <h2 className="text-2xl font-bold text-white mb-2" style={{ fontSize: "clamp(1.2rem, 4vw, 2.5rem)" }}>{generated.title}</h2>
                    {generated.subtitle && <p className="text-gray-400">{generated.subtitle}</p>}
                    <Badge color="violet" className="mt-3">{generated.style}</Badge>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <Btn variant="primary" icon={Download}>Download</Btn>
                  <Btn variant="secondary" icon={Sparkles} onClick={handleGenerate}>Regenerate</Btn>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Image size={48} className="mx-auto mb-3 opacity-30" />
                <p>Configure your thumbnail and click Generate</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
