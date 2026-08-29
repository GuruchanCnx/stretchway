import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  Wind, 
  Flame, 
  Compass, 
  Navigation, 
  BookOpen, 
  MoreHorizontal, 
  Car, 
  Bike, 
  Truck, 
  X,
  Play,
  UserCheck
} from 'lucide-react';
import { VehicleType, UserProgress } from '../types';

export type AppTabType = 'routines' | 'bodymap' | 'breath' | 'cockpit' | 'trip' | 'log' | 'library';

interface BottomNavProps {
  activeTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  onOpenAICoach: () => void;
  onOpenOnboarding: () => void;
  userProgress: UserProgress;
  currentVehicle: VehicleType;
  onSelectVehicle: (v: VehicleType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAICoach,
  onOpenOnboarding,
  userProgress,
  currentVehicle,
  onSelectVehicle
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    {
      id: 'routines' as AppTabType,
      label: 'Protocols',
      icon: <Activity className="w-5 h-5" />,
      badge: null
    },
    {
      id: 'bodymap' as AppTabType,
      label: 'Body Map',
      icon: <Sparkles className="w-5 h-5" />,
      badge: null
    },
    {
      id: 'breath' as AppTabType,
      label: 'Breath',
      icon: <Wind className="w-5 h-5" />,
      badge: null
    },
    {
      id: 'ai-coach',
      label: 'AI Coach',
      icon: <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />,
      isAction: true,
      onClick: onOpenAICoach,
      badge: 'AI'
    },
    {
      id: 'log' as AppTabType,
      label: 'Recovery Log',
      icon: <Flame className="w-5 h-5" />,
      badge: userProgress.currentStreakDays > 0 ? `${userProgress.currentStreakDays}d` : null
    },
    {
      id: 'more',
      label: 'More',
      icon: <MoreHorizontal className="w-5 h-5" />,
      isAction: true,
      onClick: () => setShowMoreMenu(prev => !prev),
      badge: null
    }
  ];

  return (
    <>
      {/* "More" Secondary Drawer Menu */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowMoreMenu(false)}
        >
          <div 
            className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Cockpit & Road Navigation
              </span>
              <button 
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onSelectTab('cockpit');
                  setShowMoreMenu(false);
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  activeTab === 'cockpit' 
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300' 
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Compass className="w-5 h-5 text-cyan-400" />
                <span className="text-[11px] font-bold">Cockpit Ergo</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('trip');
                  setShowMoreMenu(false);
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  activeTab === 'trip' 
                    ? 'bg-indigo-950/60 border-indigo-400 text-indigo-300' 
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Navigation className="w-5 h-5 text-indigo-400" />
                <span className="text-[11px] font-bold">Trip Pitstops</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('library');
                  setShowMoreMenu(false);
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  activeTab === 'library' 
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300' 
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span className="text-[11px] font-bold">Drill Library</span>
              </button>
            </div>

            {/* Quick Action: Tailor Assessment */}
            <button
              onClick={() => {
                setShowMoreMenu(false);
                onOpenOnboarding();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Tailor Plan for My Pain Issues</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Tabs Container */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pb- safe pointer-events-none">
        <div className="max-w-xl mx-auto px-3 pb-3">
          <nav className="pointer-events-auto bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-2xl shadow-black/80 px-2 py-1.5 flex items-center justify-around">
            {mainTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              
              if (tab.isAction) {
                return (
                  <button
                    key={tab.id}
                    onClick={tab.onClick}
                    className="relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95 group"
                  >
                    <div className="relative">
                      {tab.icon}
                      {tab.badge && (
                        <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[8px] font-black uppercase">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-slate-400 group-hover:text-slate-200">
                      {tab.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id as AppTabType)}
                  className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all active:scale-95 ${
                    isActive
                      ? 'text-cyan-400 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {/* Glowing Active Background Pill */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 -z-10" />
                  )}

                  <div className="relative">
                    {tab.icon}
                    {tab.badge && (
                      <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black">
                        {tab.badge}
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] mt-1 ${isActive ? 'font-black text-cyan-300' : 'font-semibold text-slate-400'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};
