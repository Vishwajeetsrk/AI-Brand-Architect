"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Search, Upload, FolderOpen, Grid, List, Download, Eye, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Btn, Card, Badge } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function AssetsPage() {
  const [tab, setTab] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const cats = [
    { id: "all", label: "All Assets" },
    { id: "images", label: "Images" },
    { id: "logos", label: "Logos" },
    { id: "icons", label: "Icons" },
    { id: "videos", label: "Videos" },
    { id: "fonts", label: "Fonts" },
  ];
  const allIcons = ["Activity","AlertCircle","AlertTriangle","AlignLeft","Archive","ArrowDownRight","ArrowRight","ArrowUpRight","AtSign","Award","BarChart2","BarChart3","Bell","Bookmark","BookOpen","Bot","BrainCircuit","Calendar","Check","CheckCircle","CheckSquare","ChevronDown","ChevronLeft","ChevronRight","ChevronUp","Circle","ClipboardList","Code2","Command","Construction","Copy","Cpu","CreditCard","Crown","Database","DollarSign","Download","Edit2","ExternalLink","Eye","EyeOff","FileCode","FileImage","FileText","Filter","Folder","FolderOpen","Gauge","GitBranch","Globe","Grid","Hash","Heart","Hexagon","Home","ImagePlus","Info","Key","Laptop","Layers","Layers2","Layout","LayoutDashboard","Lightbulb","Link","List","ListChecks","Lock","LogOut","Map","Megaphone","Menu","MessageCircle","MessageSquare","Mic","Minus","MonitorPlay","Moon","MoreHorizontal","Network","Package","Paintbrush","Pause","Play","PlayCircle","Plug","Plus","Podcast","Radio","Receipt","RefreshCw","Rocket","RotateCw","Save","Search","Send","Server","Settings","Share2","Shield","SkipForward","SlidersHorizontal","Sparkles","Square","Star","Target","Terminal","Timer","Trash2","TrendingUp","Triangle","Upload","User","UserPlus","Users","Video","Volume2","Wand2","Wifi","Wrench","X","Zap"];
  const dashboards = [
    "AI analytics dashboard overview", "AI knowledge graph explorer interface",
    "AI model playground dashboard in dark theme", "AI prompt engineering platform dashboard",
    "AI research dashboard interface", "AI mission control dashboard interface",
    "Business intelligence dashboard in dark mode", "Futuristic AI operating system dashboard",
    "Futuristic AI workspace dashboard design", "Futuristic AI playground dashboard UI",
    "Learnify AI Collaboration dashboard overview", "Learnify AI Memory center dashboard",
    "Learnify AI project dashboard overview", "Security Center dashboard overview",
    "Shared utilities dashboard interface design", "Modern brand DNA dashboard interface",
    "AI command center dashboard design", "Neon AI onboarding dashboard design",
  ];
  const all3dIcons = ["bookmark","clock","computer","fire","folder","gift","heart","medal","money","notebook","painting","rocket","video"].flatMap((cat) =>
    ["dynamic-premium","dynamic-color","dynamic-gradient","dynamic-clay","front-premium","front-color","front-gradient","front-clay","iso-premium","iso-color","iso-gradient","iso-clay"].map((style) => ({
      name: `${cat}-${style}`, label: `${cat.charAt(0).toUpperCase() + cat.slice(1)} ${style.split("-")[0]} ${style.split("-")[1]}`, cat
    }))
  );
  const imageAssets = [
    ...dashboards.map((d) => ({ name: d, img: `/dashboard/${d.replace(/\s+/g, "_")}.png`, size: `${(Math.random() * 3 + 1).toFixed(1)}MB`, type: "PNG" })),
    ...all3dIcons.slice(0, 30).map((ic) => ({ name: ic.label, img: `/3d-icons/${ic.name}.png`, size: `${(Math.random() * 0.5 + 0.1).toFixed(1)}MB`, type: "PNG" })),
  ];
  const logoAssets = [
    { name: "Nexora Primary Logo", file: "logo-horizontal.svg", type: "SVG", size: "24KB" },
    { name: "Nexora Icon Mark", file: "logo.svg", type: "SVG", size: "12KB" },
    { name: "Nexora Favicon", file: "favicon.svg", type: "SVG", size: "4KB" },
    { name: "Nexora Logo PNG", file: "NEXORA Logo.png", type: "PNG", size: "64KB" },
    { name: "Nexora Animated Mark", file: "nexora-logo.svg", type: "SVG", size: "132KB" },
    { name: "AI Robot Illustration", file: "ai-robo.svg", type: "SVG", size: "275KB" },
    { name: "Bot Illustration", file: "illustration-ai-bot-small.svg", type: "SVG", size: "2KB" },
    { name: "AI Character", file: "illustration-ai-character-large.svg", type: "SVG", size: "82KB" },
    { name: "Dashboard Demo", file: "dashboard-demo.png", type: "PNG", size: "1.7MB" },
    { name: "Dashboard Futuristic", file: "dashboard-futuristic.png", type: "PNG", size: "1.7MB" },
    { name: "Success Animation", file: "success-anim.svg", type: "SVG", size: "36KB" },
  ];
  const videoAssets = [
    { name: "Product Demo Reel", type: "MP4", size: "128MB", dur: "2:34", thumb: "/dashboard/AI_analytics_dashboard_overview.png" },
    { name: "Brand Introduction", type: "MP4", size: "84MB", dur: "1:12", thumb: "/dashboard/Futuristic_AI_operating_system_dashboard.png" },
    { name: "Feature Walkthrough", type: "MOV", size: "256MB", dur: "4:18", thumb: "/dashboard/Learnify_AI_Collaboration_dashboard_overview.png" },
    { name: "Social Ad 15s", type: "MP4", size: "32MB", dur: "0:15", thumb: "/dashboard/AI_model_playground_dashboard_in_dark_theme.png" },
    { name: "Tutorial Series Ep1", type: "MP4", size: "512MB", dur: "8:42", thumb: "/dashboard/AI_knowledge_graph_explorer_interface.png" },
    { name: "Client Testimonial", type: "MOV", size: "96MB", dur: "1:45", thumb: "/dashboard/Business_intelligence_dashboard_in_dark_mode.png" },
  ];
  const fontAssets = [
    { name: "Space Grotesk", type: "TTF", size: "156KB", styles: "7 weights" },
    { name: "Plus Jakarta Sans", type: "TTF", size: "234KB", styles: "8 weights" },
    { name: "Inter", type: "TTF", size: "312KB", styles: "9 weights" },
    { name: "JetBrains Mono", type: "TTF", size: "168KB", styles: "4 weights" },
    { name: "Playfair Display", type: "TTF", size: "198KB", styles: "4 weights" },
    { name: "DM Sans", type: "TTF", size: "145KB", styles: "5 weights" },
  ];
  const filteredAssets = tab === "all" ? [...allIcons.slice(0, 40), ...imageAssets.slice(0, 12), ...logoAssets.slice(0, 6)]
    : tab === "icons" ? allIcons
    : tab === "images" ? imageAssets
    : tab === "logos" ? logoAssets
    : tab === "videos" ? videoAssets
    : fontAssets;
  const searched = (Array.isArray(filteredAssets) ? filteredAssets : []).filter((a: any) => {
    const q = search.toLowerCase();
    return typeof a === "string" ? a.toLowerCase().includes(q) : (a.name || a.label || "").toLowerCase().includes(q);
  });
  return (
    <motion.div {...pageAnim}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-white">Assets Library</h1>
          <p className="text-xs text-slate-500">1,248 assets</p>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="secondary" icon={Upload} size="sm">Upload</Btn>
          <Btn variant="primary" icon={FolderOpen} size="sm">New Folder</Btn>
        </div>
      </div>
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          placeholder="Search anything&hellip;"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111336] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40 transition-colors"
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-[#111336] p-1 rounded-lg">
          {cats.map((c) => (
            <button key={c.id} onClick={() => setTab(c.id)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${tab === c.id ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>{c.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button onClick={() => setView("grid")} className={`p-2 rounded-md ${view === "grid" ? "bg-violet-600/20 text-violet-400" : "text-slate-500"}`}><Grid size={14} /></button>
            <button onClick={() => setView("list")} className={`p-2 rounded-md ${view === "list" ? "bg-violet-600/20 text-violet-400" : "text-slate-500"}`}><List size={14} /></button>
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-white/[0.06]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">AJ</div>
          </div>
        </div>
      </div>
      {(tab === "all" || tab === "icons") && (
        <div className={view === "grid" ? "grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2" : "space-y-1.5"}>
          {(searched as any[]).filter((x): x is string => typeof x === "string").map((n) => {
            const kebab = n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
            return view === "grid" ? (
              <div key={n} className="group cursor-pointer">
                <div className="aspect-square rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all flex items-center justify-center relative overflow-hidden">
                  <img src={`/icons/${kebab}.svg`} alt={n} className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                    <button className="p-1 bg-white/20 rounded"><Download size={10} className="text-white" /></button>
                  </div>
                </div>
                <p className="text-[9px] text-slate-600 text-center mt-1 truncate">{n}</p>
              </div>
            ) : (
              <div key={n} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <img src={`/icons/${kebab}.svg`} alt={n} className="w-4 h-4 opacity-60" />
                </div>
                <div className="flex-1 min-w-0"><p className="text-xs text-white truncate">{n}.svg</p><p className="text-[10px] text-slate-600">SVG &middot; 1.2KB</p></div>
                <Badge color="gray">SVG</Badge>
                <button className="text-slate-600 hover:text-slate-300"><Download size={13} /></button>
              </div>
            );
          })}
        </div>
      )}
      {(tab === "all" || tab === "images") && (
        <div className={view === "grid" ? "grid grid-cols-4 gap-3" : "space-y-2"}>
          {(searched as any[]).filter((a: any) => a.img).map((a: any) => (
            view === "grid" ? (
              <Card key={a.name} className="group cursor-pointer overflow-hidden">
                <div className="aspect-video bg-[#0c1022] flex items-center justify-center relative overflow-hidden">
                  <img src={a.img} alt={a.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button className="p-1.5 bg-white/20 rounded-md backdrop-blur"><Eye size={12} className="text-white" /></button>
                    <button className="p-1.5 bg-white/20 rounded-md backdrop-blur"><Download size={12} className="text-white" /></button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-white truncate">{a.name}</p>
                  <p className="text-[10px] text-slate-500">{a.type} &middot; {a.size}</p>
                </div>
              </Card>
            ) : (
              <Card key={a.name} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/[0.03] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#0c1022] flex-shrink-0 overflow-hidden">
                  <img src={a.img} alt={a.name} className="w-full h-full object-cover opacity-70" />
                </div>
                <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{a.name}.png</p><p className="text-xs text-slate-500">{a.size}</p></div>
                <Badge color="gray">{a.type}</Badge>
                <button className="text-slate-600 hover:text-slate-300"><Download size={14} /></button>
              </Card>
            )
          ))}
        </div>
      )}
      {(tab === "all" || tab === "logos") && (
        <div className={view === "grid" ? "grid grid-cols-4 gap-3" : "space-y-2"}>
          {(searched as any[]).filter((a: any) => a.file).map((a: any) => (
            view === "grid" ? (
              <Card key={a.name} className="group cursor-pointer overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-violet-600/20 to-blue-600/10 flex items-center justify-center relative p-4">
                  <img src={`/${a.file}`} alt={a.name} className="w-full h-full object-contain opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button className="p-1.5 bg-white/20 rounded-md"><Download size={12} className="text-white" /></button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-white truncate">{a.name}</p>
                  <p className="text-[10px] text-slate-500">{a.type} &middot; {a.size}</p>
                </div>
              </Card>
            ) : (
              <Card key={a.name} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/[0.03] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600/20 to-blue-600/10 flex items-center justify-center flex-shrink-0 p-2">
                  <img src={`/${a.file}`} alt={a.name} className="w-full h-full object-contain opacity-50" />
                </div>
                <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{a.file}</p><p className="text-xs text-slate-500">{a.size}</p></div>
                <Badge color="gray">{a.type}</Badge>
                <button className="text-slate-600 hover:text-slate-300"><Download size={14} /></button>
              </Card>
            )
          ))}
        </div>
      )}
      {(tab === "all" || tab === "videos") && (
        <div className="grid grid-cols-3 gap-3">
          {(searched as any[]).filter((a: any) => a.thumb).map((a: any) => (
            <Card key={a.name} className="group cursor-pointer overflow-hidden">
              <div className="aspect-video bg-[#0c1022] flex items-center justify-center relative overflow-hidden">
                <img src={a.thumb} alt={a.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center group-hover:bg-violet-500/40 transition-all border border-white/10">
                    <Play size={18} className="text-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white backdrop-blur">{a.dur}</span>
              </div>
              <div className="p-3">
                <p className="text-xs text-white truncate">{a.name}.{a.type.toLowerCase()}</p>
                <p className="text-[10px] text-slate-500">{a.type} &middot; {a.size}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      {(tab === "all" || tab === "fonts") && (
        <div className="space-y-2">
          {(searched as any[]).filter((a: any) => a.styles).map((a: any) => (
            <Card key={a.name} className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.03] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-blue-600/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-violet-400">Aa</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{a.name}</p>
                <p className="text-xs text-slate-500">{a.styles} &middot; {a.size}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge color="gray">{a.type}</Badge>
                <button className="text-slate-600 hover:text-slate-300"><Download size={14} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-600">
        <span>Showing {searched.length} of {Array.isArray(filteredAssets) ? filteredAssets.length : 0} assets</span>
        <div className="flex items-center gap-4">
          <span>Page 1 of 1</span>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-white/[0.05]"><ChevronLeft size={14} /></button>
            <button className="p-1 rounded hover:bg-white/[0.05]"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
