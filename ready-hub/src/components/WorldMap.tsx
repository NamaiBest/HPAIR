import { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  LAND_DOTS, MAP_H, MAP_W, MARKERS, REGION_DOTS, SOURCES,
} from "@/data/worldDots";

/**
 * The landing background: a dot map of the world with the five Mekong
 * countries picked out, and arcs flowing from the cities the big course
 * platforms broadcast from into the region READY serves.
 *
 * It is doing the same job the product does, which is why it is here rather
 * than as decoration. Purely presentational, so it is hidden from assistive
 * tech and stands down completely under reduced motion.
 */
function WorldMapBase() {
  const reduce = useReducedMotion();

  // Curve each arc so it reads as a path rather than a straight line.
  const arcs = SOURCES.map((s, i) => {
    const target = MARKERS[i % MARKERS.length];
    const mx = (s.x + target.x) / 2;
    const my = (s.y + target.y) / 2 - Math.abs(target.x - s.x) * 0.22;
    return { id: s.name, d: `M ${s.x} ${s.y} Q ${mx} ${my} ${target.x} ${target.y}`, source: s };
  });

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      <defs>
        <radialGradient id="rh-focus" cx="79%" cy="39%" r="26%">
          <stop offset="0%" stopColor="var(--color-flow)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-flow)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rh-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-flow)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-flow)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-leaf)" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Soft glow over the region the platform serves */}
      <rect width={MAP_W} height={MAP_H} fill="url(#rh-focus)" />

      {/* The rest of the world, quiet */}
      <g fill="var(--color-ink)" opacity="0.22">
        {LAND_DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.7" />
        ))}
      </g>

      {/* The five countries, in brand colour */}
      <g fill="var(--color-flow)">
        {REGION_DOTS.map(([x, y], i) =>
          reduce ? (
            <circle key={i} cx={x} cy={y} r="3" opacity="0.9" />
          ) : (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.35, 0.95, 0.35] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 8) * 0.28,
              }}
            />
          ),
        )}
      </g>

      {/* Courses arriving from where the platforms are */}
      {!reduce && (
        <g fill="none" stroke="url(#rh-arc)" strokeWidth="2" strokeLinecap="round">
          {arcs.map((a, i) => (
            <path
              key={a.id}
              d={a.d}
              pathLength={1}
              className="rh-arc"
              style={{ animationDelay: `${i * 1}s` }}
            />
          ))}
        </g>
      )}

      {/* Origin cities */}
      <g fill="var(--color-ink)">
        {SOURCES.map((s) => (
          <circle key={s.name} cx={s.x} cy={s.y} r="2.6" opacity="0.4" />
        ))}
      </g>

      {/* Capitals, with a slow pulse */}
      <g>
        {MARKERS.map((m, i) => (
          <g key={m.name}>
            {!reduce && (
              <motion.circle
                cx={m.x}
                cy={m.y}
                fill="var(--color-flow)"
                initial={{ r: 3, opacity: 0.5 }}
                animate={{ r: [4, 20], opacity: [0.5, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: i * 0.55 }}
              />
            )}
            <circle cx={m.x} cy={m.y} r="3.6" fill="var(--color-deep)" />
            <circle cx={m.x} cy={m.y} r="1.5" fill="#fff" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export const WorldMap = memo(WorldMapBase);
