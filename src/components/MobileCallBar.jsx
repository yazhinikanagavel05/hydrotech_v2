import { Phone, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import { phoneNumbers, primaryCta } from "../data/site.js";

/**
 * Sticky bottom bar for small screens: call the first number, or jump to the
 * enquiry form. Hidden on the contact page itself where it would be redundant.
 */
export default function MobileCallBar({ hide }) {
  if (hide) return null;

  return (
    <div className="callbar" aria-label="Quick contact">
      <a href={`tel:${phoneNumbers[0].tel}`}>
        <Phone size={19} aria-hidden="true" />
        Call HydroTech
      </a>
      <Link to={primaryCta.to} className="callbar__enquiry">
        <FileText size={19} aria-hidden="true" />
        {primaryCta.label}
      </Link>
    </div>
  );
}
