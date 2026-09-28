/**
 * Resolves a path inside `public/` against Vite's configured base path.
 *
 * Every public asset (photos, brand logos, fonts) is referenced through this
 * helper so the build works whether the site is deployed at the domain root or
 * from a sub-folder. Use it instead of a hard-coded "/assets/…" string.
 *
 * @param {string} path  path relative to `public/`, with or without a leading slash
 */
export function asset(path) {
  const clean = String(path).replace(/^\/+/, "");
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${clean}`;
}
