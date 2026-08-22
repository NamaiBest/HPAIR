import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check, Plus, Users } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { PITCHES } from "@/data/collaborate";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function CollaboratePage({ field, onBack, onHome }: { field: string; onBack: () => void; onHome: () => void }) {
  const { t } = useT();
  const [requested, setRequested] = useState<Set<string>>(new Set());

  // Pitches looking for the visitor's own field surface first.
  const sorted = [...PITCHES].sort((a, b) => {
    const aMatch = a.roles.some((r) => !r.filled && r.role.toLowerCase().includes(field.toLowerCase().split(" ")[0]));
    const bMatch = b.roles.some((r) => !r.filled && r.role.toLowerCase().includes(field.toLowerCase().split(" ")[0]));
    return Number(bMatch) - Number(aMatch);
  });

  const toggle = (id: string) => {
    setRequested((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[860px] items-center gap-3 px-5 py-3.5">
          <Brand onHome={onHome} />
          <Button variant="ghost" size="sm" className="ml-auto" onClick={onBack}>
            <ArrowLeft className="size-4" /> {t("nav.home")}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[860px] px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-extrabold tracking-[-0.02em]">{t("cl.title")}</h1>
            <p className="mt-2 max-w-[54ch] text-[14.5px] leading-relaxed opacity-55">{t("cl.sub")}</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            <Plus className="size-4" /> {t("cl.pitchYours")}
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {sorted.map((p, i) => {
            const open = p.roles.filter((r) => !r.filled).length;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0, delay: i * 0.06 }}
                className="flex flex-col rounded-[18px] bg-white p-5 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-flow/12 px-2.5 py-1 text-[11px] font-semibold text-deep">{p.tag}</span>
                  <span className="ml-auto flex items-center gap-1 text-[12px] opacity-50">
                    <Users className="size-3.5" /> {open} {t("cl.openRoles")}
                  </span>
                </div>
                <h2 className="mt-3 text-[16.5px] leading-snug font-bold">{p.title}</h2>
                <p className="mt-1.5 text-[12.5px] opacity-55">
                  {p.founder} · {p.founderField}
                </p>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed opacity-70">{p.pitch}</p>

                <div className="mt-4 flex flex-col gap-1.5">
                  {p.roles.map((r) => (
                    <div
                      key={r.role}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-[12.5px]",
                        r.filled ? "bg-black/[0.03] opacity-50" : "bg-flow/[0.06]",
                      )}
                    >
                      <span className="font-medium">{r.role}</span>
                      {r.filled ? (
                        <span className="flex items-center gap-1 text-[11px]">
                          <Check className="size-3" /> {t("cl.filled")}
                        </span>
                      ) : (
                        <button
                          onClick={() => toggle(`${p.id}-${r.role}`)}
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-150",
                            requested.has(`${p.id}-${r.role}`)
                              ? "bg-leaf/20 text-leaf-dim"
                              : "bg-ink text-white hover:bg-ink-2",
                          )}
                        >
                          {requested.has(`${p.id}-${r.role}`) ? (
                            <span className="flex items-center gap-1"><Check className="size-3" /> {t("cl.requested")}</span>
                          ) : (
                            t("cl.request")
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[11.5px] opacity-40">{t("cl.dummyNote")}</p>
      </main>

      <Footer />
    </div>
  );
}
