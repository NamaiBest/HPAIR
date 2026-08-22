// READY Hub — Ecosystem update 2026-08-23
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { Home } from "@/screens/Home";
import { Onboarding } from "@/screens/Onboarding";
import { Dashboard } from "@/screens/Dashboard";
import { Catalogue } from "@/screens/Catalogue";
import { ScoreDetail } from "@/screens/ScoreDetail";
import { CoursePlayer } from "@/screens/CoursePlayer";
import { Completion } from "@/screens/Completion";
import { Assessment } from "@/screens/Assessment";
import { ComingSoonPage } from "@/screens/ComingSoonPage";
import { Button, Chip, Field } from "@/components/ui";
import { usePersisted } from "@/lib/storage";
import { rank as rankCourses } from "@/lib/match";
import { DEFAULT_WEIGHTS, type Weights } from "@/lib/score";
import { useT } from "@/lib/i18n";
import {
  COUNTRIES, FIELDS, FIELD_VI, GOALS, GOAL_VI, LANGUAGES, LANGUAGE_VI,
  STUDY_LEVELS, STUDY_LEVEL_VI, YEARS, normaliseProfile, type Profile,
} from "@/data/profile";

type EcoFeature = "fame" | "forum" | "collab" | "projects" | "resume";

type View =
  | { name: "home" }
  | { name: "onboarding" }
  | { name: "dashboard" }
  | { name: "catalogue"; query?: string; platform?: string | null }
  | { name: "score"; courseId: string }
  | { name: "course"; courseId: string }
  | { name: "complete"; courseId: string }
  | { name: "assessment"; courseId: string }
  | { name: "ecosystem"; feature: EcoFeature };

