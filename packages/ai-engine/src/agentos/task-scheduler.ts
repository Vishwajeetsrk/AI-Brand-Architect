import { AgentTaskDef, TaskStatus } from './agentos-types';

interface ScheduledTask extends AgentTaskDef {
  scheduledAt: number;
  priorityScore: number;
}

export class TaskScheduler {
  private queue: ScheduledTask[] = [];
  private executing: Map<string, ScheduledTask> = new Map();
  private maxConcurrent: number;
  private pollingInterval: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private onTaskReady: ((task: AgentTaskDef) => Promise<void>) | null = null;

  constructor(maxConcurrent: number = 5, pollingInterval: number = 1000) {
    this.maxConcurrent = maxConcurrent;
    this.pollingInterval = pollingInterval;
  }

  setTaskHandler(handler: (task: AgentTaskDef) => Promise<void>): void {
    this.onTaskReady = handler;
  }

  enqueue(tasks: AgentTaskDef[]): void {
    for (const task of tasks) {
      if (this.queue.find(t => t.id === task.id)) continue;
      const scheduled: ScheduledTask = {
        ...task,
        scheduledAt: Date.now(),
        priorityScore: this.calculatePriority(task),
      };
      this.queue.push(scheduled);
    }
    this.sortQueue();
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => {
      if (a.priorityScore !== b.priorityScore) return b.priorityScore - a.priorityScore;

      const aReady = a.dependencies.every(d => !this.queue.find(t => t.id === d) && !this.executing.has(d));
      const bReady = b.dependencies.every(d => !this.queue.find(t => t.id === d) && !this.executing.has(d));
      if (aReady !== bReady) return aReady ? -1 : 1;

      return a.createdAt - b.createdAt;
    });
  }

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), this.pollingInterval);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick(): void {
    if (!this.onTaskReady) return;

    const available = this.maxConcurrent - this.executing.size;
    if (available <= 0) return;

    const readyTasks = this.getReadyTasks().slice(0, available);
    for (const task of readyTasks) {
      this.queue = this.queue.filter(t => t.id !== task.id);
      task.status = 'running';
      task.startedAt = Date.now();
      this.executing.set(task.id, task);

      this.onTaskReady(task).finally(() => {
        this.executing.delete(task.id);
      });
    }
  }

  completeTask(taskId: string, result?: string): void {
    const task = this.executing.get(taskId);
    if (task) {
      task.status = 'completed';
      task.result = result;
      task.completedAt = Date.now();
      this.executing.delete(taskId);
    }
  }

  failTask(taskId: string, error: string): void {
    const task = this.executing.get(taskId);
    if (!task) return;

    if (task.retryCount < task.maxRetries) {
      task.retryCount++;
      task.status = 'pending';
      task.error = error;
      this.executing.delete(taskId);
      this.queue.push({
        ...task,
        scheduledAt: Date.now() + (task.retryCount * 5000),
        priorityScore: this.calculatePriority(task),
      });
      this.sortQueue();
    } else {
      task.status = 'failed';
      task.error = error;
      this.executing.delete(taskId);
    }
  }

  cancelTask(taskId: string): void {
    this.queue = this.queue.filter(t => t.id !== taskId);
    const executing = this.executing.get(taskId);
    if (executing) {
      executing.status = 'cancelled';
      this.executing.delete(taskId);
    }
  }

  getPendingCount(): number {
    return this.queue.length;
  }

  getExecutingCount(): number {
    return this.executing.size;
  }

  getStats(): { queued: number; executing: number; completed: number; failed: number } {
    const completed = this.queue.filter(t => t.status === 'completed').length + 
      Array.from(this.executing.values()).filter(t => t.status === 'completed').length;
    const failed = this.queue.filter(t => t.status === 'failed').length +
      Array.from(this.executing.values()).filter(t => t.status === 'failed').length;
    return {
      queued: this.queue.length,
      executing: this.executing.size,
      completed,
      failed,
    };
  }

  private getReadyTasks(): ScheduledTask[] {
    const completedIds = new Set<string>();
    for (const task of this.executing.values()) {
      if (task.status === 'completed') completedIds.add(task.id);
    }

    return this.queue.filter(task => {
      if (task.status !== 'pending') return false;
      if (task.scheduledAt > Date.now()) return false;
      return task.dependencies.every(depId => completedIds.has(depId));
    });
  }

  private calculatePriority(task: AgentTaskDef): number {
    let score = task.priority;

    if (task.retryCount > 0) score += 10;

    score += task.dependencies.length * 5;

    score -= task.estimatedComplexity * 2;

    return Math.max(0, score);
  }
}
