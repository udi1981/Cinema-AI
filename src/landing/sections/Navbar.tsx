import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Globe, Menu, X, User, LogOut, CreditCard, Settings, Compass } from 'lucide-react';
import { UI_LANGUAGES } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
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
  { key: 'nav.discover', href: '#/discover', isRoute: true },
];

const Navbar = ({ lang, setLang, T }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setLangOpen(false);
      setUserMenuOpen(false);
    };
    if (langOpen || userMenuOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [langOpen, userMenuOpen]);

  const handleNavClick = (href: string, isRoute?: boolean) => {
    setMobileOpen(false);
    if (isRoute) {
      window.location.hash = href;
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    window.location.hash = '#/';
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
                onClick={() => handleNavClick(link.href, link.isRoute)}
                className="text-sm text-white/60 hover:text-white transition-colors font-medium"
              >
                {T(link.key)}
              </button>
            ))}
          </div>

          {/* Right: Language + Auth + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Language dropdown */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); setUserMenuOpen(false); }}
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
                    onClick={(e) => e.stopPropagation()}
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

            {isAuthenticated ? (
              <>
                {/* User avatar dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); setLangOpen(false); }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center overflow-hidden">
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <span className="hidden sm:inline text-sm text-white/70 font-medium max-w-[100px] truncate">
                      {profile.name || 'Account'}
                    </span>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute end-0 top-full mt-2 w-56 bg-[#12122a] border border-white/10 rounded-xl shadow-2xl shadow-black/40 py-2 z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* User info */}
                        <div className="px-4 py-2.5 border-b border-white/5">
                          <p className="text-sm font-medium text-white truncate">{profile.name || 'User'}</p>
                          <p className="text-[11px] text-white/40 truncate">{profile.email}</p>
                        </div>
                        <a href="#/studio" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                          <Film className="w-4 h-4" /> Studio
                        </a>
                        <a href="#/discover" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                          <Compass className="w-4 h-4" /> Discover
                        </a>
                        <a href="#/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                          <Settings className="w-4 h-4" /> Profile & Settings
                        </a>
                        <a href="#/billing" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                          <CreditCard className="w-4 h-4" /> Billing & Plans
                        </a>
                        <div className="border-t border-white/5 mt-1 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Go to Studio CTA */}
                <a
                  href="#/studio"
                  className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#10B981] to-[#10B981] hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow"
                >
                  Studio
                </a>
              </>
            ) : (
              <>
                {/* Sign In */}
                <a
                  href="#/auth"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  Sign In
                </a>

                {/* CTA */}
                <a
                  href="#/auth"
                  className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#10B981] to-[#10B981] hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow"
                >
                  {T('nav.tryFree')}
                </a>
              </>
            )}

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
                    onClick={() => handleNavClick(link.href, link.isRoute)}
                    className="text-start text-base text-white/70 hover:text-white transition-colors py-2"
                  >
                    {T(link.key)}
                  </button>
                ))}

                {isAuthenticated ? (
                  <>
                    <div className="border-t border-white/10 mt-2 pt-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center overflow-hidden">
                        {profile.avatarUrl ? (
                          <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{profile.name || 'User'}</p>
                        <p className="text-[10px] text-white/40 truncate">{profile.email}</p>
                      </div>
                    </div>
                    <a href="#/studio" className="text-start text-base text-white/70 hover:text-white transition-colors py-2">
                      Studio
                    </a>
                    <a href="#/discover" className="text-start text-base text-white/70 hover:text-white transition-colors py-2">
                      Discover
                    </a>
                    <a href="#/profile" className="text-start text-base text-white/70 hover:text-white transition-colors py-2">
                      Profile & Settings
                    </a>
                    <a href="#/billing" className="text-start text-base text-white/70 hover:text-white transition-colors py-2">
                      Billing & Plans
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="text-start text-base text-red-400/70 hover:text-red-400 transition-colors py-2"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="#/auth"
                      className="mt-2 text-start text-base text-white/70 hover:text-white transition-colors py-2"
                    >
                      Sign In
                    </a>
                    <a
                      href="#/auth"
                      className="mt-4 text-center px-5 py-3 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#10B981] to-[#10B981]"
                    >
                      {T('nav.tryFree')}
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
