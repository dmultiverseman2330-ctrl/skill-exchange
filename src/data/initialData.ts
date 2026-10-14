import { UserProfile, ExchangeRequest } from '../types';

export const AUTHORIZED_DEMO_NUMBERS = ['9990003331', '8880002221'] as const;

export const DEMO_PROFILES: Record<string, UserProfile> = {
  '9990003331': {
    id: 'user_dharani_9990003331',
    phoneNumber: '9990003331',
    name: 'Dharani',
    neighborhood: 'Maplewood Green',
    distanceMiles: 0.3,
    bio: 'Acoustic fingerstyle player & organic container gardener. Passionate about neighborhood skill sharing and community building.',
    avatarUrl: '',
    hoursBanked: 8,
    swapsCompleted: 14,
    rating: 4.9,
    reviewCount: 18,
    joinedDate: 'Joined March 2025',
    isDemoAccount: true,
    skillsOffered: [
      {
        id: 'sk_guitar_1',
        name: 'Acoustic Guitar & Chords',
        category: 'Music & Audio',
        level: 'Advanced',
        description: 'Fingerpicking basics, open chords, and rhythm strumming for beginners and intermediate players.'
      },
      {
        id: 'sk_garden_1',
        name: 'Organic Container Gardening',
        category: 'Home & Garden',
        level: 'Expert',
        description: 'Soil mixing, seedling nurturing, drip hacks, and balcony vegetable yield maximization.'
      },
      {
        id: 'sk_bike_1',
        name: 'Bicycle Tune-ups & Flat Fixes',
        category: 'Crafts & Repair',
        level: 'Intermediate',
        description: 'Derailleur adjustments, brake pad tuning, chain cleaning, and tube puncture repairs.'
      }
    ],
    skillsWanted: [
      {
        id: 'sk_span_1',
        name: 'Conversational Spanish',
        category: 'Languages',
        level: 'Beginner',
        description: 'Practicing daily conversation, travel vocabulary, and grammar basics.'
      },
      {
        id: 'sk_react_1',
        name: 'React & Frontend Web Design',
        category: 'Tech & Digital',
        level: 'Beginner',
        description: 'Building small interactive components and responsive layouts.'
      },
      {
        id: 'sk_bake_1',
        name: 'Sourdough Bread Crafting',
        category: 'Culinary & Baking',
        level: 'Beginner',
        description: 'Wild yeast starter maintenance and dutch-oven boule baking.'
      }
    ],
    reviews: [
      {
        id: 'rev_1',
        authorName: 'Marcus Vance',
        rating: 5,
        date: '2 weeks ago',
        skillExchanged: 'Acoustic Guitar',
        comment: 'Dharani broke down fingerstyle patterns so clearly. After 1 hour I can play my favorite progression.'
      },
      {
        id: 'rev_2',
        authorName: 'Elena Rostova',
        rating: 5,
        date: '1 month ago',
        skillExchanged: 'Organic Gardening',
        comment: 'Helped revitalize my raised garden bed. Incredible depth of knowledge on soil composition.'
      }
    ]
  },

  '8880002221': {
    id: 'user_sivaraj_8880002221',
    phoneNumber: '8880002221',
    name: 'Sivaraj',
    neighborhood: 'Elmwood Arts District',
    distanceMiles: 1.1,
    bio: 'Frontend developer, creative technologist, and multilingual speaker. Seeking tactile crafts, music swaps, and urban gardening.',
    avatarUrl: '',
    hoursBanked: 6,
    swapsCompleted: 9,
    rating: 5.0,
    reviewCount: 12,
    joinedDate: 'Joined April 2025',
    isDemoAccount: true,
    skillsOffered: [
      {
        id: 'sk_web_2',
        name: 'React & Tailwind CSS',
        category: 'Tech & Digital',
        level: 'Expert',
        description: 'Modern component architecture, responsive Tailwind styling, and clean code workflows.'
      },
      {
        id: 'sk_mandarin_2',
        name: 'Conversational Mandarin',
        category: 'Languages',
        level: 'Expert',
        description: 'Native pronunciation, everyday conversational phrases, and pinyin fundamentals.'
      },
      {
        id: 'sk_illustrate_2',
        name: 'Digital Illustration & Figma',
        category: 'Tech & Digital',
        level: 'Intermediate',
        description: 'Vector graphics, moodboarding, and responsive wireframing.'
      }
    ],
    skillsWanted: [
      {
        id: 'sk_guitar_2',
        name: 'Acoustic Guitar & Chords',
        category: 'Music & Audio',
        level: 'Beginner',
        description: 'Want to learn campfire strumming and basic melody patterns.'
      },
      {
        id: 'sk_wood_2',
        name: 'Woodworking & Hand Tools',
        category: 'Crafts & Repair',
        level: 'Beginner',
        description: 'Joinery basics, hand plane usage, and crafting small wooden boxes.'
      },
      {
        id: 'sk_tea_2',
        name: 'Herbal Tea Blending',
        category: 'Culinary & Baking',
        level: 'Beginner',
        description: 'Drying local botanicals and crafting customized infusion blends.'
      }
    ],
    reviews: [
      {
        id: 'rev_3',
        authorName: 'David Kim',
        rating: 5,
        date: '3 weeks ago',
        skillExchanged: 'React & Tailwind CSS',
        comment: 'Sivaraj helped me debug my portfolio and set up responsive navigation in one focused session.'
      },
      {
        id: 'rev_4',
        authorName: 'Priya Patel',
        rating: 5,
        date: '2 months ago',
        skillExchanged: 'Conversational Mandarin',
        comment: 'So patient and encouraging with tones and everyday dialogue practice.'
      }
    ]
  }
};

