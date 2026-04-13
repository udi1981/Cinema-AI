# Cinematic AI Studio — Technical Specification

## Product Overview

**Cinematic AI Studio** is a browser-based AI movie production platform that transforms text (stories, books, scripts) into fully produced animated movies with narration, using Google's Gemini AI for script generation and Veo 3.1 for video production.

**Stack:** React 19 + Vite + Tailwind CSS v4 + Google Gemini API + Veo 3.1 + FFmpeg.wasm
**Deployment:** Static SPA (Single Page Application) — no backend required
**Data Storage:** localStorage + IndexedDB (browser-only, no server)

---

## Architecture

```
src/
  App.tsx          — Main application (all UI + logic, ~2500 lines)
  types.ts         — TypeScript type definitions
  i18n.ts          — Internationalization (12 languages, ~125 keys)
  lib/utils.ts     — Utility functions (cn class merger)
  index.css        — Global CSS variables & Tailwind imports
  main.tsx         — React entry point
```

### Data Flow
```
User Input (text/prompt)
  → Gemini AI (script generation)
    → Scene breakdown (title, description, visualPrompt, audioScript)
      → For each scene:
        → Gemini TTS (text-to-speech, multi-language)
        → Veo 3.1 (video generation with reference images)
        → IndexedDB (persist video/audio blobs)
      → FFmpeg.wasm (merge all scenes into final MP4)
```

---

## Features

### 1. Script Generation
- **AI Mode**: User describes an idea → Gemini generates full scene breakdown
- **Manual Mode**: User pastes book/script text → Gemini splits into scenes
- **Models**: Gemini 3.1 Pro, 2.5 Pro, 2.5 Flash, 2.0 Flash (selectable)
- **Creative/Strict**: Creative mode enriches with cinematic depth; Strict follows text verbatim
- **Movie Length**: Short (condensed), Medium (balanced), Long (detailed)
- **Output**: JSON with title, genre, style, characterDescriptions, and array of scenes
- **Scene structure**: id, title, description, visualPrompt (English), audioScript (Hebrew), durationSeconds

### 2. Video Generation (Veo 3.1)
- **Resolution**: 720p, 16:9 aspect ratio
- **Duration**: 5-8 seconds per scene (matched to audio duration)
- **Reference Images**: Up to 3 per scene
  - Slot 0: Character image (ASSET type) — uploaded by user
  - Slot 1: Last frame from previous scene (STYLE type) — for continuity
  - Slot 2: Additional reference (STYLE type)
- **Character Lock**: Detailed character description injected into every prompt
- **Continuity System**:
  - `extractLastFrame()`: Captures last frame from previous video via hidden canvas
  - User chooses: "Continue from this frame" (seamless) or "Fresh scene" (new angle)
  - When continuing: SEAMLESS CONTINUITY prompt forces identical first frame
  - `scene.continueFromPrev` flag controls behavior per scene
- **Retry**: 2 attempts with exponential backoff (10s initial delay)
- **Cost**: ~$2.80 per scene ($0.35/sec × 8s)

### 3. Text-to-Speech (TTS)
- **Engine**: Gemini 2.5 Flash with TTS output modality
- **Multi-language**: Generates audio for ALL selected languages per scene
- **Voices**: Hebrew (Enceladus), English (Kore), Chinese (Enceladus)
- **Translation**: Automatic translation via Gemini before TTS for non-source languages
- **Audio Processing**:
  - Raw PCM → WAV conversion (24kHz, 16-bit, mono)
  - No trimming (audio is never cut mid-sentence)
  - If audio > 8.5s, retries with faster narration pace
  - Video duration matched to audio: `min(8, max(5, ceil(audioDuration)))`
- **Storage**: Primary audio in `scene.audioUrl`, per-language in `scene.langMedia[lang].audioUrl`

### 4. Scene Approval & Continuity Flow
- **Sequential Production**: Scenes produced one at a time, in order
- **Approval Required**: Each scene must be approved before the next can be produced
- **Approval Modal**: Shows the last frame with two options:
  - "Continue from this frame" — next scene starts from exact last frame (seamless)
  - "Fresh scene" — next scene starts with new angle/location (character refs still sent)
- **Batch Production**: "Produce All" auto-produces and auto-approves in sequence

### 5. Multi-Language UI (i18n)
- **12 Languages**: English, Hebrew, Arabic, French, Chinese, Portuguese, Spanish, German, Italian, Russian, Korean, Japanese
- **RTL Support**: Full right-to-left for Hebrew and Arabic (document.dir auto-set)
- **Persistence**: UI language saved to localStorage
- **Coverage**: ~125 translation keys covering all UI elements
- **Language Selector**: Flag-based dropdown in header
- **Implementation**: `t(key, lang)` function with fallback chain: target → English → key name

### 6. Project Management
- **Auto-save**: Projects auto-saved to localStorage on every state change
- **Project data**: prompt, style, movieLength, model, languages, script, settings
- **Projects Page**: Card grid with name, date, scene count, continue/delete buttons
- **New Project**: Saves current work before resetting state
- **Script Persistence**: Script auto-saved separately for quick restore on refresh

