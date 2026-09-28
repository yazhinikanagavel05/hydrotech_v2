import { useState, useEffect, useCallback, useRef } from "react";
import { IMAGE_FALLBACK } from "../data/images.js";

/**
 * Image with a responsive `srcSet`, a blurred placeholder (LQIP) while it
 * loads, and a clean fallback if the file is missing.
 *
 * Every photograph on the site goes through this component, so a broken path
 * never leaves a hole in the layout and every image ships at a sensible size.
 */
export default function SmartImage({
  src,
  srcSet,
  lqip,
  alt = "",
  className = "",
  style,
  loading = "lazy",
  sizes,
  width,
  height,
  focal,
  eager = false,
  children,
}) {
  const [current, setCurrent] = useState(src);
  const [currentSet, setCurrentSet] = useState(srcSet);
  const [state, setState] = useState("loading");

  // A new src (slider advance, filter change) restarts the loading state. Done
  // in an effect rather than during render so React never warns about updating
  // state while rendering.
  useEffect(() => {
    setCurrent((prev) => (prev === src ? prev : src));
    setCurrentSet((prev) => (prev === srcSet ? prev : srcSet));
    setState((prev) => (current === src ? prev : "loading"));
    // `current` is read to detect an actual change; not tracking it avoids a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, srcSet]);

  // Try the branded fallback once; if that also fails, stay on the neutral
  // placeholder rather than looping.
  const fallbackTried = useRef(current === IMAGE_FALLBACK.src);

  useEffect(() => {
    if (current !== IMAGE_FALLBACK.src) fallbackTried.current = false;
  }, [current]);

  const fail = useCallback(() => {
    setState("error");
    if (!fallbackTried.current) {
      fallbackTried.current = true;
      setCurrent(IMAGE_FALLBACK.src);
      setCurrentSet(undefined);
    }
  }, []);

  return (
    <div
      className={`simg ${state === "loaded" ? "is-loaded" : ""} ${className}`}
      style={{ ...style, ...(lqip && state !== "loaded" ? { backgroundImage: `url(${lqip})` } : null) }}
    >
      <img
        src={current}
        srcSet={currentSet}
        sizes={sizes}
        alt={state === "error" ? IMAGE_FALLBACK.alt : alt}
        loading={eager ? "eager" : loading}
        decoding="async"
        // React 18 does not know `fetchPriority`; it is passed through with the
        // lowercase DOM attribute name so React does not warn and strip it.
        {...(eager ? { fetchpriority: "high" } : { fetchpriority: "low" })}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: focal,
        }}
        onLoad={() => setState("loaded")}
        onError={fail}
      />
      {state === "error" && (
        <div className="simg__fallback" aria-hidden="true">
          HydroTech Irrigation
        </div>
      )}
      {children}
    </div>
  );
}
