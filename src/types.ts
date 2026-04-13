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
  continueFromPrev: boolean; // If true, next scene starts from this scene's last frame
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

export type WizardStep = 'projects' | 'story' | 'style' | 'language' | 'timeline' | 'preview' | 'pricing';

export type UILanguage = 'en' | 'he' | 'ar' | 'fr' | 'zh' | 'pt' | 'es' | 'de' | 'it' | 'ru' | 'ko' | 'ja';

export type PlanTier = 'free' | 'basic' | 'pro' | 'studio' | 'unlimited';

export type UserProfile = {
  name: string;
  email: string;
  plan: PlanTier;
  credits: number; // films remaining this month
  scenesUsed: number; // scenes produced (free tier limit)
  avatarUrl?: string;
  createdAt?: string;
};

export type DbProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  plan: PlanTier;
  credits: number;
  scenes_used: number;
  created_at: string;
  updated_at: string;
};

export type SavedApiKey = {
  id: string;
  provider: string;
  key_hash: string; // last 6 chars for display
  created_at: string;
};

export type Project = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  prompt: string;
  style: MovieStyle;
  movieLength: MovieLength;
  scriptModel: string;
  beCreative: boolean;
  isManualMode: boolean;
  selectedLanguages: AudioLanguage[];
  script: MovieScript | null;
  characterImageDescription: string;
};

export const PLAN_CONFIG: Record<PlanTier, { label: string; price: number; films: number; desc: string }> = {
  free: { label: 'Free', price: 0, films: 0, desc: '2 demo scenes only' },
  basic: { label: 'Basic', price: 5, films: 1, desc: '1 film / month' },
  pro: { label: 'Pro', price: 10, films: 3, desc: '3 films / month' },
  studio: { label: 'Studio', price: 20, films: 7, desc: '7 films / month' },
  unlimited: { label: 'Unlimited', price: 50, films: 20, desc: '20 films / month' },
};

export type ExportStatus = 'idle' | 'loading-ffmpeg' | 'processing' | 'done' | 'error';

export type MovieLength = 'short' | 'medium' | 'long';

// Google AI Studio / Vertex AI pricing (approximate USD)
// Veo 3: ~$0.35/second of video → 8s clip = ~$2.80
// TTS (Gemini Flash): ~$0.01/scene
// Translation (Gemini Flash): ~$0.005/scene
// Script gen (Gemini Pro, amortized): ~$0.01/scene
export const COST_PER_SCENE = {
  veo: 2.80,         // Veo 3.1 video generation ~$0.35/sec × 8s
  tts: 0.01,         // Gemini Flash TTS
  translation: 0.005, // Gemini Flash translation
  script: 0.01,       // Gemini Pro script gen (amortized per scene)
} as const;

export const SCENE_COST = COST_PER_SCENE.veo + COST_PER_SCENE.tts + COST_PER_SCENE.translation + COST_PER_SCENE.script; // ~$2.83 per scene

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
