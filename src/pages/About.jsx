import { ArrowRight, Check } from "lucide-react";

import PageHero from "../components/PageHero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import CTASection from "../components/CTASection.jsx";
import Button from "../components/Button.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { imgProps } from "../lib/img.js";

import { images } from "../data/images.js";
import { focusAreas, approach, planningFactors } from "../data/services.js";
import { company, phoneNumbers } from "../data/site.js";
import { useSeo } from "../hooks/useSeo.js";
import { useReveal } from "../hooks/useUi.js";

export default function About() {
  useSeo({
    title: "About HydroTech Irrigation | Karur, Tamil Nadu",
    description:
      "HydroTech Irrigation is a Karur-based irrigation business working with farmers, plantations, nurseries and landscapers across Tamil Nadu on drip, sprinkler and automated systems.",
    path: "/about",
    image: images.aboutMain.src,
  });

  useReveal("about");

  return (
    <main id="main" className="pagetrans">
      <PageHero
        image={images.aboutMain}
        breadcrumb="About"
        eyebrow="About HydroTech"
        title="Irrigation that a farmer can run without us"
        lead="HydroTech Irrigation supplies and supports irrigation systems for agriculture and landscaping. We would rather build one system that works for years than ten that need constant attention."
        actions={
          <>
            <Button to="/contact" variant="lime" size="lg" icon={ArrowRight}>
              Talk to us
            </Button>
            <Button href={`tel:${phoneNumbers[0].tel}`} variant="onDark" size="lg">
              {phoneNumbers[0].display}
            </Button>
          </>
        }
      />

      {/* --- story ---------------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="philosophy">
            <div className="philosophy__media reveal-img reveal">
              <SmartImage
                {...imgProps(images.aboutFamily, {
                  sizes: "(max-width: 900px) 92vw, 44vw",
                  style: { width: "100%", height: "100%" },
                })}
              />
            </div>
            <div className="philosophy__body">
              <SectionHeader
                eyebrow="What we do"
                title="Systems you can understand and repair yourself"
              />
              <p className="t-body">
                Most of the places we work are in {company.region}, and most of the people we
                work with are making decisions about water with a fixed budget and a fixed
                season. That shapes everything about how we work.
              </p>
              <p className="t-body">
                We start by asking what is being grown, how the land is laid out, and how much
                water is dependable. From that we suggest an approach, supply the products,
                and help install the system — explaining it in plain language so it can be run
                and maintained without calling us for every small adjustment.
              </p>
              <p className="pull">
                The best irrigation system is the one that keeps working on an ordinary day
                when nobody is watching.
              </p>
              <Button to="/irrigation" icon={ArrowRight}>
                See the systems we work with
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- focus areas ---------------------------------------- */}
      <section className="section section--sand">
        <div className="container">
          <SectionHeader
            eyebrow="What we focus on"
            title="Six things that matter to us"
            lead="Not a mission statement — just the principles we actually apply when choosing and installing a system."
            align="center"
            className="reveal"
          />
          <ul className="afocus" style={{ marginTop: 46, listStyle: "none" }}>
            {focusAreas.map((f) => (
              <li key={f.title} className="reveal">
                <strong>{f.title}</strong>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- approach ------------------------------------------- */}
      <section className="section section--forest on-dark">
        <div className="container">
          <SectionHeader
            eyebrow="How we work"
            title="The same four steps, every time"
            lead="No surprises about process, so you know what happens after the first call."
            align="center"
            className="reveal"
          />
          <ol className="approach" style={{ marginTop: 48, listStyle: "none" }}>
            {approach.map((s) => (
              <li key={s.step} className="reveal">
                <b>{s.step}</b>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --- planning recap ------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="intro">
            <div className="intro__media reveal-img reveal">
              <div className="intro__frame" style={{ aspectRatio: "4 / 3" }}>
                <SmartImage
                  {...imgProps(images.aboutFields, {
                    sizes: "(max-width: 900px) 92vw, 46vw",
                    style: { width: "100%", height: "100%" },
                  })}
                />
              </div>
            </div>
            <div className="intro__body">
              <SectionHeader
                eyebrow="Planning checklist"
                title="What we need to know before anything is ordered"
              />
              <p className="t-body">
                Whether it is a small kitchen garden or a large field, these are the factors
                that decide the design:
              </p>
              <ul className="stack-sm">
                {planningFactors.map((f) => (
                  <li className="tick" key={f.title}>
                    <Check size={15} aria-hidden="true" />
                    <span>
                      <strong>{f.title}: </strong>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Button to="/contact" icon={ArrowRight}>
                Send these details to us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Come and talk"
        title="Visit us in Puliyur, or call from the field"
        lead={`HydroTech is at ${company.region}. A visit is useful when you want to see products and layouts in person.`}
      />
    </main>
  );
}
