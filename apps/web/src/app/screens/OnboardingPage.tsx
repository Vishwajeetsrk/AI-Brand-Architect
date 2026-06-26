import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Paintbrush, Megaphone, Rocket, Crown, Check, CheckCircle, ChevronLeft, ChevronRight, AtSign } from "lucide-react";
import { Btn, Card, Badge, Input, Avatar } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function OnboardingPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [step, setStep] = useState(1);
  const total = 5;
  const [role, setRole] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [style, setStyle] = useState("");
  const [inviteEmails, setInviteEmails] = useState("");

  const roles = [
    { id: "designer", label: "Designer", desc: "I create brands and designs", icon: Paintbrush },
    { id: "marketer", label: "Marketer", desc: "I manage marketing campaigns", icon: Megaphone },
    { id: "founder", label: "Founder", desc: "I build products and startups", icon: Rocket },
    { id: "business", label: "Business Owner", desc: "I manage my brand and team", icon: Crown },
  ];

  const goalOptions = ["Build a Brand Identity", "Create a Website", "Design Marketing Assets", "Generate Logos", "Create Presentations", "Social Media Content", "Other"];
  const styles = [
    { id: "modern", label: "Modern", desc: "Clean and minimalist", color: "from-slate-600 to-slate-400" },
    { id: "luxury", label: "Luxury", desc: "Elegant and premium", color: "from-amber-600 to-yellow-400" },
    { id: "bold", label: "Bold", desc: "Vibrant and strong", color: "from-violet-600 to-pink-500" },
    { id: "creative", label: "Creative", desc: "Playful and unique", color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-[#07081a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500" />
      <div className="absolute top-40 left-20 w-64 h-64 bg-violet-900/15 rounded-full blur-3xl" />
      <motion.div {...pageAnim} className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="NEXORA" className="w-10 h-10" />
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < step ? "bg-violet-500" : "bg-white/10"} ${i === step - 1 ? "w-6" : "w-3"}`} />
            ))}
            <span className="text-xs text-slate-500 ml-1">Step {step} of {total}</span>
          </div>
        </div>

        <Card className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" {...pageAnim}>
                <div className="mb-2"><Badge color="violet">Welcome to NEXORA</Badge></div>
                <h2 className="text-2xl font-bold text-white mb-1 mt-3">What describes you best?</h2>
                <p className="text-sm text-slate-500 mb-6">Let&apos;s set up your workspace.</p>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${role === r.id ? "border-violet-500/60 bg-violet-500/10" : "border-white/[0.07] hover:border-white/20"}`}
                      >
                        <Icon size={20} className={role === r.id ? "text-violet-400" : "text-slate-500"} />
                        <p className="font-semibold text-white text-sm mt-2">{r.label}</p>
                        <p className="text-xs text-slate-500">{r.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" {...pageAnim}>
                <h2 className="text-2xl font-bold text-white mb-1">What are your goals?</h2>
                <p className="text-sm text-slate-500 mb-6">Select all that apply.</p>
                <div className="space-y-2.5">
                  {goalOptions.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoals((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g])}
                      className={`flex items-center gap-3 w-full p-3.5 rounded-xl border text-sm text-left transition-all ${goals.includes(g) ? "border-violet-500/60 bg-violet-500/10 text-violet-300" : "border-white/[0.07] text-slate-400 hover:border-white/20"}`}
                    >
                      <div className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all ${goals.includes(g) ? "bg-violet-600 border-violet-500" : "border-slate-600"}`}>
                        {goals.includes(g) && <Check size={10} className="text-white" />}
                      </div>
                      {g}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" {...pageAnim}>
                <h2 className="text-2xl font-bold text-white mb-1">Choose your preferred style</h2>
                <p className="text-sm text-slate-500 mb-6">This helps us personalize your experience.</p>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`p-0 rounded-xl overflow-hidden border-2 transition-all ${style === s.id ? "border-violet-500" : "border-white/[0.07]"}`}
                    >
                      <div className={`h-20 bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                        {style === s.id && <CheckCircle size={20} className="text-white" />}
                      </div>
                      <div className="p-3 bg-card text-left">
                        <p className="font-semibold text-white text-sm">{s.label}</p>
                        <p className="text-xs text-slate-500">{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="s4" {...pageAnim}>
                <h2 className="text-2xl font-bold text-white mb-1">Invite your team <span className="text-slate-600">(optional)</span></h2>
                <p className="text-sm text-slate-500 mb-6">Collaborate with your team members.</p>
                <div className="space-y-3 mb-4">
                  {["sarah@company.com", "michael@company.com", "emily@company.com"].map((e) => (
                    <div key={e} className="flex items-center gap-3 p-3 rounded-xl bg-[#111336] border border-white/[0.06]">
                      <Avatar name={e.split("@")[0]} size="sm" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-white">{e.split("@")[0].charAt(0).toUpperCase() + e.split("@")[0].slice(1)}</p>
                        <p className="text-[10px] text-slate-500">{e}</p>
                      </div>
                      <select className="text-xs bg-transparent text-slate-400 border-0 outline-none">
                        <option>Admin</option>
                        <option>Editor</option>
                        <option>Viewer</option>
                      </select>
                    </div>
                  ))}
                </div>
                <Input icon={AtSign} placeholder="Add team member email..." value={inviteEmails} onChange={setInviteEmails} />
              </motion.div>
            )}
            {step === 5 && (
              <motion.div key="s5" {...pageAnim} className="text-center py-4">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-2">You&apos;re all set!</h2>
                <p className="text-slate-500 text-sm mb-2">Let&apos;s start creating something amazing.</p>
                <div className="grid grid-cols-1 gap-2 mt-6 text-left">
                  {[
                    { icon: Check, label: "Preferences Saved", color: "text-emerald-400" },
                    { icon: Check, label: "Workspace Created", color: "text-emerald-400" },
                    { icon: Check, label: "Team Invited", color: "text-emerald-400" },
                    { icon: Check, label: "Ready to Go", color: "text-emerald-400" },
                  ].map((i) => (
                    <div key={i.label} className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                      <i.icon size={14} className={i.color} />
                      <span className="text-sm text-slate-300">{i.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`flex mt-6 ${step > 1 ? "justify-between" : "justify-end"}`}>
            {step > 1 && (
              <Btn variant="ghost" icon={ChevronLeft} onClick={() => setStep((p) => p - 1)}>Back</Btn>
            )}
            {step < total ? (
              <Btn variant="primary" onClick={() => setStep((p) => p + 1)}>
                Next <ChevronRight size={14} />
              </Btn>
            ) : (
              <Btn variant="primary" icon={Rocket} onClick={() => navigate("dashboard")}>Go to Dashboard</Btn>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
