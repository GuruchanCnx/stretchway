import React, { useState, useRef, useEffect } from 'react';
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
  Activity,
  Palette,
  Check,
  Target,
  Settings,
  Zap
} from 'lucide-react';
import { VehicleType, UserProgress, AccentColorTheme } from '../types';
import { SupportedLang, TRANSLATIONS } from '../data/translations';
import { THEME_CONFIGS } from '../data/themes';

interface NavbarProps {
  currentVehicle: VehicleType;
  onSelectVehicle: (v: VehicleType) => void;
  currentLang: SupportedLang;
  onSelectLang: (lang: SupportedLang) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  accentTheme: AccentColorTheme;
  onSelectAccentTheme: (theme: AccentColorTheme) => void;
  userProgress: UserProgress;
  onOpenAICoach: () => void;
  onOpenQuickBreath: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  dailyGoalMinutes?: number;
  todayMinutes?: number;
  onOpenDailyGoalModal?: () => void;
  onOpenUserSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentVehicle,
  onSelectVehicle,
  currentLang,
  onSelectLang,
  theme,
  onToggleTheme,
  accentTheme,
  onSelectAccentTheme,
  userProgress,
  onOpenAICoach,
  onOpenQuickBreath,
  activeTab,
  onSelectTab,
  dailyGoalMinutes = 15,
  todayMinutes = 0,
  onOpenDailyGoalModal,
  onOpenUserSettings
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentAccent = THEME_CONFIGS[accentTheme] || THEME_CONFIGS.ocean;
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Goal progress calculation
  const goalProgressPercent = Math.min(100, Math.round((todayMinutes / Math.max(1, dailyGoalMinutes)) * 100));
  const circleCircumference = 2 * Math.PI * 13; // r = 13 => ~81.68
  const strokeOffset = circleCircumference - (circleCircumference * goalProgressPercent) / 100;
  const isGoalAchieved = todayMinutes >= dailyGoalMinutes && dailyGoalMinutes > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const vehicleButtons: { type: VehicleType; label: string; icon: React.ReactNode }[] = [
    { type: 'all', label: t.allVehicles, icon: <Layers className="w-4 h-4" /> },
    { type: 'car', label: t.carDrivers, icon: <Car className="w-4 h-4" /> },
    { type: 'two-wheeler', label: t.twoWheelers, icon: <Bike className="w-4 h-4" /> },
    { type: 'truck', label: 'Truck & Heavy', icon: <Truck className="w-4 h-4" /> }
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
      theme === 'light' ? 'bg-white/95 border-slate-200 shadow-sm' : 'bg-slate-950/80 border-slate-800/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('routines')}>
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                theme === 'light' ? 'bg-white' : 'bg-slate-950'
              }`}>
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-500 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  theme === 'light' 
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' 
                    : 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/60'
                }`}>
                  Olympic Coach & Yoga
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs line-clamp-1 ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Center: Vehicle Filter Chips */}
          <div className={`hidden lg:flex items-center p-1 border rounded-xl ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            {vehicleButtons.map((btn) => (
              <button
                key={btn.type}
                onClick={() => onSelectVehicle(btn.type)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentVehicle === btn.type
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
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
            
            {/* Daily Goal Circular Progress Bar */}
            <button
              onClick={onOpenDailyGoalModal}
              className={`relative flex items-center gap-1.5 p-1.5 px-2 rounded-xl border transition-all group active:scale-95 ${
                theme === 'light'
                  ? 'bg-white border-slate-200 hover:border-cyan-500 shadow-sm'
                  : 'bg-slate-900 border-slate-800 hover:border-cyan-500/60'
              }`}
              title={`Daily Mobility Goal: ${todayMinutes}/${dailyGoalMinutes} mins (${goalProgressPercent}%) - Tap to adjust target`}
            >
              <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 -rotate-90 transform" viewBox="0 0 32 32">
                  {/* Background track */}
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    className={theme === 'light' ? 'text-slate-200' : 'text-slate-800'}
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    className={`transition-all duration-700 ease-out ${
                      isGoalAchieved ? 'text-emerald-500' : 'text-cyan-500'
                    }`}
                    strokeWidth="3"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isGoalAchieved ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <span className={`text-[9px] font-black font-mono ${
                      theme === 'light' ? 'text-cyan-700' : 'text-cyan-300'
                    }`}>
                      {todayMinutes}m
                    </span>
                  )}
                </div>
              </div>

              <div className="hidden xl:flex flex-col text-left">
                <span className={`text-[9px] font-black uppercase leading-none ${
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>Goal</span>
                <span className={`text-[11px] font-bold font-mono leading-tight ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  {todayMinutes}/{dailyGoalMinutes}m
                </span>
              </div>
            </button>

            {/* Streak Counter */}
            <div className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
              theme === 'light'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`} title="Daily Relief Streak">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{userProgress.currentStreakDays}d</span>
            </div>

            {/* Quick Breath Trigger */}
            <button
              onClick={onOpenQuickBreath}
              className={`hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-800'
                  : 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30 text-teal-300'
              }`}
              title="Instant 1-min Breathing Reset"
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping mr-1" />
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

            {/* Color Theme Selector Dropdown */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className={`flex items-center space-x-1.5 p-2 rounded-xl border transition-all text-xs group ${
                  theme === 'light'
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Select Accent Color Scheme (Ocean, Sunset, Forest, Aurora, Golden)"
              >
                <div 
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm transition-transform group-hover:scale-110" 
                  style={{ backgroundColor: currentAccent.primaryColor }}
                />
                <Palette className={`w-3.5 h-3.5 ${
                  theme === 'light' ? 'text-slate-500 group-hover:text-slate-800' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
              </button>

              {isThemeMenuOpen && (
                <div className={`absolute right-0 mt-2 w-64 p-2.5 backdrop-blur-xl border rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/95 border-slate-700/80'
                }`}>
                  <div className={`flex items-center justify-between pb-2 mb-2 border-b px-1.5 ${
                    theme === 'light' ? 'border-slate-200' : 'border-slate-800'
                  }`}>
                    <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      <Palette className="w-3.5 h-3.5" style={{ color: currentAccent.primaryColor }} />
                      Accent Color Theme
                    </span>
                    <span className={`text-[10px] font-mono capitalize ${
                      theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                    }`}>{accentTheme}</span>
                  </div>

                  <div className="space-y-1.5">
                    {Object.values(THEME_CONFIGS).map((item) => {
                      const isSelected = accentTheme === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectAccentTheme(item.id);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                            isSelected 
                              ? theme === 'light'
                                ? 'bg-slate-100 border border-slate-300 font-bold text-slate-900 shadow-sm'
                                : 'bg-slate-800/90 border border-slate-700 font-bold text-white shadow-sm'
                              : theme === 'light'
                                ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div 
                              className="w-4 h-4 rounded-full border border-white/30 shadow-md flex items-center justify-center shrink-0"
                              style={{ backgroundColor: item.primaryColor }}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold leading-tight">{item.name}</div>
                              <div className={`text-[10px] font-normal line-clamp-1 ${
                                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                              }`}>{item.description}</div>
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="w-3.5 h-3.5 shrink-0" style={{ color: item.primaryColor }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="relative group">
              <button 
                className={`flex items-center space-x-1 p-2 rounded-xl border transition-all text-xs ${
                  theme === 'light'
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Change Language"
              >
                <Globe className="w-4 h-4" style={{ color: currentAccent.primaryColor }} />
                <span className="uppercase text-[11px] font-bold">{currentLang}</span>
              </button>
              <div className={`absolute right-0 mt-1 w-36 py-1 border rounded-xl shadow-xl hidden group-hover:block z-50 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
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
                      currentLang === item.code 
                        ? theme === 'light' ? 'bg-slate-100 font-bold' : 'bg-slate-800 font-bold'
                        : theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                    style={currentLang === item.code ? { color: currentAccent.primaryColor } : {}}
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
              className={`p-2 rounded-xl border transition-all ${
                theme === 'light'
                  ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Toggle Dark / Light Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* User Settings (Haptics, Pulse, Veo-3) */}
            {onOpenUserSettings && (
              <button
                onClick={onOpenUserSettings}
                className={`p-2 rounded-xl border transition-all ${
                  theme === 'light'
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:text-cyan-700 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-400'
                }`}
                title="Haptic Pulse & Engine Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}


          </div>
        </div>

        {/* Mobile Vehicle Selector Bar */}
        <div className={`flex lg:hidden overflow-x-auto py-2.5 gap-2 border-t no-scrollbar ${
          theme === 'light' ? 'border-slate-200' : 'border-slate-800/60'
        }`}>
          {vehicleButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => onSelectVehicle(btn.type)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                currentVehicle === btn.type
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold'
                  : theme === 'light'
                    ? 'text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200'
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
