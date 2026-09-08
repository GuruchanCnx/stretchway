import React, { useState, useMemo } from 'react';
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
  Activity,
  Filter,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AchievementBadge, UserProgress } from '../types';
import { computeUserAchievements } from '../data/achievements';

export interface BadgesProps {
  userProgress: UserProgress;
  onEquipFlair?: (title: string, badgeId: string) => void;
  compact?: boolean;
}

export const Badges: React.FC<BadgesProps> = ({
  userProgress,
  onEquipFlair,
  compact = false
}) => {
  const achievements = useMemo(() => computeUserAchievements(userProgress), [userProgress]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'streak' | 'time' | 'pitstop' | 'zen'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [activeModalBadge, setActiveModalBadge] = useState<AchievementBadge | null>(null);

  const unlockedBadges = achievements.filter(a => a.unlocked);
  const unlockedCount = unlockedBadges.length;
  const totalCount = achievements.length;
  const unlockPercent = Math.round((unlockedCount / totalCount) * 100);

  // Key badges highlighted in the prompt
  const tenDayBadge = achievements.find(a => a.id === 'streak-10');
  const roadWarriorBadge = achievements.find(a => a.id === 'streak-7');

  const filteredBadges = achievements.filter(b => {
    if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;
    if (selectedStatus === 'unlocked' && !b.unlocked) return false;
    if (selectedStatus === 'locked' && b.unlocked) return false;
    return true;
  });

  const handleEquip = (badge: AchievementBadge) => {
    if (!badge.unlocked) return;
    if (onEquipFlair) {
      onEquipFlair(badge.cosmeticFlair.profileTitle, badge.id);
    }
    confetti({
      particleCount: 60,
      spread: 70,
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

  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = isUnlocked ? "w-6 h-6" : "w-6 h-6 text-slate-500";
    switch (iconName) {
      case 'Flame': return <Flame className={iconClass} />;
      case 'Shield': return <Shield className={iconClass} />;
      case 'Clock': return <Clock className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'Wind': return <Wind className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      default: return <Trophy className={iconClass} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Achievement Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* User Identity & Equipped Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-cyan-500 p-0.5 shadow-lg flex items-center justify-center ${userProgress.equippedBadgeId ? 'ring-2 ring-cyan-400/80' : ''}`}>
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            {userProgress.equippedTitle && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-950"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">Driver Achievements</h3>
              {userProgress.equippedTitle && (
                <span className="px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  {userProgress.equippedTitle}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Unlock prestigious driver ranks by keeping your highway mobility streak and decompression alive.
            </p>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="w-full md:w-64 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-400">Total Unlocked</span>
            <span className="text-cyan-400 font-mono">{unlockedCount} / {totalCount} ({unlockPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${unlockPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
            <span>Rookie Pilot</span>
            <span>Road Legend</span>
          </div>
        </div>
      </div>

      {/* Spotlight for Key Milestone Badges ('10-Day Streak' and 'Road Warrior') */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 'Road Warrior' Feature Card */}
        {roadWarriorBadge && (
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            roadWarriorBadge.unlocked 
              ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
              : 'bg-slate-950/80 border-slate-800'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  roadWarriorBadge.unlocked 
                    ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{roadWarriorBadge.title}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      Silver Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {roadWarriorBadge.description}
                  </p>
                </div>
              </div>

              {roadWarriorBadge.unlocked ? (
                <button
                  onClick={() => handleEquip(roadWarriorBadge)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    userProgress.equippedTitle === roadWarriorBadge.cosmeticFlair.profileTitle
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {userProgress.equippedTitle === roadWarriorBadge.cosmeticFlair.profileTitle ? 'Equipped' : 'Equip Title'}
                </button>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40 shrink-0">
                  <Lock className="w-3 h-3" />
                  <span>{userProgress.currentStreakDays} / 7 Days</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {!roadWarriorBadge.unlocked && (
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>7-Day Streak Progress</span>
                  <span className="font-mono text-cyan-400">{Math.min(userProgress.currentStreakDays, 7)} / 7 days</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${Math.min(100, (userProgress.currentStreakDays / 7) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* '10-Day Streak' Feature Card */}
        {tenDayBadge && (
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            tenDayBadge.unlocked 
              ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/50 shadow-lg shadow-amber-500/10' 
              : 'bg-slate-950/80 border-slate-800'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  tenDayBadge.unlocked 
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{tenDayBadge.title}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                      Gold Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {tenDayBadge.description}
                  </p>
                </div>
              </div>

              {tenDayBadge.unlocked ? (
                <button
                  onClick={() => handleEquip(tenDayBadge)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    userProgress.equippedTitle === tenDayBadge.cosmeticFlair.profileTitle
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {userProgress.equippedTitle === tenDayBadge.cosmeticFlair.profileTitle ? 'Equipped' : 'Equip Title'}
                </button>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40 shrink-0">
                  <Lock className="w-3 h-3" />
                  <span>{userProgress.currentStreakDays} / 10 Days</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {!tenDayBadge.unlocked && (
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>10-Day Streak Progress</span>
                  <span className="font-mono text-amber-400">{Math.min(userProgress.currentStreakDays, 10)} / 10 days</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${Math.min(100, (userProgress.currentStreakDays / 10) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Badges ({achievements.length})
          </button>
          <button
            onClick={() => setSelectedCategory('streak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              selectedCategory === 'streak'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Streaks</span>
          </button>
          <button
            onClick={() => setSelectedCategory('time')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              selectedCategory === 'time'
                ? 'bg-teal-400 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Minutes</span>
          </button>
          <button
            onClick={() => setSelectedCategory('pitstop')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              selectedCategory === 'pitstop'
                ? 'bg-cyan-400 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pitstops</span>
          </button>
          <button
            onClick={() => setSelectedCategory('zen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              selectedCategory === 'zen'
                ? 'bg-purple-400 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Breath</span>
          </button>
        </div>

        {/* Unlocked vs Locked Filter */}
        <div className="flex items-center gap-1 self-end sm:self-auto text-xs bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedStatus('unlocked')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              selectedStatus === 'unlocked' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Check className="w-3 h-3" />
            <span>Unlocked ({unlockedCount})</span>
          </button>
          <button
            onClick={() => setSelectedStatus('locked')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              selectedStatus === 'locked' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Locked ({totalCount - unlockedCount})</span>
          </button>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const progressPercent = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));
          const isEquipped = userProgress.equippedTitle === badge.cosmeticFlair.profileTitle;

          return (
            <motion.div
              key={badge.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              onClick={() => setActiveModalBadge(badge)}
              className={`p-5 rounded-2xl border cursor-pointer relative overflow-hidden transition-all flex flex-col justify-between ${
                badge.unlocked
                  ? `bg-gradient-to-br ${getTierGradient(badge.tier)} shadow-lg`
                  : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 opacity-90'
              }`}
            >
              <div>
                {/* Top Badge Card Meta */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTierPill(badge.tier)}`}>
                    {badge.tier}
                  </span>

                  {badge.unlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                      <Lock className="w-3 h-3" />
                      <span>{badge.currentValue} / {badge.targetValue}</span>
                    </span>
                  )}
                </div>

                {/* Badge Icon and Title */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner shrink-0 ${
                    badge.unlocked 
                      ? 'bg-slate-950/60 border-current shadow-black/40' 
                      : 'bg-slate-900 border-slate-800'
                  }`}>
                    {getBadgeIcon(badge.icon, badge.unlocked)}
                  </div>
                  <div>
                    <h4 className={`text-base font-extrabold ${badge.unlocked ? 'text-white' : 'text-slate-300'}`}>
                      {badge.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {badge.cosmeticFlair.profileTitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 my-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Bottom Progress or Equip CTA */}
              <div className="pt-3 border-t border-slate-800/70 mt-2">
                {badge.unlocked ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Title: {badge.cosmeticFlair.profileTitle}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEquip(badge);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                        isEquipped
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {isEquipped ? 'Equipped' : 'Equip'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                      <span>{progressPercent}% Complete</span>
                      <span>{badge.currentValue} / {badge.targetValue}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Details Modal */}
      <AnimatePresence>
        {activeModalBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getTierPill(activeModalBadge.tier)}`}>
                  {activeModalBadge.tier} Tier Badge
                </span>
                <button
                  onClick={() => setActiveModalBadge(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl ${
                  activeModalBadge.unlocked 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-amber-500/20 border-cyan-400 text-cyan-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}>
                  {getBadgeIcon(activeModalBadge.icon, activeModalBadge.unlocked)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{activeModalBadge.title}</h3>
                  <p className="text-xs text-cyan-400 font-bold mt-0.5">
                    Cosmetic Flair: {activeModalBadge.cosmeticFlair.profileTitle}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {activeModalBadge.description}
              </p>

              {/* Criteria details */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 mb-6 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Unlock Condition</span>
                  <span className="font-bold text-white">
                    {activeModalBadge.targetValue} {activeModalBadge.metricType === 'streak' ? 'Consecutive Days' : activeModalBadge.metricType === 'totalMinutes' ? 'Total Minutes' : 'Completed Sessions'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Your Current Progress</span>
                  <span className="font-bold text-cyan-300 font-mono">
                    {activeModalBadge.currentValue} / {activeModalBadge.targetValue}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${Math.min(100, (activeModalBadge.currentValue / activeModalBadge.targetValue) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveModalBadge(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800"
                >
                  Close
                </button>
                {activeModalBadge.unlocked && (
                  <button
                    onClick={() => {
                      handleEquip(activeModalBadge);
                      setActiveModalBadge(null);
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-black bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/20"
                  >
                    Equip Flair Title
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
