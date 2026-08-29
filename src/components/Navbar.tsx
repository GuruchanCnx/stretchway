import React from 'react';
import { 
  Car, 
  Bike, 
  Truck, 
  Layers, 
  Flame, 
  Moon, 
  Sun, 
  Globe, 
  Sparkles, 
  Download,
  Activity
} from 'lucide-react';
import { VehicleType, UserProgress } from '../types';
import { SupportedLang, TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  currentVehicle: VehicleType;
  onSelectVehicle: (v: VehicleType) => void;
  currentLang: SupportedLang;
  onSelectLang: (lang: SupportedLang) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  userProgress: UserProgress;
  onOpenAICoach: () => void;
  onOpenQuickBreath: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentVehicle,
  onSelectVehicle,
  currentLang,
  onSelectLang,
  theme,
  onToggleTheme,
  userProgress,
  onOpenAICoach,
  onOpenQuickBreath,
  activeTab,
  onSelectTab
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const vehicleButtons: { type: VehicleType; label: string; icon: React.ReactNode }[] = [
    { type: 'all', label: t.allVehicles, icon: <Layers className="w-4 h-4" /> },
    { type: 'car', label: t.carDrivers, icon: <Car className="w-4 h-4" /> },
    { type: 'two-wheeler', label: t.twoWheelers, icon: <Bike className="w-4 h-4" /> },
    { type: 'truck', label: 'Truck & Heavy', icon: <Truck className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('routines')}>
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 rounded-full">
                  Olympic Coach & Yoga
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Center: Vehicle Filter Chips */}
          <div className="hidden lg:flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            {vehicleButtons.map((btn) => (
              <button
                key={btn.type}
                onClick={() => onSelectVehicle(btn.type)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentVehicle === btn.type
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-sm shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Streak Counter */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold" title="Daily Relief Streak">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{userProgress.currentStreakDays}d</span>
            </div>

            {/* Quick Breath Trigger */}
            <button
              onClick={onOpenQuickBreath}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold transition-all"
              title="Instant 1-min Breathing Reset"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping mr-1" />
              <span>Breathe</span>
            </button>

            {/* AI Coach Button */}
            <button
              onClick={onOpenAICoach}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              <span className="hidden sm:inline">AI Bio-Coach</span>
              <span className="sm:hidden">Coach</span>
            </button>

            {/* Language Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center space-x-1 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs"
                title="Change Language"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="uppercase text-[11px] font-bold">{currentLang}</span>
              </button>
              <div className="absolute right-0 mt-1 w-36 py-1 bg-slate-900 border border-slate-800 rounded-xl shadow-xl hidden group-hover:block z-50">
                {[
                  { code: 'en', name: 'English' },
                  { code: 'es', name: 'Español' },
                  { code: 'fr', name: 'Français' },
                  { code: 'de', name: 'Deutsch' },
                  { code: 'zh', name: '中文' },
                  { code: 'ja', name: '日本語' },
                  { code: 'pt', name: 'Português' },
                  { code: 'hi', name: 'हिन्दी' },
                  { code: 'th', name: 'ไทย' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => onSelectLang(item.code as SupportedLang)}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                      currentLang === item.code ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{item.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

          </div>
        </div>

        {/* Mobile Vehicle Selector Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-2 border-t border-slate-800/60 no-scrollbar">
          {vehicleButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => onSelectVehicle(btn.type)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                currentVehicle === btn.type
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold'
                  : 'text-slate-400 bg-slate-900/60 border border-slate-800'
              }`}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
