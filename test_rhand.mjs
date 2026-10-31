import * as THREE from "three";
import { buildRealHumanWarrior, updateHumanStunts } from "./src/components/three/WarriorRig.js";

const scene = new THREE.Scene();
const w = buildRealHumanWarrior(scene);
updateHumanStunts(w, 0, "combat_stance", null);
scene.updateMatrixWorld(true);

console.log("=== INSPECTING RIGHT HAND IN COMBAT STANCE ===");

const rHandWorldPos = new THREE.Vector3();
w.rHand.getWorldPosition(rHandWorldPos);
console.log("rHand World Pos:", rHandWorldPos);

const rHandWorldQuat = new THREE.Quaternion();
w.rHand.getWorldQuaternion(rHandWorldQuat);
const rHandEuler = new THREE.Euler().setFromQuaternion(rHandWorldQuat);
console.log("rHand World Euler (deg):",
  (rHandEuler.x * 180 / Math.PI).toFixed(1),
  (rHandEuler.y * 180 / Math.PI).toFixed(1),
  (rHandEuler.z * 180 / Math.PI).toFixed(1)
);

// Staff world orientation
const staffWorldQuat = new THREE.Quaternion();
w.staffMesh.getWorldQuaternion(staffWorldQuat);
const staffEuler = new THREE.Euler().setFromQuaternion(staffWorldQuat);
console.log("Staff World Euler (deg):",
  (staffEuler.x * 180 / Math.PI).toFixed(1),
  (staffEuler.y * 180 / Math.PI).toFixed(1),
  (staffEuler.z * 180 / Math.PI).toFixed(1)
);

// What are the children of rHand?
w.rHand.children.forEach((c) => {
  const p = new THREE.Vector3();
  c.getWorldPosition(p);
  const pInStaff = w.staffMesh.worldToLocal(p.clone());
  console.log(`Child [${c.type}] local in rHand:`, c.position, "| World:", p, "| In Staff local:", pInStaff);
});

