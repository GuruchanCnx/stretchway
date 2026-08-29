import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Car, 
  Bike, 
  Truck, 
  ShieldCheck, 
  Activity, 
  Brain, 
  Heart, 
  Flame, 
  Zap, 
  Clock, 
  Play, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  DriverPrimaryIssue, 
  DrivingDuration, 
  DriverGoal, 
  VehicleType, 
  UserAssessmentProfile,
  Routine 
} from '../types';
import { CURATED_ROUTINES } from '../data/exercises';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAssessment: (profile: UserAssessmentProfile) => void;
  onLaunchRoutine: (routine: Routine) => void;
  initialVehicle?: VehicleType;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveAssessment,
  onLaunchRoutine,
  initialVehicle = 'car'
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedIssue, setSelectedIssue] = useState<DriverPrimaryIssue>('lower-back');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(initialVehicle === 'all' ? 'car' : initialVehicle);
  const [selectedDuration, setSelectedDuration] = useState<DrivingDuration>('moderate');
  const [selectedGoal, setSelectedGoal] = useState<DriverGoal>('instant-relief');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<UserAssessmentProfile | null>(null);

  if (!isOpen) return null;

  const issuesList: { id: DriverPrimaryIssue; title: string; subtitle: string; icon: string; tag: string }[] = [
    {
      id: 'lower-back',
      title: 'Lower Back Ache & Lumbar Shear',
      subtitle: 'Constant spinal compression, road vibration shocks, and posterior pelvic tilt.',
      icon: '🪵',
      tag: 'Most Common'
    },
    {
      id: 'neck-shoulders',
      title: 'Stiff Cervical Neck & Trap Knots',
      subtitle: 'Forward head carriage, helmet drag, side mirror blind-spot strain.',
      icon: '🦒',
      tag: 'Cervical Tension'
    },
    {
      id: 'sciatica-hips',
      title: 'Sciatic Nerve Tingling & Tight Hips',
      subtitle: 'Piriformis compression from prolonged bucket seat sitting; hip flexor shortening.',
      icon: '⚡',
      tag: 'Nerve & Fascia'
    },
    {
      id: 'wrist-hand',
      title: 'Carpal Tunnel & Grip Numbness',
      subtitle: 'Steering wheel death-grip, motorcycle throttle vibration, forearm tendonitis.',
      icon: '🖐️',
      tag: 'Grip & Peripheral'
    },
    {
      id: 'fatigue-brainfog',
      title: 'Highway Hypnosis & Sluggishness',
      subtitle: 'Tunnel vision, shallow chest breathing, low oxygen perfusion, eye fatigue.',
      icon: '🧠',
      tag: 'Mental Alertness'
    },
    {
      id: 'slouch-posture',
      title: 'Chest Collapse & Slouch Slump',
      subtitle: 'Thoracic kyphosis, rounded shoulders, reduced lung capacity in driver seat.',
      icon: '📐',
      tag: 'Posture Reset'
    }
  ];

  const vehiclesList: { id: VehicleType; title: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'car', title: 'Car / Sedan / SUV', desc: 'Bucket seats, lumbar contour, pedals & steering wheel', icon: <Car className="w-5 h-5" /> },
    { id: 'two-wheeler', title: 'Motorcycle / Scooter', desc: 'Forward tuck, helmet weight, clutch & foot controls', icon: <Bike className="w-5 h-5" /> },
    { id: 'truck', title: 'Long-Haul Commercial Truck', desc: 'High air-ride seat, heavy road vibration, multi-hour stints', icon: <Truck className="w-5 h-5" /> },
    { id: 'commuter', title: 'Transit / Train / Rideshare', desc: 'Fixed transit seats, static ergonomics, passenger posture', icon: <Activity className="w-5 h-5" /> }
  ];

  const durationsList: { id: DrivingDuration; title: string; desc: string; time: string }[] = [
    { id: 'short', title: 'City Commuter', desc: 'Under 60 mins daily stop-and-go driving', time: '< 1 hr / day' },
    { id: 'moderate', title: 'Daily Commute & Errands', desc: '1 to 3 hours daily behind the wheel', time: '1 - 3 hrs / day' },
    { id: 'long', title: 'Professional / Rideshare Driver', desc: '4 to 8 hours daily road exposure', time: '4 - 8 hrs / day' },
    { id: 'heavy', title: 'Long-Haul & Highway Touring', desc: '8+ hours extended cross-country transit', time: '8+ hrs / day' }
  ];

  const goalsList: { id: DriverGoal; title: string; desc: string; badge: string }[] = [
    { id: 'instant-relief', title: 'Instant In-Seat Relief', desc: 'Fast 2-5 min micro-drills for stoplights and rest stops', badge: 'High Efficiency' },
    { id: 'spine-health', title: 'Long-Term Spinal Health', desc: 'Decompress lumbar discs and reverse kyphotic posture slouch', badge: 'Preventative' },
    { id: 'endurance', title: 'Road Stamina & Cramp Prevention', desc: 'Sustain long driving stints without leg numbness or spasms', badge: 'Stamina' },
    { id: 'alertness', title: 'Peak Alertness & Anti-Fatigue', desc: 'Diaphragmatic vagal pacing and optic nerve reset for focus', badge: 'Neuro-Reset' }
  ];

  const handleFinishAssessment = () => {
    setIsGenerating(true);

    setTimeout(() => {
      // Algorithmic clinical prescription matching based on issue + vehicle + goal
      let prescribedId = 'car-in-seat-commuter';
      let title = 'Tailored Commuter In-Seat Protocol';
      let insights: string[] = [];

      if (selectedIssue === 'lower-back') {
        prescribedId = selectedVehicle === 'two-wheeler' ? 'bike-post-ride' : 'spinal-decompression-mastery';
        title = 'Lumbar Disc Decompression & Core Stabilization Rx';
        insights = [
          'Hydrate L4-L5 vertebrae with rhythmic pelvic clock tilts during red lights.',
          'Adjust lumbar seat angle to 100°-110° to reduce baseline spinal disc pressure by 25%.',
          'Perform supported bumper traction during all highway fuel stops.'
        ];
      } else if (selectedIssue === 'neck-shoulders') {
        prescribedId = selectedVehicle === 'two-wheeler' ? 'bike-quick-pitstop' : 'car-in-seat-commuter';
        title = 'Cervical Spine & Suboccipital Release Protocol';
        insights = [
          'Re-anchor headrest to touch the middle occipital bone, avoiding forward-head crane.',
          'Release levator scapulae wind-buffeting tension every 45 minutes.',
          'Sync chin retractions with diaphragmatic exhales to quiet trapezius spasm.'
        ];
      } else if (selectedIssue === 'sciatica-hips') {
        prescribedId = 'car-hamstring-sciatic-relief';
        title = 'Sciatic Nerve Flossing & Piriformis Release Rx';
        insights = [
          'Perform gentle hamstring nerve gliding with ankle flexes on the car floorboard.',
          'Avoid keeping thick wallets in back pockets which tilt the pelvis asymmetrically.',
          'Open shortened hip flexors (psoas) immediately upon stepping out of the vehicle.'
        ];
      } else if (selectedIssue === 'wrist-hand') {
        prescribedId = 'car-quick-pitstop';
        title = 'Carpal Tunnel & Grip Neuro-Vascular Reset';
        insights = [
          'Switch between 9-and-3 steering grip and relaxed 8-and-4 grip to unload forearm flexors.',
          'Execute finger-splay capillary bursts to flush pooled venous blood.',
          'Loosen grip pressure: steering requires only 20% max grip effort.'
        ];
      } else if (selectedIssue === 'fatigue-brainfog') {
        prescribedId = 'car-quick-pitstop';
        title = 'Vagal Anti-Fatigue & Optic De-Spasm Protocol';
        insights = [
          'Perform 4-7-8 diaphragmatic breathing to stimulate parasympathetic vagal equilibrium.',
          'Practice optic palming at rest stops to relax ocular ciliary muscles from road hypnosis.',
          'Target 250ml hydration every 90 minutes of highway transit.'
        ];
      } else {
        prescribedId = 'spinal-decompression-mastery';
        title = 'Thoracic Kyphosis & Full Spinal Alignment Rx';
        insights = [
          'Perform scapular pinches back into the seat backrest to counter steering wheel slouch.',
          'Elevate seat height so hips rest slightly higher than knees.',
          'Incorporate lateral crescent side-bends during parking pitstops.'
        ];
      }

      const profile: UserAssessmentProfile = {
        primaryIssue: selectedIssue,
        vehicle: selectedVehicle,
        duration: selectedDuration,
        goal: selectedGoal,
        completedAt: new Date().toISOString(),
        customRoutineTitle: title,
        prescribedRoutineId: prescribedId,
        keyInsights: insights
      };

      setGeneratedResult(profile);
      setIsGenerating(false);
      onSaveAssessment(profile);
    }, 600);
  };

  const handleStartPrescription = () => {
    if (!generatedResult) return;
    const routine = CURATED_ROUTINES.find(r => r.id === generatedResult.prescribedRoutineId) || CURATED_ROUTINES[0];
    onClose();
    onLaunchRoutine(routine);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden">
        
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400" />

        {/* Header with Progress Steps */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                Personalized Driver Mobility Rx
              </h2>
              <p className="text-xs text-slate-400">
                Olympic coaching tailored to your specific vehicle & road pain
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        {!generatedResult && (
          <div className="flex items-center justify-between py-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s 
                      ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20' 
                      : step > s 
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' 
                        : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-cyan-500/50' : 'bg-slate-800'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Select Primary Issue */}
        {step === 1 && !generatedResult && (
          <div className="space-y-4 py-2">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">Step 1 of 4</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                What is your primary discomfort or pain area on the road?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Select the symptom you experience most during or after driving.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[48vh] overflow-y-auto pr-1">
              {issuesList.map((issue) => {
                const isSelected = selectedIssue === issue.id;
                return (
                  <button
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue.id)}
                    className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{issue.icon}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {issue.tag}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white leading-snug">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {issue.subtitle}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="mt-3 flex items-center gap-1 text-xs font-bold text-cyan-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Selected Target</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Select Vehicle Type */}
        {step === 2 && !generatedResult && (
          <div className="space-y-4 py-2">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">Step 2 of 4</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                What vehicle or cockpit do you spend the most time in?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Our biomechanists adjust in-seat vs. standing clearances based on your cabin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehiclesList.map((veh) => {
                const isSelected = selectedVehicle === veh.id;
                return (
                  <button
                    key={veh.id}
                    onClick={() => setSelectedVehicle(veh.id)}
                    className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                      {veh.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        {veh.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {veh.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Daily Driving Exposure */}
        {step === 3 && !generatedResult && (
          <div className="space-y-4 py-2">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">Step 3 of 4</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                How many hours do you typically drive daily?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Determines cumulative vibration load and disc hydration frequency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {durationsList.map((dur) => {
                const isSelected = selectedDuration === dur.id;
                return (
                  <button
                    key={dur.id}
                    onClick={() => setSelectedDuration(dur.id)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {dur.time}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <h4 className="text-sm font-extrabold text-white">
                      {dur.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {dur.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Primary Goal */}
        {step === 4 && !generatedResult && (
          <div className="space-y-4 py-2">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">Step 4 of 4</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                What is your main road recovery goal?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                We'll generate your optimal daily mobility roadmap and personalized protocol.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goalsList.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                        {g.badge}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <h4 className="text-sm font-extrabold text-white">
                      {g.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {g.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RESULTS SCREEN: Prescribed Protocol & Insights */}
        {generatedResult && (
          <div className="space-y-5 py-2 animate-fade-in">
            <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 flex items-center gap-3.5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                Rx
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider">
                  Biomechanical Assessment Complete
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {generatedResult.customRoutineTitle}
                </h3>
                <p className="text-xs text-slate-300">
                  Targeted for {generatedResult.vehicle.toUpperCase()} • Daily {generatedResult.duration} duration
                </p>
              </div>
            </div>

            {/* Prescribed Clinical Insights */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Olympic Coach Prescribed Guidelines:</span>
              </h4>
              <div className="space-y-2">
                {generatedResult.keyInsights.map((insight, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartPrescription}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-transform hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Prescribed Routine Now</span>
              </button>

              <button
                onClick={onClose}
                className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Save to Profile & Explore</span>
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Controls Footer */}
        {!generatedResult && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-4">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                step === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(s => Math.min(4, s + 1))}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-transform active:scale-95"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishAssessment}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Rx...' : 'Generate My Prescription'}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
