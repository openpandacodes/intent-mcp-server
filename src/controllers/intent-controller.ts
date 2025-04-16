// intent-controller.ts - Express route handlers for the MCP server

import { Request, Response } from 'express';
import { IntentService } from '../services/intent-service';
import { DeepIntent, DeepFlow } from '../types/type-definitions';

export class IntentController {
  constructor(private intentService: IntentService) {}

  async createIntent(req: Request, res: Response): Promise<void> {
    try {
      const { rawIntent } = req.body;
      if (!rawIntent) {
        res.status(400).json({ error: 'Raw intent is required' });
        return;
      }

      const intent = await this.intentService.createIntent(rawIntent);
      res.status(201).json(intent);
    } catch (error) {
      console.error('Error creating intent:', error);
      res.status(500).json({ error: 'Failed to create intent' });
    }
  }

  async getIntent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const intent = await this.intentService.getIntent(id);
      
      if (!intent) {
        res.status(404).json({ error: 'Intent not found' });
        return;
      }

      res.json(intent);
    } catch (error) {
      console.error('Error getting intent:', error);
      res.status(500).json({ error: 'Failed to get intent' });
    }
  }

  async refineIntent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { feedback } = req.body;

      if (!feedback) {
        res.status(400).json({ error: 'Feedback is required' });
        return;
      }

      const intent = await this.intentService.refineIntent(id, feedback);
      res.json(intent);
    } catch (error) {
      console.error('Error refining intent:', error);
      res.status(500).json({ error: 'Failed to refine intent' });
    }
  }

  async finalizeIntent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const intent = await this.intentService.finalizeIntent(id);
      res.json(intent);
    } catch (error) {
      console.error('Error finalizing intent:', error);
      res.status(500).json({ error: 'Failed to finalize intent' });
    }
  }

  async generateDeepFlows(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const flows = await this.intentService.generateDeepFlows(id);
      res.json(flows);
    } catch (error) {
      console.error('Error generating deep flows:', error);
      res.status(500).json({ error: 'Failed to generate deep flows' });
    }
  }

  async getDeepFlow(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const flow = await this.intentService.getDeepFlow(id);
      
      if (!flow) {
        res.status(404).json({ error: 'Flow not found' });
        return;
      }

      res.json(flow);
    } catch (error) {
      console.error('Error getting deep flow:', error);
      res.status(500).json({ error: 'Failed to get deep flow' });
    }
  }

  async getDIML(req: Request, res: Response): Promise<void> {
    try {
      const { intentId, flowId } = req.params;
      const diml = await this.intentService.getDIML(intentId, flowId);
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(diml);
    } catch (error) {
      console.error('Error generating DIML:', error);
      res.status(500).json({ error: 'Failed to generate DIML' });
    }
  }

  async getNaturalLanguageDescription(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const description = await this.intentService.getNaturalLanguageDescription(id);
      res.json({ description });
    } catch (error) {
      console.error('Error getting natural language description:', error);
      res.status(500).json({ error: 'Failed to get natural language description' });
    }
  }
}
