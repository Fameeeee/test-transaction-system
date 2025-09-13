# Backend API

Express.js API for auth endpoints with PostgreSQL.

## Endpoints

- POST /api/auth/register
  - body: { email, password }
  - 201: { user: { id, email, created_at } }
  - 409 if email exists

- POST /api/auth/login
  - body: { email, password }
  - 200: { token, user: { id, email } }
  - 401 invalid credentials

## Local development

1. Copy env
   cp backend/.env.example backend/.env
2. Start Postgres (Docker) and backend:
   docker compose up --build backend
3. Or run locally with your own Postgres:
   - set DATABASE_URL in backend/.env
   - npm install
   - npm run db:init
   - npm start

## Notes
- Uses bcryptjs for hashing and JWT for tokens.
- Simple init script creates users table.
