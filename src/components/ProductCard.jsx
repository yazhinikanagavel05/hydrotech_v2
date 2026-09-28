import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import SmartImage from "./SmartImage.jsx";
import { imgProps } from "../lib/img.js";

/**
 * Product category card.
 *
 * Shows image, category, name, short description and an enquiry link. Optional
 * `specs` render as a small definition list — only pass them when a real
 * datasheet exists. No prices are shown anywhere.
 */
export default function ProductCard({ product }) {
  return (
    <article className="pcard reveal">
      <div className="pcard__img">
        <SmartImage
          {...imgProps(product.image, {
            sizes: "(max-width: 560px) 92vw, (max-width: 900px) 46vw, 30vw",
            style: { width: "100%", height: "100%" },
          })}
        />
        <span className="pcard__cat">{product.category}</span>
        {product.demo && <span className="demo-tag">Demo image</span>}
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{product.name}</h3>
        <p className="pcard__desc">{product.description}</p>

        {product.specs?.length > 0 && (
          <dl className="pcard__specs">
            {product.specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="pcard__foot">
          <Link to="/contact" className="link-arrow">
            Ask about {product.name.toLowerCase()}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
