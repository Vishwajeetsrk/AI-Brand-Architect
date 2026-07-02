import { ToolCall, LLMResponse } from '../types';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  register(tool: ToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  unregister(name: string): void {
    this.tools.delete(name);
  }

  async executeToolCall(toolCall: ToolCall): Promise<{ role: 'tool'; content: string; toolCallId: string }> {
    const tool = this.tools.get(toolCall.function.name);
    if (!tool) {
      return {
        role: 'tool',
        content: JSON.stringify({ error: `Tool "${toolCall.function.name}" not found` }),
        toolCallId: toolCall.id,
      };
    }

    try {
      const args = JSON.parse(toolCall.function.arguments);
      const result = await tool.handler(args);
      return {
        role: 'tool',
        content: typeof result === 'string' ? result : JSON.stringify(result),
        toolCallId: toolCall.id,
      };
    } catch (err) {
      return {
        role: 'tool',
        content: JSON.stringify({ error: (err as Error).message }),
        toolCallId: toolCall.id,
      };
    }
  }

  async executeToolCalls(response: LLMResponse): Promise<{ role: 'tool'; content: string; toolCallId: string }[]> {
    if (!response.toolCalls || response.toolCalls.length === 0) return [];
    return Promise.all(response.toolCalls.map(tc => this.executeToolCall(tc)));
  }

  getApiDefinitions(): { type: 'function'; function: { name: string; description: string; parameters: Record<string, unknown> } }[] {
    return Array.from(this.tools.values()).map(t => ({
      type: 'function' as const,
      function: { name: t.name, description: t.description, parameters: t.parameters },
    }));
  }

  registerDefaults(): void {
    this.register({
      name: 'calculator',
      description: 'Perform mathematical calculations',
      parameters: {
        type: 'object',
        properties: {
          expression: { type: 'string', description: 'The mathematical expression to evaluate' },
        },
        required: ['expression'],
      },
      handler: async (args) => {
        const expr = args.expression as string;
        try {
          const fn = new Function(`return (${expr})`);
          const result = fn();
          return { result, expression: expr };
        } catch {
          return { error: `Cannot evaluate: ${expr}` };
        }
      },
    });

    this.register({
      name: 'get_current_time',
      description: 'Get the current date and time',
      parameters: {
        type: 'object',
        properties: {
          timezone: { type: 'string', description: 'Optional timezone (e.g., UTC, America/New_York)', optional: true },
        },
      },
      handler: async () => ({ timestamp: new Date().toISOString(), timezone: 'UTC' }),
    });

    this.register({
      name: 'search_memory',
      description: 'Search through stored memories',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', description: 'Max results', optional: true },
        },
        required: ['query'],
      },
      handler: async () => ({ results: [], message: 'Memory search not yet implemented' }),
    });
  }
}
