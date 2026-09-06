import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Shield, 
  Zap, 
  Sparkles, 
  Wind, 
  CheckCircle2, 
  Lock, 
  Share2, 
  Award, 
  Crown,
  ChevronRight,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AchievementBadge, UserProgress } from '../types';
import { computeUserAchievements } from '../data/achievements';

interface AchievementBadgesViewProps {
  userProgress: UserProgress;
  onEquipFlair?: (title: string, badgeId: string) => void;
}

export const AchievementBadgesView: React.FC<AchievementBadgesViewProps> = ({
  userProgress,
  onEquipFlair
}) => {
  const achievements = computeUserAchievements(userProgress);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'streak' | 'time' | 'pitstop' | 'zen'>('all');
  const [activeModalBadge, setActiveModalBadge] = useState<AchievementBadge | null>(null);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const unlockPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges = achievements.filter(b => {
    if (selectedFilter === 'all') return true;
    return b.category === selectedFilter;
  });

  const handleEquip = (badge: AchievementBadge) => {
    if (!badge.unlocked) return;
    if (onEquipFlair) {
      onEquipFlair(badge.cosmeticFlair.profileTitle, badge.id);
    }
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return 'from-purple-500/20 via-cyan-500/20 to-purple-900/40 border-purple-400/60 text-purple-200';
      case 'gold':
        return 'from-amber-500/20 via-yellow-500/15 to-amber-900/40 border-amber-400/60 text-amber-200';
      case 'silver':
        return 'from-slate-400/20 via-cyan-500/10 to-slate-800/40 border-cyan-400/40 text-cyan-200';
      default:
        return 'from-emerald-500/15 via-teal-500/10 to-emerald-950/40 border-emerald-500/40 text-emerald-200';
    }
  };

  const getTierPill = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return 'bg-purple-900/80 text-purple-200 border-purple-400/50';
      case 'gold':
        return 'bg-amber-900/80 text-amber-200 border-amber-400/50';
      case 'silver':
        return 'bg-cyan-950/80 text-cyan-200 border-cyan-400/40';
      default:
        return 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40';
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'Shield': return <Shield className="w-6 h-6" />;
      case 'Clock': return <Clock className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Wind': return <Wind className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      default: return <Trophy className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Achievement Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* User Identity & Equipped Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg ${
              userProgress.equippedBadgeId ? 'ring-4 ring-cyan-400/70 shadow-cyan-500/30' : 'ring-2 ring-slate-700'
            }`}>
              <Crown className="w-8 h-8 text-amber-300 fill-amber-300/30" />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-slate-900 text-[10px] font-bold text-amber-400 border border-slate-700">
              Lv.{Math.max(1, Math.floor(userProgress.totalMinutesStretched / 30) + 1)}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">Driver Profile</span>
              {userProgress.equippedTitle && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{userProgress.equippedTitle}</span>
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">
              Cosmetic Badges & Milestones
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Unlock prestigious driver badges and equip custom profile titles as you maintain daily road mobility.
            </p>
          </div>
        </div>

        {/* Unlocked Progress Dial / Stats */}
        <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Unlocked</div>
            <div className="text-2xl font-black text-cyan-400">
              {unlockedCount} <span className="text-sm font-normal text-slate-500">/ {totalCount}</span>
            </div>
          </div>

          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${unlockPercent}%` }}
            />
          </div>

          <div className="text-right">
            <span className="px-2 py-1 rounded-lg bg-cyan-950 text-cyan-300 text-xs font-black border border-cyan-800/60 font-mono">
              {unlockPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Badges' },
          { id: 'streak', label: 'Streak Milestones' },
          { id: 'time', label: 'Total Mobility Time' },
          { id: 'pitstop', label: 'Pitstop Missions' },
          { id: 'zen', label: 'Zen & Breathwork' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedFilter(cat.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedFilter === cat.id
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map(badge => {
          const isEquipped = userProgress.equippedTitle === badge.cosmeticFlair.profileTitle;
          const progressPercent = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => setActiveModalBadge(badge)}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                badge.unlocked
                  ? `bg-gradient-to-br ${getTierGradient(badge.tier)} shadow-lg hover:scale-[1.02]`
                  : 'bg-slate-950/70 border-slate-800/80 opacity-70 hover:opacity-90'
              }`}
            >
              {/* Top Row: Icon & Tier */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  badge.unlocked
                    ? 'bg-slate-900/90 text-cyan-300 shadow-md border border-cyan-500/30'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}>
                  {getBadgeIcon(badge.icon)}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getTierPill(badge.tier)}`}>
                    {badge.tier}
                  </span>
                  {badge.unlocked ? (
                    <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className={`text-base font-black ${badge.unlocked ? 'text-white' : 'text-slate-300'}`}>
                  {badge.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {badge.description}
                </p>

                {/* Cosmetic Title Reward Tag */}
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-500">Unlocks Title:</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badge.cosmeticFlair.tagClass}`}>
                    "{badge.cosmeticFlair.profileTitle}"
                  </span>
                </div>
              </div>

              {/* Progress Bar & Equip Action */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="flex justify-between items-center text-[11px] mb-1 font-mono">
                  <span className="text-slate-400">Progress</span>
                  <span className={badge.unlocked ? 'text-emerald-400 font-bold' : 'text-cyan-400'}>
                    {badge.currentValue} / {badge.targetValue} {badge.metricType === 'totalMinutes' ? 'mins' : badge.metricType === 'streak' ? 'days' : 'sessions'}
                  </span>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.unlocked ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-cyan-500/50'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {badge.unlocked ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEquip(badge);
                    }}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                      isEquipped
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{isEquipped ? '✓ Equipped to Profile' : 'Equip Cosmetic Title'}</span>
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-slate-500 font-mono py-1">
                    🔒 Locked milestone
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Inspection Celebration Modal */}
      <AnimatePresence>
        {activeModalBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl relative overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at top center, rgba(6, 182, 212, 0.4) 0%, transparent 70%)'
                }}
              />

              <div className="relative z-10 text-center">
                <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 shadow-xl border ${
                  activeModalBadge.unlocked
                    ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white border-cyan-400 shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  {getBadgeIcon(activeModalBadge.icon)}
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getTierPill(activeModalBadge.tier)}`}>
                  {activeModalBadge.tier} Tier Milestone
                </span>

                <h3 className="text-2xl font-black text-white mt-2">
                  {activeModalBadge.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 px-4 leading-relaxed">
                  {activeModalBadge.description}
                </p>

                {/* Cosmetic Perk Unlocked */}
                <div className="my-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
                  <div className="text-[10px] uppercase font-mono text-cyan-400 font-bold mb-1">
                    Cosmetic Profile Reward
                  </div>
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>Title: "{activeModalBadge.cosmeticFlair.profileTitle}"</span>
                    <span className="text-xs text-emerald-400 font-mono">Unlocks Profile Flair</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  {activeModalBadge.unlocked && (
                    <button
                      onClick={() => {
                        handleEquip(activeModalBadge);
                        setActiveModalBadge(null);
                      }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/20"
                    >
                      Equip Title to Profile
                    </button>
                  )}
                  <button
                    onClick={() => setActiveModalBadge(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
