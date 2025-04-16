import { InMemoryStorage } from '../in-memory-storage';
import { DeepIntent, DeepFlow } from '../../types/type-definitions';

describe('InMemoryStorage', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
  });

  describe('Intent operations', () => {
    const testIntent: DeepIntent = {
      intentId: 'test-intent-id',
      rawIntent: 'I want to book a flight to Paris',
      mainGoal: {
        objective: 'Book a flight to Paris',
        constraints: [],
        priority: 'medium'
      },
      subGoals: [
        {
          id: 'sub-goal-1',
          description: 'Find available flights',
          status: 'pending'
        }
      ],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should save and retrieve an intent', async () => {
      await storage.saveIntent(testIntent);
      const retrievedIntent = await storage.getIntent(testIntent.intentId);

      expect(retrievedIntent).toBeDefined();
      expect(retrievedIntent?.intentId).toBe(testIntent.intentId);
      expect(retrievedIntent?.rawIntent).toBe(testIntent.rawIntent);
    });

    it('should return null for non-existent intent', async () => {
      const intent = await storage.getIntent('non-existent-id');
      expect(intent).toBeNull();
    });

    it('should update an intent', async () => {
      await storage.saveIntent(testIntent);
      
      const updates = {
        status: 'finalized' as const,
        mainGoal: {
          ...testIntent.mainGoal,
          priority: 'high' as const
        }
      };

      const updatedIntent = await storage.updateIntent(testIntent.intentId, updates);
      expect(updatedIntent).toBeDefined();
      expect(updatedIntent?.status).toBe('finalized');
      expect(updatedIntent?.mainGoal.priority).toBe('high');
    });

    it('should delete an intent', async () => {
      await storage.saveIntent(testIntent);
      await storage.deleteIntent(testIntent.intentId);
      
      const deletedIntent = await storage.getIntent(testIntent.intentId);
      expect(deletedIntent).toBeNull();
    });
  });

  describe('DeepFlow operations', () => {
    const testFlow: DeepFlow = {
      id: 'test-flow-id',
      intentId: 'test-intent-id',
      metadata: {
        author: 'test-author',
        created: new Date(),
        estimatedCost: 100,
        estimatedDuration: '2 hours'
      },
      resources: [
        {
          id: 'resource-1',
          type: 'FlightAPI',
          provider: 'TestProvider'
        }
      ],
      steps: [
        {
          id: 'step-1',
          depends: '',
          action: {
            resource: 'resource-1',
            query: 'Find flights to Paris',
            output: 'flights'
          }
        }
      ],
      output: {
        combine: {
          items: ['flights']
        }
      },
      naturalLanguageDescription: 'Test flow description'
    };

    it('should save and retrieve a flow', async () => {
      await storage.saveDeepFlow(testFlow);
      const retrievedFlow = await storage.getDeepFlow(testFlow.id);

      expect(retrievedFlow).toBeDefined();
      expect(retrievedFlow?.id).toBe(testFlow.id);
      expect(retrievedFlow?.intentId).toBe(testFlow.intentId);
    });

    it('should return null for non-existent flow', async () => {
      const flow = await storage.getDeepFlow('non-existent-id');
      expect(flow).toBeNull();
    });

    it('should get flows by intent ID', async () => {
      await storage.saveDeepFlow(testFlow);
      const flows = await storage.getDeepFlowsByIntentId(testFlow.intentId);

      expect(Array.isArray(flows)).toBe(true);
      expect(flows.length).toBe(1);
      expect(flows[0].id).toBe(testFlow.id);
    });

    it('should update a flow', async () => {
      await storage.saveDeepFlow(testFlow);
      
      const updates = {
        metadata: {
          ...testFlow.metadata,
          estimatedCost: 200
        }
      };

      const updatedFlow = await storage.updateDeepFlow(testFlow.id, updates);
      expect(updatedFlow).toBeDefined();
      expect(updatedFlow?.metadata.estimatedCost).toBe(200);
    });

    it('should delete a flow', async () => {
      await storage.saveDeepFlow(testFlow);
      await storage.deleteDeepFlow(testFlow.id);
      
      const deletedFlow = await storage.getDeepFlow(testFlow.id);
      expect(deletedFlow).toBeNull();
    });
  });
}); 