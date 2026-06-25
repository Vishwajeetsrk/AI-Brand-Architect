import { useState } from "react";
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
  MonitorPlay, Megaphone, Lightbulb, Construction, Sparkle,
} from "lucide-react";

export type Screen =
  | "landing" | "signin" | "signup" | "forgot" | "verify" | "onboard"
  | "dashboard" | "command" | "mission" | "playground" | "image-gen"
  | "voice" | "chat" | "agents" | "tasks" | "workflows" | "mcp"
  | "cms" | "knowledge" | "templates" | "website-plan" | "brand-dna"
  | "creative" | "analytics" | "api-keys" | "team" | "settings" | "project";

export const NAV: { label: string; items: { id: Screen; label: string; icon: React.ElementType; badge?: string }[] }[] = [
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

export const BOTTOM_NAV = [
  { id: "team" as Screen, label: "Team", icon: Users },
  { id: "settings" as Screen, label: "Settings", icon: Settings },
];

export const APP_SCREENS: Screen[] = [
  "dashboard","command","mission","project","playground","image-gen","voice","chat",
  "agents","tasks","workflows","mcp","cms","knowledge","templates","website-plan",
  "brand-dna","creative","analytics","api-keys","team","settings",
];

export const LABEL_MAP: Partial<Record<Screen,string>> = {
  dashboard:"Dashboard",command:"AI Command Center",mission:"AI Mission Control",project:"Project Dashboard",
  playground:"Model Playground","image-gen":"Image Generator",voice:"Voice Studio",chat:"AI Chat",
  agents:"Agents",tasks:"Tasks",workflows:"Workflows",mcp:"MCP Tools",cms:"CMS Dashboard",
  knowledge:"Knowledge Hub",templates:"Templates","website-plan":"Website Planning",
  "brand-dna":"Brand DNA Studio",creative:"Creative Studio",analytics:"Analytics",
  "api-keys":"API Keys",team:"Team",settings:"Settings",
};

export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.14 } },
};

export function Btn({ children, variant = "primary", size = "md", onClick, className = "", icon: Icon, disabled }: {
  children?: React.ReactNode; variant?: "primary"|"secondary"|"ghost"|"danger"|"outline"|"teal"|"green";
  size?: "xs"|"sm"|"md"|"lg"; onClick?: () => void; className?: string;
  icon?: React.ElementType; disabled?: boolean;
}) {
  const sz = { xs: "px-2 py-1 text-[11px]", sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-2.5 text-sm" };
  const va: Record<string,string> = {
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

export function Card({ children, className="", onClick, glow }: { children: React.ReactNode; className?: string; onClick?: () => void; glow?: boolean }) {
  return (
    <div onClick={onClick} className={`bg-card border border-white/[0.055] rounded-xl ${glow?"shadow-lg shadow-violet-900/20":""} ${onClick?"cursor-pointer hover:border-violet-500/25 transition-colors":""} ${className}`}>
      {children}
    </div>
  );
}

export function Bdg({ children, color="violet", size="sm" }: { children: React.ReactNode; color?: string; size?: "xs"|"sm" }) {
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

export function Inp({ placeholder, type="text", value, onChange, icon: Icon, className="", rows }: {
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

export function Ava({ name, size="md" }: { name: string; size?: "xs"|"sm"|"md"|"lg" }) {
  const ini = name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const grads = ["from-violet-500 to-purple-600","from-blue-500 to-cyan-500","from-teal-500 to-emerald-500","from-orange-500 to-pink-500"];
  const g = grads[name.charCodeAt(0)%grads.length];
  const sz = { xs:"w-5 h-5 text-[8px]", sm:"w-6 h-6 text-[9px]", md:"w-8 h-8 text-xs", lg:"w-10 h-10 text-sm" };
  return <div className={`${sz[size]} rounded-full bg-gradient-to-br ${g} flex items-center justify-center font-bold text-white flex-shrink-0`}>{ini}</div>;
}

export function Tog({ checked, onChange }: { checked: boolean; onChange: ()=>void }) {
  return (
    <button onClick={onChange} className={`w-9 h-5 rounded-full transition-all duration-200 relative flex-shrink-0 ${checked?"bg-violet-600":"bg-white/10"}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked?"translate-x-4":"translate-x-0"}`} />
    </button>
  );
}

export function StatCard({ label, value, delta, icon: Icon, color="violet", sub }: {
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

export function PH({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div><h1 className="text-lg font-bold text-white">{title}</h1>{subtitle&&<p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}</div>
      {children&&<div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function Dot({ color="green" }: { color?: string }) {
  const c: Record<string,string> = { green:"bg-emerald-400 shadow-emerald-400/50", amber:"bg-amber-400 shadow-amber-400/50", red:"bg-red-400 shadow-red-400/50", blue:"bg-blue-400 shadow-blue-400/50", gray:"bg-slate-500" };
  return <span className={`inline-block w-2 h-2 rounded-full shadow-md flex-shrink-0 ${c[color]??c.gray}`}/>;
}

export function Sidebar({ cur, nav, collapsed, setCollapsed }: {
  cur: Screen; nav: (s: Screen)=>void; collapsed: boolean; setCollapsed: (v:boolean)=>void;
}) {
  const [open, setOpen] = useState<Record<string,boolean>>({
    OVERVIEW:true,"AI TOOLS":true,WORKSPACE:true,CONTENT:false,BRAND:false,"INSIGHTS & DEV":false,
  });
  return (
    <aside className={`flex flex-col h-full bg-sidebar border-r border-white/[0.05] transition-all duration-300 flex-shrink-0 ${collapsed?"w-14":"w-52"}`}>
      <div className={`flex items-center gap-2 border-b border-white/[0.05] py-4 ${collapsed?"justify-center px-0":"px-4"}`}>
        <img src="/logo.svg" alt="NEXORA" className="w-7 h-7 flex-shrink-0" />
        {!collapsed&&(
          <div><p className="text-sm font-black text-white leading-none">NEXORA</p><p className="text-[9px] text-violet-400 font-bold tracking-widest">AI BRAND ARCHITECT</p></div>
        )}
      </div>
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
        {!collapsed&&(
          <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/10 border border-violet-500/20">
            <p className="text-xs font-bold text-white">Upgrade to Pro</p>
            <p className="text-[10px] text-slate-500 mt-0.5 mb-2">Unlock unlimited AI agents & workflows</p>
            <Btn variant="primary" size="xs" className="w-full justify-center">Upgrade Plan</Btn>
          </div>
        )}
        <div className={`pt-2 border-t border-white/[0.05] flex ${collapsed?"justify-center":"items-center gap-2 px-1"}`}>
          {!collapsed&&<><Ava name="Alex Johnson"/><div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">Alex Johnson</p><p className="text-[10px] text-slate-600">Pro Plan</p></div><button onClick={()=>nav("settings")} className="text-slate-700 hover:text-slate-400"><Settings size={12}/></button></>}
          {collapsed&&<Ava name="Alex Johnson" size="sm"/>}
        </div>
      </div>
    </aside>
  );
}

export function TopBar({ nav, collapsed, setCollapsed, label }: { nav:(s:Screen)=>void; collapsed:boolean; setCollapsed:(v:boolean)=>void; label:string }) {
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

export function AppLayout({ children, cur, nav }: { children: React.ReactNode; cur: Screen; nav:(s:Screen)=>void }) {
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

export function AuthWrap({ children, title, subtitle, nav }: { children: React.ReactNode; title: string; subtitle?: string; nav:(s:Screen)=>void }) {
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
