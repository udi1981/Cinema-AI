import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { PLAN_CONFIG } from '../../types';
import type { PlanTier } from '../../types';

type PricingSectionProps = {
  T: (key: string) => string;
};

const PLAN_FEATURES: Record<PlanTier, string[]> = {
  free: ['2 demo scenes', '1 cinematic style', 'Watermarked export', 'Basic preview'],
  basic: ['1 film / month', 'All 5 styles', 'HD export', 'Multi-language dubbing'],
  pro: ['3 films / month', 'All 5 styles', 'HD export', 'Priority generation', 'Multi-language dubbing', 'No watermark'],
  studio: ['7 films / month', 'All 5 styles', '4K export', 'Priority generation', 'Team collaboration', 'Custom branding', 'No watermark'],
  unlimited: ['20 films / month', 'All 5 styles', '4K export', 'Priority generation', 'API access', 'Custom branding', 'Dedicated support', 'No watermark'],
};

const PLAN_ORDER: PlanTier[] = ['free', 'basic', 'pro', 'studio', 'unlimited'];

const PricingSection = ({ T }: PricingSectionProps) => {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            {T('pricing.title')}
          </h2>
          <p className="text-[#9FB8D6] text-lg max-w-2xl mx-auto">
            {T('pricing.sub')}
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {PLAN_ORDER.map((tier, index) => {
            const plan = PLAN_CONFIG[tier];
            const isPro = tier === 'pro';
            const features = PLAN_FEATURES[tier];

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`relative rounded-xl p-px ${
                  isPro
                    ? 'bg-gradient-to-b from-[#10B981] to-[#10B981] shadow-xl shadow-[#10B981]/20'
                    : 'bg-white/5'
                }`}
              >
                {/* Most Popular badge */}
                {isPro && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center z-10">
                    <span className="bg-gradient-to-r from-[#10B981] to-[#10B981] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      {T('pricing.popular')}
                    </span>
                  </div>
                )}

                <div
                  className={`rounded-[11px] p-6 h-full flex flex-col ${
                    isPro ? 'bg-[#0a0a1f]' : 'bg-[#0f1024]'
                  }`}
                >
                  {/* Plan name */}
                  <h3 className="text-lg font-bold mb-1">{plan.label}</h3>

                  {/* Price */}
                  <div className="mb-3">
                    {plan.price === 0 ? (
                      <span className="text-3xl font-extrabold">{T('pricing.startFree')}</span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold">${plan.price}</span>
                        <span className="text-sm text-white/40">{T('pricing.perMonth')}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/50 mb-5">{plan.desc}</p>

                  {/* Features */}
                  <ul className="flex-1 space-y-2.5 mb-6">
                    {features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm text-white/70">
                        <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="#/auth"
                    className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      isPro
                        ? 'bg-gradient-to-r from-[#10B981] to-[#10B981] text-white hover:shadow-lg hover:shadow-emerald-500/25'
                        : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {plan.price === 0 ? T('pricing.startFree') : T('pricing.getStarted')}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
