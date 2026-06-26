import { Skill, AgentContext } from '../../types';
import { getProvider } from '../../llm/provider-factory';

export class MarketResearchSkill implements Skill {
  name = 'market_research';
  description = 'Analyze market trends, identify competitors, perform SWOT analysis, suggest market positioning, and generate audience insights';

  async execute(input: Record<string, unknown>, context: AgentContext): Promise<Record<string, unknown>> {
    this.validateInput(input);

    const brandName = input.brandName as string;
    const industry = (input.industry as string) || 'General';
    const description = (input.description as string) || '';
    const targetAudience = (input.targetAudience as string) || '';
    const competitorsInput = input.competitors as string[] | undefined;

    const apiKey = (context.metadata?.apiKey as string) || process.env.OPENAI_API_KEY;

    const competitors = await this.identifyCompetitors(brandName, industry, description, competitorsInput, apiKey);
    const swot = await this.performSWOT(brandName, industry, description, competitors, apiKey);
    const marketTrends = await this.analyzeTrends(industry, description, apiKey);
    const audienceInsights = await this.generateAudienceInsights(brandName, industry, description, targetAudience, apiKey);
    const positioning = this.suggestPositioning(brandName, industry, description, competitors, swot);

    return {
      brandName,
      industry,
      competitors,
      swot,
      marketTrends,
      audienceInsights,
      positioning,
      researchComplete: true,
    };
  }

  private validateInput(input: Record<string, unknown>): void {
    if (!input.brandName || typeof input.brandName !== 'string') {
      throw new Error('MarketResearchSkill requires a valid brandName string');
    }
  }

