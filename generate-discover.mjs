import { GoogleGenAI } from '@google/genai';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'imagen-4.0-generate-001';
const OUT = './public/discover';

// Ensure output directory exists
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const prompts = [
  // ═══════════════════════════════════════════════════════════════
  // CREATOR AVATARS — realistic portrait headshots, diverse backgrounds
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'creator-noam',
    prompt: 'Professional headshot portrait of a 40-year-old Israeli man with short dark curly hair and warm brown eyes, slight beard stubble, wearing a casual olive field jacket over a black t-shirt, warm confident smile, outdoor natural background with golden hour light, shallow depth of field, documentary filmmaker aesthetic, National Geographic photographer vibe, professional LinkedIn portrait quality, 4K detailed'
  },
  {
    name: 'creator-luna',
    prompt: 'Professional headshot portrait of a 35-year-old Spanish woman with long wavy dark brown hair and bright hazel eyes, wearing a colorful patterned blouse, big warm smile showing teeth, artistic creative energy, bohemian style, soft studio lighting with warm tones, creative director aesthetic, Barcelona rooftop garden blurred in background, professional portrait photography, 4K detailed'
  },
  {
    name: 'creator-kai',
    prompt: 'Professional headshot portrait of a 32-year-old Japanese man with stylish undercut black hair dyed purple at the tips, sharp features, wearing a sleek black turtleneck and small silver earring, cool confident expression with slight smirk, neon city lights reflected in his eyes, cyberpunk aesthetic but professional, Tokyo night cityscape blurred behind, moody dramatic lighting, 4K detailed'
  },
  {
    name: 'creator-amara',
    prompt: 'Professional headshot portrait of a 38-year-old South African woman with beautiful natural afro hair, deep warm brown skin, wearing a teal marine research polo with small anchor pin, bright infectious smile, ocean and sky in background, confident scientist energy, Ted Talk speaker aesthetic, natural sunlight, professional portrait, 4K detailed'
  },
  {
    name: 'creator-marco',
    prompt: 'Professional headshot portrait of a 45-year-old Italian man with salt-and-pepper hair swept back, olive skin, laugh lines, wearing a white linen chef coat slightly unbuttoned, warm Mediterranean smile, rustic Italian kitchen blurred in background with copper pots, food and travel personality aesthetic, warm golden light, Anthony Bourdain energy, 4K detailed'
  },
  {
    name: 'creator-zara',
    prompt: 'Professional headshot portrait of a 29-year-old Iranian-American woman with long straight black hair with one streak of silver, striking dark eyes with artistic makeup, wearing an avant-garde black asymmetric top, confident artistic gaze, music studio with colorful lights blurred behind, Grammy nominee music director aesthetic, dramatic moody lighting, editorial fashion portrait, 4K detailed'
  },
  {
    name: 'creator-erik',
    prompt: 'Professional headshot portrait of a 42-year-old Swedish man with blonde hair and blue eyes, rectangular glasses, wearing a navy sweater over a button-down shirt, friendly approachable expression, classroom whiteboard with physics equations blurred behind, enthusiastic teacher energy, Scandinavian minimalist aesthetic, clean natural light, 4K detailed'
  },
  {
    name: 'creator-sofia',
    prompt: 'Professional headshot portrait of a 36-year-old Mexican woman with shoulder-length black hair with subtle highlights, warm brown eyes, wearing vintage turquoise jewelry and a earth-toned blouse, thoughtful intelligent expression, old library with leather-bound books blurred behind, historian and storyteller aesthetic, warm ambient lighting, 4K detailed'
  },
  {
    name: 'creator-tommy',
    prompt: 'Professional headshot portrait of a 34-year-old Korean man with messy fun hair and round glasses, wearing a bright yellow hoodie with cartoon pins, big genuine laugh showing happiness, animation studio with colorful drawings blurred behind, fun dad energy, warm cheerful lighting, approachable and playful personality, 4K detailed'
  },
  {
    name: 'creator-ava',
    prompt: 'Professional headshot portrait of a 41-year-old Chinese-American woman with a sharp bob haircut, minimal elegant makeup, wearing a perfectly tailored charcoal blazer with a small gold pin, confident polished expression, New York City skyline at dusk blurred behind, advertising creative director energy, sophisticated professional, dramatic side lighting, 4K detailed'
  },
  {
    name: 'creator-rashid',
    prompt: 'Professional headshot portrait of a 28-year-old Emirati man with short black hair and a well-groomed beard, warm dark eyes, wearing a casual white collarless linen shirt, genuine warm smile, desert dunes at golden hour blurred behind, storyteller and dreamer aesthetic, arabic cultural pride, beautiful golden light, 4K detailed'
  },
  {
    name: 'creator-mika',
    prompt: 'Professional headshot portrait of a 37-year-old Russian man with sharp cheekbones and intense pale blue eyes, dark blonde hair slightly messy, wearing a black leather jacket, mysterious intense gaze that is not quite a smile, dark moody background with single dramatic light source, psychological thriller director aesthetic, film noir lighting, 4K detailed'
  },

  // ═══════════════════════════════════════════════════════════════
  // FILM THUMBNAILS — cinematic, dramatic, each matching the story
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'film-dinosaur-dream',
    prompt: 'Hyper-realistic cinematic still: A baby Velociraptor, covered in soft downy feathers, hatching from a cracked amber-colored egg in a modern paleontology laboratory. The tiny dinosaur blinks under harsh fluorescent lights, confused. A female scientist with latex gloves gently holds the egg, tears streaming down her face in disbelief. Lab equipment, microscopes, and fossil specimens in background. Steven Spielberg cinematography, warm amber light from the egg contrasting cold blue lab lights, emotional and epic, 8K movie still'
  },
  {
    name: 'film-enchanted-treehouse',
    prompt: 'Pixar 3D animation quality: A magical glowing treehouse nestled in a massive ancient oak tree at twilight. Two children — a girl (8) with braids and a boy (5) with curly hair — climb the rope ladder, looking up in wonder. The treehouse windows glow with warm golden light, and drawings pinned to the walls are coming alive — a purple elephant materializes from a crayon sketch, stepping out of the paper. Fireflies surround the tree, magical particles in the air, lush green garden, Pixar movie quality render, enchanting and whimsical'
  },
  {
    name: 'film-neon-ronin',
    prompt: 'Cyberpunk cinematic still: A samurai android with glowing blue circuit lines visible under synthetic skin, wearing a futuristic kimono with holographic patterns, standing on a rain-soaked rooftop in Neo-Tokyo. He holds a plasma katana that crackles with energy. Behind him, towering holographic advertisements in Japanese and massive skyscrapers disappear into fog. Neon reflections in puddles — pink, cyan, purple. Blade Runner meets Ghost in the Shell, 8K, dramatic low angle shot, volumetric fog and rain'
  },
  {
    name: 'film-abyss-breathes',
    prompt: 'Cinematic underwater scene: A deep-sea submersible with a single spotlight illuminating the pitch-black Mariana Trench. In the darkness beyond the light, an enormous bioluminescent creature is barely visible — hundreds of glowing blue and green spots forming a pattern that looks almost like a face. The creature is miles long, curling around underwater mountains. Inside the submersible, a woman presses her hand against the glass in awe. Deep ocean blue-black color palette with bioluminescent accents, atmospheric and terrifying beauty, 8K'
  },
  {
    name: 'film-spice-road',
    prompt: 'Warm cinematic still: Close-up of weathered hands holding an old leather-bound recipe book open to a page with handwritten text in Italian and pressed dried saffron flowers. In the background, a steaming Moroccan tagine pot in a bustling Marrakech spice market with mountains of colorful spices — turmeric yellow, paprika red, cinnamon brown. Warm golden light streaming through fabric canopy, smoke and steam rising, rich colors, food photography meets cinema, Anthony Bourdain documentary quality, 8K'
  },
  {
    name: 'film-synesthesia',
    prompt: 'Abstract cinematic art: A grand piano in a pure white infinite space. As the pianist plays, each note creates an explosion of liquid color — C-sharp minor sends cascading waves of deep ocean mercury blue, G major erupts in golden sunflower fields growing in fast-forward from the piano keys. The colors are physically tangible, dripping and flowing like paint in water. The pianist is a silhouette consumed by the color explosions. Fantasia meets modern art, incredibly vibrant, psychedelic but elegant, 8K ultra detailed'
  },
  {
    name: 'film-last-light',
    prompt: 'Epic cosmic cinematic still: The last star in the universe — a dim, dying red dwarf — flickers alone in an infinite void of pure darkness. Orbiting it, a single ancient space station covered in ice crystals, with one small window still glowing warm amber. Inside, holographic screens display memories of billions of civilizations — faces, cities, sunsets, laughter — all fading. A single AI consciousness, represented by a gentle blue light, watches the star die. Overwhelmingly beautiful and melancholic, cosmic scale, Christopher Nolan cinematography, Interstellar aesthetic, 8K'
  },
  {
    name: 'film-captain-bones',
    prompt: 'Cinematic wide shot: A magnificent 17th-century pirate galleon with tattered black sails sailing through a storm at sunset. At the bow, a fierce woman pirate captain with dreadlocks and a long red coat holds up a golden compass that glows with supernatural light, pointing not north but toward a distant shore. Lightning illuminates the ship, revealing the crew at work. Massive waves crash against the hull. Golden sunset light breaking through storm clouds. Pirates of the Caribbean quality, epic and adventurous, 8K movie still'
  },
  {
    name: 'film-wobbles-day',
    prompt: 'Pixar 3D animation: An adorably clumsy toy robot (round body, one wobbly wheel, two mismatched button eyes — one blue one green) standing in a kitchen covered in flour, eggs, and frosting. The robot holds a hilariously lopsided birthday cake with too many candles. Behind him, the kitchen is a disaster — pots on the floor, cat covered in batter peeking from behind a chair, smoke alarm going off. But the cake actually looks delicious. A teddy bear friend peeks through the door with a huge smile. Warm, funny, heartwarming, Pixar quality, bright cheerful colors'
  },
  {
    name: 'film-samurai-dawn',
    prompt: 'Japanese watercolor art style cinematic: An elderly samurai with white hair in a simple worn robe, walking alone through a tunnel of cherry blossom trees in full bloom. Pink petals fall like snow around him. He carries a single sealed letter in one hand and a sheathed katana on his back. Behind him, a long winding path stretches to distant mountains. The art style blends traditional sumi-e ink painting with photorealistic depth — watercolor washes for the sky, detailed brushwork for the blossoms, the samurai rendered in sharp detail against the dreamy background. Golden hour light, transcendent beauty, 8K'
  },
  {
    name: 'film-atlas-ad',
    prompt: 'Hyper-realistic luxury commercial still: Extreme close-up of a child\'s small hand holding up a vintage scratched gold watch to golden hour sunlight streaming through a window. The light passes through the scratched crystal and creates rainbow prisms on the child\'s face. The watch face shows 5:17. Reflected in the watch crystal, we can barely see four generations of faces — great-grandfather, grandfather, mother, child. Shallow depth of field, warm golden color palette, premium luxury advertising quality, Omega/Rolex commercial aesthetic, 8K'
  },
  {
    name: 'film-whispers-sand',
    prompt: 'Cinematic fantasy still: A 12-year-old Arab girl with flowing black hair and determined eyes stands at the edge of the Empty Quarter desert at night. Before her, a massive being made of swirling golden sand and starlight rises from the dunes — a djinn, ancient and beautiful, with constellations for eyes and sand flowing like robes. The girl reaches out to touch the djinn\'s extended hand. Around them, the sand floats upward defying gravity, and ancient lost ruins are visible beneath the transparent dunes. Starry desert sky with the Milky Way blazing, Arabian Nights meets modern cinema, magical realism, 8K'
  },
  {
    name: 'film-room-404',
    prompt: 'Psychological horror cinematic: A hotel corridor — endless, symmetrical, with patterned carpet and dim warm sconces. All room doors are identical dark wood with gold numbers, but one door at the end has no number. It is slightly ajar, and from the gap, a warm golden light spills out that seems wrong somehow — too warm, too inviting. The corridor is empty but feels like someone just walked through. The carpet shows no footprints. A single chair sits facing the open door, as if someone was waiting. The Shining meets Kubrick symmetry, unsettling beauty, liminal space horror, 8K'
  },
  {
    name: 'film-comic-hero',
    prompt: 'Comic book art style: A teenage girl sits at her desk drawing in her sketchbook by lamplight. From the pages, her superhero creation — Crimson Bolt, a woman in a red and gold suit — is literally climbing out of the sketchbook, half drawn and half real. The drawn half is comic-book style with bold outlines and halftone dots, the real half is photorealistic. The girl stares in shock, pencil frozen mid-stroke. Around the room, other drawings are starting to move on the walls. Split reality between drawn and real, Spider-Verse aesthetic, dynamic composition, 8K'
  },
  {
    name: 'film-silk-road',
    prompt: 'Cinematic travel documentary still: A panoramic view of the ancient Registan Square in Samarkand, Uzbekistan, at golden hour. The three massive madrasas with intricate blue and gold tilework glow in sunset light. In the foreground, a man with salt-and-pepper hair sits at a low table with a 90-year-old Uzbek woman, sharing a pot of tea. Between them, a steaming plate of plov (rice pilaf). Their hands tell stories — his gesticulating, hers steady and knowing. Cultural warmth, travel documentary beauty, National Geographic quality, 8K'
  },
  {
    name: 'film-lego-escape',
    prompt: 'LEGO cinematic: A LEGO minifigure police officer stands on the edge of his LEGO city, staring up at what he now realizes is a cardboard wall — the edge of a toy box. Beyond the wall, through a crack, we can see a massive real-world bedroom with a sleeping child. The LEGO city behind the officer is vibrant and perfect, but the officer\'s face shows dawning realization. LEGO studs visible on all surfaces, photorealistic rendering of actual LEGO bricks, dramatic lighting with the real-world light spilling into the LEGO world, The LEGO Movie quality, 8K'
  },

  // ═══════════════════════════════════════════════════════════════
  // ADDITIONAL NEW FILMS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'film-tokyo-ramen',
    prompt: 'Anime style cinematic: A cozy tiny ramen shop in a Tokyo back alley at night, rain falling outside. Inside, an elderly Japanese ramen master with a white headband carefully places a perfect soft-boiled egg on a bowl of golden tonkotsu ramen, steam rising beautifully. A young woman sits at the counter watching with reverence. Warm yellow light from paper lanterns, rain-soaked alley visible through the doorway with neon signs reflecting in puddles. Studio Ghibli meets food photography, hand-painted anime quality, intimate and warm, 8K'
  },
  {
    name: 'film-northern-lights',
    prompt: 'Breathtaking nature cinematic: The Northern Lights (Aurora Borealis) dancing across the sky above a frozen Norwegian fjord. In the foreground, a woman in a red parka stands on a snow-covered cliff edge, arms outstretched, face turned up to the green and purple light show. Her breath is visible in the cold. Below, a small fishing village with warm glowing windows nestles against the dark water. Reflections of the aurora in the still fjord water. National Geographic quality, overwhelming natural beauty, 8K'
  },
  {
    name: 'film-paper-kingdom',
    prompt: 'Paper art animation style: An entire kingdom made of folded origami paper — delicate paper castles with paper flags, paper trees with paper leaves, tiny paper people walking on paper bridges over paper rivers. A paper princess with a paper crown stands at the top of the tallest tower, and a paper dragon with incredibly detailed folds flies around the spire. Everything is white and cream paper with subtle shadows showing the folds and creases. Warm side lighting casting beautiful shadows, papercraft art at its finest, macro photography aesthetic, 8K'
  },
  {
    name: 'film-street-art',
    prompt: 'Vibrant street art cinematic: A young woman spray-painting a massive mural on a gray concrete wall at dawn. The mural is coming to life — painted birds fly off the wall as real birds, painted flowers grow real petals, a painted ocean waves actually move. The artist stands back in shock as her art transcends the wall. Urban setting with old buildings, early morning golden light hitting the wall, street art aesthetic meets magical realism, Banksy meets Studio Ghibli, 8K'
  },
  {
    name: 'film-clockwork-heart',
    prompt: 'Steampunk cinematic: Inside an enormous clocktower, a young girl mechanic with goggles pushed up on her forehead works on a giant mechanical heart made of brass gears, copper pipes, and glass chambers filled with glowing blue liquid. The heart is the size of a car and beats slowly, each beat sending ripples of blue light through the tower. Clock gears and mechanisms surround her on all sides. Steam rises from pipes. Warm amber and cool blue lighting contrast, steampunk fantasy meets emotional storytelling, 8K'
  },
  {
    name: 'film-migration',
    prompt: 'Epic nature documentary cinematic: Millions of monarch butterflies in migration, filling the sky like a living orange-and-black river flowing between mountain peaks in Mexico. In the center of the butterfly stream, a single white butterfly — different from all others — flies along. Close-up detail showing the intricate wing patterns with sunlight streaming through translucent wings. Forest canopy below, mountain peaks and clouds above. Planet Earth documentary quality, breathtaking natural phenomenon, 8K'
  },
  {
    name: 'film-virtual-school',
    prompt: 'Futuristic education cinematic: A diverse group of children wearing sleek AR glasses sit in a circle in a modern classroom. Above them, a massive holographic solar system floats — planets orbiting, the sun radiating warmth. One boy reaches up and grabs Jupiter, pulling it close to examine the Great Red Spot. A girl walks through the rings of Saturn. The teacher, a young man with glasses and a warm smile, conducts the planets like an orchestra. Bright, optimistic, future-of-education aesthetic, clean modern design, 8K'
  },
  {
    name: 'film-ghost-train',
    prompt: 'Horror atmospheric cinematic: An abandoned Art Deco subway station, deep underground, with cracked tile mosaics and a single flickering light. On the platform, a vintage 1940s train sits with its doors open, warm golden light spilling from inside. Through the windows, silhouettes of passengers sit perfectly still — they look normal but something is deeply wrong. The platform clock is frozen at 3:33 AM. Fog curls along the ground. No one has been here in 60 years, but the train just arrived. Psychological horror, eerie beauty, 8K'
  },
];

