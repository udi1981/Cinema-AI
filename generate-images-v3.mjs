import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyDDLgqemok78UVWcpZ0FPekFgnfqONj9A4' });
const MODEL = 'imagen-4.0-generate-001';
const OUT = './public/landing';

const prompts = [
  {
    name: 'idea-children-pixar',
    prompt: 'Pixar-style 3D animated scene: A group of adorable diverse children characters with huge expressive eyes sitting in a magical treehouse reading a glowing storybook together. A friendly baby dragon peeks through the window. Warm golden lighting, magical sparkles floating in the air, incredibly detailed Pixar/Disney quality rendering. Vibrant colors, soft shadows, cinematic composition.'
  },
  {
    name: 'idea-docu-dinosaurs',
    prompt: 'Hyper-realistic documentary scene: A massive Tyrannosaurus Rex roaring in a prehistoric jungle with towering ferns and volcanic mountains in background. Dramatic lighting with rays of sunlight piercing through canopy. National Geographic quality, photorealistic scales and texture, cinematic wide-angle shot, mist and atmospheric haze, 8K detail.'
  },
  {
    name: 'idea-edu-math',
    prompt: 'Colorful 3D animated educational scene: A friendly robot teacher in a futuristic classroom projecting holographic 3D geometric shapes — cubes spheres pyramids — floating in the air. Diverse cartoon children students reaching up to touch glowing mathematical symbols. Bright cheerful atmosphere with neon accents, Pixar quality rendering.'
  },
  {
    name: 'idea-edu-science',
    prompt: 'Stunning 3D animated scene: A child in a tiny lab coat looking through a giant magnifying glass at a miniature solar system floating on their desk. Planets orbit around a glowing sun with DNA helixes and atom models floating nearby. Magical science laboratory with bubbling colorful potions. Pixar quality, warm lighting, incredibly detailed.'
  },
  {
    name: 'idea-ted-lecture',
    prompt: 'Cinematic wide shot of a TED-style conference stage with dramatic spotlight. A confident speaker stands on a round red carpet, behind them a massive LED screen displays stunning data visualizations and infographics. Silhouetted audience in foreground. Professional cinematography, shallow depth of field, warm amber and cool blue lighting contrast. Ultra-realistic photography.'
  },
  {
    name: 'idea-advertising',
    prompt: 'Sleek modern commercial advertisement scene: A luxury perfume bottle floating in mid-air surrounded by swirling golden liquid particles and rose petals with dramatic studio lighting creating beautiful reflections and caustics. High-end product photography style, ultra-clean gradient background, professional advertising quality, photorealistic, glossy.'
  },
  {
    name: 'idea-business',
    prompt: 'Modern corporate presentation scene: A diverse team of professionals in a sleek glass boardroom watching a holographic 3D product demo floating above a conference table. City skyline visible through floor-to-ceiling windows at golden hour sunset. Premium corporate feel with blue and gold accent lighting. Photorealistic, cinematic.'
  },
  {
    name: 'idea-agency',
    prompt: 'Creative advertising agency brainstorm scene: A vibrant open-plan creative studio with colorful mood boards on walls, 3D product mockups displayed on screens, and creative professionals collaborating at standing desks. Giant monitors showing social media campaign concepts. Energetic colorful lighting with neon accents. Modern dynamic composition, photorealistic.'
  },
  {
    name: 'idea-creator',
    prompt: 'YouTube content creator studio scene: A professional creator setup with ring lights, dual monitors showing video editing timeline, camera on tripod, colorful LED strip lighting. Microphone boom arm, pop filter, acoustic panels. Trending thumbnails visible on screen. Vibrant energetic atmosphere with purple and cyan lighting. Photorealistic, modern aesthetic.'
  },
  {
    name: 'idea-cooking',
    prompt: 'Spectacular cooking show scene: A chef in a modern restaurant kitchen surrounded by flying ingredients — vegetables spices and flames — creating a spectacular dish. Dramatic food photography lighting with steam and sparks. Ingredients float in an artistic composition above a sizzling pan. Cinematic, photorealistic, high-end food commercial quality.'
  },
  {
    name: 'idea-travel',
    prompt: 'Epic travel documentary scene: A lone explorer with a backpack standing at the edge of a cliff overlooking dramatic mountain peaks at sunrise with spectacular clouds and golden light. Eagles soaring in the sky. National Geographic quality, ultra-wide cinematic composition, breathtaking landscape photography, 8K detail.'
  },
  {
    name: 'idea-music',
    prompt: 'Electrifying concert stage scene: A musician silhouette on a massive stage with spectacular light show — laser beams, pyrotechnics and holographic visual effects projecting above thousands of fans with raised hands. Epic wide-angle shot with dramatic backlighting in purple and cyan. Photorealistic concert photography, high energy.'
  },
];

async function gen(name, prompt) {
  try {
    console.log(`Generating: ${name}...`);
    const res = await ai.models.generateImages({
      model: MODEL,
      prompt,
      config: { numberOfImages: 1, aspectRatio: '16:9' },
    });
    const img = res.generatedImages?.[0];
    if (!img?.image?.imageBytes) throw new Error('No image data');
    const buf = Buffer.from(img.image.imageBytes, 'base64');
    writeFileSync(`${OUT}/${name}.png`, buf);
    console.log(`  ✅ ${name}.png (${Math.round(buf.length / 1024)}KB)`);
    return true;
  } catch (e) {
    console.error(`  ❌ ${name}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log(`Generating ${prompts.length} images with ${MODEL}...\n`);
  let ok = 0;
  for (let i = 0; i < prompts.length; i += 3) {
    const batch = prompts.slice(i, i + 3);
    const results = await Promise.all(batch.map(p => gen(p.name, p.prompt)));
    ok += results.filter(Boolean).length;
    if (i + 3 < prompts.length) {
      console.log('  (waiting 3s...)');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.log(`\n✅ Done! ${ok}/${prompts.length} images generated.`);
}

main().catch(console.error);
