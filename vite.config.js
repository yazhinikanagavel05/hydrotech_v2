import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Replaces the `__IMAGE:photo-name__` and `__IMAGESET:photo-name__` tokens in
 * index.html with the real published paths for that photo.
 *
 * Without this, the preload hint and the Open Graph image would have to be
 * hard-coded to a filename — and the moment the image pipeline changes its
 * naming, the preload would 404 silently and the first paint would stall while
 * the hero re-downloads. Reading the generated manifest keeps them in lockstep.
 */
function htmlImagePaths() {
  const manifestPath = fileURLToPath(
    new URL("./src/data/images.generated.js", import.meta.url)
  );
  if (!existsSync(manifestPath)) {
    throw new Error(
      "src/data/images.generated.js is missing. Run `npm run images` first " +
        "(`npm run dev` and `npm run build` do this for you)."
    );
  }

  const manifest = readFileSync(manifestPath, "utf8");
  const entries = [...manifest.matchAll(
    /"([a-z0-9-]+)":\s*\{\s*\n\s*"src":\s*"([^"]+)",\s*\n\s*"srcSet":\s*"([^"]+)"/g
  )].map((m) => ({ name: m[1], src: m[2], srcSet: m[3] }));
  const lookup = new Map(entries.map((e) => [e.name, e]));

  if (!entries.length) {
    throw new Error(
      "htmlImagePaths: src/data/images.generated.js is empty. Run `npm run images` first."
    );
  }

  return {
    name: "hydrotech-html-image-paths",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        // __IMAGE:hero-drip__     -> the widest published variant
        // __IMAGESET:hero-drip__  -> the full srcset, for responsive preloads
        return html
          .replace(/__IMAGESET:([a-z0-9-]+)__/g, (match, name) => {
            const entry = lookup.get(name);
            if (!entry) {
              return this.error(
                `index.html references __IMAGESET:${name}__ but no generated variant exists. Run "npm run images".`
              );
            }
            return entry.srcSet;
          })
          .replace(/__IMAGE:([a-z0-9-]+)__/g, (match, name) => {
            const entry = lookup.get(name);
            if (!entry) {
              return this.error(
                `index.html references __IMAGE:${name}__ but no generated variant exists. Run "npm run images".`
              );
            }
            return entry.src;
          });
      },
    },
  };
}

/**
 * Production origin, used for canonical URLs, Open Graph tags and the sitemap.
 *
 * Set it in `.env` before deploying, e.g.
 *   VITE_SITE_URL=https://www.hydrotechirrigation.in
 *
 * It is also exposed to the app as `import.meta.env.VITE_SITE_URL`, so
 * `useSeo` never has to guess the origin from `window.location` — which matters
 * when the site is served from a staging domain.
 */
// Deployed at the root of a domain. `src/lib/asset.js` prefixes every public
// asset with BASE_URL, so switching to a sub-folder base is a one-line change
// here plus a matching SPA rewrite on the host.
//
// The production origin lives in VITE_SITE_URL (.env). It is read by
// `src/hooks/useSeo.js` for canonical and Open Graph URLs, and by
// `scripts/generate-sitemap.mjs` for sitemap.xml and robots.txt. See .env.example.
export default defineConfig({
  base: "/",
  plugins: [react(), htmlImagePaths()],
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 2048,
    // Keep the initial payload small; the rest loads on navigation.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
