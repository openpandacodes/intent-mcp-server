# Deep Intent MCP Server

A Model Context Protocol server for processing travel intents based on Deep Intent Architecture. This server provides a robust API for managing travel intents, generating deep flows, and creating DIML (Deep Intent Markup Language) representations.

## Features

- **Intent Management**: Create, retrieve, refine, and finalize travel intents
- **Deep Flow Generation**: Automatically generate detailed workflows for travel intents
- **DIML Generation**: Convert deep flows into DIML XML format
- **Storage Interface**: Pluggable storage system with in-memory implementation
- **Rate Limiting**: Configurable rate limiting for API endpoints
- **Environment Configuration**: Support for different environments (development, production, test)
- **Comprehensive Testing**: Unit tests for all major components
- **Error Handling**: Robust error handling and logging system

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Claude API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/deep-intent-mcp-server.git
cd deep-intent-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the `.env.example` template:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Claude API key and other configuration settings.

## Configuration

The server can be configured using environment variables:

- `NODE_ENV`: Environment (development, production, test)
- `PORT`: Server port (default: 3000)
- `CLAUDE_API_KEY`: Your Claude API key
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window (default: 100)
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

- `POST /api/intent/create`: Create a new intent
- `GET /api/intent/:id`: Get an intent by ID
- `PUT /api/intent/:id/refine`: Refine an existing intent
- `PUT /api/intent/:id/finalize`: Finalize an intent

### Deep Flow Management

- `POST /api/flow/generate/:id`: Generate deep flows for an intent
- `GET /api/flow/:id`: Get a deep flow by ID
- `GET /api/flow/:id/diml`: Get DIML representation of a flow
- `GET /api/flow/:id/description`: Get natural language description of a flow

### Health Check

- `GET /health`: Check server health status

## Architecture

The server follows a layered architecture:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Implement business logic
3. **Storage**: Manage data persistence
4. **Models**: Define data structures and types

### Key Components

- `IntentService`: Core service for intent processing
- `PromptEngineering`: Handles communication with Claude LLM
- `StorageInterface`: Abstract storage layer
- `InMemoryStorage`: In-memory storage implementation

## Error Handling

The server implements comprehensive error handling:

- Input validation using Zod schemas
- Proper error responses with appropriate HTTP status codes
- Detailed error messages in development, sanitized in production
- Structured logging for debugging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details 