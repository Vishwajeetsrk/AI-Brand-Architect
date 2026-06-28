export abstract class Command<T = void> {
  public readonly occurredAt: Date = new Date();
  public abstract readonly type: string;
}

export interface CommandHandler<C extends Command<R>, R = void> {
  execute(command: C): Promise<R>;
}
