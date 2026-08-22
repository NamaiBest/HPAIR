import { Brand } from "@/components/Brand";
import { CASE_STATS } from "@/data/stats";
import { asset, cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The dark, photo-and-stats panel that makes the case for READY Hub.
 * Shared verbatim between the home page (as the hero) and onboarding
 * (as the persistent left rail), so moving from one into the other reads
 * as one continuous page rather than two different products.
 */
export function StoryPanel({
  onHome, className, children,
}: { onHome?: () => void; className?: string; children?: ReactNode }) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden bg-ink px-8 py-10 text-white sm:px-12 sm:py-14",
        className,
      )}
    >
      <img
        src={asset("/viethope/students-ydp2.jpg")} alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-40"
        style={{ outline: "none" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(160deg,rgba(6,39,44,.72),rgba(0,128,129,.62) 50%,rgba(6,39,44,.92))" }}
      />
      <div className="relative">
        <Brand light onHome={onHome} />
      </div>
      <div className="relative max-w-md">
        <h1 className="text-[38px] leading-[1.08] font-extrabold tracking-[-0.02em] sm:text-[44px] sm:leading-[1.03]">
          Thousands of courses exist. One score tells you which are worth your time.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-white/75">
          READY Hub reads the courses already out there, scores them honestly, and
          routes you to the few that fit where you are and where you are going.
        </p>
        {children}
      </div>
      <div className="relative grid grid-cols-2 gap-x-8 gap-y-6">
        {CASE_STATS.slice(0, 4).map((s) => (
          <div key={s.value}>
            <div className="font-mono text-3xl font-semibold text-leaf">{s.value}</div>
            <p className="mt-1.5 text-[12px] leading-snug text-white/65">{s.label}</p>
            <p className="mt-1 text-[10px] text-white/35">{s.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
