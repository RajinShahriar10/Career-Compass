"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import { useAppData } from "@/components/DataProvider";
import { AiBadge } from "@/components/ui";

export default function Home() {
  const { pick } = useLang();
  const { profile } = useAppData();

  const features = [
    { icon: "🧭", bn: "স্কিল অ্যাসেসমেন্ট", en: "Skill Assessment", bnSub: "আপনার জন্য কোন পথ", enSub: "Find the right path" },
    { icon: "🗺️", bn: "পার্সোনাল রোডম্যাপ", en: "Personal Roadmap", bnSub: "ধাপে ধাপে শেখা", enSub: "Step-by-step learning" },
    { icon: "🎓", bn: "উচ্চশিক্ষা ও স্কলারশিপ", en: "Higher Ed & Scholarships", bnSub: "ফুল-ফান্ডেড সুযোগ", enSub: "Fully-funded options" },
    { icon: "📄", bn: "CV / রেজুমে রিভিউ", en: "CV / Resume Review", bnSub: "ATS স্কোর সহ", enSub: "With ATS score" },
    { icon: "🎤", bn: "এআই মক ইন্টারভিউ", en: "AI Mock Interview", bnSub: "বাংলায় প্র্যাকটিস", enSub: "Practice in Bangla" },
    { icon: "💼", bn: "চাকরি ও গিগ ম্যাচিং", en: "Jobs & Gig Matching", bnSub: "স্কিল অনুযায়ী", enSub: "Matched to your skills" },
  ];

  const steps = [
    { n: "1", bn: "৮টি সহজ প্রশ্নের উত্তর দিন", en: "Answer 8 quick questions" },
    { n: "2", bn: "AI আপনার জন্য রোডম্যাপ বানায়", en: "AI builds your roadmap" },
    { n: "3", bn: "শিখুন, CV বানান, ইন্টারভিউ দিন", en: "Learn, build a CV, practice" },
    { n: "4", bn: "চাকরি বা স্কলারশিপে আবেদন করুন", en: "Apply for jobs or scholarships" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="animate-rise">
        <div className="mb-3 flex items-center gap-2">
          <AiBadge />
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {pick(
            "দক্ষতা থেকে ক্যারিয়ার — আপনার এআই কোপাইলট",
            "From skills to career — your AI copilot"
          )}
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
          {pick(
            "বাংলাদেশের তরুণদের জন্য একটি সম্পূর্ণ ফ্রি প্ল্যাটফর্ম। আপনার স্কিল বুঝে AI বানিয়ে দেবে ব্যক্তিগত রোডম্যাপ, উচ্চশিক্ষা ও স্কলারশিপের পরামর্শ, CV রিভিউ এবং মক ইন্টারভিউ — সব বাংলায়।",
            "A completely free platform for Bangladeshi youth. AI assesses your skills, then builds a personal roadmap, higher-education and scholarship guidance, CV review and mock interviews — all in Bangla."
          )}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={profile ? "/roadmap" : "/assess"} className="btn btn-primary">
            {profile
              ? pick("আমার রোডম্যাপ দেখুন", "View my roadmap")
              : pick("ফ্রি শুরু করুন", "Start free")}
          </Link>
          <Link href="/jobs" className="btn btn-ghost">
            {pick("চাকরি ব্রাউজ করুন", "Browse jobs")}
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { k: "৯", l: pick("ক্যারিয়ার ট্র্যাক", "Career tracks") },
            { k: "১৪+", l: pick("স্কলারশিপ", "Scholarships") },
            { k: "০৳", l: pick("সম্পূর্ণ ফ্রি", "Totally free") },
          ].map((s) => (
            <div key={s.k} className="card p-3 text-center">
              <div className="text-xl font-extrabold text-brand">{s.k}</div>
              <div className="text-[11px] font-medium text-muted">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="card p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-danger">
          {pick("যে সমস্যাটি সমাধান করছি", "The problem we solve")}
        </p>
        <h2 className="mt-1 text-lg font-bold text-ink">
          {pick("স্কিল নেই → চাকরি নেই → আয় নেই", "No skills → no job → no income")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {pick(
            "প্রতি বছর লাখো তরুণ চাকরির বাজারে আসে, কিন্তু কারিগরি দক্ষতা ও গাইডেন্সের অভাবে পিছিয়ে পড়ে। শিক্ষা ও চাকরির মধ্যে সেতু নেই — আর ভালো পরামর্শ কেবল ধনীদের নাগালে।",
            "Every year millions of youth enter the job market, but fall behind without practical skills and guidance. There is no bridge between education and employment — and good advice is only available to those who can pay."
          )}
        </p>
      </section>

      {/* How it works */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">
          {pick("কীভাবে কাজ করে", "How it works")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {steps.map((s) => (
            <div key={s.n} className="card flex items-start gap-3 p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-strong">
                {s.n}
              </span>
              <p className="pt-1 text-sm font-medium text-ink">
                {pick(s.bn, s.en)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">
          {pick("যা যা পাবেন", "What you get")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.en} className="card p-4">
              <div className="text-2xl">{f.icon}</div>
              <p className="mt-2 font-bold text-ink">{pick(f.bn, f.en)}</p>
              <p className="text-sm text-muted">{pick(f.bnSub, f.enSub)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card bg-brand-soft p-5 text-center">
        <h2 className="text-lg font-bold text-ink">
          {pick("আজই শুরু করুন — কোনো খরচ নেই", "Start today — it costs nothing")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {pick(
            "মাত্র ২ মিনিটে আপনার ক্যারিয়ার পথ জানুন।",
            "Know your career path in just 2 minutes."
          )}
        </p>
        <Link href="/assess" className="btn btn-primary mt-4">
          {pick("স্কিল টেস্ট দিন", "Take the skill test")}
        </Link>
      </section>
    </div>
  );
}
