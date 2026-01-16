
import React, { useState, useMemo } from 'react';
import { FileNode } from '../types';
import { INITIAL_LAYERS } from '../constants';
import { ZipService } from '../services/zipService';

const STRUCTURE: FileNode = {
  name: 'EDPLIA_SYSTEM_ROOT',
  type: 'folder',
  children: [
    {
      name: 'CORE',
      type: 'folder',
      children: [
        { name: 'QuantumIsolation.py', type: 'file', description: 'Aislamiento Cuántico' },
        { name: 'ImmutableConfig.py', type: 'file', description: 'Configuración Inmutable' },
        { name: 'SecureLogger.py', type: 'file', description: 'Registro de Seguridad' }
      ]
    },
    {
      name: 'IAs',
      type: 'folder',
      children: [
        { name: 'IA1_OBSERVER.py', type: 'file' },
        { name: 'IA3_COSMIC.py', type: 'file', description: 'NASA/CERN Scraper' },
        { name: 'IA7_FAULT_DETECTOR.py', type: 'file' },
        { name: 'IA11_PAPER_GEN.py', type: 'file' },
        { name: 'IA12_PUBLISHER.py', type: 'file' }
      ]
    },
    {
      name: 'CONTROL_PANEL',
      type: 'folder',
      children: [
        {
          name: 'api',
          type: 'folder',
          children: [
            { name: 'api_server.py', type: 'file', description: 'Port 5000' },
            { name: 'websocket.py', type: 'file' }
          ]
        },
        { name: 'index.html', type: 'file' }
      ]
    },
    {
      name: 'SCRIPTS',
      type: 'folder',
      children: [
        { name: 'install.sh', type: 'file' },
        { name: 'emergency_lock.sh', type: 'file' }
      ]
    },
    { name: 'MAIN_SYSTEM.py', type: 'file', description: 'Orquestador Principal' },
    { name: 'identity.json', type: 'file' },
    { name: '.env', type: 'file', description: 'API KEYS' }
  ]
};

const TreeNode: React.FC<{ node: FileNode; depth: number; highlight?: string }> = ({ node, depth, highlight }) => {
  const [isOpen, setIsOpen] = React.useState(depth < 2);
  const isMatch = highlight && node.name.toLowerCase().includes(highlight.toLowerCase());

  return (
    <div className={`select-none transition-opacity ${highlight && !isMatch && node.type === 'file' ? 'opacity-30' : 'opacity-100'}`}>
      <div 
        className={`flex items-center gap-3 py-2 px-4 rounded-xl hover:bg-blue-600/10 cursor-pointer transition-all group ${isMatch ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 16}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${node.type === 'folder' ? (isOpen ? 'fa-folder-open text-blue-500' : 'fa-folder text-slate-600') : 'fa-file-code text-slate-700'} text-[11px]`}></i>
        <span className={`text-[12px] font-mono transition-colors ${isMatch ? 'text-blue-400 font-bold' : 'text-slate-400 group-hover:text-blue-300'}`}>
          {node.name}
        </span>
        {node.description && <span className="text-[9px] text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity ml-auto italic"># {node.description}</span>}
      </div>
      {node.type === 'folder' && (isOpen || highlight) && node.children && (
        <div className="border-l border-slate-900 ml-6 my-1">
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} depth={depth + 1} highlight={highlight} />
          ))}
        </div>
      )}
    </div>
  );
};

const SystemTree: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm) return null;
    const query = searchTerm.toLowerCase();
    
    // Búsqueda en parámetros de simulación
    const params = [
      { name: 'Evolution Rate', val: 'Δv', desc: 'R-QNT growth constant' },
      { name: 'Density', val: 'ρ', desc: 'Quantum foam density' },
      { name: 'Central Mass', val: 'M', desc: 'Curvature singularity' },
      { name: 'Strong Energy', val: 'E', desc: 'Gluon field strength' },
      { name: 'Planck Scale', val: 'λp', desc: 'Fundamental length' }
    ].filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));

    // Búsqueda en IAs del ecosistema
    const iaLayers = INITIAL_LAYERS.filter(l => 
      l.name.toLowerCase().includes(query) || 
      l.role.toLowerCase().includes(query) || 
      l.description.toLowerCase().includes(query)
    );

    return { params, iaLayers };
  }, [searchTerm]);

  const handleHiddenCodeExport = async () => {
    const obfuscatedName = `SRC_${Math.random().toString(36).substring(2, 8).toUpperCase()}_V2.zip`;
    try {
      const blob = await ZipService.generateProjectBundle(INITIAL_LAYERS, "Full System Export");
      ZipService.downloadBlob(blob, obfuscatedName);
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/20">
      <div className="p-8 pb-4">
        <div 
          className="flex items-center gap-4 mb-6 px-2 cursor-default"
          onDoubleClick={handleHiddenCodeExport}
          title="System Node Control"
        >
          <i className="fas fa-project-diagram text-blue-500 text-lg"></i>
          <h3 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.4em] select-none">System Explorer</h3>
        </div>

        {/* Global Search Bar */}
        <div className="relative mb-6">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
          <input 
            type="text" 
            placeholder="Buscar parámetros, IAs, archivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-[11px] font-mono text-blue-400 outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-700"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8">
        {searchResults ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
            {searchResults.iaLayers.length > 0 && (
              <div>
                <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3 px-4">Capas de IA Encontradas</h4>
                <div className="space-y-2">
                  {searchResults.iaLayers.map(ia => (
                    <div key={ia.id} className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl hover:bg-blue-500/10 transition-colors cursor-pointer">
                      <div className="text-[10px] font-bold text-slate-200">{ia.name}: {ia.role}</div>
                      <div className="text-[9px] text-slate-500 italic mt-1">{ia.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {searchResults.params.length > 0 && (
              <div>
                <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3 px-4">Métricas de Simulación</h4>
                <div className="space-y-2">
                  {searchResults.params.map((p, i) => (
                    <div key={i} className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="text-[10px] font-bold text-slate-200">{p.name}</div>
                        <div className="text-[8px] text-slate-600 uppercase mt-0.5">{p.desc}</div>
                      </div>
                      <div className="text-xs font-mono text-emerald-400">{p.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.iaLayers.length === 0 && searchResults.params.length === 0 && (
              <div className="text-center py-10 opacity-30 italic text-[10px] uppercase">Sin coincidencias neurales</div>
            )}
            
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 px-4">Archivos del Sistema</h4>
              <TreeNode node={STRUCTURE} depth={0} highlight={searchTerm} />
            </div>
          </div>
        ) : (
          <TreeNode node={STRUCTURE} depth={0} />
        )}
      </div>
    </div>
  );
};

export default SystemTree;
