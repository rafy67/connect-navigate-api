/**
 * REVEAL — scroll-triggered entrance animation.
 *
 * Wrap any block to make it fade + travel in the first time it enters the
 * viewport. Respects the user's reduced-motion preference.
 */
import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Direction = "up" | "down" | "left" | "right" | "fade" | "zoom";

const OFFSET: Record<Direction, { x?: number; y?: number; scale?: number }> = {
  up: { y: 42 },
  down: { y: -42 },
  left: { x: -56 },
  right: { x: 56 },
  fade: {},
  zoom: { scale: 0.9 },
};

/**
 * Guards against un-triggerable reveals: when a block is taller than the
 * viewport (very common on phones), a ratio threshold can never be met, so the
 * content would stay invisible forever. In that case fall back to "some".
 */
function useSafeAmount(amount: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [safe, setSafe] = useState<number | "some">(amount);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const h = el.getBoundingClientRect().height;
      setSafe(h > 0 && h * amount > window.innerHeight * 0.75 ? "some" : amount);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [amount]);

  return { ref, safe };
}

export function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.7,
  amount = 0.25,
  className,
}: {
  children: ReactNode;
  from?: Direction;
  delay?: number;
  duration?: number;
  amount?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { ref, safe } = useSafeAmount(amount);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: 0, y: 0, scale: 1, ...OFFSET[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: safe }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}


/** Staggered children container — pair with <RevealItem>. */
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const { ref, safe } = useSafeAmount(0.2);
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: safe }}
    >
      {children}
    </motion.div>
  );
}


export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
