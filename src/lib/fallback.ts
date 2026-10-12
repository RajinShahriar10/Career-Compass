import { FREE_RESOURCES } from "./data";
import { trackById, recommendScholarships } from "./assessment";
import type {
  EducationOption,
  InterviewResponse,
  ResumeReview,
  Roadmap,
  RoadmapStep,
  SkillProfile,
} from "./types";

const TRACK_SKILLS: Record<string, string[]> = {
  web: ["HTML & CSS", "JavaScript", "Git & GitHub", "React", "Responsive Design", "REST APIs"],
  app: ["Dart", "Flutter Widgets", "State Management", "Firebase", "REST APIs", "App Publishing"],
  data: ["Excel", "SQL", "Python", "Pandas", "Data Visualization", "Statistics"],
  dataentry: ["Typing Speed", "MS Excel", "Google Sheets", "Data Accuracy", "Virtual Assistance"],
  marketing: ["Marketing Fundamentals", "SEO", "Facebook & Google Ads", "Analytics", "Copywriting"],
  design: ["Design Principles", "Figma", "UI Layout", "Prototyping", "Branding"],
  content: ["Writing Basics", "SEO Writing", "Research", "Editing", "Copywriting"],
  support: ["Communication", "Spoken English", "CRM Tools", "Problem Solving", "Empathy"],
  freelance: ["Skill Selection", "Fiverr & Upwork Profile", "Client Communication", "Pricing", "Delivery"],
};

const PHASES = [
  { phase: "1", title: "Foundations", titleBn: "ভিত্তি তৈরি", duration: "2–3 weeks", milestone: "Understand the basics and set up your tools.", milestoneBn: "বেসিক বুঝে ফেলুন এবং প্রয়োজনীয় টুল সেটআপ করুন।" },
  { phase: "2", title: "Core Skills", titleBn: "মূল দক্ষতা", duration: "4–6 weeks", milestone: "Complete your first guided practice exercises.", milestoneBn: "প্রথম গাইডেড প্র্যাকটিস শেষ করুন।" },
  { phase: "3", title: "Hands-on Projects", titleBn: "হাতে-কলমে প্রজেক্ট", duration: "4–5 weeks", milestone: "Build 2 real projects you can show.", milestoneBn: "২টি বাস্তব প্রজেক্ট বানান যা দেখানো যাবে।" },
  { phase: "4", title: "Portfolio & Personal Brand", titleBn: "পোর্টফোলিও ও ব্র্যান্ডিং", duration: "2–3 weeks", milestone: "Publish a portfolio and an updated CV.", milestoneBn: "পোর্টফোলিও ও নতুন CV প্রকাশ করুন।" },
  { phase: "5", title: "Job / Client Readiness", titleBn: "চাকরি / ক্লায়েন্ট রেডি", duration: "2–4 weeks", milestone: "Apply to 10 roles and pass a mock interview.", milestoneBn: "১০টি জায়গায় আবেদন করুন ও মক ইন্টারভিউ পাস করুন।" },
];

function buildEducation(profile: SkillProfile): EducationOption[] {
  const track = trackById(profile.tracks[0]);
  const options: EducationOption[] = [
    {
      title: `Bachelor's in a relevant field`,
      titleBn: `সংশ্লিষ্ট বিষয়ে স্নাতক`,
      description: `Formal degrees (e.g. CSE, BBA, Design) can open corporate doors for ${track.en}. Part-time study while you build skills.`,
      descriptionBn: `${track.bn}-এর জন্য প্রথাগত ডিগ্রি (যেমন CSE, BBA, ডিজাইন) কর্পোরেট সুযোগ বাড়ায়। স্কিল শেখার পাশাপাশি পার্ট-টাইম পড়তে পারেন।`,
      tags: ["Degree", "3–4 yrs"],
    },
    {
      title: `Diploma / Short professional certification`,
      titleBn: `ডিপ্লোমা / স্বল্পমেয়াদি পেশাগত সার্টিফিকেট`,
      description: `Fast-track diploma from a recognised institute (BTEB / IT training centre) with hands-on training.`,
      descriptionBn: `স্বীকৃত প্রতিষ্ঠান (BTEB / IT ট্রেনিং সেন্টার) থেকে দ্রুত ডিপ্লোমা ও হাতে-কলমে প্রশিক্ষণ।`,
      tags: ["Fast", "Practical"],
    },
    {
      title: `Free online certification + portfolio`,
      titleBn: `ফ্রি অনলাইন সার্টিফিকেট + পোর্টফোলিও`,
      description: `Free certificates from Google, Meta, freeCodeCamp and Coursera (audit), plus a public portfolio.`,
      descriptionBn: `Google, Meta, freeCodeCamp ও Coursera (audit) থেকে ফ্রি সার্টিফিকেট, সাথে পাবলিক পোর্টফোলিও।`,
      tags: ["Free", "Fast"],
    },
  ];
  if (profile.goal === "abroad") {
    options.push({
      title: `Study abroad (Masters / Undergrad)`,
      titleBn: `বিদেশে উচ্চশিক্ষা (মাস্টার্স / গ্র্যাজুয়েশন)`,
      description: `Fully-funded scholarships can cover tuition and living. Build academics + IELTS + a strong statement of purpose.`,
      descriptionBn: `ফুল-ফান্ডেড স্কলারশিপে টিউশন ও খরচ কভার হতে পারে। একাডেমিক ফলাফল + IELTS + শক্ত SOP তৈরি করুন।`,
      tags: ["Scholarship", "Abroad"],
    });
  }
  return options;
}

