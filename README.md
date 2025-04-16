# Intent MCP Server

A Model Context Protocol (MCP) server that processes natural language intents into structured, actionable formats. This server provides a robust API for managing and processing intents with a focus on extensibility and reliability.

## Overview

This project implements an intent processing architecture that transforms natural language inputs into structured objects and generates executable workflows. It focuses on maintainability, type safety, and extensibility while providing a clean API for intent management.

## Features

- 🎯 **Intent Processing**: Create, retrieve, and process intents through a well-defined API
- 🔍 **Natural Language Understanding**: Parse and understand raw user intentions
- 🧩 **Intent Decomposition**: Transform intentions into structured objects with goals and constraints
- 💾 **Flexible Storage**: Pluggable storage system with built-in in-memory implementation
- 📝 **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- 🛡️ **Error Handling**: Robust error handling and logging system
- 🧪 **Testing**: Comprehensive test suite with Jest
- 📚 **API Documentation**: Clear API documentation and examples

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/openpandacodes/intent-mcp-server.git
cd intent-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration settings.

## Configuration

The server can be configured using environment variables:

- `NODE_ENV`: Environment (development, production, test)
- `PORT`: Server port (default: 3000)
- `LOG_LEVEL`: Logging level (debug, info, warn, error)

## Usage

### Development

Start the development server with hot reloading:
```bash
npm run dev
```

### Production

Build and start the production server:
```bash
npm run build
npm start
```

### Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## API Endpoints

### Intent Management

- `POST /api/intent`: Create a new intent
  ```bash
  curl -X POST http://localhost:3000/api/intent \
    -H "Content-Type: application/json" \
    -d '{"rawIntent": "Your natural language intent here"}'
  ```

- `GET /api/intent/:id`: Get an intent by ID
  ```bash
  curl -X GET http://localhost:3000/api/intent/YOUR_INTENT_ID
  ```

Additional endpoints are documented in the API specification.

### Health Check

- `GET /health`: Check server health status

## Architecture

The server follows a clean architecture pattern with distinct layers:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Implement core business logic and intent processing
3. **Storage**: Manage data persistence with pluggable implementations
4. **Models**: Define data structures and types

### Key Components

- `IntentController`: Handles intent-related HTTP endpoints
- `IntentService`: Core service for intent processing
- `StorageInterface`: Abstract storage layer
- `InMemoryStorage`: Reference implementation of storage interface

### Project Structure

```
intent-mcp-server/
├── src/
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic implementation
│   │   └── __tests__/  # Service tests
│   ├── storage/        # Storage implementations
│   ├── models/         # Type definitions
│   └── utils/          # Utility functions
├── tests/              # Test suites
└── config/             # Configuration files
```

## Intent Structure

The system structures intentions into formal objects:

```typescript
interface Intent {
  id: string;
  rawIntent: string;
  processed: {
    goals: Goal[];
    constraints: Constraint[];
    metadata: Record<string, unknown>;
  };
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

The server implements comprehensive error handling:

- Custom error classes for different types of errors
- Proper HTTP status codes and error responses
- Structured logging for debugging and monitoring
- Validation using TypeScript types

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

Please ensure your code:
- Follows the existing style and conventions
- Includes appropriate tests
- Updates documentation as needed
- Uses conventional commit messages

## License

MIT License - see LICENSE file for details 