export default function App() {
  const { state, patch, update } = usePersisted();
  const [view, setView] = useState<View>({ name: "home" });
  const [editing, setEditing] = useState(false);

  // Always coerce: storage may hold a profile saved by an older version.
  const profile = useMemo(() => normaliseProfile(state.profile), [state.profile]);
  const weights = (state.weights as Weights) ?? DEFAULT_WEIGHTS;

  const ranked = useMemo(() => rankCourses(profile, weights), [profile, weights]);
  const byId = (id: string) => ranked.find((c) => c.id === id)!;

  const setWeights = (w: Weights) => patch({ weights: w });
  const home = () => setView({ name: "home" });
  const dashboard = () => setView({ name: "dashboard" });

  const toggleLecture = (courseId: string, lectureId: string) => {
    update((s) => {
      const current = s.progress[courseId] ?? [];
      const next = current.includes(lectureId)
        ? current.filter((l) => l !== lectureId)
        : [...current, lectureId];
      return { ...s, progress: { ...s.progress, [courseId]: next } };
    });
  };

  const markAllLectures = (courseId: string) => {
    const ids = byId(courseId).lectures.map((l) => l.id);
    update((s) => ({ ...s, progress: { ...s.progress, [courseId]: ids } }));
  };

  const complete = (courseId: string) => {
    if (!state.completed.includes(courseId)) {
      patch({ completed: [...state.completed, courseId] });
    }
    setView({ name: "complete", courseId });
  };

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view.name + ("courseId" in view ? view.courseId : "")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {view.name === "home" && (
            <Home
              onboarded={state.onboarded}
              onGetStarted={() => setView({ name: "onboarding" })}
              onContinue={dashboard}
              onFeature={(f: EcoFeature) => setView({ name: "ecosystem", feature: f })}
            />
          )}

          {view.name === "onboarding" && (
            <Onboarding
              onDone={(p) => {
                patch({ profile: p, weights: DEFAULT_WEIGHTS, onboarded: true });
                dashboard();
              }}
              onHome={home}
            />
          )}

          {view.name === "dashboard" && (
            <Dashboard
              profile={profile}
              weights={weights}
              setWeights={setWeights}
              progress={state.progress}
              completed={state.completed}
              onOpenCourse={(id) => setView({ name: "course", courseId: id })}
              onExplain={(id) => setView({ name: "score", courseId: id })}
              onEditProfile={() => setEditing(true)}
              onHome={home}
              onBrowse={(platformId) => setView({ name: "catalogue", platform: platformId ?? null })}
              onSearch={(q) => setView({ name: "catalogue", query: q })}
            />
          )}

          {view.name === "catalogue" && (
            <Catalogue
              profile={profile}
              weights={weights}
              setWeights={setWeights}
              progress={state.progress}
              completed={state.completed}
              initialQuery={view.query}
              initialPlatform={view.platform ?? null}
              onOpenCourse={(id) => setView({ name: "course", courseId: id })}
              onExplain={(id) => setView({ name: "score", courseId: id })}
              onEditProfile={() => setEditing(true)}
              onHome={home}
              onBack={dashboard}
            />
          )}

          {view.name === "score" && (
            <ScoreDetail
              course={byId(view.courseId)}
              ranked={ranked}
              weights={weights}
              setWeights={setWeights}
              onBack={dashboard}
              onOpen={() => setView({ name: "course", courseId: view.courseId })}
            />
          )}

          {view.name === "course" && (
            <CoursePlayer
              course={byId(view.courseId)}
              weights={weights}
              done={state.progress[view.courseId] ?? []}
              onBack={dashboard}
              onToggleLecture={(l) => toggleLecture(view.courseId, l)}
              onMarkAll={() => markAllLectures(view.courseId)}
              onComplete={() => complete(view.courseId)}
              onExplain={() => setView({ name: "score", courseId: view.courseId })}
            />
          )}

          {view.name === "complete" && (
            <Completion
              course={byId(view.courseId)}
              profile={profile}
              onBack={dashboard}
              assessment={state.assessments?.[view.courseId]}
              onTakeAssessment={() => setView({ name: "assessment", courseId: view.courseId })}
            />
          )}

          {view.name === "assessment" && (
            <Assessment
              course={byId(view.courseId)}
              field={profile.field}
              onBack={() => setView({ name: "complete", courseId: view.courseId })}
              onPassed={(result) => {
                update((s) => ({
                  ...s,
                  assessments: { ...s.assessments, [view.courseId]: result },
                }));
                setView({ name: "complete", courseId: view.courseId });
              }}
            />
          )}

          {view.name === "ecosystem" && (
            <ComingSoonPage
              feature={view.feature}
              onBack={home}
              onHome={home}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <ProfileSheet
        open={editing}
        profile={profile}
        onClose={() => setEditing(false)}
        onChange={(p) => patch({ profile: p })}
      />
    </>
  );
}

/** Quick profile switcher. Changing any value re-ranks the catalogue immediately. */
function ProfileSheet({
  open, profile, onChange, onClose,
}: {
  open: boolean;
  profile: Profile;
  onChange: (p: Profile) => void;
  onClose: () => void;
}) {
  const { t, lang } = useT();
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => onChange({ ...profile, [k]: v });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col overflow-y-auto bg-paper p-6 shadow-[-20px_0_60px_-20px_rgb(6,39,44,0.4)]"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: 24, opacity: 0 }}
            transition={{ type: "spring", duration: 0.42, bounce: 0 }}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold tracking-tight">{t("cat.editingAs")}</h2>
              <button
                onClick={onClose}
                className="grid size-10 shrink-0 place-items-center rounded-full transition-[background-color,scale] duration-150 hover:bg-black/5 active:scale-[0.96]"
              >
                <X className="size-4" />
                <span className="sr-only">{t("action.done")}</span>
              </button>
            </div>

            <div className="mt-7 flex flex-col gap-6">
              <Field label={t("ob.field")}>
                <div className="flex flex-wrap gap-1.5">
                  {FIELDS.map((f) => (
                    <Chip key={f} active={profile.field === f} onClick={() => set("field", f)}>
                      {lang === "vi" ? FIELD_VI[f] : f}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label={t("ob.level")}>
                <div className="flex flex-wrap gap-1.5">
                  {STUDY_LEVELS.map((l) => (
                    <Chip key={l} active={profile.studyLevel === l} onClick={() => set("studyLevel", l)}>
                      {lang === "vi" ? STUDY_LEVEL_VI[l] : l}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label={t("ob.year")}>
                <div className="flex gap-1.5">
                  {YEARS.map((y) => (
                    <Chip key={y} active={profile.year === y} onClick={() => set("year", y)} className="flex-1 justify-center font-mono">
                      {y}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label={t("ob.goal")}>
                <div className="flex flex-wrap gap-1.5">
                  {GOALS.map((g) => (
                    <Chip key={g} active={profile.goal === g} onClick={() => set("goal", g)}>
                      {lang === "vi" ? GOAL_VI[g] : g}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label={t("ob.language")} hint={t("ob.languageHint")}>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((l) => {
                    const on = profile.languages.includes(l);
                    return (
                      <Chip
                        key={l}
                        active={on}
                        aria-pressed={on}
                        onClick={() =>
                          set(
                            "languages",
                            on
                              ? profile.languages.length > 1
                                ? profile.languages.filter((x) => x !== l)
                                : profile.languages
                              : [...profile.languages, l],
                          )
                        }
                      >
                        {lang === "vi" ? LANGUAGE_VI[l] : l}
                      </Chip>
                    );
                  })}
                </div>
              </Field>
              <Field label={t("ob.country")}>
                <div className="flex flex-wrap gap-1.5">
                  {COUNTRIES.filter((c) => c.status === "live").map((c) => (
                    <Chip key={c.id} active={profile.country === c.name} onClick={() => set("country", c.name)}>
                      {lang === "vi" ? c.nameVi : c.name}
                    </Chip>
                  ))}
                </div>
              </Field>
            </div>

            <Button size="lg" className="mt-8" onClick={onClose}>{t("action.done")}</Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
