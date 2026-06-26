"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Plug, Wifi, Database, Search } from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader, Input } from "../components/shared";
import { BrandIcon } from "../components/ui/brand-icon";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const INTEGRATIONS = [
  { name: "Figma", desc: "Import designs directly from Figma", category: "Design", status: "Connected" as const, brand: "Figma" },
  { name: "Salesforce", desc: "Sync brand assets with Salesforce", category: "CRM", status: "Available" as const, brand: "Stripe" },
  { name: "Cloudinary", desc: "Cloud image and video management", category: "Media", status: "Connected" as const, brand: "Cloudinary" },
  { name: "OpenAI", desc: "AI-powered content generation", category: "AI", status: "Connected" as const, brand: "OpenAI" },
  { name: "Slack", desc: "Notifications and collaboration", category: "Communication", status: "Available" as const, brand: "Slack" },
  { name: "GitHub", desc: "Version control for your projects", category: "Development", status: "Connected" as const, brand: "GitHub" },
  { name: "Zapier", desc: "Connect with 5000+ apps", category: "Automation", status: "Available" as const, brand: "Zapier" },
  { name: "Mailchimp", desc: "Email marketing campaigns", category: "Marketing", status: "Available" as const, brand: "HubSpot" },
  { name: "HubSpot", desc: "CRM and marketing platform", category: "CRM", status: "Connected" as const, brand: "HubSpot" },
  { name: "Stripe", desc: "Payment processing and billing", category: "Finance", status: "Available" as const, brand: "Stripe" },
  { name: "Notion", desc: "Documentation and knowledge base", category: "Productivity", status: "Available" as const, brand: "Notion" },
  { name: "Webflow", desc: "Visual web development platform", category: "Design", status: "Available" as const, brand: "Vercel" },
];

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");

  const filtered = INTEGRATIONS.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.desc.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Integrations" subtitle="Connect your favorite tools and services" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Connected" value="5" icon={Wifi} color="emerald" />
        <StatCard label="Available" value="7" icon={Plug} color="blue" />
        <StatCard label="Data Synced" value="12.4K" delta="+2.1K this week" icon={Database} color="violet" />
      </div>
      <div className="mb-4">
        <Input icon={Search} placeholder="Search integrations..." value={search} onChange={setSearch} className="w-80" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((intg) => (
          <Card key={intg.name} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <BrandIcon name={intg.brand} size={36} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm">{intg.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{intg.desc}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge color="gray">{intg.category}</Badge>
                <Badge color={intg.status === "Connected" ? "green" : "gray"}>{intg.status}</Badge>
              </div>
              <Btn variant={intg.status === "Connected" ? "secondary" : "primary"} size="sm">
                {intg.status === "Connected" ? "Manage" : "Connect"}
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
