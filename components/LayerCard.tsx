
import React from 'react';
import { Layer, LayerStatus } from '../types';

interface LayerCardProps {
  layer: Layer;
  isActive: boolean;
}

const LayerCard: React.FC<LayerCardProps> = ({ layer, isActive }) => {
  const getStatusColor = () => {
    switch (layer.status) {
      case LayerStatus.PROCESSING: return 'border-blue-500/40 bg-blue-500/5 text-blue-400';
      case LayerStatus.COMPLETED: return 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]';
      case LayerStatus.ERROR: return 'border-red-500/40 bg-red-500/5 text-red-400';
      default: return 'border-slate-800 bg-slate-900/40 text-slate-600';
    }
  };

  return (
    <div className={`
      relative p-5 rounded-[1.5rem] border transition-all duration-700 flex flex-col gap-3 h-36 overflow-hidden
      ${isActive ? 'scale-[1.03] shadow-[0_0_50px_rgba(59,130,246,0.1)] z-20 border-blue-400' : 'scale-100'}
      ${getStatusColor()}
    `}>
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black tracking-[0.2em] opacity-30 uppercase font-mono">{layer.name}</span>
        <i className={`fas ${layer.icon} text-lg ${isActive ? 'animate-pulse text-blue-400' : 'opacity-40'}`}></i>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-[10px] font-black text-slate-100 mb-1 leading-tight uppercase tracking-tight">{layer.role}</h3>
        <p className="text-[9px] leading-relaxed opacity-40 line-clamp-2 italic font-mono">{layer.description}</p>
      </div>

      <div className="mt-2 flex justify-between items-center opacity-30">
        <span className="text-[7px] font-mono tracking-widest">{layer.signature.slice(0, 14)}...</span>
        {layer.confidenceIndex !== undefined && layer.status === LayerStatus.COMPLETED && (
          <span className="text-[8px] font-black text-emerald-500">{layer.confidenceIndex}% CONF</span>
        )}
      </div>

      {layer.status === LayerStatus.PROCESSING && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/10 overflow-hidden">
          <div className="h-full bg-blue-500/80 w-1/3 animate-[shimmer_1.5s_infinite_linear]"></div>
        </div>
      )}

      {isActive && (
        <div className="absolute inset-0 pointer-events-none border border-blue-400/20 rounded-[1.5rem] animate-pulse"></div>
      )}
    </div>
  );
};

export default LayerCard;
