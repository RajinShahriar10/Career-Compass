import { NextResponse } from "next/server";
import { dbReady, loadState, saveState, upsertLearner } from "@/lib/db";
import { applyLearnerCookie, currentLearner } from "@/lib/learner";

export const maxDuration = 30;

interface StateBody {
  state: unknown;
  language?: string;
  goal?: string;
}

/** Load the synced snapshot for this learner (or report that DB is off). */
export async function GET() {
  if (!dbReady) {
    return NextResponse.json({ configured: false, state: null });
  }
  try {
    const { id, isNew } = await currentLearner();
    const state = await loadState(id);
    const res = NextResponse.json({ configured: true, state });
    if (isNew) applyLearnerCookie(res, id);
    return res;
  } catch (err) {
    console.error("[api/state] GET failed", err);
    return NextResponse.json({ configured: true, state: null, error: true });
  }
}

/** Upsert the snapshot for this learner. */
export async function POST(req: Request) {
  if (!dbReady) {
    return NextResponse.json({ configured: false, saved: false });
  }
  let body: StateBody;
  try {
    body = (await req.json()) as StateBody;
  } catch {
    return NextResponse.json({ configured: true, saved: false }, { status: 400 });
  }

  const { id, isNew } = await currentLearner();
  try {
    await upsertLearner(id, body.language, body.goal);
    await saveState(id, body.state ?? {});
    const res = NextResponse.json({ configured: true, saved: true });
    if (isNew) applyLearnerCookie(res, id);
    return res;
  } catch (err) {
    console.error("[api/state] POST failed", err);
    const res = NextResponse.json({ configured: true, saved: false, error: true });
    if (isNew) applyLearnerCookie(res, id);
    return res;
  }
}
