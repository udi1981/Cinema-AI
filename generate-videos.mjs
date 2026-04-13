import { GoogleGenAI } from '@google/genai';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'veo-3.1-generate-preview';
const OUT = './public/landing/videos';

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const VIDEOS = [
  {
    name: 'dino-hatch',
    prompt: 'Hyper-realistic close-up of a baby Velociraptor dinosaur hatching from a large egg in a prehistoric jungle. The egg cracks slowly, viscous amniotic fluid drips down, the baby dinosaur pushes through the shell with tiny claws. Dramatic natural lighting through ancient ferns and mist. National Geographic documentary quality, slow motion, cinematic.',
  },
  {
    name: 'pixar-treehouse',
    prompt: 'Pixar-style 3D animated scene of two children in a magical treehouse. Sparkles and fireflies float around them, they look out the window at a fantasy landscape with floating islands. Warm golden light, whimsical camera movement, Pixar movie quality animation.',
  },
  {
    name: 'pirate-ship',
    prompt: 'Epic cinematic shot of a pirate ship flying through dramatic clouds at sunset. The ship sails through golden-lit cloud formations, flags fluttering in wind, a young girl pirate captain stands at the helm. Sweeping camera movement, dramatic orchestral feeling, Disney movie quality.',
  },
  {
    name: 'concert-spectacle',
    prompt: 'Spectacular concert scene with a massive crowd, dramatic stage lighting with laser beams cutting through smoke, a rock band performing on a huge stage. Camera sweeps over the crowd showing thousands of fans, pyrotechnics explode, epic concert atmosphere, 4K cinematic quality.',
  },
];

async function generateVideo(video) {
  console.log(`\nGenerating "${video.name}"...`);

  let op = await ai.models.generateVideos({
    model: MODEL,
    prompt: video.prompt,
    config: { numberOfVideos: 1, aspectRatio: '16:9', durationSeconds: 6 },
  });

  // Poll until done
  while (!op.done) {
    console.log(`  Polling "${video.name}"...`);
    await new Promise((r) => setTimeout(r, 15000));
    op = await ai.operations.getVideosOperation({ operation: op });
  }

  const vid = op.response?.generatedVideos?.[0];
  if (!vid?.video?.uri) {
    console.error(`  FAILED: No video URI for "${video.name}"`);
    return;
  }

  // Download the video (append API key for auth)
  const uri = vid.video.uri;
  const separator = uri.includes('?') ? '&' : '?';
  const authUri = `${uri}${separator}key=${process.env.GEMINI_API_KEY}`;
  console.log(`  Downloading from: ${uri}`);
  const resp = await fetch(authUri);
  if (!resp.ok) {
    console.error(`  Download failed: ${resp.status} ${resp.statusText}`);
    return;
  }
  const buf = Buffer.from(await resp.arrayBuffer());
  const outPath = `${OUT}/${video.name}.mp4`;
  writeFileSync(outPath, buf);
  console.log(`  Saved ${outPath} (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
}

async function main() {
  console.log('=== Veo 3.1 Demo Video Generator ===');
  console.log(`Generating ${VIDEOS.length} videos (this takes 2-5 min each)...\n`);

  for (const video of VIDEOS) {
    try {
      await generateVideo(video);
    } catch (err) {
      console.error(`  ERROR on "${video.name}":`, err.message || err);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
