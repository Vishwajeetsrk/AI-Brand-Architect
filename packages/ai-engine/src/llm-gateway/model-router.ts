import { LLMProviderType, RoutingPreference, ModelInfo, ModelCapabilities } from '../types';
import { ModelRegistry } from './model-registry';

export class ModelRouter {
  private registry: ModelRegistry;

  constructor(registry: ModelRegistry) {
    this.registry = registry;
  }

  resolve(models: string[] | undefined, preference: RoutingPreference): { model: string; provider: LLMProviderType } {
    switch (preference.strategy) {
      case 'cost': return this.routeByCost(preference);
      case 'quality': return this.routeByQuality(preference);
      case 'latency': return this.routeByLatency(preference);
      case 'capability': return this.routeByCapability(preference);
      case 'fallback': return this.routeByFallback(preference, models);
      case 'hybrid': return this.routeByHybrid(preference);
      case 'consensus': return this.routeByConsensus(preference);
      default: return this.routeByCost(preference);
    }
  }

  getFallbackChain(models: string[], preference: RoutingPreference): { model: string; provider: LLMProviderType }[] {
    const chain: { model: string; provider: LLMProviderType }[] = [];

    for (const modelId of models) {
      const info = this.registry.get(modelId);
      if (info) chain.push({ model: modelId, provider: info.provider });
    }

    const fallbacks = this.buildFallbackCandidates(preference, models);
    for (const fb of fallbacks) {
      if (!chain.find(c => c.model === fb.model)) chain.push(fb);
    }

    return chain;
  }

  private routeByCost(preference: RoutingPreference): { model: string; provider: LLMProviderType } {
    const models = this.registry.findCheapest(preference.minQuality);

    if (preference.preferredProviders) {
      const preferred = models.filter(m => preference.preferredProviders!.includes(m.provider));
      if (preferred.length > 0) return { model: preferred[0].id, provider: preferred[0].provider };
    }

    if (preference.maxCost) {
      const affordable = models.filter(m => m.pricing.inputPerMillionTokens <= preference.maxCost!);
      if (affordable.length > 0) return { model: affordable[0].id, provider: affordable[0].provider };
    }

    return { model: models[0].id, provider: models[0].provider };
  }

  private routeByQuality(preference: RoutingPreference): { model: string; provider: LLMProviderType } {
    let models = this.registry.findBestQuality(preference.maxCost);

    if (preference.minQuality) {
      models = models.filter(m => m.qualityScore >= preference.minQuality!);
    }

    if (preference.preferredProviders) {
      const preferred = models.filter(m => preference.preferredProviders!.includes(m.provider));
      if (preferred.length > 0) return { model: preferred[0].id, provider: preferred[0].provider };
    }

    return { model: models[0].id, provider: models[0].provider };
  }

  private routeByLatency(preference: RoutingPreference): { model: string; provider: LLMProviderType } {
    let models = this.registry.findFastest(preference.minQuality);

    if (preference.maxLatencyMs) {
      models = models.filter(m => m.typicalLatencyMs <= preference.maxLatencyMs!);
    }

    if (preference.preferredProviders) {
      const preferred = models.filter(m => preference.preferredProviders!.includes(m.provider));
      if (preferred.length > 0) return { model: preferred[0].id, provider: preferred[0].provider };
    }

    return { model: models[0].id, provider: models[0].provider };
  }

  private routeByCapability(preference: RoutingPreference): { model: string; provider: LLMProviderType } {
    const required = preference.requiredCapabilities || ['reasoning'];
    let candidates = this.registry.getAll();

    for (const cap of required) {
      candidates = candidates.filter(m => m.capabilities[cap]);
    }

    if (preference.minQuality) candidates = candidates.filter(m => m.qualityScore >= preference.minQuality!);
    if (preference.maxCost) candidates = candidates.filter(m => m.pricing.inputPerMillionTokens <= preference.maxCost!);

    if (preference.preferredProviders) {
      const preferred = candidates.filter(m => preference.preferredProviders!.includes(m.provider));
      if (preferred.length > 0) return { model: preferred[0].id, provider: preferred[0].provider };
    }

    return candidates.length > 0
      ? { model: candidates[0].id, provider: candidates[0].provider }
      : this.routeByQuality(preference);
  }

  private routeByFallback(preference: RoutingPreference, models?: string[]): { model: string; provider: LLMProviderType } {
    if (models && models.length > 0) {
      for (const modelId of models) {
        const info = this.registry.get(modelId);
        if (info) return { model: modelId, provider: info.provider };
      }
    }
    return this.routeByQuality(preference);
  }

  private routeByHybrid(preference: RoutingPreference): { model: string; provider: LLMProviderType } {
    const qualityModel = this.routeByQuality(preference);
    const costModel = this.routeByCost(preference);

    if (qualityModel.model === costModel.model) return qualityModel;

    const qualityInfo = this.registry.get(qualityModel.model);
    const costInfo = this.registry.get(costModel.model);

    if (!qualityInfo || !costInfo) return qualityModel;

    const qualityDelta = (qualityInfo.qualityScore - costInfo.qualityScore);
    const costRatio = costInfo.pricing.inputPerMillionTokens > 0
      ? qualityInfo.pricing.inputPerMillionTokens / costInfo.pricing.inputPerMillionTokens
      : 1;

    if (costRatio > 10 && qualityDelta < 15) return costModel;
    if (qualityDelta < 5) return costModel;

    return qualityModel;
  }

  private routeByConsensus(preference: RoutingPreference): { model: string; provider: LLMProviderType } {
    const costRoute = this.routeByCost(preference);
    const qualityRoute = this.routeByQuality(preference);
    const latencyRoute = this.routeByLatency(preference);

    const votes = new Map<string, number>();
    for (const route of [costRoute, qualityRoute, latencyRoute]) {
      votes.set(route.model, (votes.get(route.model) || 0) + 1);
    }

    let maxVotes = 0;
    let winner = qualityRoute;
    for (const [model, count] of votes) {
      if (count > maxVotes) { maxVotes = count; winner = { model, provider: this.registry.get(model)?.provider || qualityRoute.provider }; }
    }

    return winner;
  }

  private buildFallbackCandidates(preference: RoutingPreference, excludeModels: string[]): { model: string; provider: LLMProviderType }[] {
    const excluded = new Set(excludeModels);
    const candidates: { model: string; provider: LLMProviderType }[] = [];

    const qualityModels = this.registry.findBestQuality(preference.maxCost);
    for (const m of qualityModels) {
      if (!excluded.has(m.id)) candidates.push({ model: m.id, provider: m.provider });
    }

    return candidates.slice(0, 3);
  }
}
