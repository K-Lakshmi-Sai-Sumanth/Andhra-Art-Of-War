import * as THREE from "three";
import { buildRealHumanWarrior } from "./src/components/three/WarriorRig.js";

const scene = new THREE.Scene();
const w = buildRealHumanWarrior(scene);

// Check that staffMesh and staffGroup exist and have correct materials
console.log("staffMesh:", !!w.staffMesh, "staffGroup:", !!w.staffGroup);
console.log("rWrist:", !!w.rWrist, "lWrist:", !!w.lWrist);
console.log("rHand:", !!w.rHand, "lHand:", !!w.lHand);

