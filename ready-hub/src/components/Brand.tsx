import { asset, cn } from "@/lib/utils";

export function Brand({
  light = false,
  size = "md",
  onHome,
}: {
  light?: boolean;
  /** "lg" is for the landing header, where the product name should carry. */
  size?: "md" | "lg";
  onHome?: () => void;
}) {
  const Tag = onHome ? "button" : "div";
  const lg = size === "lg";
  return (
    <Tag
      onClick={onHome}
      className={cn(
        "flex items-center",
        lg ? "gap-3.5" : "gap-3",
        onHome && "-m-1 rounded-full p-1 transition-opacity duration-150 hover:opacity-70 active:scale-[0.98]",
      )}
    >
      <img
        src={asset("/viethope/viethope-logo.png")}
        alt="VietHope"
        className={cn("w-auto", lg ? "h-11" : "h-9")}
        style={{ outline: "none", filter: light ? "brightness(0) invert(1)" : undefined }}
      />
      <span
        className={cn(
          "w-px",
          lg ? "h-8" : "hidden h-6 sm:block",
          light ? "bg-white/25" : "bg-black/12",
        )}
      />
      <span
        className={cn(
          "font-display font-extrabold tracking-[-0.02em]",
          lg ? "text-[22px] sm:text-[26px]" : "hidden text-[15px] font-bold sm:block",
          light && "text-white",
        )}
      >
        READY&nbsp;Hub
      </span>
    </Tag>
  );
}
