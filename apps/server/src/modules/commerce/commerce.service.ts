import { Injectable, NotFoundException } from '@nestjs/common';
import { BillingSystem, billing, PLANS, Plan } from '@nexora/commerce';

@Injectable()
export class CommerceService {
  private billing: BillingSystem;

  constructor() {
    this.billing = billing;
  }

  getPlans() { return PLANS; }

  getPlan(id: string) {
    const plan = this.billing.getPlan(id);
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  createSubscription(userId: string, planId: string) {
    return this.billing.createSubscription(userId, planId);
  }

  getSubscription(userId: string) {
    return this.billing.getSubscription(userId);
  }

  cancelSubscription(subscriptionId: string) {
    const sub = this.billing.cancelSubscription(subscriptionId);
    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }

  changePlan(subscriptionId: string, newPlanId: string) {
    const sub = this.billing.changePlan(subscriptionId, newPlanId);
    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }

  getInvoices(subscriptionId: string) { return this.billing.getInvoices(subscriptionId); }

  getUsage(userId: string, period?: string) { return this.billing.getUsage(userId, period); }

  checkLimits(userId: string) { return this.billing.checkLimits(userId); }

  recordUsage(userId: string, metric: string, value: number) {
    return this.billing.recordUsage(userId, metric, value);
  }
}
