declare module '@modelcontextprotocol/sdk' {
  export interface MCPContext {
    type: string;
    task: string;
    count?: number;
  }

  export interface Flow {
    id: string;
    estimatedCost: number;
    estimatedDuration: string;
    resources: Array<{
      id: string;
      type: string;
      provider: string;
      configuration?: Record<string, any>;
    }>;
    steps: Array<{
      id: string;
      depends: string;
      action: {
        resource: string;
        query: string;
        output: string;
      };
    }>;
    description: string;
  }

  export interface MCPResponse {
    mainGoal?: {
      objective: string;
      constraints: string[];
      priority: 'low' | 'medium' | 'high';
    };
    subGoals?: Array<{
      id: string;
      description: string;
      status: 'pending' | 'completed' | 'failed';
    }>;
    flows?: Flow[];
    diml?: string;
  }

  export interface MCPOptions {
    apiKey: string;
    model: string;
    maxTokens?: number;
    temperature?: number;
  }

  export class ModelContextProtocol {
    constructor(options: MCPOptions);

    process(input: { input: string; context: MCPContext }): Promise<MCPResponse>;

    validateIntent(intent: any): Promise<boolean>;
    generateFlows(intent: any, count: number): Promise<MCPResponse>;
    refineIntent(intent: any, feedback: string): Promise<MCPResponse>;
  }
} 