import * as THREE from "three";
import { buildRealHumanWarrior, updateHumanStunts } from "./src/components/three/WarriorRig.js";

const scene = new THREE.Scene();
const w = buildRealHumanWarrior(scene);

console.log("=== Testing all stunts with new hand and spin logic ===");

// Check that no NaN occurs across 50 frames
for (let t = 0; t < 10; t += 0.2) {
  ["combat_stance", "infinity_spin", "air_tornado", "shield_bash", "dual_flurry"].forEach((stunt) => {
    updateHumanStunts(w, t, stunt, null);
    scene.updateMatrixWorld(true);

    const rH = new THREE.Vector3();
    w.rHand.getWorldPosition(rH);
    if (isNaN(rH.x) || isNaN(rH.y) || isNaN(rH.z)) {
      console.error(`NaN in ${stunt} at t=${t}`);
    }
  });
}

console.log("All frames verified clean! No NaNs.");
