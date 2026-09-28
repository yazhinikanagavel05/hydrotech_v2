import { ArrowRight, Check } from "lucide-react";

import HeroSlider from "../components/HeroSlider.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import ServiceCard, { ServiceCardLight } from "../components/ServiceCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ApplicationCard from "../components/ApplicationCard.jsx";
import Carousel from "../components/Carousel.jsx";
import CTASection from "../components/CTASection.jsx";
import Button from "../components/Button.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { imgProps } from "../lib/img.js";
import DemoNotice from "../components/DemoNotice.jsx";

import { images } from "../data/images.js";
import { solutions, additionalServices, gettingStarted, planningFactors, focusAreas } from "../data/services.js";
import { productShowcase } from "../data/products.js";
import { applications } from "../data/applications.js";
import { company, demoNotice, phoneNumbers } from "../data/site.js";
import { useSeo } from "../hooks/useSeo.js";
import { useReveal } from "../hooks/useUi.js";

/** Hero slide content lives with the page so wording stays easy to review. */
const heroSlides = [
  {
    id: "drip",
    label: "Drip Irrigation",
    title: "Irrigation that puts water",
    accent: "where the roots are",
    text: "Drip, sprinkler and automated systems planned around your crop, your land and the water you actually have.",
    image: images.hero[0],
    cta: "Explore irrigation systems",
    ctaTo: "/irrigation",
    secondaryCta: "Browse products",
    secondaryTo: "/products",
  },
  {
    id: "sprinkler",
    label: "Sprinkler Irrigation",
    title: "Even coverage over",
    accent: "bigger areas",
    text: "For fields, fodder areas, lawns and gardens — sprinklers that spread water evenly and can be zoned.",
    image: images.hero[1],
    cta: "See sprinkler systems",
    ctaTo: "/irrigation#sprinkler",
    secondaryCta: "View applications",
    secondaryTo: "/applications",
  },
  {
    id: "automation",
    label: "Irrigation Automation",
    title: "Watering that runs",
    accent: "on its own",
    text: "Timers and controllers that start and stop each zone on schedule, so nothing is missed and nothing is over-watered.",
    image: images.hero[2],
    cta: "Discover automation",
    ctaTo: "/irrigation#automation",
    secondaryCta: "Talk to us",
    secondaryTo: "/contact",
  },
];

