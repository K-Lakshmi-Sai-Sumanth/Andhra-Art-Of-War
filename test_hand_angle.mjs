import * as THREE from "three";
import { buildRealHumanWarrior } from "./src/components/three/WarriorRig.js";

const scene = new THREE.Scene();
const w = buildRealHumanWarrior(scene);

// Pose torso and legs
w.pelvis.position.y = 0.94;
w.torso.rotation.set(0.12, 0.38, 0);
w.headGroup.rotation.set(0, -0.38, 0);

scene.updateMatrixWorld(true);

// Test realistic arm flexion
for (let rSx = -1.2; rSx <= -0.4; rSx += 0.2) {
  for (let rEx = -1.8; rEx <= -0.8; rEx += 0.2) {
    w.rShoulder.rotation.set(rSx, 0.25, -0.40);
    w.rElbow.rotation.set(rEx, 0, 0);
    w.rShoulder.updateMatrixWorld(true);

    const rElbowPos = new THREE.Vector3();
    w.rElbow.getWorldPosition(rElbowPos);
    const rWristPos = new THREE.Vector3();
    w.rWrist.getWorldPosition(rWristPos);
    const forearmDir = new THREE.Vector3().subVectors(rWristPos, rElbowPos).normalize();
    const rH = new THREE.Vector3();
    w.rHand.getWorldPosition(rH);

    console.log(`rSx: ${rSx.toFixed(1)}, rEx: ${rEx.toFixed(1)} => forearmDir.y: ${forearmDir.y.toFixed(2)}, z: ${forearmDir.z.toFixed(2)} | rH: (${rH.x.toFixed(2)}, ${rH.y.toFixed(2)}, ${rH.z.toFixed(2)})`);
  }
}
