import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import LegalLayout from './LegalLayout';

const faqs: { q: string; a: string }[] = [
  {
    q: 'What is Cinema AI Studio?',
    a: 'Cinema AI Studio is an AI-powered video creation platform that lets you generate cinematic movies from text prompts. It uses Google\'s Veo 3.1 for video generation, Gemini for script writing, and advanced TTS for narration.',
  },
  {
    q: 'Do I need a Google API key?',
    a: 'Yes. Cinema AI Studio runs entirely in your browser and connects directly to Google\'s AI APIs. You need a Google Gemini API key, which you can get for free from Google AI Studio (aistudio.google.com/apikey). Your key is stored locally on your device and never sent to our servers.',
  },
  {
    q: 'How much does it cost to generate a video?',
    a: 'Cinema AI Studio platform access is based on your subscription plan. The AI generation costs (Veo, Gemini, TTS) are billed by Google based on your API usage. Approximately $2.80 per 8-second scene for video generation, plus small costs for script and audio.',
  },
  {
    q: 'What video formats are supported?',
    a: 'Videos are exported as MP4 files using FFmpeg running in your browser. You can include narration audio, background music, and subtitles in the final export.',
  },
  {
    q: 'Can I use generated videos commercially?',
    a: 'Generated content is subject to Google\'s AI terms of service. Generally, content generated with your own API key can be used commercially, but we recommend reviewing Google\'s usage policies for the latest terms.',
  },
  {
    q: 'What languages are supported?',
    a: 'Cinema AI Studio supports script generation and narration in English, Hebrew, and Chinese. The user interface is available in 12 languages including English, Hebrew, Arabic, French, Spanish, and more.',
  },
  {
    q: 'How do I ensure character consistency across scenes?',
    a: 'Use the character description field to provide detailed descriptions of your characters. The system includes these descriptions in every scene prompt (charLock). You can also use the "Continue from this frame" feature to maintain visual continuity between scenes.',
  },
  {
    q: 'My video generation failed. What should I do?',
    a: 'Check that your API key is valid and has available quota. Veo 3.1 occasionally fails due to content safety filters or server load. Try regenerating the scene. If the issue persists, check your Google Cloud console for quota or billing issues.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Go to your Profile page and scroll to the Danger Zone section. Click "Delete Account" to permanently remove your account and all associated data. This action cannot be undone.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Most of your data (videos, scripts, API keys) is stored locally on your device. Account data is stored securely with Supabase using encryption and Row Level Security. AI generation requests go directly from your browser to Google — they never pass through our servers.',
  },
];

const FAQ = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors">
        <span className="text-sm font-medium text-white/80">{q}</span>
        <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 ml-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-white/50 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

const HelpPage = () => (
  <LegalLayout title="Help & Support" updated="April 13, 2026">
    <h2>Frequently Asked Questions</h2>
    <div className="space-y-2 not-prose">
      {faqs.map(faq => <FAQ key={faq.q} q={faq.q} a={faq.a} />)}
    </div>

    <h2>Getting Started</h2>
    <ol>
      <li>Create an account or sign in with Google</li>
      <li>Add your Google Gemini API key in Profile &gt; API Keys</li>
      <li>Write a story prompt or choose a template from the showcase</li>
      <li>Select a visual style and language</li>
      <li>Generate your movie scene by scene</li>
      <li>Preview, edit, and export your final video</li>
    </ol>

    <h2>Contact Support</h2>
    <p>
      For technical issues, billing questions, or feature requests, please email us at{' '}
      <a href="mailto:support@cinema-ai.studio">support@cinema-ai.studio</a>.
    </p>
    <p>
      For abuse reports, contact{' '}
      <a href="mailto:abuse@cinema-ai.studio">abuse@cinema-ai.studio</a>.
    </p>
    <p>
      For legal inquiries, contact{' '}
      <a href="mailto:legal@cinema-ai.studio">legal@cinema-ai.studio</a>.
    </p>

    <h2>System Requirements</h2>
    <ul>
      <li>Modern browser (Chrome, Firefox, Safari, Edge — latest version recommended)</li>
      <li>JavaScript enabled</li>
      <li>Stable internet connection for AI API calls</li>
      <li>Google Gemini API key with Veo access</li>
    </ul>
  </LegalLayout>
);

export default HelpPage;
