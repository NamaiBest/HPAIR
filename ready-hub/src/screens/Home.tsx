import { useState } from "react";
import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ArrowRight } from "lucide-react";
import { StoryPanel } from "@/components/StoryPanel";
import { Button, PlatformMark } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/watermelon-ui/chart";
import {
  avgFactors, avgScore, coursesByPlatform, platformsUsed, totalCourses, totalLectures, totalMinutes,
} from "@/lib/reportStats";

const platformChartData = coursesByPlatform.map((p) => ({ ...p, fill: p.hex }));
const factorChartData = avgFactors.map((f) => ({ ...f, fill: f.color }));

const platformChartConfig = { count: { label: "Courses" } } satisfies ChartConfig;
const factorChartConfig = { value: { label: "Average score" } } satisfies ChartConfig;

export function Home({
  onboarded, onGetStarted, onContinue,
}: {
  onboarded: boolean;
  onGetStarted: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="min-h-dvh bg-paper">
      {/* ── Hero: the exact same story panel onboarding opens with ──── */}
      <StoryPanel className="min-h-[560px]">
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {onboarded ? (
            <>
              <Button size="lg" onClick={onContinue}>
                Go to my courses <ArrowRight className="size-4" />
              </Button>
              <button
                onClick={onGetStarted}
                className="text-[13.5px] font-medium text-white/60 transition-colors hover:text-white"
              >
                Update my profile
              </button>
            </>
          ) : (
            <Button size="lg" onClick={onGetStarted}>
              Get started <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </StoryPanel>

      {/* ── Impact report ────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-16 lg:px-8">
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em]">
            What's indexed right now
          </h2>
          <p className="mt-2 max-w-lg text-[14.5px] opacity-55">
            Every number below comes from the live catalogue — open{" "}
            <code className="rounded bg-black/[0.05] px-1.5 py-0.5 font-mono text-[12.5px]">
              src/lib/reportStats.ts
            </code>{" "}
            to see it computed.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4">
            <Stat value={totalCourses} label="courses indexed" />
            <Stat value={platformsUsed} label="platforms represented" />
            <Stat value={totalLectures} label="lectures, real and playable" />
            <Stat value={Math.round(totalMinutes / 60)} suffix="h" label="of material, catalogue-wide" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", duration: 0.55, bounce: 0 }}
            className="mt-12 grid gap-6 lg:grid-cols-2"
          >
            <ChartCard
              title="Courses by platform"
              sub="Where the catalogue's 16 courses are actually indexed from."
            >
              <ChartContainer config={platformChartConfig} className="aspect-auto h-[280px] w-full">
                <BarChart data={platformChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} stroke="var(--color-border)" />
                  <XAxis
                    type="number" allowDecimals={false} domain={[0, "dataMax"]}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    type="category" dataKey="name" width={104}
                    tick={{ fontSize: 11.5, fill: "var(--color-foreground)", fontFamily: "Instrument Sans" }}
                    axisLine={false} tickLine={false}
                  />
                  <ChartTooltip cursor={{ fill: "var(--color-muted)" }} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                    {platformChartData.map((p) => <Cell key={p.id} fill={p.fill} />)}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </ChartCard>

            <ChartCard
              title="Average READY factors"
              sub={`Catalogue-wide average, out of 10. Composite average score: ${avgScore}/10.`}
            >
              <ChartContainer config={factorChartConfig} className="aspect-auto h-[220px] w-full">
                <BarChart data={factorChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} stroke="var(--color-border)" />
                  <XAxis
                    type="number" domain={[0, 10]}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    type="category" dataKey="label" width={84}
                    tick={{ fontSize: 11.5, fill: "var(--color-foreground)", fontFamily: "Instrument Sans" }}
                    axisLine={false} tickLine={false}
                  />
                  <ChartTooltip cursor={{ fill: "var(--color-muted)" }} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
                    {factorChartData.map((f) => <Cell key={f.key} fill={f.fill} />)}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </ChartCard>
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-2">
            {coursesByPlatform.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-3 py-1.5 text-[12px] font-medium"
              >
                <PlatformMark id={p.id} size={13} decorative />
                {p.name} <span className="opacity-40">· {p.count}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/** Counts up from zero the first time it scrolls into view. */
function Stat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const [target, setTarget] = useState(0);
  return (
    <motion.div
      onViewportEnter={() => setTarget(value)}
      viewport={{ once: true, margin: "-40px" }}
    >
      <div className="flex items-baseline gap-0.5 font-mono text-[32px] leading-none font-bold">
        <AnimatedNumber value={target} decimals={0} />
        {suffix && <span className="text-lg opacity-60">{suffix}</span>}
      </div>
      <p className="mt-2 text-[12.5px] leading-snug opacity-55">{label}</p>
    </motion.div>
  );
}

function ChartCard({
  title, sub, children,
}: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] bg-paper p-5 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
      <h3 className="text-[14px] font-bold tracking-tight">{title}</h3>
      <p className="mt-1 text-[12px] leading-snug opacity-55">{sub}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
