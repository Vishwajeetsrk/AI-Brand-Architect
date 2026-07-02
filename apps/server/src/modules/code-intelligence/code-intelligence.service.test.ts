import { CodeIntelligenceService } from './code-intelligence.service';

describe('CodeIntelligenceService', () => {
  let service: CodeIntelligenceService;

  beforeEach(() => {
    service = new CodeIntelligenceService();
  });

  describe('generateCode', () => {
    it('should generate code in the specified language', async () => {
      const result = await service.generateCode('Create a hello world function', 'typescript');

      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('language', 'typescript');
      expect(result).toHaveProperty('explanation');
      expect(result).toHaveProperty('linesOfCode');
      expect(result).toHaveProperty('complexity');
      expect(result).toHaveProperty('generatedAt');

      expect(typeof result.code).toBe('string');
      expect(result.code).toContain('Hello from Nexora AI');
      expect(result.linesOfCode).toBeGreaterThan(0);
    });
  });

  describe('reviewCode', () => {
    it('should review code and return issues', async () => {
      const code = 'function add(a, b) { return a + b; }';
      const result = await service.reviewCode(code, 'javascript');

      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('metrics');
      expect(result).toHaveProperty('suggestions');
      expect(result).toHaveProperty('reviewedAt');

      expect(Array.isArray(result.issues)).toBe(true);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.metrics).toHaveProperty('linesOfCode');
      expect(result.metrics).toHaveProperty('complexity');
      expect(result.metrics).toHaveProperty('maintainabilityIndex');
      expect(result.metrics).toHaveProperty('duplicateCode');
    });

    it('should calculate lines of code metric', async () => {
      const code = 'line1\nline2\nline3';
      const result = await service.reviewCode(code, 'python');
      expect(result.metrics.linesOfCode).toBe(3);
    });
  });

  describe('explainCode', () => {
    it('should explain code with sections', async () => {
      const code = 'function test() { return true; }';
      const result = await service.explainCode(code, 'javascript');

      expect(result).toHaveProperty('overview');
      expect(result).toHaveProperty('sections');
      expect(result).toHaveProperty('complexity');
      expect(result).toHaveProperty('explainedAt');

      expect(Array.isArray(result.sections)).toBe(true);
      expect(result.sections.length).toBeGreaterThan(0);
      for (const section of result.sections) {
        expect(section).toHaveProperty('lineRange');
        expect(section).toHaveProperty('purpose');
      }
      expect(result.complexity).toHaveProperty('cyclomatic');
      expect(result.complexity).toHaveProperty('cognitive');
      expect(result.complexity).toHaveProperty('maintainability');
    });
  });

  describe('refactorCode', () => {
    it('should refactor code and return changes', async () => {
      const code = 'function messyCode() { /* lots of logic */ }';
      const result = await service.refactorCode(code, 'Extract helper functions', 'javascript');

      expect(result).toHaveProperty('originalCode', code);
      expect(result).toHaveProperty('refactoredCode');
      expect(result).toHaveProperty('changes');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('refactoredAt');

      expect(Array.isArray(result.changes)).toBe(true);
      expect(result.changes.length).toBeGreaterThan(0);
      for (const change of result.changes) {
        expect(change).toHaveProperty('type');
        expect(change).toHaveProperty('description');
        expect(change).toHaveProperty('fromLine');
        expect(change).toHaveProperty('toLine');
      }
      expect(result.summary).toContain('complexity');
    });
  });
});
