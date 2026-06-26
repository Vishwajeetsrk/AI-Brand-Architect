import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@nexora/database';
import { LMSEngine, lmsEngine, QuizSubmission } from '@nexora/lms';

@Injectable()
export class LmsService {
  private lms: LMSEngine;

  constructor() {
    this.lms = lmsEngine;
  }

  async getCourses(category?: string, level?: string) {
    return this.lms.getCourses(category, level);
  }

  async getCourse(id: string) {
    const course = this.lms.getCourse(id);
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async createCourse(data: any) {
    return this.lms.createCourse(data);
  }

  async getModules(courseId: string) {
    const course = this.lms.getCourse(courseId);
    if (!course) throw new NotFoundException('Course not found');
    return this.lms.getModules(courseId);
  }

  async enroll(courseId: string, userId: string) {
    const course = this.lms.getCourse(courseId);
    if (!course) throw new NotFoundException('Course not found');
    return this.lms.enroll(courseId, userId);
  }

  async getEnrollments(userId: string) {
    return this.lms.getEnrollments(userId);
  }

  async completeLesson(lessonId: string, userId: string) {
    const result = this.lms.completeLesson(lessonId, userId);
    if (!result) throw new NotFoundException('Enrollment not found');
    return result;
  }

  async getQuiz(lessonId: string) {
    const quiz = this.lms.getQuiz(lessonId);
    if (!quiz) throw new NotFoundException('Quiz not found for this lesson');
    const questions = this.lms.getQuestions(quiz.id).map(q => ({
      id: q.id, text: q.text, type: q.type, options: q.options, points: q.points,
    }));
    return { ...quiz, questions };
  }

  async submitQuiz(submission: QuizSubmission) {
    return this.lms.submitQuiz(submission);
  }

  async getCertificates(userId: string) {
    return this.lms.getCertificates(userId);
  }

  async getLearningPaths() {
    return this.lms.getLearningPaths();
  }
}
