import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Button from "../components/Button.jsx";
import { navItems } from "../data/nav.js";
import { useSeo } from "../hooks/useSeo.js";

export default function NotFound() {
  useSeo({
    title: "Page not found | HydroTech Irrigation",
    description:
      "The page you were looking for could not be found. Explore irrigation, products, applications and projects from HydroTech Irrigation.",
    path: "/404",
    noindex: true,
  });

  return (
    <main className="err" id="main">
      <div className="container">
        <div className="err__body">
          <span className="err__code">404</span>
          <h1 className="t-h2">This page could not be found</h1>
          <p className="t-lead">
            The link may be old or typed incorrectly. Try one of the pages below, or call
            HydroTech and we will point you in the right direction.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Button to="/" icon={ArrowRight}>
              Back to homepage
            </Button>
            <Button to="/contact">Contact HydroTech</Button>
          </div>
          <nav
            aria-label="Site sections"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            {navItems
              .filter((i) => i.to !== "/")
              .map((item) => (
                <Link key={item.to} to={item.to} className="chip">
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
