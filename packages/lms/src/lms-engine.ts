import {
  Course, Module, Lesson, Quiz, Question, Enrollment,
  Certificate, LearningPath, QuizSubmission, QuizResult,
} from './types';

export class LMSEngine {
  private courses: Map<string, Course> = new Map();
  private modules: Map<string, Module> = new Map();
  private lessons: Map<string, Lesson> = new Map();
  private quizzes: Map<string, Quiz> = new Map();
  private questions: Map<string, Question> = new Map();
  private enrollments: Map<string, Enrollment> = new Map();
  private certificates: Map<string, Certificate> = new Map();
  private learningPaths: Map<string, LearningPath> = new Map();

  constructor() {
    this.seed();
  }

  /* ── Course CRUD ── */

  getCourses(category?: string, level?: string): Course[] {
    let all = Array.from(this.courses.values()).filter(c => c.status === 'published');
    if (category) all = all.filter(c => c.category === category);
    if (level) all = all.filter(c => c.level === level);
    return all;
  }

  getCourse(id: string): Course | undefined {
    return this.courses.get(id);
  }

  createCourse(data: Omit<Course, 'id' | 'createdAt'>): Course {
    const course: Course = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    this.courses.set(course.id, course);
    return course;
  }

  updateCourse(id: string, data: Partial<Course>): Course | undefined {
    const c = this.courses.get(id);
    if (!c) return undefined;
    const updated = { ...c, ...data };
    this.courses.set(id, updated);
    return updated;
  }

  deleteCourse(id: string): boolean {
    return this.courses.delete(id);
  }

  /* ── Modules & Lessons ── */

