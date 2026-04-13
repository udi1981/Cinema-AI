# Changelog

## 2026-04-13b — referenceImages Removed + Next-Scene Awareness

### Fixed
- **referenceImages completely removed** — Veo 3.1 does NOT support `referenceImages` at all (both ASSET and STYLE types return "use case not supported"). This was the root cause of Scene 2 failures. Now uses only `image` param (image-to-video for continuity) or prompt-only (fresh scenes).
- **Next-scene-aware video prompts** — Each scene's video prompt now includes an "ending constraint" with the first sentence of the NEXT scene's description. This ensures Scene N's video ends in a state that flows into Scene N+1's beginning (e.g., Scene 1 ends with egg cracking, not dinosaur fully hatched).
- **Script generation enhanced** — Added "CRITICAL ENDING RULE" to the script generation system prompt: each scene's visualPrompt must describe an ending state that sets up the beginning of the next scene.

### Technical Details
- Veo 3.1 confirmed API capabilities (tested directly):
  - `image` param (image-to-video): **WORKS** ✅
  - `referenceImages` ASSET type: **FAILS** ❌
  - `referenceImages` STYLE type: **FAILS** ❌
  - `image` + `referenceImages` together: **FAILS** ❌
  - `durationSeconds` valid values: **4, 6, 8 only** ✅

---

## 2026-04-13a — Video Generation Fix + UI Polish

### Fixed
- **Video generation failing on Scene 2+** — Root cause: Veo 3.1 only accepts `durationSeconds` of 4, 6, or 8. Code was sending 5 or 7 (from `Math.ceil(audioDuration)`) which the API rejected silently. Now rounds up to nearest valid value.
- **ASSET+STYLE reference mixing** — Veo API rejects mixed reference types. Scene 2 was sending character as ASSET + last frame as STYLE. Now uses two-mode approach: Mode A (image-to-video for continuity) or Mode B (referenceImages for fresh scenes).
- **Image-to-video continuity** — "Continue from this frame" now uses the `image` parameter (true image-to-video) instead of putting the last frame in `referenceImages`. This guarantees the video starts from the exact last frame.
- **Silent video generation failures** — `generateVideoForScene` and `produceNextScene` returned silently when API key was missing or video was already processing. Now shows explicit error messages and opens the API key dialog.
- **Empty API key crash** — Added check after `getApiKey()` to throw clear error instead of sending empty key to Google.
- **Video download 403 fallback** — If `x-goog-api-key` header fails, retries with `?key=` URL parameter.
- **`extractLastFrame` unreliable** — Removed `crossOrigin='anonymous'` for blob URLs, added `video.load()`, increased timeout from 3s to 15s, added detailed logging.
- **Audio exceeding video duration** — Added hard-trim safety: if TTS audio > 8s after all retry attempts, PCM is trimmed to exactly 8s so audio never outlasts the video.
- **Invisible buttons on dark theme** — "Approve", "Continue from this frame", "Produce Next", and "Download MP4" buttons were using `bg-[--success] text-black animate-pulse` which was invisible on the dark background. Changed to `bg-emerald-500 text-white` with `shadow-lg`.

### Technical Details
- Veo 3.1 valid durations: `[4, 6, 8]` only (confirmed via API testing)
- Veo API constraint: `image` (image-to-video) and `config.referenceImages` are mutually exclusive
- Veo API constraint: `referenceImages` supports up to 3 ASSET *or* 1 STYLE, no mixing

---

## 2026-04-12 — Landing Page + PWA + Mobile

### Added
- Landing page with hero, carousel, how-it-works, use cases, pricing, global reach sections
- PWA support (manifest.json, service worker, installable from browser)
- 12-language i18n for landing page
- Hash-based routing with code splitting (lazy-loaded App + Landing)
- Hamburger menu for mobile (API key, wallet, profile, language)
- Cloudflare Pages deployment (ai-movie-creator.pages.dev)

### Changed
- All accent colors unified to green (#10B981) — removed all purple/blue
- Hebrew font changed from Inter → Varela Round (with bold simulation via text-stroke)
- All landing images optimized PNG → WebP (54 MB → 4.2 MB, 92% savings)
- RTL carousel fix: forced `direction: ltr` on all animated scroll containers

### Generated Assets
- Dinosaur hatching showcase image (Imagen 4.0)
- PWA icons 192x192 and 512x512 (sharp)

---

## 2026-04-11 — Major Feature Release

### Added
- Projects system (save/load/manage multiple movies)
- Pricing tiers (Free: 2 scenes, Pro/Studio plans)
- Multi-language audio (Hebrew, English, Chinese TTS)
- Character continuity (reference images sent in every scene)
- FFmpeg WASM export (merge scenes into single MP4)
- Model selector (Gemini 2.5 Flash / Pro)
- Cost tracking per scene
- Script saved to localStorage

### Fixed
- Character drift between scenes (bear → mouse) — fixed with ASSET reference images
- Audio cut mid-sentence — match video duration to audio length
- Veo retry reduced to 2 attempts (save quota)
