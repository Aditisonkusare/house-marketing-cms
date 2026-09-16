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
- **Email:** Nodemailer over SMTP locally (Mailpit); Resend's HTTP API in production (`RESEND_API_KEY`) — outbound SMTP is unreliable from serverless platforms, so the same `sendMail()` call uses whichever is configured
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

## Deployment

Deployed as a single app (public site + admin + GraphQL API all in one Next.js
deployable — there's no separate frontend/backend split) on free tiers, no credit
card required anywhere:

- **Hosting:** [Vercel](https://vercel.com) — import the GitHub repo, framework
  auto-detected, no custom build settings needed.
- **Database:** [Neon](https://neon.tech) — serverless Postgres. Use the **pooled**
  connection string as the runtime `DATABASE_URL` in Vercel; use the **direct**
  (unpooled) string only for one-off local `prisma migrate deploy` / `prisma db seed`
  runs against production (pgbouncer-style pooling can break the session locking
  migrations need).
- **Email:** [Resend](https://resend.com), via its **HTTP API** (not SMTP) — replaces
  the local Mailpit sandbox in production. Free tier, sandbox sender
  (`onboarding@resend.dev`), test campaigns only ever sent to the email address you
  signed up with. Raw SMTP (nodemailer) works fine locally against Mailpit but is
  unreliable from Vercel's serverless functions (outbound SMTP ports are often
  blocked/filtered — connections fail with something like "Greeting never received"),
  so `lib/mailer.ts` uses Resend's HTTP API automatically whenever `RESEND_API_KEY`
  is set, falling back to SMTP only when it isn't (i.e. local dev).

**One-time setup:**
1. Create a Neon project, copy both its pooled and direct connection strings.
2. Create a Resend account and an API key.
3. Import this repo into Vercel and set the environment variables below (Production),
   using the Neon **pooled** string for `DATABASE_URL`.
4. Deploy once to learn your real `https://…vercel.app` URL, then set `NEXTAUTH_URL`
   to that exact URL and redeploy.
5. From your local machine, run the database setup once against Neon's **direct**
   connection string:
   ```bash
   # in a shell with DATABASE_URL temporarily set to the Neon *direct* string
   npx prisma migrate deploy
   npx prisma db seed   # with real SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD set
   ```

| Variable | Production value |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string |
| `NEXTAUTH_URL` | your real `https://...vercel.app` URL |
| `NEXTAUTH_SECRET` | a fresh secret (`openssl rand -base64 32`) — don't reuse the local one |
| `RESEND_API_KEY` | your Resend API key |
| `SMTP_FROM` | `onboarding@resend.dev` |

Do **not** set `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE`/`SMTP_USER`/`SMTP_PASS` in Vercel —
those are only for local Mailpit. `RESEND_API_KEY` alone switches `lib/mailer.ts` to
Resend's HTTP API.

`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` are **not** set in Vercel — they're only
needed transiently in your local shell for the one-time seed run above.

Ongoing: pushes to `master` auto-deploy via Vercel's GitHub integration, independent
of `.github/workflows/ci.yml` (which only runs lint/build/test, not deployment).

## Sending a campaign

From the admin, register a few subscribers via the public `/register` form (your own
test addresses are fine), then go to **Campaigns → New Campaign**, write a subject and
body, optionally link a published news post, and save the draft. Open the campaign to
preview exactly what will be sent, then hit **Send Campaign** — it emails every
consented subscriber, and the same page then shows a per-recipient log
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
lib/mailer.ts          Email sender — Resend API in production, SMTP (Mailpit) locally
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
