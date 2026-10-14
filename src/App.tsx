import React, { useState, useEffect, useCallback } from 'react';
import { DemoSession, UserProfile, ExchangeRequest } from './types';
import {
  getCurrentSession,
  logoutDemoSession,
  AUTH_CHANGE_EVENT,
} from './services/auth';
import { getAllExchanges } from './services/storage';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MatchesPage } from './pages/MatchesPage';
import { ExchangesPage } from './pages/ExchangesPage';
import { ProfilePage } from './pages/ProfilePage';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<DemoSession | null>(() => getCurrentSession());
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>([]);

  // Parse route from hash or pathname
  const parseCurrentRoute = useCallback((): string => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash) {
      const cleanHash = hash.split('?')[0];
      if (['dashboard', 'matches', 'exchanges', 'profile', 'login'].includes(cleanHash)) {
        return cleanHash;
      }
    }
    const path = window.location.pathname.replace(/^\//, '').split('?')[0];
    if (['dashboard', 'matches', 'exchanges', 'profile', 'login'].includes(path)) {
      return path;
    }
    return 'dashboard';
  }, []);

  // Sync navigation
  const navigateTo = useCallback((route: string) => {
    setCurrentRoute(route);
    try {
      window.location.hash = `#/${route}`;
    } catch {
      // Fallback
    }
  }, []);

  // Refresh exchanges for badges
  const refreshExchanges = useCallback(() => {
    setExchanges(getAllExchanges());
  }, []);

  // Initialize session and route
  useEffect(() => {
    const initialSession = getCurrentSession();
    setSession(initialSession);

    const initialRoute = parseCurrentRoute();
    if (!initialSession) {
      setCurrentRoute('login');
      window.location.hash = '#/login';
    } else {
      if (initialRoute === 'login') {
        setCurrentRoute('dashboard');
        window.location.hash = '#/dashboard';
      } else {
        setCurrentRoute(initialRoute);
      }
    }

    refreshExchanges();
    setIsInitializing(false);

    // Listen to route changes via browser history/back button
    const handleLocationChange = () => {
      const targetRoute = parseCurrentRoute();
      const currentAuth = getCurrentSession();
      if (!currentAuth) {
        setCurrentRoute('login');
      } else {
        setCurrentRoute(targetRoute === 'login' ? 'dashboard' : targetRoute);
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    // Listen to cross-component auth state changes
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<DemoSession | null>;
      setSession(customEvent.detail);
      if (customEvent.detail) {
        navigateTo('dashboard');
      } else {
        navigateTo('login');
      }
      refreshExchanges();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, [navigateTo, parseCurrentRoute, refreshExchanges]);

  const handleLoginSuccess = (newSession: DemoSession) => {
    setSession(newSession);
    refreshExchanges();
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    logoutDemoSession();
    setSession(null);
    navigateTo('login');
  };

  const handleProfileUpdate = (updated: UserProfile) => {
    if (session) {
      setSession({
        ...session,
        user: updated,
      });
    }
  };

  // Calculate incoming pending requests for Navbar badge
  const pendingIncomingCount = session
    ? exchanges.filter(
        (ex) =>
          (ex.toUserId === session.user.id || ex.toUserPhone === session.phoneNumber) &&
          ex.status === 'pending'
      ).length
    : 0;

  // Never render a blank screen
  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-700">
        <Loader2 className="w-8 h-8 text-emerald-800 animate-spin mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono-data">
          Loading SkillLoop...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative text-stone-900 bg-transparent">
      {/* Ambient background */}
      <AnimatedBackground />

      {/* Top Navbar */}
      <Navbar
        currentSession={session}
        activeRoute={currentRoute}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        pendingIncomingCount={pendingIncomingCount}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {!session || currentRoute === 'login' ? (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        ) : currentRoute === 'dashboard' ? (
          <DashboardPage
            currentUser={session.user}
            onNavigate={navigateTo}
            onProfileUpdate={refreshExchanges}
          />
        ) : currentRoute === 'matches' ? (
          <MatchesPage currentUser={session.user} onNavigate={navigateTo} />
        ) : currentRoute === 'exchanges' ? (
          <ExchangesPage currentUser={session.user} />
        ) : currentRoute === 'profile' ? (
          <ProfilePage currentUser={session.user} onProfileUpdate={handleProfileUpdate} />
        ) : (
          <DashboardPage
            currentUser={session.user}
            onNavigate={navigateTo}
            onProfileUpdate={refreshExchanges}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white/60 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">SkillLoop</span>
            <span>·</span>
            <span>Local Skill Exchange & Barter Network</span>
            <span>·</span>
            <span>Zero Currency Community</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>Teach · Learn · Connect</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
