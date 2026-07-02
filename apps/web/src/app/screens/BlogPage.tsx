"use client";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, Tag, Search, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card, Badge, PageHeader, Btn } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const POSTS = [
  { title: "Building an AI Brand Architect: Architecture Deep Dive", excerpt: "How we built a multi-agent system that understands brand identity, generates cohesive strategies, and adapts to any industry.", date: "Jun 15, 2025", readTime: "12 min", tags: ["Engineering", "AI"], author: "Vishwajeet", featured: true },
  { title: "The Future of Brand Identity is Generative", excerpt: "Generative AI is transforming how brands think about identity. Learn how adaptive brand systems are replacing static guidelines.", date: "Jun 10, 2025", readTime: "8 min", tags: ["Design", "Strategy"], author: "Vishwajeet", featured: false },
  { title: "How MCP Protocols Enable AI Tool Integration", excerpt: "Model Context Protocol allows AI agents to interact with external tools securely. Here's how we implemented it.", date: "Jun 5, 2025", readTime: "10 min", tags: ["Engineering", "MCP"], author: "Vishwajeet", featured: false },
  { title: "Knowledge Graphs: The Backbone of Intelligent Systems", excerpt: "Why we chose a graph-based approach for brand knowledge storage and how it powers context-aware AI responses.", date: "May 28, 2025", readTime: "7 min", tags: ["Engineering", "Data"], author: "Vishwajeet", featured: false },
  { title: "From Prompt to Production: Our AI Safety Stack", excerpt: "How we implemented multi-layer safety checks including prompt injection detection, content moderation, and PII filtering.", date: "May 20, 2025", readTime: "9 min", tags: ["Security", "AI"], author: "Vishwajeet", featured: false },
  { title: "Zero-Trust Architecture for AI Platforms", excerpt: "Security-first design principles applied to an AI-powered platform handling sensitive brand data.", date: "May 12, 2025", readTime: "6 min", tags: ["Security", "Architecture"], author: "Vishwajeet", featured: false },
  { title: "Scaling Real-Time Features with Socket.IO and BullMQ", excerpt: "How we handle real-time collaboration, notifications, and background job processing at scale.", date: "May 5, 2025", readTime: "11 min", tags: ["Engineering", "Infrastructure"], author: "Vishwajeet", featured: false },
  { title: "Designing a Universal Component System", excerpt: "Our approach to building a design system that works across web, mobile, and desktop with consistent tokens.", date: "Apr 28, 2025", readTime: "8 min", tags: ["Design", "Engineering"], author: "Vishwajeet", featured: false },
];

const CATEGORIES = ["All", "Engineering", "Design", "Security", "Strategy", "AI", "Infrastructure"];

export default function BlogPage({ navigate }: { navigate?: (path: string) => void }) {
  const [activeTag, setActiveTag] = useState("All");

  const filtered = activeTag === "All" ? POSTS : POSTS.filter(p => p.tags.includes(activeTag));
  const featured = filtered.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <motion.div {...pageAnim} className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge color="violet" className="mb-4">Blog</Badge>
        <h1 className="text-4xl font-bold text-white mb-3">Stories & Insights</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Deep dives into AI engineering, brand strategy, design systems, and building the future of brand intelligence.</p>
      </div>

      <div className="relative max-w-md mx-auto mb-10">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" placeholder="Search articles..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors" />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map(t => (
          <button key={t} onClick={() => setActiveTag(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTag === t ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"}`}>{t}</button>
        ))}
      </div>

      {featured && (
        <Card className="p-6 mb-8 bg-gradient-to-br from-violet-600/10 to-indigo-600/5 border-violet-500/20 cursor-pointer" onClick={() => navigate?.(`/blog/${featured.title.toLowerCase().replace(/\s+/g, '-')}`)}>
          <div className="flex items-start gap-6">
            <div className="flex-1 min-w-0">
              <Badge color="violet" className="mb-3">Featured</Badge>
              <h2 className="text-2xl font-bold text-white mb-3">{featured.title}</h2>
              <p className="text-gray-400 mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={14} />{featured.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} />{featured.readTime}</span>
                <span className="flex items-center gap-1">{featured.author}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {featured.tags.map(t => <Badge key={t} color="gray">{t}</Badge>)}
              </div>
            </div>
            <div className="hidden md:flex w-32 h-32 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 items-center justify-center">
              <ArrowRight size={32} className="text-violet-400" />
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {rest.map(post => (
          <Card key={post.title} className="p-5 cursor-pointer group hover:border-violet-500/30 transition-all" onClick={() => navigate?.(`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`)}>
            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-violet-300 transition-colors">{post.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
              <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map(t => <Badge key={t} color="gray" className="text-xs">{t}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
