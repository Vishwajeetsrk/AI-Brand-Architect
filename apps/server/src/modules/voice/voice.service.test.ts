import { VoiceService } from './voice.service';

describe('VoiceService', () => {
  let service: VoiceService;

  beforeEach(() => {
    service = new VoiceService();
  });

  describe('synthesize', () => {
    it('should synthesize text with default voice', async () => {
      const result = await service.synthesize('Hello world');

      expect(result).toHaveProperty('audioUrl');
      expect(result).toHaveProperty('text', 'Hello world');
      expect(result).toHaveProperty('voice', 'default');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('format', 'mp3');
      expect(result).toHaveProperty('sampleRate', 24000);
      expect(result).toHaveProperty('generatedAt');
      expect(result.audioUrl).toContain('https://api.nexora.ai/voice/synthesized/');
    });

    it('should synthesize text with custom voice', async () => {
      const result = await service.synthesize('Hello world', 'en-US-Neural2-F');
      expect(result).toHaveProperty('voice', 'en-US-Neural2-F');
    });
  });

  describe('transcribe', () => {
    it('should transcribe audio and return results', async () => {
      const result = await service.transcribe('https://example.com/audio.mp3');

      expect(result).toHaveProperty('transcription');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('language', 'en-US');
      expect(result).toHaveProperty('words');
      expect(result).toHaveProperty('processingTime');

      expect(typeof result.transcription).toBe('string');
      expect(result.transcription.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.words).toBeGreaterThan(0);
    });
  });

  describe('cloneVoice', () => {
    it('should clone a voice from samples', async () => {
      const samples = ['https://example.com/sample1.mp3', 'https://example.com/sample2.mp3'];
      const result = await service.cloneVoice('My Voice', samples);

      expect(result).toHaveProperty('voiceId');
      expect(result).toHaveProperty('name', 'My Voice');
      expect(result).toHaveProperty('samplesProcessed', 2);
      expect(result).toHaveProperty('status', 'ready');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('estimatedCost');
      expect(result.voiceId).toContain('voice-');
    });
  });
});
