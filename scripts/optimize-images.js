/**
 * Image Optimization Build Script
 * -------------------------------
 * Converts local images to WebP/AVIF, generates responsive sizes,
 * removes EXIF metadata, outputs optimized variants.
 *
 * Usage:
 *   node scripts/optimize-images.js [--input=src/assets] [--output=public/assets/optimized]
 *
 * Dependencies:
 *   npm install -D sharp glob
 *
 * This script:
 *   1. Reads all images from the input directory (JPEG, PNG, GIF, TIFF)
 *   2. Strips EXIF metadata
 *   3. Generates WebP and AVIF versions
 *   4. Creates multiple widths: 320, 640, 960, 1280, 1920
 *   5. Outputs to the public directory for direct serving
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error('sharp is not installed. Run: npm install -D sharp');
  process.exit(1);
}

const BREAKPOINTS = [320, 640, 960, 1280, 1920];
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 65;

const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, val] = arg.replace(/^--/, '').split('=');
  acc[key] = val || true;
  return acc;
}, {});

const INPUT_DIR = args.input || 'src/assets';
const OUTPUT_DIR = args.output || 'public/assets/optimized';

async function optimizeImage(filePath) {
  const relativePath = path.relative(INPUT_DIR, filePath);
  const parsed = path.parse(relativePath);
  const fileName = parsed.name;
  const subDir = parsed.dir;

  const stats = fs.statSync(filePath);
  const originalSize = stats.size;

  const outputs = [];

  const baseOutput = path.join(OUTPUT_DIR, subDir);

  for (const width of BREAKPOINTS) {
    const sizedDir = path.join(baseOutput, `${fileName}`);
    fs.mkdirSync(sizedDir, { recursive: true });

    const sizes = [
      { ext: 'webp', format: 'webp', quality: WEBP_QUALITY },
      { ext: 'avif', format: 'avif', quality: AVIF_QUALITY },
      { ext: 'jpg',  format: 'jpeg', quality: JPEG_QUALITY },
    ];

    for (const { ext, format, quality } of sizes) {
      const outputPath = path.join(sizedDir, `${fileName}-${width}.${ext}`);
      if (fs.existsSync(outputPath)) continue;

      await sharp(filePath)
        .withMetadata({ exif: undefined, icc: undefined, xmp: undefined })
        .resize(width, undefined, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        [format]({ quality })
        .toFile(outputPath);

      const compressedSize = fs.statSync(outputPath).size;
      const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      outputs.push({
        path: path.relative(OUTPUT_DIR, outputPath),
        width,
        format: ext,
        size: compressedSize,
        savings: `${savings}%`,
      });

      process.stdout.write('.');
    }
  }

  return {
    file: relativePath,
    original: originalSize,
    outputs,
  };
}

async function run() {
  const start = Date.now();

  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`Input directory not found: ${INPUT_DIR}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const imageFiles = await glob(`${INPUT_DIR}/**/*.{jpg,jpeg,png,gif,tif,tiff}`, {
    nocase: true,
  });

  if (imageFiles.length === 0) {
    console.log(`No images found in ${INPUT_DIR}`);
    console.log('');
    console.log('Place your local images in src/assets/ and re-run.');
    console.log('For CDN-hosted images, use the OptimizedImage component directly.');
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to optimize\n`);

  let totalOriginal = 0;
  let totalCompressed = 0;
  const results = [];

  for (const file of imageFiles) {
    const rel = path.relative(INPUT_DIR, file);
    process.stdout.write(`  ${rel} ... `);
    const result = await optimizeImage(file);
    results.push(result);
    totalOriginal += result.original;
    result.outputs.forEach(o => {
      console.log(`    ${o.width}w/${o.format}: ${(o.size / 1024).toFixed(1)}KB (${o.savings})`);
    });
    totalCompressed += result.outputs.reduce((s, o) => s + o.size, 0);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const avgOutputs = results.reduce((s, r) => s + r.outputs.length, 0);
  const avgSavings = ((1 - totalCompressed / totalOriginal / Math.max(1, avgOutputs)) * 100).toFixed(1);

  console.log('\n--- Summary ---');
  console.log(`  Images processed: ${results.length}`);
  console.log(`  Variants generated: ${avgOutputs}`);
  console.log(`  Avg compression: ${avgSavings}%`);
  console.log(`  Time: ${elapsed}s`);
  console.log(`  Output: ${OUTPUT_DIR}/`);
  console.log('');
  console.log('Add this to your <OptimizedImage> local src:');
  console.log('  src={`/assets/optimized/${filename}/${filename}-960.jpg`}');
  console.log('  The component will handle format negotiation via <picture>.');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
