import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up from zero the first time it scrolls into view.
 *
 * Uses IntersectionObserver directly rather than a hook, with two guarantees
 * that matter more than the animation itself: it starts immediately if the
 * element is already on screen at mount, and a fallback timer snaps to the
 * real value regardless. A headline number must never be left reading zero.
 */
export function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  const started = useRef(false);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Read the preference here rather than via a hook. useReducedMotion resolves
    // from null to false on a later render, which would re-run this effect and
    // let the cleanup cancel an animation that is already in flight.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let fallback = 0;

    const run = () => {
      if (started.current) return;
      started.current = true;
      if (reduce) {
        setShown(value);
        done.current = true;
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // ease-out quart: quick departure, long settle
        const eased = 1 - Math.pow(1 - t, 4);
        setShown(Math.round(value * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
        else done.current = true;
      };
      raf = requestAnimationFrame(tick);
    };

    // Already visible? Start now rather than waiting on an intersection.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      run();
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);

    // Whatever happens, show the real figure.
    fallback = window.setTimeout(() => {
      if (!done.current) {
        done.current = true;
        setShown(value);
      }
    }, 2600);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      // StrictMode mounts, cleans up, then mounts again. Without this the
      // cancelled run would be treated as already started and never restart.
      if (!done.current) started.current = false;
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString()}
    </span>
  );
}
