import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * The one horizontal carousel in the site. Every card rail — products,
 * applications, projects — uses this component, so there is exactly one
 * implementation of "move the cards sideways".
 *
 * Architecture (CSS owns the layout, JavaScript owns the position):
 *
 *   .carousel
 *     .carousel__viewport      overflow: hidden  — clips the track
 *       .carousel__track       display: flex     — the moving row
 *         .carousel__slide     flex: 0 0 <width> — one card
 *     .carousel__controls      dedicated row, sibling of the viewport
 *       .carousel__progress
 *       .carousel__btn         <button type="button">
 *
 * Why the controls cannot navigate:
 *   · they are real `<button type="button">` elements, so they have no href
 *     and no router target;
 *   · they live in a sibling of the viewport, never inside a slide, so no card
 *     link can be their ancestor;
 *   · they are the only focusable elements in the controls row and they call
 *     `goTo` on this instance only — each carousel owns its own ref, so no
 *     control can reach another carousel;
 *   · they are given their own stacking layer (see .carousel__controls) so a
 *     card or a section link can never be painted over a control and steal the
 *     click.
 *
 * The page itself never scrolls sideways: the movement happens on the track's
 * `transform`, so only this viewport is affected.
 */
export default function Carousel({
  items,
  label = "Highlights",
  onDark = false,
  className = "",
}) {
  const viewport = useRef(null);
  const track = useRef(null);

  const [index, setIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Drag bookkeeping lives in a ref: it changes on every pointer move and must
  // not trigger a render.
  const drag = useRef({ x: 0, offset: 0, moved: false });
  // The live index, mirrored in a ref so the measuring effects can re-clamp it
  // without having to depend on the index state.
  const indexRef = useRef(0);
  // Set when a drag actually moved the track. The click that the browser fires
  // at the end of a drag is swallowed so releasing over a card link does not
  // navigate away. This only ever cancels a click the user produced by
  // dragging, never a deliberate tap.
  const suppressClick = useRef(false);

  const count = items.length;

  /* --- measurement ------------------------------------------------- */
  const metrics = useCallback(() => {
    const vp = viewport.current;
    const tr = track.current;
    // Nothing sensible to measure (not mounted yet, or a zero-width
    // container). Report a rail that cannot move rather than dividing by zero
    // and writing `translate3d(NaNpx, …)` into the style attribute.
    if (!vp || !tr) return { step: 0, maxOffset: 0, maxIndex: 0, visible: 1 };

    const slide = tr.firstElementChild;
    const gap = parseFloat(getComputedStyle(tr).columnGap) || 0;
    const step = slide ? slide.getBoundingClientRect().width + gap : vp.clientWidth;
    if (!Number.isFinite(step) || step <= 0) {
      return { step: 0, maxOffset: 0, maxIndex: 0, visible: 1 };
    }

    const maxOffset = Math.max(0, tr.scrollWidth - vp.clientWidth);
    // How many cards fit: used to keep the last position from overshooting.
    const visible = Math.max(1, Math.round((vp.clientWidth + gap) / step));
    // No overflow means there is nothing to scroll, so the arrows disable
    // rather than sitting there doing nothing.
    const maxIndex = maxOffset <= 0 ? 0 : Math.max(0, count - visible);

    return { step, maxOffset, maxIndex, visible };
  }, [count]);

  /* --- position ---------------------------------------------------- */
  const apply = useCallback(
    (next, m) => {
      const data = m ?? metrics();
      if (!data) return;
      const clamped = Math.min(Math.max(next, 0), data.maxIndex);
      const px = Math.min(clamped * data.step, data.maxOffset);
      indexRef.current = clamped;
      setIndex(clamped);
      setOffset(Number.isFinite(px) ? px : 0);
    },
    [metrics]
  );

  /* One re-measure path, used by both the ResizeObserver and the window
     resize listener. They used to be separate and the window path left the
     end index stale, so after a resize the arrows could stay disabled on a
     rail that had started overflowing. */
  const reconcile = useCallback(() => {
    const m = metrics();
    if (!m) return;
    setLastIndex(m.maxIndex);
    apply(indexRef.current, m);
  }, [apply, metrics]);

  useLayoutEffect(() => {
    reconcile();
    // Re-measuring on every render would fight the user's drag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, reconcile]);

  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    const ro = new ResizeObserver(reconcile);
    ro.observe(vp);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", reconcile);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", reconcile);
    };
  }, [reconcile]);

  /* --- movement ---------------------------------------------------- */
  const goTo = (next) => {
    const m = metrics();
    if (!m) return;
    apply(next, m);
  };

  const step = (dir) => goTo(index + dir);

  /* --- drag -------------------------------------------------------- */
  const onPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    drag.current = { x: e.clientX, offset, moved: false };
    suppressClick.current = false;
    // Keep receiving the move and the release even if the pointer strays off
    // the track, so a swipe cannot get stuck half way.
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      /* capture is an enhancement, not a requirement */
    }
    setDragging(true);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const m = metrics();
    if (!m) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    const next = drag.current.offset - dx;
    // A little resistance past either end, then a hard stop.
    const over = next < 0 ? next * 0.32 : next > m.maxOffset ? m.maxOffset + (next - m.maxOffset) * 0.32 : next;
    setOffset(over);
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    const m = metrics();
    if (!m) return;
    if (!drag.current.moved) {
      apply(index, m);
      return;
    }
    suppressClick.current = true;
    // Snap to whichever card is nearest the pointer.
    apply(Math.round(offset / m.step), m);
  };

  const onClickCapture = (e) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(lastIndex);
    }
  };

  if (count === 0) return null;

  const total = lastIndex + 1;
  const progress = total > 1 ? ((index + 1) / total) * 100 : 100;

  return (
    <div className={`carousel ${onDark ? "on-dark" : ""} ${className}`.trim()}>
      <div
        ref={viewport}
        className={`carousel__viewport ${dragging ? "is-dragging" : ""}`}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${label}. Use the left and right arrow keys, or the previous and next buttons, to move through the cards.`}
        onKeyDown={onKeyDown}
        onClickCapture={onClickCapture}
      >
        <div
          ref={track}
          className="carousel__track"
          style={{ transform: `translate3d(${-offset}px, 0, 0)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          {items.map((item, i) => (
            <div className="carousel__slide" key={item.key ?? i}>
              {item.node}
            </div>
          ))}
        </div>
      </div>

      <div className="carousel__controls">
        <div
          className="carousel__progress"
          role="progressbar"
          aria-label={`${label} position`}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          aria-valuetext={`Card ${index + 1} of ${count}`}
        >
          <i style={{ width: `${Math.max(12, progress)}%` }} />
        </div>

        <p className="carousel__count" aria-hidden="true">
          <b>{String(index + 1).padStart(2, "0")}</b> / {String(count).padStart(2, "0")}
        </p>

        <div className="carousel__btns">
          <button
            type="button"
            className="sbtn"
            onClick={() => step(-1)}
            disabled={index <= 0}
            aria-label={`Previous ${label.toLowerCase()}`}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="sbtn"
            onClick={() => step(1)}
            disabled={index >= lastIndex}
            aria-label={`Next ${label.toLowerCase()}`}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
