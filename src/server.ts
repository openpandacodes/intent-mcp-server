import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { ModelContextProtocol } from '@modelcontextprotocol/sdk';
import { IntentService } from './services/intent-service';
import { IntentController } from './controllers/intent-controller';
import { InMemoryStorage } from './storage/in-memory-storage';
import rateLimit from 'express-rate-limit';
import { Logger } from './utils/logger';
import { getConfig } from './config/config';

export function createServer() {
  // Load environment variables
  config();

  // Get configuration
  const appConfig = getConfig();

  // Initialize storage
  const storage = new InMemoryStorage();

  // Initialize MCP
  const mcp = new ModelContextProtocol({
    apiKey: appConfig.claude.apiKey,
    model: appConfig.claude.model
  });

  // Initialize services and controllers
  const intentService = new IntentService(mcp, storage);
  const intentController = new IntentController(intentService);

  const app = express();

  // Rate limiting
  const limiter = rateLimit({
    windowMs: appConfig.rateLimit.windowMs,
    max: appConfig.rateLimit.max,
    message: 'Too many requests from this IP, please try again later'
  });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(limiter);

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    Logger.error('Unhandled error', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: appConfig.environment === 'development' ? err.message : 'An unexpected error occurred'
    });
  });

  // Intent routes
  app.post('/api/intent/create', (req, res) => intentController.createIntent(req, res));
  app.get('/api/intent/:id', (req, res) => intentController.getIntent(req, res));
  app.put('/api/intent/:id/refine', (req, res) => intentController.refineIntent(req, res));
  app.put('/api/intent/:id/finalize', (req, res) => intentController.finalizeIntent(req, res));

  // DeepFlow routes
  app.post('/api/flow/generate/:id', (req, res) => intentController.generateDeepFlows(req, res));
  app.get('/api/flow/:id', (req, res) => intentController.getDeepFlow(req, res));
  app.get('/api/flow/:id/diml', (req, res) => intentController.getDIML(req, res));
  app.get('/api/flow/:id/description', (req, res) => intentController.getNaturalLanguageDescription(req, res));

  // Health check route
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: appConfig.environment
    });
  });

  return app;
}

// If this file is run directly, start the server
if (require.main === module) {
  const app = createServer();
  const appConfig = getConfig();
  
  app.listen(appConfig.port, () => {
    Logger.info(`MCP Server running on port ${appConfig.port}`, { 
      environment: appConfig.environment,
      claudeModel: appConfig.claude.model,
      rateLimit: {
        windowMs: appConfig.rateLimit.windowMs,
        max: appConfig.rateLimit.max
      }
    });
  });
} 