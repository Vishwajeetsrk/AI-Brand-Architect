"use client";
import { motion } from "motion/react";
import { Users, Activity, Mail, UserPlus, Edit2, Trash2 } from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader, Avatar } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function TeamPage() {
  const members = [
    { name: "Alex Johnson", role: "Admin", email: "alex@studio.com", joined: "Jan 2024", status: "active", projects: 12 },
    { name: "Sarah Williams", role: "Editor", email: "sarah@studio.com", joined: "Feb 2024", status: "active", projects: 8 },
    { name: "Michael Brown", role: "Editor", email: "michael@studio.com", joined: "Mar 2024", status: "active", projects: 6 },
    { name: "Emily Davis", role: "Viewer", email: "emily@studio.com", joined: "Apr 2024", status: "inactive", projects: 2 },
    { name: "James Wilson", role: "Editor", email: "james@studio.com", joined: "May 2024", status: "active", projects: 9 },
    { name: "Lisa Anderson", role: "Viewer", email: "lisa@studio.com", joined: "Jun 2024", status: "active", projects: 4 },
  ];
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Team & Collaboration" subtitle="12 members"
        actions={<Btn variant="primary" icon={UserPlus}>Invite Member</Btn>}
      />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Members" value="12" icon={Users} color="violet" />
        <StatCard label="Active Now" value="8" icon={Activity} color="emerald" />
        <StatCard label="Pending Invites" value="3" icon={Mail} color="blue" />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Member", "Role", "Projects", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={m.name} />
                      <div><p className="text-sm font-semibold text-white">{m.name}</p><p className="text-xs text-slate-500">{m.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge color={m.role === "Admin" ? "violet" : m.role === "Editor" ? "blue" : "gray"}>{m.role}</Badge></td>
                  <td className="px-4 py-3 text-sm text-slate-400">{m.projects}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{m.joined}</td>
                  <td className="px-4 py-3"><Badge color={m.status === "active" ? "green" : "gray"}>{m.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors"><Edit2 size={13} /></button>
                      <button className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
