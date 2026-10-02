// Generates public/og.webp (1200x630 social card) from the site wallpaper.
// Run with: node scripts/generate-og.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public/test-bg/gracile/gracile-earth-debris-field-2560.avif');
const out = join(root, 'public/og.webp');

await sharp(src)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.6 })
  .webp({ quality: 82 })
  .toFile(out);

console.log(`wrote ${out}`);
