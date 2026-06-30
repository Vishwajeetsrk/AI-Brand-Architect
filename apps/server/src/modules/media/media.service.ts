import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private thumbnails: any[] = [];
  private executions: any[] = [];
  private counter = 0;

  async generateThumbnail(dto: { title: string; subtitle?: string; style?: string; brandColor?: string; fontSize?: number }, userId: string): Promise<any> {
    const thumbnail = {
      id: `thumb_${++this.counter}`,
      userId,
      title: dto.title,
      subtitle: dto.subtitle || '',
      style: dto.style || 'modern',
      brandColor: dto.brandColor || '#7c3aed',
      fontSize: dto.fontSize || 48,
      previewUrl: `/api/media/thumbnails/preview/${this.counter}`,
      createdAt: new Date(),
    };
    this.thumbnails.push(thumbnail);
    return thumbnail;
  }

  async listThumbnails(userId: string): Promise<any[]> {
    return this.thumbnails.filter(t => t.userId === userId);
  }

  async executeCode(dto: { language: string; code: string; input?: string }, userId: string): Promise<any> {
    const output = this.simulateExecution(dto.language, dto.code, dto.input);
    const execution = {
      id: `exec_${++this.counter}`,
      userId, language: dto.language, code: dto.code,
      input: dto.input || '', output, success: !output.startsWith('Error'),
      executedAt: new Date(),
    };
    this.executions.push(execution);
    return execution;
  }

  async listExecutions(userId: string): Promise<any[]> {
    return this.executions.filter(e => e.userId === userId);
  }

  private simulateExecution(language: string, code: string, input?: string): string {
    try {
      if (language === 'javascript' || language === 'typescript') {
        if (code.includes('console.log')) {
          const match = code.match(/console\.log\((.+?)\)/);
          if (match) return match[1].replace(/['"]/g, '') + '\n';
        }
        if (code.includes('return')) return '42\n';
        return 'Execution completed successfully.\n';
      }
      if (language === 'python') {
        if (code.includes('print')) {
          const match = code.match(/print\((.+?)\)/);
          if (match) return match[1].replace(/['"]/g, '') + '\n';
        }
        return 'Python execution simulated.\n';
      }
      return `[${language}] Code execution simulated. Output would appear here.\n`;
    } catch (e: any) {
      return `Error: ${e.message || 'Execution error'}\n`;
    }
  }
}
