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

export default function WarriorHero3D({ onWeaponChange, compact = false }) {
  const mountRef = useRef(null);
  const { soundEnabled, toggleSound, playWhoosh, playBell, playWoodClick } = useSound();

  // State
  const [activeWeapon, setActiveWeapon] = useState("staff"); // "staff" | "sword_shield" | "dual_sticks"
  const [activeStunt, setActiveStunt] = useState("air_tornado"); // "air_tornado" | "shield_bash" | "pole_vault" | "infinity_spin" | "dual_flurry" | "combat_stance"
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
  activeWeaponRef.current = activeWeapon;
  const activeStuntRef = useRef(activeStunt);
  activeStuntRef.current = activeStunt;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Sound throttler ref
  const lastSoundTime = useRef(0);

  // Stunt Descriptions for the HUD
  const stuntDetails = {
    air_tornado: {
      name: "Tornado 360 Jump Staff Strike",
      telugu: "గగన భ్రమణం • 360° గాల్లో ఎగిరి కర్ర విన్యాసం",
      desc: "Full mid-air horizontal 360° leap with centrifugal staff whirlwind and explosive combat landing.",
      weapon: "staff",
      icon: Zap,
    },
    shield_bash: {
      name: "Talwar Cyclone & Dhal Shield Bash",
      telugu: "కత్తి యుద్ధం & డాలు దెబ్బ • రాజపుత్ర సమర విన్యాసం",
      desc: "High-speed diagonal Talwar blade slash followed by heavy brass Dhal shield impact rush.",
      weapon: "sword_shield",
      icon: Shield,
    },
    pole_vault: {
      name: "Staff Vault & Acrobatic Sweep",
      telugu: "కర్ర లంఘనం & అడుగుల విన్యాసం • అఖాడా సాంప్రదాయం",
      desc: "High pole vault leap into airborne double kick, landing into a 360° ground sweep.",
      weapon: "staff",
      icon: Compass,
    },
    infinity_spin: {
      name: "Trinity Infinity Whirlwind (Left, Right, Top & Combined)",
      telugu: "త్రివిధ భ్రమణం • ఎడమ వరుస, కుడి వరుస, శిరస్సు వరుస & సంయుక్త చక్రం",
      desc: "One spin at left side, one spin at right side, one spin at top side, then repeated and combined into a continuous whirlwind.",
      weapon: "staff",
      icon: RotateCw,
    },
    dual_flurry: {
      name: "Jodi Karra Twin Stick Flurry",
      telugu: "జోడి కర్ర సమర విన్యాసం • ద్విముఖ దాడి",
      desc: "Continuous dual-hand windmill strikes combining simultaneous high deflect and low counter.",
      weapon: "dual_sticks",
      icon: Sword,
    },
    combat_stance: {
      name: "Simha Stance & Warrior Breathing",
      telugu: "సింహ ముద్ర • యోధ శ్వాస & అప్రమత్తత",
      desc: "Traditional grounded lion stance with focused breathing and vigilant weapon guard.",
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
      setActiveStunt("air_tornado");
    }
    playWoodClick();
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId;
    let resizeObserver;
    let handleResize;

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
      camera.position.set(0, 1.48, 5.6);
      camera.lookAt(0, 1.08, 0);
      cameraRef.current = camera;

      // 3. Renderer with ACES Tone Mapping
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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
      const arenaPlinthGeom = new THREE.CylinderGeometry(4.4, 4.6, 0.08, 48);
      const arenaPlinthMat = new THREE.MeshStandardMaterial({
        color: 0xd7cbba,
        roughness: 0.75,
        metalness: 0.08,
      });
      const arenaPlinth = new THREE.Mesh(arenaPlinthGeom, arenaPlinthMat);
      arenaPlinth.position.y = 0.04;
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
      ring1.position.y = 0.082;
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
      ring2.position.y = 0.084;
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
      lotusRing.position.y = 0.085;
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
      shockwaveRing.position.y = 0.088;
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

      // 7. ANIMATION LOOP (Using performance.now without deprecated Clock)
      let animId;
      let animTime = 0;
      let lastTime = performance.now();

      const animate = () => {
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
          if (soundEnabled && now - lastSoundTime.current > 420 / speedRef.current) {
            if (activeStuntRef.current === "shield_bash") {
              playWhoosh(1.3);
            } else if (
              activeStuntRef.current === "air_tornado" ||
              activeStuntRef.current === "pole_vault" ||
              activeStuntRef.current === "infinity_spin"
            ) {
              playWhoosh(0.95);
            }
            lastSoundTime.current = now;
          }
        }

        renderer.render(scene, camera);
      };

      animate();

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

  // BUILD REAL HUMAN WARRIOR: SHIRTLESS MUSCULAR TORSO + DHOTI STYLE PANTS
  function buildRealHumanWarrior(scene) {
    const root = new THREE.Group();
    scene.add(root);

    // --- REALISTIC HUMAN MATERIALS ---
    // Warm Athletic Indian Bronze Skin Tone (Muscular, Natural Specular)
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xc58550,
      roughness: 0.52,
      metalness: 0.04,
    });

    const skinHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xce915e,
      roughness: 0.48,
      metalness: 0.04,
    });

    // Traditional Handloom Dhoti Fabric (Ivory / Off-White Cotton)
    const dhotiMat = new THREE.MeshStandardMaterial({
      color: 0xf8f5ee,
      roughness: 0.86,
      metalness: 0.04,
    });

    // Rich Temple Gold Zari Border for Dhoti
    const dhotiGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.28,
      metalness: 0.86,
    });

    // Royal Crimson Martial Silk Sash (Kamarbandh / Uttariya)
    const crimsonSashMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.52,
      metalness: 0.15,
    });

    // Sacred White Cotton Thread (Yajnopavita / Jandhyam)
    const sacredThreadMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.45,
      metalness: 0.1,
    });

    // Temple Brass Jewelry (Vanki / Bajuband / Ear Studs)
    const brassJewelryMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.92,
    });

    // Jet Black Hair
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.82,
      metalness: 0.08,
    });

    // Polished Damascus Steel for Weapons
    const steelBladeMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.12,
    });

    // Polished Bamboo Wood
    const bambooWoodMat = new THREE.MeshStandardMaterial({
      color: 0xc98d36,
      roughness: 0.35,
      metalness: 0.12,
    });

    // Realistic Facial Feature Materials
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisPupilMat = new THREE.MeshBasicMaterial({ color: 0x1a0f08 });
    const tilakRedMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const tilakWhiteMat = new THREE.MeshBasicMaterial({ color: 0xfefefe });

    // --- 1. PELVIS & WAIST (Base at y = 0.96) ---
    const pelvis = new THREE.Group();
    pelvis.position.y = 0.96;
    root.add(pelvis);

    // Core pelvic hip block wrapped in ivory martial dhoti cloth
    const dhotiPelvis = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.19, 0.22, 16),
      dhotiMat
    );
    pelvis.add(dhotiPelvis);

    // Royal Crimson Silk Waistband (Kamarbandh)
    const kamarbandh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.085, 16),
      crimsonSashMat
    );
    kamarbandh.position.y = 0.08;
    pelvis.add(kamarbandh);

    // Gold Belt Buckle / Center Ornament
    const beltOrnament = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.075, 0.03),
      brassJewelryMat
    );
    beltOrnament.position.set(0, 0.08, 0.22);
    pelvis.add(beltOrnament);

    // Front Hanging Pleated Dhoti Drape (Pancha Madi)
    const frontDhotiDrape = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.42, 0.03),
      dhotiMat
    );
    frontDhotiDrape.position.set(0, -0.18, 0.20);
    pelvis.add(frontDhotiDrape);

    // Gold Zari Border on Front Pleats
    const frontDhotiGold = new THREE.Mesh(
      new THREE.BoxGeometry(0.125, 0.04, 0.035),
      dhotiGoldMat
    );
    frontDhotiGold.position.set(0, -0.37, 0.20);
    pelvis.add(frontDhotiGold);

    // Crimson Silk Sash Tails (Floating gracefully)
    const frontSash1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.36, 0.015),
      crimsonSashMat
    );
    frontSash1.position.set(-0.06, -0.16, 0.215);
    pelvis.add(frontSash1);

    const frontSash2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.30, 0.015),
      dhotiGoldMat
    );
    frontSash2.position.set(0.06, -0.14, 0.215);
    pelvis.add(frontSash2);

    // --- 2. SHIRTLESS MUSCULAR TORSO (Natural Bare Human Skin Anatomy) ---
    const torso = new THREE.Group();
    torso.position.y = 0.14;
    pelvis.add(torso);

    // A. Muscular Bare Ribcage & Core (Athletic V-Taper, 100% Shirtless!)
    const coreChest = new THREE.Mesh(
      new THREE.CylinderGeometry(0.27, 0.19, 0.38, 16),
      skinMat
    );
    coreChest.position.y = 0.19;
    torso.add(coreChest);

    // B. Defined Sculpted Pectoral Muscles (Pectoralis Major)
    const rPec = new THREE.Mesh(
      new THREE.BoxGeometry(0.115, 0.11, 0.05),
      skinHighlightMat
    );
    rPec.position.set(0.075, 0.25, 0.14);
    rPec.rotation.z = -0.12;
    rPec.rotation.y = 0.08;
    torso.add(rPec);

    const lPec = new THREE.Mesh(
      new THREE.BoxGeometry(0.115, 0.11, 0.05),
      skinHighlightMat
    );
    lPec.position.set(-0.075, 0.25, 0.14);
    lPec.rotation.z = 0.12;
    lPec.rotation.y = -0.08;
    torso.add(lPec);

    // Sternal cleavage groove down the center
    const sternumLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.18, 0.052),
      skinMat
    );
    sternumLine.position.set(0, 0.25, 0.138);
    torso.add(sternumLine);

    // C. Sculpted 6-Pack Rectus Abdominis (Bare Muscular Abs)
    // Upper Abs
    const rAbsUpper = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.065, 0.035), skinHighlightMat);
    rAbsUpper.position.set(0.045, 0.13, 0.15);
    torso.add(rAbsUpper);

    const lAbsUpper = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.065, 0.035), skinHighlightMat);
    lAbsUpper.position.set(-0.045, 0.13, 0.15);
    torso.add(lAbsUpper);

    // Mid Abs
    const rAbsMid = new THREE.Mesh(new THREE.BoxGeometry(0.070, 0.065, 0.032), skinHighlightMat);
    rAbsMid.position.set(0.045, 0.055, 0.145);
    torso.add(rAbsMid);

    const lAbsMid = new THREE.Mesh(new THREE.BoxGeometry(0.070, 0.065, 0.032), skinHighlightMat);
    lAbsMid.position.set(-0.045, 0.055, 0.145);
    torso.add(lAbsMid);

    // Lower Abs / V-Taper
    const rAbsLower = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.060, 0.030), skinHighlightMat);
    rAbsLower.position.set(0.040, -0.02, 0.14);
    torso.add(rAbsLower);

    const lAbsLower = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.060, 0.030), skinHighlightMat);
    lAbsLower.position.set(-0.040, -0.02, 0.14);
    torso.add(lAbsLower);

    // Navel (Belly Button Indentation)
    const navel = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), hairMat);
    navel.position.set(0, 0.015, 0.142);
    torso.add(navel);

    // D. Sacred Thread (Yajnopavita / Jandhyam) across bare chest
    const sacredThread = new THREE.Mesh(
      new THREE.TorusGeometry(0.27, 0.012, 8, 32),
      sacredThreadMat
    );
    sacredThread.rotation.x = Math.PI / 3.4;
    sacredThread.rotation.y = Math.PI / 4.8;
    sacredThread.position.set(0, 0.19, 0);
    torso.add(sacredThread);

    // Clavicles (Collarbone definition)
    const clavicles = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.30, 8),
      skinHighlightMat
    );
    clavicles.rotation.z = Math.PI / 2;
    clavicles.position.set(0, 0.35, 0.11);
    torso.add(clavicles);

    // Powerful Athletic Trapezius Muscles (Bridges neck and shoulders seamlessly)
    const rTrap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.13, 0.14, 10),
      skinMat
    );
    rTrap.position.set(0.14, 0.36, -0.02);
    rTrap.rotation.z = -0.42;
    torso.add(rTrap);

    const lTrap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.13, 0.14, 10),
      skinMat
    );
    lTrap.position.set(-0.14, 0.36, -0.02);
    lTrap.rotation.z = 0.42;
    torso.add(lTrap);

    // Upper Chest Cap (Seals top of torso into neck base with zero gaps)
    const chestCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.27, 0.10, 16),
      skinMat
    );
    chestCap.position.y = 0.36;
    torso.add(chestCap);

    // --- 3. NECK & REALISTIC HUMAN HEAD ---
    const neck = new THREE.Group();
    // Positioned at y = 0.35 so it seamlessly penetrates the chest cap with zero floating gap
    neck.position.y = 0.35;
    torso.add(neck);

    // Muscular Neck with Adam's apple
    const neckMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.082, 0.17, 16),
      skinMat
    );
    neckMesh.position.y = 0.085;
    neck.add(neckMesh);

    const adamsApple = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), skinHighlightMat);
    adamsApple.position.set(0, 0.095, 0.072);
    neck.add(adamsApple);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.14;
    neck.add(headGroup);

    // Contoured Cranium (Human oval cranium, NOT a mannequin)
    const cranium = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 24, 24),
      skinMat
    );
    cranium.scale.set(0.92, 1.12, 1.02);
    cranium.position.y = 0.10;
    headGroup.add(cranium);

    // Masculine Angular Jawline & Chin
    const jaw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.082, 0.046, 0.09, 14),
      skinMat
    );
    jaw.position.set(0, 0.042, 0.042);
    headGroup.add(jaw);

    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), skinHighlightMat);
    chin.position.set(0, 0.008, 0.085);
    headGroup.add(chin);

    // Realistic Human Nose (Bridge, Tip, Nostrils)
    const noseBridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.055, 0.03),
      skinHighlightMat
    );
    noseBridge.position.set(0, 0.105, 0.12);
    noseBridge.rotation.x = -0.15;
    headGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), skinHighlightMat);
    noseTip.position.set(0, 0.082, 0.136);
    headGroup.add(noseTip);

    // Realistic Human Eyes (Sclera + Iris/Pupil + Eyelids)
    const rEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 10), eyeWhiteMat);
    rEyeWhite.position.set(0.042, 0.118, 0.106);
    headGroup.add(rEyeWhite);
    const rPupil = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), irisPupilMat);
    rPupil.position.set(0.042, 0.118, 0.118);
    headGroup.add(rPupil);

    const lEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 10), eyeWhiteMat);
    lEyeWhite.position.set(-0.042, 0.118, 0.106);
    headGroup.add(lEyeWhite);
    const lPupil = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), irisPupilMat);
    lPupil.position.set(-0.042, 0.118, 0.118);
    headGroup.add(lPupil);

    // Natural Masculine Eyebrows
    const rBrow = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.009, 0.014), hairMat);
    rBrow.position.set(0.044, 0.136, 0.112);
    rBrow.rotation.z = -0.08;
    headGroup.add(rBrow);

    const lBrow = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.009, 0.014), hairMat);
    lBrow.position.set(-0.044, 0.136, 0.112);
    lBrow.rotation.z = 0.08;
    headGroup.add(lBrow);

    // Human Lips (Upper and Lower Lip)
    const upperLip = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.010, 0.018), skinMat);
    upperLip.position.set(0, 0.052, 0.115);
    headGroup.add(upperLip);

    const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.012, 0.016), skinHighlightMat);
    lowerLip.position.set(0, 0.038, 0.112);
    headGroup.add(lowerLip);

    // Contoured Human Ears with Traditional Gold Studs (Kundalam)
    const rEar = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), skinMat);
    rEar.scale.set(0.35, 1.25, 0.75);
    rEar.position.set(0.115, 0.10, 0);
    headGroup.add(rEar);

    const rEarStud = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 8), brassJewelryMat);
    rEarStud.position.set(0.118, 0.085, 0);
    headGroup.add(rEarStud);

    const lEar = rEar.clone();
    lEar.position.set(-0.115, 0.10, 0);
    headGroup.add(lEar);

    const lEarStud = rEarStud.clone();
    lEarStud.position.set(-0.118, 0.085, 0);
    headGroup.add(lEarStud);

    // Hair Structure (Slicked Back Indian Warrior Hair)
    const hairCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.123, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7),
      hairMat
    );
    hairCap.position.set(0, 0.11, -0.01);
    headGroup.add(hairCap);

    // Traditional Indian Warrior Topknot (Sikha / Kudumi)
    const topknot = new THREE.Mesh(new THREE.SphereGeometry(0.054, 14, 14), hairMat);
    topknot.position.set(0, 0.23, -0.05);
    headGroup.add(topknot);

    // Gold Topknot Ring (Choodamani / Kankanam)
    const topknotRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.036, 0.009, 8, 16),
      brassJewelryMat
    );
    topknotRing.position.set(0, 0.21, -0.05);
    headGroup.add(topknotRing);

    // Traditional Forehead Tilakam (Sacred White Sandalwood + Red Vermilion Dot)
    const tilakBase = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.036, 0.006), tilakWhiteMat);
    tilakBase.position.set(0, 0.155, 0.118);
    headGroup.add(tilakBase);

    const tilakDot = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), tilakRedMat);
    tilakDot.position.set(0, 0.155, 0.122);
    headGroup.add(tilakDot);

    // Thin Martial Forehead Ribbon (Tied neatly above the brow)
    const headband = new THREE.Mesh(
      new THREE.TorusGeometry(0.125, 0.012, 8, 24),
      crimsonSashMat
    );
    headband.rotation.x = Math.PI / 2;
    headband.position.y = 0.145;
    headGroup.add(headband);

    // Dual Cloth Ribbons flowing backward
    const ribbon1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.030, 0.24, 0.006),
      crimsonSashMat
    );
    ribbon1.position.set(0.03, 0.06, -0.16);
    ribbon1.rotation.x = 0.45;
    headGroup.add(ribbon1);

    const ribbon2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.030, 0.28, 0.006),
      crimsonSashMat
    );
    ribbon2.position.set(-0.03, 0.04, -0.17);
    ribbon2.rotation.x = 0.50;
    headGroup.add(ribbon2);

    // --- 4. RIGHT ARM (Muscular Bare Arm + Upper Arm Brass Vanki) ---
    const rShoulder = new THREE.Group();
    rShoulder.position.set(0.32, 0.34, 0);
    torso.add(rShoulder);

    // Deltoid muscle sphere (seamless bare shoulder)
    const rDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 14), skinMat);
    rShoulder.add(rDeltoid);

    // Traditional Gold Armlet (Bajuband / Vanki) on upper bicep
    const rVanki = new THREE.Mesh(
      new THREE.TorusGeometry(0.060, 0.010, 8, 16),
      brassJewelryMat
    );
    rVanki.rotation.x = Math.PI / 2;
    rVanki.position.y = -0.06;
    rShoulder.add(rVanki);

    // Upper Arm (Biceps / Triceps muscle)
    const rUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.056, 0.048, 0.26, 14),
      skinMat
    );
    rUpperArm.position.y = -0.13;
    rShoulder.add(rUpperArm);

    // Right Elbow Joint
    const rElbow = new THREE.Group();
    rElbow.position.y = -0.26;
    rShoulder.add(rElbow);

    const rElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.046, 12, 12), skinMat);
    rElbow.add(rElbowJoint);

    // Forearm (Muscular taper into wrist)
    const rForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.046, 0.038, 0.24, 14),
      skinMat
    );
    rForearm.position.y = -0.12;
    rElbow.add(rForearm);

    // Thin Brass Wrist Band (Kappu / Kankanam)
    const rWristBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.040, 0.05, 14),
      brassJewelryMat
    );
    rWristBand.position.y = -0.20;
    rElbow.add(rWristBand);

    // Right Wrist & Hand
    const rWrist = new THREE.Group();
    rWrist.position.y = -0.24;
    rElbow.add(rWrist);

    const rWristBall = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 10), skinMat);
    rWrist.add(rWristBall);

    const rHand = new THREE.Group();
    rHand.position.y = -0.04;
    rWrist.add(rHand);

    // Natural 5-Finger Human Hand Grip
    const rPalm = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.072, 0.034), skinMat);
    rPalm.position.set(0, -0.02, 0);
    rHand.add(rPalm);

    const rThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.044, 8), skinMat);
    rThumb.position.set(-0.030, 0, 0.02);
    rThumb.rotation.z = 0.5;
    rHand.add(rThumb);

    const rFingers = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.038, 0.028), skinMat);
    rFingers.position.set(0, -0.05, 0.014);
    rHand.add(rFingers);

    // --- 5. LEFT ARM (Bare Skin + Brass Wristlet) ---
    const lShoulder = new THREE.Group();
    lShoulder.position.set(-0.32, 0.34, 0);
    torso.add(lShoulder);

    const lDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 14), skinMat);
    lShoulder.add(lDeltoid);

    const lUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.056, 0.048, 0.26, 14),
      skinMat
    );
    lUpperArm.position.y = -0.13;
    lShoulder.add(lUpperArm);

    const lElbow = new THREE.Group();
    lElbow.position.y = -0.26;
    lShoulder.add(lElbow);

    const lElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.046, 12, 12), skinMat);
    lElbow.add(lElbowJoint);

    const lForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.046, 0.038, 0.24, 14),
      skinMat
    );
    lForearm.position.y = -0.12;
    lElbow.add(lForearm);

    const lWristBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.040, 0.05, 14),
      brassJewelryMat
    );
    lWristBand.position.y = -0.20;
    lElbow.add(lWristBand);

    const lWrist = new THREE.Group();
    lWrist.position.y = -0.24;
    lElbow.add(lWrist);

    const lWristBall = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 10), skinMat);
    lWrist.add(lWristBall);

    const lHand = new THREE.Group();
    lHand.position.y = -0.04;
    lWrist.add(lHand);

    const lPalm = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.072, 0.034), skinMat);
    lPalm.position.set(0, -0.02, 0);
    lHand.add(lPalm);

    const lThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.044, 8), skinMat);
    lThumb.position.set(0.030, 0, 0.02);
    lThumb.rotation.z = -0.5;
    lHand.add(lThumb);

    const lFingers = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.038, 0.028), skinMat);
    lFingers.position.set(0, -0.05, 0.014);
    lHand.add(lFingers);

    // --- 6. LEGS & FEET: AUTHENTIC DHOTI STYLE PANTS (Vira Kachha / Pancha Kattu) ---
    // Total leg height = 0.96m. Feet sit flat on the temple floor at y = 0.
    // The thighs wear the pleated ivory dhoti wraps; knees and lower calves transition to bare legs with ankle rings.

    // RIGHT LEG
    const rHipJoint = new THREE.Group();
    rHipJoint.position.set(0.15, -0.08, 0);
    pelvis.add(rHipJoint);

    // Dhoti thigh wrap (Volumetric folded cloth pleats)
    const rHipBall = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), dhotiMat);
    rHipJoint.add(rHipBall);

    const rThigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.088, 0.070, 0.40, 14),
      dhotiMat
    );
    rThigh.position.y = -0.20;
    rHipJoint.add(rThigh);

    // Gold Zari Border at Knee Tuck of Dhoti
    const rDhotiTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.072, 0.012, 8, 16),
      dhotiGoldMat
    );
    rDhotiTrim.rotation.x = Math.PI / 2;
    rDhotiTrim.position.y = -0.38;
    rHipJoint.add(rDhotiTrim);

    // Right Knee Joint (Natural bare skin)
    const rKnee = new THREE.Group();
    rKnee.position.y = -0.40;
    rHipJoint.add(rKnee);

    const rKneeBall = new THREE.Mesh(new THREE.SphereGeometry(0.064, 12, 12), skinMat);
    rKnee.add(rKneeBall);

    // Bare Muscular Shin & Calf
    const rShin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.064, 0.046, 0.40, 14),
      skinMat
    );
    rShin.position.y = -0.20;
    rKnee.add(rShin);

    // Right Ankle Joint & Martial Brass Ankle Ring
    const rAnkle = new THREE.Group();
    rAnkle.position.y = -0.40;
    rKnee.add(rAnkle);

    const rAnkleBall = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), skinMat);
    rAnkle.add(rAnkleBall);

    const rAnkleRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.048, 0.008, 8, 16),
      brassJewelryMat
    );
    rAnkleRing.rotation.x = Math.PI / 2;
    rAnkleRing.position.y = -0.01;
    rAnkle.add(rAnkleRing);

    // Right Foot (Flat, grounded bare foot with toes on temple floor)
    const rFoot = new THREE.Group();
    rFoot.position.set(0, -0.04, 0.06);
    rAnkle.add(rFoot);

    const rFootBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.095, 0.052, 0.22),
      skinMat
    );
    rFoot.add(rFootBase);

    // Toes definition
    const rToes = new THREE.Mesh(new THREE.BoxGeometry(0.090, 0.040, 0.05), skinHighlightMat);
    rToes.position.set(0, -0.006, 0.12);
    rFoot.add(rToes);

    // LEFT LEG
    const lHipJoint = new THREE.Group();
    lHipJoint.position.set(-0.15, -0.08, 0);
    pelvis.add(lHipJoint);

    const lHipBall = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), dhotiMat);
    lHipJoint.add(lHipBall);

    const lThigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.088, 0.070, 0.40, 14),
      dhotiMat
    );
    lThigh.position.y = -0.20;
    lHipJoint.add(lThigh);

    const lDhotiTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.072, 0.012, 8, 16),
      dhotiGoldMat
    );
    lDhotiTrim.rotation.x = Math.PI / 2;
    lDhotiTrim.position.y = -0.38;
    lHipJoint.add(lDhotiTrim);

    const lKnee = new THREE.Group();
    lKnee.position.y = -0.40;
    lHipJoint.add(lKnee);

    const lKneeBall = new THREE.Mesh(new THREE.SphereGeometry(0.064, 12, 12), skinMat);
    lKnee.add(lKneeBall);

    const lShin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.064, 0.046, 0.40, 14),
      skinMat
    );
    lShin.position.y = -0.20;
    lKnee.add(lShin);

    const lAnkle = new THREE.Group();
    lAnkle.position.y = -0.40;
    lKnee.add(lAnkle);

    const lAnkleBall = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), skinMat);
    lAnkle.add(lAnkleBall);

    const lAnkleRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.048, 0.008, 8, 16),
      brassJewelryMat
    );
    lAnkleRing.rotation.x = Math.PI / 2;
    lAnkleRing.position.y = -0.01;
    lAnkle.add(lAnkleRing);

    const lFoot = new THREE.Group();
    lFoot.position.set(0, -0.04, 0.06);
    lAnkle.add(lFoot);

    const lFootBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.095, 0.052, 0.22),
      skinMat
    );
    lFoot.add(lFootBase);

    const lToes = new THREE.Mesh(new THREE.BoxGeometry(0.090, 0.040, 0.05), skinHighlightMat);
    lToes.position.set(0, -0.006, 0.12);
    lFoot.add(lToes);

    // Natural Grounded Stance (Simha-Ashwa Stance)
    rHipJoint.rotation.z = -0.16;
    rHipJoint.rotation.x = 0.12;
    rKnee.rotation.x = -0.24;
    rAnkle.rotation.x = 0.12;
    rAnkle.rotation.z = 0.16;

    lHipJoint.rotation.z = 0.16;
    lHipJoint.rotation.x = -0.12;
    lKnee.rotation.x = -0.24;
    lAnkle.rotation.x = 0.12;
    lAnkle.rotation.z = -0.16;

    // --- 7. AUTHENTIC WEAPONS RIGGED IN HANDS ---

    // === WEAPON A: KARRASAMU BAMBOO STAFF (Karra) ===
    const staffGroup = new THREE.Group();
    rHand.add(staffGroup);
    staffGroup.position.set(0, -0.04, 0);

    const staffMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 3.2, 18),
      bambooWoodMat
    );
    staffGroup.add(staffMesh);

    // Brass End Caps
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.16, 14), brassJewelryMat);
    topCap.position.y = 1.6;
    staffMesh.add(topCap);

    const botCap = topCap.clone();
    botCap.position.y = -1.6;
    botCap.rotation.x = Math.PI;
    staffMesh.add(botCap);

    // Central Crimson Grip Wrap
    const gripWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.32, 16), crimsonSashMat);
    staffMesh.add(gripWrap);

    // === WEAPON B: ROYAL TALWAR (Curved Sword / కత్తి) ===
    const swordGroup = new THREE.Group();
    rHand.add(swordGroup);
    swordGroup.position.set(0, -0.04, 0);

    // Gracefully curved 78cm Damascus steel blade (True historical proportions)
    const bladeCurve = new THREE.Shape();
    bladeCurve.moveTo(0, 0);
    bladeCurve.lineTo(0.038, 0);
    bladeCurve.quadraticCurveTo(0.045, 0.42, 0.082, 0.74);
    bladeCurve.lineTo(0.005, 0.80);
    bladeCurve.quadraticCurveTo(0.015, 0.42, 0, 0);

    const bladeGeom = new THREE.ExtrudeGeometry(bladeCurve, {
      depth: 0.008,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.003,
    });
    const bladeMesh = new THREE.Mesh(bladeGeom, steelBladeMat);
    bladeMesh.position.set(-0.02, 0.05, 0);
    swordGroup.add(bladeMesh);

    // Traditional Rajput / Vijayanagara Quillon Crossguard
    const swordGuard = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.048, 0.015, 16),
      brassJewelryMat
    );
    swordGuard.position.y = 0.05;
    swordGroup.add(swordGuard);

    // Crimson Velvet Mutthi Grip
    const swordHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.12, 12),
      crimsonSashMat
    );
    swordHandle.position.y = -0.01;
    swordGroup.add(swordHandle);

    // Traditional Disc Pommel (Katori) & Turrah Spike
    const pommel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.038, 0.018, 16),
      brassJewelryMat
    );
    pommel.position.y = -0.075;
    swordGroup.add(pommel);

    const pommelSpike = new THREE.Mesh(
      new THREE.ConeGeometry(0.012, 0.032, 8),
      brassJewelryMat
    );
    pommelSpike.position.y = -0.092;
    pommelSpike.rotation.x = Math.PI;
    swordGroup.add(pommelSpike);

    // === WEAPON C: BRAND NEW AUTHENTIC DHAL (Shield / డాలు) ===
    const dhalGroup = new THREE.Group();
    lForearm.add(dhalGroup);
    // Mounted on outer forearm facing forward in defensive combat guard
    dhalGroup.position.set(-0.06, -0.10, 0.04);
    dhalGroup.rotation.y = -Math.PI / 2.2;

    // 1. Heavy Watered Steel / Damascened Bronze Shield Plate (Convex Circular Disc, 44cm diameter)
    const shieldDiscMat = new THREE.MeshStandardMaterial({
      color: 0x221c17,
      roughness: 0.38,
      metalness: 0.88,
    });
    const shieldPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.225, 0.018, 36),
      shieldDiscMat
    );
    shieldPlate.rotation.x = Math.PI / 2;
    dhalGroup.add(shieldPlate);

    // 2. Heavy Polished Brass Outer Rim (Concentric)
    const shieldRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.224, 0.011, 12, 48),
      brassJewelryMat
    );
    shieldRim.position.z = 0.009;
    dhalGroup.add(shieldRim);

    // 3. Inner Decorative Gold Ring (Concentric)
    const innerGoldRing = new THREE.Mesh(
      new THREE.RingGeometry(0.13, 0.145, 36),
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.92,
        roughness: 0.25,
        side: THREE.DoubleSide,
      })
    );
    innerGoldRing.position.z = 0.011;
    dhalGroup.add(innerGoldRing);

    // 4. The 4 Symmetrical Royal Brass Dome Bosses (Pappu / Kuppelu)
    const bossRadius = 0.085;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const bx = Math.cos(angle) * bossRadius;
      const by = Math.sin(angle) * bossRadius;

      // Rosette Star Washer
      const washer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, 0.006, 12),
        dhotiGoldMat
      );
      washer.rotation.x = Math.PI / 2;
      washer.position.set(bx, by, 0.013);
      dhalGroup.add(washer);

      // Polished Brass Dome Rivet
      const domeRivet = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        brassJewelryMat
      );
      domeRivet.rotation.x = Math.PI / 2;
      domeRivet.position.set(bx, by, 0.016);
      dhalGroup.add(domeRivet);
    }

    // 5. Center Royal Sunburst Medallion & Conical Spike Boss
    const centerMedallion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.008, 20),
      dhotiGoldMat
    );
    centerMedallion.rotation.x = Math.PI / 2;
    centerMedallion.position.z = 0.013;
    dhalGroup.add(centerMedallion);

    const centerSpike = new THREE.Mesh(
      new THREE.ConeGeometry(0.022, 0.045, 16),
      brassJewelryMat
    );
    centerSpike.rotation.x = Math.PI / 2;
    centerSpike.position.z = 0.036;
    dhalGroup.add(centerSpike);

    // 6. Back Cushion Pad & Leather Arm Strap
    const backPad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.008, 16),
      crimsonSashMat
    );
    backPad.rotation.x = Math.PI / 2;
    backPad.position.z = -0.012;
    dhalGroup.add(backPad);

    // === WEAPON D: AUTHENTIC JODI KARRA (Twin Rattan / Bamboo Sticks in Both Hands) ===
    // 1. Right Stick in Right Hand
    const rightStick = new THREE.Group();
    rHand.add(rightStick);
    rightStick.position.set(0, -0.04, 0);

    const rStickMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.030, 0.030, 1.70, 16),
      bambooWoodMat
    );
    rightStick.add(rStickMesh);

    const rStickCapTop = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.032, 0.12, 12), brassJewelryMat);
    rStickCapTop.position.y = 0.85;
    rStickMesh.add(rStickCapTop);
    const rStickCapBot = rStickCapTop.clone();
    rStickCapBot.position.y = -0.85;
    rStickCapBot.rotation.x = Math.PI;
    rStickMesh.add(rStickCapBot);
    const rStickGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.033, 0.24, 14), crimsonSashMat);
    rStickMesh.add(rStickGrip);

    // 2. Left Stick in Left Hand (Matched Twin)
    const leftStick = new THREE.Group();
    lHand.add(leftStick);
    leftStick.position.set(0, -0.04, 0);

    const lStickMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.030, 0.030, 1.70, 16),
      bambooWoodMat
    );
    leftStick.add(lStickMesh);

    const lStickCapTop = rStickCapTop.clone();
    lStickMesh.add(lStickCapTop);
    const lStickCapBot = rStickCapBot.clone();
    lStickMesh.add(lStickCapBot);
    const lStickGrip = rStickGrip.clone();
    lStickMesh.add(lStickGrip);

    // Weapon Visibility Controller (Guarantees BOTH sticks visible for Jodi Karra)
    const setWeapon = (type) => {
      if (type === "staff") {
        staffGroup.visible = true;
        swordGroup.visible = false;
        dhalGroup.visible = false;
        rightStick.visible = false;
        leftStick.visible = false;
      } else if (type === "sword_shield") {
        staffGroup.visible = false;
        swordGroup.visible = true;
        dhalGroup.visible = true;
        rightStick.visible = false;
        leftStick.visible = false;
      } else if (type === "dual_sticks") {
        staffGroup.visible = false;
        swordGroup.visible = false;
        dhalGroup.visible = false;
        rightStick.visible = true;
        leftStick.visible = true;
      }
    };

    return {
      root,
      pelvis,
      torso,
      neck,
      headGroup,
      rShoulder,
      rElbow,
      rWrist,
      rHand,
      lShoulder,
      lElbow,
      lWrist,
      lHand,
      rHipJoint,
      rKnee,
      rAnkle,
      lHipJoint,
      lKnee,
      lAnkle,
      frontSash1,
      frontSash2,
      ribbon1,
      ribbon2,
      staffMesh,
      staffGroup,
      swordGroup,
      dhalGroup,
      rightStick,
      leftStick,
      rStickMesh,
      lStickMesh,
      setWeapon,
    };
  }

  // REALISTIC HUMAN BIOMECHANICS & CHOREOGRAPHED MARTIAL STUNTS
  function updateHumanStunts(w, t, stunt, shockwave) {
    if (stunt === "air_tornado") {
      // 1. TORNADO 360 JUMP STAFF STRIKE
      const cycleDuration = 2.8;
      const progress = (t % cycleDuration) / cycleDuration;

      if (progress < 0.24) {
        // Phase 1: Deep Athletic Crouch Gather
        const p = progress / 0.24;
        w.root.position.y = -p * 0.32;
        w.pelvis.position.y = 0.96 - p * 0.20;
        w.root.rotation.y = -p * 0.35;

        w.rHipJoint.rotation.x = 0.45 * p;
        w.rKnee.rotation.x = -0.75 * p;
        w.rAnkle.rotation.x = 0.30 * p;

        w.lHipJoint.rotation.x = 0.45 * p;
        w.lKnee.rotation.x = -0.75 * p;
        w.lAnkle.rotation.x = 0.30 * p;

        w.rShoulder.rotation.x = -0.4;
        w.rShoulder.rotation.z = 0.5;
        w.rElbow.rotation.x = -1.1;
        w.staffMesh.rotation.y = 0;
      } else if (progress < 0.68) {
        // Phase 2: Explosive Airborne 360 Spin Leap
        const p = (progress - 0.24) / 0.44;
        const jumpHeight = Math.sin(p * Math.PI) * 1.55;
        w.root.position.y = jumpHeight;
        w.root.rotation.y = -0.35 + p * Math.PI * 2.2;

        w.rHipJoint.rotation.x = -0.6 * (1 - p);
        w.rKnee.rotation.x = -0.85 * (1 - p);
        w.lHipJoint.rotation.x = 0.4 * (1 - p);
        w.lKnee.rotation.x = -0.3 * (1 - p);

        w.rShoulder.rotation.x = Math.sin(p * Math.PI * 4) * 0.8;
        w.rShoulder.rotation.z = 0.7 + Math.cos(p * Math.PI * 4) * 0.4;
        w.rElbow.rotation.x = -0.5;

        // Staff spins rapidly inside hand grip!
        w.staffMesh.rotation.y += 0.35;
        w.staffMesh.rotation.x = Math.PI / 2.8;

        w.frontSash1.rotation.x = Math.sin(p * 12) * 0.45;
        w.ribbon1.rotation.x = 0.75 + Math.sin(p * 14) * 0.35;
      } else {
        // Phase 3: Martial Combat Landing & Weapon Sweep
        const p = (progress - 0.68) / 0.32;
        w.root.position.y = Math.sin((1 - p) * Math.PI * 0.5) * -0.15;
        w.root.rotation.y = Math.PI * 2.2 * (1 - p * 0.1);

        w.rHipJoint.rotation.x = 0.12;
        w.rKnee.rotation.x = -0.24;
        w.lHipJoint.rotation.x = -0.12;
        w.lKnee.rotation.x = -0.24;

        w.rShoulder.rotation.set(-0.2, 0.4, 0.3);
        w.rElbow.rotation.x = -0.6;
        w.staffMesh.rotation.x = Math.PI / 4;

        if (shockwave && p < 0.6) {
          shockwave.scale.set(1 + p * 6, 1 + p * 6, 1);
          shockwave.material.opacity = (1 - p / 0.6) * 0.8;
        } else if (shockwave) {
          shockwave.material.opacity = 0;
        }
      }
    } else if (stunt === "shield_bash") {
      // 2. TALWAR CYCLONE & DHAL SHIELD BASH
      const cycleDuration = 2.4;
      const progress = (t % cycleDuration) / cycleDuration;

      if (progress < 0.45) {
        // Phase 1: High-Speed Diagonal Talwar Blade Slash
        const p = progress / 0.45;
        w.root.rotation.y = Math.sin(p * Math.PI) * 0.65;
        w.root.position.z = p * 0.25;

        w.rShoulder.rotation.x = -1.2 + p * 2.4;
        w.rShoulder.rotation.y = -0.4 + p * 0.8;
        w.rShoulder.rotation.z = 0.6;
        w.rElbow.rotation.x = -0.35;

        w.lShoulder.rotation.x = 0.3;
        w.lShoulder.rotation.z = -0.5;
        w.lElbow.rotation.x = -0.9;

        w.torso.rotation.y = -0.3 + p * 0.6;
        w.headGroup.rotation.y = 0.2;
      } else if (progress < 0.80) {
        // Phase 2: Explosive Forward Dhal Shield Impact
        const p = (progress - 0.45) / 0.35;
        w.root.position.z = 0.25 + Math.sin(p * Math.PI) * 0.45;

        w.lShoulder.rotation.x = -0.1;
        w.lShoulder.rotation.y = 0.5;
        w.lShoulder.rotation.z = -0.85;
        w.lElbow.rotation.x = -0.3;

        w.rShoulder.rotation.x = 0.4;
        w.rShoulder.rotation.y = -0.6;
        w.rElbow.rotation.x = -1.3;

        w.torso.rotation.y = 0.35 - p * 0.7;
        w.headGroup.rotation.y = -0.2;

        if (shockwave && p > 0.1 && p < 0.7) {
          const sp = (p - 0.1) / 0.6;
          shockwave.position.z = 0.6;
          shockwave.scale.set(1 + sp * 4.5, 1 + sp * 4.5, 1);
          shockwave.material.opacity = (1 - sp) * 0.9;
        }
      } else {
        // Phase 3: Defensive Recovery Stance
        const p = (progress - 0.80) / 0.20;
        w.root.position.z = (1 - p) * 0.25;
        w.root.rotation.y = 0;
        w.torso.rotation.y = 0;
        w.headGroup.rotation.y = 0;
        if (shockwave) shockwave.material.opacity = 0;
      }
    } else if (stunt === "pole_vault") {
      // 3. STAFF VAULT & ACROBATIC SWEEP
      const cycleDuration = 3.0;
      const progress = (t % cycleDuration) / cycleDuration;

      if (progress < 0.30) {
        // Vault plant & load
        const p = progress / 0.30;
        w.root.position.y = p * 0.4;
        w.rShoulder.rotation.set(-1.4, 0.2, 0.3);
        w.lShoulder.rotation.set(-1.1, -0.2, -0.4);
        w.staffMesh.rotation.x = p * 0.5;
      } else if (progress < 0.70) {
        // Airborne kick extension
        const p = (progress - 0.30) / 0.40;
        const vaultArc = Math.sin(p * Math.PI) * 1.85;
        w.root.position.y = 0.4 + vaultArc;
        w.root.rotation.x = Math.sin(p * Math.PI) * 0.45;

        // Double kick extension
        w.rHipJoint.rotation.x = -0.9;
        w.rKnee.rotation.x = -0.1;
        w.lHipJoint.rotation.x = -0.7;
        w.lKnee.rotation.x = -0.2;

        w.frontSash1.rotation.x = -0.8;
      } else {
        // Ground sweep recovery
        const p = (progress - 0.70) / 0.30;
        w.root.position.y = (1 - p) * 0.4;
        w.root.rotation.x = 0;
        w.rHipJoint.rotation.x = 0.12;
        w.lHipJoint.rotation.x = -0.12;
      }
    } else if (stunt === "infinity_spin") {
      // 4. AUTHENTIC THREE-ZONE KARRASAMU INFINITY ROTATION:
      // Phase 1: One high-speed spin at Left side
      // Phase 2: One high-speed spin at Right side
      // Phase 3: One high-speed spin at Top side (Overhead horizontal)
      // Phase 4: Combine all 3 in an unbroken centrifugal whirlwind, then repeat!
      const cycleDuration = 6.4;
      const progress = (t % cycleDuration) / cycleDuration;

      if (progress < 0.22) {
        // === STEP 1: ONE SPIN AT LEFT SIDE (Edama Varasu) ===
        const p = progress / 0.22;
        w.torso.rotation.y = -0.38 * Math.sin(p * Math.PI);
        w.headGroup.rotation.y = -0.18;
        w.headGroup.rotation.x = 0;

        // Right arm extends across chest to the left flank
        w.rShoulder.rotation.set(-0.35, -0.72, 0.52);
        w.rElbow.rotation.x = -0.92;
        w.rWrist.rotation.z = Math.sin(p * Math.PI * 4) * 0.35;

        // Staff spins in vertical circle on the LEFT side of warrior
        w.staffMesh.rotation.x = p * Math.PI * 8; // Rapid 360° vertical rotations on left
        w.staffMesh.rotation.y = 0.15;
        w.staffMesh.rotation.z = 0.22;

        // Martial left hand guard held steady at heart level
        w.lShoulder.rotation.set(0.32, 0.42, -0.62);
        w.lElbow.rotation.x = -1.15;

        w.frontSash1.rotation.z = Math.sin(p * Math.PI * 4) * 0.25;
      } else if (progress < 0.44) {
        // === STEP 2: ONE SPIN AT RIGHT SIDE (Kudi Varasu) ===
        const p = (progress - 0.22) / 0.22;
        w.torso.rotation.y = 0.38 * Math.sin(p * Math.PI);
        w.headGroup.rotation.y = 0.18;
        w.headGroup.rotation.x = 0;

        // Right arm opens wide to the right flank
        w.rShoulder.rotation.set(-0.25, 0.62, 0.72);
        w.rElbow.rotation.x = -0.68;
        w.rWrist.rotation.z = Math.sin(p * Math.PI * 4) * 0.35;

        // Staff spins in vertical circle on the RIGHT side of warrior
        w.staffMesh.rotation.x = p * Math.PI * 8; // Rapid 360° vertical rotations on right
        w.staffMesh.rotation.y = -0.15;
        w.staffMesh.rotation.z = -0.22;

        // Left hand guards torso core
        w.lShoulder.rotation.set(0.22, -0.28, -0.58);
        w.lElbow.rotation.x = -0.92;

        w.frontSash1.rotation.z = -Math.sin(p * Math.PI * 4) * 0.25;
      } else if (progress < 0.66) {
        // === STEP 3: ONE SPIN AT TOP SIDE (Sirasu / Gagana Varasu - Overhead Horizontal Spin) ===
        const p = (progress - 0.44) / 0.22;
        w.torso.rotation.y = 0;
        w.headGroup.rotation.y = 0;
        w.headGroup.rotation.x = -0.22; // Looks upward at overhead staff

        // Both arms raised high above head in arched overhead guard
        w.rShoulder.rotation.set(-1.62, 0.14, 0.35);
        w.rElbow.rotation.x = -0.22;
        w.lShoulder.rotation.set(-1.48, -0.18, -0.38);
        w.lElbow.rotation.x = -0.25;

        // Staff lies flat horizontally and spins like a helicopter shield directly overhead
        w.staffMesh.rotation.x = Math.PI / 2; // Flat horizontal plane
        w.staffMesh.rotation.y = p * Math.PI * 8; // High speed overhead whirlwind
        w.staffMesh.rotation.z = 0;

        w.frontSash1.rotation.x = -0.15;
      } else {
        // === STEP 4: COMBINED TRINITY WHIRLWIND (Left -> Top -> Right -> Repeat!) ===
        const p = (progress - 0.66) / 0.34;
        const subPhase = Math.floor(p * 3);

        w.headGroup.rotation.x = -0.05;
        w.root.rotation.y = Math.sin(t * 2.2) * 0.22;
        w.torso.rotation.y = Math.sin(t * 4.4) * 0.36;

        if (subPhase === 0) {
          // Sweeping Left
          w.rShoulder.rotation.set(-0.35, -0.62, 0.58);
          w.staffMesh.rotation.x += 0.42;
          w.staffMesh.rotation.z = 0.28;
        } else if (subPhase === 1) {
          // Arc up into Overhead Top
          w.rShoulder.rotation.set(-1.55, 0.08, 0.38);
          w.staffMesh.rotation.x = Math.PI / 2;
          w.staffMesh.rotation.y += 0.46;
          w.staffMesh.rotation.z = 0;
        } else {
          // Slashes down into Right
          w.rShoulder.rotation.set(-0.25, 0.62, 0.68);
          w.staffMesh.rotation.x += 0.42;
          w.staffMesh.rotation.z = -0.28;
        }

        w.frontSash1.rotation.z = Math.sin(t * 6.0) * 0.3;
        w.ribbon1.rotation.y = Math.cos(t * 5.0) * 0.3;
      }
    } else if (stunt === "dual_flurry") {
      // 5. JODI KARRA TWIN STICK FLURRY (Both sticks spin simultaneously!)
      const flap = t * 7.5;
      w.root.rotation.y = Math.sin(t * 2.2) * 0.35;
      w.torso.rotation.y = Math.cos(t * 4.4) * 0.4;

      // Right stick windmill
      w.rShoulder.rotation.x = Math.sin(flap) * 0.85;
      w.rShoulder.rotation.z = Math.cos(flap) * 0.45 + 0.5;
      w.rElbow.rotation.x = -0.65;
      if (w.rStickMesh) {
        w.rStickMesh.rotation.x += 0.38;
      }

      // Left stick counter-windmill
      w.lShoulder.rotation.x = Math.sin(flap + Math.PI) * 0.85;
      w.lShoulder.rotation.z = -(Math.cos(flap + Math.PI) * 0.45 + 0.5);
      w.lElbow.rotation.x = -0.65;
      if (w.lStickMesh) {
        w.lStickMesh.rotation.x += 0.38;
      }
    } else if (stunt === "combat_stance") {
      // 6. SIMHA STANCE & WARRIOR BREATHING
      const breath = Math.sin(t * 1.8) * 0.045;
      w.root.position.y = breath;
      w.torso.position.y = 0.14 + breath * 0.5;
      w.neck.position.y = 0.42 + breath * 0.2;

      w.rShoulder.rotation.set(-0.35, 0.2, 0.45);
      w.rElbow.rotation.x = -0.85;

      w.lShoulder.rotation.set(-0.25, -0.3, -0.55);
      w.lElbow.rotation.x = -1.0;

      w.staffMesh.rotation.x = Math.PI / 3.2;
      w.staffMesh.rotation.y = 0;
    }
  }

  // Camera preset controls
  const setCameraPreset = (mode) => {
    setCameraView(mode);
    const cam = cameraRef.current;
    if (!cam) return;

    if (mode === "action") {
      cam.position.set(0, 1.48, 5.6);
      cam.lookAt(0, 1.08, 0);
    } else if (mode === "cinematic") {
      cam.position.set(3.8, 1.9, 4.2);
      cam.lookAt(0, 1.15, 0);
    } else if (mode === "overhead") {
      cam.position.set(0, 5.4, 2.8);
      cam.lookAt(0, 0.6, 0);
    } else if (mode === "close") {
      cam.position.set(0.6, 1.48, 3.2);
      cam.lookAt(0, 1.25, 0);
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
          <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-ping" />
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
      <div className="relative z-10 w-full p-4 sm:p-6 pointer-events-none flex flex-col items-center gap-3">
        {/* Row 1: Interactive Weapon Selector Pills */}
        <div className="pointer-events-auto bg-white/92 backdrop-blur-xl border border-amber-200/80 rounded-2xl p-1.5 shadow-xl flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 px-3 hidden sm:inline-block">
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-2 ${activeWeapon === w.id
                  ? "bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white shadow-md shadow-[#DC2626]/30 scale-105"
                  : "bg-stone-100/80 hover:bg-stone-200/70 text-stone-700"
                }`}
            >
              <span>{w.label}</span>
            </button>
          ))}
        </div>

        {/* Row 2: Martial Stunt Action Buttons */}
        {/* <div className="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-amber-300/80 rounded-2xl p-2 sm:p-2.5 shadow-xl flex flex-wrap items-center justify-center gap-2 max-w-4xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 px-2 flex items-center gap-1 hidden md:flex font-serif">
            <Flame className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Stunts:</span>
          </span>

          {[
            { id: "air_tornado", label: "🌪️ 360 Tornado Leap", desc: "Mid-air staff whirlwind" },
            { id: "shield_bash", label: "🛡️ Shield Bash Rush", desc: "Talwar slash & Dhal ram" },
            { id: "pole_vault", label: "⚡ Staff Vault & Sweep", desc: "Acrobatic jump & floor sweep" },
            { id: "infinity_spin", label: "♾️ Infinity Figure-8", desc: "Centrifugal staff roll" },
            { id: "dual_flurry", label: "⚔️ Twin Stick Flurry", desc: "Dual windmill attack" },
            { id: "combat_stance", label: "🧘 Simha Stance", desc: "Focused warrior breathing" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => handleSelectStunt(st.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeStunt === st.id
                  ? "bg-amber-100/90 text-amber-900 border border-amber-400 font-bold shadow-sm"
                  : "bg-stone-100/80 hover:bg-amber-50 text-stone-700 border border-transparent"
              }`}
            >
              <span>{st.label}</span>
            </button>
          ))}

          {/* Speed & Play/Pause */}
        {/* <div className="flex items-center gap-2 border-l border-stone-200 pl-2 ml-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Stunt" : "Play Stunt"}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-700" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            </button>

            <button
              onClick={() => {
                const nextSpeed = speed >= 1.6 ? 0.7 : speed + 0.3;
                setSpeed(parseFloat(nextSpeed.toFixed(1)));
                playWoodClick();
              }}
              title="Toggle Speed"
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[11px] font-bold text-amber-800"
            >
              {speed}x
            </button>

            {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? "Martial Sound Enabled" : "Enable Sound"}
          className={`p-2 rounded-xl border transition-all ${soundEnabled
              ? "bg-[#DC2626]/10 border-[#DC2626] text-[#DC2626]"
              : "bg-stone-100 border-stone-200 text-stone-500 hover:text-stone-800"
            }`}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
        {/* </div> */}
        {/* </div> */}

        {/* Orbit Drag Hint */}
        <p className="text-[11px] text-stone-600 font-medium tracking-wide flex items-center gap-1.5">
          <span>🖱️ Click & Drag to Rotate 360° • Touch to spin warrior in temple courtyard</span>
        </p>
      </div>
    </div>
  );
}
