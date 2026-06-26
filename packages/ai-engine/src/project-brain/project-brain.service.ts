import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface ProjectBrain {
  projectId: string;
  knowledgeGraph: KnowledgeNode[];
  memory: ProjectMemory;
  relationships: Relationship[];
  context: ProjectContext;
  reasoning: ReasoningEngine;
  decisions: Decision[];
  timeline: TimelineEvent[];
  assetIntelligence: AssetIntelligence[];
  dependencyGraph: DependencyGraph;
  health: ProjectHealth;
}

export interface KnowledgeNode {
  id: string;
  type: 'brand' | 'website' | 'ui' | 'code' | 'document' | 'api' | 'database' | 'workflow' | 'agent' | 'marketing' | 'asset';
  data: any;
  connections: string[]; // IDs of connected nodes
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    author: string;
    version: number;
  };
}

export interface ProjectMemory {
  user: MemoryStore;
  workspace: MemoryStore;
  organization: MemoryStore;
  project: MemoryStore;
  brand: MemoryStore;
  agent: MemoryStore;
  conversation: ConversationMemory[];
}

export interface MemoryStore {
  shortTerm: any[];
  longTerm: any[];
  semantic: any[];
  episodic: any[];
}

export interface ConversationMemory {
  id: string;
  messages: Message[];
  context: any;
  summary: string;
  timestamp: Date;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  type: 'depends_on' | 'uses' | 'generates' | 'references' | 'contains' | 'derives_from';
  strength: number; // 0-1
  metadata: any;
}

export interface ProjectContext {
  user: any;
  organization: any;
  workspace: any;
  project: any;
  brand: any;
  designSystem: any;
  recentActivity: any[];
  activeAgents: any[];
}

export interface ReasoningEngine {
  capabilities: string[];
  context: any;
  lastReasoning: any;
  confidence: number;
}

export interface Decision {
  id: string;
  type: 'architecture' | 'design' | 'business' | 'ai';
  decision: string;
  reason: string;
  alternatives: string[];
  owner: string;
  impact: string;
  dependencies: string[];
  date: Date;
}

export interface TimelineEvent {
  id: string;
  type: 'creation' | 'design' | 'development' | 'testing' | 'deployment' | 'marketing' | 'release' | 'bug' | 'improvement';
  description: string;
  timestamp: Date;
  author: string;
  metadata: any;
}

export interface AssetIntelligence {
  assetId: string;
  type: string;
  usedIn: string[]; // Where this asset is used
  dependencies: string[];
  versions: any[];
  author: string;
  aiHistory: any[];
  exportHistory: any[];
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface DependencyNode {
  id: string;
  type: string;
  name: string;
  metadata: any;
}

export interface DependencyEdge {
  source: string;
  target: string;
  type: 'depends_on' | 'contains' | 'references';
}

export interface ProjectHealth {
  score: number; // 0-100
  metrics: {
    completion: number;
    quality: number;
    performance: number;
    accessibility: number;
    brandConsistency: number;
    seo: number;
  };
  issues: HealthIssue[];
  recommendations: string[];
}

export interface HealthIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  affectedComponents: string[];
  fix: string;
}

@Injectable()
export class ProjectBrainService {
  private readonly logger = new Logger(ProjectBrainService.name);
  private brains: Map<string, ProjectBrain> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initialize Project Brain for a new project
   */
  async initializeProjectBrain(projectId: string): Promise<ProjectBrain> {
    this.logger.log(`Initializing Project Brain for project: ${projectId}`);

    const brain: ProjectBrain = {
      projectId,
      knowledgeGraph: [],
      memory: {
        user: { shortTerm: [], longTerm: [], semantic: [], episodic: [] },
        workspace: { shortTerm: [], longTerm: [], semantic: [], episodic: [] },
        organization: { shortTerm: [], longTerm: [], semantic: [], episodic: [] },
        project: { shortTerm: [], longTerm: [], semantic: [], episodic: [] },
        brand: { shortTerm: [], longTerm: [], semantic: [], episodic: [] },
        agent: { shortTerm: [], longTerm: [], semantic: [], episodic: [] },
        conversation: [],
      },
      relationships: [],
      context: {
        user: null,
        organization: null,
        workspace: null,
        project: null,
        brand: null,
        designSystem: null,
        recentActivity: [],
        activeAgents: [],
      },
      reasoning: {
        capabilities: [],
        context: null,
        lastReasoning: null,
        confidence: 0,
      },
      decisions: [],
      timeline: [],
      assetIntelligence: [],
      dependencyGraph: {
        nodes: [],
        edges: [],
      },
      health: {
        score: 0,
        metrics: {
          completion: 0,
          quality: 0,
          performance: 0,
          accessibility: 0,
          brandConsistency: 0,
          seo: 0,
        },
        issues: [],
        recommendations: [],
      },
    };

    this.brains.set(projectId, brain);
    return brain;
  }

