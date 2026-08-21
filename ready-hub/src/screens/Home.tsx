import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ArrowRight } from "lucide-react";
import { Brand } from "./Onboarding";
import { Button, PlatformMark } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { CASE_STATS, ORG } from "@/data/stats";
import {
  avgFactors, avgScore, coursesByPlatform, platformsUsed, totalCourses, totalLectures, totalMinutes,
} from "@/lib/reportStats";
import { asset } from "@/lib/utils";

export function Home({
  onboarded, onGetStarted, onContinue,
}: {
  onboarded: boolean;
  onGetStarted: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="mx-auto flex max-w-[1100px] items-center px-5 py-6 lg:px-8">
        <Brand />
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-5 pt-6 pb-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-flow/10 px-3 py-1.5 text-[12.5px] font-semibold text-deep">
              A VietHope programme
            </span>
            <h1 className="mt-5 max-w-lg text-[42px] leading-[1.05] font-extrabold tracking-[-0.025em]">
              Thousands of courses exist. One score tells you which are worth your time.
            </h1>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed opacity-60">
              READY Hub indexes courses already out there, scores them on what actually matters,
              and routes you to the ones that fit where you are and where you're going.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {onboarded ? (
                <>
                  <Button size="lg" onClick={onContinue}>
                    Go to my courses <ArrowRight className="size-4" />
                  </Button>
                  <button
                    onClick={onGetStarted}
                    className="text-[13.5px] font-medium opacity-55 transition-opacity hover:opacity-100"
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.55, bounce: 0, delay: 0.1 }}
            className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-ink"
          >
            <img
              src={asset("/viethope/students-ydp1.jpg")} alt=""
              className="size-full object-cover opacity-90"
            />
            <span
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(200deg,transparent 40%,rgba(6,39,44,.7))" }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-[13px] leading-snug opacity-80">
                VietHope has funded {ORG.scholarships} scholarships since {ORG.since}.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Impact report ────────────────────────────────────── */}
      <section className="border-t border-black/[0.06] bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-16 lg:px-8">
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em]">Why this exists</h2>
          <p className="mt-2 max-w-lg text-[14.5px] opacity-55">
            The gap READY Hub is built to close, from the case research behind this programme.
          </p>

          <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {CASE_STATS.map((s) => (
              <div key={s.value}>
                <div className="font-mono text-4xl font-semibold text-flow">{s.value}</div>
                <p className="mt-2 text-[13px] leading-snug opacity-65">{s.label}</p>
                <p className="mt-1.5 text-[11px] opacity-40">{s.source}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-16 text-[26px] font-extrabold tracking-[-0.02em]">
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
            <Stat value={`${Math.round(totalMinutes / 60)}h`} label="of material, catalogue-wide" />
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Courses by platform"
              sub="Where the catalogue's 16 courses are actually indexed from."
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={coursesByPlatform} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(6,39,44,0.08)" />
                  <XAxis type="number" allowDecimals={false} domain={[0, "dataMax"]} tick={{ fontSize: 11, fill: "rgba(6,39,44,0.5)" }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category" dataKey="name" width={104}
                    tick={{ fontSize: 11.5, fill: "rgba(6,39,44,0.75)", fontFamily: "Instrument Sans" }}
                    axisLine={false} tickLine={false}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16} isAnimationActive={false}>
                    {coursesByPlatform.map((p) => (
                      <Cell key={p.id} fill={p.hex} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Average READY factors"
              sub={`Catalogue-wide average, out of 10. Composite average score: ${avgScore}/10.`}
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={avgFactors} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(6,39,44,0.08)" />
                  <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11, fill: "rgba(6,39,44,0.5)" }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category" dataKey="label" width={84}
                    tick={{ fontSize: 11.5, fill: "rgba(6,39,44,0.75)", fontFamily: "Instrument Sans" }}
                    axisLine={false} tickLine={false}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22} isAnimationActive={false}>
                    {avgFactors.map((f) => (
                      <Cell key={f.key} fill={f.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

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

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <div className="font-mono text-[32px] leading-none font-bold tabular-nums">{value}</div>
      <p className="mt-2 text-[12.5px] leading-snug opacity-55">{label}</p>
    </div>
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
