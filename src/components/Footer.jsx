import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

import { navItems } from "../data/nav.js";
import { company, phoneNumbers, email, address } from "../data/site.js";
import { images } from "../data/images.js";

/** Dark footer using the light HydroTech logo. */
export default function Footer() {
  const year = new Date().getFullYear();

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

          <div>
            <h3>Solutions</h3>
            <ul className="ftr__list">
              <li>
                <Link to="/irrigation#drip">Drip Irrigation</Link>
              </li>
              <li>
                <Link to="/irrigation#sprinkler">Sprinkler Irrigation</Link>
              </li>
              <li>
                <Link to="/irrigation#automation">Irrigation Automation</Link>
              </li>
              <li>
                <Link to="/applications">Applications</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>Contact</h3>
            <div className="ftr__contact">
              <span className="ftr__contact__key">
                <Phone size={17} aria-hidden="true" />
                <span>
                  {phoneNumbers.map((p, i) => (
                    <span key={p.tel}>
                      {i > 0 && <br />}
                      <a href={`tel:${p.tel}`}>{p.display}</a>
                    </span>
                  ))}
                </span>
              </span>
              <a href={email.mailto} className="ftr__contact__key">
                <Mail size={17} aria-hidden="true" />
                <span className="ftr__contact__mail">{email.address}</span>
              </a>
              <span>
                <MapPin size={17} aria-hidden="true" />
                <span>
                  {address.line1},<br />
                  {address.line2},<br />
                  {address.region} — {address.pin}
                </span>
              </span>
              <a href={address.mapLink} className="ftr__contact__maps" target="_blank" rel="noreferrer noopener">
                <ArrowUpRight size={17} aria-hidden="true" />
                <span>Open location in maps</span>
              </a>
            </div>
          </div>
        </div>

        <div className="ftr__bottom">
          <span>
            © {year} {company.name}. All rights reserved.
          </span>
          <span>
            Drip · Sprinkler · Automation · Nursery · Landscaping — {address.region}
          </span>
        </div>
      </div>
    </footer>
  );
}
