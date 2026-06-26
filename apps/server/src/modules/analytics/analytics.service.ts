import { Injectable } from '@nestjs/common';
import { prisma } from '@nexora/database';

@Injectable()
export class AnalyticsService {
  async getDashboardMetrics() {
    const [totalUsers, totalBrands, totalProjects, totalGenerations, totalWorkflows] = await Promise.all([
      prisma.user.count(),
      prisma.brand.count(),
      prisma.project.count(),
      prisma.generation.count(),
      prisma.workflow.count(),
    ]);
    return {
      metrics: {
        totalUsers,
        totalBrands,
        totalProjects,
        totalGenerations,
        totalWorkflows,
      },
      dateRange: '30d',
    };
  }

  async getBrandHealth(brandId: string) {
    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) return null;
    const [projectCount, generationCount, assets] = await Promise.all([
      prisma.project.count({ where: { brandId } }),
      prisma.generation.count({ where: { project: { brandId } } }),
      prisma.asset.count({ where: { project: { brandId } } }),
    ]);
    return {
      brandId: brand.id,
      brandName: brand.name,
      projectCount,
      generationCount,
      assets,
      mentions: 15000,
      sentiment: 72,
      engagement: 45000,
      loyalty: 68,
    };
  }

  async getEngagementMetrics() {
    const byType = await prisma.generation.groupBy({
      by: ['type'],
      _count: { id: true },
      _sum: { tokensUsed: true, cost: true },
    });
    return byType.map(g => ({
      type: g.type.toLowerCase(),
      count: g._count.id,
      tokensUsed: g._sum.tokensUsed || 0,
      cost: g._sum.cost || 0,
      channel: 'ai',
    }));
  }
}
