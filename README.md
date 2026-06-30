# Customer Sales System

A customer-centered ERP for order-to-delivery operations with customer-specific pricing.

## Architecture

This project follows the approved architecture baseline defined in [ARCHITECTURE_V1_FINAL.md](ARCHITECTURE_V1_FINAL.md). All implementation must comply with the [ARCHITECTURE_CONTRACT.md](ARCHITECTURE_CONTRACT.md).

## Project Structure

```
.
├── backend/              # Node.js/Express backend
│   ├── src/             # Source code
│   ├── prisma/          # Prisma schema
│   └── Dockerfile       # Backend Docker image
├── frontend/            # React/Vite frontend
│   ├── src/             # Source code
│   └── Dockerfile       # Frontend Docker image
├── docker/              # Docker configuration
├── docs/                # Documentation
├── config/              # Configuration files
└── docker-compose.yml   # Docker Compose setup
```

## Technology Stack

### Backend
- Node.js 20+
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Pino (logging)

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui

### Infrastructure
- Docker
- Docker Compose
- GitHub Actions

## Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/customer_sales_system?schema=public"
LOG_LEVEL=info
```

## Getting Started

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- PostgreSQL (if not using Docker)

### Using Docker Compose (Recommended)

1. Start all services:
```bash
docker-compose up -d
```

2. Frontend will be available at http://localhost:80
3. Backend API will be available at http://localhost:3001
4. Health endpoint: http://localhost:3001/health

### Local Development

#### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on port 3001.

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on port 3000.

## Scripts

### Backend
- `npm run dev` - Development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests with Vitest
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run Prisma migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests with Vitest

## Ports

- Frontend: 3000 (local), 80 (Docker)
- Backend: 3001
- PostgreSQL: 5432

## Documentation

- [Architecture V1 Final](ARCHITECTURE_V1_FINAL.md) - Architecture baseline
- [Architecture Contract](ARCHITECTURE_CONTRACT.md) - Implementation rules
- [Implementation Readiness Report](IMPLEMENTATION_READINESS_REPORT.md) - Readiness assessment
- [docs/](docs/) - Full documentation

## License

Private
