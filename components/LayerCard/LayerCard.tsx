
import React, { memo, useMemo, useState, useCallback } from 'react';
import { Layer, LayerStatus, SecurityLevel, IAType } from '../../types';
import { WebSocketService } from '../../services/websocketService';
import { 
  LAYER_ICONS, 
  STATUS_CONFIG, 
  SECURITY_LEVELS,
  getLayerColor,
  getHealthStatus,
  calculateHealthScore,
  formatConfidence,
  truncateText
} from './LayerCardUtils';
import LayerStatusIndicator from '../LayerStatusIndicator';
import './layer-animations.css';

interface LayerCardProps {
  layer: Layer;
  isActive?: boolean;
  isSelected?: boolean;
  onSelect?: (layerId: number) => void;
  onAction?: (layerId: number, action: string) => void;
  onContextMenu?: (layerId: number, event: React.MouseEvent) => void;
  viewMode?: 'compact' | 'detailed' | 'minimal';
  className?: string;
}

const LayerCard: React.FC<LayerCardProps> = memo(({ 
  layer, 
  isActive = false,
  isSelected = false,
  onSelect,
  onAction,
  onContextMenu,
  viewMode = 'detailed',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ws = WebSocketService.getInstance();

  const statusConfig = useMemo(() => 
    STATUS_CONFIG[layer.status] || STATUS_CONFIG[LayerStatus.IDLE], 
    [layer.status]
  );

  const securityLevel = useMemo(() => 
    SECURITY_LEVELS[layer.securityLevel || SecurityLevel.NOMINAL], 
    [layer.securityLevel]
  );

  const layerIcon = useMemo(() => 
    LAYER_ICONS[layer.type || IAType.UNKNOWN] || 'fas fa-microchip', 
    [layer.type]
  );

  const layerColor = useMemo(() => 
    getLayerColor(layer.id), 
    [layer.id]
  );

  const healthScore = useMemo(() => 
    calculateHealthScore(layer.performance), 
    [layer.performance]
  );

  const healthStatus = useMemo(() => 
    getHealthStatus(healthScore, layer.status), 
    [healthScore, layer.status]
  );

  const confidenceDisplay = useMemo(() => 
    formatConfidence(layer.confidenceIndex), 
    [layer.confidenceIndex]
  );

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (layer.status === LayerStatus.QUARANTINED) {
      ws.broadcast('SECURITY_EVENT', { 
        type: 'QUARANTINE_ACCESS_ATTEMPT', 
        layerId: layer.id,
        timestamp: new Date().toISOString()
      });
      return;
    }
    if (onSelect) onSelect(layer.id);
  }, [layer, onSelect, ws]);

  const handleAction = useCallback((action: string) => {
    if (onAction) onAction(layer.id, action);
  }, [layer.id, onAction]);

  const glowStyle = useMemo(() => {
    const baseColor = layer.id % 2 === 0 ? 'rgba(59, 130, 246,' : 'rgba(168, 85, 247,';
    if (isActive) {
      return {
        boxShadow: `0 0 40px -5px ${baseColor} 0.5), 0 0 20px -10px white`,
        borderColor: 'rgba(255,255,255,0.4)',
        zIndex: 30
      };
    }
    if (isHovered) {
      return {
        boxShadow: `0 20px 40px -15px rgba(0,0,0,0.5), 0 0 20px -5px ${baseColor} 0.3)`,
        borderColor: 'rgba(255,255,255,0.25)',
        zIndex: 20
      };
    }
    return {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    };
  }, [isHovered, isActive, layer.id]);

  return (
    <div 
      className={`
        relative h-56 rounded-[2.5rem] border transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden group cursor-pointer p-6 flex flex-col gap-4
        ${isActive ? 'scale-[1.05] border-white/40' : 'border-white/5'}
        ${isHovered && !isActive ? 'scale-[1.02] -translate-y-2' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-950' : ''}
        ${className}
        bg-slate-950/60 backdrop-blur-2xl
      `}
      style={glowStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={(e) => onContextMenu?.(layer.id, e)}
    >
      {/* High Priority Visual Tag */}
      {(layer.id === 2 || (layer.confidenceIndex || 100) < 75) && (
        <div className="absolute top-0 right-12 bg-blue-600 text-white text-[7px] font-black px-3 py-1 rounded-b-lg uppercase tracking-widest z-20 animate-bounce">
          R-QNT Priority
        </div>
      )}

      <div className={`absolute inset-0 bg-gradient-to-br ${layerColor} opacity-5 group-hover:opacity-15 transition-opacity duration-700 pointer-events-none`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/5 ${statusConfig.iconColor} group-hover:bg-white/[0.08] transition-all duration-500 shadow-inner`}>
            <i className={`${layerIcon} text-xl ${statusConfig.shouldPulse ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{layer.name}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 tracking-tight leading-none uppercase truncate max-w-[140px] group-hover:text-cyan-400 transition-colors">{layer.role}</h3>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${securityLevel.badgeClass} backdrop-blur-md border border-white/5`}>
          {securityLevel.label}
        </div>
      </div>

      <div className="flex-1 space-y-4 relative z-10">
        <p className={`text-[10px] text-slate-400 line-clamp-2 leading-relaxed italic font-mono transition-all duration-500 ${isHovered || isActive ? 'opacity-100 text-slate-200' : 'opacity-60'}`}>
          {truncateText(layer.description, 100)}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex justify-between items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Stability</span>
              <span className="text-[9px] font-mono text-slate-300">{healthScore}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  healthStatus === 'excellent' ? 'bg-cyan-500' :
                  healthStatus === 'good' ? 'bg-blue-500' :
                  healthStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                }`} 
                style={{ width: `${healthScore}%` }} 
              />
            </div>
          </div>
          
          <div className={`flex justify-between items-center bg-white/[0.02] rounded-xl px-3 py-1 border border-white/5`}>
            <span className="text-[8px] font-black text-slate-500 uppercase">Trust</span>
            <span className={`text-xs font-black tracking-tighter ${confidenceDisplay.trend === 'up' ? 'text-emerald-400' : 'text-slate-300'}`}>
              {confidenceDisplay.value}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <LayerStatusIndicator status={layer.status} size="sm" pulse={statusConfig.shouldPulse} />
          <span className={`text-[9px] font-black uppercase tracking-[0.15em] text-slate-500`}>
            {statusConfig.label}
          </span>
        </div>
        
        <div className={`flex gap-1.5`}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleAction('view'); }}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 transition-all border border-white/5"
          >
            <i className="fas fa-expand-alt text-[10px]" />
          </button>
        </div>
      </div>
    </div>
  );
});

LayerCard.displayName = 'LayerCard';
export default LayerCard;
