"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Edit2, Plus, Upload, Download, Eye, DollarSign, Users, BarChart3, TrendingUp, Star, Tag, Crown, Wallet, Calendar, Check, ChevronDown } from "lucide-react";
import { Btn, Card, Badge, PageHeader, Input, Avatar, EmptyPlaceholder } from "../components/shared";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

interface ContentItem {
  id: string; title: string; description: string; type: string; category: string; price: number; downloads: number; rating: number; status: string; tags: string[]; createdAt: string;
}

interface AnalyticsPeriod {
  period: string; views: number; downloads: number; revenue: number;
}

const SAMPLE_PROFILE = { displayName: "Alex Rivera", bio: "Brand strategist & designer creating premium templates and agents for the Nexora ecosystem.", specialties: ["Branding", "Design Systems", "UI/UX"], avatar: "", rating: 4.8, totalSales: 3420, joinedAt: "2025-01-15T00:00:00Z" };

const CONTENT: ContentItem[] = [
  { id: '1', title: 'Brand Identity Pack Pro', description: 'Complete brand identity system with logo variations, color palettes, and typography scales.', type: 'template', category: 'branding', price: 49, downloads: 1240, rating: 4.8, status: 'published', tags: ['branding', 'identity'], createdAt: '2025-02-10' },
  { id: '2', title: 'UI Component Library', description: '200+ reusable UI components built with React and Tailwind.', type: 'template', category: 'development', price: 79, downloads: 890, rating: 4.7, status: 'published', tags: ['ui', 'react'], createdAt: '2025-03-15' },
  { id: '3', title: 'Brand Voice Guide', description: 'Step-by-step guide to defining and maintaining a consistent brand voice.', type: 'guide', category: 'branding', price: 14, downloads: 3890, rating: 4.6, status: 'published', tags: ['brand-voice', 'guide'], createdAt: '2025-04-22' },
  { id: '4', title: 'Social Media Kit', description: 'Pre-designed social media templates and caption prompts.', type: 'template', category: 'marketing', price: 24, downloads: 2100, rating: 4.5, status: 'draft', tags: ['social', 'marketing'], createdAt: '2025-06-01' },
];

const ANALYTICS_DATA: AnalyticsPeriod[] = [
  { period: 'Apr', views: 12400, downloads: 890, revenue: 12450 },
  { period: 'May', views: 18300, downloads: 1340, revenue: 18230 },
  { period: 'Jun', views: 22100, downloads: 1670, revenue: 24100 },
  { period: 'Jul', views: 19800, downloads: 1450, revenue: 20180 },
  { period: 'Aug', views: 25600, downloads: 1890, revenue: 28340 },
  { period: 'Sep', views: 31200, downloads: 2340, revenue: 35600 },
];

const PAYOUTS = [
  { id: 'p1', amount: 1240, status: 'completed', method: 'PayPal', requestedAt: '2025-09-01', completedAt: '2025-09-03' },
  { id: 'p2', amount: 890, status: 'processing', method: 'Bank Transfer', requestedAt: '2025-09-15', completedAt: undefined },
  { id: 'p3', amount: 2100, status: 'pending', method: 'PayPal', requestedAt: '2025-09-20', completedAt: undefined },
];

const SUBSCRIBERS = [
  { id: 's1', name: 'Emily Chen', tier: 'pro', since: '2025-08-01', autoRenew: true },
  { id: 's2', name: 'James Wilson', tier: 'premium', since: '2025-08-15', autoRenew: true },
  { id: 's3', name: 'Sarah Kim', tier: 'free', since: '2025-09-01', autoRenew: false },
  { id: 's4', name: 'David Park', tier: 'pro', since: '2025-07-20', autoRenew: true },
];

const REVENUE_BREAKDOWN = [
  { name: 'Templates', value: 18450, color: '#8b5cf6' },
  { name: 'Prompts', value: 8920, color: '#06b6d4' },
  { name: 'Agents', value: 12340, color: '#10b981' },
  { name: 'Guides', value: 4560, color: '#f59e0b' },
];

const TYPE_COLORS: Record<string, string> = { template: 'blue', prompt: 'cyan', agent: 'violet', workflow: 'orange', design: 'pink', guide: 'green' };

