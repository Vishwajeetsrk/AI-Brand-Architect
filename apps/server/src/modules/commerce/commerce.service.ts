import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { prisma, Prisma } from '@nexora/database';

const DEFAULT_PLANS = [
  {
    id: 'free', name: 'Free', planType: 'FREE' as const, price: 0, billingCycle: 'MONTHLY' as const,
    features: ['Basic analytics', '1 active project', 'Community support', '500 AI credits/month'],
    limits: { maxProjects: 1, teamMembers: 1, aiCredits: 500, storage: 100, apiRateLimit: 10 },
    sortOrder: 0,
  },
  {
    id: 'pro', name: 'Pro', planType: 'PRO' as const, price: 29, billingCycle: 'MONTHLY' as const,
    features: ['Advanced analytics', 'Unlimited projects', 'Priority support', 'Custom branding', '5 team members', '5000 AI credits/month'],
    limits: { maxProjects: 999, teamMembers: 5, aiCredits: 5000, storage: 1024, apiRateLimit: 100 },
    sortOrder: 1,
  },
  {
    id: 'enterprise', name: 'Enterprise', planType: 'ENTERPRISE' as const, price: 99, billingCycle: 'MONTHLY' as const,
    features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'Unlimited team members', '50000 AI credits/month'],
    limits: { maxProjects: 9999, teamMembers: 999, aiCredits: 50000, storage: 10240, apiRateLimit: 1000 },
    sortOrder: 2,
  },
];

@Injectable()
export class CommerceService {
  // ── Seed ──────────────────────────────────────────────────────────
  private async ensurePlans() {
    const count = await prisma.billingPlan.count();
    if (count > 0) return;
    await prisma.billingPlan.createMany({
      data: DEFAULT_PLANS.map(p => ({
        id: p.id, name: p.name, planType: p.planType,
        price: new Prisma.Decimal(p.price), billingCycle: p.billingCycle,
        features: p.features, limits: p.limits, sortOrder: p.sortOrder,
      })),
    });
  }

