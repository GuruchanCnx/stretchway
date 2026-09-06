import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Navigation, 
  Zap, 
  Sparkles, 
  HelpCircle, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Web Speech API interface declarations
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
    length: number;
  };
  resultIndex: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: any) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
}

interface VoiceCommandAssistantProps {
  onNavigate: (tab: 'routines' | 'bodymap' | 'breath' | 'cockpit' | 'trip' | 'log' | 'library') => void;
  onTriggerQuickPitstop: () => void;
  onToggleTheme: () => void;
  currentTab: string;
}

export const VoiceCommandAssistant: React.FC<VoiceCommandAssistantProps> = ({
  onNavigate,
  onTriggerQuickPitstop,
  onToggleTheme,
  currentTab
}) => {
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);
  const [isVoiceFeedbackEnabled, setIsVoiceFeedbackEnabled] = useState(true);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Safe Text-to-Speech audio feedback
  const speakFeedback = useCallback((text: string) => {
    if (!isVoiceFeedbackEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS playback error:', e);
    }
  }, [isVoiceFeedbackEnabled]);

  // Command parser
  const processCommand = useCallback((rawPhrase: string) => {
    const text = rawPhrase.toLowerCase().trim();
    let matched = false;

    // Quick Pitstop Command
    if (
      text.includes('quick pitstop') || 
      text.includes('pitstop') || 
      text.includes('start pitstop') || 
      text.includes('quick routine') ||
      text.includes('quick stretch') ||
      text.includes('driver break')
    ) {
      onTriggerQuickPitstop();
      setLastExecutedCommand('Triggered Quick Pitstop Routine');
      speakFeedback('Starting Quick Pitstop routine. Ensure vehicle is safely parked.');
      matched = true;
    }
    // Navigation: Routines
    else if (text.includes('routine') || text.includes('workouts') || text.includes('stretches')) {
      onNavigate('routines');
      setLastExecutedCommand('Navigated to Routines');
      speakFeedback('Switched to Guided Routines');
      matched = true;
    }
    // Navigation: Body Map / Soreness
    else if (text.includes('body map') || text.includes('soreness') || text.includes('pain map') || text.includes('muscle')) {
      onNavigate('bodymap');
      setLastExecutedCommand('Navigated to Body Map');
      speakFeedback('Opening Soreness Body Map');
      matched = true;
    }
    // Navigation: Breath Pacer
    else if (text.includes('breath') || text.includes('breathing') || text.includes('pacer') || text.includes('zen')) {
      onNavigate('breath');
      setLastExecutedCommand('Navigated to Diaphragmatic Breath');
      speakFeedback('Starting Diaphragmatic Breath Pacer');
      matched = true;
    }
    // Navigation: Cockpit Guide
    else if (text.includes('cockpit') || text.includes('ergonomic') || text.includes('posture') || text.includes('mirror') || text.includes('seat')) {
      onNavigate('cockpit');
      setLastExecutedCommand('Navigated to Cockpit Ergonomics');
      speakFeedback('Opening Ergonomic Cockpit Guide');
      matched = true;
    }
    // Navigation: Highway Trip Planner
    else if (text.includes('trip') || text.includes('planner') || text.includes('highway') || text.includes('route') || text.includes('navigation')) {
      onNavigate('trip');
      setLastExecutedCommand('Navigated to Smart Highway Planner');
      speakFeedback('Opening Smart Trip Planner');
      matched = true;
    }
    // Navigation: Road Recovery Log
    else if (text.includes('log') || text.includes('history') || text.includes('recovery') || text.includes('achievement') || text.includes('badge')) {
      onNavigate('log');
      setLastExecutedCommand('Navigated to Recovery Log');
      speakFeedback('Opening Road Recovery Log');
      matched = true;
    }
    // Navigation: Exercise Library
    else if (text.includes('library') || text.includes('all exercises') || text.includes('search')) {
      onNavigate('library');
      setLastExecutedCommand('Navigated to Exercise Library');
      speakFeedback('Opening Exercise Library');
      matched = true;
    }
    // Theme toggle
    else if (text.includes('theme') || text.includes('dark mode') || text.includes('light mode')) {
      onToggleTheme();
      setLastExecutedCommand('Toggled Display Theme');
      speakFeedback('Toggled visual theme');
      matched = true;
    }

    if (matched) {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = setTimeout(() => {
        setLastExecutedCommand(null);
      }, 4000);
    }
  }, [onNavigate, onTriggerQuickPitstop, onToggleTheme, speakFeedback]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI() as SpeechRecognitionInstance;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            processCommand(text);
          } else {
            currentTranscript += text;
          }
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setMicError('Microphone permission denied. Allow mic access in browser.');
          setIsListening(false);
        } else if (event.error !== 'no-speech') {
          console.warn('Speech recognition notice:', event.error);
        }
      };

      recognition.onend = () => {
        // If user didn't explicitly click stop, we keep listening in continuous driving mode
        if (isListening) {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
          }
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition init failed:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [processCommand]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      setTranscript('');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        speakFeedback('Hands-free voice copilot active. Say Quick Pitstop or tab name.');
      } catch (e) {
        console.warn('Error starting speech:', e);
      }
    }
  };

  return (
    <>
      {/* Floating Driving Voice Copilot Bar */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
        {/* Active Command Execution Pill */}
        <AnimatePresence>
          {lastExecutedCommand && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 border border-cyan-300"
            >
              <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>{lastExecutedCommand}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Heard Transcript Preview */}
        <AnimatePresence>
          {isListening && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="hidden md:flex px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-mono max-w-xs truncate shadow-lg"
            >
              "{transcript}"
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Control Buttons */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-2xl">
          {/* Audio TTS toggle */}
          <button
            onClick={() => setIsVoiceFeedbackEnabled(!isVoiceFeedbackEnabled)}
            className={`p-2 rounded-xl transition-all ${
              isVoiceFeedbackEnabled 
                ? 'text-cyan-400 hover:bg-slate-800' 
                : 'text-slate-500 hover:bg-slate-800'
            }`}
            title={isVoiceFeedbackEnabled ? 'Voice feedback ON' : 'Voice feedback muted'}
          >
            {isVoiceFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Help cheat sheet button */}
          <button
            onClick={() => setIsCheatSheetOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Voice Commands Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Main Mic Toggle Button */}
          <button
            onClick={toggleListening}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-xs transition-all shadow-lg ${
              isListening
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-rose-500/30 ring-2 ring-rose-400 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40'
            }`}
          >
            {isListening ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <Mic className="w-4 h-4" />
                <span>Copilot Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline font-mono">Voice Copilot</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mic Permission Warning Banner */}
      <AnimatePresence>
        {micError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 p-3 rounded-2xl bg-amber-950/90 text-amber-200 border border-amber-500/60 shadow-xl flex items-center gap-3 text-xs max-w-md"
          >
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{micError}</span>
            <button 
              onClick={() => setMicError(null)} 
              className="p-1 hover:bg-amber-900/60 rounded-lg text-amber-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Commands Cheat Sheet Modal */}
      <AnimatePresence>
        {isCheatSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Hands-Free Voice Copilot
                    </h3>
                    <p className="text-xs text-slate-400">
                      Safe driver voice control via Web Speech API
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheatSheetOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Commands List */}
              <div className="space-y-4 my-5 max-h-[60vh] overflow-y-auto pr-1">
                {/* Driver Safety Feature */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border border-cyan-500/40">
                  <div className="flex items-center gap-1.5 text-xs font-black text-cyan-300 uppercase tracking-wider font-mono">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Driver Emergency / Rest Break</span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-white">
                    Say: "Quick Pitstop" or "Start Pitstop"
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Instantly initiates the 5-minute rapid decompression routine.
                  </p>
                </div>

                {/* Tab Navigation */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">
                    Hands-Free Navigation Commands
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="font-mono text-cyan-300">"Go to Routines"</span>
                      <span className="text-slate-400">Workout Library</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="font-mono text-cyan-300">"Open Body Map"</span>
                      <span className="text-slate-400">Soreness Assessment</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="font-mono text-cyan-300">"Start Breathing"</span>
                      <span className="text-slate-400">Diaphragmatic Pacer</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="font-mono text-cyan-300">"Cockpit Guide"</span>
                      <span className="text-slate-400">Ergonomic Adjustments</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="font-mono text-cyan-300">"Trip Planner"</span>
                      <span className="text-slate-400">Highway Scheduler</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="font-mono text-cyan-300">"Road Log"</span>
                      <span className="text-slate-400">Recovery & Badges</span>
                    </div>
                  </div>
                </div>

                {/* Theme toggle */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono mb-1">
                    Display Controls
                  </div>
                  <div className="flex justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-mono text-cyan-300">"Dark Mode" / "Light Mode"</span>
                    <span className="text-slate-400">Toggle Theme</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setIsCheatSheetOpen(false);
                  if (!isListening) toggleListening();
                }}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>{isListening ? 'Keep Listening' : 'Activate Voice Copilot Now'}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
