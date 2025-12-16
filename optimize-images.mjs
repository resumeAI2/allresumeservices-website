import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = './client/public';
const QUALITY = 85; // WebP quality (0-100)

// List of hero/large images to optimize
const TARGET_IMAGES = [
  'hero-bg.jpg',
  'success-image.jpg',
  'consultation.jpg',
  'ATS-Resume-Template.jpg'
];

async function optimizeImage(inputPath, outputPath) {
  try {
    const info = await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);
    
    const originalSize = (await stat(inputPath)).size;
    const newSize = info.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ ${basename(inputPath)} → ${basename(outputPath)}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(1)}KB → WebP: ${(newSize / 1024).toFixed(1)}KB (${savings}% smaller)`);
    
    return { original: originalSize, new: newSize };
  } catch (error) {
    console.error(`✗ Failed to optimize ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Optimizing hero images to WebP format...\n');
  
  let totalOriginal = 0;
  let totalNew = 0;
  let count = 0;
  
  for (const filename of TARGET_IMAGES) {
    const inputPath = join(PUBLIC_DIR, filename);
    const ext = extname(filename);
    const name = basename(filename, ext);
    const outputPath = join(PUBLIC_DIR, `${name}.webp`);
    
    const result = await optimizeImage(inputPath, outputPath);
    if (result) {
      totalOriginal += result.original;
      totalNew += result.new;
      count++;
    }
    console.log('');
  }
  
  if (count > 0) {
    const totalSavings = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
    console.log(`\n✅ Optimized ${count} images`);
    console.log(`📊 Total size: ${(totalOriginal / 1024).toFixed(1)}KB → ${(totalNew / 1024).toFixed(1)}KB`);
    console.log(`💾 Total savings: ${totalSavings}% (${((totalOriginal - totalNew) / 1024).toFixed(1)}KB)`);
  }
}

main().catch(console.error);
