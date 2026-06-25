import { useState } from "react";
import { motion } from "motion/react";
import {
  BrainCircuit, Save, Share2, Star, Send, RefreshCw, ImagePlus, Download,
  Sparkles, Pause, PlayCircle, SkipForward, Volume2, Plus, AtSign,
  MessageSquare,
} from "lucide-react";
import { Btn, Card, Inp, Ava, fadeUp } from "../components/shared";

export function ModelPlayground() {
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

export function ImageGen() {
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

export function VoiceStudio() {
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

export function ChatScreen() {
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
