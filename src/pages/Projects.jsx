import { ArrowRight } from "lucide-react";

import PageHero from "../components/PageHero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import DemoNotice from "../components/DemoNotice.jsx";
import CTASection from "../components/CTASection.jsx";
import Button from "../components/Button.jsx";
import { projects, projectsEmptyState } from "../data/projects.js";
import { images } from "../data/images.js";
import { demoNotice } from "../data/site.js";
import { useSeo } from "../hooks/useSeo.js";
import { useReveal } from "../hooks/useUi.js";

export default function Projects() {
  useSeo({
    title: "Projects | Irrigation Installations | HydroTech Irrigation",
    description:
      "Irrigation layouts and installations for fields, orchards, nurseries and open areas. Project photography from HydroTech installations is being added.",
    path: "/projects",
    image: images.projects.a.src,
  });

  useReveal("projects");

  return (
    <main id="main" className="pagetrans">
      <PageHero
        image={images.projects.d}
        breadcrumb="Projects"
        eyebrow="Projects"
        title="Irrigation, laid out on real land"
        lead="This page shows how irrigation layouts work in practice. The images below are demonstration photography — HydroTech's own installation photographs will replace them as they are published."
        actions={
          <>
            <Button to="/contact" variant="lime" size="lg" icon={ArrowRight}>
              Discuss a similar project
            </Button>
            <Button to="/applications" variant="onDark" size="lg">
              See applications
            </Button>
          </>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Showcase"
            title="Project gallery"
            lead="Every layout below, in one grid. If you want to walk through them one at a time, ask us and we will talk you through the one that matches your land."
            split
            actions={
              <Button to="/contact" variant="ghost" icon={ArrowRight}>
                Discuss a similar project
              </Button>
            }
            className="reveal"
          />

          <div className="section-gap">
            {projects.length === 0 ? (
              <p className="empty">
                <strong>{projectsEmptyState.title}</strong>
                <br />
                {projectsEmptyState.text}
              </p>
            ) : (
              /* One layout, one interaction model: a grid. A gallery is not a
                 slider, so it carries no arrows, no track and no drag. */
              <div className="pgrid">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>

          <div className="section-note">
            <DemoNotice>{demoNotice.projects}</DemoNotice>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Your land next"
        title="Every project starts with the same three questions"
        lead="What are you growing, how big is the area, and where does the water come from? Answer those and the layout follows."
      />
    </main>
  );
}
