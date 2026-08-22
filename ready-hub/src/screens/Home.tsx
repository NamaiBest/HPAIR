import { motion } from "motion/react";
import {
  ArrowRight, Play, Trophy, MessageSquare, Handshake, Wrench, FileText,
  Sparkles,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { LangToggle } from "@/components/LangToggle";
import { Button, PlatformMark } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { CountUp } from "@/components/CountUp";
import { WorldMap } from "@/components/WorldMap";
import { NetworkGraphic } from "@/components/NetworkGraphic";
import { PLATFORMS } from "@/data/platforms";
import { CASE_STATS } from "@/data/stats";
import { CATALOGUE_SCALE, PLATFORM_SCALE } from "@/lib/reportStats";
import { useT, type TKey } from "@/lib/i18n";
import type { ReactNode } from "react";

const countFor = (id: string) => PLATFORM_SCALE[id] ?? 0;

type EcoFeature = "fame" | "forum" | "collab" | "projects" | "resume";

const ECO_PILLS: { id: EcoFeature; icon: ReactNode; key: TKey }[] = [
  { id: "forum", icon: <MessageSquare className="size-3.5" />, key: "eco.community" },
  { id: "collab", icon: <Handshake className="size-3.5" />, key: "eco.collaborate" },
  { id: "projects", icon: <Wrench className="size-3.5" />, key: "eco.upskill" },
  { id: "resume", icon: <FileText className="size-3.5" />, key: "eco.resume" },
];

const LOOP_CARDS: {
  id: EcoFeature;
  icon: ReactNode;
  tagKey: TKey;
  titleKey: TKey;
  descKey: TKey;
  accent: string;
  glow: string;
}[] = [
  {
    id: "fame",
    icon: <Trophy className="size-7" />,
    tagKey: "loop.fame.tag",
    titleKey: "loop.fame.title",
    descKey: "loop.fame.desc",
    accent: "text-amber",
    glow: "var(--color-amber)",
  },
  {
    id: "forum",
    icon: <MessageSquare className="size-7" />,
    tagKey: "loop.forum.tag",
    titleKey: "loop.forum.title",
    descKey: "loop.forum.desc",
    accent: "text-flow",
    glow: "var(--color-flow)",
  },
  {
    id: "collab",
    icon: <Handshake className="size-7" />,
    tagKey: "loop.collab.tag",
    titleKey: "loop.collab.title",
    descKey: "loop.collab.desc",
    accent: "text-leaf",
    glow: "var(--color-leaf)",
  },
  {
    id: "projects",
    icon: <Wrench className="size-7" />,
    tagKey: "loop.projects.tag",
    titleKey: "loop.projects.title",
    descKey: "loop.projects.desc",
    accent: "text-deep",
    glow: "var(--color-deep)",
  },
  {
    id: "resume",
    icon: <FileText className="size-7" />,
    tagKey: "loop.resume.tag",
    titleKey: "loop.resume.title",
    descKey: "loop.resume.desc",
    accent: "text-flow",
    glow: "var(--color-flow)",
  },
];

export function Home({
  onboarded, onGetStarted, onContinue, onFeature,
}: {
  onboarded: boolean;
  onGetStarted: () => void;
  onContinue: () => void;
  onFeature: (f: EcoFeature) => void;
}) {
  const { t } = useT();

  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1120px] items-center gap-4 px-5 py-3.5 lg:px-8">
          <Brand size="lg" />
          {/* Ecosystem pill bar */}
          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Ecosystem">
            {ECO_PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => onFeature(pill.id)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold tracking-wide text-ink/55 transition-all duration-150 hover:bg-ink/[0.05] hover:text-ink active:scale-[0.96]"
              >
                {pill.icon}
                {t(pill.key)}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <LangToggle />
            <Button size="sm" className="hidden sm:inline-flex" onClick={onboarded ? onContinue : onGetStarted}>
              {onboarded ? t("action.goToCourses") : t("action.getStarted")}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero: copy left, the numbers on the right ─────────── */}
      <section className="relative overflow-hidden">
        {/* Dot map of the world, with courses flowing into the Mekong */}
        <div className="pointer-events-none absolute inset-0 select-none">
          <div className="absolute inset-0">
            <WorldMap />
          </div>
          {/* Keep the headline readable over it */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.93) 34%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.12) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0), #ffffff)" }}
          />
        </div>

        <div className="relative mx-auto grid max-w-[1120px] gap-14 px-5 pt-16 pb-24 lg:px-8">
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
                <NetworkGraphic className="h-56 w-full" />
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

      {/* ── Coming Back for More ───────────────────────────── */}
      <section id="ecosystem" className="relative overflow-hidden border-t border-white/[0.04] bg-ink">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-40 left-1/2 size-[700px] -translate-x-1/2 rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(20,189,208,0.12) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-60 -right-40 size-[500px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(157,199,60,0.08) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative mx-auto max-w-[1120px] px-5 py-24 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", duration: 0.6, bounce: 0 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-[12px] font-semibold tracking-widest text-flow uppercase border border-white/[0.06]">
              <Sparkles className="size-3.5" />
              {t("loop.comingSoon")}
            </span>
            <h2 className="mt-7 text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] text-white sm:text-[52px]">
              {t("loop.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[16px] leading-relaxed text-white/50">
              {t("loop.sub")}
            </p>
          </motion.div>

          {/* Feature cards grid */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LOOP_CARDS.map((card, i) => (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", duration: 0.55, bounce: 0, delay: i * 0.07 }}
                onClick={() => onFeature(card.id)}
                className="rh-loop-card group relative flex flex-col items-start rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-7 text-left backdrop-blur-sm transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.06] active:scale-[0.98]"
              >
                {/* Glow on hover */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.06), 0 0 60px -20px ${card.glow}`,
                  }}
                  aria-hidden
                />
                {/* Icon */}
                <span className={`relative mb-5 inline-flex items-center justify-center rounded-2xl bg-white/[0.06] p-3 ${card.accent} transition-transform duration-300 group-hover:scale-110`}>
                  {card.icon}
                </span>
                {/* Title */}
                <h3 className="relative text-[18px] font-bold tracking-tight text-white">
                  {t(card.titleKey)}
                </h3>
                {/* Tagline */}
                <p className={`relative mt-2 text-[13px] font-semibold italic ${card.accent}`}>
                  "{t(card.tagKey)}"
                </p>
                {/* Description */}
                <p className="relative mt-3 flex-1 text-[13.5px] leading-relaxed text-white/50">
                  {t(card.descKey)}
                </p>
                {/* CTA */}
                <span className="relative mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wide text-white/40 uppercase transition-colors duration-200 group-hover:text-white/70">
                  {t("loop.explore")} <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </motion.button>
            ))}
          </div>

          {/* Bottom CTA band */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.2 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-4 rounded-[20px] border border-white/[0.06] bg-white/[0.03] px-8 py-8 text-center"
          >
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-white/60">
              {t("loop.sub")}
            </p>
            <Button size="lg" onClick={onboarded ? onContinue : onGetStarted} className="shrink-0">
              <Play className="size-4 translate-x-px fill-white" />
              {onboarded ? t("action.goToCourses") : t("action.getStarted")}
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer dark />
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
