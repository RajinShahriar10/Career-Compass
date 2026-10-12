import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

/** Anonymous learner identity — a long-lived, HTTP-only cookie. */
export const LEARNER_COOKIE = "sks_learner";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  secure: process.env.NODE_ENV === "production",
};

export async function currentLearner(): Promise<{
  id: string;
  isNew: boolean;
}> {
  const jar = await cookies();
  const existing = jar.get(LEARNER_COOKIE)?.value;
  if (existing) return { id: existing, isNew: false };
  return { id: crypto.randomUUID(), isNew: true };
}

export function applyLearnerCookie(res: NextResponse, id: string): void {
  res.cookies.set(LEARNER_COOKIE, id, COOKIE_OPTIONS);
}
