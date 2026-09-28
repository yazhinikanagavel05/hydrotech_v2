/**
 * Generates responsive image variants for every photograph.
 *
 * Source masters live in `assets/photos/` — deliberately OUTSIDE `public/`, so
 * the full-size originals are never uploaded to the host. The resized,
 * re-encoded variants are written to `public/assets/photos/gen/`, which is the
 * only copy the site serves, and `src/data/images.generated.js` is regenerated
 * from the output.
 *
 * Run with:  npm run images   (also runs automatically as part of `npm run build`)
 */
import { readFile, writeFile, readdir, mkdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const photosDir = join(root, "assets", "photos");
const outDir = join(root, "public", "assets", "photos", "gen");
const manifestPath = join(root, "src", "data", "images.generated.js");

/** Widths produced for every photo. The first is the largest. */
const WIDTHS = [480, 800, 1200, 1800];

const QUALITY = 74;
const PROGRESSIVE = true;

if (!existsSync(photosDir)) {
  console.error("No source photos at", photosDir);
  console.error("Add the full-size originals there; the build only publishes the resized variants.");
  process.exit(1);
}

// Rebuild from scratch so a removed photo cannot leave a stale variant behind.
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const entries = (await readdir(photosDir))
  .filter((f) => f.toLowerCase().endsWith(".jpg"))
  .sort();

const manifest = {};
let before = 0;
let after = 0;

for (const file of entries) {
  const name = basename(file, ".jpg");
  const srcPath = join(photosDir, file);
  before += (await stat(srcPath)).size;

  const image = sharp(srcPath, { failOn: "none" }).rotate();
  const meta = await image.metadata();
  const srcW = meta.width ?? 1800;

  // Never upscale: a small source keeps its own width only.
  const widths = WIDTHS.filter((w) => w < srcW);
  if (!widths.length || widths[widths.length - 1] !== srcW) {
    widths.push(Math.min(srcW, WIDTHS[WIDTHS.length - 1]));
  }
  widths.sort((a, b) => a - b);

  const variants = [];

  for (const w of widths) {
    const outName = `${name}-${w}.jpg`;
    const outPath = join(outDir, outName);
    await sharp(srcPath, { failOn: "none" })
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, progressive: PROGRESSIVE, mozjpeg: true })
      .toFile(outPath);
    variants.push({ w, file: `/assets/photos/gen/${outName}` });
    after += (await stat(outPath)).size;
  }

  // Tiny blurred base64 placeholder (LQIP) for the loading background.
  const lqipBuf = await sharp(srcPath, { failOn: "none" })
    .rotate()
    .resize({ width: 20, height: 20, fit: "inside" })
    .blur(1.2)
    .jpeg({ quality: 40 })
    .toBuffer();
  const lqip = `data:image/jpeg;base64,${lqipBuf.toString("base64")}`;

  manifest[name] = {
    src: variants[variants.length - 1].file,
    srcSet: variants.map((v) => `${v.file} ${v.w}w`).join(", "),
    width: srcW,
    height: meta.height ?? null,
    lqip,
  };

  process.stdout.write(`  ${name.padEnd(26)} ${String(widths.length).padStart(2)} widths\n`);
}

/* ------------------------------------------------------------------ */
/* Favicons                                                            */
/*                                                                     */
/* The favicon is the plant/leaf symbol ONLY — never the wordmark and   */
/* never the full lockup, which turns to mush below 32px.             */
/*                                                                     */
/* logo-mark.png is already the isolated symbol: its three shapes are   */
/* the three leftmost shapes of logo-dark.png / logo-light.png at       */
/* 1.44x, confirmed by matching component aspect ratios. So nothing is   */
/* cropped out of a lockup here, and no shape is invented.             */
/*                                                                     */
/* Browsers want a square icon, so the mark is trimmed to its own ink  */
/* and centred on a square canvas, filling the width. Padding it like  */
/* a photograph is what made the previous attempt unreadably small.     */
/*                                                                     */
/* Tab icons keep the navy mark on transparency. iOS paints a           */
/* transparent PNG's transparency as black, so the apple-touch-icon     */
/* uses the same symbol in its light colourway — the rule the site      */
/* already follows for the header — on opaque brand green. No white    */
/* rectangle anywhere.                                                  */
/* ------------------------------------------------------------------ */
const brandDir = join(root, "public", "assets", "brand");
const markPath = join(brandDir, "logo-mark.png");
const darkLogoPath = join(brandDir, "logo-dark.png");
const lightLogoPath = join(brandDir, "logo-light.png");

