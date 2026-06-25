import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target as TargetIcon, Edit2, Paintbrush, ImagePlus, AlignLeft, Download,
  Layers, Save, Eye, Sparkles, Bot, TrendingUp, DollarSign, Timer,
  Calendar, Server, Key, Gauge, Trash2, RotateCw, ListChecks, CheckCircle,
  Copy, EyeOff, Activity, Users, UserPlus, Shield, Bell, Globe,
  User, Plus, BookOpen, Wand2, ArrowUpRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { Screen, Btn, Card, Bdg, StatCard, PH, Dot, Inp, Ava, Tog, fadeUp } from "../components/shared";

export function BrandDNA() {
  const [activeSection]=useState("overview");
  const sections=["overview","colors","typography","voice","audience","competitive"];
  return (
    <motion.div {...fadeUp}>
      <PH title="Brand DNA Studio" subtitle="AI-powered brand identity management">
        <Btn variant="secondary" size="sm" icon={Download}>Export PDF</Btn>
        <Btn variant="primary" size="sm" icon={Sparkles}>Generate</Btn>
      </PH>
      <div className="flex gap-1.5 mb-4">
        {sections.map(s=><button key={s} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize transition-all ${activeSection===s?"bg-violet-600/25 text-violet-300 border border-violet-500/30":"bg-[#0c1022] text-slate-600 hover:text-slate-300 border border-white/[0.05]"}`}>{s}</button>)}
      </div>
      <div className="grid grid-cols-3 gap-4">
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

export function Creative() {
  const [tool,setTool]=useState("select");
  const tools=[{id:"select",icon:TargetIcon},{id:"pen",icon:Edit2},{id:"paintbrush",icon:Paintbrush},{id:"image",icon:ImagePlus},{id:"text",icon:AlignLeft},{id:"crop",icon:Download},{id:"layers",icon:Layers}];
  const templates=["Logo","Banner","Social Post","Email Header","Presentation","Business Card","Icon Set"];
  return (
    <motion.div {...fadeUp} className="flex gap-3 h-[calc(100vh-140px)]">
      <Card className="w-12 flex-shrink-0 flex flex-col items-center gap-1.5 p-2 py-3">
        {tools.map(t=>{const Ic=t.icon;return(
          <button key={t.id} onClick={()=>setTool(t.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${tool===t.id?"bg-violet-600/30 text-violet-400":"text-slate-600 hover:bg-white/[0.05] hover:text-slate-300"}`}><Ic size={15}/></button>
        );})}
      </Card>
      <div className="flex-1 flex flex-col gap-3">
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
        <Card className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#080c14] to-[#0c1022] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:"linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)",backgroundSize:"40px 40px"}}/>
          <div className="text-center z-10">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-3"><Paintbrush size={24} className="text-violet-400"/></div>
            <p className="text-sm text-slate-500">Creative Canvas</p>
            <p className="text-xs text-slate-700 mt-1">Select a template or start from scratch</p>
          </div>
        </Card>
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

export function Analytics() {
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

export function APIKeys() {
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
    </motion.div>
  );
}

export function Team() {
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

export function SettingsScreen() {
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
