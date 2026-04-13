import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'imagen-4.0-generate-001';
const OUT = './public/landing';

const prompts = [
  // HERO — cinematic book-to-film transformation
  {
    name: 'hero-main',
    prompt: 'A magical ancient book lying open on a dark surface, its pages glowing with brilliant golden and blue light, cinematic light rays and particles emanating from the pages transforming into miniature film scenes floating above — a tiny medieval castle, characters in motion, dramatic clouds. Ultra-wide cinematic composition, dark moody background with deep navy and black tones, volumetric lighting, lens flare, 8K ultra detailed, movie poster quality, dramatic atmosphere'
  },
  // STYLE: Pixar
  {
    name: 'style-pixar',
    prompt: 'A heartwarming Pixar-style 3D animated scene of a small brave teddy bear adventurer with a tiny backpack standing on top of a mountain peak at golden hour, looking out over a vast colorful valley with floating islands, lush green forests, waterfalls, and a rainbow. Subsurface scattering on the bear fur, large expressive eyes, saturated candy-like colors, soft rounded geometry, Pixar movie quality, cinematic wide shot, beautiful sunset sky with pink and orange clouds'
  },
  // STYLE: Realistic
  {
    name: 'style-realistic',
    prompt: 'A photorealistic cinematic shot of a woman explorer standing at the edge of an ancient temple ruin overgrown with moss and vines in a dense jungle. Golden sunlight filtering through the canopy creating god rays, mist and particles in the air. Shot on ARRI Alexa, shallow depth of field f/1.4, natural skin texture, cinematic color grading teal and orange, lens flare, 8K photorealistic detail, National Geographic quality'
  },
  // STYLE: Cyberpunk
  {
    name: 'style-cyberpunk',
    prompt: 'A stunning cyberpunk cityscape at night with a lone figure walking down a neon-lit alley. Towering holographic billboards in Japanese and Hebrew, rain-slicked streets reflecting vibrant neon signs in cyan, magenta, and electric blue. Flying vehicles in the distance, volumetric fog with colored light rays, chrome and carbon fiber architecture, LED lights everywhere. Blade Runner meets Ghost in the Shell, ultra-wide cinematic composition, 8K detail'
  },
  // STYLE: Paper Folding / Origami
  {
    name: 'style-paper',
    prompt: 'An enchanting miniature diorama world made entirely of folded paper and origami. A paper village with tiny origami houses, paper trees, a folded paper river with a tiny paper boat, and origami animals (fox, rabbit, bird) in a stop-motion style scene. Warm craft lighting, visible paper texture and creases, soft shadows, cream and pastel colors with touches of gold. Miniature scale, tilt-shift photography effect, magical and whimsical, studio lighting'
  },
  // STYLE: Hand-drawn
  {
    name: 'style-handdrawn',
    prompt: 'A beautiful hand-drawn animated scene in Studio Ghibli watercolor style showing a young girl with flowing hair running through a field of wildflowers towards a floating magical castle in the sky. Soft watercolor wash backgrounds with visible paper texture, delicate ink linework, dreamy pastel colors — lavender, soft pink, sky blue, warm yellow. Wind blowing through the flowers and hair, butterflies and petals floating, magical atmosphere, 2D animation art style'
  },
  // USE CASE: Education
  {
    name: 'usecase-education',
    prompt: 'An animated classroom scene where a holographic dinosaur emerges from a tablet screen, amazing young diverse students who look up in wonder. The dinosaur is a friendly T-Rex made of glowing blue light particles, surrounded by floating educational text and diagrams. Warm classroom lighting mixed with blue holographic glow, modern classroom with wooden desks, plants, and natural light from windows. Pixar-style 3D animation quality, warm and inviting'
  },
  // USE CASE: Marketing / Ad
  {
    name: 'usecase-marketing',
    prompt: 'A dynamic split-screen showing the transformation from a simple text document on the left to a polished cinematic TV commercial on the right. The left side shows a clean white page with typed text, the right side shows a vibrant luxury perfume advertisement with a model, golden lighting, and floating particles. A magical transformation wave of blue and gold energy flows between the two sides. Dark premium background, modern and sleek, advertising quality'
  },
  // SHOWCASE: Full film scene — children's story
  {
    name: 'showcase-children',
    prompt: 'A breathtaking scene from an animated children movie: a small orange fox cub and a baby owl sitting together on a branch of a giant magical tree at twilight, watching fireflies dance over a mystical lake. The tree has glowing bioluminescent leaves in soft blue and green, the sky is painted in watercolor gradients of purple, pink, and deep blue with stars beginning to appear. Dreamlike atmosphere, cinematic wide shot, Disney/Pixar quality, warm and magical, suitable for children'
  },
  // SHOWCASE: Documentary style
  {
    name: 'showcase-documentary',
    prompt: 'A stunning aerial cinematic shot of the ancient city of Jerusalem at golden hour, with the Dome of the Rock gleaming in golden sunlight, surrounded by ancient stone walls and buildings stretching across rolling hills. Dramatic clouds in the sky with god rays breaking through, warm golden and amber tones, birds flying in formation. Shot from a drone perspective, National Geographic documentary quality, 8K ultra detailed, breathtaking landscape cinematography'
  },
];

async function generateOne(item) {
  console.log(`Generating: ${item.name}...`);
  try {
    const response = await ai.models.generateImages({
      model: MODEL,
      prompt: item.prompt,
      config: { numberOfImages: 1 }
    });
    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (imageBytes) {
      const buffer = Buffer.from(imageBytes, 'base64');
      writeFileSync(`${OUT}/${item.name}.png`, buffer);
      console.log(`  ✅ ${item.name}.png (${(buffer.length / 1024).toFixed(0)}KB)`);
      return true;
    } else {
      console.log(`  ❌ ${item.name}: No image data returned`);
      return false;
    }
  } catch (err) {
    console.error(`  ❌ ${item.name}: ${err.message}`);
    return false;
  }
}

// Generate in batches of 3 to avoid rate limits
async function main() {
  console.log(`Generating ${prompts.length} images with ${MODEL}...\n`);
  let success = 0;
  for (let i = 0; i < prompts.length; i += 3) {
    const batch = prompts.slice(i, i + 3);
    const results = await Promise.all(batch.map(generateOne));
    success += results.filter(Boolean).length;
    if (i + 3 < prompts.length) {
      console.log('  (waiting 3s between batches...)');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.log(`\nDone! ${success}/${prompts.length} images generated.`);
}

main();
