import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useT();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full p-0.5",
        dark ? "bg-white/12" : "bg-black/[0.06]",
      )}
      role="group"
      aria-label="Language"
    >
      {(["en", "vi"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "h-8 rounded-full px-3 text-[12px] font-semibold transition-[background-color,color] duration-150",
            lang === l
              ? dark ? "bg-white text-ink" : "bg-white text-ink shadow-sm"
              : dark ? "text-white/60 hover:text-white" : "text-ink/50 hover:text-ink",
          )}
        >
          {l === "en" ? "EN" : "VI"}
        </button>
      ))}
    </div>
  );
}
