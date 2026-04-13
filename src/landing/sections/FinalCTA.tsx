import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

type FinalCTAProps = {
  T: (key: string) => string;
};

const ctaKeyframes = `
@keyframes cta-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.15); }
  50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.5), 0 0 80px rgba(16, 185, 129, 0.25); }
}
@keyframes float-up-1 {
  0% { transform: translateY(100%) rotate(3deg); opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% { transform: translateY(-100vh) rotate(-3deg); opacity: 0; }
}
@keyframes float-up-2 {
  0% { transform: translateY(100%) rotate(-5deg); opacity: 0; }
  10% { opacity: 0.3; }
  90% { opacity: 0.3; }
  100% { transform: translateY(-100vh) rotate(5deg); opacity: 0; }
}
@keyframes float-up-3 {
  0% { transform: translateY(100%) rotate(2deg); opacity: 0; }
  10% { opacity: 0.35; }
  90% { opacity: 0.35; }
  100% { transform: translateY(-100vh) rotate(-4deg); opacity: 0; }
}
`;

const FLOATING_FRAMES = [
  { src: '/landing/showcase-pirate.webp', alt: 'Pirate adventure', className: 'start-[8%] w-20 h-14', animation: 'float-up-1 18s linear infinite' },
  { src: '/landing/style-anime.webp', alt: 'Anime scene', className: 'start-[25%] w-18 h-12', animation: 'float-up-2 22s linear infinite 4s' },
  { src: '/landing/showcase-space.webp', alt: 'Space explorer', className: 'end-[22%] w-20 h-14', animation: 'float-up-3 20s linear infinite 8s' },
  { src: '/landing/style-lego.webp', alt: 'LEGO battle', className: 'end-[8%] w-18 h-12', animation: 'float-up-1 24s linear infinite 12s' },
  { src: '/landing/showcase-underwater.webp', alt: 'Underwater kingdom', className: 'start-[45%] w-16 h-11', animation: 'float-up-2 19s linear infinite 6s' },
  { src: '/landing/style-comic.webp', alt: 'Comic hero', className: 'start-[65%] w-16 h-11', animation: 'float-up-3 21s linear infinite 10s' },
  { src: '/landing/showcase-samurai.webp', alt: 'Samurai scene', className: 'start-[15%] w-14 h-10', animation: 'float-up-1 25s linear infinite 14s' },
];

const FinalCTA = ({ T }: FinalCTAProps) => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <style>{ctaKeyframes}</style>

      {/* Background hero image with low opacity */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/landing/hero-main.webp"
          alt=""
          className="w-full h-full object-cover opacity-[0.12]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#07070e]/60" />
      </div>

      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-transparent to-[#10B981]/10 pointer-events-none" />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#10B981]/5 blur-3xl" />
      </div>

      {/* Floating film frame thumbnails */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_FRAMES.map((frame) => (
          <div
            key={frame.src}
            className={`absolute bottom-0 ${frame.className} rounded-lg overflow-hidden border border-white/10`}
            style={{ animation: frame.animation }}
          >
            <img
              src={frame.src}
              alt={frame.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight whitespace-pre-line mb-6"
        >
          {T('cta.title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg md:text-xl text-[#9FB8D6] max-w-xl mx-auto mb-10"
        >
          {T('cta.sub')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#/auth"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#10B981] to-[#10B981] rounded-lg px-10 py-4 font-bold text-lg text-white transition-transform hover:scale-105"
            style={{ animation: 'cta-glow 3s ease-in-out infinite' }}
          >
            {T('hero.cta')}
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
