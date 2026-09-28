import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Applies a page's title, meta description, canonical URL and Open Graph tags.
 * Kept dependency-free so nothing extra ships to the browser.
 */
/** Creates or updates a <meta> tag selected by a full attribute pair. */
function upsertMeta(doc, attr, key, content) {
  if (!content) return;
  let el = doc.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = doc.createElement("meta");
    el.setAttribute(attr, key);
    doc.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Creates or updates a <link rel="…"> tag. */
function upsertLink(doc, rel, href) {
  if (!href) return;
  let el = doc.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    doc.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Production origin from VITE_SITE_URL. Falls back to the origin the visitor
 * arrived on, so local development still produces working canonical URLs.
 */
const ORIGIN = (import.meta.env.VITE_SITE_URL || "").replace(/\/+$/, "");

function resolveUrl(path) {
  const base = import.meta.env.BASE_URL || "/";
  const clean = String(path || "/").replace(/^\/+/, "");
  if (ORIGIN) return new URL(clean, `${ORIGIN}${base}`).href;
  return new URL(clean, window.location.origin + base).href;
}

export function useSeo({ title, description, path = "/", image, noindex = false }) {
  useEffect(() => {
    const doc = document;
    doc.title = title;

    const canonical = resolveUrl(path);
    const ogImage = image ? resolveUrl(image) : null;

    upsertMeta(doc, "name", "description", description);
    upsertMeta(doc, "name", "robots", noindex ? "noindex, follow" : "index, follow");

    upsertMeta(doc, "property", "og:title", title);
    upsertMeta(doc, "property", "og:description", description);
    upsertMeta(doc, "property", "og:url", canonical);
    upsertMeta(doc, "property", "og:site_name", "HydroTech Irrigation");
    upsertMeta(doc, "property", "og:locale", "en_IN");
    upsertMeta(doc, "property", "og:type", "website");
    if (ogImage) upsertMeta(doc, "property", "og:image", ogImage);

    upsertMeta(doc, "name", "twitter:card", "summary_large_image");
    upsertMeta(doc, "name", "twitter:title", title);
    upsertMeta(doc, "name", "twitter:description", description);
    if (ogImage) upsertMeta(doc, "name", "twitter:image", ogImage);

    upsertLink(doc, "canonical", canonical);
  }, [title, description, path, image, noindex]);
}
