import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Globe, Menu, X } from 'lucide-react';
import { UI_LANGUAGES } from '../../i18n';
import type { UILanguage } from '../../types';

type NavbarProps = {
  lang: UILanguage;
  setLang: (l: UILanguage) => void;
  T: (key: string) => string;
};

const NAV_LINKS = [
  { key: 'nav.howItWorks', href: '#how' },
  { key: 'nav.useCases', href: '#cases' },
  { key: 'nav.pricing', href: '#pricing' },
];

const Navbar = ({ lang, setLang, T }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#07070e]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand */}
          <a href="#/" className="flex items-center gap-2.5 group">
            <Film className="w-6 h-6 text-[#10B981] group-hover:text-[#10B981] transition-colors" />
            <span className="text-lg font-bold tracking-tight">{T('nav.brand')}</span>
          </a>

          {/* Center: Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-white/60 hover:text-white transition-colors font-medium"
              >
                {T(link.key)}
              </button>
            ))}
          </div>

          {/* Right: Language + CTA + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Language dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {UI_LANGUAGES.find((l) => l.code === lang)?.flag}{' '}
                  {UI_LANGUAGES.find((l) => l.code === lang)?.label}
                </span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute end-0 top-full mt-2 w-52 bg-[#12122a] border border-white/10 rounded-xl shadow-2xl shadow-black/40 py-2 max-h-80 overflow-y-auto z-50"
                  >
                    {UI_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setLangOpen(false);
                        }}
                        className={`w-full text-start px-4 py-2 text-sm flex items-center gap-2.5 hover:bg-white/5 transition-colors ${
                          lang === l.code ? 'text-[#10B981] font-semibold' : 'text-white/70'
                        }`}
                      >
                        <span className="text-base">{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sign In */}
            <a
              href="#/auth"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              Sign In
            </a>

            {/* CTA */}
            <a
              href="#/studio"
              className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#10B981] to-[#10B981] hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow"
            >
              {T('nav.tryFree')}
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 end-0 bottom-0 w-72 bg-[#0c0c1d] border-s border-white/10 z-50 md:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <span className="font-bold text-lg">{T('nav.brand')}</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.key}
                    onClick={() => handleNavClick(link.href)}
                    className="text-start text-base text-white/70 hover:text-white transition-colors py-2"
                  >
                    {T(link.key)}
                  </button>
                ))}
                <a
                  href="#/auth"
                  className="mt-2 text-start text-base text-white/70 hover:text-white transition-colors py-2"
                >
                  Sign In
                </a>
                <a
                  href="#/studio"
                  className="mt-4 text-center px-5 py-3 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#10B981] to-[#10B981]"
                >
                  {T('nav.tryFree')}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
