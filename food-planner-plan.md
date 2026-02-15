# Food Planner — Project Plan

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

### Required

| Tool       | Purpose                                      | Install                                                        |
| ---------- | -------------------------------------------- | -------------------------------------------------------------- |
| Node.js    | Runs both Vue dev server and Express backend  | https://nodejs.org (LTS version recommended)                   |
| npm        | Package manager (comes with Node.js)          | Included with Node.js                                          |
| Docker     | Runs PostgreSQL without native install        | https://www.docker.com/products/docker-desktop/                |
| Git        | Version control                               | https://git-scm.com/downloads                                 |

### Optional (Recommended)

| Tool              | Purpose                                      | Install                                                  |
| ----------------- | -------------------------------------------- | -------------------------------------------------------- |
| DBeaver           | GUI for browsing/managing the database        | https://dbeaver.io/download/                             |
| Postman           | Testing API endpoints visually                | https://www.postman.com/downloads/                       |
| VS Code Extensions | Alternatives to standalone tools             | See list below                                           |

### Useful VS Code Extensions

- **Prisma** — syntax highlighting and autocomplete for `.prisma` schema files
- **Vue - Official** — Vue 3 language support (formerly Volar)
- **Tailwind CSS IntelliSense** — autocomplete for TailwindCSS classes
- **REST Client** — test API endpoints directly from VS Code (alternative to Postman)
- **PostgreSQL** (by Chris Kolkman) — browse database from VS Code (alternative to DBeaver)
- **ESLint** — linting for JavaScript/TypeScript
- **Thunder Client** — lightweight API client inside VS Code

### Verify Installation

```bash
node --version      # Should show v18+ or v20+
npm --version       # Should show 9+ or 10+
docker --version    # Should show Docker 20+
git --version       # Should show git 2+
```

## Project Structure

```
food-planner/
├── client/                # Vue 3 + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── views/         # Page-level components
│   │   ├── stores/        # Pinia stores
│   │   ├── router/        # Vue Router config
│   │   ├── api/           # Axios service layer
│   │   ├── types/         # Shared TypeScript types
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                # Express + Prisma
│   ├── src/
│   │   ├── routes/        # API route definitions
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic (recommendation engine)
│   │   ├── middleware/     # Express middleware (error handling, validation)
│   │   └── types/         # Server-side types
│   ├── prisma/
│   │   └── schema.prisma  # DB schema definition
│   └── package.json
├── docker-compose.yml     # PostgreSQL container
└── README.md
```

## Database Schema

### Enums

- **RecipeType**: CHICKEN, MEAT, VEGETARIAN, LENTIL, FISH, OTHER
- **Difficulty**: EASY, MEDIUM, HARD
- **Cost**: LOW, MEDIUM, HIGH
- **Season**: SUMMER, WINTER, SPRING, AUTUMN, ALL
- **MealTime**: BREAKFAST, LUNCH, DINNER, SNACK
- **DayOfWeek**: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY

### Tables

#### recipes

| Column      | Type         | Notes                          |
| ----------- | ------------ | ------------------------------ |
| id          | UUID (PK)    | Auto-generated                 |
| name        | String       | Required                       |
| description | Text         | Optional, recipe instructions  |
| type        | RecipeType   | Enum                           |
| difficulty  | Difficulty   | Enum                           |
| cost        | Cost         | Enum                           |
| seasons     | Season[]     | Array — recipe can span seasons|
| timings     | MealTime[]   | Array — can be lunch + dinner  |
| created_at  | DateTime     | Auto                           |
| updated_at  | DateTime     | Auto                           |

#### ingredients

| Column       | Type       | Notes                       |
| ------------ | ---------- | --------------------------- |
| id           | UUID (PK)  | Auto-generated              |
| name         | String     | Unique                      |
| default_unit | String     | Optional (e.g., "grams")    |

#### recipe_ingredients

