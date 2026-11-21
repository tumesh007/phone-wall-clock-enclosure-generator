import React from 'react';
import { Eye, Box, Compass, RefreshCw } from 'lucide-react';

export type CameraViewPreset = 'front' | 'top' | 'side' | 'rear' | 'iso';

interface ViewGizmoProps {
  onSetView: (preset: CameraViewPreset) => void;
  onResetCamera: () => void;
}

export const ViewGizmo: React.FC<ViewGizmoProps> = ({ onSetView, onResetCamera }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 shadow-xl flex items-center gap-1 text-slate-300">
      <button
        onClick={() => onSetView('iso')}
        title="Isometric 3D View"
        className="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
      >
        <Box className="w-3.5 h-3.5 text-sky-400" />
        <span>Iso</span>
      </button>

      <button
        onClick={() => onSetView('front')}
        title="Front View"
        className="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-xs font-medium transition-colors"
      >
        Front
      </button>

      <button
        onClick={() => onSetView('top')}
        title="Top-Down View"
        className="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-xs font-medium transition-colors"
      >
        Top
      </button>

      <button
        onClick={() => onSetView('side')}
        title="Right Side View"
        className="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-xs font-medium transition-colors"
      >
        Side
      </button>

      <button
        onClick={() => onSetView('rear')}
        title="Rear View"
        className="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white text-xs font-medium transition-colors"
      >
        Rear
      </button>

      <div className="w-px h-4 bg-slate-800 mx-0.5" />

      <button
        onClick={onResetCamera}
        title="Reset & Center View"
        className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-slate-400"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
