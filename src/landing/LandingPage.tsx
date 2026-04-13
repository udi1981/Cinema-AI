import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import type { UILanguage } from '../types';
import { tLanding } from './landingI18n';
import { UI_LANGUAGES } from '../i18n';
import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import HowItWorks from './sections/HowItWorks';
import UseCases from './sections/UseCases';
import IdeaShowcase from './sections/IdeaShowcase';
import GlobalReach from './sections/GlobalReach';
import PricingSection from './sections/PricingSection';
import FinalCTA from './sections/FinalCTA';
import Footer from './sections/Footer';

const galleryKeyframes = `
@keyframes gallery-scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes gallery-scroll-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
`;

const GALLERY_ROW_1 = [
  { src: '/landing/idea-children-pixar.webp', alt: 'Pixar children treehouse' },
  { src: '/landing/style-anime.webp', alt: 'Anime warrior scene' },
  { src: '/landing/idea-docu-dinosaurs.webp', alt: 'Realistic dinosaurs' },
  { src: '/landing/style-cyberpunk.webp', alt: 'Cyberpunk neon alley' },
  { src: '/landing/idea-ted-lecture.webp', alt: 'TED style lecture' },
  { src: '/landing/style-lego.webp', alt: 'LEGO space battle' },
  { src: '/landing/idea-travel.webp', alt: 'Epic travel adventure' },
  { src: '/landing/showcase-pirate.webp', alt: 'Pirate girl on flying ship' },
];

const GALLERY_ROW_2 = [
  { src: '/landing/idea-advertising.webp', alt: 'Luxury commercial' },
  { src: '/landing/style-comic.webp', alt: 'Comic book superhero' },
  { src: '/landing/idea-music.webp', alt: 'Concert spectacular' },
  { src: '/landing/style-realistic.webp', alt: 'Explorer at temple ruins' },
  { src: '/landing/idea-edu-science.webp', alt: 'Science classroom' },
  { src: '/landing/showcase-underwater.webp', alt: 'Underwater kingdom' },
  { src: '/landing/idea-cooking.webp', alt: 'Cooking show' },
  { src: '/landing/style-clay.webp', alt: 'Claymation fox family' },
];

const GALLERY_ROW_3 = [
  { src: '/landing/idea-business.webp', alt: 'Corporate presentation' },
  { src: '/landing/style-pixel.webp', alt: 'Pixel art kingdom' },
  { src: '/landing/idea-agency.webp', alt: 'Creative agency' },
  { src: '/landing/style-handdrawn.webp', alt: 'Ghibli watercolor castle' },
  { src: '/landing/idea-creator.webp', alt: 'YouTube creator studio' },
  { src: '/landing/showcase-samurai.webp', alt: 'Samurai cherry blossoms' },
  { src: '/landing/idea-edu-math.webp', alt: 'Math education' },
  { src: '/landing/style-toys.webp', alt: 'Vinyl toy figures' },
];

/** Gallery card with hover-to-video animation */
const GalleryCard = ({ src, alt, glowColor, keyPrefix, index }: { src: string; alt: string; glowColor: string; keyPrefix: string; index: number }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoExists, setVideoExists] = useState(true);
  // Derive video path: /landing/foo.webp → /landing/foo.mp4
  const videoSrc = src.replace(/\.webp$/, '.mp4');

  return (
    <div
      key={`${keyPrefix}-${index}`}
      className="flex-shrink-0 w-72 md:w-96 h-48 md:h-64 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.03] relative"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${glowColor}, 0 0 60px ${glowColor.replace('0.3', '0.1')}`;
        if (videoExists) {
          setPlaying(true);
          setTimeout(() => { videoRef.current?.play().catch(() => setVideoExists(false)); }, 50);
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        setPlaying(false);
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      }}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${playing ? 'opacity-0' : 'opacity-100 group-hover:scale-110'}`}
        loading="lazy"
      />
      {playing && videoExists && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setVideoExists(false)}
        />
      )}
    </div>
  );
};

const ShowcaseGallery = ({ T }: { T: (key: string) => string }) => {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <style>{galleryKeyframes}</style>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16 px-4"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          {T('gallery.title')}
        </h2>
        <p className="text-[#9FB8D6] text-base max-w-xl mx-auto">
          {T('gallery.sub')}
        </p>
      </motion.div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-5 overflow-hidden" style={{ direction: 'ltr' }}>
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#07070e] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#07070e] to-transparent z-10" />
        <div className="flex gap-5" style={{ animation: 'gallery-scroll-left 50s linear infinite', width: 'max-content' }}>
          {[...GALLERY_ROW_1, ...GALLERY_ROW_1].map((img, i) => (
            <GalleryCard key={`r1-${i}`} src={img.src} alt={img.alt} glowColor="rgba(16,185,129,0.3)" keyPrefix="r1" index={i} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative mb-5 overflow-hidden" style={{ direction: 'ltr' }}>
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#07070e] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#07070e] to-transparent z-10" />
        <div className="flex gap-5" style={{ animation: 'gallery-scroll-right 55s linear infinite', width: 'max-content' }}>
          {[...GALLERY_ROW_2, ...GALLERY_ROW_2].map((img, i) => (
            <GalleryCard key={`r2-${i}`} src={img.src} alt={img.alt} glowColor="rgba(16,185,129,0.3)" keyPrefix="r2" index={i} />
          ))}
        </div>
      </div>

      {/* Row 3 — scrolls left (slower) */}
      <div className="relative overflow-hidden" style={{ direction: 'ltr' }}>
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#07070e] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#07070e] to-transparent z-10" />
        <div className="flex gap-5" style={{ animation: 'gallery-scroll-left 60s linear infinite', width: 'max-content' }}>
          {[...GALLERY_ROW_3, ...GALLERY_ROW_3].map((img, i) => (
            <GalleryCard key={`r3-${i}`} src={img.src} alt={img.alt} glowColor="rgba(255,184,0,0.3)" keyPrefix="r3" index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const [lang, setLangState] = useState<UILanguage>(() => {
    const saved = localStorage.getItem('cinema_ui_lang');
    if (saved && UI_LANGUAGES.some((l) => l.code === saved)) {
      return saved as UILanguage;
    }
    return 'en';
  });

  const setLang = useCallback((l: UILanguage) => {
    setLangState(l);
    localStorage.setItem('cinema_ui_lang', l);
  }, []);

  useEffect(() => {
    const langEntry = UI_LANGUAGES.find((l) => l.code === lang);
    document.documentElement.dir = langEntry?.dir ?? 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const T = useCallback(
    (key: string) => tLanding(key, lang),
    [lang],
  );

  return (
    <div className="min-h-screen bg-[#07070e] text-white" style={{ scrollBehavior: 'smooth' }}>
      <Navbar lang={lang} setLang={setLang} T={T} />
      <HeroSection T={T} />
      <HowItWorks T={T} />
      <UseCases T={T} />
      <IdeaShowcase T={T} />
      <ShowcaseGallery T={T} />
      <GlobalReach T={T} />
      <PricingSection T={T} />
      <FinalCTA T={T} />
      <Footer T={T} />
    </div>
  );
};

export default LandingPage;
