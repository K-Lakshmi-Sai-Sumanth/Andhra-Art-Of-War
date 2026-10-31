import * as THREE from "three";
import { buildRealHumanWarrior } from "./src/components/three/WarriorRig.js";

const scene = new THREE.Scene();
const w = buildRealHumanWarrior(scene);

// Pose legs in combat stance
w.pelvis.position.y = 0.94;
w.lHipJoint.rotation.set(-0.11, 0, 0.14);
w.lKnee.rotation.x = -0.29;
w.lAnkle.rotation.set(0.44, 0, -0.14);
w.rHipJoint.rotation.set(0.25, 0, -0.14);
w.rKnee.rotation.x = -0.45;
w.rAnkle.rotation.set(0.10, 0, 0.14);

scene.updateMatrixWorld(true);

// Let's test the 4 phases of Trinity Infinity:
// Phase 1: Left side spin (0 to 0.25)
// Phase 2: Right side spin (0.25 to 0.50)
// Phase 3: Overhead spin (0.50 to 0.75)
// Phase 4: Combined infinity figure-8 (0.75 to 1.00)

console.log("Simulating Trinity Infinity Stunt across 20 frames:");
for (let i = 0; i < 20; i++) {
  const t = (i / 20) * 6.4;
  const cycleDuration = 6.4;
  const progress = (t % cycleDuration) / cycleDuration;

  let rSx, rSy, rSz, rEx;
  let lSx, lSy, lSz, lEx;
  let torsoY, headY;
  let spinAngle;

  if (progress < 0.25) {
    // Phase 1: Left side spin — staff sweeps and spins on the left flank
    const p = progress / 0.25;
    spinAngle = p * Math.PI * 6; // 3 full spins
    torsoY = 0.35 + Math.sin(spinAngle) * 0.15;
    headY = -0.30;

    // Both arms on the left flank driving the circular sweep
    rSx = -0.40 + Math.sin(spinAngle) * 0.35;
    rSy = 0.35 + Math.cos(spinAngle) * 0.20;
    rSz = -0.60;
    rEx = -0.65 + Math.cos(spinAngle) * 0.25;

    lSx = -1.15 + Math.sin(spinAngle) * 0.40;
    lSy = 0.30 + Math.cos(spinAngle) * 0.25;
    lSz = 0.45;
    lEx = -0.50 + Math.sin(spinAngle) * 0.25;
  } else if (progress < 0.50) {
    // Phase 2: Right side spin — staff sweeps and spins on the right flank
    const p = (progress - 0.25) / 0.25;
    spinAngle = p * Math.PI * 6;
    torsoY = -0.15 + Math.sin(spinAngle) * 0.15;
    headY = 0.15;

    rSx = -0.50 + Math.sin(spinAngle) * 0.35;
    rSy = 0.10 + Math.cos(spinAngle) * 0.20;
    rSz = -0.50;
    rEx = -0.70 + Math.cos(spinAngle) * 0.25;

    lSx = -1.00 + Math.sin(spinAngle) * 0.40;
    lSy = -0.15 + Math.cos(spinAngle) * 0.25;
    lSz = 0.55;
    lEx = -0.55 + Math.sin(spinAngle) * 0.25;
  } else if (progress < 0.75) {
    // Phase 3: Overhead spin — staff raised and spinning horizontally overhead
    const p = (progress - 0.50) / 0.25;
    spinAngle = p * Math.PI * 8; // 4 fast overhead spins
    torsoY = 0.10;
    headY = -0.10;

    rSx = -1.55 + Math.sin(spinAngle) * 0.25;
    rSy = 0.15 + Math.cos(spinAngle) * 0.20;
    rSz = -0.35;
    rEx = -0.40;

    lSx = -1.65 + Math.sin(spinAngle) * 0.25;
    lSy = -0.15 - Math.cos(spinAngle) * 0.20;
    lSz = 0.30;
    lEx = -0.35;
  } else {
    // Phase 4: Combined infinity figure-8 whirlwind
    const p = (progress - 0.75) / 0.25;
    spinAngle = p * Math.PI * 8;
    torsoY = Math.sin(spinAngle * 0.5) * 0.30;
    headY = -torsoY * 0.5;

    rSx = -0.45 + Math.sin(spinAngle) * 0.40;
    rSy = 0.25 + Math.cos(spinAngle * 0.5) * 0.25;
    rSz = -0.55;
    rEx = -0.60 + Math.cos(spinAngle) * 0.25;

    lSx = -1.10 + Math.sin(spinAngle) * 0.45;
    lSy = 0.10 - Math.cos(spinAngle * 0.5) * 0.25;
    lSz = 0.45;
    lEx = -0.45 + Math.sin(spinAngle) * 0.25;
  }

  w.torso.rotation.y = torsoY;
  w.headGroup.rotation.y = headY;
  w.rShoulder.rotation.set(rSx, rSy, rSz);
  w.rElbow.rotation.set(rEx, 0, 0);
  w.lShoulder.rotation.set(lSx, lSy, lSz);
  w.lElbow.rotation.set(lEx, 0, 0);

  // Update matrices to get hand world positions
  scene.updateMatrixWorld(true);

  const rH = new THREE.Vector3();
  const lH = new THREE.Vector3();
  w.rHand.getWorldPosition(rH);
  w.lHand.getWorldPosition(lH);

  // Vector from rH to lH
  const worldDir = new THREE.Vector3().subVectors(lH, rH).normalize();
  const dist = rH.distanceTo(lH);

  // Align rWrist so right hand points directly along the staff!
  const rWristWorldQuat = new THREE.Quaternion();
  w.rWrist.getWorldQuaternion(rWristWorldQuat);
  const localDirRWrist = worldDir.clone().applyQuaternion(rWristWorldQuat.clone().invert()).normalize();
  const rWristQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), localDirRWrist);
  w.rWrist.quaternion.copy(rWristQuat);

  // Align lWrist so left hand points directly along the staff!
  const lWristWorldQuat = new THREE.Quaternion();
  w.lWrist.getWorldQuaternion(lWristWorldQuat);
  const localDirLWrist = worldDir.clone().applyQuaternion(lWristWorldQuat.clone().invert()).normalize();
  const lWristQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), localDirLWrist);
  w.lWrist.quaternion.copy(lWristQuat);

  // In rHand local space, staff is along local Y (0, 1, 0)!
  w.staffGroup.rotation.set(0, 0, 0);
  w.staffMesh.position.set(0, 0.81, 0);
  // Axial spin: the staff spins around its long axis!
  w.staffMesh.rotation.y = spinAngle;

  scene.updateMatrixWorld(true);

  // Check alignment
  const sB = new THREE.Vector3(0, -0.89, 0);
  const sT = new THREE.Vector3(0, 0.89, 0);
  w.staffMesh.localToWorld(sB);
  w.staffMesh.localToWorld(sT);
  const staffDir = new THREE.Vector3().subVectors(sT, sB).normalize();

  const rHandQuat = new THREE.Quaternion();
  w.rHand.getWorldQuaternion(rHandQuat);
  const handDir = new THREE.Vector3(0, 1, 0).applyQuaternion(rHandQuat).normalize();
  const handAngleDiff = handDir.angleTo(staffDir) * 180 / Math.PI;

  const line = new THREE.Line3(sB, sT);
  const cR = new THREE.Vector3();
  line.closestPointToPoint(rH, true, cR);

  console.log(`Frame ${i} [p=${progress.toFixed(2)}]: dist=${dist.toFixed(2)}m, handAngleDiff=${handAngleDiff.toFixed(1)}°, rH distToStaff=${(rH.distanceTo(cR)*100).toFixed(1)}cm, staffDir: (${staffDir.x.toFixed(2)}, ${staffDir.y.toFixed(2)}, ${staffDir.z.toFixed(2)})`);
}

