import { motion } from "motion/react";
import { CreditCard, Download, Check, Crown } from "lucide-react";
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
