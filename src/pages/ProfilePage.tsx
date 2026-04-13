import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Crown, Key, Globe, Trash2, LogOut, Plus, Eye, EyeOff, ArrowLeft, Shield, CreditCard, AlertCircle, Check, Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PLAN_CONFIG } from '../types';
import type { PlanTier } from '../types';

const ProfilePage = () => {
  const { user, profile, signOut, updateProfile, isAuthenticated, loading: authLoading } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile.name);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Read existing API key from localStorage (backwards compat)
  const existingKey = localStorage.getItem('gemini_api_key') || '';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#07070e] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07070e] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white/60 mb-4">Please sign in to view your profile.</p>
          <a href="#/auth" className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold text-sm">Sign In</a>
        </div>
      </div>
    );
  }

  const handleSaveName = async () => {
    await updateProfile({ name: nameDraft });
    setEditingName(false);
  };

  const handleSaveApiKey = () => {
    const key = apiKeyDraft.replace(/[^\x20-\x7E]/g, '').trim();
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    }
    setApiKeyDraft('');
    setShowApiKeyInput(false);
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKeyDraft('');
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.hash = '#/';
  };

  const planConfig = PLAN_CONFIG[profile.plan as PlanTier] || PLAN_CONFIG.free;

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-[#0a0e17]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#/studio" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Studio
          </a>
          <a href="#/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">Cinema AI</span>
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Profile & Settings</h1>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f1520] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-7 h-7 text-emerald-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {/* Name */}
              {editingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <input value={nameDraft} onChange={e => setNameDraft(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50" autoFocus />
                  <button onClick={handleSaveName} className="p-1.5 bg-emerald-500/20 rounded-lg hover:bg-emerald-500/30 transition-colors">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold truncate">{profile.name || 'Unnamed'}</h2>
                  <button onClick={() => { setNameDraft(profile.name); setEditingName(true); }}
                    className="text-white/30 hover:text-white/60 text-xs transition-colors">edit</button>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{profile.email || user?.email || 'No email'}</span>
              </div>
              {profile.createdAt && (
                <p className="text-[11px] text-white/30 mt-1">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Plan & Billing */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-[#0f1520] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold">Plan & Billing</h3>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{planConfig.label} Plan</span>
                {profile.plan !== 'free' && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">ACTIVE</span>
                )}
              </div>
              <p className="text-xs text-white/50 mt-0.5">{planConfig.desc}</p>
            </div>
            {planConfig.price > 0 && (
              <div className="text-right">
                <span className="text-xl font-bold">${planConfig.price}</span>
                <span className="text-xs text-white/40">/mo</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Scenes Used</p>
              <p className="text-lg font-bold mt-1">{profile.scenesUsed}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Credits Left</p>
              <p className="text-lg font-bold mt-1">{profile.credits}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="#/studio" onClick={() => { window.location.hash = '#/studio'; /* navigate to pricing step handled by app */ }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-semibold transition-all">
              <Crown className="w-4 h-4" /> Upgrade Plan
            </a>
            <div className="flex items-center gap-1.5 text-white/30 text-xs">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Stripe billing coming soon</span>
            </div>
          </div>
        </motion.div>

        {/* API Keys */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#0f1520] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold">API Keys</h3>
            </div>
          </div>
          <p className="text-xs text-white/40">Your API keys are stored locally on your device and never sent to our servers.</p>

          {/* Existing key */}
          {existingKey && (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Key className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Google Gemini</p>
                <p className="text-xs text-white/40 font-mono">{'●'.repeat(20)}{existingKey.slice(-6)}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-[10px] text-emerald-400 font-medium">Active</span>
              </div>
              <button onClick={handleRemoveApiKey} className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Add key form */}
          {showApiKeyInput ? (
            <div className="space-y-3 p-4 bg-white/5 rounded-xl">
              <label className="text-xs font-semibold text-white/60">Google Gemini API Key</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="AIza..."
                  value={apiKeyDraft}
                  onChange={e => setApiKeyDraft(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-emerald-500/50"
                  autoFocus
                />
                <button type="button" onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-white/30">
                Get your key from{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
                  className="text-emerald-400 underline">Google AI Studio</a>
              </p>
              <div className="flex gap-2">
                <button onClick={handleSaveApiKey} disabled={!apiKeyDraft.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all">
                  Save Key
                </button>
                <button onClick={() => { setShowApiKeyInput(false); setApiKeyDraft(''); }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg text-sm transition-all">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowApiKeyInput(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-dashed border-white/10 rounded-xl text-sm text-white/50 hover:text-white/70 transition-all w-full justify-center">
              <Plus className="w-4 h-4" /> {existingKey ? 'Replace API Key' : 'Add API Key'}
            </button>
          )}
        </motion.div>

        {/* Preferences */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-[#0f1520] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold">Preferences</h3>
          </div>
          <p className="text-xs text-white/40">Language and display settings can be changed in the Studio interface.</p>
          <a href="#/studio" className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
            Open Studio Settings →
          </a>
        </motion.div>

        {/* Legal */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#0f1520] border border-white/10 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold">Legal & Support</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Terms of Service', href: '#/terms' },
              { label: 'Privacy Policy', href: '#/privacy' },
              { label: 'Acceptable Use', href: '#/acceptable-use' },
              { label: 'Help & Support', href: '#/help' },
            ].map(link => (
              <a key={link.href} href={link.href}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-all">
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-[#0f1520] border border-red-500/10 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Danger Zone
          </h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl text-sm text-red-400/60 hover:text-red-400 transition-all">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
          <p className="text-[10px] text-white/20">Account deletion is permanent and cannot be undone. All your data, projects, and generated content will be removed.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
