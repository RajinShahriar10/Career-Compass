"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import { useAppData } from "@/components/DataProvider";
import { setGlobalAiDemo } from "@/components/AppShell";
import { AiBadge, Empty } from "@/components/ui";

interface Msg {
  role: "interviewer" | "candidate";
  text: string;
  feedback?: string;
  score?: number;
}

export default function InterviewPage() {
  const { lang, pick } = useLang();
  const { profile, roadmap } = useAppData();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [demo, setDemo] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const career = roadmap?.career ?? "software";
  const trackId = profile?.tracks?.[0] ?? "default";

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function ask(turn: number, history: { role: string; text: string }[]) {
    setBusy(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career, trackId, turn, history, lang }),
      });
      const data = await res.json();
      const result = data.result;
      if (!result) throw new Error("no result");
      setGlobalAiDemo(Boolean(result.demo));
      setDemo(Boolean(result.demo));
      setMessages((m) => [
        ...m,
        {
          role: "interviewer",
          text: result.question,
          feedback: result.feedback,
          score: result.score,
        },
      ]);
      if (result.done) setDone(true);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "interviewer",
          text: pick("সংযোগ সমস্যা। আবার চেষ্টা করুন।", "Connection issue. Please try again."),
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function start() {
    setStarted(true);
    setDone(false);
    setMessages([]);
    ask(0, []);
  }

  function send() {
    const answer = input.trim();
    if (!answer || busy || done) return;
    const cand: Msg = { role: "candidate", text: answer };
    const history = [...messages.map((m) => ({ role: m.role, text: m.text })), cand];
    setMessages((m) => [...m, cand]);
    setInput("");
    const turn = messages.filter((m) => m.role === "interviewer").length;
    ask(turn, history);
  }

  const scored = messages.filter((m) => m.role === "interviewer" && m.score);
  const avg = scored.length
    ? Math.round((scored.reduce((a, m) => a + (m.score ?? 0), 0) / scored.length) * 10)
    : 0;

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Empty
          icon="🎤"
          title={pick("আগে স্কিল টেস্ট দিন", "Take the skill test first")}
          sub={pick(
            "আপনার লক্ষ্য পেশা অনুযায়ী AI ইন্টারভিউ নেবে।",
            "AI will interview you for your target career."
          )}
        />
        <Link href="/assess" className="btn btn-primary w-full">
          {pick("শুরু করুন", "Start")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">
          🎤 {pick("এআই মক ইন্টারভিউ", "AI mock interview")}
        </h1>
        {started && <AiBadge demo={demo} />}
      </div>

      {!started ? (
        <div className="card p-6 text-center">
          <div className="text-3xl">🤝</div>
          <h2 className="mt-2 font-bold text-ink">
            {pick("প্রস্তুত? ইন্টারভিউ শুরু করুন", "Ready? Start your interview")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {pick(
              `পদ: ${roadmap?.career ?? "সাধারণ"}। AI ৪টি প্রশ্ন করবে এবং প্রতিটি উত্তরে ফিডব্যাক দেবে।`,
              `Role: ${roadmap?.career ?? "general"}. AI will ask 4 questions and give feedback on each answer.`
            )}
          </p>
          <button onClick={start} className="btn btn-primary mt-4">
            {pick("ইন্টারভিউ শুরু করুন", "Start interview")}
          </button>
        </div>
      ) : (
        <>
          <div
            ref={boxRef}
            className="card max-h-[55vh] space-y-3 overflow-y-auto p-4"
          >
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "interviewer"
                      ? "bg-surface text-ink"
                      : "ml-auto bg-brand text-white"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "interviewer" && m.feedback && (
                  <div className="mt-1 max-w-[88%] rounded-xl border border-line bg-gold-soft/60 px-3 py-2 text-xs text-muted">
                    💡 {m.feedback}
                    {typeof m.score === "number" && m.score > 0 && (
                      <span className="ml-1 font-bold text-gold">
                        · {m.score}/10
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            {busy && <p className="text-xs text-muted">…</p>}
          </div>

          {done ? (
            <div className="card p-5 text-center">
              <p className="font-bold text-ink">
                ✅ {pick("ইন্টারভিউ সম্পন্ন!", "Interview complete!")}
              </p>
              {avg > 0 && (
                <p className="mt-1 text-3xl font-extrabold text-brand">{avg}%</p>
              )}
              <p className="text-sm text-muted">
                {pick("গড় স্কোর", "Average score")}
              </p>
              <button onClick={start} className="btn btn-ghost mt-3">
                {pick("আবার প্র্যাকটিস", "Practice again")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={pick("আপনার উত্তর লিখুন…", "Type your answer…")}
                className="input"
                disabled={busy}
              />
              <button onClick={send} disabled={busy} className="btn btn-primary">
                ➤
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
