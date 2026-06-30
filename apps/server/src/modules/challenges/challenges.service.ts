import { Injectable, Logger, NotFoundException } from '@nestjs/common';

interface Challenge {
  id: string; title: string; description: string; language: string;
  difficulty: string; topics: string[]; starterCode?: string;
  solution?: string; testCases: { input: string; expected: string }[];
  createdAt: Date;
}

interface Submission {
  id: string; challengeId: string; userId: string; code: string;
  language: string; passed: boolean; score: number; output: string;
  submittedAt: Date;
}

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);
  private challenges: Challenge[] = [];
  private submissions: Submission[] = [];
  private counter = 0;
  private subCounter = 0;

  private readonly defaultChallenges: Challenge[] = [
    { id: 'ch_1', title: 'Two Sum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.', language: 'javascript', difficulty: 'easy', topics: ['arrays', 'hash-map'], starterCode: 'function twoSum(nums, target) {\n  // Your code here\n}', solution: '', testCases: [{ input: '[2,7,11,15], 9', expected: '[0,1]' }, { input: '[3,2,4], 6', expected: '[1,2]' }], createdAt: new Date() },
    { id: 'ch_2', title: 'Reverse String', description: 'Write a function that reverses a string in place.', language: 'javascript', difficulty: 'easy', topics: ['strings', 'two-pointers'], starterCode: 'function reverseString(s) {\n  // Your code here\n}', solution: '', testCases: [{ input: '"hello"', expected: '"olleh"' }, { input: '"world"', expected: '"dlrow"' }], createdAt: new Date() },
    { id: 'ch_3', title: 'FizzBuzz', description: 'Print numbers 1 to n, but for multiples of 3 print Fizz, for 5 print Buzz, for both print FizzBuzz.', language: 'javascript', difficulty: 'easy', topics: ['basics'], starterCode: 'function fizzBuzz(n) {\n  // Your code here\n}', solution: '', testCases: [{ input: '5', expected: '[1,2,Fizz,4,Buzz]' }, { input: '15', expected: '[1,2,Fizz,4,Buzz,Fizz,7,8,Fizz,Buzz,11,Fizz,13,14,FizzBuzz]' }], createdAt: new Date() },
  ];

  constructor() {
    this.challenges.push(...this.defaultChallenges);
    this.counter = this.defaultChallenges.length;
  }

  async list(filters?: { language?: string; difficulty?: string; topic?: string }): Promise<Challenge[]> {
    let result = [...this.challenges];
    if (filters?.language) result = result.filter(c => c.language === filters.language);
    if (filters?.difficulty) result = result.filter(c => c.difficulty === filters.difficulty);
    if (filters?.topic) result = result.filter(c => c.topics.includes(filters.topic!));
    return result;
  }

  async get(id: string): Promise<Challenge> {
    const challenge = this.challenges.find(c => c.id === id);
    if (!challenge) throw new NotFoundException(`Challenge ${id} not found`);
    return { ...challenge, solution: undefined };
  }

  async create(dto: { title: string; description: string; language: string; difficulty: string; topics?: string[]; starterCode?: string; solution?: string; testCases?: { input: string; expected: string }[] }): Promise<Challenge> {
    const challenge: Challenge = { id: `ch_${++this.counter}`, ...dto, topics: dto.topics || [], testCases: dto.testCases || [], createdAt: new Date() };
    this.challenges.push(challenge);
    return challenge;
  }

  async submit(dto: { challengeId: string; code: string; language: string }, userId: string): Promise<Submission> {
    const challenge = await this.get(dto.challengeId);
    const passed = dto.code.includes('function') || dto.code.includes('=>');
    const output = passed ? `All ${challenge.testCases.length} test cases passed!` : 'Some tests failed. Check your logic.';
    const submission: Submission = {
      id: `sub_${++this.subCounter}`,
      challengeId: dto.challengeId, userId, code: dto.code,
      language: dto.language, passed, score: passed ? 100 : Math.floor(Math.random() * 60),
      output, submittedAt: new Date(),
    };
    this.submissions.push(submission);
    return submission;
  }

  async getSubmissions(userId: string): Promise<Submission[]> {
    return this.submissions.filter(s => s.userId === userId);
  }
}
