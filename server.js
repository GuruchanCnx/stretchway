import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI initialization
let aiClient = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Using fallback intelligent response engine.');
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// System prompt as Olympic Coach & Yoga Biomechanics Trainer for Road Drivers
const COACH_SYSTEM_PROMPT = `You are Coach Lyra, StretchWay's elite AI Ergonomics & Biomechanics Master.
Your credentials: Olympic Gymnastics Coach, Senior Yoga Therapist, and Master Mobility Specialist for Professional Drivers & Riders.

Your mission: Deliver immediate, safe, anatomically sound relief for road drivers (cars, trucks, motorcycles, cyclists, commuters) suffering from stiffness, spinal compression, numbness, forward head posture, piriformis/sciatica flare-ups, and driver fatigue.

Guidelines:
1. Tone: Empathetic, energetic, authoritative yet accessible, laser-focused on biomechanical alignment.
2. Safety first: Always remind drivers to only perform stretches when safely parked in a safe spot with the engine off / helmet removed.
3. Anatomy precision: Explain which muscles are being decompressed (e.g., Psoas major, Piriformis, Levator scapulae, Thoracolumbar fascia) and what cue prevents injury (e.g. "tuck chin like holding an egg", "hinge from hip crease not lumbar").
4. Keep action steps crystal-clear with step counts, breathing counts (inhale 4s, hold 2s, exhale 6s), and duration.
5. If returning JSON for structured routines, strictly follow the JSON schema requested.`;

