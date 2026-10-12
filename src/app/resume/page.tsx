"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { useAppData } from "@/components/DataProvider";
import { setGlobalAiDemo } from "@/components/AppShell";
import { AiBadge, Ring, Spinner } from "@/components/ui";
import type { ResumeInput } from "@/lib/types";

const EMPTY: ResumeInput = {
  name: "",
  targetRole: "",
  email: "",
  phone: "",
  location: "Bangladesh",
  summary: "",
  skills: "",
  education: "",
  experience: "",
  projects: "",
};

export default function ResumePage() {
  const { pick } = useLang();
  const { roadmap, profile, resumeInput, setResumeInput, resumeReview, setResumeReview } =
    useAppData();
  const [form, setForm] = useState<ResumeInput>(
    resumeInput ?? {
      ...EMPTY,
      targetRole: roadmap?.career ?? "",
      skills: roadmap?.skillsGap?.join(", ") ?? "",
    }
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  function update<K extends keyof ResumeInput>(key: K, value: ResumeInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    if (!form.targetRole.trim()) return;
    setBusy(true);
    setError(false);
    setResumeInput(form);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: form }),
      });
      const data = await res.json();
      if (!data.review) throw new Error("no review");
      setGlobalAiDemo(Boolean(data.review.demo));
      setResumeReview(data.review);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">
          📄 {pick("CV / রেজুমে রিভিউ", "CV / Resume review")}
        </h1>
        {resumeReview && <AiBadge demo={resumeReview.demo} />}
      </div>

      <div className="card p-5">
        <p className="mb-4 text-sm text-muted">
          {pick(
            "আপনার তথ্য দিন — AI বাংলা/ইংরেজিতে উন্নত CV তৈরি করবে এবং ATS স্কোর দেবে।",
            "Enter your details — AI will improve your CV and give an ATS score."
          )}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">{pick("নাম", "Name")}</label>
            <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className="label">{pick("লক্ষ্য পদ", "Target role")}</label>
            <input
              className="input"
              value={form.targetRole}
              onChange={(e) => update("targetRole", e.target.value)}
              placeholder={pick("যেমন: জুনিয়র ডেভেলপার", "e.g. Junior Developer")}
            />
          </div>
          <div>
            <label className="label">{pick("ইমেইল", "Email")}</label>
            <input className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className="label">{pick("ফোন", "Phone")}</label>
            <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
        </div>

        <div className="mt-3">
          <label className="label">{pick("দক্ষতা (কমা দিয়ে)", "Skills (comma separated)")}</label>
          <input className="input" value={form.skills} onChange={(e) => update("skills", e.target.value)} />
        </div>
        <div className="mt-3">
          <label className="label">{pick("শিক্ষা", "Education")}</label>
          <input className="input" value={form.education} onChange={(e) => update("education", e.target.value)} />
        </div>
        <div className="mt-3">
          <label className="label">{pick("অভিজ্ঞতা", "Experience")}</label>
          <textarea
            className="textarea"
            rows={3}
            value={form.experience}
            onChange={(e) => update("experience", e.target.value)}
          />
        </div>
        <div className="mt-3">
          <label className="label">{pick("প্রজেক্ট", "Projects")}</label>
          <textarea
            className="textarea"
            rows={3}
            value={form.projects}
            onChange={(e) => update("projects", e.target.value)}
          />
        </div>
        <div className="mt-3">
          <label className="label">{pick("সারসংক্ষেপ", "Summary")}</label>
          <textarea
            className="textarea"
            rows={2}
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
          />
        </div>

        <button onClick={submit} disabled={busy} className="btn btn-primary mt-4 w-full">
          {busy
            ? pick("বিশ্লেষণ করছি…", "Analyzing…")
            : pick("AI রিভিউ নিন ✨", "Get AI review ✨")}
        </button>
        {!profile && (
          <p className="mt-2 text-center text-xs text-muted">
            {pick(
              "টিপ: আগে স্কিল টেস্ট দিলে আরও ভালো ফল পাবেন।",
              "Tip: take the skill test first for better results."
            )}
          </p>
        )}
      </div>

      {busy && <Spinner label={pick("AI আপনার CV পড়ছে…", "AI is reading your CV…")} />}
      {error && (
        <p className="text-sm text-danger">
          {pick("কিছু ভুল হয়েছে, আবার চেষ্টা করুন।", "Something went wrong, try again.")}
        </p>
      )}

      {resumeReview && !busy && (
        <div className="space-y-4">
          <section className="card p-5">
            <Ring
              value={resumeReview.atsScore}
              label={pick("ATS স্কোর", "ATS score")}
              sub={pick("সফটওয়্যার-বান্ধব স্কোর", "Software-friendly score")}
            />
          </section>

          <section className="card p-5">
            <h3 className="font-bold text-ink">
              {pick("উন্নত সারসংক্ষেপ", "Improved summary")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {resumeReview.improvedSummary}
            </p>
          </section>

          {resumeReview.improvedExperience?.length > 0 && (
            <section className="card p-5">
              <h3 className="font-bold text-ink">
                {pick("উন্নত অভিজ্ঞতা / বুলেট", "Rewritten bullets")}
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {resumeReview.improvedExperience.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </section>
          )}

          {resumeReview.missingKeywords?.length > 0 && (
            <section className="card p-5">
              <h3 className="font-bold text-ink">
                {pick("যে কীওয়ার্ড নেই", "Missing keywords")}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {resumeReview.missingKeywords.map((k) => (
                  <span key={k} className="chip bg-danger-soft text-danger">
                    {k}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="card p-5">
            <h3 className="font-bold text-ink">
              {pick("উন্নতির পরামর্শ", "Suggestions")}
            </h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
              {resumeReview.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
}
