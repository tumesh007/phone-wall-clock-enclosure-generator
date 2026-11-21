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
  const effectiveThickness = config.phoneThickness + config.caseAllowance;
  const cavZ = effectiveThickness + 0.5;
  const backplateThick = 3.6;
  const outerZ = config.frontBezelThick + cavZ + backplateThick;

  const bedX = 180.0;
  const bedY = 180.0;
  const bedZ = 180.0;

  const fitsStraight = outerX <= bedX && outerY <= bedY && outerZ <= bedZ;
  const diagonalSpan = (outerX + outerY) * Math.SQRT1_2;
  const fitsDiagonal = diagonalSpan <= bedX;
  const canFitBed = fitsStraight || fitsDiagonal;
  const recommendedAngle: 0 | 45 = fitsStraight ? 0 : 45;

  return {
    fitsStraight,
    fitsDiagonal,
    canFitBed,
    recommendedAngle,
    housingDims: {
      x: Number(outerX.toFixed(2)),
      y: Number(outerY.toFixed(2)),
      z: Number(outerZ.toFixed(2))
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
// MAIN HOUSING CSG BUILDER
// -----------------------------------------------------------------------------
export function buildMainHousingGeometry(config: EnclosureConfig): THREE.BufferGeometry {
  const effectiveThickness = config.phoneThickness + config.caseAllowance;
  const cavX = config.phoneLength + 2 * config.fitTolerance;
  const cavY = config.phoneWidth + 2 * config.fitTolerance;
  const cavZ = effectiveThickness + 0.5;

  const outerX = cavX + 2 * config.wallThickness;
  const outerY = cavY + 2 * config.wallThickness;
  const backplateThick = 3.6;
  const outerZ = config.frontBezelThick + cavZ + backplateThick;
  const outerR = Math.max(config.cornerRadius + 2.0, 6.0);

  // 1. Base outer shell
  const outerGeom = createRoundedBoxGeometry(outerX, outerY, outerZ, outerR);
  let mainBrush = new Brush(outerGeom);
  mainBrush.updateMatrixWorld();

  // 1b. Front Stepped Bezel Detail (Add slight step on front face)
  const stepGeom = createRoundedBoxGeometry(outerX - 1.2, outerY - 1.2, config.frontBezelThick * 0.4, outerR - 0.6);
  const stepBrush = new Brush(stepGeom);
  stepBrush.position.set(0, 0, -outerZ / 2 + config.frontBezelThick * 0.2);
  stepBrush.updateMatrixWorld();
  mainBrush = evaluator.evaluate(mainBrush, stepBrush, ADDITION);

  // 2. Screen Window Cutout
  const winGeom = createRoundedBoxGeometry(
    config.screenLength,
    config.screenWidth,
    config.frontBezelThick + 8.0,
    config.screenCornerRadius
  );
  const winBrush = new Brush(winGeom);
  winBrush.position.set(config.screenOffsetX, config.screenOffsetY, -outerZ / 2 + config.frontBezelThick / 2);
  winBrush.updateMatrixWorld();
  mainBrush = evaluator.evaluate(mainBrush, winBrush, SUBTRACTION);

  // 3. Internal Phone Cavity
  const cavGeom = createRoundedBoxGeometry(cavX, cavY, cavZ + 0.2, config.cornerRadius);
  const cavBrush = new Brush(cavGeom);
  cavBrush.position.set(0, 0, -outerZ / 2 + config.frontBezelThick + cavZ / 2);
  cavBrush.updateMatrixWorld();
  mainBrush = evaluator.evaluate(mainBrush, cavBrush, SUBTRACTION);

  // 4. Backplate Shelf / Recess
  const shelfGeom = createRoundedBoxGeometry(cavX + 3.6, cavY + 3.6, backplateThick + 0.2, config.cornerRadius + 1.8);
  const shelfBrush = new Brush(shelfGeom);
  shelfBrush.position.set(0, 0, outerZ / 2 - backplateThick / 2);
  shelfBrush.updateMatrixWorld();
  mainBrush = evaluator.evaluate(mainBrush, shelfBrush, SUBTRACTION);

  // 5. USB Port Cutout
  const usbGeom = new THREE.BoxGeometry(
    config.usbSide === 'bottom' ? config.usbWidth : config.wallThickness * 2 + 6.0,
    config.usbSide === 'bottom' ? config.wallThickness * 2 + 6.0 : config.usbWidth,
    config.usbHeight
  );
  const usbBrush = new Brush(usbGeom);
  if (config.usbSide === 'right') {
    usbBrush.position.set(outerX / 2, 0, -outerZ / 2 + config.frontBezelThick + cavZ / 2);
  } else if (config.usbSide === 'left') {
    usbBrush.position.set(-outerX / 2, 0, -outerZ / 2 + config.frontBezelThick + cavZ / 2);
  } else {
    usbBrush.position.set(0, -outerY / 2, -outerZ / 2 + config.frontBezelThick + cavZ / 2);
  }
  usbBrush.updateMatrixWorld();
  mainBrush = evaluator.evaluate(mainBrush, usbBrush, SUBTRACTION);

  // 6. Loudspeaker Perforations (4 holes along lower edge)
  const holeGeom = new THREE.CylinderGeometry(1.5, 1.5, config.wallThickness * 2 + 4.0, 16);
  holeGeom.rotateX(Math.PI / 2);
  for (let i = -3; i >= -6; i--) {
    const holeBrush = new Brush(holeGeom);
    holeBrush.position.set(
      outerX / 2 - 25.0 + i * 4.2,
      -outerY / 2,
      -outerZ / 2 + config.frontBezelThick + cavZ / 2
    );
    holeBrush.updateMatrixWorld();
    mainBrush = evaluator.evaluate(mainBrush, holeBrush, SUBTRACTION);
  }

  // 7. Snap-fit Detent Notches
  const notchGeom = new THREE.BoxGeometry(18.0, 0.9, 1.8);
  for (const side of [-1, 1]) {
    const notchBrush = new Brush(notchGeom);
    notchBrush.position.set(0, side * (cavY / 2 + 1.6), outerZ / 2 - backplateThick / 2);
    notchBrush.updateMatrixWorld();
    mainBrush = evaluator.evaluate(mainBrush, notchBrush, SUBTRACTION);
  }

  const result = mainBrush.geometry.clone();
  result.computeVertexNormals();
  return result;
}

// -----------------------------------------------------------------------------
// HONEYCOMB BACKPLATE CSG BUILDER
// -----------------------------------------------------------------------------
export function buildBackplateGeometry(config: EnclosureConfig): THREE.BufferGeometry {
  const cavX = config.phoneLength + 2 * config.fitTolerance;
  const cavY = config.phoneWidth + 2 * config.fitTolerance;
  const bpX = cavX + 3.6 - 0.4;
  const bpY = cavY + 3.6 - 0.4;
  const bpZ = 3.6;

  const baseGeom = createRoundedBoxGeometry(bpX, bpY, bpZ, config.cornerRadius + 1.6);
  let bpBrush = new Brush(baseGeom);
  bpBrush.updateMatrixWorld();

  // Snap tabs on top/bottom
  const tabGeom = new THREE.BoxGeometry(17.0, 0.6, 1.4);
  for (const side of [-1, 1]) {
    const tabBrush = new Brush(tabGeom);
    tabBrush.position.set(0, side * (bpY / 2 + 0.25), 0);
    tabBrush.updateMatrixWorld();
    bpBrush = evaluator.evaluate(bpBrush, tabBrush, ADDITION);
  }

  // Honeycomb ventilation slots
  const cellRadius = 4.2;
  const cellWall = 1.6;
  const stepX = (cellRadius * 2 + cellWall) * Math.cos(Math.PI / 6);
  const stepY = (cellRadius * 2 + cellWall) * 0.75;
  const gridW = bpX - 48.0;
  const gridH = bpY - 22.0;

  const hexGeom = new THREE.CylinderGeometry(cellRadius, cellRadius, bpZ + 1.0, 6);
  hexGeom.rotateX(Math.PI / 2);

  for (let hx = -gridW / 2; hx <= gridW / 2; hx += stepX) {
    for (let hy = -gridH / 2; hy <= gridH / 2; hy += stepY * 2) {
      // Hex cell 1
      const hex1 = new Brush(hexGeom);
      hex1.position.set(hx, hy, 0);
      hex1.updateMatrixWorld();
      bpBrush = evaluator.evaluate(bpBrush, hex1, SUBTRACTION);

      // Hex cell 2 (offset)
      const hex2 = new Brush(hexGeom);
      hex2.position.set(hx + stepX / 2, hy + stepY, 0);
      hex2.updateMatrixWorld();
      bpBrush = evaluator.evaluate(bpBrush, hex2, SUBTRACTION);
    }
  }

  // Dual keyhole wall mounting slots (spaced 80mm)
  const keyholeLargeGeom = new THREE.CylinderGeometry(4.0, 4.0, bpZ + 1.0, 16);
  keyholeLargeGeom.rotateX(Math.PI / 2);
  const keyholeSmallGeom = new THREE.CylinderGeometry(2.0, 2.0, bpZ + 1.0, 16);
  keyholeSmallGeom.rotateX(Math.PI / 2);
  const keyholeSlotGeom = new THREE.BoxGeometry(4.0, 7.0, bpZ + 1.0);

  for (const kx of [-40.0, 40.0]) {
    const k1 = new Brush(keyholeLargeGeom);
    k1.position.set(kx, 0, 0);
    k1.updateMatrixWorld();
    bpBrush = evaluator.evaluate(bpBrush, k1, SUBTRACTION);

    const k2 = new Brush(keyholeSlotGeom);
    k2.position.set(kx, 3.5, 0);
    k2.updateMatrixWorld();
    bpBrush = evaluator.evaluate(bpBrush, k2, SUBTRACTION);

    const k3 = new Brush(keyholeSmallGeom);
    k3.position.set(kx, 7.0, 0);
    k3.updateMatrixWorld();
    bpBrush = evaluator.evaluate(bpBrush, k3, SUBTRACTION);
  }

  // 3M Command strip recessed pockets
  const padGeom = createRoundedBoxGeometry(16.0, 52.0, 1.3, 3.0);
  for (const cx of [-bpX / 2 + 10.0, bpX / 2 - 10.0]) {
    const pad = new Brush(padGeom);
    pad.position.set(cx, 0, bpZ / 2 - 0.6);
    pad.updateMatrixWorld();
    bpBrush = evaluator.evaluate(bpBrush, pad, SUBTRACTION);
  }

  // Cable pass-through notch on USB side
  const notchWidth = config.usbWidth + 4.0;
  const cableNotchGeom = new THREE.BoxGeometry(8.0, notchWidth, bpZ + 1.0);
  const cableNotch = new Brush(cableNotchGeom);
  if (config.usbSide === 'right') {
    cableNotch.position.set(bpX / 2, 0, 0);
  } else if (config.usbSide === 'left') {
    cableNotch.position.set(-bpX / 2, 0, 0);
  } else {
    cableNotch.position.set(0, -bpY / 2, 0);
  }
  cableNotch.updateMatrixWorld();
  bpBrush = evaluator.evaluate(bpBrush, cableNotch, SUBTRACTION);

  const result = bpBrush.geometry.clone();
  result.computeVertexNormals();
  return result;
}

// -----------------------------------------------------------------------------
// DETACHABLE 15-DEGREE WEDGE DESK STAND CSG BUILDER
// -----------------------------------------------------------------------------
export function buildDeskStandGeometry(config: EnclosureConfig): THREE.BufferGeometry {
  const baseW = config.standWidth;
  const baseD = config.standDepth;
  const baseH = 42.0;

  const cavX = config.phoneLength + 2 * config.fitTolerance;
  const cavY = config.phoneWidth + 2 * config.fitTolerance;
  const outerX = cavX + 2 * config.wallThickness;
  const effectiveThickness = config.phoneThickness + config.caseAllowance;
  const cavZ = effectiveThickness + 0.5;
  const outerZ = config.frontBezelThick + cavZ + 3.6;

  // 1. Base Stand Solid Wedge Block
  const baseGeom = createRoundedBoxGeometry(baseW, baseD, baseH, 8.0);
  let standBrush = new Brush(baseGeom);
  standBrush.position.set(0, 0, baseH / 2);
  standBrush.updateMatrixWorld();

  // 2. Cradle slot at tiltAngle
  const cradleGeom = createRoundedBoxGeometry(outerX + 2.0, outerZ + 2.2, 45.0, 6.0);
  const cradleBrush = new Brush(cradleGeom);
  const rad = (config.tiltAngle * Math.PI) / 180;
  cradleBrush.rotation.x = -rad;
  cradleBrush.position.set(0, -baseD / 2 + 18.0, baseH - 12.0);
  cradleBrush.updateMatrixWorld();
  standBrush = evaluator.evaluate(standBrush, cradleBrush, SUBTRACTION);

  // 3. Rear Cable Pass-through Arch
  const archGeom = createRoundedBoxGeometry(28.0, 26.0, 24.0, 4.0);
  const archBrush = new Brush(archGeom);
  archBrush.position.set(0, baseD / 2 - 12.0, baseH / 2 - 4.0);
  archBrush.updateMatrixWorld();
  standBrush = evaluator.evaluate(standBrush, archBrush, SUBTRACTION);

  // 4. Front Speaker Relief Cutouts
  const speakerGeom = new THREE.CylinderGeometry(6.0, 6.0, 22.0, 16);
  speakerGeom.rotateZ(Math.PI / 2);
  for (const sx of [-30.0, 30.0]) {
    const spBrush = new Brush(speakerGeom);
    spBrush.position.set(sx, -baseD / 2 + 6.0, baseH - 10.0);
    spBrush.updateMatrixWorld();
    standBrush = evaluator.evaluate(standBrush, spBrush, SUBTRACTION);
  }

  // 5. Anti-slip Rubber Feet Pockets (4 corners, 8.5mm x 1.5mm)
  const footGeom = new THREE.CylinderGeometry(4.25, 4.25, 2.0, 16);
  for (const fx of [-baseW / 2 + 16.0, baseW / 2 - 16.0]) {
    for (const fy of [-baseD / 2 + 12.0, baseD / 2 - 12.0]) {
      const footBrush = new Brush(footGeom);
      footBrush.position.set(fx, fy, 0.5);
      footBrush.updateMatrixWorld();
      standBrush = evaluator.evaluate(standBrush, footBrush, SUBTRACTION);
    }
  }

  // 6. Internal Weight-saving Hollow Cavity
  const hollowGeom = createRoundedBoxGeometry(baseW - 38.0, 12.0, baseH, 4.0);
  const hollowBrush = new Brush(hollowGeom);
  hollowBrush.position.set(0, baseD / 2 - 10.0, baseH / 2 + 4.0);
  hollowBrush.updateMatrixWorld();
  standBrush = evaluator.evaluate(standBrush, hollowBrush, SUBTRACTION);

  const result = standBrush.geometry.clone();
  result.computeVertexNormals();
  return result;
}

// -----------------------------------------------------------------------------
// PHONE MOCKUP GEOMETRY
// -----------------------------------------------------------------------------
export function buildPhoneMockupGeometry(config: EnclosureConfig): THREE.BufferGeometry {
  const effectiveThickness = config.phoneThickness + config.caseAllowance;
  return createRoundedBoxGeometry(
    config.phoneLength,
    config.phoneWidth,
    effectiveThickness,
    config.cornerRadius
  );
}
