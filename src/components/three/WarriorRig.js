import * as THREE from "three";

// BUILD REAL HUMAN WARRIOR: SHIRTLESS MUSCULAR TORSO + DHOTI STYLE PANTS
export function buildRealHumanWarrior(scene) {
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

  // --- 1. PELVIS & WAIST (Base at y = 1.04, perfectly elevating feet to arena plinth surface) ---
  const pelvis = new THREE.Group();
  pelvis.position.y = 1.04;
  root.add(pelvis);

  // Core pelvic hip block wrapped in ivory martial dhoti cloth
  const dhotiPelvis = new THREE.Mesh(
    new THREE.CylinderGeometry(0.185, 0.165, 0.22, 16),
    dhotiMat
  );
  dhotiPelvis.scale.set(1.0, 1.0, 0.76);
  pelvis.add(dhotiPelvis);

  // Royal Crimson Silk Waistband (Kamarbandh)
  const kamarbandh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.19, 0.085, 16),
    crimsonSashMat
  );
  kamarbandh.scale.set(1.0, 1.0, 0.76);
  kamarbandh.position.y = 0.08;
  pelvis.add(kamarbandh);

  // Gold Belt Buckle / Center Ornament
  const beltOrnament = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.075, 0.03),
    brassJewelryMat
  );
  beltOrnament.position.set(0, 0.08, 0.16);
  pelvis.add(beltOrnament);

  // Front Hanging Pleated Dhoti Drape (Pancha Madi)
  const frontDhotiDrape = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.42, 0.03),
    dhotiMat
  );
  frontDhotiDrape.position.set(0, -0.18, 0.15);
  pelvis.add(frontDhotiDrape);

  // Gold Zari Border on Front Pleats
  const frontDhotiGold = new THREE.Mesh(
    new THREE.BoxGeometry(0.125, 0.04, 0.035),
    dhotiGoldMat
  );
  frontDhotiGold.position.set(0, -0.37, 0.15);
  pelvis.add(frontDhotiGold);

  // Crimson Silk Sash Tails (Floating gracefully)
  const frontSash1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.065, 0.36, 0.015),
    crimsonSashMat
  );
  frontSash1.position.set(-0.06, -0.16, 0.165);
  pelvis.add(frontSash1);

  const frontSash2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.065, 0.30, 0.015),
    dhotiGoldMat
  );
  frontSash2.position.set(0.06, -0.14, 0.165);
  pelvis.add(frontSash2);

  // --- 2. SHIRTLESS MUSCULAR TORSO (Natural Athletic Lean Indian Warrior Anatomy) ---
  const torso = new THREE.Group();
  torso.position.y = 0.14;
  pelvis.add(torso);

  // A. Muscular Bare Ribcage & Core — lean athletic proportions so arms never hide under torso
  const coreChest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.165, 0.135, 0.38, 16),
    skinMat
  );
  coreChest.scale.set(1.0, 1.0, 0.72);
  coreChest.position.y = 0.19;
  torso.add(coreChest);

  // B. Defined Sculpted Pectoral Muscles (Pectoralis Major)
  const rPec = new THREE.Mesh(
    new THREE.BoxGeometry(0.085, 0.09, 0.035),
    skinHighlightMat
  );
  rPec.position.set(0.052, 0.24, 0.09);
  rPec.rotation.z = -0.12;
  rPec.rotation.y = 0.08;
  torso.add(rPec);

  const lPec = new THREE.Mesh(
    new THREE.BoxGeometry(0.085, 0.09, 0.035),
    skinHighlightMat
  );
  lPec.position.set(-0.052, 0.24, 0.09);
  lPec.rotation.z = 0.12;
  lPec.rotation.y = -0.08;
  torso.add(lPec);

  // Sternal cleavage groove down the center
  const sternumLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.010, 0.15, 0.036),
    skinMat
  );
  sternumLine.position.set(0, 0.24, 0.088);
  torso.add(sternumLine);

  // C. Sculpted 6-Pack Rectus Abdominis (Bare Muscular Abs)
  const rAbsUpper = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.055, 0.024), skinHighlightMat);
  rAbsUpper.position.set(0.030, 0.12, 0.096);
  torso.add(rAbsUpper);

  const lAbsUpper = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.055, 0.024), skinHighlightMat);
  lAbsUpper.position.set(-0.030, 0.12, 0.096);
  torso.add(lAbsUpper);

  const rAbsMid = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.055, 0.022), skinHighlightMat);
  rAbsMid.position.set(0.028, 0.048, 0.092);
  torso.add(rAbsMid);

  const lAbsMid = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.055, 0.022), skinHighlightMat);
  lAbsMid.position.set(-0.028, 0.048, 0.092);
  torso.add(lAbsMid);

  const rAbsLower = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.050, 0.020), skinHighlightMat);
  rAbsLower.position.set(0.026, -0.024, 0.088);
  torso.add(rAbsLower);

  const lAbsLower = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.050, 0.020), skinHighlightMat);
  lAbsLower.position.set(-0.026, -0.024, 0.088);
  torso.add(lAbsLower);

  // Navel
  const navel = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 8), hairMat);
  navel.position.set(0, 0.012, 0.090);
  torso.add(navel);

  // D. Sacred Thread (Yajnopavita / Jandhyam) across bare chest — fitted to athletic torso
  const sacredThread = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.009, 8, 32),
    sacredThreadMat
  );
  sacredThread.rotation.x = Math.PI / 3.4;
  sacredThread.rotation.y = Math.PI / 4.8;
  sacredThread.position.set(0, 0.18, 0);
  torso.add(sacredThread);

  // Clavicles
  const clavicles = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.24, 8),
    skinHighlightMat
  );
  clavicles.rotation.z = Math.PI / 2;
  clavicles.position.set(0, 0.33, 0.075);
  torso.add(clavicles);

  // Athletic Trapezius Muscles
  const rTrap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.09, 0.12, 10),
    skinMat
  );
  rTrap.position.set(0.10, 0.34, -0.02);
  rTrap.rotation.z = -0.42;
  torso.add(rTrap);

  const lTrap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.09, 0.12, 10),
    skinMat
  );
  lTrap.position.set(-0.10, 0.34, -0.02);
  lTrap.rotation.z = 0.42;
  torso.add(lTrap);

  // Upper Chest Cap
  const chestCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.135, 0.165, 0.08, 16),
    skinMat
  );
  chestCap.scale.set(1.0, 1.0, 0.72);
  chestCap.position.y = 0.34;
  torso.add(chestCap);

  // --- 3. NECK & REALISTIC HUMAN HEAD ---
  const neck = new THREE.Group();
  neck.position.y = 0.35;
  torso.add(neck);

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

  const cranium = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 24, 24),
    skinMat
  );
  cranium.scale.set(0.92, 1.12, 1.02);
  cranium.position.y = 0.10;
  headGroup.add(cranium);

  const jaw = new THREE.Mesh(
    new THREE.CylinderGeometry(0.082, 0.046, 0.09, 14),
    skinMat
  );
  jaw.position.set(0, 0.042, 0.042);
  headGroup.add(jaw);

  const chin = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), skinHighlightMat);
  chin.position.set(0, 0.008, 0.085);
  headGroup.add(chin);

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

  const rBrow = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.009, 0.014), hairMat);
  rBrow.position.set(0.044, 0.136, 0.112);
  rBrow.rotation.z = -0.08;
  headGroup.add(rBrow);

  const lBrow = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.009, 0.014), hairMat);
  lBrow.position.set(-0.044, 0.136, 0.112);
  lBrow.rotation.z = 0.08;
  headGroup.add(lBrow);

  const upperLip = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.010, 0.018), skinMat);
  upperLip.position.set(0, 0.052, 0.115);
  headGroup.add(upperLip);

  const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.012, 0.016), skinHighlightMat);
  lowerLip.position.set(0, 0.038, 0.112);
  headGroup.add(lowerLip);

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

  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.123, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7),
    hairMat
  );
  hairCap.position.set(0, 0.11, -0.01);
  headGroup.add(hairCap);

  const topknot = new THREE.Mesh(new THREE.SphereGeometry(0.054, 14, 14), hairMat);
  topknot.position.set(0, 0.23, -0.05);
  headGroup.add(topknot);

  const topknotRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.036, 0.009, 8, 16),
    brassJewelryMat
  );
  topknotRing.position.set(0, 0.21, -0.05);
  headGroup.add(topknotRing);

  const tilakBase = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.036, 0.006), tilakWhiteMat);
  tilakBase.position.set(0, 0.155, 0.118);
  headGroup.add(tilakBase);

  const tilakDot = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), tilakRedMat);
  tilakDot.position.set(0, 0.155, 0.122);
  headGroup.add(tilakDot);

  const headband = new THREE.Mesh(
    new THREE.TorusGeometry(0.125, 0.012, 8, 24),
    crimsonSashMat
  );
  headband.rotation.x = Math.PI / 2;
  headband.position.y = 0.145;
  headGroup.add(headband);

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

  // --- 4. RIGHT ARM ---
  const rShoulder = new THREE.Group();
  rShoulder.position.set(0.22, 0.32, 0);
  torso.add(rShoulder);

  const rDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 14), skinMat);
  rShoulder.add(rDeltoid);

  const rVanki = new THREE.Mesh(
    new THREE.TorusGeometry(0.060, 0.010, 8, 16),
    brassJewelryMat
  );
  rVanki.rotation.x = Math.PI / 2;
  rVanki.position.y = -0.06;
  rShoulder.add(rVanki);

  const rUpperArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.056, 0.048, 0.26, 14),
    skinMat
  );
  rUpperArm.position.y = -0.13;
  rShoulder.add(rUpperArm);

  const rElbow = new THREE.Group();
  rElbow.position.y = -0.26;
  rShoulder.add(rElbow);

  const rElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.046, 12, 12), skinMat);
  rElbow.add(rElbowJoint);

  const rForearm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.046, 0.038, 0.24, 14),
    skinMat
  );
  rForearm.position.y = -0.12;
  rElbow.add(rForearm);

  const rWristBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.042, 0.040, 0.05, 14),
    brassJewelryMat
  );
  rWristBand.position.y = -0.20;
  rElbow.add(rWristBand);

  const rWrist = new THREE.Group();
  rWrist.position.y = -0.24;
  rElbow.add(rWrist);

  const rWristBall = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 10), skinMat);
  rWrist.add(rWristBall);

  const rHand = new THREE.Group();
  rHand.position.y = -0.04;
  rWrist.add(rHand);

  // Clenched Right Fist: Dorsum/Palm base supporting back of weapon shaft
  const rPalm = new THREE.Mesh(new THREE.BoxGeometry(0.054, 0.070, 0.040), skinMat);
  rPalm.position.set(0, -0.022, -0.008);
  rHand.add(rPalm);

  // Knuckles & Curled Fingers: Clenched tightly across FRONT of weapon shaft
  const rFingers = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.058, 0.026), skinMat);
  rFingers.position.set(0, -0.022, 0.022);
  rHand.add(rFingers);

  // Martial Thumb: Clamped across knuckles locking the weapon grip
  const rThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.048, 8), skinMat);
  rThumb.position.set(-0.026, -0.010, 0.022);
  rThumb.rotation.set(0.35, 0.2, 0.6);
  rHand.add(rThumb);

  // --- 5. LEFT ARM ---
  const lShoulder = new THREE.Group();
  lShoulder.position.set(-0.22, 0.32, 0);
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

  // Clenched Left Fist: Dorsum/Palm base supporting back of weapon shaft
  const lPalm = new THREE.Mesh(new THREE.BoxGeometry(0.054, 0.070, 0.040), skinMat);
  lPalm.position.set(0, -0.022, -0.008);
  lHand.add(lPalm);

  // Knuckles & Curled Fingers: Clenched tightly across FRONT of weapon shaft
  const lFingers = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.058, 0.026), skinMat);
  lFingers.position.set(0, -0.022, 0.022);
  lHand.add(lFingers);

  // Martial Thumb: Clamped across knuckles locking the weapon grip
  const lThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.048, 8), skinMat);
  lThumb.position.set(0.026, -0.010, 0.022);
  lThumb.rotation.set(0.35, -0.2, -0.6);
  lHand.add(lThumb);

  // --- 6. LEGS & FEET: AUTHENTIC DHOTI STYLE PANTS (Vira Kachha / Pancha Kattu) ---
  // Total leg height = 0.99m. Feet sit flat on the elevated arena plinth surface at y = 0.048m.
  // The thighs wear the pleated ivory dhoti wraps; knees and lower calves transition to bare legs with ankle rings.

  // RIGHT LEG
  const rHipJoint = new THREE.Group();
  rHipJoint.position.set(0.15, -0.06, 0);
  pelvis.add(rHipJoint);

  const rHipBall = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), dhotiMat);
  rHipJoint.add(rHipBall);

  const rThigh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.088, 0.070, 0.40, 14),
    dhotiMat
  );
  rThigh.position.y = -0.20;
  rHipJoint.add(rThigh);

  const rDhotiTrim = new THREE.Mesh(
    new THREE.TorusGeometry(0.072, 0.012, 8, 16),
    dhotiGoldMat
  );
  rDhotiTrim.rotation.x = Math.PI / 2;
  rDhotiTrim.position.y = -0.38;
  rHipJoint.add(rDhotiTrim);

  const rKnee = new THREE.Group();
  rKnee.position.y = -0.40;
  rHipJoint.add(rKnee);

  const rKneeBall = new THREE.Mesh(new THREE.SphereGeometry(0.064, 12, 12), skinMat);
  rKnee.add(rKneeBall);

  const rShin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.064, 0.046, 0.40, 14),
    skinMat
  );
  rShin.position.y = -0.20;
  rKnee.add(rShin);

  const rCalfMusc = new THREE.Mesh(
    new THREE.SphereGeometry(0.048, 10, 10),
    skinHighlightMat
  );
  rCalfMusc.scale.set(0.9, 1.35, 0.85);
  rCalfMusc.position.set(0, -0.13, -0.024);
  rKnee.add(rCalfMusc);

  const rAnkle = new THREE.Group();
  rAnkle.position.y = -0.40;
  rKnee.add(rAnkle);

  const rAnkleBall = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), skinMat);
  rAnkle.add(rAnkleBall);

  const rAnkleRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.048, 0.009, 8, 16),
    brassJewelryMat
  );
  rAnkleRing.rotation.x = Math.PI / 2;
  rAnkleRing.position.y = -0.01;
  rAnkle.add(rAnkleRing);

  const rFoot = new THREE.Group();
  rFoot.position.set(0, -0.044, 0.06);
  rAnkle.add(rFoot);

  const rFootBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.095, 0.048, 0.22),
    skinMat
  );
  rFoot.add(rFootBase);

  const rToes = new THREE.Mesh(new THREE.BoxGeometry(0.090, 0.038, 0.05), skinHighlightMat);
  rToes.position.set(0, -0.005, 0.12);
  rFoot.add(rToes);

  // LEFT LEG
  const lHipJoint = new THREE.Group();
  lHipJoint.position.set(-0.15, -0.06, 0);
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

  const lCalfMusc = new THREE.Mesh(
    new THREE.SphereGeometry(0.048, 10, 10),
    skinHighlightMat
  );
  lCalfMusc.scale.set(0.9, 1.35, 0.85);
  lCalfMusc.position.set(0, -0.13, -0.024);
  lKnee.add(lCalfMusc);

  const lAnkle = new THREE.Group();
  lAnkle.position.y = -0.40;
  lKnee.add(lAnkle);

  const lAnkleBall = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), skinMat);
  lAnkle.add(lAnkleBall);

  const lAnkleRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.048, 0.009, 8, 16),
    brassJewelryMat
  );
  lAnkleRing.rotation.x = Math.PI / 2;
  lAnkleRing.position.y = -0.01;
  lAnkle.add(lAnkleRing);

  const lFoot = new THREE.Group();
  lFoot.position.set(0, -0.044, 0.06);
  lAnkle.add(lFoot);

  const lFootBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.095, 0.048, 0.22),
    skinMat
  );
  lFoot.add(lFootBase);

  const lToes = new THREE.Mesh(new THREE.BoxGeometry(0.090, 0.038, 0.05), skinHighlightMat);
  lToes.position.set(0, -0.005, 0.12);
  lFoot.add(lToes);

  // Authentic Default Combat Stance (Matching Silhouette Reference):
  // Two-handed staff grip: Left hand first (lead/upper), Right hand below (rear/lower)
  // Deep athletic lunge stance: Left leg forward, Right leg braced back, feet flat on floor plinth
  pelvis.position.y = 0.94;
  torso.rotation.set(0.12, 0.38, 0);
  headGroup.rotation.y = -0.38;

  // Lead Left Arm (Upper grip - "left hand first"):
  lShoulder.rotation.set(-1.30, 0.30, 0.46);
  lElbow.rotation.set(-0.42, 0, 0);

  // Rear Right Arm (Lower grip - "right hand holds bottom of stick"):
  rShoulder.rotation.set(-0.25, 0.30, -0.70);
  rElbow.rotation.set(-0.46, 0, 0);

  // Legs firmly resting on the arena plinth surface at y = 0.048m (never under floor!)
  lHipJoint.rotation.set(-0.11, 0, 0.14);
  lKnee.rotation.x = -0.29;
  lAnkle.rotation.set(0.44, 0, -0.14);

  rHipJoint.rotation.set(0.25, 0, -0.14);
  rKnee.rotation.x = -0.45;
  rAnkle.rotation.set(0.10, 0, 0.14);

  // --- 7. AUTHENTIC WEAPONS RIGGED IN HANDS ---

  // === WEAPON A: KARRASAMU BAMBOO STAFF (Karra) ===
  // Height precisely matched to the human figure: 1.78m (not more than human figure height)
  // Left hand holds first (upper grip), Right hand holds bottom of stick (butt grip)
  // Positioned diagonally upward-forward at ~50° passing firmly through both hands
  const staffGroup = new THREE.Group();
  rHand.add(staffGroup);
  staffGroup.position.set(0, 0, 0);
  staffGroup.rotation.set(1.2318, 0.3872, 0.5404);

  const staffMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.024, 1.78, 18),
    bambooWoodMat
  );
  // Lower grip in right hand at bottom of stick (y = 0.81), lead grip in left hand higher up (y = 0.51)
  staffMesh.position.set(0, 0.81, 0);
  staffGroup.add(staffMesh);

  // Brass End Caps (exactly 0.89m from center = 1.78m total length)
  const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.025, 0.08, 14), brassJewelryMat);
  topCap.position.y = 0.89;
  staffMesh.add(topCap);

  const botCap = topCap.clone();
  botCap.position.y = -0.89;
  botCap.rotation.x = Math.PI;
  staffMesh.add(botCap);

  // Traditional Crimson Grip Wraps: Right hand (bottom of stick), Left hand (lead grip), Center (whirlwind spin)
  const rGripWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.16, 16), crimsonSashMat);
  rGripWrap.position.y = -0.81;
  staffMesh.add(rGripWrap);

  const lGripWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.16, 16), crimsonSashMat);
  lGripWrap.position.y = -0.51;
  staffMesh.add(lGripWrap);

  const cGripWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.18, 16), crimsonSashMat);
  cGripWrap.position.y = 0;
  staffMesh.add(cGripWrap);

  // Authentic Hardened Bamboo Segment Rings (Nodes)
  const bambooNodeMat = new THREE.MeshStandardMaterial({
    color: 0x9e6f28,
    roughness: 0.5,
    metalness: 0.1,
  });
  [-0.66, -0.36, -0.05, 0.26, 0.58].forEach((ny) => {
    const nodeRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.025, 0.0035, 8, 16),
      bambooNodeMat
    );
    nodeRing.rotation.x = Math.PI / 2;
    nodeRing.position.y = ny;
    staffMesh.add(nodeRing);
  });

  // === WEAPON B: ROYAL TALWAR (Curved Sword / కత్తి) ===
  const swordGroup = new THREE.Group();
  rHand.add(swordGroup);
  swordGroup.position.set(0, -0.04, 0);
  swordGroup.rotation.set(2.55, 0, 0.2); // Curving forward towards opponent (never pointing backward!)

  // Gracefully curved 78cm Damascus steel blade
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

  // === WEAPON C: AUTHENTIC DHAL (Shield / డాలు) ===
  const dhalGroup = new THREE.Group();
  lForearm.add(dhalGroup);
  dhalGroup.position.set(-0.06, -0.10, 0.04);
  dhalGroup.rotation.y = -Math.PI / 2.2;

  // 1. Heavy Watered Steel Shield Plate (Convex Circular Disc, 44cm diameter)
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

  // 2. Heavy Polished Brass Outer Rim
  const shieldRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.224, 0.011, 12, 48),
    brassJewelryMat
  );
  shieldRim.position.z = 0.009;
  dhalGroup.add(shieldRim);

  // 3. Inner Decorative Gold Ring
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

    const washer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.006, 12),
      dhotiGoldMat
    );
    washer.rotation.x = Math.PI / 2;
    washer.position.set(bx, by, 0.013);
    dhalGroup.add(washer);

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

  // 6. Back Cushion Pad
  const backPad = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.008, 16),
    crimsonSashMat
  );
  backPad.rotation.x = Math.PI / 2;
  backPad.position.z = -0.012;
  dhalGroup.add(backPad);

  // === WEAPON D: AUTHENTIC JODI KARRA (Twin Rattan / Bamboo Sticks in Both Hands) ===
  // 1. Right Stick in Right Hand (1.10m authentic twin combat sticks)
  const rightStick = new THREE.Group();
  rHand.add(rightStick);
  rightStick.position.set(0, -0.04, 0);

  const rStickMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 1.10, 16),
    bambooWoodMat
  );
  rightStick.add(rStickMesh);

  const rStickCapTop = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.023, 0.06, 12), brassJewelryMat);
  rStickCapTop.position.y = 0.55;
  rStickMesh.add(rStickCapTop);
  const rStickCapBot = rStickCapTop.clone();
  rStickCapBot.position.y = -0.55;
  rStickCapBot.rotation.x = Math.PI;
  rStickMesh.add(rStickCapBot);
  const rStickGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.18, 14), crimsonSashMat);
  rStickMesh.add(rStickGrip);

  // 2. Left Stick in Left Hand (Matched Twin)
  const leftStick = new THREE.Group();
  lHand.add(leftStick);
  leftStick.position.set(0, -0.04, 0);

  const lStickMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 1.10, 16),
    bambooWoodMat
  );
  leftStick.add(lStickMesh);

  const lStickCapTop = rStickCapTop.clone();
  lStickMesh.add(lStickCapTop);
  const lStickCapBot = rStickCapBot.clone();
  lStickMesh.add(lStickCapBot);
  const lStickGrip = rStickGrip.clone();
  lStickMesh.add(lStickGrip);

  // Weapon Visibility Controller
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

