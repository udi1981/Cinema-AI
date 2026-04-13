/**
 * Generate showcase videos for landing page hover animations.
 *
 * Usage:
 *   GEMINI_API_KEY=your_key node generate-showcase-videos.mjs
 *   GEMINI_API_KEY=your_key node generate-showcase-videos.mjs children documentary
 *
 * Generates 4-second Veo 3.1 clips for each showcase card image.
 * Videos are saved to public/landing/ as .mp4 files.
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY environment variable');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const VEO_MODEL = 'veo-3.1-generate-preview';

const SHOWCASE_VIDEOS = [
  {
    id: 'children',
    output: 'public/landing/idea-children-pixar.mp4',
    prompt: 'Pixar-style 3D animation: Three adorable children in a magical glowing treehouse at dusk. A small friendly green dragon peeks from behind a giant book. Warm golden light, floating fireflies, whimsical atmosphere. Camera slowly orbits the treehouse. Cinematic, 4K quality.',
  },
  {
    id: 'documentary',
    output: 'public/landing/idea-docu-dinosaurs.mp4',
    prompt: 'Hyper-realistic National Geographic style: A massive T-Rex walks through a lush prehistoric jungle. Ferns sway, steam rises from the ground, volcanic mountains in the background. Dramatic cinematic lighting, depth of field. Camera tracks alongside the dinosaur. 4K photorealistic.',
  },
  {
    id: 'eduMath',
    output: 'public/landing/idea-edu-math.mp4',
    prompt: 'Futuristic classroom: A friendly blue robot teacher projects holographic 3D geometric shapes — cubes, pyramids, spheres — that float and rotate in the air. Neon blue and green glow. Children reach out to touch the holograms. Pixar-style 3D animation, cinematic.',
  },
  {
    id: 'eduScience',
    output: 'public/landing/idea-edu-science.mp4',
    prompt: 'Science laboratory: A glowing miniature solar system orbits above a desk. A DNA double helix rotates slowly in blue and purple light. Bubbling test tubes and colorful chemical reactions. Dramatic volumetric lighting, cinematic depth of field. Realistic style.',
  },
  {
    id: 'ted',
    output: 'public/landing/idea-ted-lecture.mp4',
    prompt: 'TED talk stage: A speaker stands on the iconic red circular stage. Behind them, massive holographic brain visualization with glowing neural networks and floating data charts. Dramatic spotlight, dark audience silhouette. Cinematic, professional, 4K.',
  },
  {
    id: 'advertising',
    output: 'public/landing/idea-advertising.mp4',
    prompt: 'Luxury perfume commercial: An elegant glass perfume bottle rotates slowly on a black marble surface. Golden light, dramatic shadows, floating gold particles. Rose petals fall in slow motion. Ultra high-end product photography look, cinematic, 4K.',
  },
  {
    id: 'business',
    output: 'public/landing/idea-business.mp4',
    prompt: 'Futuristic boardroom: A holographic 3D product demo floats above a sleek black conference table. City skyline at night through floor-to-ceiling windows. Blue and teal hologram glow, professional corporate atmosphere. Cinematic, 4K.',
  },
  {
    id: 'agency',
    output: 'public/landing/idea-agency.mp4',
    prompt: 'Creative agency studio: Neon-lit workspace with exposed brick walls. AR mood boards float in the air — images, color palettes, typography samples. Two designers collaborate, moving digital elements with hand gestures. Cyberpunk aesthetic, warm creative energy, cinematic.',
  },
  {
    id: 'creator',
    output: 'public/landing/idea-creator.mp4',
    prompt: 'YouTube creator studio: Colorful LED lights behind a desk with professional microphone and camera. A colorful portal opens behind the creator, swirling with pink and blue energy. Pixar-style 3D animation, energetic, vibrant colors, cinematic.',
  },
  {
    id: 'cooking',
    output: 'public/landing/idea-cooking.mp4',
    prompt: 'Cinematic cooking scene: Vegetables fly through the air in slow motion — a knife slices them mid-air. A pan flares with dramatic flames (flambé). Steam rises beautifully. Professional kitchen, dramatic lighting, extreme slow motion. Ultra-realistic, 4K food cinematography.',
  },
  {
    id: 'travel',
    output: 'public/landing/idea-travel.mp4',
    prompt: 'Epic travel: An explorer stands at the entrance of an ancient overgrown temple in a jungle. Golden sunrise light streams through the trees. Mist and floating particles. Camera slowly pushes forward through the temple entrance. Cinematic, National Geographic style, 4K.',
  },
  {
    id: 'music',
    output: 'public/landing/idea-music.mp4',
    prompt: 'Epic concert: Massive stage with pyramid LED structure. Hundreds of laser beams in green, blue, and purple cut through smoke. Pyrotechnics fire from both sides. A sea of phone lights from the crowd. Cyberpunk aesthetic, dramatic, cinematic concert footage, 4K.',
  },
];

async function generateVideo(item) {
  console.log(`\nGenerating: ${item.id} → ${item.output}`);

  if (fs.existsSync(item.output)) {
    console.log(`  ⏭️  Already exists, skipping. Delete file to regenerate.`);
    return;
  }

  try {
    let operation = await ai.models.generateVideos({
      model: VEO_MODEL,
      prompt: item.prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9',
        durationSeconds: 4,
      },
    });

    // Poll for completion
    console.log(`  ⏳ Waiting for generation...`);
    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000));
      operation = await ai.operations.get({ operation: operation.name });
      process.stdout.write('.');
    }
    console.log('');

    const video = operation.response?.generatedVideos?.[0]?.video;
    if (!video?.uri) {
      console.error(`  ❌ No video URI returned`);
      return;
    }

    // Download the video
    console.log(`  📥 Downloading...`);
    const response = await fetch(video.uri);
    if (!response.ok) {
      console.error(`  ❌ Download failed: ${response.status}`);
      return;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const dir = path.dirname(item.output);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(item.output, buffer);
    console.log(`  ✅ Saved ${item.output} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
  } catch (err) {
    console.error(`  ❌ Failed: ${err.message}`);
  }
}

async function main() {
  const filterIds = process.argv.slice(2);
  const items = filterIds.length > 0
    ? SHOWCASE_VIDEOS.filter(v => filterIds.includes(v.id))
    : SHOWCASE_VIDEOS;

  console.log(`Generating ${items.length} showcase videos...`);
  console.log(`Using model: ${VEO_MODEL}`);

  for (const item of items) {
    await generateVideo(item);
  }

  console.log('\nDone! Videos saved to public/landing/');
}

main();