| Column        | Type       | Notes                      |
| ------------- | ---------- | -------------------------- |
| id            | UUID (PK)  | Auto-generated             |
| recipe_id     | UUID (FK)  | → recipes.id               |
| ingredient_id | UUID (FK)  | → ingredients.id           |
| quantity      | Float      | Amount needed              |
| unit          | String     | e.g., "grams", "cups"     |

#### weekly_plans

| Column          | Type       | Notes                    |
| --------------- | ---------- | ------------------------ |
| id              | UUID (PK)  | Auto-generated           |
| week_start_date | Date       | Monday of that week      |
| created_at      | DateTime   | Auto                     |

#### plan_items

| Column      | Type       | Notes                       |
| ----------- | ---------- | --------------------------- |
| id          | UUID (PK)  | Auto-generated              |
| plan_id     | UUID (FK)  | → weekly_plans.id           |
| recipe_id   | UUID (FK)  | → recipes.id                |
| day_of_week | DayOfWeek  | Enum                        |
| meal_type   | MealTime   | Enum                        |

#### recommendation_history

| Column          | Type       | Notes                    |
| --------------- | ---------- | ------------------------ |
| id              | UUID (PK)  | Auto-generated           |
| recipe_id       | UUID (FK)  | → recipes.id             |
| week_start_date | Date       | When it was recommended  |
| created_at      | DateTime   | Auto                     |

## Core Features

### Phase 1 — Recipe Management (CRUD)

- Add, edit, delete recipes
- Add ingredients to recipes with quantity and unit
- List all recipes with search and filtering by type, difficulty, cost, season, timing
- Recipe detail view with full description and ingredients

### Phase 2 — Weekly Plan Generation

- Select filters (season, type, difficulty, cost, timing)
- Configure plan shape: how many meals per day, which days
- Recommendation engine: random selection from filtered recipes with weighting
  - **Weight 0** — recipe was in last week's plan (excluded)
  - **Weight 0.3** — recipe was in 2-weeks-ago plan (reduced chance)
  - **Weight 1.0** — recipe not recommended recently (full chance)
- View generated plan in a week calendar grid
- Regenerate individual meals or entire plan
- Save/confirm the plan (writes to weekly_plans + plan_items + recommendation_history)

### Phase 3 — Grocery & Pantry (Future)

- Auto-generate grocery list from a weekly plan (sum ingredients across recipes)
- Pantry inventory: track what you have at home
- Smart grocery list: plan ingredients minus pantry stock
- Extend from food planner to home planner

## API Endpoints (Planned)

```
# Recipes
GET    /api/recipes          — list with filters
GET    /api/recipes/:id      — detail
POST   /api/recipes          — create
PUT    /api/recipes/:id      — update
DELETE /api/recipes/:id      — delete

# Ingredients
GET    /api/ingredients       — list/search (for autocomplete)
POST   /api/ingredients       — create

# Weekly Plans
POST   /api/plans/generate    — generate plan with filters + weighting
GET    /api/plans             — list past plans
GET    /api/plans/:id         — plan detail with items
POST   /api/plans/:id/save    — confirm and save plan

# Recommendation History
GET    /api/history           — recent recommendations (for debugging/transparency)
```

---

## Setup Prompt (Food Planner)

Use this prompt in a new Cascade conversation to scaffold the project:

