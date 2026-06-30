"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Route, Target, Award, Clock, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Btn, Card, Badge, PageHeader, Input, Skeleton } from "../components/shared";
import { careerService } from "@/services/career";

const pageAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }, exit: { opacity: 0, y: -8, transition: { duration: 0.15 } } };

export default function CareerRoadmapPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ currentRole: "", targetRole: "", skills: "", industry: "", experienceYears: "0" });

  const load = async () => {
    setLoading(true);
    try { const r = await careerService.roadmaps.list(); setRoadmaps(r as any[]); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const roadmap = await careerService.roadmaps.generate({
        currentRole: form.currentRole, targetRole: form.targetRole || undefined,
        skills: form.skills ? form.skills.split(",").map((s: string) => s.trim()) : undefined,
        industry: form.industry || undefined, experienceYears: parseInt(form.experienceYears) || 0,
      });
      setRoadmaps(prev => [roadmap, ...prev]);
      setSelected(roadmap);
      setForm({ currentRole: "", targetRole: "", skills: "", industry: "", experienceYears: "0" });
    } catch {}
    setGenerating(false);
  };

  if (selected) {
    return (
      <motion.div {...pageAnim} className="max-w-4xl mx-auto">
        <button onClick={() => setSelected(null)} className="text-violet-400 hover:text-violet-300 mb-4 text-sm">&larr; Back to roadmaps</button>
        <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/5 border border-violet-500/20 rounded-xl p-6 mb-6">
          <Badge color="violet" className="mb-2">Career Roadmap</Badge>
          <h1 className="text-2xl font-bold text-white mb-1">{selected.currentRole} {selected.targetRole ? `→ ${selected.targetRole}` : ""}</h1>
          <p className="text-gray-400 text-sm">{selected.industry ? `${selected.industry} · ` : ""}{selected.experienceYears} years experience</p>
        </div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Award size={18} className="text-violet-400" />Milestones</h2>
        <div className="space-y-3 mb-8">
          {selected.milestones?.map((m: any, i: number) => (
            <Card key={i} className="p-4 border-l-2 border-l-violet-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{i + 1}. {m.title}</h3>
                  <p className="text-gray-400 text-sm mt-1"><Clock size={14} className="inline mr-1" />{m.duration}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {m.skills?.map((s: string, j: number) => <Badge key={j} color="violet">{s}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Route size={18} className="text-violet-400" />Timeline</h2>
        <div className="space-y-3">
          {selected.timeline?.map((t: any, i: number) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 text-sm font-bold">{i + 1}</div>
                <div>
                  <h3 className="font-semibold text-white">{t.phase}</h3>
                  <p className="text-gray-500 text-xs">{t.duration}</p>
                </div>
              </div>
              <ul className="space-y-1 ml-11">
                {t.actions?.map((a: string, j: number) => (
                  <li key={j} className="text-gray-400 text-sm flex items-start gap-2"><ArrowRight size={12} className="mt-1 shrink-0 text-violet-400" />{a}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Career Roadmap" subtitle="AI-powered career progression planning"
        actions={<Btn variant="primary" icon={Sparkles} onClick={() => document.getElementById('generate-form')?.scrollIntoView({ behavior: 'smooth' })}>Generate New</Btn>}
      />
      <div id="generate-form"><Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Generate Career Roadmap</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Input label="Current Role" value={form.currentRole} onChange={v => setForm(p => ({ ...p, currentRole: v }))} placeholder="e.g. Junior Developer" />
          <Input label="Target Role (optional)" value={form.targetRole} onChange={v => setForm(p => ({ ...p, targetRole: v }))} placeholder="e.g. Senior Developer" />
          <Input label="Skills (comma separated)" value={form.skills} onChange={v => setForm(p => ({ ...p, skills: v }))} placeholder="React, TypeScript, Node.js" />
          <Input label="Industry" value={form.industry} onChange={v => setForm(p => ({ ...p, industry: v }))} placeholder="e.g. Technology" />
          <Input label="Years of Experience" value={form.experienceYears} onChange={v => setForm(p => ({ ...p, experienceYears: v }))} placeholder="0" />
        </div>
        <Btn variant="primary" onClick={handleGenerate} loading={generating} icon={Sparkles}>Generate Roadmap</Btn>
      </Card></div>
      <div className="grid md:grid-cols-2 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />) :
          roadmaps.length === 0 ? <p className="text-gray-500 col-span-2 text-center py-8">No roadmaps yet. Generate your first one above.</p> :
          roadmaps.map(r => (
            <Card key={r.id} className="p-4 cursor-pointer hover:border-violet-500/30 transition-all" onClick={() => setSelected(r)}>
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-violet-400" />
                <h3 className="font-semibold text-white">{r.currentRole}</h3>
                {r.targetRole && <><ArrowRight size={14} className="text-gray-600" /><span className="text-violet-300">{r.targetRole}</span></>}
              </div>
              <p className="text-gray-500 text-xs">{r.industry || "General"} · {r.experienceYears}y exp · {r.milestones?.length || 0} milestones</p>
            </Card>
          ))
        }
      </div>
    </motion.div>
  );
}
