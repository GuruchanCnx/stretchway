import { Exercise, Routine, BreathProtocol, ErgonomicTip } from '../types';

export const ALL_EXERCISES: Exercise[] = [
  // CAR IN-SEAT STRETCHES
  {
    id: 'car-neck-rolls',
    name: 'Occipital Neck Roll & Length Glide',
    category: 'car',
    vehicle: ['car', 'truck', 'commuter'],
    durationSeconds: 45,
    reps: '8 slow circles each direction',
    intensity: 'Gentle',
    targetMuscles: ['Suboccipitals', 'Upper Trapezius', 'Sternocleidomastoid'],
    muscleGroup: ['neck'],
    location: 'In-Seat',
    steps: [
      'Sit tall with shoulders relaxed against the seatback.',
      'Drop your chin softly towards your collarbone, feeling the base of skull stretch.',
      'Roll right ear towards right shoulder; gently trace a half-circle downward to left shoulder.',
      'Avoid hyperextending backwards while seated in the car.'
    ],
    formCues: 'Imagine balancing a full cup of water on your crown; keep movements fluid and slow.',
    avoidMistake: 'Jerking head backwards against the headrest or shrugging the shoulders up.',
    biomechanicsRationale: 'Relieves hypertonic tension in suboccipital muscles caused by sustained forward gaze and vibration.',
    breathPattern: 'Inhale to side, Exhale down across center'
  },
  {
    id: 'car-wrist-rotations',
    name: 'Steering Grip Forearm & Wrist Spiral',
    category: 'car',
    vehicle: ['car', 'two-wheeler', 'truck', 'commuter'],
    durationSeconds: 45,
    reps: '15 rotations each way + finger fan',
    intensity: 'Gentle',
    targetMuscles: ['Flexor Carpi Radialis', 'Extensor Digitorum', 'Pronator Teres'],
    muscleGroup: ['wrists'],
    location: 'In-Seat',
    steps: [
      'Lift hands off steering wheel and extend arms with elbows softly bent.',
      'Clench into loose fists and rotate wrists smoothly clockwise, then counter-clockwise.',
      'Open hands wide, fanning all 10 fingers outward for 3 seconds to stretch palmar fascia.'
    ],
    formCues: 'Drive full circular range of motion from the carpal joints without moving the elbows.',
    avoidMistake: 'Snapping the fingers or locking elbows rigidly.',
    biomechanicsRationale: 'Decompresses the carpal tunnel and reverses static grip ischemia.',
    breathPattern: 'Deep natural diaphragmatic breathing'
  },
  {
    id: 'car-hamstring-slide',
    name: 'Seated Sciatic & Hamstring Slide',
    category: 'car',
    vehicle: ['car', 'truck', 'commuter'],
    durationSeconds: 60,
    reps: '30s hold each leg',
    intensity: 'Moderate',
    targetMuscles: ['Biceps Femoris', 'Semitendinosus', 'Gastrocnemius'],
    muscleGroup: ['hamstrings', 'calves'],
    location: 'In-Seat',
    steps: [
      'Ensure vehicle is parked with brake engaged. Slide hips forward slightly.',
      'Extend right leg straight forward, resting heel on footwell floor with toes pulled up.',
      'Place hands on opposite thigh, hinge gently forward from hip crease keeping chest high.'
    ],
    formCues: 'Hinge only from the hip joint; maintain natural curve in lower back.',
    avoidMistake: 'Rounding the upper back to touch toes, which loads lumbar discs.',
    biomechanicsRationale: 'Flosses the sciatic nerve pathway and relieves posterior thigh compression from bucket seats.',
    breathPattern: 'Inhale lengthen spine, Exhale hinge 1cm deeper'
  },
  {
    id: 'car-shoulder-retraction',
    name: 'Scapular Pinch & Sternum Lift',
    category: 'car',
    vehicle: ['car', 'truck', 'two-wheeler', 'commuter'],
    durationSeconds: 50,
    reps: '10 reps with 3s hold',
    intensity: 'Gentle',
    targetMuscles: ['Rhomboids', 'Middle Trapezius', 'Pectoralis Major'],
    muscleGroup: ['shoulders', 'upper-back', 'chest'],
    location: 'In-Seat',
    steps: [
      'Rest hands lightly in lap or at 8-and-4 on the wheel.',
      'Draw both shoulder blades back and down as if squeezing a pencil between your shoulder blades.',
      'Simultaneously lift your sternum towards the windshield without overarching the lower back.',
      'Hold the isometric squeeze for 3 seconds, then release smoothly.'
    ],
    formCues: 'Think "shoulders in back pockets" rather than shrugging upwards.',
    avoidMistake: 'Arching the lower back excessively instead of moving the scapulae.',
    biomechanicsRationale: 'Counters the kyphotic slumping caused by holding the steering wheel forward.',
    breathPattern: 'Inhale expand chest and squeeze, Exhale soften'
  },
  {
    id: 'car-pelvic-clock',
    name: 'Pelvic Clock & Lumbar Mobilizer',
    category: 'car',
    vehicle: ['car', 'truck', 'commuter'],
    durationSeconds: 60,
    reps: '12 fluid rocking cycles',
    intensity: 'Gentle',
    targetMuscles: ['Transverse Abdominis', 'Quadratus Lumborum', 'Multifidus'],
    muscleGroup: ['lower-back', 'core', 'hips'],
    location: 'In-Seat',
    steps: [
      'Sit evenly on both sitz bones.',
      'Anterior tilt (12 o’clock): arch lower back slightly away from seat back, feeling lower spine engagement.',
      'Posterior tilt (6 o’clock): tuck pelvis under and press lower back gently against the seat contour.',
      'Flow between the two points smoothly like a gentle rocking cradle.'
    ],
    formCues: 'Move strictly from the pelvis; keep shoulders and neck quiet.',
    avoidMistake: 'Forcing extreme arching against pain.',
    biomechanicsRationale: 'Pumps synovial fluid into lumbar intervertebral discs that suffer static pressure during driving.',
    breathPattern: 'Inhale on arch, Exhale on tuck'
  },
  {
    id: 'car-calf-pumps',
    name: 'Venous Return Calf & Ankle Pumps',
    category: 'car',
    vehicle: ['car', 'truck', 'commuter'],
    durationSeconds: 45,
    reps: '25 rapid pulses per foot',
    intensity: 'Gentle',
    targetMuscles: ['Gastrocnemius', 'Soleus', 'Tibialis Anterior'],
    muscleGroup: ['calves'],
    location: 'In-Seat',
    steps: [
      'With car safely parked, rest heels on floorboard.',
      'Alternate lifting toes up towards shins, then driving balls of feet down to lift heels high.',
      'Add circular ankle rolls for 5 reps.'
    ],
    formCues: 'Engage full calf muscle contraction at the peak of the heel raise.',
    avoidMistake: 'Lazy fluttering; emphasize full dorsiflexion and plantarflexion.',
    biomechanicsRationale: 'Activates the "skeletal muscle pump" in the lower leg to propel pooled venous blood back to the heart, preventing blood clots and swollen ankles.',
    breathPattern: 'Rhythmic, energizing breaths'
  },

  // TWO-WHEELER / MOTORCYCLE OFF-VEHICLE STRETCHES
  {
    id: 'bike-quad-stretch',
    name: 'Standing Quad & Psoas Opener',
    category: 'two-wheeler',
    vehicle: ['two-wheeler'],
    durationSeconds: 60,
    reps: '30s hold per leg',
    intensity: 'Moderate',
    targetMuscles: ['Rectus Femoris', 'Psoas Major', 'Iliacus'],
    muscleGroup: ['hips', 'hamstrings'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Dismount bike safely and remove helmet. Place one hand on bike seat for balance.',
      'Bend right knee, grasp right ankle behind you with right hand.',
      'Keep knees together, tuck tailbone slightly under to feel deep stretch down front of thigh and hip.'
    ],
    formCues: 'Keep chest upright and maintain a slight posterior pelvic tilt for maximum hip flexor opening.',
    avoidMistake: 'Letting the knee flare out to the side or arching the lower back.',
    biomechanicsRationale: 'Counteracts extreme hip flexion and knee flexion locked in standard motorcycle footpeg positions.',
    breathPattern: 'Slow, steady 4s inhale / 4s exhale'
  },
  {
    id: 'bike-shoulder-rolls',
    name: 'Rider Scapular Dislocation & Chest Expansion',
    category: 'two-wheeler',
    vehicle: ['two-wheeler'],
    durationSeconds: 50,
    reps: '10 forward rolls, 10 giant backwards sweeps',
    intensity: 'Moderate',
    targetMuscles: ['Deltoids', 'Pectoralis Minor', 'Latissimus Dorsi'],
    muscleGroup: ['shoulders', 'upper-back', 'chest'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Stand with feet shoulder-width apart in stable riding boots.',
      'Extend arms wide and trace large backward circles, rotating thumbs upward and back.',
      'Interlace fingers behind lower back, straighten elbows, and gently lift knuckles away from hips.'
    ],
    formCues: 'Retract scapulae and breathe into the upper lobes of the lungs.',
    avoidMistake: 'Thrusting ribcage forward aggressively.',
    biomechanicsRationale: 'Releases the forward hunched "rider tuck" posture and opens cramped thoracic cage.',
    breathPattern: 'Inhale arms up, Exhale arms back and down'
  },
  {
    id: 'bike-wrist-flicks',
    name: 'Clutch & Throttle Neuro-Flick Drill',
    category: 'two-wheeler',
    vehicle: ['two-wheeler'],
    durationSeconds: 40,
    reps: '20 rapid flicks + 15s extensor hold',
    intensity: 'Gentle',
    targetMuscles: ['Brachioradialis', 'Flexor Digitorum', 'Thenar Eminence'],
    muscleGroup: ['wrists'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Shake both hands vigorously as if flicking water off fingertips.',
      'Extend right arm forward, palm down. Use left hand to gently draw fingers down towards floor.',
      'Flip palm up and draw fingers gently back towards forearm.',
      'Repeat on left clutch hand.'
    ],
    formCues: 'Keep shoulder depressed away from ear during the stretch.',
    avoidMistake: 'Aggressive twisting of the wrist joint.',
    biomechanicsRationale: 'Instantly resets forearm muscle spindles overloaded by clutch pull and throttle modulation.',
    breathPattern: 'Natural relaxing breath'
  },
  {
    id: 'bike-neck-tilts',
    name: 'Helmet-Off Lateral Cervical Decompression',
    category: 'two-wheeler',
    vehicle: ['two-wheeler', 'car'],
    durationSeconds: 50,
    reps: '20s each side',
    intensity: 'Gentle',
    targetMuscles: ['Scalenes', 'Levator Scapulae', 'Upper Trapezius'],
    muscleGroup: ['neck', 'shoulders'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Stand tall. Drop right ear towards right shoulder without lifting the shoulder.',
      'Reach left fingertips actively toward the pavement to anchor the left shoulder blade.',
      'Optionally rest right hand gently on crown (gravity only, no pulling).',
      'Repeat on left side.'
    ],
    formCues: 'Feel the stretch down the lateral neck into the top of the shoulder girdle.',
    avoidMistake: 'Yanking the head down with hand pressure.',
    biomechanicsRationale: 'Counters the cervical compression caused by helmet weight and highway wind resistance.',
    breathPattern: 'Slow 5s exhale into the tightest neck fiber'
  },
  {
    id: 'bike-hip-openers',
    name: 'Standing Rest-Stop Figure-4 Hip Opener',
    category: 'two-wheeler',
    vehicle: ['two-wheeler', 'car', 'truck'],
    durationSeconds: 60,
    reps: '30s hold each side',
    intensity: 'Deep Release',
    targetMuscles: ['Piriformis', 'Gluteus Medius', 'Tensor Fasciae Latae'],
    muscleGroup: ['hips', 'lower-back'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Hold motorcycle seat or car hood for firm stability.',
      'Cross right ankle over left thigh just above the knee.',
      'Sit hips backward and down as if sitting into an imaginary chair.',
      'Keep right foot flexed and spine straight until deep release is felt in outer right hip.'
    ],
    formCues: 'Drive hips back like a squat; keep chest proud.',
    avoidMistake: 'Collapsing the standing knee inward.',
    biomechanicsRationale: 'Decompresses the piriformis muscle that commonly traps the sciatic nerve during long rides.',
    breathPattern: 'Inhale lengthen spine, Exhale sink 1 inch lower'
  },

  // QUICK EMERGENCY RELIEF (3-5 MIN)
  {
    id: 'quick-eye-palming',
    name: 'Highway Hypnosis Eye Palming & Optic Reset',
    category: 'quick',
    vehicle: ['car', 'two-wheeler', 'truck', 'commuter'],
    durationSeconds: 45,
    reps: '45s continuous darkness bath',
    intensity: 'Gentle',
    targetMuscles: ['Extraocular muscles', 'Orbicularis Oculi', 'Occipitalis'],
    muscleGroup: ['neck'],
    location: 'In-Seat',
    steps: [
      'Park safely. Rub palms vigorously together for 10 seconds until warm.',
      'Cup cupped warm palms gently over closed eyes without pressing on eyeballs.',
      'Immerse in total pitch darkness while taking 5 slow deep diaphragmatic breaths.',
      'Gently open eyes inside cupped hands before slowly removing them.'
    ],
    formCues: 'Ensure no light leaks through fingers; breathe into the belly.',
    avoidMistake: 'Pressing heels of hands into the corneal tissue.',
    biomechanicsRationale: 'Resets the optic nerve and relaxes ciliary eye muscles exhausted by continuous asphalt scanning.',
    breathPattern: 'Deep 4-4-8 calming pattern'
  },
  {
    id: 'quick-seated-twist',
    name: 'Cockpit Torso Decompression Twist',
    category: 'quick',
    vehicle: ['car', 'truck', 'commuter'],
    durationSeconds: 60,
    reps: '30s each side',
    intensity: 'Moderate',
    targetMuscles: ['Internal Obliques', 'External Obliques', 'Rotatores Spinae'],
    muscleGroup: ['upper-back', 'lower-back', 'core'],
    location: 'In-Seat',
    steps: [
      'Sit tall with knees pointing forward and feet flat.',
      'Inhale and reach crown toward vehicle roof.',
      'Exhale and rotate torso to the right, placing right hand on seat back and left hand on outer right thigh.',
      'Gaze softly over right shoulder without forcing neck.'
    ],
    formCues: 'Twist originates from the ribcage (thoracic), not the lower spine.',
    avoidMistake: 'Pulling violently with the arm against the knee.',
    biomechanicsRationale: 'Wrings out stagnant venous blood and mobilizes thoracic facet joints locked in static driving.',
    breathPattern: 'Inhale grow tall, Exhale gently expand twist'
  },
  {
    id: 'quick-hand-squeezes',
    name: 'Neuro-Vascular Fist Clench & Meridian Release',
    category: 'quick',
    vehicle: ['car', 'two-wheeler', 'truck', 'commuter'],
    durationSeconds: 40,
    reps: '15 quick pumps + 5s hold',
    intensity: 'Gentle',
    targetMuscles: ['Palmaris Longus', 'Lumbricals', 'Flexor Digitorum'],
    muscleGroup: ['wrists'],
    location: 'In-Seat',
    steps: [
      'Extend arms at 45 degrees in front of you.',
      'Squeeze hands into tight fists with thumbs tucked outside fingers for 2 seconds.',
      'Explosively splay all fingers wide, stretching the webbing between fingers.',
      'Repeat 12 times at rapid cadence.'
    ],
    formCues: 'Keep elbows relaxed and breathe naturally.',
    avoidMistake: 'Holding breath while clenching.',
    biomechanicsRationale: 'Pumps fresh oxygenated blood to fingertips and alleviates highway finger numbness.',
    breathPattern: 'Exhale on punch/open, Inhale on clench'
  },

  // SPINAL CARE & DECOMPRESSION
  {
    id: 'spinal-seated-cat-cow',
    name: 'Seated Spinal Segment Cat-Cow',
    category: 'spinal',
    vehicle: ['car', 'truck', 'commuter'],
    durationSeconds: 60,
    reps: '10 complete flowing cycles',
    intensity: 'Gentle',
    targetMuscles: ['Erector Spinae', 'Rectus Abdominis', 'Intercostals'],
    muscleGroup: ['upper-back', 'lower-back', 'core'],
    location: 'In-Seat',
    steps: [
      'Place hands firmly on knees or steering wheel lower rim.',
      'Cow (Inhale): Roll pelvis forward, arch spine, lift chest upward, look gently toward rearview mirror.',
      'Cat (Exhale): Tuck pelvis under, round through spine, hollow out belly, look down toward lap.',
      'Flow seamlessly between segments vertebra by vertebra.'
    ],
    formCues: 'Initiate the wave from the tailbone first, letting the head follow last.',
    avoidMistake: 'Snapping quickly between positions without articulation.',
    biomechanicsRationale: 'Hydrates the spinal discs via imbibition and restores sagittal spinal curvature.',
    breathPattern: 'Inhale on Cow, Exhale on Cat'
  },
  {
    id: 'spinal-thoracic-rotation',
    name: 'Thoracic Basket Rotation & Wing Flap',
    category: 'spinal',
    vehicle: ['car', 'two-wheeler', 'truck', 'commuter'],
    durationSeconds: 60,
    reps: '10 rotations each side',
    intensity: 'Moderate',
    targetMuscles: ['Thoracic Multificus', 'Rhomboids', 'Serratus Anterior'],
    muscleGroup: ['upper-back', 'shoulders'],
    location: 'In-Seat',
    steps: [
      'Interlace fingers behind the head (basket grip), elbows flared wide.',
      'Maintain hips anchored firmly in the seat.',
      'Rotate upper torso to the right, keeping elbows level with shoulders.',
      'Return to center and rotate smoothly to the left.'
    ],
    formCues: 'Keep the chin tucked; rotate purely around the vertical spine axis.',
    avoidMistake: 'Letting one elbow swing forward while hips twist in seat.',
    biomechanicsRationale: 'Restores mid-back rotational freedom crucial for shoulder checks and blind-spot awareness.',
    breathPattern: 'Exhale as you rotate, Inhale center'
  },
  {
    id: 'spinal-lumbar-brace',
    name: 'Driver Isometric Lumbar Spine Brace',
    category: 'spinal',
    vehicle: ['car', 'truck', 'commuter'],
    durationSeconds: 45,
    reps: '6 holds of 6 seconds',
    intensity: 'Gentle',
    targetMuscles: ['Transverse Abdominis', 'Internal Obliques', 'Pelvic Floor'],
    muscleGroup: ['lower-back', 'core'],
    location: 'In-Seat',
    steps: [
      'Sit comfortably back against lumbar support.',
      'Gently draw navel inward towards spine as if tightening a wide weightlifting belt by 20%.',
      'Maintain this deep core brace while breathing calmly for 6 seconds.',
      'Relax and repeat.'
    ],
    formCues: 'Keep chest open and facial muscles relaxed during the abdominal brace.',
    avoidMistake: 'Sucking in breath and holding it; keep oxygen flowing.',
    biomechanicsRationale: 'Activates deep stabilizing inner-unit muscles to protect the L4-L5-S1 lumbar junction from road jolts.',
    breathPattern: 'Slow nasal breathing during brace'
  },
  {
    id: 'spinal-standing-hamstring-reach',
    name: 'Rest-Stop Hinge & Posterior Chain Reach',
    category: 'spinal',
    vehicle: ['car', 'two-wheeler', 'truck'],
    durationSeconds: 60,
    reps: '30s dynamic hinge + 30s static hold',
    intensity: 'Moderate',
    targetMuscles: ['Hamstrings', 'Thoracolumbar Fascia', 'Gastrocnemius'],
    muscleGroup: ['hamstrings', 'lower-back', 'calves'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Stand outside vehicle with feet hip-width apart, soft bend in knees.',
      'Place hands on hip creases. Push hips back toward the rear bumper keeping spine flat.',
      'Lower torso until parallel to ground, reaching hands toward shins or bumper.',
      'Feel stretch from sitz bones down to calves; hold and breathe.'
    ],
    formCues: 'Spine must stay long and flat like a tabletop; never round lumbar.',
    avoidMistake: 'Locking knees straight and hunching upper back to touch ground.',
    biomechanicsRationale: 'Relieves pelvic posterior rotation tension that flattens lumbar lordosis during long drives.',
    breathPattern: 'Inhale lengthen crown, Exhale send sitz bones back'
  },

  // FLOW & BALANCE (TAI CHI & QIGONG)
  {
    id: 'taichi-cloud-hands',
    name: 'Cloud Hands (Yun Shou) Standing Flow',
    category: 'taichi',
    vehicle: ['car', 'two-wheeler', 'truck', 'commuter'],
    durationSeconds: 90,
    reps: '12 slow wave cycles',
    intensity: 'Gentle',
    targetMuscles: ['Latissimus Dorsi', 'Deltoids', 'Rotator Cuff', 'Quadriceps'],
    muscleGroup: ['shoulders', 'upper-back', 'core'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Stand with feet wider than shoulders, knees softly bent in horse stance.',
      'Right hand floats at chest level palm facing body; left hand floats near hip palm down.',
      'Rotate torso gently right to left, shifting weight smoothly as hands swap in circular arcs like passing clouds.',
      'Coordinate fluid arm circles with pelvic weight transfer.'
    ],
    formCues: 'Move like moving through warm water; eliminate all mechanical jerks.',
    avoidMistake: 'Tensing the traps or locking knee joints.',
    biomechanicsRationale: 'Calms sympathetic nervous system, restores balance proprioceptors, and resets whole-body coordination.',
    breathPattern: 'Inhale shift right, Exhale shift left'
  },
  {
    id: 'taichi-rooting-breath',
    name: 'Dan Tian Rooting & Earth Stance',
    category: 'taichi',
    vehicle: ['car', 'two-wheeler', 'truck', 'commuter'],
    durationSeconds: 60,
    reps: '6 deep grounding cycles',
    intensity: 'Gentle',
    targetMuscles: ['Diaphragm', 'Pelvic Floor', 'Soleus'],
    muscleGroup: ['core', 'calves'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Stand tall, feet parallel, arms hanging softly.',
      'Inhale: Float palms up the center of body to chest height, fingers relaxed.',
      'Exhale: Press palms downward toward the lower belly (Dan Tian), sinking weight into heels and soft knees.',
      'Feel energy grounding down into the earth.'
    ],
    formCues: 'Visualize rooting tree roots deep into the pavement through soles of feet.',
    avoidMistake: 'Shrugging shoulders on upward float.',
    biomechanicsRationale: 'Down-regulates high cortisol and road rage by stimulating vagus nerve tone through diaphragmatic rooting.',
    breathPattern: '4s Inhale upward float, 6s Exhale downward press'
  },
  {
    id: 'taichi-single-leg-balance',
    name: 'Golden Rooster Standing Stork Balance',
    category: 'taichi',
    vehicle: ['car', 'two-wheeler', 'truck'],
    durationSeconds: 60,
    reps: '30s each leg',
    intensity: 'Moderate',
    targetMuscles: ['Gluteus Medius', 'Peroneals', 'Deep Ankle Stabilizers'],
    muscleGroup: ['hips', 'calves', 'core'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Stand near car door or bike for safety.',
      'Shift weight onto left foot, grounding all 4 corners of the foot.',
      'Slowly lift right knee to 90 degrees while raising right hand palm facing left.',
      'Fix gaze on a stationary horizon point 15 feet ahead; hold with quiet breath.'
    ],
    formCues: 'Engage the standing glute and keep hip level; avoid dumping into standing hip.',
    avoidMistake: 'Holding breath to stabilize balance.',
    biomechanicsRationale: 'Re-activates vestibular and cerebellar balance centers fatigued by passive seat sitting or motorcycle leaning.',
    breathPattern: 'Continuous calm nasal breathing'
  },

  // MINDFUL YOGA ADAPTATIONS
  {
    id: 'yoga-seated-eagle-arms',
    name: 'Seated Garudasana (Eagle Arms) Scapular Split',
    category: 'yoga',
    vehicle: ['car', 'truck', 'commuter'],
    durationSeconds: 60,
    reps: '30s each arm cross',
    intensity: 'Deep Release',
    targetMuscles: ['Rhomboids', 'Infraspinatus', 'Teres Minor', 'Posterior Deltoid'],
    muscleGroup: ['shoulders', 'upper-back'],
    location: 'In-Seat',
    steps: [
      'Extend both arms forward parallel to floor.',
      'Cross right arm over left above elbows; bend elbows and wrap forearms, pressing palms together (or back of hands).',
      'Inhale: Lift elbows to shoulder height and press forearms slightly forward away from face.',
      'Breathe deeply into the space between your shoulder blades for 30s, then switch arms.'
    ],
    formCues: 'Keep shoulders drawing down away from ears while lifting elbows.',
    avoidMistake: 'Collapsing chin into chest or hunching spine.',
    biomechanicsRationale: 'Deeply separates contracted scapular retractors and relieves the chronic thoracic burning knot of highway drivers.',
    breathPattern: 'Inhale expand upper back, Exhale soften jaw'
  },
  {
    id: 'yoga-downward-dog-bumper',
    name: 'Rest-Stop Hood / Bumper Downward Dog',
    category: 'yoga',
    vehicle: ['car', 'two-wheeler', 'truck'],
    durationSeconds: 60,
    reps: '45s sustained decompression hold',
    intensity: 'Deep Release',
    targetMuscles: ['Latissimus Dorsi', 'Pectoralis Major', 'Hamstrings', 'Thoracic Spine'],
    muscleGroup: ['upper-back', 'hamstrings', 'shoulders', 'lower-back'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Stand facing car hood, trunk, or bike saddle. Place palms flat shoulder-width apart.',
      'Step feet back until arms and spine form a straight horizontal line, hips over feet.',
      'Let your head relax between your biceps, allowing chest to melt gently toward ground.',
      'Feel total axial traction through the entire spinal column.'
    ],
    formCues: 'Press firmly through palms; keep micro-bend in knees to protect lower back.',
    avoidMistake: 'Collapsing lower back into a deep swayback.',
    biomechanicsRationale: 'Provides the ultimate gravity-assisted spinal traction to decompress intervertebral disc height lost during driving.',
    breathPattern: 'Long 5s inhales / 5s exhales'
  },
  {
    id: 'yoga-standing-crescent-moon',
    name: 'Standing Crescent Lateral Opener',
    category: 'yoga',
    vehicle: ['car', 'two-wheeler', 'truck', 'commuter'],
    durationSeconds: 50,
    reps: '25s each side',
    intensity: 'Moderate',
    targetMuscles: ['Quadratus Lumborum', 'Intercostals', 'Latissimus Dorsi', 'IT Band'],
    muscleGroup: ['lower-back', 'upper-back', 'hips'],
    location: 'Off-Vehicle / Standing',
    steps: [
      'Stand tall with feet together. Inhale and reach both arms overhead, clasping fingers with index fingers pointed.',
      'Exhale and side-bend torso gently to the right, pushing left hip slightly out to the left.',
      'Gaze forward and rotate left shoulder back so chest stays open to the front.',
      'Inhale center, exhale repeat to the left.'
    ],
    formCues: 'Think of arching up and over a giant beach ball, maintaining length in both waist sides.',
    avoidMistake: 'Crunching the underside waistline or twisting forward.',
    biomechanicsRationale: 'Opens compressed lateral fascial sling and releases the Quadratus Lumborum muscle that cramps when using gas/brake pedals.',
    breathPattern: 'Breathe directly into the expanded ribcage side'
  }
];

