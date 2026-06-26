import { useState } from "react";
import { motion } from "motion/react";
import {
  Share2, Instagram, Twitter, Linkedin, Facebook, Heart, MessageCircle,
  BarChart3, Users, Calendar, Plus, Image, Send, Clock, MoreHorizontal,
  TrendingUp, Bookmark, Globe, Play, Grid, Edit2, ChevronRight, Smile, Hash, X,
} from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader, Avatar } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const accounts = [
  { name: "Instagram", handle: "@nexora_design", followers: "24.5K", icon: Instagram, color: "from-pink-500 to-orange-500", connected: true },
  { name: "Twitter / X", handle: "@nexora_design", followers: "12.8K", icon: Twitter, color: "from-blue-400 to-blue-600", connected: true },
  { name: "LinkedIn", handle: "Nexora Design", followers: "8.3K", icon: Linkedin, color: "from-blue-600 to-blue-800", connected: true },
  { name: "Facebook", handle: "Nexora Design", followers: "6.1K", icon: Facebook, color: "from-blue-500 to-blue-700", connected: false },
];

const scheduledPosts = [
  { day: "Mon", date: "12", posts: [{ time: "9:00 AM", content: "New product teaser — swipe to see more!", media: "image", likes: 0, comments: 0 }] },
  { day: "Tue", date: "13", posts: [{ time: "10:30 AM", content: "Behind the scenes of our latest photoshoot", media: "carousel", likes: 0, comments: 0 }] },
  { day: "Wed", date: "14", posts: [
    { time: "8:00 AM", content: "Customer spotlight: How Brand X transformed their identity", media: "video", likes: 0, comments: 0 },
    { time: "3:00 PM", content: "Tips for creating a consistent brand voice", media: "image", likes: 0, comments: 0 },
  ]},
  { day: "Thu", date: "15", posts: [{ time: "11:00 AM", content: "Throwback: Our first ever logo design", media: "image", likes: 0, comments: 0 }] },
  { day: "Fri", date: "16", posts: [{ time: "9:30 AM", content: "Weekly design inspiration thread", media: "carousel", likes: 0, comments: 0 }] },
  { day: "Sat", date: "17", posts: [] },
  { day: "Sun", date: "18", posts: [] },
];

const recentPosts = [
  { content: "Our latest brand identity project for Travelora is live! ✈️", platform: "Instagram", engagement: "1,234 likes · 89 comments", time: "3h ago", image: true },
  { content: "5 tips for building a cohesive brand identity in 2024 🧵", platform: "Twitter / X", engagement: "456 likes · 34 retweets", time: "6h ago", image: false },
  { content: "We're thrilled to announce our new partnership with DesignCo", platform: "LinkedIn", engagement: "892 likes · 45 comments", time: "1d ago", image: true },
];

