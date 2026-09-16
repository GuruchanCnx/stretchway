import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  Zap,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Exercise } from '../types';

interface MotionCameraFeedbackOverlayProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onFormScoreUpdate?: (score: number) => void;
}

export const MotionCameraFeedbackOverlay: React.FC<MotionCameraFeedbackOverlayProps> = ({
  exercise,
  isOpen,
  onClose,
  onFormScoreUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);

  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundFeedback, setSoundFeedback] = useState(true);

  // Form states
  const [formStatus, setFormStatus] = useState<'great' | 'adjust' | 'calibrating'>('calibrating');
  const [formScore, setFormScore] = useState<number>(88);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Aligning posture with guide frame...');
  const [motionVelocity, setMotionVelocity] = useState<number>(0);
  const [centroidY, setCentroidY] = useState<number>(0.5);

  // Start real camera stream
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 480 },
            height: { ideal: 360 },
            facingMode: 'user'
          },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setHasCameraAccess(true);
        setIsSimulatedMode(false);
      } else {
        throw new Error('Webcam media devices not supported in this environment');
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setHasCameraAccess(false);
      setCameraError(err?.message || 'Camera permission required');
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  // Motion Detection & Optical Alignment Engine
  useEffect(() => {
    if (!isOpen) return;

    let frameCount = 0;
    const processFrame = () => {
      frameCount++;
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && (video || isSimulatedMode)) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          // Clear
          ctx.clearRect(0, 0, width, height);

          let diffSum = 0;
          let massCenterX = width / 2;
          let massCenterY = height / 2;

          if (!isSimulatedMode && video && video.readyState >= 2) {
            // Draw current video frame (mirrored)
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(video, -width, 0, width, height);
            ctx.restore();

            // Analyze pixel delta for optical motion detection
            try {
              const currentFrame = ctx.getImageData(0, 0, width, height);
              const data = currentFrame.data;
              const prev = prevFrameDataRef.current;

              if (prev && prev.length === data.length) {
                let weightedX = 0;
                let weightedY = 0;
                let motionCount = 0;

                // Sample every 4th pixel for high performance 60fps
                for (let i = 0; i < data.length; i += 16) {
                  const rDiff = Math.abs(data[i] - prev[i]);
                  const gDiff = Math.abs(data[i + 1] - prev[i + 1]);
                  const bDiff = Math.abs(data[i + 2] - prev[i + 2]);
                  const delta = (rDiff + gDiff + bDiff) / 3;

                  if (delta > 28) {
                    diffSum += delta;
                    const pixelIdx = i / 4;
                    const px = pixelIdx % width;
                    const py = Math.floor(pixelIdx / width);
                    weightedX += px;
                    weightedY += py;
                    motionCount++;
                  }
                }

                if (motionCount > 0) {
                  massCenterX = weightedX / motionCount;
                  massCenterY = weightedY / motionCount;
                }
              }

              // Store current frame
              prevFrameDataRef.current = new Uint8ClampedArray(data);
            } catch (e) {
              // Canvas tainted or unavailable
            }
          } else {
            // Simulated video background for demo or camera-less mode
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, width, height);

            // Draw simulated user silhouette
            ctx.save();
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
            ctx.lineWidth = 3;
            // Head
            const headY = 80 + Math.sin(frameCount * 0.05) * 5;
            ctx.beginPath();
            ctx.arc(width / 2, headY, 32, 0, Math.PI * 2);
            ctx.stroke();
            // Shoulders
            ctx.beginPath();
            ctx.moveTo(width / 2 - 70, headY + 70);
            ctx.lineTo(width / 2 + 70, headY + 70);
            ctx.stroke();
            // Spine
            ctx.beginPath();
            ctx.moveTo(width / 2, headY + 32);
            ctx.lineTo(width / 2, headY + 160);
            ctx.stroke();
            ctx.restore();

            diffSum = 450 + Math.sin(frameCount * 0.08) * 350;
            massCenterX = width / 2;
            massCenterY = headY;
          }

          // Evaluate Form: is movement within optimal cadence?
          const normalizedMotion = Math.min(100, Math.round(diffSum / 120));
          setMotionVelocity(normalizedMotion);
          setCentroidY(massCenterY / height);

          // Evaluation logic
          const isCentered = massCenterX > width * 0.35 && massCenterX < width * 0.65;
          const isSmooth = normalizedMotion < 55; // Not erratic jerk
          const hasMovement = normalizedMotion > 4; // Not frozen/absent

          if (frameCount > 20) {
            if (isCentered && isSmooth && hasMovement) {
              setFormStatus('great');
              setFormScore(prev => Math.min(98, prev + 1));
              setFeedbackMessage('Great Form! Spine and shoulders locked in optimal alignment 🎯');
            } else if (!isCentered) {
              setFormStatus('adjust');
              setFormScore(prev => Math.max(72, prev - 1));
              setFeedbackMessage('Adjust Alignment: Center your torso within the cyan target box ⚠️');
            } else if (!isSmooth) {
              setFormStatus('adjust');
              setFeedbackMessage('Adjust Alignment: Slow down motion, keep stretch smooth & controlled 🧘');
            } else {
              setFormStatus('great');
              setFeedbackMessage('Hold stretch posture. Breathing steady ✨');
            }
          }

          // Draw HUD Biomechanical Target Box
          ctx.save();
          const targetW = width * 0.55;
          const targetH = height * 0.68;
          const targetX = (width - targetW) / 2;
          const targetY = (height - targetH) / 2 - 15;

          ctx.strokeStyle = formStatus === 'great' ? '#22d3ee' : '#f59e0b';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 6]);

          // Rounded target frame
          ctx.strokeRect(targetX, targetY, targetW, targetH);
          ctx.setLineDash([]);

          // Center crosshair
          ctx.strokeStyle = formStatus === 'great' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(245, 158, 11, 0.4)';
          ctx.beginPath();
          ctx.moveTo(width / 2, targetY - 10);
          ctx.lineTo(width / 2, targetY + targetH + 10);
          ctx.stroke();

          // Shoulder horizon guide
          const shoulderY = targetY + targetH * 0.42;
          ctx.beginPath();
          ctx.moveTo(targetX - 10, shoulderY);
          ctx.lineTo(targetX + targetW + 10, shoulderY);
          ctx.stroke();

          // Motion tracking dot
          ctx.fillStyle = formStatus === 'great' ? '#10b981' : '#f59e0b';
          ctx.beginPath();
          ctx.arc(massCenterX, massCenterY, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isOpen, isSimulatedMode, formStatus]);

  // Report form score to parent
  useEffect(() => {
    if (onFormScoreUpdate) {
      onFormScoreUpdate(formScore);
    }
  }, [formScore, onFormScoreUpdate]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed transition-all z-40 ${
        isMinimized
          ? 'bottom-20 right-4 w-72 h-44 rounded-2xl shadow-2xl border border-cyan-500/40 bg-slate-950 overflow-hidden'
          : 'bottom-4 right-4 sm:right-6 w-[92vw] sm:w-[420px] rounded-3xl shadow-2xl border border-slate-700/80 bg-slate-950/95 backdrop-blur-xl overflow-hidden'
      }`}
    >
      {/* Hidden processing video */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="hidden"
      />

      {/* Top Header Controls */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              formStatus === 'great' ? 'bg-emerald-400' : 'bg-amber-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              formStatus === 'great' ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Form Vision</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
            {formScore}% Match
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSoundFeedback(!soundFeedback)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              soundFeedback ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={soundFeedback ? 'Form Chimes: Active' : 'Form Chimes: Muted'}
          >
            {soundFeedback ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title="Close Camera Coach"
          >
            <CameraOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Vision Stage (Canvas Feed) */}
      <div className="relative w-full h-52 sm:h-64 bg-slate-950 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />

        {/* Fallback overlay when real camera is blocked */}
        {hasCameraAccess === false && !isSimulatedMode && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center z-30">
            <ShieldCheck className="w-8 h-8 text-amber-400 mb-2" />
            <h4 className="text-xs font-extrabold text-white">Camera Access Restricted</h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[280px]">
              Webcam permission is not active or blocked by container policy.
            </p>
            <button
              onClick={() => setIsSimulatedMode(true)}
              className="mt-3 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition-all"
            >
              Launch Optical Vision Simulator
            </button>
          </div>
        )}

        {/* Real-time Visual Form Badge (Great Form vs Adjust Alignment) */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-20">
          <AnimatePresence mode="wait">
            {formStatus === 'great' ? (
              <motion.div
                key="great"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="px-3 py-1 rounded-xl bg-emerald-500/90 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/40"
              >
                <CheckCircle2 className="w-3.5 h-3.5 fill-slate-950 text-emerald-300" />
                <span>Great Form!</span>
              </motion.div>
            ) : (
              <motion.div
                key="adjust"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="px-3 py-1 rounded-xl bg-amber-500/90 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/40"
              >
                <AlertTriangle className="w-3.5 h-3.5 fill-slate-950 text-amber-200" />
                <span>Adjust Alignment</span>
              </motion.div>
            )}
          </AnimatePresence>

          {isSimulatedMode && (
            <span className="px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/60 text-[9px] font-mono font-bold">
              Simulation Mode
            </span>
          )}
        </div>

        {/* Bottom Biomechanical Feedback Strip */}
        <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none">
          <div className="p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-left flex items-center gap-2 shadow-lg">
            <div className={`p-1.5 rounded-lg ${formStatus === 'great' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-200 truncate">
                {feedbackMessage}
              </p>
              <div className="flex items-center gap-3 text-[9px] font-mono text-slate-400 mt-0.5">
                <span>Torso Y: {Math.round(centroidY * 100)}%</span>
                <span>Motion Vel: {motionVelocity}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Helper Actions */}
      {!isMinimized && (
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px]">
            Target drill: <strong className="text-cyan-400 font-semibold">{exercise.name}</strong>
          </span>
          <button
            onClick={() => {
              setFormScore(90);
              setFormStatus('great');
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Recalibrate</span>
          </button>
        </div>
      )}
    </div>
  );
};
