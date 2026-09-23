// Turns the logo artwork (dark ink on parchment) into transparent PNG/WebP assets
// in two colourways. Re-run after replacing brand/logo-source.webp:
//   node scripts/make-logo.mjs
import sharp from "sharp";
import fs from "node:fs/promises";

const SRC = "brand/logo-source.webp";
const OUT = "public/brand";

// Crop boxes in source pixels (1254×1254 artwork)
const CROPS = {
  full: { left: 40, top: 225, width: 1175, height: 860 },     // mountains + wordmark + tagline + pillars
  wordmark: { left: 40, top: 225, width: 1175, height: 665 }, // mountains + wordmark
  mark: { left: 150, top: 225, width: 910, height: 310 },     // mountains + birds only
};
const COLORS = { forest: [0x12, 0x37, 0x2a], parchment: [0xf3, 0xeb, 0xdd] };

async function inkMask(region) {
  const { data, info } = await sharp(SRC).extract(region).greyscale().raw().toBuffer({ resolveWithObject: true });
  // Paper ≈ 232 luminance, ink ≈ 30 → map to alpha 0…255 with a soft ramp (keeps brush texture).
  const alpha = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) {
    const a = (205 - data[i]) / (205 - 60);
    alpha[i] = Math.round(Math.max(0, Math.min(1, a)) * 255);
  }
  return { alpha, info };
}

await fs.mkdir(OUT, { recursive: true });
for (const [name, region] of Object.entries(CROPS)) {
  const { alpha, info } = await inkMask(region);
  for (const [colorName, [r, g, b]] of Object.entries(COLORS)) {
    const rgba = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0; i < alpha.length; i++) {
      rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = alpha[i];
    }
    const img = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({ threshold: 1 });
    await img.clone().png({ compressionLevel: 9 }).toFile(`${OUT}/logo-${name}-${colorName}.png`);
    await img.clone().webp({ quality: 90, alphaQuality: 90 }).toFile(`${OUT}/logo-${name}-${colorName}.webp`);
  }
}

// Favicon / app icons: parchment mark on deep forest
const { alpha, info } = await inkMask(CROPS.mark);
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < alpha.length; i++) { rgba.set([0xf3, 0xeb, 0xdd, alpha[i]], i * 4); }
const mark = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({ threshold: 1 }).resize(460, 460, { fit: "inside" }).png().toBuffer();
const icon512 = await sharp({ create: { width: 512, height: 512, channels: 4, background: "#12372a" } })
  .composite([{ input: mark, gravity: "center" }])
  .png()
  .toBuffer();
for (const size of [512, 192, 180]) {
  await sharp(icon512)
    .resize(size, size)
    .png()
    .toFile(size === 180 ? "src/app/apple-icon.png" : `${OUT}/icon-${size}.png`);
}
await fs.copyFile(`${OUT}/icon-192.png`, "src/app/icon.png");
console.log("logo assets written");
