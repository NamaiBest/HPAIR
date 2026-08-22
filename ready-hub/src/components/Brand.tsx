import { asset, cn } from "@/lib/utils";

export function Brand({ light = false, onHome }: { light?: boolean; onHome?: () => void }) {
  const Tag = onHome ? "button" : "div";
  return (
    <Tag
      onClick={onHome}
      className={cn(
        "flex items-center gap-3",
        onHome && "-m-1 rounded-full p-1 transition-opacity duration-150 hover:opacity-70 active:scale-[0.98]",
      )}
    >
      <img
        src={asset("/viethope/viethope-logo.png")}
        alt="VietHope"
        className="h-9 w-auto"
        style={{ outline: "none", filter: light ? "brightness(0) invert(1)" : undefined }}
      />
      <span className={cn("hidden h-6 w-px sm:block", light ? "bg-white/25" : "bg-black/12")} />
      <span className={cn("hidden font-display text-[15px] font-bold tracking-tight sm:block", light && "text-white")}>
        READY&nbsp;Hub
      </span>
    </Tag>
  );
}
