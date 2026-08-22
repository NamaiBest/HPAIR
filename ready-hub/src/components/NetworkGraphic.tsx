import { motion } from "motion/react";

/**
 * A neutral, non-identifying visual for the landing page's case section.
 *
 * Deliberately not a photo of real people: this deck gets reused and demoed
 * beyond the students who happened to be in a VietHope photo. A node network
 * in brand colour reads as "community, connected" without depending on
 * anyone's face, and ties visually to the community/collaborate features
 * lower on the page.
 */
const NODES = [
  { x: 60, y: 70, r: 7, c: "var(--color-flow)" },
  { x: 190, y: 40, r: 5, c: "var(--color-leaf)" },
  { x: 300, y: 90, r: 6, c: "var(--color-flow)" },
  { x: 420, y: 50, r: 5, c: "var(--color-amber)" },
  { x: 520, y: 100, r: 7, c: "var(--color-leaf)" },
  { x: 140, y: 150, r: 5, c: "var(--color-deep)" },
  { x: 260, y: 180, r: 6, c: "var(--color-flow)" },
  { x: 390, y: 160, r: 5, c: "var(--color-leaf)" },
  { x: 480, y: 200, r: 6, c: "var(--color-amber)" },
  { x: 40, y: 190, r: 4, c: "var(--color-deep)" },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
  [1, 6], [2, 7], [5, 9], [4, 8], [0, 6],
];

export function NetworkGraphic({ className }: { className?: string }) {
  return (
    <div className={className} style={{ background: "var(--color-ink)" }}>
      <svg viewBox="0 0 560 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
        <defs>
          <radialGradient id="ng-glow" cx="55%" cy="45%" r="65%">
            <stop offset="0%" stopColor="var(--color-flow)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--color-flow)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="560" height="240" fill="url(#ng-glow)" />

        <g stroke="var(--color-flow)" strokeOpacity="0.22" strokeWidth="1.2">
          {EDGES.map(([a, b], i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />
          ))}
        </g>

        {NODES.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.c}
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.08, 0.9] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: (i % 6) * 0.35 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
      </svg>
    </div>
  );
}
