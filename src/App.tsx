import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Sparkles,
  Play,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Settings,
  Download,
  Trash2,
  Clapperboard,
  Palette,
  Clock,
  Wand2,
  X,
  Upload,
  Globe,
  Check,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Coins,
  Volume2,
  User,
  Crown,
  Folder,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Modality, VideoGenerationReferenceType } from "@google/genai";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { cn } from './lib/utils';
import { MovieScript, Scene, MovieStyle, ReferenceImage, AudioLanguage, WizardStep, ExportStatus, MovieLength, SCENE_COST, COST_PER_SCENE, estimateScenes, Project, UserProfile, PlanTier, PLAN_CONFIG } from './types';

// Constants
const VEO_MODEL = 'veo-3.1-generate-preview';

const SCRIPT_MODELS = [
  { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro', desc: 'Best quality (requires billing)' },
  { id: 'gemini-2.5-pro-preview-05-06', label: 'Gemini 2.5 Pro', desc: 'Great quality' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', desc: 'Fast & free tier' },
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', desc: 'Fast & free tier' },
] as const;

const MOVIE_LENGTH_LABELS: Record<MovieLength, { labelHe: string; icon: string; desc: string }> = {
  short: { labelHe: 'קצר', icon: '⚡', desc: 'תמצית — רק אירועים מרכזיים' },
  medium: { labelHe: 'בינוני', icon: '🎬', desc: 'מאוזן — כל הסצנות החשובות' },
  long: { labelHe: 'ארוך', icon: '🎥', desc: 'מפורט — כל פרט בסיפור' },
};

const LANGUAGE_CONFIG: Record<AudioLanguage, { label: string; flag: string; voice: string; ttsLang: string }> = {
  he: { label: 'עברית', flag: '🇮🇱', voice: 'Enceladus', ttsLang: 'Hebrew' },
  en: { label: 'English', flag: '🇺🇸', voice: 'Kore', ttsLang: 'English' },
  zh: { label: '中文', flag: '🇨🇳', voice: 'Enceladus', ttsLang: 'Chinese Mandarin' },
};

export default function App() {
  // State
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<MovieStyle>('Pixar');
  const [beCreative, setBeCreative] = useState(true);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [script, setScript] = useState<MovieScript | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number | null>(null);
  const [isApiKeySelected, setIsApiKeySelected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>('story');
  const [selectedLanguages, setSelectedLanguages] = useState<AudioLanguage[]>(['he']);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [audioLanguage, setAudioLanguage] = useState<AudioLanguage>('he');
  const [characterImageDescription, setCharacterImageDescription] = useState('');
  const [movieLength, setMovieLength] = useState<MovieLength>('medium');
  const [scriptModel, setScriptModel] = useState<string>(SCRIPT_MODELS[0].id);
  const [totalSpent, setTotalSpent] = useState(0); // Total USD spent this session
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState('');
  // Export state
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [exportProgress, setExportProgress] = useState(0);
  const [exportProgressMsg, setExportProgressMsg] = useState('');
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [exportLanguage, setExportLanguage] = useState<AudioLanguage>('he');
  const [showExportDialog, setShowExportDialog] = useState(false);
  // Projects state (localStorage)
  const [projects, setProjects] = useState<Project[]>(() => JSON.parse(localStorage.getItem('cinema_projects') || '[]'));
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  // User profile state (localStorage)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('cinema_user') || '{"name":"","email":"","plan":"free","credits":0,"scenesUsed":0}'));
  const [showProfile, setShowProfile] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scriptRef = useRef<MovieScript | null>(null);

  // Keep ref in sync with state so async functions always see latest script
  // Also persist script to localStorage (without video/audio blobs)
  useEffect(() => {
    scriptRef.current = script;
    if (script) {
      try {
        const toSave = {
          ...script,
          scenes: script.scenes.map(s => ({
            ...s,
            // Don't save blob URLs — they expire on refresh
            videoUrl: undefined,
            audioUrls: undefined,
          })),
        };
        localStorage.setItem('cinema_script', JSON.stringify(toSave));
      } catch (e) { /* storage full, ignore */ }
    } else {
      localStorage.removeItem('cinema_script');
    }
  }, [script]);

  // Restore script from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cinema_script');
      if (saved && !script) {
        const parsed = JSON.parse(saved) as MovieScript;
        // Reset video statuses — blobs are gone after refresh
        parsed.scenes = parsed.scenes.map(s => ({
          ...s,
          status: s.status === 'generating' ? 'pending' : s.status === 'completed' && !s.videoUrl ? 'pending' : s.status,
          videoUrl: undefined,
          audioUrls: undefined,
        }));
        setScript(parsed);
        setWizardStep('timeline');
      }
    } catch (e) { /* corrupt data, ignore */ }
  }, []);

  // Sync audio with video
  useEffect(() => {
    if (videoRef.current && audioRef.current) {
      const video = videoRef.current;
      const audio = audioRef.current;

      const syncAudio = () => {
        if (Math.abs(audio.currentTime - video.currentTime) > 0.2) {
          audio.currentTime = video.currentTime;
        }
      };

      const playAudio = () => {
        audio.play().catch(() => {});
      };

      const pauseAudio = () => {
        audio.pause();
      };

      video.addEventListener('play', playAudio);
      video.addEventListener('pause', pauseAudio);
      video.addEventListener('seeking', syncAudio);
      video.addEventListener('timeupdate', syncAudio);

      return () => {
        video.removeEventListener('play', playAudio);
        video.removeEventListener('pause', pauseAudio);
        video.removeEventListener('seeking', syncAudio);
        video.removeEventListener('timeupdate', syncAudio);
      };
    }
  }, [currentSceneIndex, script]);

  // Get active API key (custom override > env vars)
  const getApiKey = () => customApiKey || process.env.API_KEY || process.env.GEMINI_API_KEY || '';
  const getGeminiKey = () => customApiKey || process.env.GEMINI_API_KEY || '';

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      if (customApiKey) {
        setIsApiKeySelected(true);
      } else if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
      } else if (process.env.API_KEY || process.env.GEMINI_API_KEY) {
        setIsApiKeySelected(true);
      }
    };
    checkKey();
  }, [customApiKey]);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setIsApiKeySelected(true);
    } else {
      // Show custom API key input
      setApiKeyDraft(customApiKey);
      setShowApiKeyInput(true);
    }
  };

  const saveApiKey = () => {
    // Strip any non-ASCII characters and whitespace
    const key = apiKeyDraft.replace(/[^\x20-\x7E]/g, '').trim();
    if (key && !/^[A-Za-z0-9_-]+$/.test(key)) {
      setError('Invalid API key — only English letters, numbers, dashes and underscores are allowed.');
      return;
    }
    setApiKeyDraft(key);
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      setIsApiKeySelected(true);
    } else {
      localStorage.removeItem('gemini_api_key');
      setIsApiKeySelected(!!(process.env.API_KEY || process.env.GEMINI_API_KEY));
    }
    setShowApiKeyInput(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (referenceImages.length >= 3) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const previewUrl = URL.createObjectURL(file);
        
        setReferenceImages(prev => [
          ...prev, 
          { 
            id: Math.random().toString(36).substr(2, 9), 
            data: base64, 
            mimeType: file.type,
            previewUrl
          }
        ].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeReferenceImage = (id: string) => {
    setReferenceImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  // Analyze reference images to generate hyper-detailed character description for consistency
  const analyzeReferenceImages = async (images: ReferenceImage[]) => {
    if (images.length === 0) {
      setCharacterImageDescription('');
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: getGeminiKey() });
      const imageParts = images.map(img => ({
        inlineData: { data: img.data, mimeType: img.mimeType }
      }));
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [
          ...imageParts,
          { text: `You are a character consistency specialist for AI video generation. Analyze this character reference image(s) and produce an EXHAUSTIVE physical description in English that will be injected into EVERY video generation prompt to ensure the character looks IDENTICAL across 20+ scenes.

Include ALL of the following with extreme precision:
- FACE: exact face shape, skin tone (be specific e.g. "warm olive with golden undertones"), forehead size, cheekbone prominence, jaw shape
- EYES: exact color, shape (round/almond/hooded), size, eyelash length, eyebrow shape+thickness+color
- NOSE: shape, size, bridge width
- MOUTH: lip shape, lip color, teeth visibility
- HAIR: exact color (e.g. "dark chestnut brown with subtle auburn highlights"), style, length, texture (straight/wavy/curly), parting side, bangs
- BODY: approximate age, height estimate, build (slim/athletic/average/heavy), posture
- CLOTHING: describe EVERY garment with exact colors, patterns, textures, fit. Include accessories, shoes, hats, glasses
- DISTINGUISHING FEATURES: scars, freckles, moles, dimples, tattoos, piercings

Output ONLY the description, no preamble. Be ruthlessly specific — vague descriptions cause character drift in AI video.` }
        ]}]
      });
      const desc = response.text?.trim() || '';
      setCharacterImageDescription(desc);
      console.log('Character analysis:', desc.substring(0, 150) + '...');
    } catch (err) {
      console.error('Failed to analyze reference images:', err);
    }
  };

  // Auto-analyze when reference images change
  useEffect(() => {
    if (referenceImages.length > 0) {
      analyzeReferenceImages(referenceImages);
    } else {
      setCharacterImageDescription('');
    }
  }, [referenceImages.length]); // Only re-run when count changes

  const generateScript = async () => {
    if (!prompt.trim()) return;
    
    setIsGeneratingScript(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: getGeminiKey() });

      // Prepare image parts for Gemini to "see" the references
      const imageParts = referenceImages.map(img => ({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType
        }
      }));

      const systemInstruction = `You are an elite-level film director, cinematographer, and screenwriter working at the highest level of cinematic production (Spielberg, Villeneuve, Nolan caliber).

YOUR MISSION: Break down the user's text into an ULTRA-DETAILED scene-by-scene production bible. Each scene = one 7-8 second AI-generated video clip. The output must be so detailed that an AI video generator (Google Veo) can produce a perfect shot with ZERO ambiguity.

=== LANGUAGE RULES ===
- "title": Hebrew (עברית)
- "description": Hebrew — full cinematic narrative description with emotional beats
- "audioScript": Hebrew — ALL dialogue and narration MUST be in Hebrew. This is the SPOKEN TEXT that will be synthesized to audio via TTS. Write natural, expressive, cinematic Hebrew. Include speaker tags in parentheses when multiple characters speak, e.g. (גוליבר:) or (מספר:)
- "visualPrompt": ENGLISH ONLY — this goes directly to the Veo AI video model. Must be hyper-detailed in English.

=== CRITICAL SOURCE FIDELITY ===
Follow the user's source text with EXTREME precision. Do NOT skip scenes, compress dialogue, or summarize. Every meaningful sentence, event, and piece of dialogue in the source must appear in the output. If the source has 20 events, produce 20+ scenes — never compress into fewer.
${beCreative ? 'CREATIVE MODE ON: Enhance with cinematic depth — add atmospheric details, emotional subtext, dramatic camera movements, and rich visual texture. But NEVER skip or compress source content. Only ADD, never remove.' : 'STRICT MODE: Follow source text literally. No embellishments. Describe exactly what the text says.'}

=== VISUAL PROMPT SPECIFICATION (ENGLISH — for Veo AI) ===
Each "visualPrompt" must be a COMPLETE shot description containing ALL of the following:

**CAMERA:** Exact shot type (extreme close-up, medium shot, wide establishing shot, bird's-eye, Dutch angle, over-the-shoulder, POV, tracking shot, dolly zoom, crane shot, steadicam follow). Specify camera MOVEMENT (slow push-in, lateral tracking left-to-right, ascending crane, handheld shake, static locked-off, slow orbit around subject).

**LIGHTING:** Exact lighting setup (golden hour warm backlight, harsh overhead fluorescent, single-source candlelight with deep shadows, volumetric god-rays through fog, cool blue moonlight rim-lighting, three-point studio setup). Specify direction, color temperature (2700K warm, 5600K daylight, 8000K cold blue), and contrast ratio.

**SUBJECT:** Precise physical description of EVERY character in frame — age, build, skin tone, hair (color/style/length), clothing (exact garments, colors, textures, condition — torn/pristine/weathered), facial expression (micro-expressions: furrowed brow, slight smirk, wide terrified eyes, clenched jaw), body posture and gesture. If reference images were provided, describe characters EXACTLY as they appear in those references.

**ACTION:** Frame-by-frame description of movement within the 8-second clip. What happens at second 0? Second 3? Second 7? Describe the MOTION: "Character slowly raises trembling hand to face, fingers spread, tears rolling down left cheek" — not just "character is sad."

**ENVIRONMENT:** Full production design — location (interior/exterior), architecture style, materials (rough stone, polished marble, rusted metal), weather (overcast with light drizzle, clear starry night, thick rolling fog), time of day, season. Background elements: crowd density, vehicles, vegetation type, props on surfaces.

**COLOR & MOOD:** Dominant color palette (desaturated teal and orange, high-contrast black and red, pastel watercolor wash). Film stock emulation (Kodak Vision3 500T, ARRI Alexa look, 16mm grain). Mood keywords (haunting, euphoric, claustrophobic, dreamlike, visceral).

**STYLE:** "${style}" style. Specify exactly how this style manifests: ${style === 'Pixar' ? 'Smooth subsurface scattering on skin, large expressive eyes, rounded soft geometry, saturated candy-like colors, subtle ambient occlusion, Pixar-quality cloth simulation' : style === 'Realistic' ? 'Photorealistic rendering, natural skin pores and imperfections, accurate cloth physics, cinematic depth of field f/1.4, lens flare on highlights, film grain' : style === 'Paper Folding' ? 'Everything built from folded paper/origami, visible paper texture and creases, stop-motion-like movement at 12fps, paper shadows, miniature diorama scale, warm craft lighting' : style === 'Cyberpunk' ? 'Neon-drenched environments, holographic UI overlays, rain-slicked streets reflecting neon, chrome and carbon fiber materials, LED tattoos, volumetric fog with colored light rays' : 'Hand-drawn pencil/ink linework visible, watercolor wash backgrounds, slight paper texture overlay, 2D parallax depth, Studio Ghibli-inspired movement fluidity'}

**CONTINUITY & SEAMLESS TRANSITIONS (CRITICAL — NO VISUAL JUMPS):**
Every scene MUST flow seamlessly into the next, as if they are one continuous film. For each scene (except the first), describe:
- EXACT TRANSITION TYPE: "This scene begins exactly where the previous scene ended" / "Continuous camera movement from previous shot" / "Match cut from close-up to wide shot"
- MATCHING ELEMENTS: The last frame of the previous scene and the first frame of this scene must share: same lighting direction, same color temperature, same weather, same time of day (unless a time skip is narrated)
- CHARACTER POSITION: If the character was on the left side of frame in the previous scene's final moment, they must START on the left side in this scene
- CAMERA FLOW: Describe how the camera movement connects: "Camera continues its slow pan right from the previous scene" / "Cut to reverse angle of the same conversation"
- ENVIRONMENT CONTINUITY: Same room = same furniture placement, same wall color, same props. Moving to new location = show the character walking/transitioning, never jump-cut to a new place without a visual bridge
- AVOID: Jump cuts, sudden lighting changes, unexplained location changes, character teleportation, costume changes without reason

=== AUDIO SCRIPT (HEBREW) ===
The "audioScript" is the EXACT Hebrew text that will be spoken aloud via TTS. Rules:
- Write COMPLETE dialogue — every word the character says, in natural spoken Hebrew
- For narration, write cinematic Hebrew narration (כמספר סיפורים מקצועי)
- Mark speakers: (מספר:) for narrator, (שם-דמות:) for characters
- Include emotional direction in brackets: [בלחש, בפחד] [צועק בכעס] [בשקט, בהתרגשות עמוקה]
- NEVER summarize dialogue. If a character gives a speech, write the FULL speech in Hebrew.
- Match the audioScript timing to the 8-second video duration

=== CHARACTER CONSISTENCY (ABSOLUTE PRIORITY — ZERO TOLERANCE FOR DRIFT) ===
You MUST output a "characterDescriptions" field — a single English paragraph describing EVERY character's FIXED appearance: exact age, height, build, skin tone, eye color, hair color/style/length, signature clothing, and distinguishing features. If reference images are provided, base descriptions EXACTLY on those images.
${characterImageDescription ? `\n=== REFERENCE IMAGE CHARACTER ANALYSIS (USE THIS EXACTLY) ===\nThe following description was generated from the user's uploaded reference photos. This is the GROUND TRUTH for the character's appearance. Copy this description WORD FOR WORD into your "characterDescriptions" field and into EVERY "visualPrompt":\n${characterImageDescription}\n` : ''}
EVERY "visualPrompt" MUST begin with the FULL character description, word-for-word. The character MUST look IDENTICAL in every single scene — same face, same hair, same clothing, same skin tone. ANY deviation is a critical failure. This ensures the AI video generator renders the SAME character in every scene.

=== SCENE GRANULARITY ===
Each scene = one 8-second video clip. The user chose "${movieLength}" density.
The source text has approximately ${prompt.split(/\s+/).filter(Boolean).length} words.
Target scene count: approximately ${estimateScenes(prompt.split(/\s+/).filter(Boolean).length)[movieLength]} scenes.

${movieLength === 'short' ? 'COMPACT MODE: Group multiple story beats into cohesive scenes. Prioritize the most important events and key dialogue. Skip minor transitions and descriptions.' : movieLength === 'medium' ? 'BALANCED MODE: Cover all major story events and key dialogue. Group minor transitions together. Skip only truly trivial details.' : 'COMPREHENSIVE MODE: Cover the entire story in detail. Every meaningful event, dialogue, and transition gets its own scene.'}

CRITICAL RULE: The ENTIRE story arc must be covered — beginning, middle, and end. Do NOT stop partway through. Do NOT skip the ending. Stay close to the target scene count.

=== AUDIO DURATION MATCHING (CRITICAL) ===
Video clips are 5-8 seconds long. The audioScript MUST fit within this time. Calculate: ~2.5 Hebrew words per second for natural speech.
- 5 second scene = MAX 12 Hebrew words in audioScript
- 6 second scene = MAX 15 Hebrew words
- 7 second scene = MAX 17 Hebrew words
- 8 second scene = MAX 20 Hebrew words
If dialogue is LONGER than 20 words, SPLIT it across multiple scenes. Set "durationSeconds" to match the audioScript word count.
NEVER put more text in audioScript than can be spoken in durationSeconds. The audio and video MUST end together — no cut-off mid-sentence.
If a character has a long speech, break it into multiple scenes with natural pause points.

=== OUTPUT FORMAT ===
Return a JSON object:
{
  "title": "כותרת הסרט בעברית",
  "genre": "ז'אנר",
  "style": "${style}",
  "characterDescriptions": "ENGLISH: Yuliver is a small alien boy, approximately 8 years old, with bright glowing teal eyes, soft lavender skin, short spiky silver hair... [FULL DESCRIPTION OF EVERY CHARACTER]",
  "scenes": [
    {
      "id": "scene-001",
      "title": "כותרת הסצנה בעברית",
      "description": "תיאור נרטיבי מפורט בעברית — מה קורה, מה הדמויות מרגישות, מה המשמעות הדרמטית",
      "visualPrompt": "[CHARACTER DESCRIPTIONS REPEATED HERE]. ENGLISH: Ultra-detailed shot description with camera, lighting, subject, action, environment, color, style, continuity — minimum 80 words per scene",
      "audioScript": "(מספר:) [בקול עמוק ודרמטי] הטקסט המלא בעברית שיוקרא בקול... (דמות:) [ברגש] הדיאלוג המלא...",
      "durationSeconds": 8
    }
  ]
}`;

      const response = await withRetry(() => ai.models.generateContent({
        model: scriptModel,
        contents: {
          parts: [
            ...imageParts,
            { text: `Break down this ENTIRE text into detailed cinematic scenes — cover the full story from beginning to end. Each scene is an 8-second video clip. Target approximately ${estimateScenes(prompt.split(/\s+/).filter(Boolean).length)[movieLength]} scenes (user chose "${movieLength}" density). ${movieLength === 'short' ? 'Be concise — group related events, focus on key moments.' : movieLength === 'medium' ? 'Balance detail with pacing — cover all key events.' : 'Be comprehensive — give each event its own scene.'} Ensure SEAMLESS visual transitions between consecutive scenes — no jump cuts, no sudden changes. Hebrew dialogue and narration in audioScript, English visual prompts. Source text:\n\n${prompt}` }
          ]
        },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      }));

      const scriptData = JSON.parse(response.text || '{}') as MovieScript;
      // Ensure characterDescriptions exists
      if (!scriptData.characterDescriptions) {
        scriptData.characterDescriptions = '';
      }
      // Prepend character descriptions to every visualPrompt for consistency
      const charDesc = scriptData.characterDescriptions;
      // Initialize scene status and inject character descriptions
      scriptData.scenes = scriptData.scenes.map(s => ({
        ...s,
        status: 'pending',
        approved: false,
        // Prepend character descriptions if not already included
        visualPrompt: charDesc && !s.visualPrompt.includes(charDesc.substring(0, 30))
          ? `${charDesc}. ${s.visualPrompt}`
          : s.visualPrompt,
      }));
      setScript(scriptData);
    } catch (err: any) {
      console.error("Script generation failed:", err);
      let errorMessage = "Failed to generate script. Please try again.";
      if (err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED")) {
        errorMessage = "Script generation quota exceeded. Please wait a few minutes or check your Gemini API billing plan (https://ai.google.dev/gemini-api/docs/rate-limits).";
      }
      setError(errorMessage);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Helper for retrying API calls with exponential backoff
  const withRetry = async <T extends unknown>(fn: () => Promise<T>, maxRetries = 5, initialDelay = 5000): Promise<T> => {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        
        // Robust detection of 429/Quota errors from various error object shapes
        let isQuotaError = false;
        const errStr = typeof err === 'string' ? err : (err.message || "");
        const errJson = typeof err === 'object' ? JSON.stringify(err) : "";
        
        if (errStr.includes("429") || 
            errStr.includes("RESOURCE_EXHAUSTED") || 
            errStr.toLowerCase().includes("quota") ||
            errJson.includes("429") ||
            errJson.includes("RESOURCE_EXHAUSTED") ||
            err.status === 429 || 
            err.code === 429 ||
            err.error?.code === 429 ||
            err.error?.status === "RESOURCE_EXHAUSTED") {
          isQuotaError = true;
        }
        
        if (!isQuotaError || i === maxRetries - 1) throw err;
        
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Quota exceeded (429). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  };

  // Extract last frame from a video for visual continuity
  const extractLastFrame = async (videoUrl: string): Promise<{ data: string; mimeType: string } | null> => {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 3000);
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;
      video.onloadedmetadata = () => {
        video.currentTime = Math.max(0, video.duration - 0.1);
      };
      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const base64 = dataUrl.split(',')[1];
          clearTimeout(timeout);
          resolve({ data: base64, mimeType: 'image/jpeg' });
        } catch { clearTimeout(timeout); resolve(null); }
      };
      video.onerror = () => { clearTimeout(timeout); resolve(null); };
    });
  };

  // Persist user profile to localStorage
  const persistUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('cinema_user', JSON.stringify(profile));
  };

  // Project management functions
  const saveProject = () => {
    const id = currentProjectId || Math.random().toString(36).substr(2, 9);
    const now = Date.now();
    const project: Project = {
      id,
      name: script?.title || prompt.substring(0, 40) || 'Untitled Project',
      createdAt: projects.find(p => p.id === id)?.createdAt || now,
      updatedAt: now,
      prompt,
      style,
      movieLength,
      scriptModel,
      beCreative,
      isManualMode,
      selectedLanguages,
      script,
      characterImageDescription,
    };
    const updated = projects.filter(p => p.id !== id);
    updated.unshift(project);
    setProjects(updated);
    setCurrentProjectId(id);
    localStorage.setItem('cinema_projects', JSON.stringify(updated));
  };

  const loadProject = (project: Project) => {
    setPrompt(project.prompt);
    setStyle(project.style);
    setMovieLength(project.movieLength);
    setScriptModel(project.scriptModel);
    setBeCreative(project.beCreative);
    setIsManualMode(project.isManualMode);
    setSelectedLanguages(project.selectedLanguages);
    setCharacterImageDescription(project.characterImageDescription);
    if (project.script) {
      // Reset video statuses — blobs are gone
      const restored = {
        ...project.script,
        scenes: project.script.scenes.map(s => ({
          ...s,
          status: s.status === 'generating' ? 'pending' as const : s.status === 'completed' && !s.videoUrl ? 'pending' as const : s.status,
          videoUrl: undefined,
          audioUrl: undefined,
        })),
      };
      setScript(restored);
    } else {
      setScript(null);
    }
    setCurrentProjectId(project.id);
    setWizardStep(project.script ? 'timeline' : 'story');
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('cinema_projects', JSON.stringify(updated));
    if (currentProjectId === id) setCurrentProjectId(null);
  };

  const newProject = () => {
    // Save current if there's content
    if (prompt.trim() || script) saveProject();
    setPrompt('');
    setStyle('Pixar');
    setScript(null);
    setCurrentProjectId(null);
    setReferenceImages([]);
    setCharacterImageDescription('');
    setWizardStep('story');
  };

  const generateVideoForScene = async (index: number, _batchMode = false) => {
    // Free tier limit check
    if (userProfile.plan === 'free' && userProfile.scenesUsed >= 2) {
      setError('Free plan allows 2 demo scenes. Upgrade for unlimited production!');
      setWizardStep('pricing');
      return;
    }

    // Always read from ref for latest state (critical for batch "Produce All" chaining)
    const latestScript = scriptRef.current;
    // In batch mode, skip the isProcessingVideo guard (we manage it ourselves)
    if (!latestScript || !isApiKeySelected || (!_batchMode && isProcessingVideo)) return;

    // Light retry for video — don't burn quota on repeated 429s
    const videoWithRetry = (fn: any) => withRetry(fn, 2, 10000);

    const scene = latestScript.scenes[index];
    const updatedScenes = latestScript.scenes.map((s, i) =>
      i === index ? { ...s, status: 'generating' as const } : s
    );
    setScript({ ...latestScript, scenes: updatedScenes });
    setIsProcessingVideo(true);

    try {
      const apiKey = getApiKey();
      const ai = new GoogleGenAI({ apiKey });
      // Read previous scene from ref to get the latest videoObject (critical for chaining)
      const prevScene = index > 0 ? scriptRef.current?.scenes[index - 1] ?? null : null;
      
      // 1. Generate TTS for the scene (with optional translation)
      let audioUrl = '';
      const langConfig = LANGUAGE_CONFIG[selectedLanguages[0] || audioLanguage];

      // Helper: convert PCM bytes to WAV blob URL and return duration
      const pcmToWav = (pcmBytes: Uint8Array): { url: string; duration: number } => {
        const sampleRate = 24000;
        const numChannels = 1;
        const bitsPerSample = 16;
        const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
        const blockAlign = numChannels * (bitsPerSample / 8);
        const dataSize = pcmBytes.length;
        const duration = dataSize / byteRate;
        const headerSize = 44;

        const wavBuffer = new ArrayBuffer(headerSize + dataSize);
        const view = new DataView(wavBuffer);
        const writeString = (offset: number, str: string) => {
          for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
        };
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        writeString(36, 'data');
        view.setUint32(40, dataSize, true);
        new Uint8Array(wavBuffer, headerSize).set(pcmBytes);

        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        return { url: URL.createObjectURL(blob), duration };
      };

      // Helper: generate TTS and return raw PCM bytes
      const generateTTS = async (text: string) => {
        const ttsResponse = await withRetry(() => ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: langConfig.voice },
              },
            },
          },
        }), 2, 3000); // Low retries to save quota for Veo

        const audioPart = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        if (!audioPart?.data) return null;

        const pcmBinary = atob(audioPart.data);
        const pcmBytes = new Uint8Array(pcmBinary.length);
        for (let i = 0; i < pcmBinary.length; i++) {
          pcmBytes[i] = pcmBinary.charCodeAt(i);
        }
        return pcmBytes;
      };

      try {
        const ttsText = scene.audioScript || scene.description;
        // Strip speaker tags and emotional directions for clean TTS
        let cleanTtsText = ttsText
          .replace(/\([^)]*:\)/g, '') // Remove (מספר:) (דמות:) tags
          .replace(/\[[^\]]*\]/g, '')  // Remove [בלחש] emotional directions
          .trim();
        const emotionalContext = (ttsText.match(/\[[^\]]*\]/g) || []).join(' ');

        // Translate if not Hebrew
        if ((selectedLanguages[0] || audioLanguage) !== 'he') {
          console.log(`Translating scene ${index + 1} to ${langConfig.ttsLang}...`);
          const translationResponse = await withRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: `Translate the following Hebrew text to ${langConfig.ttsLang}. Return ONLY the translated text, nothing else. Keep the emotional tone and dramatic style. Do not add explanations.\n\n${cleanTtsText}` }] }],
          }), 2, 3000); // Low retries to save quota for Veo
          cleanTtsText = translationResponse.text?.trim() || cleanTtsText;
          console.log(`Translation result: ${cleanTtsText.substring(0, 80)}...`);
        }

        const maxDuration = 8; // Veo max duration
        const basePrompt = `Read this ${langConfig.ttsLang} text aloud with cinematic narration style, at a brisk pace with short pauses${emotionalContext ? `, with these emotions: ${emotionalContext}` : ''}`;

        // Generate TTS — try fast pace first, retry faster if too long
        const byteRate = 24000 * 1 * (16 / 8); // sampleRate * channels * bytesPerSample
        let pcmBytes = await generateTTS(`${basePrompt}. Keep total duration under ${maxDuration} seconds. Speak at a brisk, energetic pace:\n${cleanTtsText}`);

        if (pcmBytes) {
          let rawDuration = pcmBytes.length / byteRate;
          console.log(`TTS scene ${index + 1}: ${rawDuration.toFixed(1)}s`);

          // If too long (>8.5s), retry with much faster pace instruction
          if (rawDuration > maxDuration + 0.5) {
            console.warn(`TTS scene ${index + 1}: ${rawDuration.toFixed(1)}s too long, retrying with faster pace...`);
            const fasterPcm = await generateTTS(`${basePrompt}. CRITICAL: You MUST finish in under ${maxDuration} seconds. Speak VERY fast, rapid-fire narration pace. Do NOT pause between sentences:\n${cleanTtsText}`);
            if (fasterPcm) {
              const fasterDuration = fasterPcm.length / byteRate;
              console.log(`TTS scene ${index + 1} faster retry: ${fasterDuration.toFixed(1)}s`);
              // Use the faster version if it's shorter
              if (fasterDuration < rawDuration) {
                pcmBytes = fasterPcm;
                rawDuration = fasterDuration;
              }
            }
          }

          // NEVER cut audio mid-sentence. If still too long, keep full audio —
          // video will be 8s max but audio plays completely over last frame
          const wav = pcmToWav(pcmBytes);
          audioUrl = wav.url;
          (scene as any)._audioDuration = wav.duration;
          console.log(`TTS scene ${index + 1} final: ${wav.duration.toFixed(1)}s`);
        }
      } catch (ttsErr: any) {
        console.error("TTS generation FAILED:", ttsErr?.message || ttsErr);
        console.error("TTS error details:", JSON.stringify(ttsErr, null, 2));
      }

      // Generate TTS for ALL selected languages and store in langMediaMap
      const langMediaMap: Record<string, { audioUrl?: string }> = {};
      for (const lang of selectedLanguages) {
        const lc = LANGUAGE_CONFIG[lang];
        try {
          const ttsText = scene.audioScript || scene.description;
          let cleanText = ttsText
            .replace(/\([^)]*:\)/g, '')
            .replace(/\[[^\]]*\]/g, '')
            .trim();
          const emoCtx = (ttsText.match(/\[[^\]]*\]/g) || []).join(' ');

          // Translate if not Hebrew
          if (lang !== 'he') {
            const tr = await withRetry(() => ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: [{ parts: [{ text: `Translate the following Hebrew text to ${lc.ttsLang}. Return ONLY the translated text, nothing else. Keep the emotional tone and dramatic style. Do not add explanations.\n\n${cleanText}` }] }],
            }), 2, 3000);
            cleanText = tr.text?.trim() || cleanText;
          }

          const langPrompt = `Read this ${lc.ttsLang} text aloud with cinematic narration style, at a brisk pace with short pauses${emoCtx ? `, with these emotions: ${emoCtx}` : ''}. Keep the total duration under 8 seconds:\n${cleanText}`;
          const langTtsResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: langPrompt }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: lc.voice } } },
            },
          }), 2, 3000);

          const langAudioPart = langTtsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData;
          if (langAudioPart?.data) {
            const pcmBin = atob(langAudioPart.data);
            let langPcm = new Uint8Array(pcmBin.length);
            for (let j = 0; j < pcmBin.length; j++) langPcm[j] = pcmBin.charCodeAt(j);
            // Smart-trim if over 8s
            const byteRate = 24000 * 1 * 2;
            if (langPcm.length / byteRate > 8) {
              const maxBytes = Math.floor(8 * byteRate);
              langPcm = langPcm.slice(0, maxBytes - (maxBytes % 2));
            }
            const wavResult = pcmToWav(langPcm);
            langMediaMap[lang] = { audioUrl: wavResult.url };
            console.log(`TTS scene ${index + 1} [${lang}]: ${wavResult.duration.toFixed(1)}s`);
          }
        } catch (langTtsErr: any) {
          console.warn(`TTS for ${lang} failed:`, langTtsErr?.message);
        }
      }
      // Use primary language audio as main audioUrl if not already set
      if (!audioUrl && langMediaMap[selectedLanguages[0]]?.audioUrl) {
        audioUrl = langMediaMap[selectedLanguages[0]].audioUrl!;
      }

      // 2. Generate Video
      let operation;
      
      // Extract last frame from previous scene for visual continuity
      const lastFrame = (index > 0 && prevScene?.videoUrl)
        ? await extractLastFrame(prevScene.videoUrl) : null;
      if (lastFrame) console.log(`Scene ${index + 1}: using last frame from scene ${index} for continuity`);

      // Build reference images: slot 0 = character ASSET, slot 1 = last frame STYLE, slot 2 = extra ref STYLE
      const referenceImagesPayload: any[] = [];
      if (referenceImages[0]) {
        referenceImagesPayload.push({ image: { imageBytes: referenceImages[0].data, mimeType: referenceImages[0].mimeType }, referenceType: VideoGenerationReferenceType.ASSET });
      }
      if (lastFrame) {
        referenceImagesPayload.push({ image: { imageBytes: lastFrame.data, mimeType: lastFrame.mimeType }, referenceType: VideoGenerationReferenceType.STYLE });
      }
      for (let i = 1; i < referenceImages.length && referenceImagesPayload.length < 3; i++) {
        referenceImagesPayload.push({ image: { imageBytes: referenceImages[i].data, mimeType: referenceImages[i].mimeType }, referenceType: VideoGenerationReferenceType.STYLE });
      }

      // Match video duration to audio — min 5s, max 8s (Veo limits)
      const audioDur = (scene as any)._audioDuration as number | undefined;
      const targetDuration = audioDur ? Math.min(8, Math.max(5, Math.ceil(audioDur))) : 8;
      console.log(`Video scene ${index + 1}: generating ${targetDuration}s video (audio was ${audioDur?.toFixed(1) || 'none'}s)`);

      const videoConfig: any = {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9',
        durationSeconds: targetDuration,
      };

      // Inject character lock description for maximum consistency
      const charLock = characterImageDescription
        ? `[CRITICAL CHARACTER LOCK — The character in this scene MUST match this EXACT appearance in every single frame. DO NOT change any physical feature, clothing, or accessory: ${characterImageDescription}]. `
        : '';
      // Add seamless transition instruction for scenes 2+
      const transitionLock = (index > 0 && prevScene)
        ? `[SEAMLESS CONTINUITY — This scene continues DIRECTLY from the previous scene. Maintain identical lighting, color grading, environment, and character positioning. The first frame of this scene must feel like the natural next frame of the previous scene. No jump cuts, no sudden changes.]. `
        : '';
      const promptText = charLock + transitionLock + (scene.visualPrompt?.trim() || scene.description?.trim() || "A cinematic scene...");

      // ALWAYS send reference images for character consistency in EVERY scene
      // We prioritize character lock over video extension because Veo doesn't
      // support both referenceImages + video at the same time, and without
      // reference images the character drifts (e.g. bear → mouse)
      if (referenceImagesPayload.length > 0) {
        videoConfig.referenceImages = referenceImagesPayload;
      }

      operation = await videoWithRetry(() => ai.models.generateVideos({
        model: VEO_MODEL,
        prompt: promptText,
        config: videoConfig
      }));

      // Poll for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await videoWithRetry(() => ai.operations.getVideosOperation({ operation }));
      }

      const videoData = operation.response?.generatedVideos?.[0]?.video;
      if (!videoData?.uri) throw new Error("No video URI returned");

      // Fetch the video blob
      const videoResponse = await fetch(videoData.uri, {
        headers: { 'x-goog-api-key': apiKey }
      });
      const blob = await videoResponse.blob();
      const url = URL.createObjectURL(blob);

      // Use ref for latest state to avoid stale closure
      const currentScript = scriptRef.current!;
      const finalScenes = [...currentScript.scenes];
      finalScenes[index] = {
        ...finalScenes[index],
        status: 'completed',
        videoUrl: url,
        videoObject: videoData,
        audioUrl: audioUrl,
        langMedia: langMediaMap,
      };
      setScript({ ...currentScript, scenes: finalScenes });
      setCurrentSceneIndex(index);
      // Track cost
      const sceneCost = COST_PER_SCENE.veo + COST_PER_SCENE.tts + (audioUrl ? COST_PER_SCENE.translation : 0);
      setTotalSpent(prev => prev + sceneCost);
      // Increment scenesUsed for free tier tracking
      persistUserProfile({ ...userProfile, scenesUsed: userProfile.scenesUsed + 1 });
    } catch (err: any) {
      console.error("Video generation failed:", err);
      const currentScript = scriptRef.current!;
      const finalScenes = currentScript.scenes.map((s, i) =>
        i === index ? { ...s, status: 'failed' as const } : s
      );
      setScript({ ...currentScript, scenes: finalScenes });
      
      let errorMessage = "";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object') {
        errorMessage = err.error?.message || err.message || JSON.stringify(err);
      } else {
        errorMessage = String(err);
      }
      
      // Handle specific error cases
      if (errorMessage.includes("Requested entity was not found")) {
        setIsApiKeySelected(false);
        errorMessage = "API Key session expired. Please select your key again.";
      } else if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.toLowerCase().includes("quota")) {
        errorMessage = "⚠️ Quota exhausted — Free Tier allows only a few Veo requests per day. Switch to a new API key (Key button) or try again tomorrow. Your script is saved!";
      } else {
        // Try to parse JSON error if it's a stringified object
        try {
          const parsed = JSON.parse(errorMessage);
          if (parsed.error?.message) errorMessage = parsed.error.message;
        } catch (e) {
          // Not JSON, keep original
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessingVideo(false);
    }
  };

  // Produce the next eligible scene (first pending scene whose previous is approved, or scene 0)
  const produceNextScene = async () => {
    const latestScript = scriptRef.current;
    if (!latestScript || !isApiKeySelected || isGeneratingAll || isProcessingVideo) return;

    // Find the next scene that can be produced
    let nextIndex = -1;
    for (let i = 0; i < latestScript.scenes.length; i++) {
      const scene = latestScript.scenes[i];
      if (scene.status === 'completed') continue;
      if (scene.status === 'generating') return; // Already producing one
      // Check approval: scene 0 can always go, others need previous scene approved
      if (i === 0 || latestScript.scenes[i - 1]?.approved) {
        nextIndex = i;
        break;
      } else {
        // Previous scene exists but isn't approved — can't proceed
        setError(`Please approve Scene ${i} before producing Scene ${i + 1}.`);
        return;
      }
    }

    if (nextIndex === -1) {
      // All scenes are completed
      return;
    }

    setIsGeneratingAll(true);
    setError(null);

    try {
      await generateVideoForScene(nextIndex, true);
    } catch (err) {
      console.error("Scene generation failed:", err);
      setError("Scene generation stopped due to an error.");
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const addManualScene = () => {
    const newScene: Scene = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Scene",
      description: "Describe the narrative...",
      visualPrompt: "Describe the visual details for AI...",
      audioScript: "Enter the dialogue or narration here...",
      durationSeconds: 8,
      status: 'pending',
      approved: false
    };

    if (script) {
      setScript({ ...script, scenes: [...script.scenes, newScene] });
    } else {
      setScript({
        title: "My Custom Movie",
        genre: "Custom",
        style: style,
        characterDescriptions: '',
        scenes: [newScene]
      });
    }
    setEditingSceneId(newScene.id);
  };

  const updateScene = (id: string, updates: Partial<Scene>) => {
    if (!script) return;
    const updatedScenes = script.scenes.map(s => s.id === id ? { ...s, ...updates } : s);
    setScript({ ...script, scenes: updatedScenes });
  };

  const deleteScene = (id: string) => {
    if (!script) return;
    const updatedScenes = script.scenes.filter(s => s.id !== id);
    setScript({ ...script, scenes: updatedScenes });
    if (currentSceneIndex !== null && currentSceneIndex >= updatedScenes.length) {
      setCurrentSceneIndex(updatedScenes.length > 0 ? updatedScenes.length - 1 : null);
    }
  };

  const toggleLanguage = (lang: AudioLanguage) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const approveScene = (id: string) => {
    if (!script) return;
    const updatedScenes = script.scenes.map(s => s.id === id ? { ...s, approved: true } : s);
    setScript({ ...script, scenes: updatedScenes });
  };

  const downloadSceneVideo = (scene: Scene, lang?: string) => {
    const url = lang && scene.langMedia?.[lang]?.videoUrl ? scene.langMedia[lang].videoUrl : scene.videoUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script?.title || 'movie'}_${scene.title}_${lang || 'he'}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSceneAudio = (scene: Scene, lang?: string) => {
    const url = lang && scene.langMedia?.[lang]?.audioUrl ? scene.langMedia[lang].audioUrl : scene.audioUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script?.title || 'movie'}_${scene.title}_${lang || 'he'}_audio.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const canProduceScene = (index: number): boolean => {
    if (index === 0) return true;
    const prevScene = script?.scenes[index - 1];
    return !!prevScene?.approved;
  };

  // ===== EXPORT MOVIE: Merge all scenes into single MP4 with audio =====
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const exportMovie = async () => {
    if (!script) return;
    const completedScenes = script.scenes.filter(s => s.status === 'completed' && s.videoUrl);
    if (completedScenes.length === 0) return;

    setExportStatus('loading-ffmpeg');
    setExportProgress(0);
    setExportProgressMsg('Loading video engine...');
    if (exportUrl) { URL.revokeObjectURL(exportUrl); setExportUrl(null); }

    try {
      // 1. Load FFmpeg (lazy singleton)
      if (!ffmpegRef.current) {
        const ffmpeg = new FFmpeg();
        ffmpeg.on('log', ({ message }) => {
          console.log('[FFmpeg]', message);
        });
        ffmpeg.on('progress', ({ progress }) => {
          // progress is 0-1 for current operation
          setExportProgress(prev => Math.max(prev, Math.round(progress * 100)));
        });
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        ffmpegRef.current = ffmpeg;
      }

      const ffmpeg = ffmpegRef.current;
      setExportStatus('processing');

      // 2. Process each scene: mux video + audio into individual MP4 clips
      const clipFiles: string[] = [];

      for (let i = 0; i < completedScenes.length; i++) {
        const scene = completedScenes[i];
        const sceneNum = String(i).padStart(3, '0');
        setExportProgressMsg(`Processing scene ${i + 1}/${completedScenes.length}...`);
        setExportProgress(Math.round((i / completedScenes.length) * 80));

        // Get audio URL for selected language
        const audioUrl = scene.langMedia?.[exportLanguage]?.audioUrl || scene.audioUrl;

        // Write video to FS
        const videoBlob = await fetch(scene.videoUrl!).then(r => r.blob());
        await ffmpeg.writeFile(`scene_${sceneNum}.webm`, await fetchFile(videoBlob));

        if (audioUrl) {
          // Write audio to FS
          const audioBlob = await fetch(audioUrl).then(r => r.blob());
          await ffmpeg.writeFile(`scene_${sceneNum}.wav`, await fetchFile(audioBlob));

          // Mux video + audio → MP4 (do NOT use -shortest — let full audio play,
          // video's last frame will freeze if audio is longer)
          await ffmpeg.exec([
            '-i', `scene_${sceneNum}.webm`,
            '-i', `scene_${sceneNum}.wav`,
            '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-ac', '2',
            '-movflags', '+faststart',
            `clip_${sceneNum}.mp4`
          ]);

          // Cleanup source files
          await ffmpeg.deleteFile(`scene_${sceneNum}.webm`);
          await ffmpeg.deleteFile(`scene_${sceneNum}.wav`);
        } else {
          // No audio — mux video with silent audio
          await ffmpeg.exec([
            '-i', `scene_${sceneNum}.webm`,
            '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
            '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '128k',
            '-shortest',
            '-movflags', '+faststart',
            `clip_${sceneNum}.mp4`
          ]);
          await ffmpeg.deleteFile(`scene_${sceneNum}.webm`);
        }

        clipFiles.push(`clip_${sceneNum}.mp4`);
      }

      // 3. Create concat file list
      setExportProgressMsg('Merging scenes...');
      setExportProgress(85);
      const concatList = clipFiles.map(f => `file '${f}'`).join('\n');
      await ffmpeg.writeFile('filelist.txt', concatList);

      // 4. Concat all clips into final movie
      await ffmpeg.exec([
        '-f', 'concat', '-safe', '0',
        '-i', 'filelist.txt',
        '-c', 'copy',
        '-movflags', '+faststart',
        'output.mp4'
      ]);

      // 5. Read output and create download URL
      setExportProgressMsg('Preparing download...');
      setExportProgress(95);
      const outputData = await ffmpeg.readFile('output.mp4');
      const outputBlob = new Blob([outputData], { type: 'video/mp4' });
      const url = URL.createObjectURL(outputBlob);
      setExportUrl(url);

      // 6. Cleanup
      for (const f of clipFiles) {
        try { await ffmpeg.deleteFile(f); } catch {}
      }
      try { await ffmpeg.deleteFile('filelist.txt'); } catch {}
      try { await ffmpeg.deleteFile('output.mp4'); } catch {}

      setExportStatus('done');
      setExportProgress(100);
      setExportProgressMsg('Ready!');
    } catch (err: any) {
      console.error('Export failed:', err);
      setExportStatus('error');
      setExportProgressMsg(err.message || 'Export failed');
    }
  };

  const downloadExportedMovie = () => {
    if (!exportUrl) return;
    const a = document.createElement('a');
    a.href = exportUrl;
    a.download = `${script?.title || 'movie'}_${LANGUAGE_CONFIG[exportLanguage].label}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const WIZARD_STEPS: { key: WizardStep; label: string; icon: React.ReactNode }[] = [
    { key: 'projects', label: 'Projects', icon: <Folder className="w-4 h-4" /> },
    { key: 'story', label: 'Story', icon: <Wand2 className="w-4 h-4" /> },
    { key: 'style', label: 'Style', icon: <Palette className="w-4 h-4" /> },
    { key: 'language', label: 'Language', icon: <Globe className="w-4 h-4" /> },
    { key: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
    { key: 'preview', label: 'Preview', icon: <Play className="w-4 h-4" /> },
    { key: 'pricing', label: 'Pricing', icon: <Crown className="w-4 h-4" /> },
  ];

  const styles: { name: MovieStyle; icon: React.ReactNode; color: string; description: string }[] = [
    { name: 'Pixar', icon: <Clapperboard className="w-4 h-4" />, color: 'from-blue-500 to-cyan-500', description: '3D animated charm' },
    { name: 'Realistic', icon: <Film className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500', description: 'Cinematic realism' },
    { name: 'Paper Folding', icon: <Palette className="w-4 h-4" />, color: 'from-orange-500 to-amber-500', description: 'Stop-motion origami' },
    { name: 'Cyberpunk', icon: <Sparkles className="w-4 h-4" />, color: 'from-purple-500 to-pink-500', description: 'Neon-lit future' },
    { name: 'Hand-drawn', icon: <Wand2 className="w-4 h-4" />, color: 'from-rose-500 to-red-500', description: 'Classic 2D artistry' },
  ];

  return (
    <div className="min-h-screen text-white font-sans selection:bg-blue-500/30 overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Background Glow - subtle */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[15%] w-[60%] h-[60%] bg-blue-600/[0.06] blur-[150px] rounded-full" />
        <div className="absolute -bottom-[30%] -right-[15%] w-[60%] h-[60%] bg-indigo-600/[0.06] blur-[150px] rounded-full" />
      </div>

      {/* HEADER */}
      <header className="border-b border-[--border-subtle] bg-[--bg-elevated]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[--accent] to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:block">Cinematic Studio</span>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-1">
            {WIZARD_STEPS.map((step, i) => (
              <button
                key={step.key}
                onClick={() => setWizardStep(step.key)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  wizardStep === step.key ? "text-white" : "text-[--text-muted] hover:text-[--text-secondary]"
                )}
              >
                {wizardStep === step.key && (
                  <motion.div layoutId="step-pill" className="absolute inset-0 bg-[--accent-soft] border border-[--accent]/30 rounded-full" />
                )}
                <span className="relative z-10 hidden sm:inline">{step.icon}</span>
                <span className="relative z-10">{step.label}</span>
              </button>
            ))}
          </div>

          {/* Status & Credits */}
          <div className="flex items-center gap-2">
            {/* Cost tracker */}
            {script && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[--bg-card] border border-[--border-subtle] rounded-lg text-xs" title="Estimated cost this session">
                <DollarSign className="w-3 h-3 text-[--success]" />
                <span className="font-mono font-bold text-[--success]">${totalSpent.toFixed(2)}</span>
                <span className="text-[--text-muted] hidden sm:inline">/ ~${(script.scenes.length * SCENE_COST).toFixed(2)} total</span>
              </div>
            )}
            {/* Wallet / Credits */}
            <button onClick={() => setWizardStep('pricing')}
              className="px-2.5 py-1.5 bg-[--bg-card] border border-[--border-subtle] rounded-lg text-xs font-medium transition-all hover:bg-[--bg-card-hover]"
              title="View plans & credits">
              {userProfile.plan === 'free'
                ? <span>&#9889; Free ({2 - userProfile.scenesUsed} scenes)</span>
                : <span>&#127916; {PLAN_CONFIG[userProfile.plan].films} films left</span>
              }
            </button>
            <button onClick={() => { setApiKeyDraft(customApiKey); setShowApiKeyInput(true); }}
              className={cn("px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all",
                isApiKeySelected
                  ? "bg-white border-[--border-subtle] text-black"
                  : "bg-[--warning-soft] text-black border-[--warning]/20"
              )}
              title={isApiKeySelected ? `API Key: ...${getApiKey().slice(-6)}` : 'Set API Key'}>
              <Settings className="w-3.5 h-3.5 inline mr-1" />{isApiKeySelected ? 'Key' : 'Connect'}
            </button>
            {/* Profile avatar */}
            <button onClick={() => setShowProfile(true)}
              className="w-8 h-8 bg-[--bg-card] border border-[--border-subtle] rounded-full flex items-center justify-center hover:bg-[--bg-card-hover] transition-all"
              title="Profile">
              <User className="w-3.5 h-3.5 text-[--text-muted]" />
            </button>
            <div className={cn("w-2 h-2 rounded-full", isApiKeySelected ? "bg-[--success] animate-pulse" : "bg-[--warning]")} />
          </div>
        </div>
      </header>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-[--danger-soft] border-b border-[--danger]/20 overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[--danger]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="p-1 hover:bg-[--danger-soft] rounded-lg text-[--danger]">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Key Dialog */}
      <AnimatePresence>
        {showApiKeyInput && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowApiKeyInput(false); }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[--bg-elevated] border border-[--border-subtle] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">API Key</h3>
                <button onClick={() => setShowApiKeyInput(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600/20 border border-blue-500/50 text-blue-300 rounded-xl text-sm font-bold hover:bg-blue-600/30 transition-all">
                &#128273; Get your free API key at Google AI Studio &rarr;
              </a>
              <p className="text-xs text-[--text-muted] leading-relaxed">
                Enter your Google AI Studio API key. The key is saved locally in your browser.
              </p>
              <input type="password" value={apiKeyDraft} onChange={(e) => setApiKeyDraft(e.target.value)}
                placeholder="AIza..."
                className="w-full bg-[--bg-primary] border border-[--border-subtle] rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-[--accent]/50 placeholder:text-[--text-muted]"
                onKeyDown={(e) => { if (e.key === 'Enter') saveApiKey(); }}
              />
              {customApiKey && (
                <p className="text-[10px] text-[--success] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active key: ...{customApiKey.slice(-6)}
                </p>
              )}
              <div className="flex items-center gap-2">
                <button onClick={saveApiKey}
                  className="flex-1 py-2.5 bg-[--accent] hover:bg-blue-500 rounded-xl text-sm font-bold transition-all">
                  Save
                </button>
                {customApiKey && (
                  <button onClick={() => { setApiKeyDraft(''); setCustomApiKey(''); localStorage.removeItem('gemini_api_key'); setIsApiKeySelected(!!(process.env.API_KEY || process.env.GEMINI_API_KEY)); setShowApiKeyInput(false); }}
                    className="py-2.5 px-4 bg-[--danger-soft] text-[--danger] rounded-xl text-sm font-medium transition-all">
                    Clear
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowProfile(false); }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[--bg-elevated] border border-[--border-subtle] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2"><User className="w-5 h-5" /> Profile</h3>
                <button onClick={() => setShowProfile(false)} className="p-1.5 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider block mb-1">Name</label>
                  <input value={userProfile.name} onChange={(e) => persistUserProfile({ ...userProfile, name: e.target.value })}
                    className="w-full bg-[--bg-primary] border border-[--border-subtle] rounded-xl p-3 text-sm focus:outline-none focus:border-[--accent]/50 placeholder:text-[--text-muted]"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider block mb-1">Email</label>
                  <input value={userProfile.email} onChange={(e) => persistUserProfile({ ...userProfile, email: e.target.value })}
                    className="w-full bg-[--bg-primary] border border-[--border-subtle] rounded-xl p-3 text-sm focus:outline-none focus:border-[--accent]/50 placeholder:text-[--text-muted]"
                    placeholder="your@email.com" type="email" />
                </div>
                <div className="p-4 bg-[--bg-card] border border-[--border-subtle] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Current Plan</span>
                    <span className="text-sm font-bold text-[--accent]">{PLAN_CONFIG[userProfile.plan].label}</span>
                  </div>
                  <p className="text-xs text-[--text-muted] mt-1">{PLAN_CONFIG[userProfile.plan].desc}</p>
                  <p className="text-xs text-[--text-muted] mt-1">Scenes used: {userProfile.scenesUsed}</p>
                  <button onClick={() => { setShowProfile(false); setWizardStep('pricing'); }}
                    className="mt-3 w-full py-2 bg-[--accent-soft] text-[--accent] rounded-lg text-xs font-bold hover:bg-[--accent-soft]/80 transition-all">
                    Change Plan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-8 pb-28">
        <AnimatePresence mode="wait">

          {/* ===== PROJECTS ===== */}
          {wizardStep === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Projects</h1>
                <p className="text-sm text-[--text-muted]">Continue a previous project or start a new one</p>
              </div>

              <div className="flex justify-center">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={newProject}
                  className="flex items-center gap-2 px-6 py-3 bg-[--accent] hover:bg-blue-500 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
                  <Plus className="w-4 h-4" /> New Project
                </motion.button>
              </div>

              {projects.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center border border-dashed border-[--border-subtle] rounded-2xl text-[--text-muted]">
                  <Folder className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No saved projects</p>
                  <p className="text-xs mt-1">Create your first movie project above</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map(project => (
                    <div key={project.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all",
                        currentProjectId === project.id
                          ? "bg-blue-600/20 border-blue-500/50"
                          : "bg-[--bg-card] border-[--border-subtle] hover:bg-[--bg-card-hover]"
                      )}>
                      <h3 className="font-semibold text-sm truncate">{project.name}</h3>
                      <p className="text-xs text-[--text-muted] mt-1">
                        {new Date(project.updatedAt).toLocaleDateString()} | {project.script?.scenes.length || 0} scenes | {project.style}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => loadProject(project)}
                          className="flex-1 py-2 bg-[--accent-soft] text-[--accent] rounded-lg text-xs font-bold hover:bg-[--accent-soft]/80 transition-all">
                          Continue
                        </button>
                        <button onClick={() => deleteProject(project.id)}
                          className="py-2 px-3 bg-[--danger-soft] text-[--danger] rounded-lg text-xs font-medium hover:bg-[--danger-soft]/80 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ===== STEP 1: STORY ===== */}
          {wizardStep === 'story' && (
            <motion.div key="story" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tell your story</h1>
                <p className="text-sm text-[--text-muted]">Paste a book excerpt, script, or describe your movie idea</p>
              </div>

              {/* Mode Selectors — dropdowns, simple style */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Style:</label>
                  <select value={beCreative ? 'creative' : 'strict'} onChange={(e) => setBeCreative(e.target.value === 'creative')}
                    className="bg-[--bg-card] border border-[--border-subtle] rounded-xl px-3 py-2 text-xs font-medium text-[--text-primary] focus:outline-none focus:border-[--accent]/40 cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white">
                    <option value="creative">✨ Creative — AI enriches with cinematic depth</option>
                    <option value="strict">📐 Strict — follows your text word for word</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Input:</label>
                  <select value={isManualMode ? 'manual' : 'ai'} onChange={(e) => setIsManualMode(e.target.value === 'manual')}
                    className="bg-[--bg-card] border border-[--border-subtle] rounded-xl px-3 py-2 text-xs font-medium text-[--text-primary] focus:outline-none focus:border-[--accent]/40 cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white">
                    <option value="ai">🤖 AI — describe an idea, AI builds the script</option>
                    <option value="manual">📖 Text — paste a book/script, AI splits to scenes</option>
                  </select>
                </div>
              </div>

              {/* Script Model Selector — also simple dropdown */}
              <div className="flex items-center justify-center gap-2">
                <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Model:</label>
                <select value={scriptModel} onChange={(e) => setScriptModel(e.target.value)}
                  className="bg-[--bg-card] border border-[--border-subtle] rounded-xl px-3 py-2 text-xs font-medium text-[--text-primary] focus:outline-none focus:border-[--accent]/40 cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white">
                  {SCRIPT_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.label} — {m.desc}</option>
                  ))}
                </select>
              </div>

              {/* Movie Length */}
              {(() => {
                const wordCount = prompt.split(/\s+/).filter(Boolean).length;
                const est = estimateScenes(wordCount);
                const selectedScenes = est[movieLength];
                return (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider text-center block">Movie Length</label>
                    <div className="flex items-center justify-center gap-2">
                      {(Object.entries(MOVIE_LENGTH_LABELS) as [MovieLength, typeof MOVIE_LENGTH_LABELS['short']][]).map(([key, config]) => (
                        <button key={key} onClick={() => setMovieLength(key)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
                            movieLength === key
                              ? "bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20 scale-105"
                              : "bg-[--bg-card] border-[--border-subtle] text-[--text-muted] hover:bg-[--bg-card-hover]"
                          )}>
                          <span>{config.icon}</span>
                          <div className="text-left">
                            <span className="block text-xs font-bold">{config.labelHe}</span>
                            <span className="block text-[10px] opacity-70">
                              {wordCount > 0 ? `~${est[key]} scenes` : config.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    {wordCount > 0 && (
                      <p className="text-[10px] text-[--text-muted] text-center">
                        {wordCount} words → ~{selectedScenes} scenes → Est. ~${(selectedScenes * SCENE_COST).toFixed(2)} USD
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Textarea */}
              <div className="relative group">
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                  placeholder={isManualMode ? "Paste your full script or book excerpt here..." : "Describe your movie idea..."}
                  className="w-full min-h-48 sm:min-h-56 bg-[--bg-card] border border-[--border-subtle] rounded-2xl p-5 text-sm text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--accent]/20 focus:border-[--accent]/40 transition-all resize-y placeholder:text-[--text-muted] leading-relaxed overflow-y-auto"
                />
                <div className="absolute bottom-4 right-4 text-xs text-[--text-muted] font-medium">
                  {prompt.length > 0 ? `${prompt.split(/\s+/).filter(Boolean).length} words` : ''}
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setWizardStep('style')}
                  disabled={!prompt.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-[--accent] hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
                  Next <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 2: STYLE & CHARACTERS ===== */}
          {wizardStep === 'style' && (
            <motion.div key="style" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Choose your style</h1>
                <p className="text-sm text-[--text-muted]">Pick a visual style and upload character references</p>
              </div>

              {/* Style Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {styles.map((s) => (
                  <motion.button key={s.name} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setStyle(s.name)}
                    className={cn(
                      "relative flex flex-col items-center gap-3 p-4 pb-5 rounded-2xl border transition-all text-center",
                      style === s.name
                        ? "bg-[--bg-card-active] border-[--accent]/40 ring-1 ring-[--accent]/20 shadow-lg shadow-[--accent]/10"
                        : "bg-[--bg-card] border-[--border-subtle] hover:bg-[--bg-card-hover]"
                    )}>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", s.color)}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{s.name}</p>
                      <p className="text-[11px] text-[--text-muted]">{s.description}</p>
                    </div>
                    {style === s.name && (
                      <motion.div layoutId="style-check" className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-[--accent]" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Reference Images */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[--text-secondary]">Character & Atmosphere References</h3>
                  <span className="text-xs font-medium text-[--text-muted]">{referenceImages.length}/3</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {referenceImages.map((img) => (
                    <motion.div layout key={img.id} className="aspect-square bg-[--bg-card] rounded-xl border border-[--border-subtle] relative group overflow-hidden">
                      <img src={img.previewUrl} className="w-full h-full object-cover rounded-xl" alt="Reference" />
                      <button onClick={() => removeReferenceImage(img.id)}
                        className="absolute inset-0 bg-red-600/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm rounded-xl">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                  {referenceImages.length < 3 && (
                    <button onClick={() => fileInputRef.current?.click()}
                      className="aspect-square bg-[--bg-card] border-2 border-dashed border-[--border-subtle] rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[--bg-card-hover] hover:border-[--text-muted] transition-all">
                      <Upload className="w-5 h-5 text-[--text-muted]" />
                      <span className="text-[11px] font-medium text-[--text-muted]">Upload</span>
                    </button>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" multiple className="hidden" />
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button onClick={() => setWizardStep('story')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[--bg-card] border border-[--border-subtle] rounded-xl text-sm font-medium text-[--text-secondary] hover:bg-[--bg-card-hover] transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setWizardStep('language')}
                  className="flex items-center gap-2 px-6 py-3 bg-[--accent] hover:bg-blue-500 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
                  Next <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 3: LANGUAGE & GENERATE ===== */}
          {wizardStep === 'language' && (
            <motion.div key="language" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Select languages</h1>
                <p className="text-sm text-[--text-muted]">Choose one or more languages for dubbing</p>
              </div>

              {/* Language Cards - Multi-Select */}
              <div className="space-y-3">
                {(Object.entries(LANGUAGE_CONFIG) as [AudioLanguage, typeof LANGUAGE_CONFIG['he']][]).map(([code, config]) => (
                  <motion.button key={code} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    onClick={() => toggleLanguage(code)}
                    className={cn(
                      "w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left",
                      selectedLanguages.includes(code)
                        ? "bg-[--accent-soft] border-[--accent]/30 ring-1 ring-[--accent]/20"
                        : "bg-[--bg-card] border-[--border-subtle] hover:bg-[--bg-card-hover]"
                    )}>
                    <span className="text-3xl">{config.flag}</span>
                    <div className="flex-1">
                      <p className="text-base font-bold">{config.label}</p>
                      <p className="text-xs text-[--text-muted]">Voice: {config.voice}</p>
                    </div>
                    {selectedLanguages.includes(code) && (
                      <CheckCircle2 className="w-5 h-5 text-[--accent]" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Generate Button */}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { generateScript(); setWizardStep('timeline'); }}
                disabled={isGeneratingScript || !prompt.trim() || selectedLanguages.length === 0}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[--accent] to-indigo-500 hover:from-blue-500 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl text-base font-bold transition-all shadow-xl shadow-blue-500/20">
                {isGeneratingScript ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating your movie script...</> : <><Sparkles className="w-5 h-5" /> Generate Script</>}
              </motion.button>

              {/* Navigation */}
              <div className="flex justify-start">
                <button onClick={() => setWizardStep('style')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[--bg-card] border border-[--border-subtle] rounded-xl text-sm font-medium text-[--text-secondary] hover:bg-[--bg-card-hover] transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 4: TIMELINE ===== */}
          {wizardStep === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-3xl mx-auto space-y-6">

              {/* Timeline Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{script?.title || 'Timeline'}</h1>
                  {script && <p className="text-xs text-[--text-muted] mt-1">{script.scenes.length} scenes | {selectedLanguages.map(l => LANGUAGE_CONFIG[l].flag).join(' ')}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {script && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={produceNextScene}
                      disabled={isGeneratingAll || isProcessingVideo || !isApiKeySelected}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[--success] hover:bg-emerald-400 text-black disabled:opacity-40 rounded-xl text-xs font-bold uppercase tracking-wide transition-all shadow-lg shadow-emerald-500/20">
                      {isGeneratingAll ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Play className="w-4 h-4 fill-current" /> Produce Next</>}
                    </motion.button>
                  )}
                  <button onClick={addManualScene} className="p-2.5 bg-[--bg-card] hover:bg-[--bg-card-hover] border border-[--border-subtle] rounded-xl transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Batch Progress */}
              {isGeneratingAll && script && (
                <div className="bg-[--bg-card] rounded-xl p-4 border border-[--border-subtle]">
                  <div className="flex items-center justify-between text-xs font-medium mb-2">
                    <span className="text-[--text-secondary]">Producing scenes...</span>
                    <span className="text-[--accent]">{script.scenes.filter(s => s.status === 'completed').length}/{script.scenes.length}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-[--accent] rounded-full"
                      animate={{ width: `${(script.scenes.filter(s => s.status === 'completed').length / script.scenes.length) * 100}%` }}
                      transition={{ duration: 0.5 }} />
                  </div>
                </div>
              )}

              {/* Scene Cards */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {script?.scenes.map((scene, index) => (
                    <motion.div key={scene.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        "p-4 sm:p-5 rounded-2xl border transition-all",
                        scene.approved ? "bg-[--success-soft] border-[--success]/20" :
                        currentSceneIndex === index ? "bg-[--bg-card-active] border-[--border-active] shadow-lg" :
                        "bg-[--bg-card] border-[--border-subtle] hover:bg-[--bg-card-hover]"
                      )}>

                      {editingSceneId === scene.id ? (
                        /* Edit Mode */
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[--accent] uppercase tracking-wide">Edit Scene {index + 1}</span>
                            <button onClick={() => setEditingSceneId(null)} className="p-1.5 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
                          </div>
                          <input value={scene.title} onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                            className="w-full bg-[--bg-primary] border border-[--border-subtle] rounded-xl p-3 text-sm focus:outline-none focus:border-[--accent]/50" placeholder="Scene Title" />
                          <textarea value={scene.description} onChange={(e) => updateScene(scene.id, { description: e.target.value })}
                            className="w-full bg-[--bg-primary] border border-[--border-subtle] rounded-xl p-3 text-sm h-20 resize-none focus:outline-none focus:border-[--accent]/50" placeholder="Description" />
                          <textarea value={scene.visualPrompt} onChange={(e) => updateScene(scene.id, { visualPrompt: e.target.value })}
                            className="w-full bg-[--bg-primary] border border-[--border-subtle] rounded-xl p-3 text-sm h-24 resize-none focus:outline-none focus:border-[--accent]/50" placeholder="Visual prompt for AI..." />
                          <textarea value={scene.audioScript} onChange={(e) => updateScene(scene.id, { audioScript: e.target.value })}
                            className="w-full bg-[--bg-primary] border border-[--border-subtle] rounded-xl p-3 text-sm h-20 resize-none focus:outline-none focus:border-[--accent]/50" placeholder="Audio script (dialogue/narration)" />
                          <button onClick={() => setEditingSceneId(null)}
                            className="w-full py-2.5 bg-[--accent] hover:bg-blue-500 rounded-xl text-xs font-bold uppercase tracking-wide transition-all">Done</button>
                        </div>
                      ) : (
                        /* View Mode */
                        <>
                          <div className="flex items-center gap-4">
                            {/* Number */}
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                              scene.status === 'completed' ? "bg-[--success-soft] text-[--success]" :
                              scene.status === 'generating' ? "bg-[--accent-soft] text-[--accent]" :
                              "bg-white/5 text-[--text-muted]"
                            )}>{index + 1}</div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-sm truncate">{scene.title}</h3>
                                {/* Status Pill */}
                                {scene.status === 'completed' && scene.approved && (
                                  <span className="px-2 py-0.5 bg-[--success-soft] text-[--success] text-[10px] font-bold rounded-full uppercase">Approved</span>
                                )}
                                {scene.status === 'completed' && !scene.approved && (
                                  <span className="px-2 py-0.5 bg-[--success-soft] text-[--success] text-[10px] font-bold rounded-full uppercase">Done</span>
                                )}
                                {scene.status === 'generating' && (
                                  <span className="px-2 py-0.5 bg-[--accent-soft] text-[--accent] text-[10px] font-bold rounded-full uppercase animate-pulse">Producing...</span>
                                )}
                              </div>
                              <p className="text-xs text-[--text-muted] truncate mt-0.5">{scene.description}</p>
                              {scene.status === 'pending' && (
                                <span className="text-[10px] text-[--text-muted] mt-0.5 flex items-center gap-1">
                                  <DollarSign className="w-2.5 h-2.5" />~${SCENE_COST.toFixed(3)}
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                              {scene.status === 'completed' && (
                                <>
                                  {!scene.approved && (
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                      onClick={() => approveScene(scene.id)} title="Approve scene to enable next scene production"
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[--success] hover:bg-emerald-400 text-black rounded-lg text-xs font-bold transition-all animate-pulse">
                                      <Check className="w-3.5 h-3.5" /> Approve
                                    </motion.button>
                                  )}
                                  <button onClick={() => { setCurrentSceneIndex(index); setWizardStep('preview'); }} title="Preview"
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                                    <Play className="w-4 h-4 fill-current" />
                                  </button>
                                  <button onClick={() => downloadSceneVideo(scene)} title="Download"
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                                    <Download className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {scene.status === 'pending' && (
                                <button onClick={() => generateVideoForScene(index)}
                                  disabled={isProcessingVideo || !isApiKeySelected || !canProduceScene(index)}
                                  title={!canProduceScene(index) ? `Approve Scene ${index} first` : 'Produce this scene'}
                                  className="px-3 py-1.5 bg-white text-black hover:bg-white/90 disabled:opacity-20 disabled:cursor-not-allowed rounded-lg text-xs font-bold transition-all">
                                  Produce
                                </button>
                              )}
                              {scene.status === 'generating' && <Loader2 className="w-5 h-5 text-[--accent] animate-spin" />}
                              {scene.status === 'failed' && (
                                <button onClick={() => generateVideoForScene(index)}
                                  disabled={isProcessingVideo || !canProduceScene(index)}
                                  className="px-3 py-1.5 bg-[--danger-soft] text-[--danger] disabled:opacity-20 rounded-lg text-xs font-bold">Retry</button>
                              )}
                              <button onClick={() => setEditingSceneId(scene.id)} className="p-2 hover:bg-white/5 rounded-lg text-[--text-muted]">
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteScene(scene.id)} className="p-2 hover:bg-[--danger-soft] rounded-lg text-[--text-muted] hover:text-[--danger]">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          {/* Audio language pills */}
                          {scene.status === 'completed' && scene.langMedia && Object.keys(scene.langMedia).length > 0 && (
                            <div className="mt-3 pt-3 border-t border-[--border-subtle] flex items-center gap-2 flex-wrap">
                              <Volume2 className="w-3.5 h-3.5 text-[--text-muted] shrink-0" />
                              {Object.entries(scene.langMedia).map(([lang, media]) => media.audioUrl && (
                                <div key={lang} className="flex items-center gap-1">
                                  <span className="text-xs">{LANGUAGE_CONFIG[lang as AudioLanguage]?.flag || lang}</span>
                                  <button onClick={() => { const a = new Audio(media.audioUrl!); a.play(); }}
                                    className="p-1 bg-white/5 hover:bg-white/10 rounded text-[10px]" title={`Play ${lang}`}>
                                    <Play className="w-3 h-3 fill-current" />
                                  </button>
                                  <button onClick={() => downloadSceneAudio(scene, lang)}
                                    className="p-1 bg-white/5 hover:bg-white/10 rounded text-[10px]" title={`Download ${lang}`}>
                                    <Download className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Approval reminder */}
                          {scene.status === 'completed' && !scene.approved && (
                            <div className="mt-3 pt-3 border-t border-[--border-subtle] flex items-center gap-2 text-xs text-[--warning]">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>Approve this scene to unlock the next one for production</span>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {(!script || script.scenes.length === 0) && !isGeneratingScript && (
                  <div className="h-48 flex flex-col items-center justify-center border border-dashed border-[--border-subtle] rounded-2xl text-[--text-muted]">
                    <Clapperboard className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No scenes yet</p>
                    <p className="text-xs mt-1">Go back to generate a script first</p>
                  </div>
                )}

                {isGeneratingScript && (
                  <div className="h-48 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[--accent] animate-spin mb-4" />
                    <p className="text-sm font-medium text-[--text-secondary]">Creating your movie script...</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button onClick={() => setWizardStep('language')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[--bg-card] border border-[--border-subtle] rounded-xl text-sm font-medium text-[--text-secondary] hover:bg-[--bg-card-hover] transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                {script && script.scenes.some(s => s.status === 'completed') && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setCurrentSceneIndex(0); setWizardStep('preview'); }}
                    className="flex items-center gap-2 px-6 py-3 bg-[--accent] hover:bg-blue-500 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
                    Preview <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* ===== STEP 5: PREVIEW ===== */}
          {wizardStep === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-4xl mx-auto space-y-6">

              {/* Video Player */}
              <div className="aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden border border-[--border-subtle] relative shadow-2xl">
                {currentSceneIndex !== null && script?.scenes[currentSceneIndex]?.videoUrl ? (
                  (() => {
                    const previewScene = script.scenes[currentSceneIndex];
                    const previewAudioUrl = previewScene.langMedia?.[audioLanguage]?.audioUrl || previewScene.audioUrl;
                    return <>
                      <video ref={videoRef} src={previewScene.videoUrl} controls autoPlay
                        muted={!!previewAudioUrl} className="w-full h-full object-cover" />
                      {previewAudioUrl && (
                        <audio ref={audioRef} src={previewAudioUrl} autoPlay controls
                          className="absolute bottom-3 left-3 right-3 z-20 opacity-90 h-8" />
                      )}
                    </>;
                  })()
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[--text-muted]">
                    <Clapperboard className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium">Select a scene to preview</p>
                  </div>
                )}

                {/* Loading Overlay */}
                <AnimatePresence>
                  {isProcessingVideo && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-30">
                      <Loader2 className="w-12 h-12 text-[--accent] animate-spin mb-4" />
                      <p className="text-lg font-bold">Rendering...</p>
                      <p className="text-xs text-[--text-muted] mt-1">Scene {currentSceneIndex !== null ? currentSceneIndex + 1 : ''}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Language Switcher for Preview */}
              {selectedLanguages.length > 1 && (
                <div className="flex items-center gap-2 justify-center">
                  <Volume2 className="w-4 h-4 text-[--text-muted]" />
                  <span className="text-xs text-[--text-muted] font-medium">Audio:</span>
                  {selectedLanguages.map(lang => (
                    <button key={lang} onClick={() => setAudioLanguage(lang)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        audioLanguage === lang
                          ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                          : "bg-[--bg-card] border-[--border-subtle] text-[--text-muted] hover:bg-[--bg-card-hover]"
                      )}>
                      <span>{LANGUAGE_CONFIG[lang].flag}</span>
                      <span>{LANGUAGE_CONFIG[lang].label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Scene Info */}
              {script && currentSceneIndex !== null && script.scenes[currentSceneIndex] && (
                <div className="p-5 bg-[--bg-card] border border-[--border-subtle] rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[--accent] bg-[--accent-soft] px-2 py-1 rounded-md">Scene {currentSceneIndex + 1}</span>
                      <h3 className="font-bold">{script.scenes[currentSceneIndex].title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {script.scenes[currentSceneIndex].status === 'completed' && !script.scenes[currentSceneIndex].approved && (
                        <button onClick={() => approveScene(script.scenes[currentSceneIndex].id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[--success] text-black rounded-lg text-xs font-bold">
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                      {script.scenes[currentSceneIndex].videoUrl && (
                        <button onClick={() => downloadSceneVideo(script.scenes[currentSceneIndex])}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[--bg-card-hover] border border-[--border-subtle] rounded-lg text-xs font-medium">
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-[--text-secondary] leading-relaxed">{script.scenes[currentSceneIndex].description}</p>
                </div>
              )}

              {/* Scene Strip */}
              {script && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {script.scenes.map((scene, i) => (
                    <button key={scene.id} onClick={() => setCurrentSceneIndex(i)}
                      className={cn(
                        "shrink-0 w-20 sm:w-24 p-2 rounded-xl border text-center transition-all",
                        currentSceneIndex === i ? "bg-[--bg-card-active] border-[--accent]/40" : "bg-[--bg-card] border-[--border-subtle] hover:bg-[--bg-card-hover]"
                      )}>
                      <div className={cn("w-full aspect-video rounded-lg mb-1.5 flex items-center justify-center text-xs",
                        scene.status === 'completed' ? "bg-[--success-soft] text-[--success]" : "bg-white/5 text-[--text-muted]"
                      )}>
                        {scene.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <p className="text-[10px] font-medium text-[--text-muted] truncate">{scene.title}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Export Movie Section */}
              {script && script.scenes.some(s => s.status === 'completed' && s.videoUrl) && (
                <div className="p-5 bg-[--bg-card] border border-[--border-subtle] rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Film className="w-5 h-5 text-[--accent]" />
                      <h3 className="font-bold text-sm">Export Full Movie</h3>
                    </div>
                    {!showExportDialog && (
                      <button onClick={() => { setShowExportDialog(true); setExportStatus('idle'); setExportLanguage(selectedLanguages[0] || 'he'); }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[--accent] to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                        <Download className="w-4 h-4" /> Export Movie 🎬
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {showExportDialog && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden">

                        {/* Language Selector */}
                        {exportStatus === 'idle' && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Audio Language</label>
                            <div className="flex gap-2">
                              {selectedLanguages.map(lang => (
                                <button key={lang} onClick={() => setExportLanguage(lang)}
                                  className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                                    exportLanguage === lang
                                      ? "bg-[--accent-soft] border-[--accent]/40 text-[--accent]"
                                      : "bg-[--bg-card-hover] border-[--border-subtle] text-[--text-secondary] hover:bg-[--bg-card-active]"
                                  )}>
                                  <span>{LANGUAGE_CONFIG[lang].flag}</span>
                                  <span>{LANGUAGE_CONFIG[lang].label}</span>
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-[--text-muted]">
                              {script.scenes.filter(s => s.status === 'completed').length} scenes will be merged into one MP4 file
                            </p>
                          </div>
                        )}

                        {/* Progress */}
                        {(exportStatus === 'loading-ffmpeg' || exportStatus === 'processing') && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Loader2 className="w-5 h-5 text-[--accent] animate-spin shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{exportProgressMsg}</p>
                                <div className="mt-2 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                  <motion.div className="h-full bg-gradient-to-r from-[--accent] to-purple-500 rounded-full"
                                    initial={{ width: 0 }} animate={{ width: `${exportProgress}%` }} transition={{ duration: 0.3 }} />
                                </div>
                                <p className="text-xs text-[--text-muted] mt-1">{exportProgress}%</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Done */}
                        {exportStatus === 'done' && exportUrl && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[--success]">
                              <CheckCircle2 className="w-5 h-5" />
                              <p className="text-sm font-bold">Movie exported successfully!</p>
                            </div>
                            <button onClick={downloadExportedMovie}
                              className="flex items-center gap-2 px-5 py-3 bg-[--success] text-black rounded-xl text-sm font-bold w-full justify-center hover:brightness-110 transition-all">
                              <Download className="w-4 h-4" /> Download MP4
                            </button>
                          </div>
                        )}

                        {/* Error */}
                        {exportStatus === 'error' && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-red-400">
                              <AlertCircle className="w-5 h-5" />
                              <p className="text-sm font-medium">{exportProgressMsg}</p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          {exportStatus === 'idle' && (
                            <button onClick={exportMovie}
                              className="flex items-center gap-2 px-5 py-2.5 bg-[--accent] text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all">
                              <Play className="w-4 h-4" /> Start Export
                            </button>
                          )}
                          {(exportStatus === 'error' || exportStatus === 'done') && (
                            <button onClick={() => { setExportStatus('idle'); setExportProgress(0); setExportProgressMsg(''); }}
                              className="flex items-center gap-2 px-4 py-2 bg-[--bg-card-hover] border border-[--border-subtle] rounded-xl text-sm font-medium hover:bg-[--bg-card-active] transition-all">
                              Export Again
                            </button>
                          )}
                          <button onClick={() => { setShowExportDialog(false); setExportStatus('idle'); }}
                            className="flex items-center gap-2 px-4 py-2 text-[--text-muted] text-sm hover:text-[--text-secondary] transition-all">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-start">
                <button onClick={() => setWizardStep('timeline')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[--bg-card] border border-[--border-subtle] rounded-xl text-sm font-medium text-[--text-secondary] hover:bg-[--bg-card-hover] transition-all">
                  <ArrowLeft className="w-4 h-4" /> Timeline
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== PRICING ===== */}
          {wizardStep === 'pricing' && (
            <motion.div key="pricing" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Choose your plan</h1>
                <p className="text-sm text-[--text-muted]">Scale your movie production with the right tier</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {(Object.entries(PLAN_CONFIG) as [PlanTier, typeof PLAN_CONFIG['free']][]).map(([tier, config]) => (
                  <div key={tier}
                    className={cn(
                      "relative p-5 rounded-2xl border transition-all text-center space-y-3",
                      userProfile.plan === tier
                        ? "bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20"
                        : "bg-[--bg-card] border-[--border-subtle] hover:bg-[--bg-card-hover]"
                    )}>
                    {tier === 'pro' && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[--accent] text-white text-[10px] font-bold uppercase rounded-full">Popular</span>
                    )}
                    {userProfile.plan === tier && (
                      <span className="absolute top-2 right-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /></span>
                    )}
                    <Crown className={cn("w-6 h-6 mx-auto", tier === 'free' ? 'text-[--text-muted]' : 'text-[--accent]')} />
                    <h3 className="font-bold text-lg">{config.label}</h3>
                    <p className="text-2xl font-black">{config.price === 0 ? 'Free' : `$${config.price}`}<span className="text-xs font-normal text-[--text-muted]">{config.price > 0 ? '/mo' : ''}</span></p>
                    <p className="text-xs text-[--text-muted]">{config.desc}</p>
                    <button
                      onClick={() => persistUserProfile({ ...userProfile, plan: tier, credits: config.films })}
                      className={cn(
                        "w-full py-2.5 rounded-xl text-xs font-bold transition-all",
                        userProfile.plan === tier
                          ? "bg-blue-600/30 text-blue-300 cursor-default"
                          : "bg-[--accent] hover:bg-blue-500 text-white"
                      )}>
                      {userProfile.plan === tier ? 'Current Plan' : 'Select Plan'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-start">
                <button onClick={() => setWizardStep('story')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[--bg-card] border border-[--border-subtle] rounded-xl text-sm font-medium text-[--text-secondary] hover:bg-[--bg-card-hover] transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back to Studio
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[--bg-elevated]/90 backdrop-blur-xl border-t border-[--border-subtle] p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden z-50">
        <div className="flex items-center justify-around">
          {WIZARD_STEPS.map((step) => (
            <button key={step.key} onClick={() => setWizardStep(step.key)}
              className={cn(
                "flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all min-w-[56px]",
                wizardStep === step.key ? "text-[--accent]" : "text-[--text-muted]"
              )}>
              {step.icon}
              <span className="text-[10px] font-semibold">{step.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
