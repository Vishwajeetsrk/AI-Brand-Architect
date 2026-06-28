import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';

export interface Brand {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  targetAudience?: string;
  values?: string[];
  mission?: string;
  vision?: string;
  userId: string;
  organizationId?: string;
  status: 'draft' | 'generated' | 'published';
  aiGenerated?: boolean;
  generationPrompt?: string;
  generationStyle?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandIdentity {
  id: string;
  brandId: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string[];
  };
  typography: {
    heading: string;
    body: string;
    mono: string;
  };
  logo: {
    type: string;
    text: string;
    colors: string[];
  };
  spacing: {
    unit: number;
    scale: number[];
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBrandDto {
  name: string;
  description?: string;
  industry?: string;
  targetAudience?: string;
  values?: string[];
  mission?: string;
  vision?: string;
  organizationId: string;
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
  industry?: string;
  targetAudience?: string;
  values?: string[];
  mission?: string;
  vision?: string;
}

export interface GenerateBrandDto {
  prompt: string;
  style?: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant';
  colors?: string[];
  industry?: string;
}

@Injectable()
export class BrandsService {
  private readonly logger = new Logger(BrandsService.name);

  private brands: Map<string, Brand> = new Map();
  private identities: Map<string, BrandIdentity> = new Map();

  constructor() {}

  async createBrand(userId: string, createBrandDto: CreateBrandDto): Promise<Brand> {
    this.logger.log(`Creating brand for user: ${userId}`);

    const brand: Brand = {
      id: Date.now().toString(),
      ...createBrandDto,
      userId,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.brands.set(brand.id, brand);
    this.logger.log(`Brand created: ${brand.id}`);

    return brand;
  }

  async getBrands(userId: string, organizationId?: string): Promise<Brand[]> {
    this.logger.log(`Getting brands for user: ${userId}`);
    
    const brands = Array.from(this.brands.values()).filter(b => b.userId === userId);
    
    if (organizationId) {
      return brands.filter(b => b.organizationId === organizationId);
    }

    return brands.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBrand(userId: string, brandId: string): Promise<Brand> {
    this.logger.log(`Getting brand: ${brandId}`);
    
    const brand = this.brands.get(brandId);
    
    if (!brand || brand.userId !== userId) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async updateBrand(userId: string, brandId: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    this.logger.log(`Updating brand: ${brandId}`);
    
    const brand = await this.getBrand(userId, brandId);
    
    Object.assign(brand, updateBrandDto);
    brand.updatedAt = new Date();
    
    this.brands.set(brandId, brand);
    return brand;
  }

  async deleteBrand(userId: string, brandId: string): Promise<void> {
    this.logger.log(`Deleting brand: ${brandId}`);
    
    const brand = await this.getBrand(userId, brandId);
    this.brands.delete(brandId);
    this.identities.delete(brandId);
  }

  async generateBrand(userId: string, generateBrandDto: GenerateBrandDto): Promise<Brand> {
    this.logger.log(`Generating brand with AI for user: ${userId}`);
    
    const brand: Brand = {
      id: Date.now().toString(),
      name: `${generateBrandDto.prompt.slice(0, 20)} Brand`,
      description: generateBrandDto.prompt,
      industry: generateBrandDto.industry,
      userId,
      organizationId: null,
      status: 'generated',
      aiGenerated: true,
      generationPrompt: generateBrandDto.prompt,
      generationStyle: generateBrandDto.style,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.brands.set(brand.id, brand);

    // Generate brand identity
    await this.generateBrandIdentity(brand.id, generateBrandDto);

    return brand;
  }

  private async generateBrandIdentity(brandId: string, generateBrandDto: GenerateBrandDto): Promise<BrandIdentity> {
    // Mock AI-generated brand identity
    const identity: BrandIdentity = {
      id: Date.now().toString(),
      brandId,
      colors: {
        primary: generateBrandDto.colors?.[0] || '#6366f1',
        secondary: generateBrandDto.colors?.[1] || '#8b5cf6',
        accent: generateBrandDto.colors?.[2] || '#a855f7',
        neutral: ['#ffffff', '#f3f4f6', '#9ca3af', '#4b5563', '#111827'],
      },
      typography: {
        heading: 'Inter',
        body: 'Inter',
        mono: 'JetBrains Mono',
      },
      logo: {
        type: 'text',
        text: 'Brand',
        colors: ['#6366f1'],
      },
      spacing: {
        unit: 8,
        scale: [0.5, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32],
      },
      borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.identities.set(brandId, identity);
    return identity;
  }

  async getBrandIdentity(userId: string, brandId: string): Promise<BrandIdentity> {
    this.logger.log(`Getting brand identity: ${brandId}`);
    
    await this.getBrand(userId, brandId); // Verify access

    const identity = this.identities.get(brandId);
    
    if (!identity) {
      throw new NotFoundException('Brand identity not found');
    }

    return identity;
  }

  async updateBrandIdentity(userId: string, brandId: string, identityData: Partial<BrandIdentity>): Promise<BrandIdentity> {
    this.logger.log(`Updating brand identity: ${brandId}`);
    
    const identity = await this.getBrandIdentity(userId, brandId);
    
    Object.assign(identity, identityData);
    identity.updatedAt = new Date();
    
    this.identities.set(brandId, identity);
    return identity;
  }

  async generateBrandGuidelines(userId: string, brandId: string): Promise<any> {
    this.logger.log(`Generating brand guidelines: ${brandId}`);
    
    const brand = await this.getBrand(userId, brandId);
    const identity = await this.getBrandIdentity(userId, brandId);

    // Mock guidelines generation - in production, generate PDF
    return {
      brandId,
      brandName: brand.name,
      sections: [
        {
          title: 'Brand Overview',
          content: {
            mission: brand.mission,
            vision: brand.vision,
            values: brand.values,
          },
        },
        {
          title: 'Logo Usage',
          content: {
            primaryLogo: identity.logo,
            clearSpace: '1x',
            minimumSize: '24px',
            incorrectUsage: [],
          },
        },
        {
          title: 'Color Palette',
          content: {
            primary: identity.colors.primary,
            secondary: identity.colors.secondary,
            accent: identity.colors.accent,
            neutral: identity.colors.neutral,
          },
        },
        {
          title: 'Typography',
          content: {
            heading: identity.typography.heading,
            body: identity.typography.body,
            mono: identity.typography.mono,
            scale: ['12px', '14px', '16px', '18px', '24px', '32px', '48px', '64px'],
          },
        },
        {
          title: 'Spacing & Layout',
          content: {
            unit: identity.spacing.unit,
            scale: identity.spacing.scale,
            grid: '8pt grid system',
          },
        },
        {
          title: 'Imagery & Photography',
          content: {
            style: 'Modern, clean, professional',
            colorTreatment: 'Brand colors applied',
            composition: 'Rule of thirds',
          },
        },
        {
          title: 'Voice & Tone',
          content: {
            personality: 'Professional, friendly, innovative',
            tone: ['Confident', 'Clear', 'Approachable'],
            examples: [],
          },
        },
      ],
      generatedAt: new Date(),
      format: 'pdf',
    };
  }

  async exportBrand(userId: string, brandId: string, format: string): Promise<any> {
    this.logger.log(`Exporting brand: ${brandId} in format: ${format}`);
    
    const brand = await this.getBrand(userId, brandId);
    const identity = await this.getBrandIdentity(userId, brandId);

    // Mock export - in production, generate actual files
    return {
      brandId,
      brandName: brand.name,
      format,
      url: `/exports/brand-${brandId}.${format}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      includes: ['logo', 'colors', 'typography', 'guidelines'],
    };
  }

  async duplicateBrand(userId: string, brandId: string): Promise<Brand> {
    this.logger.log(`Duplicating brand: ${brandId}`);
    
    const originalBrand = await this.getBrand(userId, brandId);
    
    const newBrand: Brand = {
      ...originalBrand,
      id: Date.now().toString(),
      name: `${originalBrand.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.brands.set(newBrand.id, newBrand);
    return newBrand;
  }

  async getBrandHealth(userId: string, brandId: string): Promise<any> {
    this.logger.log(`Getting brand health: ${brandId}`);
    
    const brand = await this.getBrand(userId, brandId);

    // Mock health score - in production, calculate based on usage
    return {
      brandId,
      score: 85,
      metrics: {
        consistency: 90,
        completeness: 80,
        usage: 75,
        recognition: 85,
      },
      recommendations: [
        'Update logo for better scalability',
        'Add more color variations',
        'Create brand voice guidelines',
      ],
      lastUpdated: new Date(),
    };
  }

  async searchBrands(userId: string, query: string): Promise<Brand[]> {
    this.logger.log(`Searching brands: ${query}`);
    
    const queryLower = query.toLowerCase();
    
    return Array.from(this.brands.values())
      .filter(b => 
        b.userId === userId &&
        (b.name.toLowerCase().includes(queryLower) || 
         b.description?.toLowerCase().includes(queryLower))
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}