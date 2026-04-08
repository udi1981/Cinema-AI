import React, { useState, useRef, useEffect } from 'react';
import { 
  Film, 
  Sparkles, 
  Play, 
  Plus, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Download,
  Share2,
  Trash2,
  Clapperboard,
  Palette,
  Clock,
  Wand2,
  Image as ImageIcon,
  X,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI, GenerateContentResponse, Modality, VideoGenerationReferenceType } from "@google/genai";
import { cn } from './lib/utils';
import { MovieScript, Scene, MovieStyle, ReferenceImage } from './types';

// Constants
const VEO_MODEL = 'veo-3.1-generate-preview';
const SCRIPT_MODEL = 'gemini-3.1-pro-preview';

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
  const [activeTab, setActiveTab] = useState<'script' | 'timeline' | 'preview'>('script');
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scriptRef = useRef<MovieScript | null>(null);

  // Keep ref in sync with state so async functions always see latest script
  useEffect(() => {
    scriptRef.current = script;
  }, [script]);

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

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setIsApiKeySelected(true);
    }
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
      // Revoke URL for the removed image
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const generateScript = async () => {
    if (!prompt.trim()) return;
    
    setIsGeneratingScript(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
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

**CONTINUITY:** If this scene follows a previous scene, describe how the visual connects — same character position, matching eye-line, continuous camera movement, matching lighting direction.

=== AUDIO SCRIPT (HEBREW) ===
The "audioScript" is the EXACT Hebrew text that will be spoken aloud via TTS. Rules:
- Write COMPLETE dialogue — every word the character says, in natural spoken Hebrew
- For narration, write cinematic Hebrew narration (כמספר סיפורים מקצועי)
- Mark speakers: (מספר:) for narrator, (שם-דמות:) for characters
- Include emotional direction in brackets: [בלחש, בפחד] [צועק בכעס] [בשקט, בהתרגשות עמוקה]
- NEVER summarize dialogue. If a character gives a speech, write the FULL speech in Hebrew.
- Match the audioScript timing to the 8-second video duration

=== SCENE GRANULARITY ===
Break the source into the MAXIMUM number of scenes possible. Each distinct action, camera angle change, or dialogue beat = a new scene. Prefer MORE scenes with focused content over FEWER scenes with compressed content. A single paragraph of source text should produce 2-5 scenes minimum.

=== OUTPUT FORMAT ===
Return a JSON object:
{
  "title": "כותרת הסרט בעברית",
  "genre": "ז'אנר",
  "style": "${style}",
  "scenes": [
    {
      "id": "scene-001",
      "title": "כותרת הסצנה בעברית",
      "description": "תיאור נרטיבי מפורט בעברית — מה קורה, מה הדמויות מרגישות, מה המשמעות הדרמטית",
      "visualPrompt": "ENGLISH: Ultra-detailed shot description with camera, lighting, subject, action, environment, color, style, continuity — minimum 80 words per scene",
      "audioScript": "(מספר:) [בקול עמוק ודרמטי] הטקסט המלא בעברית שיוקרא בקול... (דמות:) [ברגש] הדיאלוג המלא...",
      "durationSeconds": 8
    }
  ]
}`;

      const response = await withRetry(() => ai.models.generateContent({
        model: SCRIPT_MODEL,
        contents: {
          parts: [
            ...imageParts,
            { text: `Break down this text into the MAXIMUM number of ultra-detailed cinematic scenes possible. Every sentence, every event, every piece of dialogue must become its own scene. Do not skip or compress anything. Hebrew dialogue and narration, English visual prompts. Source text:\n\n${prompt}` }
          ]
        },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      }));

      const scriptData = JSON.parse(response.text || '{}') as MovieScript;
      // Initialize scene status
      scriptData.scenes = scriptData.scenes.map(s => ({ ...s, status: 'pending' }));
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

  const generateVideoForScene = async (index: number, _batchMode = false) => {
    // Always read from ref for latest state (critical for batch "Produce All" chaining)
    const latestScript = scriptRef.current;
    // In batch mode, skip the isProcessingVideo guard (we manage it ourselves)
    if (!latestScript || !isApiKeySelected || (!_batchMode && isProcessingVideo)) return;

    // Use more aggressive retry for video generation
    const videoWithRetry = (fn: any) => withRetry(fn, 7, 8000);

    const scene = latestScript.scenes[index];
    const updatedScenes = [...latestScript.scenes];
    updatedScenes[index].status = 'generating';
    setScript({ ...latestScript, scenes: updatedScenes });
    setIsProcessingVideo(true);

    try {
      // Use API_KEY for Veo as it requires a paid key, fallback to GEMINI_API_KEY
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      // Read previous scene from ref to get the latest videoObject (critical for chaining)
      const prevScene = index > 0 ? scriptRef.current?.scenes[index - 1] ?? null : null;
      
      // 1. Generate TTS for the scene
      let audioUrl = '';
      try {
        const ttsText = scene.audioScript || scene.description;
        // Strip speaker tags and emotional directions for clean TTS, but keep the emotional context in the prompt
        const cleanTtsText = ttsText
          .replace(/\([^)]*:\)/g, '') // Remove (מספר:) (דמות:) tags
          .replace(/\[[^\]]*\]/g, '')  // Remove [בלחש] emotional directions
          .trim();
        const emotionalContext = (ttsText.match(/\[[^\]]*\]/g) || []).join(' ');
        const ttsResponse = await withRetry(() => ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: `Speak this Hebrew text with deep cinematic emotion${emotionalContext ? ` (${emotionalContext})` : ''}. Speak clearly and expressively in Hebrew:\n${cleanTtsText}` }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        }));

        const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const binary = atob(base64Audio);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'audio/mpeg' });
          audioUrl = URL.createObjectURL(blob);
        }
      } catch (ttsErr) {
        console.warn("TTS generation failed, continuing with silent video:", ttsErr);
      }

      // 2. Generate Video
      let operation;
      
      // Prepare reference images payload
      const referenceImagesPayload = referenceImages.map(img => ({
        image: {
          imageBytes: img.data,
          mimeType: img.mimeType
        },
        referenceType: VideoGenerationReferenceType.ASSET
      }));

      const videoConfig: any = {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9',
      };

      // Ensure prompt is not empty as it is mandatory
      const promptText = scene.visualPrompt?.trim() || scene.description?.trim() || "A cinematic scene...";

      if (prevScene && prevScene.videoObject) {
        // Extend the previous video for continuity
        // CRITICAL: referenceImages are NOT supported when extending a video
        operation = await videoWithRetry(() => ai.models.generateVideos({
          model: VEO_MODEL,
          prompt: promptText,
          video: prevScene.videoObject,
          config: videoConfig
        }));
      } else {
        // Generate initial video
        // referenceImages are supported for initial video generation with veo-3.1-generate-preview
        if (referenceImagesPayload.length > 0) {
          videoConfig.referenceImages = referenceImagesPayload;
        }
        
        operation = await videoWithRetry(() => ai.models.generateVideos({
          model: VEO_MODEL,
          prompt: promptText,
          config: videoConfig
        }));
      }

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
        audioUrl: audioUrl
      };
      setScript({ ...currentScript, scenes: finalScenes });
      setCurrentSceneIndex(index);
    } catch (err: any) {
      console.error("Video generation failed:", err);
      const currentScript = scriptRef.current!;
      const finalScenes = [...currentScript.scenes];
      finalScenes[index].status = 'failed';
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
        errorMessage = "API Quota Exceeded. You've reached the limit for video generation. Please wait a few minutes or check your Gemini API billing plan (https://ai.google.dev/gemini-api/docs/rate-limits).";
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

  const generateAllScenes = async () => {
    const latestScript = scriptRef.current;
    if (!latestScript || !isApiKeySelected || isGeneratingAll || isProcessingVideo) return;

    setIsGeneratingAll(true);
    setError(null);

    try {
      for (let i = 0; i < latestScript.scenes.length; i++) {
        // Always read latest state from ref (previous scene may have updated videoObject)
        const current = scriptRef.current;
        if (!current) break;
        if (current.scenes[i].status === 'completed') continue;
        await generateVideoForScene(i, true);
      }
    } catch (err) {
      console.error("Batch generation failed:", err);
      setError("Batch generation stopped due to an error.");
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
      status: 'pending'
    };

    if (script) {
      setScript({ ...script, scenes: [...script.scenes, newScene] });
    } else {
      setScript({
        title: "My Custom Movie",
        genre: "Custom",
        style: style,
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

  const styles: { name: MovieStyle; icon: React.ReactNode; color: string; description: string }[] = [
    { name: 'Pixar', icon: <Clapperboard className="w-4 h-4" />, color: 'from-blue-500 to-cyan-500', description: '3D animated charm' },
    { name: 'Realistic', icon: <Film className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500', description: 'Cinematic realism' },
    { name: 'Paper Folding', icon: <Palette className="w-4 h-4" />, color: 'from-orange-500 to-amber-500', description: 'Stop-motion origami' },
    { name: 'Cyberpunk', icon: <Sparkles className="w-4 h-4" />, color: 'from-purple-500 to-pink-500', description: 'Neon-lit future' },
    { name: 'Hand-drawn', icon: <Wand2 className="w-4 h-4" />, color: 'from-rose-500 to-red-500', description: 'Classic 2D artistry' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              <Film className="w-5 h-5 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-base tracking-tight leading-none">Cinematic Studio</h1>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">Pro AI Engine</p>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10 md:hidden">
            {(['script', 'timeline', 'preview'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                  activeTab === tab ? "bg-white text-black shadow-lg" : "text-white/40"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isApiKeySelected && (
              <button 
                onClick={handleOpenKeyDialog}
                className="p-2 sm:px-4 sm:py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Connect Key</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-white/40 uppercase">Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-500/10 border-b border-red-500/20 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-xs font-medium leading-relaxed">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="p-1 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Panel: Script (Visible on desktop or when script tab active) */}
          <div className={cn(
            "md:col-span-4 space-y-8 transition-all",
            activeTab !== 'script' && "hidden md:block"
          )}>
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full" />
                  <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">The Story</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setBeCreative(!beCreative)}
                    className="flex items-center gap-2 group"
                  >
                    <span className="text-[9px] text-white/30 font-bold uppercase group-hover:text-white/60 transition-colors">Creative</span>
                    <div className={cn(
                      "w-7 h-3.5 rounded-full transition-colors relative",
                      beCreative ? "bg-blue-600" : "bg-white/10"
                    )}>
                      <motion.div 
                        animate={{ x: beCreative ? 14 : 2 }}
                        className="absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full" 
                      />
                    </div>
                  </button>
                  <button 
                    onClick={() => setIsManualMode(!isManualMode)}
                    className="flex items-center gap-2 group"
                  >
                    <span className="text-[9px] text-white/30 font-bold uppercase group-hover:text-white/60 transition-colors">Manual</span>
                    <div className={cn(
                      "w-7 h-3.5 rounded-full transition-colors relative",
                      isManualMode ? "bg-amber-600" : "bg-white/10"
                    )}>
                      <motion.div 
                        animate={{ x: isManualMode ? 14 : 2 }}
                        className="absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full" 
                      />
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="relative group">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={isManualMode ? "Paste your full script or book excerpt here..." : "Describe your movie idea in a few sentences..."}
                  className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all resize-none placeholder:text-white/10 leading-relaxed"
                />
                <div className="absolute bottom-4 right-4">
                  {isManualMode ? (
                    <button 
                      onClick={addManualScene}
                      className="p-3 bg-amber-600 hover:bg-amber-500 rounded-xl shadow-xl shadow-amber-600/20 transition-all active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      onClick={generateScript}
                      disabled={isGeneratingScript || !prompt.trim()}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-blue-600/20 transition-all active:scale-95"
                    >
                      {isGeneratingScript ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {script ? 'Refine' : 'Generate'}
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-purple-500 rounded-full" />
                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">Visual Style</h2>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {styles.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setStyle(s.name)}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-2xl border transition-all text-left group",
                      style === s.name 
                        ? "bg-white/10 border-white/20 ring-1 ring-white/20" 
                        : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", s.color)}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{s.name}</p>
                      <p className="text-[10px] text-white/30 font-medium">{s.description}</p>
                    </div>
                    {style === s.name && (
                      <motion.div layoutId="style-check" className="ml-auto pr-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">Characters & Atmosphere</h2>
                </div>
                <span className="text-[10px] font-bold text-white/20">{referenceImages.length}/3</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {referenceImages.map((img) => (
                  <motion.div 
                    layout
                    key={img.id} 
                    className="aspect-square bg-white/5 rounded-2xl border border-white/10 relative group overflow-hidden shadow-inner"
                  >
                    <img src={img.previewUrl} className="w-full h-full object-cover" alt="Reference" />
                    <button 
                      onClick={() => removeReferenceImage(img.id)}
                      className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
                {referenceImages.length < 3 && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-white/[0.03] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all group"
                  >
                    <Upload className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                    <span className="text-[9px] font-bold text-white/20 uppercase">Add Ref</span>
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" multiple className="hidden" />
            </section>
          </div>

          {/* Right Panel: Production (Timeline & Preview) */}
          <div className={cn(
            "md:col-span-8 space-y-8",
            activeTab === 'script' && "hidden md:block"
          )}>
            
            {/* Video Preview Section */}
            <div className={cn(
              "space-y-4",
              activeTab !== 'preview' && "hidden md:block"
            )}>
              <div className="aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10 relative group shadow-2xl ring-1 ring-white/5">
                {currentSceneIndex !== null && script?.scenes[currentSceneIndex]?.videoUrl ? (
                  <>
                    <video 
                      ref={videoRef}
                      src={script.scenes[currentSceneIndex].videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                    {script.scenes[currentSceneIndex].audioUrl && (
                      <audio 
                        ref={audioRef}
                        src={script.scenes[currentSceneIndex].audioUrl}
                        className="hidden"
                      />
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10">
                    <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center mb-6 bg-white/[0.02]">
                      <Clapperboard className="w-10 h-10" />
                    </div>
                    <p className="text-sm font-bold tracking-widest uppercase opacity-40">Awaiting Production</p>
                  </div>
                )}
                
                <AnimatePresence>
                  {isProcessingVideo && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-10"
                    >
                      <div className="relative">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
                        <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse" />
                      </div>
                      <p className="text-xl font-black tracking-tighter uppercase italic">Rendering Magic</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-2">Scene {currentSceneIndex !== null ? currentSceneIndex + 1 : ''} in progress</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {script && currentSceneIndex !== null && (
                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md uppercase tracking-wider">Now Playing</span>
                    <h3 className="font-bold text-lg">{script.scenes[currentSceneIndex].title}</h3>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed italic mb-4">"{script.scenes[currentSceneIndex].description}"</p>
                  {script.scenes[currentSceneIndex].audioScript && (
                    <div className="pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Wand2 className="w-3 h-3 text-blue-500" />
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Audio Script</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed font-medium">
                        {script.scenes[currentSceneIndex].audioScript}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timeline Section */}
            <div className={cn(
              "space-y-6",
              activeTab === 'preview' && "hidden md:block"
            )}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    {script ? script.title : 'Timeline'}
                    {script && <span className="text-xs font-medium text-white/20 bg-white/5 px-2 py-1 rounded-full">{script.scenes.length} Scenes</span>}
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  {script && (
                    <button
                      onClick={generateAllScenes}
                      disabled={isGeneratingAll || isProcessingVideo || !isApiKeySelected}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                    >
                      {isGeneratingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                      {isGeneratingAll ? 'Processing...' : 'Produce All'}
                    </button>
                  )}
                  <button
                    onClick={addManualScene}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                    title="Add Scene"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-20 md:pb-0">
                <AnimatePresence mode="popLayout">
                  {script?.scenes.map((scene, index) => (
                    <motion.div
                      key={scene.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "p-5 rounded-[2rem] border transition-all group relative overflow-hidden",
                        currentSceneIndex === index 
                          ? "bg-white/[0.08] border-white/20 ring-1 ring-white/20 shadow-2xl" 
                          : "bg-white/[0.03] border-white/5 hover:bg-white/[0.05]"
                      )}
                    >
                      {editingSceneId === scene.id ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-black text-[10px] text-blue-500 uppercase tracking-[0.2em]">Edit Scene {index + 1}</h3>
                            <button onClick={() => setEditingSceneId(null)} className="p-1.5 hover:bg-white/10 rounded-xl">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <input 
                              value={scene.title}
                              onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500/50"
                              placeholder="Scene Title"
                            />
                            <textarea 
                              value={scene.description}
                              onChange={(e) => updateScene(scene.id, { description: e.target.value })}
                              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm h-20 resize-none focus:outline-none focus:border-blue-500/50"
                              placeholder="What happens in this scene?"
                            />
                            <textarea 
                              value={scene.visualPrompt}
                              onChange={(e) => updateScene(scene.id, { visualPrompt: e.target.value })}
                              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm h-24 resize-none focus:outline-none focus:border-blue-500/50"
                              placeholder="Visual details for the AI..."
                            />
                            <textarea 
                              value={scene.audioScript}
                              onChange={(e) => updateScene(scene.id, { audioScript: e.target.value })}
                              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm h-20 resize-none focus:outline-none focus:border-blue-500/50"
                              placeholder="Dialogue or Narration (Audio Text)"
                            />
                          </div>
                          <button 
                            onClick={() => setEditingSceneId(null)}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                          >
                            Save Scene
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-5">
                          {/* Scene Number & Status */}
                          <div className="flex flex-col items-center gap-2 shrink-0">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner",
                              scene.status === 'completed' ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-white/20"
                            )}>
                              {index + 1}
                            </div>
                            {scene.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-base truncate">{scene.title}</h3>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingSceneId(scene.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-white"><Settings className="w-3.5 h-3.5" /></button>
                                <button onClick={() => deleteScene(scene.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                            <p className="text-xs text-white/40 line-clamp-1 group-hover:line-clamp-none transition-all">{scene.description}</p>
                            {scene.audioScript && (
                              <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-blue-400/60 font-bold uppercase tracking-wider">
                                <Wand2 className="w-2.5 h-2.5" />
                                <span>Audio Script Ready</span>
                              </div>
                            )}
                          </div>

                          {/* Action */}
                          <div className="shrink-0">
                            {scene.status === 'completed' ? (
                              <button 
                                onClick={() => { setCurrentSceneIndex(index); setActiveTab('preview'); }}
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all"
                              >
                                <Play className="w-4 h-4 fill-current" />
                              </button>
                            ) : scene.status === 'generating' ? (
                              <div className="w-10 h-10 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                              </div>
                            ) : (
                              <button 
                                onClick={() => generateVideoForScene(index)}
                                disabled={isProcessingVideo || !isApiKeySelected}
                                className="px-4 py-2 bg-white text-black hover:bg-white/90 disabled:opacity-30 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                              >
                                Produce
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {!script && !isGeneratingScript && (
                  <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] text-white/10 bg-white/[0.01]">
                    <Clapperboard className="w-12 h-12 mb-4 opacity-10" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">Timeline Empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center justify-between md:hidden z-[60] shadow-2xl ring-1 ring-white/5">
        {(['script', 'timeline', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3 rounded-full flex flex-col items-center gap-1 transition-all",
              activeTab === tab ? "bg-white text-black shadow-lg" : "text-white/40"
            )}
          >
            {tab === 'script' && <Wand2 className="w-4 h-4" />}
            {tab === 'timeline' && <Clock className="w-4 h-4" />}
            {tab === 'preview' && <Play className="w-4 h-4" />}
            <span className="text-[8px] font-black uppercase tracking-tighter">{tab}</span>
          </button>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}} />
    </div>
  );
}
