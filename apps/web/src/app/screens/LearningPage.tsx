"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  BookOpen, ChevronDown, ChevronRight, Play, CheckCircle, Clock,
  Star, User, Users, BarChart3, Award, GraduationCap, Search, Filter,
  ArrowLeft, ArrowRight, AlertCircle, Zap, Layers, Trophy,
  Copy, X, RefreshCw,
} from "lucide-react";
import { Btn, Card, Badge, PageHeader, Input, EmptyPlaceholder } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

interface Course {
  id: string; title: string; description: string; thumbnail: string;
  category: string; level: string; duration: number; instructor: string;
  rating: number; enrolledCount: number; price: number; skills: string[];
  modules: string[]; status: string; createdAt: string;
}
interface Mod {
  id: string; courseId: string; title: string; description: string;
  order: number; lessons: string[]; duration: number;
}
interface Lesson {
  id: string; moduleId: string; title: string; type: string;
  content: string; duration: number; order: number; completed: boolean;
}
interface Enrollment {
  id: string; courseId: string; userId: string; progress: number;
  completedLessons: string[]; startedAt: string; completedAt?: string;
}
interface QuizQ {
  id: string; text: string; type: string; options: string[]; points: number;
}
interface QuizData {
  id: string; lessonId: string; questions: QuizQ[];
  passingScore: number; timeLimit: number; attempts: number;
}
interface Cert {
  id: string; enrollmentId: string; courseName: string;
  userName: string; issuedAt: string; credentialId: string;
}
interface LearningPath {
  id: string; name: string; description: string; courses: string[];
  duration: number; estimatedHours: number; skills: string[];
}

const USER_ID = "user-1";

const levelColors: Record<string, string> = {
  beginner: "green", intermediate: "blue", advanced: "red",
};
const typeIcons: Record<string, typeof Play> = {
  video: Play, article: BookOpen, quiz: AlertCircle, code: Copy, live: Zap,
};

