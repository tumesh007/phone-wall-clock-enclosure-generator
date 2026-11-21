import * as THREE from 'three';
import { Evaluator, Brush, SUBTRACTION, ADDITION } from 'three-bvh-csg';
import { EnclosureConfig, BedFitStatus } from '../types/enclosure';

const evaluator = new Evaluator();
evaluator.useGroups = false;

export function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const radius = Math.max(0.5, Math.min(r, w / 2 - 0.1, h / 2 - 0.1));
  const x = -w / 2;
  const y = -h / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + w - radius, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + radius);
  shape.lineTo(x + w, y + h - radius);
  shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  shape.lineTo(x + radius, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  return shape;
}

export function createRoundedBoxGeometry(w: number, h: number, d: number, r: number): THREE.BufferGeometry {
  const shape = createRoundedRectShape(w, h, r);
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: d,
    bevelEnabled: false,
    curveSegments: 16
  });
  geom.center();
  return geom;
}

export function calculateBedFit(config: EnclosureConfig): BedFitStatus {
  const cavX = config.phoneLength + 2 * config.fitTolerance;
  const cavY = config.phoneWidth + 2 * config.fitTolerance;
  const outerX = cavX + 2 * config.wallThickness;
  const outerY = cavY + 2 * config.wallThickness;

  const bpX = cavX + 6.0 - 0.4;
  const bpY = cavY + 6.0 - 0.4;

  const bedX = 180.0;
  const bedY = 180.0;
  const bedZ = 180.0;

  const fitsStraight = outerX <= bedX && outerY <= bedY && config.standDepth <= bedZ;
  const diagonalSpan = (outerX + outerY) * Math.SQRT1_2;
  const fitsDiagonal = diagonalSpan <= bedX;
  const canFitBed = fitsStraight || fitsDiagonal;
  const recommendedAngle: 0 | 45 = fitsStraight ? 0 : 45;

  return {
    fitsStraight,
    fitsDiagonal,
    canFitBed,
    recommendedAngle,
    bodyDims: {
      x: Number(outerX.toFixed(2)),
      y: Number(outerY.toFixed(2)),
      z: Number(config.standDepth.toFixed(2))
    },
    coverDims: {
      x: Number(bpX.toFixed(2)),
      y: Number(bpY.toFixed(2)),
      z: Number(config.backCoverThick.toFixed(2))
    },
    bedDims: { x: bedX, y: bedY, z: bedZ },
    marginStraight: {
      x: Number((bedX - outerX).toFixed(2)),
      y: Number((bedY - outerY).toFixed(2))
    },
    diagonalSpan: Number(diagonalSpan.toFixed(2)),
    maxDiagonalAllowed: bedX
  };
}

