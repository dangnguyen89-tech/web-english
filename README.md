# EnglishLearn — English Learning Platform

A full-stack English learning MVP built with Next.js, PostgreSQL, Prisma, and Auth.js.

## Features

- User registration and login
- Vocabulary browser with search and level filters
- Mark words as learning or known
- Interactive quizzes (multiple choice + fill-in-the-blank)
- Progress dashboard with vocabulary and quiz stats

## Tech stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend:** Next.js Route Handlers
- **Database:** PostgreSQL (Neon or Vercel Postgres)
- **ORM:** Prisma
- **Auth:** Auth.js (NextAuth v5)

## Local setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech) free tier)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Generate an auth secret:

```bash
openssl rand -base64 32
```

Set in `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host:5432/web_english?sslmode=require"
AUTH_SECRET="your-generated-secret"
AUTH_URL="http://localhost:3000"
```

### 3. Run migrations and seed

```bash
npx prisma migrate dev
npm run db:seed
```

### 4. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial English learning platform MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/web-english.git
git push -u origin main
```

### 2. Create a production database

1. Go to [Neon](https://neon.tech) or Vercel Storage → Postgres
2. Create a new database
3. Copy the connection string

### 3. Import project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   - `DATABASE_URL` — production Postgres connection string
   - `AUTH_SECRET` — same secret as local (or generate a new one)
   - `AUTH_URL` — `https://your-app.vercel.app` (set after first deploy, then redeploy)

### 4. Deploy

Vercel runs `npm run build`, which executes:

- `prisma generate`
- `prisma migrate deploy`
- `next build`

### 5. Seed production data

After the first successful deploy, run seed against production:

```bash
DATABASE_URL="your-production-url" npm run db:seed
```

Or use Neon's SQL editor to verify tables were created, then run seed from your machine.

### 6. Verify

1. Visit your Vercel URL
2. Register a new account
3. Browse vocabulary, mark words, take a quiz
4. Check progress page updates

## Project structure

```
src/
├── app/
│   ├── (auth)/login, register
│   ├── (dashboard)/dashboard, vocabulary, quizzes, progress
│   └── api/                  # REST endpoints
├── components/               # UI components
├── lib/                      # db, auth helpers, validators
└── auth.ts                   # Auth.js config
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| GET/PATCH | `/api/words` | List vocabulary |
| PATCH | `/api/words/[id]/progress` | Update word status |
| GET | `/api/quizzes` | List quizzes |
| GET | `/api/quizzes/[id]` | Get quiz questions |
| POST | `/api/quizzes/[id]/submit` | Submit and grade quiz |
| GET | `/api/progress` | User progress stats |

## License

MIT
