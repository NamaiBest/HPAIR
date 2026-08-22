import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { Brand } from "@/components/Brand";
import { LangToggle } from "@/components/LangToggle";
import { Button, PlatformMark } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { CountUp } from "@/components/CountUp";
import { PLATFORMS } from "@/data/platforms";
import { CASE_STATS } from "@/data/stats";
import { CATALOGUE_SCALE, PLATFORM_SCALE } from "@/lib/reportStats";
import { useT } from "@/lib/i18n";
import { asset } from "@/lib/utils";

const countFor = (id: string) => PLATFORM_SCALE[id] ?? 0;

export function Home({
  onboarded, onGetStarted, onContinue,
}: {
  onboarded: boolean;
  onGetStarted: () => void;
  onContinue: () => void;
}) {
  const { t } = useT();

  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1120px] items-center gap-4 px-5 py-3.5 lg:px-8">
          <Brand size="lg" />
          <div className="ml-auto flex items-center gap-3">
            <LangToggle />
            <Button size="sm" onClick={onboarded ? onContinue : onGetStarted}>
              {onboarded ? t("action.goToCourses") : t("action.getStarted")}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero: copy left, the numbers on the right ─────────── */}
      <section className="mx-auto max-w-[1120px] px-5 pt-16 pb-20 lg:px-8">
        <div className="grid gap-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.55, bounce: 0 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-flow/10 px-3 py-1.5 text-[12px] font-semibold tracking-wide text-deep uppercase">
              {t("home.eyebrow")}
            </span>
            <h1 className="mt-6 max-w-[20ch] text-[48px] leading-[1.02] font-extrabold tracking-[-0.03em] sm:text-[64px]">
              {t("home.title")}
            </h1>
            <p className="mt-6 max-w-[58ch] text-[16.5px] leading-relaxed opacity-60">
              {t("home.sub")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {onboarded ? (
                <>
                  <Button size="lg" onClick={onContinue}>
                    {t("action.goToCourses")} <ArrowRight className="size-4" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={onGetStarted}>
                    {t("action.updateProfile")}
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={onGetStarted}>
                  {t("action.getStarted")} <ArrowRight className="size-4" />
                </Button>
              )}
            </div>

            {/* Live catalogue counts, kept small and factual */}
            <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-black/[0.07] pt-8 sm:grid-cols-4">
              <Metric value={CATALOGUE_SCALE.courses} label={t("home.stat.courses")} />
              <Metric value={CATALOGUE_SCALE.platforms} label={t("home.stat.platforms")} />
              <Metric value={CATALOGUE_SCALE.lectures} label={t("home.stat.lectures")} />
              <Metric value={CATALOGUE_SCALE.hours} suffix="h" label={t("home.stat.hours")} />
            </dl>
          </motion.div>

        </div>
      </section>

      {/* ── The platform wall, in place of the old charts ─────── */}
      <section className="border-t border-black/[0.06] bg-paper">
        <div className="mx-auto max-w-[1120px] px-5 py-20 lg:px-8">
          <h2 className="max-w-[22ch] text-[32px] leading-[1.1] font-extrabold tracking-[-0.025em]">
            {t("home.platformsTitle")}
          </h2>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed opacity-55">
            {t("home.platformsSub")}
          </p>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {PLATFORMS.map((p, i) => {
              const n = countFor(p.id);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0, delay: (i % 4) * 0.05 }}
                  className="group relative flex flex-col items-center justify-center gap-4 rounded-[18px] bg-white px-4 py-9 shadow-[0_0_0_1px_rgb(6_39_44/0.07)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgb(6_39_44/0.14),0_14px_34px_-18px_rgb(6_39_44/0.35)]"
                >
                  <PlatformMark
                    id={p.id} size={44} decorative
                    className="transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-110"
                  />
                  <div className="text-center">
                    <p className="text-[14px] font-bold tracking-tight">{p.name}</p>
                    {n > 0 && (
                      <p className="mt-1 font-mono text-[11.5px] opacity-45">
                        {n} {t(n === 1 ? "home.courseCountOne" : "home.courseCount")}
                      </p>
                    )}
                  </div>
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 rounded-b-[18px] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-x-100"
                    style={{ background: p.hex }}
                    aria-hidden
                  />
                </motion.div>
              );
            })}
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-4 rounded-[20px] bg-ink px-7 py-7 text-white">
            <p className="min-w-0 flex-1 text-[15.5px] leading-relaxed">
              {t("home.sub")}
            </p>
            <Button size="lg" onClick={onboarded ? onContinue : onGetStarted} className="shrink-0">
              <Play className="size-4 translate-x-px fill-white" />
              {onboarded ? t("action.goToCourses") : t("action.getStarted")}
            </Button>
          </div>
        </div>
      </section>


      {/* The case for the programme, placed after the product itself */}
      <section className="border-t border-black/[0.06] bg-white">
        <div className="mx-auto max-w-[1120px] px-5 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
            <div>
              <h2 className="max-w-[18ch] text-[32px] leading-[1.1] font-extrabold tracking-[-0.025em]">
                {t("home.statsTitle")}
              </h2>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed opacity-55">
                {t("home.statsSub")}
              </p>
              <div className="mt-8 overflow-hidden rounded-[18px]">
                <img
                  src={asset("/viethope/students-ydp1.jpg")}
                  alt=""
                  className="h-56 w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {CASE_STATS.map((st, i) => (
                <motion.div
                  key={st.value}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0, delay: i * 0.08 }}
                  className="flex items-baseline gap-5 border-b border-black/[0.07] pb-6 last:border-0 last:pb-0"
                >
                  <span className="w-[72px] shrink-0 font-mono text-[30px] leading-none font-bold text-flow">
                    {st.value}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] leading-snug opacity-70">{st.label}</span>
                    <span className="mt-1.5 block text-[11px] opacity-40">{st.source}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Metric({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      <dt className="flex items-baseline gap-0.5 font-mono text-[32px] leading-none font-bold">
        <CountUp value={value} />
        {suffix && <span className="text-lg opacity-50">{suffix}</span>}
      </dt>
      <dd className="mt-1.5 max-w-[16ch] text-[12px] leading-snug opacity-50">{label}</dd>
    </div>
  );
}
