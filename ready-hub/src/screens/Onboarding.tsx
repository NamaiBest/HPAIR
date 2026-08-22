import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button, Card, Chip, Field } from "@/components/ui";
import { Brand } from "@/components/Brand";
import { Footer } from "@/components/Footer";
import { StoryPanel } from "@/components/StoryPanel";
import {
  COUNTRIES, FIELDS, GOALS, INSTITUTION_SUGGESTIONS, LANGUAGES, LEVELS,
  type Profile,
} from "@/data/profile";
import { ORG } from "@/data/stats";
import { cn } from "@/lib/utils";

const STEPS = ["Where you study", "What you study", "Where you are going"];

export function Onboarding({ onDone, onHome }: { onDone: (p: Profile) => void; onHome?: () => void }) {
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>({
    country: "", institution: "", field: "Finance", level: "Beginner",
    goal: "Move into a technical role", language: "Vietnamese",
  });
  const [touched, setTouched] = useState({ field: false, level: false, goal: false });

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((s) => ({ ...s, [k]: v }));

  const canAdvance =
    step === 0 ? p.country !== "" && p.institution.trim() !== ""
    : step === 1 ? touched.field && touched.level
    : touched.goal;

  const next = () => (step === 2 ? onDone(p) : setStep(step + 1));

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[1fr_minmax(520px,44%)]">
      {/* Left: the same story panel the home page opens with — same photo,
          same headline, same stats, so arriving here feels like a continuation. */}
      <aside className="hidden lg:block">
        <StoryPanel onHome={onHome} className="h-full" />
      </aside>

      {/* Right: the form */}
      <main className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14">
        <div className="mx-auto w-full max-w-lg">
          <div className="lg:hidden"><Brand onHome={onHome} /></div>

          <div className="mt-8 flex items-center gap-2 lg:mt-0">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 flex-col gap-2">
                <div className="h-1 overflow-hidden rounded-full bg-black/8">
                  <motion.div
                    className="h-full rounded-full bg-flow"
                    initial={false}
                    animate={{ width: i < step ? "100%" : i === step ? "45%" : "0%" }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                  />
                </div>
                <span className={cn("text-[11px] transition-opacity duration-200", i === step ? "opacity-70" : "opacity-30")}>
                  {label}
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
              className="mt-9 flex flex-col gap-7"
            >
              {step === 0 && (
                <>
                  <StepHead
                    title="Where are you studying?"
                    sub="This decides which partners and placements you can reach."
                  />
                  <Field label="Country">
                    <div className="flex flex-wrap gap-2">
                      {COUNTRIES.map((c) => (
                        <Chip
                          key={c.id}
                          active={p.country === c.name}
                          onClick={() => set("country", c.name)}
                          disabled={c.status === "expanding"}
                          title={c.status === "expanding" ? "Opening soon" : undefined}
                          className={c.status === "expanding" ? "opacity-45" : ""}
                        >
                          {c.name}
                          {c.status === "expanding" && (
                            <span className="text-[10px] font-normal opacity-70">expanding</span>
                          )}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                  <Field label="Institution" hint="Type any university">
                    <input
                      value={p.institution}
                      onChange={(e) => set("institution", e.target.value)}
                      list="institutions"
                      placeholder="Start typing…"
                      className="h-12 rounded-xl bg-white px-4 text-sm shadow-[inset_0_0_0_1px_rgb(6_39_44/0.14)] placeholder:opacity-40 focus:shadow-[inset_0_0_0_2px_var(--color-flow)] focus:outline-none"
                    />
                    <datalist id="institutions">
                      {INSTITUTION_SUGGESTIONS.map((i) => <option key={i} value={i} />)}
                    </datalist>
                  </Field>
                  <Field label="Preferred language" hint="Used to filter the catalogue">
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((l) => (
                        <Chip key={l} active={p.language === l} onClick={() => set("language", l)}>{l}</Chip>
                      ))}
                    </div>
                  </Field>
                </>
              )}

              {step === 1 && (
                <>
                  <StepHead
                    title="What are you studying?"
                    sub="We use this to bridge from what you know into what you want next."
                  />
                  <Field label="Field of study">
                    <div className="flex flex-wrap gap-2">
                      {FIELDS.map((f) => (
                        <Chip key={f} active={p.field === f}
                          onClick={() => { set("field", f); setTouched((t) => ({ ...t, field: true })); }}>
                          {f}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                  <Field label="How confident are you with digital tools right now?">
                    <div className="flex flex-col gap-2">
                      {LEVELS.map((l) => (
                        <button
                          key={l}
                          onClick={() => { set("level", l); setTouched((t) => ({ ...t, level: true })); }}
                          className={cn(
                            "flex h-14 items-center justify-between rounded-xl px-4 text-left text-sm transition-[background-color,box-shadow,scale] duration-150 active:scale-[0.98]",
                            p.level === l
                              ? "bg-ink text-white"
                              : "bg-white shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.24)]",
                          )}
                        >
                          <span>
                            <span className="font-medium">{l}</span>
                            <span className={cn("ml-2 text-[12px]", p.level === l ? "text-white/55" : "opacity-50")}>
                              {l === "Beginner" ? "I have not used these tools before"
                                : l === "Some experience" ? "I can find my way around"
                                : "I use them regularly"}
                            </span>
                          </span>
                          {p.level === l && <Check className="size-4 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <StepHead
                    title="What are you hoping this leads to?"
                    sub="The ranking changes depending on your answer. You can change it any time."
                  />
                  <Field label="Goal">
                    <div className="flex flex-col gap-2">
                      {GOALS.map((g) => (
                        <button
                          key={g}
                          onClick={() => { set("goal", g); setTouched((t) => ({ ...t, goal: true })); }}
                          className={cn(
                            "flex h-14 items-center justify-between rounded-xl px-4 text-left text-sm font-medium transition-[background-color,box-shadow,scale] duration-150 active:scale-[0.98]",
                            p.goal === g
                              ? "bg-ink text-white"
                              : "bg-white shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.24)]",
                          )}
                        >
                          {g}
                          {p.goal === g && <Check className="size-4 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Card className="p-4">
                    <p className="text-[12px] leading-relaxed opacity-60">
                      That is everything we ask. READY Hub does not collect your date of birth,
                      your ethnicity, or anything else it does not use to rank a course.
                    </p>
                  </Card>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-9 flex items-center gap-3">
            {step > 0 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="size-4" /> Back
              </Button>
            )}
            <Button className="ml-auto" size="lg" onClick={next} disabled={!canAdvance}>
              {step === 2 ? "See my courses" : "Continue"} <ArrowRight className="size-4" />
            </Button>
          </div>

          <p className="mt-8 text-[11px] leading-relaxed opacity-40">
            READY is run by VietHope, which has awarded {ORG.scholarships} scholarships and
            disbursed over {ORG.disbursed} since {ORG.since}.
          </p>
        </div>
        <Footer />
      </main>
    </div>
  );
}

function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 className="text-[30px] leading-tight font-bold tracking-[-0.02em]">{title}</h2>
      <p className="mt-2 text-[14px] opacity-55">{sub}</p>
    </div>
  );
}
