import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

import SmartImage from "./SmartImage.jsx";
import { imgProps } from "../lib/img.js";

/**
 * Project showcase card.
 *
 * It never shows a client name, acreage, saving percentage or date, because
 * none of that has been verified by HydroTech.
 */
export default function ProjectCard({ project }) {
  return (
    <article className="proj reveal">
      <div className="proj__img">
        <SmartImage
          {...imgProps(project.image, {
            sizes: "(max-width: 700px) 92vw, (max-width: 1000px) 46vw, 32vw",
            style: { width: "100%", height: "100%" },
          })}
        />
      </div>
      <div className="proj__body">
        <div className="proj__meta">
          {project.application && <span className="chip">{project.application}</span>}
          {project.solution && <span className="chip">{project.solution}</span>}
        </div>
        <h3 className="proj__title">{project.title}</h3>
        <p className="proj__text">{project.overview}</p>

        <div className="proj__foot">
          {project.location && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <MapPin size={14} aria-hidden="true" />
              {project.location}
            </span>
          )}
          <Link to="/contact" className="link-arrow" style={{ fontSize: "0.86rem" }}>
            Discuss a similar project
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
