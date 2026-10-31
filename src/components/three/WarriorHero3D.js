"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Play,
  Pause,
  RotateCw,
  Shield,
  Zap,
  Sword,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  Flame,
  Activity,
  Maximize2
} from "lucide-react";
import { useSound } from "@/components/layout/SoundContext";
import { buildRealHumanWarrior, updateHumanStunts } from "./WarriorRig";

export default function WarriorHero3D({ onWeaponChange, compact = false }) {
  const mountRef = useRef(null);
  const { soundEnabled, toggleSound, playWhoosh, playBell, playWoodClick } = useSound();

  // State
  const [activeWeapon, setActiveWeapon] = useState("staff"); // "staff" | "sword_shield" | "dual_sticks"
  const [activeStunt, setActiveStunt] = useState("combat_stance"); // "combat_stance" | "shield_bash" | "pole_vault" | "infinity_spin" | "dual_flurry" | "combat_stance"
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.1);
  const [cameraView, setCameraView] = useState("action"); // "action" | "cinematic" | "overhead" | "close"

  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const warriorRef = useRef({});
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  // Mutable refs for animation loop
  const activeWeaponRef = useRef(activeWeapon);
  const activeStuntRef = useRef(activeStunt);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const soundEnabledRef = useRef(soundEnabled);
  const playWhooshRef = useRef(playWhoosh);

  useEffect(() => {
    activeWeaponRef.current = activeWeapon;
    activeStuntRef.current = activeStunt;
    isPlayingRef.current = isPlaying;
    speedRef.current = speed;
    soundEnabledRef.current = soundEnabled;
    playWhooshRef.current = playWhoosh;
  }, [activeWeapon, activeStunt, isPlaying, speed, soundEnabled, playWhoosh]);

  // Sound throttler ref
  const lastSoundTime = useRef(0);

  // Stunt Descriptions for the HUD
  const stuntDetails = {
    air_tornado: {
      name: "360° Hurricane Leap Staff Strike",
      telugu: "గగన వక్ర చక్రం • 360° గాల్లో ఎగిరి కర్ర విన్యాసం",
      desc: "Spectacular airborne 360° butterfly leap with centrifugal bamboo whirlwind and rock-solid Virasan impact landing.",
      weapon: "staff",
      icon: Zap,
    },
    shield_bash: {
      name: "Talwar 4-Hit Combat Kata & Dhal Ram",
      telugu: "ఖడ్గ చలన సమరం & డాలు రక్షణ దాడి • రాజపుత్ర యుద్ధ విన్యాసం",
      desc: "High-action combat sequence: piercing lunge thrust, 180° crescent slash, airborne overhead cleave, and crushing brass Dhal shield ram.",
      weapon: "sword_shield",
      icon: Shield,
    },
    dual_flurry: {
      name: "Jodi Karra Rhythmic Twin Stick Flurry",
      telugu: "జోడి కర్ర లయబద్ధ సమర విన్యాసం • సమతుల్య ద్విముఖ దాడి",
      desc: "Controlled twin-stick windmill rotations combining simultaneous high deflect and low counter at authentic combat tempo.",
      weapon: "dual_sticks",
      icon: Sword,
    },
    combat_stance: {
      name: "Combat Stance & Warrior Guard",
      telugu: "సమర ముద్ర • యోధ రక్షణ & అప్రమత్తత",
      desc: "Authentic grounded combat stance with two-handed bamboo staff grip (lead left hand forward, rear right hand below) and vigilant martial breathing.",
      weapon: "staff",
      icon: Activity,
    },
  };

  const handleSelectStunt = (stuntKey) => {
    setActiveStunt(stuntKey);
    const neededWeapon = stuntDetails[stuntKey].weapon;
    if (neededWeapon !== activeWeapon) {
      setActiveWeapon(neededWeapon);
      if (warriorRef.current.setWeapon) {
        warriorRef.current.setWeapon(neededWeapon);
      }
      if (onWeaponChange) onWeaponChange(neededWeapon);
    }
    playWhoosh(1.2);
  };

  const handleSelectWeapon = (weaponKey) => {
    setActiveWeapon(weaponKey);
    if (warriorRef.current.setWeapon) {
      warriorRef.current.setWeapon(weaponKey);
    }
    if (onWeaponChange) onWeaponChange(weaponKey);

    if (weaponKey === "sword_shield") {
      setActiveStunt("shield_bash");
    } else if (weaponKey === "dual_sticks") {
      setActiveStunt("dual_flurry");
    } else if (activeStunt === "shield_bash" || activeStunt === "dual_flurry") {
      setActiveStunt("combat_stance");
    }
    playWoodClick();
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId = null;
    let resizeObserver = null;
    let handleResize = null;
    let intersectionObserver = null;
    let handleVisibilityChange = null;

    try {
      // 1. Scene with Sunlit Temple Warm Atmosphere
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = new THREE.Color(0xF6F2EB);
      // Linear fog prevents obscuring close/mid-range warrior and mandapam
      scene.fog = new THREE.Fog(0xF6F2EB, 14, 40);

      // 2. Camera setup with cinematic framing
      const getWidth = () => container.clientWidth || window.innerWidth || 1200;
      const getHeight = () => container.clientHeight || 750;
      const width = getWidth();
      const height = getHeight();

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 1.30, 5.2);
      camera.lookAt(0, 0.86, 0);
      cameraRef.current = camera;

      // 3. Renderer with ACES Tone Mapping
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.inset = "0";

      // Clear any prior canvas if present
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 4. DAYLIGHT TEMPLE LIGHTING (Warm Golden Sunlight & Soft Sky Illumination)
      const skyAmbient = new THREE.AmbientLight(0xfff8ee, 1.45);
      scene.add(skyAmbient);

      // Warm Golden Direct Sunlight (Simulating Indian Temple Courtyard Sun)
      const sunKey = new THREE.DirectionalLight(0xfff1dc, 3.2);
      sunKey.position.set(5.5, 9.0, 5.2);
      scene.add(sunKey);

      // Soft Courtyard Fill Light (Prevents harsh dark areas)
      const courtyardFill = new THREE.DirectionalLight(0xf4e6d4, 1.2);
      courtyardFill.position.set(-4.5, 4.0, 3.5);
      scene.add(courtyardFill);

      // Soft Rim Light from rear sanctum
      const templeBacklight = new THREE.DirectionalLight(0xffe8cf, 1.4);
      templeBacklight.position.set(0, 3.5, -5.0);
      scene.add(templeBacklight);

      // 5. ANCIENT STONE TEMPLE COURTYARD & MANDAPAM ENVIRONMENT
      const templeGroup = new THREE.Group();
      scene.add(templeGroup);

      // A. Sunlit Granite Flagstone Courtyard Floor
      const floorGeom = new THREE.PlaneGeometry(36, 36);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0xded2c0,
        roughness: 0.82,
        metalness: 0.05,
      });
      const floorMesh = new THREE.Mesh(floorGeom, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = 0;
      templeGroup.add(floorMesh);

      // B. Sacred Central Martial Mandala Ring (Rangam / రంగం)
      const arenaPlinthGeom = new THREE.CylinderGeometry(4.4, 4.6, 0.04, 48);
      const arenaPlinthMat = new THREE.MeshStandardMaterial({
        color: 0xd7cbba,
        roughness: 0.75,
        metalness: 0.08,
      });
      const arenaPlinth = new THREE.Mesh(arenaPlinthGeom, arenaPlinthMat);
      arenaPlinth.position.y = 0.02;
      templeGroup.add(arenaPlinth);

      // Outer Temple Gold Inscription Ring
      const ring1Geom = new THREE.RingGeometry(3.6, 3.68, 64);
      const ring1Mat = new THREE.MeshBasicMaterial({
        color: 0xd97706,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
      ring1.rotation.x = Math.PI / 2;
      ring1.position.y = 0.042;
      templeGroup.add(ring1);

      // Inner Sacred Vermilion Ring
      const ring2Geom = new THREE.RingGeometry(2.15, 2.22, 48);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0xdc2626,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
      ring2.rotation.x = Math.PI / 2;
      ring2.position.y = 0.044;
      templeGroup.add(ring2);

      // Center Lotus Mandala Disc
      const lotusGeom = new THREE.RingGeometry(0.7, 0.76, 32);
      const lotusMat = new THREE.MeshBasicMaterial({
        color: 0xb45309,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
      });
      const lotusRing = new THREE.Mesh(lotusGeom, lotusMat);
      lotusRing.rotation.x = Math.PI / 2;
      lotusRing.position.y = 0.045;
      templeGroup.add(lotusRing);

      // Dynamic Landing Shockwave Ring
      const shockwaveGeom = new THREE.RingGeometry(0.2, 0.48, 32);
      const shockwaveMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      const shockwaveRing = new THREE.Mesh(shockwaveGeom, shockwaveMat);
      shockwaveRing.rotation.x = Math.PI / 2;
      shockwaveRing.position.y = 0.048;
      templeGroup.add(shockwaveRing);

      // C. CARVED STONE TEMPLE PILLARS (Mandapam Stambhas)
      const pillarStoneMat = new THREE.MeshStandardMaterial({
        color: 0xc8bba8,
        roughness: 0.84,
        metalness: 0.06,
      });
      const pillarTrimMat = new THREE.MeshStandardMaterial({
        color: 0xb5a794,
        roughness: 0.78,
        metalness: 0.12,
      });

      const createTemplePillar = (x, z) => {
        const pGroup = new THREE.Group();
        pGroup.position.set(x, 0, z);

        // Plinth base (Upapitha)
        const base1 = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.28, 0.72), pillarStoneMat);
        base1.position.y = 0.14;
        pGroup.add(base1);

        const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.22, 12), pillarTrimMat);
        base2.position.y = 0.38;
        pGroup.add(base2);

        // Lower faceted shaft (Octagonal)
        const shaftLower = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.4, 8), pillarStoneMat);
        shaftLower.position.y = 1.15;
        pGroup.add(shaftLower);

        // Carved mid-band relief ring
        const midBand = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.18, 12), pillarTrimMat);
        midBand.position.y = 1.92;
        pGroup.add(midBand);

        // Upper shaft
        const shaftUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.2, 8), pillarStoneMat);
        shaftUpper.position.y = 2.58;
        pGroup.add(shaftUpper);

        // Pot Capital (Kumbha)
        const capitalPot = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), pillarTrimMat);
        capitalPot.scale.set(1.0, 0.65, 1.0);
        capitalPot.position.y = 3.24;
        pGroup.add(capitalPot);

        // Abacus Plate & Bracket Corbel (Bodigai)
        const abacus = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.65), pillarStoneMat);
        abacus.position.y = 3.48;
        pGroup.add(abacus);

        const corbel = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.18, 0.40), pillarTrimMat);
        corbel.position.y = 3.62;
        pGroup.add(corbel);

        templeGroup.add(pGroup);
      };

      // 6 Carved Mandapam Pillars framing the courtyard
      createTemplePillar(-4.2, 1.5);
      createTemplePillar(4.2, 1.5);
      createTemplePillar(-3.6, -2.0);
      createTemplePillar(3.6, -2.0);
      createTemplePillar(-2.2, -4.5);
      createTemplePillar(2.2, -4.5);

      // Stone Lintel Beams spanning overhead
      const lintelGeom = new THREE.BoxGeometry(9.6, 0.24, 0.45);
      const lintel1 = new THREE.Mesh(lintelGeom, pillarStoneMat);
      lintel1.position.set(0, 3.82, -2.0);
      templeGroup.add(lintel1);

      const lintel2 = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.24, 0.45), pillarStoneMat);
      lintel2.position.set(0, 3.82, -4.5);
      templeGroup.add(lintel2);

      // D. DISTANT TEMPLE SANCTUM WALL (Garbhagriha Wall with Carved Doorway)
      const sanctumWall = new THREE.Mesh(
        new THREE.BoxGeometry(14, 4.8, 0.4),
        new THREE.MeshStandardMaterial({
          color: 0xc2b5a2,
          roughness: 0.88,
          metalness: 0.04,
        })
      );
      sanctumWall.position.set(0, 2.4, -5.2);
      templeGroup.add(sanctumWall);

      // Sanctum Doorway Archway (Dwaram)
      const doorwayFrame = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 3.4, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x9e8f7d, roughness: 0.85 })
      );
      doorwayFrame.position.set(0, 1.7, -4.95);
      templeGroup.add(doorwayFrame);

      const doorwayRecess = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 2.8, 0.25),
        new THREE.MeshBasicMaterial({ color: 0x5a4f43 })
      );
      doorwayRecess.position.set(0, 1.45, -4.9);
      templeGroup.add(doorwayRecess);

      // Sanctum Golden Oil Lamp Light inside the sanctum doorway
      const sanctumGlow = new THREE.PointLight(0xffa834, 2.2, 7);
      sanctumGlow.position.set(0, 1.2, -4.6);
      templeGroup.add(sanctumGlow);

      // E. TRADITIONAL BRASS TEMPLE LAMPS (Kuthuvilakku / కుత్తువిళక్కు)
      const brassLampMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.88,
        roughness: 0.25,
      });
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa22 });

      const createKuthuvilakku = (x, z) => {
        const lamp = new THREE.Group();
        lamp.position.set(x, 0, z);

        // Tiered brass base
        const bBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.16, 16), brassLampMat);
        bBase.position.y = 0.08;
        lamp.add(bBase);

        // Central stem with decorative rings
        const bStem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 1.4, 12), brassLampMat);
        bStem.position.y = 0.82;
        lamp.add(bStem);

        for (let i = 0; i < 3; i++) {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 16), brassLampMat);
          ring.rotation.x = Math.PI / 2;
          ring.position.y = 0.4 + i * 0.4;
          lamp.add(ring);
        }

        // Main oil bowl (Thaali)
        const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.08, 0.12, 16), brassLampMat);
        bowl.position.y = 1.54;
        lamp.add(bowl);

        // Sacred peacock finial (Annapakshi)
        const finial = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.18, 8), brassLampMat);
        finial.position.y = 1.70;
        lamp.add(finial);

        // Glowing flame
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.11, 8), flameMat);
        flame.position.y = 1.62;
        lamp.add(flame);

        // Lamp Point Light
        const pLight = new THREE.PointLight(0xff9900, 1.8, 5.5);
        pLight.position.y = 1.65;
        lamp.add(pLight);

        templeGroup.add(lamp);
      };

      createKuthuvilakku(-2.8, 0.6);
      createKuthuvilakku(2.8, 0.6);

      // F. Sacred Temple Flower Petals (Marigold Orange & Jasmine White)
      const petalCount = 45;
      const petalGeom = new THREE.BufferGeometry();
      const petalPositions = new Float32Array(petalCount * 3);
      const petalColors = new Float32Array(petalCount * 3);
      const petalVelocities = [];

      const orangeColor = new THREE.Color(0xf59e0b);
      const whiteColor = new THREE.Color(0xfffbeb);

      for (let i = 0; i < petalCount; i++) {
        petalPositions[i * 3] = (Math.random() - 0.5) * 8;
        petalPositions[i * 3 + 1] = Math.random() * 3.8;
        petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;

        const c = Math.random() > 0.4 ? orangeColor : whiteColor;
        petalColors[i * 3] = c.r;
        petalColors[i * 3 + 1] = c.g;
        petalColors[i * 3 + 2] = c.b;

        petalVelocities.push({
          y: -(0.005 + Math.random() * 0.010),
          x: (Math.random() - 0.5) * 0.006,
          rotSpeed: (Math.random() - 0.5) * 0.04,
        });
      }
      petalGeom.setAttribute("position", new THREE.BufferAttribute(petalPositions, 3));
      petalGeom.setAttribute("color", new THREE.BufferAttribute(petalColors, 3));

      const petalMat = new THREE.PointsMaterial({
        size: 0.065,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
      });
      const petalParticles = new THREE.Points(petalGeom, petalMat);
      scene.add(petalParticles);

      // 6. BUILD REAL SHIRTLESS HUMAN WARRIOR IN DHOTI
      const warrior = buildRealHumanWarrior(scene);
      warriorRef.current = warrior;

      // Set initial weapon
      warrior.setWeapon(activeWeaponRef.current);

      // 7. PERFORMANCE-OPTIMIZED ANIMATION LOOP (Pauses when offscreen or tab inactive)
      let animId = null;
      let animTime = 0;
      let lastTime = performance.now();
      let isVisible = true;
      let isTabActive = typeof document !== "undefined" ? document.visibilityState !== "hidden" : true;

      const animate = () => {
        if (!isVisible || !isTabActive) {
          animId = null;
          return;
        }

        animId = requestAnimationFrame(animate);
        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        // Update falling temple flower petals
        const positions = petalParticles.geometry.attributes.position.array;
        for (let i = 0; i < petalCount; i++) {
          positions[i * 3 + 1] += petalVelocities[i].y;
          positions[i * 3] += petalVelocities[i].x;
          if (positions[i * 3 + 1] < 0.06) {
            positions[i * 3 + 1] = 3.6;
            positions[i * 3] = (Math.random() - 0.5) * 8;
          }
        }
        petalParticles.geometry.attributes.position.needsUpdate = true;

        // Animate shirtless human warrior with authentic martial stunts
        if (isPlayingRef.current && warriorRef.current.root) {
          const dt = delta * speedRef.current;
          animTime += dt;
          updateHumanStunts(
            warriorRef.current,
            animTime,
            activeStuntRef.current,
            shockwaveRing
          );

          // Sound triggers synced with stunt impact / swings
          if (soundEnabledRef.current && now - lastSoundTime.current > 420 / speedRef.current) {
            if (activeStuntRef.current === "shield_bash") {
              playWhooshRef.current(1.3);
            } else if (
              activeStuntRef.current === "air_tornado" ||
              activeStuntRef.current === "pole_vault" ||
              activeStuntRef.current === "infinity_spin" ||
              activeStuntRef.current === "dual_flurry"
            ) {
              playWhooshRef.current(0.95);
            }
            lastSoundTime.current = now;
          }
        }

        renderer.render(scene, camera);
      };

      // Intersection Observer: Only render when visible in viewport
      if (typeof IntersectionObserver !== "undefined") {
        intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible && isTabActive && !animId) {
              lastTime = performance.now();
              animate();
            }
          },
          { threshold: 0.05 }
        );
        intersectionObserver.observe(container);
      } else {
        animate();
      }

      // Tab visibility listener
      handleVisibilityChange = () => {
        isTabActive = document.visibilityState !== "hidden";
        if (isVisible && isTabActive && !animId) {
          lastTime = performance.now();
          animate();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // 8. Responsive Resize Handling with ResizeObserver
      handleResize = () => {
        if (!container || !rendererRef.current || !cameraRef.current) return;
        const newWidth = container.clientWidth || window.innerWidth || 1200;
        const newHeight = container.clientHeight || 750;
        if (newWidth > 0 && newHeight > 0) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      };
      window.addEventListener("resize", handleResize);

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          handleResize();
        });
        resizeObserver.observe(container);
      }
    } catch (err) {
      console.error("Three.js initialization error:", err);
    }

    return () => {
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      if (handleVisibilityChange) {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      if (animId) {
        cancelAnimationFrame(animId);
      }
      if (container && rendererRef.current && rendererRef.current.domElement) {
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Camera preset controls
  const setCameraPreset = (mode) => {
    setCameraView(mode);
    const cam = cameraRef.current;
    if (!cam) return;

    if (mode === "action") {
      cam.position.set(0, 1.30, 5.2);
      cam.lookAt(0, 0.86, 0);
    } else if (mode === "cinematic") {
      cam.position.set(3.4, 1.55, 4.2);
      cam.lookAt(0, 0.86, 0);
    } else if (mode === "overhead") {
      cam.position.set(0, 4.6, 3.4);
      cam.lookAt(0, 0.65, 0);
    } else if (mode === "close") {
      cam.position.set(0.6, 1.25, 3.4);
      cam.lookAt(0, 0.86, 0);
    }
  };

  // Pointer Orbit Drag Controls (handles mouse and touch seamlessly)
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
    if (e.target && e.target.setPointerCapture) {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (err) { }
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !warriorRef.current.root) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    warriorRef.current.root.rotation.y += deltaX * 0.012;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    if (e.target && e.target.releasePointerCapture) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (err) { }
    }
  };

  const activeStuntInfo = stuntDetails[activeStunt] || stuntDetails.air_tornado;

  return (
    <div className="relative w-full h-full min-h-[600px] lg:min-h-[740px] overflow-hidden flex flex-col justify-between select-none bg-[#F6F2EB]">
      {/* 3D WebGL Canvas Layer (100% Unobstructed Temple View) */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0 touch-none"
      />

      {/* TOP FLOATING STATUS BAR: Light Sandstone Theme Badges & Camera Presets */}
      <div className="relative z-10 w-full p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        {/* Left: Active Stunt Minimal Status Badge */}
        <div className="pointer-events-auto bg-white/92 backdrop-blur-xl border border-amber-200/80 rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-3">
          {/* <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-ping" /> */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                Active Stunt:
              </span>
              <span className="font-serif text-xs font-bold text-stone-900 uppercase">
                {activeStuntInfo.name}
              </span>
            </div>
            <p className="font-telugu text-[11px] text-stone-600 font-medium">
              {activeStuntInfo.telugu}
            </p>
          </div>
        </div>

        {/* Right: Camera Angle Pills */}
        <div className="pointer-events-auto bg-white/92 backdrop-blur-xl border border-amber-200/80 rounded-2xl p-1.5 shadow-lg flex items-center gap-1">
          {[
            { id: "action", label: "Front" },
            { id: "cinematic", label: "Angle" },
            { id: "overhead", label: "Arena" },
            { id: "close", label: "Duel" },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCameraPreset(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${cameraView === c.id
                ? "bg-[#DC2626] text-white shadow-md shadow-[#DC2626]/30"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM FLOATING CONTROLS DOCK: Light Theme Weapon & Acrobatic Stunt Triggers */}
      <div className="relative z-10 w-full p-3 sm:p-4 pointer-events-none flex flex-col items-center gap-2">
        {/* Row 1: Interactive Weapon Selector Pills & Speed / Sound Controls */}
        <div className="pointer-events-auto bg-white/92 backdrop-blur-xl border border-amber-200/80 rounded-2xl p-1.5 shadow-xl flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 px-2.5 hidden sm:inline-block">
            Weapon:
          </span>
          {[
            { id: "staff", label: "🎋 Bamboo Staff (కర్ర)", icon: Zap },
            { id: "sword_shield", label: "⚔️ Talwar & Dhal (కత్తి & డాలు)", icon: Shield },
            { id: "dual_sticks", label: "🥢 Jodi Karra (జోడి కర్ర)", icon: Sword },
          ].map((w) => (
            <button
              key={w.id}
              onClick={() => handleSelectWeapon(w.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${activeWeapon === w.id
                ? "bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white shadow-md shadow-[#DC2626]/30 scale-105"
                : "bg-stone-100/80 hover:bg-stone-200/70 text-stone-700"
                }`}
            >
              <span>{w.label}</span>
            </button>
          ))}

          {/* Quick Controls: Play/Pause, Speed, Sound */}
          <div className="flex items-center gap-1 border-l border-stone-200 pl-2 ml-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Stunt" : "Play Stunt"}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-700" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            </button>

            <button
              onClick={() => {
                const nextSpeed = speed >= 1.4 ? 0.7 : speed + 0.3;
                setSpeed(parseFloat(nextSpeed.toFixed(1)));
                playWoodClick();
              }}
              title="Toggle Speed"
              className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-[11px] font-bold text-amber-800"
            >
              {speed}x
            </button>

            <button
              onClick={toggleSound}
              title={soundEnabled ? "Martial Sound Enabled" : "Enable Sound"}
              className={`p-1.5 rounded-lg border transition-all ${soundEnabled
                ? "bg-[#DC2626]/10 border-[#DC2626] text-[#DC2626]"
                : "bg-stone-100 border-stone-200 text-stone-500 hover:text-stone-800"
                }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Row 2: Stunt Selector Pills for the active weapon */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-amber-200/70 rounded-xl p-1 shadow-md flex flex-wrap items-center justify-center gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 px-2 font-serif hidden md:inline-flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#DC2626]" />
            <span>Action:</span>
          </span>

          {Object.entries(stuntDetails)
            .filter(([_, st]) => st.weapon === activeWeapon || (activeWeapon === "staff" && st.weapon === "staff"))
            .map(([stKey, st]) => (
              <button
                key={stKey}
                onClick={() => handleSelectStunt(stKey)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${activeStunt === stKey
                  ? "bg-amber-100/90 text-amber-900 border border-amber-400 font-bold shadow-sm"
                  : "bg-stone-100/70 hover:bg-amber-50 text-stone-700 border border-transparent"
                  }`}
              >
                <span>{st.name}</span>
              </button>
            ))}
        </div>

        {/* Orbit Drag Hint */}
        <p className="text-[10px] sm:text-[11px] text-stone-600 font-medium tracking-wide flex items-center gap-1.5">
          <span>🖱️ Click & Drag to Rotate 360° • Touch to spin warrior in temple courtyard</span>
        </p>
      </div>
    </div>
  );
}
