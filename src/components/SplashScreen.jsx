import { useEffect, useState } from "react";

import { useReducedMotion } from "../hooks/useMediaQuery.js";
import { company } from "../data/site.js";
import { images } from "../data/images.js";

const SEEN_KEY = "hydrotech.splash.seen";

/**
 * Short branded splash: a droplet falls, a ripple spreads, the logo rises.
 *
 * Shown once per session on the first visit only — returning visitors, and
 * anyone who prefers reduced motion, go straight to the site. Scroll is locked
 * while it is on screen so the page cannot be scrolled before it finishes.
 */
export default function SplashScreen() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
    try {
      return !sessionStorage.getItem(SEEN_KEY);
    } catch {
      // Storage blocked (private mode, strict settings) — still show the splash
      // rather than skipping the brand moment. It unmounts on a timer either way.
      return true;
    }
  });
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* nothing to do */
    }

    const root = document.documentElement;
    root.classList.add("is-splash");

    const out = setTimeout(() => setLeaving(true), 1500);
    const done = setTimeout(() => setVisible(false), 2150);

    return () => {
      clearTimeout(out);
      clearTimeout(done);
      root.classList.remove("is-splash");
    };
  }, [visible]);

  // Reduced motion can be switched on mid-session; do not keep the overlay up.
  useEffect(() => {
    if (reduced) setVisible(false);
  }, [reduced]);

  if (!visible) return null;

  return (
    <div
      className={`splash ${leaving ? "is-out" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${company.name}`}
    >
      <div className="splash__stage">
        <span className="splash__drop" aria-hidden="true" />
        <span className="splash__ripple" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <img className="splash__logo" src={images.brand.logoLight} alt="" />
        <span className="splash__line" aria-hidden="true" />
        <span className="splash__tag" aria-hidden="true">
          Irrigation · Products · Applications
        </span>
      </div>
    </div>
  );
}