export default function LearningPage() {
  const [tab, setTab] = useState("catalog");
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Cert[]>([]);
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Mod[]>([]);
  const [expandedMod, setExpandedMod] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getSampleData();
    setCourses(data.courses);
    setEnrollments(data.enrollments);
    setCertificates(data.certificates);
    setPaths(data.paths);
    setLoading(false);
  }, []);

  const filtered = courses.filter(c => {
    if (filter !== "all" && c.category !== filter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCourse = useCallback((course: Course) => {
    setSelectedCourse(course);
    setCurrentLesson(null);
    setQuiz(null);
    const data = getSampleData();
    setModules(data.modules.filter(m => m.courseId === course.id));
    setExpandedMod(null);
  }, []);

  const openLesson = useCallback((lesson: Lesson) => {
    setCurrentLesson(lesson);
    setQuiz(null);
    setQuizResult(null);
    if (lesson.type === "quiz") {
      const data = getSampleData();
      const found = data.quizzes.find(q => q.lessonId === lesson.id);
      if (found) {
        setQuiz(found);
        setQuizTimeLeft(found.timeLimit);
        setQuizAnswers({});
        setQuizResult(null);
      }
    }
  }, []);

  const goBack = useCallback(() => {
    if (currentLesson || quiz) { setCurrentLesson(null); setQuiz(null); setQuizResult(null); return; }
    if (selectedCourse) { setSelectedCourse(null); setModules([]); return; }
  }, [currentLesson, quiz, selectedCourse]);

  const submitQuiz = useCallback(() => {
    if (!quiz) return;
    let score = 0;
    let total = 0;
    const answers = quiz.questions.map(q => {
      total += q.points;
      const userAns = quizAnswers[q.id] || "";
      const correct = q.type === "mcq" || q.type === "truefalse"
        ? userAns.toLowerCase().trim() === q.options[0].toLowerCase().trim()
        : userAns.toLowerCase().includes("correct");
      if (correct) score += q.points;
      return { questionId: q.id, correct, points: correct ? q.points : 0 };
    });
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    setQuizResult({ score, total, percentage: pct, passed: pct >= quiz.passingScore, answers });
  }, [quiz, quizAnswers]);

  const enroll = useCallback((courseId: string) => {
    const exists = enrollments.find(e => e.courseId === courseId);
    if (!exists) {
      const newEnroll: Enrollment = {
        id: `enr-${Date.now()}`, courseId, userId: USER_ID,
        progress: 0, completedLessons: [], startedAt: new Date().toISOString(),
      };
      setEnrollments(prev => [...prev, newEnroll]);
    }
  }, [enrollments]);

  const getProgress = (courseId: string) => {
    const e = enrollments.find(en => en.courseId === courseId);
    return e ? e.progress : 0;
  };

  const getCourseLessons = (courseId: string) => {
    return modules.filter(m => m.courseId === courseId).flatMap(m =>
      getSampleData().lessons.filter(l => l.moduleId === m.id)
    );
  };

  const isEnrolled = (courseId: string) => enrollments.some(e => e.courseId === courseId);

  const renderStars = (r: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={10} className={i <= Math.round(r) ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
      ))}
    </div>
  );

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (loading) {
    return (
      <motion.div {...pageAnim} className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </motion.div>
    );
  }

  /* Quiz view */
  if (quiz && currentLesson) {
    return (
      <motion.div {...pageAnim}>
        <div className="flex items-center gap-3 mb-6">
          <Btn variant="ghost" size="sm" icon={ArrowLeft} onClick={goBack}>Back to Lesson</Btn>
        </div>
        <Card className="p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">{currentLesson.title}</h2>
            <Badge color="yellow">{formatTime(quizTimeLeft)}</Badge>
          </div>
          {quizResult ? (
            <div className="text-center py-6">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${quizResult.passed ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                {quizResult.passed ? <Trophy size={36} className="text-emerald-400" /> : <X size={36} className="text-red-400" />}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${quizResult.passed ? "text-emerald-400" : "text-red-400"}`}>
                {quizResult.passed ? "Congratulations!" : "Try Again"}
              </h3>
              <p className="text-slate-400 mb-4">You scored {quizResult.score} / {quizResult.total} ({quizResult.percentage}%)</p>
              <div className="w-full bg-white/5 rounded-full h-3 mb-6 max-w-xs mx-auto">
                <div className={`h-3 rounded-full transition-all ${quizResult.passed ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${quizResult.percentage}%` }} />
              </div>
              <Btn variant="primary" icon={ArrowRight} onClick={() => { setQuizResult(null); setQuizAnswers({}); setQuizTimeLeft(quiz.timeLimit); }}>
                {quizResult.passed ? "Continue" : "Retry Quiz"}
              </Btn>
            </div>
          ) : (
            <>
              <div className="space-y-5 mb-6">
                {quiz.questions.map((q, i) => (
                  <div key={q.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-sm font-semibold text-white mb-3">{i + 1}. {q.text} <span className="text-slate-600 font-normal">({q.points}pts)</span></p>
                    {q.type === "truefalse" ? (
                      <div className="flex gap-3">
                        {["True", "False"].map(opt => (
                          <button key={opt} onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className={`px-5 py-2 rounded-lg text-xs font-semibold border transition-all ${quizAnswers[q.id] === opt ? "bg-violet-500/25 border-violet-500/50 text-violet-300" : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : q.type === "mcq" ? (
                      <div className="space-y-2">
                        {q.options.map(opt => (
                          <button key={opt} onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-xs border transition-all ${quizAnswers[q.id] === opt ? "bg-violet-500/25 border-violet-500/50 text-violet-300" : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input value={quizAnswers[q.id] || ""} onChange={e => setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        className="w-full bg-[#111336] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50" placeholder="Type your answer..." />
                    )}
                  </div>
                ))}
              </div>
              <Btn variant="primary" className="w-full" onClick={submitQuiz}>Submit Quiz</Btn>
            </>
          )}
        </Card>
      </motion.div>
    );
  }

  /* Lesson player */
  if (currentLesson) {
    const allMods = modules;
    const allLessons = allMods.flatMap(m => getSampleData().lessons.filter(l => l.moduleId === m.id).map(l => ({ ...l, modTitle: m.title })));
    const idx = allLessons.findIndex(l => l.id === currentLesson.id);
    const prevL = idx > 0 ? allLessons[idx - 1] : null;
    const nextL = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
    const Icon = typeIcons[currentLesson.type] || BookOpen;

    return (
      <motion.div {...pageAnim}>
        <div className="flex items-center gap-3 mb-4">
          <Btn variant="ghost" size="sm" icon={ArrowLeft} onClick={goBack}>Back to Course</Btn>
        </div>
        <Card className="p-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Icon size={18} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{currentLesson.title}</h2>
              <p className="text-xs text-slate-500 capitalize">{currentLesson.type} &middot; {formatTime(currentLesson.duration)}</p>
            </div>
          </div>
          {currentLesson.type !== "quiz" && (
            <div className="p-6 rounded-xl bg-gradient-to-br from-violet-600/10 to-blue-600/5 border border-violet-500/20 mb-6 min-h-[200px] flex items-center justify-center">
              <p className="text-slate-400 text-sm">{currentLesson.type === "video" ? "▶ " : currentLesson.type === "code" ? "</> " : ""}{currentLesson.content}</p>
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            {prevL ? (
              <Btn variant="ghost" size="sm" icon={ArrowLeft} onClick={() => {
                const found = getSampleData().lessons.find(l => l.id === prevL.id);
                if (found) openLesson(found);
              }}>{prevL.title.slice(0, 20)}...</Btn>
            ) : <div />}
            <div className="flex gap-2">
              {currentLesson.type === "quiz" && (
                <Btn variant="primary" size="sm" icon={AlertCircle} onClick={() => {
                  const data = getSampleData();
                  const found = data.quizzes.find(q => q.lessonId === currentLesson.id);
                  if (found) { setQuiz(found); setQuizTimeLeft(found.timeLimit); setQuizAnswers({}); setQuizResult(null); }
                }}>Start Quiz</Btn>
              )}
              {nextL && (
                <Btn variant="primary" size="sm" icon={ArrowRight} onClick={() => {
                  const found = getSampleData().lessons.find(l => l.id === nextL.id);
                  if (found) openLesson(found);
                }}>Next</Btn>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  /* Course detail view */
  if (selectedCourse) {
    const enrolled = isEnrolled(selectedCourse.id);
    const progress = getProgress(selectedCourse.id);
    const courseMods = modules;
    const allLessons = courseMods.flatMap(m => getSampleData().lessons.filter(l => l.moduleId === m.id));

    return (
      <motion.div {...pageAnim}>
        <Btn variant="ghost" size="sm" icon={ArrowLeft} onClick={goBack} className="mb-4">Back to Catalog</Btn>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-5">
            <Card className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-32 h-24 rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={36} className="text-violet-400" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">{selectedCourse.title}</h1>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge color={levelColors[selectedCourse.level] || "gray"}>{selectedCourse.level}</Badge>
                    <Badge color="violet">{selectedCourse.category}</Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{selectedCourse.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User size={12} /> {selectedCourse.instructor}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(selectedCourse.duration)}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {selectedCourse.enrolledCount.toLocaleString()} enrolled</span>
                    <span className="flex items-center gap-1">{renderStars(selectedCourse.rating)} {selectedCourse.rating}</span>
                  </div>
                </div>
              </div>
              {!enrolled ? (
                <Btn variant="primary" icon={GraduationCap} className="mt-4 w-full" onClick={() => enroll(selectedCourse.id)}>
                  {selectedCourse.price === 0 ? "Enroll Free" : `Enroll - $${selectedCourse.price}`}
                </Btn>
              ) : (
                <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-xs font-semibold text-violet-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {selectedCourse.skills.map(s => <Badge key={s} color="gray">{s}</Badge>)}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-bold text-white text-sm mb-4">Course Content ({allLessons.length} lessons)</h3>
              <div className="space-y-2">
                {courseMods.map(mod => {
                  const modLessons = getSampleData().lessons.filter(l => l.moduleId === mod.id);
                  const isOpen = expandedMod === mod.id;
                  const completed = modLessons.filter(l => l.completed).length;
                  return (
                    <div key={mod.id} className="rounded-xl border border-white/[0.06] overflow-hidden">
                      <button onClick={() => setExpandedMod(isOpen ? null : mod.id)}
                        className="w-full flex items-center gap-3 p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left">
                        {isOpen ? <ChevronDown size={14} className="text-violet-400" /> : <ChevronRight size={14} className="text-slate-500" />}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{mod.title}</p>
                          <p className="text-[11px] text-slate-500">{modLessons.length} lessons &middot; {formatTime(mod.duration)}</p>
                        </div>
                        {enrolled && <span className="text-xs text-slate-500">{completed}/{modLessons.length}</span>}
                      </button>
                      {isOpen && (
                        <div className="border-t border-white/[0.06]">
                          {modLessons.map(lesson => {
                            const LIcon = typeIcons[lesson.type] || BookOpen;
                            return (
                              <button key={lesson.id} onClick={() => openLesson(lesson)}
                                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/[0.03] transition-colors text-left group">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${lesson.completed ? "bg-emerald-500/20" : "bg-white/[0.05] group-hover:bg-violet-500/20"}`}>
                                  {lesson.completed ? <CheckCircle size={12} className="text-emerald-400" /> : <LIcon size={12} className="text-slate-500 group-hover:text-violet-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-medium truncate ${lesson.completed ? "text-slate-400" : "text-slate-300"}`}>{lesson.title}</p>
                                  <p className="text-[10px] text-slate-600">{formatTime(lesson.duration)}</p>
                                </div>
                                {lesson.type === "quiz" && <Badge color="yellow">Quiz</Badge>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-white text-sm mb-3">Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {selectedCourse.instructor.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{selectedCourse.instructor}</p>
                  <p className="text-[11px] text-slate-500">Course Instructor</p>
                </div>
              </div>
            </Card>
            {enrolled && progress >= 100 && (
              <Card className="p-5 bg-gradient-to-br from-emerald-600/15 to-teal-600/10 border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <Award size={24} className="text-emerald-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Course Completed!</p>
                    <p className="text-xs text-slate-400">Certificate available</p>
                  </div>
                </div>
              </Card>
            )}
            <Card className="p-5">
              <h3 className="font-bold text-white text-sm mb-3">Course Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Duration</span>
                  <span className="text-slate-300">{formatTime(selectedCourse.duration)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Modules</span>
                  <span className="text-slate-300">{courseMods.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Lessons</span>
                  <span className="text-slate-300">{allLessons.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Level</span>
                  <Badge color={levelColors[selectedCourse.level] || "gray"}>{selectedCourse.level}</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    );
  }

  /* Main tabs */
  const tabs = [
    { id: "catalog", label: "Course Catalog", icon: BookOpen },
    { id: "learning", label: "My Learning", icon: BarChart3 },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "paths", label: "Learning Paths", icon: Layers },
  ];

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Learning Platform" subtitle="Upskill with AI-powered courses"
        actions={<Input icon={Search} placeholder="Search courses..." value={search} onChange={setSearch} className="w-60" />}
      />
      <div className="flex gap-1.5 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.id ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "bg-[#0c1022] text-slate-600 hover:text-slate-300 border border-white/[0.05]"}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Catalog tab */}
      {tab === "catalog" && (
        <>
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {["all", "Branding", "Marketing", "Design", "Content"].map(c => (
              <button key={c} onClick={() => setFilter(c === "all" ? "all" : c)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${filter === c ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "bg-[#0c1022] text-slate-600 hover:text-slate-300 border border-white/[0.05]"}`}>
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {filtered.map(course => {
              const enrolled = isEnrolled(course.id);
              const progress = getProgress(course.id);
              return (
                <Card key={course.id} onClick={() => openCourse(course)} className="p-4 group cursor-pointer">
                  <div className="h-36 rounded-lg bg-gradient-to-br from-violet-600/20 to-blue-600/10 flex items-center justify-center mb-3 group-hover:from-violet-600/30 transition-all overflow-hidden">
                    <GraduationCap size={40} className="text-violet-400/60 group-hover:text-violet-300 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge color={levelColors[course.level] || "gray"}>{course.level}</Badge>
                    <Badge color="violet">{course.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Clock size={10} /> {formatTime(course.duration)}</span>
                    <span className="flex items-center gap-1">{renderStars(course.rating)}</span>
                  </div>
                  {enrolled ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-500">Progress</span>
                        <span className="text-[10px] font-semibold text-violet-400">{progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {course.price === 0 ? "Free" : `$${course.price}`}
                      </span>
                      <Btn variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); enroll(course.id); }}>Enroll</Btn>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <EmptyPlaceholder icon={BookOpen} title="No courses found" desc="Try adjusting your search or filters." />
          )}
        </>
      )}

      {/* My Learning tab */}
      {tab === "learning" && (
        <>
          {enrollments.length === 0 ? (
            <EmptyPlaceholder icon={BarChart3} title="Not enrolled in any courses"
              desc="Browse the catalog and start your learning journey." action={<Btn variant="primary" onClick={() => setTab("catalog")}>Browse Courses</Btn>} />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {enrollments.map(enr => {
                const course = courses.find(c => c.id === enr.courseId);
                if (!course) return null;
                return (
                  <Card key={enr.id} onClick={() => openCourse(course)} className="p-5 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={24} className="text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm mb-1">{course.title}</h3>
                        <Badge color={levelColors[course.level]}>{course.level}</Badge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400">Progress</span>
                        <span className="text-xs font-semibold text-violet-400">{enr.progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${enr.progress}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-[10px] text-slate-600">
                      <span>Started {new Date(enr.startedAt).toLocaleDateString()}</span>
                      {enr.progress >= 100 && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle size={10} /> Completed</span>}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Certificates tab */}
      {tab === "certificates" && (
        <>
          {certificates.length === 0 ? (
            <EmptyPlaceholder icon={Award} title="No certificates yet"
              desc="Complete a course to earn your first certificate." action={<Btn variant="primary" onClick={() => setTab("catalog")}>Browse Courses</Btn>} />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {certificates.map(cert => (
                <Card key={cert.id} className="p-6 text-center group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/10 mx-auto mb-4 flex items-center justify-center">
                    <Award size={28} className="text-amber-400" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{cert.courseName}</h3>
                  <p className="text-xs text-slate-500 mb-1">{cert.userName}</p>
                  <p className="text-[10px] text-slate-600 mb-3">Issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-[9px] text-slate-600 font-mono">{cert.credentialId}</p>
                  </div>
                  <Btn variant="outline" size="sm" className="mt-3 w-full" icon={Award}>View Certificate</Btn>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Learning Paths tab */}
      {tab === "paths" && (
        <div className="space-y-4">
          {paths.map(path => {
            const pathCourses = courses.filter(c => path.courses.includes(c.id));
            const completed = pathCourses.filter(c => {
              const e = enrollments.find(en => en.courseId === c.id);
              return e && e.progress >= 100;
            }).length;
            return (
              <Card key={path.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                    <Layers size={20} className="text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-base">{path.name}</h3>
                      <Badge color="cyan">{path.estimatedHours}h</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{path.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      {path.skills.map(s => <Badge key={s} color="gray">{s}</Badge>)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 max-w-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500">{completed}/{pathCourses.length} courses completed</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${pathCourses.length > 0 ? (completed / pathCourses.length) * 100 : 0}%` }} />
                        </div>
                      </div>
                      <Btn variant="primary" size="sm" icon={ArrowRight}>Start Path</Btn>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

/* ── Sample Data ── */
function getSampleData() {
  const courses: Course[] = [
    { id: "course-1", title: "Brand Identity Fundamentals", description: "Master the art of building a powerful brand identity from the ground up.", thumbnail: "", category: "Branding", level: "beginner", duration: 480, instructor: "Sarah Chen", rating: 4.7, enrolledCount: 2340, price: 0, status: "published", skills: ["branding", "identity", "design", "strategy"], modules: ["module-1", "module-2", "module-3"], createdAt: "2025-01-15" },
    { id: "course-2", title: "AI-Powered Marketing", description: "Leverage artificial intelligence to supercharge your marketing campaigns.", thumbnail: "", category: "Marketing", level: "intermediate", duration: 360, instructor: "Alex Rivera", rating: 4.8, enrolledCount: 1840, price: 29, status: "published", skills: ["AI", "marketing", "automation", "analytics"], modules: ["module-4", "module-5"], createdAt: "2025-02-10" },
    { id: "course-3", title: "Advanced Color Theory", description: "Deep dive into color psychology and advanced palette creation.", thumbnail: "", category: "Design", level: "advanced", duration: 240, instructor: "Maya Patel", rating: 4.6, enrolledCount: 980, price: 49, status: "published", skills: ["color", "design", "psychology", "accessibility"], modules: ["module-6"], createdAt: "2025-03-05" },
    { id: "course-4", title: "Content Strategy Playbook", description: "Build a content engine that drives engagement and conversions.", thumbnail: "", category: "Content", level: "intermediate", duration: 420, instructor: "James Wilson", rating: 4.5, enrolledCount: 1560, price: 39, status: "published", skills: ["content", "strategy", "SEO", "writing"], modules: ["module-7"], createdAt: "2025-04-01" },
    { id: "course-5", title: "UX Design for Brands", description: "Create seamless brand experiences through exceptional UX design.", thumbnail: "", category: "Design", level: "intermediate", duration: 540, instructor: "Lena Kim", rating: 4.9, enrolledCount: 2100, price: 59, status: "published", skills: ["UX", "design", "research", "prototyping"], modules: ["module-8"], createdAt: "2025-04-20" },
    { id: "course-6", title: "Social Media Mastery", description: "Dominate social platforms with data-driven strategies.", thumbnail: "", category: "Marketing", level: "beginner", duration: 300, instructor: "David Park", rating: 4.4, enrolledCount: 3200, price: 19, status: "published", skills: ["social-media", "marketing", "analytics", "content"], modules: ["module-9"], createdAt: "2025-05-10" },
  ];

  const modules: Mod[] = [
    { id: "module-1", courseId: "course-1", title: "Introduction to Branding", description: "Core concepts of brand identity", order: 0, lessons: ["lesson-1", "lesson-2", "lesson-3"], duration: 1800 },
    { id: "module-2", courseId: "course-1", title: "Visual Identity Systems", description: "Colors, typography, and visual language", order: 1, lessons: ["lesson-4", "lesson-5", "lesson-6"], duration: 2400 },
    { id: "module-3", courseId: "course-1", title: "Brand Strategy", description: "Positioning and market differentiation", order: 2, lessons: ["lesson-7", "lesson-8", "lesson-9"], duration: 2940 },
    { id: "module-4", courseId: "course-2", title: "AI Marketing Fundamentals", description: "Understanding AI in marketing", order: 0, lessons: ["lesson-10", "lesson-11", "lesson-12"], duration: 1500 },
    { id: "module-5", courseId: "course-2", title: "Campaign Automation", description: "Building automated marketing campaigns", order: 1, lessons: ["lesson-13", "lesson-14", "lesson-15"], duration: 2700 },
    { id: "module-6", courseId: "course-3", title: "Color Science", description: "Advanced color theory applications", order: 0, lessons: ["lesson-16", "lesson-17", "lesson-18"], duration: 1500 },
    { id: "module-7", courseId: "course-4", title: "Content Pillars", description: "Building your content framework", order: 0, lessons: ["lesson-19", "lesson-20", "lesson-21"], duration: 1800 },
    { id: "module-8", courseId: "course-5", title: "UX Research Methods", description: "Understanding user needs", order: 0, lessons: ["lesson-22", "lesson-23", "lesson-24"], duration: 3240 },
    { id: "module-9", courseId: "course-6", title: "Platform Strategy", description: "Platform-specific content strategies", order: 0, lessons: ["lesson-25", "lesson-26", "lesson-27"], duration: 2280 },
  ];

  const lessons: Lesson[] = [
    { id: "lesson-1", moduleId: "module-1", title: "What is a Brand?", type: "video", content: "Video content: Understanding the fundamental concept of branding and its importance in modern business.", duration: 600, order: 0, completed: false },
    { id: "lesson-2", moduleId: "module-1", title: "Brand Anatomy", type: "article", content: "Article content: Breaking down the components that make up a complete brand identity system.", duration: 900, order: 1, completed: false },
    { id: "lesson-3", moduleId: "module-1", title: "Brand Identity Quiz", type: "quiz", content: "", duration: 300, order: 2, completed: false },
    { id: "lesson-4", moduleId: "module-2", title: "Color Psychology Deep Dive", type: "video", content: "Video content: How colors influence perception and decision-making.", duration: 720, order: 0, completed: false },
    { id: "lesson-5", moduleId: "module-2", title: "Typography Selection Guide", type: "article", content: "Article content: Choosing the right typefaces for your brand.", duration: 480, order: 1, completed: false },
    { id: "lesson-6", moduleId: "module-2", title: "Visual Identity Lab", type: "code", content: "Interactive code lab: Build a visual identity system with CSS and SVG.", duration: 1200, order: 2, completed: false },
    { id: "lesson-7", moduleId: "module-3", title: "Competitive Analysis", type: "video", content: "Video content: Analyzing competitors to find your unique position.", duration: 540, order: 0, completed: false },
    { id: "lesson-8", moduleId: "module-3", title: "Brand Voice & Tone", type: "article", content: "Article content: Defining how your brand communicates across channels.", duration: 600, order: 1, completed: false },
    { id: "lesson-9", moduleId: "module-3", title: "Strategy Workshop", type: "live", content: "Live session: Interactive strategy workshop with real-time feedback.", duration: 1800, order: 2, completed: false },
    { id: "lesson-10", moduleId: "module-4", title: "AI Marketing Landscape", type: "video", content: "Video content: Overview of AI tools transforming the marketing industry.", duration: 660, order: 0, completed: false },
    { id: "lesson-11", moduleId: "module-4", title: "Predictive Analytics", type: "article", content: "Article content: Using data to predict customer behavior and optimize campaigns.", duration: 540, order: 1, completed: false },
    { id: "lesson-12", moduleId: "module-4", title: "AI Tools Quiz", type: "quiz", content: "", duration: 300, order: 2, completed: false },
    { id: "lesson-13", moduleId: "module-5", title: "Workflow Design", type: "video", content: "Video content: Designing effective automated marketing workflows.", duration: 780, order: 0, completed: false },
    { id: "lesson-14", moduleId: "module-5", title: "A/B Testing Framework", type: "article", content: "Article content: Setting up statistically valid A/B tests for campaigns.", duration: 420, order: 1, completed: false },
    { id: "lesson-15", moduleId: "module-5", title: "Automation Lab", type: "code", content: "Build a marketing automation sequence with our visual builder.", duration: 1500, order: 2, completed: false },
    { id: "lesson-16", moduleId: "module-6", title: "Color Models & Spaces", type: "video", content: "Video content: RGB, CMYK, HSL, and Lab color spaces explained in depth.", duration: 840, order: 0, completed: false },
    { id: "lesson-17", moduleId: "module-6", title: "Accessibility Standards", type: "article", content: "Article content: WCAG guidelines for color contrast and accessible design.", duration: 360, order: 1, completed: false },
    { id: "lesson-18", moduleId: "module-6", title: "Color Systems Challenge", type: "quiz", content: "", duration: 300, order: 2, completed: false },
    { id: "lesson-19", moduleId: "module-7", title: "Audience Research", type: "video", content: "Video content: Identifying and understanding your target audience segments.", duration: 720, order: 0, completed: false },
    { id: "lesson-20", moduleId: "module-7", title: "Content Calendar Setup", type: "article", content: "Article content: Planning and scheduling content across multiple channels.", duration: 480, order: 1, completed: false },
    { id: "lesson-21", moduleId: "module-7", title: "SEO Fundamentals", type: "video", content: "Video content: Search engine optimization basics for content creators.", duration: 600, order: 2, completed: false },
    { id: "lesson-22", moduleId: "module-8", title: "User Interview Techniques", type: "video", content: "Video content: Conducting effective user interviews for UX research.", duration: 900, order: 0, completed: false },
    { id: "lesson-23", moduleId: "module-8", title: "Usability Testing", type: "article", content: "Article content: Setting up and running usability tests for brand experiences.", duration: 540, order: 1, completed: false },
    { id: "lesson-24", moduleId: "module-8", title: "UX Design Lab", type: "code", content: "Interactive: Prototype a user flow using our design tools.", duration: 1800, order: 2, completed: false },
    { id: "lesson-25", moduleId: "module-9", title: "Algorithm Deep Dive", type: "video", content: "Video content: Understanding social media algorithms and how to leverage them.", duration: 660, order: 0, completed: false },
    { id: "lesson-26", moduleId: "module-9", title: "Content Optimization", type: "article", content: "Article content: Optimizing content per platform for maximum engagement.", duration: 420, order: 1, completed: false },
    { id: "lesson-27", moduleId: "module-9", title: "Social Media Lab", type: "code", content: "Build a cross-platform content plan with our strategy tools.", duration: 1200, order: 2, completed: false },
  ];

  const quizzes: QuizData[] = [
    { id: "quiz-1", lessonId: "lesson-3", passingScore: 70, timeLimit: 300, attempts: 3, questions: [
      { id: "q-1", text: "What is brand equity?", type: "mcq", options: ["Brand value", "Logo design", "Color palette", "Tagline"], points: 10 },
      { id: "q-2", text: "Color psychology affects purchasing decisions.", type: "truefalse", options: ["True", "False"], points: 5 },
      { id: "q-3", text: "Name three components of a brand identity system.", type: "short", options: [], points: 15 },
    ]},
    { id: "quiz-2", lessonId: "lesson-12", passingScore: 60, timeLimit: 300, attempts: 3, questions: [
      { id: "q-4", text: "What does NLP stand for in AI?", type: "mcq", options: ["Natural Language Processing", "Neural Logic Programming", "Network Layer Protocol", "Non-Linear Processing"], points: 10 },
      { id: "q-5", text: "AI can replace human creativity entirely.", type: "truefalse", options: ["True", "False"], points: 5 },
      { id: "q-6", text: "List two AI marketing tools.", type: "short", options: [], points: 10 },
    ]},
    { id: "quiz-3", lessonId: "lesson-18", passingScore: 75, timeLimit: 240, attempts: 2, questions: [
      { id: "q-7", text: "Which color model is used for print?", type: "mcq", options: ["RGB", "CMYK", "HSL", "LAB"], points: 10 },
      { id: "q-8", text: "WCAG requires a minimum contrast ratio of 4.5:1 for normal text.", type: "truefalse", options: ["True", "False"], points: 5 },
    ]},
  ];

  const enrollments: Enrollment[] = [
    { id: "enr-1", courseId: "course-1", userId: USER_ID, progress: 45, completedLessons: ["lesson-1", "lesson-2"], startedAt: "2025-05-01", completedAt: undefined },
    { id: "enr-2", courseId: "course-2", userId: USER_ID, progress: 100, completedLessons: ["lesson-10", "lesson-11", "lesson-12", "lesson-13", "lesson-14", "lesson-15"], startedAt: "2025-04-15", completedAt: "2025-05-20" },
  ];

  const certificates: Cert[] = [
    { id: "cert-1", enrollmentId: "enr-2", courseName: "AI-Powered Marketing", userName: "Alex Johnson", issuedAt: "2025-05-20", credentialId: "NEX-APM-A1B2C3D4" },
  ];

  const paths: LearningPath[] = [
    { id: "path-1", name: "Brand Designer", description: "Complete path from fundamentals to advanced brand design.", courses: ["course-1", "course-3", "course-5"], duration: 1260, estimatedHours: 21, skills: ["Branding", "Design", "UX", "Color Theory"] },
    { id: "path-2", name: "Marketing Strategist", description: "Master modern marketing with AI and content strategy.", courses: ["course-2", "course-4", "course-6"], duration: 1080, estimatedHours: 18, skills: ["Marketing", "AI", "Content", "Social Media"] },
    { id: "path-3", name: "Full-Stack Brand Professional", description: "Comprehensive brand building from identity to market domination.", courses: ["course-1", "course-2", "course-4", "course-5"], duration: 1800, estimatedHours: 30, skills: ["Branding", "Marketing", "Design", "UX", "Strategy"] },
  ];

  return { courses, modules, lessons, quizzes, enrollments, certificates, paths };
}
