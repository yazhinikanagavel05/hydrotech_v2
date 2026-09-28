import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone, ArrowRight } from "lucide-react";

import { navItems } from "../data/nav.js";
import { phoneNumbers, address, email } from "../data/site.js";
import { images } from "../data/images.js";
import { useScrolled, useScrollLock, useEscape, useFocusTrap } from "../hooks/useUi.js";
import Button from "./Button.jsx";

/**
 * Routes whose first screen is a photograph. Over these the header uses the
 * light (on-photo) treatment: white text, a lime accent and a dark scrim,
 * whatever the image behind it happens to be. Any other route — the 404, or
 * a page added later without a hero — gets the solid paper header, which is
 * always readable.
 */
const routesWithPhotoHero = new Set([
  "/",
  "/irrigation",
  "/products",
  "/applications",
  "/projects",
  "/about",
  "/contact",
]);

/**
 * Sticky site header.
 *
 * Sits transparent over a page hero (showing the light logo, white links and a
 * lime CTA) and switches to a solid paper background with the dark logo once
 * the user scrolls.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(24);
  const location = useLocation();

  const overHero = routesWithPhotoHero.has(location.pathname) && !scrolled;
  // The logo is swapped in markup, not with CSS, so assistive tech is not given
  // two copies of the same alt text.
  const useLightLogo = overHero && !open;

  const burger = useRef(null);
  const drawer = useRef(null);

  useScrollLock(open);
  useEscape(() => setOpen(false), open);
  useFocusTrap(drawer, open);

  // Moving focus into the drawer and returning it to the toggle keeps keyboard
  // and screen-reader users from being left behind the overlay.
  useEffect(() => {
    if (!open) return;
    const first = drawer.current?.querySelector("a, button");
    first?.focus();
    return () => burger.current?.focus();
  }, [open]);

  // Close the drawer whenever the route changes (including browser back).
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <header
        className={`hdr ${scrolled ? "is-stuck" : ""} ${overHero ? "is-overHero" : ""} ${
          open ? "is-open" : ""
        }`}
      >
        <div className="hdr__inner">
          <Link
            to="/"
            className="hdr__logo"
            aria-label="HydroTech Irrigation — home"
            onClick={() => setOpen(false)}
          >
            {useLightLogo ? (
              <img
                src={images.brand.logoLight}
                alt="HydroTech Irrigation"
                width="1000"
                height="360"
              />
            ) : (
              <img
                src={images.brand.logoDark}
                alt="HydroTech Irrigation"
                width="1000"
                height="360"
              />
            )}
          </Link>

          <nav className="hdr__nav" aria-label="Main">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `hdr__link ${isActive ? "is-active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Button to="/contact" className="hdr__cta btn--sm" icon={ArrowRight}>
            Get Irrigation Advice
          </Button>

          <button
            type="button"
            ref={burger}
            className="hdr__burger"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div
        id="mobile-nav"
        ref={drawer}
        className={`mnav ${open ? "is-open" : ""}`}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <nav className="mnav__list" aria-label="Main">
          {navItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${0.06 + i * 0.045}s` }}
              className={({ isActive }) => `mnav__link ${isActive ? "is-active" : ""}`}
            >
              {item.label}
              <ArrowRight size={20} aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        <div className="mnav__foot">
          <Button
            to="/contact"
            variant="lime"
            size="lg"
            icon={ArrowRight}
            onClick={() => setOpen(false)}
          >
            Get Irrigation Advice
          </Button>
          <div className="mnav__contact">
            <small>Call HydroTech</small>
            {phoneNumbers.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`}>
                <Phone
                  size={16}
                  style={{ display: "inline", verticalAlign: "-2px", marginRight: 8 }}
                  aria-hidden="true"
                />
                {p.display}
              </a>
            ))}
          </div>
          <p className="mnav__addr">
            {address.line1},<br />
            {address.line2}, {address.region} — {address.pin}
            <br />
            <a href={email.mailto} style={{ color: "var(--lime-soft)" }}>
              {email.address}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
