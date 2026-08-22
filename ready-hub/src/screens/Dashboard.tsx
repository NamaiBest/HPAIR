import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Brand } from "@/components/Brand";
import { LangToggle } from "@/components/LangToggle";
import { ScoringDropdown } from "@/components/ScoringDropdown";
import { CourseCard } from "@/components/CourseCard";
import { Button, PlatformMark } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { PLATFORMS } from "@/data/platforms";
import { FIELD_VI, type Profile } from "@/data/profile";
import { rank as rankCourses } from "@/lib/match";
import type { Weights } from "@/lib/score";
import { coursesByPlatform } from "@/lib/reportStats";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Dashboard({
  profile, weights, setWeights, progress, completed,
  onOpenCourse, onExplain, onEditProfile, onHome, onBrowse, onSearch,
}: {
  profile: Profile;
  weights: Weights;
  setWeights: (w: Weights) => void;
  progress: Record<string, string[]>;
  completed: string[];
  onOpenCourse: (id: string) => void;
  onExplain: (id: string) => void;
  onEditProfile: () => void;
  onHome: () => void;
  onBrowse: (platformId?: string) => void;
  onSearch: (q: string) => void;
}) {
  const { t, lang } = useT();
  const [query, setQuery] = useState("");

  const ranked = useMemo(() => rankCourses(profile, weights), [profile, weights]);
  const top = ranked.slice(0, 3);
  const inProgress = ranked.filter(
    (c) => (progress[c.id]?.length ?? 0) > 0 && !completed.includes(c.id),
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const majorLabel = lang === "vi" ? FIELD_VI[profile.field] : profile.field;

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1120px] items-center gap-3 px-5 py-3 lg:px-8">
          <Brand onHome={onHome} />

          <form onSubmit={submit} className="relative ml-auto hidden max-w-sm flex-1 sm:block">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 opacity-40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("dash.searchPlaceholder")}
              aria-label={t("action.search")}
              className="h-11 w-full rounded-full bg-white pr-4 pl-10 text-sm shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] placeholder:opacity-40 focus:shadow-[inset_0_0_0_2px_var(--color-flow)] focus:outline-none"
            />
          </form>

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <ScoringDropdown weights={weights} onChange={setWeights} />
            <LangToggle />
          </div>
        </div>

        {/* Search on its own row where the header has no space */}
        <form onSubmit={submit} className="mx-auto max-w-[1120px] px-5 pb-3 sm:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 opacity-40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("dash.searchPlaceholder")}
              aria-label={t("action.search")}
              className="h-11 w-full rounded-full bg-white pr-4 pl-10 text-sm shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] placeholder:opacity-40 focus:shadow-[inset_0_0_0_2px_var(--color-flow)] focus:outline-none"
            />
          </div>
        </form>
      </header>

      <main className="mx-auto max-w-[1120px] px-5 py-9 lg:px-8">
        {/* Greeting + profile chip */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] leading-tight font-extrabold tracking-[-0.025em]">
              {t("dash.greeting")}
            </h1>
            <p className="mt-1.5 text-[14px] opacity-55">
              {t("dash.subtitle", { major: majorLabel, year: profile.year })}
            </p>
          </div>
          <button
            onClick={onEditProfile}
            className="flex h-11 items-center gap-2 rounded-full bg-white px-4 text-[12.5px] font-medium shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] transition-shadow duration-150 hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.26)] active:scale-[0.97]"
          >
            <span className="opacity-50">{t("cat.editingAs")}</span>
            <span className="max-w-[180px] truncate">{majorLabel} · {profile.country}</span>
          </button>
        </div>

        {/* Continue where you left off */}
        {inProgress.length > 0 && (
          <section className="mt-9">
            <SectionHead title={t("dash.continueLearning")} />
            <div className="mt-4 flex flex-col gap-3">
              {inProgress.slice(0, 2).map((c) => (
                <CourseCard
                  key={c.id} course={c} weights={weights} rank={0}
                  done={false}
                  progress={(progress[c.id]?.length ?? 0) / c.lectures.length}
                  onOpen={() => onOpenCourse(c.id)}
                  onExplain={() => onExplain(c.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Top matches */}
        <section className="mt-11">
          <SectionHead
            title={t("dash.topMatches")}
            icon={<Sparkles className="size-4 text-flow" />}
            action={
              <Button variant="ghost" size="sm" onClick={() => onBrowse()}>
                {t("action.seeAll")} <ArrowRight className="size-3.5" />
              </Button>
            }
          />
          <div className="mt-4 flex flex-col gap-3">
            {top.map((c, i) => (
              <CourseCard
                key={c.id} course={c} weights={weights} rank={i + 1}
                done={completed.includes(c.id)}
                progress={(progress[c.id]?.length ?? 0) / c.lectures.length}
                onOpen={() => onOpenCourse(c.id)}
                onExplain={() => onExplain(c.id)}
              />
            ))}
          </div>
        </section>

        {/* Browse by platform */}
        <section className="mt-14">
          <SectionHead title={t("dash.browseBy")} />
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {PLATFORMS.map((p, i) => {
              const n = coursesByPlatform.find((c) => c.id === p.id)?.count ?? 0;
              return (
                <motion.button
                  key={p.id}
                  onClick={() => onBrowse(p.id)}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.35, delay: (i % 6) * 0.04 }}
                  className={cn(
                    "group flex flex-col items-center gap-2.5 rounded-[16px] bg-white px-3 py-5",
                    "shadow-[0_0_0_1px_rgb(6_39_44/0.07)] transition-shadow duration-200",
                    "hover:shadow-[0_0_0_1px_rgb(6_39_44/0.14),0_10px_26px_-16px_rgb(6_39_44/0.35)]",
                    "active:scale-[0.97]",
                  )}
                >
                  <PlatformMark
                    id={p.id} size={30} decorative
                    className="transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-110"
                  />
                  <span className="text-center text-[12px] font-semibold">{p.name}</span>
                  {n > 0 && <span className="font-mono text-[10.5px] opacity-40">{n}</span>}
                </motion.button>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SectionHead({
  title, icon, action,
}: { title: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-2 text-[17px] font-bold tracking-[-0.01em]">
        {icon}
        {title}
      </h2>
      {action}
    </div>
  );
}
