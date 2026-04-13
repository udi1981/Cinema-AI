import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Film, Crown, CreditCard, Receipt, Wallet,
  Check, Zap, Star, Sparkles, Download, ExternalLink,
  AlertCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PLAN_CONFIG } from '../types';
import type { PlanTier } from '../types';

const PLAN_FEATURES: Record<PlanTier, string[]> = {
  free: [
    '2 demo scenes',
    'Basic video quality',
    'Watermarked exports',
    'Community support',
  ],
  basic: [
    '1 film / month (up to 15 scenes)',
    'HD video quality',
    'No watermark',
    'TTS narration (1 language)',
    'Email support',
  ],
  pro: [
    '3 films / month (up to 25 scenes each)',
    'HD video quality',
    'No watermark',
    'TTS narration (3 languages)',
    'Priority support',
    'Export to MP4',
  ],
  studio: [
    '7 films / month (up to 40 scenes each)',
    'Full HD video quality',
    'No watermark',
    'TTS narration (all languages)',
    'Priority support',
    'Export to MP4',
    'Social sharing tools',
    'Analytics dashboard',
  ],
  unlimited: [
    '20 films / month (up to 60 scenes each)',
    'Full HD video quality',
    'No watermark',
    'TTS narration (all languages)',
    'Dedicated support',
    'Export to MP4',
    'Social sharing tools',
    'Analytics dashboard',
    'API access',
    'Early access to new features',
  ],
};

const PLAN_ORDER: PlanTier[] = ['free', 'basic', 'pro', 'studio', 'unlimited'];

// Mock invoice data — will come from Stripe in the future
const MOCK_INVOICES: { id: string; date: string; amount: number; status: 'paid' | 'pending' | 'failed'; plan: string }[] = [];

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#07070e' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/50 text-sm font-medium">Loading billing...</p>
    </div>
  </div>
);

