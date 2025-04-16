// prompt-engineering.ts - Handles communication with Claude LLM

import { DeepFlow } from '../types/type-definitions';
import Anthropic from '@anthropic-ai/sdk';
import { ModelContextProtocol } from '@modelcontextprotocol/sdk';
import { Logger } from '../utils/logger';
import { z } from 'zod';

// Validation schemas
const TranslateIntentResponseSchema = z.object({
  mainGoal: z.string(),
  subGoals: z.array(z.string())
});

const DecomposeIntentResponseSchema = z.array(z.string());

const DeepFlowSchema = z.object({
  id: z.string(),
  intentId: z.string(),
  metadata: z.object({
    author: z.string(),
    created: z.date(),
    estimatedCost: z.number(),
    estimatedDuration: z.string()
  }),
  resources: z.array(z.object({
    id: z.string(),
    type: z.string(),
    provider: z.string(),
    configuration: z.record(z.any()).optional()
  })),
  steps: z.array(z.object({
    id: z.string(),
    depends: z.string(),
    action: z.object({
      resource: z.string(),
      query: z.string(),
      output: z.string()
    })
  })),
  output: z.object({
    combine: z.object({
      items: z.array(z.string())
    })
  }),
  naturalLanguageDescription: z.string()
});

export class PromptEngineering {
  private anthropic: Anthropic;

  constructor(private mcp: ModelContextProtocol) {
    if (!process.env.CLAUDE_API_KEY) {
      throw new Error('CLAUDE_API_KEY environment variable is required');
    }

    this.anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  async translateIntent(intent: string): Promise<{ mainGoal: string; subGoals: string[] }> {
    try {
      const response = await this.callAnthropic([
        { 
          role: 'user', 
          content: `Translate this travel intent into a structured format: ${intent}. 
          Return a JSON object with 'mainGoal' (string) and 'subGoals' (string array) fields.`
        },
      ]);

      const parsed = JSON.parse(response);
      const validated = TranslateIntentResponseSchema.parse(parsed);
      
      Logger.info('Translated intent', { intent });
      return validated;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to translate intent', err);
      throw new Error(`Failed to translate intent: ${err.message}`);
    }
  }

  async decomposeIntent(intent: string): Promise<string[]> {
    try {
      const response = await this.callAnthropic([
        { 
          role: 'user', 
          content: `Decompose this travel intent into sub-goals: ${intent}. 
          Return a JSON array of strings.`
        },
      ]);

      const parsed = JSON.parse(response);
      const validated = DecomposeIntentResponseSchema.parse(parsed);
      
      Logger.info('Decomposed intent', { intent });
      return validated;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to decompose intent', err);
      throw new Error(`Failed to decompose intent: ${err.message}`);
    }
  }

  async generateDeepFlows(intent: string): Promise<DeepFlow[]> {
    try {
      const response = await this.callAnthropic([
        { 
          role: 'user', 
          content: `Generate deep flows for this travel intent: ${intent}. 
          Return a JSON array of DeepFlow objects with the following structure:
          {
            id: string,
            intentId: string,
            metadata: {
              author: string,
              created: Date,
              estimatedCost: number,
              estimatedDuration: string
            },
            resources: Array<{
              id: string,
              type: string,
              provider: string,
              configuration?: Record<string, any>
            }>,
            steps: Array<{
              id: string,
              depends: string,
              action: {
                resource: string,
                query: string,
                output: string
              }
            }>,
            output: {
              combine: {
                items: string[]
              }
            },
            naturalLanguageDescription: string
          }`
        },
      ]);

      const parsed = JSON.parse(response);
      const validated = z.array(DeepFlowSchema).parse(parsed);
      
      Logger.info('Generated deep flows', { intent });
      return validated;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to generate deep flows', err);
      throw new Error(`Failed to generate deep flows: ${err.message}`);
    }
  }

  async generateDIML(flow: DeepFlow): Promise<string> {
    try {
      const response = await this.callAnthropic([
        { 
          role: 'user', 
          content: `Generate DIML XML for this flow: ${JSON.stringify(flow)}. 
          Return a valid DIML XML string.`
        },
      ]);

      // Basic DIML validation
      if (!response.includes('<diml>') || !response.includes('</diml>')) {
        throw new Error('Invalid DIML format');
      }

      Logger.info('Generated DIML', { flowId: flow.id });
      return response;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to generate DIML', err);
      throw new Error(`Failed to generate DIML: ${err.message}`);
    }
  }

  private async callAnthropic(messages: { role: 'user' | 'assistant'; content: string }[]) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages,
      });

      if (!response.content?.[0]?.text) {
        throw new Error('Empty response from Claude');
      }

      return response.content[0].text;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      Logger.error('Failed to call Claude API', err);
      throw new Error(`Failed to call Claude API: ${err.message}`);
    }
  }
} 