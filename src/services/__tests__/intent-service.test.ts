import { IntentService } from '../intent-service';
import { InMemoryStorage } from '../../storage/in-memory-storage';
import { ModelContextProtocol } from '@modelcontextprotocol/sdk';
import { DeepIntent, DeepFlow } from '../../types/type-definitions';

jest.mock('@anthropic-ai/sdk');
jest.mock('@modelcontextprotocol/sdk');

describe('IntentService', () => {
  let intentService: IntentService;
  let storage: InMemoryStorage;
  let mcp: ModelContextProtocol;

  beforeEach(() => {
    storage = new InMemoryStorage();
    mcp = new ModelContextProtocol({
      apiKey: 'test-api-key',
      model: 'claude-3-opus-20240229'
    });
    intentService = new IntentService(mcp, storage);
  });

  describe('createIntent', () => {
    it('should create a new intent', async () => {
      const description = 'I want to book a flight to Paris';
      const intent = await intentService.createIntent(description);

      expect(intent).toBeDefined();
      expect(intent.intentId).toBeDefined();
      expect(intent.rawIntent).toBe(description);
      expect(intent.status).toBe('draft');
      expect(intent.mainGoal).toBeDefined();
      expect(intent.subGoals).toBeDefined();
    });

    it('should throw an error for invalid input', async () => {
      await expect(intentService.createIntent('')).rejects.toThrow();
    });
  });

  describe('getIntent', () => {
    it('should return null for non-existent intent', async () => {
      const intent = await intentService.getIntent('non-existent-id');
      expect(intent).toBeNull();
    });

    it('should return the intent if it exists', async () => {
      const description = 'I want to book a flight to Paris';
      const createdIntent = await intentService.createIntent(description);
      const retrievedIntent = await intentService.getIntent(createdIntent.intentId);

      expect(retrievedIntent).toBeDefined();
      expect(retrievedIntent?.intentId).toBe(createdIntent.intentId);
    });
  });

  describe('refineIntent', () => {
    it('should update the intent with new information', async () => {
      const description = 'I want to book a flight to Paris';
      const createdIntent = await intentService.createIntent(description);
      
      const updates = {
        mainGoal: {
          ...createdIntent.mainGoal,
          priority: 'high' as const
        }
      };

      const refinedIntent = await intentService.refineIntent(createdIntent.intentId, updates);
      expect(refinedIntent).toBeDefined();
      expect(refinedIntent?.mainGoal.priority).toBe('high');
    });

    it('should return null for non-existent intent', async () => {
      const updates = {
        mainGoal: {
          objective: 'test',
          constraints: [],
          priority: 'high' as const
        }
      };

      const refinedIntent = await intentService.refineIntent('non-existent-id', updates);
      expect(refinedIntent).toBeNull();
    });
  });

  describe('finalizeIntent', () => {
    it('should finalize an existing intent', async () => {
      const description = 'I want to book a flight to Paris';
      const createdIntent = await intentService.createIntent(description);
      
      const finalizedIntent = await intentService.finalizeIntent(createdIntent.intentId);
      expect(finalizedIntent).toBeDefined();
      expect(finalizedIntent?.status).toBe('finalized');
    });

    it('should return null for non-existent intent', async () => {
      const finalizedIntent = await intentService.finalizeIntent('non-existent-id');
      expect(finalizedIntent).toBeNull();
    });
  });

  describe('generateDeepFlows', () => {
    it('should generate deep flows for an intent', async () => {
      const description = 'I want to book a flight to Paris';
      const createdIntent = await intentService.createIntent(description);
      
      const flows = await intentService.generateDeepFlows(createdIntent.intentId);
      expect(flows).toBeDefined();
      expect(Array.isArray(flows)).toBe(true);
      expect(flows.length).toBeGreaterThan(0);
    });

    it('should throw an error for non-existent intent', async () => {
      await expect(intentService.generateDeepFlows('non-existent-id')).rejects.toThrow();
    });
  });

  describe('getDeepFlow', () => {
    it('should return null for non-existent flow', async () => {
      const flow = await intentService.getDeepFlow('non-existent-id');
      expect(flow).toBeNull();
    });

    it('should return the flow if it exists', async () => {
      const description = 'I want to book a flight to Paris';
      const createdIntent = await intentService.createIntent(description);
      const flows = await intentService.generateDeepFlows(createdIntent.intentId);
      
      const retrievedFlow = await intentService.getDeepFlow(flows[0].id);
      expect(retrievedFlow).toBeDefined();
      expect(retrievedFlow?.id).toBe(flows[0].id);
    });
  });
}); 