export function buildFallbackRoadmap(
  profile: SkillProfile,
  lang: "bn" | "en"
): Roadmap {
  const track = trackById(profile.tracks[0]);
  const skills = TRACK_SKILLS[track.id] ?? TRACK_SKILLS.web;
  const resources = FREE_RESOURCES[track.id] ?? FREE_RESOURCES.web;

  const steps: RoadmapStep[] = PHASES.map((p, i) => {
    const chunk = skills.slice(i * 2, i * 2 + 2);
    const picked = chunk.length ? chunk : skills.slice(0, 2);
    return {
      phase: p.phase,
      title: p.title,
      titleBn: p.titleBn,
      duration: p.duration,
      skills: picked,
      resources: resources.slice(0, i < 3 ? 2 : 1),
      milestone: p.milestone,
      milestoneBn: p.milestoneBn,
    };
  });

  return {
    career: track.en,
    careerBn: track.bn,
    summary: `A ${profile.weeklyHours === "full" ? "full-time" : "part-time"}-friendly roadmap to become a ${track.en}. It fits your ${profile.english} English level and ${profile.device} setup, ending with a job-ready portfolio.`,
    summaryBn: `${track.bn} হওয়ার একটি বাস্তবসম্মত রোডম্যাপ। এটি আপনার ইংরেজি দক্ষতা ও ডিভাইস অনুযায়ী সাজানো, শেষে থাকবে চাকরির উপযোগী পোর্টফোলিও।`,
    matchScore: profile.scores[track.id] ?? 78,
    skillsGap: skills.slice(0, 4),
    steps,
    education: buildEducation(profile),
    scholarships: recommendScholarships(profile.goal, 6),
    demo: true,
  };
}

export function fallbackResumeReview(): ResumeReview {
  return {
    atsScore: 62,
    improvedSummary:
      "Motivated entry-level professional with hands-on project experience and a growing portfolio. Quick learner, comfortable with digital tools, and ready to deliver results in a collaborative team.",
    improvedExperience: [
      "Built 2 practice projects end-to-end and published them online to demonstrate applied skills.",
      "Completed self-paced online certification in the target field with a focus on practical tasks.",
    ],
    missingKeywords: ["teamwork", "problem solving", "portfolio", "measurable result"],
    suggestions: [
      "Add numbers: hours, projects, users, or results (e.g. 'built 3 projects').",
      "Keep each bullet to one line and start with a strong action verb.",
      "Match exact keywords from the job ad so ATS software can find them.",
      "Keep the CV to one page with clean headings and no photo.",
    ],
    demo: true,
  };
}

const INTERVIEW_BANK: Record<string, { q: string; advice: string }[]> = {
  web: [
    { q: "Explain the difference between HTML, CSS and JavaScript.", advice: "Structure vs style vs behaviour — give a one-line example of each." },
    { q: "What is responsive design and why does it matter?", advice: "Mention flexible grids, media queries and mobile-first users." },
    { q: "Walk me through a project you built from scratch.", advice: "Use Problem → Approach → Result. Mention tools and what you learned." },
    { q: "How do you keep learning new web technologies?", advice: "Name concrete sources and a recent thing you built." },
  ],
  data: [
    { q: "How would you clean a messy dataset?", advice: "Mention missing values, duplicates, formats, and validation." },
    { q: "Explain a time you found an insight from data.", advice: "Use a simple STAR story with a clear takeaway." },
    { q: "What is the difference between SQL and Excel?", advice: "Scale, automation, and repeatable queries versus manual analysis." },
    { q: "How do you visualise data for non-technical people?", advice: "Simplicity, clear labels, one message per chart." },
  ],
  marketing: [
    { q: "How would you plan a Facebook campaign for a small shop?", advice: "Audience → goal → creative → budget → measure." },
    { q: "What SEO basics do you know?", advice: "Keywords, titles, content quality, mobile speed, backlinks." },
    { q: "How do you measure if a campaign worked?", advice: "Mention reach, CTR, conversions and cost per result." },
    { q: "Give an example of good content you saw recently and why.", advice: "Show you study real examples and audience psychology." },
  ],
  design: [
    { q: "Walk me through your design process.", advice: "Research → wireframe → prototype → test → iterate." },
    { q: "How do you know a design is good?", advice: "Usability, clarity, consistency, and user feedback." },
    { q: "How do you handle negative client feedback?", advice: "Listen, ask questions, revise — stay professional." },
    { q: "Which tools do you use and why?", advice: "Figma for UI, Illustrator/Photoshop for graphics — give reasons." },
  ],
  default: [
    { q: "Tell me about yourself.", advice: "30–60 seconds: who you are, your skill, and what you want." },
    { q: "Why do you want this role?", advice: "Connect the role to your skills and goals." },
    { q: "What is your biggest strength?", advice: "One strength + a short proof story." },
    { q: "Where do you see yourself in 2 years?", advice: "Show ambition that fits the company." },
  ],
};

export function fallbackInterview(
  trackId: string,
  turn: number
): InterviewResponse {
  const bank = INTERVIEW_BANK[trackId] ?? INTERVIEW_BANK.default;
  const current = bank[Math.floor(turn / 2) % bank.length];
  return {
    question: current.q,
    feedback: current.advice,
    score: 0,
    done: turn >= bank.length * 2,
    demo: true,
  };
}
