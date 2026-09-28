import { Phone, Mail, MapPin } from "lucide-react";

import Button from "./Button.jsx";
import SmartImage from "./SmartImage.jsx";
import SectionHeader from "./SectionHeader.jsx";
import { phoneNumbers, email, address } from "../data/site.js";
import { images } from "../data/images.js";
import { imgProps } from "../lib/img.js";

/**
 * Full-width closing call to action.
 * Reused on every page so the "what do I do next" answer is always the same.
 */
export default function CTASection({
  eyebrow = "Talk to HydroTech",
  title = "Not sure which irrigation system suits your land?",
  lead = "Tell us your crop, your area and where the water comes from. We will help you find the right approach instead of selling you a system.",
  image,
  primaryLabel = "Get Irrigation Advice",
  primaryTo = "/contact",
}) {
  return (
    <section className="cta on-dark">
      <div className="cta__bg" aria-hidden="true">
        <SmartImage
          {...imgProps(image ?? images.contact.field, {
            alt: "",
            sizes: "100vw",
            style: { width: "100%", height: "100%" },
          })}
        />
      </div>
      <div className="container cta__inner">
        <div className="cta__body">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            as="h2"
            className="reveal"
          />
          {lead && (
            <p className="t-lead cta__lead reveal reveal-d1">{lead}</p>
          )}
          <div className="cta__actions reveal reveal-d2">
            <Button to={primaryTo} variant="lime" size="lg" icon={Phone}>
              {primaryLabel}
            </Button>
            <Button href={`tel:${phoneNumbers[0].tel}`} variant="onDark" size="lg">
              Call HydroTech
            </Button>
          </div>
        </div>

        <div className="cta__side reveal reveal-d2">
          <a href={`tel:${phoneNumbers[0].tel}`}>
            <small>Call us</small>
            <strong>{phoneNumbers[0].display}</strong>
          </a>
          <a href={`tel:${phoneNumbers[1].tel}`}>
            <small>Alternate</small>
            <strong>{phoneNumbers[1].display}</strong>
          </a>
          <a href={email.mailto}>
            <small>
              <Mail size={11} style={{ display: "inline", verticalAlign: "-1px", marginRight: 5 }} aria-hidden="true" />
              Email
            </small>
            <strong className="cta__side__mail">{email.address}</strong>
          </a>
          <div>
            <small>
              <MapPin size={11} style={{ display: "inline", verticalAlign: "-1px", marginRight: 5 }} aria-hidden="true" />
              Visit
            </small>
            <p>{address.singleLine}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
