import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Command, Target as TargetIcon, Cpu, ImagePlus, Mic, MessageSquare,
  Bot, GitBranch, Server, Layout, BookOpen, Copy, Map, Layers, Paintbrush,
  BarChart3, Key, Users, Settings, ChevronDown, ChevronRight, ChevronLeft,
  Search, Plus, X, ArrowRight, Check, Eye, EyeOff, Star, Zap, Shield,
  Download, ExternalLink, MoreHorizontal, Trash2, Edit2, Filter, RefreshCw,
  TrendingUp, DollarSign, Award, AlertCircle, Info,
  CheckCircle, AlertTriangle, Menu, LogOut, Home, FileText, Lock, Code2,
  Terminal, Save, Play, SlidersHorizontal, ArrowUpRight,
  ArrowDownRight, Rocket, Crown, Heart, MessageCircle, Package, Plug, Link,
  Video, Bookmark, Laptop, Moon, Database, AtSign, Hash, UserPlus, Folder,
  RotateCw, Calendar, Timer, Receipt, Wrench, Grid, List, BarChart2,
  Minus, Send, Circle, ChevronUp, Gauge, Share2, Upload, Globe, Wand2,
  Activity, Bell, User, CreditCard, Archive, Network,
  Radio, Podcast, Wifi, Layers2, Hexagon, Triangle, Square, CheckSquare,
  ListChecks, PlayCircle, Pause, SkipForward, Volume2, AlignLeft,
  FileCode, FileImage, Sparkles, BrainCircuit, ClipboardList, FolderOpen,
  MonitorPlay, Megaphone, Lightbulb, Construction,
  Sparkle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, Radar,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "landing" | "signin" | "signup" | "forgot" | "verify" | "onboard"
  | "dashboard" | "command" | "mission" | "playground" | "image-gen"
  | "voice" | "chat" | "agents" | "tasks" | "workflows" | "mcp"
  | "cms" | "knowledge" | "templates" | "website-plan" | "brand-dna"
  | "creative" | "analytics" | "api-keys" | "team" | "settings" | "project";

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV: { label: string; items: { id: Screen; label: string; icon: React.ElementType; badge?: string }[] }[] = [
  { label: "OVERVIEW", items: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "command", label: "AI Command Center", icon: Command, badge: "Hub" },
    { id: "mission", label: "AI Mission Control", icon: TargetIcon },
    { id: "project", label: "Project Dashboard", icon: FolderOpen },
  ]},
  { label: "AI TOOLS", items: [
    { id: "playground", label: "Model Playground", icon: BrainCircuit },
    { id: "image-gen", label: "Image Generator", icon: ImagePlus, badge: "AI" },
    { id: "voice", label: "Voice Studio", icon: Mic },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
  ]},
  { label: "WORKSPACE", items: [
    { id: "agents", label: "Agents", icon: Bot },
    { id: "tasks", label: "Tasks", icon: ListChecks },
    { id: "workflows", label: "Workflows", icon: GitBranch },
    { id: "mcp", label: "MCP Tools", icon: Server },
  ]},
  { label: "CONTENT", items: [
    { id: "cms", label: "CMS Dashboard", icon: Layout },
    { id: "knowledge", label: "Knowledge Hub", icon: BookOpen },
    { id: "templates", label: "Templates", icon: Copy },
    { id: "website-plan", label: "Website Planning", icon: Map },
  ]},
  { label: "BRAND", items: [
    { id: "brand-dna", label: "Brand DNA Studio", icon: Layers },
    { id: "creative", label: "Creative Studio", icon: Paintbrush },
  ]},
  { label: "INSIGHTS & DEV", items: [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "api-keys", label: "API Keys", icon: Key },
  ]},
];
const BOTTOM_NAV = [
  { id: "team" as Screen, label: "Team", icon: Users },
  { id: "settings" as Screen, label: "Settings", icon: Settings },
];

// ─── Animation preset ─────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.14 } },
};

