import React from 'react';
import { DemoSession } from '../types';
import { formatPhoneNumber, loginWithDemoMobileNumber } from '../services/auth';
import { LogOut, Repeat, Compass, Inbox, User, Menu, X, ArrowRightLeft } from 'lucide-react';

interface NavbarProps {
  currentSession: DemoSession | null;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  pendingIncomingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSession,
  activeRoute,
  onNavigate,
  onLogout,
  pendingIncomingCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [switching, setSwitching] = React.useState(false);

  const isDharani = currentSession?.phoneNumber === '9990003331';

  const handleQuickSwitch = async () => {
    try {
      setSwitching(true);
      const nextPhone = isDharani ? '8880002221' : '9990003331';
      await loginWithDemoMobileNumber(nextPhone);
    } catch (e) {
      console.error(e);
    } finally {
      setSwitching(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Repeat },
    { id: 'matches', label: 'Local Matches', icon: Compass },
    { id: 'exchanges', label: 'Exchanges', icon: Inbox, badge: pendingIncomingCount },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const handleNavClick = (routeId: string) => {
    onNavigate(routeId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => handleNavClick(currentSession ? 'dashboard' : 'login')}
            className="text-xl font-bold tracking-tight text-emerald-900 whitespace-nowrap shrink-0 flex items-center gap-2 text-left cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center text-sm font-black shadow-xs">
              SL
            </span>
            <span>SkillLoop</span>
          </button>

          {/* Zone 2: 4 nav links with single-line whitespace-nowrap */}
          {currentSession && (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
              {navItems.map((item) => {
                const isActive = activeRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left ${
                      isActive
                        ? 'text-emerald-800 font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="ml-1.5 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-amber-500 text-stone-900 font-mono-data">
                        {item.badge}
                      </span>
                    ) : null}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Zone 3: 1 primary action area */}
          <div className="flex items-center gap-3 shrink-0">
            {currentSession ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleQuickSwitch}
                  disabled={switching}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors cursor-pointer"
                  title={`Switch active user to ${isDharani ? 'Sivaraj' : 'Dharani'}`}
                >
                  <ArrowRightLeft className="w-3 h-3 text-emerald-700" />
                  <span>Switch to {isDharani ? 'Sivaraj' : 'Dharani'}</span>
                </button>

                <div 
                  onClick={() => handleNavClick('profile')}
                  className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer text-stone-700"
                  title="View your exchange profile"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {currentSession.user.name.charAt(0)}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-xs font-semibold text-stone-900 truncate max-w-[120px]">
                      {currentSession.user.name}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono-data">
                      {currentSession.user.hoursBanked}h banked
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  title={`Logout from ${formatPhoneNumber(currentSession.phoneNumber)}`}
                >
                  <LogOut className="w-3.5 h-3.5 text-stone-500" />
                  <span>Log Out</span>
                </button>

                {/* Mobile hamburger toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-md cursor-pointer"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {currentSession && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 space-y-1">
            <div className="px-3 py-2 mb-2 bg-stone-50 rounded-lg flex items-center justify-between text-xs text-stone-600">
              <span className="font-semibold text-stone-900">{currentSession.user.name}</span>
              <span className="font-mono-data text-emerald-700 font-semibold">{currentSession.user.hoursBanked}h credits</span>
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors text-left cursor-pointer ${
                  activeRoute === item.id
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-stone-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-stone-900">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
