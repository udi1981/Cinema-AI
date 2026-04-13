import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';

const DIR = './public/landing';
const QUALITY = 82; // good balance of quality vs size

async function main() {
  const files = readdirSync(DIR).filter(f => f.endsWith('.png'));
  console.log(`Converting ${files.length} PNG files to WebP (quality ${QUALITY})...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const pngPath = join(DIR, file);
    const webpPath = join(DIR, file.replace('.png', '.webp'));
    const beforeSize = statSync(pngPath).size;
    totalBefore += beforeSize;

    await sharp(pngPath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const afterSize = statSync(webpPath).size;
    totalAfter += afterSize;

    const saved = ((1 - afterSize / beforeSize) * 100).toFixed(0);
    console.log(`  ${file} → ${file.replace('.png', '.webp')}  ${(beforeSize/1024).toFixed(0)}KB → ${(afterSize/1024).toFixed(0)}KB  (-${saved}%)`);

    // Remove original PNG
    unlinkSync(pngPath);
  }

  console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (-${((1-totalAfter/totalBefore)*100).toFixed(0)}%)`);
}

main().catch(console.error);
