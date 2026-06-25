import { useState } from "react";
import { motion } from "motion/react";
import {
  Bot, Activity, ListChecks, CheckCircle, Filter, Plus, Dot as DotIcon,
  GitBranch, Play, Edit2, MoreHorizontal, Plug, Package, RotateCw,
  FileText, Folder, ImagePlus, Search, BookOpen, Wand2, Upload,
  Download, Code2, Globe, Eye, DollarSign, UserPlus, Sparkles,
  Server, Key, Gauge, Trash2, RotateCw as RotateCwIcon, Copy, EyeOff,
  ChevronRight, AtSign, Lock, Shield, Bell, Timer, Save, Target as TargetIcon,
  TrendingUp, Users, User, AlertCircle, Info,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Screen, Btn, Card, Bdg, StatCard, PH, Dot, Inp, Ava, fadeUp } from "../components/shared";

export function Agents({ nav }: { nav:(s:Screen)=>void }) {
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
            <p className="text-[10px] text-slate-600 mb-3">{a.role}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-[#111830] rounded-lg p-2 text-center"><p className="text-sm font-bold text-white">{a.tasks.toLocaleString()}</p><p className="text-[9px] text-slate-600">Tasks</p></div>
              <div className="bg-[#111830] rounded-lg p-2 text-center"><p className="text-sm font-bold text-emerald-400">{a.rate}</p><p className="text-[9px] text-slate-600">Rate</p></div>
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-[9px]"><span className="text-slate-600">Model</span><span className="text-slate-300">{a.model}</span></div>
              <div className="flex justify-between text-[9px]"><span className="text-slate-600">Uptime</span><span className="text-emerald-400">{a.uptime}</span></div>
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

export function Tasks() {
  const [view,setView]=useState("board");
  const tasks=[
    {title:"Redesign brand guidelines",agent:"Brand Architect",priority:"High",status:"in-progress",due:"Today",color:"violet"},
    {title:"Generate blog post series",agent:"Content Writer",priority:"High",status:"in-progress",due:"Tomorrow",color:"violet"},
    {title:"Analyze Q4 market data",agent:"Data Analyst",priority:"Med",status:"pending",due:"Dec 15",color:"teal"},
    {title:"Optimize landing page copy",agent:"Content Writer",priority:"Med",status:"pending",due:"Dec 18",color:"teal"},
    {title:"Create social media assets",agent:"Image Creator",priority:"Low",status:"pending",due:"Dec 20",color:"blue"},
  ];
  return (
    <motion.div {...fadeUp}>
      <PH title="Tasks" subtitle="Manage and track AI agent tasks">
        <Btn variant="primary" size="sm" icon={Plus}>New Task</Btn>
      </PH>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Total Tasks" value="156" icon={ListChecks} color="violet"/>
        <StatCard label="In Progress" value="48" icon={Activity} color="teal"/>
        <StatCard label="Completed Today" value="27" icon={CheckCircle} color="green"/>
      </div>
      <div className="space-y-2">
        {tasks.map(t=>(
          <Card key={t.title} className="p-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-${t.color}-500/15 flex items-center justify-center`}><Bot size={14} className={`text-${t.color}-400`}/></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white">{t.title}</p>
              <p className="text-[10px] text-slate-600">{t.agent} · {t.due}</p>
            </div>
            <Bdg color={t.status==="in-progress"?"teal":t.status==="pending"?"amber":"gray"}>{t.status}</Bdg>
            <Bdg color={t.priority==="High"?"red":t.priority==="Med"?"amber":"gray"} size="xs">{t.priority}</Bdg>
            <Btn variant="ghost" size="xs" icon={MoreHorizontal}/>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

export function Workflows({ nav }: { nav:(s:Screen)=>void }) {
  const flows=[
    {name:"Brand Content Pipeline",steps:8,status:"active",runs:1248,success:"99.2%",last:"2m ago"},
    {name:"Blog Auto-Publisher",steps:5,status:"active",runs:892,success:"98.7%",last:"1h ago"},
    {name:"Social Media Automation",steps:12,status:"paused",runs:634,success:"96.4%",last:"3h ago"},
    {name:"Performance Report",steps:4,status:"active",runs:421,success:"100%",last:"Tomorrow 9am"},
    {name:"Lead Nurture Flow",steps:9,status:"draft",runs:0,success:"—",last:"—"},
    {name:"Data Sync Pipeline",steps:6,status:"active",runs:3207,success:"99.8%",last:"10m ago"},
  ];
  return (
    <motion.div {...fadeUp}>
      <PH title="Workflows" subtitle="Automate and orchestrate your AI workflows">
        <Btn variant="secondary" size="sm" icon={Filter}>Filter</Btn>
        <Btn variant="primary" size="sm" icon={Plus}>New Workflow</Btn>
      </PH>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Active Workflows" value="4" icon={GitBranch} color="violet"/>
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

export function MCPTools() {
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

export function CMS() {
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
              {([["New Blog Post",FileText],["Upload Media",Upload],["Create Collection",Folder],["Import CSV",Download],["API Docs",Code2]] as [string,React.ElementType][]).map(([l,Ic])=>(
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

export function Knowledge() {
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

export function Templates() {
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

export function WebsitePlan() {
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
