import { motion } from "motion/react";
import { AnimatedNumber } from "./AnimatedNumber";
import { FACTOR_KEYS, FACTOR_META, contributions, finalScore, type Factors, type Weights } from "@/lib/score";
import { cn } from "@/lib/utils";

/**
 * The signature element of READY Hub.
 *
 * The numeral is the composite score. The bar underneath is not decoration:
 * each of the four segments is that factor's actual contribution in points.
 * When a weight changes, the segments resize by exactly as much as they moved
 * the score, so the cause of the change is visible rather than asserted.
 */
export function ScoreMark({
  factors,
  weights,
  fit = 0,
  size = "sm",
  className,
}: {
  factors: Factors;
  weights: Weights;
  fit?: number;
  size?: "sm" | "lg";
  className?: string;
}) {
  const c = contributions(factors, weights);
  // Same function the catalogue ranks by, so the numeral always matches the rank.
  const total = finalScore(factors, weights, fit);
  const lg = size === "lg";

  return (
    <div className={cn("flex flex-col", lg ? "gap-3" : "gap-1.5", className)}>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "font-mono font-semibold leading-none tracking-tight",
            lg ? "text-6xl" : "text-2xl",
          )}
        >
          <AnimatedNumber value={total} />
        </span>
        <span className={cn("font-mono opacity-45", lg ? "text-xl" : "text-xs")}>/10</span>
      </div>

      {/* Contribution bar: segment width == points that factor added */}
      <div
        className={cn(
          "flex w-full overflow-hidden rounded-full bg-black/8",
          lg ? "h-2.5" : "h-1.5",
        )}
        role="img"
        aria-label={`READY Score ${total.toFixed(1)} out of 10`}
      >
        {FACTOR_KEYS.map((k) => (
          <motion.div
            key={k}
            className="h-full"
            style={{ background: FACTOR_META[k].color }}
            animate={{ width: `${(c[k] / 10) * 100}%` }}
            transition={{ type: "spring", duration: 0.45, bounce: 0 }}
          />
        ))}
        {fit > 0 && (
          <motion.div
            className="h-full bg-flow/30"
            animate={{ width: `${(fit / 10) * 100}%` }}
            transition={{ type: "spring", duration: 0.45, bounce: 0 }}
          />
        )}
      </div>
    </div>
  );
}

export function FactorLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      {FACTOR_KEYS.map((k) => (
        <span key={k} className="flex items-center gap-1.5 text-[11px] opacity-70">
          <span
            className="size-2 rounded-full"
            style={{ background: FACTOR_META[k].color }}
            aria-hidden
          />
          {FACTOR_META[k].label}
        </span>
      ))}
    </div>
  );
}
