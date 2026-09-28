import { Info, ImageOff } from "lucide-react";

/**
 * Inline notice used wherever demo imagery is shown. Deliberately visible on the
 * page rather than buried in a footnote — these photos are not HydroTech's own.
 */
export function DemoNotice({ children, dark = false, icon = "image" }) {
  const Icon = icon === "info" ? Info : ImageOff;
  return (
    <p className={`notice ${dark ? "notice--dark" : ""}`}>
      <Icon size={18} aria-hidden="true" />
      <span>
        <strong>Demo imagery. </strong>
        {children}
      </span>
    </p>
  );
}

export default DemoNotice;
