import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Globe } from "lucide-react";
import { LANGS, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.id === lang) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Language"
        className={cn(
          "flex h-11 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold",
          "transition-[background-color,box-shadow,scale] duration-150 active:scale-[0.96]",
          dark
            ? "bg-white/12 text-white hover:bg-white/20"
            : "bg-white text-ink shadow-[inset_0_0_0_1px_rgb(6_39_44/0.12)] hover:shadow-[inset_0_0_0_1px_rgb(6_39_44/0.26)]",
        )}
      >
        <Globe className="size-3.5 opacity-60" />
        {current.short}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ type: "spring", duration: 0.28, bounce: 0 }}
            className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-[14px] bg-white p-1.5 shadow-[0_0_0_1px_rgb(6_39_44/0.09),0_18px_44px_-16px_rgb(6_39_44/0.4)]"
          >
            {LANGS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => { setLang(l.id); setOpen(false); }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-[10px] px-3 py-2.5 text-left text-[13px] transition-colors",
                    lang === l.id ? "bg-flow/12 font-semibold text-deep" : "hover:bg-black/[0.04]",
                  )}
                >
                  {l.name}
                  {lang === l.id && <Check className="size-3.5 shrink-0" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
