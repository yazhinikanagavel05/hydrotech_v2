import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./", import.meta.url));
const manifestPath = fileURLToPath(
  new URL("./src/data/images.generated.js", import.meta.url)
);

/**
 * Runs one of the generator scripts in `scripts/`.
 *
 * These used to be chained onto the npm scripts (`npm run images && vite build &&
 * npm run sitemap`), which meant the build only worked when it was started as
 * `npm run build`. Hosts that run the framework's own command — Vercel's Vite
 * preset runs `vite build` — skipped the generators entirely and then failed
 * with a config error, because the manifest and the image variants are
 * generated output and are not committed. Running them from here means `vite`,
 * `vite build` and `npm run build` all produce the same complete build.
 */
function runGenerator(relativePath, what, hint) {
  try {
    execFileSync(process.execPath, [fileURLToPath(new URL(relativePath, import.meta.url))], {
      stdio: "inherit",
      cwd: root,
    });
  } catch (error) {
    const status = error && typeof error.status === "number" ? error.status : 1;
    throw new Error(
      `${what} failed (scripts/${relativePath} exited with ${status}). ${hint}`
    );
  }
}

/**
 * Runs the responsive image pipeline before the bundle is built.
 *
 * `src/data/images.generated.js` is imported by `src/data/images.js`, so the
 * manifest has to exist before Vite transforms a single module, and the variants
 * in `public/assets/photos/gen/` have to exist before the bundle is copied into
 * `dist/`. `configResolved` is the earliest hook that runs on both `vite` and
 * `vite build` and still precedes both.
 */
function responsiveImages() {
  return {
    name: "hydrotech-responsive-images",
    configResolved() {
      runGenerator(
        "./scripts/generate-images.mjs",
        "The responsive image pipeline",
        "It needs the full-size masters in assets/photos/ and sharp. " +
          "sharp is a devDependency — if this is a CI or hosting build, check that " +
          "devDependencies are installed (NODE_ENV=production makes npm skip them)."
      );
    },
  };
}

/**
 * Writes `dist/sitemap.xml` and `dist/robots.txt` once the bundle is on disk.
 *
 * `closeBundle` is the first hook that runs after Vite has finished writing
 * `dist/`, which is all the sitemap script needs. It is a no-op that warns when
 * VITE_SITE_URL is unset (see .env.example).
 */
function sitemap() {
  return {
    name: "hydrotech-sitemap",
    apply: "build",
    closeBundle() {
      runGenerator(
        "./scripts/generate-sitemap.mjs",
        "The sitemap generator",
        "See the error above."
      );
    },
  };
}

/**
 * Replaces the `__IMAGE:photo-name__` and `__IMAGESET:photo-name__` tokens in
 * index.html with the real published paths for that photo.
 *
 * Without this, the preload hint and the Open Graph image would have to be
 * hard-coded to a filename — and the moment the image pipeline changes its
 * naming, the preload would 404 silently and the first paint would stall while
 * the hero re-downloads. Reading the generated manifest keeps them in lockstep.
 *
 * The manifest is read when index.html is transformed, not when this config file
 * is loaded: the plugin above writes it during config resolution, so reading it
 * earlier could only ever fail.
 */
function htmlImagePaths() {
  const readLookup = () => {
    if (!existsSync(manifestPath)) {
      throw new Error(
        "src/data/images.generated.js is missing. The image pipeline should have " +
          "written it before this build started — run `npm run images` to check it works."
      );
    }

    const manifest = readFileSync(manifestPath, "utf8");
    const entries = [...manifest.matchAll(
      /"([a-z0-9-]+)":\s*\{\s*\n\s*"src":\s*"([^"]+)",\s*\n\s*"srcSet":\s*"([^"]+)"/g
    )].map((m) => ({ name: m[1], src: m[2], srcSet: m[3] }));

    if (!entries.length) {
      throw new Error(
        "htmlImagePaths: src/data/images.generated.js is empty. Run `npm run images` to rebuild it."
      );
    }

    return new Map(entries.map((e) => [e.name, e]));
  };

  return {
    name: "hydrotech-html-image-paths",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const lookup = readLookup();
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
  // `responsiveImages` must come first: it writes the manifest the other two read.
  plugins: [react(), responsiveImages(), htmlImagePaths(), sitemap()],
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
