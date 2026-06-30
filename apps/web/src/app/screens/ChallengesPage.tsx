"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Code2, Trophy, ChevronRight, CheckCircle, XCircle, Play, Clock, BarChart3, Filter, ArrowRight } from "lucide-react";
import { Btn, Card, Badge, PageHeader, Input, Skeleton } from "../components/shared";
import { challengesService, type Challenge, type Submission } from "@/services/challenges";

const pageAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }, exit: { opacity: 0, y: -8, transition: { duration: 0.15 } } };

const DIFFICULTY_COLORS: Record<string, string> = { easy: "emerald", medium: "amber", hard: "red" };

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Submission | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([
        challengesService.list(),
        challengesService.submissions(),
      ]);
      setChallenges(c as Challenge[]);
      setSubmissions(s as Submission[]);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === "all" ? challenges : challenges.filter(c => c.difficulty === filter);

  const handleSelect = (c: Challenge) => {
    setSelected(c);
    setCode(c.starterCode || "");
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await challengesService.submit({ challengeId: selected.id, code, language: selected.language });
      setResult(res);
    } catch {}
    setSubmitting(false);
  };

  if (selected) {
    return (
      <motion.div {...pageAnim} className="max-w-5xl mx-auto">
        <button onClick={() => { setSelected(null); setResult(null); }} className="text-violet-400 hover:text-violet-300 mb-4 text-sm">&larr; Back to challenges</button>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Card className="p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl font-bold text-white">{selected.title}</h1>
                <Badge color={DIFFICULTY_COLORS[selected.difficulty] as any}>{selected.difficulty}</Badge>
              </div>
              <p className="text-gray-300 mb-4">{selected.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <Badge color="violet">{selected.language}</Badge>
                {selected.topics?.map((t, i) => <Badge key={i} color="gray">{t}</Badge>)}
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p className="font-medium text-white mb-2">Test Cases:</p>
                {selected.testCases?.map((tc, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-[#0c1022] rounded">
                    <span className="text-xs">Input: {tc.input}</span>
                    <ArrowRight size={12} />
                    <span className="text-xs">Expected: {tc.expected}</span>
                  </div>
                ))}
              </div>
            </Card>
            {result && (
              <Card className={`p-4 ${result.passed ? "border-emerald-500/30" : "border-red-500/30"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.passed ? <CheckCircle size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-red-400" />}
                  <span className={`font-semibold ${result.passed ? "text-emerald-400" : "text-red-400"}`}>{result.passed ? "All Tests Passed!" : "Some Tests Failed"}</span>
                </div>
                <p className="text-gray-400 text-sm mb-1">Score: {result.score}/100</p>
                <pre className="text-gray-400 text-xs bg-[#0c1022] p-2 rounded">{result.output}</pre>
              </Card>
            )}
          </div>
          <div>
            <Card className="p-0 overflow-hidden">
              <div className="p-3 border-b border-white/5 flex items-center justify-between bg-[#0c1022]">
                <span className="text-sm text-white font-mono">{selected.language}</span>
                <Btn variant="primary" size="sm" icon={Play} onClick={handleSubmit} loading={submitting}>Run</Btn>
              </div>
              <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full h-[400px] bg-[#060814] text-green-400 font-mono text-sm p-4 focus:outline-none resize-none" style={{ tabSize: 2 }} spellCheck={false} />
            </Card>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Coding Challenges" subtitle="Sharpen your skills with coding problems"
        actions={
          <div className="flex gap-2">
            {["all", "easy", "medium", "hard"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "bg-[#0c1022] text-slate-500 hover:text-slate-300 border border-white/[0.05]"}`}
              >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>
        }
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />) :
          filtered.map(c => (
            <Card key={c.id} className="p-5 cursor-pointer hover:border-violet-500/30 transition-all group" onClick={() => handleSelect(c)}>
              <div className="flex items-center justify-between mb-3">
                <Badge color={DIFFICULTY_COLORS[c.difficulty] as any}>{c.difficulty}</Badge>
                <Badge color="gray">{c.language}</Badge>
              </div>
              <h3 className="font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">{c.title}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{c.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><Code2 size={12} />{c.topics?.length || 0} topics</span>
                <ChevronRight size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          ))
        }
      </div>
      {submissions.length > 0 && (
        <Card className="p-5 mt-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-violet-400" />Your Submissions</h2>
          <div className="space-y-2">
            {submissions.slice(0, 10).map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-[#0c1022] rounded-lg">
                <div className="flex items-center gap-3">
                  {s.passed ? <CheckCircle size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />}
                  <span className="text-sm text-white">Challenge {s.challengeId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Score: {s.score}%</span>
                  <span className="text-xs text-gray-500">{new Date(s.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
