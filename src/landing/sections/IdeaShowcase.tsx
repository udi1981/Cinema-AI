import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, BookOpen, GraduationCap, Megaphone, Briefcase, Video, Clapperboard, Utensils, Plane, Music, Presentation } from 'lucide-react';

type IdeaShowcaseProps = {
  T: (key: string) => string;
};

const IDEAS = [
  {
    id: 'children',
    image: '/landing/idea-children-pixar.webp',
    video: '/landing/idea-children-pixar.mp4',
    titleKey: 'ideas.children',
    descKey: 'ideas.childrenDesc',
    icon: BookOpen,
    gradient: 'from-[#FF69B4] to-[#FFB800]',
    color: '#FF69B4',
  },
  {
    id: 'documentary',
    image: '/landing/idea-docu-dinosaurs.webp',
    video: '/landing/idea-docu-dinosaurs.mp4',
    titleKey: 'ideas.documentary',
    descKey: 'ideas.documentaryDesc',
    icon: Clapperboard,
    gradient: 'from-[#00D9A3] to-[#10B981]',
    color: '#00D9A3',
  },
  {
    id: 'eduMath',
    image: '/landing/idea-edu-math.webp',
    video: '/landing/idea-edu-math.mp4',
    titleKey: 'ideas.eduMath',
    descKey: 'ideas.eduMathDesc',
    icon: GraduationCap,
    gradient: 'from-[#10B981] to-[#10B981]',
    color: '#10B981',
  },
  {
    id: 'eduScience',
    image: '/landing/idea-edu-science.webp',
    video: '/landing/idea-edu-science.mp4',
    titleKey: 'ideas.eduScience',
    descKey: 'ideas.eduScienceDesc',
    icon: GraduationCap,
    gradient: 'from-[#00D9FF] to-[#10B981]',
    color: '#00D9FF',
  },
  {
    id: 'ted',
    image: '/landing/idea-ted-lecture.webp',
    video: '/landing/idea-ted-lecture.mp4',
    titleKey: 'ideas.ted',
    descKey: 'ideas.tedDesc',
    icon: Presentation,
    gradient: 'from-[#FF4444] to-[#FFB800]',
    color: '#FF4444',
  },
  {
    id: 'advertising',
    image: '/landing/idea-advertising.webp',
    video: '/landing/idea-advertising.mp4',
    titleKey: 'ideas.advertising',
    descKey: 'ideas.advertisingDesc',
    icon: Megaphone,
    gradient: 'from-[#FFB800] to-[#FF6B6B]',
    color: '#FFB800',
  },
  {
    id: 'business',
    image: '/landing/idea-business.webp',
    video: '/landing/idea-business.mp4',
    titleKey: 'ideas.business',
    descKey: 'ideas.businessDesc',
    icon: Briefcase,
    gradient: 'from-[#10B981] to-[#00D9A3]',
    color: '#10B981',
  },
  {
    id: 'agency',
    image: '/landing/idea-agency.webp',
    video: '/landing/idea-agency.mp4',
    titleKey: 'ideas.agency',
    descKey: 'ideas.agencyDesc',
    icon: Megaphone,
    gradient: 'from-[#FF8C42] to-[#FF69B4]',
    color: '#FF8C42',
  },
  {
    id: 'creator',
    image: '/landing/idea-creator.webp',
    video: '/landing/idea-creator.mp4',
    titleKey: 'ideas.creator',
    descKey: 'ideas.creatorDesc',
    icon: Video,
    gradient: 'from-[#FF6B6B] to-[#10B981]',
    color: '#FF6B6B',
  },
  {
    id: 'cooking',
    image: '/landing/idea-cooking.webp',
    video: '/landing/idea-cooking.mp4',
    titleKey: 'ideas.cooking',
    descKey: 'ideas.cookingDesc',
    icon: Utensils,
    gradient: 'from-[#FF8C42] to-[#FFB800]',
    color: '#FF8C42',
  },
  {
    id: 'travel',
    image: '/landing/idea-travel.webp',
    video: '/landing/idea-travel.mp4',
    titleKey: 'ideas.travel',
    descKey: 'ideas.travelDesc',
    icon: Plane,
    gradient: 'from-[#00D9FF] to-[#00D9A3]',
    color: '#00D9FF',
  },
  {
    id: 'music',
    image: '/landing/idea-music.webp',
    video: '/landing/idea-music.mp4',
    titleKey: 'ideas.music',
    descKey: 'ideas.musicDesc',
    icon: Music,
    gradient: 'from-[#A855F7] to-[#FF69B4]',
    color: '#A855F7',
  },
];

