"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play, Pause, FastForward, Compass, Zap, Volume2, VolumeX, Shield, Wind, Sparkles } from "lucide-react";
import { useSound } from "@/components/layout/SoundContext";

export default function MartialSpinDojo3D() {
  const mountRef = useRef(null);
  const { soundEnabled, toggleSound, playWhoosh, playWoodClick } = useSound();

  const [activeTechnique, setActiveTechnique] = useState("infinity"); // "infinity" | "helicopter" | "thrust"
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.2);
  const [cameraAngle, setCameraAngle] = useState("front"); // "front" | "side" | "top"

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const staffRef = useRef(null);
  const trailPointsRef = useRef([]);
  const trailLineRef = useRef(null);
  const whooshTimerRef = useRef(0);

  const speedRef = useRef(speed);
  speedRef.current = speed;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const activeTechniqueRef = useRef(activeTechnique);
  activeTechniqueRef.current = activeTechnique;

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const width = currentMount.clientWidth || 600;
    const height = currentMount.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.5));
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Dramatic Martial Lighting & Arena Glow
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 2.8, 20);
    goldLight.position.set(2, 4, 4);
    scene.add(goldLight);

    const crimsonFloorLight = new THREE.PointLight(0xe63946, 2.5, 15);
    crimsonFloorLight.position.set(-3, -3, 2);
    scene.add(crimsonFloorLight);

    // 5. Traditional Circular Obsidian Arena Base / Energy Rings
    const ringGeom = new THREE.RingGeometry(3.5, 3.58, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -2.5;
    scene.add(ringMesh);

    // Inner concentric mandala circle
    const innerRingGeom = new THREE.RingGeometry(1.8, 1.85, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xe63946, side: THREE.DoubleSide, transparent: true, opacity: 0.55 });
    const innerRing = new THREE.Mesh(innerRingGeom, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = -2.5;
    scene.add(innerRing);

    // 6. Martial Practitioner Center Pivot Stance Indicator (Subtle golden core)
    const pivotGeom = new THREE.CylinderGeometry(0.08, 0.12, 1.6, 16);
    const pivotMat = new THREE.MeshStandardMaterial({ color: 0xc4a46a, metalness: 0.8, roughness: 0.3, transparent: true, opacity: 0.6 });
    const pivot = new THREE.Mesh(pivotGeom, pivotMat);
    pivot.position.y = -1.7;
    scene.add(pivot);

    // 7. Spinning Staff Object
    const staffGroup = new THREE.Group();
    scene.add(staffGroup);
    staffRef.current = staffGroup;

    // Staff Body (Bamboo golden cylinder)
    const staffBodyGeom = new THREE.CylinderGeometry(0.06, 0.06, 5.8, 32);
    const staffBodyMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.2,
    });
    const staffMesh = new THREE.Mesh(staffBodyGeom, staffBodyMat);
    staffGroup.add(staffMesh);

    // Brass End Caps
    const capMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
    const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.25, 16), capMat);
    cap1.position.y = 2.9;
    staffGroup.add(cap1);

    const cap2 = cap1.clone();
    cap2.position.y = -2.9;
    staffGroup.add(cap2);

    // Glowing tip markers for trail
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff9933 });
    const tipTop = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowMat);
    tipTop.position.y = 3.0;
    staffGroup.add(tipTop);

    // 8. Dynamic Motion Ribbon Trail
    const maxTrailPoints = 60;
    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0xc4a46a,
      transparent: true,
      opacity: 0.85,
      linewidth: 2,
    });
    const trailLine = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trailLine);
    trailLineRef.current = trailLine;

    // 9. Animation Engine
    let animId;
    let time = 0;
    const trailHistory = [];

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isPlayingRef.current) {
        const dt = 0.016 * speedRef.current;
        time += dt;

        const currentTech = activeTechniqueRef.current;

        if (currentTech === "infinity") {
          // Figure-8 Lemniscate Path
          // x = A * sin(t), y = B * sin(2t)
          const t = time * 3.2;
          const x = Math.sin(t) * 1.5;
          const y = Math.sin(t * 2) * 0.9;
          const z = Math.cos(t) * 0.6;

          staffGroup.position.set(x, y, z);
          staffGroup.rotation.z = Math.cos(t * 2) * 1.8;
          staffGroup.rotation.y = t * 2.5;
          staffGroup.rotation.x = Math.sin(t) * 0.8;
        } else if (currentTech === "helicopter") {
          // Rapid Overhead Horizontal Vortex Shield
          const t = time * 6.5;
          staffGroup.position.set(0, 1.2 + Math.sin(t * 0.5) * 0.15, 0);
          staffGroup.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1;
          staffGroup.rotation.y = t;
          staffGroup.rotation.z = Math.cos(t * 0.3) * 0.15;
        } else {
          // Combat Thrust & 45-degree Deflection
          const cycle = (time * 1.8) % (Math.PI * 2);
          if (cycle < Math.PI) {
            // Forward thrust phase
            const push = Math.sin(cycle);
            staffGroup.position.set(0, 0, push * 2.2);
            staffGroup.rotation.set(Math.PI / 2, 0, 0);
          } else {
            // High angle diagonal parry
            const parry = Math.sin(cycle - Math.PI);
            staffGroup.position.set(parry * 1.4, parry * 0.8, -parry * 0.5);
            staffGroup.rotation.set(Math.PI / 4, parry * 2.5, parry * 1.2);
          }
        }

        // Whoosh sound synchronization
        whooshTimerRef.current += dt;
        if (whooshTimerRef.current > (currentTech === "helicopter" ? 0.35 : 0.65) / speedRef.current) {
          whooshTimerRef.current = 0;
          playWhoosh(speedRef.current * 0.9);
        }

        // Update Motion Ribbon Trail
        const tipWorldPos = new THREE.Vector3();
        tipTop.getWorldPosition(tipWorldPos);
        trailHistory.unshift(tipWorldPos.clone());
        if (trailHistory.length > maxTrailPoints) trailHistory.pop();

        const positions = trailLine.geometry.attributes.position.array;
        for (let i = 0; i < maxTrailPoints; i++) {
          if (i < trailHistory.length) {
            positions[i * 3] = trailHistory[i].x;
            positions[i * 3 + 1] = trailHistory[i].y;
            positions[i * 3 + 2] = trailHistory[i].z;
          } else {
            positions[i * 3] = tipWorldPos.x;
            positions[i * 3 + 1] = tipWorldPos.y;
            positions[i * 3 + 2] = tipWorldPos.z;
          }
        }
        trailLine.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    let isVisible = true;
    let isTabActive = typeof document !== "undefined" ? document.visibilityState !== "hidden" : true;

    let intersectionObserver = null;
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
      intersectionObserver.observe(currentMount);
    } else {
      animate();
    }

    const handleVisibilityChange = () => {
      isTabActive = document.visibilityState !== "hidden";
      if (isVisible && isTabActive && !animId) {
        lastTime = performance.now();
        animate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      if (handleVisibilityChange) {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      if (animId) {
        cancelAnimationFrame(animId);
      }
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Camera based on Angle Selector
  useEffect(() => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (cameraAngle === "front") {
      cam.position.set(0, 0, 9);
      cam.lookAt(0, 0, 0);
    } else if (cameraAngle === "side") {
      cam.position.set(8.5, 2, 4);
      cam.lookAt(0, 0, 0);
    } else if (cameraAngle === "top") {
      cam.position.set(0, 9.5, 0.5);
      cam.lookAt(0, 0, 0);
    }
  }, [cameraAngle]);

  const techniques = [

    {
      id: "helicopter",
      title: "Overhead Helicopter Shield",
      telugu: "రక్షక కవచం (Kavacham)",
      icon: Shield,
      desc: "High-speed horizontal overhead canopy that repels descending strikes, missiles, and multiple attackers.",
      cadence: "Rapid vortex cadence (4 beats per revolution)",
    },
    {
      id: "thrust",
      title: "Combat Thrust & 45° Parry",
      telugu: "తాకుడు & రక్షణ వరుస (Poru)",
      icon: Zap,
      desc: "Penetrating linear strike channeled from the rear heel, converting recoil into an impenetrable diagonal parry.",
      cadence: "Explosive linear burst",
    },
  ];

  return (
    <div className="w-full bg-[#1C1914] border border-[#C4A46A]/30 rounded-2xl p-4 md:p-6 shadow-2xl text-[#F2E9D8]">
      {/* Top Controls Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#C4A46A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#8B3F2B] text-white">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-xl font-bold tracking-wide text-[#F2E9D8]">
              3D Interactive Martial Spin & Stance Dojo
            </h3>
          </div>
          <p className="text-xs text-[#C4A46A] tracking-wider uppercase mt-1">
            Real-Time Centrifugal Velocity Visualizer • Telugu Warrior Kata Mechanics
          </p>
        </div>

        {/* Play/Pause & Sound Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              playWoodClick();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B3F2B] hover:bg-[#a84c35] text-white text-xs font-semibold tracking-wider transition-all shadow-md shadow-[#8B3F2B]/40"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Motion
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Resume Spin
              </>
            )}
          </button>

          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${soundEnabled
              ? "bg-[#C4A46A]/20 border-[#C4A46A] text-[#F2E9D8]"
              : "bg-[#29251E] border-[#C4A46A]/30 text-[#C7BCAB]"
              }`}
            title={soundEnabled ? "Martial Sound FX Enabled (Click to Mute)" : "Enable Martial Sound FX"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C4A46A]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Technique Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {techniques.map((tech) => {
          const Icon = tech.icon;
          const isActive = activeTechnique === tech.id;
          return (
            <button
              key={tech.id}
              onClick={() => {
                setActiveTechnique(tech.id);
                playWhoosh(1.2);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${isActive
                ? "border-[#C4A46A] bg-gradient-to-r from-[#8B3F2B]/40 to-[#29251E] text-white shadow-lg shadow-[#8B3F2B]/20"
                : "border-[#C4A46A]/20 bg-[#29251E]/60 text-[#C7BCAB] hover:border-[#C4A46A]/40"
                }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#C4A46A]" : "text-[#8B3F2B]"}`} />
                <span className="font-serif font-semibold text-sm">{tech.title}</span>
              </div>
              <p className="text-xs text-[#C4A46A] font-medium">{tech.telugu}</p>
              <p className="text-xs text-[#C7BCAB]/80 mt-1 line-clamp-2">{tech.desc}</p>
              {isActive && (
                <div className="absolute top-0 right-0 w-2 h-full bg-[#C4A46A]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3D Simulation Canvas */}
      <div className="relative w-full h-[360px] md:h-[420px] rounded-xl overflow-hidden border border-[#C4A46A]/20 bg-[#14120F]">
        <div ref={mountRef} className="w-full h-full" />

        {/* Perspective Angle Switcher */}
        <div className="absolute top-3 left-3 bg-[#1C1914]/85 border border-[#C4A46A]/30 backdrop-blur-md p-1 rounded-xl flex items-center gap-1 z-10">
          <span className="text-[10px] uppercase font-semibold text-[#C4A46A] px-2">Perspective:</span>
          {[
            { id: "front", label: "Front Stance" },
            { id: "side", label: "Side 45°" },
            { id: "top", label: "Aerial Stance" },
          ].map((angle) => (
            <button
              key={angle.id}
              onClick={() => {
                setCameraAngle(angle.id);
                playWoodClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${cameraAngle === angle.id
                ? "bg-[#8B3F2B] text-white font-medium"
                : "text-[#C7BCAB] hover:text-white"
                }`}
            >
              {angle.label}
            </button>
          ))}
        </div>

        {/* Trail & Centrifugal Note */}
        <div className="absolute bottom-3 right-3 bg-[#1C1914]/85 border border-[#C4A46A]/30 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-[#C4A46A] flex items-center gap-2 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Golden Trail = Tip Path Velocity</span>
        </div>
      </div>

      {/* Speed & Audio Controls Bar */}
      <div className="mt-4 pt-4 border-t border-[#C4A46A]/20 flex flex-wrap items-center justify-between gap-4">
        {/* Speed Slider */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <FastForward className="w-4 h-4 text-[#C4A46A]" />
          <span className="text-xs uppercase font-semibold text-[#C4A46A] tracking-wider whitespace-nowrap">
            Cadence Velocity: {speed.toFixed(1)}x
          </span>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-32 md:w-48 accent-[#8B3F2B] cursor-pointer"
          />
        </div>

        {/* Cadence Tag */}
        <div className="text-xs text-[#C7BCAB] bg-[#29251E] px-3 py-1.5 rounded-lg border border-[#C4A46A]/20">
          <span className="text-[#C4A46A] font-semibold">Martial Cadence: </span>
          {techniques.find((t) => t.id === activeTechnique)?.cadence}
        </div>
      </div>
    </div>
  );
}
