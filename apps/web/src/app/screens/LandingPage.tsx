"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Rocket, Play, Check, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { Btn, Badge } from "../components/shared";
import { BrandIcon } from "../components/ui/brand-icon";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function LandingPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const [selectedApps, setSelectedApps] = useState(["slack", "jira", "drive"]);
  const [userCount, setUserCount] = useState(500);

  const APP_COSTS: Record<string, number> = { slack: 9, teams: 6, drive: 13, salesforce: 25, hubspot: 18, jira: 8, notion: 10, asana: 11, trello: 5, monday: 16, loom: 12, linear: 8 };
  const APP_ICONS: Record<string, string> = { slack: "💬", teams: "🎥", drive: "☁️", salesforce: "🔵", hubspot: "🟠", jira: "🔷", notion: "📝", asana: "🎯", trello: "📋", monday: "📊", loom: "▶️", linear: "⚡" };
  const totalAppCost = selectedApps.reduce((s, id) => s + (APP_COSTS[id] || 0), 0) * userCount * 12;
  const clickUpTotal = 12 * userCount * 12;
  const savings = totalAppCost - clickUpTotal;
  const toggleApp = (id: string) => setSelectedApps(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  const features = [
    { title: "Brand Studio", desc: "Complete AI-powered brand identity system", img: "/3d-icons/painting-dynamic-premium.png" },
    { title: "Website Builder", desc: "Launch stunning websites in minutes", img: "/3d-icons/computer-dynamic-premium.png" },
    { title: "AI Image Generator", desc: "Create stunning visuals with one prompt", img: "/3d-icons/fire-dynamic-premium.png" },
    { title: "Marketing Studio", desc: "Multi-channel marketing campaigns at scale", img: "/3d-icons/heart-dynamic-premium.png" },
    { title: "AI Agents", desc: "Autonomous AI workers that never sleep", img: "/3d-icons/rocket-dynamic-premium.png" },
    { title: "Analytics", desc: "Deep insights across all your brand assets", img: "/3d-icons/clock-dynamic-premium.png" },
  ];
  const plans = [
    { name: "Starter", price: "$0", period: "forever", features: ["5 Projects", "100 AI Generations", "2 Team Members", "Basic Templates"], cta: "Get Started", highlight: false },
    { name: "Pro", price: "$29", period: "/month", features: ["Unlimited Projects", "3,672+ AI Generations", "12 Team Members", "All Templates", "Priority Support", "API Access"], cta: "Start Free Trial", highlight: true },
    { name: "Enterprise", price: "$199", period: "/month", features: ["Everything in Pro", "Unlimited Members", "Custom AI Training", "SSO & Security", "Dedicated Support", "SLA Guarantee"], cta: "Contact Sales", highlight: false },
  ];
  const demoSlides = [
    { title: "AI Brand Studio", desc: "Generate logos, colors, fonts & voice in one click", img: "/images/dashboard-demo.png" },
    { title: "Smart Website Builder", desc: "Drag-and-drop with AI-powered page generation", img: "/images/dashboard-futuristic.png" },
    { title: "Memory Center", desc: "Context-aware AI that remembers your brand preferences", img: "/images/dashboard-memory.png" },
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setActiveFeature((p) => (p + 1) % features.length);
      setDemoStep((p) => (p + 1) % demoSlides.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div {...pageAnim} className="min-h-screen bg-[#07081a] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#07081a]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo-horizontal.svg" alt="NEXORA" className="h-12 w-auto" />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            {[{ label: "Product", screen: "brand-studio" as Screen }, { label: "Templates", screen: "templates" as Screen }, { label: "Pricing", screen: "pricing" as Screen }, { label: "Company", screen: "help" as Screen }].map((n) => (
              <button key={n.label} onClick={() => navigate(n.screen)} className="hover:text-white transition-colors cursor-pointer">{n.label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Btn variant="ghost" onClick={() => navigate("signin")}>Sign In</Btn>
            <Btn variant="primary" onClick={() => navigate("signup")}>Get Started Free</Btn>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-violet-900/30 via-transparent to-transparent"
          />
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-20 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-60 left-1/3 w-64 h-64 bg-cyan-600/8 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-[15%] w-32 h-32 z-20"
          >
            <img src="/images/ai-robo.svg" alt="AI Robot" className="w-full h-full object-contain" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-[10%] w-24 h-24 z-20"
          >
            <img src="/images/nexora-logo.svg" alt="Logo" className="w-full h-full object-contain" />
          </motion.div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge color="violet">The Ultimate AI Design Operating System</Badge>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold mt-6 mb-6 leading-[1.1] tracking-tight">
            Design, Build, and Grow<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
              Your Brand with AI
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Create stunning brands, websites, and marketing assets in minutes with the power of artificial intelligence.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Btn size="lg" variant="primary" icon={Rocket} onClick={() => navigate("signup")}>Get Started Free</Btn>
            <Btn size="lg" variant="secondary" icon={Play} onClick={() => navigate("signin")}>Watch Demo</Btn>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex items-center justify-center gap-8 mt-10 text-sm text-slate-600">
            {["No Credit Card", "Free Forever Plan", "Cancel Anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><Check size={13} className="text-emerald-400" /> {t}</span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge color="violet">Live Demo</Badge>
            <h2 className="text-4xl font-bold mt-4 mb-3">See It in Action</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Watch how Nexora transforms your brand workflow with AI-powered tools.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {demoSlides.map((slide, i) => (
                <motion.button
                  key={slide.title}
                  onClick={() => setDemoStep(i)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 ${
                    demoStep === i
                      ? "border-violet-500/50 bg-violet-500/10 shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)]"
                      : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-blue-600/10 flex items-center justify-center flex-shrink-0 p-1.5">
                      <img src={slide.img} alt={slide.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white mb-0.5">{slide.title}</h3>
                      <p className="text-sm text-slate-500">{slide.desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            <motion.div
              key={demoStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[4/3] rounded-2xl border border-white/[0.08] overflow-hidden bg-[#0a0b1e]"
            >
              <img src={demoSlides[demoStep].img} alt={demoSlides[demoStep].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07081a]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2 rounded-lg bg-white/[0.06] backdrop-blur border border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> {demoSlides[demoStep].title}
                </div>
                <span className="text-xs text-slate-500">Live Preview</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] py-8 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-slate-600 uppercase tracking-widest mb-6">Trusted by 100K+ brands worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {["Figma", "Slack", "GitHub", "Notion", "Stripe", "Vercel"].map((b) => (
              <motion.div key={b} whileHover={{ scale: 1.1, y: -2 }} className="flex items-center gap-2 text-slate-500 hover:text-violet-300 transition-all duration-300 cursor-default">
                <BrandIcon name={b} size={20} />
                <span className="font-semibold text-sm">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge color="blue">Everything You Need</Badge>
            <h2 className="text-4xl font-bold mt-4 mb-4">Build a Powerful Brand</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Everything you need to create, manage, and grow your brand in one platform.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => setActiveFeature(i)}
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                  activeFeature === i
                    ? "border-violet-500/40 bg-violet-500/10 shadow-[0_0_25px_-8px_rgba(139,92,246,0.25)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-violet-500/30 hover:shadow-[0_0_20px_-10px_rgba(139,92,246,0.15)] hover:bg-white/[0.04]"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600/20 to-blue-600/10 flex items-center justify-center mb-3 p-1.5 group-hover:shadow-lg">
                  <img src={f.img} alt={f.title} className="w-full h-full object-contain" />
                </div>
                <h3 className="font-bold text-white mb-1 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center relative z-10">
          {[
            { value: "10K+", label: "Active Users", img: "/3d-icons/heart-dynamic-premium.png" },
            { value: "50K+", label: "Brands Created", img: "/3d-icons/medal-dynamic-premium.png" },
            { value: "100K+", label: "AI Generations", img: "/3d-icons/fire-dynamic-premium.png" },
            { value: "99.9%", label: "Uptime", img: "/3d-icons/clock-dynamic-premium.png" },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-blue-600/10 flex items-center justify-center mx-auto mb-3 p-1.5">
                <img src={s.img} alt={s.label} className="w-full h-full object-contain" />
              </div>
              <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge color="cyan">Pricing</Badge>
            <h2 className="text-4xl font-bold mt-4 mb-3">Simple, Transparent Pricing</h2>
            <p className="text-slate-500">Start free. Scale as you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p, i) => {
              const planIcons = ["/3d-icons/gift-dynamic-premium.png", "/3d-icons/rocket-dynamic-premium.png", "/3d-icons/money-dynamic-premium.png"];
              return (
                <motion.div
                  key={p.name}
                  whileHover={{ y: -6 }}
                  className={`p-6 rounded-2xl border transition-all duration-300 ${
                    p.highlight
                      ? "border-[#d4a574]/40 bg-gradient-to-b from-[#d4a574]/5 to-transparent shadow-[0_0_40px_-15px_rgba(212,165,116,0.2)]"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-violet-500/30"
                  } relative`}
                >
                  {p.highlight && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#d4a574] to-[#e8c9a0] text-xs font-bold text-black"
                    >
                      Most Popular
                    </motion.div>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 p-1.5 ${p.highlight ? "bg-gradient-to-br from-[#d4a574]/20 to-[#e8c9a0]/10" : "bg-gradient-to-br from-violet-600/15 to-blue-600/10"}`}>
                    <img src={planIcons[i]} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-1">{p.name}</h3>
                  <div className="flex items-end gap-1 mb-4">
                    <span className="text-3xl font-extrabold text-white">{p.price}</span>
                    <span className="text-slate-500 text-sm mb-1">{p.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                        {p.highlight ? (
                          <Check size={13} className="text-[#d4a574] flex-shrink-0" />
                        ) : (
                          <Check size={13} className="text-emerald-400 flex-shrink-0" />
                        )}
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Btn variant={p.highlight ? "primary" : "secondary"} className={`w-full justify-center ${p.highlight ? "bg-gradient-to-r from-[#d4a574] to-[#e8c9a0] text-black hover:from-[#e8c9a0] hover:to-[#d4a574] font-bold border-0" : ""}`} onClick={() => navigate("signup")}>
                    {p.cta}
                  </Btn>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Cost Savings Calculator ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-indigo-900/5 to-purple-900/5" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge color="blue">Cost Calculator</Badge>
            <h2 className="text-4xl font-bold mt-4 mb-3">See How Much You Save</h2>
            <p className="text-slate-500">Compare your current tool stack against our all-in-one platform.</p>
          </div>

          <div className="rounded-3xl p-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-900/20">
            <div className="flex flex-col md:flex-row gap-1 bg-transparent">
              <div className="flex-1 bg-card rounded-2xl p-6">
                <h3 className="text-white font-medium mb-5">Which apps do you use?</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6">
                  {Object.entries(APP_ICONS).map(([id, icon]) => {
                    const isSelected = selectedApps.includes(id);
                    return (
                      <button key={id} onClick={() => toggleApp(id)}
                        className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all text-lg ${
                          isSelected ? "border-violet-500 bg-violet-500/10" : "border-white/[0.06] hover:border-white/20"
                        }`}
                      >
                        {icon}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-4 border-t border-white/[0.06]">
                  <label className="text-slate-300 text-sm font-medium mb-3 block">How many people at your company?</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setUserCount(Math.max(1, userCount - 10))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-400"><Minus size={16} /></button>
                    <input type="number" value={userCount} onChange={e => setUserCount(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-24 h-10 text-center text-lg font-bold bg-white/[0.04] border border-white/[0.1] rounded-lg text-white focus:border-violet-500 focus:outline-none" />
                    <button onClick={() => setUserCount(userCount + 10)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-400"><Plus size={16} /></button>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-white font-medium">Apps to replace</h3>
                    <span className="text-xs text-slate-500">for <span className="text-white font-bold">{userCount.toLocaleString()}</span> users</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {selectedApps.map(id => (
                      <div key={id} className="flex items-center justify-between text-sm text-slate-400 py-1.5">
                        <span>{APP_ICONS[id]} {id.charAt(0).toUpperCase() + id.slice(1)}</span>
                        <span className="text-white font-medium">${APP_COSTS[id]}/user</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/[0.06] pt-3 flex justify-between font-bold text-white">
                    <span>TOTAL</span>
                    <span>${totalAppCost.toLocaleString()}/yr</span>
                  </div>
                  <div className="border-t border-dashed border-white/[0.06] mt-3 pt-3 text-sm text-slate-500">
                    Our platform for {userCount.toLocaleString()} users = <span className="text-white font-semibold">${clickUpTotal.toLocaleString()}/yr</span>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                    Save ${Math.max(0, savings).toLocaleString()}/yr
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">
                    Switch to our platform and save a {userCount.toLocaleString()}-person company ${Math.max(0, savings).toLocaleString()} per year.
                  </p>
                  <Btn variant="primary" className="w-full justify-center" onClick={() => navigate("signup")}>
                    Start saving today <ChevronRight size={14} />
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <div className="w-20 h-20 mx-auto mb-6">
            <img src="/3d-icons/rocket-dynamic-premium.png" alt="Rocket" className="w-full h-full object-contain" />
          </div>
          <Badge color="violet">Get Started Today</Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-4">Ready to Transform Your Brand?</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">Join 10,000+ creators already building with Nexora. Start free, no credit card required.</p>
          <Btn size="lg" variant="primary" icon={Rocket} onClick={() => navigate("signup")}>Start Building Free</Btn>
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.06] py-10 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo-horizontal.svg" alt="NEXORA" className="h-11 w-auto" />
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            {(["terms", "privacy", "cookie", "license"] as Screen[]).map((s) => (
              <button key={s} onClick={() => navigate(s)} className="hover:text-slate-400 transition-colors capitalize">{s}</button>
            ))}
          </div>
          <p className="text-xs text-slate-700">© 2024 NEXORA. All rights reserved.</p>
        </div>
      </footer>
    </motion.div>
  );
}