const BillingPage = () => {
  const { profile, isAuthenticated, loading: authLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (authLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07070e] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white/60 mb-4">Please sign in to manage billing.</p>
          <a href="#/auth" className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold text-sm">Sign In</a>
        </div>
      </div>
    );
  }

  const currentPlan = profile.plan as PlanTier;
  const planConfig = PLAN_CONFIG[currentPlan] || PLAN_CONFIG.free;
  const yearlyDiscount = 0.2; // 20% off yearly

  const getPrice = (plan: PlanTier) => {
    const base = PLAN_CONFIG[plan].price;
    if (billingCycle === 'yearly') return Math.round(base * (1 - yearlyDiscount) * 12);
    return base;
  };

  const handleUpgrade = (plan: PlanTier) => {
    setSelectedPlan(plan);
    // In the future, this will open Stripe Checkout
  };

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-[#0a0e17] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#/profile" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Profile
          </a>
          <a href="#/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">Cinema AI</span>
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Billing & Plans</h1>
          <p className="text-white/50 text-sm mt-1">Manage your subscription, view invoices, and upgrade your plan</p>
        </div>

        {/* Current Plan Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0f1520] to-[#111827] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                <Crown className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{planConfig.label} Plan</h2>
                  {currentPlan !== 'free' && (
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                  )}
                </div>
                <p className="text-sm text-white/50">{planConfig.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {planConfig.price > 0 && (
                <div className="text-right">
                  <span className="text-2xl font-bold">${planConfig.price}</span>
                  <span className="text-white/40 text-sm">/mo</span>
                </div>
              )}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Films Used</p>
              <p className="text-lg font-bold mt-1">{profile.scenesUsed > 0 ? Math.ceil(profile.scenesUsed / 10) : 0} <span className="text-sm text-white/30">/ {planConfig.films || '∞'}</span></p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Scenes Used</p>
              <p className="text-lg font-bold mt-1">{profile.scenesUsed}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Credits Left</p>
              <p className="text-lg font-bold mt-1">{profile.credits}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Billing Cycle</p>
              <p className="text-lg font-bold mt-1 capitalize">{currentPlan === 'free' ? '—' : 'Monthly'}</p>
            </div>
          </div>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center justify-center gap-3">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              billingCycle === 'monthly' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/50 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/50 hover:text-white'
            }`}
          >
            Yearly
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">-20%</span>
          </button>
        </motion.div>

        {/* Plans Grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PLAN_ORDER.map((planKey, i) => {
            const plan = PLAN_CONFIG[planKey];
            const isCurrent = planKey === currentPlan;
            const isPro = planKey === 'pro';
            const price = getPrice(planKey);
            const isUpgrade = PLAN_ORDER.indexOf(planKey) > PLAN_ORDER.indexOf(currentPlan);

            return (
              <motion.div
                key={planKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`relative bg-[#0f1520] border rounded-2xl p-5 flex flex-col ${
                  isPro ? 'border-emerald-500/40 ring-1 ring-emerald-500/20' :
                  isCurrent ? 'border-white/20' : 'border-white/10'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-bold text-base">{plan.label}</h3>
                  <p className="text-[11px] text-white/40 mt-0.5">{plan.desc}</p>
                </div>

                <div className="mb-4">
                  {price === 0 ? (
                    <span className="text-2xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold">${price}</span>
                      <span className="text-white/40 text-sm">/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                      {billingCycle === 'yearly' && (
                        <p className="text-[10px] text-emerald-400 mt-0.5">${Math.round(price / 12)}/mo billed annually</p>
                      )}
                    </>
                  )}
                </div>

                <ul className="flex-1 space-y-2 mb-5">
                  {PLAN_FEATURES[planKey].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-white/60">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="py-2.5 text-center rounded-xl bg-white/5 text-white/40 text-sm font-medium border border-white/10">
                    Current Plan
                  </div>
                ) : isUpgrade ? (
                  <button
                    onClick={() => handleUpgrade(planKey)}
                    className={`py-2.5 text-center rounded-xl text-sm font-semibold transition-all ${
                      isPro
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                        : 'bg-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    Upgrade
                  </button>
                ) : (
                  <div className="py-2.5 text-center rounded-xl bg-white/5 text-white/30 text-sm font-medium border border-white/5">
                    Downgrade
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stripe Checkout Modal */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0f1520] border border-white/10 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Upgrade to {PLAN_CONFIG[selectedPlan].label}</h3>
                  <p className="text-sm text-white/50">
                    ${getPrice(selectedPlan)}/{billingCycle === 'yearly' ? 'yr' : 'mo'}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{PLAN_CONFIG[selectedPlan].label} Plan</span>
                  <span className="font-medium">${getPrice(selectedPlan)}/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400">Yearly discount (20%)</span>
                    <span className="text-emerald-400 font-medium">
                      -${Math.round(PLAN_CONFIG[selectedPlan].price * 12 * yearlyDiscount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between text-sm font-bold">
                  <span>Total</span>
                  <span>${getPrice(selectedPlan)}/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-300/80">
                  Stripe payment integration coming soon. Your upgrade will be processed once billing is enabled.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled
                  className="flex-1 py-3 bg-emerald-500/50 text-white/50 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay with Stripe
                </button>
              </div>

              <p className="text-center text-[10px] text-white/30 mt-4">
                Secured by <span className="text-white/50 font-medium">Stripe</span> • Cancel anytime •
                <a href="#/terms" className="underline hover:text-white/50"> Terms</a>
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Payment Method */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-[#0f1520] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold">Payment Method</h3>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
            <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-[10px] font-bold text-white tracking-wider">VISA</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/40">No payment method on file</p>
              <p className="text-[10px] text-white/30">Add a card to enable paid plans</p>
            </div>
            <button
              disabled
              className="px-4 py-2 bg-white/5 text-white/40 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Add Card
            </button>
          </div>

          <p className="text-[10px] text-white/30 flex items-center gap-1.5">
            <CreditCard className="w-3 h-3" />
            Payments processed securely by Stripe. We never store your card details.
          </p>
        </motion.div>

        {/* Wallet / Credits */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#0f1520] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold">Wallet & Credits</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Balance</p>
              <p className="text-2xl font-bold mt-1">${(profile.credits * 0.10).toFixed(2)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{profile.credits} credits</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Est. Cost / Scene</p>
              <p className="text-2xl font-bold mt-1">$2.83</p>
              <p className="text-[10px] text-white/30 mt-0.5">Video + TTS + AI</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">This Month</p>
              <p className="text-2xl font-bold mt-1">${(profile.scenesUsed * 2.83).toFixed(2)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{profile.scenesUsed} scenes generated</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400/50 rounded-xl text-sm font-semibold cursor-not-allowed"
            >
              <Zap className="w-4 h-4" /> Buy Credits
            </button>
            <p className="text-[10px] text-white/30">Credit purchases coming soon with Stripe</p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-white/50">
              <strong className="text-white/70">How credits work:</strong> Each scene costs approximately $2.83 in API usage
              (Veo 3.1 video generation, TTS narration, and AI script generation). Credits are consumed when you generate
              scenes. You bring your own API key — credits track your platform subscription allowance, not API costs.
            </p>
          </div>
        </motion.div>

        {/* Invoice History */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-[#0f1520] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold">Invoices</h3>
            </div>
          </div>

          {MOCK_INVOICES.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/40">No invoices yet</p>
              <p className="text-[10px] text-white/30 mt-1">Invoices will appear here once you upgrade to a paid plan</p>
            </div>
          ) : (
            <div className="space-y-2">
              {MOCK_INVOICES.map((invoice) => (
                <div key={invoice.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/[0.07] transition-colors">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{invoice.plan} Plan</p>
                    <p className="text-[10px] text-white/40">{invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${invoice.amount.toFixed(2)}</p>
                    <p className={`text-[10px] font-medium ${
                      invoice.status === 'paid' ? 'text-emerald-400' :
                      invoice.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </p>
                  </div>
                  <button className="p-2 text-white/30 hover:text-white/60 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#0f1520] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold">Billing FAQ</h3>
          <div className="space-y-3">
            {[
              {
                q: 'What am I paying for?',
                a: 'You pay for access to the Cinema AI Studio platform and its tools — not for the AI generation outputs directly. Video generation costs (Veo, TTS, etc.) are covered by your own API key.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel your subscription at any time. You\'ll retain access until the end of your billing period.',
              },
              {
                q: 'Do I need my own API key?',
                a: 'Yes. Cinema AI Studio requires a Google Gemini API key. You can get one free from Google AI Studio. The platform subscription gives you access to our tools, templates, and features.',
              },
              {
                q: 'What payment methods are accepted?',
                a: 'We accept all major credit cards, debit cards, and popular payment methods through Stripe.',
              },
              {
                q: 'How do refunds work?',
                a: 'We offer a 7-day money-back guarantee for first-time subscribers. Contact support for refund requests.',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white/5 rounded-xl">
                <summary className="flex items-center justify-between p-3 cursor-pointer text-sm font-medium text-white/80 hover:text-white transition-colors list-none">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-white/30 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-3 pb-3 text-xs text-white/50 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </motion.div>

        {/* Footer links */}
        <div className="flex flex-wrap gap-4 text-xs text-white/30 pb-8">
          <a href="#/profile" className="hover:text-white/60 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Profile
          </a>
          <span className="text-white/10">•</span>
          <a href="#/terms" className="hover:text-white/60 transition-colors">Terms of Service</a>
          <a href="#/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</a>
          <a href="#/help" className="hover:text-white/60 transition-colors">Help & Support</a>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
