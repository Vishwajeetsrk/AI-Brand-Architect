export abstract class Event {
  public readonly occurredAt: Date = new Date();
  public abstract readonly type: string;
  public abstract readonly aggregateId: string;
  public abstract readonly aggregateType: string;
  public abstract readonly payload: Record<string, unknown>;
}

export interface EventHandler<E extends Event> {
  handle(event: E): Promise<void>;
}
