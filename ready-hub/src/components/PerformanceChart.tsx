import { motion, useReducedMotion } from "motion/react";
import { PERFORMANCE_BANDS, PEER_COMPARISON } from "@/data/assessments";
import { AnimatedNumber } from "./AnimatedNumber";
import { cn } from "@/lib/utils";

const MAX = Math.max(
  ...PERFORMANCE_BANDS.flatMap((b) => [b.sameField, b.otherFields]),
);

/**
 * Where this result sits against everyone else assessed on the course.
 *
 * Two series: learners who arrived from the same field of study, and learners
 * from every other background. The point is that the gap between them is small,
 * so a strong result is not the property of one kind of student.
 */
export function PerformanceChart({ field }: { field: string }) {
  const reduce = useReducedMotion();
  const youBand = PERFORMANCE_BANDS.length - 1; // 92 lands in the top band

  return (
    <div className="rounded-[20px] bg-white p-6 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold tracking-[-0.01em]">
            How your result compares
          </h2>
          <p className="mt-1.5 max-w-[46ch] text-[13px] leading-snug opacity-55">
            Every learner assessed on this course, split by the background they
            came in with.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <Key color="var(--color-flow)" label={`From ${field}`} />
          <Key color="var(--color-silt)" label="Other backgrounds" dark />
        </div>
      </div>

      {/* Distribution */}
      <div className="mt-7 flex items-end justify-between gap-2 sm:gap-4">
        {PERFORMANCE_BANDS.map((b, i) => {
          const isYou = i === youBand;
          return (
            <div key={b.band} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              {isYou && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.9 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-white">
                    You · {PEER_COMPARISON.you}%
                  </span>
                  <span className="h-2 w-px bg-ink/30" aria-hidden />
                </motion.div>
              )}

              <div className="flex h-[132px] w-full items-end justify-center gap-1">
                <Bar value={b.sameField} delay={i * 0.07} color="var(--color-flow)" highlight={isYou} />
                <Bar value={b.otherFields} delay={i * 0.07 + 0.04} color="#c8dade" highlight={false} />
              </div>

              <span
                className={cn(
                  "font-mono text-[10.5px] whitespace-nowrap",
                  isYou ? "font-semibold opacity-80" : "opacity-40",
                )}
              >
                {b.band}
              </span>
            </div>
          );
        })}
      </div>

      {/* Headline comparisons */}
      <div className="mt-7 grid gap-3 border-t border-black/[0.07] pt-6 sm:grid-cols-3">
        <Stat
          value={PEER_COMPARISON.sameFieldBeaten}
          suffix="%"
          label={`of ${field} learners scored below you`}
        />
        <Stat
          value={PEER_COMPARISON.otherFieldsBeaten}
          suffix="%"
          label="of learners from other backgrounds scored below you"
        />
        <Stat
          value={PEER_COMPARISON.you - PEER_COMPARISON.sameFieldAverage}
          prefix="+"
          label={`points above the ${field} average of ${PEER_COMPARISON.sameFieldAverage}%`}
        />
      </div>

      <p className="mt-5 text-[12px] leading-relaxed opacity-50">
        Learners from {field} average {PEER_COMPARISON.sameFieldAverage}% on this
        assessment, and learners from every other background average{" "}
        {PEER_COMPARISON.otherFieldsAverage}%. The gap is small, which is the point:
        the course does not assume you arrived already knowing it.
      </p>
    </div>
  );
}

function Bar({
  value, delay, color, highlight,
}: { value: number; delay: number; color: string; highlight: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("w-full max-w-[18px] rounded-t-[4px]", highlight && "shadow-[0_0_0_2px_rgb(6,39,44,0.15)]")}
      style={{ background: color }}
      initial={reduce ? false : { height: 0 }}
      whileInView={{ height: `${(value / MAX) * 100}%` }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", duration: 0.7, bounce: 0, delay }}
      aria-hidden
    />
  );
}

function Key({ color, label, dark }: { color: string; label: string; dark?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-[11.5px] opacity-65">
      <span
        className="size-2.5 rounded-[3px]"
        style={{ background: dark ? "#c8dade" : color }}
        aria-hidden
      />
      {label}
    </span>
  );
}

function Stat({
  value, label, prefix, suffix,
}: { value: number; label: string; prefix?: string; suffix?: string }) {
  return (
    <div>
      <p className="font-mono text-[26px] leading-none font-bold text-flow">
        {prefix}
        <AnimatedNumber value={value} decimals={0} />
        {suffix}
      </p>
      <p className="mt-2 text-[12px] leading-snug opacity-55">{label}</p>
    </div>
  );
}
