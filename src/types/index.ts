export type SkillCategory =
  | 'Music & Audio'
  | 'Home & Garden'
  | 'Tech & Digital'
  | 'Languages'
  | 'Culinary & Baking'
  | 'Crafts & Repair'
  | 'Wellness & Fitness';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description?: string;
}

export interface UserReview {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  skillExchanged: string;
  comment: string;
}

export interface UserProfile {
  id: string;
  phoneNumber: string; // 10 digits clean
  name: string;
  neighborhood: string;
  distanceMiles: number;
  bio: string;
  avatarUrl: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  hoursBanked: number;
  swapsCompleted: number;
  rating: number;
  reviewCount: number;
  reviews: UserReview[];
  joinedDate: string;
  isDemoAccount: boolean;
}

export type ExchangeStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export interface ExchangeMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ExchangeRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserPhone: string;
  toUserId: string;
  toUserName: string;
  toUserPhone: string;
  offeredSkill: string;
  requestedSkill: string;
  proposedDurationHours: number;
  status: ExchangeStatus;
  createdAt: string;
  message: string;
  preferredFormat: 'In-person local' | 'Online video' | 'Flexible';
  meetingLocation?: string;
  scheduledTime?: string;
  messages: ExchangeMessage[];
}

export interface DemoSession {
  phoneNumber: string;
  user: UserProfile;
  token: string;
  loginTimestamp: number;
  isDemo: boolean;
}
