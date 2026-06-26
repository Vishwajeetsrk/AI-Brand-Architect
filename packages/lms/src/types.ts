export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  modules: string[];
  instructor: string;
  rating: number;
  enrolledCount: number;
  price: number;
  status: 'draft' | 'published';
  skills: string[];
  createdAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: string[];
  duration: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'code' | 'live';
  content: string;
  duration: number;
  order: number;
  completed: boolean;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: string[];
  passingScore: number;
  timeLimit: number;
  attempts: number;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: 'mcq' | 'truefalse' | 'short';
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  progress: number;
  completedLessons: string[];
  startedAt: string;
  completedAt?: string;
  certificateId?: string;
}

export interface Certificate {
  id: string;
  enrollmentId: string;
  courseName: string;
  userName: string;
  issuedAt: string;
  credentialId: string;
  verifyUrl: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  courses: string[];
  duration: number;
  estimatedHours: number;
  skills: string[];
}

export interface QuizSubmission {
  quizId: string;
  answers: { questionId: string; answer: string }[];
  userId: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  answers: { questionId: string; correct: boolean; points: number }[];
}
