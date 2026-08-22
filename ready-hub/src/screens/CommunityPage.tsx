import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft, ArrowUp, MessageSquare, Sparkles, Send,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button, Chip } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { THREADS, type Role, type Thread } from "@/data/community";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ROLE_COLOR: Record<Role, string> = {
  Employer: "var(--color-flow)",
  Alumni: "var(--color-leaf)",
  Student: "var(--color-ink-3)",
};

export function CommunityPage({
  field, onBack, onHome, onExploreCourse,
}: {
  field: string;
  onBack: () => void;
  onHome: () => void;
  onExploreCourse: (courseId: string) => void;
}) {
  const { t } = useT();
  const [threads, setThreads] = useState(THREADS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "employer" | "field">("all");
  const [draft, setDraft] = useState("");
  const [posted, setPosted] = useState(false);

  const visible = threads.filter((th) => {
    if (filter === "employer") return th.replies.some((r) => r.role === "Employer");
    if (filter === "field") return th.field === field;
    return true;
  });

  const open = threads.find((th) => th.id === openId);

  const upvote = (threadId: string) => {
    setThreads((ts) => ts.map((th) => (th.id === threadId ? { ...th, upvotes: th.upvotes + 1 } : th)));
  };

  const post = () => {
    if (!draft.trim()) return;
    setThreads((ts) => [
      { id: `new-${Date.now()}`, author: "You", role: "Student", field, title: draft.trim(), body: "", upvotes: 1, replies: [] },
      ...ts,
    ]);
    setDraft("");
    setPosted(true);
    window.setTimeout(() => setPosted(false), 3200);
  };

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[760px] items-center gap-3 px-5 py-3.5">
          <Brand onHome={onHome} />
          <Button variant="ghost" size="sm" className="ml-auto" onClick={onBack}>
            <ArrowLeft className="size-4" /> {t("nav.home")}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5 py-10">
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="thread"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            >
              <button
                onClick={() => setOpenId(null)}
                className="flex items-center gap-1.5 text-[13px] font-medium opacity-55 transition-opacity hover:opacity-100"
              >
                <ArrowLeft className="size-3.5" /> {t("co.backToThreads")}
              </button>

              <div className="mt-5 rounded-[18px] bg-white p-6 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
                <ThreadMeta thread={open} />
                <h1 className="mt-3 text-[22px] leading-snug font-extrabold tracking-[-0.015em]">
                  {open.title}
                </h1>
                <p className="mt-3 text-[14.5px] leading-relaxed opacity-70">{open.body}</p>
                <UpvoteRow count={open.upvotes} onUpvote={() => upvote(open.id)} />
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {open.replies.map((r) => (
                  <div
                    key={r.id}
                    className={cn(
                      "rounded-[16px] bg-white p-5 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]",
                      r.recommendsCourseId && "ring-2 ring-flow/30",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar name={r.author} color={ROLE_COLOR[r.role]} />
                      <span className="text-[13.5px] font-semibold">{r.author}</span>
                      <RoleTag role={r.role} />
                    </div>
                    <p className="mt-3 text-[14px] leading-relaxed opacity-75">{r.body}</p>
                    {r.recommendsCourseId && (
                      <button
                        onClick={() => onExploreCourse(r.recommendsCourseId!)}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-flow/12 px-3.5 py-2 text-[12.5px] font-semibold text-deep transition-colors hover:bg-flow/20"
                      >
                        <Sparkles className="size-3.5" /> {t("co.exploreCourse")}
                      </button>
                    )}
                    <UpvoteRow count={r.upvotes} onUpvote={() => {}} small />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-[30px] font-extrabold tracking-[-0.02em]">{t("loop.forum.title")}</h1>
              <p className="mt-2 max-w-[54ch] text-[14.5px] leading-relaxed opacity-55">{t("loop.forum.desc")}</p>

              {/* Composer */}
              <div className="mt-6 rounded-[16px] bg-white p-4 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]">
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && post()}
                    placeholder={t("co.composerPlaceholder")}
                    className="h-11 flex-1 rounded-full bg-paper px-4 text-[13.5px] shadow-[inset_0_0_0_1px_rgb(6_39_44/0.1)] placeholder:opacity-40 focus:shadow-[inset_0_0_0_2px_var(--color-flow)] focus:outline-none"
                  />
                  <Button size="sm" onClick={post} disabled={!draft.trim()}>
                    <Send className="size-3.5" /> {t("co.post")}
                  </Button>
                </div>
                <AnimatePresence>
                  {posted && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="mt-2.5 text-[12px] text-leaf-dim"
                    >
                      {t("co.posted")}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Filters */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Chip active={filter === "all"} onClick={() => setFilter("all")}>{t("co.all")}</Chip>
                <Chip active={filter === "employer"} onClick={() => setFilter("employer")}>{t("co.employerAnswers")}</Chip>
                <Chip active={filter === "field"} onClick={() => setFilter("field")}>{t("co.myField")}</Chip>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {visible.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setOpenId(th.id)}
                    className="rounded-[16px] bg-white p-5 text-left shadow-[0_0_0_1px_rgb(6_39_44/0.07)] transition-shadow duration-150 hover:shadow-[0_0_0_1px_rgb(6_39_44/0.14),0_10px_26px_-16px_rgb(6_39_44/0.3)]"
                  >
                    <ThreadMeta thread={th} />
                    <h2 className="mt-2 text-[16px] leading-snug font-bold">{th.title}</h2>
                    {th.body && <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug opacity-55">{th.body}</p>}
                    <div className="mt-3 flex items-center gap-4 text-[12px] opacity-50">
                      <span className="flex items-center gap-1">
                        <ArrowUp className="size-3.5" /> {th.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="size-3.5" />
                        {th.replies.length} {th.replies.length === 1 ? t("co.reply") : t("co.replies")}
                      </span>
                      {th.replies.some((r) => r.recommendsCourseId) && (
                        <span className="ml-auto flex items-center gap-1 font-semibold text-deep">
                          <Sparkles className="size-3.5" /> {t("co.recommended")}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-8 text-center text-[11.5px] opacity-40">{t("co.dummyNote")}</p>
      </main>

      <Footer />
    </div>
  );
}

function ThreadMeta({ thread }: { thread: Thread }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={thread.author} color={ROLE_COLOR[thread.role]} />
      <span className="text-[13px] font-semibold">{thread.author}</span>
      <RoleTag role={thread.role} />
      <span className="ml-auto rounded-full bg-black/[0.05] px-2.5 py-1 text-[11px] font-medium opacity-60">
        {thread.field}
      </span>
    </div>
  );
}

function RoleTag({ role }: { role: Role }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
      style={{ background: `color-mix(in srgb, ${ROLE_COLOR[role]} 16%, white)`, color: ROLE_COLOR[role] }}
    >
      {role}
    </span>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <span
      className="grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
      style={{ background: color }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

function UpvoteRow({ count, onUpvote, small }: { count: number; onUpvote: () => void; small?: boolean }) {
  const { t } = useT();
  return (
    <button
      onClick={onUpvote}
      aria-label={t("co.upvote")}
      className={cn(
        "mt-3 inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-3 font-mono font-semibold transition-[background-color,scale] duration-150 hover:bg-black/[0.08] active:scale-[0.95]",
        small ? "h-7 text-[11.5px]" : "h-8 text-[12.5px]",
      )}
    >
      <ArrowUp className="size-3.5" /> {count}
    </button>
  );
}
