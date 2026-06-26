import { motion } from "motion/react";
import { Bell, CheckCheck, Sparkles, UserPlus, Download, Globe, AlertCircle, MessageCircle, CreditCard, FileText } from "lucide-react";
import { Btn, Card, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const NOTIFICATIONS = [
  { icon: Sparkles, color: "violet", title: "Logo generation completed", desc: "Your 'Travelora' logo has been generated successfully.", time: "2m ago", read: false },
  { icon: UserPlus, color: "blue", title: "Team member joined", desc: "Sarah Chen accepted your team invitation.", time: "15m ago", read: false },
  { icon: Download, color: "cyan", title: "Export ready", desc: "Your brand kit export is ready for download.", time: "1h ago", read: false },
  { icon: Globe, color: "emerald", title: "Website published", desc: "Your website 'Travelora Landing' is now live.", time: "3h ago", read: false },
  { icon: AlertCircle, color: "yellow", title: "Storage limit warning", desc: "You've used 85% of your storage quota.", time: "5h ago", read: true },
  { icon: MessageCircle, color: "pink", title: "New feedback received", desc: "A client left feedback on your brand project.", time: "1d ago", read: true },
  { icon: CreditCard, color: "orange", title: "Invoice generated", desc: "Your May 2025 invoice is ready for review.", time: "2d ago", read: true },
  { icon: FileText, color: "gray", title: "Monthly report available", desc: "Your analytics report for May is now available.", time: "3d ago", read: true },
];

export default function NotificationsPage() {
  return (
    <motion.div {...pageAnim}>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with your workspace activity"
        actions={<Btn variant="primary" icon={CheckCheck}>Mark All as Read</Btn>}
      />
      <div className="space-y-2">
        {NOTIFICATIONS.map((n, i) => {
          const Icon = n.icon;
          const colorMap: Record<string, string> = {
            violet: "bg-violet-500/15 text-violet-400 border-violet-500/20",
            blue: "bg-blue-500/15 text-blue-400 border-blue-500/20",
            cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
            emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
            yellow: "bg-amber-500/15 text-amber-400 border-amber-500/20",
            pink: "bg-pink-500/15 text-pink-400 border-pink-500/20",
            orange: "bg-orange-500/15 text-orange-400 border-orange-500/20",
            gray: "bg-white/5 text-slate-400 border-white/10",
          };
          return (
            <Card key={i} className={`p-4 flex items-start gap-3 ${!n.read ? "border-violet-500/20 bg-violet-500/3" : ""}`}>
              <div className={`p-2 rounded-lg border ${colorMap[n.color]} flex-shrink-0`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${n.read ? "text-slate-400" : "text-white font-semibold"}`}>{n.title}</p>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                <p className="text-[10px] text-slate-600 mt-1">{n.time}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
