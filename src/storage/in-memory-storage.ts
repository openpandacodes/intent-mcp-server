import { DeepIntent, DeepFlow } from '../types/type-definitions';
import { StorageInterface } from './storage.interface';

export class InMemoryStorage implements StorageInterface {
  private intents: Map<string, DeepIntent> = new Map();
  private deepFlows: Map<string, DeepFlow> = new Map();
  private intentToFlows: Map<string, Set<string>> = new Map();

  async saveIntent(intent: DeepIntent): Promise<void> {
    this.intents.set(intent.intentId, intent);
  }

  async getIntent(id: string): Promise<DeepIntent | null> {
    return this.intents.get(id) || null;
  }

  async updateIntent(id: string, updates: Partial<DeepIntent>): Promise<DeepIntent | null> {
    const existingIntent = await this.getIntent(id);
    if (!existingIntent) return null;

    const updatedIntent = {
      ...existingIntent,
      ...updates,
      updatedAt: new Date()
    };

    this.intents.set(id, updatedIntent);
    return updatedIntent;
  }

  async deleteIntent(id: string): Promise<void> {
    this.intents.delete(id);
    // Also delete associated flows
    const flowIds = this.intentToFlows.get(id);
    if (flowIds) {
      flowIds.forEach(flowId => this.deepFlows.delete(flowId));
      this.intentToFlows.delete(id);
    }
  }

  async saveDeepFlow(flow: DeepFlow): Promise<void> {
    this.deepFlows.set(flow.id, flow);
    
    // Update intent-to-flows mapping
    if (!this.intentToFlows.has(flow.intentId)) {
      this.intentToFlows.set(flow.intentId, new Set());
    }
    this.intentToFlows.get(flow.intentId)?.add(flow.id);
  }

  async getDeepFlow(id: string): Promise<DeepFlow | null> {
    return this.deepFlows.get(id) || null;
  }

  async getDeepFlowsByIntentId(intentId: string): Promise<DeepFlow[]> {
    const flowIds = this.intentToFlows.get(intentId);
    if (!flowIds) return [];

    const flows: DeepFlow[] = [];
    flowIds.forEach(id => {
      const flow = this.deepFlows.get(id);
      if (flow) flows.push(flow);
    });
    return flows;
  }

  async updateDeepFlow(id: string, updates: Partial<DeepFlow>): Promise<DeepFlow | null> {
    const existingFlow = await this.getDeepFlow(id);
    if (!existingFlow) return null;

    const updatedFlow = {
      ...existingFlow,
      ...updates
    };

    this.deepFlows.set(id, updatedFlow);
    return updatedFlow;
  }

  async deleteDeepFlow(id: string): Promise<void> {
    const flow = await this.getDeepFlow(id);
    if (flow) {
      this.deepFlows.delete(id);
      // Remove from intent-to-flows mapping
      const flowIds = this.intentToFlows.get(flow.intentId);
      if (flowIds) {
        flowIds.delete(id);
        if (flowIds.size === 0) {
          this.intentToFlows.delete(flow.intentId);
        }
      }
    }
  }
} 