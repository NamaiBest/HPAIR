import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export function Footer({ dark = false, className }: { dark?: boolean; className?: string }) {
  const { t } = useT();
  return (
    <footer
      className={cn(
        "px-5 py-6 text-center text-[11.5px] lg:px-8",
        dark ? "border-t border-white/10 text-white/35" : "border-t border-black/[0.06] opacity-40",
        className,
      )}
    >
      {t("footer.credit")}
    </footer>
  );
}