export const CURATED_ROUTINES: Routine[] = [
  {
    id: 'routine-car-10min',
    title: '10-Min In-Seat Commuter Reset',
    subtitle: 'Fast in-cockpit decompression sequence for stoplights and parking stops',
    category: 'car',
    vehicle: 'car',
    durationMinutes: 10,
    intensity: 'Gentle',
    targetAreas: ['Neck', 'Shoulders', 'Lower Back', 'Wrists', 'Circulation'],
    coachRationale: 'Engineered by Olympic coaching principles to sequentially reset posture from cranial base down to lower leg venous pumps.',
    bannerGradient: 'from-cyan-500 to-blue-600',
    exercises: [
      ALL_EXERCISES.find(e => e.id === 'car-neck-rolls')!,
      ALL_EXERCISES.find(e => e.id === 'car-shoulder-retraction')!,
      ALL_EXERCISES.find(e => e.id === 'car-wrist-rotations')!,
      ALL_EXERCISES.find(e => e.id === 'car-pelvic-clock')!,
      ALL_EXERCISES.find(e => e.id === 'car-hamstring-slide')!,
      ALL_EXERCISES.find(e => e.id === 'car-calf-pumps')!,
      ALL_EXERCISES.find(e => e.id === 'quick-eye-palming')!
    ]
  },
  {
    id: 'routine-rider-12min',
    title: '12-Min Motorcyclist & Rider Reset',
    subtitle: 'Off-bike restorative mobility to reverse road vibration & rider tuck fatigue',
    category: 'two-wheeler',
    vehicle: 'two-wheeler',
    durationMinutes: 12,
    intensity: 'Moderate',
    targetAreas: ['Hips', 'Shoulders', 'Neck', 'Forearms', 'Spine'],
    coachRationale: 'Targeted directly at the hip flexion angle, wrist clutch fatigue, and cervical wind resistance loads common to two-wheelers.',
    bannerGradient: 'from-amber-500 to-red-600',
    exercises: [
      ALL_EXERCISES.find(e => e.id === 'bike-quad-stretch')!,
      ALL_EXERCISES.find(e => e.id === 'bike-hip-openers')!,
      ALL_EXERCISES.find(e => e.id === 'bike-shoulder-rolls')!,
      ALL_EXERCISES.find(e => e.id === 'bike-neck-tilts')!,
      ALL_EXERCISES.find(e => e.id === 'bike-wrist-flicks')!,
      ALL_EXERCISES.find(e => e.id === 'yoga-downward-dog-bumper')!,
      ALL_EXERCISES.find(e => e.id === 'taichi-rooting-breath')!
    ]
  },
  {
    id: 'routine-quick-5min',
    title: '5-Min Fast Highway Pitstop',
    subtitle: 'Emergency anti-fatigue & alertness booster for long highway drives',
    category: 'quick',
    vehicle: 'all',
    durationMinutes: 5,
    intensity: 'Gentle',
    targetAreas: ['Eyes', 'Spine', 'Breathing', 'Grip'],
    coachRationale: 'Rapidly dispels highway hypnosis, activates parasympathetic calm, and pumps fresh arterial blood to the brain.',
    bannerGradient: 'from-emerald-500 to-teal-600',
    exercises: [
      ALL_EXERCISES.find(e => e.id === 'quick-eye-palming')!,
      ALL_EXERCISES.find(e => e.id === 'quick-seated-twist')!,
      ALL_EXERCISES.find(e => e.id === 'car-shoulder-retraction')!,
      ALL_EXERCISES.find(e => e.id === 'quick-hand-squeezes')!,
      ALL_EXERCISES.find(e => e.id === 'car-calf-pumps')!
    ]
  },
  {
    id: 'routine-spinal-15min',
    title: '15-Min Complete Spinal Decompression',
    subtitle: 'Full cervical, thoracic, and lumbar restorative series with disc hydration',
    category: 'spinal',
    vehicle: 'all',
    durationMinutes: 15,
    intensity: 'Deep Release',
    targetAreas: ['Cervical Spine', 'Thoracic Cage', 'Lumbar Vertebrae', 'Sciatic Pathway'],
    coachRationale: 'Gymnastic spinal hygiene protocol utilizing flexion, extension, rotation, and axial traction to restore disc health.',
    bannerGradient: 'from-indigo-500 to-purple-600',
    exercises: [
      ALL_EXERCISES.find(e => e.id === 'spinal-seated-cat-cow')!,
      ALL_EXERCISES.find(e => e.id === 'spinal-thoracic-rotation')!,
      ALL_EXERCISES.find(e => e.id === 'spinal-lumbar-brace')!,
      ALL_EXERCISES.find(e => e.id === 'yoga-seated-eagle-arms')!,
      ALL_EXERCISES.find(e => e.id === 'bike-hip-openers')!,
      ALL_EXERCISES.find(e => e.id === 'spinal-standing-hamstring-reach')!,
      ALL_EXERCISES.find(e => e.id === 'yoga-downward-dog-bumper')!,
      ALL_EXERCISES.find(e => e.id === 'taichi-rooting-breath')!
    ]
  },
  {
    id: 'routine-taichi-8min',
    title: '8-Min Flow & Balance (Tai Chi & Qigong)',
    subtitle: 'Fluid standing sequence to restore vestibular balance and mental clarity',
    category: 'taichi',
    vehicle: 'all',
    durationMinutes: 8,
    intensity: 'Gentle',
    targetAreas: ['Mind-Body Balance', 'Core', 'Leg Stability', 'Breathing'],
    coachRationale: 'Uses centuries-old Qigong moving meditation to synchronize breath with motor patterns, dissolving driving tension.',
    bannerGradient: 'from-sky-500 to-indigo-600',
    exercises: [
      ALL_EXERCISES.find(e => e.id === 'taichi-rooting-breath')!,
      ALL_EXERCISES.find(e => e.id === 'taichi-cloud-hands')!,
      ALL_EXERCISES.find(e => e.id === 'taichi-single-leg-balance')!,
      ALL_EXERCISES.find(e => e.id === 'yoga-standing-crescent-moon')!,
      ALL_EXERCISES.find(e => e.id === 'taichi-rooting-breath')!
    ]
  }
];

