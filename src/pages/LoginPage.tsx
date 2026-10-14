import React, { useState } from 'react';
import { DemoSession } from '../types';
import {
  loginWithDemoMobileNumber,
  formatPhoneNumber,
  cleanPhoneNumber,
  validateDemoPhoneNumber,
} from '../services/auth';
import {
  Phone,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Loader2,
  Users,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (session: DemoSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = cleanPhoneNumber(raw).slice(0, 10);
    setPhoneNumber(formatPhoneNumber(digitsOnly));
    if (errorMessage) setErrorMessage(null);
  };

  const handleAutofill = (number: string) => {
    setPhoneNumber(formatPhoneNumber(number));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validation = validateDemoPhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Please enter an authorized demo mobile number.');
      return;
    }

    setIsLoading(true);

    try {
      const session = await loginWithDemoMobileNumber(validation.cleanNumber);
      setSuccessMessage(`Authenticated as ${session.user.name}. Redirecting to your dashboard...`);
      
      // Short delay for smooth success feedback, then complete redirect
      setTimeout(() => {
        onLoginSuccess(session);
      }, 500);
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Login failed. Please check the mobile number.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              SkillLoop Local Exchange
            </h1>
            <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
              Enter your mobile phone number to access your neighborhood exchange dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="mobile-input" 
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Mobile Phone Number
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="mobile-input"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(999) 000-3331"
                  value={phoneNumber}
                  onChange={handleInputChange}
                  disabled={isLoading || Boolean(successMessage)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm font-mono-data tracking-wide placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div 
                role="alert"
                className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div 
                role="status"
                className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit / Continue Button */}
            <button
              type="submit"
              disabled={isLoading || Boolean(successMessage)}
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : successMessage ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Section */}
          <div className="mt-6 pt-5 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-500" />
                Accounts
              </span>
              <span className="text-[11px] text-stone-500">Tap to autofill</span>
            </div>

            <div className="space-y-2">
              {/* Account 1: Dharani */}
              <button
                type="button"
                onClick={() => handleAutofill('9990003331')}
                className="w-full p-2.5 text-left bg-stone-50 hover:bg-stone-100 hover:border-emerald-300 border border-stone-200 rounded-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-stone-900 group-hover:text-emerald-900">
                    Dharani · <span className="font-mono-data text-emerald-700">9990003331</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono-data">Maplewood (0.3 mi)</span>
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5 truncate">
                  Offers: Acoustic Guitar, Gardening · Wants: Spanish, React
                </div>
              </button>

              {/* Account 2: Sivaraj */}
              <button
                type="button"
                onClick={() => handleAutofill('8880002221')}
                className="w-full p-2.5 text-left bg-stone-50 hover:bg-stone-100 hover:border-emerald-300 border border-stone-200 rounded-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-stone-900 group-hover:text-emerald-900">
                    Sivaraj · <span className="font-mono-data text-emerald-700">8880002221</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono-data">Elmwood (1.1 mi)</span>
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5 truncate">
                  Offers: React / Frontend, Mandarin · Wants: Guitar, Tea
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-stone-500 mt-4">
          SkillLoop Local Skill Exchange · Mutual knowledge sharing with zero currency
        </p>
      </div>
    </div>
  );
};
