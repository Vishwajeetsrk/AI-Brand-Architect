"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Hash, Plus, Send, Paperclip, Calendar, ChevronDown, ChevronRight,
  Users, MessageSquare, Clock, UserCircle, Smile,
} from "lucide-react";
import { Btn, Card, Badge, Avatar, Input } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

type View = "chat" | "calendar";

const TEAMS = [
  { id: "team-1", name: "Design Team", memberCount: 8, channels: [
    { id: "ch-1", name: "general", unread: 3 }, { id: "ch-2", name: "design-reviews", unread: 0 }, { id: "ch-3", name: "brand-assets", unread: 1 },
  ]},
  { id: "team-2", name: "Engineering", memberCount: 12, channels: [
    { id: "ch-4", name: "general", unread: 5 }, { id: "ch-5", name: "sprint-planning", unread: 2 }, { id: "ch-6", name: "random", unread: 0 },
  ]},
  { id: "team-3", name: "Marketing", memberCount: 6, channels: [
    { id: "ch-7", name: "general", unread: 1 }, { id: "ch-8", name: "campaigns", unread: 0 },
  ]},
];

const USERS = [
  { id: "user-1", name: "Alice Chen", presence: "online" as const },
  { id: "user-2", name: "Bob Martinez", presence: "away" as const },
  { id: "user-3", name: "Catherine Lee", presence: "online" as const },
  { id: "user-4", name: "David Kim", presence: "busy" as const },
  { id: "user-5", name: "Emma Wilson", presence: "online" as const },
];

const SAMPLE_MESSAGES = [
  { id: "m1", user: USERS[0], content: "Hey team, just pushed the new mockups to the review board!", time: "9:42 AM", reactions: [{ emoji: ":rocket:", count: 2 }] },
  { id: "m2", user: USERS[1], content: "Great work on the latest sprint everyone!", time: "9:45 AM", reactions: [{ emoji: ":heart:", count: 3 }, { emoji: ":clap:", count: 1 }] },
  { id: "m3", user: USERS[2], content: "Can we schedule a quick sync on the brand guidelines update?", time: "10:02 AM", reactions: [] },
  { id: "m4", user: USERS[3], content: "The new analytics dashboard is live on staging.", time: "10:15 AM", reactions: [{ emoji: ":eyes:", count: 4 }] },
  { id: "m5", user: USERS[4], content: "Updated the style guide with new color tokens.", time: "10:33 AM", reactions: [] },
  { id: "m6", user: USERS[0], content: "Let me know if anyone needs access to the design system repo.", time: "10:50 AM", reactions: [{ emoji: ":fire:", count: 1 }] },
];

const EVENTS = [
  { title: "Sprint Review", time: "Today 2:00 PM", organizer: "Alice Chen", attendees: 3, color: "violet" },
  { title: "Brand Workshop", time: "Tomorrow 10:00 AM", organizer: "Catherine Lee", attendees: 4, color: "cyan" },
  { title: "Design Critique", time: "Wed 11:00 AM", organizer: "Bob Martinez", attendees: 2, color: "emerald" },
  { title: "Marketing Sync", time: "Thu 1:30 PM", organizer: "Emma Wilson", attendees: 3, color: "amber" },
  { title: "All Hands", time: "Fri 3:00 PM", organizer: "Alice Chen", attendees: 5, color: "pink" },
];

const presenceColor = { online: "bg-emerald-500", away: "bg-amber-500", busy: "bg-red-500" };

