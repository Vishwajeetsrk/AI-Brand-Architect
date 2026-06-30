"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Users, MessageCircle, Hash, Plus, Smile, Paperclip, Search } from "lucide-react";
import { Btn, Card, Badge, PageHeader, Input } from "../components/shared";

const pageAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }, exit: { opacity: 0, y: -8, transition: { duration: 0.15 } } };

const CHANNELS = [
  { id: "general", name: "General", unread: 3 },
  { id: "announcements", name: "Announcements", unread: 0 },
  { id: "ai-discussion", name: "AI Discussion", unread: 5 },
  { id: "show-and-tell", name: "Show & Tell", unread: 1 },
  { id: "help", name: "Help & Support", unread: 2 },
  { id: "random", name: "Random", unread: 0 },
];

const MOCK_USERS = [
  { name: "Alice Chen", role: "Admin", online: true, avatar: "AC" },
  { name: "Bob Smith", role: "Member", online: true, avatar: "BS" },
  { name: "Carol Davis", role: "Member", online: false, avatar: "CD" },
  { name: "David Wilson", role: "Moderator", online: true, avatar: "DW" },
  { name: "Eve Johnson", role: "Member", online: false, avatar: "EJ" },
];

const INITIAL_MESSAGES: Record<string, { user: string; content: string; time: string }[]> = {
  general: [
    { user: "Alice Chen", content: "Hey everyone! Welcome to the new community chat! 🎉", time: "10:30 AM" },
    { user: "Bob Smith", content: "This is awesome! Love the real-time features.", time: "10:32 AM" },
    { user: "Carol Davis", content: "Has anyone tried the new AI Agent features?", time: "10:35 AM" },
    { user: "David Wilson", content: "Yes! The multi-agent orchestration is incredible.", time: "10:38 AM" },
  ],
  announcements: [
    { user: "Admin", content: "NEXORA v2.0 is now live! Check out the changelog for details.", time: "9:00 AM" },
    { user: "Admin", content: "New AI Agent capabilities added - try the coordination engine.", time: "Yesterday" },
  ],
  "ai-discussion": [
    { user: "Eve Johnson", content: "What's everyone building with the Agents SDK?", time: "11:00 AM" },
    { user: "Alice Chen", content: "Working on a brand strategy multi-agent system!", time: "11:05 AM" },
  ],
  "show-and-tell": [
    { user: "Carol Davis", content: "Just finished my portfolio site built with NEXORA components!", time: "Yesterday" },
  ],
  help: [
    { user: "Bob Smith", content: "Anyone know how to set up custom MCP tools?", time: "2:00 PM" },
  ],
  random: [
    { user: "David Wilson", content: "Check out this cool AI art I generated 🎨", time: "1:00 PM" },
  ],
};

export default function CommunityChatPage() {
  const [channel, setChannel] = useState("general");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages[channel]]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { user: "You", content: input.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => ({ ...prev, [channel]: [...(prev[channel] || []), newMsg] }));
    setInput("");
  };

  const filteredChannels = CHANNELS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div {...pageAnim} className="h-[calc(100vh-100px)]">
      <div className="flex h-full gap-4">
        <div className="w-60 shrink-0 flex flex-col gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search channels..." className="w-full bg-[#0c1022] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50" />
          </div>
          <Card className="p-2 flex-1 overflow-y-auto">
            <p className="text-xs text-gray-500 px-2 mb-2 font-medium uppercase tracking-wider">Channels</p>
            {filteredChannels.map(c => (
              <button key={c.id} onClick={() => setChannel(c.id)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-all ${channel === c.id ? "bg-violet-600/20 text-violet-300" : "text-gray-400 hover:text-white hover:bg-white/[0.04]"}`}
              >
                <span className="flex items-center gap-2"><Hash size={14} />{c.name}</span>
                {c.unread > 0 && <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{c.unread}</span>}
              </button>
            ))}
            <p className="text-xs text-gray-500 px-2 mt-4 mb-2 font-medium uppercase tracking-wider">Online — {MOCK_USERS.filter(u => u.online).length}</p>
            {MOCK_USERS.map(u => (
              <div key={u.name} className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-violet-600/20 flex items-center justify-center text-[10px] text-violet-400 font-bold">{u.avatar}</div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-background ${u.online ? "bg-emerald-500" : "bg-gray-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{u.name}</p>
                  <p className="text-[10px] text-gray-500">{u.role}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
        <Card className="flex-1 p-0 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/5 flex items-center justify-between bg-[#0c1022]">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-violet-400" />
              <span className="font-semibold text-white text-sm">#{channel}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users size={14} />{MOCK_USERS.filter(u => u.online).length} online
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(messages[channel] || []).map((m, i) => (
              <div key={i} className="flex gap-3 group">
                <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-xs text-violet-400 font-bold shrink-0">{m.user.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{m.user}</span>
                    <span className="text-[10px] text-gray-600">{m.time}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-0.5">{m.content}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-white/5">
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-300"><Paperclip size={16} /></button>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder={`Message #${channel}`} className="flex-1 bg-[#0c1022] border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50" />
              <button className="p-2 text-gray-500 hover:text-gray-300"><Smile size={16} /></button>
              <Btn variant="primary" size="sm" icon={Send} onClick={handleSend} disabled={!input.trim()} />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
