import { GoogleGenAI } from '@google/genai';
import { writeFileSync, existsSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'imagen-4.0-generate-001';
const OUT = './public/landing';

const prompts = [
  // ===== NEW STYLE CATEGORIES =====
  // Comic Book
  {
    name: 'style-comic',
    prompt: 'A dynamic comic book style illustration of a superhero girl with flowing cape standing on top of a skyscraper at sunset, bold black ink outlines, halftone dot shading, vibrant primary colors — red blue yellow, speech bubbles floating empty, dramatic diagonal panel composition, Marvel/DC comic art quality, Ben-Day dots pattern, motion lines showing wind, dramatic perspective from below, professional comic book coloring'
  },
  // Anime
  {
    name: 'style-anime',
    prompt: 'A breathtaking anime scene of a young warrior girl with long silver hair and glowing blue eyes, wielding a crystal sword, standing in a field of cherry blossoms with petals swirling in the wind. Behind her, a massive ancient dragon made of golden light coils through pink clouds. Japanese anime art style, detailed cel shading, vibrant saturated colors, dramatic lighting with rim light, Attack on Titan and Demon Slayer quality, 4K anime wallpaper quality'
  },
  // Toy / Figure
  {
    name: 'style-toys',
    prompt: 'An adorable miniature toy figure diorama scene — cute vinyl collectible toy characters (a robot, a cat astronaut, and a tiny wizard bear) having a tea party on a mushroom table in a magical garden. Glossy plastic material, soft studio lighting, shallow depth of field, bright pastel candy colors, vinyl figure collectible aesthetic like Funko Pop meets Bearbrick, tilt-shift miniature photography, professionally photographed on white seamless background with colored gels'
  },
  // Pixel Art
  {
    name: 'style-pixel',
    prompt: 'A stunning pixel art landscape of a magical fantasy kingdom — a pixelated castle on a hill with a dragon flying overhead, pixel art forest with tiny animated characters walking on a path, treasure chests glowing, stars twinkling. 16-bit retro video game aesthetic, clean pixel art with limited color palette, reminiscent of classic SNES/Genesis RPG games like Final Fantasy and Chrono Trigger, vibrant jewel-tone colors against dark night sky, nostalgic gaming art'
  },
  // LEGO
  {
    name: 'style-lego',
    prompt: 'A spectacular LEGO brick scene of an epic space battle — LEGO minifigures piloting brick-built spaceships shooting colorful laser beams, a massive LEGO star destroyer in the background, plastic brick texture clearly visible on everything, LEGO studs on all surfaces, explosion made of transparent orange and yellow LEGO pieces. Photorealistic rendering of actual LEGO bricks, studio lighting, shallow depth of field, LEGO movie quality CGI render'
  },
  // Claymation / Plasticine
  {
    name: 'style-clay',
    prompt: 'A charming claymation/plasticine stop-motion scene of a cute clay family of foxes sitting around a dinner table in their cozy underground burrow. Everything made of colorful modeling clay — clay food, clay furniture, clay candles with yellow clay flames. Visible fingerprint textures on the clay surfaces, warm tungsten lighting, stop-motion animation style like Wallace and Gromit or Shaun the Sheep, handcrafted charm, studio photography of actual clay models'
  },

  // ===== HERO BANNER VARIANTS (additional scrolling images) =====
  {
    name: 'hero-quill',
    prompt: 'A magical golden quill pen floating in mid-air, writing luminous glowing text that transforms into tiny 3D cinematic scenes — miniature characters, tiny landscapes, film frames. Dark dramatic background with navy blue and black, golden light particles and sparkles trailing from the quill tip, volumetric light, fantasy book illustration quality, ultra detailed, 8K render, concept art for a movie poster about storytelling magic'
  },
  {
    name: 'hero-camera',
    prompt: 'A futuristic AI film camera made of transparent glass and holographic light, with miniature movie scenes playing inside it like a snow globe — tiny actors performing on a stage inside the camera lens. Blue and purple holographic light emanating from the camera, floating film strips orbiting around it, dark cinematic background, product photography style with dramatic rim lighting, sci-fi concept art quality'
  },
  {
    name: 'hero-theater',
    prompt: 'A magical miniature movie theater floating in space, with a glowing screen showing a colorful animated film. The theater seats are filled with tiny diverse animated characters watching in amazement, popcorn floating in zero gravity, film reels orbiting the theater like planets. Cosmic background with nebula colors — purple, blue, teal. Whimsical and magical atmosphere, Pixar quality 3D render, tilt-shift effect, ultra detailed miniature world'
  },

  // ===== SHOWCASE SCENES FOR VIDEO GENERATION =====
  {
    name: 'showcase-pirate',
    prompt: 'A brave young pirate girl with red curly hair and an eye patch, standing on the bow of a magical flying pirate ship sailing through clouds at sunset. The ship has glowing sails made of starlight, with a friendly parrot on her shoulder. Golden sunset light, dramatic clouds in orange pink and purple, Pixar/Disney 3D animation quality, adventure and wonder, cinematic wide shot, movie poster composition'
  },
  {
    name: 'showcase-space',
    prompt: 'An astronaut child in a colorful spacesuit floating in space with Earth visible below, reaching out to touch a glowing butterfly made of stardust. Nebula colors in the background — deep purple, electric blue, and pink. The astronaut helmet reflects Earth and stars. Photorealistic space environment with dreamy artistic elements, NASA meets fantasy art, cinematic lighting, awe and wonder, 8K ultra detailed'
  },
  {
    name: 'showcase-underwater',
    prompt: 'A magical underwater kingdom scene with a young mermaid princess with flowing turquoise hair, sitting on a coral throne surrounded by bioluminescent sea creatures — glowing jellyfish, schools of colorful fish, sea turtles, and a friendly octopus wearing a tiny crown. Crystal clear tropical water with light rays penetrating from above, vibrant coral reef colors, Disney animation quality, dreamlike underwater atmosphere'
  },
  {
    name: 'showcase-samurai',
    prompt: 'An epic cinematic shot of a lone samurai standing on a cliff edge overlooking a vast valley filled with cherry blossom trees in full bloom. The samurai in detailed traditional armor, katana drawn, wind blowing cherry petals across the frame. Dramatic sunset with golden and crimson sky, volumetric god rays, Japanese ink painting meets photorealistic cinema, Kurosawa film aesthetic, 8K ultra detailed, movie still quality'
  },

  // ===== APP SCREENSHOTS =====
  {
    name: 'app-timeline',
    prompt: 'A clean modern dark UI screenshot of a video editing timeline interface showing 8 video thumbnails in sequence — each thumbnail showing a different animated scene (forest, castle, ocean, city). Below each thumbnail are audio waveforms in blue. The interface has a dark navy background (#0A0E27), glowing blue accent colors, modern minimalist design, professional software UI, macOS window chrome at top, 16:9 aspect ratio monitor mockup'
  },
];

async function generateOne(item) {
  if (existsSync(`${OUT}/${item.name}.png`)) {
    console.log(`  ⏭️ ${item.name}.png already exists, skipping`);
    return true;
  }
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
      console.log(`  ❌ ${item.name}: No image data`);
      return false;
    }
  } catch (err) {
    console.error(`  ❌ ${item.name}: ${err.message?.substring(0, 120)}`);
    return false;
  }
}

async function main() {
  console.log(`Generating ${prompts.length} images with ${MODEL}...\n`);
  let success = 0;
  for (let i = 0; i < prompts.length; i += 3) {
    const batch = prompts.slice(i, i + 3);
    const results = await Promise.all(batch.map(generateOne));
    success += results.filter(Boolean).length;
    if (i + 3 < prompts.length) {
      console.log('  (waiting 3s...)\n');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.log(`\n✅ Done! ${success}/${prompts.length} images generated.`);
}

main();
