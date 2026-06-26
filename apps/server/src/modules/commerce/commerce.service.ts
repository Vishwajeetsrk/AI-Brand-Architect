import { Injectable } from '@nestjs/common';
import { prisma } from '@nexora/database';

interface Plan {
  id: string;
  name: string;
  planType: string;
  price: number;
  features: string[];
}

const PLANS: Plan[] = [
  { id: 'free', name: 'Free', planType: 'FREE', price: 0, features: ['Basic analytics', '1 active project', 'Community support'] },
  { id: 'pro', name: 'Pro', planType: 'PRO', price: 29, features: ['Advanced analytics', 'Unlimited projects', 'Priority support', 'Custom branding'] },
  { id: 'enterprise', name: 'Enterprise', planType: 'ENTERPRISE', price: 99, features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'Team collaboration'] },
];

@Injectable()
export class CommerceService {
  getPlans() { return PLANS; }

  getPlan(id: string) {
    const plan = PLANS.find(p => p.id === id);
    if (!plan) return null;
    return plan;
  }

  async createSubscription(userId: string, planId: string) {
    const planType = PLANS.find(p => p.id === planId)?.planType || 'FREE';
    let org = await prisma.organization.findFirst({
      where: { members: { some: { userId } } },
    });
    if (org) {
      return prisma.organization.update({
        where: { id: org.id },
        data: { plan: planType as any },
      });
    }
    return prisma.organization.create({
      data: {
        name: 'My Organization',
        slug: `org-${userId.substring(0, 8)}`,
        plan: planType as any,
        members: {
          create: { userId, role: 'OWNER' },
        },
      },
    });
  }

  async getSubscription(userId: string) {
    const org = await prisma.organization.findFirst({
      where: { members: { some: { userId } } },
    });
    if (!org) return null;
    return org;
  }

  async cancelSubscription(subscriptionId: string) {
    const org = await prisma.organization.findUnique({ where: { id: subscriptionId } });
    if (!org) return null;
    return prisma.organization.update({
      where: { id: subscriptionId },
      data: { plan: 'FREE' },
    });
  }

  async changePlan(subscriptionId: string, newPlanId: string) {
    const planType = PLANS.find(p => p.id === newPlanId)?.planType;
    if (!planType) return null;
    const org = await prisma.organization.findUnique({ where: { id: subscriptionId } });
    if (!org) return null;
    return prisma.organization.update({
      where: { id: subscriptionId },
      data: { plan: planType as any },
    });
  }

  async getInvoices(subscriptionId: string) {
    return [];
  }

  async getUsage(userId: string, period?: string) {
    const where: any = { userId };
    if (period) {
      const days = parseInt(period.replace('d', ''), 10);
      if (!isNaN(days)) {
        where.createdAt = { gte: new Date(Date.now() - days * 86400000) };
      }
    }
    const generations = await prisma.generation.findMany({ where });
    const projects = await prisma.project.count({ where: { userId } });
    const assets = await prisma.asset.count({ where: { userId } });
    return {
      generations: generations.length,
      tokensUsed: generations.reduce((sum, g) => sum + (g.tokensUsed || 0), 0),
      cost: generations.reduce((sum, g) => sum + (g.cost || 0), 0),
      projects,
      assets,
    };
  }

  async checkLimits(userId: string) {
    const org = await prisma.organization.findFirst({
      where: { members: { some: { userId } } },
    });
    const plan = (org?.plan as string) || 'FREE';
    const projectCount = await prisma.project.count({ where: { userId } });
    return {
      plan,
      limits: {
        maxProjects: plan === 'FREE' ? 1 : plan === 'PRO' ? 10 : 999,
        currentProjects: projectCount,
        teamMembers: plan === 'FREE' ? 1 : plan === 'PRO' ? 5 : 999,
      },
    };
  }

  recordUsage(userId: string, metric: string, value: number) {
    return { recorded: true, metric, value, userId };
  }
}
