"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, User, Star, MessageSquare, Plus, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { Btn, Card, Badge, PageHeader, Input } from "../components/shared";
import { coachingService } from "@/services/coaching";

const pageAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }, exit: { opacity: 0, y: -8, transition: { duration: 0.15 } } };

export default function CoachingHubPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", coachName: "", topics: "", duration: "30" });

  const load = async () => {
    setLoading(true);
    try { const s = await coachingService.sessions.list(); setSessions(s as any[]); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    try {
      await coachingService.sessions.create({
        ...form, topics: form.topics ? form.topics.split(",").map((t: string) => t.trim()) : [],
        duration: parseInt(form.duration) || 30,
      });
      setShowForm(false);
      setForm({ title: "", description: "", coachName: "", topics: "", duration: "30" });
      load();
    } catch {}
  };

  const statusColor: Record<string, string> = { scheduled: "blue", in_progress: "amber", completed: "emerald", cancelled: "red" };

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Coaching Hub" subtitle="Personalized coaching sessions"
        actions={<Btn variant="primary" icon={Plus} onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "New Session"}</Btn>}
      />
      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Schedule Coaching Session</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="e.g. Career Growth Strategy" />
            <Input label="Coach Name" value={form.coachName} onChange={v => setForm(p => ({ ...p, coachName: v }))} placeholder="AI Coach" />
            <Input label="Duration (min)" value={form.duration} onChange={v => setForm(p => ({ ...p, duration: v }))} placeholder="30" />
            <Input label="Topics (comma separated)" value={form.topics} onChange={v => setForm(p => ({ ...p, topics: v }))} placeholder="leadership, strategy" />
          </div>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Session description..." className="w-full bg-[#0c1022] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 mb-4 min-h-[80px]" />
          <Btn variant="primary" onClick={handleCreate} icon={Calendar}>Schedule Session</Btn>
        </Card>
      )}
      <div className="space-y-3">
        {loading ? <p className="text-gray-500">Loading...</p> :
          sessions.length === 0 ? <p className="text-gray-500 text-center py-8">No coaching sessions yet.</p> :
          sessions.map(s => (
            <Card key={s.id} className="p-4 flex items-center justify-between group">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full bg-${statusColor[s.status] || "blue"}-600/20 flex items-center justify-center`}>
                  {s.status === "completed" ? <CheckCircle size={18} className="text-emerald-400" /> :
                   s.status === "cancelled" ? <XCircle size={18} className="text-red-400" /> :
                   <User size={18} className="text-blue-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <p className="text-gray-500 text-xs mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><User size={12} />{s.coachName}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{s.duration}min</span>
                    <Badge color={statusColor[s.status] as any}>{s.status}</Badge>
                  </p>
                  {s.description && <p className="text-gray-400 text-sm mt-2">{s.description}</p>}
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))
        }
      </div>
    </motion.div>
  );
}
