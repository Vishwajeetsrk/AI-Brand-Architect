import { motion } from "motion/react";
import { Activity, Filter, Download, User, LogIn, Edit3, Trash2, Settings, Share2, Upload, Globe } from "lucide-react";
import { Btn, Card, Badge, Avatar, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const LOGS = [
  { user: "Alex Johnson", action: "Created project", target: "Travelora Brand Kit", ip: "192.168.1.100", time: "2m ago", icon: LogIn, color: "violet" },
  { user: "Sarah Chen", action: "Edited brand guidelines", target: "Color Palette", ip: "192.168.1.101", time: "15m ago", icon: Edit3, color: "blue" },
  { user: "Alex Johnson", action: "Exported assets", target: "Social Media Pack", ip: "192.168.1.100", time: "1h ago", icon: Download, color: "cyan" },
  { user: "Mike Rivera", action: "Deleted template", target: "Old Newsletter", ip: "192.168.1.102", time: "2h ago", icon: Trash2, color: "red" },
  { user: "Sarah Chen", action: "Updated settings", target: "Workspace Preferences", ip: "192.168.1.101", time: "3h ago", icon: Settings, color: "yellow" },
  { user: "Emily Watson", action: "Shared project", target: "Marketing Campaign Q4", ip: "192.168.1.103", time: "5h ago", icon: Share2, color: "green" },
  { user: "Alex Johnson", action: "Uploaded assets", target: "Logo Variations", ip: "192.168.1.100", time: "1d ago", icon: Upload, color: "emerald" },
  { user: "Mike Rivera", action: "Published website", target: "Travelora Landing", ip: "192.168.1.102", time: "2d ago", icon: Globe, color: "orange" },
];

const actionColors: Record<string, string> = {
  violet: "bg-violet-500/15 text-violet-400",
  blue: "bg-blue-500/15 text-blue-400",
  cyan: "bg-cyan-500/15 text-cyan-400",
  red: "bg-red-500/15 text-red-400",
  yellow: "bg-amber-500/15 text-amber-400",
  green: "bg-emerald-500/15 text-emerald-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  orange: "bg-orange-500/15 text-orange-400",
};

export default function ActivityPage() {
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Activity & Audit Logs" subtitle="Track all activities across your workspace"
        actions={<><Btn variant="secondary" size="sm" icon={Filter}>Filter</Btn><Btn variant="primary" size="sm" icon={Download}>Export Logs</Btn></>}
      />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-white/[0.06]">
                <th className="text-left py-3 px-4 font-semibold">User</th>
                <th className="text-left py-3 px-4 font-semibold">Action</th>
                <th className="text-left py-3 px-4 font-semibold">Target</th>
                <th className="text-left py-3 px-4 font-semibold">IP Address</th>
                <th className="text-right py-3 px-4 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {LOGS.map((log, i) => {
                const Icon = log.icon;
                return (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={log.user} size="sm" />
                        <span className="text-sm text-white font-semibold">{log.user}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${actionColors[log.color]}`}>
                          <Icon size={11} />
                        </div>
                        <span className="text-sm text-slate-400">{log.action}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-400">{log.target}</td>
                    <td className="py-3 px-4"><code className="text-xs font-mono text-slate-600">{log.ip}</code></td>
                    <td className="py-3 px-4 text-right text-xs text-slate-500">{log.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
