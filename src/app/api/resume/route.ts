import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { resumePrompt } from "@/lib/prompts";
import { fallbackResumeReview } from "@/lib/fallback";
import { insertEvent } from "@/lib/db";
import {
  applyLearnerCookie,
  currentLearner,
  isSecureRequest,
} from "@/lib/learner";
import type { ResumeInput, ResumeReview } from "@/lib/types";

export const maxDuration = 60;

interface Body {
  input: ResumeInput;
}

function isValid(data: ResumeReview | null): data is ResumeReview {
  return Boolean(
    data &&
      typeof data.atsScore === "number" &&
      typeof data.improvedSummary === "string" &&
      Array.isArray(data.suggestions)
  );
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const input = body.input;
  if (!input?.targetRole) {
    return NextResponse.json({ error: "Missing target role" }, { status: 400 });
  }

  const data = await generateJson<ResumeReview>(resumePrompt(input), {
    temperature: 0.5,
    maxOutputTokens: 2000,
  });

  const review: ResumeReview = isValid(data)
    ? {
        ...data,
        atsScore: Math.max(0, Math.min(100, Math.round(data.atsScore))),
        demo: false,
      }
    : fallbackResumeReview();

  const res = NextResponse.json({ review });
  try {
    const { id, isNew } = await currentLearner();
    await insertEvent(id, "resume_reviewed", {
      targetRole: input.targetRole,
      atsScore: review.atsScore,
      demo: Boolean(review.demo),
    });
    if (isNew) applyLearnerCookie(res, id, isSecureRequest(req));
  } catch (err) {
    console.error("[api/resume] logging failed", err);
  }
  return res;
}
