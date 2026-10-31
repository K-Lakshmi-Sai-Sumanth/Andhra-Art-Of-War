import * as THREE from "three";
import { buildRealHumanWarrior } from "./src/components/three/WarriorRig.js";

const scene = new THREE.Scene();
const w = buildRealHumanWarrior(scene);

w.pelvis.position.y = 0.94;
w.torso.rotation.set(0.12, 0.38, 0);
w.headGroup.rotation.set(0, -0.38, 0);

w.lHipJoint.rotation.set(-0.11, 0, 0.14);
w.lKnee.rotation.x = -0.29;
w.lAnkle.rotation.set(0.44, 0, -0.14);
w.rHipJoint.rotation.set(0.25, 0, -0.14);
w.rKnee.rotation.x = -0.45;
w.rAnkle.rotation.set(0.10, 0, 0.14);

w.rShoulder.rotation.set(-0.25, 0.30, -0.70);
w.rElbow.rotation.set(-0.46, 0, 0);

w.lShoulder.rotation.set(-1.30, 0.30, 0.46);
w.lElbow.rotation.set(-0.42, 0, 0);

scene.updateMatrixWorld(true);

const rH = new THREE.Vector3();
const lH = new THREE.Vector3();
w.rHand.getWorldPosition(rH);
w.lHand.getWorldPosition(lH);
const worldDir = new THREE.Vector3().subVectors(lH, rH).normalize();

// Align rWrist
const rWristWorldQuat = new THREE.Quaternion();
w.rWrist.getWorldQuaternion(rWristWorldQuat);
const localDirRWrist = worldDir.clone().applyQuaternion(rWristWorldQuat.clone().invert()).normalize();
const rWristQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), localDirRWrist);
w.rWrist.quaternion.copy(rWristQuat);

// Align lWrist
const lWristWorldQuat = new THREE.Quaternion();
w.lWrist.getWorldQuaternion(lWristWorldQuat);
const localDirLWrist = worldDir.clone().applyQuaternion(lWristWorldQuat.clone().invert()).normalize();
const lWristQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), localDirLWrist);
w.lWrist.quaternion.copy(lWristQuat);

scene.updateMatrixWorld(true);

// Now in rHand, the staff is along local Y (0, 1, 0)!
// So staffGroup rotation in rHand can simply be (0, 0, 0)!
w.staffGroup.rotation.set(0, 0, 0);
w.staffMesh.position.set(0, 0.81, 0);
w.staffMesh.rotation.set(0, 0, 0);

scene.updateMatrixWorld(true);

const sB = new THREE.Vector3(0, -0.89, 0);
const sT = new THREE.Vector3(0, 0.89, 0);
w.staffMesh.localToWorld(sB);
w.staffMesh.localToWorld(sT);

const line = new THREE.Line3(sB, sT);
const cR = new THREE.Vector3();
w.rHand.getWorldPosition(rH);
line.closestPointToPoint(rH, true, cR);
console.log("dist rHand to staff:", rH.distanceTo(cR));

const cL = new THREE.Vector3();
w.lHand.getWorldPosition(lH);
line.closestPointToPoint(lH, true, cL);
console.log("dist lHand to staff:", lH.distanceTo(cL));

const staffDir = new THREE.Vector3().subVectors(sT, sB).normalize();
const handWorldQuat = new THREE.Quaternion();
w.rHand.getWorldQuaternion(handWorldQuat);
const handDir = new THREE.Vector3(0, 1, 0).applyQuaternion(handWorldQuat).normalize();
console.log("Angle between hand and staff:", (handDir.angleTo(staffDir) * 180 / Math.PI).toFixed(2) + "°");
