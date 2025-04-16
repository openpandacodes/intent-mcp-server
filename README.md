# Intent MCP Server

A Model Context Protocol server for processing intents. This server provides a robust API for managing and processing intents with a focus on extensibility and reliability.

## Features

- **Intent Processing**: Create, retrieve, and process intents through a well-defined API
- **Flexible Storage**: Pluggable storage system with built-in in-memory implementation
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Error Handling**: Robust error handling and logging system
- **Testing**: Comprehensive test suite with Jest
- **API Documentation**: Clear API documentation and examples

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
- `GET /api/intent/:id`: Get an intent by ID
- Additional endpoints as documented in the API specification

### Health Check

- `GET /health`: Check server health status

## Architecture

The server follows a clean architecture pattern:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Implement core business logic
3. **Storage**: Manage data persistence
4. **Models**: Define data structures and types

### Key Components

- `IntentController`: Handles intent-related HTTP endpoints
- `IntentService`: Core service for intent processing
- `StorageInterface`: Abstract storage layer
- `InMemoryStorage`: Reference implementation of storage interface

## Error Handling

The server implements comprehensive error handling:

- Custom error classes for different types of errors
- Proper HTTP status codes and error responses
- Structured logging for debugging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## License

MIT License - see LICENSE file for details 