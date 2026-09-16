# Glenveagh Homes

A marketing site and custom CMS for a fictional housing development, built for the
Glenveagh Properties coding challenge. Everything the public site shows — house
types, news posts, page content — is served from a self-built CMS via a GraphQL API,
so editing content in the admin updates the live site with no code deploy.

**Status:**
- ✅ Part 1 — Public marketing site (homepage, house types, news, register form)
- ✅ Part 2 — Custom CMS (admin login, CRUD, draft/published enforcement)
- ⏳ Part 3 — Email campaign tool (data model in place, sending not yet built)

## Tech stack

- **Frontend/backend:** Next.js 16 (App Router) + React 19 — one app, server-rendered
- **API:** GraphQL via Apollo Server, mounted at `/api/graphql`
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth (Credentials provider, one seeded admin user)
- **Styling:** Tailwind CSS 4
- **Local infrastructure:** Docker Compose (Postgres + Mailpit SMTP sandbox)

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local Postgres + Mailpit), or your own Postgres instance

## Getting started

**1. Clone the repo and install dependencies**

```bash
git clone <this-repo-url>
cd house-marketing-cms
npm install
```

**2. Set up your environment file**

```bash
cp .env.example .env
```

Then edit `.env`:
- Generate a value for `NEXTAUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  ```
- Set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` to whatever you want your local admin login to be.

**3. Start Postgres and Mailpit**

```bash
docker compose up -d
```

> If port `5432` is already in use on your machine, change the host port in
> `docker-compose.yml` (e.g. `"5433:5432"`) and update `DATABASE_URL` in `.env` to match.

**4. Set up the database**

```bash
npx prisma migrate deploy
npx prisma db seed
```

This applies the schema and creates the one seeded admin user from your `.env`.

**5. Run the app**

```bash
npm run dev
```

| | |
|---|---|
| Public site | http://localhost:3000 |
| Admin login | http://localhost:3000/admin/login |
| GraphQL API (Apollo Sandbox) | http://localhost:3000/api/graphql |
| Mailpit (test inbox) | http://localhost:8025 |

Log into the admin with the `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set in `.env`.

## Project structure

```
app/(site)/       Public marketing site — homepage, house types, news, register
app/admin/         CMS admin — login, CRUD for page content / house types / news
app/api/graphql/   Apollo Server GraphQL API
lib/graphql/       GraphQL schema and resolvers
lib/validation/     Shared validation schemas
prisma/schema.prisma  Database schema
docker-compose.yml  Local Postgres + Mailpit
```

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Browse the database in a GUI |
| `npx prisma migrate dev` | Create a new migration while developing |