  // ── Plans ─────────────────────────────────────────────────────────
  async getPlans() {
    await this.ensurePlans();
    return prisma.billingPlan.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } });
  }

  async getPlan(id: string) {
    await this.ensurePlans();
    const plan = await prisma.billingPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async createPlan(data: Prisma.BillingPlanCreateInput) {
    return prisma.billingPlan.create({ data });
  }

  async updatePlan(id: string, data: Prisma.BillingPlanUpdateInput) {
    return prisma.billingPlan.update({ where: { id }, data });
  }

  // ── Wallets ───────────────────────────────────────────────────────
  private async ensureWallet(userId: string, organizationId?: string) {
    let wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, organizationId: organizationId ?? null, balance: 0, lifetimeCredits: 0, lifetimeSpend: 0 },
      });
    }
    return wallet;
  }

  async getWallet(userId: string) {
    return this.ensureWallet(userId);
  }

  async getWalletTransactions(userId: string, limit = 50, offset = 0) {
    const wallet = await this.ensureWallet(userId);
    return prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: limit, skip: offset,
    });
  }

  async addFunds(userId: string, amount: number, reason: string, referenceType?: string, referenceId?: string) {
    const wallet = await this.ensureWallet(userId);
    return prisma.$transaction(async (tx) => {
      const bal = await tx.wallet.findUnique({ where: { id: wallet.id } });
      if (!bal) throw new NotFoundException('Wallet not found');
      const balanceBefore = bal.balance;
      const balanceAfter = balanceBefore.add(new Prisma.Decimal(amount));
      await tx.wallet.update({ where: { id: wallet.id }, data: { balance: balanceAfter, lifetimeCredits: bal.lifetimeCredits.add(new Prisma.Decimal(amount)) } });
      return tx.walletTransaction.create({
        data: {
          walletId: wallet.id, type: 'CREDIT', reason: reason as any, amount: new Prisma.Decimal(amount),
          balanceBefore, balanceAfter, description: reason, referenceType, referenceId,
        },
      });
    });
  }

  async deductFunds(userId: string, amount: number, reason: string, referenceType?: string, referenceId?: string) {
    const wallet = await this.ensureWallet(userId);
    return prisma.$transaction(async (tx) => {
      const bal = await tx.wallet.findUnique({ where: { id: wallet.id } });
      if (!bal) throw new NotFoundException('Wallet not found');
      if (bal.balance.lt(new Prisma.Decimal(amount))) throw new BadRequestException('Insufficient balance');
      const balanceBefore = bal.balance;
      const balanceAfter = balanceBefore.sub(new Prisma.Decimal(amount));
      await tx.wallet.update({ where: { id: wallet.id }, data: { balance: balanceAfter, lifetimeSpend: bal.lifetimeSpend.add(new Prisma.Decimal(amount)) } });
      return tx.walletTransaction.create({
        data: {
          walletId: wallet.id, type: 'DEBIT', reason: reason as any, amount: new Prisma.Decimal(amount),
          balanceBefore, balanceAfter, description: reason, referenceType, referenceId,
        },
      });
    });
  }

  async transferFunds(fromUserId: string, toUserId: string, amount: number) {
    const src = await this.ensureWallet(fromUserId);
    const dst = await this.ensureWallet(toUserId);
    if (src.balance.lt(new Prisma.Decimal(amount))) throw new BadRequestException('Insufficient balance');
    return prisma.$transaction(async (tx) => {
      const s = await tx.wallet.findUnique({ where: { id: src.id } });
      const d = await tx.wallet.findUnique({ where: { id: dst.id } });
      if (!s || !d) throw new NotFoundException('Wallet not found');
      await tx.wallet.update({ where: { id: src.id }, data: { balance: s.balance.sub(new Prisma.Decimal(amount)) } });
      await tx.wallet.update({ where: { id: dst.id }, data: { balance: d.balance.add(new Prisma.Decimal(amount)), lifetimeCredits: d.lifetimeCredits.add(new Prisma.Decimal(amount)) } });
      await tx.walletTransaction.create({ data: { walletId: src.id, type: 'DEBIT', reason: 'TRANSFER', amount: new Prisma.Decimal(amount), balanceBefore: s.balance, balanceAfter: s.balance.sub(new Prisma.Decimal(amount)), description: `Transfer to ${toUserId}` } });
      await tx.walletTransaction.create({ data: { walletId: dst.id, type: 'CREDIT', reason: 'TRANSFER', amount: new Prisma.Decimal(amount), balanceBefore: d.balance, balanceAfter: d.balance.add(new Prisma.Decimal(amount)), description: `Transfer from ${fromUserId}` } });
      return { success: true };
    });
  }

  // ── Subscriptions ────────────────────────────────────────────────
  async createSubscription(userId: string, planId: string, billingCycle?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY') {
    await this.ensurePlans();
    const plan = await prisma.billingPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');
    let org = await prisma.organization.findFirst({ where: { members: { some: { userId } } } });
    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'My Organization', slug: `org-${userId.substring(0, 8)}`, plan: plan.planType, members: { create: { userId, role: 'OWNER' } } },
      });
    }
    const existingSub = await prisma.subscription.findFirst({ where: { organizationId: org.id, status: { in: ['ACTIVE', 'TRIALING'] } } });
    if (existingSub) throw new ConflictException('Organization already has an active subscription');
    const now = new Date();
    const periodEnd = this.periodEnd(billingCycle || 'MONTHLY', now);
    const sub = await prisma.subscription.create({
      data: {
        organizationId: org.id, planId, status: plan.price.gt(0) ? 'TRIALING' : 'ACTIVE',
        billingCycle: billingCycle || 'MONTHLY', currentPeriodStart: now, currentPeriodEnd: periodEnd,
        trialEndsAt: plan.price.gt(0) ? new Date(now.getTime() + 14 * 86400000) : undefined,
      },
    });
    await prisma.organization.update({ where: { id: org.id }, data: { plan: plan.planType } });
    return sub;
  }

  async getUserSubscription(userId: string) {
    const org = await prisma.organization.findFirst({ where: { members: { some: { userId } } } });
    if (!org) return null;
    return prisma.subscription.findFirst({
      where: { organizationId: org.id },
      orderBy: { createdAt: 'desc' },
      include: { plan: true },
    });
  }

  async cancelSubscription(subscriptionId: string) {
    const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (!sub) throw new NotFoundException('Subscription not found');
    return prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'CANCELED', canceledAt: new Date(), endsAt: sub.currentPeriodEnd },
    });
  }

  async changePlan(subscriptionId: string, newPlanId: string) {
    await this.ensurePlans();
    const plan = await prisma.billingPlan.findUnique({ where: { id: newPlanId } });
    if (!plan) throw new NotFoundException('Plan not found');
    const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (!sub) throw new NotFoundException('Subscription not found');
    const updated = await prisma.subscription.update({ where: { id: subscriptionId }, data: { planId: newPlanId } });
    await prisma.organization.update({ where: { id: sub.organizationId }, data: { plan: plan.planType } });
    return updated;
  }

  async renewSubscription(subscriptionId: string) {
    const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId }, include: { plan: true } });
    if (!sub) throw new NotFoundException('Subscription not found');
    if (sub.status !== 'ACTIVE' && sub.status !== 'TRIALING') throw new BadRequestException('Subscription cannot be renewed');
    const now = new Date();
    const periodEnd = this.periodEnd(sub.billingCycle, now);
    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'ACTIVE', currentPeriodStart: now, currentPeriodEnd: periodEnd, trialEndsAt: null },
    });
    await this.generateInvoice(sub.organizationId, subscriptionId, sub.plan);
    return updated;
  }

  // ── Invoices ──────────────────────────────────────────────────────
  async getInvoices(subscriptionId: string) {
    return prisma.invoice.findMany({
      where: { subscriptionId },
      include: { lineItems: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvoicesForOrg(organizationId: string) {
    return prisma.invoice.findMany({
      where: { organizationId },
      include: { lineItems: true, subscription: { include: { plan: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateInvoice(organizationId: string, subscriptionId: string, plan: { id: string; name: string; price: Prisma.Decimal; currency: string }, couponCode?: string) {
    let discountAmount = new Prisma.Decimal(0);
    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await this.validateCoupon(couponCode, plan.id);
      if (coupon) {
        couponId = coupon.id;
        discountAmount = coupon.type === 'PERCENTAGE'
          ? plan.price.mul(coupon.value).div(100)
          : coupon.value;
        if (coupon.maxDiscount && discountAmount.gt(coupon.maxDiscount)) discountAmount = coupon.maxDiscount;
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      }
    }
    const total = plan.price.sub(discountAmount);
    const count = await prisma.invoice.count() + 1;
    return prisma.invoice.create({
      data: {
        subscriptionId, organizationId, invoiceNumber: `INV-${Date.now()}-${count}`,
        status: 'PENDING', subtotal: plan.price, discountAmount, taxAmount: new Prisma.Decimal(0),
        total, currency: plan.currency || 'INR', couponId: couponId ?? undefined,
        dueDate: new Date(Date.now() + 30 * 86400000),
        lineItems: {
          create: [{
            description: `${plan.name} - ${plan.id}`,
            quantity: 1, unitPrice: total, amount: total, type: 'SUBSCRIPTION',
          }],
        },
      },
    });
  }

  async payInvoice(invoiceId: string) {
    return prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'PAID', paidAt: new Date() } });
  }

  // ── Coupons ───────────────────────────────────────────────────────
  async validateCoupon(code: string, planId?: string) {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) return null;
    if (!coupon.active) throw new BadRequestException('Coupon is inactive');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new BadRequestException('Coupon has expired');
    if (coupon.startsAt && coupon.startsAt > new Date()) throw new BadRequestException('Coupon is not yet active');
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new BadRequestException('Coupon usage limit reached');
    if (planId && coupon.planId && coupon.planId !== planId) throw new BadRequestException('Coupon does not apply to this plan');
    return coupon;
  }

  async createCoupon(data: Prisma.CouponCreateInput) {
    return prisma.coupon.create({ data });
  }

  async getCoupons() {
    return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // ── Usage Metering ────────────────────────────────────────────────
  async recordUsage(userId: string, metric: string, value: number, unit: string, organizationId?: string, metadata?: any) {
    return prisma.usageRecord.create({
      data: { userId, organizationId: organizationId ?? null, metric, value: new Prisma.Decimal(value), unit, metadata: metadata ?? undefined },
    });
  }

  async getUsage(userId: string, period?: string) {
    const where: any = { userId };
    if (period) {
      const days = parseInt(period.replace('d', ''), 10);
      if (!isNaN(days)) where.recordedAt = { gte: new Date(Date.now() - days * 86400000) };
    }
    const usageRecords = await prisma.usageRecord.findMany({ where, orderBy: { recordedAt: 'desc' } });
    const generations = await prisma.generation.findMany({ where: { userId } });
    const projects = await prisma.project.count({ where: { userId } });
    const assets = await prisma.asset.count({ where: { userId } });
    const byMetric = usageRecords.reduce((acc, r) => {
      acc[r.metric] = (acc[r.metric] || 0) + Number(r.value);
      return acc;
    }, {} as Record<string, number>);
    return {
      generations: generations.length,
      tokensUsed: generations.reduce((sum, g) => sum + (g.tokensUsed || 0), 0),
      cost: generations.reduce((sum, g) => sum + (g.cost || 0), 0),
      projects, assets,
      usageRecords: usageRecords.length,
      byMetric,
    };
  }

  async getOrgUsage(organizationId: string, period?: string) {
    const where: any = { organizationId };
    if (period) {
      const days = parseInt(period.replace('d', ''), 10);
      if (!isNaN(days)) where.recordedAt = { gte: new Date(Date.now() - days * 86400000) };
    }
    return prisma.usageRecord.findMany({ where, orderBy: { recordedAt: 'desc' } });
  }

  // ── Plan Limits / Entitlements ────────────────────────────────────
  async checkLimits(userId: string) {
    const org = await prisma.organization.findFirst({ where: { members: { some: { userId } } } });
    const planType = (org?.plan as string) || 'FREE';
    const plans = await this.getPlans();
    const plan = plans.find(p => p.planType === planType) || plans[0];
    const projectCount = await prisma.project.count({ where: { userId } });
    const memberCount = org ? await prisma.organizationMember.count({ where: { organizationId: org.id } }) : 1;
    const limits = plan.limits as any;
    return {
      plan: planType, planName: plan.name,
      limits: {
        maxProjects: limits.maxProjects ?? 1,
        currentProjects: projectCount,
        teamMembers: limits.teamMembers ?? 1,
        currentMembers: memberCount,
        aiCredits: limits.aiCredits ?? 0,
        storage: limits.storage ?? 0,
        apiRateLimit: limits.apiRateLimit ?? 10,
      },
      withinLimits: {
        projects: projectCount < (limits.maxProjects ?? 1),
        members: memberCount <= (limits.teamMembers ?? 1),
      },
    };
  }

  // ── Revenue Sharing ───────────────────────────────────────────────
  async getRevenueShare(creatorId: string, period?: string) {
    const where: any = { referenceId: creatorId, reason: 'REVENUE_SHARE' };
    if (period) {
      const days = parseInt(period.replace('d', ''), 10);
      if (!isNaN(days)) where.createdAt = { gte: new Date(Date.now() - days * 86400000) };
    }
    const wallet = await prisma.wallet.findUnique({ where: { userId: creatorId } });
    if (!wallet) return { totalEarned: 0, transactions: [] };
    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id, reason: 'REVENUE_SHARE' },
      orderBy: { createdAt: 'desc' },
    });
    return {
      totalEarned: transactions.reduce((s, t) => s + Number(t.amount), 0),
      transactions,
    };
  }

  // ── Analytics ─────────────────────────────────────────────────────
  async getAnalytics() {
    const activeSubscriptions = await prisma.subscription.count({ where: { status: 'ACTIVE' } });
    const trialing = await prisma.subscription.count({ where: { status: 'TRIALING' } });
    const totalRevenue = await prisma.invoice.aggregate({ where: { status: 'PAID' }, _sum: { total: true } });
    const pendingRevenue = await prisma.invoice.aggregate({ where: { status: 'PENDING' }, _sum: { total: true } });
    const totalWallets = await prisma.wallet.count();
    const totalCredits = await prisma.wallet.aggregate({ _sum: { lifetimeCredits: true } });
    const totalSpend = await prisma.wallet.aggregate({ _sum: { lifetimeSpend: true } });
    return {
      mrr: Number(totalRevenue._sum.total || 0),
      pendingRevenue: Number(pendingRevenue._sum.total || 0),
      activeSubscriptions,
      trialing,
      totalWallets,
      totalCreditsIssued: Number(totalCredits._sum.lifetimeCredits || 0),
      totalSpendTracked: Number(totalSpend._sum.lifetimeSpend || 0),
    };
  }

  // ── Helpers ───────────────────────────────────────────────────────
  private periodEnd(cycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY', from: Date): Date {
    const d = new Date(from);
    switch (cycle) {
      case 'MONTHLY': d.setMonth(d.getMonth() + 1); break;
      case 'QUARTERLY': d.setMonth(d.getMonth() + 3); break;
      case 'YEARLY': d.setFullYear(d.getFullYear() + 1); break;
    }
    return d;
  }
}
