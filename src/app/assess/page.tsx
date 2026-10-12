"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { useAppData } from "@/components/DataProvider";
import { QUESTIONS } from "@/lib/data";
import { buildProfile } from "@/lib/assessment";
import { Bar } from "@/components/ui";

export default function AssessPage() {
  const { lang, pick } = useLang();
  const router = useRouter();
  const { answers, setAnswer, setProfile, setRoadmap } = useAppData();
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);

  const question = QUESTIONS[index];
  const selected = answers[question.id];
  const progress = useMemo(
    () => Math.round((index / QUESTIONS.length) * 100),
    [index]
  );

  function choose(optionId: string) {
    setAnswer(question.id, optionId);
    if (index < QUESTIONS.length - 1) {
      setTimeout(() => setIndex((i) => i + 1), 140);
    }
  }

  async function finish() {
    setBusy(true);
    const { profile } = buildProfile(answers);
    setRoadmap(null);
    setProfile(profile);
    router.push("/roadmap");
  }

  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-muted">
        <span>
          {pick("প্রশ্ন", "Question")} {index + 1}/{QUESTIONS.length}
        </span>
        <span>{progress}%</span>
      </div>
      <Bar value={progress} />

      <div className="card mt-5 animate-rise p-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
          {pick("স্কিল অ্যাসেসমেন্ট", "Skill assessment")}
        </p>
        <h1 className="mt-1 text-xl font-bold leading-snug text-ink">
          {lang === "bn" ? question.bn : question.en}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {lang === "bn" ? question.hintBn : question.hintEn}
        </p>

        <div className="mt-4 grid gap-2">
          {question.options.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => choose(opt.id)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "border-brand bg-brand-soft text-brand-strong"
                    : "border-line bg-white text-ink hover:border-brand/60"
                }`}
              >
                <span>{lang === "bn" ? opt.bn : opt.en}</span>
                {active && <span className="text-brand">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="btn btn-ghost"
          >
            ← {pick("পেছনে", "Back")}
          </button>

          {index < QUESTIONS.length - 1 ? (
            <button
              onClick={() => setIndex((i) => Math.min(QUESTIONS.length - 1, i + 1))}
              disabled={!selected}
              className="btn btn-primary"
            >
              {pick("পরবর্তী", "Next")} →
            </button>
          ) : (
            <button onClick={finish} disabled={!allAnswered || busy} className="btn btn-primary">
              {busy
                ? pick("তৈরি হচ্ছে…", "Building…")
                : pick("রোডম্যাপ তৈরি করুন ✨", "Build my roadmap ✨")}
            </button>
          )}
        </div>
      </div>

      {index === QUESTIONS.length - 1 && !allAnswered && (
        <p className="mt-3 text-center text-xs text-muted">
          {pick(
            "সব প্রশ্নের উত্তর দিতে 'পেছনে' গিয়ে বাকিগুলো সম্পন্ন করুন।",
            "Some questions are unanswered — go Back to complete them."
          )}
        </p>
      )}
    </div>
  );
}