async function generateOne(item) {
  const path = `${OUT}/${item.name}.webp`;
  if (existsSync(path)) {
    console.log(`  ⏭️  ${item.name} already exists, skipping`);
    return true;
  }
  console.log(`🎬 Generating: ${item.name}...`);
  try {
    const response = await ai.models.generateImages({
      model: MODEL,
      prompt: item.prompt,
      config: { numberOfImages: 1 }
    });
    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (imageBytes) {
      const buffer = Buffer.from(imageBytes, 'base64');
      writeFileSync(path, buffer);
      console.log(`  ✅ ${item.name} (${(buffer.length / 1024).toFixed(0)}KB)`);
      return true;
    } else {
      console.log(`  ❌ ${item.name}: No image data returned`);
      return false;
    }
  } catch (err) {
    console.error(`  ❌ ${item.name}: ${err.message?.substring(0, 150)}`);
    return false;
  }
}

async function main() {
  console.log(`\n🎬 Cinema AI — Discover Page Image Generator`);
  console.log(`   Model: ${MODEL}`);
  console.log(`   Output: ${OUT}/`);
  console.log(`   Total: ${prompts.length} images\n`);

  let success = 0;
  let failed = 0;

  // Process in batches of 3 with rate limiting
  for (let i = 0; i < prompts.length; i += 3) {
    const batch = prompts.slice(i, i + 3);
    const results = await Promise.all(batch.map(generateOne));
    success += results.filter(Boolean).length;
    failed += results.filter(r => !r).length;

    console.log(`   Progress: ${success + failed}/${prompts.length} (${success} ok, ${failed} failed)\n`);

    if (i + 3 < prompts.length) {
      console.log('   ⏳ Rate limit pause (4s)...\n');
      await new Promise(r => setTimeout(r, 4000));
    }
  }

  console.log(`\n════════════════════════════════════`);
  console.log(`✅ Complete! ${success}/${prompts.length} images generated`);
  if (failed > 0) console.log(`❌ ${failed} failed — re-run script to retry`);
  console.log(`════════════════════════════════════\n`);
}

main();