// STABLE ALIGNMENT OF BAMBOO STAFF:
// Connects right hand (bottom of stick) and lead left hand (upper grip) with ZERO feedback oscillation!
// Does NOT mutate parent wrists, ensuring rock-solid stability and zero jitter at 60 FPS.
export function alignStaffThroughBothHands(w) {
  if (!w.staffGroup || !w.staffMesh || !w.rHand || !w.lHand || !w.root) return;
  w.root.updateMatrixWorld(true);
  const rH = new THREE.Vector3();
  const lH = new THREE.Vector3();
  w.rHand.getWorldPosition(rH);
  w.lHand.getWorldPosition(lH);

  const worldDir = new THREE.Vector3().subVectors(lH, rH).normalize();
  if (worldDir.lengthSq() < 0.001) return;

  // In rHand local space, find the direction towards lHand:
  const rHandWorldQuat = new THREE.Quaternion();
  w.rHand.getWorldQuaternion(rHandWorldQuat);
  const localDir = worldDir.clone().applyQuaternion(rHandWorldQuat.clone().invert()).normalize();

  // Orient staffGroup to point directly from rHand through lHand
  w.staffGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), localDir);
  w.staffMesh.position.set(0, 0.81, 0);
  w.staffMesh.rotation.set(0, 0, 0);
}

