import React from 'react';
import { Wifi, Battery } from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-slate-800 text-xs font-semibold select-none bg-transparent">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[1.5px] h-2.5 mr-0.5">
          <span className="w-[3px] h-1 bg-slate-800 rounded-sm"></span>
          <span className="w-[3px] h-1.5 bg-slate-800 rounded-sm"></span>
          <span className="w-[3px] h-2 bg-slate-800 rounded-sm"></span>
          <span className="w-[3px] h-2.5 bg-slate-800 rounded-sm"></span>
        </div>
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4 fill-slate-800 stroke-slate-800" />
      </div>
    </div>
  );
};
