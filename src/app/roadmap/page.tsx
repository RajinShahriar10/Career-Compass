"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { useAppData } from "@/components/DataProvider";
import { setGlobalAiDemo } from "@/components/AppShell";
import { AiBadge, Empty, Ring, Spinner } from "@/components/ui";
import { trackById } from "@/lib/assessment";
import type { SkillProfile } from "@/lib/types";

export default function RoadmapPage() {
  const { lang, pick } = useLang();
  const { profile, roadmap, setRoadmap } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(
    async (p: SkillProfile) => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch("/api/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: p, lang }),
        });
        const data = await res.json();
        if (!data.roadmap) throw new Error("no roadmap");
        setGlobalAiDemo(Boolean(data.roadmap.demo));
        setRoadmap(data.roadmap);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [lang, setRoadmap]
  );

  useEffect(() => {
    if (profile && !roadmap && !loading) load(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, roadmap]);

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Empty
          icon="🧭"
          title={pick("প্রথমে স্কিল টেস্ট দিন", "Take the skill test first")}
          sub={pick(
            "৮টি প্রশ্নের উত্তর দিলেই AI আপনার রোডম্যাপ বানাবে।",
            "Answer 8 questions and AI will build your roadmap."
          )}
        />
        <Link href="/assess" className="btn btn-primary w-full">
          {pick("শুরু করুন", "Start")}
        </Link>
      </div>
    );
  }

  const activeTrack = trackById(profile.tracks[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">
          {pick("আপনার ক্যারিয়ার রোডম্যাপ", "Your career roadmap")}
        </h1>
        {roadmap && <AiBadge demo={roadmap.demo} />}
      </div>

      {loading && (
        <div className="card p-6">
          <Spinner
            label={pick(
              "AI আপনার রোডম্যাপ তৈরি করছে…",
              "AI is building your roadmap…"
            )}
          />
        </div>
      )}

      {error && !loading && (
        <div className="card p-5">
          <p className="text-sm text-danger">
            {pick("রোডম্যাপ লোড করা যায়নি।", "Could not load the roadmap.")}
          </p>
          <button onClick={() => load(profile)} className="btn btn-ghost mt-3">
            {pick("আবার চেষ্টা করুন", "Try again")}
          </button>
        </div>
      )}

      {roadmap && !loading && (
        <>
          <section className="card animate-rise p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
                  {pick("লক্ষ্য পেশা", "Target career")}
                </p>
                <h2 className="text-2xl font-extrabold text-ink">
                  {lang === "bn" ? roadmap.careerBn : roadmap.career}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {activeTrack.emoji} {pick(activeTrack.salaryBn, activeTrack.salary)}
                </p>
              </div>
              <Ring value={roadmap.matchScore} sub={pick("ম্যাচ", "match")} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {lang === "bn" ? roadmap.summaryBn : roadmap.summary}
            </p>
            {roadmap.skillsGap.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {roadmap.skillsGap.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Steps */}
          <section>
            <h3 className="mb-3 text-lg font-bold text-ink">
              {pick("শেখার ধাপ", "Learning phases")}
            </h3>
            <ol className="space-y-3">
              {roadmap.steps.map((step) => (
                <li key={step.phase} className="card p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                      {step.phase}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-ink">
                        {lang === "bn" ? step.titleBn : step.title}
                      </p>
                      <p className="text-xs text-muted">
                        ⏱ {step.duration} ·{" "}
                        {step.skills.join(" · ")}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    🎯 {lang === "bn" ? step.milestoneBn : step.milestone}
                  </p>
                  {step.resources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {step.resources.map((r, i) => (
                        <a
                          key={i}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="chip"
                        >
                          📚 {r.title} · {r.provider}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* Higher education */}
          {roadmap.education.length > 0 && (
            <section>
              <h3 className="mb-3 text-lg font-bold text-ink">
                🎓 {pick("উচ্চশিক্ষার পথ", "Higher-education paths")}
              </h3>
              <div className="grid gap-3">
                {roadmap.education.map((e, i) => (
                  <div key={i} className="card p-4">
                    <p className="font-bold text-ink">
                      {lang === "bn" ? e.titleBn : e.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {lang === "bn" ? e.descriptionBn : e.description}
                    </p>
                    {e.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {e.tags.map((t) => (
                          <span key={t} className="chip bg-accent-soft text-accent">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Scholarships */}
          {roadmap.scholarships.length > 0 && (
            <section>
              <h3 className="mb-3 text-lg font-bold text-ink">
                🏅 {pick("স্কলারশিপ সুযোগ", "Scholarship opportunities")}
              </h3>
              <div className="grid gap-3">
                {roadmap.scholarships.map((s, i) => (
                  <div key={i} className="card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-ink">{s.name}</p>
                        <p className="text-xs text-muted">
                          {s.country} · {s.level}
                        </p>
                      </div>
                      <span className="chip bg-gold-soft text-gold">
                        {s.funding}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted">✅ {s.eligibility}</p>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-brand"
                    >
                      {pick("বিস্তারিত দেখুন", "Learn more")} →
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/resume" className="btn btn-ghost">
              📄 {pick("CV রিভিউ", "CV review")}
            </Link>
            <Link href="/interview" className="btn btn-ghost">
              🎤 {pick("মক ইন্টারভিউ", "Mock interview")}
            </Link>
            <Link href="/jobs" className="btn btn-ghost">
              💼 {pick("চাকরি", "Jobs")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
