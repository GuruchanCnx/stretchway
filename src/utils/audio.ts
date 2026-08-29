// Web Audio API Synthesizer & Speech Synthesizer for StretchWay

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play countdown tick sound (soft woodblock or gentle blip)
export function playTick(frequency = 600, duration = 0.08, volume = 0.15) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.debug('Audio not allowed yet:', e);
  }
}

// Play breath pacer chime (Inhale = higher chord, Exhale = lower calming chord)
export function playBreathChime(type: 'inhale' | 'exhale' | 'hold') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const freqs = type === 'inhale' ? [432, 540, 648] : type === 'exhale' ? [360, 432, 518] : [432, 486];
    
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0.04 / (i + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 1.8);
    });
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

// Play gong / Tibetan singing bowl chime on routine completion
export function playGong() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const rootFreq = 216; // Harmonic resonance
    const harmonics = [1, 1.5, 2, 2.76, 3.5];

    harmonics.forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(rootFreq * ratio, now);

      const initialVolume = 0.15 / (index + 1);
      gain.gain.setValueAtTime(initialVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 4.5);
    });
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

// Voice coach speech synthesis
export function speakCoachCue(text: string, enabled = true) {
  if (!enabled || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Calm, steady pacing
    utterance.pitch = 1.0;
    utterance.volume = 0.85;

    // Try to pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en'));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.debug('Speech error:', e);
  }
}

export function stopVoiceCoach() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
