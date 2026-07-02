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

### Setting Up a New Database

This section explains how to bootstrap a completely new PostgreSQL database (local VM, cloud PostgreSQL, managed PostgreSQL, Docker, etc.).

**Quick Start (under 10 minutes):**

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Configure DATABASE_URL in .env
# Create .env file with:
DATABASE_URL="postgresql://user:password@localhost:5432/customer_sales_system"
NODE_ENV=development

# 4. Generate Prisma client
npm run prisma:generate

# 5. Run migrations
npm run prisma:deploy

# 6. Seed master data
npm run prisma:seed

# 7. Start the application
npm run dev
```

**Alternative: Using the setup script**

```bash
cd backend
npm install
# Configure .env with DATABASE_URL
npm run db:setup
npm run dev
```

**Database Setup Options:**

- **Local PostgreSQL**: Install PostgreSQL locally, create database, configure DATABASE_URL
- **Docker PostgreSQL**: Run `docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=customer_sales_system -p 5432:5432 -d postgres:16`
- **Cloud PostgreSQL**: Create instance in cloud provider, get connection string, configure DATABASE_URL

For detailed database operations, see [docs/technical/database/DATABASE.md](docs/technical/database/DATABASE.md).

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
- `npm run prisma:migrate` - Create and apply development migration
- `npm run prisma:deploy` - Apply migrations (production)
- `npm run prisma:seed` - Seed master data
- `npm run prisma:studio` - Open Prisma Studio
- `npm run db:setup` - Generate client, apply migrations, seed data
- `npm run db:reset` - Reset development database (WARNING: drops data)
- `npm run db:studio` - Open Prisma Studio

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
