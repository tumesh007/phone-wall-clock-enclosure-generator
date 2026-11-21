import React, { useState } from 'react';
import { EnclosureConfig } from '../types/enclosure';
import { exportPartStl, downloadScadFile } from '../cad/stlExporter';
import { Download, FileCode, Check, Layers, Package, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportPanelProps {
  config: EnclosureConfig;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ config }) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadStl = async (part: 'housing' | 'backplate' | 'stand' | 'assembly') => {
    setDownloading(part);
    // Yield to render loader
    setTimeout(() => {
      try {
        exportPartStl(part, config);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.85 }
        });
      } catch (err) {
        console.error('Export error:', err);
      } finally {
        setDownloading(null);
      }
    }, 50);
  };

  const handleDownloadScad = () => {
    downloadScadFile(config);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.85 }
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleDownloadStl('housing')}
          disabled={!!downloading}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium text-xs transition-all shadow-lg shadow-sky-600/20 active:scale-[0.98]"
        >
          {downloading === 'housing' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Housing STL</span>
        </button>

        <button
          onClick={() => handleDownloadStl('backplate')}
          disabled={!!downloading}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-medium text-xs transition-all border border-slate-700/80 active:scale-[0.98]"
        >
          {downloading === 'backplate' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Backplate STL</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleDownloadStl('stand')}
          disabled={!!downloading}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-medium text-xs transition-all border border-slate-700/80 active:scale-[0.98]"
        >
          {downloading === 'stand' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Desk Stand STL</span>
        </button>

        <button
          onClick={() => handleDownloadStl('assembly')}
          disabled={!!downloading}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-medium text-xs transition-all border border-slate-700/80 active:scale-[0.98]"
        >
          {downloading === 'assembly' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Package className="w-4 h-4 text-sky-400" />
          )}
          <span>Assembly STL</span>
        </button>
      </div>

      <button
        onClick={handleDownloadScad}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs transition-all shadow-lg shadow-amber-600/20 active:scale-[0.98]"
      >
        <FileCode className="w-4 h-4" />
        <span>Download OpenSCAD (.scad)</span>
      </button>
    </div>
  );
};
