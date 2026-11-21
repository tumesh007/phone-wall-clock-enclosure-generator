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

  // Enclosure & Echo Show 5 Sloped Stand Extension
  wallThickness: number;
  frontBezelThick: number;
  tiltAngle: number; // Echo Show 5 viewing angle (15 - 20 deg, default 18)
  standDepth: number; // Deep sloped desk stand footprint (50 - 75 mm, default 58)
  pocketDepth: number; // Upper phone pocket depth (14 mm)
  backCoverThick: number; // 3.0 mm
  screwHoleDiameter: number; // 3.2 mm for M3

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
