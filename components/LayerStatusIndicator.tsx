
import React from 'react';
import { LayerStatus } from '../types';

interface LayerStatusIndicatorProps {
  status: LayerStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  pulse?: boolean;
}

const LayerStatusIndicator: React.FC<LayerStatusIndicatorProps> = ({ 
  status, 
  size = 'md', 
  showLabel = false, 
  pulse = false 
}) => {
  const getConfig = () => {
    switch (status) {
      case LayerStatus.PROCESSING: return { color: 'bg-blue-500', label: 'Procesando' };
      case LayerStatus.COMPLETED: return { color: 'bg-emerald-500', label: 'Completado' };
      case LayerStatus.ERROR: return { color: 'bg-red-500', label: 'Error' };
      case LayerStatus.WAITING: return { color: 'bg-amber-500', label: 'En Espera' };
      default: return { color: 'bg-slate-600', label: 'IDLE' };
    }
  };

  const { color, label } = getConfig();
  const sizeClass = size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2.5 h-2.5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-full ${color} ${sizeClass} ${pulse ? 'animate-pulse' : ''}`} />
      {showLabel && <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</span>}
    </div>
  );
};

export default LayerStatusIndicator;