  /**
   * Get Project Brain
   */
  getProjectBrain(projectId: string): ProjectBrain | undefined {
    return this.brains.get(projectId);
  }

  /**
   * Add knowledge to the graph
   */
  async addKnowledge(
    projectId: string,
    type: KnowledgeNode['type'],
    data: any,
    connections: string[] = [],
  ): Promise<KnowledgeNode> {
    const brain = this.brains.get(projectId);
    if (!brain) {
      throw new Error(`Project Brain not found for project: ${projectId}`);
    }

    const node: KnowledgeNode = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      connections,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        author: 'system',
        version: 1,
      },
    };

    brain.knowledgeGraph.push(node);
    this.logger.log(`Added knowledge node: ${node.id} of type ${type}`);

    return node;
  }

  /**
   * Create relationship between nodes
   */
  async createRelationship(
    projectId: string,
    source: string,
    target: string,
    type: Relationship['type'],
    strength: number = 1,
  ): Promise<Relationship> {
    const brain = this.brains.get(projectId);
    if (!brain) {
      throw new Error(`Project Brain not found for project: ${projectId}`);
    }

    const relationship: Relationship = {
      id: `rel_${Date.now()}`,
      source,
      target,
      type,
      strength,
      metadata: {},
    };

    brain.relationships.push(relationship);

    // Update node connections
    const sourceNode = brain.knowledgeGraph.find((n) => n.id === source);
    const targetNode = brain.knowledgeGraph.find((n) => n.id === target);

    if (sourceNode && !sourceNode.connections.includes(target)) {
      sourceNode.connections.push(target);
    }
    if (targetNode && !targetNode.connections.includes(source)) {
      targetNode.connections.push(source);
    }

    this.logger.log(`Created relationship: ${source} -> ${target} (${type})`);

    return relationship;
  }

  /**
   * Update project context
   */
  async updateContext(projectId: string, context: Partial<ProjectContext>): Promise<void> {
    const brain = this.brains.get(projectId);
    if (!brain) {
      throw new Error(`Project Brain not found for project: ${projectId}`);
    }

    brain.context = { ...brain.context, ...context };
    this.logger.log(`Updated context for project: ${projectId}`);
  }

  /**
   * Add to project memory
   */
  async addToMemory(
    projectId: string,
    category: keyof ProjectMemory,
    memory: any,
    type: 'shortTerm' | 'longTerm' | 'semantic' | 'episodic' = 'shortTerm',
  ): Promise<void> {
    const brain = this.brains.get(projectId);
    if (!brain) {
      throw new Error(`Project Brain not found for project: ${projectId}`);
    }

    const memoryStore = brain.memory[category] as MemoryStore;
    if (memoryStore && Array.isArray(memoryStore[type])) {
      (memoryStore[type] as any[]).push({
        ...memory,
        timestamp: new Date(),
      });
    }

    this.logger.log(`Added ${type} memory to ${category} for project: ${projectId}`);
  }

  /**
   * Record a decision
   */
  async recordDecision(
    projectId: string,
    decision: Omit<Decision, 'id' | 'date'>,
  ): Promise<Decision> {
    const brain = this.brains.get(projectId);
    if (!brain) {
      throw new Error(`Project Brain not found for project: ${projectId}`);
    }

    const newDecision: Decision = {
      ...decision,
      id: `dec_${Date.now()}`,
      date: new Date(),
    };

    brain.decisions.push(newDecision);
    this.logger.log(`Recorded decision: ${newDecision.id}`);

    return newDecision;
  }

  /**
   * Add timeline event
   */
  async addTimelineEvent(
    projectId: string,
    type: TimelineEvent['type'],
    description: string,
    author: string,
    metadata: any = {},
  ): Promise<TimelineEvent> {
    const brain = this.brains.get(projectId);
    if (!brain) {
      throw new Error(`Project Brain not found for project: ${projectId}`);
    }

    const event: TimelineEvent = {
      id: `event_${Date.now()}`,
      type,
      description,
      timestamp: new Date(),
      author,
      metadata,
    };

    brain.timeline.push(event);
    this.logger.log(`Added timeline event: ${event.id}`);

    return event;
  }

  /**
   * Calculate project health score
   */
  async calculateHealthScore(projectId: string): Promise<ProjectHealth> {
    const brain = this.brains.get(projectId);
    if (!brain) {
      throw new Error(`Project Brain not found for project: ${projectId}`);
    }

    // Calculate metrics
    const metrics = {
      completion: this.calculateCompletion(brain),
      quality: this.calculateQuality(brain),
      performance: this.calculatePerformance(brain),
      accessibility: this.calculateAccessibility(brain),
      brandConsistency: this.calculateBrandConsistency(brain),
      seo: this.calculateSEO(brain),
    };

    const score = Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.keys(metrics).length;

    const issues = this.identifyIssues(brain, metrics);
    const recommendations = this.generateRecommendations(brain, metrics);

    brain.health = { score, metrics, issues, recommendations };

    return brain.health;
  }

  private calculateCompletion(brain: ProjectBrain): number {
    // Calculate based on timeline events and asset intelligence
    const totalEvents = brain.timeline.length;
    const completedEvents = brain.timeline.filter((e) => 
      ['testing', 'deployment', 'release'].includes(e.type)
    ).length;
    
    return totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
  }

  private calculateQuality(brain: ProjectBrain): number {
    // Based on decisions, reviews, and issues
    const decisions = brain.decisions.length;
    const issues = brain.health?.issues.length || 0;
    
    return Math.max(0, 100 - (issues * 10) + (decisions * 2));
  }

  private calculatePerformance(brain: ProjectBrain): number {
    // Placeholder - would integrate with actual performance metrics
    return 85;
  }

  private calculateAccessibility(brain: ProjectBrain): number {
    // Placeholder - would integrate with accessibility audit
    return 90;
  }

  private calculateBrandConsistency(brain: ProjectBrain): number {
    // Check brand usage across assets
    const brandNodes = brain.knowledgeGraph.filter((n) => n.type === 'brand');
    const totalNodes = brain.knowledgeGraph.length;
    
    return totalNodes > 0 ? (brandNodes.length / totalNodes) * 100 : 0;
  }

  private calculateSEO(brain: ProjectBrain): number {
    // Placeholder - would integrate with SEO audit
    return 75;
  }

  private identifyIssues(brain: ProjectBrain, metrics: any): HealthIssue[] {
    const issues: HealthIssue[] = [];

    if (metrics.completion < 50) {
      issues.push({
        severity: 'high',
        type: 'completion',
        description: 'Project completion is below 50%',
        affectedComponents: [],
        fix: 'Continue development and testing',
      });
    }

    if (metrics.accessibility < 80) {
      issues.push({
        severity: 'medium',
        type: 'accessibility',
        description: 'Accessibility score below WCAG AA standard',
        affectedComponents: [],
        fix: 'Run accessibility audit and fix issues',
      });
    }

    return issues;
  }

  private generateRecommendations(brain: ProjectBrain, metrics: any): string[] {
    const recommendations: string[] = [];

    if (metrics.completion < 80) {
      recommendations.push('Complete remaining features and testing');
    }

    if (metrics.brandConsistency < 70) {
      recommendations.push('Ensure brand DNA is applied across all assets');
    }

    if (metrics.seo < 80) {
      recommendations.push('Optimize SEO metadata and content');
    }

    return recommendations;
  }

  /**
   * Get project insights
   */
  async getProjectInsights(projectId: string): Promise<any> {
    const brain = this.brains.get(projectId);
    if (!brain) {
      return null;
    }

    return {
      totalKnowledgeNodes: brain.knowledgeGraph.length,
      totalRelationships: brain.relationships.length,
      totalDecisions: brain.decisions.length,
      totalTimelineEvents: brain.timeline.length,
      health: brain.health,
      recentActivity: brain.timeline.slice(-10),
      activeAgents: brain.context.activeAgents,
    };
  }

  /**
   * Search knowledge graph
   */
  async searchKnowledge(projectId: string, query: string): Promise<KnowledgeNode[]> {
    const brain = this.brains.get(projectId);
    if (!brain) {
      return [];
    }

    const queryLower = query.toLowerCase();
    
    return brain.knowledgeGraph.filter((node) => {
      return (
        node.type.toLowerCase().includes(queryLower) ||
        JSON.stringify(node.data).toLowerCase().includes(queryLower)
      );
    });
  }

  /**
   * Get related nodes
   */
  async getRelatedNodes(projectId: string, nodeId: string): Promise<KnowledgeNode[]> {
    const brain = this.brains.get(projectId);
    if (!brain) {
      return [];
    }

    const node = brain.knowledgeGraph.find((n) => n.id === nodeId);
    if (!node) {
      return [];
    }

    return brain.knowledgeGraph.filter((n) => node.connections.includes(n.id));
  }
}