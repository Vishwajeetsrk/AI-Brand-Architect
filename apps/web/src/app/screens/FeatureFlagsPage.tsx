"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Flag, Plus, ToggleLeft, ToggleRight, Trash2, RefreshCw, Search, Settings, Users, Globe } from "lucide-react";
import { Btn, Card, PageHeader, Badge, Input } from "../components/shared";
import { featureFlagsService } from "@/services/feature-flags";
import type { FeatureFlag } from "@/services/feature-flags";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ key: "", name: "", description: "", enabled: false, tags: "" });

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const data = await featureFlagsService.list();
      setFlags(data as FeatureFlag[]);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchFlags(); }, []);

  const handleToggle = async (id: string) => {
    await featureFlagsService.toggle(id);
    fetchFlags();
  };

  const handleDelete = async (id: string) => {
    await featureFlagsService.remove(id);
    fetchFlags();
  };

  const handleCreate = async () => {
    if (!form.key || !form.name) return;
    await featureFlagsService.create({
      key: form.key,
      name: form.name,
      description: form.description || undefined,
      enabled: form.enabled,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    });
    setForm({ key: "", name: "", description: "", enabled: false, tags: "" });
    setShowForm(false);
    fetchFlags();
  };

  const filtered = flags.filter(f =>
    !search || f.key.includes(search) || f.name.includes(search) || f.tags?.some(t => t.includes(search))
  );

  return (
    <motion.div {...pageAnim} className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Feature Flags" subtitle="Manage feature flags, A/B tests, and gradual rollouts"
        actions={<Btn variant="secondary" size="sm" icon={RefreshCw} onClick={fetchFlags}>Refresh</Btn>}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search flags..." 
            className="w-full bg-[#111336] border border-white/[0.07] rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50" />
        </div>
        <Btn variant="primary" size="sm" icon={Plus} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Flag"}
        </Btn>
      </div>

      {showForm && (
        <Card className="p-4 mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">Create New Feature Flag</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input label="Flag Key" value={form.key} onChange={v => setForm(p => ({ ...p, key: v }))} placeholder="e.g. new-dashboard" />
            <Input label="Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="e.g. New Dashboard" />
          </div>
          <Input label="Description" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} placeholder="Describe what this flag controls..." />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Input label="Tags (comma separated)" value={form.tags} onChange={v => setForm(p => ({ ...p, tags: v }))} placeholder="e.g. beta, experiment" />
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.enabled} onChange={e => setForm(p => ({ ...p, enabled: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/10 bg-[#111336] accent-violet-600" />
                <span className="text-sm text-slate-400">Enable by default</span>
              </label>
            </div>
          </div>
          <Btn variant="primary" size="sm" onClick={handleCreate} className="mt-3">Create Flag</Btn>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40 text-slate-500">
          <RefreshCw size={18} className="animate-spin mr-2" /> Loading...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <Flag size={32} className="mx-auto text-slate-600 mb-2" />
          <p className="text-slate-500 text-sm">No feature flags yet. Create one to get started.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(flag => (
            <Card key={flag.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg ${flag.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/20 text-slate-500'}`}>
                    <Flag size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{flag.name}</span>
                      <Badge color={flag.enabled ? 'green' : 'gray'}>{flag.enabled ? 'ON' : 'OFF'}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{flag.key}</p>
                    {flag.description && <p className="text-xs text-slate-400 mt-0.5">{flag.description}</p>}
                    {flag.rules && (
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                        {flag.rules.rolloutPercentage && <span><Users size={11} className="inline mr-1" />{flag.rules.rolloutPercentage}% rollout</span>}
                        {flag.rules.environment && <span><Globe size={11} className="inline mr-1" />{flag.rules.environment}</span>}
                      </div>
                    )}
                    {flag.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {flag.tags.map(t => <Badge key={t} color="violet">{t}</Badge>)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(flag.id)}
                    className={`p-2 rounded-lg transition-colors ${flag.enabled ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-slate-600/20 text-slate-500 hover:bg-slate-600/30'}`}
                    title={flag.enabled ? 'Disable' : 'Enable'}>
                    {flag.enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => handleDelete(flag.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
