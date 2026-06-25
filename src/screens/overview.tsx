import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot, ListChecks, CheckCircle, DollarSign, Wand2, Command, Target as TargetIcon,
  BrainCircuit, RefreshCw, Plus, Search, ArrowRight, Filter, GitBranch, Upload,
  Server, MessageSquare, Lightbulb, ChevronRight, TrendingUp, Dot as DotIcon,
  FolderOpen, Sparkles, Share2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar,
} from "recharts";
import { Screen, Btn, Card, Bdg, StatCard, PH, Dot, fadeUp } from "../components/shared";

export function Dashboard({ nav }: { nav:(s:Screen)=>void }) {
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

export function CommandCenter({ nav }: { nav:(s:Screen)=>void }) {
  const [tab,setTab]=useState("agents");
  const [query,setQuery]=useState("");
  const tabs=["AI Chat","MCP Servers","Agents","Create Board","Add Content","Build Workflow","Set Agent"];
  const stats=[
    {label:"Token Usage",value:"12,842",icon:Bot,color:"violet"},
    {label:"AI Calls",value:"4.2M",icon:Bot,color:"blue"},
    {label:"Cost",value:"$68.42",icon:DollarSign,color:"amber"},
    {label:"Active Models",value:"24",icon:BrainCircuit,color:"teal"},
    {label:"Success Rate",value:"98.75%",icon:CheckCircle,color:"green"},
    {label:"Avg Latency",value:"1.42s",icon:Bot,color:"gray" as any},
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
      <Card className="p-3 mb-4 flex items-center gap-3">
        <Search size={14} className="text-slate-600 flex-shrink-0"/>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="What would you like AI to do today? e.g. 'Write a landing page for my product'" className="flex-1 bg-transparent text-sm text-slate-300 placeholder:text-slate-700 outline-none"/>
        <Btn variant="primary" size="sm" icon={ArrowRight}>Ask AI</Btn>
      </Card>
      <div className="flex gap-1 bg-[#0c1022] p-1 rounded-xl mb-4 overflow-x-auto">
        {tabs.map(t=><button key={t} onClick={()=>setTab(t.toLowerCase().replace(" ","_"))} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${tab===t.toLowerCase().replace(" ","_")?"bg-violet-600/30 text-violet-300":"text-slate-600 hover:text-slate-300"}`}>{t}</button>)}
      </div>
      <div className="grid grid-cols-6 gap-3 mb-4">
        {stats.map(s=><StatCard key={s.label} {...s}/>)}
      </div>
      <div className="grid grid-cols-3 gap-4">
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

export function MissionControl({ nav }: { nav:(s:Screen)=>void }) {
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
  let tick2 = 0;
  useEffect(()=>{ const t=setInterval(()=>tick2++,50); return()=>clearInterval(t); },[]);
  return (
    <motion.div {...fadeUp}>
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
        <Card className="col-span-4 p-4">
          <div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-white">Mission Overview</h3><Bdg color="green" size="xs">● All Systems Go</Bdg></div>
          <div className="relative h-48 flex items-center justify-center">
            {[80,56,32].map((r,i)=>(
              <div key={r} className="absolute rounded-full border border-violet-500/20" style={{width:r*2,height:r*2,left:`calc(50% - ${r}px)`,top:`calc(50% - ${r}px)`}}>
                {[0,1,2].map(j=>{
                  const angle=(j*(360/3)+i*30+tick2)*(Math.PI/180);
                  const x=r*Math.cos(angle); const y=r*Math.sin(angle);
                  return <div key={j} className={`absolute w-2.5 h-2.5 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50`} style={{left:`calc(50% + ${x}px - 5px)`,top:`calc(50% + ${y}px - 5px)`}}/>;
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
        <Card className="col-span-3 p-4">
          <div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-white">Live Feed</h3><div className="flex items-center gap-1"><Dot color="green"/><span className="text-[9px] text-slate-600">Live</span></div></div>
          <div className="space-y-2 overflow-y-auto max-h-48">
            {liveFeed.map((f,i)=>{
              const col: Record<string,string> = {success:"emerald",info:"blue",warning:"amber",error:"red"};
              const c = col[f.type]??"gray";
              return (
                <div key={i} className="flex items-start gap-2">
                  <Dot color={c}/><div className="flex-1 min-w-0"><p className="text-[10px] text-slate-400 leading-relaxed">{f.msg}</p></div><span className="text-[9px] text-slate-700 flex-shrink-0">{f.t}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-12 gap-3">
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
                <button key={l} onClick={()=>(fn as Function)(sc)} className="flex items-center gap-1.5 w-full p-1.5 rounded-md hover:bg-white/[0.04] transition-colors">
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

export function Project({ nav }: { nav:(s:Screen)=>void }) {
  const barData=[{d:"Week 1",tasks:24,done:18},{d:"Week 2",tasks:32,done:28},{d:"Week 3",tasks:41,done:35},{d:"Week 4",tasks:27,done:25}];
  return (
    <motion.div {...fadeUp}>
      <PH title="Project Dashboard" subtitle="Acme Education Platform">
        <Btn variant="secondary" size="sm" icon={Share2}>Share</Btn>
        <Btn variant="primary" size="sm" icon={Plus}>Add Task</Btn>
      </PH>
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
            {["AJ","SW","MB"].map(i=><div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white">{i}</div>)}
            <Btn variant="secondary" size="xs" icon={Plus}>Invite</Btn>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {[{l:"Tasks",v:"124",i:ListChecks,c:"violet"},{l:"AI Generations",v:"1,248",i:Sparkles,c:"teal"},{l:"Assets",v:"532",i:FolderOpen,c:"blue"},{l:"Status",v:"72%",i:CheckCircle,c:"green"},{l:"Visits",v:"12,842",i:TrendingUp,c:"amber"}].map(s=><StatCard key={s.l} label={s.l} value={s.v} icon={s.i} color={s.c}/>)}
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
