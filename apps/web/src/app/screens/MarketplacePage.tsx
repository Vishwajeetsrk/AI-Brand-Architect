import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Star, Download, Tag, X, ShoppingCart, ChevronDown, Sparkles, TrendingUp, ArrowUpRight, Filter } from "lucide-react";
import { Btn, Card, Badge, PageHeader, Input, Avatar } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const LISTINGS = [
  { id: 'mkt-001', name: 'BrandSync Pro', description: 'AI-powered brand identity agent that generates cohesive brand guidelines, color palettes, and typography.', type: 'agent', category: 'branding', price: 49, rating: 4.8, reviewCount: 234, downloads: 12450, author: { name: 'Nexora Labs' }, version: '2.1.0', tags: ['branding', 'identity', 'design-system'], features: ['Auto brand guidelines', 'Color palette generation', 'Typography pairing', 'Brand voice analysis', 'Design tool plugins'], requirements: ['Nexora AI Engine v2+', 'Node.js 18+'], gradient: 'from-violet-600 to-blue-600' },
  { id: 'mkt-002', name: 'ContentForge AI', description: 'Enterprise-grade content generation engine for SEO-optimized blogs, articles, and marketing copy.', type: 'agent', category: 'content', price: 29, rating: 4.7, reviewCount: 512, downloads: 28730, author: { name: 'Nexora Labs' }, version: '3.0.0', tags: ['content', 'writing', 'seo'], features: ['Long-form content generation', 'SEO optimization', 'Brand tone matching', 'Multi-channel output', 'Content calendar'], requirements: ['Nexora AI Engine v2+'], gradient: 'from-emerald-500 to-cyan-600' },
  { id: 'mkt-003', name: 'SocialPulse', description: 'Automated social media manager that schedules, analyzes, and optimizes content across platforms.', type: 'agent', category: 'social-media', price: 39, rating: 4.6, reviewCount: 189, downloads: 8920, author: { name: 'SocialSync Inc' }, version: '1.8.2', tags: ['social-media', 'automation'], features: ['Auto scheduling', 'Engagement analytics', 'Hashtag optimization', 'Competitor tracking'], requirements: ['Nexora AI Engine v1.5+'], gradient: 'from-pink-500 to-rose-600' },
  { id: 'mkt-004', name: 'SEOptimizer', description: 'Comprehensive SEO analysis agent that audits sites and generates optimized content strategies.', type: 'agent', category: 'marketing', price: 59, rating: 4.9, reviewCount: 378, downloads: 15670, author: { name: 'RankHigher AI' }, version: '2.3.1', tags: ['seo', 'marketing', 'analytics'], features: ['Site audit', 'Keyword research', 'Rank tracking', 'Content optimization', 'Backlink analysis'], requirements: ['Nexora AI Engine v2+'], gradient: 'from-orange-500 to-red-600' },
  { id: 'mkt-005', name: 'DesignMind', description: 'AI visual design assistant that creates UI mockups and brand assets from natural language.', type: 'agent', category: 'design', price: 69, rating: 4.5, reviewCount: 456, downloads: 20340, author: { name: 'DesignForge' }, version: '2.0.0', tags: ['design', 'ui', 'graphics'], features: ['UI mockup generation', 'Brand asset creation', 'Social media graphics', 'Style transfer', 'Export to Figma'], requirements: ['Nexora AI Engine v2+', 'GPU recommended'], gradient: 'from-blue-500 to-indigo-600' },
  { id: 'mkt-006', name: 'CopyCraft Pro', description: 'Advanced copywriting agent for ad copy, emails, landing pages, and sales funnels.', type: 'agent', category: 'content', price: 19, rating: 4.4, reviewCount: 678, downloads: 34500, author: { name: 'CopyLab' }, version: '1.5.0', tags: ['copywriting', 'ads', 'email'], features: ['Ad copy generation', 'Email sequence writing', 'Landing page copy', 'A/B test suggestions'], requirements: [], gradient: 'from-amber-500 to-yellow-600' },
  { id: 'mkt-007', name: 'DataViz AI', description: 'Transforms raw data into interactive visualizations and dashboards.', type: 'agent', category: 'analytics', price: 44, rating: 4.3, reviewCount: 156, downloads: 6780, author: { name: 'DataPulse' }, version: '1.2.0', tags: ['data', 'visualization', 'charts'], features: ['Auto chart selection', 'Interactive dashboards', 'Multi-source import', 'Real-time updates'], requirements: ['Nexora AI Engine v1.5+'], gradient: 'from-teal-500 to-emerald-600' },
  { id: 'mkt-008', name: 'EmailFlow', description: 'Intelligent email campaign agent that personalizes and optimizes marketing emails.', type: 'agent', category: 'marketing', price: 34, rating: 4.6, reviewCount: 223, downloads: 11230, author: { name: 'SocialSync Inc' }, version: '2.1.0', tags: ['email', 'marketing', 'campaigns'], features: ['Campaign design', 'Personalization engine', 'Send-time optimization', 'A/B testing'], requirements: ['Nexora AI Engine v2+'], gradient: 'from-sky-500 to-blue-600' },
  { id: 'mkt-009', name: 'MarketSense', description: 'Market research agent that analyzes trends, competitors, and customer sentiment.', type: 'agent', category: 'analytics', price: 54, rating: 4.7, reviewCount: 145, downloads: 5430, author: { name: 'Intellivest AI' }, version: '1.0.0', tags: ['research', 'market', 'intelligence'], features: ['Trend analysis', 'Competitor monitoring', 'Sentiment analysis', 'SWOT generation'], requirements: ['Nexora AI Engine v2+'], gradient: 'from-purple-500 to-violet-600' },
  { id: 'mkt-010', name: 'CodeWeaver', description: 'AI code generation assistant that writes, reviews, and refactors code across languages.', type: 'agent', category: 'development', price: 0, rating: 4.8, reviewCount: 892, downloads: 56780, author: { name: 'Nexora Labs' }, version: '3.2.0', tags: ['code', 'development', 'generation'], features: ['Multi-language support', 'Code review', 'Refactoring', 'Test generation'], requirements: ['Nexora AI Engine v2+'], gradient: 'from-gray-500 to-slate-600' },
  { id: 'mkt-011', name: 'VoiceSync', description: 'Voice processing agent for voiceovers, transcription, and audio content creation.', type: 'agent', category: 'media', price: 24, rating: 4.2, reviewCount: 98, downloads: 3450, author: { name: 'AudioCraft' }, version: '1.1.0', tags: ['voice', 'audio', 'transcription'], features: ['Text-to-speech', 'Audio transcription', 'Voice cloning', 'Podcast editing'], requirements: ['Nexora AI Engine v1.5+', 'GPU recommended'], gradient: 'from-cyan-500 to-teal-600' },
  { id: 'mkt-012', name: 'AnalyticaGPT', description: 'Business analytics agent that generates insights and executive-ready reports.', type: 'agent', category: 'analytics', price: 49, rating: 4.5, reviewCount: 267, downloads: 9870, author: { name: 'DataMinds' }, version: '2.0.0', tags: ['analytics', 'business', 'reports'], features: ['Data source connectors', 'Insight generation', 'Trend forecasting', 'Anomaly detection'], requirements: ['Nexora AI Engine v2+'], gradient: 'from-indigo-500 to-purple-600' },
];

