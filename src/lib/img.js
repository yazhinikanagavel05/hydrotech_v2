/**
 * Turns an image descriptor from `src/data/images.js` into props for
 * `<SmartImage />`.
 *
 * Card and section components should spread this rather than picking
 * `image.src` by hand — that way a newly generated `srcSet`, LQIP placeholder
 * or intrinsic size is picked up everywhere at once, instead of every call site
 * having to be updated when the image pipeline changes.
 *
 *   <SmartImage {...imgProps(product.image)} sizes="30vw" />
 */
export function imgProps(image, { alt, sizes, className, style, eager = false } = {}) {
  if (!image) return {};

  const {
    src,
    srcSet,
    lqip,
    width,
    height,
    focal,
    alt: imageAlt = "",
  } = image;

  const props = { src, srcSet, lqip, width, height, focal, eager };
  if (alt !== undefined) props.alt = alt;
  else props.alt = imageAlt;
  if (sizes) props.sizes = sizes;
  if (className) props.className = className;
  if (style) props.style = style;

  // Drop anything undefined so React does not emit empty attributes.
  return Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined));
}

/** Props for decorative images: empty alt, lazy, no LQIP needed. */
export function decorativeImgProps(image, sizes) {
  return { ...imgProps(image, { alt: "", sizes }), loading: "lazy" };
}
