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
    const { vehicle, durationMinutes, painFocus, locationType, experienceLevel } = req.body;
    const ai = getGenAI();

    const prompt = `Generate a personalized ${durationMinutes || 8}-minute driver relief routine for someone operating a ${vehicle || 'Car'} experiencing discomfort in: ${painFocus || 'Lower Back, Neck & Shoulders'}.
Location: ${locationType || 'In-Seat / Rest Area'}. Level: ${experienceLevel || 'All Levels'}.

Return ONLY valid JSON without markdown fences matching this schema:
{
  "title": "Short catchy routine title",
  "subtitle": "Biomechanical description",
  "totalDurationMinutes": ${durationMinutes || 8},
  "targetMuscles": ["Muscle 1", "Muscle 2", "Muscle 3"],
  "coachRationale": "Olympic coach explanation of why this sequence works",
  "exercises": [
    {
      "id": "unique-id",
      "name": "Exercise Name",
      "durationSeconds": 45,
      "reps": "10 reps or 30s hold",
      "type": "stretch" | "mobility" | "activation" | "breath",
      "targetArea": "Neck" | "Shoulders" | "Lower Back" | "Hips" | "Wrists" | "Legs" | "Whole Body",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "formCues": "Crucial alignment cue from Olympic coach",
      "avoidMistake": "Common mistake to avoid",
      "breathPattern": "Inhale 4s, Exhale 4s",
      "intensity": "Gentle" | "Moderate" | "Deep Release"
    }
  ]
}`;

    if (!ai) {
      // Return high quality built-in structured protocol
      return res.json({
        title: `${vehicle || 'Driver'} Fast Bio-Reset Routine`,
        subtitle: `Precision decompression protocol targeting ${painFocus || 'Spine & Hips'}`,
        totalDurationMinutes: durationMinutes || 8,
        targetMuscles: ['Erector Spinae', 'Psoas Major', 'Upper Trapezius', 'Suboccipitals'],
        coachRationale: "Designed to reverse lumbar flexion loading and anterior head translation induced by prolonged steering grip.",
        exercises: [
          {
            id: "ex-1",
            name: "Occipital Chin Tuck & Axial Lengthening",
            durationSeconds: 45,
            reps: "10 pulses with 3s hold",
            type: "mobility",
            targetArea: "Neck",
            steps: [
              "Sit with spine neutral against seat back.",
              "Look straight forward, slide your head straight back like making a gentle double chin.",
              "Feel the decompression at the base of your skull and hold for 3 seconds."
            ],
            formCues: "Keep your eyes level with the horizon; don't tilt your head down.",
            avoidMistake: "Bending neck forward instead of retracting skull backwards.",
            breathPattern: "Exhale on tuck, Inhale on release",
            intensity: "Gentle"
          },
          {
            id: "ex-2",
            name: "Seated Steering-Wheel Chest Opener",
            durationSeconds: 60,
            reps: "5 deep breath cycles",
            type: "stretch",
            targetArea: "Shoulders",
            steps: [
              "Grip the top or sides of the steering wheel with arms extended.",
              "Inhale deeply, lift your sternum towards the windshield and draw shoulder blades down and back.",
              "Gently arch the thoracic spine while keeping the lumbar supported."
            ],
            formCues: "Drive the stretch through the ribcage expansion, not pinching lower back.",
            avoidMistake: "Shrugging shoulders into the ears.",
            breathPattern: "Inhale expand ribs, Exhale sink shoulder blades",
            intensity: "Moderate"
          },
          {
            id: "ex-3",
            name: "Pelvic Clock & Lumbar Mobilizer",
            durationSeconds: 60,
            reps: "12 fluid reps",
            type: "mobility",
            targetArea: "Lower Back",
            steps: [
              "Rest hands on knees or thighs.",
              "Alternately tilt pelvis forward (creating a slight arch) and posterior (tucking tailbone).",
              "Flow between 12 o'clock and 6 o'clock smoothly."
            ],
            formCues: "Initiate purely from the hips and pelvic bowl.",
            avoidMistake: "Jerking the upper body forcefully.",
            breathPattern: "Inhale arch, Exhale round",
            intensity: "Gentle"
          },
          {
            id: "ex-4",
            name: "Seated Figure-4 Piriformis Release",
            durationSeconds: 90,
            reps: "45s each leg",
            type: "stretch",
            targetArea: "Hips",
            steps: [
              "Cross right ankle over left knee, forming a '4' shape.",
              "Flex right foot to protect knee.",
              "Sit tall, then hinge forward from the hips with a flat spine until deep glute stretch is felt."
            ],
            formCues: "Lead with the chest; keep spine elongated.",
            avoidMistake: "Slouching over the shin.",
            breathPattern: "Long, calming 6s exhales",
            intensity: "Deep Release"
          },
          {
            id: "ex-5",
            name: "Highway Alertness Box Breathing",
            durationSeconds: 60,
            reps: "4 complete cycles",
            type: "breath",
            targetArea: "Whole Body",
            steps: [
              "Inhale smoothly through the nose for 4 seconds.",
              "Hold full breath for 4 seconds.",
              "Exhale smoothly through mouth/nose for 4 seconds.",
              "Hold empty for 4 seconds."
            ],
            formCues: "Feel expansion in belly and lower ribs.",
            avoidMistake: "Gasping or tensing neck muscles.",
            breathPattern: "4-4-4-4 Box Rhythm",
            intensity: "Gentle"
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
    console.error('Error generating routine:', error);
    res.status(500).json({ error: 'Failed to generate custom routine', details: error.message });
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