const FEATURED = LISTINGS.filter(l => l.rating >= 4.7).slice(0, 4);
const TOP_RATED = [...LISTINGS].sort((a, b) => b.rating - a.rating).slice(0, 8);

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Sparkles },
  { id: 'branding', name: 'Branding', icon: Tag },
  { id: 'content', name: 'Content', icon: Tag },
  { id: 'marketing', name: 'Marketing', icon: Tag },
  { id: 'design', name: 'Design', icon: Tag },
  { id: 'analytics', name: 'Analytics', icon: Tag },
  { id: 'development', name: 'Development', icon: Tag },
  { id: 'social-media', name: 'Social', icon: Tag },
];

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} />
      ))}
      <span className="text-xs text-slate-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ListingCard({ listing, onClick }: { listing: typeof LISTINGS[0]; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="group overflow-hidden">
      <div className={`h-32 bg-gradient-to-br ${listing.gradient} flex items-center justify-center relative`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        <div className="flex items-center gap-2 px-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles size={22} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-sm leading-tight">{listing.name}</p>
            <p className="text-white/60 text-xs">{listing.author.name}</p>
          </div>
        </div>
        {listing.price === 0 && (
          <Badge color="green" className="absolute top-2 right-2">Free</Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge color="violet">{listing.type}</Badge>
          <Stars rating={listing.rating} size={10} />
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{listing.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Download size={11} />
            <span>{(listing.downloads / 1000).toFixed(1)}k</span>
          </div>
          <span className="text-sm font-bold text-white">
            {listing.price === 0 ? 'Free' : `$${listing.price}`}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedListing, setSelectedListing] = useState<typeof LISTINGS[0] | null>(null);

  const filtered = LISTINGS.filter(l => {
    if (activeCategory !== 'all' && l.category !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.tags.some(t => t.includes(q));
    }
    return true;
  });

  return (
    <motion.div {...pageAnim} className="pb-12">
      <PageHeader
        title="Agent Marketplace"
        subtitle="Browse, buy, and install AI agents for your workflows"
        actions={
          <Btn variant="primary" size="sm" icon={Sparkles}>Browse All</Btn>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-md">
          <Input placeholder="Search agents, templates, tools..." value={search} onChange={setSearch} icon={Search} />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-500 hover:text-slate-300 bg-white/[0.03] border border-transparent'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-amber-400" />
          <h2 className="text-sm font-bold text-white">Featured Agents</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {FEATURED.map((l) => (
            <ListingCard key={l.id} listing={l} onClick={() => setSelectedListing(l)} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-emerald-400" />
          <h2 className="text-sm font-bold text-white">Top Rated</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {TOP_RATED.slice(0, 4).map((l) => (
            <ListingCard key={l.id} listing={l} onClick={() => setSelectedListing(l)} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Filter size={14} className="text-violet-400" />
          <h2 className="text-sm font-bold text-white">
            {activeCategory === 'all' ? 'All Agents' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Agents`}
            <span className="text-slate-500 font-normal ml-2">({filtered.length})</span>
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} onClick={() => setSelectedListing(l)} />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedListing(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0d0f2a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className={`h-40 bg-gradient-to-br ${selectedListing.gradient} relative`}>
                <button onClick={() => setSelectedListing(null)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 transition-colors">
                  <X size={16} className="text-white" />
                </button>
                <div className="absolute bottom-4 left-5 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Sparkles size={26} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedListing.name}</h2>
                    <p className="text-sm text-white/70">by {selectedListing.author.name} · v{selectedListing.version}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge color="violet">{selectedListing.type}</Badge>
                  <Stars rating={selectedListing.rating} size={12} />
                  <span className="text-xs text-slate-500">({selectedListing.reviewCount} reviews)</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Download size={11} /> {(selectedListing.downloads / 1000).toFixed(1)}k downloads</span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{selectedListing.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Features</h4>
                    <ul className="space-y-1.5">
                      {selectedListing.features.slice(0, 5).map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                          <div className="w-1 h-1 rounded-full bg-violet-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Requirements</h4>
                    {selectedListing.requirements.length > 0 ? (
                      <ul className="space-y-1.5">
                        {selectedListing.requirements.map((r) => (
                          <li key={r} className="flex items-center gap-2 text-xs text-slate-400">
                            <div className="w-1 h-1 rounded-full bg-emerald-500" /> {r}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-600">No special requirements</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedListing.tags.map((t) => (
                    <Badge key={t} color="gray">{t}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div>
                    <span className="text-2xl font-extrabold text-white">
                      {selectedListing.price === 0 ? 'Free' : `$${selectedListing.price}`}
                    </span>
                    {selectedListing.price > 0 && <span className="text-xs text-slate-500 ml-2">one-time</span>}
                  </div>
                  <Btn variant="primary" icon={ShoppingCart}>
                    {selectedListing.price === 0 ? 'Install Agent' : 'Purchase Agent'}
                  </Btn>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
