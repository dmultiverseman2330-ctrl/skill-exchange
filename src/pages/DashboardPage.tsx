import React, { useState } from 'react';
import { UserProfile, ExchangeRequest } from '../types';
import { getAllExchanges, updateExchangeStatus, getAllProfiles } from '../services/storage';
import { formatPhoneNumber } from '../services/auth';
import { ProposeSwapModal } from '../components/ProposeSwapModal';
import {
  Clock,
  CheckCircle2,
  ArrowRightLeft,
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  UserCheck,
  Check,
  X,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

interface DashboardPageProps {
  currentUser: UserProfile;
  onNavigate: (route: string) => void;
  onProfileUpdate?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>(() => getAllExchanges());
  const [selectedNeighborForSwap, setSelectedNeighborForSwap] = useState<UserProfile | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Incoming requests waiting for current user's approval
  const incomingRequests = exchanges.filter(
    (ex) => (ex.toUserId === currentUser.id || ex.toUserPhone === currentUser.phoneNumber) && ex.status === 'pending'
  );

  // Confirmed scheduled exchanges
  const confirmedSwaps = exchanges.filter(
    (ex) =>
      (ex.fromUserId === currentUser.id ||
        ex.fromUserPhone === currentUser.phoneNumber ||
        ex.toUserId === currentUser.id ||
        ex.toUserPhone === currentUser.phoneNumber) &&
      ex.status === 'accepted'
  );

  // Identify complementary barter partner (reciprocal match)
  const allProfiles = getAllProfiles();
  const isDharani = currentUser.phoneNumber === '9990003331';
  const reciprocalPartner = isDharani ? allProfiles['8880002221'] : allProfiles['9990003331'];

  const handleStatusChange = (requestId: string, newStatus: ExchangeRequest['status']) => {
    updateExchangeStatus(requestId, newStatus);
    setExchanges(getAllExchanges());
    const label = newStatus === 'accepted' ? 'Accepted exchange proposal' : 'Declined proposal';
    setFeedbackToast(label);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleSwapCreated = (newExchange: ExchangeRequest) => {
    setExchanges(getAllExchanges());
    setFeedbackToast(`Swap proposal sent to ${newExchange.toUserName}!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Toast notification */}
      {feedbackToast && (
        <div 
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="p-6 sm:p-8 lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Hyperlocal Skill Network</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500 font-mono-data">{formatPhoneNumber(currentUser.phoneNumber)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 text-wrap-balance">
              Welcome back, {currentUser.name}
            </h1>
            
            <p className="text-sm text-stone-600 mt-2 max-w-xl leading-relaxed">
              You are connected to SkillLoop in {currentUser.neighborhood}. Teach what you know, learn what you love, and build local resilience.
            </p>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <button
                onClick={() => onNavigate('matches')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Local Matches</span>
              </button>

              <button
                onClick={() => onNavigate('exchanges')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-stone-500" />
                <span>Manage Exchanges ({exchanges.length})</span>
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium px-2 py-1 transition-colors cursor-pointer"
              >
                Edit My Skills
              </button>
            </div>
          </div>

          {/* Hero Image integration */}
          <div className="lg:col-span-5 h-48 lg:h-full relative overflow-hidden border-t lg:border-t-0 lg:border-l border-stone-200">
            <img
              src="/src/assets/images/hero_skill_exchange_1791953832828.jpg"
              alt="Community skill exchange gathering"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-white/90 font-medium">
                Maplewood & Elmwood Neighborhood Barter Network
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stat Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Time Banking Credits</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono-data text-stone-900">
            {currentUser.hoursBanked}.0 <span className="text-xs font-normal text-stone-500">hours</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Available for lessons & swaps</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Exchanges Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono-data text-stone-900">
            {currentUser.swapsCompleted}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            ★ {currentUser.rating.toFixed(1)} ({currentUser.reviewCount} neighbor reviews)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Pending Inquiries</span>
            <ArrowRightLeft className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono-data text-stone-900">
            {incomingRequests.length}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {incomingRequests.length > 0 ? 'Awaiting your response' : 'All caught up'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Local Radius</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono-data text-stone-900">
            {currentUser.distanceMiles} <span className="text-xs font-normal text-stone-500">mi</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">{currentUser.neighborhood}</p>
        </div>
      </div>

      {/* Reciprocal Barter Highlight (Alex <-> Maya pairing) */}
      {reciprocalPartner && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Reciprocal Skill Barter Match</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {reciprocalPartner.name} wants what you teach, and teaches what you want!
              </h3>
              <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                {isDharani ? (
                  <>
                    Sivaraj offers <strong>React & Tailwind Web Design</strong> and is seeking <strong>Acoustic Guitar</strong> lessons. He lives only 1.1 miles away in Elmwood.
                  </>
                ) : (
                  <>
                    Dharani offers <strong>Acoustic Guitar Lessons</strong> and is seeking <strong>Frontend React / Web Design</strong> guidance. She lives only 0.3 miles away in Maplewood.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedNeighborForSwap(reciprocalPartner)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Propose Swap with {reciprocalPartner.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Split Grid: Incoming Requests & Confirmed Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Pending Incoming Requests */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Incoming Skill Requests ({incomingRequests.length})
            </h2>
            <button
              onClick={() => onNavigate('exchanges')}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-medium flex items-center gap-0.5 cursor-pointer"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="py-8 text-center text-stone-500 text-xs">
              <p className="font-medium text-stone-700">No pending incoming requests right now.</p>
              <p className="mt-1">When neighbors propose an exchange, they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        {req.fromUserName}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Proposed swap: You teach <span className="font-semibold text-stone-800">{req.requestedSkill}</span> in exchange for <span className="font-semibold text-stone-800">{req.offeredSkill}</span>
                      </p>
                    </div>
                    <span className="text-[11px] font-mono-data text-stone-500 whitespace-nowrap">
                      {req.createdAt}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 italic bg-white p-2.5 rounded-lg border border-stone-200/70">
                    "{req.message}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-stone-500 font-mono-data">
                      {req.proposedDurationHours}h · {req.preferredFormat}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStatusChange(req.id, 'declined')}
                        className="px-2.5 py-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 text-xs rounded transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleStatusChange(req.id, 'accepted')}
                        className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs rounded transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Accept Swap</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Confirmed Upcoming Sessions */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Confirmed Upcoming Swaps ({confirmedSwaps.length})
            </h2>
            <button
              onClick={() => onNavigate('exchanges')}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-medium flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {confirmedSwaps.length === 0 ? (
            <div className="py-8 text-center text-stone-500 text-xs">
              <p className="font-medium text-stone-700">No scheduled sessions at this moment.</p>
              <p className="mt-1">Accept a proposal or propose a swap with a neighbor to schedule a session.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {confirmedSwaps.map((swap) => {
                const partnerName =
                  swap.fromUserId === currentUser.id ? swap.toUserName : swap.fromUserName;
                return (
                  <div
                    key={swap.id}
                    className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        With {partnerName}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                        Confirmed
                      </span>
                    </div>

                    <div className="text-xs text-stone-700">
                      Trading: <strong className="font-semibold">{swap.offeredSkill}</strong> ⟷ <strong className="font-semibold">{swap.requestedSkill}</strong>
                    </div>

                    <div className="text-[11px] text-stone-600 flex items-center gap-2 flex-wrap">
                      {swap.scheduledTime && (
                        <span>⏰ {swap.scheduledTime}</span>
                      )}
                      {swap.meetingLocation && (
                        <span>📍 {swap.meetingLocation}</span>
                      )}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs border-t border-emerald-100">
                      <span className="text-stone-500 font-mono-data">Duration: {swap.proposedDurationHours}h</span>
                      <button
                        onClick={() => handleStatusChange(swap.id, 'completed')}
                        className="text-xs font-medium text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Skills Showcase Strip */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Your Exchange Profile Matrix</h2>
            <p className="text-xs text-stone-500">Skills you are currently trading in {currentUser.neighborhood}</p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer"
          >
            Edit Profile & Skills
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skills Offered */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
              Skills You Teach / Offer
            </span>
            <div className="space-y-1.5">
              {currentUser.skillsOffered.map((sk) => (
                <div key={sk.id} className="text-xs flex items-center justify-between py-1 border-b border-stone-200/60 last:border-0">
                  <span className="font-medium text-stone-900">{sk.name}</span>
                  <span className="text-[11px] text-stone-500">
                    {sk.category} · {sk.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
              Skills You Seek / Want to Learn
            </span>
            <div className="space-y-1.5">
              {currentUser.skillsWanted.map((sk) => (
                <div key={sk.id} className="text-xs flex items-center justify-between py-1 border-b border-stone-200/60 last:border-0">
                  <span className="font-medium text-stone-900">{sk.name}</span>
                  <span className="text-[11px] text-stone-500">
                    {sk.category} · {sk.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
