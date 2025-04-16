import { PromptEngineering } from '../prompt-engineering';
import { ModelContextProtocol } from '@modelcontextprotocol/sdk';
import { DeepFlow } from '../../types/type-definitions';

jest.mock('@anthropic-ai/sdk');
jest.mock('@modelcontextprotocol/sdk');

describe('PromptEngineering', () => {
  let promptEngineering: PromptEngineering;
  let mcp: ModelContextProtocol;

  beforeEach(() => {
    process.env.CLAUDE_API_KEY = 'test-api-key';
    mcp = new ModelContextProtocol({
      apiKey: 'test-api-key',
      model: 'claude-3-opus-20240229'
    });
    promptEngineering = new PromptEngineering(mcp);
  });

  describe('translateIntent', () => {
    it('should translate an intent into structured format', async () => {
      const intent = 'I want to book a flight to Paris';
      const result = await promptEngineering.translateIntent(intent);

      expect(result).toBeDefined();
      expect(result.mainGoal).toBeDefined();
      expect(Array.isArray(result.subGoals)).toBe(true);
    });

    it('should throw an error for invalid input', async () => {
      await expect(promptEngineering.translateIntent('')).rejects.toThrow();
    });
  });

  describe('decomposeIntent', () => {
    it('should decompose an intent into sub-goals', async () => {
      const intent = 'I want to book a flight to Paris';
      const result = await promptEngineering.decomposeIntent(intent);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(typeof result[0]).toBe('string');
    });

    it('should throw an error for invalid input', async () => {
      await expect(promptEngineering.decomposeIntent('')).rejects.toThrow();
    });
  });

  describe('generateDeepFlows', () => {
    it('should generate deep flows for an intent', async () => {
      const intent = 'I want to book a flight to Paris';
      const flows = await promptEngineering.generateDeepFlows(intent);

      expect(Array.isArray(flows)).toBe(true);
      expect(flows.length).toBeGreaterThan(0);
      
      const flow = flows[0];
      expect(flow.id).toBeDefined();
      expect(flow.intentId).toBeDefined();
      expect(flow.metadata).toBeDefined();
      expect(flow.resources).toBeDefined();
      expect(flow.steps).toBeDefined();
      expect(flow.output).toBeDefined();
      expect(flow.naturalLanguageDescription).toBeDefined();
    });

    it('should throw an error for invalid input', async () => {
      await expect(promptEngineering.generateDeepFlows('')).rejects.toThrow();
    });
  });

  describe('generateDIML', () => {
    it('should generate DIML for a flow', async () => {
      const flow: DeepFlow = {
        id: 'test-flow-id',
        intentId: 'test-intent-id',
        metadata: {
          author: 'test-author',
          created: new Date(),
          estimatedCost: 100,
          estimatedDuration: '2 hours'
        },
        resources: [],
        steps: [],
        output: {
          combine: {
            items: []
          }
        },
        naturalLanguageDescription: 'Test flow description'
      };

      const diml = await promptEngineering.generateDIML(flow);
      expect(typeof diml).toBe('string');
      expect(diml).toContain('<diml>');
      expect(diml).toContain('</diml>');
    });

    it('should throw an error for invalid flow', async () => {
      await expect(promptEngineering.generateDIML({} as DeepFlow)).rejects.toThrow();
    });
  });
}); 