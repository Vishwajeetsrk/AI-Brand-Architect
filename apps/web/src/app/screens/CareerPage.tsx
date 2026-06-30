"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FileText, Briefcase, Send, Mic, UserCircle, Plus, Search, Trash2, ExternalLink, Clock, CheckCircle, XCircle, Award, ArrowRight } from "lucide-react";
import { Btn, Card, Badge, PageHeader, Input } from "../components/shared";
import { careerService, type Resume, type Job, type JobApplication, type Interview } from "@/services/career";

const pageAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }, exit: { opacity: 0, y: -8, transition: { duration: 0.15 } } };

type Tab = "resumes" | "jobs" | "applications" | "interviews" | "portfolio";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "resumes", label: "Resumes", icon: FileText },
  { id: "jobs", label: "Job Board", icon: Briefcase },
  { id: "applications", label: "Applications", icon: Send },
  { id: "interviews", label: "Interview Practice", icon: Mic },
  { id: "portfolio", label: "Portfolio", icon: UserCircle },
];

export default function CareerPage() {
  const [tab, setTab] = useState<Tab>("resumes");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [r, ap] = await Promise.all([
        careerService.resumes.list().catch(() => []),
        careerService.applications.list().catch(() => []),
      ]);
      setResumes(r as Resume[]);
      setApplications(ap as JobApplication[]);
    } catch {} finally { setLoading(false); }
  };

  const loadJobs = async () => {
    try {
      const res = await careerService.jobs.list(search ? { search } : {});
      setJobs(res.items);
    } catch {}
  };

  const loadInterviews = async () => {
    try {
      const res = await careerService.interviews.list();
      setInterviews(res);
    } catch {}
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (tab === "jobs") loadJobs(); }, [tab, search]);
  useEffect(() => { if (tab === "interviews") loadInterviews(); }, [tab]);
  useEffect(() => { if (tab === "applications") load(); }, [tab]);

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Career Platform" subtitle="Build resumes, find jobs, practice interviews" />
      <div className="flex items-center gap-1 mb-6 bg-white/[0.03] rounded-lg p-1 w-fit border border-white/[0.06]">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${tab === t.id ? 'bg-violet-600/20 text-violet-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {tab === "resumes" && <ResumesTab resumes={resumes} onUpdate={load} />}
      {tab === "jobs" && <JobsTab jobs={jobs} search={search} onSearch={setSearch} onApply={load} />}
      {tab === "applications" && <ApplicationsTab applications={applications} />}
      {tab === "interviews" && <InterviewsTab interviews={interviews} onUpdate={loadInterviews} />}
      {tab === "portfolio" && <PortfolioTab />}
    </motion.div>
  );
}

