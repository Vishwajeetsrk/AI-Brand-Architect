"use client";
import { motion } from "motion/react";
import { Calendar, Download, TrendingUp, Target, Award, PieChart } from "lucide-react";
import {
  LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell,
} from "recharts";
import { Btn, Card, StatCard, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function AnalyticsPage() {
  const lineData = [
    { name: "Jan", views: 4200, clicks: 1800, conv: 340 },
    { name: "Feb", views: 5800, clicks: 2400, conv: 480 },
    { name: "Mar", views: 7200, clicks: 3100, conv: 620 },
    { name: "Apr", views: 6400, clicks: 2800, conv: 560 },
    { name: "May", views: 9100, clicks: 4200, conv: 840 },
    { name: "Jun", views: 11400, clicks: 5600, conv: 1120 },
    { name: "Jul", views: 13800, clicks: 6800, conv: 1380 },
    { name: "Aug", views: 16200, clicks: 8100, conv: 1620 },
  ];
  const pieData = [
    { name: "Brand Studio", value: 38, color: "#8b5cf6" },
    { name: "Logo Maker", value: 24, color: "#3b82f6" },
    { name: "Website Builder", value: 18, color: "#22d3ee" },
    { name: "Marketing Studio", value: 12, color: "#10b981" },
    { name: "Other", value: 8, color: "#475569" },
  ];
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Analytics" subtitle="Performance overview &middot; Last 30 days"
        actions={<><Btn variant="secondary" size="sm" icon={Calendar}>Date Range</Btn><Btn variant="secondary" size="sm" icon={Download}>Export</Btn></>}
      />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Views" value="138,560" delta="+24.5% vs last month" icon={TrendingUp} color="violet" />
        <StatCard label="Clicks" value="6,450" delta="+18.2%" icon={Target} color="blue" />
        <StatCard label="Conversions" value="3,240" delta="+31.6%" icon={Award} color="cyan" />
        <StatCard label="Conversion Rate" value="24.5%" delta="+6.8% pts" icon={PieChart} color="emerald" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <Card className="col-span-2 p-5">
          <h3 className="font-bold text-white text-sm mb-4">Traffic Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsLine data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111336", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="conv" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </RechartsLine>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            {[{ c: "#8b5cf6", l: "Views" }, { c: "#3b82f6", l: "Clicks" }, { c: "#22d3ee", l: "Conversions" }].map((i) => (
              <div key={i.l} className="flex items-center gap-1.5"><div className="w-3 h-1 rounded" style={{ background: i.c }} /><span className="text-xs text-slate-500">{i.l}</span></div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-white text-sm mb-4">Tool Usage</h3>
          <ResponsiveContainer width="100%" height={160}>
            <RechartsPie>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </RechartsPie>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-slate-400">{d.name}</span>
                </div>
                <span className="text-xs font-semibold text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
