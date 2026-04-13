import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useRef } from 'react';

type HeroSectionProps = {
  T: (key: string) => string;
};

const orbKeyframes = `
@keyframes float-orb-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
@keyframes float-orb-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.08); }
  66% { transform: translate(25px, -25px) scale(0.92); }
}
@keyframes float-orb-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, 35px) scale(0.96); }
  66% { transform: translate(-35px, -20px) scale(1.04); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.3; }
  100% { transform: scale(0.95); opacity: 0.5; }
}
@keyframes carousel-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

const CAROUSEL_IMAGES = [
  { src: '/landing/hero-main.webp', alt: 'Magical theater in space' },
  { src: '/landing/idea-children-pixar.webp', alt: 'Pixar children in treehouse' },
  { src: '/landing/showcase-pirate.webp', alt: 'Pirate adventure' },
  { src: '/landing/idea-docu-dinosaurs.webp', alt: 'Realistic dinosaurs' },
  { src: '/landing/hero-theater.webp', alt: 'Floating movie theater' },
  { src: '/landing/idea-travel.webp', alt: 'Epic travel adventure' },
  { src: '/landing/showcase-space.webp', alt: 'Space explorer' },
  { src: '/landing/idea-music.webp', alt: 'Concert spectacular' },
  { src: '/landing/hero-quill.webp', alt: 'Golden quill magic' },
  { src: '/landing/idea-cooking.webp', alt: 'Cooking show' },
  { src: '/landing/showcase-underwater.webp', alt: 'Underwater kingdom' },
  { src: '/landing/hero-camera.webp', alt: 'AI film camera' },
];

const HeroSection = ({ T }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const carouselY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const handleDemoClick = () => {
    const el = document.querySelector('#how');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <style>{orbKeyframes}</style>

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -start-20 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #10B981 0%, transparent 70%)',
            animation: 'float-orb-1 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-20 -end-20 w-[450px] h-[450px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #10B981 0%, transparent 70%)',
            animation: 'float-orb-2 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-10 end-1/4 w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #FFB800 0%, transparent 70%)',
            animation: 'float-orb-3 10s ease-in-out infinite',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6 pt-28 pb-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 px-5 py-2 text-xs tracking-wider text-[#10B981] font-semibold"
            style={{
              background: 'linear-gradient(90deg, rgba(16,185,129,0.1), rgba(16,185,129,0.1), rgba(16,185,129,0.1))',
              backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {T('hero.badge')}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight whitespace-pre-line leading-tight"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #10B981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {T('hero.title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-[#9FB8D6] max-w-2xl"
        >
          {T('hero.sub')}
        </motion.p>

        {/* CTA Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-2"
        >
          <a
            href="#/studio"
            className="relative inline-flex items-center gap-2.5 bg-gradient-to-r from-[#10B981] to-[#10B981] rounded-xl px-10 py-4 font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-105 text-white"
          >
            <span
              className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#10B981] to-[#10B981] opacity-30 blur-sm"
              style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
            />
            <span className="relative flex items-center gap-2.5">
              {T('hero.cta')}
              <ArrowRight className="w-5 h-5" />
            </span>
          </a>
          <button
            onClick={handleDemoClick}
            className="inline-flex items-center gap-2.5 border border-white/15 rounded-xl px-8 py-4 hover:bg-white/5 transition-colors text-white/80 hover:text-white font-medium"
          >
            <Play className="w-4 h-4" />
            {T('hero.demo')}
          </button>
        </motion.div>
      </div>

      {/* ===== LARGE HORIZONTAL CAROUSEL — Full-height images ===== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{ y: carouselY, direction: 'ltr' as const }}
        className="relative z-10 w-full overflow-hidden mt-6 mb-4"
      >
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-[#07070e] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-[#07070e] to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-5 items-stretch"
          style={{
            animation: 'carousel-scroll 60s linear infinite',
            width: 'max-content',
          }}
        >
          {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((img, i) => (
            <div
              key={`carousel-${i}`}
              className="flex-shrink-0 w-[420px] md:w-[560px] lg:w-[640px] rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02]"
              style={{
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                aspectRatio: '16/9',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '0 0 40px rgba(16,185,129,0.35), 0 0 80px rgba(16,185,129,0.15)';
                // Pause carousel on hover
                const parent = el.parentElement;
                if (parent) parent.style.animationPlayState = 'paused';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)';
                const parent = el.parentElement;
                if (parent) parent.style.animationPlayState = 'running';
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading={i < 4 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trusted by creators + stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="relative z-10 text-center py-8"
      >
        <p className="text-sm text-white/40 uppercase tracking-widest font-medium mb-2">
          {T('hero.trusted')}
        </p>
        <p className="text-sm md:text-base text-[#9FB8D6]/70">
          {T('hero.stats')}
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
