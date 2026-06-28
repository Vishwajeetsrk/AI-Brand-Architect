"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Users, Activity, Mail, UserPlus, Edit2, Trash2, Search, Shield, Clock, BarChart3, Filter, ChevronDown, Settings } from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader, Avatar } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const ROLES = ["All Roles", "Admin", "Editor", "Viewer"];

const MEMBERS = [
  { name: "Alex Johnson", role: "Admin" as const, email: "alex@studio.com", joined: "Jan 2024", status: "active" as const, projects: 12, lastActive: "2m ago" },
  { name: "Sarah Williams", role: "Editor" as const, email: "sarah@studio.com", joined: "Feb 2024", status: "active" as const, projects: 8, lastActive: "15m ago" },
  { name: "Michael Brown", role: "Editor" as const, email: "michael@studio.com", joined: "Mar 2024", status: "active" as const, projects: 6, lastActive: "1h ago" },
  { name: "Emily Davis", role: "Viewer" as const, email: "emily@studio.com", joined: "Apr 2024", status: "inactive" as const, projects: 2, lastActive: "2d ago" },
  { name: "James Wilson", role: "Editor" as const, email: "james@studio.com", joined: "May 2024", status: "active" as const, projects: 9, lastActive: "1h ago" },
  { name: "Lisa Anderson", role: "Viewer" as const, email: "lisa@studio.com", joined: "Jun 2024", status: "active" as const, projects: 4, lastActive: "3h ago" },
  { name: "David Chen", role: "Admin" as const, email: "david@studio.com", joined: "Jul 2024", status: "active" as const, projects: 15, lastActive: "30m ago" },
  { name: "Rachel Green", role: "Editor" as const, email: "rachel@studio.com", joined: "Aug 2024", status: "inactive" as const, projects: 5, lastActive: "5d ago" },
];

const ROLE_COLORS: Record<string, "violet" | "blue" | "gray"> = { Admin: "violet", Editor: "blue", Viewer: "gray" };
const ROLE_ICONS: Record<string, typeof Shield> = { Admin: Shield, Editor: Edit2, Viewer: Search };

const TEAM_ACTIVITY = [
  { user: "Alex Johnson", action: "Created project 'Q4 Campaign'", time: "1h ago" },
  { user: "Sarah Williams", action: "Updated brand guidelines", time: "3h ago" },
  { user: "James Wilson", action: "Generated 24 logo variations", time: "5h ago" },
  { user: "Lisa Anderson", action: "Reviewed presentation deck", time: "1d ago" },
];

export default function TeamPage() {
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");

  const filtered = MEMBERS.filter(m => (roleFilter === "All Roles" || m.role === roleFilter) && m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Team & Collaboration" subtitle={`${MEMBERS.length} members · ${MEMBERS.filter(m => m.status === "active").length} active`}
        actions={<Btn variant="primary" icon={UserPlus}>Invite Member</Btn>}
      />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Members" value={MEMBERS.length.toString()} icon={Users} color="violet" />
        <StatCard label="Active Now" value={MEMBERS.filter(m => m.status === "active").length.toString()} icon={Activity} color="emerald" />
        <StatCard label="Total Projects" value={MEMBERS.reduce((s, m) => s + m.projects, 0).toString()} icon={BarChart3} color="blue" />
        <StatCard label="Pending Invites" value="3" icon={Mail} color="amber" />
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
            className="w-full bg-[#0c1022] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none" />
        </div>
        <div className="flex gap-1">
          {ROLES.map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                roleFilter === r ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "bg-[#0c1022] text-slate-500 hover:text-slate-300 border border-white/[0.05]"
              }`}
            >{r}</button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "table" ? "bg-violet-600/20 text-violet-400" : "text-slate-500"}`}>Table</button>
          <button onClick={() => setView("cards")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "cards" ? "bg-violet-600/20 text-violet-400" : "text-slate-500"}`}>Cards</button>
        </div>
      </div>

      {view === "table" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Member", "Role", "Projects", "Joined", "Last Active", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => {
                  const RoleIcon = ROLE_ICONS[m.role];
                  return (
                    <tr key={m.name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={m.name} />
                          <div><p className="text-sm font-semibold text-white">{m.name}</p><p className="text-xs text-slate-500">{m.email}</p></div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={ROLE_COLORS[m.role]}><RoleIcon size={10} className="mr-1" />{m.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">{m.projects}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{m.joined}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock size={10} />{m.lastActive}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={m.status === "active" ? "green" : "gray"}>
                          <span className={`w-1.5 h-1.5 rounded-full ${m.status === "active" ? "bg-emerald-400" : "bg-slate-500"} mr-1`} />{m.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors"><Edit2 size={13} /></button>
                          <button className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {filtered.map((m, i) => {
            const RoleIcon = ROLE_ICONS[m.role];
            return (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="p-5 text-center">
                  <div className="flex justify-center mb-3"><Avatar name={m.name} size="lg" /></div>
                  <h3 className="font-bold text-white text-sm">{m.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{m.email}</p>
                  <Badge color={ROLE_COLORS[m.role]} className="mb-3"><RoleIcon size={10} className="mr-1" />{m.role}</Badge>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-white/[0.03]"><p className="text-[10px] text-slate-600">Projects</p><p className="text-sm font-bold text-white">{m.projects}</p></div>
                    <div className="p-2 rounded-lg bg-white/[0.03]"><p className="text-[10px] text-slate-600">Status</p><p className={`text-sm font-bold ${m.status === "active" ? "text-emerald-400" : "text-slate-500"}`}>{m.status}</p></div>
                  </div>
                  <div className="flex gap-2">
                    <Btn variant="outline" size="sm" className="flex-1 justify-center" icon={Mail}>Message</Btn>
                    <Btn variant="outline" size="sm" icon={Settings} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Card className="p-5 mt-4">
        <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><Activity size={14} className="text-violet-400" /> Team Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          {TEAM_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <Avatar name={a.user} size="sm" />
              <div className="flex-1">
                <span className="font-semibold text-white text-xs">{a.user}</span>
                <span className="text-slate-400 text-xs"> {a.action}</span>
              </div>
              <span className="text-[10px] text-slate-600">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
