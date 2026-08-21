import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import {
  DEFAULT_WEIGHTS, FACTOR_KEYS, FACTOR_META, PRESETS, normalise,
  type FactorKey, type Weights,
} from "@/lib/score";
import { cn } from "@/lib/utils";

/**
 * The weight panel. Moving any slider recomputes every score in the catalogue
 * and re-sorts it immediately — no apply button, no confirmation step.
 */
export function WeightPanel({
  weights,
  onChange,
  compact = false,
}: {
  weights: Weights;
  onChange: (w: Weights) => void;
  compact?: boolean;
}) {
  const norm = normalise(weights);
  const activePreset = PRESETS.find((p) =>
    FACTOR_KEYS.every((k) => p.weights[k] === weights[k]),
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className={cn("font-bold tracking-tight", compact ? "text-base" : "text-lg")}>
            Scoring weights
          </h3>
          <p className="mt-1 text-[12px] leading-snug opacity-55">
            Decide what a good course means to you. The catalogue re-ranks as you move these.
          </p>
        </div>
        <button
          onClick={() => onChange(DEFAULT_WEIGHTS)}
          title="Reset to equal weighting"
          className="grid size-10 shrink-0 place-items-center rounded-full text-ink/45 transition-[background-color,color,scale] duration-150 hover:bg-black/5 hover:text-ink active:scale-[0.96]"
        >
          <RotateCcw className="size-4" />
          <span className="sr-only">Reset weights</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.weights)}
            title={p.note}
            className={cn(
              "h-9 rounded-full px-3 text-[12px] font-medium whitespace-nowrap",
              "transition-[background-color,color,box-shadow,scale] duration-150 active:scale-[0.96]",
              activePreset?.id === p.id
                ? "bg-flow text-white"
                : "bg-black/[0.04] text-ink/70 hover:bg-black/[0.08] hover:text-ink",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {FACTOR_KEYS.map((k) => (
          <Slider
            key={k}
            k={k}
            value={weights[k]}
            share={norm[k]}
            onChange={(v) => onChange({ ...weights, [k]: v })}
          />
        ))}
      </div>
    </div>
  );
}

function Slider({
  k, value, share, onChange,
}: { k: FactorKey; value: number; share: number; onChange: (v: number) => void }) {
  const meta = FACTOR_META[k];
  const pct = Math.round(share * 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={`w-${k}`} className="flex items-center gap-2 text-[13px] font-semibold">
          <span className="size-2.5 rounded-full" style={{ background: meta.color }} aria-hidden />
          {meta.label}
        </label>
        <motion.span
          className="font-mono text-[12px] tabular-nums opacity-50"
          key={pct}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          {pct}%
        </motion.span>
      </div>
      <input
        id={`w-${k}`}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${meta.label} weight, ${pct} percent of the score`}
        style={
          {
            "--thumb": meta.color,
            "--track": `linear-gradient(90deg, ${meta.color} ${value}%, var(--color-silt) ${value}%)`,
          } as React.CSSProperties
        }
      />
      <p className="text-[11px] leading-snug opacity-45">{meta.blurb}</p>
    </div>
  );
}
