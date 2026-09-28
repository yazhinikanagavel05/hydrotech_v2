import { Link } from "react-router-dom";

/**
 * Button that renders as a router link, an anchor or a real <button> depending
 * on the props, so CTAs are always semantically correct and keyboard reachable.
 */
export default function Button({
  to,
  href,
  variant = "primary",
  size,
  className = "",
  children,
  icon: Icon,
  iconPosition = "right",
  ...rest
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    size ? `btn--${size}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {Icon && iconPosition === "left" && <Icon size={17} aria-hidden="true" />}
      <span>{children}</span>
      {Icon && iconPosition === "right" && <Icon size={17} aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {inner}
    </button>
  );
}
