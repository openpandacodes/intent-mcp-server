# Deep Intent MCP

A Model Context Protocol (MCP) server for travel planning that processes natural language intents into structured Deep Intents and executable DeepFlows.

## Overview

This project implements the Deep Intent Architecture described in "Intention Is All You Need" by Abhimanyu Kashyap. It processes natural language travel intents from users, decomposes them into structured Deep Intent objects using Claude LLM, and generates executable DeepFlows in both natural language and DIML (Deep Intent Markup Language) formats.

### Key Features

- 🔍 **Natural Language Intent Capture**: Parse and understand raw user travel intentions
- 🧩 **Intent Decomposition**: Transform intentions into structured Deep Intent objects with main goals and subgoals
- 🔄 **Interactive Refinement**: Allow users to refine intents through conversation
- 🛠️ **DeepFlow Generation**: Create multiple execution pathways (2-5) for accomplishing the intent
- 📄 **Dual Output Formats**: Generate both human-readable explanations and machine-executable DIML

## Architecture

The system follows a layered architecture based on the paper:

1. **Natural Language Capture Layer**: Processes raw user intents
2. **Semantic Translation Layer**: Transforms natural language into structured representations
3. **Intent Decomposition Engine**: Generates a directed acyclic graph (DAG) of subtasks
4. **DeepFlow Generator**: Creates multiple execution strategies
5. **DIML Generator**: Outputs standardized XML representation of workflows

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/deep-intent-mcp.git
cd deep-intent-mcp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Claude API key and other settings

# Build the project
npm run build
```

## Usage

### Start the Server

```bash
npm start
```

### API Endpoints

#### Intent Processing

- `POST /api/intent/create` - Submit a raw travel intent
- `GET /api/intent/:id` - Retrieve a processed deep intent
- `PUT /api/intent/:id/refine` - Refine an existing intent
- `PUT /api/intent/:id/finalize` - Finalize an intent for DeepFlow generation

#### DeepFlow Generation

- `POST /api/flow/generate/:intentId` - Generate DeepFlows for a finalized intent
- `GET /api/flow/:id` - Retrieve a specific DeepFlow
- `GET /api/flow/:id/diml` - Get the DIML (XML) representation of a DeepFlow
- `GET /api/flow/:id/description` - Get the natural language description of a DeepFlow

### Example

1. Submit a raw intent:
```bash
curl -X POST http://localhost:3000/api/intent/create \
  -H "Content-Type: application/json" \
  -d '{"rawIntent": "I want to travel from London to New York in April for 10 days with a budget of $5000"}'
```

2. Retrieve the processed deep intent:
```bash
curl -X GET http://localhost:3000/api/intent/YOUR_INTENT_ID
```

3. Refine the intent:
```bash
curl -X PUT http://localhost:3000/api/intent/YOUR_INTENT_ID/refine \
  -H "Content-Type: application/json" \
  -d '{"feedback": "I prefer luxury hotels and I'm interested in Broadway shows"}'
```

4. Finalize the intent:
```bash
curl -X PUT http://localhost:3000/api/intent/YOUR_INTENT_ID/finalize
```

5. Generate DeepFlows:
```bash
curl -X POST http://localhost:3000/api/flow/generate/YOUR_INTENT_ID \
  -H "Content-Type: application/json" \
  -d '{"count": 3}'
```

## Deep Intent Structure

The system structures intentions into a formal Deep Intent object:

```typescript
interface DeepIntent {
  intentId: string;
  rawIntent: string;
  mainGoal: {
    objective: string;
    constraints: Constraint[];
    priority: "high" | "medium" | "low";
  };
  subGoals: SubGoal[];
  status: "draft" | "finalized" | "processing" | "completed" | "failed";
  // ...other fields
}
```

## DeepFlow Format

DeepFlows represent execution pathways:

```typescript
interface DeepFlow {
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
  // ...other fields
}
```

## DIML (Deep Intent Markup Language)

DIML is an XML-based representation of DeepFlows:

```xml
<DeepFlow id="DF-Travel-NYC-001" intent="travel-planning-nyc-apr2025">
  <Metadata>
    <Author>DeepFlowGenerator</Author>
    <Created>2025-04-03T10:15:32Z</Created>
    <EstimatedCost>0.15</EstimatedCost>
    <EstimatedDuration>45s</EstimatedDuration>
  </Metadata>
  <Resources>
    <Resource id="R1" type="FlightAPI" provider="GlobalFlights" />
    <!-- More resources -->
  </Resources>
  <Steps>
    <Step id="S1" depends="">
      <Action resource="R1">
        <Query>
          findFlights(origin="London", destination="New York",
          departDate="2025-04-22", returnDate="2025-05-02",
          maxBudget=2000)
        </Query>
        <Output bind="flightOptions" />
      </Action>
    </Step>
    <!-- More steps -->
  </Steps>
  <!-- Output configuration -->
</DeepFlow>
```

## Development

### Project Structure

```
deep-intent-mcp/
├── src/
│   ├── types/              # TypeScript type definitions
│   ├── services/           # Core business logic
│   │   ├── llm/            # LLM integration
│   │   ├── intentCapture/  # Raw intent processing
│   │   ├── intentDecomposition/
│   │   ├── deepFlowGeneration/
│   │   └── execution/      # Future execution capabilities
│   ├── api/                # API endpoints
│   └── utils/              # Utility functions
└── examples/               # Example inputs and outputs
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit
npm run test:integration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Paper: "Intention Is All You Need" by Abhimanyu Kashyap
- Claude LLM by Anthropic for natural language processing
