import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { interviewPrompt } from "@/lib/prompts";
import { fallbackInterview } from "@/lib/fallback";
import { insertEvent } from "@/lib/db";
import { applyLearnerCookie, currentLearner } from "@/lib/learner";
import type { InterviewResponse, Lang } from "@/lib/types";

export const maxDuration = 60;

interface Body {
  career: string;
  trackId?: string;
  turn: number;
  history: { role: "interviewer" | "candidate"; text: string }[];
  lang: Lang;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const {
    career = "software",
    trackId = "default",
    turn = 0,
    history = [],
    lang = "bn",
  } = body;

  const data = await generateJson<InterviewResponse>(
    interviewPrompt(career, turn, history, lang),
    { temperature: 0.7, maxOutputTokens: 900 }
  );

  const result: InterviewResponse =
    data && typeof data.question === "string" && data.question.trim()
      ? {
          question: data.question,
          feedback: typeof data.feedback === "string" ? data.feedback : "",
          score: typeof data.score === "number" ? data.score : 0,
          done: Boolean(data.done),
          demo: false,
        }
      : fallbackInterview(trackId, turn);

  const res = NextResponse.json({ result });
  try {
    const { id, isNew } = await currentLearner();
    await insertEvent(id, "interview_turn", {
      career,
      trackId,
      turn,
      score: result.score,
      demo: Boolean(result.demo),
    });
    if (isNew) applyLearnerCookie(res, id);
  } catch (err) {
    console.error("[api/interview] logging failed", err);
  }
  return res;
}
