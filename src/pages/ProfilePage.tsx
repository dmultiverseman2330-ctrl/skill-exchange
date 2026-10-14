import React, { useState } from 'react';
import { UserProfile, Skill, SkillCategory } from '../types';
import { saveProfile } from '../services/storage';
import { formatPhoneNumber } from '../services/auth';
import {
  User,
  Plus,
  Trash2,
  CheckCircle,
  MapPin,
  Clock,
  Star,
  Award,
  Save,
} from 'lucide-react';

interface ProfilePageProps {
  currentUser: UserProfile;
  onProfileUpdate: (updated: UserProfile) => void;
}

const CATEGORIES: SkillCategory[] = [
  'Music & Audio',
  'Home & Garden',
  'Tech & Digital',
  'Languages',
  'Culinary & Baking',
  'Crafts & Repair',
  'Wellness & Fitness',
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onProfileUpdate }) => {
  const [profile, setProfile] = useState<UserProfile>(currentUser);
  const [newOfferedSkill, setNewOfferedSkill] = useState({
    name: '',
    category: 'Music & Audio' as SkillCategory,
    level: 'Intermediate' as Skill['level'],
  });
  const [newWantedSkill, setNewWantedSkill] = useState({
    name: '',
    category: 'Languages' as SkillCategory,
    level: 'Beginner' as Skill['level'],
  });
  const [showAddOffered, setShowAddOffered] = useState(false);
  const [showAddWanted, setShowAddWanted] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profile);
    onProfileUpdate(profile);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleAddOffered = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferedSkill.name.trim()) return;

    const newSkill: Skill = {
      id: `sk_off_${Date.now()}`,
      name: newOfferedSkill.name.trim(),
      category: newOfferedSkill.category,
      level: newOfferedSkill.level,
    };

    const updated = {
      ...profile,
      skillsOffered: [...profile.skillsOffered, newSkill],
    };

    setProfile(updated);
    saveProfile(updated);
    onProfileUpdate(updated);
    setNewOfferedSkill({ name: '', category: 'Music & Audio', level: 'Intermediate' });
    setShowAddOffered(false);
  };

  const handleRemoveOffered = (id: string) => {
    const updated = {
      ...profile,
      skillsOffered: profile.skillsOffered.filter((s) => s.id !== id),
    };
    setProfile(updated);
    saveProfile(updated);
    onProfileUpdate(updated);
  };

  const handleAddWanted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWantedSkill.name.trim()) return;

    const newSkill: Skill = {
      id: `sk_want_${Date.now()}`,
      name: newWantedSkill.name.trim(),
      category: newWantedSkill.category,
      level: newWantedSkill.level,
    };

    const updated = {
      ...profile,
      skillsWanted: [...profile.skillsWanted, newSkill],
    };

    setProfile(updated);
    saveProfile(updated);
    onProfileUpdate(updated);
    setNewWantedSkill({ name: '', category: 'Languages', level: 'Beginner' });
    setShowAddWanted(false);
  };

  const handleRemoveWanted = (id: string) => {
    const updated = {
      ...profile,
      skillsWanted: profile.skillsWanted.filter((s) => s.id !== id),
    };
    setProfile(updated);
    saveProfile(updated);
    onProfileUpdate(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Toast */}
      {saveToast && (
        <div 
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-black text-2xl flex items-center justify-center shadow-xs">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900">{profile.name}</h1>
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-2 mt-1">
                <span>{formatPhoneNumber(profile.phoneNumber)}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {profile.neighborhood}
                </span>
                <span>·</span>
                <span>{profile.joinedDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-stone-200 sm:pl-6 text-xs">
            <div>
              <p className="text-stone-500">Banked Hours</p>
              <p className="text-xl font-bold font-mono-data text-stone-900">
                {profile.hoursBanked}.0 h
              </p>
            </div>
            <div>
              <p className="text-stone-500">Rating</p>
              <p className="text-xl font-bold font-mono-data text-amber-600 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                {profile.rating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* General Information Form */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
        <h2 className="text-base font-bold text-stone-900 mb-4">
          Neighborhood & Bio
        </h2>

        <form onSubmit={handleSaveGeneral} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                Neighborhood / District
              </label>
              <input
                type="text"
                value={profile.neighborhood}
                onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Personal Bio & Philosophy
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Information</span>
            </button>
          </div>
        </form>
      </div>

      {/* Skills Offered Section */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Skills You Offer / Teach</h2>
            <p className="text-xs text-stone-500">Skills you are available to share with neighbors in barter sessions</p>
          </div>
          <button
            onClick={() => setShowAddOffered(!showAddOffered)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Add Skill Form */}
        {showAddOffered && (
          <form onSubmit={handleAddOffered} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Skill Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acoustic Guitar"
                  value={newOfferedSkill.name}
                  onChange={(e) => setNewOfferedSkill({ ...newOfferedSkill, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-md text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={newOfferedSkill.category}
                  onChange={(e) => setNewOfferedSkill({ ...newOfferedSkill, category: e.target.value as any })}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-md text-stone-900"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Proficiency Level
                </label>
                <select
                  value={newOfferedSkill.level}
                  onChange={(e) => setNewOfferedSkill({ ...newOfferedSkill, level: e.target.value as any })}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-md text-stone-900"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddOffered(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded-md hover:bg-emerald-900"
              >
                Save Skill
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {profile.skillsOffered.map((sk) => (
            <div
              key={sk.id}
              className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50/50"
            >
              <div>
                <p className="text-xs font-bold text-stone-900">{sk.name}</p>
                <p className="text-[11px] text-stone-500">
                  {sk.category} · Level: <span className="font-semibold text-stone-700">{sk.level}</span>
                </p>
                {sk.description && <p className="text-xs text-stone-600 mt-1">{sk.description}</p>}
              </div>

              <button
                onClick={() => handleRemoveOffered(sk.id)}
                className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Remove skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Wanted Section */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Skills You Seek / Want to Learn</h2>
            <p className="text-xs text-stone-500">Skills you are looking to learn in exchange for your teaching</p>
          </div>
          <button
            onClick={() => setShowAddWanted(!showAddWanted)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Goal</span>
          </button>
        </div>

        {/* Add Goal Form */}
        {showAddWanted && (
          <form onSubmit={handleAddWanted} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Skill Desired
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sourdough Baking"
                  value={newWantedSkill.name}
                  onChange={(e) => setNewWantedSkill({ ...newWantedSkill, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-md text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={newWantedSkill.category}
                  onChange={(e) => setNewWantedSkill({ ...newWantedSkill, category: e.target.value as any })}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-md text-stone-900"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Target Level
                </label>
                <select
                  value={newWantedSkill.level}
                  onChange={(e) => setNewWantedSkill({ ...newWantedSkill, level: e.target.value as any })}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-md text-stone-900"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddWanted(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-800 rounded-md hover:bg-amber-900"
              >
                Save Goal
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {profile.skillsWanted.map((sk) => (
            <div
              key={sk.id}
              className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50/50"
            >
              <div>
                <p className="text-xs font-bold text-stone-900">{sk.name}</p>
                <p className="text-[11px] text-stone-500">
                  {sk.category} · Desired Level: <span className="font-semibold text-stone-700">{sk.level}</span>
                </p>
              </div>

              <button
                onClick={() => handleRemoveWanted(sk.id)}
                className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Remove goal"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Neighbor Reviews */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-3">
        <h2 className="text-base font-bold text-stone-900">
          Neighbor Testimonials & Verification ({profile.reviews.length})
        </h2>

        {profile.reviews.length === 0 ? (
          <p className="text-xs text-stone-500">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {profile.reviews.map((rev) => (
              <div key={rev.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">{rev.authorName}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-mono-data text-stone-600">{rev.rating}.0</span>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium">Exchanged: {rev.skillExchanged}</p>
                <p className="text-stone-600 italic">"{rev.comment}"</p>
                <p className="text-[10px] text-stone-400 font-mono-data pt-0.5">{rev.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
