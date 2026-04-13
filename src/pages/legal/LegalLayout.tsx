import { ArrowLeft, Film } from 'lucide-react';

const LegalLayout = ({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#07070e] text-white">
    {/* Top bar */}
    <div className="border-b border-white/10 bg-[#0a0e17] sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Home
        </a>
        <a href="#/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">Cinema AI</span>
        </a>
      </div>
    </div>

    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-xs text-white/40 mb-8">Last updated: {updated}</p>
      <div className="prose prose-invert prose-sm max-w-none
        [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3
        [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white/90 [&_h3]:mt-6 [&_h3]:mb-2
        [&_p]:text-white/60 [&_p]:leading-relaxed [&_p]:mb-3
        [&_ul]:text-white/60 [&_ul]:space-y-1 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5
        [&_ol]:text-white/60 [&_ol]:space-y-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5
        [&_li]:leading-relaxed
        [&_a]:text-emerald-400 [&_a]:underline [&_a]:hover:text-emerald-300
        [&_strong]:text-white/80
      ">
        {children}
      </div>

      {/* Footer links */}
      <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-xs text-white/30">
        <a href="#/terms" className="hover:text-white/60 transition-colors">Terms of Service</a>
        <a href="#/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</a>
        <a href="#/acceptable-use" className="hover:text-white/60 transition-colors">Acceptable Use</a>
        <a href="#/help" className="hover:text-white/60 transition-colors">Help & Support</a>
      </div>
    </div>
  </div>
);

export default LegalLayout;
