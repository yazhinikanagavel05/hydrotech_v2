import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

import SmartImage from "./SmartImage.jsx";
import { imgProps } from "../lib/img.js";

/** Large dark image card used for the three primary irrigation solutions. */
export function ServiceCard({ service, index }) {
  return (
    <article className="svc reveal">
      <div className="svc__img">
        <SmartImage
          {...imgProps(service.image, {
            sizes: "(max-width: 980px) 92vw, 30vw",
            style: { width: "100%", height: "100%" },
          })}
        />
      </div>
      <span className="svc__index">{String(index + 1).padStart(2, "0")}</span>
      <div className="svc__body">
        <span className="svc__kicker">{service.kicker}</span>
        <h3 className="t-h3 svc__title">{service.name}</h3>
        <p className="svc__text">{service.summary}</p>
        <Link to={service.href} className="svc__link">
          {service.cta}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

/** Light card for secondary service areas such as nursery or landscaping. */
export function ServiceCardLight({ service, index, ctaLabel = "Talk to HydroTech", ctaTo = "/contact" }) {
  return (
    <article className="svc2 reveal">
      <div className="svc2__img">
        <SmartImage
          {...imgProps(service.image, {
            sizes: "(max-width: 900px) 92vw, 46vw",
            style: { width: "100%", height: "100%" },
          })}
        />
      </div>
      <div className="svc2__body">
        {index != null && (
          <span className="t-eyebrow text-navy">{String(index + 1).padStart(2, "0")}</span>
        )}
        <h3 className="t-h3">{service.title}</h3>
        <p className="t-body svc2__desc">{service.description}</p>
        {service.points && (
          <ul className="stack-sm svc2__points">
            {service.points.slice(0, 3).map((p) => (
              <li key={p} className="tick">
                <Check size={15} aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        )}
        <Link to={ctaTo} className="link-arrow svc2__cta">
          {ctaLabel}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default ServiceCard;
