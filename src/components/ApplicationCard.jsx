import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

import SmartImage from "./SmartImage.jsx";
import { imgProps } from "../lib/img.js";

/** Overlay image card for the applications grid. */
export function ApplicationCard({ application, ctaLabel = "Enquire about this", ctaTo = "/contact" }) {
  return (
    <article className="acard reveal">
      <div className="acard__img">
        <SmartImage
          {...imgProps(application.image, {
            sizes: "(max-width: 700px) 92vw, (max-width: 1000px) 46vw, 30vw",
            style: { width: "100%", height: "100%" },
          })}
        />
      </div>
      <div className="acard__body">
        <span className="acard__kicker">{application.kicker}</span>
        <h3 className="t-h3 acard__title">{application.title}</h3>
        <p className="acard__text">{application.description}</p>
        <Link to={ctaTo} className="link-arrow" style={{ color: "#fff" }}>
          {ctaLabel}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

/** Editorial split block used on the Applications page. */
export function ApplicationRow({ application, index, flip = false }) {
  return (
    <article className={`approw ${flip ? "approw--flip" : ""} reveal`} id={application.id}>
      <div className="approw__media">
        <SmartImage
          {...imgProps(application.image, {
            sizes: "(max-width: 860px) 92vw, 46vw",
            style: { width: "100%", height: "100%" },
          })}
        />
        <span className="approw__num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="approw__body">
        <span className="approw__kicker">{application.kicker}</span>
        <h2 className="t-h2">{application.title}</h2>
        <p className="t-lead">{application.description}</p>
        <ul className="approw__list">
          {application.points.map((p) => (
            <li key={p}>
              <Check size={16} aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
        <Link to="/contact" className="btn btn--primary" style={{ marginTop: 6 }}>
          Enquire about {application.title.toLowerCase()}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default ApplicationCard;
