export interface ReferenceImage {
  id: string;
  data: string; // base64
  mimeType: string;
  previewUrl: string;
}

export interface SceneMedia {
  videoUrl?: string;
  audioUrl?: string;
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  visualPrompt: string;
  durationSeconds: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  approved: boolean; // User approved this scene's last frame for continuity
  videoUrl?: string;
  videoObject?: any; // The Veo video object for extension
  audioUrl?: string;
  audioScript: string; // The exact text to be spoken (dialogue/narration)
  // Multi-language media: { en: { videoUrl, audioUrl }, zh: { videoUrl, audioUrl } }
  langMedia?: Record<string, SceneMedia>;
}

export interface MovieScript {
  title: string;
  genre: string;
  style: string;
  characterDescriptions: string;
  scenes: Scene[];
}

export type MovieStyle = 'Pixar' | 'Realistic' | 'Paper Folding' | 'Cyberpunk' | 'Hand-drawn';

export type AudioLanguage = 'he' | 'en' | 'zh';

export type WizardStep = 'story' | 'style' | 'language' | 'timeline' | 'preview';

export type ExportStatus = 'idle' | 'loading-ffmpeg' | 'processing' | 'done' | 'error';

export type MovieLength = 'short' | 'medium' | 'long';

// Google AI Studio pricing (approximate USD)
export const COST_PER_SCENE = {
  veo: 0.10,        // Veo 3.1 video generation ~$0.10/scene (8s clip, free tier estimate)
  tts: 0.002,       // Gemini Flash TTS ~$0.002/scene
  translation: 0.001, // Gemini Flash translation ~$0.001/scene
  script: 0.005,     // Gemini Pro script gen (amortized per scene)
} as const;

export const SCENE_COST = COST_PER_SCENE.veo + COST_PER_SCENE.tts + COST_PER_SCENE.translation + COST_PER_SCENE.script; // ~$0.108 per scene

// Calculate scene estimates based on word count
// Hebrew: ~3 words per second of narration, 8s per scene = ~24 words per scene of narration
// But scenes also have visual-only moments, so roughly 1 scene per 30-50 words of source text
export const estimateScenes = (wordCount: number): { short: number; medium: number; long: number } => {
  if (wordCount === 0) return { short: 0, medium: 0, long: 0 };
  // Base: ~1 scene per 40 words for medium density
  const base = Math.max(5, Math.round(wordCount / 40));
  return {
    short: Math.max(5, Math.round(base * 0.5)),
    medium: base,
    long: Math.min(60, Math.round(base * 1.5)),
  };
};
