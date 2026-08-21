import { cn } from "@/lib/utils";

export function Footer({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <footer
      className={cn(
        "px-5 py-6 text-center text-[11.5px] lg:px-8",
        dark ? "border-t border-white/10 text-white/35" : "border-t border-black/[0.06] opacity-40",
        className,
      )}
    >
      READY Hub — built for the VietHope Impact Challenge by Namai Chandra · Team V13
    </footer>
  );
}
