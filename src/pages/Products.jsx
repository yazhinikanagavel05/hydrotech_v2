import { useMemo, useState } from "react";
import { ArrowRight, Package } from "lucide-react";

import PageHero from "../components/PageHero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import DemoNotice from "../components/DemoNotice.jsx";
import CTASection from "../components/CTASection.jsx";
import Button from "../components/Button.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { imgProps } from "../lib/img.js";

import { images } from "../data/images.js";
import { products, productCategories, getProductsByGroup } from "../data/products.js";
import { demoNotice, phoneNumbers } from "../data/site.js";
import { useSeo } from "../hooks/useSeo.js";
import { useReveal } from "../hooks/useUi.js";

/** A short "not published" list, so the absence of specs is deliberate. */
const notYetPublished = [
  "Model numbers and technical datasheets",
  "Flow rates, pressure ranges and thread sizes",
  "Prices and dealer pricing",
  "Guarantee periods and certifications",
];

export default function Products() {
  const [group, setGroup] = useState("all");

  useSeo({
    title: "Irrigation Products | Drip, Sprinkler, Valves, Filters | HydroTech",
    description:
      "Irrigation product categories from HydroTech: drip lines and emitters, sprinkler heads, valves and controllers, filters, pipe and fittings.",
    path: "/products",
    image: images.products.emitters.src,
  });

  useReveal(`products-${group}`);

  const visible = useMemo(() => getProductsByGroup(group), [group]);
  const countFor = (id) => (id === "all" ? products.length : getProductsByGroup(id).length);

  return (
    <main id="main" className="pagetrans">
      <PageHero
        image={images.products.dripLine}
        breadcrumb="Products"
        eyebrow="Products"
        title="The parts a working system is made of"
        lead="These are product categories, not specific models. Tell us the crop, the area and the water source and we will tell you exactly which parts you need — and in what quantity."
        actions={
          <>
            <Button to="/contact" variant="lime" size="lg" icon={ArrowRight}>
              Ask for a product list
            </Button>
            <Button href={`tel:${phoneNumbers[0].tel}`} variant="onDark" size="lg">
              Call {phoneNumbers[0].display}
            </Button>
          </>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Catalogue"
            title="Browse by type"
            lead="Filter the categories below. Every card links straight to an enquiry, so you can ask about one part or a complete system."
            className="reveal"
          />

          {/* These filter a list, they do not select tab panels, so a group of
              toggle buttons with `aria-pressed` is the accurate pattern. */}
          <div className="tabs" style={{ marginTop: 34 }} role="group" aria-label="Filter products by type">
            {productCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                className="tab"
                aria-pressed={group === c.id}
                onClick={() => setGroup(c.id)}
              >
                {c.label}
                <span className="tab__count">{countFor(c.id)}</span>
              </button>
            ))}
          </div>

          <p aria-live="polite" className="visually-hidden">
            Showing {visible.length} product {visible.length === 1 ? "category" : "categories"}
          </p>

          <div className="pgrid" style={{ marginTop: 36 }}>
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {visible.length === 0 && (
            <p className="empty section-note">
              No products in this category yet. Please contact us and we will help with what you
              need.
            </p>
          )}

          <div className="section-note">
            <DemoNotice>{demoNotice.products}</DemoNotice>
          </div>
        </div>
      </section>

      {/* --- why no specs / prices ------------------------------ */}
      <section className="section section--sand">
        <div className="container">
          <div className="intro">
            <div className="intro__media reveal-img reveal">
              <div className="intro__frame" style={{ aspectRatio: "4 / 3" }}>
                  <SmartImage
                    {...imgProps(images.services.equipment, {
                      sizes: "(max-width: 900px) 92vw, 46vw",
                      style: { width: "100%", height: "100%" },
                    })}
                  />
              </div>
            </div>
            <div className="intro__body">
              <SectionHeader
                eyebrow="Honest catalogue"
                title="Why there are no prices or specs here yet"
                lead="We would rather show you fewer things and be accurate than fill a page with numbers nobody has verified."
              />
              <p className="t-body">These details are being prepared and will appear once they are confirmed:</p>
              <ul className="stack-sm">
                {notYetPublished.map((item) => (
                  <li className="tick" key={item}>
                    <Package size={15} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="t-body">
                In the meantime, the quickest way to get an accurate list is to call or send an
                enquiry with your crop and area. We will reply with what the system needs, not a
                catalogue dump.
              </p>
              <Button to="/contact" icon={ArrowRight}>
                Send an enquiry
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Need a specific part?"
        title="Tell us the crop and the area — we will tell you the parts"
        lead="Emitters, laterals, sprinklers, valves, filters and pipe: the right combination depends entirely on what you are growing."
      />
    </main>
  );
}
