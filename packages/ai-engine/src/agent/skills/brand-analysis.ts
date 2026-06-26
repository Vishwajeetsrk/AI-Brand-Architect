import { Skill, AgentContext } from '../../types';
import { getProvider } from '../../llm/provider-factory';

export class BrandAnalysisSkill implements Skill {
  name = 'brand_analysis';
  description = 'Analyze a brand to identify archetype, voice, tone, competitive positioning, and color psychology recommendations';

  async execute(input: Record<string, unknown>, context: AgentContext): Promise<Record<string, unknown>> {
    this.validateInput(input);

    const brandName = input.brandName as string;
    const industry = (input.industry as string) || 'General';
    const description = (input.description as string) || '';
    const targetAudience = (input.targetAudience as string) || 'General audience';
    const currentVoice = (input.currentVoice as string) || 'Neutral';

    const archetype = await this.identifyArchetype(brandName, industry, description, context);
    const brandVoice = await this.analyzeVoice(brandName, industry, description, currentVoice, targetAudience, context);
    const positioning = await this.analyzePositioning(brandName, industry, description, targetAudience);
    const colorRecommendations = this.generateColorRecommendations(archetype, industry);

    return {
      brandName,
      archetype,
      brandVoice,
      positioning,
      colorRecommendations,
      analysisComplete: true,
    };
  }

  private validateInput(input: Record<string, unknown>): void {
    if (!input.brandName || typeof input.brandName !== 'string') {
      throw new Error('BrandAnalysisSkill requires a valid brandName string');
    }
  }

