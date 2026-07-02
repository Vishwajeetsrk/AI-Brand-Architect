import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma } from '@nexora/database';
import { CreateFlagDto, UpdateFlagDto, EvaluateFlagsDto } from './dto/feature-flags.dto';

@Injectable()
export class FeatureFlagsService {
  private readonly logger = new Logger(FeatureFlagsService.name);
  private cache: Map<string, { flag: any; expiresAt: number }> = new Map();

  async findAll(tag?: string): Promise<any> {
    const where: any = {};
    if (tag) where.tags = { has: tag };
    return prisma.featureFlag.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string): Promise<any> {
    const flag = await prisma.featureFlag.findUnique({ where: { id } });
    if (!flag) throw new NotFoundException('Feature flag not found');
    return flag;
  }

  async findByKey(key: string): Promise<any> {
    return prisma.featureFlag.findUnique({ where: { key } });
  }

  async create(dto: CreateFlagDto): Promise<any> {
    return prisma.featureFlag.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateFlagDto): Promise<any> {
    const flag = await prisma.featureFlag.findUnique({ where: { id } });
    if (!flag) throw new NotFoundException('Feature flag not found');
    this.cache.delete(flag.key);
    return prisma.featureFlag.update({ where: { id }, data: dto as any });
  }

  async toggle(id: string): Promise<any> {
    const flag = await prisma.featureFlag.findUnique({ where: { id } });
    if (!flag) throw new NotFoundException('Feature flag not found');
    this.cache.delete(flag.key);
    return prisma.featureFlag.update({ where: { id }, data: { enabled: !flag.enabled } });
  }

  async remove(id: string): Promise<any> {
    const flag = await prisma.featureFlag.findUnique({ where: { id } });
    if (!flag) throw new NotFoundException('Feature flag not found');
    this.cache.delete(flag.key);
    return prisma.featureFlag.delete({ where: { id } });
  }

  async evaluate(key: string, context?: EvaluateFlagsDto): Promise<boolean> {
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.flag.enabled && this.evaluateRules(cached.flag, context);

    const flag = await prisma.featureFlag.findUnique({ where: { key } });
    if (!flag) return false;

    this.cache.set(key, { flag, expiresAt: Date.now() + 30000 });
    return flag.enabled && this.evaluateRules(flag, context);
  }

  async evaluateAll(context?: EvaluateFlagsDto): Promise<Record<string, boolean>> {
    const flags = await prisma.featureFlag.findMany();
    const result: Record<string, boolean> = {};
    for (const flag of flags) {
      result[flag.key] = flag.enabled && this.evaluateRules(flag, context);
    }
    return result;
  }

  private evaluateRules(flag: any, context?: EvaluateFlagsDto): boolean {
    if (!flag.rules || !context) return true;
    const rules = flag.rules as Record<string, any>;

    if (rules.environment && context.environment && rules.environment !== context.environment) return false;

    if (rules.userIds?.length && (!context.userId || !rules.userIds.includes(context.userId))) return false;

    if (rules.groups?.length) {
      if (!context.groups?.length) return false;
      if (!rules.groups.some((g: string) => context.groups!.includes(g))) return false;
    }

    if (rules.rolloutPercentage && context.userId) {
      const hash = this.hashCode(context.userId + flag.key) % 100;
      if (hash >= rules.rolloutPercentage) return false;
    }

    return true;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
