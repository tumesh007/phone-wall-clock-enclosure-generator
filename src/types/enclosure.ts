export interface PhonePreset {
  id: string;
  brand: string;
  name: string;
  bodyLength: number;
  bodyWidth: number;
  bodyThickness: number;
  cornerRadius: number;
  screenLength: number;
  screenWidth: number;
  screenCornerRadius: number;
  screenOffsetX: number;
  screenOffsetY: number;
  usbSide: 'right' | 'left' | 'bottom';
  usbOffset: number;
  notes: string;
}

export type UsbSide = 'right' | 'left' | 'bottom';
export type ViewMode = 'assembly' | 'main_body' | 'back_cover' | 'bed_layout';

export interface EnclosureConfig {
  presetId: string;
  // Exterior dimensions (mm)
  phoneLength: number;
  phoneWidth: number;
  phoneThickness: number;
  cornerRadius: number;
  caseAllowance: number;
  fitTolerance: number;

  // Screen cutout dimensions (mm)
  screenLength: number;
  screenWidth: number;
  screenCornerRadius: number;
  screenOffsetX: number;
  screenOffsetY: number;

  // Enclosure & Chunky Base Chassis
  wallThickness: number;
  frontBezelThick: number;
  baseDepth: number; // Bottom foot depth (>= 20-25mm for rock-solid tabletop stability)
  topDepth: number;  // Top chassis depth (>= 15-18mm)
  backCoverThick: number; // 3.0mm
  screwHoleDiameter: number; // 3.2mm for M3 or self-tapping

  // Ports
  usbSide: UsbSide;
  usbWidth: number;
  usbHeight: number;

  // View / Assembly state
  viewMode: ViewMode;
  explodedOffset: number; // 0 to 50 mm
  showGhostPhone: boolean;
  showA1MiniBed: boolean;
  rotate45OnBed: boolean;
}

export interface BedFitStatus {
  fitsStraight: boolean;
  fitsDiagonal: boolean;
  canFitBed: boolean;
  recommendedAngle: 0 | 45;
  bodyDims: { x: number; y: number; z: number };
  coverDims: { x: number; y: number; z: number };
  bedDims: { x: number; y: number; z: number };
  marginStraight: { x: number; y: number };
  diagonalSpan: number;
  maxDiagonalAllowed: number;
}
