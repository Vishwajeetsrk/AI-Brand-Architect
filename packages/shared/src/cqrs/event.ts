export abstract class Event {
  public readonly occurredAt: Date = new Date();
  public readonly type: string;
  public readonly aggregateId: string;
  public readonly aggregateType: string;
  public readonly payload: Record<string, unknown>;

  constructor(
    aggregateId: string,
    aggregateType: string,
    type: string,
    payload: Record<string, unknown>,
  ) {
    this.aggregateId = aggregateId;
    this.aggregateType = aggregateType;
    this.type = type;
    this.payload = payload;
  }
}

export interface EventHandler<E extends Event> {
  handle(event: E): Promise<void>;
}
