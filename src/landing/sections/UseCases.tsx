import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Megaphone, Video, Clapperboard, Briefcase } from 'lucide-react';
import { useState } from 'react';

type UseCasesProps = {
  T: (key: string) => string;
};

const styleScrollKeyframes = `
@keyframes style-auto-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

const CASES = [
  { icon: BookOpen, titleKey: 'cases.authors', descKey: 'cases.authorsDesc', color: '#10B981', image: '/landing/showcase-children.webp' },
  { icon: GraduationCap, titleKey: 'cases.educators', descKey: 'cases.educatorsDesc', color: '#10B981', image: '/landing/usecase-education.webp' },
  { icon: Megaphone, titleKey: 'cases.marketing', descKey: 'cases.marketingDesc', color: '#FFB800', image: '/landing/usecase-marketing.webp' },
  { icon: Video, titleKey: 'cases.creators', descKey: 'cases.creatorsDesc', color: '#FF6B6B', image: '/landing/showcase-documentary.webp' },
  { icon: Clapperboard, titleKey: 'cases.studios', descKey: 'cases.studiosDesc', color: '#00D9A3', image: '/landing/style-realistic.webp' },
  { icon: Briefcase, titleKey: 'cases.business', descKey: 'cases.businessDesc', color: '#FF8C42', image: '/landing/style-cyberpunk.webp' },
];

const STYLES = [
  { name: 'Pixar', image: '/landing/style-pixar.webp', color: '#FF6B6B' },
  { name: 'Realistic', image: '/landing/style-realistic.webp', color: '#10B981' },
  { name: 'Paper Folding', image: '/landing/style-paper.webp', color: '#FFB800' },
  { name: 'Cyberpunk', image: '/landing/style-cyberpunk.webp', color: '#00D9FF' },
  { name: 'Hand-drawn', image: '/landing/style-handdrawn.webp', color: '#10B981' },
  { name: 'Comic Book', image: '/landing/style-comic.webp', color: '#FF4444' },
  { name: 'Anime', image: '/landing/style-anime.webp', color: '#FF69B4' },
  { name: 'Toys & Figures', image: '/landing/style-toys.webp', color: '#00D9A3' },
  { name: 'Pixel Art', image: '/landing/style-pixel.webp', color: '#A855F7' },
  { name: 'LEGO', image: '/landing/style-lego.webp', color: '#FFB800' },
  { name: 'Claymation', image: '/landing/style-clay.webp', color: '#FF8C42' },
];

const UseCases = ({ T }: UseCasesProps) => {
  const [hoveredStyle, setHoveredStyle] = useState<number | null>(null);

  return (
    <section id="cases" className="py-24 md:py-32">
      <style>{styleScrollKeyframes}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight whitespace-pre-line mb-4">
            {T('cases.title')}
          </h2>
          <p className="text-[#9FB8D6] text-lg max-w-2xl mx-auto">
            {T('cases.sub')}
          </p>
        </motion.div>

        {/* Use case cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {CASES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all group"
              >
                {/* Card image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={T(item.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-[#0A0E27]/40 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 20px ${item.color}20, 0 0 20px ${item.color}15`,
                    }}
                  />
                </div>

                {/* Card content */}
                <div className="p-7 -mt-4 relative">
                  <div className="relative w-12 h-12 mb-5">
                    <div
                      className="absolute inset-0 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"
                      style={{ backgroundColor: item.color }}
                    />
                    <div
                      className="relative w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{T(item.titleKey)}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{T(item.descKey)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ===== 11 Cinematic Styles — IMMERSIVE SHOWCASE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-3">
              {T('styles.title')}
            </h3>
            <p className="text-[#9FB8D6] text-base max-w-xl mx-auto">
              {T('styles.sub')}
            </p>
          </div>

          {/* Featured style — large preview */}
          <div className="mb-8">
            <motion.div
              className="relative rounded-2xl overflow-hidden aspect-[21/9] max-h-[400px] cursor-pointer group"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: hoveredStyle !== null
                  ? `0 0 40px ${STYLES[hoveredStyle].color}30, 0 0 80px ${STYLES[hoveredStyle].color}10`
                  : '0 0 40px rgba(16,185,129,0.15)',
              }}
            >
              <img
                src={hoveredStyle !== null ? STYLES[hoveredStyle].image : STYLES[0].image}
                alt={hoveredStyle !== null ? STYLES[hoveredStyle].name : STYLES[0].name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 start-6 end-6">
                <span
                  className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg transition-all"
                >
                  {hoveredStyle !== null ? STYLES[hoveredStyle].name : STYLES[0].name}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Style thumbnails grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
            {STYLES.map((style, index) => (
              <motion.div
                key={style.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer group transition-all duration-300 ${
                  hoveredStyle === index ? 'ring-2 ring-offset-2 ring-offset-[#07070e] scale-105' : 'hover:scale-105'
                }`}
                style={{
                  boxShadow: hoveredStyle === index ? `0 0 20px ${style.color}40` : '0 2px 10px rgba(0,0,0,0.3)',
                  outline: hoveredStyle === index ? `2px solid ${style.color}` : 'none',
                  outlineOffset: '2px',
                }}
                onMouseEnter={() => setHoveredStyle(index)}
                onMouseLeave={() => setHoveredStyle(null)}
              >
                <img
                  src={style.image}
                  alt={`${style.name} style`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-6 pb-2 px-2">
                  <span className="font-bold text-[10px] md:text-xs text-white drop-shadow-lg leading-tight block text-center">
                    {style.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: scrolling strip fallback */}
          <div className="md:hidden mt-6 relative overflow-hidden" style={{ direction: 'ltr' }}>
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#07070e] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#07070e] to-transparent z-10" />
            <div
              className="flex gap-4"
              style={{
                animation: 'style-auto-scroll 30s linear infinite',
                width: 'max-content',
              }}
            >
              {[...STYLES, ...STYLES].map((style, index) => (
                <div
                  key={`${style.name}-${index}`}
                  className="relative rounded-2xl overflow-hidden w-52 aspect-[4/3] flex-shrink-0"
                >
                  <img
                    src={style.image}
                    alt={`${style.name} style`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-3 px-3">
                    <span className="font-bold text-sm text-white drop-shadow-lg">
                      {style.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UseCases;
