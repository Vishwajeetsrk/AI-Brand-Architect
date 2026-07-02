import { describe, it, expect } from 'vitest'
import { ToolRegistry } from './tool-registry'

describe('ToolRegistry', () => {
  it('register and get a tool', () => {
    const registry = new ToolRegistry()
    registry.register({
      name: 'test_tool',
      description: 'A test tool',
      parameters: { type: 'object', properties: { input: { type: 'string' } }, required: ['input'] },
      handler: async (args) => ({ result: `processed ${args.input}` }),
    })
    const tool = registry.get('test_tool')
    expect(tool).toBeDefined()
    expect(tool!.name).toBe('test_tool')
  })

  it('list returns all registered tools', () => {
    const registry = new ToolRegistry()
    registry.register({
      name: 'tool_a', description: '', parameters: {},
      handler: async () => ({}),
    })
    registry.register({
      name: 'tool_b', description: '', parameters: {},
      handler: async () => ({}),
    })
    expect(registry.list()).toHaveLength(2)
  })

  it('executeToolCall invokes the handler with parsed args', async () => {
    const registry = new ToolRegistry()
    registry.register({
      name: 'calculator', description: 'Calculate', parameters: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } }, required: ['x', 'y'] },
      handler: async (args) => ({ sum: (args.x as number) + (args.y as number) }),
    })
    const result = await registry.executeToolCall({
      id: 'call_1',
      type: 'function',
      function: { name: 'calculator', arguments: '{"x":3,"y":4}' },
    })
    expect(result.role).toBe('tool')
    expect(JSON.parse(result.content)).toEqual({ sum: 7 })
  })

  it('executeToolCall returns error for unknown tool', async () => {
    const registry = new ToolRegistry()
    const result = await registry.executeToolCall({
      id: 'call_2',
      type: 'function',
      function: { name: 'nonexistent', arguments: '{}' },
    })
    expect(result.role).toBe('tool')
    expect(JSON.parse(result.content)).toHaveProperty('error')
  })

  it('unregister removes a tool', () => {
    const registry = new ToolRegistry()
    registry.register({
      name: 'temp', description: '', parameters: {},
      handler: async () => ({}),
    })
    registry.unregister('temp')
    expect(registry.get('temp')).toBeUndefined()
  })

  it('getApiDefinitions returns properly formatted definitions', () => {
    const registry = new ToolRegistry()
    registry.register({
      name: 'greet', description: 'Greets someone', parameters: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
      handler: async () => ({}),
    })
    const defs = registry.getApiDefinitions()
    expect(defs).toHaveLength(1)
    expect(defs[0].function.name).toBe('greet')
    expect(defs[0].type).toBe('function')
  })
})
