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

export type MountStyle = 'dual' | 'wall' | 'desk';
export type UsbSide = 'right' | 'left' | 'bottom';
export type ViewMode = 'assembly_table' | 'assembly_wall' | 'housing' | 'backplate' | 'stand' | 'plate_layout';

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

  // Enclosure & Mounting
  wallThickness: number;
  frontBezelThick: number;
  bezelLip: number;
  usbSide: UsbSide;
  usbWidth: number;
  usbHeight: number;
  mountStyle: MountStyle;
  tiltAngle: number;
  standWidth: number;
  standDepth: number;

  // View / Assembly state
  viewMode: ViewMode;
  explodedOffset: number; // 0 to 40 mm
  showPhone: boolean;
  showA1MiniBed: boolean;
  rotate45OnBed: boolean;
}

export interface BedFitStatus {
  fitsStraight: boolean;
  fitsDiagonal: boolean;
  canFitBed: boolean;
  recommendedAngle: 0 | 45;
  housingDims: { x: number; y: number; z: number };
  bedDims: { x: number; y: number; z: number };
  marginStraight: { x: number; y: number };
  diagonalSpan: number;
  maxDiagonalAllowed: number;
}