export const NEIGHBOR_PROFILES: UserProfile[] = [
  {
    id: 'user_marcus_vance',
    phoneNumber: '7770001111',
    name: 'Marcus Vance',
    neighborhood: 'Old Mill Basin',
    distanceMiles: 0.8,
    bio: 'Bicycle mechanic by trade, sourdough baker on weekends. Trading workshop hours for language coaching and music.',
    avatarUrl: '',
    hoursBanked: 11,
    swapsCompleted: 22,
    rating: 4.8,
    reviewCount: 26,
    joinedDate: 'Joined January 2025',
    isDemoAccount: false,
    skillsOffered: [
      {
        id: 'sk_marcus_1',
        name: 'Sourdough Bread Crafting',
        category: 'Culinary & Baking',
        level: 'Advanced',
        description: 'High hydration dough, bench knife shaping, scoring techniques, and crust blister mastery.'
      },
      {
        id: 'sk_marcus_2',
        name: 'Bicycle Wheel Truing & Overhauls',
        category: 'Crafts & Repair',
        level: 'Expert',
        description: 'Spoke tension balancing, bottom bracket servicing, and drivetrain degreasing.'
      }
    ],
    skillsWanted: [
      {
        id: 'sk_marcus_w1',
        name: 'Acoustic Guitar & Chords',
        category: 'Music & Audio',
        level: 'Beginner',
        description: 'Folk guitar basics and rhythm control.'
      },
      {
        id: 'sk_marcus_w2',
        name: 'Conversational Spanish',
        category: 'Languages',
        level: 'Beginner',
        description: 'Basic travel dialogue.'
      }
    ],
    reviews: []
  },
  {
    id: 'user_elena_rostova',
    phoneNumber: '6660005555',
    name: 'Elena Rostova',
    neighborhood: 'Cedar Hills',
    distanceMiles: 1.4,
    bio: 'Bilingual educator and oil painter. Eager to trade immersive Spanish conversation for container gardening guidance.',
    avatarUrl: '',
    hoursBanked: 5,
    swapsCompleted: 16,
    rating: 4.9,
    reviewCount: 20,
    joinedDate: 'Joined February 2025',
    isDemoAccount: false,
    skillsOffered: [
      {
        id: 'sk_elena_1',
        name: 'Conversational Spanish',
        category: 'Languages',
        level: 'Expert',
        description: 'Grammar nuances, pronunciation coaching, and cultural idioms for all stages.'
      },
      {
        id: 'sk_elena_2',
        name: 'Oil Painting on Canvas',
        category: 'Crafts & Repair',
        level: 'Advanced',
        description: 'Color theory, glazing techniques, and composition for still lifes and landscapes.'
      }
    ],
    skillsWanted: [
      {
        id: 'sk_elena_w1',
        name: 'Organic Container Gardening',
        category: 'Home & Garden',
        level: 'Beginner',
        description: 'Balcony tomato setup and soil health.'
      }
    ],
    reviews: []
  },
  {
    id: 'user_david_kim',
    phoneNumber: '5550004444',
    name: 'David Kim',
    neighborhood: 'Pine Ridge',
    distanceMiles: 2.1,
    bio: 'Cabinetmaker and classical piano tutor. Happy to share workshop safety and woodworking joinery.',
    avatarUrl: '',
    hoursBanked: 9,
    swapsCompleted: 18,
    rating: 4.9,
    reviewCount: 15,
    joinedDate: 'Joined November 2024',
    isDemoAccount: false,
    skillsOffered: [
      {
        id: 'sk_david_1',
        name: 'Woodworking & Hand Tools',
        category: 'Crafts & Repair',
        level: 'Expert',
        description: 'Mortise & tenon joints, hand plane sharpening, and timber selection.'
      },
      {
        id: 'sk_david_2',
        name: 'Classical Piano & Ear Training',
        category: 'Music & Audio',
        level: 'Advanced',
        description: 'Sight reading, posture, and melodic interval recognition.'
      }
    ],
    skillsWanted: [
      {
        id: 'sk_david_w1',
        name: 'React & Frontend Web Design',
        category: 'Tech & Digital',
        level: 'Beginner',
        description: 'Online portfolio site setup.'
      }
    ],
    reviews: []
  },
  {
    id: 'user_priya_patel',
    phoneNumber: '4440007777',
    name: 'Priya Patel',
    neighborhood: 'South Terrace',
    distanceMiles: 1.8,
    bio: 'Herbalist, tea crafter, and morning vinyasa practitioner. Trading herbal compounding for web coding or bike fixes.',
    avatarUrl: '',
    hoursBanked: 7,
    swapsCompleted: 11,
    rating: 5.0,
    reviewCount: 14,
    joinedDate: 'Joined March 2025',
    isDemoAccount: false,
    skillsOffered: [
      {
        id: 'sk_priya_1',
        name: 'Herbal Tea Blending',
        category: 'Culinary & Baking',
        level: 'Expert',
        description: 'Medicinal properties, aroma balancing, drying garden herbs, and infusing tinctures.'
      },
      {
        id: 'sk_priya_2',
        name: 'Vinyasa Flow & Posture Alignment',
        category: 'Wellness & Fitness',
        level: 'Advanced',
        description: 'Breath coordination, spine decompression, and gentle mobility sequences.'
      }
    ],
    skillsWanted: [
      {
        id: 'sk_priya_w1',
        name: 'Bicycle Tune-ups & Flat Fixes',
        category: 'Crafts & Repair',
        level: 'Beginner',
        description: 'Commuter bike brake tuning.'
      }
    ],
    reviews: []
  }
];

