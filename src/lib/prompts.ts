import { trackById } from "./assessment";
import type { ResumeInput, SkillProfile } from "./types";

export const CAREER_COACH_SYSTEM = `You are "SkillSetu Career Coach", an expert career counsellor for young people in Bangladesh.
You are practical, encouraging, honest, and always focused on free or low-cost paths.
You understand the Bangladeshi job market, local salary ranges, and locally available free learning resources (10 Minute School, Programming Hero, Creative IT, Google Digital Garage, freeCodeCamp, Coursera audit, YouTube).
You always answer in the requested language. Keep advice concrete and actionable. Never invent scholarships or URLs.`;

export function roadmapPrompt(profile: SkillProfile, lang: "bn" | "en") {
  const track = trackById(profile.tracks[0]);
  return `Create a personalised career roadmap for this user.

PROFILE
- Target career track: ${track.en} (${track.bn})
- Education level: ${profile.education}
- Weekly study time: ${profile.weeklyHours}
- English level: ${profile.english}
- Device/internet: ${profile.device}
- Existing experience: ${profile.experience}
- Main goal: ${profile.goal}
- Preferred learning style: ${profile.learning}

Return ONLY a JSON object (no markdown) with exactly these fields:
{
  "career": string (English track name),
  "careerBn": string (Bangla track name),
  "summary": string (2-3 sentences, English),
  "summaryBn": string (2-3 sentences, Bangla),
  "matchScore": number (60-96),
  "skillsGap": string[] (4-6 specific skills to learn),
  "steps": [
    {
      "phase": string (1..5),
      "title": string (English phase title),
      "titleBn": string (Bangla phase title),
      "duration": string (e.g. "3-4 weeks"),
      "skills": string[] (2-3 skills for this phase),
      "resources": [ { "title": string, "provider": string, "url": string, "lang": "bn"|"en"|"both" } ],
      "milestone": string,
      "milestoneBn": string
    }
  ] (exactly 5 steps, beginner to job-ready),
  "education": [
    { "title": string, "titleBn": string, "description": string, "descriptionBn": string, "tags": string[] }
  ] (3-4 higher-education options relevant to this career, including free/online and formal degree),
  "scholarships": [
    { "name": string, "country": string, "level": string, "funding": string, "eligibility": string, "url": string }
  ] (4-6 REAL, currently existing scholarships a Bangladeshi student could apply for; prefer fully-funded and Asia/Europe options)
}

Every string must have both English and Bangla where the schema asks for "Bn". Write natural Bangla, not transliteration.
Respond in a way that respects the user's weekly time budget.`;
}

export function resumePrompt(input: ResumeInput) {
  return `Review this CV for an entry-level candidate in Bangladesh and improve it.

TARGET ROLE: ${input.targetRole}
NAME: ${input.name}
SKILLS: ${input.skills}
EDUCATION: ${input.education}
EXPERIENCE: ${input.experience}
PROJECTS: ${input.projects}
CURRENT SUMMARY: ${input.summary}

Return ONLY a JSON object:
{
  "atsScore": number (0-100),
  "improvedSummary": string (2-3 strong sentences, English),
  "improvedExperience": string[] (rewritten, achievement-focused bullet points using action verbs and numbers where possible),
  "missingKeywords": string[] (important keywords missing for the target role),
  "suggestions": string[] (4-6 concrete, prioritised fixes)
}
Be specific and honest. Do not fabricate employers or degrees.`;
}

export function interviewPrompt(
  track: string,
  turn: number,
  previous: { role: string; text: string }[],
  lang: "bn" | "en"
) {
  const convo = previous
    .map((m) => `${m.role === "interviewer" ? "Interviewer" : "Candidate"}: ${m.text}`)
    .join("\n");
  return `You are conducting a friendly mock job interview for a ${track} role in Bangladesh.
This is turn ${turn}. Ask ONE question at a time and give brief, constructive feedback on the candidate's last answer.
Speak in ${lang === "bn" ? "Bangla" : "English"}.

Conversation so far:
${convo || "(interview just started)"}

Return ONLY a JSON object:
{
  "question": string (the next interview question),
  "feedback": string (short feedback on the candidate's previous answer; empty string if none),
  "score": number (0-10 rating of the previous answer, 0 if none),
  "done": boolean (true after about 4 questions)
}
Keep it realistic but encouraging. Do not be harsh.`;
}

export function chatPrompt(
  question: string,
  context: { career?: string; goal?: string; skills?: string },
  lang: "bn" | "en"
) {
  return `User question: ${question}

User context:
- Target career: ${context.career ?? "not set"}
- Goal: ${context.goal ?? "not set"}
- Current skills: ${context.skills ?? "not set"}

Answer in ${lang === "bn" ? "Bangla" : "English"}.
Be concise (under 180 words). Give 2-4 concrete, actionable steps. Mention free resources where relevant.`;
}