// -----------------------------------------------------------------------------
// PART 1: MAIN CLOCK BODY WITH ECHO SHOW 5 SLOPED STAND EXTENSION
// -----------------------------------------------------------------------------
export function buildMainClockBodyGeometry(config: EnclosureConfig): THREE.BufferGeometry {
  const effectiveThickness = config.phoneThickness + config.caseAllowance;
  const cavX = config.phoneLength + 2 * config.fitTolerance;
  const cavY = config.phoneWidth + 2 * config.fitTolerance;
  const cavZ = effectiveThickness + 0.5;

  const outerX = cavX + 2 * config.wallThickness;
  const outerY = cavY + 2 * config.wallThickness;
  const outerR = Math.max(config.cornerRadius + 2.0, 8.0);
  const pocketDepth = config.pocketDepth;
  const standDepth = config.standDepth;

  // 1. Front phone housing block (from Z=0 to Z=pocketDepth)
  const housingGeom = createRoundedBoxGeometry(outerX, outerY, pocketDepth, outerR);
  let bodyBrush = new Brush(housingGeom);
  bodyBrush.position.set(0, 0, pocketDepth / 2);
  bodyBrush.updateMatrixWorld();

  // 2. Integrated Sloped Stand Wedge Extension (extends backwards from lower half)
  const wedgeHeight = 32.0;
  const wedgeZDepth = standDepth - pocketDepth + 2.0;
  const wedgeGeom = createRoundedBoxGeometry(outerX - 6.0, wedgeHeight, wedgeZDepth, 6.0);
  const wedgeBrush = new Brush(wedgeGeom);
  wedgeBrush.position.set(0, -outerY / 2 + wedgeHeight / 2 + 2.0, pocketDepth + wedgeZDepth / 2 - 1.0);
  wedgeBrush.updateMatrixWorld();
  bodyBrush = evaluator.evaluate(bodyBrush, wedgeBrush, ADDITION);

  // --- SUBTRACTIONS ---

  // 1. Active Screen Viewing Window Cutout (through front face at Z=0)
  const winGeom = createRoundedBoxGeometry(
    config.screenLength,
    config.screenWidth,
    config.frontBezelThick + 4.0,
    config.screenCornerRadius
  );
  const winBrush = new Brush(winGeom);
  winBrush.position.set(config.screenOffsetX, config.screenOffsetY, config.frontBezelThick / 2 - 0.5);
  winBrush.updateMatrixWorld();
  bodyBrush = evaluator.evaluate(bodyBrush, winBrush, SUBTRACTION);

  // 2. Open-backed Phone Pocket Cavity (starts behind front bezel, opens to rear)
  const cavDepth = pocketDepth - config.frontBezelThick + 2.0;
  const cavGeom = createRoundedBoxGeometry(cavX, cavY, cavDepth, config.cornerRadius);
  const cavBrush = new Brush(cavGeom);
  cavBrush.position.set(0, 0, config.frontBezelThick + cavDepth / 2);
  cavBrush.updateMatrixWorld();
  bodyBrush = evaluator.evaluate(bodyBrush, cavBrush, SUBTRACTION);

  // 3. Rear Step / Shelf for Hex Back Cover (recessed perimeter)
  const shelfGeom = createRoundedBoxGeometry(cavX + 6.0, cavY + 6.0, config.backCoverThick + 0.4, config.cornerRadius + 2.0);
  const shelfBrush = new Brush(shelfGeom);
  shelfBrush.position.set(0, 0, config.frontBezelThick + cavZ + (config.backCoverThick + 0.4) / 2);
  shelfBrush.updateMatrixWorld();
  bodyBrush = evaluator.evaluate(bodyBrush, shelfBrush, SUBTRACTION);

  // 4. Ergonomic Desk-Stand Angled Foot Plane Cut:
  // Cuts the bottom plane so when placed on desk, screen sits tilted back by tiltAngle!
  const cutBoxGeom = new THREE.BoxGeometry(outerX + 40.0, 100.0, standDepth + 40.0);
  const cutBrush = new Brush(cutBoxGeom);
  const rad = (config.tiltAngle * Math.PI) / 180;
  cutBrush.rotation.x = rad;
  cutBrush.position.set(0, -outerY / 2 - 50.0 * Math.cos(rad), -10.0);
  cutBrush.updateMatrixWorld();
  bodyBrush = evaluator.evaluate(bodyBrush, cutBrush, SUBTRACTION);

  // 5. Open Rear USB-C Channel (drop-in from rear without threading)
  const usbSlotDepth = pocketDepth + 10.0;
  const usbGeom = new THREE.BoxGeometry(
    config.usbSide === 'bottom' ? config.usbWidth : config.wallThickness * 2 + 6.0,
    config.usbSide === 'bottom' ? config.wallThickness * 2 + 6.0 : config.usbWidth,
    usbSlotDepth
  );
  const usbBrush = new Brush(usbGeom);
  const usbCenterZ = config.frontBezelThick + cavZ / 2 + 5.0;
  if (config.usbSide === 'right') {
    usbBrush.position.set(outerX / 2, 0, usbCenterZ);
  } else if (config.usbSide === 'left') {
    usbBrush.position.set(-outerX / 2, 0, usbCenterZ);
  } else {
    usbBrush.position.set(0, -outerY / 2, usbCenterZ);
  }
  usbBrush.updateMatrixWorld();
  bodyBrush = evaluator.evaluate(bodyBrush, usbBrush, SUBTRACTION);

  // 6. Rear Cable Pass-Through Arch through the wedge stand
  const archGeom = createRoundedBoxGeometry(30.0, 36.0, standDepth + 10.0, 6.0);
  const archBrush = new Brush(archGeom);
  archBrush.rotation.x = rad;
  archBrush.position.set(0, -outerY / 2 + 16.0, standDepth / 2);
  archBrush.updateMatrixWorld();
  bodyBrush = evaluator.evaluate(bodyBrush, archBrush, SUBTRACTION);

  // 7. 4 Corner M3 Screw Boss Pilot Holes
  const bossX = cavX / 2 + 1.8;
  const bossY = cavY / 2 + 1.8;
  const holeGeom = new THREE.CylinderGeometry(
    config.screwHoleDiameter / 2,
    config.screwHoleDiameter / 2,
    14.0,
    16
  );
  for (const sx of [-bossX, bossX]) {
    for (const sy of [-bossY, bossY]) {
      const holeBrush = new Brush(holeGeom);
      holeBrush.position.set(sx, sy, config.frontBezelThick + cavZ - 1.0);
      holeBrush.updateMatrixWorld();
      bodyBrush = evaluator.evaluate(bodyBrush, holeBrush, SUBTRACTION);
    }
  }

  const result = bodyBrush.geometry.clone();
  result.computeVertexNormals();
  return result;
}

