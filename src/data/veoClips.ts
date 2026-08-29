import { Exercise } from '../types';

import neckStretchImg from '../assets/images/driver_neck_stretch_veo3_1788038654275.jpg';
import lumbarSpineImg from '../assets/images/driver_lumbar_spine_veo3_1788038671149.jpg';
import highwayStretchImg from '../assets/images/driver_highway_stretch_veo3_1788038685857.jpg';
import wristSteeringImg from '../assets/images/driver_wrist_steering_veo3_1788038699469.jpg';

export interface VeoClipMetadata {
  exerciseId: string;
  title: string;
  veoPrompt: string;
  cameraAngle: string;
  biomechanicalFocus: string;
  durationLabel: string;
  badgeText: string;
  aspectRatio: string;
  resolution: string;
  lightingAesthetic: string;
  instructorAvatar: string;
  posterImage?: string;
}

export const VEO3_EXERCISE_CLIPS: Record<string, VeoClipMetadata> = {
  'car-neck-rolls': {
    exerciseId: 'car-neck-rolls',
    title: 'Occipital Neck Roll & Length Glide',
    posterImage: neckStretchImg,
    veoPrompt: 'Cinematic hyper-realistic 4K video: Driver in modern ergonomic car cockpit performing slow, clinical occipital neck rolls. Macro close-up on cervical vertebrae lengthening, subtle glowing biomechanical vector overlay highlighting suboccipital release. Warm natural cabin light, smooth Steadicam pan.',
    cameraAngle: '45-degree cockpit driver side, eye-level macro focus on cervical spine',
    biomechanicalFocus: 'Suboccipital decompression & Sternocleidomastoid stretch',
    durationLabel: '45s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Golden hour windshield ambient + cyan anatomical luminescence',
    instructorAvatar: 'Lyra Clinical Ergonomics'
  },
  'car-wrist-rotations': {
    exerciseId: 'car-wrist-rotations',
    title: 'Steering Grip Forearm & Wrist Spiral',
    posterImage: wristSteeringImg,
    veoPrompt: 'Close-up 4K footage of hands over leather steering wheel. Driver gently rotating wrists in fluid circular motions, then splaying fingers wide to decompress carpal tunnel. Translucent cyan muscle glow on flexor carpi radialis and extensor tendons.',
    cameraAngle: 'Top-down cockpit dashboard angle focusing on wrist articulation',
    biomechanicalFocus: 'Carpal tunnel decompression & palmar fascia release',
    durationLabel: '45s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Subtle dashboard LED ambient & studio fill light',
    instructorAvatar: 'Marcus Physical Therapy'
  },
  'car-hamstring-slide': {
    exerciseId: 'car-hamstring-slide',
    title: 'Seated Sciatic & Hamstring Slide',
    posterImage: lumbarSpineImg,
    veoPrompt: 'Wide profile view inside parked vehicle. Driver extending right leg with flexed foot on floorboard, smoothly hinging torso forward with flat lumbar spine. Blue glowing nerve flossing line tracing the sciatic pathway from lower back down to heel.',
    cameraAngle: 'Side passenger-door open angle, lateral full-body alignment view',
    biomechanicalFocus: 'Sciatic nerve glide & posterior thigh muscle tension relief',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Soft diffused natural daylight',
    instructorAvatar: 'Lyra Clinical Ergonomics'
  },
  'car-shoulder-retraction': {
    exerciseId: 'car-shoulder-retraction',
    title: 'Scapular Pinch & Sternum Lift',
    posterImage: neckStretchImg,
    veoPrompt: 'Sleek rear-quarter cockpit angle showing driver retracting shoulder blades downward and back against the seat contour, opening the chest. Glowing green rhomboid and middle trap muscle fibers contracting smoothly in rhythm.',
    cameraAngle: 'Behind-the-seat over-the-shoulder angle emphasizing scapular glide',
    biomechanicalFocus: 'Kyphosis reversal & pectoral opening',
    durationLabel: '50s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Clean automotive studio lighting with neon edge rim',
    instructorAvatar: 'Elena Kinesiology'
  },
  'car-pelvic-clock': {
    exerciseId: 'car-pelvic-clock',
    title: 'Pelvic Clock & Lumbar Mobilizer',
    posterImage: lumbarSpineImg,
    veoPrompt: 'High-detail interior shot showing driver performing subtle pelvic anterior/posterior tilts against lumbar seat support. Synovial disc hydration visualizer showing glowing blue fluid pumping into L4-L5 vertebrae.',
    cameraAngle: 'Lower torso side profile showing pelvic tilt oscillation',
    biomechanicalFocus: 'Lumbar disc hydration & multifidus activation',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Crisp dusk ambiance with inner seat edge lighting',
    instructorAvatar: 'Lyra Clinical Ergonomics'
  },
  'car-calf-pumps': {
    exerciseId: 'car-calf-pumps',
    title: 'Venous Return Calf & Ankle Pumps',
    posterImage: highwayStretchImg,
    veoPrompt: 'Close-up of lower pedals and footwell. Driver in athletic shoes pumping heels and flexing toes rhythmically. Dynamic red-to-blue arrow animation showing upward venous blood return to prevent pooling and clots.',
    cameraAngle: 'Low-angle footwell macro camera capturing full ankle dorsiflexion',
    biomechanicalFocus: 'Skeletal muscle venous pump & soleus activation',
    durationLabel: '45s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Targeted pedal-well illumination with neon flow lines',
    instructorAvatar: 'Marcus Physical Therapy'
  },
  'bike-quad-stretch': {
    exerciseId: 'bike-quad-stretch',
    title: 'Standing Quad & Psoas Opener',
    posterImage: highwayStretchImg,
    veoPrompt: 'Cinematic outdoor rest stop. Motorcyclist with helmet off, resting hand on bike seat while holding ankle behind back in standing quad stretch. Glowing amber highlight on rectus femoris and psoas major.',
    cameraAngle: 'Full-length side profile with motorcycle backdrop and open highway',
    biomechanicalFocus: 'Hip flexor elongation & knee joint decompression',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Golden sunset mountain pass with warm lens flares',
    instructorAvatar: 'Rider Recovery Lab'
  },
  'bike-shoulder-rolls': {
    exerciseId: 'bike-shoulder-rolls',
    title: 'Rider Scapular Dislocation & Chest Expansion',
    posterImage: neckStretchImg,
    veoPrompt: 'Motorcyclist in leather jacket standing next to bike, sweeping arms backward in wide chest-opening arcs and interlacing fingers behind back to stretch chest. Vibrant blue fascial lines expanding across pectorals.',
    cameraAngle: 'Front three-quarter medium shot capturing chest expansion',
    biomechanicalFocus: 'Rider tuck reversal & anterior shoulder capsule stretch',
    durationLabel: '50s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Vibrant scenic overlook daylight',
    instructorAvatar: 'Elena Kinesiology'
  },
  'bike-wrist-flicks': {
    exerciseId: 'bike-wrist-flicks',
    title: 'Clutch & Throttle Neuro-Flick Drill',
    veoPrompt: 'Motorcycle rider standing at roadside, flicking hands vigorously then performing wrist extensor and flexor counter-stretches. High-speed 120fps slow-motion capture of neuromuscular vibration reset.',
    cameraAngle: 'Tight medium shot of hands and forearms against mountain background',
    biomechanicalFocus: 'Clutch tendon relief & vibration fatigue dissipation',
    durationLabel: '40s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'High-contrast natural outdoor light',
    instructorAvatar: 'Rider Recovery Lab'
  },
  'bike-neck-tilts': {
    exerciseId: 'bike-neck-tilts',
    title: 'Helmet-Off Lateral Cervical Decompression',
    veoPrompt: 'Close-up of rider who just removed helmet, performing gentle lateral neck tilts with reaching opposite fingertips down to pavement. Glowing violet scalp and levator scapulae lines releasing tension.',
    cameraAngle: 'Shoulder-level close portrait showing neck tilt and shoulder anchor',
    biomechanicalFocus: 'Scalene & levator scapulae wind-buffeting relief',
    durationLabel: '50s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Soft cloudy mountain sky ambient',
    instructorAvatar: 'Lyra Clinical Ergonomics'
  },
  'bike-hip-openers': {
    exerciseId: 'bike-hip-openers',
    title: 'Standing Rest-Stop Figure-4 Hip Opener',
    veoPrompt: 'Full standing figure-4 hip stretch outside vehicle. Rider resting hands on motorcycle seat, sinking hips back into deep glute and piriformis stretch. Glowing red-to-green heat map showing sciatic nerve pressure drop.',
    cameraAngle: 'Three-quarter low angle capturing deep hip hinge and knee alignment',
    biomechanicalFocus: 'Piriformis decompression & gluteal fascial release',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Highway rest stop horizon at sunrise',
    instructorAvatar: 'Rider Recovery Lab'
  },
  'quick-eye-palming': {
    exerciseId: 'quick-eye-palming',
    title: 'Highway Hypnosis Eye Palming & Optic Reset',
    veoPrompt: 'Close-up inside dark peaceful parked cabin. Driver rubbing warm palms together and gently cupping them over eyes in total relaxation. Soothing pulsating alpha-wave indigo glow surrounding forehead and occipital lobe.',
    cameraAngle: 'Intimate close-up on driver face and cupped hands',
    biomechanicalFocus: 'Optic nerve relaxation & ciliary muscle de-spasm',
    durationLabel: '45s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Gentle indigo twilight inside quiet car interior',
    instructorAvatar: 'Lyra Clinical Ergonomics'
  },
  'quick-seated-twist': {
    exerciseId: 'quick-seated-twist',
    title: 'Cockpit Torso Decompression Twist',
    veoPrompt: 'Medium shot inside vehicle cockpit. Driver sitting tall with long spine, gently rotating ribcage and looking over right shoulder while holding seat back. Glowing helical spiral of light ascending through the thoracic vertebrae.',
    cameraAngle: 'Front passenger diagonal showing spine length and shoulder level',
    biomechanicalFocus: 'Thoracic facet joint mobilization & visceral circulation',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Modern clean cockpit ambient lighting',
    instructorAvatar: 'Elena Kinesiology'
  },
  'quick-hand-squeezes': {
    exerciseId: 'quick-hand-squeezes',
    title: 'Neuro-Vascular Fist Clench & Meridian Release',
    veoPrompt: 'Close-up of driver hands in front of dashboard, rapidly squeezing tight fists and splaying all fingers explosively into wide stars. Dynamic red and gold sparkles radiating from fingertips denoting capillary perfusion.',
    cameraAngle: 'Center cockpit eye-level focus on hands and forearm muscles',
    biomechanicalFocus: 'Capillary perfusion & finger numbness reset',
    durationLabel: '40s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Crisp bright interior automotive light',
    instructorAvatar: 'Marcus Physical Therapy'
  },
  'spinal-seated-cat-cow': {
    exerciseId: 'spinal-seated-cat-cow',
    title: 'Seated Spinal Segment Cat-Cow',
    veoPrompt: 'Side profile of driver moving between anterior pelvic arch (Cow) and posterior lumbar tuck (Cat). Lumbar discs glow soft blue as they expand and articulate one segment at a time with breathing waves.',
    cameraAngle: 'Lateral side profile through driver window showing full spine wave',
    biomechanicalFocus: 'Sagittal spinal curvature restoration & disc imbibition',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Warm morning sunrise rays streaming through side glass',
    instructorAvatar: 'Lyra Clinical Ergonomics'
  },
  'spinal-thoracic-rotation': {
    exerciseId: 'spinal-thoracic-rotation',
    title: 'Thoracic Basket Rotation & Wing Flap',
    veoPrompt: 'Driver seated with hands interlaced behind head (basket grip), rotating smoothly left and right around axial spine. Glowing green scapular tracks showing ribcage expansion and blind-spot range of motion improvement.',
    cameraAngle: 'Front windshield view capturing level elbow rotation',
    biomechanicalFocus: 'Mid-back rotational mobility & blind-spot awareness',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'High-clarity dashboard reflection lighting',
    instructorAvatar: 'Elena Kinesiology'
  },
  'spinal-lumbar-brace': {
    exerciseId: 'spinal-lumbar-brace',
    title: 'Driver Isometric Lumbar Spine Brace',
    veoPrompt: 'Cutaway biometric view of driver drawing deep transverse abdominis navel to spine while breathing smoothly. A glowing cyan isometric cylinder belt activates around core to stabilize L4-L5-S1 junction.',
    cameraAngle: 'Torso close-up with anatomical deep core cylinder visualization',
    biomechanicalFocus: 'L4-L5-S1 lumbar junction road jolt protection',
    durationLabel: '45s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Deep blue night highway cockpit glow',
    instructorAvatar: 'Lyra Clinical Ergonomics'
  },
  'spinal-standing-hamstring-reach': {
    exerciseId: 'spinal-standing-hamstring-reach',
    title: 'Rest-Stop Hinge & Posterior Chain Reach',
    veoPrompt: 'Athlete at highway scenic stop performing hip hinge with hands reaching towards car bumper, keeping spine tabletop flat. Glowing cyan posterior chain line connecting heels, hamstrings, and thoracolumbar fascia.',
    cameraAngle: 'Full body side profile against mountain landscape backdrop',
    biomechanicalFocus: 'Pelvic posterior rotation reset & lumbar decompression',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Panoramic golden hour sunlight',
    instructorAvatar: 'Elena Kinesiology'
  },
  'taichi-cloud-hands': {
    exerciseId: 'taichi-cloud-hands',
    title: 'Cloud Hands (Yun Shou) Standing Flow',
    veoPrompt: 'Master Tai Chi instructor in flowing athletic wear performing Cloud Hands beside rest stop vista. Smooth weight shifts between legs as hands trace gentle circular floating arcs through air like passing clouds.',
    cameraAngle: 'Wide cinematic tracking dolly shot sweeping with the flow movement',
    biomechanicalFocus: 'Proprioception restoration & vagal down-regulation',
    durationLabel: '90s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Serene misty alpine morning light with soft breeze',
    instructorAvatar: 'Master Chen TaiChi'
  },
  'taichi-rooting-breath': {
    exerciseId: 'taichi-rooting-breath',
    title: 'Dan Tian Rooting & Earth Stance',
    veoPrompt: 'Full standing shot of practitioner floating palms up to chest on inhale and pressing down to lower belly on exhale. Glowing golden energy roots extending from soles of feet deep into earth.',
    cameraAngle: 'Front centered medium-wide shot showing grounded posture',
    biomechanicalFocus: 'Cortisol clearance & grounding equilibrium',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Golden dawn sunlight with floating dust motes',
    instructorAvatar: 'Master Chen TaiChi'
  },
  'taichi-single-leg-balance': {
    exerciseId: 'taichi-single-leg-balance',
    title: 'Golden Rooster Standing Stork Balance',
    veoPrompt: 'Practitioner smoothly lifting right knee to hip height while opposite palm presses down, holding serene equilibrium. Holographic balance grid underfoot showing micro-adjustments in ankle stabilizers.',
    cameraAngle: 'Full body straight-on angle showing postural symmetry',
    biomechanicalFocus: 'Vestibular reset & ankle stabilizer reactivation',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Crisp morning mountain air with warm sunrise rim',
    instructorAvatar: 'Master Chen TaiChi'
  },
  'yoga-downward-dog-bumper': {
    exerciseId: 'yoga-downward-dog-bumper',
    title: 'Bumper Supported Downward Dog Traction',
    posterImage: highwayStretchImg,
    veoPrompt: 'Driver standing behind car, hands flat on bumper or hood, stepping back into horizontal spine angle. Axial traction visualizer showing full spinal decompressive lengthening from crown to coccyx.',
    cameraAngle: 'Side angle full-body view demonstrating 90-degree spine hinge',
    biomechanicalFocus: 'Full axial spinal column gravity-assisted traction',
    durationLabel: '60s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Sunset open highway vista with glowing horizon',
    instructorAvatar: 'Elena Kinesiology'
  },
  'yoga-standing-crescent-moon': {
    exerciseId: 'yoga-standing-crescent-moon',
    title: 'Standing Crescent Lateral Opener',
    posterImage: highwayStretchImg,
    veoPrompt: 'Practitioner reaching arms overhead and arching torso gently into lateral crescent curve. Bright glowing fascial band highlighting the quadratus lumborum and intercostal ribcage opening.',
    cameraAngle: 'Front frontal view capturing full lateral spine arc',
    biomechanicalFocus: 'Quadratus lumborum release & intercostal ribcage expansion',
    durationLabel: '50s Loop',
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Warm open-sky daylight with crystal clear atmosphere',
    instructorAvatar: 'Elena Kinesiology'
  }
};

