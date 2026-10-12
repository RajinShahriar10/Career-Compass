-- ── Paver — Neon Postgres schema ────────────────────────────────────
-- Paste this into the Neon SQL Editor, or let the app auto-create it.
-- The app also runs CREATE TABLE IF NOT EXISTS on first use.

create extension if not exists "pgcrypto";

-- One row per anonymous learner (browser). A real auth system can be
-- layered on top later by linking auth.users -> learners.
create table if not exists learners (
  id          uuid primary key default gen_random_uuid(),
  language    text default 'bn',
  goal        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- The synced application snapshot (assessment, profile, roadmap, resume).
-- Keep it as JSONB so the product can evolve without migrations.
create table if not exists saved_states (
  learner_id  uuid primary key references learners(id) on delete cascade,
  state       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Append-only activity log — powers analytics / "what do learners do".
create table if not exists events (
  id          bigserial primary key,
  learner_id  uuid references learners(id) on delete cascade,
  type        text not null,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists events_learner_idx on events (learner_id, created_at desc);
create index if not exists events_type_idx on events (type);