```
Set up a full-stack web application called "FoodPlanner" in C:\Users\Link\Projects\Personal\FoodPlanner using the following stack and structure.

**Tech Stack:**
- Frontend: Vue 3 + Vite + TypeScript + Vue Router + Pinia + TailwindCSS + Axios
- Backend: Node.js + Express + TypeScript + Prisma ORM
- Database: PostgreSQL via Docker (docker-compose.yml)

**Project Structure:**
- client/ — Vue 3 app scaffolded with `npm create vue@latest` (select TypeScript, Vue Router, Pinia)
- server/ — Express app with TypeScript, nodemon for dev, organized into routes/, controllers/, services/, middleware/, types/
- docker-compose.yml at root for PostgreSQL 16 (user: admin, password: secret, db: food_planner, port: 5432)
- Root README.md with setup and run instructions

**Server setup details:**
- TypeScript with ts-node and nodemon
- Prisma initialized with PostgreSQL provider
- DATABASE_URL in .env pointing to the Docker Postgres instance
- CORS configured to allow requests from the Vue dev server (localhost:5173)
- Express server running on port 3000
- Basic error handling middleware
- Health check endpoint at GET /api/health

**Prisma schema — define these models:**

Enums: RecipeType (CHICKEN, MEAT, VEGETARIAN, LENTIL, FISH, OTHER), Difficulty (EASY, MEDIUM, HARD), Cost (LOW, MEDIUM, HIGH), Season (SUMMER, WINTER, SPRING, AUTUMN, ALL), MealTime (BREAKFAST, LUNCH, DINNER, SNACK), DayOfWeek (MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY)

Tables:
- recipes: id (uuid), name, description (optional), type (RecipeType), difficulty, cost, seasons (Season[]), timings (MealTime[]), created_at, updated_at
- ingredients: id (uuid), name (unique), default_unit (optional)
- recipe_ingredients: id (uuid), recipe_id (FK), ingredient_id (FK), quantity (Float), unit (String)
- weekly_plans: id (uuid), week_start_date (Date unique), created_at
- plan_items: id (uuid), plan_id (FK), recipe_id (FK), day_of_week (DayOfWeek), meal_type (MealTime)
- recommendation_history: id (uuid), recipe_id (FK), week_start_date (Date), created_at

**Client setup details:**
- TailwindCSS configured and working
- Axios instance configured with baseURL http://localhost:3000/api
- Basic router with placeholder pages: Home, Recipes, Add Recipe, Weekly Plan
- Pinia store skeleton for recipes

**Do not implement any feature logic yet.** Just set up the scaffolding, schema, config, and placeholder pages so the project compiles and runs. After setup, provide instructions on how to start everything.

Refer to C:\Users\Link\Projects\Personal\FoodPlanner\food-planner-plan.md for the full project plan.
```

---

## Generic Template Prompt (Any Project, Same Stack)

Use this prompt as a starting point for any new Vue 3 + Express + Prisma project:

```
Set up a full-stack web application called "[PROJECT_NAME]" in C:\Users\Link\Projects\Personal\[PROJECT_NAME] using the following stack.

**Tech Stack:**
- Frontend: Vue 3 + Vite + TypeScript + Vue Router + Pinia + TailwindCSS + Axios
- Backend: Node.js + Express + TypeScript + Prisma ORM
- Database: PostgreSQL via Docker (docker-compose.yml)

**Project Structure:**
- client/ — Vue 3 app (TypeScript, Vue Router, Pinia, TailwindCSS, Axios)
- server/ — Express app with TypeScript, nodemon, organized into routes/, controllers/, services/, middleware/, types/
- docker-compose.yml at root for PostgreSQL 16 (user: admin, password: secret, db: [DB_NAME], port: 5432)
- Root README.md with setup and run instructions

**Server setup:**
- TypeScript with ts-node and nodemon
- Prisma initialized with PostgreSQL provider
- DATABASE_URL in .env pointing to Docker Postgres
- CORS allowing requests from localhost:5173
- Express on port 3000
- Error handling middleware
- Health check at GET /api/health

**Prisma schema:**
[DESCRIBE YOUR MODELS AND ENUMS HERE]

**Client setup:**
- TailwindCSS configured
- @types/node installed as dev dependency (for vite.config.ts type support)
- Axios instance with baseURL http://localhost:3000/api
- Router with placeholder pages: [LIST YOUR PAGES]
- Pinia store skeletons for: [LIST YOUR STORES]

Do not implement feature logic yet. Scaffold, schema, config, and placeholder pages only. Provide instructions on how to start everything after setup.
```
