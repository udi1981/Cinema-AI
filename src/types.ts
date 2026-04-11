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