### 7. Media Persistence (IndexedDB)
- **Video blobs**: Saved to IndexedDB after generation (key: `video_{sceneId}`)
- **Audio blobs**: Primary + per-language (keys: `audio_{sceneId}_primary`, `audio_{sceneId}_{lang}`)
- **Restore on refresh**: On mount, media blobs loaded from IndexedDB → blob URLs created
- **Survives page refresh**: Videos and audio remain available after F5
- **Note**: Does not survive browser data clear or incognito mode

### 8. Character Consistency
- **Reference Images**: User uploads character images (up to 3)
- **Character Description**: Auto-analyzed by Gemini Vision on upload
- **Character Lock Prompt**: Injected into EVERY scene: "CRITICAL CHARACTER LOCK — The character MUST match this EXACT appearance"
- **Reference in every scene**: Character images sent as ASSET type to prevent drift
- **Last frame as reference**: Previous scene's last frame sent as STYLE type

### 9. Movie Export (FFmpeg.wasm)
- **In-browser**: No server needed — FFmpeg runs in WebAssembly
- **Process**:
  1. Load FFmpeg WASM (~25MB, cached)
  2. For each scene: merge video + audio (per selected language)
  3. Concatenate all scenes into single MP4
  4. Generate downloadable blob URL
- **Audio matching**: Full audio preserved (no `-shortest` flag)
- **Language selection**: Export with audio in any of the generated languages
- **Progress**: Real-time progress bar with stage descriptions

### 10. Visual Styles
- **5 Styles**: Pixar, Realistic, Paper Folding, Cyberpunk, Hand-drawn
- **Style-specific prompts**: Each style has tailored visual descriptions
- **Style reference**: Applied to character descriptions and visual prompts

### 11. User Profile & Pricing (UI Only)
- **Profile**: Name, email, current plan (stored in localStorage)
- **Plans**:
  | Plan | Price | Films/month |
  |------|-------|-------------|
  | Free | $0 | 0 (2 demo scenes) |
  | Basic | $5 | 1 film |
  | Pro | $10 | 3 films |
  | Studio | $20 | 7 films |
  | Unlimited | $50 | 20 films |
- **Free tier limit**: 2 scenes max, then upgrade required
- **Wallet display**: Header shows remaining credits/scenes
- **Note**: Payment integration (Stripe) not yet implemented — UI only

### 12. API Key Management
- **Custom API Key**: Users enter their own Google AI Studio API key
- **Validation**: Strips non-ASCII characters, validates format
- **Direct link**: "Get your free API key" → Google AI Studio
- **Persistence**: Key saved to localStorage
- **Security**: Key stored locally, never sent to any server

---

## Technical Details

### State Management
- React `useState` + `useRef` for all state
- `scriptRef` keeps sync with latest script state for async closures
- `projectsRef` + `currentProjectIdRef` prevent infinite loops in auto-save effect

### Error Handling
- API errors: Categorized (quota, auth, network) with user-friendly messages
- localStorage: try-catch wrappers on all parse/stringify operations
- IndexedDB: Graceful fallback if unavailable (scenes reset to pending)
- Video generation: 2 retries with exponential backoff
- TTS: Retry with faster pace if audio too long

### Performance
- Vite build with tree-shaking
- FFmpeg loaded on-demand (not at startup)
- Blob URLs for media (no base64 in DOM)
- IndexedDB for large binary storage (not localStorage)
- Debounced auto-save via useEffect dependencies

### Browser Requirements
- Modern browser with IndexedDB support
- SharedArrayBuffer for FFmpeg (requires COOP/COEP headers or fallback)
- WebAssembly support
- ~300MB RAM for FFmpeg operations

---

## File Structure

| File | Lines | Purpose |
|------|-------|---------|
| `src/App.tsx` | ~2500 | Main application — all UI, logic, API calls |
| `src/types.ts` | ~108 | TypeScript types: Scene, MovieScript, Project, UserProfile, etc. |
| `src/i18n.ts` | ~200 | 12-language translations (~125 keys) + helpers |
| `src/lib/utils.ts` | ~6 | `cn()` class name merger (clsx + tailwind-merge) |
| `src/index.css` | ~100 | CSS variables (dark theme) + Tailwind imports |
| `src/main.tsx` | ~10 | React DOM mount point |
| `vite.config.ts` | ~15 | Vite configuration |

---

## API Costs (per scene, approximate)

| Service | Cost |
|---------|------|
| Veo 3.1 video (8s) | ~$2.80 |
| Gemini TTS | ~$0.01 |
| Translation | ~$0.005 |
| Script generation | ~$0.01 |
| **Total per scene** | **~$2.83** |

---

## Planned Features (Not Yet Implemented)

1. **Subtitles** — Burned-in subtitles with color selection
2. **Stripe Integration** — Real payment processing for plans
3. **Backend** — Server for user auth, cloud storage, shared projects
4. **More TTS languages** — Arabic, French, Spanish, etc.
5. **Music/Sound Effects** — Background music generation
6. **Scene regeneration** — Regenerate individual scenes without losing others
7. **Collaboration** — Share projects between users
8. **Template library** — Pre-made story templates
9. **Aspect ratio options** — 9:16 (vertical), 1:1 (square)
10. **Higher resolution** — 1080p when Veo supports it
