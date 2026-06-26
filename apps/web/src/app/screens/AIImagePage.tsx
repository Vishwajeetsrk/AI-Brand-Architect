import { useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, Sparkles, ImagePlus, Download } from "lucide-react";
import { Btn, Card } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function AIImagePage() {
  const [prompt, setPrompt] = useState("A futuristic city skyline at sunset with purple neon lights");
  const [style, setStyle] = useState("photorealistic");
  const [ratio, setRatio] = useState("1:1");
  const [generating, setGenerating] = useState(false);
  const styles = ["Photorealistic", "Illustration", "3D Render", "Anime", "Watercolor", "Sketch"];
  const ratios = ["1:1", "16:9", "4:3", "9:16", "3:2"];
  const history = [
    { gradient: "from-violet-900 to-blue-900" },
    { gradient: "from-cyan-900 to-teal-900" },
    { gradient: "from-pink-900 to-violet-900" },
    { gradient: "from-amber-900 to-orange-900" },
    { gradient: "from-emerald-900 to-cyan-900" },
    { gradient: "from-slate-800 to-slate-900" },
  ];
  return (
    <motion.div {...pageAnim} className="flex gap-5 h-full">
      <Card className="w-64 flex-shrink-0 p-4 space-y-4">
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Prompt</label>
          <textarea
            value={prompt} onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-[#111336] border border-white/[0.07] rounded-lg p-3 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 resize-none h-24"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Style</label>
          <div className="grid grid-cols-2 gap-1.5">
            {styles.map((s) => (
              <button key={s} onClick={() => setStyle(s.toLowerCase())} className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all ${style === s.toLowerCase() ? "bg-violet-600/30 text-violet-300" : "bg-[#111336] text-slate-500 hover:text-slate-300"}`}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Aspect Ratio</label>
          <div className="flex flex-wrap gap-1.5">
            {ratios.map((r) => (
              <button key={r} onClick={() => setRatio(r)} className={`px-2.5 py-1.5 rounded-md text-xs font-mono transition-all ${ratio === r ? "bg-violet-600/30 text-violet-300" : "bg-[#111336] text-slate-500"}`}>{r}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Quality</label>
          <select className="w-full bg-[#111336] border border-white/[0.07] rounded-lg px-3 py-2 text-xs text-slate-300 outline-none">
            <option>Standard</option><option>HD</option><option>Ultra HD</option>
          </select>
        </div>
        <Btn variant="primary" className="w-full justify-center" icon={generating ? RefreshCw : Sparkles} onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 2000); }} disabled={generating}>
          {generating ? "Generating..." : "Generate Image"}
        </Btn>
      </Card>
      <div className="flex-1 space-y-4">
        <Card className="aspect-video flex items-center justify-center bg-gradient-to-br from-violet-950 via-blue-950 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          {!generating ? (
            <div className="text-center z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
                <ImagePlus size={28} className="text-violet-400" />
              </div>
              <p className="text-slate-400 text-sm">AI-generated image appears here</p>
              <p className="text-slate-600 text-xs mt-1">Click Generate Image to create</p>
            </div>
          ) : (
            <div className="text-center z-10">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Generating your image...</p>
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <Btn variant="secondary" size="sm" icon={Download}>Save</Btn>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-bold text-white mb-3">Recent Generations</h3>
          <div className="grid grid-cols-6 gap-2">
            {history.map((h, i) => (
              <div key={i} className={`aspect-square rounded-lg bg-gradient-to-br ${h.gradient} cursor-pointer hover:ring-1 hover:ring-violet-500 transition-all`} />
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
