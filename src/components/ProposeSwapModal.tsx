import React, { useState } from 'react';
import { UserProfile, ExchangeRequest } from '../types';
import { addExchangeRequest } from '../services/storage';
import { X, ArrowRightLeft, Send, MapPin, Clock, Calendar } from 'lucide-react';

interface ProposeSwapModalProps {
  currentUser: UserProfile;
  targetNeighbor: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newExchange: ExchangeRequest) => void;
}

export const ProposeSwapModal: React.FC<ProposeSwapModalProps> = ({
  currentUser,
  targetNeighbor,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [offeredSkill, setOfferedSkill] = useState(
    currentUser.skillsOffered[0]?.name || 'Skill Instruction'
  );
  const [requestedSkill, setRequestedSkill] = useState(
    targetNeighbor.skillsOffered[0]?.name || 'Skill Learning'
  );
  const [durationHours, setDurationHours] = useState<number>(1.0);
  const [format, setFormat] = useState<'In-person local' | 'Online video' | 'Flexible'>('In-person local');
  const [message, setMessage] = useState('');
  const [locationSuggestion, setLocationSuggestion] = useState(
    `${currentUser.neighborhood} Park or Community Library`
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newRequest: ExchangeRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserPhone: currentUser.phoneNumber,
      toUserId: targetNeighbor.id,
      toUserName: targetNeighbor.name,
      toUserPhone: targetNeighbor.phoneNumber,
      offeredSkill,
      requestedSkill,
      proposedDurationHours: durationHours,
      status: 'pending',
      createdAt: 'Just now',
      message: message.trim() || `Hi ${targetNeighbor.name}! I would love to trade ${offeredSkill} for your expertise in ${requestedSkill}.`,
      preferredFormat: format,
      meetingLocation: locationSuggestion,
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: message.trim() || `Hi ${targetNeighbor.name}! I would love to trade ${offeredSkill} for your expertise in ${requestedSkill}.`,
          timestamp: 'Just now',
        },
      ],
    };

    addExchangeRequest(newRequest);
    setSubmitting(false);
    onSuccess(newRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="swap-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 id="swap-modal-title" className="text-base font-bold text-stone-900">
                Propose Skill Swap
              </h2>
              <p className="text-xs text-stone-500">
                With {targetNeighbor.name} ({targetNeighbor.neighborhood})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Barter trade matchup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                You Teach ({currentUser.name.split(' ')[0]})
              </label>
              <select
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {currentUser.skillsOffered.map((sk) => (
                  <option key={sk.id} value={sk.name}>
                    {sk.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                You Learn ({targetNeighbor.name.split(' ')[0]})
              </label>
              <select
                value={requestedSkill}
                onChange={(e) => setRequestedSkill(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {targetNeighbor.skillsOffered.map((sk) => (
                  <option key={sk.id} value={sk.name}>
                    {sk.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration & Format */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                Session Duration
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value={1.0}>1.0 Hour (1 Credit)</option>
                <option value={1.5}>1.5 Hours (1.5 Credits)</option>
                <option value={2.0}>2.0 Hours (2 Credits)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                Meeting Preference
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full text-xs p-2 bg-white border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="In-person local">In-person Local</option>
                <option value="Online video">Online Video</option>
                <option value="Flexible">Flexible / Either</option>
              </select>
            </div>
          </div>

          {/* Location suggestion */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
              Suggested Location / Venue
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={locationSuggestion}
                onChange={(e) => setLocationSuggestion(e.target.value)}
                placeholder="e.g. Maplewood Library or Backyard Garden"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Message Note */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
              Introduction & Goals Note
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Share what you hope to achieve and your schedule availability...`}
              className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-md text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Swap Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
