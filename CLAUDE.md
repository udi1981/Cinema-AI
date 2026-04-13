# Cinema AI Studio

> AI-powered cinematic movie creator. Generate full movies from text using Google's Veo 3.1 and Gemini APIs.

## Tech Stack

- **Frontend:** React 19 + Vite 6 + Tailwind CSS v4 + motion/react (Framer Motion)
- **AI Video:** Google Veo 3.1 (`veo-3.1-generate-preview`) via `@google/genai` SDK
- **AI Script:** Gemini 2.5 Flash / Pro for script generation
- **AI TTS:** Gemini 2.5 Flash Preview TTS for narration
- **AI Images:** Imagen 4.0 for reference images
- **Export:** FFmpeg WASM for final MP4 merge
- **Hosting:** Cloudflare Pages (https://ai-movie-creator.pages.dev)
- **Storage:** IndexedDB for video/audio blob persistence, localStorage for scripts/settings

## Architecture

```
src/
  App.tsx           — Main app (monolithic: video gen, TTS, export, UI)
  Router.tsx        — Hash-based routing (#/studio → App, default → Landing)
  main.tsx          — Entry point
  types.ts          — TypeScript types (Scene, MovieScript, etc.)
  i18n.ts           — UI translations (12 languages)
  index.css         — Theme variables + Tailwind
  landing/          — Landing page (code-split, lazy loaded)
    LandingPage.tsx
    landingI18n.ts  — Landing page translations
    sections/       — Hero, HowItWorks, UseCases, Pricing, etc.
public/
  landing/          — Landing page images (WebP optimized)
  icons/            — PWA icons (192, 512)
  manifest.json     — PWA manifest
  sw.js             — Service worker
```

## Key Concepts

### Video Generation
Veo 3.1 (`veo-3.1-generate-preview`) does **NOT** support `referenceImages` at all (both ASSET and STYLE fail with "use case not supported"). Only two approaches work:

- **Image-to-video (Continuity):** When user chooses "Continue from this frame" → `image` parameter with the last frame. Veo starts from that exact frame.
- **Prompt-only (Fresh):** Scene 1 or "Fresh scene" → text prompt only. Character consistency maintained via detailed character description in the prompt (charLock).

### Next-Scene-Aware Prompts
Each scene's video prompt includes an "ending constraint" with the first sentence of the NEXT scene's description. This ensures Scene N's video ends in a state that naturally flows into Scene N+1's beginning.

### Veo 3.1 Duration Constraint
Only accepts `durationSeconds` of **4, 6, or 8**. No odd numbers. Code rounds up audio duration to nearest valid value.

### Audio-Video Sync
Audio (TTS) must be <= video duration. Pipeline: generate TTS → measure duration → pick valid Veo duration >= audio → if audio still > 8s, hard-trim PCM to 8s.

### RTL Support
All carousels/animations force `direction: ltr` on scroll containers. Hebrew uses Varela Round font with `-webkit-text-stroke` for bold simulation.

## Commands

```bash
npm run dev         # Dev server on port 3000
npm run build       # Production build (Vite)
npm run lint        # TypeScript check (tsc --noEmit)
npm run preview     # Preview production build
```

## API Keys

The app runs entirely client-side. Users enter their own Google Gemini API key.
The key is stored in localStorage (`gemini_api_key`).

## Coding Conventions

- Single monolithic App.tsx (2500+ lines) — all video generation logic lives here
- Tailwind CSS v4 — use explicit classes (`bg-emerald-500`) not CSS variables (`bg-[--success]`) for buttons
- All colors are green/emerald (#10B981) — no purple, no blue accents
- `text-white` on colored buttons (not `text-black` — invisible on dark theme)
- No `animate-pulse` on interactive buttons (makes them invisible at 50% opacity)
- motion/react for animations (not framer-motion directly)
- lucide-react for icons
- IndexedDB for blob persistence, localStorage for JSON state

## Important Rules

1. **Veo duration:** Only 4, 6, or 8 seconds — never 5, 7, or other values
2. **No referenceImages on Veo 3.1:** Both ASSET and STYLE types fail. Use `image` param for continuity, prompt-only for fresh scenes
3. **Audio <= Video:** TTS must never exceed video duration
4. **Next-scene awareness:** Always inject next scene's first sentence as ending constraint
5. **RTL carousels:** Always force `direction: ltr` on animated scroll containers
6. **Button visibility:** Use `bg-emerald-500 text-white`, not `bg-[--success] text-black`

## Deploy

```bash
npm run build && npx wrangler pages deploy dist --project-name=ai-movie-creator
```