export const BREATH_PROTOCOLS: BreathProtocol[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing (Navy SEAL Alertness Reset)',
    tagline: 'Equal 4-4-4-4 cycle to regain razor-sharp focus and eliminate highway panic',
    description: 'Developed for high-stress operators to balance autonomic nervous system, lower resting heart rate, and clear mental fog without inducing sleepiness.',
    inhaleSec: 4,
    holdInSec: 4,
    exhaleSec: 4,
    holdOutSec: 4,
    totalCycles: 6,
    category: 'focus',
    benefits: ['Equalizes CO2 balance', 'Stops driver rage spikes', 'Sharpen reflexes', 'Sustained calm focus']
  },
  {
    id: 'breath-478',
    name: '4-7-8 Deep Parasympathetic Vagal Reset',
    tagline: 'Natural tranquilizer protocol for driver rest stops and severe tension',
    description: 'Dr. Andrew Weil’s famed natural tranquilizer for the nervous system. By dramatically lengthening the exhale and hold, it sends instant safety signals to the amygdala.',
    inhaleSec: 4,
    holdInSec: 7,
    exhaleSec: 8,
    holdOutSec: 0,
    totalCycles: 5,
    category: 'calm',
    benefits: ['Instant heart rate reduction', 'Deep muscular decompression', 'Reduces road anxiety', 'Prepares body for deep rest']
  },
  {
    id: 'resonant-breath',
    name: 'Resonant Coherence (5.5s Heart Rate Variability)',
    tagline: '6 breaths per minute to optimize cardiovascular efficiency on long journeys',
    description: 'The golden physiological resonance frequency where heart rate, blood pressure, and brain wave frequency lock into maximum biological coherence.',
    inhaleSec: 5.5,
    holdInSec: 0,
    exhaleSec: 5.5,
    holdOutSec: 0,
    totalCycles: 10,
    category: 'calm',
    benefits: ['Optimizes Heart Rate Variability (HRV)', 'Lowers arterial blood pressure', 'Boosts emotional composure', 'Increases oxygen delivery to brain']
  },
  {
    id: 'energizing-breath',
    name: 'Highway Alertness Tri-Phase Energizer',
    tagline: 'Quick 3-second rapid oxygenation for late-night drowsiness emergencies',
    description: 'A brisk, energizing diaphragmatic pump to immediately elevate blood oxygen saturation, dispel drowsiness, and sharpen peripheral vision.',
    inhaleSec: 3,
    holdInSec: 1,
    exhaleSec: 2,
    holdOutSec: 0,
    totalCycles: 8,
    category: 'energize',
    benefits: ['Dispels acute drowsiness', 'Elevates alertness without caffeine', 'Stimulates sympathetic readiness', 'Brightens visual clarity']
  }
];

