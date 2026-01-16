
import React, { useState, useMemo } from 'react';
import LayerCard from './LayerCard/LayerCard';
import { Layer, LayerStatus, SecurityLevel } from '../types';
import { 
  getStatusPriority, 
  getSecurityPriority 
} from './LayerCard/LayerCardUtils';
import './layer-animations.css';

interface LayersContainerProps {
  layers: Layer[];
  activeLayerId?: number;
  selectedLayerIds?: number[];
  onLayerSelect: (layerId: number) => void;
  onLayerAction?: (layerId: number, action: string) => void;
  onBulkAction?: (layerIds: number[], action: string) => void;
  layout?: 'grid' | 'list' | 'compact' | 'minimal';
  className?: string;
}

const LayersContainer: React.FC<LayersContainerProps> = ({
  layers,
  activeLayerId,
  selectedLayerIds = [],
  onLayerSelect,
  onLayerAction,
  onBulkAction,
  layout = 'grid',
  className = ''
}) => {
  const [filterStatus, setFilterStatus] = useState<LayerStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'status' | 'confidence' | 'security'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const stats = useMemo(() => {
    const total = layers.length;
    const confidenceLayers = layers.filter(l => l.confidenceIndex !== undefined);
    const avgConfidence = confidenceLayers.length > 0
      ? confidenceLayers.reduce((acc, l) => acc + (l.confidenceIndex || 0), 0) / confidenceLayers.length
      : 0;
    
    return { total, avgConfidence: Math.round(avgConfidence) };
  }, [layers]);

  const filteredLayers = useMemo(() => {
    return layers.filter(layer => {
      if (filterStatus !== 'all' && layer.status !== filterStatus) return false;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return layer.name.toLowerCase().includes(query) || 
             layer.role.toLowerCase().includes(query) || 
             layer.description.toLowerCase().includes(query);
    });
  }, [layers, filterStatus, searchQuery]);

  const sortedLayers = useMemo(() => {
    return [...filteredLayers].sort((a, b) => {
      let comparison = a.id - b.id;
      if (sortBy === 'status') comparison = getStatusPriority(a.status) - getStatusPriority(b.status);
      if (sortBy === 'confidence') comparison = (a.confidenceIndex || 0) - (b.confidenceIndex || 0);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredLayers, sortBy, sortDirection]);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Toolbar - Diseño más limpio */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-900/60 rounded-[2rem] border border-white/5 shadow-xl">
        <div className="relative flex-1 group w-full">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Escanear ecosistema neural..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-xs font-mono text-blue-300 outline-none focus:border-blue-500/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-xl border border-white/5">
            {['all', LayerStatus.PROCESSING, LayerStatus.COMPLETED].map(status => (
              <button 
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${filterStatus === status ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {status === 'all' ? 'Ver Todos' : status}
              </button>
            ))}
        </div>
      </div>

      {/* Grid de Capas - Evita amontonamiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedLayers.map(layer => (
          <LayerCard 
            key={layer.id} 
            layer={layer} 
            isActive={activeLayerId === layer.id}
            isSelected={selectedLayerIds.includes(layer.id)}
            onSelect={onLayerSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default LayersContainer;
