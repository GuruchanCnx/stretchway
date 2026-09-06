import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  Maximize2, 
  Compass, 
  Activity,
  Layers
} from 'lucide-react';
import { Exercise } from '../types';

interface Exercise3DCharacterProps {
  exercise: Exercise;
  variant?: 'mini' | 'card' | 'player' | 'modal';
  isPlaying?: boolean;
  themeColor?: string;
}

export const Exercise3DCharacter: React.FC<Exercise3DCharacterProps> = ({
  exercise,
  variant = 'card',
  isPlaying: externalIsPlaying = true,
  themeColor = '#06b6d4'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(externalIsPlaying);
  const [speed, setSpeed] = useState<number>(1);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [cameraAngle, setCameraAngle] = useState<'iso' | 'front' | 'side'>('iso');
  const [isHovered, setIsHovered] = useState(false);

  // Sync external playing prop
  useEffect(() => {
    setIsPlaying(externalIsPlaying);
  }, [externalIsPlaying]);

  const isCompact = variant === 'mini' || variant === 'card';

  // Movement archetype detection
  const getMovementType = (ex: Exercise): string => {
    const id = ex.id.toLowerCase();
    const cat = ex.category;
    const muscles = (ex.muscleGroup || []).join(' ');

    if (id.includes('neck') || id.includes('cervical') || muscles.includes('neck')) return 'neck-mobility';
    if (id.includes('wrist') || id.includes('flick') || id.includes('squeeze') || muscles.includes('wrist')) return 'wrist-spiral';
    if (id.includes('hamstring') || id.includes('sciatic')) return 'hamstring-slide';
    if (id.includes('scapular') || id.includes('shoulder') || id.includes('retraction') || id.includes('chest')) return 'chest-opener';
    if (id.includes('pelvic') || id.includes('lumbar') || id.includes('brace')) return 'pelvic-tilt';
    if (id.includes('calf') || id.includes('ankle') || id.includes('venous')) return 'calf-pumps';
    if (id.includes('quad') || id.includes('psoas')) return 'quad-stretch';
    if (id.includes('twist') || id.includes('rotation') || id.includes('thoracic')) return 'seated-twist';
    if (id.includes('cat-cow') || id.includes('spinal')) return 'cat-cow';
    if (id.includes('cloud') || id.includes('taichi')) return 'cloud-hands';
    if (id.includes('root') || id.includes('dan-tian')) return 'rooting-stance';
    if (id.includes('palming') || id.includes('eye')) return 'eye-palming';
    if (id.includes('hip') || id.includes('figure-4') || muscles.includes('hips')) return 'figure-4-hip';
    if (cat === 'yoga' || id.includes('warrior')) return 'warrior-flow';
    return 'general-mobility';
  };

  const movementType = getMovementType(exercise);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL init failed, fallback needed', e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );

    const updateCameraPos = (angle: 'iso' | 'front' | 'side') => {
      const dist = isCompact ? 7.2 : 6.0;
      if (angle === 'front') {
        camera.position.set(0, 0.4, dist);
      } else if (angle === 'side') {
        camera.position.set(dist * 0.95, 0.4, 0);
      } else {
        // Isometric 3/4
        camera.position.set(dist * 0.6, 0.9, dist * 0.75);
      }
      camera.lookAt(0, 0, 0);
    };

    updateCameraPos(cameraAngle);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainKeyLight.position.set(4, 6, 5);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    // Accent Cyber Rim Light matching theme
    const rimLight = new THREE.DirectionalLight(new THREE.Color(themeColor), 2.2);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // Under-glow point light
    const floorGlow = new THREE.PointLight(new THREE.Color(themeColor), 1.5, 8);
    floorGlow.position.set(0, -1.8, 0);
    scene.add(floorGlow);

    // HOLOGRAPHIC STAGE / GROUND
    const platformGroup = new THREE.Group();
    const diskGeo = new THREE.CylinderGeometry(2.4, 2.5, 0.08, 36);
    const diskMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.8
    });
    const platform = new THREE.Mesh(diskGeo, diskMat);
    platform.position.y = -1.95;
    platform.receiveShadow = true;
    platformGroup.add(platform);

    // Glowing stage ring
    const ringGeo = new THREE.RingGeometry(2.2, 2.38, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeColor),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.90;
    platformGroup.add(ringMesh);

    scene.add(platformGroup);

    // IN-SEAT FIXTURE (If exercise is in-seat)
    const isSeated = exercise.location.toLowerCase().includes('in-seat') || 
                     movementType === 'neck-mobility' || 
                     movementType === 'wrist-spiral' || 
                     movementType === 'seated-twist' || 
                     movementType === 'pelvic-tilt' ||
                     movementType === 'figure-4-hip';

    const seatGroup = new THREE.Group();
    if (isSeated) {
      // Bucket seat cushion
      const seatCushionGeo = new THREE.BoxGeometry(1.6, 0.28, 1.5);
      const seatMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7,
        metalness: 0.3
      });
      const cushion = new THREE.Mesh(seatCushionGeo, seatMat);
      cushion.position.set(0, -0.65, 0);
      seatGroup.add(cushion);

      // Bucket seat backrest
      const backrestGeo = new THREE.BoxGeometry(1.4, 2.2, 0.3);
      const backrest = new THREE.Mesh(backrestGeo, seatMat);
      backrest.position.set(0, 0.55, -0.75);
      backrest.rotation.x = 0.08;
      seatGroup.add(backrest);

      // Headrest
      const headrestGeo = new THREE.BoxGeometry(0.7, 0.55, 0.22);
      const headrest = new THREE.Mesh(headrestGeo, seatMat);
      headrest.position.set(0, 1.85, -0.85);
      seatGroup.add(headrest);

      // Steering wheel outline in front
      const wheelRingGeo = new THREE.TorusGeometry(0.55, 0.04, 12, 32);
      const wheelMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.5,
        metalness: 0.6
      });
      const wheel = new THREE.Mesh(wheelRingGeo, wheelMat);
      wheel.position.set(0, 0.2, 0.9);
      wheel.rotation.x = -Math.PI / 4;
      seatGroup.add(wheel);

      scene.add(seatGroup);
    }

    // 3D ARTICULATED HUMANOID CHARACTER MANNEQUIN
    // Root Rig Node
    const characterRoot = new THREE.Group();
    characterRoot.position.y = isSeated ? -0.4 : -0.2;
    scene.add(characterRoot);

    // Materials
    const skinColor = 0x38bdf8; // Cyan futuristic biomechanic avatar
    const jointColor = 0x0284c7;
    const visorColor = new THREE.Color(themeColor);

    const normalMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.25,
      metalness: 0.45,
      wireframe: isXRayMode
    });

    const jointMaterial = new THREE.MeshStandardMaterial({
      color: jointColor,
      roughness: 0.3,
      metalness: 0.65,
      wireframe: isXRayMode
    });

    const visorMaterial = new THREE.MeshStandardMaterial({
      color: visorColor,
      emissive: visorColor,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9
    });

    // 1. Pelvis / Hips
    const pelvisGeo = new THREE.BoxGeometry(0.75, 0.38, 0.5);
    const pelvis = new THREE.Mesh(pelvisGeo, normalMaterial);
    pelvis.position.y = 0;
    characterRoot.add(pelvis);

    // 2. Spine / Lumbar & Thoracic
    const spineJointGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const lumbarJoint = new THREE.Mesh(spineJointGeo, jointMaterial);
    lumbarJoint.position.y = 0.28;
    pelvis.add(lumbarJoint);

    const torsoGeo = new THREE.BoxGeometry(0.9, 0.8, 0.55);
    const torso = new THREE.Mesh(torsoGeo, normalMaterial);
    torso.position.y = 0.52;
    lumbarJoint.add(torso);

    // Glowing chest emblem / core breath indicator
    const chestCoreGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16);
    const chestCoreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeColor)
    });
    const chestCore = new THREE.Mesh(chestCoreGeo, chestCoreMat);
    chestCore.rotation.x = Math.PI / 2;
    chestCore.position.set(0, 0.12, 0.29);
    torso.add(chestCore);

    // 3. Cervical Spine & Neck
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.28, 16);
    const neck = new THREE.Mesh(neckGeo, jointMaterial);
    neck.position.y = 0.52;
    torso.add(neck);

    // 4. Head with Visor
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.28;
    neck.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.28, 20, 20);
    const head = new THREE.Mesh(headGeo, normalMaterial);
    headGroup.add(head);

    // Cyber visor
    const visorGeo = new THREE.BoxGeometry(0.36, 0.12, 0.22);
    const visor = new THREE.Mesh(visorGeo, visorMaterial);
    visor.position.set(0, 0.04, 0.2);
    headGroup.add(visor);

    // 5. Left Arm Hierarchy
    const leftShoulderJoint = new THREE.Mesh(spineJointGeo, jointMaterial);
    leftShoulderJoint.position.set(0.58, 0.32, 0);
    torso.add(leftShoulderJoint);

    const leftUpperArmGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.52, 16);
    const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, normalMaterial);
    leftUpperArm.position.y = -0.26;
    leftShoulderJoint.add(leftUpperArm);

    const leftElbowJoint = new THREE.Mesh(spineJointGeo, jointMaterial);
    leftElbowJoint.position.y = -0.3;
    leftUpperArm.add(leftElbowJoint);

    const leftForearmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.48, 16);
    const leftForearm = new THREE.Mesh(leftForearmGeo, normalMaterial);
    leftForearm.position.y = -0.24;
    leftElbowJoint.add(leftForearm);

    const leftHandGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const leftHand = new THREE.Mesh(leftHandGeo, jointMaterial);
    leftHand.position.y = -0.28;
    leftForearm.add(leftHand);

    // 6. Right Arm Hierarchy
    const rightShoulderJoint = new THREE.Mesh(spineJointGeo, jointMaterial);
    rightShoulderJoint.position.set(-0.58, 0.32, 0);
    torso.add(rightShoulderJoint);

    const rightUpperArmGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.52, 16);
    const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, normalMaterial);
    rightUpperArm.position.y = -0.26;
    rightShoulderJoint.add(rightUpperArm);

    const rightElbowJoint = new THREE.Mesh(spineJointGeo, jointMaterial);
    rightElbowJoint.position.y = -0.3;
    rightUpperArm.add(rightElbowJoint);

    const rightForearmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.48, 16);
    const rightForearm = new THREE.Mesh(rightForearmGeo, normalMaterial);
    rightForearm.position.y = -0.24;
    rightElbowJoint.add(rightForearm);

    const rightHandGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const rightHand = new THREE.Mesh(rightHandGeo, jointMaterial);
    rightHand.position.y = -0.28;
    rightForearm.add(rightHand);

    // 7. Left Leg Hierarchy
    const leftHipJoint = new THREE.Mesh(spineJointGeo, jointMaterial);
    leftHipJoint.position.set(0.26, -0.2, 0);
    pelvis.add(leftHipJoint);

    const leftThighGeo = new THREE.CylinderGeometry(0.13, 0.11, 0.65, 16);
    const leftThigh = new THREE.Mesh(leftThighGeo, normalMaterial);
    leftThigh.position.y = -0.34;
    leftHipJoint.add(leftThigh);

    const leftKneeJoint = new THREE.Mesh(spineJointGeo, jointMaterial);
    leftKneeJoint.position.y = -0.35;
    leftThigh.add(leftKneeJoint);

    const leftShinGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.62, 16);
    const leftShin = new THREE.Mesh(leftShinGeo, normalMaterial);
    leftShin.position.y = -0.32;
    leftKneeJoint.add(leftShin);

    const footGeo = new THREE.BoxGeometry(0.18, 0.12, 0.38);
    const leftFoot = new THREE.Mesh(footGeo, jointMaterial);
    leftFoot.position.set(0, -0.34, 0.12);
    leftShin.add(leftFoot);

    // 8. Right Leg Hierarchy
    const rightHipJoint = new THREE.Mesh(spineJointGeo, jointMaterial);
    rightHipJoint.position.set(-0.26, -0.2, 0);
    pelvis.add(rightHipJoint);

    const rightThighGeo = new THREE.CylinderGeometry(0.13, 0.11, 0.65, 16);
    const rightThigh = new THREE.Mesh(rightThighGeo, normalMaterial);
    rightThigh.position.y = -0.34;
    rightHipJoint.add(rightThigh);

    const rightKneeJoint = new THREE.Mesh(spineJointGeo, jointMaterial);
    rightKneeJoint.position.y = -0.35;
    rightThigh.add(rightKneeJoint);

    const rightShinGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.62, 16);
    const rightShin = new THREE.Mesh(rightShinGeo, normalMaterial);
    rightShin.position.y = -0.32;
    rightKneeJoint.add(rightShin);

    const rightFoot = new THREE.Mesh(footGeo, jointMaterial);
    rightFoot.position.set(0, -0.34, 0.12);
    rightShin.add(rightFoot);

    // PRE-SET SEATED POSTURE
    if (isSeated) {
      // Hips at 90 deg forward
      leftHipJoint.rotation.x = Math.PI / 2 - 0.1;
      rightHipJoint.rotation.x = Math.PI / 2 - 0.1;

      // Knees at 90 deg down
      leftKneeJoint.rotation.x = -Math.PI / 2 + 0.1;
      rightKneeJoint.rotation.x = -Math.PI / 2 + 0.1;

      // Rest hands forward
      leftShoulderJoint.rotation.x = 0.45;
      rightShoulderJoint.rotation.x = 0.45;
      leftElbowJoint.rotation.x = -0.55;
      rightElbowJoint.rotation.x = -0.55;
    }

    // TARGET MUSCLE GLOW HIGHLIGHT SPHERES (X-RAY / BIOMECHANIC FOCUS)
    const highlightGroup = new THREE.Group();
    const hlGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const hlMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeColor),
      transparent: true,
      opacity: 0.75,
      wireframe: true
    });

    const highlightPoints: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(hlGeo, hlMat);
      highlightGroup.add(p);
      highlightPoints.push(p);
    }
    scene.add(highlightGroup);

    // DRAG INTERACTION (3D Orbit)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let orbitAzimuth = 0;
    let orbitElevation = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      orbitAzimuth += deltaX * 0.012;
      orbitElevation = Math.max(-0.4, Math.min(0.8, orbitElevation + deltaY * 0.008));

      characterRoot.rotation.y = orbitAzimuth;
      if (isSeated) seatGroup.rotation.y = orbitAzimuth;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer?.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // ANIMATION LOOP WITH EXERCISE-SPECIFIC 3D KINEMATICS
    let animFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const t = clock.getElapsedTime() * (isPlaying ? speed * 1.5 : 0.05);

      // Breath oscillation on core
      const breathScale = 1 + Math.sin(t * 1.2) * 0.08;
      chestCore.scale.set(breathScale, breathScale, breathScale);

      // Subtle platform idle rotation
      platformGroup.rotation.y = t * 0.1;

      // 3D KINEMATICS SWITCHBOARD
      switch (movementType) {
        case 'neck-mobility': {
          // Head pitch and lateral flexion with chin retraction
          headGroup.rotation.x = Math.sin(t * 1.5) * 0.35; // nod / retract
          headGroup.rotation.y = Math.cos(t * 1.2) * 0.45; // rotate
          headGroup.rotation.z = Math.sin(t * 0.8) * 0.25; // lateral tilt
          // Occipital tension points
          highlightPoints[0].position.set(0, 1.45, -0.2);
          highlightPoints[1].position.set(0.2, 1.35, 0);
          highlightPoints[2].position.set(-0.2, 1.35, 0);
          highlightPoints[3].visible = false;
          break;
        }

        case 'wrist-spiral': {
          // Forearms forward, wrists rolling in 3D circles
          leftShoulderJoint.rotation.x = 0.8 + Math.sin(t) * 0.05;
          rightShoulderJoint.rotation.x = 0.8 + Math.sin(t) * 0.05;
          leftElbowJoint.rotation.x = -0.9;
          rightElbowJoint.rotation.x = -0.9;
          leftForearm.rotation.z = Math.sin(t * 2) * 0.4;
          rightForearm.rotation.z = -Math.sin(t * 2) * 0.4;
          leftHand.rotation.x = Math.sin(t * 2.5) * 0.6;
          leftHand.rotation.y = Math.cos(t * 2.5) * 0.6;
          rightHand.rotation.x = Math.sin(t * 2.5) * 0.6;
          rightHand.rotation.y = -Math.cos(t * 2.5) * 0.6;
          // Wrist points
          highlightPoints[0].position.set(0.55, 0.1, 0.7);
          highlightPoints[1].position.set(-0.55, 0.1, 0.7);
          highlightPoints[2].visible = false;
          highlightPoints[3].visible = false;
          break;
        }

        case 'chest-opener': {
          // Scapular retraction & thoracic extension
          const openCycle = (Math.sin(t * 1.2) + 1) / 2; // 0 to 1
          torso.rotation.x = -openCycle * 0.25; // arch back
          leftShoulderJoint.rotation.z = -0.2 - openCycle * 0.75; // draw back
          rightShoulderJoint.rotation.z = 0.2 + openCycle * 0.75;
          leftShoulderJoint.rotation.y = -openCycle * 0.6;
          rightShoulderJoint.rotation.y = openCycle * 0.6;
          leftElbowJoint.rotation.x = -0.4 - openCycle * 0.8;
          rightElbowJoint.rotation.x = -0.4 - openCycle * 0.8;
          // Trapezius and pectoralis highlights
          highlightPoints[0].position.set(0, 0.8, -0.3);
          highlightPoints[1].position.set(0.4, 0.7, 0.1);
          highlightPoints[2].position.set(-0.4, 0.7, 0.1);
          highlightPoints[3].position.set(0, 0.5, 0.3);
          break;
        }

        case 'seated-twist': {
          // Axial rotation of thoracic spine
          const twist = Math.sin(t * 1.0) * 0.65; // ~37 degrees
          torso.rotation.y = twist;
          headGroup.rotation.y = twist * 1.25;
          leftShoulderJoint.rotation.y = twist * 0.5;
          rightShoulderJoint.rotation.y = twist * 0.5;
          // Spinal column highlights
          highlightPoints[0].position.set(0, 0.4, 0);
          highlightPoints[1].position.set(0, 0.7, 0);
          highlightPoints[2].position.set(Math.sin(twist) * 0.3, 0.9, 0);
          highlightPoints[3].visible = false;
          break;
        }

        case 'pelvic-tilt':
        case 'cat-cow': {
          // Anterior / Posterior pelvic tilt with lumbar arching
          const tilt = Math.sin(t * 1.4) * 0.35;
          pelvis.rotation.x = tilt;
          lumbarJoint.rotation.x = -tilt * 1.3;
          torso.rotation.x = -tilt * 0.7;
          headGroup.rotation.x = tilt * 0.4;
          // Lumbar & sacrum highlights
          highlightPoints[0].position.set(0, -0.1, -0.2);
          highlightPoints[1].position.set(0, 0.25, -0.25);
          highlightPoints[2].position.set(0, 0.6, -0.2);
          highlightPoints[3].visible = false;
          break;
        }

        case 'hamstring-slide': {
          // Torso hinges forward at hip crease, right leg extended
          const hinge = (Math.sin(t * 1.2) + 1) * 0.35; // 0 to 0.7 rad
          pelvis.rotation.x = hinge;
          torso.rotation.x = -hinge * 0.3; // keep spine neutral
          rightKneeJoint.rotation.x = -0.3; // extended leg
          rightFoot.rotation.x = -0.4; // dorsiflex foot
          leftShoulderJoint.rotation.x = 0.6 + hinge * 0.8;
          rightShoulderJoint.rotation.x = 0.6 + hinge * 0.8;
          // Hamstring & sciatic nerve highlights
          highlightPoints[0].position.set(-0.3, -0.8, 0.4);
          highlightPoints[1].position.set(-0.3, -1.2, 0.6);
          highlightPoints[2].position.set(0, 0.1, -0.1);
          highlightPoints[3].visible = false;
          break;
        }

        case 'figure-4-hip': {
          // Right leg crossed at 90 deg over left knee, torso forward
          rightHipJoint.rotation.z = -0.85;
          rightHipJoint.rotation.y = 0.6;
          rightKneeJoint.rotation.x = -Math.PI / 3;
          const gluteStretch = (Math.sin(t * 1.1) + 1) * 0.25;
          pelvis.rotation.x = gluteStretch;
          // Piriformis highlight
          highlightPoints[0].position.set(-0.4, -0.35, -0.25);
          highlightPoints[1].position.set(-0.25, -0.25, 0.1);
          highlightPoints[2].visible = false;
          highlightPoints[3].visible = false;
          break;
        }

        case 'calf-pumps': {
          // Plantarflexion and dorsiflexion
          const pumpL = Math.sin(t * 3.0) * 0.45;
          const pumpR = Math.sin(t * 3.0 + Math.PI) * 0.45;
          leftFoot.rotation.x = pumpL;
          rightFoot.rotation.x = pumpR;
          leftKneeJoint.rotation.x = -Math.PI / 2 + pumpL * 0.15;
          rightKneeJoint.rotation.x = -Math.PI / 2 + pumpR * 0.15;
          // Calf highlights
          highlightPoints[0].position.set(0.26, -1.4, 0);
          highlightPoints[1].position.set(-0.26, -1.4, 0);
          highlightPoints[2].visible = false;
          highlightPoints[3].visible = false;
          break;
        }

        case 'cloud-hands':
        case 'taichi': {
          // Flowing reciprocal arm circles with weight shift
          const wave = Math.sin(t * 1.0);
          characterRoot.position.x = wave * 0.18;
          torso.rotation.y = wave * 0.35;
          leftShoulderJoint.rotation.z = -0.5 + Math.sin(t) * 0.6;
          leftShoulderJoint.rotation.x = 0.4 + Math.cos(t) * 0.5;
          rightShoulderJoint.rotation.z = 0.5 - Math.sin(t + Math.PI) * 0.6;
          rightShoulderJoint.rotation.x = 0.4 - Math.cos(t + Math.PI) * 0.5;
          highlightPoints[0].position.set(0, 0.4, 0.3);
          highlightPoints[1].position.set(wave * 0.5, 0.8, 0.4);
          highlightPoints[2].visible = false;
          highlightPoints[3].visible = false;
          break;
        }

        default: {
          // General mobility: rhythmic breathing and gentle shoulder roll
          const idleWave = Math.sin(t * 1.5);
          headGroup.rotation.y = idleWave * 0.25;
          leftShoulderJoint.rotation.x = 0.4 + idleWave * 0.2;
          rightShoulderJoint.rotation.x = 0.4 - idleWave * 0.2;
          highlightPoints[0].position.set(0, 0.6, 0);
          highlightPoints[1].visible = false;
          highlightPoints[2].visible = false;
          highlightPoints[3].visible = false;
          break;
        }
      }

      renderer?.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousedown', onPointerDown);
      canvas.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);

      renderer?.dispose();
    };
  }, [movementType, isPlaying, speed, isXRayMode, cameraAngle, isCompact, themeColor]);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-inner group ${
        isCompact ? 'min-h-[140px]' : 'min-h-[260px]'
      }`}
    >
      {/* Three.js Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating 3D Badge Indicator */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none z-10">
        <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-spin-slow" />
          <span>3D Kinetic Kinematics</span>
        </span>
        {!isCompact && (
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-900/80 text-slate-400 border border-slate-800">
            360° Drag to Orbit
          </span>
        )}
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-lg">
        {/* X-Ray Biomechanics Mode Toggle */}
        <button
          onClick={() => setIsXRayMode(!isXRayMode)}
          className={`p-1 rounded-lg text-xs transition-all ${
            isXRayMode 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Biomechanic X-Ray Wireframe"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>

        {/* Camera Angle Presets */}
        {!isCompact && (
          <button
            onClick={() => setCameraAngle(a => a === 'iso' ? 'front' : a === 'front' ? 'side' : 'iso')}
            className="px-1.5 py-0.5 rounded-lg text-[10px] font-mono text-slate-300 hover:text-cyan-300 bg-slate-800/80 border border-slate-700/60 flex items-center gap-0.5"
            title="Switch 3D Camera Angle (Iso / Front / Profile)"
          >
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>{cameraAngle.toUpperCase()}</span>
          </button>
        )}

        {/* Tempo Speed Button */}
        <button
          onClick={() => setSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 0.5 : 1)}
          className="px-1.5 py-0.5 rounded-lg text-[10px] font-mono text-slate-300 hover:text-cyan-300 bg-slate-800/80 border border-slate-700/60"
          title="Animation Speed"
        >
          {speed}x
        </button>

        {/* Play/Pause Toggle */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1 rounded-lg text-xs text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700/60"
          title={isPlaying ? 'Pause Motion' : 'Resume Motion'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Muscle Focus Label on Hover / Active */}
      {!isCompact && (
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="font-semibold text-white">{exercise.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-300">{(exercise.targetMuscles || []).slice(0, 2).join(', ')}</span>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-800 font-mono">
            {movementType.replace('-', ' ').toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};
