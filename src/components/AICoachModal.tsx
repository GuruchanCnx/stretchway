import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  Play, 
  Wand2, 
  CheckCircle, 
  AlertCircle,
  Car,
  Bike,
  Clock,
  Flame,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { Routine, ChatMessage, VehicleType } from '../types';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGeneratedRoutine: (routine: Routine) => void;
  currentVehicle: VehicleType;
  initialPrompt?: string;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({
  isOpen,
  onClose,
  onLaunchGeneratedRoutine,
  currentVehicle,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'coach',
      content: `Hello! I'm Coach Lyra, your Olympic Gymnastics & Yoga Biomechanics Coach for road health. What vehicle are you operating, and where in your spine or limbs are you feeling tightness?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'generator'>('chat');

  // Generator form state
  const [genVehicle, setGenVehicle] = useState<'car' | 'two-wheeler' | 'truck'>(
    currentVehicle === 'two-wheeler' ? 'two-wheeler' : currentVehicle === 'truck' ? 'truck' : 'car'
  );
  const [genDuration, setGenDuration] = useState<number>(8);
  const [genPainAreas, setGenPainAreas] = useState<string[]>(['Lower Back', 'Neck & Shoulders']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoutine, setGeneratedRoutine] = useState<Routine | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sentInitialRef = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && initialPrompt && initialPrompt !== sentInitialRef.current) {
      sentInitialRef.current = initialPrompt;
      handleSendMessage(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  if (!isOpen) return null;

  const quickPrompts = [
    'My lower back is stiff after 3 hours of driving',
    'Numbness in right throttle wrist on motorcycle',
    'Neck pinching when checking blind spots',
    'Emergency 3-minute alertness reset for highway drowsiness'
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMsg;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setIsLoading(true);

    const controller = new AbortController();
    try {
      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: textToSend,
          context: {
            vehicle: genVehicle,
            painAreas: genPainAreas
          },
          history: messages.slice(-4)
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const coachReply: ChatMessage = {
        id: `coach-${Date.now()}`,
        role: 'coach',
        content: data.reply || "Keep your spine elongated, breathe into your diaphragm, and relax your shoulders.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, coachReply]);
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.warn('AI Coach chat fallback:', err);
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'coach',
            content: "As an Olympic coach, my immediate rule: park safely, decompress your lumbar spine with seated pelvic tilts (10 reps), and perform 4-7-8 breathing.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCustomRoutine = async () => {
    setIsGenerating(true);
    setGeneratedRoutine(null);
    const controller = new AbortController();
    try {
      const res = await fetch('/api/coach/generate-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          vehicle: genVehicle,
          durationMinutes: genDuration,
          painFocus: genPainAreas.join(', '),
          locationType: 'In-Seat & Parking Lot',
          experienceLevel: 'All Levels'
        })
      });

      if (!res.ok) {
        throw new Error(`Routine generation failed: ${res.status}`);
      }

      const data = await res.json();
      if (data && data.exercises) {
        const fullRoutine: Routine = {
          id: `custom-ai-${Date.now()}`,
          title: data.title || 'AI Personalized Driver Relief',
          subtitle: data.subtitle || 'Custom biomechanical sequence',
          category: 'quick',
          vehicle: genVehicle,
          durationMinutes: data.totalDurationMinutes || genDuration,
          intensity: 'Moderate',
          targetAreas: data.targetMuscles || genPainAreas,
          coachRationale: data.coachRationale || 'Targeted decompression sequence designed by AI Biomechanics Engine.',
          bannerGradient: 'from-cyan-500 to-sky-600',
          exercises: data.exercises.map((ex: any, i: number) => ({
            id: ex.id || `ai-ex-${i}`,
            name: ex.name,
            category: 'quick',
            vehicle: [genVehicle],
            durationSeconds: ex.durationSeconds || 45,
            reps: ex.reps || '10 reps',
            intensity: ex.intensity || 'Moderate',
            targetMuscles: Array.isArray(ex.targetArea) ? ex.targetArea : [ex.targetArea || 'Spine'],
            muscleGroup: ['lower-back', 'neck'],
            location: 'Either',
            steps: ex.steps || ['Perform smoothly', 'Maintain breathing'],
            formCues: ex.formCues || 'Keep spine neutral',
            avoidMistake: ex.avoidMistake || 'Avoid jerking motions',
            biomechanicsRationale: data.coachRationale || 'Releases highway compression',
            breathPattern: ex.breathPattern || 'Deep diaphragmatic breathing'
          }))
        };
        setGeneratedRoutine(fullRoutine);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.warn('Routine generation notice:', err);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePainArea = (area: string) => {
    setGenPainAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[90vh] max-h-[750px] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 transition-all flex items-center gap-1 text-xs font-bold shadow-sm"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Coach Lyra • AI Biomechanics Master
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Olympic Coach & Yoga Ergonomics for Drivers & Motorcyclists
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'chat' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Chat Diagnostic
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'generator' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Protocol Generator
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: AI Chat Diagnostic */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/40">
            
            {/* Quick Prompts Bar */}
            <div className="p-3 border-b border-slate-800/60 flex gap-2 overflow-x-auto no-scrollbar">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-medium whitespace-nowrap transition-all"
                >
                  ⚡ {q}
                </button>
              ))}
            </div>

            {/* Chat History List */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'coach' && (
                    <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none shadow-md'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-[10px] block mt-1.5 ${msg.role === 'user' ? 'text-slate-900/70' : 'text-slate-500'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Coach Lyra is analyzing driver biomechanics...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-950/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Describe your road stiffness (e.g. sciatica tingling in right hip)..."
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim() || isLoading}
                  className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 disabled:opacity-40 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask Coach</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Tab 2: Custom Routine Generator */}
        {activeTab === 'generator' && (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-950/40">
            <div>
              <h4 className="text-base font-extrabold text-white">
                Generate Custom Biomechanical Relief Protocol
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Our AI model synthesizes Olympic gymnastics mobility and Yoga therapy principles tailored to your vehicle and stiffness triggers.
              </p>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                1. Select Vehicle Type:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'car', label: 'Car / SUV', icon: <Car className="w-4 h-4" /> },
                  { id: 'two-wheeler', label: 'Motorcycle / Bike', icon: <Bike className="w-4 h-4" /> },
                  { id: 'truck', label: 'Commercial Truck', icon: <Car className="w-4 h-4" /> }
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setGenVehicle(v.id as any)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      genVehicle === v.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {v.icon}
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                2. Available Rest Stop Duration:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 8, 12].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setGenDuration(mins)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      genDuration === mins
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            {/* Pain Triggers Checklist */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                3. Primary Stiffness Areas:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Lower Back / Lumbar',
                  'Neck & Suboccipitals',
                  'Trapezius & Shoulders',
                  'Piriformis & Sciatica',
                  'Steering Wrist & Forearm',
                  'Tight Hip Flexors',
                  'Foot & Calf Heaviness'
                ].map((area) => {
                  const isSelected = genPainAreas.includes(area);
                  return (
                    <button
                      key={area}
                      onClick={() => togglePainArea(area)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{area}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleGenerateCustomRoutine}
              disabled={isGenerating || genPainAreas.length === 0}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 disabled:opacity-40 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Biomechanical Routine...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Custom {genDuration}-Min Protocol</span>
                </>
              )}
            </button>

            {/* Generated Routine Card Preview */}
            {generatedRoutine && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/60 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-cyan-500 text-slate-950">
                    Custom Generated Protocol
                  </span>
                  <span className="text-xs text-cyan-400 font-mono">
                    ⏱️ {generatedRoutine.durationMinutes} Min • {generatedRoutine.exercises.length} Drills
                  </span>
                </div>

                <h4 className="text-lg font-extrabold text-white">
                  {generatedRoutine.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {generatedRoutine.subtitle}
                </p>

                <div className="my-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-cyan-300">Coach Rationale:</strong> {generatedRoutine.coachRationale}
                </div>

                <div className="space-y-1.5 mb-4">
                  {generatedRoutine.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                      <span className="font-semibold text-slate-200">{i + 1}. {ex.name}</span>
                      <span className="text-cyan-400 font-mono">{ex.durationSeconds}s</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    onLaunchGeneratedRoutine(generatedRoutine);
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start Guided Custom Workout Now</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
