import React, { useState, useMemo } from 'react';
import { EnclosureConfig } from './types/enclosure';
import { calculateBedFit } from './cad/geometryBuilder';
import { Sidebar } from './components/Sidebar';
import { Viewer3D } from './components/Viewer3D';
import { HelpCircle, Printer } from 'lucide-react';

const initialConfig: EnclosureConfig = {
  presetId: 'realme-1',
  phoneLength: 156.5,
  phoneWidth: 75.2,
  phoneThickness: 7.8,
  cornerRadius: 8.0,
  caseAllowance: 0.0,
  fitTolerance: 0.4,
  screenLength: 136.3,
  screenWidth: 68.2,
  screenCornerRadius: 4.0,
  screenOffsetX: 0.0,
  screenOffsetY: 0.0,
  wallThickness: 2.8,
  frontBezelThick: 2.4,
  bezelLip: 3.2,
  usbSide: 'right',
  usbWidth: 18.0,
  usbHeight: 9.0,
  mountStyle: 'dual',
  tiltAngle: 15.0,
  standWidth: 130.0,
  standDepth: 62.0,
  viewMode: 'assembly_table',
  explodedOffset: 0,
  showPhone: true,
  showA1MiniBed: true,
  rotate45OnBed: false
};

export const App: React.FC = () => {
  const [config, setConfig] = useState<EnclosureConfig>(initialConfig);
  const [showHelp, setShowHelp] = useState(false);

  const fit = useMemo(() => calculateBedFit(config), [config]);

  const handleConfigChange = (updated: Partial<EnclosureConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleToggleRotate = () => {
    setConfig((prev) => ({ ...prev, rotate45OnBed: !prev.rotate45OnBed }));
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Top Bar */}
      <header className="h-12 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between text-xs text-slate-300 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white tracking-wide">
              Phone Clock Enclosure Studio
            </span>
          </div>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            Client-Side 3D CAD &amp; Mesh Generator
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Guide</span>
          </button>

          <a
            href="https://github.com/tumesh007/phone-wall-clock-enclosure-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Workspace: Left Sidebar + Right 3D Viewport */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar config={config} onChange={handleConfigChange} />
        <main className="flex-1 relative">
          <Viewer3D
            config={config}
            fit={fit}
            onToggleRotate={handleToggleRotate}
          />
        </main>
      </div>

      {/* Help / Guide Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-sky-400" />
                <span>3D Printing &amp; Assembly Guide</span>
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h3 className="font-semibold text-sky-400 mb-1">Recommended Print Settings:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong className="text-slate-200">Material:</strong> PETG (or PLA) for thermal stability with continuous clock operation.</li>
                  <li><strong className="text-slate-200">Layer Height:</strong> 0.20 mm Standard.</li>
                  <li><strong className="text-slate-200">Perimeters / Walls:</strong> 4 loops (solid 1.6 mm walls).</li>
                  <li><strong className="text-slate-200">Infill:</strong> 15% - 20% Gyroid.</li>
                  <li><strong className="text-slate-200">Supports:</strong> <span className="text-emerald-400 font-semibold">Zero Supports Needed!</span> All parts are designed support-free.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h3 className="font-semibold text-amber-400 mb-1">Bambu Lab A1 mini Print Orientations:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong className="text-slate-200">Main Housing:</strong> Print face-down on a textured PEI plate for a clean matte front finish.</li>
                  <li><strong className="text-slate-200">Backplate:</strong> Print flat on plate.</li>
                  <li><strong className="text-slate-200">Desk Stand:</strong> Print flat on its base.</li>
                </ul>
              </div>

              <p className="text-slate-400">
                Wall mounting works with standard M3.5/#6 screws (80 mm spacing) or two medium 3M Command picture hanging strips into the recessed side pockets.
              </p>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors"
            >
              Got it, let's make some clocks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
