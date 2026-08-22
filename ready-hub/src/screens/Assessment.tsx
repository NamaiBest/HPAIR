import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, FileUp, Loader2, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import {
  DEMO_RESULT, EXAM_QUESTIONS, PROJECT_BRIEF, assessmentKind,
} from "@/data/assessments";
import type { Ranked } from "@/lib/match";
import { cn } from "@/lib/utils";

export function Assessment({
  course, onBack, onPassed,
}: {
  course: Ranked;
  onBack: () => void;
  onPassed: (result: { score: number; percentile: number }) => void;
}) {
  const kind = assessmentKind(course.id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [state, setState] = useState<"form" | "marking" | "done">("form");

  const answered = Object.keys(answers).length;
  const ready = kind === "exam" ? answered === EXAM_QUESTIONS.length : file !== null && note.trim().length > 0;

  const submit = () => {
    setState("marking");
    // Marking takes a beat: for a project this is the cohort being compared.
    window.setTimeout(() => setState("done"), kind === "project" ? 2000 : 1300);
  };

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[760px] items-center gap-3 px-5 py-3">
          <Button variant="ghost" size="sm" onClick={onBack} disabled={state === "marking"}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          <span className="ml-auto text-[12px] opacity-50">
            {kind === "exam" ? "Graded exam" : "Cohort project"}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5 py-10">
        <AnimatePresence mode="wait">
          {state === "done" ? (
            <Result key="done" onContinue={() => onPassed(DEMO_RESULT)} kind={kind} />
          ) : state === "marking" ? (
            <motion.div
              key="marking"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center"
            >
              <Loader2 className="size-7 animate-spin text-flow" />
              <p className="text-[15px] font-semibold">
                {kind === "exam" ? "Marking your answers…" : "Comparing against your cohort…"}
              </p>
              <p className="max-w-sm text-[13px] opacity-55">
                {kind === "exam"
                  ? "Each question is weighted equally."
                  : "Project marks are set relative to everyone who submitted against this brief."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            >
              <p className="text-[12px] tracking-[0.14em] uppercase opacity-45">{course.title}</p>
              <h1 className="mt-2 text-[32px] leading-tight font-extrabold tracking-[-0.025em]">
                {kind === "exam" ? "Final assessment" : PROJECT_BRIEF.title}
              </h1>
              <p className="mt-2.5 max-w-[58ch] text-[14.5px] leading-relaxed opacity-60">
                {kind === "exam"
                  ? "Five questions. Passing this is what unlocks placements and contributor roles — it is the difference between finishing a video and proving you can use it."
                  : PROJECT_BRIEF.body}
              </p>

              {kind === "exam" ? (
                <div className="mt-9 flex flex-col gap-3">
                  {EXAM_QUESTIONS.map((q, qi) => (
                    <div key={q.id} className="rounded-[18px] bg-white p-5 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
                      <p className="text-[14.5px] leading-snug font-semibold">
                        <span className="mr-2 font-mono text-[12px] opacity-40">{qi + 1}</span>
                        {q.prompt}
                      </p>
                      <div className="mt-3.5 flex flex-col gap-2">
                        {q.options.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[13.5px] transition-[background-color,box-shadow,scale] duration-150 active:scale-[0.99]",
                              answers[q.id] === oi
                                ? "bg-ink text-white"
                                : "bg-paper shadow-[inset_0_0_0_1px_rgb(6_39_44/0.1)] hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.24)]",
                            )}
                          >
                            <span
                              className={cn(
                                "grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-mono",
                                answers[q.id] === oi ? "bg-white text-ink" : "bg-black/[0.07]",
                              )}
                            >
                              {String.fromCharCode(65 + oi)}
                            </span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-9 flex flex-col gap-3">
                  <div className="rounded-[18px] bg-white p-5 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
                    <h2 className="text-[14px] font-bold">What to submit</h2>
                    <ul className="mt-3 flex flex-col gap-2">
                      {PROJECT_BRIEF.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-[13.5px] opacity-70">
                          <Check className="mt-0.5 size-4 shrink-0 text-leaf-dim" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <label
                    className={cn(
                      "flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[18px] border-2 border-dashed px-5 py-11 text-center transition-colors",
                      file ? "border-leaf bg-leaf/[0.07]" : "border-black/12 bg-white hover:border-flow",
                    )}
                  >
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
                    />
                    {file ? (
                      <>
                        <FileUp className="size-6 text-leaf-dim" />
                        <span className="text-[13.5px] font-semibold">{file}</span>
                        <span className="text-[12px] opacity-50">Click to replace</span>
                      </>
                    ) : (
                      <>
                        <Upload className="size-6 opacity-40" />
                        <span className="text-[13.5px] font-semibold">Upload your finished piece</span>
                        <span className="text-[12px] opacity-50">PNG, PDF or a source file</span>
                      </>
                    )}
                  </label>

                  <div className="rounded-[18px] bg-white p-5 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
                    <label htmlFor="note" className="text-[14px] font-bold">
                      Who is it for, and what did you decide?
                    </label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                      placeholder="Two or three sentences is enough."
                      className="mt-3 w-full resize-none rounded-xl bg-paper p-3.5 text-[13.5px] shadow-[inset_0_0_0_1px_rgb(6_39_44/0.1)] placeholder:opacity-40 focus:shadow-[inset_0_0_0_2px_var(--color-flow)] focus:outline-none"
                    />
                  </div>

                  <p className="flex items-start gap-2.5 px-1 text-[12px] leading-snug opacity-50">
                    <Users className="mt-0.5 size-4 shrink-0" />
                    Marked relative to everyone in your cohort submitting against this brief,
                    not against a fixed pass mark.
                  </p>
                </div>
              )}

              <div className="mt-8 flex items-center gap-4">
                {kind === "exam" && (
                  <span className="font-mono text-[12.5px] opacity-45">
                    {answered}/{EXAM_QUESTIONS.length} answered
                  </span>
                )}
                <Button size="lg" className="ml-auto" disabled={!ready} onClick={submit}>
                  {kind === "exam" ? "Submit answers" : "Submit project"} <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function Result({ onContinue, kind }: { onContinue: () => void; kind: "exam" | "project" }) {
  const { score, percentile } = DEMO_RESULT;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
      className="py-6"
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-leaf/15 px-3 py-1.5 text-[12.5px] font-semibold text-leaf-dim">
        <Check className="size-3.5" /> Passed
      </span>
      <h1 className="mt-4 text-[38px] leading-[1.08] font-extrabold tracking-[-0.025em]">
        You scored <span className="font-mono"><AnimatedNumber value={score} decimals={0} />%</span>.
      </h1>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed opacity-60">
        {kind === "exam"
          ? "That places you in the top 5% of everyone assessed on this course."
          : "Marked against your cohort, that places you in the top 5% of submissions to this brief."}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Tile value={`${score}%`} label="Assessment score" tone="flow" />
        <Tile value={`Top ${percentile + 1}%`} label="Cohort standing" tone="leaf" />
        <Tile value="3" label="Placements now open" tone="ink" />
      </div>

      <div className="mt-8 rounded-[18px] bg-ink p-6 text-white">
        <p className="text-[14.5px] leading-relaxed">
          Everything on the opportunity ladder is now unlocked. Top performers are eligible
          for more than one placement — choose the one that fits.
        </p>
        <Button variant="primary" className="mt-5" onClick={onContinue}>
          See what opened up <ArrowRight className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function Tile({ value, label, tone }: { value: string; label: string; tone: "flow" | "leaf" | "ink" }) {
  return (
    <div className="rounded-[16px] bg-white p-5 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
      <p
        className={cn(
          "font-mono text-[26px] leading-none font-bold",
          tone === "flow" && "text-flow",
          tone === "leaf" && "text-leaf-dim",
          tone === "ink" && "text-ink",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-[12px] opacity-55">{label}</p>
    </div>
  );
}
