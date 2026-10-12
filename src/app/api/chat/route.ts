import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { CAREER_COACH_SYSTEM, chatPrompt } from "@/lib/prompts";
import type { Lang } from "@/lib/types";

export const maxDuration = 60;

interface Body {
  question: string;
  lang: Lang;
  context?: { career?: string; goal?: string; skills?: string };
}

function fallbackAnswer(question: string, lang: Lang): string {
  const q = question.toLowerCase();
  if (lang === "bn") {
    if (q.includes("ফ্রিল্যান্স") || q.includes("freelanc"))
      return "শুরু করতে: ১) একটি নির্দিষ্ট স্কিল বেছে নিন (যেমন ডিজাইন বা রাইটিং)। ২) Fiverr/Upwork-এ প্রোফাইল খুলে ৩টি নমুনা কাজ দিন। ৩) ছোট অর্ডার দিয়ে রিভিউ নিন। বিনামূল্যে শেখার জন্য 10 Minute School ও Upwork Academy দেখুন।";
    if (q.includes("স্কলারশিপ") || q.includes("scholar"))
      return "ফুল-ফান্ডেড স্কলারশিপের জন্য প্রয়োজন: ভালো একাডেমিক ফলাফল, IELTS/TOEFL, একটি শক্ত SOP এবং সময়মতো আবেদন। চেক করুন Chevening, DAAD, MEXT, GKS ও Stipendium Hungaricum। ‘রোডম্যাপ’ পেজে স্কলারশিপ তালিকা আছে।";
    return `আপনার প্রশ্ন: “${question}”। পরামর্শ: ১) আপনার লক্ষ্য পরিষ্কার করুন। ২) ‘শুরু করুন’ থেকে স্কিল টেস্ট দিন। ৩) রোডম্যাপ অনুযায়ী প্রতি সপ্তাহে ৫–১০ ঘণ্টা প্র্যাকটিস করুন। ৪) ২টি প্রজেক্ট বানিয়ে পোর্টফোলিও বানান।`;
  }
  if (q.includes("freelanc"))
    return "To start: 1) Pick one skill (e.g. design or writing). 2) Create a Fiverr/Upwork profile with 3 sample works. 3) Take small orders to earn reviews. Learn free via 10 Minute School and Upwork Academy.";
  if (q.includes("scholar"))
    return "For a fully-funded scholarship you need strong academics, IELTS/TOEFL, a solid SOP, and on-time applications. Try Chevening, DAAD, MEXT, GKS and Stipendium Hungaricum. See the full list on the Roadmap page.";
  return `Your question: “${question}”. Advice: 1) Clarify your goal. 2) Take the skill assessment from Home. 3) Practise 5–10 hours a week following your roadmap. 4) Build 2 projects into a portfolio.`;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ answer: "Invalid request", demo: true }, { status: 400 });
  }
  const { question, lang = "bn", context = {} } = body;
  if (!question?.trim()) {
    return NextResponse.json({ answer: "", demo: true }, { status: 400 });
  }

  const text = await generateText(chatPrompt(question, context, lang), {
    system: CAREER_COACH_SYSTEM,
    temperature: 0.6,
    maxOutputTokens: 700,
  });

  if (!text) {
    return NextResponse.json({ answer: fallbackAnswer(question, lang), demo: true });
  }
  return NextResponse.json({ answer: text, demo: false });
}
