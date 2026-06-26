import { Plan, Subscription, Invoice, UsageRecord, PLANS, SubscriptionStatus } from './types';

export class BillingSystem {
  private subscriptions: Map<string, Subscription> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private usage: Map<string, UsageRecord[]> = new Map();

  getPlans(): Plan[] { return PLANS; }

  getPlan(id: string): Plan | undefined { return PLANS.find(p => p.id === id); }

  createSubscription(userId: string, planId: string): Subscription {
    const plan = this.getPlan(planId);
    if (!plan) throw new Error('Invalid plan');
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 1);
    const sub: Subscription = {
      id: crypto.randomUUID(), userId, planId, status: 'active',
      currentPeriodStart: now.toISOString(), currentPeriodEnd: end.toISOString(),
      cancelAtPeriodEnd: false,
    };
    this.subscriptions.set(sub.id, sub);
    this.createInvoice(sub.id, plan.price, `Subscription: ${plan.name}`);
    return sub;
  }

  cancelSubscription(subscriptionId: string): Subscription | undefined {
    const sub = this.subscriptions.get(subscriptionId);
    if (!sub) return undefined;
    sub.cancelAtPeriodEnd = true;
    return sub;
  }

  changePlan(subscriptionId: string, newPlanId: string): Subscription | undefined {
    const sub = this.subscriptions.get(subscriptionId);
    if (!sub) throw new Error('Subscription not found');
    const plan = this.getPlan(newPlanId);
    if (!plan) throw new Error('Invalid plan');
    sub.planId = newPlanId;
    return sub;
  }

  private createInvoice(subscriptionId: string, amount: number, description: string): Invoice {
    const invoice: Invoice = {
      id: crypto.randomUUID(), subscriptionId, amount, currency: 'USD',
      status: 'paid', dueDate: new Date().toISOString(), paidAt: new Date().toISOString(),
      lineItems: [{ description, amount, quantity: 1 }],
    };
    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  getSubscription(userId: string): Subscription | undefined {
    return Array.from(this.subscriptions.values()).find(s => s.userId === userId && s.status === 'active');
  }

  getInvoices(subscriptionId: string): Invoice[] {
    return Array.from(this.invoices.values()).filter(i => i.subscriptionId === subscriptionId);
  }

  recordUsage(userId: string, metric: string, value: number): UsageRecord {
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const record: UsageRecord = { id: crypto.randomUUID(), userId, metric, value, period, recordedAt: now.toISOString() };
    const userUsage = this.usage.get(userId) || [];
    userUsage.push(record);
    this.usage.set(userId, userUsage);
    return record;
  }

  getUsage(userId: string, period?: string): UsageRecord[] {
    const userUsage = this.usage.get(userId) || [];
    return period ? userUsage.filter(u => u.period === period) : userUsage;
  }

  checkLimits(userId: string): { plan: Plan; usage: Record<string, number>; limits: Record<string, boolean> } {
    const sub = this.getSubscription(userId);
    const plan = sub ? this.getPlan(sub.planId) || PLANS[0] : PLANS[0];
    const userUsage = this.usage.get(userId) || [];
    const currentPeriod = userUsage.filter(u => u.period === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    const brandsCount = currentPeriod.filter(u => u.metric === 'brand_created').reduce((s, u) => s + u.value, 0);
    const aiGenerations = currentPeriod.filter(u => u.metric === 'ai_generation').reduce((s, u) => s + u.value, 0);
    return {
      plan,
      usage: { brands: brandsCount, aiGenerations },
      limits: {
        brandsExceeded: brandsCount >= plan.limits.brands,
        aiExceeded: aiGenerations >= plan.limits.aiGenerations,
      },
    };
  }
}

export const billing = new BillingSystem();