// REALISTIC HUMAN BIOMECHANICS & CHOREOGRAPHED MARTIAL STUNTS
export function updateHumanStunts(w, t, stunt, shockwave) {
  if (stunt === "air_tornado") {
    // 1. GAGANA VAKRA CHAKRA: 360° HURRICANE LEAP STAFF STRIKE
    const cycleDuration = 3.2;
    const progress = (t % cycleDuration) / cycleDuration;

    if (progress < 0.22) {
      // Phase 1: Deep Athletic Martial Gather (Virasan Wind-up)
      // Legs stay in combat stance — only slight pelvis dip
      const p = progress / 0.22;
      w.root.position.y = 0; // NEVER UNDER FLOOR!
      w.root.rotation.y = -p * 0.45;
      w.pelvis.position.y = 0.94 - p * 0.08;

      // Legs locked in combat stance reference posture
      w.lHipJoint.rotation.set(-0.11, 0, 0.14);
      w.lKnee.rotation.x = -0.29;
      w.lAnkle.rotation.set(0.44, 0, -0.14);
      w.rHipJoint.rotation.set(0.25, 0, -0.14);
      w.rKnee.rotation.x = -0.45;
      w.rAnkle.rotation.set(0.10, 0, 0.14);

      w.torso.rotation.y = -p * 0.40;
      w.headGroup.rotation.y = 0.25 * p;

      // Two-handed gather: Left hand holds first, Right hand holds bottom
      w.rShoulder.rotation.set(-0.25 - p * 0.15, 0.30, -0.70);
      w.rElbow.rotation.set(-0.46 - p * 0.15, 0, 0);
      w.rWrist.rotation.set(-0.15, 0.10, 0.20);

      w.lShoulder.rotation.set(-1.30 - p * 0.15, 0.30, 0.46);
      w.lElbow.rotation.set(-0.42 - p * 0.15, 0, 0);
      w.lWrist.rotation.set(0.20, 0.10, -0.15);
      alignStaffThroughBothHands(w);

      if (shockwave) shockwave.material.opacity = 0;
    } else if (progress < 0.65) {
      // Phase 2: Spectacular Airborne 360° Butterfly Hurricane Leap!
      const p = (progress - 0.22) / 0.43;
      const jumpHeight = Math.sin(p * Math.PI) * 1.35;
      w.root.position.y = jumpHeight; // STRICTLY ABOVE FLOOR!
      w.pelvis.position.y = 1.04;

      // Full, fluid 360° body rotation in mid-air
      w.root.rotation.y = -0.45 + p * Math.PI * 2.1;

      // Dynamic Flying Kick Silhouette in mid-air
      w.rHipJoint.rotation.set(-0.65 + p * 0.35, 0, -0.15);
      w.rKnee.rotation.x = -0.12; // extended lead kick
      w.lHipJoint.rotation.set(0.55 * (1 - p), 0, 0.25);
      w.lKnee.rotation.x = -0.75 * (1 - p); // chambered trailing leg

      // Two-handed powerful sweeping strike whirlwind overhead
      w.rShoulder.rotation.set(
        -1.40 + Math.sin(p * Math.PI * 2) * 0.40,
        0.20,
        -0.45
      );
      w.rElbow.rotation.set(-0.45, 0, 0);
      w.lShoulder.rotation.set(
        -1.55 + Math.sin(p * Math.PI * 2) * 0.40,
        -0.15,
        0.35
      );
      w.lElbow.rotation.set(-0.35, 0, 0);
      alignStaffThroughBothHands(w);

      w.frontSash1.rotation.x = Math.sin(p * 14) * 0.5;
      w.ribbon1.rotation.x = 0.8 + Math.sin(p * 16) * 0.4;
    } else if (progress < 0.84) {
      // Phase 3: Rock-Solid Virasan Ground Strike Landing!
      const p = (progress - 0.65) / 0.19;
      w.root.position.y = (1 - p) * 0.12;
      w.root.rotation.y = Math.PI * 2.1 * (1 - p * 0.05);

      w.pelvis.position.y = 0.94 - (1 - p) * 0.12;
      // Legs recovering back to combat stance from landing
      w.rHipJoint.rotation.set(0.25 * (1 - p) + 0.25 * p, 0, -0.14);
      w.rKnee.rotation.x = -0.45;
      w.rAnkle.rotation.set(0.10, 0, 0.14);

      w.lHipJoint.rotation.set(-0.11, 0, 0.14);
      w.lKnee.rotation.x = -0.29;
      w.lAnkle.rotation.set(0.44, 0, -0.14);

      w.rShoulder.rotation.set(-0.35 + p * 0.10, 0.30, -0.70);
      w.rElbow.rotation.set(-0.50 + p * 0.04, 0, 0);
      w.lShoulder.rotation.set(-1.35 + p * 0.05, 0.30, 0.46);
      w.lElbow.rotation.set(-0.45 + p * 0.03, 0, 0);
      alignStaffThroughBothHands(w);

      if (shockwave) {
        shockwave.position.set(0, 0.048, 0);
        shockwave.scale.set(1 + p * 5.5, 1 + p * 5.5, 1);
        shockwave.material.opacity = (1 - p) * 0.85;
      }
    } else {
      // Phase 4: Heroic Poise & Return to Combat Stance Guard
      w.root.position.y = 0;
      w.pelvis.position.y = 0.94;
      w.root.rotation.y = 0;

      // Return legs to combat stance
      w.rHipJoint.rotation.set(0.25, 0, -0.14);
      w.rKnee.rotation.x = -0.45;
      w.rAnkle.rotation.set(0.10, 0, 0.14);

      w.lHipJoint.rotation.set(-0.11, 0, 0.14);
      w.lKnee.rotation.x = -0.29;
      w.lAnkle.rotation.set(0.44, 0, -0.14);

      // Heroic two-handed combat stance (left hand first, right hand bottom)
      w.rShoulder.rotation.set(-0.25, 0.30, -0.70);
      w.rElbow.rotation.set(-0.46, 0, 0);
      w.rWrist.rotation.set(-0.15, 0.10, 0.20);
      w.lShoulder.rotation.set(-1.30, 0.30, 0.46);
      w.lElbow.rotation.set(-0.42, 0, 0);
      w.lWrist.rotation.set(0.20, 0.10, -0.15);
      alignStaffThroughBothHands(w);

      if (shockwave) shockwave.material.opacity = 0;
    }
  } else if (stunt === "shield_bash") {
    // 2. TALWAR KATA — DYNAMIC SWORD COMBAT & CIRCULAR FLOURISH (ఖడ్గ చలన సమరం)
    // 6 phases in a 4.8s cycle, legs locked in the combat stance throughout:
    // Phase 1: Forward Guard & Lightning Wrist Twirl Flourish (0.00–0.18)
    // Phase 2: Diagonal Rising Slash & Windmill Spin Recovery (0.18–0.35)
    // Phase 3: Overhead 360° Sword Twirl (Firkhi) into Downward Cleave (0.35–0.52)
    // Phase 4: Horizontal Back-cut with reverse wrist spin (0.52–0.68)
    // Phase 5: Explosive Dhal Ram & Thrusting Guard (0.68–0.84)
    // Phase 6: Flourish Recovery back to Combat Guard (0.84–1.00)
    const cycleDuration = 4.8;
    const progress = (t % cycleDuration) / cycleDuration;
    w.root.position.y = 0;
    w.root.position.z = 0;

    // === LEGS ALWAYS LOCKED IN COMBAT STANCE (reference silhouette) ===
    w.pelvis.position.y = 0.94;
    w.lHipJoint.rotation.set(-0.11, 0, 0.14);
    w.lKnee.rotation.x = -0.29;
    w.lAnkle.rotation.set(0.44, 0, -0.14);
    w.rHipJoint.rotation.set(0.25, 0, -0.14);
    w.rKnee.rotation.x = -0.45;
    w.rAnkle.rotation.set(0.10, 0, 0.14);

    if (progress < 0.18) {
      // Phase 1: Forward Guard & Rapid Circular Sword Twirl (Chakkar)
      const p = progress / 0.18;
      w.root.rotation.y = -0.20 + p * 0.15;
      w.torso.rotation.set(0.08, -0.15 + p * 0.35, 0);
      w.headGroup.rotation.set(0, 0.10 - p * 0.25, 0);

      w.rShoulder.rotation.set(-0.35, 0.20, 0.40);
      w.rElbow.rotation.x = -0.75;
      w.rWrist.rotation.set(0.10, 0, Math.sin(t * 12) * 0.25);
      // Sword rotates around blade axis (points forward at all times):
      w.swordGroup.rotation.set(2.55, t * 14, 0.20);

      w.lShoulder.rotation.set(-0.45 - p * 0.25, -0.30, -0.60);
      w.lElbow.rotation.x = -0.90;
      if (shockwave) shockwave.material.opacity = 0;

    } else if (progress < 0.35) {
      // Phase 2: Diagonal Rising Slash & Windmill Spin
      const p = (progress - 0.18) / 0.17;
      w.root.rotation.y = -0.05 + Math.sin(p * Math.PI) * 0.45;
      w.torso.rotation.set(0.08, 0.20 + Math.sin(p * Math.PI) * 0.35, 0);
      w.headGroup.rotation.set(0, -0.15, 0);

      w.rShoulder.rotation.set(-0.60 - p * 0.80, 0.10, 0.45);
      w.rElbow.rotation.x = -0.65;
      w.rWrist.rotation.set(0.10, 0, -0.20 + p * 0.40);
      // Sword rotates along the forward cutting plane:
      w.swordGroup.rotation.set(2.55, t * 12, 0.20);

      w.lShoulder.rotation.set(-0.75, 0.25 - p * 0.35, -0.65);
      w.lElbow.rotation.x = -0.75;

      if (shockwave && p > 0.6) {
        shockwave.position.set(0, 0.048, 0.4);
        shockwave.scale.set(1 + (p - 0.6) * 4, 1 + (p - 0.6) * 4, 1);
        shockwave.material.opacity = (1 - p) * 0.7;
      } else if (shockwave) shockwave.material.opacity = 0;

    } else if (progress < 0.52) {
      // Phase 3: High Guard & Overhead 360° Sword Twirl (Firkhi) into Cleave
      const p = (progress - 0.35) / 0.17;
      w.root.rotation.y = Math.sin(p * Math.PI * 0.5) * 0.20;
      w.torso.rotation.set(0.05 + p * 0.10, 0.10, 0);
      w.headGroup.rotation.set(-0.10, -0.10, 0);

      w.rShoulder.rotation.set(-1.40 + p * 0.80, 0.10, 0.35);
      w.rElbow.rotation.x = -0.55;
      w.rWrist.rotation.set(0.10, 0, 0.10);
      // Blade spin overhead pointing forward:
      w.swordGroup.rotation.set(2.55, t * 14, 0.20);

      w.lShoulder.rotation.set(-0.60, -0.20, -0.65);
      w.lElbow.rotation.x = -1.05;
      if (shockwave) shockwave.material.opacity = 0;

    } else if (progress < 0.68) {
      // Phase 4: Horizontal Forward Torso Cleave with reverse wrist rotation
      const p = (progress - 0.52) / 0.16;
      w.root.rotation.y = 0.15 + Math.sin(p * Math.PI) * 0.45;
      w.torso.rotation.set(0.08, -0.15 + p * 0.40, 0);
      w.headGroup.rotation.set(0, 0.10 - p * 0.20, 0);

      w.rShoulder.rotation.set(-0.40, 0.35 - p * 0.50, 0.45);
      w.rElbow.rotation.x = -0.70;
      w.rWrist.rotation.set(0.10, 0, 0.10);
      w.swordGroup.rotation.set(2.55, -t * 12, 0.20);

      w.lShoulder.rotation.set(-0.35, 0.40, -0.75);
      w.lElbow.rotation.x = -0.65;

      if (shockwave && p > 0.5) {
        shockwave.position.set(0, 0.048, 0.35);
        shockwave.scale.set(1 + (p - 0.5) * 6, 1 + (p - 0.5) * 6, 1);
        shockwave.material.opacity = (1 - p) * 0.85;
      } else if (shockwave) shockwave.material.opacity = 0;

    } else if (progress < 0.84) {
      // Phase 5: Dhal Shield Ram — explosive shield slam with sword in high forward thrust guard
      const p = (progress - 0.68) / 0.16;
      w.root.rotation.y = 0.20 - p * 0.15;
      w.torso.rotation.set(0.10, 0.25 - p * 0.20, 0);
      w.headGroup.rotation.set(0, -0.15, 0);

      w.rShoulder.rotation.set(-0.30, 0.25, 0.45);
      w.rElbow.rotation.x = -0.90;
      w.rWrist.rotation.set(0.10, 0, 0.10);
      w.swordGroup.rotation.set(2.55, 0, 0.20); // Blade points forward

      // Dhal arm thrusts forward aggressively:
      w.lShoulder.rotation.set(-0.60 + p * 0.25, 0.50 + p * 0.20, -0.75 + p * 0.30);
      w.lElbow.rotation.x = -0.80 + p * 0.60;

      if (shockwave && p > 0.6) {
        const sp = (p - 0.6) / 0.4;
        shockwave.position.set(0, 0.048, 0.55);
        shockwave.scale.set(1 + sp * 5.5, 1 + sp * 5.5, 1);
        shockwave.material.opacity = (1 - sp) * 0.95;
      } else if (shockwave) shockwave.material.opacity = 0;

    } else {
      // Phase 6: Return to Combat Guard with Flourish Spin
      const p = (progress - 0.84) / 0.16;
      w.root.rotation.y = 0.05 * (1 - p);
      w.torso.rotation.set(0.08, 0.25 * p, 0);
      w.headGroup.rotation.set(0, -0.20 * p, 0);

      w.rShoulder.rotation.set(-0.35, 0.20, 0.45);
      w.rElbow.rotation.x = -0.85;
      w.rWrist.rotation.set(0.10, 0, 0.10);
      w.swordGroup.rotation.set(2.55, t * 10, 0.20); // Blade points forward

      w.lShoulder.rotation.set(-0.30 - p * 0.40, 0.20 * p, -0.60);
      w.lElbow.rotation.x = -1.0;
      if (shockwave) shockwave.material.opacity = 0;
    }

  } else if (stunt === "infinity_spin") {
    // 4. AUTHENTIC THREE-ZONE KARRASAMU INFINITY ROTATION (Trividha Bhramanam / త్రివిధ భ్రమణం)
    // LEGS LOCKED FIRMLY IN COMBAT STANCE THROUGHOUT — only upper body & staff move
    // RIGHT CLENCHED FIST HOLDS CENTER OF BAMBOO STAFF (w.staffMesh.position.y = 0)
    // CONTINUOUS 360° ROTATIONS ACROSS 4 ZONES AT AUTHENTIC MARTIAL SPEED
    const cycleDuration = 5.6;
    const progress = (t % cycleDuration) / cycleDuration;
    w.root.position.y = 0;

    // === COMBAT STANCE LEGS (stable, grounded — reference silhouette) ===
    w.pelvis.position.y = 0.94;
    w.lHipJoint.rotation.set(-0.11, 0, 0.14);
    w.lKnee.rotation.x = -0.29;
    w.lAnkle.rotation.set(0.44, 0, -0.14);
    w.rHipJoint.rotation.set(0.25, 0, -0.14);
    w.rKnee.rotation.x = -0.45;
    w.rAnkle.rotation.set(0.10, 0, 0.14);

    // Right clenched fist holds center balance point of staff:
    w.staffMesh.position.set(0, 0, 0);
    w.rWrist.rotation.set(0, 0, 0);

    if (progress < 0.25) {
      // Phase 1: Left Flank Vertical High-Speed Wheel Spin
      w.torso.rotation.set(0.10, 0.35, 0);
      w.headGroup.rotation.set(0, -0.30, 0);

      w.rShoulder.rotation.set(-0.65, 0.50, -0.65);
      w.rElbow.rotation.set(-0.52, 0, 0);
      w.staffGroup.rotation.set(0, 0, 0);

      // Rapid 360° vertical rotations:
      w.staffMesh.rotation.x = t * 15;
      w.staffMesh.rotation.y = 0;
      w.staffMesh.rotation.z = 0;

      // Poised left arm in protective martial guard
      w.lShoulder.rotation.set(-1.10, 0.40, 0.50);
      w.lElbow.rotation.set(-0.85, 0, 0);
      w.frontSash1.rotation.z = Math.sin(t * 12) * 0.25;

    } else if (progress < 0.50) {
      // Phase 2: Right Flank Vertical High-Speed Wheel Spin
      w.torso.rotation.set(0.08, -0.20, 0);
      w.headGroup.rotation.set(0, 0.15, 0);

      w.rShoulder.rotation.set(-0.55, -0.35, 0.55);
      w.rElbow.rotation.set(-0.45, 0, 0);
      w.staffGroup.rotation.set(0, 0, 0);

      // Rapid reverse 360° vertical rotations:
      w.staffMesh.rotation.x = -t * 15;
      w.staffMesh.rotation.y = 0;
      w.staffMesh.rotation.z = 0;

      // Left arm guards chest
      w.lShoulder.rotation.set(-0.80, 0.20, -0.40);
      w.lElbow.rotation.set(-0.95, 0, 0);
      w.frontSash1.rotation.z = -Math.sin(t * 12) * 0.25;

    } else if (progress < 0.75) {
      // Phase 3: Overhead Horizontal Propeller Umbrella Canopy Spin (Chhatra Chakra)
      w.torso.rotation.set(0.04, 0.10, 0);
      w.headGroup.rotation.set(-0.25, 0, 0);

      w.rShoulder.rotation.set(-1.85, 0.15, -0.20);
      w.rElbow.rotation.set(-0.35, 0, 0);
      w.staffGroup.rotation.set(Math.PI / 2, 0, 0);

      // Blazing fast horizontal 360° helicopter spin overhead:
      w.staffMesh.rotation.z = t * 18;
      w.staffMesh.rotation.x = 0;
      w.staffMesh.rotation.y = 0;

      // Left arm in grounding balance posture
      w.lShoulder.rotation.set(-0.60, 0.30, -0.50);
      w.lElbow.rotation.set(-0.65, 0, 0);
      w.frontSash1.rotation.x = -0.20;

    } else {
      // Phase 4: Combined Continuous Infinity Figure-8 Whirlwind Loop
      const spin = t * 16;
      const weave = t * 4.5;
      w.torso.rotation.set(0.08, 0.15 + Math.sin(weave) * 0.25, 0);
      w.headGroup.rotation.set(-0.05, -Math.sin(weave) * 0.20, 0);

      w.rShoulder.rotation.set(-0.75 + Math.sin(weave) * 0.25, Math.cos(weave) * 0.35, -0.30);
      w.rElbow.rotation.set(-0.55, 0, 0);
      w.staffGroup.rotation.set(0, 0, 0);

      // Figure-8 infinity lemniscate weaving across both flanks:
      w.staffMesh.rotation.x = spin;
      w.staffMesh.rotation.z = Math.sin(weave) * 0.55;
      w.staffMesh.rotation.y = Math.cos(weave) * 0.30;

      // Left arm fluidly weaves in counter-rhythm
      w.lShoulder.rotation.set(-0.95 - Math.sin(weave) * 0.20, 0.15, 0.30);
      w.lElbow.rotation.set(-0.75, 0, 0);
      w.frontSash1.rotation.z = Math.sin(spin * 0.5) * 0.25;
      w.ribbon1.rotation.y = Math.cos(spin * 0.5) * 0.25;
    }
  } else if (stunt === "dual_flurry") {
    // 5. JODI KARRA TWIN STICK FLURRY — legs grounded in reference combat stance
    const flap = t * 3.4;
    w.root.position.y = 0;
    w.root.rotation.y = Math.sin(t * 1.5) * 0.18;
    w.torso.rotation.y = Math.cos(flap) * 0.22;

    // === COMBAT STANCE LEGS locked — only minor weight-shift sway on ankles ===
    w.pelvis.position.y = 0.94;
    w.lHipJoint.rotation.set(-0.11, 0, 0.14);
    w.lKnee.rotation.x = -0.29;
    w.lAnkle.rotation.set(0.44 + Math.sin(flap) * 0.04, 0, -0.14);

    w.rHipJoint.rotation.set(0.25, 0, -0.14);
    w.rKnee.rotation.x = -0.45;
    w.rAnkle.rotation.set(0.10 + Math.cos(flap) * 0.04, 0, 0.14);

    // Right stick: Smooth, rhythmic windmill (slower rotation: 0.14 per frame)
    w.rShoulder.rotation.x = Math.sin(flap) * 0.65;
    w.rShoulder.rotation.z = Math.cos(flap) * 0.35 + 0.45;
    w.rElbow.rotation.x = -0.55;
    if (w.rStickMesh) {
      w.rStickMesh.rotation.x += 0.14;
    }

    // Left stick: Counter-windmill in harmony
    w.lShoulder.rotation.x = Math.sin(flap + Math.PI) * 0.65;
    w.lShoulder.rotation.z = -(Math.cos(flap + Math.PI) * 0.35 + 0.45);
    w.lElbow.rotation.x = -0.55;
    if (w.lStickMesh) {
      w.lStickMesh.rotation.x += 0.14;
    }
  } else if (stunt === "combat_stance") {
    // 6. AUTHENTIC COMBAT STANCE WITH TWO-HANDED STAFF GRIP OR WEAPON GUARD
    const isStaff = w.staffGroup && w.staffGroup.visible;
    const isSword = w.swordGroup && w.swordGroup.visible;

    w.root.position.y = 0; // STRICTLY SOLID ON GROUND (NEVER UNDER FLOOR!)

    if (isStaff || (!isSword && (!w.rightStick || !w.rightStick.visible))) {
      // === TWO-HANDED BAMBOO STAFF COMBAT STANCE (Matching Reference Silhouette) ===
      // Lead Left hand is forward & higher on staff ("left hand first")
      // Rear Right hand holds bottom of stick ("right hand below")
      // Bamboo staff angled diagonally upward-forward at ~50°
      // Grounded combat lunge: Lead left leg forward, rear right leg braced, feet flat on stone plinth
      const breath = Math.sin(t * 1.8) * 0.012;
      w.pelvis.position.y = 0.94;
      w.torso.position.y = 0.14 + breath;
      w.neck.position.y = 0.35;

      w.torso.rotation.set(0.12, 0.38 + breath * 0.3, 0);
      w.headGroup.rotation.set(0, -0.38 - breath * 0.3, 0);

      // Lead Left Arm (Upper grip - "left hand first"):
      w.lShoulder.rotation.set(-1.30, 0.30, 0.46);
      w.lElbow.rotation.set(-0.42, 0, 0);
      w.lWrist.rotation.set(0.20, 0.10, -0.15);

      // Rear Right Arm (Lower grip - "right hand holds bottom of stick"):
      w.rShoulder.rotation.set(-0.25, 0.30, -0.70);
      w.rElbow.rotation.set(-0.46, 0, 0);
      w.rWrist.rotation.set(-0.15, 0.10, 0.20);

      // Soles rest firmly on top of the arena stone plinth surface at y = 0.048m (never under floor!)
      w.lHipJoint.rotation.set(-0.11, 0, 0.14);
      w.lKnee.rotation.x = -0.29;
      w.lAnkle.rotation.set(0.44, 0, -0.14);

      w.rHipJoint.rotation.set(0.25, 0, -0.14);
      w.rKnee.rotation.x = -0.45;
      w.rAnkle.rotation.set(0.10, 0, 0.14);

      // Align staff firmly through right hand (bottom of stick) and lead left hand (first grip)
      alignStaffThroughBothHands(w);
    } else if (isSword) {
      // === TALWAR & DHAL COMBAT GUARD ===
      // TALWAR SWORD BLADE POINTS FORWARD TOWARDS OPPONENT (Never backward!)
      // LEGS ALWAYS LOCKED IN COMBAT STANCE (grounded reference posture)
      const breath = Math.sin(t * 1.8) * 0.025;
      w.pelvis.position.y = 0.94;
      w.torso.position.y = 0.14 + breath * 0.2;
      w.torso.rotation.set(0.05, 0.20, 0);
      w.headGroup.rotation.set(0, -0.20, 0);

      w.lHipJoint.rotation.set(-0.11, 0, 0.14);
      w.lKnee.rotation.x = -0.29;
      w.lAnkle.rotation.set(0.44, 0, -0.14);

      w.rHipJoint.rotation.set(0.25, 0, -0.14);
      w.rKnee.rotation.x = -0.45;
      w.rAnkle.rotation.set(0.10, 0, 0.14);

      w.rShoulder.rotation.set(-0.35, 0.2, 0.45);
      w.rElbow.rotation.x = -0.85;

      w.lShoulder.rotation.set(-0.25, -0.3, -0.55);
      w.lElbow.rotation.x = -1.0;

      // BLADE POINTS FORWARD:
      if (w.swordGroup) {
        w.swordGroup.rotation.set(2.55, 0, 0.2);
      }
    } else {
      // === JODI KARRA TWIN STICK GUARD ===
      // LEGS ALWAYS LOCKED IN COMBAT STANCE (grounded reference posture)
      const breath = Math.sin(t * 1.8) * 0.025;
      w.pelvis.position.y = 0.94;
      w.torso.position.y = 0.14 + breath * 0.2;
      w.torso.rotation.set(0, 0, 0);
      w.headGroup.rotation.set(0, 0, 0);

      w.lHipJoint.rotation.set(-0.11, 0, 0.14);
      w.lKnee.rotation.x = -0.29;
      w.lAnkle.rotation.set(0.44, 0, -0.14);

      w.rHipJoint.rotation.set(0.25, 0, -0.14);
      w.rKnee.rotation.x = -0.45;
      w.rAnkle.rotation.set(0.10, 0, 0.14);

      w.rShoulder.rotation.set(-0.4, 0.25, 0.45);
      w.rElbow.rotation.x = -0.75;

      w.lShoulder.rotation.set(-0.4, -0.25, -0.45);
      w.lElbow.rotation.x = -0.75;
    }
  }
}