// -----------------------------------------------------------------------------
// PART 2: SIMPLE HEXAGONAL MESH BACK COVER CSG BUILDER
// -----------------------------------------------------------------------------
export function buildHexBackCoverGeometry(config: EnclosureConfig): THREE.BufferGeometry {
  const cavX = config.phoneLength + 2 * config.fitTolerance;
  const cavY = config.phoneWidth + 2 * config.fitTolerance;
  const bpX = cavX + 6.0 - 0.4;
  const bpY = cavY + 6.0 - 0.4;
  const bpZ = config.backCoverThick;

  // 1. Flat closing plate
  const baseGeom = createRoundedBoxGeometry(bpX, bpY, bpZ, config.cornerRadius + 1.8);
  let coverBrush = new Brush(baseGeom);
  coverBrush.position.set(0, 0, bpZ / 2);
  coverBrush.updateMatrixWorld();

  // 2. Central Hexagonal Honeycomb Ventilation Cells
  const cellRadius = 4.2;
  const cellWall = 1.6;
  const stepX = (cellRadius * 2 + cellWall) * Math.cos(Math.PI / 6);
  const stepY = (cellRadius * 2 + cellWall) * 0.75;
  const gridW = bpX - 54.0;
  const gridH = bpY - 26.0;

  const hexGeom = new THREE.CylinderGeometry(cellRadius, cellRadius, bpZ + 1.5, 6);
  hexGeom.rotateX(Math.PI / 2);

  for (let hx = -gridW / 2; hx <= gridW / 2; hx += stepX) {
    for (let hy = -gridH / 2; hy <= gridH / 2; hy += stepY * 2) {
      const hex1 = new Brush(hexGeom);
      hex1.position.set(hx, hy, bpZ / 2);
      hex1.updateMatrixWorld();
      coverBrush = evaluator.evaluate(coverBrush, hex1, SUBTRACTION);

      const hex2 = new Brush(hexGeom);
      hex2.position.set(hx + stepX / 2, hy + stepY, bpZ / 2);
      hex2.updateMatrixWorld();
      coverBrush = evaluator.evaluate(coverBrush, hex2, SUBTRACTION);
    }
  }

  // 3. Dual Keyhole Wall Mounting Slots (spaced 80mm)
  const keyholeLargeGeom = new THREE.CylinderGeometry(4.0, 4.0, bpZ + 1.0, 16);
  keyholeLargeGeom.rotateX(Math.PI / 2);
  const keyholeSmallGeom = new THREE.CylinderGeometry(2.0, 2.0, bpZ + 1.0, 16);
  keyholeSmallGeom.rotateX(Math.PI / 2);
  const keyholeSlotGeom = new THREE.BoxGeometry(4.0, 7.0, bpZ + 1.0);

  for (const kx of [-40.0, 40.0]) {
    const k1 = new Brush(keyholeLargeGeom);
    k1.position.set(kx, 0, bpZ / 2);
    k1.updateMatrixWorld();
    coverBrush = evaluator.evaluate(coverBrush, k1, SUBTRACTION);

    const k2 = new Brush(keyholeSlotGeom);
    k2.position.set(kx, 3.5, bpZ / 2);
    k2.updateMatrixWorld();
    coverBrush = evaluator.evaluate(coverBrush, k2, SUBTRACTION);

    const k3 = new Brush(keyholeSmallGeom);
    k3.position.set(kx, 7.0, bpZ / 2);
    k3.updateMatrixWorld();
    coverBrush = evaluator.evaluate(coverBrush, k3, SUBTRACTION);
  }

  // 4. Dual 3M Command Strip Recessed Landing Pads
  const padGeom = createRoundedBoxGeometry(16.0, 50.0, 1.2, 3.0);
  for (const cx of [-bpX / 2 + 10.0, bpX / 2 - 10.0]) {
    const pad = new Brush(padGeom);
    pad.position.set(cx, 0, bpZ - 0.6);
    pad.updateMatrixWorld();
    coverBrush = evaluator.evaluate(coverBrush, pad, SUBTRACTION);
  }

  // 5. 4 Corner Countersunk M3 Screw Pass-Through Holes
  const bossX = cavX / 2 + 1.8;
  const bossY = cavY / 2 + 1.8;
  const screwHoleGeom = new THREE.CylinderGeometry(
    (config.screwHoleDiameter + 0.4) / 2,
    (config.screwHoleDiameter + 0.4) / 2,
    bpZ + 1.0,
    16
  );
  const countersinkGeom = new THREE.CylinderGeometry(
    (config.screwHoleDiameter + 2.8) / 2,
    (config.screwHoleDiameter + 0.4) / 2,
    1.6,
    16
  );

  for (const sx of [-bossX, bossX]) {
    for (const sy of [-bossY, bossY]) {
      const sh = new Brush(screwHoleGeom);
      sh.position.set(sx, sy, bpZ / 2);
      sh.updateMatrixWorld();
      coverBrush = evaluator.evaluate(coverBrush, sh, SUBTRACTION);

      const cs = new Brush(countersinkGeom);
      cs.position.set(sx, sy, bpZ - 0.8);
      cs.updateMatrixWorld();
      coverBrush = evaluator.evaluate(coverBrush, cs, SUBTRACTION);
    }
  }

  const result = coverBrush.geometry.clone();
  result.computeVertexNormals();
  return result;
}

// -----------------------------------------------------------------------------
// GHOST PHONE MOCKUP GEOMETRY
// -----------------------------------------------------------------------------
export function buildGhostPhoneGeometry(config: EnclosureConfig): THREE.BufferGeometry {
  const effectiveThickness = config.phoneThickness + config.caseAllowance;
  return createRoundedBoxGeometry(
    config.phoneLength,
    config.phoneWidth,
    effectiveThickness,
    config.cornerRadius
  );
}
