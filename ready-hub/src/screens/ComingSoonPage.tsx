import { motion } from "motion/react";
import { ArrowLeft, Bell, Trophy, MessageSquare, Handshake, Wrench, FileText, Check } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { useT, type TKey } from "@/lib/i18n";
import type { ReactNode } from "react";

type FeatureId = "fame" | "forum" | "collab" | "projects" | "resume";

const FEATURE_META: Record<FeatureId, {
  icon: ReactNode;
  gradient: string;
  accent: string;
}> = {
  fame: {
    icon: <Trophy className="size-10" />,
    gradient: "from-amber/20 via-amber/5 to-transparent",
    accent: "text-amber",
  },
  forum: {
    icon: <MessageSquare className="size-10" />,
    gradient: "from-flow/20 via-flow/5 to-transparent",
    accent: "text-flow",
  },
  collab: {
    icon: <Handshake className="size-10" />,
    gradient: "from-leaf/20 via-leaf/5 to-transparent",
    accent: "text-leaf",
  },
  projects: {
    icon: <Wrench className="size-10" />,
    gradient: "from-deep/20 via-deep/5 to-transparent",
    accent: "text-deep",
  },
  resume: {
    icon: <FileText className="size-10" />,
    gradient: "from-flow/15 via-deep/10 to-transparent",
    accent: "text-flow",
  },
};

export function ComingSoonPage({
  feature,
  onBack,
  onHome,
}: {
  feature: FeatureId;
  onBack: () => void;
  onHome: () => void;
}) {
  const { t } = useT();
  const meta = FEATURE_META[feature];

  const title = t(`loop.${feature}.title` as TKey);
  const hero = t(`soon.${feature}.hero` as TKey);
  const p1 = t(`soon.${feature}.p1` as TKey);
  const bullets = [
    t(`soon.${feature}.b1` as TKey),
    t(`soon.${feature}.b2` as TKey),
    t(`soon.${feature}.b3` as TKey),
  ];

  return (
    <div className="min-h-dvh bg-ink text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1120px] items-center gap-4 px-5 py-3.5 lg:px-8">
          <Brand light onHome={onHome} />
          <div className="ml-auto">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" onClick={onBack}>
              <ArrowLeft className="size-4" /> {t("soon.back")}
            </Button>
          </div>
        </div>
      </header>

      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 size-[600px] rounded-full bg-gradient-radial ${meta.gradient} blur-3xl opacity-40`}
          style={{ background: `radial-gradient(circle, var(--color-flow) 0%, transparent 70%)`, opacity: 0.08 }}
        />
        <div
          className="absolute -bottom-60 -left-60 size-[500px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, var(--color-deep) 0%, transparent 70%)`, opacity: 0.1 }}
        />
      </div>

      {/* Hero section */}
      <section className="relative">
        <div className="mx-auto max-w-[720px] px-5 pt-20 pb-16 lg:px-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="flex items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-[12px] font-semibold tracking-wide uppercase border border-white/[0.08]">
              <span className={meta.accent}>{meta.icon && <span className="size-4 inline-flex">{FEATURE_META[feature].icon}</span>}</span>
              {t("loop.comingSoon")}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.55, bounce: 0, delay: 0.05 }}
            className="mt-8 text-[44px] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[56px]"
          >
            {title}
          </motion.h1>

          {/* Hero tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.55, bounce: 0, delay: 0.1 }}
            className={`mt-5 text-[20px] leading-relaxed font-medium ${meta.accent}`}
          >
            {hero}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.15 }}
            className="mt-6 text-[16px] leading-relaxed text-white/65"
          >
            {p1}
          </motion.p>

          {/* Feature card with bullets */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.2 }}
            className="mt-10 rounded-[20px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-7"
          >
            <p className="text-[13px] font-semibold tracking-wide text-white/40 uppercase mb-5">
              {t("soon.building")}
            </p>
            <ul className="flex flex-col gap-4">
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", duration: 0.45, bounce: 0, delay: 0.3 + i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/[0.08] ${meta.accent}`}>
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] leading-snug text-white/80">{b}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" onClick={onBack}>
              <Bell className="size-4" /> {t("soon.notify")}
            </Button>
            <Button variant="outline" size="lg" onClick={onBack} className="border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              <ArrowLeft className="size-4" /> {t("soon.back")}
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer dark className="mt-auto" />
    </div>
  );
}
