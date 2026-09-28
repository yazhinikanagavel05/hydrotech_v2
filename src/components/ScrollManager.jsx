import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Marks that scripting is available, so CSS only hides elements that JS is
 * actually going to reveal again. Without this, a failed bundle would leave
 * the page blank.
 */
function markJsAvailable() {
  document.documentElement.classList.add("js");
}

if (typeof document !== "undefined") markJsAvailable();

/**
 * Restores scroll position on route change and supports in-page hash links
 * such as /irrigation#drip. Without this, a deep link lands mid-page or at the
 * top of the previous scroll offset.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(markJsAvailable, []);

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section is mounted before scrolling.
      const id = decodeURIComponent(hash.slice(1));
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 96;
          window.scrollTo({ top, behavior: "smooth" });
        } else if (attempts++ < 20) {
          requestAnimationFrame(tryScroll);
        }
      };
      requestAnimationFrame(tryScroll);
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash, key]);

  return null;
}
