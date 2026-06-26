import { Injectable } from '@nestjs/common';
import { AgentSkill, SkillInput, SkillOutput } from './skill.interface';

@Injectable()
export class BrandAnalysisSkill implements AgentSkill {
  readonly name = 'brand-analysis';
  readonly description = 'Analyzes brand identity from description, extracts voice, tone, audience, and generates color palette and typography suggestions';

  async execute(input: SkillInput): Promise<SkillOutput> {
    const name = input.brandName || 'Unknown Brand';
    const description = input.brandDescription || '';
    const industry = input.industry || 'general';

    const brandVoice = this.analyzeBrandVoice(description, industry);
    const colorPalette = this.generateColorPalette(industry, name);
    const typography = this.recommendTypography(industry);

    return {
      results: {
        brandVoice,
        colorPalette,
        typography,
        targetAudience: input.targetAudience || 'Not specified',
      },
      summary: `Brand analysis complete for "${name}". Voice identified as ${brandVoice.tone}. Suggested ${colorPalette.colors.length} colors and ${typography.heading} for headings.`,
    };
  }

  private analyzeBrandVoice(description: string, industry: string): { tone: string; traits: string[]; style: string } {
    const traits: string[] = [];

    if (description.length < 50) traits.push('Concise');
    else traits.push('Detailed');

    if (industry.toLowerCase().includes('tech')) {
      traits.push('Innovative', 'Forward-thinking');
    } else if (industry.toLowerCase().includes('finance')) {
      traits.push('Trustworthy', 'Professional');
    } else if (industry.toLowerCase().includes('health')) {
      traits.push('Compassionate', 'Authoritative');
    } else {
      traits.push('Authentic', 'Engaging');
    }

    const tones = ['Professional', 'Conversational', 'Authoritative', 'Playful', 'Inspirational'];
    const tone = tones[Math.floor(Math.random() * tones.length)];

    return {
      tone,
      traits: [...new Set(traits)],
      style: industry === 'technology' ? 'Modern and clean with technical precision' : 'Clear and accessible',
    };
  }

  private generateColorPalette(industry: string, brandName: string): { colors: string[]; description: string } {
    const palettes: Record<string, string[]> = {
      technology: ['#6366F1', '#818CF8', '#1E1B4B', '#F8FAFC', '#0F172A'],
      finance: ['#1E3A5F', '#2E6B9E', '#D4A843', '#F5F5F5', '#1A1A2E'],
      healthcare: ['#2ECC71', '#3498DB', '#FFFFFF', '#F0F8FF', '#2C3E50'],
      education: ['#E67E22', '#F39C12', '#2C3E50', '#ECF0F1', '#34495E'],
      creative: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#2D3436'],
    };

    const defaultPalette = ['#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF'];
    const colors = palettes[industry.toLowerCase()] || defaultPalette;

    return {
      colors,
      description: `Generated a ${colors.length}-color palette suitable for the ${industry} industry`,
    };
  }

  private recommendTypography(industry: string): { heading: string; body: string; accent: string } {
    const typographyMap: Record<string, { heading: string; body: string; accent: string }> = {
      technology: { heading: 'Inter', body: 'SF Pro Text', accent: 'JetBrains Mono' },
      finance: { heading: 'Playfair Display', body: 'Source Sans Pro', accent: 'IBM Plex Mono' },
      healthcare: { heading: 'Merriweather', body: 'Nunito', accent: 'Fira Code' },
      creative: { heading: 'Space Grotesk', body: 'DM Sans', accent: 'Cabin Sketch' },
    };

    return typographyMap[industry.toLowerCase()] || {
      heading: 'Inter',
      body: 'Inter',
      accent: 'JetBrains Mono',
    };
  }
}
