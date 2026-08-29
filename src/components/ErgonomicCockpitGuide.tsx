import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  ShieldCheck, 
  Car, 
  Bike, 
  Truck, 
  Eye, 
  Sparkles, 
  Camera, 
  CheckCircle, 
  AlertTriangle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ERGONOMIC_TIPS } from '../data/exercises';

export const ErgonomicCockpitGuide: React.FC = () => {
  const [vehicleTab, setVehicleTab] = useState<'car' | 'two-wheeler'>('car');
  const [selectedTipId, setSelectedTipId] = useState<string>('ergo-seat-angle');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Self-assessment checklist
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    headrest: false,
    lumbar: false,
    pedalAngle: false,
    steeringGrip: false,
    mirrors: false
  });

  const tips = ERGONOMIC_TIPS.filter(t => t.vehicle === vehicleTab);
  const activeTip = ERGONOMIC_TIPS.find(t => t.id === selectedTipId) || tips[0];

  // Safely manage video stream attachment and playback
  useEffect(() => {
    if (cameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => {
        if (err?.name !== 'AbortError') {
          console.debug('Camera playback notice:', err);
        }
      });
    }
  }, [cameraActive, cameraStream]);

  // Clean up camera stream on unmount or toggle off
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [cameraStream]);

  const handleToggleCamera = async () => {
    setCameraError(null);
    if (cameraActive) {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
      setCameraStream(null);
      setCameraActive(false);
    } else {
      try {
        if (!navigator?.mediaDevices?.getUserMedia) {
          setCameraError('Webcam mirror is not supported in this browser environment.');
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setCameraStream(stream);
        setCameraActive(true);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setCameraError('Camera access was not granted or is unavailable in this frame.');
        }
        setCameraActive(false);
      }
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-sky-950 text-sky-400 border border-sky-800/60 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Cockpit Biomechanics</span>
            </span>
            <span className="text-xs text-slate-400">Zero-Strain Ergonomic Calibration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Driver & Rider Cockpit Ergonomic Master Guide
          </h2>
        </div>

        {/* Vehicle Switch */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => {
              setVehicleTab('car');
              setSelectedTipId('ergo-seat-angle');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              vehicleTab === 'car' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Car & SUV</span>
          </button>
          <button
            onClick={() => {
              setVehicleTab('two-wheeler');
              setSelectedTipId('ergo-moto-handlebar');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              vehicleTab === 'two-wheeler' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Motorcycle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Tip Selectors (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Ergonomic Adjustment Points
          </span>

          {tips.map((tip) => (
            <button
              key={tip.id}
              onClick={() => setSelectedTipId(tip.id)}
              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                selectedTipId === tip.id
                  ? 'bg-cyan-950/60 border-cyan-500/70 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {tip.area}
                </span>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {tip.angleOrDistance}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 mt-1 leading-snug">
                {tip.rule}
              </p>
            </button>
          ))}

          {/* Interactive Posture Mirror / Webcam Tool */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Live Posture Mirror Check</span>
              </span>
              <button
                onClick={handleToggleCamera}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all"
              >
                {cameraActive ? 'Stop Mirror' : 'Start Posture Mirror'}
              </button>
            </div>

            {cameraError && (
              <div className="p-2.5 mb-2 rounded-xl bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {cameraActive ? (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black mt-2">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
                <div className="absolute inset-0 pointer-events-none border-2 border-cyan-400/30 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-dashed border-cyan-400/50 flex items-center justify-center">
                    <span className="text-[10px] text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
                      Align Head & Ears with Spine
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1">
                Use your device camera as a mirror to check your ear-to-shoulder alignment and eliminate forward head tilt before driving.
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Detailed Biomechanical Rule & Action Steps (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {activeTip.area}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300">
                Optimal: {activeTip.angleOrDistance}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {activeTip.rule}
            </h3>

            {/* Why section */}
            <div className="my-4 p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 text-amber-200 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-amber-300 block mb-0.5">🔬 Biomechanical Consequence:</span>
              {activeTip.why}
            </div>

            {/* Step by Step Calibration Steps */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Exact Setup Steps:
              </span>
              <div className="space-y-2">
                {activeTip.correctionSteps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Pre-Drive Ergonomic Checklist */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pre-Departure 30-Second Bio-Checklist</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { key: 'headrest', label: 'Headrest centered at eye level' },
                { key: 'lumbar', label: 'Hips back in seat crease' },
                { key: 'pedalAngle', label: '20° knee bend on full brake' },
                { key: 'steeringGrip', label: 'Wrists rest on wheel rim' },
                { key: 'mirrors', label: 'Mirrors set in upright posture' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`p-2.5 rounded-xl border text-xs text-left flex items-center gap-2.5 transition-all ${
                    checklist[item.key]
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 shrink-0 ${checklist[item.key] ? 'text-emerald-400 fill-emerald-500/20' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
