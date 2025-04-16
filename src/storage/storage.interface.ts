import { DeepIntent, DeepFlow } from '../types/type-definitions';

export interface StorageInterface {
  // Intent operations
  saveIntent(intent: DeepIntent): Promise<void>;
  getIntent(id: string): Promise<DeepIntent | null>;
  updateIntent(id: string, updates: Partial<DeepIntent>): Promise<DeepIntent | null>;
  deleteIntent(id: string): Promise<void>;
  
  // DeepFlow operations
  saveDeepFlow(flow: DeepFlow): Promise<void>;
  getDeepFlow(id: string): Promise<DeepFlow | null>;
  getDeepFlowsByIntentId(intentId: string): Promise<DeepFlow[]>;
  updateDeepFlow(id: string, updates: Partial<DeepFlow>): Promise<DeepFlow | null>;
  deleteDeepFlow(id: string): Promise<void>;
} 