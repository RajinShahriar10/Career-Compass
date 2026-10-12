"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLang } from "./LanguageProvider";
import { useAppData } from "./DataProvider";
import { Logo, LanguageToggle, AiBadge } from "./ui";

interface NavItem {
  href: string;
  bn: string;
  en: string;
  icon: string;
}

const NAV: NavItem[] = [
  { href: "/", bn: "হোম", en: "Home", icon: "🏠" },
  { href: "/roadmap", bn: "রোডম্যাপ", en: "Roadmap", icon: "🗺️" },
  { href: "/interview", bn: "ইন্টারভিউ", en: "Interview", icon: "🎤" },
  { href: "/jobs", bn: "চাকরি", en: "Jobs", icon: "💼" },
  { href: "/dashboard", bn: "প্রোফাইল", en: "Profile", icon: "👤" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
      <TopBar />
      <main className="flex-1 px-4 pb-28 pt-4 sm:px-6">{children}</main>
      <ChatWidget />
      <BottomNav pathname={pathname} />
    </div>
  );
}

function TopBar() {
  const { pick } = useLang();
  const { aiDemo } = useGlobalAiState();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {aiDemo !== null && <AiBadge demo={aiDemo} />}
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  const { pick } = useLang();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-stretch justify-between px-2 py-1.5">
        {NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[11px] font-semibold transition ${
                active ? "text-brand" : "text-muted"
              }`}
            >
              <span className={`text-lg ${active ? "" : "opacity-70"}`}>{item.icon}</span>
              {pick(item.bn, item.en)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Tiny global store just for the "demo mode" badge so the TopBar can show it. */
let aiDemoListener: ((demo: boolean) => void) | null = null;
let aiDemoValue: boolean | null = null;
export function setGlobalAiDemo(demo: boolean) {
  aiDemoValue = demo;
  aiDemoListener?.(demo);
}
function useGlobalAiState() {
  const [aiDemo, setLocal] = useState<boolean | null>(aiDemoValue);
  useEffect(() => {
    aiDemoListener = setLocal;
    return () => {
      aiDemoListener = null;
    };
  }, []);
  return { aiDemo };
}

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
}

function ChatWidget() {
  const { lang, pick } = useLang();
  const { roadmap, profile } = useAppData();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          lang,
          context: {
            career: roadmap?.career ?? "",
            goal: profile?.goal ?? "",
            skills: roadmap?.skillsGap?.join(", ") ?? "",
          },
        }),
      });
      const data = await res.json();
      if (typeof data.demo === "boolean") setGlobalAiDemo(data.demo);
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: pick(
            "দুঃখিত, সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
            "Sorry, something went wrong. Please try again."
          ),
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions =
    lang === "bn"
      ? ["প্রথম চাকরির জন্য কী করব?", "ফ্রিল্যান্সিং শুরু করব কীভাবে?", "স্কলারশিপ পেতে কী লাগে?"]
      : ["How do I get my first job?", "How do I start freelancing?", "What does a scholarship need?"];

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="AI assistant"
        className="fixed bottom-20 right-4 z-40 grid h-13 w-13 place-items-center rounded-full bg-brand text-white shadow-lg transition hover:bg-brand-strong sm:right-6"
        style={{ height: 52, width: 52 }}
      >
        {open ? "✕" : "✨"}
      </button>

      {open && (
        <div className="fixed bottom-36 right-3 left-3 z-40 mx-auto max-w-md animate-rise sm:left-auto sm:right-6">
          <div className="card flex max-h-[60vh] flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <p className="text-sm font-bold text-ink">
                ✨ {pick("এআই ক্যারিয়ার সহকারী", "AI Career Assistant")}
              </p>
            </div>
            <div ref={boxRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted">
                    {pick(
                      "যেকোনো ক্যারিয়ার প্রশ্ন করুন — বাংলায় উত্তর পাবেন।",
                      "Ask any career question — get answers in your language."
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setInput(s);
                        }}
                        className="chip"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-brand text-white"
                      : "bg-surface text-ink"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {busy && <p className="text-xs text-muted">…</p>}
            </div>
            <div className="flex items-center gap-2 border-t border-line p-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={pick("আপনার প্রশ্ন লিখুন…", "Type your question…")}
                className="input"
              />
              <button onClick={send} disabled={busy} className="btn btn-primary">
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
