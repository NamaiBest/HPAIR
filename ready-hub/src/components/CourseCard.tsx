import { motion } from "motion/react";
import { CheckCircle2, Clock, Info, Play } from "lucide-react";
import { ScoreMark } from "./ScoreMark";
import { PlatformMark } from "./ui";
import type { Ranked } from "@/lib/match";
import type { Weights } from "@/lib/score";
import { asset, cn, formatDuration } from "@/lib/utils";
import { useReason, useT } from "@/lib/i18n";
import { FIELD_VI } from "@/data/profile";

export function CourseCard({
  course, weights, rank, done, progress, onOpen, onExplain,
}: {
  course: Ranked;
  weights: Weights;
  rank: number;
  done: boolean;
  progress: number; // 0-1
  onOpen: () => void;
  onExplain: () => void;
}) {
  const { t, lang } = useT();
  const reason = useReason();
  return (
    <motion.article
      layout
      transition={{ type: "spring", duration: 0.55, bounce: 0 }}
      className="group relative overflow-hidden rounded-[18px] bg-white shadow-[0_0_0_1px_rgb(6_39_44/0.07),0_1px_2px_rgb(6_39_44/0.05),0_8px_24px_-14px_rgb(6_39_44/0.16)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgb(6_39_44/0.12),0_2px_4px_rgb(6_39_44/0.06),0_18px_40px_-18px_rgb(6_39_44/0.3)]"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <button
          onClick={onOpen}
          className="relative aspect-video w-full shrink-0 overflow-hidden bg-ink sm:aspect-auto sm:w-[248px]"
          aria-label={`Open ${course.title}`}
        >
          <img
            src={asset(course.thumb)}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04]"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
          <span className="absolute top-2.5 left-2.5 grid size-7 place-items-center rounded-full bg-white/95 font-mono text-[11px] font-semibold shadow-sm">
            {rank}
          </span>
          <span className="absolute bottom-2.5 left-2.5 grid size-9 place-items-center rounded-full bg-white/95 shadow-sm transition-transform duration-200 group-hover:scale-110">
            {/* play triangle nudged right for optical centring */}
            <Play className="size-3.5 translate-x-[1px] fill-ink text-ink" />
          </span>
          {progress > 0 && !done && (
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
              <span className="block h-full bg-leaf" style={{ width: `${progress * 100}%` }} />
            </span>
          )}
        </button>

        {/* Body */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] opacity-60">
                <PlatformMark id={course.platformId} size={13} showName />
                <Dot /> <span>{lang === "vi" ? FIELD_VI[course.field] : course.field}</span>
                <Dot /> <span>{t(`level.${course.level}` as never)}</span>
                <Dot />
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" /> {formatDuration(course.minutes)}
                </span>
              </div>
              <button onClick={onOpen} className="mt-1.5 block text-left">
                <h3 className="text-[17px] leading-snug font-bold tracking-[-0.01em] hover:text-flow-dim">
                  {course.title}
                </h3>
              </button>
              <p className="mt-1 text-[13px] leading-snug opacity-55">{course.tagline}</p>
            </div>

            <div className="shrink-0 text-right">
              <ScoreMark factors={course.factors} weights={weights} fit={course.fit} className="w-[104px]" />
            </div>
          </div>

          {/* The personalised reason */}
          <p className="rounded-lg bg-flow/[0.07] px-3 py-2 text-[12.5px] leading-snug text-deep">
            {reason(course.reason)}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-0.5">
            <button
              onClick={onExplain}
              className="inline-flex h-9 items-center gap-1.5 rounded-full pr-2.5 text-[12.5px] font-medium text-ink/60 transition-colors duration-150 hover:text-flow-dim"
            >
              <Info className="size-3.5" /> {t("cat.whyScore")}
            </button>
            <span className="text-[11.5px] opacity-40">{course.updated}</span>
            <span className="text-[11.5px] opacity-40">
              {course.languages.slice(0, 3).join(" · ")}
            </span>
            {done && (
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-leaf/15 px-2.5 py-1 text-[11.5px] font-semibold text-leaf-dim">
                <CheckCircle2 className="size-3.5" /> Completed
              </span>
            )}
          </div>
        </div>
      </div>

    </motion.article>
  );
}

const Dot = () => <span className="opacity-40" aria-hidden>·</span>;

export { cn };
