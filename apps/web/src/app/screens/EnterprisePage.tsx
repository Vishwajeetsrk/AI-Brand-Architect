"use client";
import { motion } from "motion/react";
import { Shield, Server, Building2, Headphones, CheckCircle, ArrowRight, Sliders, Users, Lock, Cloud, BarChart3, Globe } from "lucide-react";
import { Card, Badge, Btn, PageHeader, StatCard } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const FEATURES = [
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant, encrypted at rest and in transit, role-based access control, and audit logging." },
  { icon: Building2, title: "Multi-tenant Architecture", desc: "Isolated workspaces per organization with fine-grained permissions and data separation." },
  { icon: Sliders, title: "Custom AI Models", desc: "Fine-tuned models on your brand data, private model deployment, and custom training pipelines." },
  { icon: Users, title: "Team Collaboration", desc: "Real-time co-editing, approval workflows, shared asset libraries, and team analytics." },
  { icon: Lock, title: "SSO & SCIM", desc: "SAML 2.0, OIDC, SCIM provisioning support with Azure AD, Okta, Google Workspace." },
  { icon: Cloud, title: "Dedicated Infrastructure", desc: "Private cloud deployment, VPC peering, dedicated compute resources, and 99.99% SLA." },
  { icon: BarChart3, title: "Advanced Analytics", desc: "Custom dashboards, usage metrics, brand health scores, and exportable reports." },
  { icon: Globe, title: "Global CDN", desc: "Edge-optimized delivery, multi-region deployment, and localized content distribution." },
  { icon: Headphones, title: "Premium Support", desc: "24/7 dedicated support team, SLAs with 15-minute response, and named account manager." },
];

const PLANS = [
  { name: "Starter", price: "$499", period: "/month", users: "Up to 10", features: ["All core features", "5 brand profiles", "Basic analytics", "Email support", "Community access"], popular: false },
  { name: "Growth", price: "$1,999", period: "/month", users: "Up to 50", features: ["Everything in Starter", "Unlimited brands", "Advanced analytics", "Priority support", "Custom integrations", "SSO"], popular: true },
  { name: "Enterprise", price: "Custom", period: "", users: "Unlimited", features: ["Everything in Growth", "Dedicated infrastructure", "Custom AI models", "24/7 phone support", "On-premise option", "99.99% SLA"], popular: false },
];

export default function EnterprisePage({ navigate }: { navigate?: (path: string) => void }) {
  return (
    <motion.div {...pageAnim} className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge color="violet" className="mb-4">Enterprise</Badge>
        <h1 className="text-4xl font-bold text-white mb-3">Built for Scale</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Enterprise-grade brand intelligence platform with security, compliance, and dedicated infrastructure for organizations that need more.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard label="Uptime SLA" value="99.99%" icon={Server} />
        <StatCard label="Data Centers" value="8 Regions" icon={Globe} />
        <StatCard label="Security" value="SOC 2" icon={Shield} />
        <StatCard label="Customers" value="500+" icon={Building2} />
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Enterprise Features</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {FEATURES.map(f => (
          <Card key={f.title} className="p-5">
            <f.icon size={24} className="text-violet-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mb-6 text-center">Plans</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {PLANS.map(plan => (
          <Card key={plan.name} className={`p-6 relative ${plan.popular ? "border-violet-500/40 bg-gradient-to-b from-violet-600/5 to-transparent" : ""}`}>
            {plan.popular && <Badge color="violet" className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">{plan.price}</span>
              <span className="text-gray-400">{plan.period}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{plan.users} users</p>
            <ul className="space-y-2 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={14} className="text-green-400 shrink-0" />{f}</li>
              ))}
            </ul>
            <Btn variant={plan.popular ? "primary" : "secondary"} className="w-full justify-center" onClick={() => navigate?.("/pricing")}>
              {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"} <ArrowRight size={16} />
            </Btn>
          </Card>
        ))}
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-violet-600/10 to-indigo-600/5 border-violet-500/20">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to scale your brand intelligence?</h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-6">Talk to our enterprise team about a custom solution for your organization.</p>
        <Btn variant="primary" onClick={() => navigate?.("/pricing")}>Contact Enterprise Sales <ArrowRight size={16} /></Btn>
      </Card>
    </motion.div>
  );
}
