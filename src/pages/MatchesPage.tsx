import React, { useState, useMemo } from 'react';
import { UserProfile, SkillCategory, ExchangeRequest } from '../types';
import { getAllProfiles, getAllExchanges } from '../services/storage';
import { ProposeSwapModal } from '../components/ProposeSwapModal';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ArrowRightLeft,
  Sparkles,
  CheckCircle,
  Clock,
  Star,
} from 'lucide-react';

interface MatchesPageProps {
  currentUser: UserProfile;
  onNavigate: (route: string) => void;
}

const CATEGORIES: (SkillCategory | 'All Categories')[] = [
  'All Categories',
  'Music & Audio',
  'Home & Garden',
  'Tech & Digital',
  'Languages',
  'Culinary & Baking',
  'Crafts & Repair',
  'Wellness & Fitness',
];

export const MatchesPage: React.FC<MatchesPageProps> = ({ currentUser, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All Categories'>('All Categories');
  const [maxDistanceMiles, setMaxDistanceMiles] = useState<number>(5.0);
  const [selectedNeighborForSwap, setSelectedNeighborForSwap] = useState<UserProfile | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const allProfiles = useMemo(() => {
    const dict = getAllProfiles();
    // Exclude current user from matches list
    return Object.values(dict).filter((p) => p.id !== currentUser.id && p.phoneNumber !== currentUser.phoneNumber);
  }, [currentUser]);

  // Filter neighbors based on query, category, and radius
  const filteredNeighbors = useMemo(() => {
    return allProfiles.filter((neighbor) => {
      // Distance filter
      if (neighbor.distanceMiles > maxDistanceMiles) return false;

      // Category filter
      if (selectedCategory !== 'All Categories') {
        const hasCategory =
          neighbor.skillsOffered.some((sk) => sk.category === selectedCategory) ||
          neighbor.skillsWanted.some((sk) => sk.category === selectedCategory);
        if (!hasCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = neighbor.name.toLowerCase().includes(q);
        const matchesNeighborhood = neighbor.neighborhood.toLowerCase().includes(q);
        const matchesOffered = neighbor.skillsOffered.some(
          (sk) => sk.name.toLowerCase().includes(q) || sk.description?.toLowerCase().includes(q)
        );
        const matchesWanted = neighbor.skillsWanted.some(
          (sk) => sk.name.toLowerCase().includes(q) || sk.description?.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesNeighborhood && !matchesOffered && !matchesWanted) {
          return false;
        }
      }

      return true;
    });
  }, [allProfiles, maxDistanceMiles, selectedCategory, searchQuery]);

  // Compute reciprocity compatibility score
  const getCompatibility = (neighbor: UserProfile) => {
    const userWants = currentUser.skillsWanted.map((s) => s.name.toLowerCase());
    const userOffers = currentUser.skillsOffered.map((s) => s.name.toLowerCase());

    const neighborOffersMatching = neighbor.skillsOffered.some((sk) =>
      userWants.some((w) => sk.name.toLowerCase().includes(w) || w.includes(sk.name.toLowerCase()))
    );

    const neighborWantsMatching = neighbor.skillsWanted.some((sk) =>
      userOffers.some((o) => sk.name.toLowerCase().includes(o) || o.includes(sk.name.toLowerCase()))
    );

    if (neighborOffersMatching && neighborWantsMatching) {
      return { isReciprocal: true, label: 'Perfect 2-Way Match' };
    }
    if (neighborOffersMatching) {
      return { isReciprocal: false, label: 'Teaches what you seek' };
    }
    if (neighborWantsMatching) {
      return { isReciprocal: false, label: 'Seeking your skill' };
    }
    return null;
  };

  const handleSwapCreated = (newExchange: ExchangeRequest) => {
    setFeedbackToast(`Swap proposal sent to ${newExchange.toUserName}!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Toast Notification */}
      {feedbackToast && (
        <div 
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header and Filter Controls */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Local Skill Barter Matches
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Discover neighbors within your local radius ready to trade skills, craftsmanship, and lessons.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills (e.g. Guitar, React, Gardening, Spanish, Baking)..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            {/* Distance Slider */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg shrink-0">
              <span className="text-xs font-semibold text-stone-700 whitespace-nowrap">
                Radius: <span className="font-mono-data text-emerald-800">{maxDistanceMiles.toFixed(1)} mi</span>
              </span>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                value={maxDistanceMiles}
                onChange={(e) => setMaxDistanceMiles(parseFloat(e.target.value))}
                className="w-24 sm:w-32 accent-emerald-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Neighbor Cards Grid */}
      {filteredNeighbors.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <SlidersHorizontal className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-base font-semibold text-stone-900">No matching neighbors found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try widening your radius slider or clearing the category filter to discover more trades.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setMaxDistanceMiles(10.0);
            }}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNeighbors.map((neighbor) => {
            const comp = getCompatibility(neighbor);
            return (
              <div
                key={neighbor.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-300 transition-all"
              >
                <div className="space-y-3.5">
                  {/* Top Bar of card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 text-stone-800 font-bold flex items-center justify-center text-sm">
                        {neighbor.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900">
                          {neighbor.name}
                        </h3>
                        <p className="text-[11px] text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{neighbor.neighborhood}</span>
                          <span className="font-mono-data">({neighbor.distanceMiles} mi)</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-mono-data text-stone-800">{neighbor.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono-data">
                        {neighbor.reviewCount} swaps
                      </span>
                    </div>
                  </div>

                  {/* Compatibility banner */}
                  {comp && (
                    <div
                      className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 font-medium ${
                        comp.isReciprocal
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{comp.label}</span>
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {neighbor.bio}
                  </p>

                  {/* Skills Offered List */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                      Teaches / Offers:
                    </span>
                    <div className="space-y-1">
                      {neighbor.skillsOffered.map((sk) => (
                        <div
                          key={sk.id}
                          className="text-xs flex items-center justify-between text-stone-800"
                        >
                          <span className="font-medium truncate max-w-[180px]">{sk.name}</span>
                          <span className="text-[11px] text-stone-500 shrink-0">
                            {sk.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Wanted List */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
                      Seeking to Learn:
                    </span>
                    <div className="space-y-1">
                      {neighbor.skillsWanted.map((sk) => (
                        <div
                          key={sk.id}
                          className="text-xs flex items-center justify-between text-stone-700"
                        >
                          <span className="truncate max-w-[180px]">{sk.name}</span>
                          <span className="text-[11px] text-stone-500 shrink-0">
                            {sk.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-mono-data">
                    {neighbor.hoursBanked}h credits banked
                  </span>

                  <button
                    onClick={() => setSelectedNeighborForSwap(neighbor)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3 h-3" />
                    <span>Propose Swap</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Propose Swap Modal */}
      {selectedNeighborForSwap && (
        <ProposeSwapModal
          currentUser={currentUser}
          targetNeighbor={selectedNeighborForSwap}
          isOpen={Boolean(selectedNeighborForSwap)}
          onClose={() => setSelectedNeighborForSwap(null)}
          onSuccess={handleSwapCreated}
        />
      )}
    </div>
  );
};
