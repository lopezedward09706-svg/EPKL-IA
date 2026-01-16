import { 
  LayerStatus, 
  SecurityLevel, 
  IAType, 
  LayerPerformance 
} from '../../types';

// Icon mappings for all AI roles in the ecosystem
export const LAYER_ICONS: Record<string, string> = {
  [IAType.OBSERVER]: 'fas fa-eye',
  [IAType.IMPLEMENTER]: 'fas fa-code-merge',
  [IAType.COSMIC]: 'fas fa-satellite-dish',
  [IAType.MATH_CONSTANTS]: 'fas fa-calculator',
  [IAType.CODE_NAVIGATOR]: 'fas fa-code-branch',
  [IAType.MATH_SCALER]: 'fas fa-chart-line',
  [IAType.FAULT_DETECTOR]: 'fas fa-bug',
  [IAType.FAULT_CORRECTOR]: 'fas fa-wrench',
  [IAType.NARRATOR]: 'fas fa-comment-dots',
  [IAType.SCIENTIFIC]: 'fas fa-microscope',
  [IAType.PAPER_GENERATOR]: 'fas fa-file-alt',
  [IAType.PUBLISHER]: 'fas fa-paper-plane',
  [IAType.GATEWAY]: 'fas fa-shield-alt',
  [IAType.UNKNOWN]: 'fas fa-microchip'
};

// Comprehensive status configurations for visual feedback
export const STATUS_CONFIG: Record<string, any> = {
  [LayerStatus.PENDING]: {
    label: 'PENDIENTE',
    icon: 'fa-clock',
    iconColor: 'text-gray-400',
    glowClass: 'shadow-gray-500/10',
    shouldPulse: false
  },
  [LayerStatus.PROCESSING]: {
    label: 'PROCESANDO',
    icon: 'fa-cog fa-spin',
    iconColor: 'text-blue-400',
    glowClass: 'shadow-blue-500/40',
    shouldPulse: true
  },
  [LayerStatus.COMPLETED]: {
    label: 'COMPLETADO',
    icon: 'fa-check-circle',
    iconColor: 'text-emerald-400',
    glowClass: 'shadow-emerald-500/20',
    shouldPulse: false
  },
  [LayerStatus.ERROR]: {
    label: 'ERROR',
    icon: 'fa-exclamation-triangle',
    iconColor: 'text-red-400',
    glowClass: 'shadow-red-500/50',
    shouldPulse: true
  },
  [LayerStatus.WARNING]: {
    label: 'ADVERTENCIA',
    icon: 'fa-triangle-exclamation',
    iconColor: 'text-amber-400',
    glowClass: 'shadow-amber-500/30',
    shouldPulse: true
  },
  [LayerStatus.QUARANTINED]: {
    label: 'CUARENTENA',
    icon: 'fa-shield-virus',
    iconColor: 'text-purple-400',
    glowClass: 'shadow-purple-500/40',
    shouldPulse: false
  },
  [LayerStatus.IDLE]: {
    label: 'IDLE',
    icon: 'fa-sleep',
    iconColor: 'text-slate-500',
    glowClass: '',
    shouldPulse: false
  }
};

// Security level styling definitions
export const SECURITY_LEVELS: Record<string, any> = {
  [SecurityLevel.QUANTUM]: { 
    label: 'CUÁNTICO', 
    icon: 'fas fa-atom', 
    color: 'text-cyan-400', 
    badgeClass: 'bg-cyan-500/10 text-cyan-400', 
    glowClass: 'shadow-cyan-500/20' 
  },
  [SecurityLevel.CRITICAL]: { 
    label: 'CRÍTICO', 
    icon: 'fas fa-radiation', 
    color: 'text-red-400', 
    badgeClass: 'bg-red-500/10 text-red-400', 
    glowClass: 'shadow-red-500/40' 
  },
  [SecurityLevel.HIGH]: { 
    label: 'ALTO', 
    icon: 'fas fa-shield', 
    color: 'text-emerald-400', 
    badgeClass: 'bg-emerald-500/10 text-emerald-400', 
    glowClass: '' 
  },
  [SecurityLevel.NOMINAL]: { 
    label: 'NOMINAL', 
    icon: 'fas fa-check', 
    color: 'text-blue-400', 
    badgeClass: 'bg-blue-500/10 text-blue-400', 
    glowClass: '' 
  },
  [SecurityLevel.MEDIUM]: {
    label: 'MEDIO',
    icon: 'fas fa-shield-alt',
    color: 'text-amber-400',
    badgeClass: 'bg-amber-500/10 text-amber-400',
    glowClass: ''
  }
};

export const getLayerColor = (layerId: number): string => {
  const colors = [
    'from-blue-500/20 to-indigo-600/20',
    'from-emerald-500/20 to-teal-600/20',
    'from-purple-500/20 to-pink-600/20',
    'from-amber-500/20 to-orange-600/20',
    'from-cyan-500/20 to-blue-600/20'
  ];
  return colors[layerId % colors.length];
};

export const calculateHealthScore = (performance?: LayerPerformance): number => {
  if (!performance) return 100;
  const cpu = performance.cpu ?? 20;
  const mem = performance.memory ?? 30;
  const success = performance.successRate ?? 98;
  return Math.max(0, Math.min(100, Math.round(success - (cpu * 0.1) - (mem * 0.05))));
};

export const getHealthStatus = (score: number, layerStatus: LayerStatus): string => {
  if (layerStatus === LayerStatus.ERROR || layerStatus === LayerStatus.QUARANTINED) return 'critical';
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 55) return 'warning';
  return 'critical';
};

export const formatConfidence = (confidence?: number): { value: string; trend: 'up' | 'down' | 'stable' } => {
  if (confidence === undefined) return { value: 'N/A', trend: 'stable' };
  
  let value = `${confidence}%`;
  if (confidence > 95) value = `🎯 ${confidence}%`;
  else if (confidence > 85) value = `✅ ${confidence}%`;
  else if (confidence < 60) value = `⚠️ ${confidence}%`;
  
  return { 
    value, 
    trend: confidence > 90 ? 'up' : confidence < 70 ? 'down' : 'stable' 
  };
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const getStatusPriority = (status: LayerStatus): number => {
  const priorities: Record<string, number> = {
    [LayerStatus.ERROR]: 0,
    [LayerStatus.QUARANTINED]: 1,
    [LayerStatus.WARNING]: 2,
    [LayerStatus.PROCESSING]: 3,
    [LayerStatus.OPTIMIZING]: 4,
    [LayerStatus.COMPLETED]: 5,
    [LayerStatus.IDLE]: 6,
    [LayerStatus.PENDING]: 7,
  };
  return priorities[status] ?? 10;
};

export const getSecurityPriority = (level: SecurityLevel): number => {
  const priorities: Record<string, number> = {
    [SecurityLevel.QUANTUM]: 0,
    [SecurityLevel.CRITICAL]: 1,
    [SecurityLevel.HIGH]: 2,
    [SecurityLevel.ELEVATED]: 3,
    [SecurityLevel.NOMINAL]: 4,
    [SecurityLevel.MEDIUM]: 5,
    [SecurityLevel.LOW]: 6,
  };
  return priorities[level] ?? 10;
};

export const needsAttention = (layer: { status: LayerStatus; confidenceIndex?: number }): boolean => {
  return (
    layer.status === LayerStatus.ERROR ||
    layer.status === LayerStatus.WARNING ||
    layer.status === LayerStatus.QUARANTINED ||
    (layer.confidenceIndex !== undefined && layer.confidenceIndex < 70)
  );
};