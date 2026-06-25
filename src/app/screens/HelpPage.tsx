import { useState } from "react";
import { motion } from "motion/react";
import { Search, BookOpen, Bot, CreditCard, Users, Key, Shield, ArrowRight, FileText } from "lucide-react";
import { Btn, Card, Badge, Input, PageHeader } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const TOPICS = [
  { icon: BookOpen, color: "from-violet-600 to-blue-600", title: "Getting Started", desc: "Learn the basics of Nexora", articles: 12 },
  { icon: Bot, color: "from-cyan-600 to-blue-600", title: "AI Tools", desc: "Master AI-powered features", articles: 24 },
  { icon: CreditCard, color: "from-emerald-600 to-teal-600", title: "Billing", desc: "Manage subscriptions and plans", articles: 8 },
  { icon: Users, color: "from-pink-600 to-violet-600", title: "Teams", desc: "Collaborate with your team", articles: 10 },
  { icon: Key, color: "from-amber-600 to-orange-600", title: "API", desc: "Integrate with our API", articles: 16 },
  { icon: Shield, color: "from-red-600 to-pink-600", title: "Security", desc: "Security best practices", articles: 7 },
];

const POPULAR = [
  "How to create your first brand kit",
  "Setting up team collaboration",
  "Understanding AI generation credits",
  "Exporting assets in multiple formats",
  "Integrating with third-party tools",
  "Managing API keys and rate limits",
];

export default function HelpPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [search, setSearch] = useState("");

  return (
    <motion.div {...pageAnim}>
      <Card className="p-8 mb-6 bg-gradient-to-br from-violet-600/20 via-blue-600/10 to-transparent border-violet-500/20">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold text-white mb-2">How can we help you?</h1>
          <p className="text-sm text-slate-400 mb-5">Search our help center for answers</p>
          <Input icon={Search} placeholder="Search articles, guides, tutorials..." value={search} onChange={setSearch} className="w-full" />
        </div>
      </Card>
      <h2 className="font-bold text-white text-sm mb-3">Browse by Topic</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {TOPICS.map((t) => {
          const Icon = t.icon;
          return (
            <Card key={t.title} className="p-4 group cursor-pointer hover:border-violet-500/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{t.title}</h3>
                    <p className="text-xs text-slate-500">{t.desc}</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
              </div>
              <div className="mt-3">
                <Badge color="gray">{t.articles} articles</Badge>
              </div>
            </Card>
          );
        })}
      </div>
      <Card className="p-5">
        <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2"><FileText size={14} className="text-violet-400" /> Popular Articles</h3>
        <div className="space-y-2">
          {POPULAR.map((article) => (
            <button key={article} className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors text-left group">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 flex-shrink-0" />
              <span className="text-sm text-slate-400 group-hover:text-white transition-colors flex-1">{article}</span>
              <ArrowRight size={12} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
            </button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
