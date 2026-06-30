"use client";
import { motion } from "motion/react";
import { Users, MessageSquare, BookOpen, GitFork, Star, Globe, ArrowRight, ExternalLink } from "lucide-react";
import { Card, Badge, Btn, StatCard } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const RESOURCES = [
  { icon: BookOpen, title: "Documentation", desc: "Comprehensive guides and API references", href: "/docs", color: "violet" },
  { icon: MessageSquare, title: "Community Chat", desc: "Real-time chat with the community", href: "community-chat", color: "blue" },
  { icon: GitFork, title: "GitHub", desc: "Open source plugins, SDKs, and examples", href: "https://github.com/Vishwajeetsrk/AI-Brand-Architect", color: "green" },
  { icon: Globe, title: "Events & Webinars", desc: "Live sessions with the team and community", href: "#", color: "amber" },
];

const PROJECTS = [
  { name: "Brand Strategy Generator", author: "community", stars: 42, desc: "Automated brand strategy templates" },
  { name: "MCP Tool Collection", author: "community", stars: 38, desc: "Community-built MCP integrations" },
  { name: "Design Token Packs", author: "community", stars: 27, desc: "Pre-built design token libraries" },
];

export default function CommunityPage({ navigate }: { navigate?: (path: string) => void }) {
  return (
    <motion.div {...pageAnim} className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge color="violet" className="mb-4">Community</Badge>
        <h1 className="text-4xl font-bold text-white mb-3">Join Our Community</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Connect with AI engineers, brand strategists, and designers building the future of brand intelligence.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard label="Community Members" value="2,847" icon={Users} />
        <StatCard label="Open Source Projects" value="24" icon={GitFork} />
        <StatCard label="GitHub Stars" value="1.2k" icon={Star} />
        <StatCard label="Forum Posts" value="3.5k" icon={MessageSquare} />
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Community Resources</h2>
      <div className="grid md:grid-cols-4 gap-4 mb-12">
        {RESOURCES.map(r => (
          <Card key={r.title} className="p-5 cursor-pointer hover:border-violet-500/30 transition-all group" onClick={() => r.href.startsWith("http") ? window.open(r.href, "_blank") : navigate?.(r.href)}>
            <r.icon size={24} className="text-violet-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">{r.title}</h3>
            <p className="text-gray-400 text-sm mb-3">{r.desc}</p>
            <span className="text-violet-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Explore <ArrowRight size={14} />
            </span>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Community Projects</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {PROJECTS.map(p => (
          <Card key={p.name} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{p.name}</h3>
              <span className="flex items-center gap-1 text-xs text-gray-500"><Star size={12} />{p.stars}</span>
            </div>
            <p className="text-gray-400 text-sm mb-3">{p.desc}</p>
            <Badge color="gray">by {p.author}</Badge>
          </Card>
        ))}
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-violet-600/10 to-indigo-600/5 border-violet-500/20">
        <h2 className="text-2xl font-bold text-white mb-3">Get Involved</h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-6">Contribute code, share feedback, or build plugins. The NEXORA community is open to everyone.</p>
        <div className="flex items-center justify-center gap-4">
          <Btn variant="primary" onClick={() => window.open("https://github.com/Vishwajeetsrk/AI-Brand-Architect", "_blank")}>
            <ExternalLink size={16} /> GitHub
          </Btn>
          <Btn variant="secondary" onClick={() => navigate?.("/docs")}>
            <BookOpen size={16} /> Documentation
          </Btn>
        </div>
      </Card>
    </motion.div>
  );
}
