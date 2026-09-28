import { ArrowRight } from "lucide-react";

import PageHero from "../components/PageHero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { ApplicationRow } from "../components/ApplicationCard.jsx";
import ApplicationCard from "../components/ApplicationCard.jsx";
import Carousel from "../components/Carousel.jsx";
import DemoNotice from "../components/DemoNotice.jsx";
import CTASection from "../components/CTASection.jsx";
import Button from "../components/Button.jsx";

import { images } from "../data/images.js";
import { applications } from "../data/applications.js";
import { demoNotice } from "../data/site.js";
import { useSeo } from "../hooks/useSeo.js";
import { useReveal } from "../hooks/useUi.js";

export default function Applications() {
  useSeo({
    title: "Irrigation Applications | Farms, Nurseries, Gardens & Lawns | HydroTech",
    description:
      "How irrigation is planned for field crops, vegetables, orchards, plantations, nurseries, polyhouses, gardens and landscaping — and what each one needs.",
    path: "/applications",
    image: images.applications.fieldCrops.src,
  });

  useReveal("applications");

  return (
    <main id="main" className="pagetrans">
      <PageHero
        image={images.applications.fieldCrops}
        breadcrumb="Applications"
        eyebrow="Applications"
        title="Every kind of planting waters differently"
        lead="A paddy field, a mango orchard, a polyhouse and a hotel lawn cannot share one system. Here is what each of them needs, and why."
        actions={
          <>
            <Button to="/contact" variant="lime" size="lg" icon={ArrowRight}>
              Discuss your crop
            </Button>
            <Button to="/irrigation" variant="onDark" size="lg">
              Compare systems
            </Button>
          </>
        }
      />

      {/* --- editorial rows ------------------------------------- */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Application guide"
            title="What each application needs"
            lead="Notes on the usual approach for each type of planting. Your own land may differ — that is what the conversation is for."
            className="reveal"
          />
          <div className="stack-lg" style={{ "--gap": "var(--section-y)", marginTop: 20 }}>
            {applications.map((a, i) => (
              <ApplicationRow key={a.id} application={a} index={i} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* --- quick grid ----------------------------------------- */}
      <section className="section section--sand">
        <div className="container">
          <SectionHeader
            eyebrow="At a glance"
            title="Pick your planting"
            lead="Jump straight to what you are growing."
            align="center"
            className="reveal"
          />
          <div className="section-gap">
            <Carousel
              label="Applications overview"
              items={applications.map((a) => ({
                key: a.id,
                node: <ApplicationCard application={a} ctaLabel="Enquire about this" />,
              }))}
            />
          </div>
          <div className="section-note">
            <DemoNotice>{demoNotice.applications}</DemoNotice>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Not listed?"
        title="If your crop is not here, ask anyway"
        lead="Drip, sprinkler, nursery systems and automated scheduling all get adapted. Tell us what you grow and we will work it out."
      />
    </main>
  );
}
