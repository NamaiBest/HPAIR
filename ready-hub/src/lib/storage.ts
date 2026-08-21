import { useCallback, useEffect, useState } from "react";

const KEY = "ready-hub.v1";

export type Persisted = {
  profile: unknown;
  weights: unknown;
  onboarded: boolean;
  /** courseId -> array of completed lecture ids */
  progress: Record<string, string[]>;
  completed: string[];
};

const EMPTY: Persisted = {
  profile: null,
  weights: null,
  onboarded: false,
  progress: {},
  completed: [],
};

function read(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

function write(v: Persisted) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* private browsing, blocked site data — the app still works, it just forgets */
  }
}

export function usePersisted() {
  const [state, setState] = useState<Persisted>(() => read());

  useEffect(() => {
    write(state);
  }, [state]);

  const patch = useCallback((p: Partial<Persisted>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  /** Functional update, for changes derived from the current value. */
  const update = useCallback((fn: (s: Persisted) => Persisted) => {
    setState(fn);
  }, []);

  const reset = useCallback(() => {
    setState(EMPTY);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { state, patch, update, reset };
}
