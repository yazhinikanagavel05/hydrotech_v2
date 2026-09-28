/**
 * Writes `dist/sitemap.xml` and `dist/robots.txt` for the public routes.
 *
 * The production origin comes from VITE_SITE_URL (see .env.example). The
 * `sitemap` plugin in `vite.config.js` runs this after the bundle is written, so
 * `vite build` produces it on its own; `npm run sitemap` re-runs it by hand.
 *
 * Only the eight real routes are listed — no query strings, no filtered views.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const origin = (process.env.VITE_SITE_URL || "").replace(/\/+$/, "");

if (!origin) {
  console.warn(
    "  VITE_SITE_URL is not set — skipping sitemap.xml and robots.txt.\n" +
      "  Copy .env.example to .env and set the production origin, then rebuild."
  );
  process.exit(0);
}

if (!existsSync(dist)) {
  console.error("dist/ not found — run `vite build` first.");
  process.exit(1);
}

const ROUTES = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  { path: "/irrigation", priority: "0.9", changefreq: "monthly" },
  { path: "/products", priority: "0.9", changefreq: "monthly" },
  { path: "/applications", priority: "0.8", changefreq: "monthly" },
  { path: "/projects", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.6", changefreq: "yearly" },
  { path: "/contact", priority: "0.8", changefreq: "yearly" },
];

const today = new Date().toISOString().slice(0, 10);

const urls = ROUTES.map(
  (r) =>
    `  <url>\n` +
    `    <loc>${origin}${r.path}</loc>\n` +
    `    <lastmod>${today}</lastmod>\n` +
    `    <changefreq>${r.changefreq}</changefreq>\n` +
    `    <priority>${r.priority}</priority>\n` +
    `  </url>`
).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

await mkdir(dist, { recursive: true });
await writeFile(join(dist, "sitemap.xml"), sitemap, "utf8");
await writeFile(join(dist, "robots.txt"), robots, "utf8");

console.log(`  sitemap.xml  ${ROUTES.length} routes for ${origin}`);
console.log("  robots.txt   written");
