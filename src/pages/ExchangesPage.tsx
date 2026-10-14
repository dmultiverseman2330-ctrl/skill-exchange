import React, { useState } from 'react';
import { UserProfile, ExchangeRequest, ExchangeStatus } from '../types';
import {
  getAllExchanges,
  updateExchangeStatus,
  addMessageToExchange,
} from '../services/storage';
import {
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  MessageSquare,
  Calendar,
  MapPin,
  Check,
  X,
  User,
} from 'lucide-react';

interface ExchangesPageProps {
  currentUser: UserProfile;
}

type TabType = 'all' | 'incoming' | 'outgoing' | 'confirmed' | 'completed';

export const ExchangesPage: React.FC<ExchangesPageProps> = ({ currentUser }) => {
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>(() => getAllExchanges());
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter exchanges relevant to current user
  const userExchanges = exchanges.filter(
    (ex) =>
      ex.fromUserId === currentUser.id ||
      ex.fromUserPhone === currentUser.phoneNumber ||
      ex.toUserId === currentUser.id ||
      ex.toUserPhone === currentUser.phoneNumber
  );

  const filteredExchanges = userExchanges.filter((ex) => {
    const isToUser = ex.toUserId === currentUser.id || ex.toUserPhone === currentUser.phoneNumber;
    const isFromUser = ex.fromUserId === currentUser.id || ex.fromUserPhone === currentUser.phoneNumber;

    if (activeTab === 'incoming') return isToUser && ex.status === 'pending';
    if (activeTab === 'outgoing') return isFromUser && ex.status === 'pending';
    if (activeTab === 'confirmed') return ex.status === 'accepted';
    if (activeTab === 'completed') return ex.status === 'completed';
    return true;
  });

  const handleUpdateStatus = (requestId: string, status: ExchangeStatus) => {
    updateExchangeStatus(requestId, status);
    setExchanges(getAllExchanges());
    const label =
      status === 'accepted'
        ? 'Accepted exchange proposal!'
        : status === 'declined'
        ? 'Declined exchange'
        : status === 'completed'
        ? 'Marked exchange as completed. 1 Hour credited!'
        : 'Updated exchange status';
    setToastMessage(label);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendMessage = (requestId: string) => {
    const text = messageInputs[requestId]?.trim();
    if (!text) return;

    addMessageToExchange(requestId, {
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
    });

    setMessageInputs((prev) => ({ ...prev, [requestId]: '' }));
    setExchanges(getAllExchanges());
  };

  const getStatusBadge = (status: ExchangeStatus) => {
    switch (status) {
      case 'accepted':
        return <span className="text-emerald-700 font-semibold text-xs">● Confirmed</span>;
      case 'pending':
        return <span className="text-amber-700 font-semibold text-xs">● Pending Review</span>;
      case 'completed':
        return <span className="text-blue-700 font-semibold text-xs">● Completed & Banked</span>;
      case 'declined':
        return <span className="text-stone-500 font-medium text-xs">● Declined</span>;
      case 'cancelled':
        return <span className="text-stone-500 font-medium text-xs">● Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div 
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          My Skill Exchanges
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Review inbound trade inquiries, manage scheduled sessions, and coordinate lesson notes.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'all' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All Exchanges ({userExchanges.length})
        </button>
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'incoming' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Incoming Inquiries
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'outgoing' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Sent Proposals
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'confirmed' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Confirmed & Scheduled
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'completed' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Past & Completed
        </button>
      </div>

      {/* Exchanges List */}
      {filteredExchanges.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-2">
          <ArrowRightLeft className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-base font-semibold text-stone-900">No exchanges in this view</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You don't have any exchange requests matching the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExchanges.map((ex) => {
            const isToUser = ex.toUserId === currentUser.id || ex.toUserPhone === currentUser.phoneNumber;
            const partnerName = isToUser ? ex.fromUserName : ex.toUserName;

            return (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      {partnerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        Exchange with {partnerName}
                      </h3>
                      <p className="text-[11px] text-stone-500 font-mono-data">
                        {isToUser ? 'Incoming Request received' : 'Proposal sent by you'} · {ex.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(ex.status)}
                  </div>
                </div>

                {/* Swap Matrix Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase">
                      {isToUser ? 'You teach them:' : 'You will teach:'}
                    </span>
                    <p className="font-semibold text-stone-900 mt-0.5">
                      {isToUser ? ex.requestedSkill : ex.offeredSkill}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-amber-800 uppercase">
                      {isToUser ? 'They teach you:' : 'They will teach:'}
                    </span>
                    <p className="font-semibold text-stone-900 mt-0.5">
                      {isToUser ? ex.offeredSkill : ex.requestedSkill}
                    </p>
                  </div>
                </div>

                {/* Additional logistics */}
                <div className="flex items-center gap-4 text-xs text-stone-600 flex-wrap">
                  <span className="flex items-center gap-1 font-mono-data">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {ex.proposedDurationHours} Hours (1:1 Barter Credit)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {ex.meetingLocation || ex.preferredFormat}
                  </span>
                  {ex.scheduledTime && (
                    <span className="flex items-center gap-1 font-semibold text-emerald-900">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {ex.scheduledTime}
                    </span>
                  )}
                </div>

                {/* Action buttons based on status */}
                {isToUser && ex.status === 'pending' && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                    <button
                      onClick={() => handleUpdateStatus(ex.id, 'declined')}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ex.id, 'accepted')}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Exchange</span>
                    </button>
                  </div>
                )}

                {ex.status === 'accepted' && (
                  <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                    <span className="text-xs text-stone-500">
                      Session confirmed. Meet up and exchange knowledge!
                    </span>
                    <button
                      onClick={() => handleUpdateStatus(ex.id, 'completed')}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Complete & Deposit Time Credit
                    </button>
                  </div>
                )}

                {/* Conversation & Coordination Notes */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="text-[11px] font-semibold text-stone-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                    <span>Coordination Thread</span>
                  </div>

                  {ex.messages && ex.messages.length > 0 && (
                    <div className="space-y-1.5 bg-stone-50 p-3 rounded-lg border border-stone-200/60 max-h-48 overflow-y-auto">
                      {ex.messages.map((m) => {
                        const isMe = m.senderId === currentUser.id;
                        return (
                          <div
                            key={m.id}
                            className={`text-xs p-2 rounded-md ${
                              isMe ? 'bg-white ml-6 border border-stone-200/80' : 'bg-emerald-50/70 mr-6 border border-emerald-100'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-stone-500 mb-0.5">
                              <span className="font-semibold text-stone-800">
                                {isMe ? 'You' : m.senderName}
                              </span>
                              <span className="font-mono-data">{m.timestamp}</span>
                            </div>
                            <p className="text-stone-800 leading-relaxed">{m.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Send reply */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInputs[ex.id] || ''}
                      onChange={(e) =>
                        setMessageInputs({ ...messageInputs, [ex.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage(ex.id);
                      }}
                      placeholder={`Send note to ${partnerName}...`}
                      className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                    />
                    <button
                      onClick={() => handleSendMessage(ex.id)}
                      className="p-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg transition-colors cursor-pointer"
                      title="Send message"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
