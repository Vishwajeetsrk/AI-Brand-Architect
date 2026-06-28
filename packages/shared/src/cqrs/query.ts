export abstract class Query<T = unknown> {
  public abstract readonly type: string;
}

export interface QueryHandler<Q extends Query<R>, R = unknown> {
  execute(query: Q): Promise<R>;
}
