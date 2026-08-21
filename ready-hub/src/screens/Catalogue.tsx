import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LayoutGrid, Search, SlidersHorizontal, X } from "lucide-react";
import { Brand } from "./Onboarding";
import { CourseCard } from "@/components/CourseCard";
import { WeightPanel } from "@/components/WeightPanel";
import { Button, Chip, PlatformMark } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { PLATFORMS } from "@/data/platforms";
import { LANGUAGES, type Profile } from "@/data/profile";
import { rank as rankCourses } from "@/lib/match";
import type { Weights } from "@/lib/score";
import { cn } from "@/lib/utils";

export function Catalogue({
  profile, weights, setWeights, progress, completed,
  onOpenCourse, onExplain, onEditProfile, onHome,
}: {
  profile: Profile;
  weights: Weights;
  setWeights: (w: Weights) => void;
  progress: Record<string, string[]>;
  completed: string[];
  onOpenCourse: (id: string) => void;
  onExplain: (id: string) => void;
  onEditProfile: () => void;
  onHome?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [maxHours, setMaxHours] = useState<number | null>(null);
  const [minScore, setMinScore] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  const ranked = useMemo(() => rankCourses(profile, weights), [profile, weights]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked.filter((c) => {
      if (platform && c.platformId !== platform) return false;
      if (language && !c.languages.includes(language as never)) return false;
      if (maxHours && c.minutes > maxHours * 60) return false;
      if (c.score < minScore) return false;
      if (q) {
        const hay = `${c.title} ${c.tagline} ${c.field} ${c.platformId}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [ranked, query, platform, language, maxHours, minScore]);

  const filtersOn = platform || language || maxHours || minScore > 0 || query;
  const clear = () => { setPlatform(null); setLanguage(null); setMaxHours(null); setMinScore(0); setQuery(""); };

  return (
    <div className="min-h-dvh">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-3 lg:px-8">
          <Brand onHome={onHome} />
          <div className="relative ml-auto hidden max-w-md flex-1 sm:block">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 opacity-40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search every platform…"
              aria-label="Search courses"
              className="h-11 w-full rounded-full bg-white pr-4 pl-10 text-sm shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] placeholder:opacity-40 focus:shadow-[inset_0_0_0_2px_var(--color-flow)] focus:outline-none"
            />
          </div>
          <button
            onClick={onEditProfile}
            className="ml-auto flex h-11 items-center gap-2 rounded-full bg-ink px-3.5 text-[12.5px] font-medium text-white transition-[background-color,scale] duration-150 hover:bg-ink-2 active:scale-[0.96] sm:ml-0"
          >
            <span className="hidden opacity-55 sm:inline">Editing as</span>
            <span className="max-w-[136px] truncate sm:max-w-[190px]">
              {profile.field} · {profile.level} · {profile.country}
            </span>
            <SlidersHorizontal className="size-3.5 shrink-0 opacity-70" />
          </button>
        </div>

        {/* Search, on its own row where the header has no space for it */}
        <div className="mx-auto max-w-[1400px] px-5 pb-3 sm:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 opacity-40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search every platform…"
              aria-label="Search courses"
              className="h-11 w-full rounded-full bg-white pr-4 pl-10 text-sm shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] placeholder:opacity-40 focus:shadow-[inset_0_0_0_2px_var(--color-flow)] focus:outline-none"
            />
          </div>
        </div>

        {/* Platform selector — browse one source, or search across all of them */}
        <div className="mx-auto max-w-[1400px] px-5 pb-3 lg:px-8">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
            <Chip active={platform === null} onClick={() => setPlatform(null)}>
              <LayoutGrid className="size-3.5" /> All platforms
            </Chip>
            {PLATFORMS.map((p) => (
              <Chip
                key={p.id}
                active={platform === p.id}
                onClick={() => setPlatform(platform === p.id ? null : p.id)}
                title={p.blurb}
              >
                <PlatformMark id={p.id} size={14} decorative className={platform === p.id ? "brightness-0 invert" : ""} />
                {p.name}
              </Chip>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body: courses on the left, weights on the right ────── */}
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-7 lg:grid-cols-[1fr_320px] lg:px-8">
        <main className="min-w-0">
          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={language ?? ""}
              onChange={(e) => setLanguage(e.target.value || null)}
              aria-label="Filter by language"
              className="h-9 rounded-full bg-white px-3 text-[12.5px] shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] focus:outline-none"
            >
              <option value="">Any language</option>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select
              value={maxHours ?? ""}
              onChange={(e) => setMaxHours(e.target.value ? Number(e.target.value) : null)}
              aria-label="Filter by length"
              className="h-9 rounded-full bg-white px-3 text-[12.5px] shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] focus:outline-none"
            >
              <option value="">Any length</option>
              <option value="1">Under 1 hour</option>
              <option value="3">Under 3 hours</option>
              <option value="6">Under 6 hours</option>
            </select>
            <label className="flex h-9 items-center gap-2 rounded-full bg-white px-3.5 text-[12.5px] shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)]">
              <span className="whitespace-nowrap opacity-60">Min score</span>
              <input
                type="range" min={0} max={10} step={0.5} value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                aria-label="Minimum READY Score"
                className="w-20"
                style={{ "--track": `linear-gradient(90deg,var(--color-ink) ${minScore * 10}%,var(--color-silt) ${minScore * 10}%)`, "--thumb": "var(--color-ink)" } as React.CSSProperties}
              />
              <span className="w-6 font-mono text-[12px] tabular-nums">{minScore.toFixed(1)}</span>
            </label>
            {filtersOn && (
              <button onClick={clear} className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-[12.5px] opacity-55 transition-colors hover:bg-black/5 hover:opacity-100">
                <X className="size-3.5" /> Clear
              </button>
            )}
            <span className="ml-auto font-mono text-[12px] tabular-nums opacity-45">
              {visible.length} of {ranked.length}
            </span>
          </div>

          {/* The list. layout animation is what makes re-ranking legible. */}
          <motion.div layout className="mt-4 flex flex-col gap-3">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((c, i) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  weights={weights}
                  rank={i + 1}
                  done={completed.includes(c.id)}
                  progress={(progress[c.id]?.length ?? 0) / c.lectures.length}
                  onOpen={() => onOpenCourse(c.id)}
                  onExplain={() => onExplain(c.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {visible.length === 0 && (
            <div className="mt-6 rounded-[18px] bg-white p-10 text-center shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
              <h3 className="text-lg font-bold">Nothing matches those filters yet.</h3>
              <p className="mx-auto mt-2 max-w-sm text-[13.5px] opacity-55">
                Widen the language or the length, or lower the minimum score, and the
                catalogue will fill back up.
              </p>
              <Button variant="outline" className="mt-5" onClick={clear}>Clear the filters</Button>
            </div>
          )}
        </main>

        {/* Weight panel: fixed rail on desktop, sheet on mobile */}
        <aside className="hidden lg:block">
          <div className="sticky top-[132px] rounded-[18px] bg-white p-5 shadow-[0_0_0_1px_rgb(6_39_44/0.07),0_8px_24px_-14px_rgb(6_39_44/0.18)]">
            <WeightPanel weights={weights} onChange={setWeights} />
          </div>
        </aside>
      </div>

      <Footer />

      {/* Mobile: floating control */}
      <button
        onClick={() => setPanelOpen(true)}
        className="fixed right-5 bottom-5 z-40 flex h-13 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white shadow-[0_8px_28px_-6px_rgb(6_39_44/0.5)] transition-transform duration-150 active:scale-[0.96] lg:hidden"
      >
        <SlidersHorizontal className="size-4" /> Weights
      </button>

      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPanelOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-[22px] bg-white p-6 pb-9 lg:hidden"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0 }}
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/15" />
              <WeightPanel weights={weights} onChange={setWeights} compact />
              <Button className="mt-6 w-full" onClick={() => setPanelOpen(false)}>Done</Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export { cn };
