import React from 'react';
import { Flame, Trophy, Activity, Calendar, Download, TrendingUp, Heart, CheckCircle2 } from 'lucide-react';
import { UserProgress } from '../types';

interface RoadLogProps {
  userProgress: UserProgress;
  onExportSummary: () => void;
}

export const RoadLog: React.FC<RoadLogProps> = ({
  userProgress,
  onExportSummary
}) => {
  const avgImprovement = userProgress.completedHistory.length > 0
    ? (userProgress.completedHistory.reduce((acc, curr) => acc + (curr.feelingAfter - curr.feelingBefore), 0) / userProgress.completedHistory.length).toFixed(1)
    : '2.0';

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Bio-Recovery Analytics</span>
            </span>
            <span className="text-xs text-slate-400">Driver Health Progression</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Your Road Mobility & Recovery Log
          </h2>
        </div>

        <button
          onClick={onExportSummary}
          className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all self-start"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Health Report</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Streak</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
            {userProgress.currentStreakDays} <span className="text-sm font-normal text-amber-400">Days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Consistent spinal protection</p>
        </div>

        {/* Minutes Stretched */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Time</span>
            <Trophy className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
            {userProgress.totalMinutesStretched} <span className="text-sm font-normal text-cyan-400">Mins</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Highway decompression time</p>
        </div>

        {/* Routines Completed */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sessions</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
            {userProgress.routinesCompleted} <span className="text-sm font-normal text-emerald-400">Done</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Guided protocols completed</p>
        </div>

        {/* Avg Relief Delta */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Relief Boost</span>
            <TrendingUp className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
            +{avgImprovement} <span className="text-sm font-normal text-teal-400">/ 5 pts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Average comfort increase</p>
        </div>

      </div>

      {/* Recent History Table */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
        <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Recent Road Recovery History</span>
        </h3>

        {userProgress.completedHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No completed workouts logged yet. Complete a guided routine or breath session to track your journey!
          </div>
        ) : (
          <div className="space-y-2">
            {userProgress.completedHistory.slice(-5).reverse().map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4"
              >
                <div>
                  <h5 className="text-xs font-bold text-white">
                    {item.title}
                  </h5>
                  <span className="text-[11px] text-slate-400">
                    {item.date} • ⏱️ {item.durationMinutes} Minutes
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right text-[11px]">
                    <span className="text-slate-400">Comfort: </span>
                    <span className="text-amber-400 font-bold">{item.feelingBefore}</span>
                    <span className="text-slate-500"> → </span>
                    <span className="text-emerald-400 font-bold">{item.feelingAfter}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
                    +{(item.feelingAfter - item.feelingBefore)} Relief
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
