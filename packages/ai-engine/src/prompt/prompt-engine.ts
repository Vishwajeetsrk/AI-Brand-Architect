import { PromptTemplate, PromptExecutionResult, LLMMessage, LLMProviderType } from '../types';
import { getProvider } from '../llm/provider-factory';

export class PromptEngine {
  private templates: Map<string, PromptTemplate> = new Map();

  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  renderTemplate(templateId: string, variables: Record<string, string>): string {
    const template = this.templates.get(templateId);
    if (!template) throw new Error(`Template not found: ${templateId}`);

    let rendered = template.template;
    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    return rendered;
  }

  async execute(
    templateId: string,
    variables: Record<string, string>,
    config: { provider: LLMProviderType; model: string; apiKey?: string },
  ): Promise<PromptExecutionResult> {
    const start = Date.now();
    const template = this.templates.get(templateId);
    if (!template) throw new Error(`Template not found: ${templateId}`);

    const rendered = this.renderTemplate(templateId, variables);
    const messages: LLMMessage[] = [];
    if (template.systemPrompt) messages.push({ role: 'system', content: template.systemPrompt });
    messages.push({ role: 'user', content: rendered });

    const provider = getProvider(config.provider, config.apiKey);
    const response = await provider.generateText(messages, { model: config.model });

    return {
      content: response.content,
      provider: config.provider,
      model: response.model,
      usage: response.usage,
      duration: Date.now() - start,
    };
  }

  loadDefaultTemplates(): void {
    this.registerTemplate({
      id: 'brand-analysis',
      name: 'Brand Analysis',
      description: 'Analyze a brand from its description',
      template: `Analyze the following brand and provide a comprehensive brand analysis:

Brand Name: {{brandName}}
Industry: {{industry}}
Description: {{description}}
Target Audience: {{targetAudience}}
Current Voice: {{voice}}

Provide analysis in these areas:
1. Brand Identity Assessment
2. Voice & Tone Recommendations
3. Visual Direction Suggestions
4. Competitive Positioning
5. Growth Opportunities`,
      variables: ['brandName', 'industry', 'description', 'targetAudience', 'voice'],
      systemPrompt: 'You are an expert brand strategist with 20 years of experience in brand identity, positioning, and strategy.',
      tags: ['brand', 'analysis', 'strategy'],
      version: 1,
    });

    this.registerTemplate({
      id: 'tagline-generation',
      name: 'Tagline Generation',
      description: 'Generate brand taglines',
      template: `Generate {{count}} unique taglines for the following brand:

Brand Name: {{brandName}}
Description: {{description}}
Voice: {{voice}}

Taglines should be:
- Memorable and concise (under 10 words)
- Aligned with the brand voice
- Emotionally resonant
- Different from competitors`,
      variables: ['brandName', 'description', 'voice', 'count'],
      systemPrompt: 'You are a creative copywriter specialized in branding and tagline creation.',
      tags: ['brand', 'copywriting', 'taglines'],
      version: 1,
    });

    this.registerTemplate({
      id: 'color-palette',
      name: 'Color Palette Generation',
      description: 'Generate a brand color palette',
      template: `Design a complete color palette for this brand:

Brand Name: {{brandName}}
Industry: {{industry}}
Description: {{description}}
Preferred Style: {{style}}

Generate a palette with:
1. Primary Color (hex)
2. Secondary Color (hex)
3. Accent Color (hex)
4. Background Color (hex)
5. Text Color (hex)
6. 3 additional complementary colors

For each color explain the psychological impact and usage recommendation.`,
      variables: ['brandName', 'industry', 'description', 'style'],
      systemPrompt: 'You are a professional color theorist and brand designer.',
      tags: ['design', 'colors', 'branding'],
      version: 1,
    });
  }
}