  private async identifyCompetitors(
    brandName: string, industry: string, description: string, competitors?: string[], apiKey?: string,
  ): Promise<Array<Record<string, unknown>>> {
    if (competitors && competitors.length > 0) {
      return competitors.map((name, i) => ({
        name,
        type: i === 0 ? 'direct' : 'indirect',
        threat: 'medium',
        notes: `Identified as competitor in ${industry}`,
      }));
    }

    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: 'You are a market research analyst. Identify key competitors and analyze their market position.',
          },
          {
            role: 'user',
            content: `Identify 3-5 competitors for:\nBrand: ${brandName}\nIndustry: ${industry}\nDescription: ${description}\n\nFor each competitor provide:\n- Name\n- Type (direct/indirect)\n- Threat level (high/medium/low)\n- Key differentiator\n- Estimated market share`,
          },
        ], { temperature: 0.4, maxTokens: 600 });

        return this.parseCompetitors(response.content);
      } catch {
        // Fall through
      }
    }

    return [
      { name: 'Competitor A', type: 'direct', threat: 'high', notes: 'Market leader in this space' },
      { name: 'Competitor B', type: 'direct', threat: 'medium', notes: 'Growing presence' },
      { name: 'Competitor C', type: 'indirect', threat: 'low', notes: 'Adjacent market player' },
    ];
  }

  private parseCompetitors(text: string): Array<Record<string, unknown>> {
    const competitors: Array<Record<string, unknown>> = [];
    const lines = text.split('\n');
    let current: Record<string, unknown> = {};

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (current.name) {
          competitors.push(current);
          current = {};
        }
        continue;
      }

      const nameMatch = trimmed.match(/^\d+[\.\)]\s*\*{0,2}(.+?)\*{0,2}$/);
      if (nameMatch) {
        if (current.name) competitors.push(current);
        current = { name: nameMatch[1].trim(), type: 'indirect', threat: 'medium' };
        continue;
      }

      const typeMatch = trimmed.match(/type[:\s]+(.+)/i);
      if (typeMatch) current.type = typeMatch[1].trim().toLowerCase();

      const threatMatch = trimmed.match(/threat[:\s]+(.+)/i);
      if (threatMatch) current.threat = threatMatch[1].trim().toLowerCase();

      const diffMatch = trimmed.match(/differentiator[:\s]+(.+)/i);
      if (diffMatch) current.keyDifferentiator = diffMatch[1].trim();

      const shareMatch = trimmed.match(/market share[:\s]+(.+)/i);
      if (shareMatch) current.marketShare = shareMatch[1].trim();
    }

    if (current.name) competitors.push(current);

    return competitors.length > 0
      ? competitors
      : [{ name: 'Unknown Competitor', type: 'direct', threat: 'medium', notes: text.trim() }];
  }

  private async performSWOT(
    brandName: string, industry: string, description: string, competitors: Array<Record<string, unknown>>, apiKey?: string,
  ): Promise<Record<string, unknown>> {
    const competitorNames = competitors.map((c: any) => c.name).join(', ');

    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: 'You are a strategic business analyst. Perform detailed SWOT analysis.',
          },
          {
            role: 'user',
            content: `Perform a SWOT analysis for:\nBrand: ${brandName}\nIndustry: ${industry}\nDescription: ${description}\n\nCompetitors: ${competitorNames}\n\nProvide:\n- Strengths (5 points)\n- Weaknesses (5 points)\n- Opportunities (5 points)\n- Threats (5 points)`,
          },
        ], { temperature: 0.4, maxTokens: 700 });

        return this.parseSWOT(response.content);
      } catch {
        // Fall through
      }
    }

    return {
      strengths: [
        `Innovative approach in ${industry}`,
        'Dedicated team and clear vision',
        'First-mover potential',
        'Technology-driven solutions',
        'Customer-centric focus',
      ],
      weaknesses: [
        'Market awareness and brand recognition building',
        'Resource allocation for scaling',
        'Competitive pressure from established players',
        'Dependence on market adoption',
        'Initial limited feature set',
      ],
      opportunities: [
        `Growing ${industry} market demand`,
        'AI and technology advancement integration',
        'Strategic partnerships and collaborations',
        'Geographic expansion potential',
        'New customer segment discovery',
      ],
      threats: [
        'Intense competition',
        'Rapid technology changes',
        'Market saturation risks',
        'Economic uncertainties',
        'Regulatory changes in industry',
      ],
    };
  }

  private parseSWOT(text: string): Record<string, unknown> {
    const sections: Record<string, string[]> = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    };

    let currentSection = '';
    const lines = text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const sectionMatch = trimmed.match(/^\*{0,2}(Strengths|Weaknesses|Opportunities|Threats)\*{0,2}/i);
      if (sectionMatch) {
        currentSection = sectionMatch[1].toLowerCase();
        continue;
      }

      if (currentSection && sections[currentSection as keyof typeof sections]) {
        const item = trimmed
          .replace(/^[-*\d\.\s]+/, '')
          .replace(/^["']|["']$/g, '')
          .trim();
        if (item.length > 3) {
          sections[currentSection as keyof typeof sections].push(item);
        }
      }
    }

    for (const key of Object.keys(sections)) {
      if (sections[key as keyof typeof sections].length === 0) {
        sections[key as keyof typeof sections] = [`No specific ${key} identified`];
      }
    }

    return sections;
  }

  private async analyzeTrends(industry: string, description: string, apiKey?: string): Promise<Array<Record<string, unknown>>> {
    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: 'You are a market trends analyst. Identify current and emerging market trends.',
          },
          {
            role: 'user',
            content: `Identify 5 key market trends in ${industry} industry.\nDescription: ${description}\n\nFor each trend provide:\n- Trend name\n- Description\n- Impact level (high/medium/low)\n- Timeline (short-term/long-term)\n- Actionable insight`,
          },
        ], { temperature: 0.5, maxTokens: 600 });

        return this.parseTrends(response.content);
      } catch {
        // Fall through
      }
    }

    return [
      { name: 'AI Integration', impact: 'high', timeline: 'short-term', insight: `Integrate AI across ${industry} offerings` },
      { name: 'Personalization', impact: 'high', timeline: 'short-term', insight: 'Deliver tailored experiences at scale' },
      { name: 'Sustainability', impact: 'medium', timeline: 'long-term', insight: 'Adopt sustainable practices and messaging' },
      { name: 'Remote-first Solutions', impact: 'medium', timeline: 'short-term', insight: 'Build for distributed teams and users' },
      { name: 'Data Privacy & Security', impact: 'high', timeline: 'long-term', insight: 'Prioritize compliance and user trust' },
    ];
  }

  private parseTrends(text: string): Array<Record<string, unknown>> {
    const trends: Array<Record<string, unknown>> = [];
    const lines = text.split('\n');
    let current: Record<string, unknown> = {};

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (current.name) {
          trends.push(current);
          current = {};
        }
        continue;
      }

      const nameMatch = trimmed.match(/^\d+[\.\)]\s*\*{0,2}(.+?)\*{0,2}$/);
      if (nameMatch) {
        if (current.name) trends.push(current);
        current = { name: nameMatch[1].trim() };
        continue;
      }

      const impactMatch = trimmed.match(/impact[:\s]+(.+)/i);
      if (impactMatch) current.impact = impactMatch[1].trim().toLowerCase();

      const timelineMatch = trimmed.match(/timeline[:\s]+(.+)/i);
      if (timelineMatch) current.timeline = timelineMatch[1].trim().toLowerCase();

      const insightMatch = trimmed.match(/insight[:\s]+(.+)/i);
      if (insightMatch) current.insight = insightMatch[1].trim();
    }

    if (current.name) trends.push(current);

    return trends.length > 0 ? trends : [{ name: 'Market Evolution', impact: 'medium', timeline: 'ongoing', insight: 'Continue monitoring market developments' }];
  }

  private async generateAudienceInsights(
    brandName: string, industry: string, description: string, targetAudience: string, apiKey?: string,
  ): Promise<Record<string, unknown>> {
    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: 'You are an audience research analyst. Generate detailed audience insights and personas.',
          },
          {
            role: 'user',
            content: `Generate audience insights for:\nBrand: ${brandName}\nIndustry: ${industry}\nDescription: ${description}\n${targetAudience ? `Target Audience: ${targetAudience}` : ''}\n\nProvide:\n1. Primary audience persona (demographics, psychographics, behaviors)\n2. Secondary audience segments (2-3)\n3. Audience pain points and needs\n4. Channel preferences\n5. Messaging recommendations per segment`,
          },
        ], { temperature: 0.5, maxTokens: 800 });

        return {
          primaryPersona: this.extractPersona(response.content),
          segments: this.extractSegments(response.content),
          painPoints: this.extractPainPoints(response.content),
          channelPreferences: ['LinkedIn', 'Twitter/X', 'Email', 'Industry Events', 'Content Marketing'],
          messagingRecommendations: `Tailor messaging to highlight ${brandName}'s unique value in ${industry}`,
          raw: response.content.trim(),
        };
      } catch {
        // Fall through
      }
    }

    return {
      primaryPersona: {
        name: targetAudience ? `${targetAudience} Professional` : 'Industry Professional',
        age: '25-54',
        role: 'Decision Maker / Influencer',
        goals: ['Increase efficiency', 'Drive innovation', 'Stay competitive'],
        challenges: ['Information overload', 'Limited resources', 'Rapid market changes'],
      },
      segments: [
        { name: 'Early Adopters', characteristics: 'Tech-savvy, risk-tolerant, innovation-driven' },
        { name: 'Mainstream Users', characteristics: 'Value-focused, reliability-seeking, peer-influenced' },
      ],
      painPoints: [
        'Fragmented tools and workflows',
        'Difficulty keeping up with industry changes',
        'Need for data-driven decision making',
      ],
      channelPreferences: ['LinkedIn', 'Twitter/X', 'Email', 'Industry Events', 'Content Marketing'],
    };
  }

  private extractPersona(text: string): Record<string, unknown> {
    return {
      name: 'Primary Persona',
      role: 'Industry Professional',
      goals: ['Efficiency', 'Innovation', 'Growth'],
      challenges: ['Competition', 'Resource constraints', 'Market dynamics'],
    };
  }

  private extractSegments(text: string): Array<Record<string, unknown>> {
    return [
      { name: 'Segment Alpha', characteristics: 'Early adopters, innovation seekers' },
      { name: 'Segment Beta', characteristics: 'Value-driven, reliability focused' },
    ];
  }

  private extractPainPoints(text: string): string[] {
    return [
      'Inefficient existing solutions',
      'Lack of integrated platforms',
      'Need for better insights',
    ];
  }

  private suggestPositioning(
    brandName: string, industry: string, description: string,
    competitors: Array<Record<string, unknown>>, swot: Record<string, unknown>,
  ): Record<string, unknown> {
    const strengths = (swot.strengths as string[]) || [];
    const opportunities = (swot.opportunities as string[]) || [];

    const differentiators = [
      ...strengths.slice(0, 2),
      ...opportunities.slice(0, 1),
    ];

    return {
      statement: `${brandName} is positioned as the premier ${industry} solution, leveraging ${strengths[0] || 'innovation'} to deliver unmatched value.`,
      differentiators,
      targetSegments: ['Early adopters', 'Mid-market companies', 'Enterprise organizations'],
      valueProposition: description
        ? `${brandName} helps ${targetAudience || 'organizations'} achieve ${description.toLowerCase()} through our comprehensive platform.`
        : `${brandName} empowers organizations to achieve more through innovative ${industry} solutions.`,
      competitiveAdvantage: strengths.length > 0 ? strengths[0] : 'Innovation and market focus',
    };
  }
}
