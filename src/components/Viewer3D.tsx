import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EnclosureConfig, BedFitStatus } from '../types/enclosure';
import {
  buildMainClockBodyGeometry,
  buildHexBackCoverGeometry,
  buildGhostPhoneGeometry
} from '../cad/geometryBuilder';
import { ViewGizmo, CameraViewPreset } from './ViewGizmo';
import { FitBadge } from './FitBadge';

interface Viewer3DProps {
  config: EnclosureConfig;
  fit: BedFitStatus;
  onToggleRotate: () => void;
}

export const Viewer3D: React.FC<Viewer3DProps> = ({ config, fit, onToggleRotate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const bedGroupRef = useRef<THREE.Group | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090e17');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(160, 140, 240);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 1000;
    controls.minDistance = 20;
    controls.target.set(0, 40, 0);
    controlsRef.current = controls;

    // 5. Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.95);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight1.position.set(150, 300, 200);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.4);
    dirLight2.position.set(-150, -100, -150);
    scene.add(dirLight2);

    // 6. Groups
    const bedGroup = new THREE.Group();
    scene.add(bedGroup);
    bedGroupRef.current = bedGroup;

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 7. Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Bambu Lab A1 Mini Bed Plate
  useEffect(() => {
    if (!bedGroupRef.current) return;
    const bedGroup = bedGroupRef.current;

    while (bedGroup.children.length > 0) {
      const child = bedGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      bedGroup.remove(child);
    }

    if (!config.showA1MiniBed) return;

    // 180 x 180 mm plate
    const bedPlateGeom = new THREE.BoxGeometry(180, 180, 2);
    const bedPlateMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.2
    });
    const bedPlate = new THREE.Mesh(bedPlateGeom, bedPlateMat);
    bedPlate.rotation.x = -Math.PI / 2;
    bedPlate.position.y = -1;
    bedPlate.receiveShadow = true;
    bedGroup.add(bedPlate);

    // Grid lines
    const grid = new THREE.GridHelper(180, 18, 0x0ea5e9, 0x334155);
    grid.position.y = 0.05;
    bedGroup.add(grid);

    // 180mm Build Volume Wireframe Box
    const boxGeom = new THREE.BoxGeometry(180, 180, 180);
    const edges = new THREE.EdgesGeometry(boxGeom);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.25
    });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.y = 90;
    bedGroup.add(wireframe);
  }, [config.showA1MiniBed]);

  // Update 3D Geometry
  useEffect(() => {
    if (!modelGroupRef.current) return;
    const modelGroup = modelGroupRef.current;

    while (modelGroup.children.length > 0) {
      const obj = modelGroup.children[0];
      obj.traverse((child) => {
        if ((child as THREE.Mesh).geometry) {
          (child as THREE.Mesh).geometry.dispose();
        }
      });
      modelGroup.remove(obj);
    }

    try {
      const effectiveThickness = config.phoneThickness + config.caseAllowance;
      const cavZ = effectiveThickness + 0.5;

      const cavY = config.phoneWidth + 2 * config.fitTolerance;
      const outerY = cavY + 2 * config.wallThickness;

      // Materials
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.45,
        metalness: 0.08
      });
      const coverMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.55,
        metalness: 0.15
      });
      const ghostMat = new THREE.MeshStandardMaterial({
        color: 0x020617,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.75
      });

      if (config.viewMode === 'assembly') {
        const explode = config.explodedOffset;
        const clockGroup = new THREE.Group();

        // Main Clock Body standing upright (bottom table foot at Y=0)
        const bodyGeom = buildMainClockBodyGeometry(config);
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        clockGroup.add(bodyMesh);

        // Ghost Phone inside cavity
        if (config.showGhostPhone) {
          const phoneGeom = buildGhostPhoneGeometry(config);
          const phoneMesh = new THREE.Mesh(phoneGeom, ghostMat);
          phoneMesh.position.set(0, 0, config.frontBezelThick + cavZ / 2);
          clockGroup.add(phoneMesh);
        }

        // Hex Back Cover seated in rear shelf (moves backwards with exploded slider)
        const coverGeom = buildHexBackCoverGeometry(config);
        const coverMesh = new THREE.Mesh(coverGeom, coverMat);
        coverMesh.position.set(0, 0, config.frontBezelThick + cavZ + explode);
        coverMesh.castShadow = true;
        clockGroup.add(coverMesh);

        // Position standing upright on table surface
        // Angled base rests flat at Y=0, screen tilted backwards by tiltAngle
        const standGroup = new THREE.Group();
        const rad = (config.tiltAngle * Math.PI) / 180;
        standGroup.position.set(0, (outerY / 2) * Math.cos(rad), 0);
        standGroup.rotation.x = Math.PI / 2 - rad;
        standGroup.add(clockGroup);

        modelGroup.add(standGroup);

      } else if (config.viewMode === 'main_body') {
        const bodyGeom = buildMainClockBodyGeometry(config);
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
        bodyMesh.position.set(0, 0, 0);
        bodyMesh.castShadow = true;
        modelGroup.add(bodyMesh);

      } else if (config.viewMode === 'back_cover') {
        const coverGeom = buildHexBackCoverGeometry(config);
        const coverMesh = new THREE.Mesh(coverGeom, coverMat);
        coverMesh.position.set(0, 0, 0);
        coverMesh.castShadow = true;
        modelGroup.add(coverMesh);

      } else if (config.viewMode === 'bed_layout') {
        // Part 1: Main Clock Body printed face-down on build plate (Z=0 on front bezel)
        const bodyGeom = buildMainClockBodyGeometry(config);
        const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
        bodyMesh.rotation.x = -Math.PI / 2;
        bodyMesh.position.set(0, 0, 0);

        if (config.rotate45OnBed) {
          bodyMesh.rotation.z = Math.PI / 4;
        }

        bodyMesh.castShadow = true;
        modelGroup.add(bodyMesh);
      }
    } catch (e) {
      console.error('Failed to update 3D geometry:', e);
    }
  }, [config]);

  // Camera presets
  const handleSetView = (preset: CameraViewPreset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const dist = 320;
    if (preset === 'front') {
      camera.position.set(0, 45, dist);
    } else if (preset === 'top') {
      camera.position.set(0, dist, 0.01);
    } else if (preset === 'side') {
      camera.position.set(dist, 45, 0);
    } else if (preset === 'rear') {
      camera.position.set(0, 45, -dist);
    } else if (preset === 'iso') {
      camera.position.set(160, 140, 240);
    }
    controls.target.set(0, 40, 0);
    controls.update();
  };

  const handleResetCamera = () => {
    handleSetView('iso');
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Top-Left Fit Badge */}
      <div className="absolute top-4 left-4 z-10 max-w-sm">
        <FitBadge
          fit={fit}
          rotate45={config.rotate45OnBed}
          onToggleRotate={onToggleRotate}
        />
      </div>

      {/* Floating Bottom-Center View Gizmo */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <ViewGizmo
          onSetView={handleSetView}
          onResetCamera={handleResetCamera}
        />
      </div>
    </div>
  );
};
