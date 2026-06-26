import { Skill, AgentContext } from '../../types';
import { getProvider } from '../../llm/provider-factory';

export class ContentGenerationSkill implements Skill {
  name = 'content_generation';
  description = 'Generate brand content including taglines, mission statements, brand stories, social media posts, email copy, and website copy';

  async execute(input: Record<string, unknown>, context: AgentContext): Promise<Record<string, unknown>> {
    this.validateInput(input);

    const brandName = input.brandName as string;
    const description = (input.description as string) || '';
    const voice = (input.voice as string) || 'Professional';
    const tone = (input.tone as string) || 'Neutral';
    const contentType = (input.contentType as string) || 'taglines';
    const count = typeof input.count === 'number' ? input.count : 5;

    const apiKey = (context.metadata?.apiKey as string) || process.env.OPENAI_API_KEY;

    switch (contentType) {
      case 'taglines':
        return this.generateTaglines(brandName, description, voice, tone, count, apiKey);
      case 'mission':
        return this.generateMissionStatement(brandName, description, voice, tone, apiKey);
      case 'brand_story':
        return this.generateBrandStory(brandName, description, voice, tone, apiKey);
      case 'social_media':
        return this.generateSocialMediaContent(brandName, description, voice, count, apiKey);
      case 'email':
        return this.generateEmailCopy(input, brandName, description, voice, tone, apiKey);
      case 'website':
        return this.generateWebsiteCopy(brandName, description, voice, tone, apiKey);
      default:
        return this.generateTaglines(brandName, description, voice, tone, count, apiKey);
    }
  }

  private validateInput(input: Record<string, unknown>): void {
    if (!input.brandName || typeof input.brandName !== 'string') {
      throw new Error('ContentGenerationSkill requires a valid brandName string');
    }
  }

