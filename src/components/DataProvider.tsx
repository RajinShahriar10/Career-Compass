"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ResumeInput,
  ResumeReview,
  Roadmap,
  SkillProfile,
} from "@/lib/types";

interface AppState {
  answers: Record<string, string>;
  profile: SkillProfile | null;
  roadmap: Roadmap | null;
  resumeInput: ResumeInput | null;
  resumeReview: ResumeReview | null;
}

interface DataContextValue extends AppState {
  setAnswer: (questionId: string, optionId: string) => void;
  setProfile: (profile: SkillProfile | null) => void;
  setRoadmap: (roadmap: Roadmap | null) => void;
  setResumeInput: (input: ResumeInput | null) => void;
  setResumeReview: (review: ResumeReview | null) => void;
  resetAssessment: () => void;
  ready: boolean;
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
  const [state, setState] = useState<AppState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as AppState) });
    } catch {
      /* ignore corrupt state */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable */
    }
  }, [state, ready]);

  const setAnswer = useCallback((questionId: string, optionId: string) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [questionId]: optionId } }));
  }, []);

  const setProfile = useCallback((profile: SkillProfile | null) => {
    setState((s) => ({ ...s, profile }));
  }, []);

  const setRoadmap = useCallback((roadmap: Roadmap | null) => {
    setState((s) => ({ ...s, roadmap }));
  }, []);

  const setResumeInput = useCallback((resumeInput: ResumeInput | null) => {
    setState((s) => ({ ...s, resumeInput }));
  }, []);

  const setResumeReview = useCallback((resumeReview: ResumeReview | null) => {
    setState((s) => ({ ...s, resumeReview }));
  }, []);

  const resetAssessment = useCallback(() => {
    setState((s) => ({ ...s, answers: {}, profile: null, roadmap: null }));
  }, []);

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
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used inside DataProvider");
  return ctx;
}
