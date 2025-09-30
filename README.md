# webinar-api

## Instructions for Running the Project Locally

### Prerequisites

- Node.js 22+
- Docker (optional, for database)
- PostgreSQL (can be via Docker)

### Installation

```sh
git clone https://github.com/medinavs/webinar-api.git
cd webinar-api
npm install
```

### Database Setup

- Configure the `.env` file with the `DATABASE_URL` variable for PostgreSQL.

- To run the database using Docker:
  ```sh
  docker-compose up
  ```

- Run Prisma migrations:
  ```sh
  npm run prisma:migrate
  ```

- Create entities from the Prisma schema:
  ```sh
  npm run prisma:push
  ```

- Populate Database:
  ```sh
  npm run db:populate
  ```

### Generate Prisma Client

```sh
npm run build
```

### Start the Server

```sh
npm run start:dev
```

- The API will be available at `http://localhost:8080`
- Swagger documentation at `http://localhost:8080/docs`

---

## Architecture Decisions and Assumptions

- **Fastify** as the main HTTP framework for high performance.
- **Prisma** as ORM for PostgreSQL integration.
- **Better Auth** for authentication and session management.
- **Modular structure**: clear separation between infrastructure, domain modules (e.g., webinars, categories), and shared utilities. The project follows SOLID principles to ensure maintainability, scalability, and clear responsibility separation.
- **Validation**: Zod for data and schema validation.
- **Swagger**: automatic route documentation via Fastify plugins (implemented, but routes are not yet documented).
- **Access control**: Middleware for authentication.
- **Environment variables**: Validated at runtime with Zod.

---

## Project Structure

```
.
├── prisma/                        # Prisma schema and migrations
├── src/
│   ├── infrastructure/            # Auth, config, database, HTTP plugins/middlewares
│   ├── modules/
│   │   └── content/*
│   │       ├── http/              # Controllers and routes
│   │       ├── repositories/      # repositories contracts and concrete implementation
│   │       └── use-cases/         # Business logic for domains
│   ├── shared/
│   │   ├── constants/             # Shared constants
│   │   ├── exceptions/            # Custom error classes
│   │   ├── models/                # Shared models/interfaces
│   │   └── utils/                 # Utility functions
│   └── app.ts                     # Fastify app setup
│   └── server.ts                  # Server entrypoint
├── .env                           # Environment variables (not in repo)
├── .eslintrc.json                 # Lint config
├── .example.env                   # Example environment variables
├── docker-compose.yml             # Docker Compose configuration
├── Dockerfile                     # Docker build configuration
├── package.json                   # NPM scripts and dependencies
├── tsconfig.json                  # TypeScript config
└── vite.config.js                 # Vite config for path alias ("@")
```

## API Endpoints

The API uses decorator-based routing with controllers for each domain. Main endpoints:

- **Webinars**
  - `GET /webinars`: List webinars (with filters)
  - `GET /webinars/:id`: Get webinar details
  - `GET /webinars/registered/:userId`: List webinars a user is registered for
  - `POST /webinars/:webinarId/registrations`: Register authenticated user for a webinar

- **Categories**
  - `GET /categories`: List all categories

- **Auth**
  - "\*" all auth endpoints from BetterAuth (admin plugin too)
  - `POST /api/auth/sign-up`: Create user account
  - `POST /api/auth/sign-in`: Login
  - `POST /api/auth/sign-out`: Logout
  - `GET /api/auth/session`: Get current session

## Improvements and Next Steps

- Implement automated tests (unit and integration).
- Add caching for frequent queries (e.g., categories, webinars).
- Implement more detailed roles and permissions for users.
- Enhanced monitoring and logging for production.
- Add documentation to endpoints and example payloads.
