import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { EnclosureConfig } from '../types/enclosure';
import {
  buildMainClockBodyGeometry,
  buildHexBackCoverGeometry
} from './geometryBuilder';
import { generateScadSource } from './scadGenerator';

const exporter = new STLExporter();

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadScadFile(config: EnclosureConfig) {
  const code = generateScadSource(config);
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
  const filename = `${config.presetId || 'custom'}_2part_clock_housing.scad`;
  triggerBlobDownload(blob, filename);
}

export function exportSingleMeshStl(
  geometry: THREE.BufferGeometry,
  filename: string,
  orientationTransform?: (mesh: THREE.Mesh) => void
) {
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry.clone(), material);

  if (orientationTransform) {
    orientationTransform(mesh);
  }
  mesh.updateMatrixWorld(true);

  // Generate binary STL buffer
  const stlData = exporter.parse(mesh, { binary: true });
  const blob = new Blob([stlData], { type: 'application/octet-stream' });
  triggerBlobDownload(blob, filename);
}

export function exportPartStl(
  partType: 'main_body' | 'back_cover' | 'assembly',
  config: EnclosureConfig
) {
  const prefix = config.presetId || 'custom';

  if (partType === 'main_body') {
    // Part 1: Main Clock Body (front faceplate + body + base foot)
    const geom = buildMainClockBodyGeometry(config);
    exportSingleMeshStl(geom, `${prefix}_part1_clock_body_print_ready.stl`, (m) => {
      // Already oriented face-down flat at Z=0
      m.position.set(0, 0, 0);
    });
  } else if (partType === 'back_cover') {
    // Part 2: Hexagonal Honeycomb Ventilation Back Cover
    const geom = buildHexBackCoverGeometry(config);
    exportSingleMeshStl(geom, `${prefix}_part2_hex_back_cover_print_ready.stl`, (m) => {
      // Flat at Z=0
      m.position.set(0, 0, 0);
    });
  } else if (partType === 'assembly') {
    const group = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial();

    const bodyMesh = new THREE.Mesh(buildMainClockBodyGeometry(config), mat);
    const coverMesh = new THREE.Mesh(buildHexBackCoverGeometry(config), mat);

    const effectiveThickness = config.phoneThickness + config.caseAllowance;
    const cavZ = effectiveThickness + 0.5;
    const chassisDepth = Math.max(config.baseDepth, cavZ + config.frontBezelThick + config.backCoverThick + 2.0);

    bodyMesh.position.set(0, 0, 0);
    coverMesh.position.set(0, 0, chassisDepth - config.backCoverThick);

    const standGroup = new THREE.Group();
    standGroup.add(bodyMesh);
    standGroup.add(coverMesh);

    // Stand upright on desk foot
    const cavY = config.phoneWidth + 2 * config.fitTolerance;
    const outerY = cavY + 2 * config.wallThickness;
    standGroup.position.set(0, outerY / 2, 0);
    standGroup.rotation.x = Math.PI / 2;

    group.add(standGroup);
    group.updateMatrixWorld(true);

    const stlData = exporter.parse(group, { binary: true });
    const blob = new Blob([stlData], { type: 'application/octet-stream' });
    triggerBlobDownload(blob, `${prefix}_2part_clock_assembly.stl`);
  }
}