  private async identifyArchetype(brandName: string, industry: string, description: string, context: AgentContext): Promise<Record<string, unknown>> {
    const archetypes = [
      { name: 'The Innocent', description: 'Pure, optimistic, simple', brands: 'Dove, Coca-Cola' },
      { name: 'The Everyman', description: 'Relatable, grounded, authentic', brands: 'IKEA, Levi\'s' },
      { name: 'The Hero', description: 'Courageous, bold, aspirational', brands: 'Nike, BMW' },
      { name: 'The Outlaw', description: 'Rebellious, disruptive, provocative', brands: 'Harley-Davidson, Virgin' },
      { name: 'The Explorer', description: 'Adventurous, independent, pioneering', brands: 'Jeep, The North Face' },
      { name: 'The Creator', description: 'Innovative, imaginative, artistic', brands: 'Apple, Lego' },
      { name: 'The Ruler', description: 'Authority, prestige, control', brands: 'Rolex, Mercedes-Benz' },
      { name: 'The Magician', description: 'Visionary, transformative, charismatic', brands: 'Disney, Dyson' },
      { name: 'The Lover', description: 'Passionate, sensual, intimate', brands: 'Chanel, Victoria\'s Secret' },
      { name: 'The Caregiver', description: 'Nurturing, compassionate, supportive', brands: 'Johnson & Johnson, Pampers' },
      { name: 'The Jester', description: 'Playful, humorous, lighthearted', brands: 'Old Spice, M&M\'s' },
      { name: 'The Sage', description: 'Wise, knowledgeable, insightful', brands: 'Google, Harvard' },
    ];

    const archetypeDescriptions = archetypes.map(a => `- ${a.name}: ${a.description} (e.g., ${a.brands})`).join('\n');

    const apiKey = (context?.metadata?.apiKey as string) || process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: 'You are a brand archetype expert. Identify the single best-matching brand archetype.',
          },
          {
            role: 'user',
            content: `Brand: ${brandName}\nIndustry: ${industry}\nDescription: ${description}\n\nAvailable archetypes:\n${archetypeDescriptions}\n\nWhich archetype fits best? Return the archetype name and a brief explanation.`,
          },
        ], { temperature: 0.3, maxTokens: 300 });

        return this.parseArchetypeResponse(response.content, archetypes);
      } catch {
        return this.fallbackArchetype(brandName, industry, archetypes);
      }
    }

    return this.fallbackArchetype(brandName, industry, archetypes);
  }

  private parseArchetypeResponse(response: string, archetypes: Array<{ name: string; description: string; brands: string }>): Record<string, unknown> {
    const matched = archetypes.find(a => response.toLowerCase().includes(a.name.toLowerCase()));
    if (matched) {
      return {
        primary: matched.name,
        description: matched.description,
        explanation: response.trim(),
      };
    }
    return {
      primary: 'The Creator',
      description: 'Innovative, imaginative, artistic',
      explanation: response.trim(),
    };
  }

  private fallbackArchetype(brandName: string, industry: string, archetypes: Array<{ name: string; description: string; brands: string }>): Record<string, unknown> {
    const techRelated = ['technology', 'software', 'saas', 'ai', 'cloud', 'digital', 'computer', 'startup'];
    const creativeRelated = ['design', 'creative', 'art', 'media', 'entertainment', 'fashion', 'music'];
    const healthRelated = ['health', 'wellness', 'medical', 'pharma', 'fitness', 'nutrition'];

    const industryLower = industry.toLowerCase();
    let primary = 'The Everyman';

    if (techRelated.some(t => industryLower.includes(t))) primary = 'The Creator';
    else if (creativeRelated.some(c => industryLower.includes(c))) primary = 'The Magician';
    else if (healthRelated.some(h => industryLower.includes(h))) primary = 'The Caregiver';
    else if (industryLower.includes('luxury') || industryLower.includes('premium')) primary = 'The Ruler';
    else if (industryLower.includes('sport') || industryLower.includes('fitness')) primary = 'The Hero';

    const matched = archetypes.find(a => a.name === primary) || archetypes[1];
    return {
      primary: matched.name,
      description: matched.description,
      explanation: `Based on industry analysis, ${brandName} aligns with the "${matched.name}" archetype.`,
    };
  }

  private async analyzeVoice(brandName: string, industry: string, description: string, currentVoice: string, targetAudience: string, context: AgentContext): Promise<Record<string, unknown>> {
    const apiKey = (context?.metadata?.apiKey as string) || process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: 'You are a brand voice strategist. Recommend voice and tone guidelines.',
          },
          {
            role: 'user',
            content: `Brand: ${brandName}\nIndustry: ${industry}\nCurrent Voice: ${currentVoice}\nTarget Audience: ${targetAudience}\nDescription: ${description}\n\nProvide voice and tone recommendations including:\n1. Brand voice adjectives (3-5 words)\n2. Tone variations by channel\n3. Language style guidelines\n4. Words to use and avoid`,
          },
        ], { temperature: 0.4, maxTokens: 500 });

        return {
          recommended: this.extractVoiceAdjectives(response.content),
          details: response.content.trim(),
          currentVoice,
        };
      } catch {
        // Fall through to default
      }
    }

    return {
      recommended: ['Confident', 'Innovative', 'Approachable', 'Professional', 'Authentic'],
      details: `Recommended voice for ${brandName} in ${industry}: Confident yet approachable, innovative but trustworthy. Maintain professionalism while being accessible to ${targetAudience || 'your audience'}.`,
      currentVoice,
    };
  }

  private extractVoiceAdjectives(text: string): string[] {
    const lines = text.split('\n');
    for (const line of lines) {
      const match = line.match(/(?:voice adjectives|adjectives|voice)[:\s]+(.+)/i);
      if (match) {
        return match[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
      }
    }
    return ['Confident', 'Innovative', 'Approachable', 'Professional', 'Authentic'];
  }

  private async analyzePositioning(brandName: string, industry: string, description: string, targetAudience: string): Promise<Record<string, unknown>> {
    return {
      statement: `${brandName} is the leading ${industry} solution for ${targetAudience || 'modern brands'}, delivering ${description || 'exceptional value and innovation'}.`,
      differentiators: [
        'AI-powered brand intelligence',
        'Comprehensive brand analysis suite',
        'Data-driven creative direction',
      ],
      marketPosition: `Premium ${industry} brand for ${targetAudience || 'forward-thinking teams'}`,
    };
  }

  private generateColorRecommendations(archetype: Record<string, unknown>, industry: string): Array<Record<string, unknown>> {
    const primary = (archetype.primary as string) || 'The Everyman';

    const paletteMap: Record<string, Array<Record<string, unknown>>> = {
      'The Innocent': [
        { name: 'Pure White', hex: '#FFFFFF', psychology: 'Cleanliness, simplicity, purity', usage: 'Background' },
        { name: 'Sky Blue', hex: '#87CEEB', psychology: 'Trust, serenity, openness', usage: 'Primary' },
        { name: 'Soft Pink', hex: '#FFB6C1', psychology: 'Gentleness, warmth, compassion', usage: 'Accent' },
        { name: 'Mint Green', hex: '#98FB98', psychology: 'Freshness, growth, harmony', usage: 'Secondary' },
        { name: 'Warm Beige', hex: '#F5F5DC', psychology: 'Neutrality, calm, approachable', usage: 'Background alt' },
      ],
      'The Hero': [
        { name: 'Victory Red', hex: '#CC0000', psychology: 'Passion, courage, action', usage: 'Primary' },
        { name: 'Midnight Navy', hex: '#1B1B3A', psychology: 'Strength, authority, sophistication', usage: 'Secondary' },
        { name: 'Gold', hex: '#FFD700', psychology: 'Achievement, excellence, premium', usage: 'Accent' },
        { name: 'Pure White', hex: '#FFFFFF', psychology: 'Clarity, purpose, cleanliness', usage: 'Background' },
        { name: 'Steel Gray', hex: '#71797E', psychology: 'Resilience, stability, endurance', usage: 'Text' },
      ],
      'The Creator': [
        { name: 'Innovation Purple', hex: '#6C63FF', psychology: 'Creativity, vision, imagination', usage: 'Primary' },
        { name: 'Deep Teal', hex: '#008080', psychology: 'Originality, sophistication, depth', usage: 'Secondary' },
        { name: 'Electric Orange', hex: '#FF6B35', psychology: 'Energy, enthusiasm, innovation', usage: 'Accent' },
        { name: 'Clean White', hex: '#FAFAFA', psychology: 'Blank canvas, clarity, focus', usage: 'Background' },
        { name: 'Charcoal', hex: '#2D2D2D', psychology: 'Modernity, precision, professionalism', usage: 'Text' },
      ],
      'The Ruler': [
        { name: 'Royal Purple', hex: '#4A0E4E', psychology: 'Luxury, power, ambition', usage: 'Primary' },
        { name: 'Gold', hex: '#C5A55A', psychology: 'Prosperity, prestige, excellence', usage: 'Secondary' },
        { name: 'Cream Ivory', hex: '#FFFFF0', psychology: 'Elegance, refinement, tradition', usage: 'Background' },
        { name: 'Burgundy', hex: '#800020', psychology: 'Wealth, sophistication, authority', usage: 'Accent' },
        { name: 'Dark Walnut', hex: '#3E2723', psychology: 'Stability, substance, permanence', usage: 'Text' },
      ],
      'The Magician': [
        { name: 'Enchanted Purple', hex: '#8B5CF6', psychology: 'Mystery, transformation, vision', usage: 'Primary' },
        { name: 'Cosmic Black', hex: '#0A0A1A', psychology: 'Infinite possibility, depth, sophistication', usage: 'Secondary' },
        { name: 'Iridescent Blue', hex: '#00BFFF', psychology: 'Illumination, discovery, clarity', usage: 'Accent' },
        { name: 'Moonlight Silver', hex: '#E8E8F0', psychology: 'Mystique, elegance, neutrality', usage: 'Background' },
        { name: 'Deep Indigo', hex: '#1A0A3E', psychology: 'Wisdom, intuition, mystery', usage: 'Text' },
      ],
    };

    return paletteMap[primary] || [
      { name: 'Primary Blue', hex: '#2563EB', psychology: 'Trust, reliability, professionalism', usage: 'Primary' },
      { name: 'Slate Gray', hex: '#64748B', psychology: 'Stability, neutrality, balance', usage: 'Secondary' },
      { name: 'Accent Coral', hex: '#F43F5E', psychology: 'Energy, passion, urgency', usage: 'Accent' },
      { name: 'Off White', hex: '#F8FAFC', psychology: 'Clean, modern, spacious', usage: 'Background' },
      { name: 'Dark Slate', hex: '#1E293B', psychology: 'Authority, depth, sophistication', usage: 'Text' },
    ];
  }
}
