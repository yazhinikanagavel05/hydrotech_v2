import { Link } from "react-router-dom";

import { navItems } from "../data/nav.js";
import { company, address } from "../data/site.js";
import { images } from "../data/images.js";

/** Dark footer using the light HydroTech logo. */
export default function Footer() {
  const year = new Date().getFullYear();
  const mapQuery = encodeURIComponent(
    `${address.line1}, ${address.line2}, ${address.region} ${address.pin}, ${address.country}`
  );

  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr__grid">
          <div className="ftr__about">
            <img
              className="ftr__logo"
              src={images.brand.logoLight}
              alt="HydroTech Irrigation"
              width="1000"
              height="360"
              loading="lazy"
            />
            <p>
              Practical irrigation systems, products and support for farms, plantations, nurseries,
              greenhouses, gardens and landscapes across {address.region}.
            </p>
          </div>

          <div>
            <h3>Explore</h3>
            <nav className="ftr__list" aria-label="Footer">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="ftr__location">
            <h3>Location</h3>
            <div className="ftr__map">
              <iframe
                title={`Map showing the location of ${company.name}, ${address.line1}, ${address.line2}, ${address.region} ${address.pin}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="ftr__bottom">
          <span>
            © {year} {company.name}. All rights reserved.
          </span>
          <span className="ftr__sep" aria-hidden="true">
            |
          </span>
          <span className="ftr__credit">
            Designed &amp; Developed by{" "}
            <a href="https://pizodesigns.com/" target="_blank" rel="noreferrer noopener">
              Pizo Designs
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
