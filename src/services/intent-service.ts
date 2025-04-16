// intent-service.ts - Core service for intent processing logic

import { v4 as uuidv4 } from 'uuid';
import { DeepIntent, DeepFlow } from '../types/type-definitions';
import { ModelContextProtocol } from '@modelcontextprotocol/sdk';
import { PromptEngineering } from './prompt-engineering';
import { StorageInterface } from '../storage/storage.interface';
import { Logger } from '../utils/logger';

export class IntentService {
  private promptEngineering: PromptEngineering;
  private storage: StorageInterface;

  constructor(mcp: ModelContextProtocol, storage: StorageInterface) {
    this.promptEngineering = new PromptEngineering(mcp);
    this.storage = storage;
  }

  async createIntent(description: string): Promise<DeepIntent> {
    try {
      const translatedIntent = await this.promptEngineering.translateIntent(description);
      const decomposedIntent = await this.promptEngineering.decomposeIntent(description);

      const intent: DeepIntent = {
        intentId: uuidv4(),
        rawIntent: description,
        mainGoal: {
          objective: translatedIntent.mainGoal,
          constraints: [],
          priority: 'medium'
        },
        subGoals: decomposedIntent.map(description => ({
          id: uuidv4(),
          description,
          constraints: [],
          status: 'pending'
        })),
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.storage.saveIntent(intent);
      Logger.info('Created new intent', { intentId: intent.intentId });
      return intent;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to create intent', err);
      throw new Error(`Failed to create intent: ${err.message}`);
    }
  }

  async getIntent(id: string): Promise<DeepIntent | null> {
    try {
      const intent = await this.storage.getIntent(id);
      if (!intent) {
        Logger.warn('Intent not found', { intentId: id });
        return null;
      }
      return intent;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to get intent', err);
      throw new Error(`Failed to get intent: ${err.message}`);
    }
  }

  async refineIntent(id: string, updates: Partial<DeepIntent>): Promise<DeepIntent | null> {
    try {
      const intent = await this.storage.getIntent(id);
      if (!intent) {
        Logger.warn('Intent not found for refinement', { intentId: id });
        return null;
      }

      const refinedIntent = await this.storage.updateIntent(id, {
        ...updates,
        status: 'draft',
        updatedAt: new Date()
      });

      Logger.info('Refined intent', { intentId: id });
      return refinedIntent;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to refine intent', err);
      throw new Error(`Failed to refine intent: ${err.message}`);
    }
  }

  async finalizeIntent(id: string): Promise<DeepIntent | null> {
    try {
      const intent = await this.storage.getIntent(id);
      if (!intent) {
        Logger.warn('Intent not found for finalization', { intentId: id });
        return null;
      }

      const finalizedIntent = await this.storage.updateIntent(id, {
        status: 'finalized',
        updatedAt: new Date()
      });

      Logger.info('Finalized intent', { intentId: id });
      return finalizedIntent;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to finalize intent', err);
      throw new Error(`Failed to finalize intent: ${err.message}`);
    }
  }

  async generateDeepFlows(intentId: string): Promise<DeepFlow[]> {
    try {
      const intent = await this.getIntent(intentId);
      if (!intent) {
        throw new Error('Intent not found');
      }

      const flows = await this.promptEngineering.generateDeepFlows(intent.rawIntent);
      
      // Save each generated flow
      for (const flow of flows) {
        await this.storage.saveDeepFlow(flow);
      }

      Logger.info('Generated deep flows', { intentId, flowCount: flows.length });
      return flows;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to generate deep flows', err);
      throw new Error(`Failed to generate deep flows: ${err.message}`);
    }
  }

  async getDeepFlow(id: string): Promise<DeepFlow | null> {
    try {
      const flow = await this.storage.getDeepFlow(id);
      if (!flow) {
        Logger.warn('Deep flow not found', { flowId: id });
        return null;
      }
      return flow;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to get deep flow', err);
      throw new Error(`Failed to get deep flow: ${err.message}`);
    }
  }

  async getDIML(intentId: string, flowId: string): Promise<string> {
    try {
      const flow = await this.getDeepFlow(flowId);
      if (!flow) {
        throw new Error('Flow not found');
      }

      const diml = await this.promptEngineering.generateDIML(flow);
      Logger.info('Generated DIML', { flowId });
      return diml;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to generate DIML', err);
      throw new Error(`Failed to generate DIML: ${err.message}`);
    }
  }

  async getNaturalLanguageDescription(flowId: string): Promise<string> {
    try {
      const flow = await this.getDeepFlow(flowId);
      if (!flow) {
        throw new Error('Flow not found');
      }

      if (!flow.naturalLanguageDescription) {
        throw new Error('No description available');
      }

      return flow.naturalLanguageDescription;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to get natural language description', err);
      throw new Error(`Failed to get natural language description: ${err.message}`);
    }
  }
}