/** Bounding box of the visible ink, so the mark is cropped to its own shape. */
async function inkBoxIn({ data, info }, label) {
  const { width, height, channels } = info;
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) throw new Error(`${label} is entirely transparent — nothing to crop`);
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}
const inkBox = async (path) =>
  inkBoxIn(await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true }), path);
const inkBoxFromBuffer = async (buf) =>
  inkBoxIn(await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true }), "buffer");

/**
 * Isolates the plant/leaf symbol from a logo lockup, for when the standalone
 * logo-mark.png is missing (restoring it cannot block a production build).
 *
 * The symbol is the leading cluster of shapes at the left of the lockup and the
 * wordmark is separated from it by the largest horizontal whitespace gap.
 * Scanning the per-column ink, the symbol is everything before that widest gap
 * — the lockups use ~26px before the wordmark against ~16px between the leaf
 * shapes, so all three shapes stay together while the wordmark is cut off.
 */
async function deriveMarkFromLockup(lockupPath) {
  const { data, info } = await sharp(lockupPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const colInk = new Array(width).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > 24) colInk[x] += 1;
    }
  }

  const runs = [];
  let start = null;
  for (let x = 0; x <= width; x++) {
    const on = x < width && colInk[x] > 0;
    if (on && start === null) start = x;
    if (!on && start !== null) {
      runs.push([start, x - 1]);
      start = null;
    }
  }
  if (!runs.length) {
    throw new Error(`${lockupPath} is entirely transparent — nothing to extract`);
  }

  // The symbol is the leading cluster of shapes and the wordmark follows the
  // largest horizontal whitespace gap. The internal gaps between the three
  // leaf shapes are smaller than the break before the wordmark, so the split
  // is the widest gap between runs. Scanning from the left, the symbol is
  // everything before that gap.
  let symbolEnd = runs[runs.length - 1][1];
  let widestGap = 0;
  for (let i = 1; i < runs.length; i++) {
    const gap = runs[i][0] - runs[i - 1][1] - 1;
    if (gap > widestGap) {
      widestGap = gap;
      symbolEnd = runs[i - 1][1];
    }
  }

  let top = height;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = runs[0][0]; x <= symbolEnd; x++) {
      if (data[(y * width + x) * channels + 3] > 24) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (bottom < 0) {
    throw new Error(`${lockupPath} has no visible symbol ink`);
  }

  return { left: runs[0][0], top, width: symbolEnd - runs[0][0] + 1, height: bottom - top + 1 };
}

/* A standalone mark is the first choice; if it is ever missing (this repo ships
   without it, so a fresh clone always hits the fallback), the symbol is
   isolated from the navy logo lockup and persisted back so later builds are
   stable. Tab icons always use the navy colourway on transparency, matching
   the "mark from logo-dark" design. */
let trimmedMark;
if (existsSync(markPath)) {
  const box = await inkBox(markPath);
  trimmedMark = await sharp(markPath).extract(box).png().toBuffer();
} else {
  if (!existsSync(darkLogoPath)) {
    console.error("No brand mark at", markPath);
    console.error("No navy lockup at", darkLogoPath, "to derive it from either.");
    process.exit(1);
  }
  const box = await deriveMarkFromLockup(darkLogoPath);
  trimmedMark = await sharp(darkLogoPath).extract(box).png().toBuffer();
  await writeFile(markPath, trimmedMark);
  process.stdout.write(`  ${"brand mark".padEnd(26)}    derived from logo-dark.png (logo-mark.png was missing)\n`);
}

