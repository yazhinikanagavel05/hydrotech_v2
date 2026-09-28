/** Consistent section header: eyebrow, heading, optional lead and actions. */
export default function SectionHeader({
  eyebrow,
  title,
  lead,
  actions,
  align = "start",
  split = false,
  className = "",
  as: Tag = "h2",
}) {
  const classes = [
    "section-head",
    align === "center" ? "section-head--center" : "",
    split ? "section-head--split" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const head = (
    <div className={classes}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className="t-h2 section-head__title">{title}</Tag>
      {lead && <p className="t-lead">{lead}</p>}
    </div>
  );

  if (!actions) return head;

  if (split) {
    return (
      <div className={classes}>
        <div className="stack" style={{ "--gap": "18px" }}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <Tag className="t-h2 section-head__title">{title}</Tag>
        </div>
        <div className="stack" style={{ "--gap": "18px" }}>
          {lead && <p className="t-lead">{lead}</p>}
          {actions}
        </div>
      </div>
    );
  }

  return (
    <div className="stack" style={{ "--gap": "22px" }}>
      {head}
      {actions}
    </div>
  );
}
