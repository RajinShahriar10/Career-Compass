# 🌉 Skill সেতু (SkillSetu) — AI Career Copilot

> An AI career copilot for Bangladeshi youth, built inside the **MyGP** ecosystem idea.
> **Bangla-first · free · deployable on Vercel for $0.**

Skill সেতু bridges the gap between *education* and *employment*. It assesses a young
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
- **State:** React context + `localStorage` (no cost, no backend required for the MVP)
- **Hosting:** Vercel (free) · **Repo:** GitHub (free)

> No paid services. The app even runs with **no API key** using a built-in demo mode.

## 4. AI integration

- `src/lib/gemini.ts` — a tiny, dependency-free Gemini REST client.
- `src/lib/prompts.ts` — system prompts + JSON-schema-style prompt builders.
- `src/lib/fallback.ts` — offline/demo content so the product never breaks.
- API routes: `/api/roadmap`, `/api/resume`, `/api/interview`, `/api/chat`.
- If `GEMINI_API_KEY` is missing or a request fails, routes return curated
  fallback content and flag `demo: true` (shown as a badge in the UI).

## 5. Run locally

```bash
npm install
cp .env.example .env.local   # optional: add GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

## 6. Deploy to Vercel ($0)

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected). No build settings to change.
4. Add environment variable `GEMINI_API_KEY` (from
   [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)).
   Optional: `GEMINI_MODEL`.
5. **Deploy.** Done.

## 7. Project structure

```
src/
  app/
    page.tsx            # landing
    assess/             # skill assessment quiz
    roadmap/            # AI roadmap + education + scholarships
    resume/             # AI CV review + ATS score
    interview/          # AI mock interview
    jobs/               # job & gig matching
    dashboard/          # profile & progress
    api/                # Gemini-powered route handlers
  components/           # UI kit, app shell, providers
  lib/                  # types, data, assessment, gemini, prompts, fallback
```

## 8. What's next (product phase)

- Supabase auth + persistence (free tier) for cross-device profiles.
- Live job feeds and an employer dashboard.
- Bangla voice mock interview (Web Speech API / Whisper).
- RAG over a curated free-course library.
- Deep MyGP integration (balance packs, rewards for learning milestones).

---

Built for the **GP AI Bootcamp** · 100% free to build and deploy.