/**
 * Centres the symbol on a square canvas. `inset` is the margin as a
 * fraction of the canvas, applied to the width so a wide mark keeps as
 * much of the small-size height as it can.
 */
const square = (size, inset, background) =>
  sharp(trimmedMark)
    .resize({ width: Math.round(size * (1 - inset * 2)) })
    .png()
    .toBuffer()
    .then((mark) =>
      sharp({
        create: { width: size, height: size, channels: 4, background },
      })
        .composite([{ input: mark, gravity: "centre" }])
        .png({ compressionLevel: 9 })
        .toFile(join(brandDir, `favicon-${size}.png`))
    );

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
// 4% margin: the symbol reaches almost the full width of the tab.
await square(512, 0.04, transparent);
await square(192, 0.04, transparent);
await square(32, 0.04, transparent);

// iOS home screen: same symbol, light colourway, opaque brand green.
if (existsSync(lightLogoPath)) {
  const lightBox = await inkBox(lightLogoPath);
  // Take the symbol out of the light lockup: everything left of the
  // wordmark, which is the first three shapes.
  const symbol = await sharp(lightLogoPath)
    .extract({ left: 0, top: lightBox.top, width: Math.round(lightBox.width * 0.36), height: lightBox.height })
    .png()
    .toBuffer();
  const sb = await inkBoxFromBuffer(symbol);
  const tight = await sharp(symbol).extract(sb).png().toBuffer();
  await sharp(tight)
    .resize({ width: Math.round(180 * 0.66) })
    .png()
    .toBuffer()
    .then((mark) =>
      sharp({ create: { width: 180, height: 180, channels: 4, background: { r: 13, g: 42, b: 30, alpha: 1 } } })
        .composite([{ input: mark, gravity: "centre" }])
        .png({ compressionLevel: 9 })
        .toFile(join(brandDir, "apple-touch-icon.png"))
    );
}

process.stdout.write(`  ${"brand favicons".padEnd(26)}    4 icons (symbol only)\n`);

// Also copy the brand PNGs through untouched — they are already small, and
// re-encoding a logo would lose its crisp edges.
const module = `/**
 * GENERATED FILE — do not edit by hand.
 * Produced by \`npm run images\` (scripts/generate-images.mjs).
 *
 * Adds responsive width variants and a tiny blurred placeholder (LQIP) to every
 * photo in assets/photos/. Import the entries you need in images.js so each
 * <img> can ship a real srcset instead of one oversized file.
 *
 * The full-size originals in assets/photos/ are NOT published — only the
 * resized variants under public/assets/photos/gen/ reach the host.
 */
export const generatedImages = ${JSON.stringify(manifest, null, 2)};

/**
 * Widest published variant, used for social previews and preload hints.
 * Throws if the photo is missing so a stale build cannot ship a dead URL.
 */
export function heroImage(name) {
  const entry = generatedImages[name];
  if (!entry) {
    throw new Error("No generated variants for photo '" + name + "'. Run: npm run images");
  }
  return entry.src;
}

/** Convenience lookup: throws a clear error if a photo name is misspelled. */
export function photo(name) {
  const entry = generatedImages[name];
  if (!entry) {
    throw new Error(
      "No generated variants for photo '" + name + "'. Run: npm run images"
    );
  }
  return entry;
}
`;

await writeFile(manifestPath, module, "utf8");

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`\n  photos:      ${entries.length}`);
console.log(`  masters:     ${mb(before)} MB in assets/photos/ (not published)`);
console.log(`  published:   ${mb(after)} MB in public/assets/photos/gen/`);
console.log(`  manifest:    src/data/images.generated.js`);
console.log(
  `\n  Per request the browser only downloads the width it needs, so a phone\n` +
    `  never pays for the 1800px file and a desktop never pays for the 480px one.\n`
);