export default function Home() {
  useSeo({
    title: "HydroTech Irrigation | Drip, Sprinkler & Automated Irrigation",
    description:
      "HydroTech Irrigation designs and supplies drip, sprinkler and automated irrigation systems for farms, plantations, nurseries, greenhouses, gardens and landscapes. Call 90809 80339.",
    path: "/",
    image: images.hero[0].src,
  });

  // Reveal animations are driven from one observer per route.
  useReveal("home");

  return (
    <main id="main">
      <HeroSlider slides={heroSlides} />

      {/* --- intro / what we do ------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="intro">
            <div className="intro__media reveal-img reveal">
              <div className="intro__frame">
                  <SmartImage
                    {...imgProps(images.intro, {
                      sizes: "(max-width: 900px) 92vw, 46vw",
                      style: { width: "100%", height: "100%" },
                    })}
                  />
              </div>
              <div className="intro__badge">
                <strong>{company.shortName} — {company.region.split(",")[0]}</strong>
                <span>{company.legalNote}</span>
              </div>
            </div>

            <div className="intro__body">
              <SectionHeader
                eyebrow="Irrigation, made practical"
                title={
                  <>
                    Watering the right way is the
                    <em> difference between work and waste</em>
                  </>
                }
                lead="Most irrigation problems are not about the pump or the pipe. They are about where the water lands, how often it arrives and how much of it the crop can actually use. We start there."
              />
              <p className="t-body">
                HydroTech works with farmers, plantation owners, nurseries, institutions and
                landscapers across {company.serviceArea.toLowerCase()}. We help choose the
                approach that fits the crop and the land, supply the products, and help install
                and explain the system so it keeps working.
              </p>
              <ul className="factors">
                {planningFactors.slice(0, 4).map((f) => (
                  <li key={f.title}>
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Button to="/about" variant="ghost" icon={ArrowRight}>
                More about HydroTech
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- solutions ------------------------------------------ */}
      <section className="section section--sand">
        <div className="container">
          <SectionHeader
            eyebrow="Three ways to irrigate"
            title="Drip, sprinkler or automation — choose what fits"
            lead="Most farms use a combination. The right mix depends on the crop, the soil, the shape of the land and how dependable the water supply is."
            actions={
              <Button to="/irrigation" icon={ArrowRight}>
                See how each system works
              </Button>
            }
            className="reveal"
          />
          <div className="trio" style={{ marginTop: 46 }}>
            {solutions.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* --- process -------------------------------------------- */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Getting started"
            title="Four questions before we suggest anything"
            lead="Answer these and the system almost designs itself. If you are unsure about any of them, that is what the call is for."
            align="center"
            className="reveal"
          />
          <ol className="steps" style={{ marginTop: 46 }}>
            {gettingStarted.map((s) => (
              <li className="step reveal" key={s.step}>
                <span className="step__n">Step {s.step}</span>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 34 }}>
            <Button to="/contact" icon={ArrowRight}>
              Start with a call
            </Button>
            <Button href={`tel:${phoneNumbers[0].tel}`} variant="ghost">
              {phoneNumbers[0].display}
            </Button>
          </div>
        </div>
      </section>

      {/* --- additional services -------------------------------- */}
      <section className="section section--white">
        <div className="container">
          <SectionHeader
            eyebrow="Beyond the field"
            title="Nurseries, plantations, gardens and landscapes"
            lead="The same water-saving thinking applies wherever plants are grown, from a plant nursery to a hotel lawn."
            split
            actions={
              <Button to="/applications" variant="ghost" icon={ArrowRight}>
                See all applications
              </Button>
            }
            className="reveal"
          />
          <div className="bento section-gap">
            {additionalServices.map((s) => (
              <div key={s.title}>
                <ServiceCardLight service={{ ...s, points: null }} ctaLabel="Enquire about this" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- products slider ------------------------------------ */}
      <section className="section section--sand">
        <div className="container">
          <SectionHeader
            eyebrow="Products"
            title="The parts you need, in the sizes you need"
            lead="Drip lines and emitters, sprinkler heads, valves and controllers, filters, pipe and fittings. Tell us the crop and area and we will tell you what to buy."
            split
            actions={
              <Button to="/products" icon={ArrowRight}>
                View all products
              </Button>
            }
            className="reveal"
          />
          <div className="section-gap">
            <Carousel
              label="Product categories"
              items={productShowcase.map((p) => ({
                key: p.id,
                node: <ProductCard product={p} />,
              }))}
            />
          </div>
          <div className="section-note">
            <DemoNotice>{demoNotice.products}</DemoNotice>
          </div>
        </div>
      </section>

      {/* --- applications slider ------------------------------- */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Applications"
            title="Irrigation for every kind of planting"
            lead="From paddy fields to polyhouses, from kitchen gardens to institutional lawns — each one has its own watering rhythm."
            split
            actions={
              <Button to="/applications" icon={ArrowRight}>
                Explore applications
              </Button>
            }
            className="reveal"
          />
          <div className="section-gap">
            <Carousel
              label="Applications"
              items={applications.slice(0, 6).map((a) => ({
                key: a.id,
                node: <ApplicationCard application={a} />,
              }))}
            />
          </div>
        </div>
      </section>

      {/* --- about teaser --------------------------------------- */}
      <section className="section section--forest on-dark">
        <div className="container">
          <div className="about-teaser">
            <div className="about-teaser__media reveal-img reveal">
              <div className="about-teaser__stack">
                <SmartImage
                  {...imgProps(images.aboutCauvery, {
                    sizes: "(max-width: 900px) 92vw, 46vw",
                    style: { width: "100%", height: "100%" },
                  })}
                />
              </div>
              <div className="about-teaser__small">
                  <SmartImage
                    {...imgProps(images.aboutKarur, {
                      sizes: "28vw",
                      style: { width: "100%", height: "100%" },
                    })}
                  />
              </div>
            </div>

            <div className="about-teaser__body">
              <SectionHeader
                eyebrow="Why HydroTech"
                title="Irrigation you can run yourself"
                lead="The best system is the one that keeps working on a Tuesday morning when nobody is watching. We design for that."
              />
              <ul className="about-teaser__list">
                {focusAreas.slice(0, 4).map((f) => (
                  <li key={f.title}>
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                    <span className="about-teaser__item">
                      <strong>{f.title}.</strong>
                      <span className="about-teaser__desc">{f.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Button to="/about" variant="lime" icon={ArrowRight}>
                Read about HydroTech
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Talk to us"
        title="Tell us about your land. We will tell you what to do with the water."
        lead="A short call is usually enough to know whether drip, sprinkler or a simple timer makes more sense for your situation."
      />
    </main>
  );
}