export const INITIAL_EXCHANGE_REQUESTS: ExchangeRequest[] = [
  {
    id: 'req_dharani_to_sivaraj_1',
    fromUserId: 'user_dharani_9990003331',
    fromUserName: 'Dharani',
    fromUserPhone: '9990003331',
    toUserId: 'user_sivaraj_8880002221',
    toUserName: 'Sivaraj',
    toUserPhone: '8880002221',
    offeredSkill: 'Acoustic Guitar & Chords',
    requestedSkill: 'React & Tailwind CSS',
    proposedDurationHours: 1.5,
    status: 'pending',
    createdAt: 'Yesterday, 4:15 PM',
    message: 'Hey Sivaraj! I saw your React profile. I would love to trade 90 mins of guitar fingerpicking lessons for some guidance setting up my community blog components.',
    preferredFormat: 'In-person local',
    meetingLocation: 'Maplewood Community Center Patio or Elmwood Cafe',
    scheduledTime: 'This Saturday at 2:00 PM',
    messages: [
      {
        id: 'm1',
        senderId: 'user_dharani_9990003331',
        senderName: 'Dharani',
        text: 'Hey Sivaraj! I saw your React profile. I would love to trade 90 mins of guitar fingerpicking lessons for some guidance setting up my community blog components.',
        timestamp: 'Yesterday, 4:15 PM'
      }
    ]
  },
  {
    id: 'req_marcus_to_dharani_2',
    fromUserId: 'user_marcus_vance',
    fromUserName: 'Marcus Vance',
    fromUserPhone: '7770001111',
    toUserId: 'user_dharani_9990003331',
    toUserName: 'Dharani',
    toUserPhone: '9990003331',
    offeredSkill: 'Sourdough Bread Crafting',
    requestedSkill: 'Organic Container Gardening',
    proposedDurationHours: 1.0,
    status: 'accepted',
    createdAt: '2 days ago',
    message: 'Dharani! I have a fresh sourdough loaf ready to bake this Sunday and can give you a jar of 5-year active starter in exchange for your garden soil tips.',
    preferredFormat: 'In-person local',
    meetingLocation: 'Marcus’s Kitchen Workshop, Old Mill Basin',
    scheduledTime: 'Sunday, Oct 19 · 10:30 AM',
    messages: [
      {
        id: 'm2',
        senderId: 'user_marcus_vance',
        senderName: 'Marcus Vance',
        text: 'Dharani! I have a fresh sourdough loaf ready to bake this Sunday and can give you a jar of 5-year active starter in exchange for your garden soil tips.',
        timestamp: '2 days ago'
      },
      {
        id: 'm3',
        senderId: 'user_dharani_9990003331',
        senderName: 'Dharani',
        text: 'Deal! I will bring some organic compost tea and my soil test kit.',
        timestamp: 'Yesterday, 10:00 AM'
      }
    ]
  },
  {
    id: 'req_elena_to_dharani_3',
    fromUserId: 'user_elena_rostova',
    fromUserName: 'Elena Rostova',
    fromUserPhone: '6660005555',
    toUserId: 'user_dharani_9990003331',
    toUserName: 'Dharani',
    toUserPhone: '9990003331',
    offeredSkill: 'Conversational Spanish',
    requestedSkill: 'Bicycle Tune-ups & Flat Fixes',
    proposedDurationHours: 1.0,
    status: 'pending',
    createdAt: '3 hours ago',
    message: 'Hola Dharani! My commuter bicycle has a loose rear brake and slipping chain. Would you be up for a 1-hour swap for conversational Spanish practice?',
    preferredFormat: 'In-person local',
    meetingLocation: 'Cedar Hills Community Bike Rack',
    messages: [
      {
        id: 'm4',
        senderId: 'user_elena_rostova',
        senderName: 'Elena Rostova',
        text: 'Hola Dharani! My commuter bicycle has a loose rear brake and slipping chain. Would you be up for a 1-hour swap for conversational Spanish practice?',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 'req_priya_to_sivaraj_4',
    fromUserId: 'user_priya_patel',
    fromUserName: 'Priya Patel',
    fromUserPhone: '4440007777',
    toUserId: 'user_sivaraj_8880002221',
    toUserName: 'Sivaraj',
    toUserPhone: '8880002221',
    offeredSkill: 'Herbal Tea Blending',
    requestedSkill: 'Digital Illustration & Figma',
    proposedDurationHours: 1.5,
    status: 'accepted',
    createdAt: 'Yesterday, 11:20 AM',
    message: 'Hi Sivaraj! I’d love to design botanical labels for my tea jars using Figma in exchange for teaching you herbal infusion blending.',
    preferredFormat: 'Flexible',
    meetingLocation: 'South Terrace Tea Room or Zoom',
    scheduledTime: 'Friday, Oct 24 · 4:00 PM',
    messages: [
      {
        id: 'm5',
        senderId: 'user_priya_patel',
        senderName: 'Priya Patel',
        text: 'Hi Sivaraj! I’d love to design botanical labels for my tea jars using Figma in exchange for teaching you herbal infusion blending.',
        timestamp: 'Yesterday, 11:20 AM'
      },
      {
        id: 'm6',
        senderId: 'user_sivaraj_8880002221',
        senderName: 'Sivaraj',
        text: 'That sounds delightful Priya! I have a template library ready we can adapt.',
        timestamp: 'Yesterday, 1:40 PM'
      }
    ]
  }
];
