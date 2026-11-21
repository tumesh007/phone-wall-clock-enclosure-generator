import React, { useState } from 'react';
import { EnclosureConfig, PhonePreset, UsbSide, ViewMode } from '../types/enclosure';
import presetsData from '../data/presets.json';
import { ExportPanel } from './ExportPanel';
import {
  Smartphone,
  Maximize2,
  Sliders,
  Eye,
  Layers,
  ChevronDown,
  Info,
  Shield,
  Cable,
  Monitor
} from 'lucide-react';

interface SidebarProps {
  config: EnclosureConfig;
  onChange: (updated: Partial<EnclosureConfig>) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ config, onChange }) => {
  const [search, setSearch] = useState('');
  const presets: PhonePreset[] = presetsData as PhonePreset[];

  const filteredPresets = presets.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const currentPreset = presets.find((p) => p.id === config.presetId);

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = presets.find((p) => p.id === selectedId);
    if (found) {
      onChange({
        presetId: found.id,
        phoneLength: found.bodyLength,
        phoneWidth: found.bodyWidth,
        phoneThickness: found.bodyThickness,
        cornerRadius: found.cornerRadius,
        screenLength: found.screenLength,
        screenWidth: found.screenWidth,
        screenCornerRadius: found.screenCornerRadius,
        screenOffsetX: found.screenOffsetX,
        screenOffsetY: found.screenOffsetY,
        usbSide: found.usbSide
      });
    }
  };

  return (
    <aside className="w-80 md:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden select-text text-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-wide">
              Phone Clock Enclosure
            </h1>
            <p className="text-[11px] text-slate-400">Parametric 3D Generator</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
          A1 Mini Ready
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-xs">
        {/* Preset Selector */}
        <section className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span>Select Phone Preset</span>
          </label>
          <div className="relative">
            <select
              value={config.presetId}
              onChange={handleSelectPreset}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition-colors appearance-none cursor-pointer"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} - {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {currentPreset && (
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1 text-slate-400">
              <div className="text-slate-300 font-medium">{currentPreset.notes}</div>
              <div className="flex justify-between">
                <span>Display Area:</span>
                <span className="font-mono text-slate-300">
                  {currentPreset.screenLength} × {currentPreset.screenWidth} mm
                </span>
              </div>
            </div>
          )}
        </section>

        {/* View Mode Selector */}
        <section className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Display & View Mode</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onChange({ viewMode: 'assembly_table' })}
              className={`py-1.5 px-2 rounded text-[11px] font-medium transition-all ${
                config.viewMode === 'assembly_table'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Table Clock
            </button>
            <button
              onClick={() => onChange({ viewMode: 'assembly_wall' })}
              className={`py-1.5 px-2 rounded text-[11px] font-medium transition-all ${
                config.viewMode === 'assembly_wall'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wall Mount
            </button>
            <button
              onClick={() => onChange({ viewMode: 'housing' })}
              className={`py-1.5 px-2 rounded text-[11px] font-medium transition-all ${
                config.viewMode === 'housing'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Housing
            </button>
            <button
              onClick={() => onChange({ viewMode: 'backplate' })}
              className={`py-1.5 px-2 rounded text-[11px] font-medium transition-all ${
                config.viewMode === 'backplate'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Backplate
            </button>
            <button
              onClick={() => onChange({ viewMode: 'stand' })}
              className={`py-1.5 px-2 rounded text-[11px] font-medium transition-all ${
                config.viewMode === 'stand'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Desk Stand
            </button>
            <button
              onClick={() => onChange({ viewMode: 'plate_layout' })}
              className={`py-1.5 px-2 rounded text-[11px] font-medium transition-all ${
                config.viewMode === 'plate_layout'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bed Layout
            </button>
          </div>

          {/* Exploded View Slider */}
          <div className="pt-2">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Exploded View Offset</span>
              <span className="font-mono text-slate-200">{config.explodedOffset} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={config.explodedOffset}
              onChange={(e) => onChange({ explodedOffset: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Quick Toggles */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={config.showPhone}
                onChange={(e) => onChange({ showPhone: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-0"
              />
              <span>Mockup Phone</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={config.showA1MiniBed}
                onChange={(e) => onChange({ showA1MiniBed: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-0"
              />
              <span>A1 Mini Bed</span>
            </label>
          </div>
        </section>

        {/* Phone Exterior Dimensions */}
        <section className="space-y-3">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Phone Body & Cavity (mm)</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-slate-400">Length (X)</span>
              <input
                type="number"
                step="0.1"
                value={config.phoneLength}
                onChange={(e) => onChange({ phoneLength: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Width (Y)</span>
              <input
                type="number"
                step="0.1"
                value={config.phoneWidth}
                onChange={(e) => onChange({ phoneWidth: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Thickness (Z)</span>
              <input
                type="number"
                step="0.1"
                value={config.phoneThickness}
                onChange={(e) => onChange({ phoneThickness: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Corner Radius</span>
              <input
                type="number"
                step="0.5"
                value={config.cornerRadius}
                onChange={(e) => onChange({ cornerRadius: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
          </div>

          {/* Case Allowance Buttons */}
          <div>
            <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-sky-400" />
                <span>Case Allowance</span>
              </span>
              <span className="font-mono text-slate-300">+{config.caseAllowance.toFixed(1)} mm</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Bare (0mm)', val: 0.0 },
                { label: 'Slim (+1.8mm)', val: 1.8 },
                { label: 'Rugged (+3.5mm)', val: 3.5 }
              ].map((btn) => (
                <button
                  key={btn.val}
                  onClick={() => onChange({ caseAllowance: btn.val })}
                  className={`py-1 rounded text-[11px] font-medium border transition-all ${
                    Math.abs(config.caseAllowance - btn.val) < 0.05
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Tolerance */}
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Fit Tolerance</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={config.fitTolerance}
                onChange={(e) => onChange({ fitTolerance: parseFloat(e.target.value) || 0.4 })}
                className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-right text-xs text-slate-100"
              />
              <span className="text-slate-500">mm</span>
            </div>
          </div>
        </section>

        {/* Screen Window Dimensions */}
        <section className="space-y-3">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-sky-400" />
            <span>Screen Viewing Window (mm)</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-slate-400">Screen Length</span>
              <input
                type="number"
                step="0.1"
                value={config.screenLength}
                onChange={(e) => onChange({ screenLength: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Screen Width</span>
              <input
                type="number"
                step="0.1"
                value={config.screenWidth}
                onChange={(e) => onChange({ screenWidth: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Window Radius</span>
              <input
                type="number"
                step="0.5"
                value={config.screenCornerRadius}
                onChange={(e) => onChange({ screenCornerRadius: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Offset Y (Chin)</span>
              <input
                type="number"
                step="0.5"
                value={config.screenOffsetY}
                onChange={(e) => onChange({ screenOffsetY: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
          </div>
        </section>

        {/* Ports & Mounting Options */}
        <section className="space-y-3">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cable className="w-3.5 h-3.5 text-sky-400" />
            <span>Cable Port & Stand</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-slate-400">USB Port Side</span>
              <select
                value={config.usbSide}
                onChange={(e) => onChange({ usbSide: e.target.value as UsbSide })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200"
              >
                <option value="right">Right Edge</option>
                <option value="left">Left Edge</option>
                <option value="bottom">Bottom Edge</option>
              </select>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Stand Tilt (deg)</span>
              <input
                type="number"
                min="10"
                max="25"
                step="1"
                value={config.tiltAngle}
                onChange={(e) => onChange({ tiltAngle: parseFloat(e.target.value) || 15 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-slate-400">Wall Thick (PETG)</span>
              <input
                type="number"
                step="0.2"
                min="1.6"
                max="4.0"
                value={config.wallThickness}
                onChange={(e) => onChange({ wallThickness: parseFloat(e.target.value) || 2.4 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Front Bezel</span>
              <input
                type="number"
                step="0.2"
                min="1.6"
                max="4.0"
                value={config.frontBezelThick}
                onChange={(e) => onChange({ frontBezelThick: parseFloat(e.target.value) || 2.4 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-100"
              />
            </div>
          </div>
        </section>

        {/* Download & Export Panel */}
        <section className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Generate & Download</span>
          </label>
          <ExportPanel config={config} />
        </section>
      </div>
    </aside>
  );
};
