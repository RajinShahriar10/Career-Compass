import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { interviewPrompt } from "@/lib/prompts";
import { fallbackInterview } from "@/lib/fallback";
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
  const { career = "software", trackId = "default", turn = 0, history = [], lang = "bn" } = body;

  const data = await generateJson<InterviewResponse>(
    interviewPrompt(career, turn, history, lang),
    { temperature: 0.7, maxOutputTokens: 900 }
  );

  if (data && typeof data.question === "string" && data.question.trim()) {
    return NextResponse.json({
      result: {
        question: data.question,
        feedback: typeof data.feedback === "string" ? data.feedback : "",
        score: typeof data.score === "number" ? data.score : 0,
        done: Boolean(data.done),
        demo: false,
      },
    });
  }

  return NextResponse.json({ result: fallbackInterview(trackId, turn) });
}
