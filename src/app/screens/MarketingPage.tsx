import { useState } from "react";
import { motion } from "motion/react";
import {
  Plus, Megaphone, TrendingUp, Target, Mail, Share2, Monitor,
  MoreHorizontal, Play, Pause, Search, Filter, Download, BarChart3,
  Edit2, Trash2, UserPlus, Activity, Calendar,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Btn, Card, Badge, StatCard, PageHeader, Toggle } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const campaigns = [
  { name: "Summer Sale 2024", type: "Email", status: "Running", reach: "128.5K", conversion: "4.8%", budget: "$2,400", roi: "340%" },
  { name: "Brand Awareness Q3", type: "Social", status: "Running", reach: "342.1K", conversion: "2.1%", budget: "$5,800", roi: "210%" },
  { name: "Product Launch Video", type: "Display", status: "Draft", reach: "—", conversion: "—", budget: "$3,200", roi: "—" },
  { name: "Newsletter Re-engage", type: "Email", status: "Paused", reach: "45.2K", conversion: "1.2%", budget: "$600", roi: "95%" },
  { name: "Holiday Collection", type: "Social", status: "Draft", reach: "—", conversion: "—", budget: "$4,100", roi: "—" },
  { name: "Retargeting Campaign", type: "Display", status: "Running", reach: "89.7K", conversion: "6.3%", budget: "$1,900", roi: "520%" },
];

const chartData = [
  { month: "Week 1", impressions: 12000, clicks: 840, conversions: 42 },
  { month: "Week 2", impressions: 18500, clicks: 1260, conversions: 78 },
  { month: "Week 3", impressions: 22400, clicks: 1840, conversions: 112 },
  { month: "Week 4", impressions: 31800, clicks: 2420, conversions: 156 },
  { month: "Week 5", impressions: 27600, clicks: 2100, conversions: 134 },
  { month: "Week 6", impressions: 41200, clicks: 3680, conversions: 228 },
];

const activities = [
  { action: "Summer Sale campaign launched", user: "Alex", time: "12m ago", icon: Play, color: "emerald" },
  { action: "New email template created", user: "Sarah", time: "45m ago", icon: Mail, color: "violet" },
  { action: "A/B test completed — Variant B wins", user: "System", time: "2h ago", icon: BarChart3, color: "blue" },
  { action: "Budget alert: Brand Awareness at 78%", user: "System", time: "3h ago", icon: TrendingUp, color: "yellow" },
  { action: "Team member joined campaign", user: "Michael", time: "5h ago", icon: UserPlus, color: "cyan" },
  { action: "Weekly report generated", user: "System", time: "1d ago", icon: Download, color: "gray" },
];

const statusColors: Record<string, string> = { Running: "green", Paused: "yellow", Draft: "gray" };
const typeIcons: Record<string, React.ElementType> = { Email: Mail, Social: Share2, Display: Monitor };

export default function MarketingPage() {
  const [abTest, setAbTest] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = campaigns.filter((c) => {
    if (filter !== "all" && c.status.toLowerCase() !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div {...pageAnim}>
      <PageHeader
        title="Marketing Studio"
        subtitle="Multi-channel campaign management"
        actions={<Btn variant="primary" icon={Plus}>Create Campaign</Btn>}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Campaigns" value="12" delta="+3 this month" icon={Megaphone} color="violet" />
        <StatCard label="Total Reach" value="2.4M" delta="+18.2% vs last month" icon={TrendingUp} color="blue" />
        <StatCard label="Conversion Rate" value="4.8%" delta="+0.6% pts" icon={Target} color="cyan" />
        <StatCard label="Total Spend" value="$18,300" delta="+12.4%" icon={BarChart3} color="emerald" />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Campaign Performance (Last 6 Weeks)</h3>
            <div className="flex gap-2">
              <Btn variant="ghost" size="sm" icon={Calendar}>This Quarter</Btn>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="imp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="clk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="impressions" stroke="#8b5cf6" fill="url(#imp)" strokeWidth={2} />
              <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fill="url(#clk)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            {[{ c: "#8b5cf6", l: "Impressions" }, { c: "#3b82f6", l: "Clicks" }, { c: "#22d3ee", l: "Conversions" }].map((i) => (
              <div key={i.l} className="flex items-center gap-1.5"><div className="w-3 h-1 rounded" style={{ background: i.c }} /><span className="text-xs text-slate-500">{i.l}</span></div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">A/B Testing</h3>
            <Toggle checked={abTest} onChange={() => setAbTest(!abTest)} />
          </div>
          {abTest ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#111336] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <Badge color="violet">Variant A</Badge>
                  <span className="text-xs text-slate-500">CTR: 3.2%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full"><div className="h-1.5 bg-violet-500 rounded-full w-[38%]" /></div>
                <p className="text-xs text-slate-500 mt-2">Conversions: 124</p>
              </div>
              <div className="p-3 rounded-xl bg-[#111336] border border-violet-500/30">
                <div className="flex items-center justify-between mb-2">
                  <Badge color="green">Variant B (Winner)</Badge>
                  <span className="text-xs text-emerald-400">CTR: 4.7%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full"><div className="h-1.5 bg-emerald-500 rounded-full w-[62%]" /></div>
                <p className="text-xs text-slate-500 mt-2">Conversions: 218</p>
              </div>
              <Btn variant="outline" size="sm" className="w-full justify-center">View Details</Btn>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">A/B testing is disabled</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Campaigns</h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 bg-[#111336] p-0.5 rounded-lg">
                  {["all", "running", "paused", "draft"].map((t) => (
                    <button key={t} onClick={() => setFilter(t)} className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-all ${filter === t ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>{t}</button>
                  ))}
                </div>
                <Btn variant="ghost" size="sm" icon={Search} onClick={() => {}} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Campaign", "Type", "Status", "Reach", "Conv.", "Budget", "ROI", ""].map((h) => (
                      <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const TypeIcon = typeIcons[c.type] || Mail;
                    return (
                      <tr key={c.name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-3 py-3 text-sm font-semibold text-white">{c.name}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <TypeIcon size={12} className="text-slate-500" />
                            <span className="text-xs text-slate-400">{c.type}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3"><Badge color={statusColors[c.status] || "gray"}>{c.status}</Badge></td>
                        <td className="px-3 py-3 text-xs text-slate-400">{c.reach}</td>
                        <td className="px-3 py-3 text-xs text-slate-400">{c.conversion}</td>
                        <td className="px-3 py-3 text-xs text-slate-400">{c.budget}</td>
                        <td className="px-3 py-3 text-xs text-emerald-400 font-semibold">{c.roi}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-500 hover:text-white"><Edit2 size={12} /></button>
                            <button className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-500 hover:text-white"><MoreHorizontal size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activities.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.action} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg bg-${a.color}-500/15 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={12} className={`text-${a.color}-400`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300">{a.action}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-600">{a.user}</span>
                        <span className="text-[10px] text-slate-700">·</span>
                        <span className="text-[10px] text-slate-600">{a.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-violet-600/15 to-blue-600/5 border-violet-500/20">
            <div className="flex items-start gap-3">
              <Megaphone size={18} className="text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">AI Campaign Optimizer</p>
                <p className="text-xs text-slate-500 mt-0.5 mb-3">Let AI optimize your campaign targeting and budget allocation.</p>
                <Btn variant="primary" size="sm" icon={Sparkles}>Optimize Now</Btn>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
