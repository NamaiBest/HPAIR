import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Search } from "lucide-react";
import { Button, Chip, Field } from "@/components/ui";
import { Brand } from "@/components/Brand";
import { LangToggle } from "@/components/LangToggle";
import {
  COUNTRIES, FIELDS, FIELD_VI, GOALS, GOAL_VI, LANGUAGES, LANGUAGE_VI,
  STUDY_LEVELS, STUDY_LEVEL_VI, UNIVERSITIES, YEARS, type Profile,
} from "@/data/profile";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Onboarding({ onDone, onHome }: { onDone: (p: Profile) => void; onHome?: () => void }) {
  const { t, lang } = useT();
  const [step, setStep] = useState(0);
  const [uniQuery, setUniQuery] = useState("");
  const [p, setP] = useState<Profile>({
    country: "", institution: "", field: "Finance",
    studyLevel: "Undergraduate", year: 2,
    goal: "Move into a technical role", language: lang === "vi" ? "Vietnamese" : "English",
  });
  const [touched, setTouched] = useState({ field: false, goal: false });

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((s) => ({ ...s, [k]: v }));

  const unis = useMemo(() => {
    const list = UNIVERSITIES[p.country] ?? [];
    const q = uniQuery.trim().toLowerCase();
    return q ? list.filter((u) => u.toLowerCase().includes(q)) : list;
  }, [p.country, uniQuery]);

  const canAdvance =
    step === 0 ? p.country !== "" && p.institution.trim() !== ""
    : touched.field && touched.goal;

  const next = () => (step === 1 ? onDone(p) : setStep(1));
  const label = (en: string, vi: string) => (lang === "vi" ? vi : en);

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[720px] items-center gap-4 px-5 py-3.5">
          <Brand onHome={onHome} />
          <div className="ml-auto"><LangToggle /></div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[720px] px-5 py-10 sm:py-14">
        {/* Progress */}
        <div className="flex items-center gap-3">
          {[t("ob.step1"), t("ob.step2")].map((s, i) => (
            <div key={s} className="flex flex-1 flex-col gap-2">
              <div className="h-1 overflow-hidden rounded-full bg-black/8">
                <motion.div
                  className="h-full rounded-full bg-flow"
                  initial={false}
                  animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                />
              </div>
              <span className={cn("text-[11.5px] transition-opacity", i === step ? "opacity-70" : "opacity-30")}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className="mt-10 flex flex-col gap-8"
          >
            {step === 0 ? (
              <>
                <StepHead title={t("ob.q1.title")} sub={t("ob.q1.sub")} />

                <Field label={t("ob.country")}>
                  <div className="flex flex-wrap gap-2">
                    {COUNTRIES.map((c) => (
                      <Chip
                        key={c.id}
                        active={p.country === c.name}
                        onClick={() => { set("country", c.name); set("institution", ""); setUniQuery(""); }}
                        disabled={c.status === "expanding"}
                        className={c.status === "expanding" ? "opacity-45" : ""}
                      >
                        {lang === "vi" ? c.nameVi : c.name}
                        {c.status === "expanding" && (
                          <span className="text-[10px] font-normal opacity-70">{t("ob.expanding")}</span>
                        )}
                      </Chip>
                    ))}
                  </div>
                </Field>

                {/* University picker: searchable list, not a bare text box */}
                <AnimatePresence initial={false}>
                  {p.country && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                      className="overflow-hidden"
                    >
                      <Field label={t("ob.university")} hint={t("ob.universityHint")}>
                        <div className="relative">
                          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 opacity-40" />
                          <input
                            value={uniQuery || p.institution}
                            onChange={(e) => { setUniQuery(e.target.value); set("institution", e.target.value); }}
                            placeholder={t("ob.universityPlaceholder")}
                            aria-label={t("ob.university")}
                            className="h-12 w-full rounded-xl bg-white pr-4 pl-10 text-sm shadow-[inset_0_0_0_1px_rgb(6_39_44/0.14)] placeholder:opacity-40 focus:shadow-[inset_0_0_0_2px_var(--color-flow)] focus:outline-none"
                          />
                        </div>
                        {unis.length > 0 && (
                          <div className="mt-2 max-h-56 overflow-y-auto rounded-xl bg-white p-1.5 shadow-[0_0_0_1px_rgb(6_39_44/0.08)]">
                            {unis.map((u) => (
                              <button
                                key={u}
                                onClick={() => { set("institution", u); setUniQuery(""); }}
                                className={cn(
                                  "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] transition-colors",
                                  p.institution === u ? "bg-flow/12 font-semibold text-deep" : "hover:bg-black/[0.04]",
                                )}
                              >
                                {u}
                                {p.institution === u && <Check className="size-4 shrink-0" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field label={t("ob.language")} hint={t("ob.languageHint")}>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => (
                      <Chip key={l} active={p.language === l} onClick={() => set("language", l)}>
                        {lang === "vi" ? LANGUAGE_VI[l] : l}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </>
            ) : (
              <>
                <StepHead title={t("ob.q2.title")} sub={t("ob.q2.sub")} />

                <Field label={t("ob.level")}>
                  <div className="grid grid-cols-3 gap-2">
                    {STUDY_LEVELS.map((l) => (
                      <button
                        key={l}
                        onClick={() => set("studyLevel", l)}
                        className={cn(
                          "flex h-12 items-center justify-center rounded-xl text-[13.5px] font-medium transition-[background-color,box-shadow,scale] duration-150 active:scale-[0.97]",
                          p.studyLevel === l
                            ? "bg-ink text-white"
                            : "bg-white shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.24)]",
                        )}
                      >
                        {lang === "vi" ? STUDY_LEVEL_VI[l] : l}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label={t("ob.year")} hint={t("ob.yearHint")}>
                  <div className="flex gap-2">
                    {YEARS.map((y) => (
                      <button
                        key={y}
                        onClick={() => set("year", y)}
                        aria-label={`${label("Year", "Năm")} ${y}`}
                        className={cn(
                          "h-12 flex-1 rounded-xl font-mono text-[15px] font-semibold transition-[background-color,box-shadow,scale] duration-150 active:scale-[0.97]",
                          p.year === y
                            ? "bg-flow text-white"
                            : "bg-white shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.24)]",
                        )}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label={t("ob.major")}>
                  <div className="flex flex-wrap gap-2">
                    {FIELDS.map((f) => (
                      <Chip
                        key={f}
                        active={p.field === f}
                        onClick={() => { set("field", f); setTouched((s) => ({ ...s, field: true })); }}
                      >
                        {lang === "vi" ? FIELD_VI[f] : f}
                      </Chip>
                    ))}
                  </div>
                </Field>

                <Field label={t("ob.goal")} hint={t("ob.goalHint")}>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {GOALS.map((g) => (
                      <button
                        key={g}
                        onClick={() => { set("goal", g); setTouched((s) => ({ ...s, goal: true })); }}
                        className={cn(
                          "flex min-h-13 items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-[13.5px] font-medium transition-[background-color,box-shadow,scale] duration-150 active:scale-[0.98]",
                          p.goal === g
                            ? "bg-ink text-white"
                            : "bg-white shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.24)]",
                        )}
                      >
                        {lang === "vi" ? GOAL_VI[g] : g}
                        {p.goal === g && <Check className="size-4 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </Field>

                <p className="rounded-xl bg-white p-4 text-[12px] leading-relaxed opacity-60 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
                  {t("ob.privacy")}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-3">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep(0)}>
              <ArrowLeft className="size-4" /> {t("action.back")}
            </Button>
          )}
          <Button className="ml-auto" size="lg" onClick={next} disabled={!canAdvance}>
            {step === 1 ? t("ob.finish") : t("action.continue")} <ArrowRight className="size-4" />
          </Button>
        </div>

        <p className="mt-10 text-[11px] leading-relaxed opacity-40">{t("ob.orgNote")}</p>
      </main>
    </div>
  );
}

function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h1 className="text-[30px] leading-tight font-extrabold tracking-[-0.02em]">{title}</h1>
      <p className="mt-2 text-[14.5px] opacity-55">{sub}</p>
    </div>
  );
}
