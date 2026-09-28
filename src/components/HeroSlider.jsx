import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import SmartImage from "./SmartImage.jsx";
import Button from "./Button.jsx";
import { useReducedMotion } from "../hooks/useMediaQuery.js";
import { imgProps } from "../lib/img.js";

/**
 * Full-bleed hero slider.
 *
 * Autoplays, pauses on hover or keyboard focus, supports touch swipe and
 * arrow-key navigation, and exposes proper labels for screen readers.
 */
export default function HeroSlider({ slides, interval = 6500, label = "Featured irrigation solutions" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reduced = useReducedMotion();
  const touchX = useRef(null);
  const stageRef = useRef(null);
  const count = slides.length;

  const go = useCallback((next) => setIndex(((next % count) + count) % count), [count]);

  // Only the visible slide's copy is rendered. Keeping one copy in the flow is
  // what guarantees the controls always have their own space below it.
  const slide = slides[index];

  // Autoplay pauses on hover/focus and whenever reduced motion is requested.
  const autoplayPaused = paused || reduced || userPaused || count < 2;

  useEffect(() => {
    if (autoplayPaused) return;
    const t = setTimeout(() => go(index + 1), interval);
    return () => clearTimeout(t);
  }, [index, autoplayPaused, interval, go]);

  // Never leave the page sitting on an autoplaying timer.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Off-screen slides keep their markup for the cross-fade, but are taken out of
  // the tab order and the accessibility tree. `inert` is applied imperatively
  // because React still expects the object form on the version in use here.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    [...stage.querySelectorAll(".hero__slide")].forEach((node, i) => {
      const hidden = i !== index;
      node.toggleAttribute("inert", hidden);
      if (hidden) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    });
  }, [index, count]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {/* Layer 1 + 2: the photograph and its directional scrim. The slides hold
          nothing but the image, so the cross-fade can never drag the copy or the
          controls with it. */}
      <div className="hero__stage" ref={stageRef}>
        {slides.map((slide, i) => (
          <div
            key={slide.id ?? i}
            className={`hero__slide ${i === index ? "is-active" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${slide.label}`}
          >
            <div className="hero__img">
              <SmartImage
                {...imgProps(slide.image, {
                  alt: "",
                  sizes: "100vw",
                  style: { width: "100%", height: "100%" },
                  eager: i === 0,
                })}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Layer 3: the copy. This is the only in-flow child above the controls,
          so the controls row below always has its own reserved space and can
          never be overlapped by the heading or the CTA buttons. */}
      <div className="hero__body-row">
        <div className="hero__inner on-photo">
          <div className="hero__body" key={slide.id ?? index}>
            <span className="hero__label hero__anim">
              <b>{String(index + 1).padStart(2, "0")}</b>
              {slide.label}
            </span>
            <h1 className="t-display hero__title hero__anim">
              {slide.title} {slide.accent && <em>{slide.accent}</em>}
            </h1>
            <p className="hero__text hero__anim">{slide.text}</p>
            <div className="hero__actions hero__anim">
              <Button to={slide.ctaTo} variant="lime" size="lg" icon={ChevronRight}>
                {slide.cta}
              </Button>
              {slide.secondaryCta && (
                <Button to={slide.secondaryTo} variant="onDark" size="lg" icon={ChevronRight}>
                  {slide.secondaryCta}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Layer 4: the controls, in their own row. Plain buttons rather than a
          tablist: these switch slides, they do not select tab panels, so
          `aria-current` is the honest signal. */}
      <div className="hero-controls">
        <div className="hero__dots" role="group" aria-label="Choose a slide">
          {slides.map((slide, i) => (
            <button
              key={slide.id ?? i}
              type="button"
              className="hero__dot"
              aria-current={i === index ? "true" : undefined}
              aria-label={`Show slide ${i + 1}: ${slide.label}`}
              onClick={() => go(i)}
              style={{ "--hero-interval": `${interval}ms` }}
            >
              <i />
            </button>
          ))}
        </div>

        <div className="hero__counter" aria-hidden="true">
          <b>{String(index + 1).padStart(2, "0")}</b> / {String(count).padStart(2, "0")}
        </div>

        <div className="slider__nav">
          <button
            type="button"
            className="sbtn"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Resume slideshow" : "Pause slideshow"}
            aria-pressed={userPaused}
          >
            {userPaused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="sbtn"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
          >
            <ChevronLeft size={19} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="sbtn"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
          >
            <ChevronRight size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
