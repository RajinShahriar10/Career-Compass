"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import { useAppData } from "@/components/DataProvider";
import { Empty } from "@/components/ui";
import { matchJobs } from "@/lib/assessment";
import { JOBS } from "@/lib/data";
import type { Job } from "@/lib/data";

export default function JobsPage() {
  const { lang, pick } = useLang();
  const { profile, roadmap } = useAppData();

  const hasProfile = Boolean(profile);
  const matched = profile
    ? matchJobs(roadmap?.skillsGap ?? [], profile.tracks, 14)
    : JOBS.map((job) => ({ job, score: 0, overlaps: [] as string[] }));

  function percent(score: number) {
    return Math.min(97, 55 + score * 7);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-ink">
          💼 {pick("চাকরি ও গিগ ম্যাচিং", "Jobs & gig matching")}
        </h1>
        <p className="text-sm text-muted">
          {hasProfile
            ? pick(
                "আপনার স্কিল অনুযায়ী সাজানো।",
                "Sorted to match your skills."
              )
            : pick(
                "সব চাকরি দেখানো হচ্ছে — ব্যক্তিগত ম্যাচের জন্য স্কিল টেস্ট দিন।",
                "Showing all roles — take the skill test for personalised matches."
              )}
        </p>
      </div>

      {!hasProfile && (
        <div className="card bg-brand-soft p-4">
          <p className="text-sm font-medium text-ink">
            {pick(
              "আপনার জন্য সেরা ম্যাচ পেতে ২ মিনিটের টেস্ট দিন।",
              "Take the 2-minute test to unlock your best matches."
            )}
          </p>
          <Link href="/assess" className="btn btn-primary mt-3">
            {pick("টেস্ট দিন", "Take the test")}
          </Link>
        </div>
      )}

      {matched.length === 0 && (
        <Empty icon="🔍" title={pick("কোনো ম্যাচ নেই", "No matches yet")} />
      )}

      <div className="grid gap-3">
        {matched.map(({ job, score, overlaps }: { job: Job; score: number; overlaps: string[] }) => (
          <div key={job.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-ink">
                  {lang === "bn" ? job.titleBn : job.title}
                </p>
                <p className="text-xs text-muted">
                  {lang === "bn" ? job.typeBn : job.type} ·{" "}
                  {lang === "bn" ? job.locationBn : job.location}
                </p>
                <p className="mt-1 text-sm font-semibold text-brand">
                  {lang === "bn" ? job.salaryBn : job.salary}
                </p>
              </div>
              {hasProfile && score > 0 && (
                <div className="text-right">
                  <div className="text-lg font-extrabold text-brand">
                    {percent(score)}%
                  </div>
                  <div className="text-[10px] font-semibold text-muted">
                    {pick("ম্যাচ", "match")}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((s) => {
                const hit = overlaps.includes(s);
                return (
                  <span
                    key={s}
                    className={`chip ${
                      hit ? "bg-brand-soft text-brand-strong" : "bg-surface text-muted"
                    }`}
                  >
                    {hit ? "✓ " : ""}
                    {s}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="pb-2 text-center text-xs text-muted">
        {pick(
          "এই তালিকা ডেমো ডেটাসেট — পরে লাইভ চাকরির সোর্স যোগ করা যাবে।",
          "This list is a demo dataset — live job sources can be added later."
        )}
      </p>
    </div>
  );
}
