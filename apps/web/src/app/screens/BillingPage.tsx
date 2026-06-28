"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, Download, Check, Crown, ChevronUp, Wifi } from "lucide-react";
import { Btn, Card, Badge, PageHeader } from "../components/shared";
import { BrandIcon } from "../components/ui/brand-icon";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const PLANS = [
  { name: "Starter", price: "$0", period: "free forever", desc: "Perfect for getting started", features: ["5 Projects", "100 AI Generations", "2 Team Members", "Basic Templates"], popular: false },
  { name: "Pro", price: "$29", period: "/month", desc: "Best for professionals", features: ["Unlimited Projects", "3,672+ AI Generations", "12 Team Members", "All Templates", "Priority Support", "API Access"], popular: true },
  { name: "Business", price: "$79", period: "/month", desc: "For growing teams", features: ["Everything in Pro", "Unlimited AI Generations", "50 Team Members", "Custom Branding", "Advanced Analytics", "SSO", "Dedicated Manager"], popular: false },
  { name: "Enterprise", price: "$199", period: "/month", desc: "For large organizations", features: ["Everything in Business", "Unlimited Members", "Custom AI Training", "White Label", "SLA Guarantee", "24/7 Support", "Custom Integration"], popular: false },
];

const INVOICES = [
  { date: "Jun 1, 2025", amount: "$29.00", status: "Paid" as const, id: "INV-2025-0601" },
  { date: "May 1, 2025", amount: "$29.00", status: "Paid" as const, id: "INV-2025-0501" },
  { date: "Apr 1, 2025", amount: "$29.00", status: "Paid" as const, id: "INV-2025-0401" },
];