  private async generateTaglines(
    brandName: string, description: string, voice: string, tone: string, count: number, apiKey?: string,
  ): Promise<Record<string, unknown>> {
    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: `You are a creative copywriter specializing in brand taglines. Voice: ${voice}, Tone: ${tone}. Generate concise, memorable taglines.`,
          },
          {
            role: 'user',
            content: `Generate ${count} unique taglines for:\nBrand: ${brandName}\nDescription: ${description}\n\nEach tagline should be under 10 words, emotionally resonant, and aligned with ${voice} voice.`,
          },
        ], { temperature: 0.7, maxTokens: 500 });

        return {
          contentType: 'taglines',
          taglines: this.parseTaglines(response.content, count),
          raw: response.content.trim(),
        };
      } catch {
        // Fall through
      }
    }

    return {
      contentType: 'taglines',
      taglines: this.fallbackTaglines(brandName, count),
      raw: '',
    };
  }

  private parseTaglines(text: string, count: number): string[] {
    const lines = text.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .filter(l => !l.match(/^(here|tagline|sure|of course|below|following)/i))
      .filter(l => !l.startsWith('#'));

    const taglines = lines
      .map(l => l.replace(/^\d+[\.\)]\s*/, '').replace(/^["']|["']$/g, '').trim())
      .filter(l => l.length > 5);

    return taglines.slice(0, count);
  }

  private fallbackTaglines(brandName: string, count: number): string[] {
    const templates = [
      `Empower Your Vision with ${brandName}`,
      `${brandName}: Where Innovation Meets Purpose`,
      `Redefine Possibilities with ${brandName}`,
      `${brandName}: Built for the Future`,
      `Unlock Your Potential with ${brandName}`,
      `${brandName}: Think Different. Act Boldly.`,
      `Transform Tomorrow with ${brandName}`,
      `${brandName}: Your Vision, Our Expertise`,
      `Elevate Every Moment with ${brandName}`,
      `${brandName}: Beyond Boundaries`,
    ];

    return templates.slice(0, count);
  }

  private async generateMissionStatement(
    brandName: string, description: string, voice: string, tone: string, apiKey?: string,
  ): Promise<Record<string, unknown>> {
    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: `You are a brand strategist crafting mission statements. Voice: ${voice}, Tone: ${tone}. Create concise, inspiring mission statements.`,
          },
          {
            role: 'user',
            content: `Create 3 mission statement options for:\nBrand: ${brandName}\nDescription: ${description}\n\nEach mission statement should be 1-2 sentences, clear, and impactful.`,
          },
        ], { temperature: 0.6, maxTokens: 400 });

        return {
          contentType: 'mission_statement',
          options: this.splitOptions(response.content),
          raw: response.content.trim(),
        };
      } catch {
        // Fall through
      }
    }

    return {
      contentType: 'mission_statement',
      options: [
        `To empower ${description || 'our customers'} through innovative ${brandName} solutions that drive meaningful impact.`,
        `${brandName} is on a mission to ${description ? `deliver ${description}` : 'transform our industry'} with excellence and integrity.`,
        `Our mission at ${brandName} is to ${description ? description.toLowerCase() : 'create exceptional value'} for our community and stakeholders.`,
      ],
      raw: '',
    };
  }

  private async generateBrandStory(
    brandName: string, description: string, voice: string, tone: string, apiKey?: string,
  ): Promise<Record<string, unknown>> {
    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: `You are a brand storyteller. Voice: ${voice}, Tone: ${tone}. Craft compelling brand narratives.`,
          },
          {
            role: 'user',
            content: `Write a compelling brand story for:\nBrand: ${brandName}\nDescription: ${description}\n\nThe story should include:\n1. The founding inspiration\n2. Core values and purpose\n3. The transformation journey\n4. Vision for the future\n\nKeep it between 200-400 words.`,
          },
        ], { temperature: 0.7, maxTokens: 600 });

        return {
          contentType: 'brand_story',
          story: response.content.trim(),
          wordCount: response.content.split(/\s+/).length,
        };
      } catch {
        // Fall through
      }
    }

    return {
      contentType: 'brand_story',
      story: `${brandName} was born from a simple yet powerful idea: ${description || 'to make a difference'}. From our earliest days, we've been driven by a commitment to excellence, innovation, and the belief that every challenge is an opportunity in disguise. Today, we continue to push boundaries, guided by our core values and inspired by the communities we serve. Our journey is far from over — we're just getting started.`,
      wordCount: 60,
    };
  }

  private async generateSocialMediaContent(
    brandName: string, description: string, voice: string, count: number, apiKey?: string,
  ): Promise<Record<string, unknown>> {
    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: `You are a social media content strategist. Voice: ${voice}. Create engaging, platform-appropriate content.`,
          },
          {
            role: 'user',
            content: `Generate ${count} social media posts for:\nBrand: ${brandName}\nDescription: ${description}\n\nInclude a mix of:\n- 2 LinkedIn posts (professional/thought leadership)\n- 2 Twitter/X posts (short, punchy)\n- 1 Instagram/LinkedIn post (visual-focused)\n\nEach post should be ready to publish.`,
          },
        ], { temperature: 0.7, maxTokens: 800 });

        return {
          contentType: 'social_media',
          posts: this.parseSocialPosts(response.content),
          raw: response.content.trim(),
        };
      } catch {
        // Fall through
      }
    }

    const posts = [];
    const platforms = ['LinkedIn', 'Twitter/X', 'Instagram', 'LinkedIn', 'Twitter/X'];
    for (let i = 0; i < count; i++) {
      posts.push({
        platform: platforms[i % platforms.length],
        content: `Exciting news from ${brandName}! ${description || 'We\'re transforming the industry'} with our innovative approach. Stay tuned for what\'s coming next! #Innovation #${brandName.replace(/\s+/g, '')}`,
      });
    }

    return { contentType: 'social_media', posts };
  }

  private parseSocialPosts(text: string): Array<{ platform: string; content: string }> {
    const posts: Array<{ platform: string; content: string }> = [];
    const lines = text.split('\n');
    let currentPlatform = 'General';
    let currentContent = '';

    for (const line of lines) {
      const platformMatch = line.match(/\*\*(LinkedIn|Twitter|Instagram|Facebook|TikTok)\*\*/i);
      if (platformMatch) {
        if (currentContent) {
          posts.push({ platform: currentPlatform, content: currentContent.trim() });
        }
        currentPlatform = platformMatch[1];
        currentContent = '';
      } else if (line.trim() && !line.trim().startsWith('*') && !line.trim().startsWith('#')) {
        currentContent += line.trim() + '\n';
      }
    }

    if (currentContent) {
      posts.push({ platform: currentPlatform, content: currentContent.trim() });
    }

    return posts.length > 0 ? posts : [{ platform: 'General', content: text.trim() }];
  }

  private async generateEmailCopy(
    input: Record<string, unknown>, brandName: string, description: string, voice: string, tone: string, apiKey?: string,
  ): Promise<Record<string, unknown>> {
    const emailType = (input.emailType as string) || 'welcome';
    const recipientName = (input.recipientName as string) || 'there';

    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: `You are an email marketing copywriter. Voice: ${voice}, Tone: ${tone}. Write compelling email copy.`,
          },
          {
            role: 'user',
            content: `Write a ${emailType} email for:\nBrand: ${brandName}\nDescription: ${description}\nRecipient: ${recipientName}\n\nInclude:\n1. Subject line\n2. Preheader text\n3. Email body (150-250 words)\n4. Call to action`,
          },
        ], { temperature: 0.6, maxTokens: 600 });

        return {
          contentType: 'email',
          emailType,
          ...this.parseEmail(response.content, recipientName),
          raw: response.content.trim(),
        };
      } catch {
        // Fall through
      }
    }

    return {
      contentType: 'email',
      emailType,
      subjectLine: `Welcome to ${brandName}!`,
      previewText: `${description || 'Discover what'} ${brandName} has in store for you.`,
      body: `Hi ${recipientName},\n\nWelcome to ${brandName}! We're excited to have you on board. ${description || 'Our platform is designed to help you achieve more.'}\n\nBest,\nThe ${brandName} Team`,
      cta: 'Get Started',
    };
  }

  private parseEmail(text: string, recipientName: string): Record<string, unknown> {
    const lines = text.split('\n');
    let subjectLine = '';
    let previewText = '';
    let body = '';
    let cta = '';
    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().startsWith('subject')) {
        subjectLine = trimmed.replace(/^subject[:\s]*/i, '').replace(/["']/g, '').trim();
        currentSection = 'body';
      } else if (trimmed.toLowerCase().startsWith('preview')) {
        previewText = trimmed.replace(/^preview[:\s]*/i, '').replace(/["']/g, '').trim();
      } else if (trimmed.toLowerCase().includes('call to action') || trimmed.toLowerCase().includes('cta')) {
        cta = trimmed.replace(/.*?:?\s*/, '').trim();
      } else if (currentSection === 'body') {
        body += trimmed + '\n';
      }
    }

    return {
      subjectLine: subjectLine || `Hello from ${recipientName}'s brand`,
      previewText: previewText || '',
      body: body.trim() || 'Welcome! We are excited to connect with you.',
      cta: cta || 'Learn More',
    };
  }

  private async generateWebsiteCopy(
    brandName: string, description: string, voice: string, tone: string, apiKey?: string,
  ): Promise<Record<string, unknown>> {
    if (apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        const response = await provider.generateText([
          {
            role: 'system',
            content: `You are a website copywriter. Voice: ${voice}, Tone: ${tone}. Write compelling, conversion-focused web copy.`,
          },
          {
            role: 'user',
            content: `Write website copy for:\nBrand: ${brandName}\nDescription: ${description}\n\nInclude copy for:\n1. Hero section headline and subheadline\n2. About section (2-3 sentences)\n3. Features/benefits section (3-4 bullet points)\n4. Call to action section`,
          },
        ], { temperature: 0.6, maxTokens: 700 });

        return {
          contentType: 'website',
          ...this.parseWebsiteSections(response.content, brandName, description),
          raw: response.content.trim(),
        };
      } catch {
        // Fall through
      }
    }

    return {
      contentType: 'website',
      hero: { headline: `Welcome to ${brandName}`, subheadline: description || 'Transforming ideas into impact' },
      about: `${brandName} is dedicated to ${description ? description.toLowerCase() : 'delivering exceptional experiences'}. We combine innovation with purpose to create meaningful solutions for our community.`,
      features: [
        `Innovative solutions powered by ${brandName}`,
        'Data-driven approach with measurable results',
        'Seamless integration and user experience',
        'Dedicated support and continuous improvement',
      ],
      cta: { headline: 'Ready to Get Started?', buttonText: 'Get Started Today' },
    };
  }

  private parseWebsiteSections(text: string, brandName: string, description: string): Record<string, unknown> {
    const sections = text.split(/\n\s*\n/);
    return {
      hero: {
        headline: sections[0]?.split('\n')[0] || `Welcome to ${brandName}`,
        subheadline: sections[0]?.split('\n').slice(1).join(' ').trim() || description || '',
      },
      about: sections.find(s => s.toLowerCase().includes('about')) || `${brandName} delivers ${description || 'exceptional value'}.`,
      features: sections
        .find(s => s.toLowerCase().includes('feature') || s.toLowerCase().includes('benefit'))
        ?.split('\n')
        .filter(l => l.trim().startsWith('-') || l.trim().startsWith('*') || l.match(/^\d+\./))
        .map(l => l.replace(/^[-*\d\.]\s*/, '').trim()) || ['Innovation', 'Quality', 'Impact'],
      cta: {
        headline: sections.find(s => s.toLowerCase().includes('cta') || s.toLowerCase().includes('ready') || s.toLowerCase().includes('start'))?.split('\n')[0] || 'Get Started Today',
        buttonText: 'Learn More',
      },
    };
  }

  private splitOptions(text: string): string[] {
    return text.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 10)
      .filter(l => !l.startsWith('#'))
      .map(l => l.replace(/^\d+[\.\)]\s*/, '').replace(/^["']|["']$/g, '').trim())
      .slice(0, 3);
  }
}
