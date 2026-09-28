import { useEffect, useRef, useState } from "react";

/**
 * Reveals `.reveal` / `.reveal-img` elements as they scroll into view.
 * Runs once per location key so a route change re-triggers the animation.
 */
export function useReveal(dep) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".reveal, .reveal-img"));
    if (!nodes.length) return;

    const show = (n) => n.classList.add("is-in");

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((n) => {
      const rect = n.getBoundingClientRect();
      // Anything already on screen reveals at once, so there is no flash and
      // nothing above the fold is ever hidden behind a scroll event.
      if (rect.top < window.innerHeight * 0.92) {
        show(n);
        return;
      }
      // Only hide below-the-fold elements once we know the observer is ready to
      // bring them back. This is the class that actually applies the transform.
      n.classList.add("is-armed");
      io.observe(n);
    });

    return () => {
      io.disconnect();
      // Leaving the class behind would strand a card at opacity 0 if the effect
      // is torn down before the element is revealed.
      document.querySelectorAll(".is-armed").forEach((n) => n.classList.remove("is-armed"));
    };
  }, [dep]);
}

/**
 * Tracks whether the page has scrolled past `offset`, used for the sticky header.
 */
export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > offset);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [offset]);
  return scrolled;
}

/**
 * Locks body scroll while a modal or drawer is open.
 *
 * Also compensates for the scrollbar so locking does not shift the layout, and
 * nests safely if two overlays are open at once.
 */
let lockCount = 0;
let previousPaddingRight = "";

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;

    const { body } = document;
    if (lockCount === 0) {
      const gap = window.innerWidth - document.documentElement.clientWidth;
      previousPaddingRight = body.style.paddingRight;
      if (gap > 0) body.style.paddingRight = `${gap}px`;
    }
    lockCount += 1;
    body.classList.add("is-locked");

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        body.classList.remove("is-locked");
        body.style.paddingRight = previousPaddingRight;
      }
    };
  }, [active]);
}

/** Calls `handler` on Escape. */
export function useEscape(handler, active = true) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "Escape") ref.current?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);
}

/**
 * Confines Tab focus to a container while it is active, so keyboard users
 * cannot tab out of an open dialog and land on the page behind it.
 */
export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const items = [...node.querySelectorAll(selector)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [ref, active]);
}