/** Animated card image — shows video on hover (desktop) or tap (mobile) */
const HoverVideo = ({ image, video, alt, className }: { image: string; video: string; alt: string; className?: string }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoExists, setVideoExists] = useState(true);

  const handleEnter = useCallback(() => {
    if (!videoExists) return;
    setPlaying(true);
    // Small delay to let the element mount
    setTimeout(() => {
      videoRef.current?.play().catch(() => setVideoExists(false));
    }, 50);
  }, [videoExists]);

  const handleLeave = useCallback(() => {
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <div
      className={className}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
    >
      <img
        src={image}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${playing ? 'opacity-0 scale-110' : 'opacity-100 group-hover:scale-110'}`}
        loading="lazy"
      />
      {playing && videoExists && (
        <video
          ref={videoRef}
          src={video}
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

const IdeaShowcase = ({ T }: IdeaShowcaseProps) => {
  return (
    <section id="ideas" className="py-24 md:py-32 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#10B981]/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] rounded-full bg-[#10B981]/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 px-4 py-1.5 text-xs text-[#10B981] font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {T('ideas.badge')}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            {T('ideas.title')}
          </h2>
          <p className="text-[#9FB8D6] text-lg max-w-2xl mx-auto">
            {T('ideas.sub')}
          </p>
        </motion.div>

        {/* Top 2 — large hero cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {IDEAS.slice(0, 2).map((idea, index) => {
            const Icon = idea.icon;
            return (
              <motion.a
                key={idea.titleKey}
                href={`#/studio?template=${idea.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group rounded-2xl overflow-hidden cursor-pointer block"
              >
                <HoverVideo
                  image={idea.image}
                  video={idea.video}
                  alt={T(idea.titleKey)}
                  className="relative aspect-[16/10] overflow-hidden"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                {/* Icon badge */}
                <div className="absolute top-4 start-4">
                  <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${idea.gradient} px-3 py-1.5`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-bold text-white">{T(idea.titleKey)}</span>
                  </div>
                </div>
                {/* Content */}
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
                  <p className="text-sm md:text-base text-white/80 mb-4 line-clamp-2">
                    {T(idea.descKey)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                    {T('ideas.tryThis')}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Middle row — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {IDEAS.slice(2, 5).map((idea, index) => {
            const Icon = idea.icon;
            return (
              <motion.a
                key={idea.titleKey}
                href={`#/studio?template=${idea.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group rounded-2xl overflow-hidden cursor-pointer block"
              >
                <HoverVideo
                  image={idea.image}
                  video={idea.video}
                  alt={T(idea.titleKey)}
                  className="relative aspect-[16/10] overflow-hidden"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-3 start-3">
                  <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${idea.gradient} px-2.5 py-1`}>
                    <Icon className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-bold text-white">{T(idea.titleKey)}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="text-xs text-white/70 line-clamp-2 mb-3">
                    {T(idea.descKey)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                    {T('ideas.tryThis')}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Bottom rows — 4+3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {IDEAS.slice(5, 9).map((idea, index) => {
            const Icon = idea.icon;
            return (
              <motion.a
                key={idea.titleKey}
                href={`#/studio?template=${idea.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative group rounded-2xl overflow-hidden cursor-pointer block"
              >
                <HoverVideo
                  image={idea.image}
                  video={idea.video}
                  alt={T(idea.titleKey)}
                  className="relative aspect-[16/10] overflow-hidden"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-3 start-3">
                  <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${idea.gradient} px-2.5 py-1`}>
                    <Icon className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-bold text-white">{T(idea.titleKey)}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-[11px] text-white/70 line-clamp-2 mb-2">
                    {T(idea.descKey)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/80 group-hover:text-white transition-colors">
                    {T('ideas.tryThis')}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Last row — 3 wide cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {IDEAS.slice(9, 12).map((idea, index) => {
            const Icon = idea.icon;
            return (
              <motion.a
                key={idea.titleKey}
                href={`#/studio?template=${idea.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group rounded-2xl overflow-hidden cursor-pointer block"
              >
                <HoverVideo
                  image={idea.image}
                  video={idea.video}
                  alt={T(idea.titleKey)}
                  className="relative aspect-[16/10] overflow-hidden"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-3 start-3">
                  <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${idea.gradient} px-2.5 py-1`}>
                    <Icon className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-bold text-white">{T(idea.titleKey)}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="text-xs text-white/70 line-clamp-2 mb-3">
                    {T(idea.descKey)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                    {T('ideas.tryThis')}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IdeaShowcase;