  getModules(courseId: string): Module[] {
    return Array.from(this.modules.values())
      .filter(m => m.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  getModule(id: string): Module | undefined {
    return this.modules.get(id);
  }

  createModule(data: Omit<Module, 'id'>): Module {
    const mod: Module = { ...data, id: crypto.randomUUID() };
    this.modules.set(mod.id, mod);
    const course = this.courses.get(data.courseId);
    if (course) {
      course.modules.push(mod.id);
      course.duration += data.duration;
    }
    return mod;
  }

  getLessons(moduleId: string): Lesson[] {
    return Array.from(this.lessons.values())
      .filter(l => l.moduleId === moduleId)
      .sort((a, b) => a.order - b.order);
  }

  getLesson(id: string): Lesson | undefined {
    return this.lessons.get(id);
  }

  createLesson(data: Omit<Lesson, 'id'>): Lesson {
    const lesson: Lesson = { ...data, id: crypto.randomUUID() };
    this.lessons.set(lesson.id, lesson);
    const mod = this.modules.get(data.moduleId);
    if (mod) {
      mod.lessons.push(lesson.id);
      mod.duration += data.duration;
    }
    return lesson;
  }

  /* ── Quiz system ── */

  getQuiz(lessonId: string): Quiz | undefined {
    return Array.from(this.quizzes.values()).find(q => q.lessonId === lessonId);
  }

  getQuestions(quizId: string): Question[] {
    const quiz = this.quizzes.get(quizId);
    if (!quiz) return [];
    return quiz.questions.map(qid => this.questions.get(qid)).filter(Boolean) as Question[];
  }

  createQuiz(data: Omit<Quiz, 'id'>): Quiz {
    const quiz: Quiz = { ...data, id: crypto.randomUUID() };
    this.quizzes.set(quiz.id, quiz);
    return quiz;
  }

  createQuestion(data: Omit<Question, 'id'>): Question {
    const q: Question = { ...data, id: crypto.randomUUID() };
    this.questions.set(q.id, q);
    const quiz = this.quizzes.get(data.quizId);
    if (quiz) quiz.questions.push(q.id);
    return q;
  }

  submitQuiz(submission: QuizSubmission): QuizResult {
    const quiz = this.quizzes.get(submission.quizId);
    if (!quiz) throw new Error('Quiz not found');
    const questions = this.getQuestions(submission.quizId);
    let score = 0;
    let total = 0;
    const answers = submission.answers.map(sa => {
      const q = questions.find(q => q.id === sa.questionId);
      if (!q) return { questionId: sa.questionId, correct: false, points: 0 };
      total += q.points;
      const correct = q.correctAnswer.toLowerCase().trim() === sa.answer.toLowerCase().trim();
      if (correct) score += q.points;
      return { questionId: sa.questionId, correct, points: correct ? q.points : 0 };
    });
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    return {
      quizId: submission.quizId,
      score, total, percentage,
      passed: percentage >= quiz.passingScore,
      answers,
    };
  }

  /* ── Enrollment ── */

  enroll(courseId: string, userId: string): Enrollment {
    const existing = Array.from(this.enrollments.values())
      .find(e => e.courseId === courseId && e.userId === userId);
    if (existing) return existing;
    const enrollment: Enrollment = {
      id: crypto.randomUUID(),
      courseId, userId,
      progress: 0,
      completedLessons: [],
      startedAt: new Date().toISOString(),
    };
    this.enrollments.set(enrollment.id, enrollment);
    const course = this.courses.get(courseId);
    if (course) course.enrolledCount++;
    return enrollment;
  }

  getEnrollments(userId: string): Enrollment[] {
    return Array.from(this.enrollments.values()).filter(e => e.userId === userId);
  }

  getEnrollment(courseId: string, userId: string): Enrollment | undefined {
    return Array.from(this.enrollments.values())
      .find(e => e.courseId === courseId && e.userId === userId);
  }

  completeLesson(lessonId: string, userId: string): Enrollment | undefined {
    const lesson = this.lessons.get(lessonId);
    if (!lesson) return undefined;
    const module = this.modules.get(lesson.moduleId);
    if (!module) return undefined;
    const enrollment = Array.from(this.enrollments.values())
      .find(e => e.courseId === module.courseId && e.userId === userId);
    if (!enrollment) return undefined;
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      lesson.completed = true;
    }
    const courseLessons = this.getAllCourseLessons(module.courseId);
    enrollment.progress = courseLessons.length > 0
      ? Math.round((enrollment.completedLessons.length / courseLessons.length) * 100)
      : 0;
    if (enrollment.progress >= 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date().toISOString();
      enrollment.certificateId = this.issueCertificate(enrollment, module.courseId);
    }
    return enrollment;
  }

  /* ── Certificates ── */

  private issueCertificate(enrollment: Enrollment, courseId: string): string {
    const course = this.courses.get(courseId);
    if (!course) return '';
    const cert: Certificate = {
      id: crypto.randomUUID(),
      enrollmentId: enrollment.id,
      courseName: course.title,
      userName: 'Student',
      issuedAt: new Date().toISOString(),
      credentialId: `NEX-${courseId.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      verifyUrl: `/verify/${crypto.randomUUID()}`,
    };
    this.certificates.set(cert.id, cert);
    return cert.id;
  }

  getCertificates(userId: string): Certificate[] {
    const userEnrollments = this.getEnrollments(userId);
    return Array.from(this.certificates.values())
      .filter(c => userEnrollments.some(e => e.id === c.enrollmentId));
  }

  getCertificate(id: string): Certificate | undefined {
    return this.certificates.get(id);
  }

  /* ── Learning Paths ── */

  getLearningPaths(): LearningPath[] {
    return Array.from(this.learningPaths.values());
  }

  getLearningPath(id: string): LearningPath | undefined {
    return this.learningPaths.get(id);
  }

  /* ── Helpers ── */

  private getAllCourseLessons(courseId: string): Lesson[] {
    const mods = this.getModules(courseId);
    return mods.flatMap(m => this.getLessons(m.id));
  }

  /* ── Seed Data ── */

  private seed() {
    this.seedCourses();
    this.seedLearningPaths();
  }

  private seedCourses() {
    const courseData: [string, string, string, string, 'beginner' | 'intermediate' | 'advanced', number, string, string[], number][] = [
      ['Brand Identity Fundamentals', 'Master the art of building a powerful brand identity from the ground up.', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400', 'Branding', 'beginner', 480, 'Sarah Chen', ['branding', 'identity', 'design', 'strategy'], 4.7],
      ['AI-Powered Marketing', 'Leverage artificial intelligence to supercharge your marketing campaigns.', 'https://images.unsplash.com/photo-1533750516457-a7f99234c8c3?w=400', 'Marketing', 'intermediate', 360, 'Alex Rivera', ['AI', 'marketing', 'automation', 'analytics'], 4.8],
      ['Advanced Color Theory', 'Deep dive into color psychology and advanced palette creation.', 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400', 'Design', 'advanced', 240, 'Maya Patel', ['color', 'design', 'psychology', 'accessibility'], 4.6],
      ['Content Strategy Playbook', 'Build a content engine that drives engagement and conversions.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', 'Content', 'intermediate', 420, 'James Wilson', ['content', 'strategy', 'SEO', 'writing'], 4.5],
      ['UX Design for Brands', 'Create seamless brand experiences through exceptional UX design.', 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400', 'Design', 'intermediate', 540, 'Lena Kim', ['UX', 'design', 'research', 'prototyping'], 4.9],
      ['Social Media Mastery', 'Dominate social platforms with data-driven strategies.', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', 'Marketing', 'beginner', 300, 'David Park', ['social-media', 'marketing', 'analytics', 'content'], 4.4],
    ];

    const courses: Course[] = courseData.map(([title, desc, thumb, cat, level, dur, instr, skills, rating], i) => ({
      id: `course-${i + 1}`,
      title, description: desc, thumbnail: thumb, category: cat, level,
      duration: dur, modules: [], instructor: instr, rating, enrolledCount: Math.floor(Math.random() * 5000) + 200,
      price: i === 0 ? 0 : [29, 49, 39, 59, 19][i - 1],
      status: 'published' as const,
      skills, createdAt: new Date(Date.now() - (6 - i) * 86400000 * 7).toISOString(),
    }));
    courses.forEach(c => this.courses.set(c.id, c));

    const moduleData: { title: string; desc: string; lessons: { title: string; type: Lesson['type']; content: string; dur: number }[] }[] = [
      {
        title: 'Introduction to Branding', desc: 'Core concepts of brand identity',
        lessons: [
          { title: 'What is a Brand?', type: 'video', content: 'Video content: Understanding the fundamental concept of branding and its importance in modern business.', dur: 600 },
          { title: 'Brand Anatomy', type: 'article', content: 'Article content: Breaking down the components that make up a complete brand identity system.', dur: 900 },
          { title: 'Brand Identity Quiz', type: 'quiz', content: '', dur: 300 },
        ],
      },
      {
        title: 'Visual Identity Systems', desc: 'Colors, typography, and visual language',
        lessons: [
          { title: 'Color Psychology Deep Dive', type: 'video', content: 'Video content: How colors influence perception and decision-making.', dur: 720 },
          { title: 'Typography Selection Guide', type: 'article', content: 'Article content: Choosing the right typefaces for your brand.', dur: 480 },
          { title: 'Visual Identity Lab', type: 'code', content: 'Interactive code lab: Build a visual identity system.', dur: 1200 },
        ],
      },
      {
        title: 'Brand Strategy', desc: 'Positioning and market differentiation',
        lessons: [
          { title: 'Competitive Analysis', type: 'video', content: 'Video content: Analyzing competitors to find your unique position.', dur: 540 },
          { title: 'Brand Voice & Tone', type: 'article', content: 'Article content: Defining how your brand communicates.', dur: 600 },
          { title: 'Strategy Workshop', type: 'live', content: 'Live session: Interactive strategy workshop.', dur: 1800 },
        ],
      },
      {
        title: 'AI Marketing Fundamentals', desc: 'Understanding AI in marketing',
        lessons: [
          { title: 'AI Marketing Landscape', type: 'video', content: 'Video content: Overview of AI tools transforming marketing.', dur: 660 },
          { title: 'Predictive Analytics', type: 'article', content: 'Article content: Using data to predict customer behavior.', dur: 540 },
          { title: 'AI Tools Quiz', type: 'quiz', content: '', dur: 300 },
        ],
      },
      {
        title: 'Campaign Automation', desc: 'Building automated marketing campaigns',
        lessons: [
          { title: 'Workflow Design', type: 'video', content: 'Video content: Designing effective automated workflows.', dur: 780 },
          { title: 'A/B Testing Framework', type: 'article', content: 'Article content: Setting up statistically valid tests.', dur: 420 },
          { title: 'Automation Lab', type: 'code', content: 'Build a marketing automation sequence.', dur: 1500 },
        ],
      },
      {
        title: 'Color Science', desc: 'Advanced color theory applications',
        lessons: [
          { title: 'Color Models & Spaces', type: 'video', content: 'Video content: RGB, CMYK, HSL, and Lab color spaces explained.', dur: 840 },
          { title: 'Accessibility Standards', type: 'article', content: 'Article content: WCAG guidelines for color contrast.', dur: 360 },
          { title: 'Color Systems Challenge', type: 'quiz', content: '', dur: 300 },
        ],
      },
      {
        title: 'Content Pillars', desc: 'Building your content framework',
        lessons: [
          { title: 'Audience Research', type: 'video', content: 'Video content: Identifying your target audience.', dur: 720 },
          { title: 'Content Calendar Setup', type: 'article', content: 'Article content: Planning content across channels.', dur: 480 },
          { title: 'SEO Fundamentals', type: 'video', content: 'Video content: Search engine optimization basics.', dur: 600 },
        ],
      },
      {
        title: 'UX Research Methods', desc: 'Understanding user needs',
        lessons: [
          { title: 'User Interview Techniques', type: 'video', content: 'Video content: Conducting effective user interviews.', dur: 900 },
          { title: 'Usability Testing', type: 'article', content: 'Article content: Setting up and running usability tests.', dur: 540 },
          { title: 'UX Design Lab', type: 'code', content: 'Interactive: Prototype a user flow.', dur: 1800 },
        ],
      },
      {
        title: 'Platform Strategy', desc: 'Platform-specific content strategies',
        lessons: [
          { title: 'Algorithm Deep Dive', type: 'video', content: 'Video content: Understanding social media algorithms.', dur: 660 },
          { title: 'Content Optimization', type: 'article', content: 'Article content: Optimizing content per platform.', dur: 420 },
          { title: 'Social Media Lab', type: 'code', content: 'Build a cross-platform content plan.', dur: 1200 },
        ],
      },
    ];

    const lessonIdMap = new Map<string, string>();
    moduleData.forEach((md, mi) => {
      const modId = `module-${mi + 1}`;
      const lessonIds: string[] = [];
      md.lessons.forEach((ld, li) => {
        const lessonId = `lesson-${mi * 3 + li + 1}`;
        lessonIds.push(lessonId);
        lessonIdMap.set(`${modId}-${li}`, lessonId);
        const lesson: Lesson = {
          id: lessonId, moduleId: modId, title: ld.title, type: ld.type,
          content: ld.content, duration: ld.dur, order: li, completed: false,
        };
        this.lessons.set(lesson.id, lesson);
      });
      const moduleDuration = md.lessons.reduce((s, l) => s + l.dur, 0);
      const mod: Module = {
        id: modId, courseId: `course-${Math.floor(mi / 3) + 1}`,
        title: md.title, description: md.desc, order: mi,
        lessons: lessonIds, duration: moduleDuration,
      };
      this.modules.set(mod.id, mod);
      const course = this.courses.get(mod.courseId);
      if (course) {
        course.modules.push(mod.id);
        course.duration += moduleDuration;
      }
    });

    const quizzes = [
      { lessonId: 'lesson-3', passingScore: 70, timeLimit: 300, attempts: 3, questions: [
        { text: 'What is brand equity?', type: 'mcq' as const, options: ['Brand value', 'Logo design', 'Color palette', 'Tagline'], correctAnswer: 'Brand value', points: 10 },
        { text: 'Color psychology affects purchasing decisions.', type: 'truefalse' as const, options: ['True', 'False'], correctAnswer: 'True', points: 5 },
        { text: 'Name three components of a brand identity system.', type: 'short' as const, options: [], correctAnswer: 'Logo typography color', points: 15 },
      ]},
      { lessonId: 'lesson-12', passingScore: 60, timeLimit: 300, attempts: 3, questions: [
        { text: 'What does NLP stand for in AI?', type: 'mcq' as const, options: ['Natural Language Processing', 'Neural Logic Programming', 'Network Layer Protocol', 'None'], correctAnswer: 'Natural Language Processing', points: 10 },
        { text: 'AI can replace human creativity entirely.', type: 'truefalse' as const, options: ['True', 'False'], correctAnswer: 'False', points: 5 },
        { text: 'List two AI marketing tools.', type: 'short' as const, options: [], correctAnswer: 'ChatGPT Jasper', points: 10 },
      ]},
      { lessonId: 'lesson-18', passingScore: 75, timeLimit: 240, attempts: 2, questions: [
        { text: 'Which color model is used for print?', type: 'mcq' as const, options: ['RGB', 'CMYK', 'HSL', 'LAB'], correctAnswer: 'CMYK', points: 10 },
        { text: 'WCAG requires a minimum contrast ratio of 4.5:1.', type: 'truefalse' as const, options: ['True', 'False'], correctAnswer: 'True', points: 5 },
      ]},
      { lessonId: 'lesson-6', passingScore: 65, timeLimit: 300, attempts: 3, questions: [
        { text: 'What is typography?', type: 'mcq' as const, options: ['Font selection', 'Color choice', 'Image editing', 'Layout design'], correctAnswer: 'Font selection', points: 10 },
        { text: 'Serif fonts are best for digital screens.', type: 'truefalse' as const, options: ['True', 'False'], correctAnswer: 'False', points: 5 },
      ]},
    ];

    quizzes.forEach((qData, qi) => {
      const quizId = `quiz-${qi + 1}`;
      const questionIds: string[] = [];
      qData.questions.forEach((qd, qii) => {
        const qId = `question-${qi * 10 + qii + 1}`;
        questionIds.push(qId);
        this.questions.set(qId, {
          id: qId, quizId, text: qd.text, type: qd.type,
          options: qd.options, correctAnswer: qd.correctAnswer, points: qd.points,
        });
      });
      this.quizzes.set(quizId, {
        id: quizId, lessonId: qData.lessonId,
        questions: questionIds, passingScore: qData.passingScore,
        timeLimit: qData.timeLimit, attempts: qData.attempts,
      });
    });
  }

  private seedLearningPaths() {
    const paths: LearningPath[] = [
      {
        id: 'path-1', name: 'Brand Designer', description: 'Complete path from fundamentals to advanced brand design.',
        courses: ['course-1', 'course-3', 'course-5'], duration: 1260, estimatedHours: 21,
        skills: ['Branding', 'Design', 'UX', 'Color Theory'],
      },
      {
        id: 'path-2', name: 'Marketing Strategist', description: 'Master modern marketing with AI and content strategy.',
        courses: ['course-2', 'course-4', 'course-6'], duration: 1080, estimatedHours: 18,
        skills: ['Marketing', 'AI', 'Content', 'Social Media'],
      },
      {
        id: 'path-3', name: 'Full-Stack Brand Professional', description: 'Comprehensive brand building from identity to market domination.',
        courses: ['course-1', 'course-2', 'course-4', 'course-5'], duration: 1800, estimatedHours: 30,
        skills: ['Branding', 'Marketing', 'Design', 'UX', 'Strategy'],
      },
    ];
    paths.forEach(p => this.learningPaths.set(p.id, p));
  }
}

export const lmsEngine = new LMSEngine();
