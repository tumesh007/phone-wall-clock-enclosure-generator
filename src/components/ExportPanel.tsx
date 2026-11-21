import React, { useState } from 'react';
import { EnclosureConfig } from '../types/enclosure';
import { exportPartStl, downloadScadFile } from '../cad/stlExporter';
import { Download, FileCode, Package, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportPanelProps {
  config: EnclosureConfig;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ config }) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadStl = (part: 'main_body' | 'back_cover' | 'assembly') => {
    setDownloading(part);
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
    <div className="space-y-2.5">
      <button
        onClick={() => handleDownloadStl('main_body')}
        disabled={!!downloading}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium text-xs transition-all shadow-lg shadow-sky-600/20 active:scale-[0.98]"
      >
        {downloading === 'main_body' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>Download Part 1: Front &amp; Body (.STL)</span>
      </button>

      <button
        onClick={() => handleDownloadStl('back_cover')}
        disabled={!!downloading}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-medium text-xs transition-all border border-slate-700/80 active:scale-[0.98]"
      >
        {downloading === 'back_cover' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>Download Part 2: Hex Back Cover (.STL)</span>
      </button>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => handleDownloadStl('assembly')}
          disabled={!!downloading}
          className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white font-medium text-[11px] transition-all border border-slate-700/60"
        >
          {downloading === 'assembly' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Package className="w-3.5 h-3.5 text-sky-400" />
          )}
          <span>Assembly STL</span>
        </button>

        <button
          onClick={handleDownloadScad}
          className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-[11px] transition-all shadow-md shadow-amber-600/20 active:scale-[0.98]"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>OpenSCAD (.scad)</span>
        </button>
      </div>
    </div>
  );
};
