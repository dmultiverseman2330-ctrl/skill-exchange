import { DemoSession, UserProfile } from '../types';
import { AUTHORIZED_DEMO_NUMBERS } from '../data/initialData';
import { getProfileByPhone, initLocalStorage } from './storage';

export const AUTH_STORAGE_KEY = 'skillloop_demo_session_v1';
export const AUTH_CHANGE_EVENT = 'skillloop_auth_state_change';

/**
 * Sanitizes input string to only digits
 */
export function cleanPhoneNumber(input: string): string {
  if (!input) return '';
  return input.replace(/\D/g, '');
}

/**
 * Formats a 10-digit number into US format: (555) 000-0000
 */
export function formatPhoneNumber(input: string): string {
  const digits = cleanPhoneNumber(input);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Validates whether the given number is an authorized demo number.
 * Requirement:
 * - If user enters either authorized demo number (9990003331, 8880002221), logs in immediately.
 * - If the number is invalid or not in the authorized list, return clear validation message.
 */
export function validateDemoPhoneNumber(rawInput: string): {
  isValid: boolean;
  cleanNumber: string;
  errorMessage?: string;
} {
  const cleanNumber = cleanPhoneNumber(rawInput);

  if (!cleanNumber) {
    return {
      isValid: false,
      cleanNumber: '',
      errorMessage: 'Please enter your mobile phone number to continue.',
    };
  }

  if (cleanNumber.length !== 10) {
    return {
      isValid: false,
      cleanNumber,
      errorMessage: `Please enter a valid 10-digit mobile number (entered ${cleanNumber.length} digits).`,
    };
  }

  const isAuthorized = (AUTHORIZED_DEMO_NUMBERS as readonly string[]).includes(cleanNumber);

  if (!isAuthorized) {
    return {
      isValid: false,
      cleanNumber,
      errorMessage: `Phone number "${formatPhoneNumber(cleanNumber)}" is not recognized. Please use account number 999-000-3331 (Dharani) or 888-000-2221 (Sivaraj).`,
    };
  }

  return {
    isValid: true,
    cleanNumber,
  };
}

/**
 * Get current persisted demo session from localStorage
 */
export function getCurrentSession(): DemoSession | null {
  initLocalStorage();
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session: DemoSession = JSON.parse(raw);
    
    // Refresh user profile in session in case changes were saved in storage
    const latestProfile = getProfileByPhone(session.phoneNumber);
    if (latestProfile) {
      session.user = latestProfile;
    }
    return session;
  } catch (err) {
    console.error('Failed to load demo auth session:', err);
    return null;
  }
}

/**
 * Log in using an authorized demo phone number.
 * Requirement:
 * Logs user into the corresponding demo account immediately without asking for OTP or password.
 */
export async function loginWithDemoMobileNumber(rawInput: string): Promise<DemoSession> {
  const validation = validateDemoPhoneNumber(rawInput);
  if (!validation.isValid) {
    throw new Error(validation.errorMessage || 'Invalid phone number');
  }

  // Artificial microscopic latency (180ms) for realistic UX feedback
  await new Promise((resolve) => setTimeout(resolve, 180));

  const profile = getProfileByPhone(validation.cleanNumber);
  if (!profile) {
    throw new Error(`Profile for demo number ${validation.cleanNumber} not found.`);
  }

  const demoSession: DemoSession = {
    phoneNumber: validation.cleanNumber,
    user: profile,
    token: `demo-mock-jwt-token-${validation.cleanNumber}-${Date.now()}`,
    loginTimestamp: Date.now(),
    isDemo: true,
  };

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoSession));
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: demoSession }));
  } catch (err) {
    console.error('Failed to persist session to localStorage', err);
  }

  return demoSession;
}

/**
 * Working logout function
 */
export function logoutDemoSession(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: null }));
  } catch (err) {
    console.error('Failed to clear demo session', err);
  }
}

/**
 * Switch directly between the two authorized demo profiles for testing exchange interactions
 */
export async function switchDemoAccount(targetPhone: '9990003331' | '8880002221'): Promise<DemoSession> {
  return loginWithDemoMobileNumber(targetPhone);
}

// ============================================================================
// PRODUCTION AUTHENTICATION INTERFACE (STRICTLY ISOLATED FROM DEMO LOGIN)
// ============================================================================
/**
 * ARCHITECTURAL SAFETY BOUNDARY:
 * Mock authentication must NEVER be enabled in production environments.
 * The functions below represent the production authentication contract
 * which requires real carrier SMS OTP / Firebase Phone Auth / Twilio Verify.
 */
export const AUTH_ENVIRONMENT: 'development' | 'production' = 'development';

export interface ProductionPhoneAuthPayload {
  phoneNumber: string;
  recaptchaVerifierToken?: string;
}

export interface ProductionOtpVerificationPayload {
  verificationId: string;
  smsOtpCode: string;
}

/**
 * Production SMS OTP Dispatcher.
 * In a real production deployment, this invokes Firebase Auth `signInWithPhoneNumber`
 * or a server-side SMS gateway (Twilio, AWS SNS, MessageBird).
 */
export async function sendProductionPhoneOtp(
  payload: ProductionPhoneAuthPayload
): Promise<{ verificationId: string }> {
  if (AUTH_ENVIRONMENT === 'development') {
    throw new Error(
      'SECURITY WARNING: Production SMS OTP is disabled in development mode. Please use authorized demo numbers (9990003331 or 8880002221) for testing.'
    );
  }
  
  // Example production call:
  // const confirmationResult = await signInWithPhoneNumber(auth, payload.phoneNumber, appVerifier);
  // return { verificationId: confirmationResult.verificationId };
  throw new Error('Production SMS service not configured in this environment.');
}

/**
 * Production SMS OTP Code Verifier.
 * Requires user to supply the 6-digit one-time code sent via SMS.
 */
export async function verifyProductionPhoneOtp(
  payload: ProductionOtpVerificationPayload
): Promise<{ success: boolean; userProfile: UserProfile }> {
  if (AUTH_ENVIRONMENT === 'development') {
    throw new Error(
      'SECURITY WARNING: Production OTP verification is not active in demo mode.'
    );
  }

  // Example production verification:
  // const userCredential = await confirmationResult.confirm(payload.smsOtpCode);
  // return userCredential;
  throw new Error('Production SMS verification not configured.');
}
