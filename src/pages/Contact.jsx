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
                <h2 className='t-h2' style={{ marginBottom: 16, fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>Reach us</h2>

                <div className="cinfo__row">
                  <span className="cinfo__ico">
                    <Phone size={19} aria-hidden="true" />
                  </span>
                  <div>
                    
                    {phoneNumbers.map((p, i) => (
                      <span key={p.tel} style={{ display: "block" }}>
                        <a href={`tel:${p.tel}`}>{p.display}</a>
                        
                      </span>
                    ))}
                  </div>
                </div>

                <div className="cinfo__row">
                  <span className="cinfo__ico">
                    <Mail size={19} aria-hidden="true" />
                  </span>
                  <div>
                    
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

                
              </div>


              
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
