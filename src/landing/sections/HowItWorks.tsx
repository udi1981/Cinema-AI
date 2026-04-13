import { motion } from 'motion/react';
import { PenTool, Palette, Wand2, Play } from 'lucide-react';

type HowItWorksProps = {
  T: (key: string) => string;
};

const STYLE_THUMBNAILS = [
  { src: '/landing/style-pixar.webp', alt: 'Pixar style' },
  { src: '/landing/style-realistic.webp', alt: 'Realistic style' },
  { src: '/landing/style-anime.webp', alt: 'Anime style' },
  { src: '/landing/style-comic.webp', alt: 'Comic Book style' },
  { src: '/landing/style-lego.webp', alt: 'LEGO style' },
  { src: '/landing/style-cyberpunk.webp', alt: 'Cyberpunk style' },
  { src: '/landing/style-clay.webp', alt: 'Claymation style' },
  { src: '/landing/style-paper.webp', alt: 'Paper folding style' },
  { src: '/landing/style-handdrawn.webp', alt: 'Hand-drawn style' },
  { src: '/landing/style-pixel.webp', alt: 'Pixel Art style' },
  { src: '/landing/style-toys.webp', alt: 'Toys style' },
];

const STEPS = [
  { icon: PenTool, titleKey: 'how.step1.title', descKey: 'how.step1.desc', image: null },
  { icon: Palette, titleKey: 'how.step2.title', descKey: 'how.step2.desc', image: 'styles' as const },
  { icon: Wand2, titleKey: 'how.step3.title', descKey: 'how.step3.desc', image: '/landing/usecase-education.webp' },
  { icon: Play, titleKey: 'how.step4.title', descKey: 'how.step4.desc', image: '/landing/showcase-children.webp' },
];

const HowItWorks = ({ T }: HowItWorksProps) => {
  return (
    <section id="how" className="relative py-24 md:py-32 overflow-hidden">
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
            {T('how.title')}
          </h2>
          <p className="text-[#9FB8D6] text-lg max-w-2xl mx-auto">
            {T('how.sub')}
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#10B981]/20 via-[#10B981]/30 to-[#10B981]/20 -translate-y-1/2 z-0" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative z-10"
              >
                <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 hover:border-[#10B981]/30 transition-colors group h-full flex flex-col">
                  {/* Step number */}
                  <span className="text-7xl font-black text-white/5 absolute top-4 end-4 leading-none select-none">
                    {index + 1}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-5 group-hover:bg-[#10B981]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#10B981]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2">{T(step.titleKey)}</h3>

                  {/* Description */}
                  <p className="text-sm text-white/50 leading-relaxed mb-4">{T(step.descKey)}</p>

                  {/* Preview image area */}
                  {step.image === 'styles' && (
                    <div className="mt-auto flex gap-1 overflow-hidden rounded-lg">
                      {STYLE_THUMBNAILS.map((thumb) => (
                        <div key={thumb.src} className="flex-1 h-12 min-w-0">
                          <img
                            src={thumb.src}
                            alt={thumb.alt}
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {step.image !== null && step.image !== 'styles' && (
                    <div className="mt-auto rounded-lg overflow-hidden border border-white/[0.06]">
                      <img
                        src={step.image}
                        alt={T(step.titleKey)}
                        className="w-full h-28 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Showcase: Before & After */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-20 md:mt-28"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {T('how.showcase.title')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Left: Text input */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs text-white/30 ms-2 font-mono">script.txt</span>
              </div>
              <p className="text-white/70 italic leading-relaxed text-lg font-serif">
                {T('how.showcase.text')}
              </p>
              <div className="mt-6 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-[#10B981]/30 to-transparent" />
                <span className="text-xs text-[#10B981]/60 uppercase tracking-wider font-medium">Input</span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#10B981]/30 to-transparent" />
              </div>
            </div>

            {/* Right: Generated scene */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden relative group">
              <img
                src="/landing/showcase-dino-hatch.webp"
                alt="Hyper-realistic baby dinosaur hatching from egg"
                className="w-full h-full object-cover min-h-[280px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 inset-x-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-[#10B981]/30 to-transparent" />
                <span className="text-xs text-[#10B981]/80 uppercase tracking-wider font-medium">Output</span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#10B981]/30 to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
