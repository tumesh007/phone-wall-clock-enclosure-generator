import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { EnclosureConfig } from '../types/enclosure';
import {
  buildMainHousingGeometry,
  buildBackplateGeometry,
  buildDeskStandGeometry
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
  const filename = `${config.presetId || 'custom'}_clock_enclosure.scad`;
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
  partType: 'housing' | 'backplate' | 'stand' | 'assembly',
  config: EnclosureConfig
) {
  const prefix = config.presetId || 'custom';

  if (partType === 'housing') {
    const geom = buildMainHousingGeometry(config);
    exportSingleMeshStl(geom, `${prefix}_main_housing_print_ready.stl`, (m) => {
      // Print face-down on build plate
      m.rotation.x = Math.PI;
      m.geometry.computeBoundingBox();
      if (m.geometry.boundingBox) {
        m.position.z = -m.geometry.boundingBox.min.z;
      }
    });
  } else if (partType === 'backplate') {
    const geom = buildBackplateGeometry(config);
    exportSingleMeshStl(geom, `${prefix}_backplate_print_ready.stl`, (m) => {
      m.geometry.computeBoundingBox();
      if (m.geometry.boundingBox) {
        m.position.z = -m.geometry.boundingBox.min.z;
      }
    });
  } else if (partType === 'stand') {
    const geom = buildDeskStandGeometry(config);
    exportSingleMeshStl(geom, `${prefix}_desk_stand_print_ready.stl`, (m) => {
      m.geometry.computeBoundingBox();
      if (m.geometry.boundingBox) {
        m.position.z = -m.geometry.boundingBox.min.z;
      }
    });
  } else if (partType === 'assembly') {
    const group = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial();

    const housingMesh = new THREE.Mesh(buildMainHousingGeometry(config), mat);
    const bpMesh = new THREE.Mesh(buildBackplateGeometry(config), mat);
    const standMesh = new THREE.Mesh(buildDeskStandGeometry(config), mat);

    const cavX = config.phoneLength + 2 * config.fitTolerance;
    const cavY = config.phoneWidth + 2 * config.fitTolerance;
    const outerY = cavY + 2 * config.wallThickness;
    const effectiveThickness = config.phoneThickness + config.caseAllowance;
    const outerZ = config.frontBezelThick + effectiveThickness + 0.5 + 3.6;
    const tiltRad = (config.tiltAngle * Math.PI) / 180;

    // Position in table assembly mode
    standMesh.position.set(0, 0, 0);

    const housingGroup = new THREE.Group();
    housingGroup.position.set(0, -config.standDepth / 2 + 18.0, 10.0);
    housingGroup.rotation.x = -tiltRad;

    const innerGroup = new THREE.Group();
    innerGroup.position.set(0, 0, outerY / 2 + 2.0);
    innerGroup.rotation.x = Math.PI / 2;
    innerGroup.rotation.z = Math.PI;

    housingMesh.position.set(0, 0, 0);
    bpMesh.position.set(0, 0, outerZ / 2 - 3.6 / 2);

    innerGroup.add(housingMesh);
    innerGroup.add(bpMesh);
    housingGroup.add(innerGroup);

    group.add(standMesh);
    group.add(housingGroup);
    group.updateMatrixWorld(true);

    const stlData = exporter.parse(group, { binary: true });
    const blob = new Blob([stlData], { type: 'application/octet-stream' });
    triggerBlobDownload(blob, `${prefix}_clock_enclosure_assembly.stl`);
  }
}