export default function BillingPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [walletHovered, setWalletHovered] = useState(false);

  const cards = [
    { id: "silver", type: "silver", number: "•••• •••• •••• 8832", holder: "ALEXANDER HAMILTON", expiry: "12/26", balance: "$4,200.50" },
    { id: "gold", type: "gold", number: "•••• •••• •••• 4289", holder: "ALEXANDER HAMILTON", expiry: "09/28", balance: "$12,450.00" },
  ];

  const currentBalance = activeCard ? cards.find(c => c.id === activeCard)?.balance : "$250,000";

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Billing & Plans" subtitle="Manage your subscription and payment methods" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={`p-5 relative ${plan.popular ? "border-violet-500/50 bg-gradient-to-b from-violet-500/5 to-transparent" : ""}`}>
            {plan.popular && (
              <Badge color="violet" className="absolute -top-2.5 left-1/2 -translate-x-1/2">Current Plan</Badge>
            )}
            <div className="flex items-center gap-2 mb-3">
              <Crown size={16} className={plan.popular ? "text-violet-400" : "text-slate-600"} />
              <h3 className="font-bold text-white text-sm">{plan.name}</h3>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-extrabold text-white">{plan.price}</span>
              <span className="text-xs text-slate-500">{plan.period}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">{plan.desc}</p>
            <ul className="space-y-2 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                  <Check size={11} className="text-emerald-400 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Btn variant={plan.popular ? "primary" : "outline"} className="w-full justify-center" size="sm">
              {plan.popular ? "Current Plan" : "Upgrade"}
            </Btn>
          </Card>
        ))}
      </div>

      {/* ── Digital Wallet ── */}
      <Card className="p-5 mb-5 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-transparent to-emerald-900/5 pointer-events-none" />
        <h3 className="font-bold text-white text-sm mb-4 relative z-10 flex items-center gap-2">
          <CreditCard size={14} className="text-violet-400" /> Digital Wallet
        </h3>
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="relative w-[340px] h-[220px] perspective-[1000px]"
            onMouseEnter={() => setWalletHovered(true)}
            onMouseLeave={() => { setWalletHovered(false); if (!activeCard) setWalletHovered(false); }}
          >
            {/* Cards */}
            <div className="absolute inset-x-4 top-0 bottom-0" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
              {cards.map((card, idx) => {
                const isActive = activeCard === card.id;
                const isGold = card.type === "gold";
                const yOffset = isActive ? 50 : walletHovered ? -90 + (idx * 60) : 0 + (idx * 15);
                return (
                  <motion.div
                    key={card.id}
                    onClick={(e) => { e.stopPropagation(); setActiveCard(activeCard === card.id ? null : card.id); }}
                    initial={false}
                    animate={{ y: yOffset, scale: isActive ? 1.05 : 1 - (0.05 * (1 - idx)), zIndex: isActive ? 40 : 10 + idx, filter: `brightness(${isActive ? 1 : walletHovered ? 1 : 0.6 - (0.1 * (1 - idx))})` }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="absolute left-0 w-full h-[170px] rounded-xl cursor-pointer shadow-xl overflow-hidden border border-white/10"
                    style={{
                      top: "-30px", transformOrigin: "bottom center",
                      background: isGold
                        ? "linear-gradient(135deg, #E6C685, #A88B4D, #6C5528)"
                        : "linear-gradient(135deg, #E2E2E2, #9CA3AF, #4B5563)",
                    }}
                  >
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\"/></filter><rect width=\"100\" height=\"100\" filter=\"url(%23n)\" opacity=\"0.4\"/></svg>')", mixBlendMode: "overlay" }} />
                    {isGold && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    )}
                    <div className="relative p-4 h-full flex flex-col justify-between font-mono select-none" style={{ color: isGold ? "#3E2C0F" : "#1f2937" }}>
                      <div className="flex justify-between items-start">
                        <div className="w-9 h-6 rounded bg-black/10 border border-black/10 flex items-center justify-center backdrop-blur-sm">
                          <div className="w-6 h-3 border border-black/20 rounded-sm" />
                        </div>
                        <Wifi className={`w-4 h-4 rotate-90 ${isGold ? "text-[#3E2C0F]" : "text-gray-700"}`} />
                      </div>
                      <div className="space-y-2">
                        <div className={`text-base tracking-widest font-bold ${isGold ? "text-[#3E2C0F]" : "text-gray-800"}`}>{card.number}</div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className={`text-[8px] uppercase opacity-70 ${isGold ? "text-[#3E2C0F]" : "text-gray-700"}`}>Card Holder</div>
                            <div className={`text-[10px] font-bold tracking-wide uppercase ${isGold ? "text-[#3E2C0F]" : "text-gray-900"}`}>{card.holder}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-[8px] uppercase opacity-70 ${isGold ? "text-[#3E2C0F]" : "text-gray-700"}`}>Expires</div>
                            <div className={`text-[10px] font-bold ${isGold ? "text-[#3E2C0F]" : "text-gray-900"}`}>{card.expiry}</div>
                          </div>
                        </div>
                      </div>
                      <div className={`absolute top-4 right-4 flex items-center gap-1 ${isGold ? "text-[#3E2C0F]" : "text-gray-700"}`}>
                        <span className="font-serif italic text-sm font-black tracking-tighter">Prestige</span>
                        <Wifi className="w-2.5 h-2.5 rotate-90 opacity-60" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Wallet front */}
            <motion.div
              className="absolute inset-0 bg-[#141414] rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9)] border border-white/5 z-30 flex flex-col items-center justify-center overflow-hidden"
              animate={{ rotateX: walletHovered || activeCard ? 5 : 0, y: walletHovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\"/></filter><rect width=\"100\" height=\"100\" filter=\"url(%23n)\" opacity=\"0.4\"/></svg>')", mixBlendMode: "multiply" }} />
              <div className="absolute inset-3 border border-dashed border-white/10 rounded-xl opacity-50 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center space-y-1">
                <span className="text-[#5C7066] text-[9px] tracking-[0.25em] font-bold uppercase">Total Balance</span>
                <motion.span key={currentBalance} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                  className="text-3xl text-[#E0E0E0] font-serif tracking-tight font-medium" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {currentBalance}
                </motion.span>
              </div>
            </motion.div>
          </div>
          <motion.div className="text-[#88A096]/40 text-[9px] tracking-widest uppercase mt-3 flex items-center gap-1.5 font-medium"
            animate={{ opacity: walletHovered || activeCard ? 1 : 0.4 }}
          >
            <ChevronUp size={9} className={walletHovered ? "animate-bounce" : ""} />
            {activeCard ? "Click to close" : "Select a card"}
          </motion.div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><CreditCard size={14} className="text-violet-400" /> Payment Method</h3>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <BrandIcon name="Stripe" size={32} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Visa ending in 4242</p>
              <p className="text-xs text-slate-500">Expires 12/27</p>
            </div>
            <Badge color="green">Default</Badge>
            <Btn variant="ghost" size="sm">Edit</Btn>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-4">Invoice History</h3>
          <div className="space-y-2">
            {INVOICES.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div>
                  <p className="text-sm text-white font-semibold">{inv.amount}</p>
                  <p className="text-xs text-slate-500">{inv.date} · {inv.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color="green">{inv.status}</Badge>
                  <Btn variant="ghost" size="sm" icon={Download} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