export default function CollaborationPage() {
  const [view, setView] = useState<View>("chat");
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set(["team-1"]));
  const [activeChannel, setActiveChannel] = useState("ch-1");
  const [messageInput, setMessageInput] = useState("");

  const toggleTeam = (id: string) => {
    const next = new Set(expandedTeams);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedTeams(next);
  };

  return (
    <motion.div {...pageAnim} className="flex h-[calc(100vh-8rem)] gap-0">
      {/* Left Sidebar — Teams & Channels */}
      <div className="w-64 flex-shrink-0 bg-[#090b1f] border-r border-white/[0.06] flex flex-col overflow-hidden rounded-l-xl">
        <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-sm font-bold text-white flex items-center gap-2"><Users size={14} className="text-violet-400" /> Teams</span>
          <Btn variant="ghost" size="sm" icon={Plus} />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {TEAMS.map((team) => {
            const expanded = expandedTeams.has(team.id);
            const totalUnread = team.channels.reduce((s, c) => s + c.unread, 0);
            return (
              <div key={team.id}>
                <button onClick={() => toggleTeam(team.id)} className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-white transition-all text-xs">
                  <div className="flex items-center gap-1.5">
                    {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <span className="font-semibold">{team.name}</span>
                    <span className="text-[10px] text-slate-600">{team.memberCount}</span>
                  </div>
                  {totalUnread > 0 && <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{totalUnread}</span>}
                </button>
                {expanded && (
                  <div className="ml-3 space-y-0.5 mt-0.5">
                    {team.channels.map((ch) => (
                      <button key={ch.id} onClick={() => setActiveChannel(ch.id)} className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs transition-all ${activeChannel === ch.id ? "bg-violet-600/20 text-violet-300" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"}`}>
                        <div className="flex items-center gap-1.5">
                          <Hash size={11} />
                          <span>{ch.name}</span>
                        </div>
                        {ch.unread > 0 && <span className="bg-violet-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">{ch.unread}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* View toggle */}
        <div className="p-2 border-t border-white/[0.06] flex gap-1">
          <button onClick={() => setView("chat")} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all ${view === "chat" ? "bg-violet-600/20 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>
            <MessageSquare size={12} /> Chat
          </button>
          <button onClick={() => setView("calendar")} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all ${view === "calendar" ? "bg-violet-600/20 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>
            <Calendar size={12} /> Calendar
          </button>
        </div>
      </div>

      {/* Main Content */}
      {view === "chat" ? (
        <>
          {/* Middle — Chat */}
          <div className="flex-1 flex flex-col bg-[#0b0d20]">
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-violet-400" />
                <span className="text-sm font-bold text-white">general</span>
                <span className="text-[10px] text-slate-600">Team announcements</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {USERS.slice(0, 4).map((u) => <Avatar key={u.id} name={u.name} size="sm" />)}
                </div>
                <span className="text-xs text-slate-600">+{USERS.length} online</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {SAMPLE_MESSAGES.map((msg) => (
                <div key={msg.id} className="group flex gap-3">
                  <div className="relative flex-shrink-0">
                    <Avatar name={msg.user.name} size="md" />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0b0d20] ${presenceColor[msg.user.presence]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{msg.user.name}</span>
                      <span className="text-[10px] text-slate-600">{msg.time}</span>
                    </div>
                    <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">{msg.content}</p>
                    {msg.reactions.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        {msg.reactions.map((r) => (
                          <span key={r.emoji} className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-slate-400">
                            <Smile size={10} /> {r.count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 bg-[#111336] border border-white/[0.07] rounded-xl px-3 py-2">
                <Btn variant="ghost" size="sm" icon={Paperclip} />
                <input value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Message #general..." className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none" />
                <Btn variant="primary" size="sm" icon={Send} disabled={!messageInput.trim()} />
              </div>
            </div>
          </div>

          {/* Right — Channel Info / Users */}
          <div className="w-64 flex-shrink-0 bg-[#090b1f] border-l border-white/[0.06] rounded-r-xl p-4 hidden xl:block">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Team Members</h3>
            <div className="space-y-2">
              {USERS.map((u) => (
                <div key={u.id} className="flex items-center gap-2.5">
                  <div className="relative">
                    <Avatar name={u.name} size="sm" />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-[#090b1f] ${presenceColor[u.presence]}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{u.name}</p>
                    <p className="text-[10px] text-slate-600 capitalize">{u.presence}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Channel Info</h3>
              <p className="text-xs text-slate-500 leading-relaxed">General announcements, updates, and team-wide discussions. Be respectful and keep conversations on topic.</p>
            </div>
          </div>
        </>
      ) : (
        /* Calendar Tab */
        <div className="flex-1 bg-[#0b0d20] p-6 overflow-y-auto rounded-r-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Upcoming Events</h2>
            <Btn variant="primary" size="sm" icon={Plus}>New Event</Btn>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {EVENTS.map((evt) => {
              const colorMap: Record<string, string> = { violet: "from-violet-600 to-blue-600", cyan: "from-cyan-500 to-blue-500", emerald: "from-emerald-500 to-cyan-500", amber: "from-amber-500 to-orange-500", pink: "from-pink-500 to-violet-500" };
              return (
                <Card key={evt.title} className="p-4 group cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <Badge color={evt.color}>{evt.color === "amber" ? "Meeting" : evt.color === "cyan" ? "Workshop" : evt.color === "emerald" ? "Review" : evt.color === "pink" ? "All Hands" : "Sprint"}</Badge>
                    <span className="text-[10px] text-slate-600">{evt.time}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{evt.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-2"><UserCircle size={11} /> {evt.organizer}</p>
                  <div className="flex items-center gap-1.5">
                    <Users size={11} className="text-slate-600" />
                    <span className="text-[10px] text-slate-600">{evt.attendees} attendees</span>
                  </div>
                  <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${colorMap[evt.color]} opacity-60 group-hover:opacity-100 transition-opacity`} />
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
