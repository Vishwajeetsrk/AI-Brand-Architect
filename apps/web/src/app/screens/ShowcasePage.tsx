"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, MessageCircle, Plus, ExternalLink, Globe, Users, Eye, ArrowUp } from "lucide-react";
import { Btn, Card, Badge, PageHeader, Input, Skeleton } from "../components/shared";
import { showcaseService, type ShowcaseProject } from "@/services/showcase";

const pageAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }, exit: { opacity: 0, y: -8, transition: { duration: 0.15 } } };

export default function ShowcasePage() {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", projectUrl: "", imageUrl: "", tags: "" });
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [commentText, setCommentText] = useState("");

  const load = async () => {
    setLoading(true);
    try { const p = await showcaseService.list(); setProjects(p as ShowcaseProject[]); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    try {
      await showcaseService.create({
        ...form, tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()) : [],
      });
      setShowForm(false);
      setForm({ title: "", description: "", projectUrl: "", imageUrl: "", tags: "" });
      load();
    } catch {}
  };

  const handleLike = async (id: string) => {
    try { const updated = await showcaseService.like(id); setProjects(prev => prev.map(p => p.id === id ? updated : p)); } catch {}
  };

  const handleComment = async () => {
    if (!selectedProject || !commentText) return;
    try {
      const updated = await showcaseService.addComment(selectedProject.id, commentText);
      setSelectedProject(updated);
      setCommentText("");
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch {}
  };

  if (selectedProject) {
    return (
      <motion.div {...pageAnim} className="max-w-3xl mx-auto">
        <button onClick={() => setSelectedProject(null)} className="text-violet-400 hover:text-violet-300 mb-4 text-sm">&larr; Back to showcase</button>
        <Card className="p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{selectedProject.title}</h1>
              <p className="text-gray-500 text-sm">{new Date(selectedProject.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge color="gray">{selectedProject.likes} likes</Badge>
              {selectedProject.projectUrl && <Btn variant="secondary" size="sm" icon={ExternalLink} onClick={() => window.open(selectedProject.projectUrl, "_blank")}>Open</Btn>}
            </div>
          </div>
          {selectedProject.imageUrl && <div className="w-full aspect-video rounded-lg bg-[#0c1022] mb-4 flex items-center justify-center"><Eye size={48} className="text-gray-600" /></div>}
          {selectedProject.description && <p className="text-gray-300 mb-4">{selectedProject.description}</p>}
          <div className="flex flex-wrap gap-1.5 mb-4">{selectedProject.tags?.map((t, i) => <Badge key={i} color="violet">{t}</Badge>)}</div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => handleLike(selectedProject.id)} className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"><Heart size={16} />Like</button>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><MessageCircle size={16} className="text-violet-400" />Comments ({selectedProject.comments?.length || 0})</h3>
          <div className="space-y-3 mb-4">
            {selectedProject.comments?.map(c => (
              <div key={c.id} className="flex gap-3 p-3 bg-[#0c1022] rounded-lg">
                <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-xs text-violet-400 font-bold">U</div>
                <div><p className="text-sm text-white">{c.content}</p><p className="text-xs text-gray-500 mt-1">{new Date(c.createdAt).toLocaleDateString()}</p></div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-[#0c1022] border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50" />
            <Btn variant="primary" size="sm" onClick={handleComment}>Send</Btn>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Project Showcase" subtitle="Share your work with the community"
        actions={<Btn variant="primary" icon={Plus} onClick={() => setShowForm(!showForm)} />}
      />
      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Share Your Project</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Project name" />
            <Input label="Tags (comma separated)" value={form.tags} onChange={v => setForm(p => ({ ...p, tags: v }))} placeholder="AI, design, brand" />
            <Input label="Project URL" value={form.projectUrl} onChange={v => setForm(p => ({ ...p, projectUrl: v }))} placeholder="https://" />
            <Input label="Image URL" value={form.imageUrl} onChange={v => setForm(p => ({ ...p, imageUrl: v }))} placeholder="https://" />
          </div>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your project..." className="w-full bg-[#0c1022] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 mb-4 min-h-[80px]" />
          <Btn variant="primary" onClick={handleCreate}><Globe size={16} /> Publish Project</Btn>
        </Card>
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {loading ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />) :
          projects.length === 0 ? <p className="text-gray-500 col-span-3 text-center py-8">No projects shared yet. Be the first!</p> :
          projects.map(p => (
            <Card key={p.id} className="p-5 cursor-pointer hover:border-violet-500/30 transition-all group" onClick={() => setSelectedProject(p)}>
              <h3 className="font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">{p.title}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{p.description || "No description"}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {p.tags?.slice(0, 3).map((t, i) => <Badge key={i} color="gray" className="text-xs">{t}</Badge>)}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><Heart size={12} />{p.likes}</span>
                <span className="flex items-center gap-1"><MessageCircle size={12} />{p.comments?.length || 0}</span>
              </div>
            </Card>
          ))
        }
      </div>
    </motion.div>
  );
}
