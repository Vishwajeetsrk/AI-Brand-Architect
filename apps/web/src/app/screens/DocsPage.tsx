import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Terminal, Code2, Clock, Copy, Check, ChevronRight } from "lucide-react";
import { Btn, Card, Badge, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const SIDEBAR_ITEMS = [
  { id: "getting-started", label: "Getting Started", icon: BookOpen },
  { id: "installation", label: "Installation", icon: Terminal },
  { id: "api-reference", label: "API Reference", icon: Code2 },
  { id: "changelog", label: "Changelog", icon: Clock },
];

const ENDPOINTS = [
  { method: "POST" as const, path: "/v1/brand/generate", desc: "Generate a brand identity", auth: "Required" },
  { method: "GET" as const, path: "/v1/brand/{id}", desc: "Get brand details", auth: "Required" },
  { method: "PUT" as const, path: "/v1/brand/{id}", desc: "Update brand details", auth: "Required" },
  { method: "DELETE" as const, path: "/v1/brand/{id}", desc: "Delete a brand", auth: "Required" },
  { method: "POST" as const, path: "/v1/asset/generate", desc: "Generate an asset", auth: "Required" },
  { method: "GET" as const, path: "/v1/asset/{id}", desc: "Get asset details", auth: "Required" },
  { method: "GET" as const, path: "/v1/projects", desc: "List all projects", auth: "Required" },
  { method: "POST" as const, path: "/v1/projects", desc: "Create a project", auth: "Required" },
];

const CHANGELOG_ENTRIES = [
  { version: "v2.0.0", date: "June 1, 2025", badge: "Major" as const, items: ["Revamped AI engine with 3x faster generation", "New brand studio interface", "Real-time collaboration", "Advanced analytics dashboard"] },
  { version: "v1.9.0", date: "April 15, 2025", badge: "Update" as const, items: ["Added MCP tools support", "Improved export options", "New API endpoints for assets", "Performance optimizations"] },
  { version: "v1.8.0", date: "February 20, 2025", badge: "Update" as const, items: ["Knowledge hub integration", "CMS dashboard improvements", "Bug fixes and stability"] },
  { version: "v1.7.0", date: "January 5, 2025", badge: "Update" as const, items: ["Workflow builder beta", "New template categories", "Enhanced security features"] },
];

export default function DocsPage() {
  const [tab, setTab] = useState("getting-started");
  const [pkg, setPkg] = useState("npm");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodColors: Record<string, string> = {
    GET: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    POST: "bg-blue-500/15 text-blue-300 border-blue-500/20",
    PUT: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    DELETE: "bg-red-500/15 text-red-300 border-red-500/20",
  };

  return (
    <motion.div {...pageAnim} className="flex gap-5 h-full">
      <div className="w-48 flex-shrink-0 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all ${tab === item.id ? "bg-violet-600/20 text-violet-300 font-semibold" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 min-w-0">
        {tab === "getting-started" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Getting Started</h2>
            <p className="text-sm text-slate-400">Follow these steps to start building with Nexora.</p>
            {[
              { num: "01", title: "Create an Account", desc: "Sign up for a free Nexora account. No credit card required." },
              { num: "02", title: "Choose Your Workspace", desc: "Select your role and preferences during onboarding." },
              { num: "03", title: "Explore the Dashboard", desc: "Familiarize yourself with the main dashboard and tools." },
              { num: "04", title: "Create Your First Brand", desc: "Use the Brand Studio to generate your first brand identity." },
              { num: "05", title: "Export and Share", desc: "Export your assets and share them with your team." },
            ].map((step) => (
              <Card key={step.num} className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/20 to-blue-600/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-violet-400">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
        {tab === "installation" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Installation</h2>
            <p className="text-sm text-slate-400">Choose your preferred package manager to install the Nexora SDK.</p>
            <div className="flex gap-1 bg-[#111336] p-1 rounded-lg w-fit mb-4">
              {["npm", "yarn", "pnpm"].map((p) => (
                <button key={p} onClick={() => setPkg(p)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${pkg === p ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>{p}</button>
              ))}
            </div>
            <div className="relative">
              <pre className="bg-[#0a0b1e] rounded-xl p-4 text-sm font-mono text-slate-300 overflow-x-auto border border-white/[0.06]">
                <code>{pkg === "npm" ? "npm install nexora-sdk" : pkg === "yarn" ? "yarn add nexora-sdk" : "pnpm add nexora-sdk"}</code>
              </pre>
              <button onClick={() => handleCopy(pkg === "npm" ? "npm install nexora-sdk" : pkg === "yarn" ? "yarn add nexora-sdk" : "pnpm add nexora-sdk")} className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
            <Card className="p-4">
              <h3 className="font-bold text-white text-sm mb-2">Quick Start</h3>
              <pre className="bg-[#0a0b1e] rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                <code>{`import Nexora from 'nexora-sdk';

const client = new Nexora({
  apiKey: process.env.NEXORA_API_KEY,
});

const brand = await client.brand.create({
  name: 'My Brand',
  style: 'modern',
});`}</code>
              </pre>
            </Card>
          </div>
        )}
        {tab === "api-reference" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">API Reference</h2>
            <p className="text-sm text-slate-400">Complete API endpoint reference for the Nexora platform.</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-white/[0.06]">
                    <th className="text-left py-3 px-2 font-semibold">Method</th>
                    <th className="text-left py-3 px-2 font-semibold">Endpoint</th>
                    <th className="text-left py-3 px-2 font-semibold">Description</th>
                    <th className="text-left py-3 px-2 font-semibold">Auth</th>
                  </tr>
                </thead>
                <tbody>
                  {ENDPOINTS.map((ep) => (
                    <tr key={ep.path} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-2"><Badge color={ep.method === "GET" ? "green" : ep.method === "POST" ? "blue" : ep.method === "PUT" ? "yellow" : "red"}>{ep.method}</Badge></td>
                      <td className="py-3 px-2"><code className="text-xs font-mono text-cyan-300">{ep.path}</code></td>
                      <td className="py-3 px-2 text-sm text-slate-400">{ep.desc}</td>
                      <td className="py-3 px-2"><Badge color="gray">{ep.auth}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === "changelog" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Changelog</h2>
            <p className="text-sm text-slate-400">Track all updates and improvements to Nexora.</p>
            {CHANGELOG_ENTRIES.map((entry) => (
              <Card key={entry.version} className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-bold text-white">{entry.version}</h3>
                  <Badge color={entry.badge === "Major" ? "violet" : entry.badge === "Update" ? "blue" : "green"}>{entry.badge}</Badge>
                  <span className="text-xs text-slate-500">{entry.date}</span>
                </div>
                <ul className="space-y-2">
                  {entry.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
