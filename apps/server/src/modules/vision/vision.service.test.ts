import { VisionService } from './vision.service';

describe('VisionService', () => {
  let service: VisionService;

  beforeEach(() => {
    service = new VisionService();
  });

  describe('analyzeImage', () => {
    it('should analyze an image and return metadata', async () => {
      const result = await service.analyzeImage('https://example.com/image.png');

      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('colors');
      expect(result).toHaveProperty('objects');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('processingTime');

      expect(Array.isArray(result.labels)).toBe(true);
      expect(Array.isArray(result.colors)).toBe(true);
      expect(Array.isArray(result.objects)).toBe(true);
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should return a description string', async () => {
      const result = await service.analyzeImage('https://example.com/office.png');
      expect(typeof result.description).toBe('string');
      expect(result.description.length).toBeGreaterThan(0);
    });
  });

  describe('generateImage', () => {
    it('should generate an image with default style', async () => {
      const result = await service.generateImage('a cat');

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('prompt', 'a cat');
      expect(result).toHaveProperty('style', 'default');
      expect(result).toHaveProperty('resolution', '1024x1024');
      expect(result).toHaveProperty('generatedAt');
      expect(result).toHaveProperty('estimatedCost');
      expect(result.url).toContain('https://api.nexora.ai/vision/generated/');
    });

    it('should generate an image with custom style', async () => {
      const result = await service.generateImage('a dog', 'watercolor');
      expect(result).toHaveProperty('style', 'watercolor');
    });
  });
});
