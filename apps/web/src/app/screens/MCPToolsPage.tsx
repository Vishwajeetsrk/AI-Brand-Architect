"use client";
import { motion } from "motion/react";
import { Terminal, Wifi, Plug, Activity } from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader } from "../components/shared";
import { BrandIcon } from "../components/ui/brand-icon";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const MCP_TOOLS = [
  { name: "Figma MCP", brand: "Figma", desc: "Import and sync design files", calls: "12.4K", connected: true },
  { name: "GitHub MCP", brand: "GitHub", desc: "Code repository integration", calls: "8.7K", connected: true },
  { name: "Stripe MCP", brand: "Stripe", desc: "Payment processing tools", calls: "5.2K", connected: true },
  { name: "OpenAI MCP", brand: "OpenAI", desc: "AI model access and queries", calls: "23.1K", connected: true },
  { name: "Slack MCP", brand: "Slack", desc: "Team messaging and alerts", calls: "3.8K", connected: false },
  { name: "Notion MCP", brand: "Notion", desc: "Documentation and wikis", calls: "4.1K", connected: true },
  { name: "HubSpot MCP", brand: "HubSpot", desc: "CRM and marketing data", calls: "1.2K", connected: false },
  { name: "Cloudinary MCP", brand: "Cloudinary", desc: "Media management API", calls: "6.5K", connected: true },
  { name: "Zapier MCP", brand: "Zapier", desc: "Cross-platform automation", calls: "2.3K", connected: false },
  { name: "Supabase MCP", brand: "Supabase", desc: "Database and auth tools", calls: "9.8K", connected: true },
  { name: "Vercel MCP", brand: "Vercel", desc: "Deployment and hosting", calls: "3.4K", connected: false },
  { name: "Anthropic MCP", brand: "Anthropic", desc: "Claude AI integration", calls: "1.8K", connected: false },
];

export default function MCPToolsPage() {
  const connected = MCP_TOOLS.filter((t) => t.connected).length;

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="MCP Tools" subtitle="Model Context Protocol tools for extending functionality" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Connected" value={String(connected)} icon={Wifi} color="emerald" />
        <StatCard label="Available" value={String(MCP_TOOLS.length)} icon={Plug} color="blue" />
        <StatCard label="Total API Calls" value="82.3K" delta="+12% this week" icon={Activity} color="violet" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {MCP_TOOLS.map((tool) => (
          <Card key={tool.name} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <BrandIcon name={tool.brand} size={36} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{tool.name}</h3>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${tool.connected ? "bg-emerald-400" : "bg-slate-600"}`} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{tool.desc}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={11} className="text-slate-500" />
                <span className="text-xs text-slate-500">{tool.calls} calls</span>
              </div>
              <Btn variant={tool.connected ? "secondary" : "primary"} size="sm">
                {tool.connected ? "Disconnect" : "Connect"}
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