export default function SocialMediaPage() {
  const [composerOpen, setComposerOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <motion.div {...pageAnim}>
      <PageHeader
        title="Social Media Studio"
        subtitle="Schedule, publish, and analyze your social content"
        actions={<Btn variant="primary" icon={Plus} onClick={() => setComposerOpen(true)}>Schedule Post</Btn>}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Followers" value="51.7K" delta="+2.4K this month" icon={Users} color="violet" />
        <StatCard label="Engagement Rate" value="4.8%" delta="+0.6% pts" icon={Heart} color="pink" />
        <StatCard label="Posts This Week" value="18" delta="+4 vs last week" icon={BarChart3} color="blue" />
        <StatCard label="Impressions" value="142.5K" delta="+22.3%" icon={TrendingUp} color="cyan" />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Content Calendar</h3>
              <div className="flex items-center gap-2">
                <Btn variant="ghost" size="sm" icon={Calendar}>This Week</Btn>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {scheduledPosts.map((d, i) => (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(selectedDay === i ? null : i)}
                  className={`p-3 rounded-xl border transition-all text-left ${selectedDay === i ? "border-violet-500/50 bg-violet-500/10" : "border-white/[0.06] hover:border-violet-500/30"} ${d.posts.length > 0 ? "bg-white/[0.02]" : ""}`}
                >
                  <p className="text-xs text-slate-500 font-medium">{d.day}</p>
                  <p className="text-lg font-bold text-white mb-2">{d.date}</p>
                  {d.posts.length > 0 ? (
                    <div className="space-y-1">
                      {d.posts.map((p, j) => (
                        <div key={j} className="flex items-center gap-1 text-[10px] text-slate-400">
                          {p.media === "image" ? <Image size={8} /> : p.media === "video" ? <Play size={8} /> : <Grid size={8} />}
                          <span className="truncate">{p.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-600">No posts</p>
                  )}
                </button>
              ))}
            </div>
            {selectedDay !== null && scheduledPosts[selectedDay].posts.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-[#111336] border border-white/[0.06]">
                <p className="text-xs font-semibold text-white mb-2">{scheduledPosts[selectedDay].day} — Posts</p>
                {scheduledPosts[selectedDay].posts.map((p, j) => (
                  <div key={j} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.03]">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                      {p.media === "image" ? <Image size={12} className="text-violet-400" /> : p.media === "video" ? <Play size={12} className="text-violet-400" /> : <Grid size={12} className="text-violet-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300">{p.content}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{p.time}</p>
                    </div>
                    <Btn variant="ghost" size="sm" icon={Edit2} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-4">Connected Accounts</h3>
            <div className="space-y-2">
              {accounts.map((a, i) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.name}
                    onClick={() => setSelectedAccount(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedAccount === i ? "border-violet-500/40 bg-violet-500/10" : "border-white/[0.06] hover:border-white/20"} ${!a.connected ? "opacity-50" : ""}`}
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={15} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-semibold text-white">{a.name}</p>
                      <p className="text-[10px] text-slate-500">{a.connected ? a.handle : "Disconnected"}</p>
                    </div>
                    {a.connected && <Badge color="green">Live</Badge>}
                  </button>
                );
              })}
            </div>
            <Btn variant="outline" size="sm" className="w-full justify-center mt-3" icon={Plus}>Connect Account</Btn>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-3">Quick Analytics</h3>
            <div className="space-y-3">
              {[
                { label: "Instagram", value: "24.5K", delta: "+5.2%", color: "from-pink-500 to-orange-500" },
                { label: "Twitter / X", value: "12.8K", delta: "+3.1%", color: "from-blue-400 to-blue-600" },
                { label: "LinkedIn", value: "8.3K", delta: "+8.7%", color: "from-blue-600 to-blue-800" },
                { label: "Facebook", value: "6.1K", delta: "+1.2%", color: "from-blue-500 to-blue-700" },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${p.color}`} />
                  <span className="text-xs text-slate-400 flex-1">{p.label}</span>
                  <span className="text-xs font-semibold text-white">{p.value}</span>
                  <span className="text-[10px] text-emerald-400">{p.delta}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm">Recent Posts</h3>
          <Btn variant="ghost" size="sm">View All <ChevronRight size={12} /></Btn>
        </div>
        <div className="space-y-3">
          {recentPosts.map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer border border-white/[0.04]">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.image ? "bg-gradient-to-br from-violet-600/20 to-blue-600/10" : "bg-[#111336]"}`}>
                {p.image ? <Image size={16} className="text-violet-400" /> : <MessageCircle size={16} className="text-slate-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300">{p.content}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge color="gray">{p.platform}</Badge>
                  <span className="text-[10px] text-slate-600">{p.engagement}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-600">{p.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {composerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setComposerOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">Schedule Post</h3>
                <button onClick={() => setComposerOpen(false)} className="text-slate-500 hover:text-white p-1"><X size={16} /></button>
              </div>
              <div className="mb-3">
                <label className="text-xs text-slate-500 mb-1.5 block">Platform</label>
                <div className="flex gap-2">
                  {accounts.filter((a) => a.connected).map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <button key={a.name} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${selectedAccount === i ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "border-white/[0.07] text-slate-400"}`}>
                        <Icon size={14} /> {a.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs text-slate-500 mb-1.5 block">Content</label>
                <textarea
                  value={postText} onChange={(e) => setPostText(e.target.value)}
                  className="w-full bg-[#111336] border border-white/[0.07] rounded-xl p-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 resize-none h-24"
                  placeholder="What would you like to share?"
                />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Btn variant="secondary" size="sm" icon={Image}>Media</Btn>
                <Btn variant="secondary" size="sm" icon={Smile}>Emoji</Btn>
                <Btn variant="secondary" size="sm" icon={Hash}>Hashtags</Btn>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={12} /> Schedule for later
                </div>
                <div className="flex gap-2">
                  <Btn variant="secondary" onClick={() => setComposerOpen(false)}>Cancel</Btn>
                  <Btn variant="primary" icon={Send} disabled={!postText.trim()}>Schedule</Btn>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
