import { UserProfile, ExchangeRequest } from '../types';
import { DEMO_PROFILES, NEIGHBOR_PROFILES, INITIAL_EXCHANGE_REQUESTS } from '../data/initialData';

const STORAGE_KEYS = {
  USER_PROFILES: 'skillloop_profiles_v1',
  EXCHANGES: 'skillloop_exchanges_v1',
  AUTH_SESSION: 'skillloop_demo_session_v1',
};

// Initialize localStorage if empty or migrate legacy profiles
export function initLocalStorage(): void {
  try {
    const rawProfiles = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    if (!rawProfiles) {
      const allProfiles: Record<string, UserProfile> = { ...DEMO_PROFILES };
      NEIGHBOR_PROFILES.forEach((neighbor) => {
        allProfiles[neighbor.phoneNumber] = neighbor;
      });
      localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(allProfiles));
    } else {
      // Auto-migrate if stored names are old
      const parsed = JSON.parse(rawProfiles);
      if (parsed['9990003331']?.name !== 'Dharani' || parsed['8880002221']?.name !== 'Sivaraj') {
        parsed['9990003331'] = { ...DEMO_PROFILES['9990003331'] };
        parsed['8880002221'] = { ...DEMO_PROFILES['8880002221'] };
        localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(parsed));
      }
    }

    const rawExchanges = localStorage.getItem(STORAGE_KEYS.EXCHANGES);
    if (!rawExchanges) {
      localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(INITIAL_EXCHANGE_REQUESTS));
    } else {
      // Auto-migrate legacy exchange names
      if (rawExchanges.includes('Alex Rivera') || rawExchanges.includes('Maya Chen')) {
        localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(INITIAL_EXCHANGE_REQUESTS));
      }
    }
  } catch (e) {
    console.warn('LocalStorage error in initLocalStorage:', e);
  }
}

export function getAllProfiles(): Record<string, UserProfile> {
  initLocalStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse profiles from localStorage', e);
  }
  return DEMO_PROFILES;
}

export function getProfileByPhone(phone: string): UserProfile | null {
  const cleanPhone = phone.replace(/\D/g, '');
  const profiles = getAllProfiles();
  return profiles[cleanPhone] || null;
}

export function getProfileById(id: string): UserProfile | null {
  const profiles = getAllProfiles();
  const found = Object.values(profiles).find((p) => p.id === id);
  return found || null;
}

export function saveProfile(profile: UserProfile): void {
  const profiles = getAllProfiles();
  profiles[profile.phoneNumber] = profile;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getAllExchanges(): ExchangeRequest[] {
  initLocalStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXCHANGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse exchanges from localStorage', e);
  }
  return INITIAL_EXCHANGE_REQUESTS;
}

export function saveAllExchanges(exchanges: ExchangeRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(exchanges));
  } catch (e) {
    console.error('Failed to save exchanges', e);
  }
}

export function addExchangeRequest(request: ExchangeRequest): void {
  const current = getAllExchanges();
  const updated = [request, ...current];
  saveAllExchanges(updated);
}

export function updateExchangeStatus(requestId: string, newStatus: ExchangeRequest['status']): void {
  const current = getAllExchanges();
  const updated = current.map((req) => {
    if (req.id === requestId) {
      return { ...req, status: newStatus };
    }
    return req;
  });
  saveAllExchanges(updated);
}

export function addMessageToExchange(requestId: string, message: { senderId: string; senderName: string; text: string }): void {
  const current = getAllExchanges();
  const updated = current.map((req) => {
    if (req.id === requestId) {
      const messages = req.messages || [];
      const newMsg = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...message,
        timestamp: 'Just now',
      };
      return { ...req, messages: [...messages, newMsg] };
    }
    return req;
  });
  saveAllExchanges(updated);
}

export function resetDemoDataToDefaults(): void {
  try {
    const allProfiles: Record<string, UserProfile> = { ...DEMO_PROFILES };
    NEIGHBOR_PROFILES.forEach((neighbor) => {
      allProfiles[neighbor.phoneNumber] = neighbor;
    });
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(allProfiles));
    localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(INITIAL_EXCHANGE_REQUESTS));
  } catch (e) {
    console.error('Failed to reset demo data', e);
  }
}
