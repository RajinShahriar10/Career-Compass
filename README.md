# 🌉 Paver — AI Career Copilot

> An AI career copilot for Bangladeshi youth, built inside the **MyGP** ecosystem idea.
> **Bangla-first · free · deployable on Vercel for $0.**

Paver paves the path between *education* and *employment*. It assesses a young
person's skills, then generates a personalised career roadmap that includes
**higher-education and scholarship guidance**, CV review, and mock interviews — all
powered by Google Gemini.

---

## 1. The problem

- Millions of youth enter Bangladesh's job market every year without employable skills.
- There is **no bridge** between what universities teach and what employers need.
- Good career guidance (mentoring, CV help, interview prep) is **expensive and English-first**.
- Employers can't find qualified candidates; MyGP has millions of users but is mostly used for recharge/packs/bills.

**The loop:** no skills → no job → no income → can't afford training → no job.

## 2. The solution

A mobile-first PWA that turns a confused student into a job-ready candidate:

| Step | Feature | AI technique |
|------|---------|--------------|
| 1 | Skill assessment | Rule-based scoring + track mapping |
| 2 | Personalised roadmap | Gemini LLM (structured JSON) |
| 3 | Higher education & scholarships | Gemini + curated real scholarship dataset |
| 4 | CV review & ATS score | Gemini LLM |
| 5 | Mock interview (Bangla/English) | Gemini conversation |
| 6 | Job & gig matching | Explainable skill-overlap scoring |
| 7 | AI career chat assistant | Gemini chat |

---

## 3. Tech stack (all free)

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (custom design system)
- **AI:** Google Gemini API — free tier (`gemini-2.5-flash`)
- **Database:** Neon serverless PostgreSQL (free tier) via `@neondatabase/serverless`
- **State:** React context + `localStorage`, synced to Postgres (works offline without a DB)
- **Hosting:** Vercel (free) · **Repo:** GitHub (free)

> No paid services. The app runs with **no API key** (demo mode) and **no database**
> (browser-only storage), and upgrades to full cloud persistence the moment you add them.

## 4. AI integration

- `src/lib/gemini.ts` — a tiny, dependency-free Gemini REST client.
- `src/lib/prompts.ts` — system prompts + JSON-schema-style prompt builders.
- `src/lib/fallback.ts` — offline/demo content so the product never breaks.
- API routes: `/api/roadmap`, `/api/resume`, `/api/interview`, `/api/chat`.
- If `GEMINI_API_KEY` is missing or a request fails, routes return curated
  fallback content and flag `demo: true` (shown as a badge in the UI).

## 5. Database — Neon PostgreSQL (free)

The app persists every learner's snapshot (assessment, profile, roadmap, CV review)
to **Neon serverless Postgres**.

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the **pooled connection string**.
3. Put it in `.env.local` (and in Vercel) as `DATABASE_URL`.
4. That's it — tables are created automatically on first request
   (`learners`, `saved_states`, `events`). The full schema also lives in
   [`db/schema.sql`](db/schema.sql) if you prefer to run it manually.

**How it works**

- Each browser gets a long-lived anonymous `sks_learner` cookie (HTTP-only).
- `GET /api/state` hydrates the app from Postgres; `POST /api/state` upserts it.
- The client syncs on a short debounce, and falls back to `localStorage` if Neon is
  unreachable. The dashboard shows the live sync status.
- Every generated roadmap / CV / interview answer is appended to an `events` table
  for analytics.

> Identity is anonymous for now; a real auth layer can later map `auth.users` → `learners`.

## 6. Run locally

```bash
npm install
cp .env.example .env.local   # optional: add GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

## 7. Deploy to Vercel ($0)

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected). No build settings to change.
4. Add environment variables:
   - `GEMINI_API_KEY` — from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   - `DATABASE_URL` — your Neon pooled connection string
   - *(optional)* `GEMINI_MODEL`
5. **Deploy.** Done.

## 8. Project structure

```
src/
  app/
    page.tsx            # landing
    assess/             # skill assessment quiz
    roadmap/            # AI roadmap + education + scholarships
    resume/             # AI CV review + ATS score
    interview/          # AI mock interview
    jobs/               # job & gig matching
    dashboard/          # profile, progress & cloud sync status
    api/                # Gemini + Neon route handlers
      state/            # GET/POST synced snapshot
  components/           # UI kit, app shell, providers
  lib/                  # types, data, assessment, gemini, prompts, fallback, db
db/
  schema.sql            # Neon Postgres schema
```

## 9. What's next (product phase)

- Real authentication (Neon + email magic link) for cross-device profiles.
- Live job feeds and an employer dashboard.
- Bangla voice mock interview (Web Speech API / Whisper).
- RAG over a curated free-course library.
- Deep MyGP integration (balance packs, rewards for learning milestones).

---

Built for the **GP AI Bootcamp** · 100% free to build and deploy.
