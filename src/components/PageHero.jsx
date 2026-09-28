import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import SmartImage from "./SmartImage.jsx";
import { images } from "../data/images.js";
import { imgProps } from "../lib/img.js";

/**
 * Interior page hero: full-bleed photograph, breadcrumb, heading and actions.
 * `align="left"` keeps the text in the lower-left; `center` is used sparingly.
 */
export default function PageHero({ image, eyebrow, title, lead, actions, breadcrumb, children }) {
  return (
    <section className="phero">
      <div className="phero__bg" aria-hidden="true">
        <SmartImage
          {...imgProps(image ?? images.aboutMain, {
            alt: "",
            sizes: "100vw",
            style: { width: "100%", height: "100%" },
            eager: true,
          })}
        />
      </div>
      <div className="phero__inner on-photo">
        {breadcrumb && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{breadcrumb}</span>
          </nav>
        )}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="t-h1 phero__title">{title}</h1>
        {lead && <p className="t-lead phero__lead">{lead}</p>}
        {actions && <div className="phero__actions">{actions}</div>}
        {children}
      </div>
    </section>
  );
}

/** Convenience wrapper so pages can pass a plain button pair. */
export function PageHeroActions({ children }) {
  return <div className="phero__actions">{children}</div>;
}

export const heroCtaIcon = ArrowRight;