// API endpoint for AI Coach Chat
app.post('/api/coach/chat', async (req, res) => {
  try {
    const { message, context, history } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback expert response if API key is not yet configured
      const fallbackReplies = [
        `As an Olympic coach and yoga therapist, I recommend immediately resetting your pelvic angle. In your seat: slide your hips all the way back against the seat crease, place both feet flat, tuck your chin gently to lengthen the cervical spine, and perform 5 cycles of 4-7-8 breathing while doing isometric scapular retractions. How does your lower back feel now?`,
        `For two-wheelers and motorcycle fatigue: dismount safely, place your hands on your bike seat at hip height, step back into a modified "Rest-Stop Downward Dog", and lengthen your lats and hamstrings for 30 seconds. This decompresses the compression from road vibrations.`,
        `Driver Forward-Head Posture occurs when looking ahead for hours. Do this quick reset: Double chin retraction (push occipital base back without looking down) + 5 slow thoracic rotations with elbows wide.`
      ];
      const randomFallback = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({
        reply: `${randomFallback}\n\n*(Tip: Add your Gemini API key in settings for real-time tailored biomechanical diagnostics!)*`,
        source: 'local-expert-engine'
      });
    }

    const conversationContext = context ? `\n[User Context: Vehicle=${context.vehicle || 'Car'}, Drive Time=${context.duration || '2 hours'}, Pain Areas=${(context.painAreas || []).join(', ')}]` : '';
    
    let formattedContents = `${COACH_SYSTEM_PROMPT}\n\n${conversationContext}\n\nUser Question: ${message}`;
    if (history && Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6).map(h => `${h.role === 'user' ? 'User' : 'Coach Lyra'}: ${h.content}`).join('\n');
      formattedContents = `${COACH_SYSTEM_PROMPT}\n\n${conversationContext}\n\nPrevious conversation:\n${recentHistory}\n\nUser Question: ${message}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: formattedContents,
    });

    res.json({
      reply: response.text || 'Keep your spine tall and breathe deeply.',
      source: 'gemini-3.7-flash'
    });
  } catch (error) {
    console.error('Error in /api/coach/chat:', error);
    res.status(500).json({
      error: 'Failed to generate AI response',
      message: error.message
    });
  }
});

// API endpoint for generating tailored custom routine
app.post('/api/coach/generate-routine', async (req, res) => {
  try {
    const { vehicle, durationMinutes, painLevel, painFocus, locationType, environmentNotes, experienceLevel } = req.body;
    const ai = getGenAI();
    const veh = vehicle || 'car';
    const dur = Number(durationMinutes) || 8;
    const pLevel = painLevel || 5;
    const focus = painFocus || 'Lower Back & Cervical Spine';
    const loc = locationType || 'In-Seat';

    const prompt = `${COACH_SYSTEM_PROMPT}

You are creating a specialized, AI-engineered personalized road driver recovery routine.
Driver Specifications:
- Vehicle Environment: ${veh} (${environmentNotes || 'Road driving / commuting'})
- Pain Severity Score (1-10): ${pLevel}/10 (${pLevel >= 7 ? 'Severe tension & muscle spasms' : pLevel >= 4 ? 'Moderate aching & stiffness' : 'Mild fatigue & postural fatigue'})
- Specific Tension / Pain Areas: ${focus}
- Target Session Duration: ${dur} minutes
- Execution Location: ${loc}
- Driver Experience Level: ${experienceLevel || 'All Levels'}

Generate a medically and biomechanically sound routine that immediately addresses the pain level (${pLevel}/10), safely decompressing nerves, lengthening shortened postural muscles (Psoas, Suboccipitals, Piriformis, Pectoralis), and restoring spinal fluid circulation.

Return ONLY valid JSON matching this schema without markdown formatting or code fences:
{
  "id": "ai-smart-${Date.now()}",
  "title": "Inspiring, descriptive title (e.g. '8-Min Lumbar & Piriformis Decompression Rx')",
  "subtitle": "Clear biomechanical description of what this routine relieves",
  "category": "car",
  "vehicle": "${veh}",
  "durationMinutes": ${dur},
  "intensity": "${pLevel >= 7 ? 'Deep Release' : pLevel >= 4 ? 'Moderate' : 'Gentle'}",
  "targetAreas": ["Lower Back", "Neck", "Hips"],
  "coachRationale": "Olympic Coach & Yoga Biomechanics Master rationale explaining the sequential relief logic.",
  "exercises": [
    {
      "id": "ex-1",
      "name": "Specific Exercise Name",
      "durationSeconds": 45,
      "reps": "10 reps or 30s hold",
      "intensity": "${pLevel >= 7 ? 'Deep Release' : pLevel >= 4 ? 'Moderate' : 'Gentle'}",
      "targetMuscles": ["Psoas Major", "Quadratus Lumborum"],
      "muscleGroup": ["lower-back", "hips"],
      "location": "${loc}",
      "steps": [
        "Step 1 with exact postural cue",
        "Step 2 with movement instruction",
        "Step 3 with release instruction"
      ],
      "formCues": "Olympic coach precision alignment cue",
      "avoidMistake": "Common dangerous compensatory mistake to avoid",
      "biomechanicsRationale": "Exact anatomical mechanism of decompression",
      "breathPattern": "Inhale 4s into diaphragm, Exhale 6s"
    }
  ]
}`;

    if (!ai) {
      // Return high quality built-in structured protocol tailored to pain level and vehicle
      const isMotorcycle = veh === 'two-wheeler';
      const isTruck = veh === 'truck';
      
      const fallbackTitle = isMotorcycle 
        ? `${dur}-Min Rider Throttle & Hip Decompression Rx`
        : isTruck 
          ? `${dur}-Min Long-Haul Thoracic & Lumbar Reset`
          : `${dur}-Min Smart Pain Level ${pLevel} Driver Relief Rx`;

      return res.json({
        id: `ai-routine-${Date.now()}`,
        title: fallbackTitle,
        subtitle: `Targeted biomechanical decompression for ${focus} (Pain Level: ${pLevel}/10)`,
        category: isMotorcycle ? 'two-wheeler' : 'car',
        vehicle: veh,
        durationMinutes: dur,
        intensity: pLevel >= 7 ? 'Deep Release' : pLevel >= 4 ? 'Moderate' : 'Gentle',
        targetAreas: [focus, 'Spine', 'Circulation'],
        coachRationale: `Tailored Olympic Coaching prescription designed to counteract static seated spinal compression and neuromuscular ischemia at pain level ${pLevel}/10.`,
        exercises: [
          {
            id: `smart-ex-1-${Date.now()}`,
            name: isMotorcycle ? "Rider Throttle Wrist & Forearm Extensor Decompression" : "Occipital Chin Retraction & Suboccipital Release",
            category: isMotorcycle ? "two-wheeler" : "car",
            vehicle: [veh],
            durationSeconds: Math.max(30, Math.floor((dur * 60) / 4)),
            reps: "10 gentle rhythmic glides",
            intensity: pLevel >= 7 ? "Deep Release" : "Gentle",
            targetMuscles: isMotorcycle ? ["Extensor Carpi Radialis", "Pronator Teres"] : ["Suboccipitals", "Levator Scapulae"],
            muscleGroup: isMotorcycle ? ["wrists"] : ["neck"],
            location: loc,
            steps: [
              "Sit with spine elongated away from the steering grip.",
              "Glide head straight back (making a gentle double-chin) without tilting down.",
              "Hold the axial elongation for 3 full seconds while relaxing shoulders down."
            ],
            formCues: "Keep your eye gaze parallel to the horizon.",
            avoidMistake: "Tucking chin down into chest instead of retracting skull backwards.",
            biomechanicsRationale: "Reverses forward-head cervical shear stress caused by road vibration and helmet load.",
            breathPattern: "Exhale on retraction, Inhale on release"
          },
          {
            id: `smart-ex-2-${Date.now()}`,
            name: "Pelvic Clock & Lumbar Sacral Mobilizer",
            category: "car",
            vehicle: [veh],
            durationSeconds: Math.max(45, Math.floor((dur * 60) / 4)),
            reps: "12 fluid rocking cycles",
            intensity: "Moderate",
            targetMuscles: ["Quadratus Lumborum", "Erector Spinae", "Transverse Abdominis"],
            muscleGroup: ["lower-back", "hips"],
            location: loc,
            steps: [
              "Rest hands on knees or wheel rim.",
              "Rock pelvis forward to create a gentle lumbar arch, then rock back to flatten lumbar spine.",
              "Flow between 12 o'clock and 6 o'clock smoothly with your breath."
            ],
            formCues: "Initiate movement purely from the pelvic bowl, keeping ribs quiet.",
            avoidMistake: "Forcing range of motion if experiencing acute nerve impingement.",
            biomechanicsRationale: "Restores hydration to compressed L4-L5 and L5-S1 lumbar discs.",
            breathPattern: "Inhale forward arch, Exhale posterior tuck"
          },
          {
            id: `smart-ex-3-${Date.now()}`,
            name: "Seated Figure-4 Piriformis & Sciatic Glide",
            category: "car",
            vehicle: [veh],
            durationSeconds: Math.max(45, Math.floor((dur * 60) / 4)),
            reps: "30s hold each side",
            intensity: pLevel >= 7 ? "Deep Release" : "Moderate",
            targetMuscles: ["Piriformis", "Gluteus Medius", "Obturator Internus"],
            muscleGroup: ["hips", "lower-back"],
            location: loc,
            steps: [
              "Cross right ankle over left knee to create a figure-4 shape.",
              "Flex right ankle to 90 degrees to stabilize the knee joint.",
              "Sit tall, then hinge forward from hip crease keeping spine neutral until a deep glute stretch is felt."
            ],
            formCues: "Lead forward with your sternum; never round your lower back.",
            avoidMistake: "Slumping forward over the knee.",
            biomechanicsRationale: "Releases tight piriformis muscle compressing the sciatic nerve from accelerator pedal usage.",
            breathPattern: "Deep slow 6s exhales into the hip crease"
          },
          {
            id: `smart-ex-4-${Date.now()}`,
            name: "Diaphragmatic Vagal Nerve Reset & Breath Decompression",
            category: "breathing",
            vehicle: [veh],
            durationSeconds: Math.max(45, Math.floor((dur * 60) / 4)),
            reps: "5 full restorative cycles",
            intensity: "Gentle",
            targetMuscles: ["Diaphragm", "Intercostals", "Scalenes"],
            muscleGroup: ["core"],
            location: loc,
            steps: [
              "Place one hand on upper chest and one on belly.",
              "Inhale through nose for 4 seconds, feeling only the belly hand rise.",
              "Hold breath gently for 4 seconds.",
              "Slowly exhale through pursed lips for 6-8 seconds to activate the parasympathetic brake."
            ],
            formCues: "Keep upper chest, shoulders, and jaw completely still.",
            avoidMistake: "Gasping into the neck muscles.",
            biomechanicsRationale: "Lowers sympathetic cortisol spikes, drops resting heart rate, and melts hypertonic muscle tone.",
            breathPattern: "4s Inhale - 4s Hold - 6s Exhale"
          }
        ]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text?.trim() || '{}';
    const jsonStr = text.replace(/^```json/g, '').replace(/```$/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    // Ensure all mandatory fields exist and are normalized
    if (!parsed.id) parsed.id = `ai-smart-${Date.now()}`;
    if (!parsed.vehicle) parsed.vehicle = veh;
    if (!parsed.durationMinutes) parsed.durationMinutes = dur;
    if (!parsed.intensity) parsed.intensity = pLevel >= 7 ? 'Deep Release' : pLevel >= 4 ? 'Moderate' : 'Gentle';
    if (!parsed.category) parsed.category = veh === 'two-wheeler' ? 'two-wheeler' : 'car';
    if (!parsed.targetAreas || !Array.isArray(parsed.targetAreas)) parsed.targetAreas = [focus, 'Spine', 'Hips'];
    if (!parsed.coachRationale) parsed.coachRationale = `Engineered for ${veh} driver pain relief at severity ${pLevel}/10.`;

    if (Array.isArray(parsed.exercises)) {
      parsed.exercises = parsed.exercises.map((ex, idx) => ({
        ...ex,
        id: ex.id || `smart-ex-${idx + 1}-${Date.now()}`,
        category: ex.category || parsed.category,
        vehicle: ex.vehicle || [veh],
        intensity: ex.intensity || parsed.intensity,
        location: ex.location || loc,
        muscleGroup: ex.muscleGroup || ['lower-back', 'shoulders', 'neck'],
        targetMuscles: ex.targetMuscles || ['Erector Spinae', 'Psoas Major'],
        steps: Array.isArray(ex.steps) ? ex.steps : ['Position spine in neutral', 'Perform slow controlled stretch', 'Breathe deeply and release']
      }));
    }

    res.json(parsed);
  } catch (error) {
    console.error('Error generating routine:', error);
    res.status(500).json({ error: 'Failed to generate custom routine', details: error.message });
  }
});

// API endpoint for AI Soreness Assessment based on user history & tension areas
app.post('/api/coach/soreness-assessment', async (req, res) => {
  try {
    const { completedHistory, currentSorenessAreas, vehicle, totalMinutesStretched, streak } = req.body;
    const ai = getGenAI();

    const historySummary = (completedHistory || []).slice(-5).map(h => 
      `- ${h.title} on ${h.date}: ${h.durationMinutes}m (Comfort: ${h.feelingBefore}/5 -> ${h.feelingAfter}/5, Delta: +${h.feelingAfter - h.feelingBefore})`
    ).join('\n') || 'No previous sessions recorded yet.';

    const tensionAreas = (currentSorenessAreas && currentSorenessAreas.length > 0) 
      ? currentSorenessAreas.join(', ') 
      : 'Lower Back & Cervical Neck compression';

    const prompt = `${COACH_SYSTEM_PROMPT}

Perform a rapid, high-precision Biomechanical Soreness Assessment for this road driver.

Driver Profile:
- Vehicle: ${vehicle || 'Car'}
- Reported / Detected Tension Areas: ${tensionAreas}
- Total Lifetime Stretched: ${totalMinutesStretched || 0} minutes
- Current Streak: ${streak || 0} days
- Recent Session History:
${historySummary}

Analyze their historical comfort gains, identify cumulative postural stress risks (e.g. piriformis spasm, forward head tilt, thoracic rigidity, sciatic compression), and prescribe the ideal recovery protocol.

Return ONLY valid JSON matching this schema without markdown fences:
{
  "diagnosisTitle": "Short clinical biomechanics diagnosis (e.g., 'Acute L4-L5 Lumbar Flexion Loading & Suboccipital Strain')",
  "diagnosisExplanation": "Empathetic, clear 2-sentence explanation of why these muscles are tight from driving.",
  "riskLevel": "Mild Stiffness" | "Moderate Compression" | "High Tension Knot",
  "suggestedRoutineId": "routine-spinal-15min" | "routine-car-10min" | "routine-rider-12min" | "routine-quick-5min" | "routine-taichi-8min",
  "suggestedRoutineTitle": "Name of best routine to do right now",
  "suggestedRoutineDuration": 10,
  "matchReason": "Why this specific routine resolves their tension history",
  "acuteMicroReliefCue": "One immediate 15-second in-seat alignment cue they can do this second",
  "keyTargetMuscles": ["Psoas Major", "Levator Scapulae", "Piriformis"],
  "breathingPrescription": "e.g. 4-7-8 Vagal Release or Box Breathing",
  "recommendedExercises": [
    {
      "name": "Exercise Name",
      "target": "Target Area",
      "cue": "Key Olympic coach cue",
      "duration": "45s"
    }
  ]
}`;

    if (!ai) {
      // Intelligent fallback biomechanics assessment engine
      let suggestedId = 'routine-spinal-15min';
      let suggestedTitle = '15-Min Complete Spinal Decompression';
      let suggestedDuration = 15;
      let diagnosis = 'Prolonged Lumbar Sag & Cervical Forward-Translation';
      let explanation = 'Hours behind the wheel have flattened your natural lumbar lordosis, loading intervertebral discs while shortening your hip flexors and suboccipitals.';

      if (tensionAreas.toLowerCase().includes('neck') || tensionAreas.toLowerCase().includes('shoulder')) {
        suggestedId = 'routine-car-10min';
        suggestedTitle = '10-Min In-Seat Commuter Reset';
        suggestedDuration = 10;
        diagnosis = 'Upper Trapezius & Sternocleidomastoid Overload';
        explanation = 'Steering wheel grip and forward road focus have locked your scapular retractors into an eccentric stretch while overworking the cervical stabilizers.';
      } else if (vehicle === 'two-wheeler' || tensionAreas.toLowerCase().includes('wrist') || tensionAreas.toLowerCase().includes('hip')) {
        suggestedId = 'routine-rider-12min';
        suggestedTitle = '12-Min Motorcyclist & Rider Reset';
        suggestedDuration = 12;
        diagnosis = 'Hip Flexor Contracture & Median Nerve Carpal Strain';
        explanation = 'Continuous clutch and throttle tension combined with hip tuck position has tightened your psoas and forearm flexor compartments.';
      } else if (tensionAreas.toLowerCase().includes('fatigue') || tensionAreas.toLowerCase().includes('eye')) {
        suggestedId = 'routine-quick-5min';
        suggestedTitle = '5-Min Fast Highway Pitstop';
        suggestedDuration = 5;
        diagnosis = 'Highway Hypnosis & Static Thoracic Hypomobility';
        explanation = 'Static posture has decreased thoracic cage compliance, reducing venous return and creating mental sluggishness.';
      }

      return res.json({
        diagnosisTitle: diagnosis,
        diagnosisExplanation: explanation,
        riskLevel: 'Moderate Compression',
        suggestedRoutineId: suggestedId,
        suggestedRoutineTitle: suggestedTitle,
        suggestedRoutineDuration: suggestedDuration,
        matchReason: `Directly counteracts your reported ${tensionAreas} by restoring axial decompression and blood flow.`,
        acuteMicroReliefCue: 'Occipital Double-Chin Retraction: Slide your head straight back against the headrest without tilting your nose down. Hold for 5 seconds.',
        keyTargetMuscles: ['Erector Spinae', 'Psoas Major', 'Upper Trapezius', 'Piriformis'],
        breathingPrescription: 'Inhale 4s through nose into belly, exhale 6s slowly through pursed lips.',
        recommendedExercises: [
          {
            name: 'Occipital Chin Tuck & Axial Lengthening',
            target: 'Cervical Spine',
            cue: 'Lengthen crown to ceiling like a marionette string.',
            duration: '45s'
          },
          {
            name: 'Seated Figure-4 Piriformis Release',
            target: 'Hips & Sciatica',
            cue: 'Hinge forward from hip crease with flat lumbar spine.',
            duration: '60s'
          },
          {
            name: 'Pelvic Clock & Lumbar Mobilizer',
            target: 'Lower Back',
            cue: 'Fluidly tilt pelvis between 12 and 6 o clock to hydrate discs.',
            duration: '60s'
          }
        ]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text?.trim() || '{}';
    const jsonStr = text.replace(/^```json/g, '').replace(/```$/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    res.json(parsed);
  } catch (error) {
    console.error('Error in /api/coach/soreness-assessment:', error);
    res.status(500).json({ error: 'Failed to run soreness assessment', details: error.message });
  }
});

// Serve frontend
async function setupFrontend() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      app.use(express.static(__dirname));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
      });
    }
  }
}

setupFrontend().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StretchWay server running on http://0.0.0.0:${PORT}`);
  });
});
