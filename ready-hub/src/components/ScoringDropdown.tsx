import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { WeightPanel } from "./WeightPanel";
import { PRESETS, type Weights } from "@/lib/score";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The scoring weights, tucked behind a dropdown rather than occupying a
 * permanent rail. Most learners never need to touch them; the ones who do
 * get the full panel one click away.
 */
export function ScoringDropdown({
  weights, onChange,
}: { weights: Weights; onChange: (w: Weights) => void }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activePreset = PRESETS.find((p) =>
    (["relevance", "engagement", "density", "currency"] as const).every((k) => p.weights[k] === weights[k]),
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex h-11 items-center gap-2 rounded-full px-4 text-[13px] font-medium whitespace-nowrap",
          "transition-[background-color,box-shadow,scale] duration-150 active:scale-[0.97]",
          open
            ? "bg-ink text-white"
            : "bg-white text-ink shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.26)]",
        )}
      >
        <SlidersHorizontal className="size-3.5" />
        {t("cat.scoring")}
        {activePreset && (
          <span className={cn("text-[12px]", open ? "text-white/55" : "opacity-45")}>
            · {t(`preset.${activePreset.id}` as never)}
          </span>
        )}
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="absolute right-0 z-50 mt-2 w-[340px] origin-top-right rounded-[18px] bg-white p-5 shadow-[0_0_0_1px_rgb(6_39_44/0.09),0_20px_50px_-18px_rgb(6_39_44/0.4)]"
          >
            <WeightPanel weights={weights} onChange={onChange} compact />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