function ResumesTab({ resumes, onUpdate }: { resumes: Resume[]; onUpdate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", fullName: "", email: "", phone: "", location: "", headline: "", summary: "", skills: "" });
  const [creating, setCreating] = useState(false);

  const createResume = async () => {
    setCreating(true);
    try {
      await careerService.resumes.create({ ...form, skills: form.skills.split(",").map(s => s.trim()) });
      setShowForm(false);
      setForm({ title: "", fullName: "", email: "", phone: "", location: "", headline: "", summary: "", skills: "" });
      onUpdate();
    } catch {} finally { setCreating(false); }
  };

  const deleteResume = async (id: string) => {
    try { await careerService.resumes.delete(id); onUpdate(); } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-slate-500">{resumes.length} resume{resumes.length !== 1 ? "s" : ""}</div>
        <Btn variant="primary" size="sm" icon={Plus} onClick={() => setShowForm(!showForm)}>New Resume</Btn>
      </div>
      {showForm && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input label="Resume Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="e.g. Software Engineer Resume" />
            <Input label="Full Name" value={form.fullName} onChange={v => setForm(p => ({ ...p, fullName: v }))} />
            <Input label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
            <Input label="Phone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
            <Input label="Location" value={form.location} onChange={v => setForm(p => ({ ...p, location: v }))} />
            <Input label="Headline" value={form.headline} onChange={v => setForm(p => ({ ...p, headline: v }))} />
            <div className="col-span-2"><Input label="Summary" value={form.summary} onChange={v => setForm(p => ({ ...p, summary: v }))} /></div>
            <div className="col-span-2"><Input label="Skills (comma separated)" value={form.skills} onChange={v => setForm(p => ({ ...p, skills: v }))} /></div>
          </div>
          <Btn variant="primary" size="sm" onClick={createResume} loading={creating}>Create Resume</Btn>
        </Card>
      )}
      {resumes.length === 0 && !showForm && (
        <Card className="p-8 text-center"><FileText size={32} className="mx-auto mb-2 text-slate-600" /><p className="text-sm text-slate-500">No resumes yet. Create your first one!</p></Card>
      )}
      <div className="grid grid-cols-2 gap-4">
        {resumes.map(r => (
          <Card key={r.id} className="p-4 group">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-bold text-white">{r.title}</h4>
                <p className="text-xs text-slate-400">{r.fullName} &middot; {r.email}</p>
              </div>
              <button onClick={() => deleteResume(r.id)} className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
            </div>
            {r.headline && <p className="text-xs text-slate-500 mb-2">{r.headline}</p>}
            <div className="flex flex-wrap gap-1 mb-2">{r.skills.slice(0, 5).map(s => <Badge key={s} color="gray">{s}</Badge>)}</div>
            <div className="flex items-center gap-3 text-[10px] text-slate-600">
              <span>{r.sections?.length || 0} sections</span>
              <span>{r.isPublic ? "Public" : "Private"}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function JobsTab({ jobs, search, onSearch, onApply }: { jobs: Job[]; search: string; onSearch: (s: string) => void; onApply: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1"><Input placeholder="Search jobs..." value={search} onChange={onSearch} icon={Search} /></div>
      </div>
      {jobs.length === 0 ? (
        <Card className="p-8 text-center"><Briefcase size={32} className="mx-auto mb-2 text-slate-600" /><p className="text-sm text-slate-500">No jobs found. Check back later!</p></Card>
      ) : (
        <div className="space-y-3">
          {jobs.map(j => (
            <Card key={j.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {j.companyLogo ? <img src={j.companyLogo} alt="" className="w-10 h-10 rounded-lg bg-white/5" /> : <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center"><Briefcase size={18} className="text-violet-400" /></div>}
                  <div>
                    <h4 className="text-sm font-bold text-white">{j.title}</h4>
                    <p className="text-xs text-slate-400">{j.company} &middot; {j.location}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge color={j.workMode === "REMOTE" ? "green" : "blue"}>{j.workMode}</Badge>
                      <Badge color="gray">{j.type}</Badge>
                      {j.salaryMin && <span className="text-[10px] text-slate-500">${j.salaryMin} - ${j.salaryMax}</span>}
                    </div>
                  </div>
                </div>
                <Btn variant="primary" size="sm" onClick={async () => { try { await careerService.jobs.apply(j.id, {}); onApply(); } catch {} }}>Apply</Btn>
              </div>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{j.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">{j.requirements.slice(0, 3).map(r => <Badge key={r} color="gray">{r}</Badge>)}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationsTab({ applications }: { applications: JobApplication[] }) {
  const statusColors: Record<string, string> = { APPLIED: "blue", SCREENING: "yellow", ASSESSMENT: "violet", INTERVIEW: "cyan", OFFER: "emerald", HIRED: "green", REJECTED: "red", WITHDRAWN: "gray" };
  return (
    <div>
      {applications.length === 0 ? (
        <Card className="p-8 text-center"><Send size={32} className="mx-auto mb-2 text-slate-600" /><p className="text-sm text-slate-500">No applications yet. Start applying to jobs!</p></Card>
      ) : (
        <div className="space-y-3">
          {applications.map(a => (
            <Card key={a.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center"><Briefcase size={18} className="text-blue-400" /></div>
                <div>
                  <p className="text-sm font-bold text-white">{a.job?.title || "Unknown Job"}</p>
                  <p className="text-xs text-slate-400">{a.job?.company || ""} &middot; {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {a.matchScore && <span className="text-xs text-emerald-400 font-medium">{a.matchScore}% match</span>}
                <Badge color={statusColors[a.status] || "gray"}>{a.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function InterviewsTab({ interviews, onUpdate }: { interviews: Interview[]; onUpdate: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("MOCK");
  const [jobTitle, setJobTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [active, setActive] = useState<Interview | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const create = async () => {
    setCreating(true);
    try { await careerService.interviews.create({ title: title || `${type} Interview Practice`, type, jobTitle: jobTitle || undefined }); onUpdate(); setTitle(""); } catch {} finally { setCreating(false); }
  };

  const saveAns = async (qId: string) => {
    if (!active) return;
    try { await careerService.interviews.saveAnswer(active.id, qId, answers[qId] || ""); } catch {}
  };

  const complete = async () => {
    if (!active) return;
    try { const res = await careerService.interviews.complete(active.id); setActive(res); onUpdate(); } catch {}
  };

  if (active) {
    const allAnswered = active.questions.every(q => q.userAnswer || answers[q.id]);
    return (
      <div>
        <Btn variant="ghost" size="sm" onClick={() => { setActive(null); setAnswers({}); }} className="mb-4">&larr; Back to interviews</Btn>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="font-bold text-white text-sm">{active.title}</h3><p className="text-xs text-slate-500">{active.jobTitle && `${active.jobTitle} at ${active.companyName}`} &middot; {active.difficulty}</p></div>
            {active.completedAt && <Badge color="green">Score: {active.score}%</Badge>}
          </div>
          {active.completedAt ? (
            <div className="text-center py-6">
              <Award size={40} className="mx-auto mb-2 text-violet-400" />
              <p className="text-sm text-white font-bold mb-1">Score: {active.score}%</p>
              <p className="text-xs text-slate-400">{active.feedback}</p>
              <Btn variant="primary" size="sm" className="mt-4" onClick={() => { setActive(null); setAnswers({}); }}>Done</Btn>
            </div>
          ) : (
            <div className="space-y-4">
              {active.questions.map((q, i) => (
                <div key={q.id}>
                  <p className="text-xs text-slate-300 mb-1"><span className="text-violet-400 font-medium">Q{i + 1}.</span> {q.question}</p>
                  <div className="flex gap-2">
                    <input className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-violet-500/40" placeholder="Type your answer..." value={answers[q.id] ?? q.userAnswer ?? ""} onChange={e => setAnswers(p => ({ ...p, [q.id]: e.target.value }))} />
                    <Btn variant="secondary" size="sm" onClick={() => saveAns(q.id)}>Save</Btn>
                  </div>
                </div>
              ))}
              <Btn variant="primary" onClick={complete} disabled={!allAnswered} className="w-full">Complete Interview</Btn>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="p-4 mb-4">
        <div className="flex items-end gap-3">
          <Input label="Interview Title" value={title} onChange={setTitle} placeholder="e.g. Frontend Engineer Mock" className="flex-1" />
          <div><label className="text-[10px] text-slate-500 block mb-1">Type</label><select value={type} onChange={e => setType(e.target.value)} className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white"><option value="MOCK">Mock</option><option value="TECHNICAL">Technical</option><option value="BEHAVIORAL">Behavioral</option></select></div>
          <Input label="Job Title (optional)" value={jobTitle} onChange={setJobTitle} placeholder="e.g. Software Engineer" className="w-48" />
          <Btn variant="primary" size="sm" onClick={create} loading={creating} icon={Plus}>Start</Btn>
        </div>
      </Card>
      {interviews.length === 0 ? (
        <Card className="p-8 text-center"><Mic size={32} className="mx-auto mb-2 text-slate-600" /><p className="text-sm text-slate-500">No interviews yet. Start practicing!</p></Card>
      ) : (
        <div className="space-y-3">
          {interviews.map(i => (
            <Card key={i.id} className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]" onClick={() => { careerService.interviews.get(i.id).then(setActive); }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-600/20 flex items-center justify-center"><Mic size={18} className="text-cyan-400" /></div>
                <div>
                  <p className="text-sm font-bold text-white">{i.title}</p>
                  <p className="text-xs text-slate-400">{i.jobTitle || "General"} &middot; {i.questionsCount} questions &middot; {i.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {i.completedAt ? <Badge color="green">{i.score}%</Badge> : <Badge color="yellow">In Progress</Badge>}
                <ArrowRight size={14} className="text-slate-600" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PortfolioTab() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", bio: "", skills: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { const p = await careerService.portfolios.get(); setPortfolio(p); } catch {} finally { setLoading(false); } })(); }, []);

  const create = async () => {
    try {
      const p = await careerService.portfolios.create({ ...form, skills: form.skills.split(",").map(s => s.trim()) });
      setPortfolio(p);
    } catch {}
  };

  if (loading) return <Card className="p-8 text-center"><p className="text-sm text-slate-500">Loading...</p></Card>;

  if (!portfolio) return (
    <Card className="p-6 max-w-lg mx-auto">
      <h3 className="font-bold text-white text-sm mb-4">Create Your Portfolio</h3>
      <div className="space-y-3">
        <Input label="Portfolio Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
        <Input label="Subtitle" value={form.subtitle} onChange={v => setForm(p => ({ ...p, subtitle: v }))} />
        <Input label="Bio" value={form.bio} onChange={v => setForm(p => ({ ...p, bio: v }))} />
        <Input label="Skills (comma separated)" value={form.skills} onChange={v => setForm(p => ({ ...p, skills: v }))} />
        <Btn variant="primary" onClick={create}>Create Portfolio</Btn>
      </div>
    </Card>
  );

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div><h3 className="font-bold text-white text-sm">{portfolio.title}</h3><p className="text-xs text-slate-400">{portfolio.subtitle}</p></div>
        <Badge color={portfolio.isPublic ? "green" : "yellow"}>{portfolio.isPublic ? "Public" : "Private"}</Badge>
      </div>
      {portfolio.bio && <p className="text-xs text-slate-500 mb-4">{portfolio.bio}</p>}
      <div className="flex flex-wrap gap-1 mb-4">{portfolio.skills?.map((s: string) => <Badge key={s} color="gray">{s}</Badge>)}</div>
      <h4 className="text-xs font-bold text-white mb-2">Projects ({portfolio.projects?.length || 0})</h4>
      <div className="grid grid-cols-2 gap-3">
        {portfolio.projects?.map((p: any) => (
          <Card key={p.id} className="p-3">
            <h5 className="text-xs font-bold text-white mb-1">{p.title}</h5>
            <p className="text-[10px] text-slate-500 line-clamp-2">{p.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">{p.technologies?.slice(0, 3).map((t: string) => <Badge key={t} color="gray">{t}</Badge>)}</div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
