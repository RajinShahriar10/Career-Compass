import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { resumePrompt } from "@/lib/prompts";
import { fallbackResumeReview } from "@/lib/fallback";
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

  if (isValid(data)) {
    return NextResponse.json({
      review: {
        ...data,
        atsScore: Math.max(0, Math.min(100, Math.round(data.atsScore))),
        demo: false,
      },
    });
  }

  return NextResponse.json({ review: fallbackResumeReview() });
}
