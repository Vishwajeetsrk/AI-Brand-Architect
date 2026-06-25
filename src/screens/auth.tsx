import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target as TargetIcon, Command, BrainCircuit, ImagePlus, Mic, MessageSquare, Bot, Layers,
  ChevronRight, ChevronLeft, ArrowRight, Check, Eye, EyeOff, AtSign, Lock, User,
  UserPlus, Send, CheckCircle, Code2, Paintbrush, Megaphone, Rocket, BarChart3,
  Rocket as RocketIcon, Play, Wand2,
} from "lucide-react";
import { Screen, Btn, Card, Bdg, Inp, Ava, fadeUp, AuthWrap } from "../components/shared";

export function Landing({ nav }: { nav:(s:Screen)=>void }) {
  const [tick,setTick]=useState(0);
  useEffect(()=>{ const t=setInterval(()=>setTick(p=>p+1),2500); return()=>clearInterval(t); },[]);
  const features=["Model Playground","AI Mission Control","Brand DNA Studio","CMS Dashboard","Multi-Agent Workflows","Website Planner"];
  return (
    <div className="min-h-screen bg-[#07091c] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-violet-900/20 via-transparent to-transparent"/>
        <div className="absolute top-32 left-10 w-80 h-80 bg-violet-800/8 rounded-full blur-3xl"/>
        <div className="absolute top-60 right-10 w-64 h-64 bg-blue-800/8 rounded-full blur-3xl"/>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-800/6 rounded-full blur-3xl"/>
      </div>
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
                <Btn size="lg" variant="primary" icon={RocketIcon} onClick={()=>nav("signup")}>Start for Free</Btn>
                <Btn size="lg" variant="secondary" icon={Play} onClick={()=>nav("mission")}>See Mission Control</Btn>
              </div>
            </motion.div>
          <div className="flex flex-wrap justify-center gap-2">
            {features.map((f,i)=>(
              <motion.span key={f} animate={{opacity:tick%6===i?1:0.35}} transition={{duration:0.4}}
                className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 cursor-default">{f}</motion.span>
            ))}
          </div>
        </div>
      </section>
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
      <section className="py-14 px-6 border-y border-white/[0.05] bg-white/[0.015]">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-6 text-center">
          {[["12,842","Active Agents"],["4.2M","AI Calls/day"],["98.75%","Success Rate"],["1.42s","Avg Latency"]].map(([v,l])=>(
            <div key={l}><p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">{v}</p><p className="text-xs text-slate-500 mt-1">{l}</p></div>
          ))}
        </div>
      </section>
      <section className="py-24 px-6 text-center z-10 relative">
        <h2 className="text-3xl font-black mb-4">Ready to build your brand with AI?</h2>
        <p className="text-slate-500 text-sm mb-8">Join 10,000+ teams using NEXORA to build smarter brands.</p>
        <Btn size="lg" variant="primary" icon={ArrowRight} onClick={()=>nav("signup")}>Get Started — It's Free</Btn>
      </section>
      <footer className="border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><img src="/logo.svg" alt="NEXORA" className="w-5 h-5" /><span className="text-xs font-bold text-white">NEXORA</span></div>
          <p className="text-xs text-slate-700">© 2024 NEXORA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export function SignIn({ nav }: { nav:(s:Screen)=>void }) {
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

export function SignUp({ nav }: { nav:(s:Screen)=>void }) {
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

export function Forgot({ nav }: { nav:(s:Screen)=>void }) {
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

export function Verify({ nav }: { nav:(s:Screen)=>void }) {
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

export function Onboard({ nav }: { nav:(s:Screen)=>void }) {
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
              :<Btn variant="primary" size="sm" icon={UserPlus} onClick={()=>nav("mission")}>Launch Mission Control</Btn>}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
