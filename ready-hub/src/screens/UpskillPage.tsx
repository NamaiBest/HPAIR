import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Clock, Flame, Trophy } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { UPSKILL_PROJECTS } from "@/data/upskillProjects";
import { useT } from "@/lib/i18n";

export function UpskillPage({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const { t } = useT();
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(0);

  const project = UPSKILL_PROJECTS[index % UPSKILL_PROJECTS.length];
  const allChecked = project.deliverables.every((d) => checked.has(d));

  const toggleDeliverable = (d: string) => {
    setChecked((s) => {
      const next = new Set(s);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });
  };

  const next = () => {
    setCompleted((c) => c + 1);
    setChecked(new Set());
    setIndex((i) => i + 1);
  };

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[720px] items-center gap-3 px-5 py-3.5">
          <Brand onHome={onHome} />
          <Button variant="ghost" size="sm" className="ml-auto" onClick={onBack}>
            <ArrowLeft className="size-4" /> {t("nav.home")}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-5 py-10">
        <h1 className="text-[30px] font-extrabold tracking-[-0.02em]">{t("up.title")}</h1>
        <p className="mt-2 max-w-[54ch] text-[14.5px] leading-relaxed opacity-55">{t("up.sub")}</p>

        {completed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            <Trophy className="size-4 text-amber" />
            {completed} {t(completed === 1 ? "up.completedOne" : "up.completed")}
            {completed >= 2 && <Flame className="size-4 text-amber" />}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0 }}
            className="mt-6 rounded-[20px] bg-white p-6 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-flow/12 px-2.5 py-1 text-[11px] font-semibold text-deep">{project.field}</span>
              <span className="flex items-center gap-1 text-[12px] opacity-50">
                <Clock className="size-3.5" /> {t("up.estimated")} {project.minutes} min
              </span>
            </div>

            <h2 className="mt-4 text-[21px] leading-snug font-extrabold tracking-[-0.015em]">{project.title}</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed opacity-70">{project.brief}</p>

            <div className="mt-5 border-t border-black/[0.07] pt-5">
              <p className="text-[12px] font-semibold tracking-wide opacity-50 uppercase">{t("up.deliverables")}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {project.deliverables.map((d) => {
                  const on = checked.has(d);
                  return (
                    <li key={d}>
                      <button
                        onClick={() => toggleDeliverable(d)}
                        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13.5px] transition-colors duration-150 hover:bg-black/[0.03]"
                      >
                        <span
                          className={`grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-150 ${
                            on ? "bg-leaf text-white" : "bg-black/[0.07] text-transparent"
                          }`}
                        >
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        <span className={on ? "opacity-50 line-through" : "opacity-80"}>{d}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Button size="lg" className="mt-6 w-full justify-center" disabled={!allChecked} onClick={next}>
              {t("up.markDone")} <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </AnimatePresence>

        {completed >= 1 && <p className="mt-4 text-center text-[12.5px] font-medium text-leaf-dim">{t("up.streak")}</p>}
      </main>

      <Footer />
    </div>
  );
}
