import { z } from 'zod';

// Environment schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  CLAUDE_API_KEY: z.string(),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

// Application configuration
export const config = {
  environment: env.NODE_ENV,
  port: parseInt(env.PORT, 10),
  claude: {
    apiKey: env.CLAUDE_API_KEY,
    model: 'claude-3-opus-20240229'
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10)
  },
  logging: {
    level: env.LOG_LEVEL
  }
};

// Type for the configuration object
export type Config = typeof config;

// Validate configuration
if (config.environment === 'production') {
  if (!config.claude.apiKey) {
    throw new Error('CLAUDE_API_KEY is required in production environment');
  }
}

// Export a function to get the configuration
export function getConfig(): Config {
  return config;
} 