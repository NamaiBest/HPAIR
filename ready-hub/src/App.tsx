import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { Home } from "@/screens/Home";
import { Onboarding } from "@/screens/Onboarding";
import { Catalogue } from "@/screens/Catalogue";
import { ScoreDetail } from "@/screens/ScoreDetail";
import { CoursePlayer } from "@/screens/CoursePlayer";
import { Completion } from "@/screens/Completion";
import { Button, Chip, Field } from "@/components/ui";
import { usePersisted } from "@/lib/storage";
import { rank as rankCourses } from "@/lib/match";
import { DEFAULT_WEIGHTS, type Weights } from "@/lib/score";
import {
  DEFAULT_PROFILE, FIELDS, GOALS, LANGUAGES, LEVELS, COUNTRIES, type Profile,
} from "@/data/profile";

type View =
  | { name: "home" }
  | { name: "onboarding" }
  | { name: "catalogue" }
  | { name: "score"; courseId: string }
  | { name: "course"; courseId: string }
  | { name: "complete"; courseId: string };

export default function App() {
  const { state, patch, update } = usePersisted();
  const [view, setView] = useState<View>({ name: "home" });
  const [editing, setEditing] = useState(false);

  const profile = (state.profile as Profile) ?? DEFAULT_PROFILE;
  const weights = (state.weights as Weights) ?? DEFAULT_WEIGHTS;

  const ranked = useMemo(() => rankCourses(profile, weights), [profile, weights]);
  const byId = (id: string) => ranked.find((c) => c.id === id)!;

  const setWeights = (w: Weights) => patch({ weights: w });

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
              onContinue={() => setView({ name: "catalogue" })}
            />
          )}

          {view.name === "onboarding" && (
            <Onboarding
              onDone={(p) => {
                patch({ profile: p, weights: DEFAULT_WEIGHTS, onboarded: true });
                setView({ name: "catalogue" });
              }}
              onHome={() => setView({ name: "home" })}
            />
          )}

          {view.name === "catalogue" && (
            <Catalogue
              profile={profile}
              weights={weights}
              setWeights={setWeights}
              progress={state.progress}
              completed={state.completed}
              onOpenCourse={(id) => setView({ name: "course", courseId: id })}
              onExplain={(id) => setView({ name: "score", courseId: id })}
              onEditProfile={() => setEditing(true)}
              onHome={() => setView({ name: "home" })}
            />
          )}

          {view.name === "score" && (
            <ScoreDetail
              course={byId(view.courseId)}
              ranked={ranked}
              weights={weights}
              setWeights={setWeights}
              onBack={() => setView({ name: "catalogue" })}
              onOpen={() => setView({ name: "course", courseId: view.courseId })}
            />
          )}

          {view.name === "course" && (
            <CoursePlayer
              course={byId(view.courseId)}
              weights={weights}
              done={state.progress[view.courseId] ?? []}
              onBack={() => setView({ name: "catalogue" })}
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
              onBack={() => setView({ name: "catalogue" })}
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
              <div>
                <h2 className="text-xl font-bold tracking-tight">Editing as</h2>
                <p className="mt-1 text-[13px] opacity-55">
                  Change anything here and the catalogue re-ranks behind you.
                </p>
              </div>
              <button
                onClick={onClose}
                className="grid size-10 shrink-0 place-items-center rounded-full transition-[background-color,scale] duration-150 hover:bg-black/5 active:scale-[0.96]"
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="mt-7 flex flex-col gap-6">
              <Field label="Field of study">
                <div className="flex flex-wrap gap-1.5">
                  {FIELDS.map((f) => (
                    <Chip key={f} active={profile.field === f} onClick={() => set("field", f)}>{f}</Chip>
                  ))}
                </div>
              </Field>
              <Field label="Current level">
                <div className="flex flex-wrap gap-1.5">
                  {LEVELS.map((l) => (
                    <Chip key={l} active={profile.level === l} onClick={() => set("level", l)}>{l}</Chip>
                  ))}
                </div>
              </Field>
              <Field label="Goal">
                <div className="flex flex-wrap gap-1.5">
                  {GOALS.map((g) => (
                    <Chip key={g} active={profile.goal === g} onClick={() => set("goal", g)}>{g}</Chip>
                  ))}
                </div>
              </Field>
              <Field label="Preferred language">
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((l) => (
                    <Chip key={l} active={profile.language === l} onClick={() => set("language", l)}>{l}</Chip>
                  ))}
                </div>
              </Field>
              <Field label="Country">
                <div className="flex flex-wrap gap-1.5">
                  {COUNTRIES.filter((c) => c.status === "live").map((c) => (
                    <Chip key={c.id} active={profile.country === c.name} onClick={() => set("country", c.name)}>
                      {c.name}
                    </Chip>
                  ))}
                </div>
              </Field>
            </div>

            <Button size="lg" className="mt-8" onClick={onClose}>See the new ranking</Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