// ─── Shared components ────────────────────────────────────────────────────────
function Btn({ children, variant = "primary", size = "md", onClick, className = "", icon: Icon, disabled }: {
  children?: React.ReactNode; variant?: "primary"|"secondary"|"ghost"|"danger"|"outline"|"teal"|"green";
  size?: "xs"|"sm"|"md"|"lg"; onClick?: () => void; className?: string;
  icon?: React.ElementType; disabled?: boolean;
}) {
  const sz = { xs: "px-2 py-1 text-[11px]", sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-2.5 text-sm" };
  const va = {
    primary: "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-900/40",
    secondary: "bg-[#111830] hover:bg-[#1a2240] text-slate-300 border border-white/[0.07]",
    ghost: "hover:bg-white/[0.05] text-slate-400 hover:text-white",
    danger: "bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/20",
    outline: "border border-violet-500/40 text-violet-300 hover:bg-violet-500/10",
    teal: "bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/20",
    green: "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/20",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg font-semibold transition-all duration-150 select-none ${sz[size]} ${va[variant]} ${disabled?"opacity-40 cursor-not-allowed":""} ${className}`}>
      {Icon && <Icon size={size==="lg"?15:size==="xs"?10:12} />}{children}
    </button>
  );
}

function Card({ children, className="", onClick, glow }: { children: React.ReactNode; className?: string; onClick?: () => void; glow?: boolean }) {
  return (
    <div onClick={onClick} className={`bg-card border border-white/[0.055] rounded-xl ${glow?"shadow-lg shadow-violet-900/20":""} ${onClick?"cursor-pointer hover:border-violet-500/25 transition-colors":""} ${className}`}>
      {children}
    </div>
  );
}

function Bdg({ children, color="violet", size="sm" }: { children: React.ReactNode; color?: string; size?: "xs"|"sm" }) {
  const c: Record<string,string> = {
    violet:"bg-violet-500/15 text-violet-300 border-violet-500/25",
    blue:"bg-blue-500/15 text-blue-300 border-blue-500/25",
    teal:"bg-teal-500/15 text-teal-300 border-teal-500/25",
    green:"bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    red:"bg-red-500/15 text-red-300 border-red-500/25",
    amber:"bg-amber-500/15 text-amber-300 border-amber-500/25",
    gray:"bg-white/[0.05] text-slate-400 border-white/[0.08]",
    orange:"bg-orange-500/15 text-orange-300 border-orange-500/25",
    pink:"bg-pink-500/15 text-pink-300 border-pink-500/25",
  };
  return <span className={`inline-flex items-center border rounded-md font-semibold ${size==="xs"?"px-1.5 py-0.5 text-[10px]":"px-2 py-0.5 text-[11px]"} ${c[color]??c.gray}`}>{children}</span>;
}

function Inp({ placeholder, type="text", value, onChange, icon: Icon, className="", rows }: {
  placeholder?: string; type?: string; value?: string; onChange?: (v:string)=>void;
  icon?: React.ElementType; className?: string; rows?: number;
}) {
  const cls = `w-full bg-[#111830] border border-white/[0.07] rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all ${Icon?"pl-8 pr-3 py-2":"px-3 py-2"}`;
  return (
    <div className={`relative ${className}`}>
      {Icon && <Icon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />}
      {rows ? (
        <textarea rows={rows} placeholder={placeholder} value={value} onChange={e=>onChange?.(e.target.value)} className={`${cls} resize-none`} />
      ) : (
        <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange?.(e.target.value)} className={cls} />
      )}
    </div>
  );
}

function Ava({ name, size="md" }: { name: string; size?: "xs"|"sm"|"md"|"lg" }) {
  const ini = name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const grads = ["from-violet-500 to-purple-600","from-blue-500 to-cyan-500","from-teal-500 to-emerald-500","from-orange-500 to-pink-500"];
  const g = grads[name.charCodeAt(0)%grads.length];
  const sz = { xs:"w-5 h-5 text-[8px]", sm:"w-6 h-6 text-[9px]", md:"w-8 h-8 text-xs", lg:"w-10 h-10 text-sm" };
  return <div className={`${sz[size]} rounded-full bg-gradient-to-br ${g} flex items-center justify-center font-bold text-white flex-shrink-0`}>{ini}</div>;
}

function Tog({ checked, onChange }: { checked: boolean; onChange: ()=>void }) {
  return (
    <button onClick={onChange} className={`w-9 h-5 rounded-full transition-all duration-200 relative flex-shrink-0 ${checked?"bg-violet-600":"bg-white/10"}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked?"translate-x-4":"translate-x-0"}`} />
    </button>
  );
}

function StatCard({ label, value, delta, icon: Icon, color="violet", sub }: {
  label: string; value: string; delta?: string; icon: React.ElementType; color?: string; sub?: string;
}) {
  const gc: Record<string,string> = {
    violet:"from-violet-600/20 to-violet-600/5 border-violet-500/20 text-violet-400",
    blue:"from-blue-600/20 to-blue-600/5 border-blue-500/20 text-blue-400",
    teal:"from-teal-600/20 to-teal-600/5 border-teal-500/20 text-teal-400",
    green:"from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    amber:"from-amber-600/20 to-amber-600/5 border-amber-500/20 text-amber-400",
    red:"from-red-600/20 to-red-600/5 border-red-500/20 text-red-400",
  };
  return (
    <Card className={`p-4 bg-gradient-to-br ${gc[color]??gc.violet} border`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{label}</p>
          <p className="text-xl font-bold text-white mt-0.5">{value}</p>
          {delta && <p className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5"><ArrowUpRight size={9}/>{delta}</p>}
          {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
        </div>
        <div className="p-2 rounded-lg bg-current/10 flex-shrink-0"><Icon size={15} className="opacity-80"/></div>
      </div>
    </Card>
  );
}

function PH({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div><h1 className="text-lg font-bold text-white">{title}</h1>{subtitle&&<p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}</div>
      {children&&<div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

function Dot({ color="green" }: { color?: string }) {
  const c: Record<string,string> = { green:"bg-emerald-400 shadow-emerald-400/50", amber:"bg-amber-400 shadow-amber-400/50", red:"bg-red-400 shadow-red-400/50", blue:"bg-blue-400 shadow-blue-400/50", gray:"bg-slate-500" };
  return <span className={`inline-block w-2 h-2 rounded-full shadow-md flex-shrink-0 ${c[color]??c.gray}`}/>;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ cur, nav, collapsed, setCollapsed }: {
  cur: Screen; nav: (s: Screen)=>void; collapsed: boolean; setCollapsed: (v:boolean)=>void;
}) {
  const [open, setOpen] = useState<Record<string,boolean>>({
    OVERVIEW:true,"AI TOOLS":true,WORKSPACE:true,CONTENT:false,BRAND:false,"INSIGHTS & DEV":false,
  });
  return (
    <aside className={`flex flex-col h-full bg-sidebar border-r border-white/[0.05] transition-all duration-300 flex-shrink-0 ${collapsed?"w-14":"w-52"}`}>
      {/* Logo */}
      <div className={`flex items-center gap-2 border-b border-white/[0.05] py-4 ${collapsed?"justify-center px-0":"px-4"}`}>
        <img src="/logo.svg" alt="NEXORA" className="w-7 h-7 flex-shrink-0" />
        {!collapsed&&(
          <div><p className="text-sm font-black text-white leading-none">NEXORA</p><p className="text-[9px] text-violet-400 font-bold tracking-widest">AI BRAND ARCHITECT</p></div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {NAV.map(sec=>(
          <div key={sec.label} className="mb-1">
            {!collapsed&&(
              <button onClick={()=>setOpen(p=>({...p,[sec.label]:!p[sec.label]}))}
                className="flex items-center justify-between w-full px-2 py-1 mb-0.5 group">
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest group-hover:text-slate-500 transition-colors">{sec.label}</span>
                <ChevronDown size={9} className={`text-slate-700 transition-transform ${open[sec.label]?"":"rotate-180"}`}/>
              </button>
            )}
            <AnimatePresence initial={false}>
              {(collapsed||open[sec.label])&&(
                <motion.div initial={collapsed?false:{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.18}} className="overflow-hidden">
                  {sec.items.map(it=>{
                    const Ic = it.icon; const active = cur===it.id;
                    return (
                      <button key={it.id} onClick={()=>nav(it.id)} title={collapsed?it.label:undefined}
                        className={`flex items-center gap-2 w-full rounded-lg text-xs transition-all duration-100 mb-0.5 ${collapsed?"justify-center p-2":"px-2.5 py-2"} ${active?"bg-violet-600/20 text-violet-300 font-semibold":"text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]"}`}>
                        <Ic size={14} className="flex-shrink-0"/>
                        {!collapsed&&<><span className="flex-1 text-left truncate">{it.label}</span>
                          {it.badge&&<span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${it.badge==="AI"?"bg-teal-500/20 text-teal-400":"bg-violet-500/20 text-violet-400"}`}>{it.badge}</span>}
                        </>}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.05] py-2 px-2 space-y-0.5">
        {BOTTOM_NAV.map(it=>{
          const Ic=it.icon; const active=cur===it.id;
          return (
            <button key={it.id} onClick={()=>nav(it.id)} title={collapsed?it.label:undefined}
              className={`flex items-center gap-2 w-full rounded-lg text-xs transition-all duration-100 ${collapsed?"justify-center p-2":"px-2.5 py-2"} ${active?"bg-violet-600/20 text-violet-300":"text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]"}`}>
              <Ic size={14}/>{!collapsed&&<span className="flex-1 text-left">{it.label}</span>}
            </button>
          );
        })}
        {/* Upgrade */}
        {!collapsed&&(
          <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/10 border border-violet-500/20">
            <p className="text-xs font-bold text-white">Upgrade to Pro</p>
            <p className="text-[10px] text-slate-500 mt-0.5 mb-2">Unlock unlimited AI agents & workflows</p>
            <Btn variant="primary" size="xs" className="w-full justify-center">Upgrade Plan</Btn>
          </div>
        )}
        {/* User */}
        <div className={`pt-2 border-t border-white/[0.05] flex ${collapsed?"justify-center":"items-center gap-2 px-1"}`}>
          {!collapsed&&<><Ava name="Alex Johnson"/><div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">Alex Johnson</p><p className="text-[10px] text-slate-600">Pro Plan</p></div><button onClick={()=>nav("settings")} className="text-slate-700 hover:text-slate-400"><Settings size={12}/></button></>}
          {collapsed&&<Ava name="Alex Johnson" size="sm"/>}
        </div>
      </div>
    </aside>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
function TopBar({ nav, collapsed, setCollapsed, label }: { nav:(s:Screen)=>void; collapsed:boolean; setCollapsed:(v:boolean)=>void; label:string }) {
  const [q,setQ]=useState("");
  return (
    <header className="h-12 bg-[#07091c]/90 backdrop-blur border-b border-white/[0.05] flex items-center gap-3 px-4 flex-shrink-0">
      <button onClick={()=>setCollapsed(!collapsed)} className="text-slate-600 hover:text-white transition-colors"><Menu size={16}/></button>
      <div className="flex items-center gap-1 text-xs text-slate-600">
        <Home size={11}/><ChevronRight size={10}/><span className="text-white font-semibold">{label}</span>
      </div>
      <div className="flex-1"/>
      <Inp icon={Search} placeholder="Search anything…" value={q} onChange={setQ} className="w-48"/>
      <button onClick={()=>nav("mission")} className="relative text-slate-600 hover:text-white p-1.5 transition-colors">
        <Bell size={15}/><span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500"/>
      </button>
      <button onClick={()=>nav("settings")} className="text-slate-600 hover:text-white p-1.5"><Settings size={15}/></button>
      <button onClick={()=>nav("team")}><Ava name="Alex Johnson"/></button>
    </header>
  );
}

function AppLayout({ children, cur, nav }: { children: React.ReactNode; cur: Screen; nav:(s:Screen)=>void }) {
  const [collapsed,setCollapsed]=useState(false);
  const allItems=[...NAV.flatMap(s=>s.items),...BOTTOM_NAV];
  const label=allItems.find(i=>i.id===cur)?.label??cur;
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar cur={cur} nav={nav} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar nav={nav} collapsed={collapsed} setCollapsed={setCollapsed} label={label}/>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function Landing({ nav }: { nav:(s:Screen)=>void }) {
  const [tick,setTick]=useState(0);
  useEffect(()=>{ const t=setInterval(()=>setTick(p=>p+1),2500); return()=>clearInterval(t); },[]);
  const features=["Model Playground","AI Mission Control","Brand DNA Studio","CMS Dashboard","Multi-Agent Workflows","Website Planner"];
  return (
    <div className="min-h-screen bg-[#07091c] text-white overflow-x-hidden">
      {/* Animated bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-violet-900/20 via-transparent to-transparent"/>
        <div className="absolute top-32 left-10 w-80 h-80 bg-violet-800/8 rounded-full blur-3xl"/>
        <div className="absolute top-60 right-10 w-64 h-64 bg-blue-800/8 rounded-full blur-3xl"/>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-800/6 rounded-full blur-3xl"/>
      </div>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#07091c]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="NEXORA" className="w-7 h-7" />
            <span className="font-black text-white text-sm">NEXORA</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-500">
            {["Platform","Agents","Pricing","Docs"].map(n=><a key={n} className="hover:text-white transition-colors cursor-pointer">{n}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <Btn variant="ghost" size="sm" onClick={()=>nav("signin")}>Sign In</Btn>
            <Btn variant="primary" size="sm" onClick={()=>nav("signup")}>Get Started Free</Btn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
              <Bdg color="violet" size="sm">Intelligent Brand Building Powered by AI</Bdg>
              <h1 className="text-5xl md:text-7xl font-black mt-5 mb-4 leading-[1.05] tracking-tight">
                Build Your Brand,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400">Powered by AI</span>
              </h1>
              <p className="text-base text-slate-400 max-w-xl mx-auto mb-8">
                NEXORA gives you Mission Control over all your AI agents, models, content, and brand assets — in one unified platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                <Btn size="lg" variant="primary" icon={Rocket} onClick={()=>nav("signup")}>Start for Free</Btn>
                <Btn size="lg" variant="secondary" icon={Play} onClick={()=>nav("mission")}>See Mission Control</Btn>
              </div>
            </motion.div>
          {/* Rotating feature pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {features.map((f,i)=>(
              <motion.span key={f} animate={{opacity:tick%6===i?1:0.35}} transition={{duration:0.4}}
                className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 cursor-default">{f}</motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 px-6 z-10 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">One Platform. Every Brand AI Tool You Need.</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon:TargetIcon, title:"AI Mission Control", desc:"Real-time monitoring of all agents, tasks & system health", color:"violet" },
              { icon:Command, title:"Command Center", desc:"Unified hub for AI workflows, MCP tools & agent orchestration", color:"blue" },
              { icon:BrainCircuit, title:"Model Playground", desc:"Test 30+ LLMs side-by-side with real-time benchmarks", color:"teal" },
              { icon:ImagePlus, title:"Image Generator", desc:"Create stunning visuals with next-gen diffusion models", color:"pink" },
              { icon:Bot, title:"AI Agents", desc:"Deploy autonomous agents for research, writing & code", color:"amber" },
              { icon:Layers, title:"Brand DNA Studio", desc:"Complete AI-powered brand identity management", color:"green" },
            ].map(f=>{
              const Ic=f.icon;
              return (
                <motion.div key={f.title} whileHover={{y:-3}} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/25 transition-all cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/25 to-purple-600/15 flex items-center justify-center mb-3"><Ic size={18} className="text-violet-300"/></div>
                  <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-6 border-y border-white/[0.05] bg-white/[0.015]">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-6 text-center">
          {[["12,842","Active Agents"],["4.2M","AI Calls/day"],["98.75%","Success Rate"],["1.42s","Avg Latency"]].map(([v,l])=>(
            <div key={l}><p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">{v}</p><p className="text-xs text-slate-500 mt-1">{l}</p></div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center z-10 relative">
        <h2 className="text-3xl font-black mb-4">Ready to build your brand with AI?</h2>
        <p className="text-slate-500 text-sm mb-8">Join 10,000+ teams using NEXORA to build smarter brands.</p>
        <Btn size="lg" variant="primary" icon={ArrowRight} onClick={()=>nav("signup")}>Get Started — It's Free</Btn>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><img src="/logo.svg" alt="NEXORA" className="w-5 h-5" /><span className="text-xs font-bold text-white">NEXORA</span></div>
          <p className="text-xs text-slate-700">© 2024 NEXORA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function AuthWrap({ children, title, subtitle, nav }: { children: React.ReactNode; title: string; subtitle?: string; nav:(s:Screen)=>void }) {
  return (
    <div className="min-h-screen bg-[#07091c] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-900/15 rounded-full blur-3xl"/>
      <motion.div {...fadeUp} className="w-full max-w-sm relative z-10">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2"><img src="/logo.svg" alt="NEXORA" className="w-7 h-7" /><span className="font-black text-white text-sm">NEXORA</span></div>
        </div>
        <Card className="p-7">
          <h2 className="text-xl font-bold text-white mb-0.5">{title}</h2>
          {subtitle&&<p className="text-xs text-slate-500 mb-5">{subtitle}</p>}
          {children}
        </Card>
      </motion.div>
    </div>
  );
}

function SignIn({ nav }: { nav:(s:Screen)=>void }) {
  const [e,setE]=useState("alex@learnify.ai"); const [p,setP]=useState("••••••••••"); const [sp,setSp]=useState(false);
  return (
    <AuthWrap title="Welcome Back" subtitle="Sign in to your NEXORA account." nav={nav}>
      <div className="space-y-2.5 mb-4">
        {[{label:"Email address",value:e,onChange:setE,icon:AtSign,type:"email"},{label:"Password",value:p,onChange:setP,icon:Lock,type:sp?"text":"password",extra:<button onClick={()=>setSp(!sp)} className="text-slate-600 hover:text-violet-400">{sp?<EyeOff size={12}/>:<Eye size={12}/>}</button>}].map(f=>(
          <div key={f.label}>
            <div className="flex justify-between mb-1"><label className="text-[11px] text-slate-500">{f.label}</label>{f.label==="Password"&&<button onClick={()=>nav("forgot")} className="text-[11px] text-violet-400">Forgot?</button>}</div>
            <div className="relative"><Inp type={f.type} value={f.value} onChange={f.onChange} icon={f.icon} placeholder={f.label}/>{f.extra&&<span className="absolute right-2.5 top-1/2 -translate-y-1/2">{f.extra}</span>}</div>
          </div>
        ))}
      </div>
      <Btn variant="primary" className="w-full justify-center" size="md" onClick={()=>nav("dashboard")}>Sign In</Btn>
      <p className="text-center text-[11px] text-slate-600 mt-4">No account? <button onClick={()=>nav("signup")} className="text-violet-400 font-semibold">Sign up free</button></p>
    </AuthWrap>
  );
}

function SignUp({ nav }: { nav:(s:Screen)=>void }) {
  return (
    <AuthWrap title="Create Account" subtitle="Start your NEXORA journey." nav={nav}>
      <div className="space-y-2.5 mb-4">
        {[{label:"Full Name",icon:User,ph:"Alex Johnson"},{label:"Email",icon:AtSign,ph:"you@company.com"},{label:"Password",icon:Lock,ph:"Create strong password",type:"password"}].map(f=>(
          <div key={f.label}><label className="text-[11px] text-slate-500 block mb-1">{f.label}</label><Inp icon={f.icon} placeholder={f.ph} type={f.type}/></div>
        ))}
      </div>
      <Btn variant="primary" className="w-full justify-center" size="md" onClick={()=>nav("verify")}>Create Account</Btn>
      <p className="text-center text-[11px] text-slate-600 mt-4">Have an account? <button onClick={()=>nav("signin")} className="text-violet-400 font-semibold">Sign in</button></p>
    </AuthWrap>
  );
}

function Forgot({ nav }: { nav:(s:Screen)=>void }) {
  const [sent,setSent]=useState(false);
  return (
    <AuthWrap title="Reset Password" subtitle="Enter your email to receive a reset link." nav={nav}>
      {!sent?(<>
        <label className="text-[11px] text-slate-500 block mb-1">Email</label>
        <Inp icon={AtSign} placeholder="you@company.com" className="mb-4"/>
        <Btn variant="primary" className="w-full justify-center" size="md" icon={Send} onClick={()=>setSent(true)}>Send Reset Link</Btn>
      </>):(
        <div className="text-center py-3"><div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-3"><CheckCircle size={24} className="text-emerald-400"/></div><p className="text-sm font-semibold text-white mb-1">Check your email</p><p className="text-xs text-slate-500 mb-4">We sent a reset link to your inbox.</p><Btn variant="primary" size="sm" onClick={()=>nav("signin")}>Back to Sign In</Btn></div>
      )}
    </AuthWrap>
  );
}

function Verify({ nav }: { nav:(s:Screen)=>void }) {
  return (
    <AuthWrap title="Verify Email" nav={nav}>
      <div className="text-center py-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-purple-600/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-4"><CheckCircle size={28} className="text-violet-400"/></div>
        <p className="text-sm text-white font-semibold mb-1">Email Sent!</p>
        <p className="text-xs text-slate-500 mb-5">Click the link in your email to verify your NEXORA account.</p>
        <Btn variant="primary" className="w-full justify-center" onClick={()=>nav("onboard")}>Continue to Setup</Btn>
      </div>
    </AuthWrap>
  );
}

function Onboard({ nav }: { nav:(s:Screen)=>void }) {
  const [step,setStep]=useState(1); const total=5;
  const [role,setRole]=useState(""); const [goals,setGoals]=useState<string[]>([]); const [style,setStyle]=useState("");
  const roles=[{id:"developer",label:"Developer",icon:Code2},{id:"designer",label:"Designer",icon:Paintbrush},{id:"marketer",label:"Marketer",icon:Megaphone},{id:"founder",label:"Founder",icon:Rocket},{id:"analyst",label:"Analyst",icon:BarChart3},{id:"other",label:"Other",icon:User}];
  const goalOpts=["Build AI Agents","Create Content at Scale","Automate Workflows","Test AI Models","Manage Brand Assets","Website Planning","Analyze Data","Build Products"];
  const styleOpts=[{id:"minimal",label:"Minimal",g:"from-slate-700 to-slate-500"},{id:"vibrant",label:"Vibrant",g:"from-violet-600 to-blue-500"},{id:"professional",label:"Professional",g:"from-blue-700 to-cyan-600"},{id:"creative",label:"Creative",g:"from-pink-600 to-violet-600"}];
  return (
    <div className="min-h-screen bg-[#07091c] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-blue-500"/>
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-900/10 rounded-full blur-3xl"/>
      <motion.div {...fadeUp} className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-2"><img src="/logo.svg" alt="NEXORA" className="w-6 h-6" /><span className="text-xs font-black text-white">NEXORA</span></div>
          <div className="flex items-center gap-1.5">
            {Array.from({length:total}).map((_,i)=><div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i<step?"bg-violet-500":"bg-white/10"} ${i===step-1?"w-6":"w-3"}`}/>)}
            <span className="text-[10px] text-slate-600 ml-1">{step}/{total}</span>
          </div>
        </div>
        <Card className="p-7">
          <AnimatePresence mode="wait">
            {step===1&&<motion.div key="s1" {...fadeUp}>
              <h2 className="text-xl font-bold text-white mb-0.5">Welcome to NEXORA 👋</h2>
              <p className="text-xs text-slate-500 mb-5">What best describes your role?</p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(r=>{const Ic=r.icon; return(
                  <button key={r.id} onClick={()=>setRole(r.id)} className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${role===r.id?"border-violet-500/60 bg-violet-500/10":"border-white/[0.06] hover:border-white/15"}`}>
                    <Ic size={14} className={role===r.id?"text-violet-400":"text-slate-500"}/><span className="text-xs text-white font-medium">{r.label}</span>
                  </button>
                );})}
              </div>
            </motion.div>}
            {step===2&&<motion.div key="s2" {...fadeUp}>
              <h2 className="text-xl font-bold text-white mb-0.5">What are your goals?</h2>
              <p className="text-xs text-slate-500 mb-5">Select all that apply</p>
              <div className="space-y-2">
                {goalOpts.map(g=>(
                  <button key={g} onClick={()=>setGoals(p=>p.includes(g)?p.filter(x=>x!==g):[...p,g])} className={`flex items-center gap-2.5 w-full p-2.5 rounded-lg border text-xs text-left transition-all ${goals.includes(g)?"border-violet-500/60 bg-violet-500/10 text-violet-300":"border-white/[0.06] text-slate-400 hover:border-white/15"}`}>
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${goals.includes(g)?"bg-violet-600 border-violet-500":"border-slate-600"}`}>{goals.includes(g)&&<Check size={8} className="text-white"/>}</div>{g}
                  </button>
                ))}
              </div>
            </motion.div>}
            {step===3&&<motion.div key="s3" {...fadeUp}>
              <h2 className="text-xl font-bold text-white mb-0.5">Choose your workspace style</h2>
              <p className="text-xs text-slate-500 mb-5">We'll personalize your experience</p>
              <div className="grid grid-cols-2 gap-3">
                {styleOpts.map(s=>(
                  <button key={s.id} onClick={()=>setStyle(s.id)} className={`overflow-hidden rounded-xl border-2 transition-all ${style===s.id?"border-violet-500":"border-white/[0.07]"}`}>
                    <div className={`h-16 bg-gradient-to-br ${s.g} flex items-center justify-center`}>{style===s.id&&<CheckCircle size={16} className="text-white"/>}</div>
                    <div className="p-2 bg-card text-left"><p className="text-xs font-semibold text-white">{s.label}</p></div>
                  </button>
                ))}
              </div>
            </motion.div>}
            {step===4&&<motion.div key="s4" {...fadeUp}>
              <h2 className="text-xl font-bold text-white mb-0.5">Invite your team <span className="text-slate-600">(optional)</span></h2>
              <p className="text-xs text-slate-500 mb-5">Collaborate with teammates</p>
              <Inp icon={AtSign} placeholder="teammate@company.com" className="mb-3"/>
              <div className="space-y-2">
                {["sarah@company.com","mike@company.com","emily@company.com"].map(e=>(
                  <div key={e} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#111830] border border-white/[0.06]">
                    <Ava name={e.split("@")[0]} size="xs"/><p className="text-xs text-slate-300 flex-1">{e}</p>
                    <select className="text-[10px] bg-transparent text-slate-500 border-0 outline-none"><option>Editor</option><option>Viewer</option></select>
                  </div>
                ))}
              </div>
            </motion.div>}
            {step===5&&<motion.div key="s5" {...fadeUp} className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-xl font-bold text-white mb-1">You're all set!</h2>
              <p className="text-xs text-slate-500 mb-6">Your NEXORA workspace is ready.</p>
              <div className="space-y-2 mb-6 text-left">
                {["Workspace created","AI agents initialized","Mission Control ready","Brand studio configured"].map(i=>(
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10"><CheckCircle size={12} className="text-emerald-400"/><span className="text-xs text-slate-300">{i}</span></div>
                ))}
              </div>
            </motion.div>}
          </AnimatePresence>
          <div className={`flex mt-5 ${step>1?"justify-between":"justify-end"}`}>
            {step>1&&<Btn variant="ghost" size="sm" icon={ChevronLeft} onClick={()=>setStep(p=>p-1)}>Back</Btn>}
            {step<total?<Btn variant="primary" size="sm" onClick={()=>setStep(p=>p+1)}>Next <ChevronRight size={12}/></Btn>
              :<Btn variant="primary" size="sm" icon={Rocket} onClick={()=>nav("mission")}>Launch Mission Control</Btn>}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function Dashboard({ nav }: { nav:(s:Screen)=>void }) {
  const chartData=[
    {d:"Mon",agents:24,tasks:156,success:97},{d:"Tue",agents:28,tasks:189,success:98},
    {d:"Wed",agents:31,tasks:203,success:96},{d:"Thu",agents:27,tasks:178,success:99},
    {d:"Fri",agents:35,tasks:241,success:97},{d:"Sat",agents:22,tasks:134,success:98},
    {d:"Sun",agents:29,tasks:198,success:99},
  ];
  const recent=[
    {name:"Brand Content Pipeline",type:"Workflow",status:"running",t:"2m ago"},
    {name:"Acme Education Website",type:"Website",status:"complete",t:"1h ago"},
    {name:"Q4 Marketing Copy",type:"CMS",status:"running",t:"3h ago"},
    {name:"Logo Variation Set",type:"Creative",status:"review",t:"5h ago"},
  ];
  const agents=[
    {name:"Content Writer",tasks:1248,rate:"99.1%",color:"emerald"},
    {name:"Brand Architect",tasks:892,rate:"98.3%",color:"violet"},
    {name:"Data Analyst",tasks:634,rate:"97.8%",color:"blue"},
    {name:"Code Assistant",tasks:421,rate:"99.5%",color:"teal"},
  ];
  return (
    <motion.div {...fadeUp}>
      <PH title="Dashboard" subtitle="Real-time overview of your AI platform">
        <Btn variant="secondary" size="sm" icon={RefreshCw}>Refresh</Btn>
        <Btn variant="primary" size="sm" icon={Plus} onClick={()=>nav("command")}>New Task</Btn>
      </PH>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard label="Active Agents" value="28" delta="+3 today" icon={Bot} color="violet"/>
        <StatCard label="Running Tasks" value="156" delta="+12%" icon={ListChecks} color="teal"/>
        <StatCard label="Success Rate" value="97.8%" delta="+0.3%" icon={CheckCircle} color="green"/>
        <StatCard label="Monthly Cost" value="$48.72" sub="Last: $52.10" icon={DollarSign} color="amber"/>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">System Performance</h3>
              <div className="flex gap-1">{["7d","30d","90d"].map(t=><button key={t} className={`text-[10px] px-2 py-0.5 rounded ${t==="7d"?"bg-violet-600/25 text-violet-300":"text-slate-600 hover:text-slate-400"}`}>{t}</button>)}</div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3}/><stop offset="100%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3}/><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)"/>
                <XAxis dataKey="d" tick={{fill:"#475569",fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:9}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#111830",border:"1px solid rgba(124,58,237,0.2)",borderRadius:8,fontSize:10}}/>
                <Area type="monotone" dataKey="tasks" stroke="#7c3aed" fill="url(#ga)" strokeWidth={1.5}/>
                <Area type="monotone" dataKey="agents" stroke="#0ea5e9" fill="url(#gb)" strokeWidth={1.5}/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Recent Projects</h3>
              <Btn variant="ghost" size="xs" onClick={()=>nav("project")}>View all</Btn>
            </div>
            <div className="space-y-2">
              {recent.map(r=>(
                <div key={r.name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0"><Wand2 size={12} className="text-violet-400"/></div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">{r.name}</p><p className="text-[10px] text-slate-600">{r.type} · {r.t}</p></div>
                  <Bdg color={r.status==="complete"?"green":r.status==="review"?"amber":"teal"} size="xs">{r.status}</Bdg>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-bold text-white mb-3">Top Agents</h3>
            <div className="space-y-3">
              {agents.map(a=>(
                <div key={a.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5"><Dot color="green"/><span className="text-xs text-slate-300">{a.name}</span></div>
                    <span className="text-[10px] text-emerald-400 font-semibold">{a.rate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-white/10"><div className="h-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" style={{width:a.rate}}/></div>
                    <span className="text-[10px] text-slate-600">{a.tasks}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-bold text-white mb-3">Quick Launch</h3>
            <div className="space-y-1.5">
              {([["command","AI Command Center",Command],["mission","Mission Control",TargetIcon],["playground","Model Playground",BrainCircuit],["agents","Deploy Agent",Bot]] as [Screen,string,React.ElementType][]).map(([id,label,Ic])=>(
                <button key={id} onClick={()=>nav(id)} className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-white/[0.05] text-left transition-colors group">
                  <div className="w-5 h-5 rounded-md bg-violet-500/15 flex items-center justify-center"><Ic size={11} className="text-violet-400"/></div>
                  <span className="text-xs text-slate-500 group-hover:text-white transition-colors flex-1">{label}</span>
                  <ChevronRight size={9} className="text-slate-700 group-hover:text-violet-400 transition-colors"/>
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-bold text-white mb-2">Live Feed</h3>
            <div className="space-y-2">
              {[{txt:"Content Writer completed blog post",t:"1m",c:"green"},{txt:"Brand Agent started logo generation",t:"3m",c:"violet"},{txt:"Workflow triggered: Daily Report",t:"8m",c:"blue"},{txt:"MCP Tool: Figma sync complete",t:"12m",c:"teal"},{txt:"API rate limit warning",t:"15m",c:"amber"}].map((f,i)=>(
                <div key={i} className="flex items-start gap-2">
                  <Dot color={f.c as any}/><div className="flex-1 min-w-0"><p className="text-[10px] text-slate-400 leading-relaxed">{f.txt}</p></div><span className="text-[9px] text-slate-700 flex-shrink-0">{f.t}m</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function CommandCenter({ nav }: { nav:(s:Screen)=>void }) {
  const [tab,setTab]=useState("agents");
  const [query,setQuery]=useState("");
  const tabs=["AI Chat","MCP Servers","Agents","Create Board","Add Content","Build Workflow","Set Agent"];
  const stats=[
    {label:"Token Usage",value:"12,842",icon:Zap,color:"violet"},
    {label:"AI Calls",value:"4.2M",icon:Activity,color:"blue"},
    {label:"Cost",value:"$68.42",icon:DollarSign,color:"amber"},
    {label:"Active Models",value:"24",icon:BrainCircuit,color:"teal"},
    {label:"Success Rate",value:"98.75%",icon:CheckCircle,color:"green"},
    {label:"Avg Latency",value:"1.42s",icon:Timer,color:"gray" as any},
  ];
  const activeAgents=[
    {name:"Brand Architect",role:"Design & Branding",status:"running",tasks:24,color:"violet"},
    {name:"Content Writer",role:"Blog & Copy",status:"running",tasks:18,color:"teal"},
    {name:"Data Analyst",role:"Research & Reports",status:"idle",tasks:0,color:"blue"},
    {name:"Code Assistant",role:"Dev & Automation",status:"running",tasks:7,color:"emerald"},
    {name:"Image Creator",role:"Visual Assets",status:"running",tasks:12,color:"pink"},
    {name:"SEO Optimizer",role:"Search & Traffic",status:"idle",tasks:0,color:"amber"},
  ];
  const workflows=[
    {name:"Brand Content Pipeline",steps:8,status:"running",last:"2m ago"},
    {name:"Blog Auto-Publisher",steps:5,status:"complete",last:"1h ago"},
    {name:"Social Media Automation",steps:12,status:"running",last:"5m ago"},
    {name:"Performance Report",steps:4,status:"scheduled",last:"Tomorrow 9am"},
  ];
  const mcpTools=[
    {name:"Figma",icon:"F",color:"violet"},{name:"Typeform",icon:"T",color:"blue"},
    {name:"Slack",icon:"S",color:"teal"},{name:"GitHub",icon:"G",color:"gray"},
    {name:"Notion",icon:"N",color:"amber"},{name:"Stripe",icon:"S",color:"green"},
    {name:"HubSpot",icon:"H",color:"orange"},{name:"Zapier",icon:"Z",color:"red"},
  ];
  return (
    <motion.div {...fadeUp}>
      <PH title="AI Command Center" subtitle="Your central hub for AI agents, tools, and workflows">
        <Btn variant="secondary" size="sm" icon={Filter}>Filter</Btn>
        <Btn variant="primary" size="sm" icon={Plus}>New Workflow</Btn>
      </PH>
      {/* Search */}
      <Card className="p-3 mb-4 flex items-center gap-3">
        <Search size={14} className="text-slate-600 flex-shrink-0"/>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="What would you like AI to do today? e.g. 'Write a landing page for my product'" className="flex-1 bg-transparent text-sm text-slate-300 placeholder:text-slate-700 outline-none"/>
        <Btn variant="primary" size="sm" icon={ArrowRight}>Ask AI</Btn>
      </Card>
      {/* Tabs */}
      <div className="flex gap-1 bg-[#0c1022] p-1 rounded-xl mb-4 overflow-x-auto">
        {tabs.map(t=><button key={t} onClick={()=>setTab(t.toLowerCase().replace(" ","_"))} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${tab===t.toLowerCase().replace(" ","_")?"bg-violet-600/30 text-violet-300":"text-slate-600 hover:text-slate-300"}`}>{t}</button>)}
      </div>
      {/* Stats */}
      <div className="grid grid-cols-6 gap-3 mb-4">
        {stats.map(s=><StatCard key={s.label} {...s}/>)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {/* Agents */}
        <div>
          <div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-white">Active Agents</h3><Btn variant="ghost" size="xs" onClick={()=>nav("agents")}>View all</Btn></div>
          <div className="space-y-2">
            {activeAgents.map(a=>(
              <Card key={a.name} className="p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-lg bg-${a.color}-500/15 flex items-center justify-center flex-shrink-0`}><Bot size={12} className={`text-${a.color}-400`}/></div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">{a.name}</p><p className="text-[10px] text-slate-600">{a.role}</p></div>
                  <Dot color={a.status==="running"?"green":"gray"}/>
                </div>
                {a.status==="running"&&<div><div className="flex items-center justify-between mb-1"><span className="text-[9px] text-slate-600">{a.tasks} tasks running</span></div><div className="h-1 bg-white/10 rounded-full"><motion.div animate={{width:`${(a.tasks/30)*100}%`}} transition={{duration:1}} className="h-1 bg-violet-500 rounded-full"/></div></div>}
                {a.status==="idle"&&<p className="text-[10px] text-slate-700">Waiting for tasks…</p>}
              </Card>
            ))}
          </div>
        </div>
        {/* Workflows + MCP */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-white">Recent Workflows</h3><Btn variant="ghost" size="xs" onClick={()=>nav("workflows")}>View all</Btn></div>
            <div className="space-y-2">
              {workflows.map(w=>(
                <Card key={w.name} className="p-3 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center flex-shrink-0"><GitBranch size={11} className="text-blue-400"/></div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">{w.name}</p><p className="text-[10px] text-slate-600">{w.steps} steps · {w.last}</p></div>
                  <Bdg color={w.status==="running"?"teal":w.status==="complete"?"green":"gray"} size="xs">{w.status}</Bdg>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white mb-2">MCP Tools</h3>
            <div className="grid grid-cols-4 gap-1.5">
              {mcpTools.map(t=>(
                <div key={t.name} className="flex flex-col items-center gap-1 p-2 rounded-lg border border-white/[0.06] hover:border-violet-500/25 transition-colors cursor-pointer">
                  <div className={`w-7 h-7 rounded-lg bg-${t.color}-500/15 flex items-center justify-center text-xs font-bold text-${t.color}-300`}>{t.icon}</div>
                  <span className="text-[9px] text-slate-600">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* AI Insights + Quick Actions */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-3">Quick Actions</h3>
            <div className="space-y-1.5">
              {([["New Agent",Bot],["New Workflow",GitBranch],["Upload Files",Upload],["Connect MCP",Server],["AI Prompt",MessageSquare]] as [string,React.ElementType][]).map(([l,Ic])=>(
                <button key={l} className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-white/[0.05] transition-colors group">
                  <div className="w-5 h-5 rounded-md bg-violet-500/15 flex items-center justify-center"><Ic size={10} className="text-violet-400"/></div>
                  <span className="text-[11px] text-slate-500 group-hover:text-white transition-colors">{l}</span>
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-3">AI Insights</h3>
            <div className="space-y-2">
              {["Content Writer Agent at 94% capacity — consider scaling","Blog Automation saved 42 hours this week","High token usage on GPT-4o — suggest switching to Claude for drafts","Success rate improved 2.1% after workflow optimization"].map((insight,i)=>(
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-violet-500/5 border border-violet-500/10">
                  <Lightbulb size={10} className="text-violet-400 flex-shrink-0 mt-0.5"/><p className="text-[10px] text-slate-400">{insight}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function MissionControl({ nav }: { nav:(s:Screen)=>void }) {
  const [ts] = useState("08:42:15 AM");
  const perfData = [
    {t:"00:00",cpu:42,mem:68,tasks:120},{t:"02:00",cpu:55,mem:72,tasks:145},{t:"04:00",cpu:38,mem:65,tasks:98},
    {t:"06:00",cpu:67,mem:78,tasks:178},{t:"08:00",cpu:71,mem:80,tasks:203},{t:"10:00",cpu:58,mem:74,tasks:167},
    {t:"12:00",cpu:85,mem:86,tasks:241},{t:"14:00",cpu:79,mem:83,tasks:219},{t:"16:00",cpu:64,mem:76,tasks:185},
    {t:"18:00",cpu:53,mem:70,tasks:152},{t:"20:00",cpu:46,mem:68,tasks:134},{t:"22:00",cpu:41,mem:65,tasks:118},
  ];
  const taskQueue=[
    {agent:"Brand Content Agent",type:"Blog Post",priority:"High",status:"running"},
    {agent:"Data Analysis Agent",type:"Market Report",priority:"Med",status:"queued"},
    {agent:"Image Creator",type:"Social Assets",priority:"High",status:"running"},
    {agent:"Code Assistant",type:"API Integration",priority:"Low",status:"queued"},
    {agent:"SEO Agent",type:"Keyword Analysis",priority:"Med",status:"running"},
  ];
  const agentDir=[
    {name:"Brand Architect",tasks:1248,rate:"99.1%",uptime:"99.9%",status:"active"},
    {name:"Content Writer",tasks:892,rate:"98.3%",uptime:"99.7%",status:"active"},
    {name:"Data Analyst",tasks:634,rate:"97.8%",uptime:"98.5%",status:"active"},
    {name:"Code Assistant",tasks:421,rate:"99.5%",uptime:"100%",status:"active"},
    {name:"Image Creator",tasks:312,rate:"96.2%",uptime:"97.8%",status:"maintenance"},
  ];
  const liveFeed=[
    {type:"success",msg:"Brand Content Pipeline completed",t:"Just now"},
    {type:"info",msg:"New agent task assigned: Market Research",t:"1m"},
    {type:"warning",msg:"GPT-4o API rate limit at 80%",t:"3m"},
    {type:"success",msg:"Blog post published successfully",t:"5m"},
    {type:"info",msg:"Workflow triggered: Daily SEO Report",t:"8m"},
    {type:"error",msg:"Image generation timed out — retrying",t:"12m"},
    {type:"success",msg:"MCP Figma sync complete",t:"15m"},
    {type:"info",msg:"New team member joined workspace",t:"22m"},
  ];
  return (
    <motion.div {...fadeUp}>
      {/* Top stats */}
      <div className="flex items-center justify-between mb-3">
        <div><h1 className="text-lg font-bold text-white">AI Mission Control</h1><p className="text-[10px] text-slate-600">Real-time command center for all AI agents, tasks, and operations</p></div>
        <div className="flex items-center gap-3">
          <div className="text-right"><p className="text-[10px] text-slate-600">SYSTEM TIME</p><p className="text-xs font-mono text-violet-400">{ts} UTC</p></div>
          <Btn variant="secondary" size="sm" icon={RefreshCw}>Refresh</Btn>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {[
          {label:"Active Agents",value:"28",sub:"↑ 4 online",icon:Bot,color:"violet"},
          {label:"Running Tasks",value:"156",sub:"12 queued",icon:ListChecks,color:"teal"},
          {label:"Success Rate",value:"97.8%",sub:"+0.3% today",icon:CheckCircle,color:"green"},
          {label:"Revenue Impact",value:"1.42x",sub:"vs baseline",icon:TrendingUp,color:"blue"},
          {label:"Infra Cost",value:"$48.72",sub:"Budget: $100",icon:DollarSign,color:"amber"},
        ].map(s=><StatCard key={s.label} {...s}/>)}
      </div>

      <div className="grid grid-cols-12 gap-3 mb-3">
        {/* Mission Overview - orbital viz */}
        <Card className="col-span-4 p-4">
          <div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-white">Mission Overview</h3><Bdg color="green" size="xs">● All Systems Go</Bdg></div>
          <div className="relative h-48 flex items-center justify-center">
            {/* Orbital rings */}
            {[80,56,32].map((r,i)=>(
              <div key={r} className="absolute rounded-full border border-violet-500/20" style={{width:r*2,height:r*2,left:`calc(50% - ${r}px)`,top:`calc(50% - ${r}px)`}}>
                {[0,1,2].map(j=>{
                  const angle=(j*(360/3)+i*30+tick2)*(Math.PI/180);
                  const x=r*Math.cos(angle); const y=r*Math.sin(angle);
                  return <div key={j} className={`absolute w-2.5 h-2.5 rounded-full bg-${["violet","teal","emerald"][i]}-500 shadow-lg shadow-${["violet","teal","emerald"][i]}-500/50`} style={{left:`calc(50% + ${x}px - 5px)`,top:`calc(50% + ${y}px - 5px)`}}/>;
                })}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center z-10 shadow-xl shadow-violet-900/60"><BrainCircuit size={16} className="text-white"/></div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {[{l:"Agents",v:"28",c:"violet"},{l:"Models",v:"8",c:"teal"},{l:"MCP Tools",v:"14",c:"blue"}].map(s=>(
              <div key={s.l} className="text-center"><p className={`text-sm font-bold text-${s.c}-400`}>{s.v}</p><p className="text-[9px] text-slate-600">{s.l}</p></div>
            ))}
          </div>
        </Card>

        {/* System Performance */}
        <Card className="col-span-5 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white">System Performance</h3>
            <div className="flex gap-3">{[{c:"#7c3aed",l:"CPU %"},{c:"#0ea5e9",l:"Memory %"},{c:"#10b981",l:"Tasks"}].map(l=><div key={l.l} className="flex items-center gap-1"><div className="w-2 h-1 rounded" style={{background:l.c}}/><span className="text-[9px] text-slate-600">{l.l}</span></div>)}</div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={perfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)"/>
              <XAxis dataKey="t" tick={{fill:"#475569",fontSize:8}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#475569",fontSize:8}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#111830",border:"1px solid rgba(124,58,237,0.2)",borderRadius:8,fontSize:10}}/>
              <Line type="monotone" dataKey="cpu" stroke="#7c3aed" strokeWidth={1.5} dot={false}/>
              <Line type="monotone" dataKey="mem" stroke="#0ea5e9" strokeWidth={1.5} dot={false}/>
              <Line type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={1.5} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Live Feed */}
        <Card className="col-span-3 p-4">
          <div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-white">Live Feed</h3><div className="flex items-center gap-1"><Dot color="green"/><span className="text-[9px] text-slate-600">Live</span></div></div>
          <div className="space-y-2 overflow-y-auto max-h-48">
            {liveFeed.map((f,i)=>{
              const c={success:"emerald",info:"blue",warning:"amber",error:"red"}[f.type]??"gray";
              return (
                <div key={i} className="flex items-start gap-2">
                  <Dot color={c as any}/><div className="flex-1 min-w-0"><p className="text-[10px] text-slate-400 leading-relaxed">{f.msg}</p></div><span className="text-[9px] text-slate-700 flex-shrink-0">{f.t}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-12 gap-3">
        {/* Task Queue */}
        <Card className="col-span-5 overflow-hidden">
          <div className="p-3 border-b border-white/[0.05] flex items-center justify-between"><h3 className="text-xs font-bold text-white">Task Queue</h3><Bdg color="violet" size="xs">{taskQueue.length} tasks</Bdg></div>
          <div className="divide-y divide-white/[0.04]">
            {taskQueue.map((t,i)=>(
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/[0.02] transition-colors">
                <Dot color={t.status==="running"?"green":"gray"}/>
                <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold text-white truncate">{t.agent}</p><p className="text-[9px] text-slate-600">{t.type}</p></div>
                <Bdg color={t.priority==="High"?"red":t.priority==="Med"?"amber":"gray"} size="xs">{t.priority}</Bdg>
                <Bdg color={t.status==="running"?"teal":"gray"} size="xs">{t.status}</Bdg>
              </div>
            ))}
          </div>
        </Card>

        {/* Agent Directory */}
        <Card className="col-span-4 overflow-hidden">
          <div className="p-3 border-b border-white/[0.05]"><h3 className="text-xs font-bold text-white">Agent Directory</h3></div>
          <div className="divide-y divide-white/[0.04]">
            {agentDir.map(a=>(
              <div key={a.name} className="flex items-center gap-2 px-3 py-2 hover:bg-white/[0.02]">
                <Dot color={a.status==="active"?"green":"amber"}/>
                <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold text-white truncate">{a.name}</p><p className="text-[9px] text-slate-600">{a.tasks} tasks</p></div>
                <div className="text-right"><p className="text-[10px] text-emerald-400">{a.rate}</p><p className="text-[9px] text-slate-600">{a.uptime}</p></div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights + Shortcuts */}
        <div className="col-span-3 space-y-3">
          <Card className="p-3">
            <h3 className="text-[11px] font-bold text-white mb-2">AI Insights</h3>
            <div className="space-y-1.5">
              {["Content Writer at 94% capacity","GPT-4o costs up 18% — switch to Claude Haiku","42 hours saved via automation this week","Success rate +2.1% after optimization"].map((t,i)=>(
                <div key={i} className="flex items-start gap-1.5 p-1.5 rounded-md bg-violet-500/5 border border-violet-500/10"><Lightbulb size={9} className="text-violet-400 flex-shrink-0 mt-0.5"/><p className="text-[9px] text-slate-400">{t}</p></div>
              ))}
            </div>
          </Card>
          <Card className="p-3">
            <h3 className="text-[11px] font-bold text-white mb-2">Shortcuts</h3>
            <div className="space-y-1">
              {([["New Agent",Bot,nav,"agents"],["New Workflow",GitBranch,nav,"workflows"],["Playground",BrainCircuit,nav,"playground"]] as [string,React.ElementType,Function,Screen][]).map(([l,Ic,fn,sc])=>(
                <button key={l} onClick={()=>fn(sc)} className="flex items-center gap-1.5 w-full p-1.5 rounded-md hover:bg-white/[0.04] transition-colors">
                  <Ic size={10} className="text-violet-400"/><span className="text-[10px] text-slate-500 hover:text-white transition-colors">{l}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// orbital tick helper
let tick2 = 0;
setInterval(() => { tick2 += 0.5; }, 50);

// ═══════════════════════════════════════════════════════════════════════════════
// AI TOOL SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function ModelPlayground() {
  const [model,setModel]=useState("gpt-4o");
  const [sysprompt,setSysprompt]=useState("You are a helpful, professional, and intelligent assistant for designers, developers, marketers and businesses.");
  const [msg,setMsg]=useState("");
  const [temp,setTemp]=useState(0.7);
  const models=[
    {id:"gpt-4o",name:"GPT-4o",provider:"OpenAI",score:"4.8"},
    {id:"claude-3-5",name:"Claude 3.5 Sonnet",provider:"Anthropic",score:"4.9"},
    {id:"gemini-1-5",name:"Gemini 1.5 Pro",provider:"Google",score:"4.7"},
    {id:"mistral",name:"Mixtral Large 2",provider:"Mistral",score:"4.5"},
    {id:"llama3-1",name:"LLaMA 3.1 405B",provider:"Meta",score:"4.6"},
  ];
  const [msgs]=useState([
    {role:"user",text:"Design a landing page for an AI tool that helps students learn smarter. Use modern, engaging copy."},
    {role:"ai",text:"Here's a compelling landing page design for an AI-powered learning platform:\n\n**Headline:** Learn Smarter, Not Harder\n\n**Subheadline:** Your AI study partner that adapts to your unique learning style, helps you master complex topics faster, and makes every study session count.\n\n**Primary CTA:** Start Learning for Free\n**Secondary CTA:** Watch Demo"},
  ]);
  const benchmarks=[{label:"Accuracy",value:94},{label:"Speed",value:87},{label:"Coherence",value:96},{label:"Safety",value:99}];
  return (
    <motion.div {...fadeUp} className="flex gap-4 h-[calc(100vh-140px)]">
      {/* Model list */}
      <Card className="w-48 flex-shrink-0 flex flex-col">
        <div className="p-3 border-b border-white/[0.05]"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Model</p></div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
          {models.map(m=>(
            <button key={m.id} onClick={()=>setModel(m.id)} className={`w-full text-left p-3 hover:bg-white/[0.03] transition-colors ${model===m.id?"bg-violet-500/10":""}`}>
              <p className={`text-xs font-semibold ${model===m.id?"text-violet-300":"text-white"}`}>{m.name}</p>
              <p className="text-[9px] text-slate-600">{m.provider}</p>
              <div className="flex items-center gap-1 mt-1"><Star size={8} className="text-amber-400"/><span className="text-[9px] text-slate-500">{m.score}</span></div>
            </button>
          ))}
        </div>
      </Card>

      {/* Main */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <Card className="p-3">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Prompt</p><div className="flex gap-1.5"><Btn variant="ghost" size="xs" icon={Save}>Save</Btn><Btn variant="ghost" size="xs" icon={Share2}>Share</Btn></div></div>
          <Inp value={sysprompt} onChange={setSysprompt} rows={3}/>
        </Card>
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m,i)=>(
              <div key={i} className={`flex gap-2.5 ${m.role==="user"?"justify-end":""}`}>
                {m.role==="ai"&&<div className="w-6 h-6 rounded-full bg-violet-600/30 flex items-center justify-center flex-shrink-0"><BrainCircuit size={11} className="text-violet-400"/></div>}
                <div className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${m.role==="user"?"bg-violet-600/20 text-violet-100 rounded-br-sm":"bg-[#111830] text-slate-300 rounded-bl-sm"}`}>{m.text}</div>
                {m.role==="user"&&<Ava name="Alex Johnson" size="xs"/>}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/[0.05] flex gap-2">
            <Inp value={msg} onChange={setMsg} placeholder="Type your message…" className="flex-1"/>
            <Btn variant="primary" size="sm" icon={Send}>Send</Btn>
          </div>
        </Card>
      </div>

      {/* Parameters */}
      <Card className="w-52 flex-shrink-0 flex flex-col">
        <div className="p-3 border-b border-white/[0.05] flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Parameters</p>
          <Btn variant="ghost" size="xs" icon={RefreshCw}/>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <div className="flex justify-between mb-1.5"><label className="text-[10px] text-slate-500">Temperature</label><span className="text-[10px] text-violet-300 font-mono">{temp.toFixed(1)}</span></div>
            <input type="range" min={0} max={2} step={0.1} value={temp} onChange={e=>setTemp(parseFloat(e.target.value))} className="w-full accent-violet-600 h-1"/>
            <div className="flex justify-between text-[9px] text-slate-700 mt-0.5"><span>Precise</span><span>Creative</span></div>
          </div>
          {[{label:"Max Tokens",val:"4,118"},{label:"Top P",val:"0.9"},{label:"Freq Penalty",val:"0.0"}].map(p=>(
            <div key={p.label}>
              <div className="flex justify-between mb-1"><label className="text-[10px] text-slate-500">{p.label}</label><span className="text-[10px] text-slate-300 font-mono">{p.val}</span></div>
              <div className="h-1.5 bg-white/10 rounded-full"><div className="h-1.5 bg-violet-500/60 rounded-full w-3/4"/></div>
            </div>
          ))}
          <div className="pt-2 border-t border-white/[0.05]">
            <p className="text-[10px] font-bold text-slate-500 mb-2">Cost Estimate</p>
            {[{l:"Input",v:"1,245 tokens"},{l:"Output",v:"2,873 tokens"},{l:"Est. Cost",v:"$0.0124"}].map(c=>(
              <div key={c.l} className="flex justify-between py-1"><span className="text-[10px] text-slate-600">{c.l}</span><span className="text-[10px] text-white font-mono">{c.v}</span></div>
            ))}
          </div>
          <div className="pt-2 border-t border-white/[0.05]">
            <p className="text-[10px] font-bold text-slate-500 mb-2">Benchmarks</p>
            {benchmarks.map(b=>(
              <div key={b.label} className="mb-2">
                <div className="flex justify-between mb-0.5"><span className="text-[10px] text-slate-600">{b.label}</span><span className="text-[10px] text-emerald-400">{b.value}%</span></div>
                <div className="h-1 bg-white/10 rounded-full"><div className="h-1 bg-emerald-500 rounded-full" style={{width:`${b.value}%`}}/></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ImageGen() {
  const [prompt,setPrompt]=useState("");
  const [style,setStyle]=useState("photorealistic");
  const [generating,setGenerating]=useState(false);
  const styles=["Photorealistic","Illustration","3D Render","Anime","Cinematic","Abstract"];
  const ratio=["1:1","16:9","4:3","9:16"];
  const [selRatio,setRatio]=useState("1:1");
  const history=[
    {g:"from-violet-900 to-indigo-900"},{g:"from-blue-900 to-cyan-900"},{g:"from-pink-900 to-violet-900"},
    {g:"from-teal-900 to-emerald-900"},{g:"from-orange-900 to-red-900"},{g:"from-slate-800 to-slate-900"},
  ];
  return (
    <motion.div {...fadeUp} className="flex gap-4 h-[calc(100vh-140px)]">
      <Card className="w-56 flex-shrink-0 p-4 space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Prompt</label>
          <Inp rows={4} placeholder="Describe the image you want to create…" value={prompt} onChange={setPrompt}/>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Style</label>
          <div className="grid grid-cols-2 gap-1">
            {styles.map(s=><button key={s} onClick={()=>setStyle(s.toLowerCase())} className={`py-1.5 rounded-md text-[10px] font-medium transition-all ${style===s.toLowerCase()?"bg-violet-600/30 text-violet-300 border border-violet-500/40":"bg-[#111830] text-slate-600 hover:text-slate-300 border border-white/[0.05]"}`}>{s}</button>)}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Aspect Ratio</label>
          <div className="flex flex-wrap gap-1">
            {ratio.map(r=><button key={r} onClick={()=>setRatio(r)} className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${selRatio===r?"bg-violet-600/30 text-violet-300":"bg-[#111830] text-slate-600"}`}>{r}</button>)}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Quality</label>
          <select className="w-full bg-[#111830] border border-white/[0.07] rounded-lg px-2.5 py-2 text-xs text-slate-300 outline-none">
            <option>Standard</option><option>HD</option><option>Ultra HD 4K</option>
          </select>
        </div>
        <Btn variant="primary" className="w-full justify-center" icon={generating?RefreshCw:Sparkles} disabled={generating} onClick={()=>{setGenerating(true);setTimeout(()=>setGenerating(false),2000);}}>
          {generating?"Generating…":"Generate Image"}
        </Btn>
      </Card>

      <div className="flex-1 flex flex-col gap-3">
        <Card className="flex-1 flex items-center justify-center bg-gradient-to-br from-violet-950/40 via-slate-950 to-indigo-950/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle, rgba(124,58,237,0.4) 1px, transparent 1px)",backgroundSize:"28px 28px"}}/>
          {!generating?(
            <div className="text-center z-10"><div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center mx-auto mb-3"><ImagePlus size={24} className="text-violet-400"/></div><p className="text-sm text-slate-500">Configure & generate your image</p><p className="text-xs text-slate-700 mt-1">Supports 30+ art styles and 4K resolution</p></div>
          ):(
            <div className="text-center z-10">
              <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-2"/>
              <p className="text-sm text-slate-400">Generating your image…</p>
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-1.5">
            <Btn variant="secondary" size="xs" icon={Download}>Save</Btn>
            <Btn variant="secondary" size="xs" icon={Share2}>Share</Btn>
          </div>
        </Card>
        <Card className="p-3">
          <h3 className="text-xs font-bold text-white mb-2">Recent Generations</h3>
          <div className="grid grid-cols-6 gap-2">
            {history.map((h,i)=><div key={i} className={`aspect-square rounded-lg bg-gradient-to-br ${h.g} cursor-pointer hover:ring-1 hover:ring-violet-500 transition-all`}/>)}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function VoiceStudio() {
  const [recording,setRecording]=useState(false);
  const [text,setText]=useState("Welcome to NEXORA. Your intelligent brand architect.");
  const voices=["Nova (Feminine)","Echo (Masculine)","Shimmer (Neutral)","Fable (British)","Alloy (Versatile)","Onyx (Deep)"];
  const [voice,setVoice]=useState("Nova (Feminine)");
  const bars=Array.from({length:40},(_,i)=>Math.random()*100);
  return (
    <motion.div {...fadeUp} className="flex gap-4 h-[calc(100vh-140px)]">
      <Card className="w-56 flex-shrink-0 p-4 space-y-4">
        <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Voice</label><div className="space-y-1">{voices.map(v=><button key={v} onClick={()=>setVoice(v)} className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all ${voice===v?"bg-violet-600/25 text-violet-300 border border-violet-500/40":"text-slate-500 hover:text-white hover:bg-white/[0.04]"}`}>{v}</button>)}</div></div>
        <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Speed</label><input type="range" min={0.5} max={2} step={0.1} defaultValue={1} className="w-full accent-violet-600 h-1"/></div>
        <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Pitch</label><input type="range" min={-12} max={12} step={1} defaultValue={0} className="w-full accent-violet-600 h-1"/></div>
      </Card>
      <div className="flex-1 flex flex-col gap-3">
        <Card className="p-4 flex-1 flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Text to Convert</label>
          <Inp rows={6} value={text} onChange={setText} placeholder="Enter text to convert to speech…"/>
          {/* Waveform */}
          <div className="flex-1 flex items-center justify-center my-4">
            <div className="flex items-center gap-px h-20">
              {bars.map((h,i)=>(
                <motion.div key={i} animate={recording?{height:[`${h*0.4}%`,`${h}%`,`${h*0.6}%`]}:{height:`${h*0.3}%`}} transition={{duration:0.5,repeat:recording?Infinity:0,delay:i*0.02}} className="w-1.5 rounded-full bg-gradient-to-t from-violet-600 to-purple-400" style={{height:`${h*0.3}%`,minHeight:3}}/>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] transition-colors text-slate-400"><SkipForward size={16}/></button>
            <button onClick={()=>setRecording(r=>!r)} className={`p-4 rounded-full transition-all ${recording?"bg-red-500/20 text-red-400 border border-red-500/40":"bg-violet-600/30 text-violet-300 border border-violet-500/40 hover:bg-violet-600/50"}`}>
              {recording?<Pause size={20}/>:<PlayCircle size={20}/>}
            </button>
            <button className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] transition-colors text-slate-400"><Volume2 size={16}/></button>
          </div>
        </Card>
        <Card className="p-3 flex items-center gap-3">
          <div className="flex-1"><p className="text-xs font-semibold text-white">nova_voice_output_v1.mp3</p><p className="text-[10px] text-slate-600">00:00 / 00:24 · 2.4 MB</p></div>
          <Btn variant="secondary" size="sm" icon={Download}>Download</Btn>
          <Btn variant="primary" size="sm" icon={Share2}>Share</Btn>
        </Card>
      </div>
    </motion.div>
  );
}

function ChatScreen() {
  const [input,setInput]=useState("");
  const [model,setModel]=useState("claude-3-5");
  const conv=[
    {role:"ai",text:"Hi! I'm your NEXORA assistant. I can help you with brand strategy, content creation, data analysis, code, research, and more. What would you like to work on?"},
    {role:"user",text:"Help me write a product description for an AI-powered learning app."},
    {role:"ai",text:"Here's a compelling brand strategy:\n\n**NEXORA — Build Your Brand, Powered by AI**\n\nTransform the way you build brands with NEXORA, your AI-powered brand architect. Our platform adapts to your unique brand voice, breaks down complex strategies into actionable insights, and provides personalized brand plans that maximize impact.\n\n✓ AI-powered brand strategy\n✓ Instant brand concept generation\n✓ Progress tracking & analytics\n✓ 50+ brand formats"},
    {role:"user",text:"Can you make it shorter and punchier?"},
    {role:"ai",text:"**NEXORA**\n*Your AI brand architect.*\n\nBuild brands 3x faster with personalized AI coaching. Break through any concept. Master any brand challenge. All in one platform.\n\n**Start building for free →**"},
  ];
  const models=["gpt-4o","claude-3-5","gemini-1-5","llama3-1"];
  const suggested=["Write a blog post","Analyze market data","Debug my code","Create a presentation","Research a topic"];
  return (
    <motion.div {...fadeUp} className="flex gap-4 h-[calc(100vh-140px)]">
      <Card className="w-44 flex-shrink-0 flex flex-col">
        <div className="p-3 border-b border-white/[0.05]"><Btn variant="primary" size="xs" className="w-full justify-center" icon={Plus}>New Chat</Btn></div>
        <div className="p-3 space-y-0.5">
          {["Recent Conversations","Brand Content Brief","Market Analysis Q4","Website Copy Draft","Code Review","Research Report"].map((c,i)=>(
            <button key={c} className={`w-full text-left px-2 py-1.5 rounded-md text-[10px] transition-all ${i===0?"text-slate-600 font-bold uppercase tracking-wider text-[9px]":"text-slate-500 hover:text-white hover:bg-white/[0.04]"}`}>{c}</button>
          ))}
        </div>
      </Card>
      <div className="flex-1 flex flex-col">
        <Card className="p-2.5 mb-3 flex items-center gap-3">
          <select value={model} onChange={e=>setModel(e.target.value)} className="bg-[#111830] border border-white/[0.07] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none">
            {models.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <span className="text-[10px] text-slate-600">·</span>
          <span className="text-[10px] text-slate-600">2,847 tokens used</span>
          <div className="flex-1"/>
          <Btn variant="ghost" size="xs" icon={RefreshCw}>Clear</Btn>
        </Card>
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conv.map((m,i)=>(
              <div key={i} className={`flex gap-2.5 ${m.role==="user"?"justify-end":""}`}>
                {m.role==="ai"&&<div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center flex-shrink-0"><BrainCircuit size={12} className="text-white"/></div>}
                <div className={`max-w-[78%] p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${m.role==="user"?"bg-violet-600/20 text-violet-100":"bg-[#111830] text-slate-300"}`}>{m.text}</div>
                {m.role==="user"&&<Ava name="Alex" size="sm"/>}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/[0.05]">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {suggested.map(s=><button key={s} onClick={()=>setInput(s)} className="px-2.5 py-1 rounded-full border border-white/[0.07] text-[10px] text-slate-500 hover:text-violet-300 hover:border-violet-500/30 transition-all">{s}</button>)}
            </div>
            <div className="flex gap-2">
              <Inp value={input} onChange={setInput} placeholder="Ask NEXORA anything…" className="flex-1"/>
              <Btn variant="primary" size="sm" icon={Send}>Send</Btn>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORKSPACE SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function Agents({ nav }: { nav:(s:Screen)=>void }) {
  const agents=[
    {name:"Brand Architect",role:"Design & Brand Identity",status:"running",tasks:1248,rate:"99.1%",model:"GPT-4o",color:"violet",uptime:"99.9%"},
    {name:"Content Writer",role:"Blog, Copy & Articles",status:"running",tasks:892,rate:"98.3%",model:"Claude 3.5",color:"teal",uptime:"99.7%"},
    {name:"Data Analyst",role:"Research & Reporting",status:"running",tasks:634,rate:"97.8%",model:"Gemini 1.5",color:"blue",uptime:"98.5%"},
    {name:"Code Assistant",role:"Dev & Automation",status:"running",tasks:421,rate:"99.5%",model:"Claude 3.5",color:"emerald",uptime:"100%"},
    {name:"Image Creator",role:"Visual Content & Design",status:"maintenance",tasks:312,rate:"96.2%",model:"DALL-E 3",color:"pink",uptime:"97.8%"},
    {name:"SEO Optimizer",role:"Search & Traffic",status:"idle",tasks:0,rate:"—",model:"GPT-4o Mini",color:"amber",uptime:"100%"},
    {name:"Social Media Agent",role:"Posts & Engagement",status:"idle",tasks:0,rate:"—",model:"Claude Haiku",color:"orange",uptime:"100%"},
    {name:"Customer Support",role:"Help & Responses",status:"running",tasks:87,rate:"98.9%",model:"GPT-4o Mini",color:"red",uptime:"99.2%"},
  ];
  return (
    <motion.div {...fadeUp}>
      <PH title="AI Agents" subtitle="Deploy, monitor and manage your AI workforce">
        <Btn variant="secondary" size="sm" icon={Filter}>Filter</Btn>
        <Btn variant="primary" size="sm" icon={Plus}>Deploy Agent</Btn>
      </PH>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Total Agents" value="8" icon={Bot} color="violet"/>
        <StatCard label="Running" value="5" icon={Activity} color="green"/>
        <StatCard label="Tasks Today" value="3,594" icon={ListChecks} color="teal"/>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {agents.map(a=>(
          <Card key={a.name} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-${a.color}-500/15 flex items-center justify-center`}><Bot size={18} className={`text-${a.color}-400`}/></div>
              <div className="flex items-center gap-1.5"><Dot color={a.status==="running"?"green":a.status==="maintenance"?"amber":"gray"}/><span className="text-[9px] text-slate-600">{a.status}</span></div>
            </div>
            <p className="font-bold text-white text-xs mb-0.5">{a.name}</p>
            <p className="text-[10px] text-slate-500 mb-3">{a.role}</p>
            <div className="space-y-1.5 mb-3">
              {[{l:"Tasks",v:a.tasks.toLocaleString()},{l:"Success",v:a.rate},{l:"Model",v:a.model},{l:"Uptime",v:a.uptime}].map(r=>(
                <div key={r.l} className="flex justify-between"><span className="text-[9px] text-slate-600">{r.l}</span><span className="text-[9px] font-semibold text-slate-300">{r.v}</span></div>
              ))}
            </div>
            <div className="flex gap-1">
              <Btn variant="ghost" size="xs" icon={Play} className="flex-1 justify-center">Run</Btn>
              <Btn variant="ghost" size="xs" icon={SlidersHorizontal}/>
              <Btn variant="ghost" size="xs" icon={MoreHorizontal}/>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function Tasks() {
  const [view,setView]=useState<"list"|"board">("list");
  const tasks=[
    {title:"Write Q4 Marketing Blog Post",agent:"Content Writer",priority:"High",status:"in-progress",due:"Today",tags:["Marketing","Content"]},
    {title:"Generate Brand Logo Variations",agent:"Brand Architect",priority:"High",status:"in-progress",due:"Today",tags:["Brand","Design"]},
    {title:"Analyze Competitor Market Report",agent:"Data Analyst",priority:"Med",status:"queued",due:"Tomorrow",tags:["Research"]},
    {title:"Build API Integration Script",agent:"Code Assistant",priority:"Med",status:"queued",due:"Nov 15",tags:["Dev"]},
    {title:"Create Social Media Posts (30)",agent:"Content Writer",priority:"Low",status:"queued",due:"Nov 16",tags:["Social"]},
    {title:"SEO Keyword Research Report",agent:"SEO Optimizer",priority:"Med",status:"complete",due:"Nov 10",tags:["SEO"]},
    {title:"Email Campaign Copy",agent:"Content Writer",priority:"High",status:"complete",due:"Nov 10",tags:["Email","Marketing"]},
    {title:"Product Screenshot Visuals",agent:"Image Creator",priority:"Low",status:"blocked",due:"Nov 14",tags:["Design"]},
  ];
  const colors: Record<string,string>={High:"red",Med:"amber",Low:"gray"};
  const statColors: Record<string,string>={"in-progress":"teal",queued:"blue",complete:"green",blocked:"red"};
  return (
    <motion.div {...fadeUp}>
      <PH title="Tasks" subtitle={`${tasks.filter(t=>t.status!=="complete").length} active tasks`}>
        <div className="flex gap-1 bg-[#0c1022] p-1 rounded-lg">
          <button onClick={()=>setView("list")} className={`p-1.5 rounded-md transition-colors ${view==="list"?"bg-violet-600/25 text-violet-300":"text-slate-600"}`}><List size={13}/></button>
          <button onClick={()=>setView("board")} className={`p-1.5 rounded-md transition-colors ${view==="board"?"bg-violet-600/25 text-violet-300":"text-slate-600"}`}><Grid size={13}/></button>
        </div>
        <Btn variant="primary" size="sm" icon={Plus}>New Task</Btn>
      </PH>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[{l:"In Progress",v:tasks.filter(t=>t.status==="in-progress").length,c:"teal"},{l:"Queued",v:tasks.filter(t=>t.status==="queued").length,c:"blue"},{l:"Complete",v:tasks.filter(t=>t.status==="complete").length,c:"green"},{l:"Blocked",v:tasks.filter(t=>t.status==="blocked").length,c:"red"}].map(s=>(
          <Card key={s.l} className={`p-3 text-center bg-gradient-to-br from-${s.c}-600/15 to-${s.c}-600/5 border border-${s.c}-500/20`}><p className={`text-2xl font-black text-${s.c}-400`}>{s.v}</p><p className="text-[10px] text-slate-500 mt-0.5">{s.l}</p></Card>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.05]">{["Task","Agent","Priority","Status","Due Date","Tags"].map(h=><th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {tasks.map((t,i)=>(
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-2.5"><p className="text-xs font-semibold text-white">{t.title}</p></td>
                  <td className="px-4 py-2.5"><div className="flex items-center gap-1.5"><Bot size={10} className="text-violet-400"/><span className="text-[10px] text-slate-400">{t.agent}</span></div></td>
                  <td className="px-4 py-2.5"><Bdg color={colors[t.priority]} size="xs">{t.priority}</Bdg></td>
                  <td className="px-4 py-2.5"><Bdg color={statColors[t.status]} size="xs">{t.status}</Bdg></td>
                  <td className="px-4 py-2.5 text-[10px] text-slate-500">{t.due}</td>
                  <td className="px-4 py-2.5"><div className="flex gap-1">{t.tags.map(tg=><Bdg key={tg} color="gray" size="xs">{tg}</Bdg>)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

function Workflows({ nav }: { nav:(s:Screen)=>void }) {
  const flows=[
    {name:"Brand Content Pipeline",steps:8,runs:1248,success:"98.3%",status:"active",last:"2m ago"},
    {name:"Blog Auto-Publisher",steps:5,runs:892,success:"99.1%",status:"active",last:"1h ago"},
    {name:"Social Media Automation",steps:12,runs:634,success:"97.8%",status:"active",last:"5m ago"},
    {name:"Daily Performance Report",steps:4,runs:421,success:"100%",status:"active",last:"6h ago"},
    {name:"Lead Nurture Sequence",steps:9,runs:312,success:"96.2%",status:"paused",last:"2d ago"},
    {name:"Product Launch Campaign",steps:15,runs:87,success:"98.9%",status:"draft",last:"Never"},
  ];
  return (
    <motion.div {...fadeUp}>
      <PH title="Workflows" subtitle="Automate your AI agent pipelines">
        <Btn variant="secondary" size="sm" icon={Filter}>Filter</Btn>
        <Btn variant="primary" size="sm" icon={Plus}>New Workflow</Btn>
      </PH>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Active Workflows" value="4" icon={Activity} color="violet"/>
        <StatCard label="Total Runs Today" value="3,207" icon={RotateCw} color="teal"/>
        <StatCard label="Avg Success Rate" value="98.3%" icon={CheckCircle} color="green"/>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {flows.map(f=>(
          <Card key={f.name} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center"><GitBranch size={16} className="text-blue-400"/></div>
              <Bdg color={f.status==="active"?"green":f.status==="paused"?"amber":"gray"} size="xs">{f.status}</Bdg>
            </div>
            <h3 className="font-bold text-white text-xs mb-0.5">{f.name}</h3>
            <p className="text-[10px] text-slate-600 mb-3">{f.steps} steps · Last run {f.last}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[{l:"Total Runs",v:f.runs.toLocaleString()},{l:"Success Rate",v:f.success}].map(s=>(
                <div key={s.l} className="bg-[#111830] rounded-lg p-2 text-center"><p className="text-sm font-bold text-white">{s.v}</p><p className="text-[9px] text-slate-600">{s.l}</p></div>
              ))}
            </div>
            <div className="flex gap-1">
              <Btn variant="teal" size="xs" icon={Play} className="flex-1 justify-center">Run</Btn>
              <Btn variant="ghost" size="xs" icon={Edit2}/>
              <Btn variant="ghost" size="xs" icon={MoreHorizontal}/>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function MCPTools() {
  const tools=[
    {name:"Figma",cat:"Design",connected:true,calls:4821,icon:"F",color:"violet"},
    {name:"Typeform",cat:"Forms",connected:true,calls:1234,icon:"T",color:"blue"},
    {name:"Slack",cat:"Communication",connected:true,calls:8912,icon:"S",color:"teal"},
    {name:"GitHub",cat:"Dev",connected:true,calls:2341,icon:"G",color:"gray"},
    {name:"Notion",cat:"Productivity",connected:false,calls:0,icon:"N",color:"amber"},
    {name:"Stripe",cat:"Payments",connected:false,calls:0,icon:"S",color:"green"},
    {name:"HubSpot",cat:"CRM",connected:false,calls:0,icon:"H",color:"orange"},
    {name:"Zapier",cat:"Automation",connected:true,calls:3456,icon:"Z",color:"red"},
    {name:"Cloudinary",cat:"Media",connected:false,calls:0,icon:"C",color:"cyan"},
    {name:"Airtable",cat:"Data",connected:true,calls:987,icon:"A",color:"pink"},
    {name:"OpenAI",cat:"AI",connected:true,calls:12842,icon:"O",color:"violet"},
    {name:"Anthropic",cat:"AI",connected:true,calls:8934,icon:"A",color:"teal"},
  ];
  return (
    <motion.div {...fadeUp}>
      <PH title="MCP Tools" subtitle="Manage connected tools and integrations">
        <Btn variant="primary" size="sm" icon={Plus}>Connect Tool</Btn>
      </PH>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Connected" value={`${tools.filter(t=>t.connected).length}`} icon={Plug} color="green"/>
        <StatCard label="Available" value={`${tools.length}`} icon={Package} color="violet"/>
        <StatCard label="Total API Calls" value="43,527" icon={Activity} color="teal"/>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {tools.map(t=>(
          <Card key={t.name+t.cat} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-${t.color}-500/15 flex items-center justify-center text-sm font-black text-${t.color}-300 flex-shrink-0`}>{t.icon}</div>
              <div className="flex-1 min-w-0"><p className="font-bold text-white text-xs">{t.name}</p><p className="text-[10px] text-slate-600">{t.cat}</p></div>
              <Dot color={t.connected?"green":"gray"}/>
            </div>
            {t.connected&&<p className="text-[10px] text-slate-600 mb-3">{t.calls.toLocaleString()} API calls</p>}
            <Btn variant={t.connected?"danger":"outline"} size="xs" className="w-full justify-center">{t.connected?"Disconnect":"Connect"}</Btn>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function CMS() {
  const contentData=[
    {d:"May 1",entries:24,published:18},{d:"May 5",entries:32,published:25},{d:"May 10",entries:28,published:22},
    {d:"May 15",entries:41,published:35},{d:"May 20",entries:38,published:31},{d:"May 25",entries:45,published:39},
    {d:"May 30",entries:52,published:48},
  ];
  const collections=[
    {name:"Blog Posts",entries:932,color:"violet"},{name:"Landing Pages",entries:245,color:"blue"},
    {name:"Products",entries:118,color:"teal"},{name:"Authors",entries:24,color:"emerald"},
    {name:"Case Studies",entries:67,color:"amber"},
  ];
  const recent=[
    {title:"AI in Education: 2024 Trends",type:"Blog Post",status:"published",date:"May 31"},
    {title:"AI-Powered Learning Platform",type:"Landing Page",status:"draft",date:"May 30"},
    {title:"Project Management with AI",type:"Blog Post",status:"published",date:"May 29"},
    {title:"10 Ways AI Saves Time",type:"Blog Post",status:"review",date:"May 28"},
    {title:"Build Your AI Dream Team",type:"Blog Post",status:"published",date:"May 27"},
  ];
  return (
    <motion.div {...fadeUp}>
      <PH title="CMS Dashboard" subtitle="All your content data in one place">
        <Btn variant="primary" size="sm" icon={Plus}>New Entry</Btn>
      </PH>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {[
          {l:"Total Stories",v:"1,248",i:FileText,c:"violet"},{l:"Published",v:"932",i:CheckCircle,c:"green"},
          {l:"Collections",v:"24",i:Folder,c:"blue"},{l:"Media Files",v:"3,672",i:ImagePlus,c:"teal"},
          {l:"API Requests",v:"24,891",i:Activity,c:"amber"},
        ].map(s=><StatCard key={s.l} label={s.l} value={s.v} icon={s.i} color={s.c}/>)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3"><h3 className="text-xs font-bold text-white">Content Overview</h3><div className="flex gap-2">{[{c:"#7c3aed",l:"Entries"},{c:"#10b981",l:"Published"}].map(l=><div key={l.l} className="flex items-center gap-1"><div className="w-2 h-1 rounded" style={{background:l.c}}/><span className="text-[9px] text-slate-600">{l.l}</span></div>)}</div></div>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={contentData}>
                <defs>
                  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3}/><stop offset="100%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient>
                  <linearGradient id="cp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)"/>
                <XAxis dataKey="d" tick={{fill:"#475569",fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:9}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#111830",border:"1px solid rgba(124,58,237,0.2)",borderRadius:8,fontSize:10}}/>
                <Area type="monotone" dataKey="entries" stroke="#7c3aed" fill="url(#ce)" strokeWidth={1.5}/>
                <Area type="monotone" dataKey="published" stroke="#10b981" fill="url(#cp)" strokeWidth={1.5}/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card className="overflow-hidden">
            <div className="p-3 border-b border-white/[0.05]"><h3 className="text-xs font-bold text-white">Recent Entries</h3></div>
            <div className="divide-y divide-white/[0.04]">
              {recent.map(e=>(
                <div key={e.title} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-6 h-6 rounded-md bg-violet-500/15 flex items-center justify-center flex-shrink-0"><FileText size={11} className="text-violet-400"/></div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">{e.title}</p><p className="text-[10px] text-slate-600">{e.type}</p></div>
                  <Bdg color={e.status==="published"?"green":e.status==="review"?"amber":"gray"} size="xs">{e.status}</Bdg>
                  <span className="text-[10px] text-slate-600">{e.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-3">Top Collections</h3>
            <div className="space-y-2.5">
              {collections.map(c=>{
                const pct=Math.round((c.entries/1248)*100);
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1"><span className="text-xs text-slate-300">{c.name}</span><span className={`text-[10px] font-bold text-${c.color}-400`}>{c.entries}</span></div>
                    <div className="h-1.5 bg-white/10 rounded-full"><div className={`h-1.5 bg-${c.color}-500 rounded-full`} style={{width:`${pct}%`}}/></div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-3">Quick Actions</h3>
            <div className="space-y-1.5">
              {([["New Blog Post",Edit2],["Upload Media",Upload],["Create Collection",Folder],["Import CSV",Download],["API Docs",Code2]] as [string,React.ElementType][]).map(([l,Ic])=>(
                <button key={l} className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-white/[0.05] transition-colors group">
                  <div className="w-5 h-5 rounded-md bg-violet-500/15 flex items-center justify-center"><Ic size={10} className="text-violet-400"/></div>
                  <span className="text-[11px] text-slate-500 group-hover:text-white transition-colors">{l}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function Knowledge() {
  const [tab,setTab]=useState("all");
  const [q,setQ]=useState("");
  const cats=["All","Articles","Guides","Videos","PDFs","Datasets"];
  const items=Array.from({length:12},(_,i)=>({
    title:["Introduction to AI Agents","Building with LLMs","Prompt Engineering Guide","Brand Strategy 101","Data Analysis Methods","Content Marketing Playbook","API Integration Patterns","SEO Fundamentals","UX Design Principles","Machine Learning Basics","Email Marketing Guide","Social Media Strategy"][i],
    type:["Article","Guide","Video","PDF","Dataset","Article","Guide","Video","Article","PDF","Guide","Article"][i],
    date:["Nov 1","Oct 28","Oct 25","Oct 22","Oct 20","Oct 18","Oct 15","Oct 12","Oct 10","Oct 8","Oct 5","Oct 3"][i],
    views:`${(i+1)*234}`,
  }));
  return (
    <motion.div {...fadeUp}>
      <PH title="Knowledge Hub" subtitle="Your AI-powered content library">
        <Btn variant="primary" size="sm" icon={Plus}>Add Content</Btn>
      </PH>
      <Card className="p-3 mb-4"><Inp icon={Search} placeholder="Search knowledge base…" value={q} onChange={setQ}/></Card>
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {cats.map(c=><button key={c} onClick={()=>setTab(c.toLowerCase())} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${tab===c.toLowerCase()?"bg-violet-600/25 text-violet-300 border border-violet-500/30":"bg-[#0c1022] text-slate-600 hover:text-slate-300 border border-white/[0.05]"}`}>{c}</button>)}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {items.map(it=>(
          <Card key={it.title} className="p-4 group cursor-pointer">
            <div className="h-20 rounded-lg bg-gradient-to-br from-violet-600/20 to-blue-600/10 flex items-center justify-center mb-3 group-hover:from-violet-600/30 transition-all"><BookOpen size={20} className="text-violet-400"/></div>
            <Bdg color={it.type==="Video"?"red":it.type==="PDF"?"amber":it.type==="Guide"?"teal":"violet"} size="xs">{it.type}</Bdg>
            <p className="font-semibold text-white text-xs mt-1.5 mb-1 line-clamp-2">{it.title}</p>
            <div className="flex items-center justify-between"><span className="text-[10px] text-slate-600">{it.date}</span><span className="text-[10px] text-slate-600">{it.views} views</span></div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function Templates() {
  const [cat,setCat]=useState("All");
  const cats=["All","AI Agent","Workflow","Blog","Landing Page","Email","Social","Brand","Report"];
  const tmpls=Array.from({length:16},(_,i)=>({
    name:["AI Customer Support Agent","Content Generation Workflow","Tech Blog Post Template","SaaS Landing Page","Email Newsletter","Instagram Story Pack","Brand Identity Kit","Monthly Analytics Report","E-commerce Product Agent","Lead Nurture Workflow","Startup Blog Template","App Launch Page","Cold Email Sequence","LinkedIn Post Pack","Brand Voice Guide","Executive Summary Report"][i],
    cat:cats[1+(i%8)],
    uses:`${(i+2)*187}`,
    grad:["from-violet-600 to-purple-600","from-blue-600 to-cyan-600","from-teal-600 to-emerald-600","from-pink-600 to-violet-600","from-amber-600 to-orange-600","from-blue-600 to-violet-600","from-emerald-600 to-teal-600","from-red-600 to-pink-600"][i%8],
  }));
  return (
    <motion.div {...fadeUp}>
      <PH title="Templates" subtitle="Ready-to-use templates for agents, workflows and content">
        <Inp icon={Search} placeholder="Search templates…" className="w-44"/>
      </PH>
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${cat===c?"bg-violet-600/25 text-violet-300 border border-violet-500/30":"bg-[#0c1022] text-slate-600 hover:text-slate-300 border border-white/[0.05]"}`}>{c}</button>)}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {tmpls.filter(t=>cat==="All"||t.cat===cat).map(t=>(
          <motion.div key={t.name} whileHover={{y:-2}}>
            <Card className="overflow-hidden group cursor-pointer">
              <div className={`h-28 bg-gradient-to-br ${t.grad} flex items-center justify-center relative`}>
                <Wand2 size={22} className="text-white/50"/>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Btn variant="secondary" size="xs">Use Template</Btn>
                </div>
              </div>
              <div className="p-3">
                <Bdg color="violet" size="xs">{t.cat}</Bdg>
                <p className="font-semibold text-white text-[11px] mt-1.5 line-clamp-2">{t.name}</p>
                <p className="text-[9px] text-slate-600 mt-1">{t.uses} uses</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function WebsitePlan() {
  const siteNodes=[
    {id:"home",label:"Home",level:0,x:50,y:10},
    {id:"about",label:"About",level:1,x:10,y:30},{id:"products",label:"Products",level:1,x:30,y:30},
    {id:"blog",label:"Blog",level:1,x:55,y:30},{id:"contact",label:"Contact",level:1,x:75,y:30},
    {id:"team",label:"Team",level:2,x:0,y:55},{id:"story",label:"Story",level:2,x:18,y:55},
    {id:"prod1",label:"Feature A",level:2,x:26,y:55},{id:"prod2",label:"Feature B",level:2,x:38,y:55},
    {id:"post1",label:"Post 1",level:2,x:50,y:55},{id:"post2",label:"Post 2",level:2,x:61,y:55},
    {id:"faq",label:"FAQ",level:2,x:73,y:55},{id:"form",label:"Form",level:2,x:85,y:55},
  ];
  const journeySteps=[
    {step:"Visitor Lands",desc:"Organic or paid traffic",icon:Globe},
    {step:"Explore Value",desc:"Reads hero & features",icon:Eye},
    {step:"Consider Plan",desc:"Views pricing page",icon:DollarSign},
    {step:"Sign Up",desc:"Creates free account",icon:UserPlus},
    {step:"Onboarding",desc:"Completes setup flow",icon:CheckCircle},
    {step:"Active User",desc:"Regular engagement",icon:Rocket},
  ];
  return (
    <motion.div {...fadeUp}>
      <PH title="Website Planning" subtitle="Sitemap, user journey & content structure">
        <Btn variant="secondary" size="sm" icon={Download}>Export</Btn>
        <Btn variant="primary" size="sm" icon={Sparkles}>AI Suggestions</Btn>
      </PH>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Sitemap */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3"><h3 className="text-xs font-bold text-white">Site Structure</h3><Bdg color="violet" size="xs">{siteNodes.length} pages</Bdg></div>
          <div className="relative bg-[#080c14] rounded-xl border border-white/[0.05] h-52 overflow-hidden p-2">
            <svg className="absolute inset-0 w-full h-full" style={{pointerEvents:"none"}}>
              <line x1="50%" y1="16%" x2="10%" y2="35%" stroke="rgba(124,58,237,0.3)" strokeWidth="1"/>
              <line x1="50%" y1="16%" x2="30%" y2="35%" stroke="rgba(124,58,237,0.3)" strokeWidth="1"/>
              <line x1="50%" y1="16%" x2="57%" y2="35%" stroke="rgba(124,58,237,0.3)" strokeWidth="1"/>
              <line x1="50%" y1="16%" x2="75%" y2="35%" stroke="rgba(124,58,237,0.3)" strokeWidth="1"/>
            </svg>
            {siteNodes.slice(0,5).map(n=>(
              <div key={n.id} className="absolute" style={{left:`${n.x}%`,top:`${n.y}%`,transform:"translate(-50%,-50%)"}}>
                <div className={`px-2 py-1 rounded-md text-center ${n.level===0?"bg-violet-600 text-white text-[10px] font-bold":"bg-[#111830] border border-violet-500/25 text-[9px] text-slate-400"}`}>{n.label}</div>
              </div>
            ))}
            {siteNodes.slice(5).map(n=>(
              <div key={n.id} className="absolute" style={{left:`${n.x}%`,top:`${n.y}%`,transform:"translate(-50%,-50%)"}}>
                <div className="px-1.5 py-0.5 rounded text-[8px] text-slate-600 border border-white/[0.06] bg-[#111830]">{n.label}</div>
              </div>
            ))}
          </div>
        </Card>
        {/* User Journey */}
        <Card className="p-4">
          <h3 className="text-xs font-bold text-white mb-3">User Journey Flow</h3>
          <div className="flex items-stretch gap-1 h-40">
            {journeySteps.map((s,i)=>{
              const Ic=s.icon;
              return (
                <div key={s.step} className="flex-1 flex flex-col items-center">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mb-1"><Ic size={13} className="text-violet-400"/></div>
                    <p className="text-[9px] font-bold text-white text-center leading-tight">{s.step}</p>
                    <p className="text-[8px] text-slate-600 text-center mt-0.5 leading-tight">{s.desc}</p>
                  </div>
                  {i<journeySteps.length-1&&<div className="w-full h-px bg-violet-500/20 mt-2 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-500"/></div>}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <Card className="p-4">
        <h3 className="text-xs font-bold text-white mb-3">Content Structure</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.05]">{["Page","Type","Content","Status","Priority"].map(h=><th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {[
                {page:"Home",type:"Marketing",content:"Hero, Features, Testimonials, CTA",status:"published",pri:"High"},
                {page:"About",type:"Brand",content:"Story, Team, Values, Mission",status:"review",pri:"Med"},
                {page:"Products",type:"Sales",content:"Features, Pricing, FAQs, Demo",status:"draft",pri:"High"},
                {page:"Blog",type:"Content",content:"Articles, Categories, Search, Tags",status:"published",pri:"Med"},
                {page:"Contact",type:"Conversion",content:"Form, Map, Social Links, FAQ",status:"published",pri:"Low"},
              ].map((r,i)=>(
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-3 py-2 text-xs font-semibold text-white">{r.page}</td>
                  <td className="px-3 py-2"><Bdg color="violet" size="xs">{r.type}</Bdg></td>
                  <td className="px-3 py-2 text-[10px] text-slate-500">{r.content}</td>
                  <td className="px-3 py-2"><Bdg color={r.status==="published"?"green":r.status==="review"?"amber":"gray"} size="xs">{r.status}</Bdg></td>
                  <td className="px-3 py-2"><Bdg color={r.pri==="High"?"red":r.pri==="Med"?"amber":"gray"} size="xs">{r.pri}</Bdg></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRAND SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function BrandDNA() {
  const [activeSection,setActiveSection]=useState("overview");
  const sections=["overview","colors","typography","voice","audience","competitive"];
  return (
    <motion.div {...fadeUp}>
      <PH title="Brand DNA Studio" subtitle="AI-powered brand identity management">
        <Btn variant="secondary" size="sm" icon={Download}>Export PDF</Btn>
        <Btn variant="primary" size="sm" icon={Sparkles}>Generate</Btn>
      </PH>
      <div className="flex gap-1.5 mb-4">
        {sections.map(s=><button key={s} onClick={()=>setActiveSection(s)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize transition-all ${activeSection===s?"bg-violet-600/25 text-violet-300 border border-violet-500/30":"bg-[#0c1022] text-slate-600 hover:text-slate-300 border border-white/[0.05]"}`}>{s}</button>)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {/* Brand Overview */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-xl shadow-violet-900/50 text-2xl font-black text-white">T</div>
            <div><h3 className="font-black text-white">Travelora</h3><p className="text-xs text-slate-500">Explore More World, Ltd.</p><div className="flex items-center gap-1 mt-1"><div className="w-2 h-2 rounded-full bg-emerald-400"/><span className="text-[10px] text-emerald-400">Brand Score: 92</span></div></div>
          </div>
          <div className="space-y-3">
            <div><p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Brand Mission</p><p className="text-xs text-slate-400">Empowering travelers to explore the world with confidence and curiosity.</p></div>
            <div><p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Core Values</p><div className="flex flex-wrap gap-1">{["Adventure","Trust","Discovery","Community","Sustainability"].map(v=><Bdg key={v} color="violet" size="xs">{v}</Bdg>)}</div></div>
          </div>
        </Card>

        {/* Color Profile */}
        <Card className="p-5">
          <h3 className="text-xs font-bold text-white mb-3">Color Profile</h3>
          <div className="space-y-2.5">
            {[{name:"Primary",hex:"#7c3aed",label:"Brand Purple"},{name:"Secondary",hex:"#0ea5e9",label:"Sky Blue"},{name:"Accent",hex:"#10b981",label:"Emerald"},{name:"Warning",hex:"#f59e0b",label:"Amber"},{name:"Dark",hex:"#07091c",label:"Deep Navy"},{name:"Light",hex:"#e2e8f0",label:"Soft White"}].map(c=>(
              <div key={c.name} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex-shrink-0 border border-white/10 shadow-md" style={{background:c.hex}}/>
                <div className="flex-1"><p className="text-[10px] font-semibold text-white">{c.name}</p><p className="text-[9px] font-mono text-slate-600">{c.hex}</p></div>
                <span className="text-[9px] text-slate-600">{c.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Brand Personality */}
        <Card className="p-5">
          <h3 className="text-xs font-bold text-white mb-3">Brand Personality</h3>
          <div className="space-y-2.5">
            {[{trait:"Adventurous",v:88},{trait:"Trustworthy",v:92},{trait:"Innovative",v:76},{trait:"Friendly",v:85},{trait:"Inspiring",v:90}].map(p=>(
              <div key={p.trait}>
                <div className="flex justify-between mb-0.5"><span className="text-[10px] text-slate-400">{p.trait}</span><span className="text-[10px] font-bold text-violet-400">{p.v}%</span></div>
                <div className="h-1.5 bg-white/10 rounded-full"><motion.div initial={{width:0}} animate={{width:`${p.v}%`}} transition={{duration:0.8,delay:0.2}} className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"/></div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.05]">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Voice & Tone</h4>
            <div className="space-y-1.5">
              {[{label:"Style",v:"Conversational & Expert"},{label:"Tone",v:"Inspiring, Warm, Clear"},{label:"Avoid",v:"Jargon, Formal Language"}].map(v=>(
                <div key={v.label} className="flex gap-2"><span className="text-[10px] text-slate-600 w-12 flex-shrink-0">{v.label}</span><span className="text-[10px] text-slate-300">{v.v}</span></div>
              ))}
            </div>
          </div>
        </Card>

        {/* Typography */}
        <Card className="p-5 col-span-2">
          <h3 className="text-xs font-bold text-white mb-3">Typography System</h3>
          <div className="grid grid-cols-3 gap-4">
            <div><p className="text-3xl font-black text-white mb-1">Aa</p><p className="text-xs font-bold text-white">Plus Jakarta Sans</p><p className="text-[10px] text-slate-500 mt-0.5">Display / Heading</p><div className="flex gap-2 mt-2 flex-wrap">{["Light 300","Regular 400","Medium 500","Bold 700","Black 800"].map(w=><span key={w} className="text-[8px] text-slate-600">{w}</span>)}</div></div>
            <div><p className="text-3xl font-normal text-white mb-1" style={{fontFamily:"serif"}}>Aa</p><p className="text-xs font-bold text-white">Inter</p><p className="text-[10px] text-slate-500 mt-0.5">Body / UI</p></div>
            <div><p className="text-3xl font-mono text-white mb-1">Aa</p><p className="text-xs font-bold text-white">JetBrains Mono</p><p className="text-[10px] text-slate-500 mt-0.5">Code / Labels</p></div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.05] space-y-2">
            {[{label:"H1 Display",size:"48px",w:"Black"},{label:"H2 Title",size:"32px",w:"Bold"},{label:"H3 Subtitle",size:"24px",w:"Semibold"},{label:"Body",size:"16px",w:"Regular"},{label:"Caption",size:"12px",w:"Medium"}].map(t=>(
              <div key={t.label} className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                <span className="text-[10px] text-slate-500 w-24">{t.label}</span>
                <span className="text-[10px] font-mono text-slate-400">{t.size}</span>
                <span className="text-[10px] text-slate-600">{t.w}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Target Audience */}
        <Card className="p-5">
          <h3 className="text-xs font-bold text-white mb-3">Target Audience</h3>
          <div className="space-y-3">
            {[
              {segment:"Adventure Travelers",age:"25-40",pct:42},
              {segment:"Digital Nomads",age:"22-35",pct:28},
              {segment:"Business Travelers",age:"30-50",pct:18},
              {segment:"Family Vacationers",age:"30-45",pct:12},
            ].map(a=>(
              <div key={a.segment}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-slate-300">{a.segment}</span>
                  <div className="flex items-center gap-2"><span className="text-[9px] text-slate-600">{a.age}</span><span className="text-[10px] font-bold text-teal-400">{a.pct}%</span></div>
                </div>
                <div className="h-1 bg-white/10 rounded-full"><div className="h-1 bg-teal-500 rounded-full" style={{width:`${a.pct}%`}}/></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function Creative() {
  const [tool,setTool]=useState("select");
  const tools=[{id:"select",icon:TargetIcon},{id:"pen",icon:Edit2},{id:"paintbrush",icon:Paintbrush},{id:"image",icon:ImagePlus},{id:"text",icon:AlignLeft},{id:"crop",icon:Download},{id:"layers",icon:Layers}];
  const templates=["Logo","Banner","Social Post","Email Header","Presentation","Business Card","Icon Set"];
  return (
    <motion.div {...fadeUp} className="flex gap-3 h-[calc(100vh-140px)]">
      {/* Tools */}
      <Card className="w-12 flex-shrink-0 flex flex-col items-center gap-1.5 p-2 py-3">
        {tools.map(t=>{const Ic=t.icon;return(
          <button key={t.id} onClick={()=>setTool(t.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${tool===t.id?"bg-violet-600/30 text-violet-400":"text-slate-600 hover:bg-white/[0.05] hover:text-slate-300"}`}><Ic size={15}/></button>
        );})}
      </Card>
      {/* Canvas */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Toolbar */}
        <Card className="p-2.5 flex items-center gap-2">
          {[{l:"Zoom",v:"100%"},{l:"Position",v:"0, 0"},{l:"Size",v:"1920×1080"}].map(t=>(
            <div key={t.l} className="flex items-center gap-1.5 px-3 border-r border-white/[0.06]"><span className="text-[9px] text-slate-600">{t.l}:</span><span className="text-[10px] font-mono text-slate-300">{t.v}</span></div>
          ))}
          <div className="flex-1"/>
          <div className="flex gap-1.5">
            {["Undo","Redo"].map(b=><Btn key={b} variant="ghost" size="xs">{b}</Btn>)}
            <Btn variant="secondary" size="xs" icon={Download}>Export</Btn>
            <Btn variant="primary" size="xs" icon={Save}>Save</Btn>
          </div>
        </Card>
        {/* Canvas area */}
        <Card className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#080c14] to-[#0c1022] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:"linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)",backgroundSize:"40px 40px"}}/>
          <div className="text-center z-10">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-3"><Paintbrush size={24} className="text-violet-400"/></div>
            <p className="text-sm text-slate-500">Creative Canvas</p>
            <p className="text-xs text-slate-700 mt-1">Select a template or start from scratch</p>
          </div>
        </Card>
        {/* Templates row */}
        <Card className="p-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {templates.map(t=>(
              <div key={t} className="flex-shrink-0 w-20 h-12 rounded-lg bg-gradient-to-br from-violet-600/20 to-blue-600/10 border border-violet-500/20 flex items-center justify-center cursor-pointer hover:border-violet-500/50 transition-colors">
                <span className="text-[9px] text-violet-300 font-semibold text-center">{t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* Properties */}
      <Card className="w-52 flex-shrink-0 p-3 space-y-4 overflow-y-auto">
        <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Fill</p>
          <div className="flex gap-1.5">{["#7c3aed","#0ea5e9","#10b981","#f59e0b","#ef4444","#ffffff"].map(c=><div key={c} className="w-6 h-6 rounded-md cursor-pointer border border-white/10 hover:ring-1 hover:ring-violet-500 transition-all" style={{background:c}}/>)}</div>
        </div>
        <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Opacity</p><input type="range" className="w-full accent-violet-600 h-1" defaultValue={100}/></div>
        <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Border Radius</p><input type="range" className="w-full accent-violet-600 h-1" defaultValue={8}/></div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Layers</p>
          <div className="space-y-1">
            {["Background","Hero Section","Typography","Buttons","Icons"].map(l=>(
              <div key={l} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-white/[0.04] cursor-pointer">
                <Eye size={10} className="text-slate-600"/><span className="text-[10px] text-slate-400">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS & DEV
// ═══════════════════════════════════════════════════════════════════════════════

function Analytics() {
  const data=[
    {d:"Mon",views:4200,conv:340,rev:1240},{d:"Tue",views:5800,conv:480,rev:1780},
    {d:"Wed",views:7200,conv:620,rev:2340},{d:"Thu",views:6400,conv:560,rev:2100},
    {d:"Fri",views:9100,conv:840,rev:3200},{d:"Sat",views:11400,conv:1120,rev:4100},
    {d:"Sun",views:13800,conv:1380,rev:5200},
  ];
  const pieData=[{name:"Organic",value:42,color:"#7c3aed"},{name:"Paid",value:28,color:"#0ea5e9"},{name:"Social",value:18,color:"#10b981"},{name:"Referral",value:12,color:"#f59e0b"}];
  return (
    <motion.div {...fadeUp}>
      <PH title="Analytics" subtitle="Performance overview · Last 30 days">
        <Btn variant="secondary" size="sm" icon={Calendar}>Date Range</Btn>
        <Btn variant="secondary" size="sm" icon={Download}>Export</Btn>
      </PH>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[{l:"Total Views",v:"138,560",d:"+24.5%",i:TrendingUp,c:"violet"},{l:"Conversions",v:"6,450",d:"+18.2%",i:TargetIcon,c:"teal"},{l:"Revenue",v:"$24,891",d:"+31.6%",i:DollarSign,c:"green"},{l:"Avg. Session",v:"4m 32s",d:"+8.3%",i:Timer,c:"blue"}].map(s=><StatCard key={s.l} label={s.l} value={s.v} delta={s.d} icon={s.i} color={s.c}/>)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-4">
          <h3 className="text-xs font-bold text-white mb-3">Traffic Overview</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="av" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4}/><stop offset="100%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient>
                <linearGradient id="ac" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)"/>
              <XAxis dataKey="d" tick={{fill:"#475569",fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#475569",fontSize:9}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#111830",border:"1px solid rgba(124,58,237,0.2)",borderRadius:8,fontSize:10}}/>
              <Area type="monotone" dataKey="views" stroke="#7c3aed" fill="url(#av)" strokeWidth={1.5}/>
              <Area type="monotone" dataKey="conv" stroke="#10b981" fill="url(#ac)" strokeWidth={1.5}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-bold text-white mb-3">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">{pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie></PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map(d=>(
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{background:d.color}}/><span className="text-[10px] text-slate-400">{d.name}</span></div>
                <span className="text-[10px] font-bold text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function APIKeys() {
  const [showKey,setShowKey]=useState<number|null>(null);
  const keys=[
    {name:"Production API Key",key:"sk-prod-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",created:"Jan 15, 2024",last:"2h ago",usage:128560,limit:200000},
    {name:"Development API Key",key:"sk-dev-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",created:"Feb 3, 2024",last:"1d ago",usage:12340,limit:50000},
    {name:"Staging API Key",key:"sk-stg-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",created:"Mar 20, 2024",last:"Never",usage:0,limit:50000},
  ];
  const mask=(k:string)=>k.slice(0,10)+"•".repeat(20)+k.slice(-4);
  return (
    <motion.div {...fadeUp}>
      <PH title="API Keys" subtitle="Manage your API access credentials">
        <Btn variant="primary" size="sm" icon={Plus}>Generate Key</Btn>
      </PH>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Total Requests" value="128,560" icon={Server} color="violet"/>
        <StatCard label="Active Keys" value="2" icon={Key} color="teal"/>
        <StatCard label="Rate Limit" value="1K req/min" icon={Gauge} color="blue"/>
      </div>
      <div className="space-y-3 mb-4">
        {keys.map((k,i)=>(
          <Card key={k.name} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div><p className="text-xs font-bold text-white">{k.name}</p><p className="text-[10px] text-slate-600">Created {k.created} · Last used {k.last}</p></div>
              <div className="flex gap-1.5"><Btn variant="secondary" size="xs" icon={RotateCw}>Regenerate</Btn><Btn variant="danger" size="xs" icon={Trash2}>Revoke</Btn></div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#080c14] rounded-lg border border-white/[0.05] mb-2">
              <code className="text-[10px] font-mono text-slate-500 flex-1 truncate">{showKey===i?k.key:mask(k.key)}</code>
              <button onClick={()=>setShowKey(showKey===i?null:i)} className="text-slate-600 hover:text-violet-400 transition-colors">{showKey===i?<EyeOff size={11}/>:<Eye size={11}/>}</button>
              <button className="text-slate-600 hover:text-violet-400 transition-colors"><Copy size={11}/></button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full"><div className="h-1.5 bg-violet-500 rounded-full" style={{width:`${(k.usage/k.limit)*100}%`}}/></div>
              <span className="text-[9px] font-mono text-slate-600">{k.usage.toLocaleString()} / {k.limit.toLocaleString()}</span>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-4">
        <h3 className="text-xs font-bold text-white mb-3">Quick Start</h3>
        <div className="bg-[#080c14] rounded-xl p-4 border border-white/[0.05] font-mono text-[11px] space-y-1">
          <p className="text-slate-600"># Install SDK</p>
          <p className="text-emerald-400">npm install @learnify-ai/sdk</p>
          <p className="text-slate-600 mt-2"># Initialize</p>
          <p className="text-slate-300">import LearnifyAI from <span className="text-amber-400">"@learnify-ai/sdk"</span>;</p>
          <p className="text-slate-300">const ai = new LearnifyAI({"{"}apiKey: <span className="text-amber-400">"YOUR_KEY"</span>{"}"});</p>
          <p className="text-slate-600 mt-2"># Run agent</p>
          <p className="text-slate-300">const result = await ai.agents.run({"{"}name: <span className="text-amber-400">"ContentWriter"</span>{"}"});</p>
        </div>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOUNT SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function Team() {
  const members=[
    {name:"Alex Johnson",role:"Owner",email:"alex@learnify.ai",status:"active",agents:8,tasks:1248},
    {name:"Sarah Williams",role:"Admin",email:"sarah@learnify.ai",status:"active",agents:4,tasks:892},
    {name:"Michael Brown",role:"Editor",email:"michael@learnify.ai",status:"active",agents:2,tasks:634},
    {name:"Emily Davis",role:"Viewer",email:"emily@learnify.ai",status:"inactive",agents:0,tasks:0},
    {name:"James Wilson",role:"Editor",email:"james@learnify.ai",status:"active",agents:3,tasks:421},
  ];
  return (
    <motion.div {...fadeUp}>
      <PH title="Team & Collaboration" subtitle={`${members.length} members`}>
        <Btn variant="primary" size="sm" icon={UserPlus}>Invite Member</Btn>
      </PH>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Total Members" value={`${members.length}`} icon={Users} color="violet"/>
        <StatCard label="Active Now" value={`${members.filter(m=>m.status==="active").length}`} icon={Activity} color="green"/>
        <StatCard label="AI Tasks Today" value="3,195" icon={ListChecks} color="teal"/>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.05]">{["Member","Role","AI Agents","Tasks","Status","Actions"].map(h=><th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {members.map(m=>(
                <tr key={m.name} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Ava name={m.name}/><div><p className="text-xs font-semibold text-white">{m.name}</p><p className="text-[10px] text-slate-600">{m.email}</p></div></div></td>
                  <td className="px-4 py-3"><Bdg color={m.role==="Owner"?"violet":m.role==="Admin"?"blue":"gray"}>{m.role}</Bdg></td>
                  <td className="px-4 py-3 text-xs text-slate-400">{m.agents}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{m.tasks.toLocaleString()}</td>
                  <td className="px-4 py-3"><Bdg color={m.status==="active"?"green":"gray"}>{m.status}</Bdg></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><button className="p-1.5 rounded-md hover:bg-white/[0.05] text-slate-600 hover:text-white transition-colors"><Edit2 size={12}/></button><button className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={12}/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

function SettingsScreen() {
  const [tab,setTab]=useState("profile");
  const tabs=["profile","workspace","notifications","security","billing","integrations"];
  const [notifs,setNotifs]=useState({email:true,push:true,weekly:false,marketing:false});
  return (
    <motion.div {...fadeUp} className="flex gap-4">
      <div className="w-40 flex-shrink-0">
        <Card className="p-3 sticky top-0">
          <p className="text-[9px] font-black text-slate-700 uppercase tracking-wider mb-2 px-2">Settings</p>
          {tabs.map(t=><button key={t} onClick={()=>setTab(t)} className={`w-full text-left px-2.5 py-2 rounded-lg text-[11px] font-medium capitalize transition-all mb-0.5 ${tab===t?"bg-violet-600/20 text-violet-300":"text-slate-500 hover:text-white hover:bg-white/[0.04]"}`}>{t}</button>)}
        </Card>
      </div>
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {tab==="profile"&&<motion.div key="pf" {...fadeUp}>
            <Card className="p-5">
              <h3 className="font-bold text-white mb-4">Profile Settings</h3>
              <div className="flex items-center gap-4 mb-5">
                <Ava name="Alex Johnson" size="lg"/>
                <div><p className="font-bold text-white text-sm">Alex Johnson</p><p className="text-xs text-slate-500 mb-2">alex@learnify.ai</p><Btn variant="outline" size="xs">Change Photo</Btn></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{l:"Full Name",v:"Alex Johnson"},{l:"Email",v:"alex@learnify.ai"},{l:"Company",v:"Learnify Inc."},{l:"Role",v:"AI Platform Engineer"},{l:"Location",v:"San Francisco, CA"},{l:"Timezone",v:"Pacific Time (PT)"}].map(f=>(
                  <div key={f.l}><label className="text-[10px] text-slate-500 block mb-1">{f.l}</label><Inp value={f.v}/></div>
                ))}
              </div>
              <Btn variant="primary" size="sm" icon={Save} className="mt-4">Save Changes</Btn>
            </Card>
          </motion.div>}
          {tab==="notifications"&&<motion.div key="nt" {...fadeUp}>
            <Card className="p-5">
              <h3 className="font-bold text-white mb-4">Notification Preferences</h3>
              <div className="space-y-3">
                {Object.entries(notifs).map(([k,v])=>(
                  <div key={k} className="flex items-center justify-between py-3 border-b border-white/[0.05]">
                    <div><p className="text-sm font-medium text-white capitalize">{k.replace(/([A-Z])/g," $1")} notifications</p><p className="text-[11px] text-slate-500">Manage {k} notification settings</p></div>
                    <Tog checked={v} onChange={()=>setNotifs(p=>({...p,[k]:!v}))}/>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>}
          {tab==="security"&&<motion.div key="sc" {...fadeUp}>
            <Card className="p-5">
              <h3 className="font-bold text-white mb-4">Security Settings</h3>
              <div className="space-y-3">
                {[{t:"Two-Factor Authentication",d:"Add an extra security layer",i:Shield,on:true},{t:"Login Alerts",d:"Notify on new sign-ins",i:Bell,on:true},{t:"Session Timeout",d:"Auto logout after 30 mins",i:Timer,on:false}].map(s=>{const Ic=s.i;return(
                  <div key={s.t} className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.05] hover:border-violet-500/20 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center"><Ic size={15} className="text-violet-400"/></div>
                    <div className="flex-1"><p className="text-sm font-semibold text-white">{s.t}</p><p className="text-[11px] text-slate-500">{s.d}</p></div>
                    <Tog checked={s.on} onChange={()=>{}}/>
                  </div>
                );})}
              </div>
            </Card>
          </motion.div>}
          {(tab==="workspace"||tab==="billing"||tab==="integrations")&&<motion.div key={tab} {...fadeUp}>
            <Card className="p-5">
              <h3 className="font-bold text-white mb-4">{tab.charAt(0).toUpperCase()+tab.slice(1)} Settings</h3>
              <p className="text-sm text-slate-500">Configure your {tab} preferences and options.</p>
            </Card>
          </motion.div>}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Project({ nav }: { nav:(s:Screen)=>void }) {
  const barData=[{d:"Week 1",tasks:24,done:18},{d:"Week 2",tasks:32,done:28},{d:"Week 3",tasks:41,done:35},{d:"Week 4",tasks:27,done:25}];
  return (
    <motion.div {...fadeUp}>
      <PH title="Project Dashboard" subtitle="Acme Education Platform">
        <Btn variant="secondary" size="sm" icon={Share2}>Share</Btn>
        <Btn variant="primary" size="sm" icon={Plus}>Add Task</Btn>
      </PH>
      {/* Project header */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-violet-900/40">A</div>
          <div className="flex-1">
            <div className="flex items-center gap-2"><h2 className="text-base font-bold text-white">Acme Education Platform</h2><Bdg color="green" size="xs">Active</Bdg></div>
            <p className="text-xs text-slate-500">AI-powered learning platform for students and teachers</p>
            <div className="flex items-center gap-4 mt-2">
              {[{l:"Created",v:"May 12, 2024"},{l:"Updated",v:"1h ago"},{l:"Stage",v:"Development"}].map(f=>(
                <span key={f.l} className="text-[10px] text-slate-600"><span className="text-slate-500 font-medium">{f.l}:</span> {f.v}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {["AJ","SW","MB"].map(i=><Ava key={i} name={i} size="sm"/>)}
            <Btn variant="secondary" size="xs" icon={UserPlus}>Invite</Btn>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {[{l:"Tasks",v:"124",i:ListChecks,c:"violet"},{l:"AI Generations",v:"1,248",i:Sparkles,c:"teal"},{l:"Assets",v:"532",i:ImagePlus,c:"blue"},{l:"Status",v:"72%",i:CheckCircle,c:"green"},{l:"Visits",v:"12,842",i:TrendingUp,c:"amber"}].map(s=><StatCard key={s.l} label={s.l} value={s.v} icon={s.i} color={s.c}/>)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-3">Project Timeline</h3>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)"/>
                <XAxis dataKey="d" tick={{fill:"#475569",fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:9}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#111830",border:"1px solid rgba(124,58,237,0.2)",borderRadius:8,fontSize:10}}/>
                <Bar dataKey="tasks" fill="rgba(124,58,237,0.3)" radius={[3,3,0,0]}/>
                <Bar dataKey="done" fill="#7c3aed" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-3">Design in Progress</h3>
            <div className="space-y-2.5">
              {[{task:"Homepage Hero Design",pct:85,agent:"Brand Architect"},{task:"Dashboard UI Components",pct:62,agent:"Creative Studio"},{task:"Mobile App Wireframes",pct:40,agent:"UI/UX Agent"},{task:"Brand Style Guide",pct:95,agent:"Brand Architect"},{task:"Email Templates",pct:28,agent:"Content Writer"}].map(t=>(
                <div key={t.task}>
                  <div className="flex items-center justify-between mb-1"><span className="text-xs text-slate-300">{t.task}</span><div className="flex items-center gap-2"><span className="text-[10px] text-slate-600">{t.agent}</span><span className="text-[10px] font-bold text-violet-400">{t.pct}%</span></div></div>
                  <div className="h-1.5 bg-white/10 rounded-full"><motion.div initial={{width:0}} animate={{width:`${t.pct}%`}} transition={{duration:0.8}} className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"/></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-3">Recent Activity</h3>
            <div className="space-y-2.5">
              {[{a:"Brand Architect published v1.2",t:"2m ago",c:"violet"},{a:"New team member added",t:"1h ago",c:"blue"},{a:"Assets library updated (24 files)",t:"3h ago",c:"teal"},{a:"Project dashboard launched",t:"1d ago",c:"green"}].map((ev,i)=>(
                <div key={i} className="flex items-start gap-2"><Dot color={ev.c as any}/><div className="flex-1 min-w-0"><p className="text-[10px] text-slate-400">{ev.a}</p><p className="text-[9px] text-slate-700">{ev.t}</p></div></div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-3">AI Agents</h3>
            <div className="space-y-2">
              {[{name:"Brand Architect",status:"running"},{name:"Content Writer",status:"running"},{name:"UI/UX Agent",status:"idle"}].map(a=>(
                <div key={a.name} className="flex items-center gap-2 p-2 rounded-lg bg-[#111830]"><Dot color={a.status==="running"?"green":"gray"}/><span className="text-xs text-slate-300 flex-1">{a.name}</span><Bdg color={a.status==="running"?"teal":"gray"} size="xs">{a.status}</Bdg></div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-xs font-bold text-white mb-2">Integrations</h3>
            <div className="flex flex-wrap gap-2">
              {["Figma","GitHub","Slack","Notion","Stripe"].map(i=><div key={i} className="w-7 h-7 rounded-lg bg-[#111830] border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-slate-400">{i[0]}</div>)}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALL APP SCREENS — mapping
// ═══════════════════════════════════════════════════════════════════════════════
const APP_SCREENS: Screen[] = [
  "dashboard","command","mission","project","playground","image-gen","voice","chat",
  "agents","tasks","workflows","mcp","cms","knowledge","templates","website-plan",
  "brand-dna","creative","analytics","api-keys","team","settings",
];

const LABEL_MAP: Partial<Record<Screen,string>> = {
  dashboard:"Dashboard",command:"AI Command Center",mission:"AI Mission Control",project:"Project Dashboard",
  playground:"Model Playground","image-gen":"Image Generator",voice:"Voice Studio",chat:"AI Chat",
  agents:"Agents",tasks:"Tasks",workflows:"Workflows",mcp:"MCP Tools",cms:"CMS Dashboard",
  knowledge:"Knowledge Hub",templates:"Templates","website-plan":"Website Planning",
  "brand-dna":"Brand DNA Studio",creative:"Creative Studio",analytics:"Analytics",
  "api-keys":"API Keys",team:"Team",settings:"Settings",
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState<Screen>("landing");
  const nav=(s:Screen)=>setScreen(s);

  const isPublic=["landing","signin","signup","forgot","verify"].includes(screen);
  const isOnboard=screen==="onboard";
  const isApp=APP_SCREENS.includes(screen);

  const renderScreen=()=>{
    switch(screen){
      case "landing": return <Landing nav={nav}/>;
      case "signin": return <SignIn nav={nav}/>;
      case "signup": return <SignUp nav={nav}/>;
      case "forgot": return <Forgot nav={nav}/>;
      case "verify": return <Verify nav={nav}/>;
      case "onboard": return <Onboard nav={nav}/>;
      case "dashboard": return <Dashboard nav={nav}/>;
      case "command": return <CommandCenter nav={nav}/>;
      case "mission": return <MissionControl nav={nav}/>;
      case "playground": return <ModelPlayground/>;
      case "image-gen": return <ImageGen/>;
      case "voice": return <VoiceStudio/>;
      case "chat": return <ChatScreen/>;
      case "agents": return <Agents nav={nav}/>;
      case "tasks": return <Tasks/>;
      case "workflows": return <Workflows nav={nav}/>;
      case "mcp": return <MCPTools/>;
      case "cms": return <CMS/>;
      case "knowledge": return <Knowledge/>;
      case "templates": return <Templates/>;
      case "website-plan": return <WebsitePlan/>;
      case "brand-dna": return <BrandDNA/>;
      case "creative": return <Creative/>;
      case "analytics": return <Analytics/>;
      case "api-keys": return <APIKeys/>;
      case "team": return <Team/>;
      case "settings": return <SettingsScreen/>;
      case "project": return <Project nav={nav}/>;
      default: return <Dashboard nav={nav}/>;
    }
  };

  if(isPublic||isOnboard){
    return (
      <div className="min-h-screen bg-[#07091c]">
        <AnimatePresence mode="wait"><div key={screen}>{renderScreen()}</div></AnimatePresence>
        {/* Demo nav pill */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex items-center gap-1.5 p-1.5 bg-[#0c1022]/95 backdrop-blur border border-white/[0.07] rounded-xl shadow-xl">
            <span className="text-[9px] text-slate-700 px-1.5">Demo:</span>
            {([["signin","Sign In"],["signup","Sign Up"],["onboard","Onboard"],["dashboard","Dashboard"]] as [Screen,string][]).map(([s,l])=>(
              <button key={s} onClick={()=>nav(s)} className="px-2 py-1 rounded-md text-[10px] text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">{l}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout cur={screen} nav={nav}>
      <AnimatePresence mode="wait"><div key={screen}>{renderScreen()}</div></AnimatePresence>
      {/* Screen navigator */}
      <div className="fixed bottom-4 right-4 z-50">
        <details className="group">
          <summary className="list-none cursor-pointer">
            <div className="p-2 bg-[#0c1022]/95 backdrop-blur border border-violet-500/20 rounded-xl shadow-xl text-[10px] text-violet-400 font-bold hover:border-violet-500/40 transition-colors flex items-center gap-1.5">
              <Grid size={11}/>All Screens ({APP_SCREENS.length+6})
            </div>
          </summary>
          <div className="absolute bottom-full right-0 mb-2 w-72 p-3 bg-[#0c1022]/98 backdrop-blur border border-white/[0.07] rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 px-1">Public</p>
            <div className="grid grid-cols-3 gap-1 mb-2">
              {(["landing","signin","signup","forgot","verify","onboard"] as Screen[]).map(s=>(
                <button key={s} onClick={()=>nav(s)} className="text-left px-2 py-1 rounded-md text-[10px] text-slate-600 hover:text-white hover:bg-white/[0.05] transition-all capitalize">{s}</button>
              ))}
            </div>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 px-1 pt-1 border-t border-white/[0.05]">App Screens</p>
            <div className="grid grid-cols-2 gap-1">
              {APP_SCREENS.map(s=>(
                <button key={s} onClick={()=>nav(s)} className={`text-left px-2 py-1.5 rounded-md text-[10px] transition-all ${screen===s?"bg-violet-600/25 text-violet-300":"text-slate-500 hover:text-white hover:bg-white/[0.05]"}`}>{LABEL_MAP[s]??s}</button>
              ))}
            </div>
          </div>
        </details>
      </div>
    </AppLayout>
  );
}
