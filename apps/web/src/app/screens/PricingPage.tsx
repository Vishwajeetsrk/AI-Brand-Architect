"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Check, X, ChevronRight, HelpCircle, FileText, ArrowUpRight, Building2, DollarSign } from "lucide-react";
import { Btn, Badge } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const PLANS = [
  {
    id: "standard", name: "Standard", desc: "Pay-as-you-go for early-stage teams", price: "Free", note: "Up to your first 15K credits",
    icon: FileText, accent: "#3b82f6", gradient: "from-blue-500/10",
    features: ["Parse API", "Extract API", "Edit API", "Split API", "30+ Supported File Types", "Up to 5 seats", "No Page Limits"],
  },
  {
    id: "growth", name: "Growth", desc: "Built for scaling teams", price: "Custom pricing",
    icon: ArrowUpRight, accent: "#65a30d", gradient: "from-lime-500/10", popular: true,
    features: ["Volume Discounts", "Zero Data Retention", "Business Associate Agreement", "Premium Rate Limits", "Priority Support", "EU/AU Data Residency", "Unlimited Studio Seats", "Studio Evaluations"],
  },
  {
    id: "enterprise", name: "Enterprise", desc: "Built for full control & custom needs", price: "Custom pricing",
    icon: Building2, accent: "#c026d3", gradient: "from-fuchsia-500/10",
    features: ["VPC & On-Prem Deployments", "Custom MSA", "Custom SLA", "Custom Rate Limits", "Custom Processing Pipelines", "Dedicated On-Call Support", "RBAC", "SSO & SAML"],
  },
];

const COMPARE_SECTIONS = [
  {
    title: "Usage", features: [
      { name: "Saved reports", free: "5 per seat", growth: "Unlimited", enterprise: "Unlimited" },
      { name: "Monthly events", free: "Up to 1M", growth: "Up to 20M", enterprise: "Up to 1T" },
      { name: "Seats", free: "Unlimited", growth: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    title: "Analytics", features: [
      { name: "Insights, funnels, retention", free: true, growth: true, enterprise: true },
      { name: "Multi-touch attribution", free: false, growth: true, enterprise: true },
      { name: "Anomaly detection", free: false, growth: false, enterprise: true },
      { name: "Session replays", free: "10K/mo", growth: "20K free/mo", enterprise: "20K free/mo" },
      { name: "Feature Flags", free: false, growth: false, enterprise: "Add-on" },
    ],
  },
];

export default function PricingPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [yearly, setYearly] = useState(false);

  return (
    <motion.div {...pageAnim} className="min-h-screen bg-[#07081a] text-white overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge color="violet">Flexible plans</Badge>
          <h1 className="font-serif text-5xl md:text-6xl mt-4 mb-4 leading-[1.1] tracking-tight">
            Choose the plan that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 italic">best fits</span> your needs
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-6 text-lg">Start free, upgrade when you grow. All plans include a 14-day trial.</p>
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full p-1">
            <button onClick={() => setYearly(false)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!yearly ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${yearly ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}>Yearly <span className="text-[10px] text-emerald-400 ml-1">-20%</span></button>
          </div>
        </div>
      </section>

      {/* ── 3-Card Pricing ── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className={`relative flex flex-col bg-card border ${plan.popular ? "border-violet-500/40" : "border-white/[0.06]"} rounded-xl overflow-hidden transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-900/10`}
              >
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${plan.gradient} opacity-60`} />
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-violet-600 text-white text-xs font-medium px-3 py-1 rounded-full animate-pulse">
                    Most Popular
                  </div>
                )}
                <div className="relative p-6 flex flex-col h-full">
                  <div className="mb-4" style={{ color: plan.accent }}><Icon size={28} strokeWidth={1.5} /></div>
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl text-white mb-1">{plan.name}</h3>
                    <p className="text-slate-500 text-sm">{plan.desc}</p>
                  </div>
                  <div className="mb-6 flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-medium text-white">{plan.price}</span>
                    {plan.note && <span className="text-slate-500 text-sm ml-auto">{plan.note}</span>}
                  </div>
                  <Btn variant={plan.popular ? "primary" : "secondary"} className="w-full justify-center mb-6" onClick={() => navigate("signup")}>
                    {plan.id === "enterprise" ? <>Contact sales <ChevronRight size={14} /></> : "Get started"}
                  </Btn>
                  <div className="mt-auto">
                    <p className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: plan.accent }}>
                      {plan.id === "standard" ? "CORE FUNCTIONALITY" : plan.id === "growth" ? "EVERYTHING IN STANDARD, PLUS:" : "EVERYTHING IN GROWTH, PLUS:"}
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                          <Check size={14} className="shrink-0 mt-0.5 text-emerald-400" />
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {plan.id === "standard" && (
                    <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
                      <p className="text-xs text-slate-600">Then, $0.015 per credit after first 15K.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="px-6 py-16 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge color="blue">Compare Plans</Badge>
            <h2 className="text-3xl font-bold mt-3 mb-2">Detailed Feature Comparison</h2>
            <p className="text-slate-500">See exactly what you get with each plan.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                  <th className="py-4 px-5 text-left text-slate-300 font-semibold w-[250px]">Feature</th>
                  <th className="py-4 px-5 text-center text-slate-300 font-semibold">Free</th>
                  <th className="py-4 px-5 text-center text-slate-300 font-semibold">Growth</th>
                  <th className="py-4 px-5 text-center text-slate-300 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_SECTIONS.map((section) => (
                  <>
                    <tr key={section.title} className="bg-white/[0.02]">
                      <td colSpan={4} className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">{section.title}</td>
                    </tr>
                    {section.features.map((feat) => (
                      <tr key={feat.name} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-5 text-slate-400 flex items-center gap-2">
                          {feat.name}
                          <HelpCircle size={12} className="text-slate-600 cursor-help" />
                        </td>
                        {["free", "growth", "enterprise"].map((tier) => {
                          const val = feat[tier as keyof typeof feat];
                          return (
                            <td key={tier} className="py-3.5 px-5 text-center">
                              {typeof val === "boolean" ? (
                                val ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-emerald-500/50 text-emerald-400"><Check size={13} strokeWidth={3} /></span>
                                ) : (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-slate-600 text-slate-500"><X size={13} strokeWidth={3} /></span>
                                )
                              ) : (
                                <span className="text-slate-400 text-sm">{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-violet-900/20 to-fuchsia-900/10 rounded-2xl border border-violet-500/20 p-12">
          <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Join thousands building their brand with AI. Start free, no credit card required.</p>
          <div className="flex items-center justify-center gap-4">
            <Btn variant="primary" size="lg" onClick={() => navigate("signup")}>Create Free Account</Btn>
            <Btn variant="secondary" size="lg" onClick={() => navigate("signin")}>Contact Sales</Btn>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-8 px-6 text-center text-xs text-slate-600">
        &copy; 2025 NEXORA. All rights reserved.
      </footer>
    </motion.div>
  );
}
