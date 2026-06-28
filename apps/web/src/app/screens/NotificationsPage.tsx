"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, CheckCheck, Sparkles, UserPlus, Download, Globe, AlertCircle, MessageCircle, CreditCard, FileText, Settings, Filter, Archive, Trash2, MoreHorizontal } from "lucide-react";
import { Btn, Card, PageHeader, Badge } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const ALL_NOTIFICATIONS = [
  { icon: Sparkles, color: "violet", title: "Logo generation completed", desc: "Your 'Travelora' logo has been generated successfully. View it in the Brand Studio.", time: "2m ago", read: false, category: "updates" },
  { icon: UserPlus, color: "blue", title: "Team member joined", desc: "Sarah Chen accepted your team invitation and is now active.", time: "15m ago", read: false, category: "team" },
  { icon: Download, color: "cyan", title: "Export ready for download", desc: "Your brand kit export is ready. It includes all logos, fonts, and brand guidelines.", time: "1h ago", read: false, category: "updates" },
  { icon: Globe, color: "emerald", title: "Website published live", desc: "Your website 'Travelora Landing' is now live at travelora.nexora.io.", time: "3h ago", read: false, category: "updates" },
  { icon: AlertCircle, color: "yellow", title: "Storage limit at 85%", desc: "You've used 85% of your storage quota. Upgrade to unlock more space.", time: "5h ago", read: true, category: "alerts" },
  { icon: MessageCircle, color: "pink", title: "New design feedback", desc: "A client left detailed feedback on your brand project 'Travelora'.", time: "1d ago", read: true, category: "team" },
  { icon: CreditCard, color: "orange", title: "Invoice generated", desc: "Your May 2025 invoice for $29.00 is ready for review.", time: "2d ago", read: true, category: "billing" },
  { icon: FileText, color: "gray", title: "Monthly report available", desc: "Your analytics report for May is ready with detailed insights.", time: "3d ago", read: true, category: "updates" },
  { icon: Bell, color: "violet", title: "New feature: AI Voiceover", desc: "You can now add AI voiceovers to your presentations and videos.", time: "4d ago", read: true, category: "updates" },
  { icon: UserPlus, color: "blue", title: "Team invite pending", desc: "Reminder: Mike has a pending team invitation that expires in 2 days.", time: "5d ago", read: true, category: "team" },
];

const CATEGORIES = [
  { id: "all", label: "All", count: 10 }, { id: "unread", label: "Unread", count: 4 },
  { id: "updates", label: "Updates", count: 5 }, { id: "team", label: "Team", count: 2 },
  { id: "alerts", label: "Alerts", count: 1 }, { id: "billing", label: "Billing", count: 1 },
];

const COLOR_MAP: Record<string, string> = {
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  yellow: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  pink: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  gray: "bg-white/5 text-slate-400 border-white/10",
};

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = tab === "all" ? notifications : tab === "unread" ? notifications.filter(n => !n.read) : notifications.filter(n => n.category === tab);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const toggleSelect = (idx: number) => setSelected(p => p.includes(idx) ? p.filter(i => i !== idx) : [...p, idx]);
  const removeSelected = () => setNotifications(prev => prev.filter((_, i) => !selected.includes(i)));

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Notifications" subtitle={`${unreadCount} unread notifications`}
        actions={
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <Btn variant="secondary" size="sm" icon={Trash2} onClick={removeSelected}>Remove ({selected.length})</Btn>
            )}
            <Btn variant="primary" size="sm" icon={CheckCheck} onClick={markAllRead}>Mark All Read</Btn>
            <Btn variant="secondary" size="sm" icon={Settings} />
          </div>
        }
      />
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setTab(c.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              tab === c.id ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "bg-[#0c1022] text-slate-600 hover:text-slate-300 border border-white/[0.05]"
            }`}
          >
            {c.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === c.id ? "bg-violet-500/30" : "bg-white/[0.04]"}`}>{c.count}</span>
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        <AnimatePresence>
          {filtered.map((n, i) => {
            const Icon = n.icon;
            const globalIdx = notifications.indexOf(n);
            const isSelected = selected.includes(globalIdx);
            return (
              <motion.div key={globalIdx} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Card className={`p-4 flex items-start gap-3 transition-all ${!n.read ? "border-violet-500/20 bg-violet-500/[0.03]" : ""} ${isSelected ? "ring-1 ring-violet-500/40" : ""}`}>
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(globalIdx)}
                    className="mt-1 w-4 h-4 rounded border-white/[0.1] bg-white/[0.04] accent-violet-500" />
                  <div className={`p-2 rounded-lg border ${COLOR_MAP[n.color]} flex-shrink-0`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${n.read ? "text-slate-400" : "text-white font-semibold"}`}>{n.title}</p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-slate-600">{n.time}</span>
                      <Badge color={n.category === "team" ? "blue" : n.category === "alerts" ? "yellow" : n.category === "billing" ? "green" : "gray"}>{n.category}</Badge>
                    </div>
                  </div>
                  <button className="p-1 rounded hover:bg-white/[0.06] text-slate-600 hover:text-slate-400 transition-all opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={14} />
                  </button>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
