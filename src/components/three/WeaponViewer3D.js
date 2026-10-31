"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, ZoomIn, ZoomOut, Eye, Sun, Sparkles, RefreshCw } from "lucide-react";
import { useSound } from "@/components/layout/SoundContext";

// Procedural texture generators for realistic wood & metal
function createWoodTexture(type) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  let baseColor = "#8B5A2B";
  let darkColor = "#5C3A1E";
  let ringColor = "#D2B48C";

  if (type === "bamboo") {
    baseColor = "#D4AF37";
    darkColor = "#A67C1E";
    ringColor = "#F5DEB3";
  } else if (type === "rosewood") {
    baseColor = "#58181F";
    darkColor = "#2C080B";
    ringColor = "#8C2E36";
  } else if (type === "ebony") {
    baseColor = "#1F1B18";
    darkColor = "#0C0A09";
    ringColor = "#3D3731";
  } else {
    // Teak
    baseColor = "#7A4B24";
    darkColor = "#4D2D13";
    ringColor = "#A66D38";
  }

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Grain stripes
  for (let y = 0; y < 512; y += 3) {
    ctx.fillStyle = y % 6 === 0 ? darkColor : ringColor;
    ctx.globalAlpha = 0.2 + Math.random() * 0.15;
    ctx.fillRect(0, y, 512, 1 + Math.random() * 2);
  }

  // Bamboo nodes or grain marks
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 6; i++) {
    const yPos = 85 * i + 40;
    ctx.fillStyle = darkColor;
    ctx.fillRect(0, yPos - 2, 512, 4);
    ctx.fillStyle = "#F5E6B3";
    ctx.fillRect(0, yPos + 2, 512, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  return texture;
}

export default function WeaponViewer3D({ compact = false }) {
  const mountRef = useRef(null);
  const { playWoodClick, playWhoosh } = useSound();

  const [mounted, setMounted] = useState(false);
  const [activeWeapon, setActiveWeapon] = useState("staff"); // "staff" | "talwar"
  const [materialType, setMaterialType] = useState("bamboo"); // "bamboo" | "teak" | "rosewood" | "ebony"
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const weaponGroupRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF6F2EB);
    sceneRef.current = scene;

    // 2. Camera
    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and tone mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting (Warm daylight and temple gold accents)
    const ambientLight = new THREE.AmbientLight(0xfff7ee, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd97706, 2.0); // Radiant gold rim
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const warmUnderLight = new THREE.PointLight(0xdc2626, 1.5, 15); // Crimson warmth
    warmUnderLight.position.set(0, -4, 2);
    scene.add(warmUnderLight);

    // 5. Weapon Container Group
    const weaponGroup = new THREE.Group();
    scene.add(weaponGroup);
    weaponGroupRef.current = weaponGroup;

    // Build the initial weapon
    buildWeaponModel(weaponGroup, "staff", "bamboo", false);
    setIsLoaded(true);

    // 6. Animation loop using performance.now with viewport pause
    let animationFrameId = null;
    let lastTime = performance.now();
    let totalElapsedTime = 0;
    let isVisible = true;
    let isTabActive = typeof document !== "undefined" ? document.visibilityState !== "hidden" : true;

    const animate = () => {
      if (!isVisible || !isTabActive) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      totalElapsedTime += delta;

      if (weaponGroupRef.current && autoRotate && !isDraggingRef.current) {
        weaponGroupRef.current.rotation.y += delta * 0.7;
        weaponGroupRef.current.rotation.x = Math.sin(totalElapsedTime * 0.8) * 0.15;
      }

      renderer.render(scene, camera);
    };

    let intersectionObserver = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible && isTabActive && !animationFrameId) {
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
      if (isVisible && isTabActive && !animationFrameId) {
        lastTime = performance.now();
        animate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 7. Resize handling
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
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Rebuild weapon model when state changes
  useEffect(() => {
    if (weaponGroupRef.current) {
      buildWeaponModel(weaponGroupRef.current, activeWeapon, materialType, wireframe);
    }
  }, [activeWeapon, materialType, wireframe]);

  function buildWeaponModel(group, weapon, matType, isWireframe) {
    // Clear old children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    }

    if (weapon === "staff") {
      // 1. THE TRADITIONAL KARRASAMU BAMBOO / WOOD STAFF
      const woodTex = createWoodTexture(matType);
      const staffMat = new THREE.MeshStandardMaterial({
        map: woodTex,
        roughness: 0.38,
        metalness: 0.05,
        wireframe: isWireframe,
      });

      // Staff Main Shaft (Segmented and slightly tapered)
      const staffGeom = new THREE.CylinderGeometry(0.07, 0.07, 6.2, 32, 24);
      const staffMesh = new THREE.Mesh(staffGeom, staffMat);
      group.add(staffMesh);

      // Brass Finial End-Caps (Antique gold caps with ceremonial rings)
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.25,
        metalness: 0.88,
        wireframe: isWireframe,
      });

      const topCapGeom = new THREE.CylinderGeometry(0.085, 0.075, 0.3, 24);
      const topCap = new THREE.Mesh(topCapGeom, brassMat);
      topCap.position.y = 3.1;
      group.add(topCap);

      const topDomeGeom = new THREE.SphereGeometry(0.085, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const topDome = new THREE.Mesh(topDomeGeom, brassMat);
      topDome.position.y = 3.25;
      group.add(topDome);

      const bottomCap = topCap.clone();
      bottomCap.position.y = -3.1;
      bottomCap.rotation.x = Math.PI;
      group.add(bottomCap);

      const bottomDome = topDome.clone();
      bottomDome.position.y = -3.25;
      bottomDome.rotation.x = Math.PI;
      group.add(bottomDome);

      // Bamboo Knots & Brass decorative bands
      for (let y = -2.4; y <= 2.4; y += 0.8) {
        const ringGeom = new THREE.TorusGeometry(0.078, 0.012, 12, 32);
        const ringMesh = new THREE.Mesh(ringGeom, brassMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = y;
        group.add(ringMesh);
      }

      // Traditional Charcoal/Crimson Grip Wrap at center
      const wrapMat = new THREE.MeshStandardMaterial({
        color: 0x161824, // Dark obsidian cord
        roughness: 0.65,
        metalness: 0.2,
        wireframe: isWireframe,
      });
      const wrapGeom = new THREE.CylinderGeometry(0.078, 0.078, 0.85, 24);
      const wrapMesh = new THREE.Mesh(wrapGeom, wrapMat);
      wrapMesh.position.y = 0;
      group.add(wrapMesh);

      group.rotation.z = Math.PI / 6; // Angled display stance
    } else {
      // 2. TRADITIONAL ANDHRA TALWAR (SWORD) & DHAL (SHIELD)
      // Steel Blade
      const steelMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.12,
        metalness: 0.98,
        wireframe: isWireframe,
      });

      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, 0);
      bladeShape.lineTo(0.12, 0);
      bladeShape.quadraticCurveTo(0.18, 1.8, 0.24, 3.2);
      bladeShape.lineTo(0.0, 3.6); // Sharp tip
      bladeShape.quadraticCurveTo(0.04, 1.8, 0, 0);

      const extrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
      const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
      const bladeMesh = new THREE.Mesh(bladeGeom, steelMat);
      bladeMesh.position.set(-0.06, 0.2, 0);
      group.add(bladeMesh);

      // Brass Hilt and Disc Pommel
      const hiltBrassMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.22,
        metalness: 0.9,
        wireframe: isWireframe,
      });

      const guardGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 24);
      const guard = new THREE.Mesh(guardGeom, hiltBrassMat);
      guard.position.y = 0.2;
      group.add(guard);

      const handleGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.45, 16);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x161a24, roughness: 0.6 });
      const handle = new THREE.Mesh(handleGeom, handleMat);
      handle.position.y = -0.05;
      group.add(handle);

      const pommelGeom = new THREE.SphereGeometry(0.14, 16, 16);
      const pommel = new THREE.Mesh(pommelGeom, hiltBrassMat);
      pommel.position.y = -0.32;
      group.add(pommel);

      // Authentic Polished Damascus Steel Dhal (Shield)
      const dhalGroup = new THREE.Group();
      dhalGroup.position.set(1.5, 0.9, -0.5);
      dhalGroup.rotation.z = -Math.PI / 12;
      group.add(dhalGroup);

      const shieldMat = new THREE.MeshStandardMaterial({
        color: 0x181c26, // Dark damascus steel
        roughness: 0.22,
        metalness: 0.92,
        wireframe: isWireframe,
      });
      const shieldGeom = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, 0.42);
      const shieldMesh = new THREE.Mesh(shieldGeom, shieldMat);
      shieldMesh.rotation.x = Math.PI / 2;
      dhalGroup.add(shieldMesh);

      // Rolled Brass Outer Rim
      const rimGeom = new THREE.TorusGeometry(0.5, 0.035, 12, 36);
      const rimMesh = new THREE.Mesh(rimGeom, hiltBrassMat);
      rimMesh.position.z = -0.11;
      dhalGroup.add(rimMesh);

      // 4 Boss Studs on Shield
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const washer = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.015, 14), hiltBrassMat);
        washer.rotation.x = Math.PI / 2;
        washer.position.set(Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, -0.2);
        dhalGroup.add(washer);

        const studGeom = new THREE.SphereGeometry(0.065, 14, 14);
        const stud = new THREE.Mesh(studGeom, hiltBrassMat);
        stud.position.set(Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, -0.23);
        dhalGroup.add(stud);
      }

      // Center Spike Boss
      const centerSpike = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.18, 16), hiltBrassMat);
      centerSpike.rotation.x = -Math.PI / 2;
      centerSpike.position.z = -0.32;
      dhalGroup.add(centerSpike);

      group.rotation.z = -Math.PI / 12;
    }
  }

  // Mouse & Touch Orbit Handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !weaponGroupRef.current) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;
    weaponGroupRef.current.rotation.y += deltaX * 0.012;
    weaponGroupRef.current.rotation.x += deltaY * 0.012;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || !weaponGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePos.current.x;
    const deltaY = e.touches[0].clientY - prevMousePos.current.y;
    weaponGroupRef.current.rotation.y += deltaX * 0.015;
    weaponGroupRef.current.rotation.x += deltaY * 0.015;
    prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const resetCamera = () => {
    playWoodClick();
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 8.5);
    }
    if (weaponGroupRef.current) {
      weaponGroupRef.current.rotation.set(0, 0, activeWeapon === "staff" ? Math.PI / 6 : -Math.PI / 12);
    }
  };

  const zoomCamera = (direction) => {
    if (!cameraRef.current) return;
    const currentZ = cameraRef.current.position.z;
    const newZ = direction === "in" ? Math.max(4.5, currentZ - 1) : Math.min(12, currentZ + 1);
    cameraRef.current.position.z = newZ;
    playWoodClick();
  };

  if (!mounted) {
    return (
      <div className="relative w-full min-h-[450px] rounded-2xl overflow-hidden border border-amber-200 bg-[#FAF8F5] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-amber-600 border-t-[#DC2626] rounded-full animate-spin" />
        <span className="text-xs font-serif text-amber-800 uppercase tracking-widest font-bold">
          Loading 3D Armory...
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-amber-300/80 bg-white shadow-xl p-4 md:p-6 text-stone-900">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-pulse" />
            <h3 className="font-serif text-lg md:text-xl font-bold tracking-wide text-stone-900">
              {activeWeapon === "staff" ? "Traditional Bamboo Karra (కర్ర)" : "Royal Talwar & Dhal (కత్తి & డాలు)"}
            </h3>
          </div>
          <p className="text-xs text-amber-800 tracking-wider uppercase mt-0.5 font-semibold">
            Interactive 3D Armory Inspection • 360° Drag & Zoom
          </p>
        </div>

        {/* Weapon Selector Tabs */}
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
          <button
            onClick={() => {
              setActiveWeapon("staff");
              playWhoosh(1.0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold uppercase tracking-wider transition-all ${activeWeapon === "staff"
                ? "bg-[#DC2626] text-white shadow-md shadow-[#DC2626]/30"
                : "text-stone-600 hover:text-stone-900"
              }`}
          >
            Karrasamu Staff
          </button>
          <button
            onClick={() => {
              setActiveWeapon("talwar");
              playWhoosh(1.2);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold uppercase tracking-wider transition-all ${activeWeapon === "talwar"
                ? "bg-[#DC2626] text-white shadow-md shadow-[#DC2626]/30"
                : "text-stone-600 hover:text-stone-900"
              }`}
          >
            Talwar & Shield
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={`relative w-full cursor-grab active:cursor-grabbing select-none bg-[#F6F2EB] rounded-xl overflow-hidden my-3 ${compact ? "h-[320px] md:h-[400px]" : "h-[420px] md:h-[520px]"
          }`}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F5]/90 z-10">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-amber-700 animate-spin mx-auto mb-2" />
              <p className="text-sm font-serif text-amber-800 font-bold">Forging 3D Armory Model...</p>
            </div>
          </div>
        )}

        {/* Floating Controls HUD */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={() => {
              setAutoRotate(!autoRotate);
              playWoodClick();
            }}
            title={autoRotate ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all shadow-md ${autoRotate
                ? "bg-amber-100 border-amber-400 text-amber-900 font-bold"
                : "bg-white/90 border-stone-200 text-stone-600 hover:text-stone-900"
              }`}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => zoomCamera("in")}
            title="Zoom In"
            className="p-2.5 rounded-xl border border-stone-200 bg-white/90 backdrop-blur-md text-stone-600 hover:text-stone-900 transition-all shadow-md"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => zoomCamera("out")}
            title="Zoom Out"
            className="p-2.5 rounded-xl border border-stone-200 bg-white/90 backdrop-blur-md text-stone-600 hover:text-stone-900 transition-all shadow-md"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setWireframe(!wireframe);
              playWoodClick();
            }}
            title="Toggle Wireframe Structural Analysis"
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all shadow-md ${wireframe
                ? "bg-amber-500 text-white border-amber-500 font-bold"
                : "bg-white/90 border-stone-200 text-stone-600 hover:text-stone-900"
              }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={resetCamera}
            title="Reset Stance View"
            className="p-2.5 rounded-xl border border-stone-200 bg-white/90 backdrop-blur-md text-stone-600 hover:text-stone-900 transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Stance Overlay Tip */}
        <div className="absolute bottom-4 left-4 bg-white/90 border border-amber-300 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs text-stone-800 flex items-center gap-2 pointer-events-none shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span className="font-medium">Click & drag to rotate • Scroll to zoom</span>
        </div>
      </div>

      {/* Material & Timber Customization Palette */}
      {activeWeapon === "staff" && (
        <div className="pt-4 border-t border-amber-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-amber-800 font-bold uppercase tracking-wider">
            Traditional Timber Finish:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "bamboo", label: "Golden Bamboo (వెదురు)", color: "bg-[#D4AF37]" },
              { id: "teak", label: "Royal Teak (టేకు)", color: "bg-[#7A4B24]" },
              { id: "rosewood", label: "Kondapalli Rosewood", color: "bg-[#58181F]" },
              { id: "ebony", label: "Imperial Ebony (కృష్ణ)", color: "bg-[#1F1B18]" },
            ].map((mat) => (
              <button
                key={mat.id}
                onClick={() => {
                  setMaterialType(mat.id);
                  playWoodClick();
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${materialType === mat.id
                    ? "border-amber-400 bg-amber-50 text-stone-900 font-bold shadow-sm"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:text-stone-900"
                  }`}
              >
                <span className={`w-3 h-3 rounded-full ${mat.color} border border-amber-400/40`} />
                {mat.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
