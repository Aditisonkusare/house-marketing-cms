# Glenveagh Homes

A marketing site and custom CMS for a fictional housing development, built for the
Glenveagh Properties coding challenge. Everything the public site shows — house
types, news posts, page content — is served from a self-built CMS via a GraphQL API,
so editing content in the admin updates the live site with no code deploy.

**Status:**
- ✅ Part 1 — Public marketing site (homepage, house types, news, register form)
- ✅ Part 2 — Custom CMS (admin login, CRUD, draft/published enforcement)
- ✅ Part 3 — Email campaign tool (compose/preview/send, delivery log, unsubscribe)

## Tech stack

- **Frontend/backend:** Next.js 16 (App Router) + React 19 — one app, server-rendered
- **API:** GraphQL via Apollo Server, mounted at `/api/graphql`
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth (Credentials provider, one seeded admin user)
- **Email:** Nodemailer over SMTP (Mailpit locally; works against a real provider like Resend/Brevo by env config alone)
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

> Postgres is mapped to host port `5433` (not the default `5432`) to avoid clashing with
> any other Postgres already running on your machine. If `5433` is also taken, change the
> host port in `docker-compose.yml` and update `DATABASE_URL` in `.env` to match.

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

## Sending a campaign

From the admin, register a few subscribers via the public `/register` form (your own
test addresses are fine), then go to **Campaigns → New Campaign**, write a subject and
body, optionally link a published news post, and save the draft. Open the campaign to
preview exactly what will be sent, then hit **Send Campaign** — it emails every
consented subscriber via SMTP, and the same page then shows a per-recipient log
(sent/failed). Every email includes an unsubscribe link; clicking it revokes consent so
that subscriber is excluded from future sends. Check delivered emails at Mailpit
(`http://localhost:8025`) locally, or your real provider's inbox in production.

## Project structure

```
app/(site)/          Public marketing site — homepage, house types, news, register, unsubscribe
app/admin/            CMS admin — login, CRUD for page content / house types / news, campaigns, subscribers
app/api/graphql/      Apollo Server GraphQL API
lib/graphql/          GraphQL schema and resolvers
lib/validation/        Shared validation schemas
lib/campaigns/         Email template and campaign-send logic
lib/mailer.ts          Nodemailer/SMTP wrapper
prisma/schema.prisma   Database schema
docker-compose.yml     Local Postgres + Mailpit
```

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Browse the database in a GUI |
| `npx prisma migrate dev` | Create a new migration while developing |
