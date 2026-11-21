import React from 'react';
import { BedFitStatus } from '../types/enclosure';
import { CheckCircle2, AlertTriangle, XCircle, RotateCw } from 'lucide-react';

interface FitBadgeProps {
  fit: BedFitStatus;
  rotate45: boolean;
  onToggleRotate: () => void;
}

export const FitBadge: React.FC<FitBadgeProps> = ({ fit, rotate45, onToggleRotate }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl text-xs">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {fit.fitsStraight ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Bambu Lab A1 mini: Fits Straight</span>
            </div>
          ) : fit.fitsDiagonal ? (
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Bambu Lab A1 mini: Fits at 45°</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Exceeds 180mm Bed (Split Required)</span>
            </div>
          )}
        </div>

        {fit.fitsDiagonal && !fit.fitsStraight && (
          <button
            onClick={onToggleRotate}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
              rotate45
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <RotateCw className="w-3 h-3" />
            {rotate45 ? 'Rotated 45°' : 'Rotate 45°'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400 text-[11px] border-t border-slate-800/80 pt-2">
        <div>
          Outer Size: <span className="text-slate-200 font-mono">{fit.housingDims.x} × {fit.housingDims.y} mm</span>
        </div>
        <div>
          Height (Z): <span className="text-slate-200 font-mono">{fit.housingDims.z} mm</span>
        </div>
        <div>
          Bed Clearance X: <span className={`font-mono ${fit.marginStraight.x >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {fit.marginStraight.x >= 0 ? `+${fit.marginStraight.x}` : fit.marginStraight.x} mm
          </span>
        </div>
        <div>
          Bed Clearance Y: <span className={`font-mono ${fit.marginStraight.y >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {fit.marginStraight.y >= 0 ? `+${fit.marginStraight.y}` : fit.marginStraight.y} mm
          </span>
        </div>
      </div>
    </div>
  );
};
