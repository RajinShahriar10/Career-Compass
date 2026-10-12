import { TRACKS, JOBS, SCHOLARSHIPS } from "./data";
import type { SkillProfile } from "./types";
import { QUESTIONS } from "./data";

const CATEGORY_TRACKS: Record<string, string[]> = {
  tech: ["web", "app"],
  design: ["design"],
  business: ["marketing", "freelance"],
  data: ["data", "dataentry"],
  people: ["support"],
  content: ["content"],
};

export interface RecommendResult {
  profile: SkillProfile;
  primaryTrack: string;
  alternatives: string[];
}

function levelFromExperience(exp: string): number {
  if (exp === "confident") return 3;
  if (exp === "some") return 2;
  return 1;
}

export function buildProfile(
  answers: Record<string, string>
): RecommendResult {
  const category = answers.interest || "tech";
  const direct = CATEGORY_TRACKS[category] ?? ["web"];
  const byDemand = TRACKS.filter((t) => t.demand === "High").map((t) => t.id);
  const ranked = [...new Set([...direct, ...byDemand, "freelance"])].slice(0, 4);

  const level = levelFromExperience(answers.experience || "none");
  const goalBoost: Record<string, number> = {
    "first-job": 1,
    upgrade: 2,
    freelance: 2,
    abroad: 1,
    business: 2,
  };

  const scores: Record<string, number> = {};
  ranked.forEach((id, i) => {
    scores[id] = Math.max(50, 92 - i * 8 + level * 3 + (goalBoost[answers.goal] ?? 0));
  });

  const profile: SkillProfile = {
    interests: [category],
    category,
    education: answers.education || "other",
    weeklyHours: answers.hours || "mid",
    english: answers.english || "medium",
    device: answers.device || "phone",
    experience: answers.experience || "none",
    goal: answers.goal || "first-job",
    learning: answers.learning || "video",
    scores,
    tracks: ranked,
  };

  return {
    profile,
    primaryTrack: ranked[0],
    alternatives: ranked.slice(1),
  };
}

export function trackById(id: string) {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0];
}

/** Simple, explainable skill-overlap matching (no AI cost). */
export function matchJobs(skills: string[], trackIds: string[], limit = 6) {
  const normalized = skills.map((s) => s.toLowerCase().trim()).filter(Boolean);
  const scored = JOBS.map((job) => {
    let score = 0;
    const overlaps: string[] = [];
    for (const s of job.skills) {
      if (normalized.some((n) => s.toLowerCase().includes(n) || n.includes(s.toLowerCase()))) {
        score += 2;
        overlaps.push(s);
      }
    }
    if (trackIds.includes(job.track)) score += 3;
    return { job, score, overlaps };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function recommendScholarships(goal: string, limit = 6) {
  const ranked =
    goal === "abroad"
      ? [...SCHOLARSHIPS].sort((a, b) => {
          const aAsia = /Japan|China|Korea|Hungary|Türkiye/.test(a.country) ? 1 : 0;
          const bAsia = /Japan|China|Korea|Hungary|Türkiye/.test(b.country) ? 1 : 0;
          return bAsia - aAsia;
        })
      : SCHOLARSHIPS;
  return ranked.slice(0, limit);
}

export function questionById(id: string) {
  return QUESTIONS.find((q) => q.id === id);
}
