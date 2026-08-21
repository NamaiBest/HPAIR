import { cn } from "@/lib/utils";
import { PLATFORM_BY_ID } from "@/data/platforms";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium",
        "transition-[background-color,color,box-shadow,scale] duration-150",
        "active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40",
        size === "sm" && "h-10 px-4 text-[13px]",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-13 px-7 text-base",
        variant === "primary" &&
          "bg-flow text-white shadow-[0_1px_2px_rgb(6_39_44/0.2),0_6px_16px_-4px_rgb(20_189_208/0.5)] hover:bg-flow-dim",
        variant === "dark" && "bg-ink text-white hover:bg-ink-2",
        variant === "outline" && "bg-white text-ink shadow-[inset_0_0_0_1px_rgb(6_39_44/0.14)] hover:bg-silt-2",
        variant === "ghost" && "text-ink hover:bg-black/5",
        className,
      )}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[18px] bg-white",
        "shadow-[0_0_0_1px_rgb(6_39_44/0.07),0_1px_2px_rgb(6_39_44/0.05),0_8px_24px_-12px_rgb(6_39_44/0.14)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Real platform mark, tinted to the platform's own brand colour. */
export function PlatformMark({
  id,
  size = 16,
  showName = false,
  /** Set when the platform name is already visible next to the mark, so screen
   *  readers do not announce it twice. */
  decorative = false,
  className,
}: {
  id: string;
  size?: number;
  showName?: boolean;
  decorative?: boolean;
  className?: string;
}) {
  const p = PLATFORM_BY_ID[id];
  if (!p) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        aria-hidden
        style={{
          width: size,
          height: size,
          backgroundColor: p.hex,
          WebkitMaskImage: `url(${p.logo})`,
          maskImage: `url(${p.logo})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          flexShrink: 0,
        }}
      />
      {showName && <span className="truncate">{p.name}</span>}
      {!showName && !decorative && <span className="sr-only">{p.name}</span>}
    </span>
  );
}

export function Chip({
  active,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium whitespace-nowrap",
        "transition-[background-color,color,box-shadow,scale] duration-150 active:scale-[0.96]",
        active
          ? "bg-ink text-white"
          : "bg-white text-ink/75 shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] hover:text-ink hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.24)]",
        className,
      )}
    />
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold">{label}</span>
        {hint && <span className="text-[11px] opacity-50">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
