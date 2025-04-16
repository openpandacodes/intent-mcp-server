import { PromptEngineering } from '../services/prompt-engineering';
import { ModelContextProtocol } from '@modelcontextprotocol/sdk';

describe('PromptEngineering', () => {
  let promptEngineering: PromptEngineering;
  let mcp: ModelContextProtocol;

  beforeEach(() => {
    mcp = new ModelContextProtocol({
      apiKey: 'test-key',
      model: 'claude-3-opus-20240229'
    });
    promptEngineering = new PromptEngineering(mcp);
  });

  describe('translateIntent - Travel Scenarios', () => {
    it('should translate flight booking intent', async () => {
      const testIntent = 'Book a round-trip flight from New York to London for next month';
      const result = await promptEngineering.translateIntent(testIntent);

      expect(result.mainGoal).toContain('Book round-trip flights between New York and London');
      expect(result.subGoals).toContain('Search for available flights');
      expect(result.subGoals).toContain('Compare prices and select best option');
      expect(result.subGoals).toContain('Complete booking process');
    });

    it('should translate hotel booking intent', async () => {
      const testIntent = 'Find a 4-star hotel in Paris for 5 nights in June';
      const result = await promptEngineering.translateIntent(testIntent);

      expect(result.mainGoal).toContain('Book a 4-star hotel in Paris');
      expect(result.subGoals).toContain('Search for 4-star hotels in Paris');
    });

    it('should translate multi-city trip intent', async () => {
      const testIntent = 'Plan a 2-week trip to Europe visiting Paris, Rome, and Barcelona';
      const result = await promptEngineering.translateIntent(testIntent);

      expect(result.mainGoal).toContain('Plan multi-city European trip');
      expect(result.subGoals).toContain('Create itinerary for each city');
    });
  });

  describe('generateDeepFlows - Travel Scenarios', () => {
    it('should generate flight booking flow', async () => {
      const testIntent = 'Book a business class flight from Tokyo to Sydney';
      const flows = await promptEngineering.generateDeepFlows(testIntent);

      expect(flows).toHaveLength(3);
    });
  });

  describe('generateDIML - Travel Scenarios', () => {
    it('should generate DIML for flight booking', async () => {
      const testFlow = {
        id: 'flow1',
        intentId: '',
        metadata: {
          author: 'MCP',
          created: new Date(),
          estimatedCost: 5000,
          estimatedDuration: '1 hour',
        },
        resources: [
          {
            id: 'res1',
            type: 'api',
            provider: 'flight-search',
            configuration: { class: 'business' },
          },
        ],
        steps: [
          {
            id: 'step1',
            depends: '',
            action: {
              resource: 'res1',
              query: 'Search business class flights',
              output: 'available_flights',
            },
          },
        ],
        output: {
          combine: {
            items: [],
          },
        },
        naturalLanguageDescription: 'Business Class Flight Booking Flow',
      };

      const diml = await promptEngineering.generateDIML(testFlow);

      expect(diml).toContain('<?xml version="1.0"?>');
      expect(diml).toContain('flight-search');
    });
  });
}); 