import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

/** Anonymous learner identity — a long-lived, HTTP-only cookie. */
export const LEARNER_COOKIE = "sks_learner";

const MAX_AGE = 60 * 60 * 24 * 365;

/** A cookie is only `Secure` when the request actually arrived over HTTPS. */
export function isSecureRequest(req: Request): boolean {
  const proto = req.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  try {
    return new URL(req.url).protocol === "https:";
  } catch {
    return false;
  }
}

export async function currentLearner(): Promise<{
  id: string;
  isNew: boolean;
}> {
  const jar = await cookies();
  const existing = jar.get(LEARNER_COOKIE)?.value;
  if (existing) return { id: existing, isNew: false };
  return { id: crypto.randomUUID(), isNew: true };
}

export function applyLearnerCookie(
  res: NextResponse,
  id: string,
  secure = true
): void {
  res.cookies.set(LEARNER_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure,
  });
}
