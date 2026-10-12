import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { CAREER_COACH_SYSTEM, roadmapPrompt } from "@/lib/prompts";
import { buildFallbackRoadmap } from "@/lib/fallback";
import { recommendScholarships, trackById } from "@/lib/assessment";
import { insertEvent } from "@/lib/db";
import { applyLearnerCookie, currentLearner } from "@/lib/learner";
import type { Lang, Roadmap, SkillProfile } from "@/lib/types";

export const maxDuration = 60;

interface Body {
  profile: SkillProfile;
  lang: Lang;
}

function normalize(data: Roadmap, profile: SkillProfile): Roadmap {
  const track = trackById(profile.tracks[0]);
  return {
    career: data.career || track.en,
    careerBn: data.careerBn || track.bn,
    summary: data.summary || "",
    summaryBn: data.summaryBn || "",
    matchScore:
      typeof data.matchScore === "number"
        ? Math.max(40, Math.min(98, data.matchScore))
        : profile.scores[track.id] ?? 80,
    skillsGap: Array.isArray(data.skillsGap) ? data.skillsGap.slice(0, 6) : [],
    steps: Array.isArray(data.steps) ? data.steps.slice(0, 6) : [],
    education: Array.isArray(data.education) ? data.education.slice(0, 5) : [],
    scholarships: Array.isArray(data.scholarships)
      ? data.scholarships.slice(0, 8)
      : [],
    demo: false,
  };
}

function isValid(data: Roadmap | null): data is Roadmap {
  return Boolean(
    data &&
      Array.isArray(data.steps) &&
      data.steps.length >= 3 &&
      Array.isArray(data.education) &&
      data.education.length >= 1
  );
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { profile, lang = "bn" } = body;
  if (!profile?.tracks?.length) {
    return NextResponse.json({ error: "Missing profile" }, { status: 400 });
  }

  const data = await generateJson<Roadmap>(roadmapPrompt(profile, lang), {
    system: CAREER_COACH_SYSTEM,
    temperature: 0.6,
    maxOutputTokens: 4096,
  });

  let roadmap: Roadmap;
  if (isValid(data)) {
    roadmap = normalize(data, profile);
    if (roadmap.scholarships.length === 0) {
      roadmap.scholarships = recommendScholarships(profile.goal, 6);
    }
  } else {
    roadmap = buildFallbackRoadmap(profile, lang);
  }

  const res = NextResponse.json({ roadmap });
  try {
    const { id, isNew } = await currentLearner();
    await insertEvent(id, "roadmap_generated", {
      career: roadmap.career,
      trackId: profile.tracks[0],
      demo: Boolean(roadmap.demo),
    });
    if (isNew) applyLearnerCookie(res, id);
  } catch (err) {
    console.error("[api/roadmap] logging failed", err);
  }
  return res;
}
