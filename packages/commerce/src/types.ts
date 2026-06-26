export type PlanTier = 'free' | 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'expired';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'canceled';

export interface Plan {
  id: string; name: string; tier: PlanTier; price: number;
  interval: 'monthly' | 'yearly'; features: string[];
  limits: { brands: number; projects: number; aiGenerations: number; teamMembers: number; storage: number };
}

export interface Subscription {
  id: string; userId: string; planId: string; status: SubscriptionStatus;
  currentPeriodStart: string; currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean; trialEndsAt?: string;
}

export interface Invoice {
  id: string; subscriptionId: string; amount: number; currency: string;
  status: InvoiceStatus; dueDate: string; paidAt?: string;
  lineItems: { description: string; amount: number; quantity: number }[];
}

export interface UsageRecord {
  id: string; userId: string; metric: string; value: number;
  period: string; recordedAt: string;
}

export const PLANS: Plan[] = [
  { id: 'free', name: 'Free', tier: 'free', price: 0, interval: 'monthly',
    features: ['1 brand', '3 projects', '50 AI generations/month', 'Basic templates'],
    limits: { brands: 1, projects: 3, aiGenerations: 50, teamMembers: 1, storage: 100 } },
  { id: 'starter', name: 'Starter', tier: 'starter', price: 29, interval: 'monthly',
    features: ['5 brands', '20 projects', '500 AI generations/month', 'All templates', 'Basic analytics'],
    limits: { brands: 5, projects: 20, aiGenerations: 500, teamMembers: 3, storage: 1024 } },
  { id: 'professional', name: 'Professional', tier: 'professional', price: 79, interval: 'monthly',
    features: ['Unlimited brands', 'Unlimited projects', '5000 AI generations/month', 'Custom templates', 'Advanced analytics', 'Team collaboration', 'Priority support'],
    limits: { brands: 999, projects: 999, aiGenerations: 5000, teamMembers: 15, storage: 10240 } },
  { id: 'enterprise', name: 'Enterprise', tier: 'enterprise', price: 299, interval: 'monthly',
    features: ['Everything in Professional', 'Unlimited AI generations', 'Custom AI models', 'SSO & SAML', 'Dedicated support', 'SLA guarantee', 'Custom integrations'],
    limits: { brands: 9999, projects: 9999, aiGenerations: 99999, teamMembers: 999, storage: 102400 } },
];
