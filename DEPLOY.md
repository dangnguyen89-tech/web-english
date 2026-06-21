# Deployment Checklist

Follow these steps to deploy EnglishLearn to Vercel.

## Prerequisites

Install on your machine:

- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (free)

## Step 1 — Local verification

```powershell
cd d:\AI\Web_English
npm install
copy .env.example .env.local
# Edit .env.local with your Neon DATABASE_URL and AUTH_SECRET
npx prisma migrate dev
npm run db:seed
npm run dev
```

Visit http://localhost:3000 and test register → vocabulary → quiz → progress.

## Step 2 — Push to GitHub

```powershell
git init
git add .
git commit -m "Initial English learning platform MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/web-english.git
git push -u origin main
```

## Step 3 — Create production database

1. Sign up at [neon.tech](https://neon.tech) (free tier)
2. Create a project and database
3. Copy the connection string (enable SSL)

## Step 4 — Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon production connection string |
| `AUTH_SECRET` | Run `openssl rand -base64 32` or use a random 32+ char string |
| `AUTH_URL` | `https://YOUR-APP.vercel.app` (update after first deploy) |

5. Click **Deploy**

## Step 5 — Seed production data

After first deploy succeeds:

```powershell
$env:DATABASE_URL="your-production-neon-url"
npm run db:seed
```

## Step 6 — Post-deploy test

- [ ] Landing page loads at your Vercel URL
- [ ] Register a new account
- [ ] Log in and out
- [ ] Browse vocabulary and mark a word
- [ ] Complete a quiz
- [ ] Progress page shows updated stats

## Troubleshooting

**Build fails on Prisma migrate**
- Ensure `DATABASE_URL` is set in Vercel env vars before deploy
- Check Neon allows connections from Vercel (IP allowlist off for serverless)

**Auth login fails in production**
- Set `AUTH_URL` to your exact Vercel domain (with https)
- Redeploy after changing env vars

**Empty vocabulary/quizzes**
- Run `npm run db:seed` against production DATABASE_URL
