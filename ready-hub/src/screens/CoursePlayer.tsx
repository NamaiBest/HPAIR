import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check, CheckCircle2, Clock, ExternalLink, Play } from "lucide-react";
import { Button, PlatformMark } from "@/components/ui";
import { ScoreMark } from "@/components/ScoreMark";
import { PLATFORM_BY_ID } from "@/data/platforms";
import type { Ranked } from "@/lib/match";
import { FACTOR_KEYS, FACTOR_META, type Weights } from "@/lib/score";
import { cn, formatDuration } from "@/lib/utils";

export function CoursePlayer({
  course, weights, done, onBack, onToggleLecture, onMarkAll, onComplete, onExplain,
}: {
  course: Ranked;
  weights: Weights;
  done: string[];
  onBack: () => void;
  onToggleLecture: (lectureId: string) => void;
  onMarkAll: () => void;
  onComplete: () => void;
  onExplain: () => void;
}) {
  const [active, setActive] = useState(0);
  const lecture = course.lectures[active];
  const platform = PLATFORM_BY_ID[course.platformId];
  const finished = done.length === course.lectures.length;

  // Move to the first unwatched lecture when the course opens.
  useEffect(() => {
    const i = course.lectures.findIndex((l) => !done.includes(l.id));
    setActive(i === -1 ? 0 : i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  return (
    <div className="min-h-dvh bg-ink text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-3 lg:px-8">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10">
            <ArrowLeft className="size-4" /> Catalogue
          </Button>
          <span className="ml-auto flex items-center gap-2 text-[12px] text-white/50">
            <PlatformMark id={course.platformId} size={13} />
            <span>Indexed from {platform?.name}</span>
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-7 px-5 py-6 lg:grid-cols-[1fr_368px] lg:px-8">
        {/* ── Player ───────────────────────────────────────────── */}
        <main className="min-w-0">
          <div className="overflow-hidden rounded-[18px] bg-black shadow-[0_20px_60px_-20px_rgb(0,0,0,0.7)]">
            <div className="relative aspect-video">
              <iframe
                key={lecture.id}
                className="absolute inset-0 size-full"
                src={`https://www.youtube-nocookie.com/embed/${lecture.videoId}?start=${lecture.start}&rel=0&modestbranding=1`}
                title={lecture.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-[0.14em] text-white/40 uppercase">
                Lecture {active + 1} of {course.lectures.length}
              </p>
              <h1 className="mt-1.5 text-[26px] leading-tight font-extrabold tracking-[-0.02em]">
                {lecture.title}
              </h1>
              <p className="mt-1.5 text-[13.5px] text-white/50">
                {course.title} · {formatDuration(lecture.minutes)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={`https://www.youtube.com/watch?v=${lecture.videoId}&t=${lecture.start}`}
                target="_blank" rel="noreferrer"
                className="inline-flex h-11 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] text-white/55 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ExternalLink className="size-3.5" /> Open source
              </a>
              <Button
                variant={done.includes(lecture.id) ? "outline" : "primary"}
                onClick={() => onToggleLecture(lecture.id)}
              >
                {done.includes(lecture.id) ? (
                  <><CheckCircle2 className="size-4" /> Done</>
                ) : (
                  <><Check className="size-4" /> Mark complete</>
                )}
              </Button>
            </div>
          </div>

          {/* Why this surfaced, kept visible while you actually study */}
          <div className="mt-7 rounded-[18px] bg-white/[0.06] p-5">
            <h2 className="text-[13px] font-bold tracking-tight">Why this was routed to you</h2>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-white/70">{course.reason}</p>
            <div className="mt-4 grid gap-x-6 gap-y-3 border-t border-white/10 pt-4 sm:grid-cols-2">
              {FACTOR_KEYS.map((k) => (
                <div key={k} className="flex items-baseline gap-2.5">
                  <span className="mt-1 size-2 shrink-0 rounded-full" style={{ background: FACTOR_META[k].color }} aria-hidden />
                  <span className="text-[12px] font-semibold">{FACTOR_META[k].label}</span>
                  <span className="font-mono text-[12px] text-white/45">{course.factors[k].toFixed(1)}</span>
                  <span className="min-w-0 flex-1 text-[11.5px] leading-snug text-white/45">{course.notes[k]}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* ── Lecture list ─────────────────────────────────────── */}
        <aside className="min-w-0">
          <div className="rounded-[18px] bg-white/[0.06] p-4">
            <div className="flex items-center justify-between gap-3 px-1">
              <p className="text-[13px] font-bold">Lectures</p>
              <span className="font-mono text-[12px] tabular-nums text-white/45">
                {done.length}/{course.lectures.length}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-leaf"
                animate={{ width: `${(done.length / course.lectures.length) * 100}%` }}
                transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              />
            </div>

            <ol className="mt-3.5 flex flex-col gap-1">
              {course.lectures.map((l, i) => {
                const isDone = done.includes(l.id);
                const isActive = i === active;
                return (
                  <li key={l.id}>
                    <button
                      onClick={() => setActive(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[12px] px-2.5 py-2.5 text-left",
                        "transition-[background-color,scale] duration-150 active:scale-[0.98]",
                        isActive ? "bg-white/[0.14]" : "hover:bg-white/[0.07]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-mono",
                          isDone ? "bg-leaf text-ink" : isActive ? "bg-flow text-white" : "bg-white/12 text-white/60",
                        )}
                      >
                        {isDone ? <Check className="size-3.5" /> : isActive ? <Play className="size-3 translate-x-px fill-current" /> : i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block truncate text-[13px]", isActive ? "font-semibold" : "text-white/80")}>
                          {l.title}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-white/40">
                          <Clock className="size-3" /> {formatDuration(l.minutes)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Score, still visible while learning */}
          <div className="mt-3 rounded-[18px] bg-white/[0.06] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[12px] font-semibold text-white/60">READY Score</p>
                <button onClick={onExplain} className="mt-0.5 text-[11.5px] text-flow underline-offset-2 hover:underline">
                  Why this score?
                </button>
              </div>
              <ScoreMark factors={course.factors} weights={weights} fit={course.fit} className="w-[104px]" />
            </div>
          </div>

          <Button
            size="lg"
            variant={finished ? "primary" : "outline"}
            className="mt-3 w-full"
            disabled={!finished}
            onClick={onComplete}
          >
            {finished ? "Claim your certificate" : `${course.lectures.length - done.length} lectures left`}
          </Button>
          {!finished && (
            <button
              onClick={onMarkAll}
              className="mt-2.5 w-full text-center text-[11.5px] text-white/35 transition-colors hover:text-white/70"
            >
              Mark all lectures complete
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
