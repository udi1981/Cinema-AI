import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyDDLgqemok78UVWcpZ0FPekFgnfqONj9A4' });
const MODEL = 'imagen-4.0-generate-001';

async function main() {
  console.log('Generating hyper-realistic dinosaur hatching image (minimal fluid)...');

  const res = await ai.models.generateImages({
    model: MODEL,
    prompt: 'Hyper-realistic photograph of a baby Velociraptor dinosaur just hatched from a cracked egg in a prehistoric jungle. The eggshell has clean sharp cracks and fragments scattered around. Only a thin film of moisture on the baby dinosaur skin, subtle wet sheen on the tiny scales — NOT dripping or covered in fluid. The hatchling is small and fragile looking, pushing out of the broken shell. Dense prehistoric ferns and soft misty jungle background. Natural documentary photography, National Geographic quality, photorealistic, warm natural lighting through ancient trees, shallow depth of field, 8K detail. Minimal liquid, dry realistic look.',
    config: { numberOfImages: 1, aspectRatio: '16:9' },
  });

  const img = res.generatedImages?.[0];
  if (!img?.image?.imageBytes) {
    console.error('No image generated!');
    process.exit(1);
  }

  const buf = Buffer.from(img.image.imageBytes, 'base64');
  writeFileSync('./public/landing/showcase-dino-hatch.png', buf);
  console.log(`Saved showcase-dino-hatch.png (${(buf.length / 1024).toFixed(0)} KB)`);
}

main().catch(console.error);
