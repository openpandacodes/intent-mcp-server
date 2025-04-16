export class ModelContextProtocol {
  constructor(config: { apiKey: string; model: string }) {}

  async processIntent(intent: string) {
    return {
      mainGoal: {
        objective: 'Mocked objective',
        constraints: [],
        priority: 'medium'
      },
      subGoals: []
    };
  }

  async generateDeepFlows(intent: any) {
    return [{
      id: 'mock-flow-1',
      steps: [],
      metadata: {}
    }];
  }
} 