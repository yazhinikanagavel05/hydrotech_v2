import { Phone, Mail, MapPin, ExternalLink, Navigation } from "lucide-react";

import PageHero from "../components/PageHero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import ContactForm from "../components/ContactForm.jsx";
import Button from "../components/Button.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { imgProps } from "../lib/img.js";

import { images } from "../data/images.js";
import { phoneNumbers, email, address, company } from "../data/site.js";
import { useSeo } from "../hooks/useSeo.js";
import { useReveal } from "../hooks/useUi.js";

export default function Contact() {
  useSeo({
    title: "Contact HydroTech Irrigation | Call 90809 80339",
    description:
      "Contact HydroTech Irrigation in Puliyur, Karur, Tamil Nadu. Call 90809 80339 or 95853 75343, or email tvhydrotechirrigations@gmail.com for irrigation advice and product enquiries.",
    path: "/contact",
    image: images.contact.region.src,
  });

  useReveal("contact");

  return (
    <main id="main" className="pagetrans">
      <PageHero
        image={images.contact.region}
        breadcrumb="Contact"
        eyebrow="Contact"
        title="Tell us about your land"
        lead="A call, an email or the form below — whichever is easiest. If you can tell us the crop, the area and where the water comes from, our reply will be genuinely useful."
        actions={
          <>
            <Button href={`tel:${phoneNumbers[0].tel}`} variant="lime" size="lg" icon={Phone}>
              {phoneNumbers[0].display}
            </Button>
            <Button href={email.mailto} variant="onDark" size="lg" icon={Mail}>
              Send an email
            </Button>
          </>
        }
      />

      <section className="section">
        <div className="container">
          <div className="cgrid">
            {/* --- form ------------------------------------------ */}
            <div>
              <ContactForm />
            </div>

            {/* --- contact details ------------------------------- */}
            <div className="cinfo">
              <div className="cinfo__card">
                <SectionHeader
                  eyebrow="Reach us"
                  title="Call, email or visit"
                  as="h2"
                />

                <div className="cinfo__row">
                  <span className="cinfo__ico">
                    <Phone size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <small>Phone</small>
                    {phoneNumbers.map((p, i) => (
                      <span key={p.tel} style={{ display: "block" }}>
                        <a href={`tel:${p.tel}`}>{p.display}</a>
                        {i === 1 && <span className="alt">Alternate number</span>}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="cinfo__row">
                  <span className="cinfo__ico">
                    <Mail size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <small>Email</small>
                    <a href={email.mailto} style={{ wordBreak: "break-word" }}>
                      {email.address}
                    </a>
                  </div>
                </div>

                <div className="cinfo__row">
                  <span className="cinfo__ico">
                    <MapPin size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <small>Address</small>
                    <p>
                      {address.line1}
                      <br />
                      {address.line2}, {address.region}
                      <br />
                      {address.pin}, {address.country}
                    </p>
                    <a
                      href={address.mapLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{ fontSize: "0.92rem", display: "inline-flex", gap: 6, alignItems: "center", marginTop: 8 }}
                    >
                      Open in maps
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  </div>
                </div>

                <div className="cinfo__row">
                  <span className="cinfo__ico">
                    <Navigation size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <small>Area served</small>
                    <p>{company.serviceArea}</p>
                  </div>
                </div>
              </div>

              <div className="cmap reveal">
                <iframe
                  title={`Map showing the ${address.line2} area, where ${company.name} is located`}
                  src={address.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="cmap__note">{address.mapNote}</p>

              <div className="cinfo__card" style={{ padding: 0, overflow: "hidden" }}>
                  <SmartImage
                    {...imgProps(images.contact.field, {
                      sizes: "(max-width: 940px) 92vw, 40vw",
                      style: { width: "100%", height: "100%" },
                    })}
                  />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
