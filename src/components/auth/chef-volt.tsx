import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChefHat, Pause, Play } from "lucide-react";

import type { ChefVolt } from "@/hooks/use-chef-volt";
import { readCalmOverride, setCalmOverride } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Chef Volt — the dough-guarding robot mascot who reacts to the auth form:
 * follows the cursor, watches you type, turns around for passwords and
 * throws confetti when you're in.
 */
export function VoltRobot({ volt }: { volt: ChefVolt }) {
  const { mood, turned, blink, spinning, look, tilt } = volt;
  const eyesClosed = blink || turned;

  return (
    <div
      ref={volt.robotRef}
      className={cn("volt", turned && "volt-turned", spinning && "volt-spin", `volt-${mood}`)}
      style={
        {
          "--rx": `${tilt.rx}deg`,
          "--ry": `${tilt.ry}deg`,
          "--lx": `${look.x}px`,
          "--ly": `${look.y}px`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="volt-body">
        <span className="volt-antenna">
          <span className="volt-antenna-bulb" />
        </span>

        <div className="volt-hat">
          <span className="volt-hat-band" />
        </div>

        <div className="volt-head">
          <div className="volt-face">
            <span className={cn("volt-eye", eyesClosed && "volt-eye-shut")} />
            <span className={cn("volt-eye", eyesClosed && "volt-eye-shut")} />
            <span className={cn("volt-mouth", `volt-mouth-${mood}`)} />
            <span className="volt-blush volt-blush-l" />
            <span className="volt-blush volt-blush-r" />
          </div>
          <span className="volt-back">
            <span className="volt-bolt" />
            <span className="volt-bolt" />
          </span>
        </div>

        <div className="volt-torso">
          <span className="volt-chest">KMG</span>
          <span className="volt-arm volt-arm-l" />
          <span className="volt-arm volt-arm-r" />
        </div>
      </div>
      <span className="volt-shadow" />
    </div>
  );
}

export function VoltStrength({ volt }: { volt: ChefVolt }) {
  return (
    <div className="volt-meter">
      <div
        className="volt-meter-bars"
        role="progressbar"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={volt.strength}
        aria-valuetext={volt.strengthLabel}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn("volt-bar", volt.strength > i && `volt-bar-on volt-bar-${volt.strength}`)}
          />
        ))}
      </div>
      <span className="volt-meter-label">{volt.strengthLabel}</span>
    </div>
  );
}

/** Full auth layout: Chef Volt stage on one side, the form card on the other. */
export function VoltScene({
  volt,
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  volt: ChefVolt;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const [calm, setCalm] = useState(false);

  useEffect(() => setCalm(readCalmOverride()), []);

  return (
    <main
      className={cn(
        "auth-stage relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10 lg:py-14",
        volt.reducedMotion && "volt-calm",
      )}
    >
      <a href="#auth-form" className="volt-skip">
        Skip to the {title.toLowerCase()} form
      </a>

      <div ref={volt.sceneRef} className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1fr]">
        <section className="order-2 flex flex-col items-center lg:order-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-[11px] font-extrabold tracking-[0.24em] text-flame-dark uppercase"
          >
            <ChefHat className="h-4 w-4" aria-hidden="true" /> Kennedy Moon Grill
          </Link>

          {/* The bubble is the screen-reader voice of the whole scene. */}
          <div key={volt.popKey} className="volt-bubble" role="status" aria-live="polite" aria-atomic="true">
            {volt.line}
          </div>

          <VoltRobot volt={volt} />

          <p className="mt-4 max-w-xs text-center text-[11px] leading-relaxed text-charcoal/60">
            Chef Volt guards the dough — and your password. He looks away, promise.
          </p>

          <button
            type="button"
            aria-pressed={calm}
            onClick={() => {
              const next = !calm;
              setCalm(next);
              setCalmOverride(next);
              volt.say(next ? "Calm mode on. I'll stand very still." : "Motion back on. Let's dance.");
            }}
            className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-charcoal/15 px-4 py-2 font-display text-[10px] font-extrabold tracking-[0.16em] text-charcoal/70 uppercase transition hover:border-flame hover:text-flame focus-visible:ring-2 focus-visible:ring-flame focus-visible:outline-none"
          >
            {calm ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
            {calm ? "Calm mode on" : "Calm mode off"}
          </button>
        </section>

        <section
          id="auth-form"
          aria-labelledby="auth-title"
          className={cn("auth-card order-1 w-full p-6 sm:p-8 lg:order-2", volt.shaking && "volt-shake")}
        >
          <p className="font-display text-[11px] font-extrabold tracking-[0.28em] text-flame uppercase">{eyebrow}</p>
          <h1
            id="auth-title"
            className="mt-2 font-display text-3xl leading-none font-black tracking-tight text-charcoal uppercase sm:text-4xl"
          >
            {title}
          </h1>
          <p className="mt-2 text-sm text-charcoal/65">{subtitle}</p>

          <div className="mt-6">{children}</div>

          <div className="mt-6 border-t border-charcoal/10 pt-4 text-center text-xs text-charcoal/65">{footer}</div>
        </section>
      </div>
    </main>
  );
}

