import { lazy, Suspense, useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';

const App = lazy(() => import('./App'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));
const AcceptableUsePage = lazy(() => import('./pages/legal/AcceptableUsePage'));
const HelpPage = lazy(() => import('./pages/legal/HelpPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#07070e' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-[#4f8cff] border-t-transparent rounded-full animate-spin" />
      <p className="text-white/50 text-sm font-medium tracking-wide">Loading...</p>
    </div>
  </div>
);

import LandingPage from './landing/LandingPage';

const Router = () => {
  const [hash, setHash] = useState(window.location.hash);
  const { loading: authLoading, isAuthenticated } = useAuth();

  // Detect Supabase OAuth callback tokens in the hash and process them
  useEffect(() => {
    const raw = window.location.hash;
    if (raw.includes('access_token=') && raw.includes('token_type=')) {
      // Supabase OAuth redirect — tokens are in the hash fragment
      // Supabase client will auto-detect and process them via onAuthStateChange
      // Replace the hash with the studio route after a brief delay for processing
      const timer = setTimeout(() => {
        window.location.hash = '#/studio';
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const route = hash.replace('#', '').replace(/^\//, '') || '';

  // While processing OAuth tokens, show loading
  if (route.includes('access_token=') && route.includes('token_type=')) {
    return <LoadingScreen />;
  }

  // Parse template ID from hash: #/studio?template=children → 'children'
  const isStudio = route.startsWith('studio') || route.startsWith('app');
  const templateMatch = route.match(/[?&]template=([^&]+)/);
  const templateId = templateMatch ? decodeURIComponent(templateMatch[1]) : undefined;

  if (isStudio) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <App templateId={templateId} />
      </Suspense>
    );
  }

  if (route === 'auth') {
    return <Suspense fallback={<LoadingScreen />}><AuthPage /></Suspense>;
  }

  if (route === 'profile') {
    return <Suspense fallback={<LoadingScreen />}><ProfilePage /></Suspense>;
  }

  if (route === 'terms') {
    return <Suspense fallback={<LoadingScreen />}><TermsPage /></Suspense>;
  }

  if (route === 'privacy') {
    return <Suspense fallback={<LoadingScreen />}><PrivacyPage /></Suspense>;
  }

  if (route === 'acceptable-use') {
    return <Suspense fallback={<LoadingScreen />}><AcceptableUsePage /></Suspense>;
  }

  if (route === 'help') {
    return <Suspense fallback={<LoadingScreen />}><HelpPage /></Suspense>;
  }

  if (route === 'billing') {
    return <Suspense fallback={<LoadingScreen />}><BillingPage /></Suspense>;
  }

  if (route === 'discover') {
    return <Suspense fallback={<LoadingScreen />}><DiscoverPage /></Suspense>;
  }

  return <LandingPage />;
};

export default Router;
