import { Check, Info, ArrowRight, Droplets, Sun, Timer } from "lucide-react";

import PageHero from "../components/PageHero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import ServiceCardLight from "../components/ServiceCard.jsx";
import CTASection from "../components/CTASection.jsx";
import Button from "../components/Button.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { imgProps } from "../lib/img.js";

import { images } from "../data/images.js";
import { solutions, additionalServices, planningFactors, gettingStarted } from "../data/services.js";
import { useSeo } from "../hooks/useSeo.js";
import { useReveal } from "../hooks/useUi.js";

const icons = { drip: Droplets, sprinkler: Sun, automation: Timer };

export default function Irrigation() {
  useSeo({
    title: "Irrigation Systems | Drip, Sprinkler & Automation | HydroTech",
    description:
      "How drip, sprinkler and automated irrigation systems work, where each one fits, and what to consider when planning irrigation for your land.",
    path: "/irrigation",
    image: images.solutions.drip.src,
  });

  useReveal("irrigation");

  return (
    <main id="main" className="pagetrans">
      <PageHero
        image={images.solutions.drip}
        breadcrumb="Irrigation"
        eyebrow="Irrigation systems"
        title="How should your land be watered?"
        lead="Three approaches, one idea: get the right amount of water to the plant, at the right time, and not anywhere else. Here is what each system is good at."
        actions={
          <>
            <Button to="/contact" variant="lime" size="lg" icon={ArrowRight}>
              Get irrigation advice
            </Button>
            <Button to="/products" variant="onDark" size="lg">
              Browse products
            </Button>
          </>
        }
      />

      {/* --- system detail blocks ------------------------------ */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="In detail"
            title="What each system actually does"
            lead="Each section explains the system in plain language, where it is used, and what you gain by choosing it."
            className="reveal"
          />

          <div style={{ marginTop: 8 }}>
            {solutions.map((s, i) => {
              const Icon = icons[s.id] ?? Droplets;
              return (
                <article
                  key={s.id}
                  id={s.id}
                  className={`solution ${i % 2 === 1 ? "solution--flip" : ""} reveal`}
                >
                  <div className="solution__media">
                      <SmartImage
                        {...imgProps(s.image, {
                          sizes: "(max-width: 900px) 92vw, 46vw",
                          style: { width: "100%", height: "100%" },
                        })}
                      />
                  </div>
                  <div className="solution__body">
                    <SectionHeader
                      eyebrow={s.kicker}
                      title={s.name}
                      as="h2"
                    />
                    <p className="t-lead">{s.summary}</p>

                    <div className="solution__col">
                      <h3>
                        <Icon size={15} aria-hidden="true" />
                        What it is
                      </h3>
                      <p className="t-body">{s.whatItIs}</p>
                    </div>

                    <div className="solution__col">
                      <h3>
                        <Icon size={15} aria-hidden="true" />
                        Where it is used
                      </h3>
                      <ul>
                        {s.usedFor.map((u) => (
                          <li className="tick" key={u}>
                            <Check size={15} aria-hidden="true" />
                            {u}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="solution__col">
                      <h3>
                        <Icon size={15} aria-hidden="true" />
                        What you gain
                      </h3>
                      <ul>
                        {s.benefits.map((b) => (
                          <li className="tick" key={b}>
                            <Check size={15} aria-hidden="true" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button to="/contact" icon={ArrowRight}>
                      Ask about {s.name.toLowerCase()}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- planning factors ---------------------------------- */}
      <section className="section section--sand">
        <div className="container">
          <SectionHeader
            eyebrow="Before you decide"
            title="Six things that decide the design"
            lead="Irrigation is planned, not guessed. These six factors are what we look at before recommending any product."
            align="center"
            className="reveal"
          />
          <ul className="afocus" style={{ marginTop: 46, listStyle: "none" }}>
            {planningFactors.map((f) => (
              <li key={f.title} className="reveal">
                <strong>{f.title}</strong>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
          <p className="notice" style={{ marginTop: 34 }}>
            <Info size={18} aria-hidden="true" />
            <span>
              <strong>Not sure which applies to you? </strong>
              Tell us the crop, the area and the water source on a call — it takes a few
              minutes and saves installing the wrong system.
            </span>
          </p>
        </div>
      </section>

      {/* --- broader work -------------------------------------- */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Where else we work"
            title="Planting that is not a field"
            lead="Nurseries, plantations, gardens and landscapes use the same principles with a different layout."
            split
            actions={
              <Button to="/applications" variant="ghost" icon={ArrowRight}>
                All applications
              </Button>
            }
            className="reveal"
          />
          <div className="grid" style={{ "--gap": 22, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", marginTop: 44 }}>
            {additionalServices.map((s) => (
              <ServiceCardLight key={s.title} service={{ ...s, points: null }} />
            ))}
          </div>
        </div>
      </section>

      {/* --- how it happens ------------------------------------- */}
      <section className="section section--forest on-dark">
        <div className="container">
          <SectionHeader
            eyebrow="How it happens"
            title="From first call to running system"
            lead="The same four steps every time, so you know what to expect."
            align="center"
            className="reveal"
          />
          <ol className="approach" style={{ marginTop: 48, listStyle: "none" }}>
            {gettingStarted.map((s) => (
              <li key={s.step} className="reveal">
                <b>{s.step}</b>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        eyebrow="Next step"
        title="Let us look at your land before anything is bought"
        lead="Share the crop, the area and the water source. We will tell you what the system should be, and what it should not include."
      />
    </main>
  );
}
