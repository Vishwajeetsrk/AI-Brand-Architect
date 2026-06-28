import { Controller, Get, Query, Sse } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Observable, Subject } from 'rxjs';

const aiStreamSubjects = new Map<string, Subject<MessageEvent>>();

export function pushAIStream(connectionId: string, chunk: string): void {
  const sub = aiStreamSubjects.get(connectionId);
  if (sub) sub.next({ data: chunk } as MessageEvent);
}

export function completeAIStream(connectionId: string): void {
  const sub = aiStreamSubjects.get(connectionId);
  if (sub) { sub.complete(); aiStreamSubjects.delete(connectionId); }
}

export function failAIStream(connectionId: string, error: string): void {
  const sub = aiStreamSubjects.get(connectionId);
  if (sub) { sub.error(new Error(error)); aiStreamSubjects.delete(connectionId); }
}

@ApiTags('Realtime')
@Controller('sse')
export class SseController {
  @Get('ai-stream')
  @Sse()
  @ApiOperation({ summary: 'SSE endpoint for AI streaming' })
  aiStream(@Query('id') id: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    aiStreamSubjects.set(id, subject);
    return subject.asObservable();
  }

  @Get('health')
  health(): { ok: boolean; connections: number } {
    return { ok: true, connections: aiStreamSubjects.size };
  }
}
