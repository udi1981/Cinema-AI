import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserProfile, PlanTier, DbProfile } from '../types';

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: UserProfile;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isAuthenticated: boolean;
};

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  plan: 'free',
  credits: 0,
  scenesUsed: 0,
};

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  profile: DEFAULT_PROFILE,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

// Convert DB profile to frontend UserProfile
const dbToProfile = (db: DbProfile, email: string): UserProfile => ({
  name: db.display_name || '',
  email,
  plan: db.plan as PlanTier,
  credits: db.credits,
  scenesUsed: db.scenes_used,
  avatarUrl: db.avatar_url || undefined,
  createdAt: db.created_at,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile>(() => {
    // Start with localStorage profile for backwards compatibility
    try {
      const saved = JSON.parse(localStorage.getItem('cinema_user') || '{}');
      return { ...DEFAULT_PROFILE, ...saved };
    } catch {
      return DEFAULT_PROFILE;
    }
  });
  const [loading, setLoading] = useState(true);

  // Fetch profile from Supabase
  const fetchProfile = useCallback(async (userId: string, email: string) => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.warn('Profile fetch error:', error.message);
        return;
      }
      if (data) {
        const p = dbToProfile(data as DbProfile, email);
        setProfile(p);
        // Sync to localStorage for offline/backwards compat
        localStorage.setItem('cinema_user', JSON.stringify(p));
      }
    } catch (e) {
      console.warn('Profile fetch failed:', e);
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id, s.user.email || '');
      }
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id, s.user.email || '');
      } else {
        setProfile(DEFAULT_PROFILE);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured — cannot sign in');
      return;
    }
    const redirectTo = window.location.origin + window.location.pathname + '#/studio';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem('cinema_user');
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    localStorage.setItem('cinema_user', JSON.stringify(newProfile));

    if (isSupabaseConfigured() && user) {
      try {
        await supabase.from('profiles').update({
          display_name: newProfile.name,
          plan: newProfile.plan,
          credits: newProfile.credits,
          scenes_used: newProfile.scenesUsed,
        }).eq('id', user.id);
      } catch (e) {
        console.warn('Profile update failed:', e);
      }
    }
  }, [profile, user]);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      updateProfile,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