export const ERGONOMIC_TIPS: ErgonomicTip[] = [
  {
    id: 'ergo-seat-angle',
    area: 'Driver Seat Recline Angle',
    vehicle: 'car',
    rule: 'Recline backrest between 100° and 110°',
    angleOrDistance: '100° - 110°',
    why: 'Sitting upright at 90° increases lumbar disc pressure by 40% over standing; reclining past 110° forces the neck to crane forward to see the road.',
    correctionSteps: [
      'Sit fully back against the seat crease.',
      'Adjust recline until your shoulders rest comfortably while your head remains balanced over your spine.',
      'Ensure the headrest is centered with the middle of your head (not below ears).'
    ]
  },
  {
    id: 'ergo-pedal-distance',
    area: 'Leg & Pedal Clearance',
    vehicle: 'car',
    rule: 'Keep a 120° slight bend in knees when pressing pedals',
    angleOrDistance: '120° knee angle',
    why: 'Locking knees straight hyperextends the sciatic nerve and strains the lower back; sitting too close traps hip flexors in acute spasm.',
    correctionSteps: [
      'Depress the brake pedal all the way to the floor with your right foot.',
      'Verify your right knee still retains a noticeable 20-30° bend without your pelvis lifting off the seat.',
      'Rest your left foot flat on the dead-pedal footrest to brace the pelvis symmetrically.'
    ]
  },
  {
    id: 'ergo-steering-grip',
    area: 'Steering Wheel Distance & Hand Position',
    vehicle: 'car',
    rule: 'Hold at 9 and 3 o’clock, 10-12 inches from sternum',
    angleOrDistance: '10 - 12 inches (25 - 30 cm)',
    why: 'The outdated "10 and 2" grip induces chronic upper trapezius shrugging and increases airbag forearm injury risk; 9-and-3 keeps rotator cuffs neutral.',
    correctionSteps: [
      'Extend your arms straight over the top of the steering wheel.',
      'Your wrists should rest naturally on top of the steering rim without your shoulder blades leaving the seat back.',
      'Grip wheel at 9 and 3 with relaxed thumbs resting along the rim (do not white-knuckle).'
    ]
  },
  {
    id: 'ergo-mirrors',
    area: 'Rearview & Side Mirrors Angle Check',
    vehicle: 'car',
    rule: 'Set mirrors when sitting in perfect upright posture',
    angleOrDistance: 'Zero-crane blind spot field',
    why: 'If you slouch and set mirrors, you will unconsciously stay slouched to see them. Setting them in optimal posture forces you to sit tall.',
    correctionSteps: [
      'Sit up tall with chin tucked and shoulders relaxed.',
      'Adjust center rearview mirror so you see entire back window without tilting head.',
      'Lean head slightly left to set driver mirror; lean head slightly right to set passenger mirror for wide blind-spot coverage.'
    ]
  },
  {
    id: 'ergo-moto-handlebar',
    area: 'Handlebar Reach & Grip Alignment',
    vehicle: 'two-wheeler',
    rule: 'Arms bent with wrists in neutral straight plane with levers',
    angleOrDistance: '15° - 20° elbow bend',
    why: 'Bent wrists pinch the median nerve under brake/clutch pressure; straight arms transmit all road impacts directly into the cervical vertebrae.',
    correctionSteps: [
      'Adjust clutch and brake levers so your fingers, wrists, and forearms form a single straight line when resting on levers.',
      'Support upper body weight primarily with core and thighs gripping the tank, not pushing through wrists.',
      'Relax shoulders downward away from the helmet base.'
    ]
  }
];

export const EXERCISE_DATABASE = ALL_EXERCISES;

