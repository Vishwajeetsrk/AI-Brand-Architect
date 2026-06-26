import { useState } from "react";
import { motion } from "motion/react";
import { Key, Activity, Shield, Eye, EyeOff, RefreshCw, X, Terminal, Copy, Check } from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const API_KEYS = [
  { name: "Production API Key", key: "nx_live_3f8a2b1c9d0e4f5a6b7c8d9e0f1a2b3c", usage: 78, limit: 10000, created: "Jan 15, 2025" },
  { name: "Staging API Key", key: "nx_test_7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d", usage: 45, limit: 5000, created: "Feb 20, 2025" },
  { name: "Development API Key", key: "nx_dev_4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b", usage: 12, limit: 1000, created: "Mar 10, 2025" },
];

export default function APIKeysPage() {
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (i: number, key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div {...pageAnim}>
      <PageHeader
        title="API Keys"
        subtitle="Manage your API keys and monitor usage"
        actions={<Btn variant="primary" icon={Key}>Generate New Key</Btn>}
      />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Requests" value="847,293" delta="+12.3% this month" icon={Activity} color="violet" />
        <StatCard label="Active Keys" value="3" icon={Key} color="blue" />
        <StatCard label="Rate Limit" value="10,000/hr" icon={Shield} color="cyan" />
      </div>
      <div className="space-y-3">
        {API_KEYS.map((item, i) => (
          <Card key={item.name} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-white text-sm">{item.name}</h3>
                <p className="text-xs text-slate-500">Created {item.created}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVisible((p) => ({ ...p, [i]: !p[i] }))}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
                >
                  {visible[i] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <Btn variant="ghost" size="sm" icon={RefreshCw}>Regenerate</Btn>
                <Btn variant="danger" size="sm" icon={X}>Revoke</Btn>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <code className="flex-1 px-3 py-2 rounded-lg bg-[#111336] border border-white/[0.06] text-xs font-mono text-slate-400 truncate">
                {visible[i] ? item.key : `${item.key.slice(0, 12)}••••••••••${item.key.slice(-4)}`}
              </code>
              <button
                onClick={() => handleCopy(i, item.key)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
              >
                {copied === i ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Usage</span>
                  <span className="text-slate-400">{item.usage.toLocaleString()} / {item.limit.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all" style={{ width: `${(item.usage / item.limit) * 100}%` }} />
                </div>
              </div>
              <Badge color={item.usage > 50 ? "yellow" : "green"}>{((item.usage / item.limit) * 100).toFixed(0)}%</Badge>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-5 mt-5">
        <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2"><Terminal size={14} className="text-violet-400" /> Usage Example</h3>
        <pre className="bg-[#0a0b1e] rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto">
          <code>{`# Install SDK
npm install nexora-sdk

# Initialize
import Nexora from 'nexora-sdk';
const client = new Nexora({ apiKey: 'nx_live_...' });

# Generate a brand
const brand = await client.brand.create({
  name: 'My Brand',
  style: 'modern',
});`}</code>
        </pre>
      </Card>
    </motion.div>
  );
}
