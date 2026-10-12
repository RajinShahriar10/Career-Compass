import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

/** True when a Neon/Postgres connection string is configured. */
export const dbReady = Boolean(connectionString);

const sql = connectionString ? neon(connectionString) : null;

const SCHEMA_STATEMENTS = [
  `create extension if not exists "pgcrypto"`,
  `create table if not exists learners (
     id uuid primary key default gen_random_uuid(),
     language text default 'bn',
     goal text,
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   )`,
  `create table if not exists saved_states (
     learner_id uuid primary key references learners(id) on delete cascade,
     state jsonb not null,
     updated_at timestamptz not null default now()
   )`,
  `create table if not exists events (
     id bigserial primary key,
     learner_id uuid references learners(id) on delete cascade,
     type text not null,
     payload jsonb not null default '{}'::jsonb,
     created_at timestamptz not null default now()
   )`,
  `create index if not exists events_learner_idx on events (learner_id, created_at desc)`,
  `create index if not exists events_type_idx on events (type)`,
];

let schemaPromise: Promise<void> | null = null;

/** Lazily create the schema once per server instance. */
export function ensureSchema(): Promise<void> {
  if (!sql) return Promise.resolve();
  if (!schemaPromise) {
    schemaPromise = (async () => {
      for (const statement of SCHEMA_STATEMENTS) {
        try {
          await sql.query(statement);
        } catch (err) {
          console.error("[db] schema statement failed:", err);
        }
      }
    })();
  }
  return schemaPromise;
}

export async function upsertLearner(
  id: string,
  language?: string,
  goal?: string
): Promise<void> {
  if (!sql) return;
  await ensureSchema();
  await sql`
    insert into learners (id, language, goal, updated_at)
    values (${id}::uuid, ${language ?? null}, ${goal ?? null}, now())
    on conflict (id) do update set
      language = coalesce(excluded.language, learners.language),
      goal = coalesce(excluded.goal, learners.goal),
      updated_at = now()
  `;
}

export async function saveState(id: string, state: unknown): Promise<void> {
  if (!sql) return;
  await ensureSchema();
  await sql`
    insert into saved_states (learner_id, state, updated_at)
    values (${id}::uuid, ${JSON.stringify(state)}::jsonb, now())
    on conflict (learner_id) do update set
      state = excluded.state,
      updated_at = now()
  `;
}

export async function loadState(id: string): Promise<unknown | null> {
  if (!sql) return null;
  await ensureSchema();
  const rows = await sql`
    select state from saved_states where learner_id = ${id}::uuid limit 1
  `;
  return rows[0]?.state ?? null;
}

export async function insertEvent(
  id: string,
  type: string,
  payload: Record<string, unknown> = {}
): Promise<void> {
  if (!sql) return;
  await ensureSchema();
  // Guarantee the parent learner row exists (events.learner_id has an FK).
  await upsertLearner(id);
  await sql`
    insert into events (learner_id, type, payload)
    values (${id}::uuid, ${type}, ${JSON.stringify(payload)}::jsonb)
  `;
}

/** Aggregate counts for a simple analytics summary. */
export async function eventSummary(): Promise<
  { type: string; count: number }[]
> {
  if (!sql) return [];
  await ensureSchema();
  const rows = await sql`
    select type, count(*)::int as count from events group by type order by count desc
  `;
  return rows as { type: string; count: number }[];
}