// Fallback generator for custom or dynamic exercises
export const getVeoClipForExercise = (exercise: Exercise): VeoClipMetadata => {
  if (VEO3_EXERCISE_CLIPS[exercise.id]) {
    return VEO3_EXERCISE_CLIPS[exercise.id];
  }

  // Pick suitable photorealistic visual based on category
  let defaultImg = lumbarSpineImg;
  const nameLower = (exercise.name + ' ' + exercise.category).toLowerCase();
  if (nameLower.includes('neck') || nameLower.includes('shoulder') || nameLower.includes('chest')) {
    defaultImg = neckStretchImg;
  } else if (nameLower.includes('wrist') || nameLower.includes('hand') || nameLower.includes('finger') || nameLower.includes('steering')) {
    defaultImg = wristSteeringImg;
  } else if (nameLower.includes('standing') || nameLower.includes('bumper') || nameLower.includes('leg') || nameLower.includes('quad') || nameLower.includes('calf')) {
    defaultImg = highwayStretchImg;
  }

  return {
    exerciseId: exercise.id,
    title: exercise.name,
    posterImage: defaultImg,
    veoPrompt: `Cinematic 4K demonstration of ${exercise.name} for road driver recovery. High definition anatomical visualization highlighting ${exercise.targetMuscles.join(', ')}. Clean automotive cockpit and rest stop setting.`,
    cameraAngle: '45-degree angle focused on form alignment',
    biomechanicalFocus: exercise.biomechanicsRationale,
    durationLabel: `${exercise.durationSeconds}s Loop`,
    badgeText: 'Veo-3 4K UltraHD',
    aspectRatio: '16:9 Cinema',
    resolution: '3840x2160 60FPS',
    lightingAesthetic: 'Natural automotive cabin lighting with cyan anatomical glow',
    instructorAvatar: 'Lyra Clinical Ergonomics'
  };
};
