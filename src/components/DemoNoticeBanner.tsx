import React from 'react';
import { DemoSession } from '../types';
import { switchDemoAccount, formatPhoneNumber } from '../services/auth';
import { resetDemoDataToDefaults } from '../services/storage';
import { ArrowLeftRight, ShieldAlert, RotateCcw } from 'lucide-react';

interface DemoNoticeBannerProps {
  currentSession: DemoSession | null;
  onSessionChange: (session: DemoSession | null) => void;
}

export const DemoNoticeBanner: React.FC<DemoNoticeBannerProps> = ({
  currentSession,
  onSessionChange,
}) => {
  const [switching, setSwitching] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const handleSwitchAccount = async (targetPhone: '9990003331' | '8880002221') => {
    try {
      setSwitching(true);
      const newSession = await switchDemoAccount(targetPhone);
      onSessionChange(newSession);
    } catch (e) {
      console.error(e);
    } finally {
      setSwitching(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo exchange requests and profiles back to initial sample state?')) {
      resetDemoDataToDefaults();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 350);
    }
  };

  const isAlex = currentSession?.phoneNumber === '9990003331';

  return (
    <aside aria-label="Demo Mode Notice" className="bg-stone-900 text-stone-200 text-xs border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase text-[11px] text-amber-400">
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            Demo Mode Active
          </span>
          <span className="hidden sm:inline text-stone-400">·</span>
          <span className="text-stone-300 hidden md:inline">
            Mock authentication active for testing. SMS OTP bypassed for authorized demo numbers.
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {currentSession && (
            <div className="flex items-center gap-2 bg-stone-800/90 px-2.5 py-1 rounded border border-stone-700">
              <span className="text-stone-400">Signed in as:</span>
              <span className="font-medium text-white truncate max-w-[140px]">
                {currentSession.user.name} ({formatPhoneNumber(currentSession.phoneNumber)})
              </span>
              
              <button
                onClick={() => handleSwitchAccount(isAlex ? '8880002221' : '9990003331')}
                disabled={switching}
                className="ml-1.5 flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer transition-colors"
                title={`Switch demo profile to ${isAlex ? 'Maya Chen (8880002221)' : 'Alex Rivera (9990003331)'}`}
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span className="hidden sm:inline">Switch to</span> {isAlex ? 'Maya' : 'Alex'}
              </button>
            </div>
          )}

          <button
            onClick={handleResetData}
            className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-200 transition-colors px-2 py-1 cursor-pointer"
            title="Reset demo data to initial factory state"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">{resetSuccess ? 'Resetting...' : 'Reset Demo Data'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