function ContentCard({ item, onEdit, onDelete }: { item: ContentItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card className="p-4 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge color={TYPE_COLORS[item.type] || 'gray'}>{item.type}</Badge>
          <Badge color={item.status === 'published' ? 'green' : 'yellow'}>{item.status}</Badge>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-white"><Edit2 size={12} /></button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-red-400"><X size={12} /></button>
        </div>
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{item.description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {item.tags.map(t => <Badge key={t} color="gray">{t}</Badge>)}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Download size={10} />{item.downloads}</span>
          <span className="flex items-center gap-1"><Star size={10} className="text-amber-400" />{item.rating}</span>
        </div>
        <span className="text-sm font-bold text-white">${item.price}</span>
      </div>
    </Card>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
          <Icon size={18} className="text-violet-400" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-lg font-bold text-white">{value}</p>
          {sub && <p className="text-[10px] text-slate-600">{sub}</p>}
        </div>
      </div>
    </Card>
  );
}

export default function CreatorPage() {
  const [tab, setTab] = useState<'overview' | 'content' | 'analytics' | 'payouts' | 'subscribers'>('overview');
  const [showPublish, setShowPublish] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState(SAMPLE_PROFILE);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Crown },
    { id: 'content' as const, label: 'Content', icon: Download },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'payouts' as const, label: 'Payouts', icon: Wallet },
    { id: 'subscribers' as const, label: 'Subscribers', icon: Users },
  ];

  function renderOverview() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={Eye} label="Total Views" value="89.4K" sub="+23% this month" />
          <StatCard icon={Download} label="Total Downloads" value="8.9K" sub="+18% this month" />
          <StatCard icon={DollarSign} label="Total Revenue" value="$139.2K" sub="+31% this month" />
          <StatCard icon={Users} label="Subscribers" value="4" sub="2 pro, 1 premium" />
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Revenue Trend</h3>
            <Badge color="green"><TrendingUp size={10} /> +22.4%</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="period" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0d0f2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-white mb-4">Revenue by Type</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={REVENUE_BREAKDOWN} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                    {REVENUE_BREAKDOWN.map(e => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0d0f2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2">
              {REVENUE_BREAKDOWN.map(e => (
                <div key={e.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                  {e.name}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-bold text-white mb-4">Top Content</h3>
            <div className="space-y-3">
              {CONTENT.filter(c => c.status === 'published').slice(0, 4).map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{c.title}</p>
                    <p className="text-[10px] text-slate-500">{c.downloads} downloads · ${(c.price * c.downloads * 0.7).toFixed(0)} rev</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 ml-2">
                    <Star size={10} className="text-amber-400" />{c.rating}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function renderContent() {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-500">{CONTENT.length} items ({CONTENT.filter(c => c.status === 'published').length} published)</p>
          <Btn variant="primary" size="sm" icon={Plus} onClick={() => setShowPublish(true)}>Publish New</Btn>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CONTENT.map(c => (
            <ContentCard key={c.id} item={c} onEdit={() => {}} onDelete={() => {}} />
          ))}
        </div>
      </div>
    );
  }

  function renderAnalytics() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Eye} label="Views" value={ANALYTICS_DATA.reduce((s, a) => s + a.views, 0).toLocaleString()} sub="All time" />
          <StatCard icon={Download} label="Downloads" value={ANALYTICS_DATA.reduce((s, a) => s + a.downloads, 0).toLocaleString()} sub="All time" />
          <StatCard icon={DollarSign} label="Revenue" value={`$${ANALYTICS_DATA.reduce((s, a) => s + a.revenue, 0).toLocaleString()}`} sub="All time" />
        </div>

        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-4">Views & Downloads Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="period" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0d0f2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="views" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="downloads" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    );
  }

  function renderPayouts() {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-500">{PAYOUTS.length} payouts</p>
          <Btn variant="primary" size="sm" icon={Wallet}>Request Payout</Btn>
        </div>
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left p-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Amount</th>
                <th className="text-left p-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Status</th>
                <th className="text-left p-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Method</th>
                <th className="text-left p-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Requested</th>
                <th className="text-left p-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Completed</th>
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map(p => (
                <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="p-3 text-white font-semibold">${p.amount.toLocaleString()}</td>
                  <td className="p-3"><Badge color={p.status === 'completed' ? 'green' : p.status === 'processing' ? 'blue' : 'yellow'}>{p.status}</Badge></td>
                  <td className="p-3 text-slate-400">{p.method}</td>
                  <td className="p-3 text-slate-400">{p.requestedAt}</td>
                  <td className="p-3 text-slate-400">{p.completedAt || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  function renderSubscribers() {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-500">{SUBSCRIBERS.length} subscribers</p>
          <Btn variant="secondary" size="sm" icon={Crown}>Manage Tiers</Btn>
        </div>
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left p-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Subscriber</th>
                <th className="text-left p-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Tier</th>
                <th className="text-left p-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Since</th>
                <th className="text-left p-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Auto-Renew</th>
              </tr>
            </thead>
            <tbody>
              {SUBSCRIBERS.map(s => (
                <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="p-3 text-white font-semibold">{s.name}</td>
                  <td className="p-3"><Badge color={s.tier === 'pro' ? 'violet' : s.tier === 'premium' ? 'blue' : 'gray'}>{s.tier}</Badge></td>
                  <td className="p-3 text-slate-400">{s.since}</td>
                  <td className="p-3">{s.autoRenew ? <Check size={14} className="text-emerald-400" /> : <X size={14} className="text-slate-600" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  return (
    <motion.div {...pageAnim} className="pb-12">
      <PageHeader
        title="Creator Studio"
        subtitle="Manage your content, track analytics, and grow your audience"
        actions={
          <div className="flex items-center gap-2">
            <Btn variant="secondary" size="sm" icon={Edit2} onClick={() => setEditProfile(true)}>Edit Profile</Btn>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-5 mb-6">
        <Card className="p-5 col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar name={profile.displayName} size="lg" />
            <h3 className="text-base font-bold text-white mt-3">{profile.displayName}</h3>
            <p className="text-xs text-slate-500 mt-1">{profile.bio}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs text-slate-400">{profile.rating}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
              {profile.specialties.map(s => <Badge key={s} color="violet">{s}</Badge>)}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] w-full text-center">
              <p className="text-lg font-bold text-white">{profile.totalSales.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500">Total Sales</p>
            </div>
            <div className="mt-2 w-full text-center">
              <p className="text-xs text-slate-600">Joined {new Date(profile.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </Card>

        <div className="col-span-3 space-y-4">
          <div className="flex items-center gap-1 border-b border-white/[0.06] pb-1">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all ${
                    tab === t.id ? 'text-violet-300 border-b-2 border-violet-500' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon size={12} /> {t.label}
                </button>
              );
            })}
          </div>

          <div className="min-h-96">
            {tab === 'overview' && renderOverview()}
            {tab === 'content' && renderContent()}
            {tab === 'analytics' && renderAnalytics()}
            {tab === 'payouts' && renderPayouts()}
            {tab === 'subscribers' && renderSubscribers()}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setEditProfile(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-[#0d0f2a] border border-white/[0.08] rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Edit Profile</h3>
                <button onClick={() => setEditProfile(false)} className="p-1 rounded-lg hover:bg-white/5"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 font-semibold mb-1.5">Display Name</label>
                  <Input value={profile.displayName} onChange={v => setProfile({ ...profile, displayName: v })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-semibold mb-1.5">Bio</label>
                  <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors min-h-[80px] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-semibold mb-1.5">Specialties (comma separated)</label>
                  <Input value={profile.specialties.join(', ')} onChange={v => setProfile({ ...profile, specialties: v.split(',').map(s => s.trim()) })} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-white/[0.06]">
                <Btn variant="ghost" size="sm" onClick={() => setEditProfile(false)}>Cancel</Btn>
                <Btn variant="primary" size="sm" onClick={() => setEditProfile(false)}>Save Changes</Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPublish && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setShowPublish(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()} className="w-full max-w-xl bg-[#0d0f2a] border border-white/[0.08] rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Publish New Content</h3>
                <button onClick={() => setShowPublish(false)} className="p-1 rounded-lg hover:bg-white/5"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 font-semibold mb-1.5">Title</label>
                  <Input placeholder="e.g. Brand Identity Pack Pro" value="" onChange={() => {}} />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-semibold mb-1.5">Description</label>
                  <textarea placeholder="Describe your content..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors min-h-[80px] resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 font-semibold mb-1.5">Type</label>
                    <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors">
                      <option>template</option><option>prompt</option><option>agent</option><option>workflow</option><option>design</option><option>guide</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 font-semibold mb-1.5">Category</label>
                    <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors">
                      <option>branding</option><option>development</option><option>marketing</option><option>design</option><option>automation</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 font-semibold mb-1.5">Price ($)</label>
                    <Input type="number" placeholder="29.99" value="" onChange={() => {}} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 font-semibold mb-1.5">Tags (comma separated)</label>
                    <Input placeholder="branding, design" value="" onChange={() => {}} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-semibold mb-1.5">Upload File</label>
                  <div className="border-2 border-dashed border-white/[0.08] rounded-lg p-8 text-center hover:border-violet-500/30 transition-colors cursor-pointer">
                    <Upload size={24} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Drop files here or click to browse</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-white/[0.06]">
                <Btn variant="ghost" size="sm" onClick={() => setShowPublish(false)}>Cancel</Btn>
                <Btn variant="primary" size="sm" icon={Upload} onClick={() => setShowPublish(false)}>Publish</Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
