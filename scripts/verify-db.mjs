import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const tables = await sql.query(`
  select table_name from information_schema.tables
  where table_schema = 'public' order by table_name
`);
console.log("TABLES:", tables.map((t) => t.table_name).join(", ") || "(none)");

const learners = await sql`select count(*)::int as n from learners`;
const states = await sql`select count(*)::int as n from saved_states`;
const events = await sql`select count(*)::int as n from events`;
console.log("COUNTS: learners =", learners[0].n, "| saved_states =", states[0].n, "| events =", events[0].n);

const latest = await sql`
  select learner_id, jsonb_pretty(state) as state
  from saved_states order by updated_at desc limit 1
`;
if (latest[0]) {
  console.log("LATEST_STATE:", latest[0].state.slice(0, 400));
  const ev = await sql`
    select type, payload, created_at from events
    where learner_id = ${latest[0].learner_id}::uuid
    order by created_at desc limit 5
  `;
  console.log("EVENTS_FOR_LEARNER:", JSON.stringify(ev, null, 2));
}
