import { motion } from 'motion/react';
import { Languages, Mic, ArrowRightLeft } from 'lucide-react';
import { UI_LANGUAGES } from '../../i18n';

type GlobalReachProps = {
  T: (key: string) => string;
};

const globeKeyframes = `
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
@keyframes orbit-1 {
  0% { transform: rotate(0deg) translateX(160px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(160px) rotate(-360deg); }
}
@keyframes orbit-2 {
  0% { transform: rotate(90deg) translateX(180px) rotate(-90deg); }
  100% { transform: rotate(450deg) translateX(180px) rotate(-450deg); }
}
@keyframes orbit-3 {
  0% { transform: rotate(180deg) translateX(150px) rotate(-180deg); }
  100% { transform: rotate(540deg) translateX(150px) rotate(-540deg); }
}
@keyframes orbit-4 {
  0% { transform: rotate(270deg) translateX(170px) rotate(-270deg); }
  100% { transform: rotate(630deg) translateX(170px) rotate(-630deg); }
}
`;

const ORBIT_THUMBNAILS = [
  { src: '/landing/style-pixar.webp', alt: 'Pixar style', animation: 'orbit-1 25s linear infinite' },
  { src: '/landing/style-cyberpunk.webp', alt: 'Cyberpunk style', animation: 'orbit-2 30s linear infinite' },
  { src: '/landing/style-paper.webp', alt: 'Paper style', animation: 'orbit-3 28s linear infinite' },
  { src: '/landing/style-handdrawn.webp', alt: 'Hand-drawn style', animation: 'orbit-4 32s linear infinite' },
];

const FEATURES = [
  {
    icon: Languages,
    titleKey: 'global.uiLangs',
    descKey: null as null,
    color: '#10B981',
    showFlags: true,
  },
  {
    icon: Mic,
    titleKey: 'global.dubbing',
    descKey: 'global.dubbingDesc',
    color: '#10B981',
    showFlags: false,
  },
  {
    icon: ArrowRightLeft,
    titleKey: 'global.rtl',
    descKey: 'global.rtlDesc',
    color: '#FFB800',
    showFlags: false,
  },
];

const GlobalReach = ({ T }: GlobalReachProps) => {
  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <style>{globeKeyframes}</style>
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
            {T('global.title')}
          </h2>
          <p className="text-[#9FB8D6] text-lg max-w-2xl mx-auto">
            {T('global.sub')}
          </p>
        </motion.div>

        {/* CSS Globe — larger with orbiting thumbnails */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-16 md:mb-20"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Concentric circles */}
            {[1, 2, 3, 4].map((ring) => (
              <div
                key={ring}
                className="absolute inset-0 rounded-full border border-white/5"
                style={{
                  inset: `${ring * 18}px`,
                  animation: ring % 2 === 0
                    ? `spin-slow ${20 + ring * 5}s linear infinite`
                    : `spin-reverse ${18 + ring * 4}s linear infinite`,
                }}
              >
                {/* Dots on each ring */}
                {[0, 90, 180, 270].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#10B981]/40"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${deg}deg) translateX(${(56 - ring * 18) > 0 ? 56 - ring * 18 : 20}px) translate(-50%, -50%)`,
                    }}
                  />
                ))}
              </div>
            ))}

            {/* Center glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/20 flex items-center justify-center border border-white/10">
                <Languages className="w-8 h-8 md:w-10 md:h-10 text-[#10B981]" />
              </div>
            </div>

            {/* Orbiting thumbnails — visible on md+ */}
            <div className="hidden md:block">
              {ORBIT_THUMBNAILS.map((thumb) => (
                <div
                  key={thumb.src}
                  className="absolute top-1/2 left-1/2 -mt-6 -ml-6 w-12 h-12"
                  style={{ animation: thumb.animation }}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shadow-lg shadow-black/40">
                    <img
                      src={thumb.src}
                      alt={thumb.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 hover:border-white/10 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>

                <h3 className="text-lg font-bold mb-3">{T(feature.titleKey)}</h3>

                {feature.showFlags ? (
                  <div className="flex flex-wrap gap-2">
                    {UI_LANGUAGES.map((l) => (
                      <span
                        key={l.code}
                        className="inline-flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1 text-xs text-white/60"
                        title={l.label}
                      >
                        <span className="text-sm">{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/50 leading-relaxed">
                    {feature.descKey ? T(feature.descKey) : ''}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GlobalReach;
