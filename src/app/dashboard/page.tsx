"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { useAppData } from "@/components/DataProvider";
import { Bar, Empty, Ring } from "@/components/ui";
import { trackById } from "@/lib/assessment";

const DONE_KEY = "skillsetu_done_v1";

export default function DashboardPage() {
  const { pick } = useLang();
  const { profile, roadmap, resumeReview, resetAssessment, sync } = useAppData();
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DONE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function toggle(skill: string) {
    setDone((prev) => {
      const next = prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill];
      try {
        window.localStorage.setItem(DONE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Empty
          icon="👤"
          title={pick("আপনার প্রোফাইল খালি", "Your profile is empty")}
          sub={pick(
            "স্কিল টেস্ট দিলে এখানে সব অগ্রগতি দেখতে পাবেন।",
            "Take the skill test to track all your progress here."
          )}
        />
        <Link href="/assess" className="btn btn-primary w-full">
          {pick("স্কিল টেস্ট দিন", "Take the skill test")}
        </Link>
      </div>
    );
  }

  const track = trackById(profile.tracks[0]);
  const skills = roadmap?.skillsGap ?? [];
  const progress = skills.length
    ? Math.round((skills.filter((s) => done.includes(s)).length / skills.length) * 100)
    : 0;

  const meta = [
    { l: pick("লক্ষ্য", "Goal"), v: profile.goal },
    { l: pick("সময়/সপ্তাহ", "Hours/week"), v: profile.weeklyHours },
    { l: pick("ইংরেজি", "English"), v: profile.english },
    { l: pick("ডিভাইস", "Device"), v: profile.device },
  ];

  const syncInfo = {
    synced: {
      icon: "☁️",
      title: pick("ক্লাউডে সংরক্ষিত", "Saved to cloud"),
      sub: pick("Neon PostgreSQL ডাটাবেসে সিঙ্ক করা হয়েছে", "Synced to your Neon PostgreSQL database"),
    },
    saving: {
      icon: "⏳",
      title: pick("সিঙ্ক হচ্ছে…", "Syncing…"),
      sub: pick("আপনার অগ্রগতি আপলোড হচ্ছে", "Uploading your progress"),
    },
    local: {
      icon: "💾",
      title: pick("শুধু এই ব্রাউজারে সংরক্ষিত", "Saved in this browser"),
      sub: pick("ক্লাউড সিঙ্ক চালু করতে DATABASE_URL যোগ করুন", "Add DATABASE_URL to enable cloud sync"),
    },
    error: {
      icon: "⚠️",
      title: pick("সিঙ্ক ব্যর্থ", "Sync failed"),
      sub: pick("অগ্রগতি লোকালে সংরক্ষিত আছে", "Your progress is still saved locally"),
    },
  }[sync];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">
          👤 {pick("আমার প্রোফাইল", "My profile")}
        </h1>
        <p className="text-sm text-muted">
          {pick("আপনার ক্যারিয়ার অগ্রগতির সারসংক্ষেপ", "A snapshot of your career progress")}
        </p>
      </div>

      <section className="card p-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
          {pick("লক্ষ্য পেশা", "Target career")}
        </p>
        <h2 className="text-2xl font-extrabold text-ink">
          {track.emoji} {pick(track.bn, track.en)}
        </h2>
        <div className="mt-4 flex flex-wrap gap-6">
          <Ring value={roadmap?.matchScore ?? profile.scores[track.id] ?? 75} label={pick("ক্যারিয়ার ম্যাচ", "Career match")} />
          <Ring value={resumeReview?.atsScore ?? 0} label={pick("CV স্কোর", "CV score")} />
        </div>
      </section>

      <section className="card flex items-center gap-3 p-4">
        <span className="text-xl">{syncInfo.icon}</span>
        <div>
          <p className="text-sm font-bold text-ink">{syncInfo.title}</p>
          <p className="text-xs text-muted">{syncInfo.sub}</p>
        </div>
      </section>

      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-ink">
            {pick("দক্ষতার অগ্রগতি", "Skill progress")}
          </h3>
          <span className="text-sm font-bold text-brand">{progress}%</span>
        </div>
        <Bar value={progress} />
        {skills.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {skills.map((s) => (
              <li key={s}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2">
                  <input
                    type="checkbox"
                    checked={done.includes(s)}
                    onChange={() => toggle(s)}
                    className="h-4 w-4 accent-[#0e9f6e]"
                  />
                  <span
                    className={`text-sm font-medium ${
                      done.includes(s) ? "text-muted line-through" : "text-ink"
                    }`}
                  >
                    {s}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">
            {pick("রোডম্যাপ তৈরি করলে দক্ষতার তালিকা আসবে।", "Build your roadmap to get the skill list.")}
          </p>
        )}
      </section>

      <section className="card p-5">
        <h3 className="mb-3 font-bold text-ink">{pick("প্রোফাইল", "Profile")}</h3>
        <div className="grid grid-cols-2 gap-3">
          {meta.map((m) => (
            <div key={m.l} className="rounded-lg bg-surface p-3">
              <p className="text-[11px] font-semibold text-muted">{m.l}</p>
              <p className="text-sm font-bold capitalize text-ink">{m.v}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/roadmap" className="btn btn-primary">
          🗺️ {pick("রোডম্যাপ", "Roadmap")}
        </Link>        <Link href="/resume" className="btn btn-ghost">
          📄 {pick("CV রিভিউ", "CV review")}
        </Link>
        <Link href="/interview" className="btn btn-ghost">
          🎤 {pick("মক ইন্টারভিউ", "Mock interview")}
        </Link>
        <Link href="/jobs" className="btn btn-ghost">
          💼 {pick("চাকরি", "Jobs")}
        </Link>
      </div>

      <button
        onClick={resetAssessment}
        className="btn btn-ghost w-full text-danger"
      >
        ↺ {pick("আবার স্কিল টেস্ট দিন", "Retake skill test")}
      </button>
    </div>
  );
}
