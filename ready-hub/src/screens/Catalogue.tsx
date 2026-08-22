import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, LayoutGrid, Search, X } from "lucide-react";
import { Brand } from "@/components/Brand";
import { LangToggle } from "@/components/LangToggle";
import { ScoringDropdown } from "@/components/ScoringDropdown";
import { CourseCard } from "@/components/CourseCard";
import { Button, Chip, PlatformMark } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { PLATFORMS } from "@/data/platforms";
import { FIELD_VI, LANGUAGE_VI, LANGUAGES, type Profile } from "@/data/profile";
import { rank as rankCourses } from "@/lib/match";
import type { Weights } from "@/lib/score";
import { useT } from "@/lib/i18n";

export function Catalogue({
  profile, weights, setWeights, progress, completed,
  initialQuery = "", initialPlatform = null,
  onOpenCourse, onExplain, onEditProfile, onHome, onBack,
}: {
  profile: Profile;
  weights: Weights;
  setWeights: (w: Weights) => void;
  progress: Record<string, string[]>;
  completed: string[];
  initialQuery?: string;
  initialPlatform?: string | null;
  onOpenCourse: (id: string) => void;
  onExplain: (id: string) => void;
  onEditProfile: () => void;
  onHome?: () => void;
  onBack: () => void;
}) {
  const { t, lang } = useT();
  const [query, setQuery] = useState(initialQuery);
  const [platform, setPlatform] = useState<string | null>(initialPlatform);
  const [language, setLanguage] = useState<string | null>(null);
  const [maxHours, setMaxHours] = useState<number | null>(null);
  const [minScore, setMinScore] = useState(0);

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
  const clear = () => {
    setPlatform(null); setLanguage(null); setMaxHours(null); setMinScore(0); setQuery("");
  };

  const majorLabel = lang === "vi" ? FIELD_VI[profile.field] : profile.field;

  const searchInput = (
    <>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 opacity-40" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("dash.searchPlaceholder")}
        aria-label={t("action.search")}
        className="h-11 w-full rounded-full bg-white pr-4 pl-10 text-sm shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] placeholder:opacity-40 focus:shadow-[inset_0_0_0_2px_var(--color-flow)] focus:outline-none"
      />
    </>
  );

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1120px] items-center gap-3 px-5 py-3 lg:px-8">
          <Brand onHome={onHome} />
          <div className="relative ml-auto hidden max-w-sm flex-1 sm:block">{searchInput}</div>
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <ScoringDropdown weights={weights} onChange={setWeights} />
            <LangToggle />
          </div>
        </div>

        <div className="mx-auto max-w-[1120px] px-5 pb-3 sm:hidden">
          <div className="relative">{searchInput}</div>
        </div>

        {/* Platform selector */}
        <div className="mx-auto max-w-[1120px] px-5 pb-3 lg:px-8">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
            <Chip active={platform === null} onClick={() => setPlatform(null)}>
              <LayoutGrid className="size-3.5" /> {t("cat.allPlatforms")}
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

      <main className="mx-auto max-w-[1120px] px-5 py-7 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="size-4" /> {t("nav.dashboard")}
          </Button>
          <button
            onClick={onEditProfile}
            className="flex h-10 items-center gap-2 rounded-full bg-white px-3.5 text-[12.5px] font-medium shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] transition-shadow duration-150 hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.26)] active:scale-[0.97]"
          >
            <span className="opacity-50">{t("cat.editingAs")}</span>
            <span className="max-w-[150px] truncate">{majorLabel} · {profile.country}</span>
          </button>
        </div>

        <h1 className="mt-4 text-[28px] font-extrabold tracking-[-0.025em]">{t("cat.title")}</h1>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <select
            value={language ?? ""}
            onChange={(e) => setLanguage(e.target.value || null)}
            aria-label={t("cat.anyLanguage")}
            className="h-9 rounded-full bg-white px-3 text-[12.5px] shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] focus:outline-none"
          >
            <option value="">{t("cat.anyLanguage")}</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{lang === "vi" ? LANGUAGE_VI[l] : l}</option>
            ))}
          </select>
          <select
            value={maxHours ?? ""}
            onChange={(e) => setMaxHours(e.target.value ? Number(e.target.value) : null)}
            aria-label={t("cat.anyLength")}
            className="h-9 rounded-full bg-white px-3 text-[12.5px] shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] focus:outline-none"
          >
            <option value="">{t("cat.anyLength")}</option>
            <option value="1">{t("cat.under1")}</option>
            <option value="3">{t("cat.under3")}</option>
            <option value="6">{t("cat.under6")}</option>
          </select>
          <label className="flex h-9 items-center gap-2 rounded-full bg-white px-3.5 text-[12.5px] shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)]">
            <span className="whitespace-nowrap opacity-60">{t("cat.minScore")}</span>
            <input
              type="range" min={0} max={10} step={0.5} value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              aria-label={t("cat.minScore")}
              className="w-20"
              style={{ "--track": `linear-gradient(90deg,var(--color-ink) ${minScore * 10}%,var(--color-silt) ${minScore * 10}%)`, "--thumb": "var(--color-ink)" } as React.CSSProperties}
            />
            <span className="w-6 font-mono text-[12px] tabular-nums">{minScore.toFixed(1)}</span>
          </label>
          {filtersOn && (
            <button onClick={clear} className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-[12.5px] opacity-55 transition-colors hover:bg-black/5 hover:opacity-100">
              <X className="size-3.5" /> {t("action.clear")}
            </button>
          )}
          <span className="ml-auto font-mono text-[12px] tabular-nums opacity-45">
            {visible.length} {t("cat.of")} {ranked.length}
          </span>
        </div>

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
            <h3 className="text-lg font-bold">{t("cat.emptyTitle")}</h3>
            <p className="mx-auto mt-2 max-w-sm text-[13.5px] opacity-55">{t("cat.emptySub")}</p>
            <Button variant="outline" className="mt-5" onClick={clear}>{t("action.clear")}</Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
