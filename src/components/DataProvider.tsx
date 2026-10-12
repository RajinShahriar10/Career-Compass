"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLang } from "./LanguageProvider";
import type {
  ResumeInput,
  ResumeReview,
  Roadmap,
  SkillProfile,
} from "@/lib/types";

export type SyncStatus = "local" | "synced" | "saving" | "error";

interface AppState {
  answers: Record<string, string>;
  profile: SkillProfile | null;
  roadmap: Roadmap | null;
  resumeInput: ResumeInput | null;
  resumeReview: ResumeReview | null;
  updatedAt?: number;
}

interface DataContextValue extends AppState {
  setAnswer: (questionId: string, optionId: string) => void;
  setProfile: (profile: SkillProfile | null) => void;
  setRoadmap: (roadmap: Roadmap | null) => void;
  setResumeInput: (input: ResumeInput | null) => void;
  setResumeReview: (review: ResumeReview | null) => void;
  resetAssessment: () => void;
  ready: boolean;
  sync: SyncStatus;
}

const KEY = "skillsetu_state_v1";

const EMPTY: AppState = {
  answers: {},
  profile: null,
  roadmap: null,
  resumeInput: null,
  resumeReview: null,
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  const [state, setState] = useState<AppState>(EMPTY);
  const [ready, setReady] = useState(false);
  const [sync, setSync] = useState<SyncStatus>("local");
  const langRef = useRef(lang);
  langRef.current = lang;

  const update = useCallback(
    (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
      setState((s) => ({
        ...s,
        ...(typeof patch === "function" ? patch(s) : patch),
        updatedAt: Date.now(),
      }));
    },
    []
  );

  const setAnswer = useCallback(
    (questionId: string, optionId: string) =>
      update((s) => ({ answers: { ...s.answers, [questionId]: optionId } })),
    [update]
  );

  const setProfile = useCallback(
    (profile: SkillProfile | null) => update({ profile }),
    [update]
  );
  const setRoadmap = useCallback(
    (roadmap: Roadmap | null) => update({ roadmap }),
    [update]
  );
  const setResumeInput = useCallback(
    (resumeInput: ResumeInput | null) => update({ resumeInput }),
    [update]
  );
  const setResumeReview = useCallback(
    (resumeReview: ResumeReview | null) => update({ resumeReview }),
    [update]
  );
  const resetAssessment = useCallback(
    () => update({ answers: {}, profile: null, roadmap: null }),
    [update]
  );

  /* ── load local + hydrate from Neon ─────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    let local: AppState = EMPTY;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) local = { ...EMPTY, ...(JSON.parse(raw) as AppState) };
    } catch {
      /* ignore */
    }
    setState(local);

    (async () => {
      try {
        const res = await fetch("/api/state", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (!data.configured) {
          setSync("local");
        } else {
          const serverState = data.state as AppState | null;
          const serverAt = serverState?.updatedAt ?? 0;
          const localAt = local.updatedAt ?? 0;
          if (serverState && serverAt >= localAt) {
            setState({ ...EMPTY, ...serverState });
          } else {
            await fetch("/api/state", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                state: local,
                language: langRef.current,
                goal: local.profile?.goal,
              }),
            });
          }
          setSync("synced");
        }
      } catch {
        if (!cancelled) setSync("local");
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── persist locally + debounced sync up ────────────────────── */
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    if (sync === "local") return;

    const timer = setTimeout(async () => {
      setSync("saving");
      try {
        const res = await fetch("/api/state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state,
            language: langRef.current,
            goal: state.profile?.goal,
          }),
        });
        const data = await res.json();
        setSync(data.saved ? "synced" : "local");
      } catch {
        setSync("error");
      }
    }, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, ready]);

  const value = useMemo(
    () => ({
      ...state,
      setAnswer,
      setProfile,
      setRoadmap,
      setResumeInput,
      setResumeReview,
      resetAssessment,
      ready,
      sync,
    }),
    [
      state,
      setAnswer,
      setProfile,
      setRoadmap,
      setResumeInput,
      setResumeReview,
      resetAssessment,
      ready,
      sync,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used inside DataProvider");
  return ctx;
}
