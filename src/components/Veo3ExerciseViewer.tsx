import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Video, 
  Activity, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  Zap,
  Layers,
  Camera,
  Info,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { Exercise } from '../types';
import { getVeoClipForExercise, VeoClipMetadata } from '../data/veoClips';
import { ExerciseCharacterVisual } from './ExerciseCharacterVisual';

interface Veo3ExerciseViewerProps {
  exercise: Exercise;
  variant?: 'card' | 'player' | 'modal' | 'mini';
  autoPlay?: boolean;
  onBack?: () => void;
}

export const Veo3ExerciseViewer: React.FC<Veo3ExerciseViewerProps> = ({
  exercise,
  variant = 'card',
  autoPlay = true,
  onBack
}) => {
  const [viewMode, setViewMode] = useState<'veo3' | 'kinetic'>('veo3');
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const [showAnatomyHUD, setShowAnatomyHUD] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const clipMeta: VeoClipMetadata = getVeoClipForExercise(exercise);
  const isCompact = variant === 'mini' || variant === 'card';

  // Video playback scrubber simulation & smooth progress loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) return 0;
          return p + 1.25;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800/80 shadow-2xl flex flex-col group ${
      isFullscreen 
        ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
        : isCompact 
          ? 'w-full h-48 sm:h-56' 
          : 'w-full h-80 sm:h-96'
    }`}>
      
      {/* Top Header Controls Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          {/* Back Button (if provided or in fullscreen) */}
          {(onBack || isFullscreen) && (
            <button
              onClick={() => {
                if (isFullscreen) {
                  setIsFullscreen(false);
                } else if (onBack) {
                  onBack();
                }
              }}
              className="p-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-md flex items-center gap-1 text-xs font-bold mr-1"
              title="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Veo 3 UltraHD Engine Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-[10px] font-black uppercase text-cyan-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <Video className="w-3 h-3 text-cyan-400" />
            <span>{clipMeta.badgeText}</span>
          </div>

          {/* Biomechanical Angle Tag */}
          {!isCompact && (
            <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-300">
              <Camera className="w-3 h-3 text-slate-400" />
              <span className="max-w-[140px] truncate">{clipMeta.cameraAngle.split(',')[0]}</span>
            </span>
          )}
        </div>

        {/* View Switcher: Photo-Realistic Veo-3 Cinema Video vs Kinetic Rig */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-lg">
          <button
            onClick={() => setViewMode('veo3')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all flex items-center gap-1 ${
              viewMode === 'veo3'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>Veo-3 4K</span>
          </button>
          <button
            onClick={() => setViewMode('kinetic')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all flex items-center gap-1 ${
              viewMode === 'kinetic'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Kinetic Rig</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
        {viewMode === 'kinetic' ? (
          <div className="w-full h-full">
            <ExerciseCharacterVisual exercise={exercise} variant={variant} isPlaying={isPlaying} />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
            
            {/* Photorealistic 4K Veo3 Video Scene with Ken Burns dynamic motion */}
            {clipMeta.posterImage ? (
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={clipMeta.posterImage}
                  alt={clipMeta.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-1000 ${
                    isPlaying 
                      ? 'scale-105 filter brightness-95 contrast-105 animate-pulse-subtle' 
                      : 'scale-100 filter brightness-80'
                  }`}
                  style={{
                    transform: isPlaying 
                      ? `scale(${1 + (progress % 20) * 0.003}) translateY(${(progress % 10) * 0.2 - 1}px)` 
                      : 'scale(1)'
                  }}
                />
                
                {/* Cinematic Vignette & Ambient Windshield Lighting Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950/60" />
            )}

            {/* High-tech HUD grid overlay and scanner lines */}
            {showAnatomyHUD && (
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.5) 0%, transparent 70%)'
                }}
              />
            )}

            {/* Vector HUD Anatomical Scan Line when playing */}
            {isPlaying && showAnatomyHUD && (
              <div 
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 pointer-events-none animate-scan-slow"
              />
            )}

            {/* Overlay Center: Exercise Kinetic Animation & Biomechanical Vector Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
              {/* Central Exercise Character Sync */}
              <div className="w-full h-full flex items-center justify-center scale-90 sm:scale-95 drop-shadow-2xl">
                <ExerciseCharacterVisual 
                  exercise={exercise} 
                  variant="mini" 
                  isPlaying={isPlaying} 
                />
              </div>

              {/* Dynamic Biomechanical Lens & Camera HUD Specs */}
              {showAnatomyHUD && (
                <div className="absolute bottom-10 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
                  <div className="text-left bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/30 shadow-lg max-w-[70%]">
                    <div className="text-[10px] uppercase font-mono text-cyan-400 font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                      <span>Veo-3 Biomechanical Focus</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-100 line-clamp-1">
                      {clipMeta.biomechanicalFocus}
                    </div>
                  </div>

                  {!isCompact && (
                    <div className="text-right bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
                      <div className="text-[10px] font-mono text-slate-400">Cinematics</div>
                      <div className="text-xs font-bold text-cyan-300">{clipMeta.resolution}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prompt Technical Spec Modal Overlay */}
            {showPromptDetails && (
              <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-xl p-5 overflow-y-auto flex flex-col justify-between animate-fade-in text-left">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <span className="text-xs font-black uppercase text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Google Veo-3 Video Prompt Specification
                    </span>
                    <button 
                      onClick={() => setShowPromptDetails(false)}
                      className="text-xs font-bold text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
                    >
                      Close
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800 mb-3">
                    "{clipMeta.veoPrompt}"
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Lighting:</span>
                      <span className="text-slate-200">{clipMeta.lightingAesthetic}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Coach Avatar:</span>
                      <span className="text-cyan-300">{clipMeta.instructorAvatar}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setShowPromptDetails(false)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    Back to Video
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Progress Bar & Bottom Controls */}
      <div className="relative z-20 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-700 transition-all"
            title={isPlaying ? 'Pause Clip' : 'Play Clip'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setProgress(0)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
            title="Restart Clip"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video Scrubber Bar */}
        <div className="flex-1 mx-2 flex items-center gap-2">
          <div 
            className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newPct = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
              setProgress(newPct);
            }}
          >
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400 shrink-0">
            {clipMeta.durationLabel}
          </span>
        </div>

        {/* HUD, Prompt Specs & Fullscreen Toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAnatomyHUD(!showAnatomyHUD)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              showAnatomyHUD 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle Anatomical HUD Overlay"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowPromptDetails(!showPromptDetails)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 text-xs transition-all"
            title="Inspect Veo-3 Prompt Specs"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Video'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

    </div>
  );
};
