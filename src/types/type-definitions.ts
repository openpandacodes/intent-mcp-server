// types.ts - Type definitions for the Deep Intent Architecture

export interface Constraint {
  type: string;
  value: string | number | boolean;
  description: string;
}

export interface MainGoal {
  objective: string;
  constraints: Constraint[];
  priority: 'high' | 'medium' | 'low';
}

export interface SubGoal {
  id: string;
  description: string;
  dependsOn?: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface DeepIntent {
  intentId: string;
  rawIntent: string;
  mainGoal: MainGoal;
  subGoals: SubGoal[];
  status: 'draft' | 'finalized' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  type: string;
  provider: string;
}

export interface Step {
  id: string;
  depends: string;
  action: {
    resource: string;
    query: string;
    output: string;
  };
}

export interface FlowResource {
  id: string;
  type: string;
  provider: string;
  configuration?: Record<string, any>;
}

export interface FlowStep {
  id: string;
  depends: string;
  action: {
    resource: string;
    query: string;
    output: string;
  };
}

export interface DeepFlow {
  id: string;
  intentId: string;
  metadata: {
    author: string;
    created: Date;
    estimatedCost: number;
    estimatedDuration: string;
  };
  resources: FlowResource[];
  steps: FlowStep[];
  output: {
    combine: {
      items: string[];
    };
  };
  naturalLanguageDescription: string;
}

// Request and Response types for API endpoints
export interface CaptureIntentRequest {
  rawIntent: string;
  userId?: string;
}

export interface CaptureIntentResponse {
  intentId: string;
  message: string;
  intent: DeepIntent;
}

export interface TranslateIntentResponse {
  message: string;
  intent: DeepIntent;
}

export interface DecomposeIntentResponse {
  message: string;
  intent: DeepIntent;
}

export interface FinalizeIntentResponse {
  message: string;
  intent: DeepIntent;
}

export interface GenerateDeepFlowsRequest {
  flowCount?: number;
}

export interface GenerateDeepFlowsResponse {
  message: string;
  flows: DeepFlow[];
}

// Enums for operation types and resource types
export enum OperationType {
  QUERY = 'query',
  BOOKING = 'booking',
  PLANNING = 'planning',
  SEARCH = 'search',
  RECOMMENDATION = 'recommendation',
  COMPARISON = 'comparison',
  NOTIFICATION = 'notification'
}

export enum ResourceType {
  FLIGHT_API = 'FlightAPI',
  HOTEL_API = 'HotelAPI',
  ACTIVITY_API = 'ActivityAPI',
  RESTAURANT_API = 'RestaurantAPI',
  TRANSPORT_API = 'TransportAPI',
  WEATHER_API = 'WeatherAPI',
  CURRENCY_API = 'CurrencyAPI',
  RECOMMENDATION_ENGINE = 'RecommendationEngine',
  BOOKING_SYSTEM = 'BookingSystem',
  PAYMENT_PROCESSOR = 'PaymentProcessor',
  NOTIFICATION_SERVICE = 'NotificationService'
}

// DIML XML structure interfaces
export interface DIMLResource {
  id: string;
  type: string;
  provider: string;
}

export interface DIMLAction {
  resource: string;
  query: string;
  output: {
    bind: string;
  };
}

export interface DIMLStep {
  id: string;
  depends: string;
  action: DIMLAction;
}

export interface DIMLOutput {
  combine: {
    item: {
      source: string;
    }[];
  };
}

export interface DIMLMetadata {
  author: string;
  created: string;
  estimatedCost: string;
  estimatedDuration: string;
}

export interface DIMLDeepFlow {
  id: string;
  intent: string;
  metadata: {
    author: string;
    created: string;
    estimatedCost: string;
    estimatedDuration: string;
  };
  resources: {
    resource: Array<{
      id: string;
      type: string;
      provider: string;
    }>;
  };
  steps: {
    step: Array<{
      id: string;
      depends: string;
      action: {
        resource: string;
        query: string;
        output: {
          bind: string;
        };
      };
    }>;
  };
  output: {
    combine: {
      item: Array<{
        source: string;
      }>;
    };
  };
}
