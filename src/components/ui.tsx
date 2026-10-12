"use client";

import type { ReactNode } from "react";
import { useLang } from "./LanguageProvider";

export function Logo({ compact = false }: { compact?: boolean }) {
  const { pick } = useLang();
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white text-lg shadow-sm">
        সে
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[15px] font-bold text-ink">
            Skill {pick("সেতু", "Setu")}
          </span>
          <span className="block text-[11px] text-muted">
            {pick("ক্যারিয়ার কোপাইলট", "Career Copilot")}
          </span>
        </span>
      )}
    </div>
  );
}

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center rounded-full border border-line bg-white p-0.5 text-xs font-semibold">
      <button
        onClick={() => setLang("bn")}
        className={`rounded-full px-3 py-1.5 transition ${
          lang === "bn" ? "bg-brand text-white" : "text-muted"
        }`}
      >
        বাংলা
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1.5 transition ${
          lang === "en" ? "bg-brand text-white" : "text-muted"
        }`}
      >
        EN
      </button>
    </div>
  );
}

export function AiBadge({ demo = false }: { demo?: boolean }) {
  const { pick } = useLang();
  if (demo) {
    return (
      <span className="chip bg-gold-soft text-gold">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        {pick("ডেমো মোড", "Demo mode")}
      </span>
    );
  }
  return (
    <span className="chip">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {pick("Gemini AI", "Gemini AI")}
    </span>
  );
}

export function Ring({
  value,
  size = 92,
  label,
  sub,
}: {
  value: number;
  size?: number;
  label?: string;
  sub?: string;
}) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;
  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e4eaef" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#0e9f6e"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-xl font-bold text-ink">{Math.round(clamped)}%</span>
        </div>
      </div>
      {(label || sub) && (
        <div>
          {label && <p className="font-semibold text-ink">{label}</p>}
          {sub && <p className="text-sm text-muted">{sub}</p>}
        </div>
      )}
    </div>
  );
}

export function Bar({ value, color = "var(--color-brand)" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line">
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(4, Math.min(100, value))}%`, background: color, transition: "width .5s ease" }}
      />
    </div>
  );
}

export function SectionTitle({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {sub && <p className="text-sm text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  const { pick } = useLang();
  return (
    <div className="flex items-center gap-3 text-sm text-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-brand" />
      {label ?? pick("একটু অপেক্ষা করুন…", "Please wait…")}
    </div>
  );
}

export function Empty({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="card p-6 text-center">
      <div className="text-3xl">{icon}</div>
      <p className="mt-2 font-semibold text-ink">{title}</p>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}
