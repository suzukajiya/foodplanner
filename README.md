# FoodPlanner

A full-stack web application for planning weekly meals with smart recipe recommendations.

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | Vue 3 + Vite + TypeScript           |
| Styling    | TailwindCSS                         |
| State      | Pinia                               |
| Routing    | Vue Router                          |
| HTTP       | Axios                               |
| Backend    | Node.js + Express + TypeScript      |
| ORM        | Prisma                              |
| Database   | PostgreSQL (via Docker)             |

## Prerequisites

- Node.js 18+ (or 20+)
- npm 9+ (or 10+)
- Docker Desktop
- Git

## Project Structure

```
food-planner/
├── client/                # Vue 3 + Vite frontend
│   ├── src/
│   │   ├── api/           # Axios service layer
│   │   ├── components/    # Reusable UI components
│   │   ├── router/        # Vue Router config
│   │   ├── stores/        # Pinia stores
│   │   ├── types/         # TypeScript types
│   │   └── views/         # Page-level components
│   └── package.json
├── server/                # Express + Prisma backend
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   └── types/         # Server-side types
│   └── package.json
├── docker-compose.yml     # PostgreSQL container
└── README.md
```

## Setup Instructions

### 1. Start PostgreSQL Database

```powershell
# From the project root
docker-compose up -d
```

This starts PostgreSQL on port 5432 with:
- Database: `food_planner`
- User: `admin`
- Password: `secret`

### 2. Server Setup

```powershell
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The server will start on **http://localhost:3000**

**Health check endpoint:** `GET http://localhost:3000/api/health`

### 3. Client Setup

Open a **new terminal** window:

```powershell
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The client will start on **http://localhost:5173**

## Available Scripts

### Root Commands (from project root)

| Command               | Description                                      |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Run server + client together (colored output)   |
| `npm run start`       | Run migrations, seed, then start dev servers    |
| `npm run setup`       | Run migrations + seed database                  |
| `npm run docker:up`   | Start PostgreSQL container                      |
| `npm run docker:down` | Stop PostgreSQL container                       |
| `npm run db:migrate`  | Run Prisma migrations                           |
| `npm run db:seed`     | Seed database with dummy data                   |
| `npm run db:studio`   | Open Prisma Studio                              |
| `npm run install:all` | Install all dependencies (root + server + client) |
| `npm run build`       | Build both server and client                    |

### Server (from `server/` directory)

| Command                  | Description                          |
| ------------------------ | ------------------------------------ |
| `npm run dev`            | Start dev server with nodemon        |
| `npm run build`          | Compile TypeScript to JavaScript     |
| `npm start`              | Run compiled production server       |
| `npm run prisma:generate`| Generate Prisma client               |
| `npm run prisma:migrate` | Run database migrations              |
| `npm run prisma:studio`  | Open Prisma Studio (GUI for DB)      |

### Client (from `client/` directory)

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start Vite dev server           |
| `npm run build`   | Build for production            |
| `npm run preview` | Preview production build        |

## Database Schema

The Prisma schema defines the following models:

- **recipes** - Recipe details with type, difficulty, cost, seasons, and meal timings
- **ingredients** - Master ingredient list
- **recipe_ingredients** - Junction table linking recipes to ingredients with quantities
- **weekly_plans** - Weekly meal plans
- **plan_items** - Individual meals in a weekly plan
- **recommendation_history** - Track which recipes were recommended when

See `server/prisma/schema.prisma` for the complete schema definition.

## Development Workflow

### Quick Start (Fresh Setup)

```powershell
# From project root
npm run install:all    # Install everything
npm run docker:up      # Start database
npm run start          # Migrate, seed, and run dev servers
```

### Daily Development

```powershell
npm run docker:up      # If DB not running
npm run dev            # Start server (port 3000) + client (port 5173)
```

The terminal will show color-coded output: **blue** for server, **green** for client.

### Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Prisma Studio: `npm run db:studio`

## Current Pages

The application has placeholder pages ready for implementation:

- **Home** (`/`) - Landing page
- **Recipes** (`/recipes`) - Recipe list view
- **Add Recipe** (`/add-recipe`) - Recipe creation form
- **Weekly Plan** (`/weekly-plan`) - Meal plan generator

## Next Steps

The scaffolding is complete. Next phases of development:

1. **Phase 1 - Recipe Management**
   - Implement recipe CRUD operations
   - Add ingredient management
   - Create recipe detail view with filtering

2. **Phase 2 - Weekly Plan Generation**
   - Build recommendation engine with weighting
   - Create weekly calendar view
   - Implement plan save/regenerate functionality

3. **Phase 3 - Grocery & Pantry** (Future)
   - Auto-generate grocery lists from plans
   - Track pantry inventory
   - Smart grocery list (plan minus pantry)

## Stopping the Application

```powershell
# Stop servers: Ctrl+C in each terminal

# Stop and remove database container
docker-compose down

# Stop and remove database container + volumes (deletes all data)
docker-compose down -v
```

## Troubleshooting

**Database connection issues:**
- Ensure Docker is running
- Check `docker-compose ps` to verify PostgreSQL is running
- Verify `.env` file exists in `server/` with correct DATABASE_URL

**TypeScript errors before npm install:**
- All TypeScript/module errors will resolve after running `npm install` in both directories

**Port already in use:**
- Server (3000): Change `PORT` in `server/.env`
- Client (5173): Change in `client/vite.config.ts` server options
- Database (5432): Change port mapping in `docker-compose.yml`

## License

ISC
