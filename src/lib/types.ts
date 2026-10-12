export type Lang = "bn" | "en";

export interface AssessmentAnswer {
  questionId: string;
  optionId: string;
}

export interface SkillProfile {
  interests: string[];
  category: string;
  education: string;
  weeklyHours: string;
  english: string;
  device: string;
  experience: string;
  goal: string;
  learning: string;
  scores: Record<string, number>;
  tracks: string[];
}

export interface Resource {
  title: string;
  provider: string;
  url: string;
  lang: "bn" | "en" | "both";
}

export interface RoadmapStep {
  phase: string;
  title: string;
  titleBn: string;
  duration: string;
  skills: string[];
  resources: Resource[];
  milestone: string;
  milestoneBn: string;
}

export interface EducationOption {
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  tags: string[];
}

export interface Scholarship {
  name: string;
  country: string;
  level: string;
  funding: string;
  eligibility: string;
  url: string;
}

export interface Roadmap {
  career: string;
  careerBn: string;
  summary: string;
  summaryBn: string;
  matchScore: number;
  skillsGap: string[];
  steps: RoadmapStep[];
  education: EducationOption[];
  scholarships: Scholarship[];
  demo?: boolean;
}

export interface ResumeInput {
  name: string;
  targetRole: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  projects: string;
}

export interface ResumeReview {
  atsScore: number;
  improvedSummary: string;
  improvedExperience: string[];
  missingKeywords: string[];
  suggestions: string[];
  demo?: boolean;
}

export interface InterviewTurn {
  role: "interviewer" | "candidate";
  text: string;
  score?: number;
  feedback?: string;
}

export interface InterviewResponse {
  question: string;
  feedback: string;
  score: number;
  done: boolean;
  demo?: boolean;
}
