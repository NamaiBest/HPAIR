import { AnimatePresence, motion } from "motion/react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { ArrowLeft, ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { WeightPanel } from "@/components/WeightPanel";
import { ScoreMark } from "@/components/ScoreMark";
import { Button, PlatformMark } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import {
  FACTOR_KEYS, FACTOR_META, contributions, normalise, type Weights,
} from "@/lib/score";
import type { Ranked } from "@/lib/match";
import { formatDuration } from "@/lib/utils";

export function ScoreDetail({
  course, ranked, weights, setWeights, onBack, onOpen,
}: {
  course: Ranked;
  ranked: Ranked[];
  weights: Weights;
  setWeights: (w: Weights) => void;
  onBack: () => void;
  onOpen: () => void;
}) {
  const contrib = contributions(course.factors, weights);
  const norm = normalise(weights);
  const position = ranked.findIndex((c) => c.id === course.id) + 1;

  const radarData = FACTOR_KEYS.map((k) => ({
    factor: FACTOR_META[k].label,
    value: course.factors[k],
  }));

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-3 lg:px-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="size-4" /> Catalogue
          </Button>
          <span className="ml-auto font-mono text-[12px] tabular-nums opacity-50">
            Ranked #<AnimatedNumber value={position} decimals={0} /> of {ranked.length} for you
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-8 lg:grid-cols-[1fr_360px] lg:px-8">
        {/* ── Left: how this course scored ─────────────────────── */}
        <main className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] opacity-60">
            <PlatformMark id={course.platformId} size={14} showName />
            <span aria-hidden>·</span> {course.field}
            <span aria-hidden>·</span> {course.level}
            <span aria-hidden>·</span> {formatDuration(course.minutes)}
            <span aria-hidden>·</span> {course.updated}
          </div>
          <h1 className="mt-2 max-w-2xl text-[34px] leading-[1.1] font-extrabold tracking-[-0.025em]">
            {course.title}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] opacity-55">{course.tagline}</p>

          {/* Composite + radar */}
          <div className="mt-7 grid gap-5 sm:grid-cols-[minmax(0,260px)_1fr]">
            <div className="rounded-[18px] bg-ink p-6 text-white">
              <p className="text-[11px] tracking-[0.14em] uppercase opacity-50">READY Score</p>
              <div className="mt-3">
                <ScoreMark factors={course.factors} weights={weights} fit={course.fit} size="lg" />
              </div>
              <div className="mt-5 flex items-center gap-2 border-t border-white/12 pt-4 text-[12px]">
                {course.fit >= 0 ? (
                  <TrendingUp className="size-4 shrink-0 text-leaf" />
                ) : (
                  <TrendingDown className="size-4 shrink-0 text-amber" />
                )}
                <span className="opacity-70">
                  {course.fit >= 0 ? "+" : ""}
                  <span className="font-mono">{course.fit.toFixed(2)}</span> from your profile
                </span>
              </div>
              <p className="mt-3 text-[11.5px] leading-relaxed opacity-45">
                Your field, level, language and goal adjust the base score by up to 2 points.
              </p>
            </div>

            <div className="rounded-[18px] bg-white p-4 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
              <p className="px-2 pt-1 text-[12px] font-semibold opacity-55">
                How the course rates on each factor, before your weights
              </p>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="72%">
                    <PolarGrid stroke="rgba(6,39,44,0.12)" />
                    <PolarAngleAxis
                      dataKey="factor"
                      tick={{ fontSize: 11, fill: "rgba(6,39,44,0.6)", fontFamily: "Instrument Sans" }}
                    />
                    <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar
                      dataKey="value"
                      stroke="#14bdd0" strokeWidth={2}
                      fill="#14bdd0" fillOpacity={0.18}
                      isAnimationActive={false}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Per-factor rows with live contribution */}
          <h2 className="mt-9 text-lg font-bold tracking-tight">What each factor contributed</h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {FACTOR_KEYS.map((k) => {
              const meta = FACTOR_META[k];
              return (
                <div key={k} className="rounded-[16px] bg-white p-4 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="flex items-center gap-2 text-[14px] font-bold">
                      <span className="size-2.5 rounded-full" style={{ background: meta.color }} aria-hidden />
                      {meta.label}
                    </span>
                    <span className="font-mono text-[12.5px] opacity-50">
                      {course.factors[k].toFixed(1)}/10 rated
                    </span>
                    <span className="ml-auto text-right font-mono text-[13px]">
                      <span className="opacity-45">{Math.round(norm[k] * 100)}% weight →</span>{" "}
                      <span className="font-semibold" style={{ color: meta.color }}>
                        +<AnimatedNumber value={contrib[k]} decimals={2} /> pts
                      </span>
                    </span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: meta.color }}
                      animate={{ width: `${(contrib[k] / 10) * 100}%` }}
                      transition={{ type: "spring", duration: 0.45, bounce: 0 }}
                    />
                  </div>
                  <p className="mt-2.5 text-[13px] leading-snug opacity-60">{course.notes[k]}</p>
                </div>
              );
            })}
          </div>

          <Button size="lg" className="mt-7" onClick={onOpen}>
            Start this course <ArrowRight className="size-4" />
          </Button>
        </main>

        {/* ── Right: the weight panel + live leaderboard ────────── */}
        <aside>
          <div className="sticky top-[76px] flex flex-col gap-4">
            <div className="rounded-[18px] bg-white p-5 shadow-[0_0_0_1px_rgb(6_39_44/0.07),0_8px_24px_-14px_rgb(6_39_44/0.18)]">
              <WeightPanel weights={weights} onChange={setWeights} />
            </div>

            {/* Watching the order move while you drag is the point */}
            <div className="rounded-[18px] bg-white p-4 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
              <p className="px-1 text-[12px] font-semibold opacity-55">
                Top of your catalogue right now
              </p>
              <motion.ol layout className="mt-2.5 flex flex-col gap-0.5">
                <AnimatePresence initial={false} mode="popLayout">
                  {ranked.slice(0, 6).map((c, i) => (
                    <motion.li
                      key={c.id}
                      layout
                      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                      className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12.5px] ${
                        c.id === course.id ? "bg-flow/10 font-semibold text-deep" : ""
                      }`}
                    >
                      <span className="w-3 shrink-0 font-mono text-[11px] opacity-40">{i + 1}</span>
                      <PlatformMark id={c.platformId} size={12} />
                      <span className="min-w-0 flex-1 truncate">{c.title}</span>
                      <span className="shrink-0 font-mono text-[12px] tabular-nums">
                        <AnimatedNumber value={c.score} />
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ol>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
