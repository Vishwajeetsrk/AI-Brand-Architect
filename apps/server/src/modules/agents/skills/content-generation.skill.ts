import { Injectable } from '@nestjs/common';
import { AgentSkill, SkillInput, SkillOutput } from './skill.interface';

@Injectable()
export class ContentGenerationSkill implements AgentSkill {
  readonly name = 'content-generation';
  readonly description = 'Generates brand content including taglines, mission statements, social media posts, and marketing copy';

  async execute(input: SkillInput): Promise<SkillOutput> {
    const name = input.brandName || 'Unknown Brand';
    const description = input.brandDescription || '';
    const keywords = input.keywords || [];

    const taglines = this.generateTaglines(name, description, keywords);
    const missionStatement = this.generateMissionStatement(name, description, keywords);
    const socialPosts = this.generateSocialPosts(name, description);

    return {
      results: {
        taglines,
        missionStatement,
        socialPosts,
        contentSuggestions: this.generateContentSuggestions(name, keywords),
      },
      summary: `Generated ${taglines.length} taglines, a mission statement, ${socialPosts.length} social media post ideas, and content strategy suggestions for "${name}".`,
    };
  }

  private generateTaglines(name: string, description: string, keywords: string[]): string[] {
    const kw = keywords.length > 0 ? keywords[0] : 'innovate';
    return [
      `${name}: ${description.split(' ').slice(0, 3).join(' ')}... Reimagined`,
      `Empower ${kw} with ${name}`,
      `${name} — Where ${kw} Meets Intelligence`,
      `Transform Your ${keywords[1] || 'Vision'} with ${name}`,
      `${name}: Built for the ${kw}-Driven Future`,
    ];
  }

  private generateMissionStatement(name: string, description: string, keywords: string[]): string {
    const core = keywords[0] || 'create';
    const domain = keywords[1] || 'solutions';
    return `At ${name}, our mission is to ${core} powerful ${domain} that ${description.toLowerCase() || 'transform how businesses connect with their audiences'}. We are committed to delivering excellence through innovation, integrity, and unwavering dedication to our customers' success.`;
  }

  private generateSocialPosts(name: string, description: string): { platform: string; content: string }[] {
    const shortDesc = description.split('.').slice(0, 1)[0] || 'Transform your brand';
    return [
      {
        platform: 'LinkedIn',
        content: `We're excited to introduce ${name}! ${shortDesc}. Join us on this journey to redefine what's possible. #Innovation #${name.replace(/\s+/g, '')}`,
      },
      {
        platform: 'Twitter',
        content: `Big news! 🚀 ${name} is here to ${shortDesc.toLowerCase()}. The future of branding starts now. #Branding #AI`,
      },
      {
        platform: 'Instagram',
        content: `Meet ${name}. Your new partner in ${shortDesc.toLowerCase()}. Swipe to see what we're building! ✨`,
      },
    ];
  }

  private generateContentSuggestions(name: string, keywords: string[]): string[] {
    const kw = keywords.length > 0 ? keywords[0] : 'brand';
    return [
      `Blog series: "The Future of ${kw.charAt(0).toUpperCase() + kw.slice(1)}"`,
      `Case study highlighting ${name} success stories`,
      `Weekly ${kw} tips newsletter`,
      `Video tutorials on maximizing ${name} features`,
      `Industry report: ${kw} Trends and Insights`,
    ];
  }
}
