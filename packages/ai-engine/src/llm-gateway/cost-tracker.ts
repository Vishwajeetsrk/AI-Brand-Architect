import { ModelInfo } from '../types';

interface CostEntry {
  modelId: string;
  promptTokens: number;
  completionTokens: number;
  cost: number;
  timestamp: number;
  userId?: string;
  tags?: string[];
}

export class CostTracker {
  private entries: CostEntry[] = [];
  private budgets: Map<string, number> = new Map();

  record(model: ModelInfo, promptTokens: number, completionTokens: number, userId?: string, tags?: string[]): number {
    const promptCost = (promptTokens / 1000000) * model.pricing.inputPerMillionTokens;
    const completionCost = (completionTokens / 1000000) * model.pricing.outputPerMillionTokens;
    const totalCost = promptCost + completionCost;

    this.entries.push({
      modelId: model.id,
      promptTokens,
      completionTokens,
      cost: totalCost,
      timestamp: Date.now(),
      userId,
      tags,
    });

    return totalCost;
  }

  setBudget(userId: string, budget: number): void {
    this.budgets.set(userId, budget);
  }

  getBudgetRemaining(userId: string): number {
    const budget = this.budgets.get(userId);
    if (!budget) return Infinity;

    const spent = this.entries
      .filter(e => e.userId === userId)
      .reduce((sum, e) => sum + e.cost, 0);

    return budget - spent;
  }

  isWithinBudget(userId: string, estimatedCost: number): boolean {
    return this.getBudgetRemaining(userId) >= estimatedCost;
  }

  getTotalCost(sinceMs?: number): number {
    const filtered = sinceMs
      ? this.entries.filter(e => e.timestamp > Date.now() - sinceMs)
      : this.entries;
    return filtered.reduce((sum, e) => sum + e.cost, 0);
  }

  getCostByModel(sinceMs?: number): Record<string, number> {
    const filtered = sinceMs
      ? this.entries.filter(e => e.timestamp > Date.now() - sinceMs)
      : this.entries;

    const byModel: Record<string, number> = {};
    for (const entry of filtered) {
      byModel[entry.modelId] = (byModel[entry.modelId] || 0) + entry.cost;
    }
    return byModel;
  }

  getCostByUser(userId: string, sinceMs?: number): number {
    return this.entries
      .filter(e => e.userId === userId)
      .filter(e => !sinceMs || e.timestamp > Date.now() - sinceMs)
      .reduce((sum, e) => sum + e.cost, 0);
  }

  getRecentEntries(limit: number = 100): CostEntry[] {
    return this.entries.slice(-limit).reverse();
  }

  getStats(): { totalCost: number; totalRequests: number; byModel: Record<string, number> } {
    return {
      totalCost: this.getTotalCost(),
      totalRequests: this.entries.length,
      byModel: this.getCostByModel(),
    };
  }
}
