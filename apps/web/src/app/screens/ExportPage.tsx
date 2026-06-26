"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Download, Image, FileImage, FileType, FileVideo, File, Check, ChevronDown } from "lucide-react";
import { Btn, Card, Badge, PageHeader, Toggle } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const FORMATS = [
  { id: "png", label: "PNG", icon: Image, desc: "High quality, transparent bg" },
  { id: "svg", label: "SVG", icon: FileImage, desc: "Scalable vector format" },
  { id: "pdf", label: "PDF", icon: FileType, desc: "Print-ready document" },
  { id: "webp", label: "WebP", icon: FileImage, desc: "Modern web format" },
  { id: "jpg", label: "JPG", icon: Image, desc: "Compressed image" },
  { id: "mp4", label: "MP4", icon: FileVideo, desc: "Video export" },
];

const QUALITY_OPTIONS = ["Low", "Medium", "High", "Ultra"];

const RECENT_EXPORTS = [
  { name: "Travelora Brand Kit", format: "ZIP", size: "24MB", date: "2 hours ago", status: "Ready" as const },
  { name: "Travelora Logo Pack", format: "SVG", size: "1.2MB", date: "5 hours ago", status: "Ready" as const },
  { name: "Social Media Assets", format: "PNG", size: "8.5MB", date: "1 day ago", status: "Ready" as const },
  { name: "Website Export", format: "ZIP", size: "156MB", date: "2 days ago", status: "Ready" as const },
];

export default function ExportPage() {
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState("High");
  const [includeBrand, setIncludeBrand] = useState(true);
  const [includeVariations, setIncludeVariations] = useState(false);
  const [includeGuidelines, setIncludeGuidelines] = useState(true);

  return (
    <motion.div {...pageAnim} className="flex gap-5 h-full">
      <div className="w-80 flex-shrink-0 space-y-4">
        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-3">Export Format</h3>
          <div className="grid grid-cols-2 gap-2">
            {FORMATS.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${format === f.id ? "border-violet-500/50 bg-violet-500/10" : "border-white/[0.06] hover:border-white/20"}`}
                >
                  <Icon size={16} className={format === f.id ? "text-violet-400" : "text-slate-500"} />
                  <p className="text-sm font-semibold text-white mt-1">{f.label}</p>
                  <p className="text-[10px] text-slate-500">{f.desc}</p>
                </button>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-3">Quality</h3>
          <div className="flex gap-1 bg-[#111336] p-1 rounded-lg">
            {QUALITY_OPTIONS.map((q) => (
              <button key={q} onClick={() => setQuality(q)} className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${quality === q ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>{q}</button>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-3">Include</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Brand Assets</span>
              <Toggle checked={includeBrand} onChange={() => setIncludeBrand(!includeBrand)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Variations</span>
              <Toggle checked={includeVariations} onChange={() => setIncludeVariations(!includeVariations)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Brand Guidelines</span>
              <Toggle checked={includeGuidelines} onChange={() => setIncludeGuidelines(!includeGuidelines)} />
            </div>
          </div>
        </Card>
        <Btn variant="primary" className="w-full justify-center" icon={Download}>Export Now</Btn>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white text-sm mb-3">Recent Exports</h3>
        <div className="space-y-2">
          {RECENT_EXPORTS.map((exp) => (
            <Card key={exp.name} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/20 to-blue-600/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Download size={16} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{exp.name}</p>
                <p className="text-xs text-slate-500">{exp.format} · {exp.size} · {exp.date}</p>
              </div>
              <Badge color="green">{exp.status}</Badge>
              <Btn variant="secondary" size="sm" icon={Download}>Download</Btn>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
