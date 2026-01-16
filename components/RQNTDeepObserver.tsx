
import React, { useMemo, useState } from 'react';
import { Layer, GlobalState, LayerStatus } from '../types';

interface RQNTDeepObserverProps {
  layers: Layer[];
  simulationData: GlobalState;
  onClose: () => void;
}

const RQNTDeepObserver: React.FC<RQNTDeepObserverProps> = ({ layers, simulationData, onClose }) => {
  const [activeTab, setActiveTab] = useState<'STABILITY' | 'ANOMALIES' | 'GEOMETRY'>('STABILITY');

  const stabilityScore = useMemo(() => {
    const completed = layers.filter(l => l.status === LayerStatus.COMPLETED);
    if (completed.length === 0) return 0;
    return Math.round(completed.reduce((acc, l) => acc + (l.confidenceIndex || 0), 0) / completed.length);
  }, [layers]);

  const ia2Data = useMemo(() => layers.find(l => l.id === 2), [layers]);

  return (
    <div className="h-full w-full flex bg-slate-950/40 backdrop-blur-3xl animate-in fade-in duration-500 overflow-hidden">
      {/* Panel Lateral Interno - Análisis Focalizado */}
      <div className="w-[450px] border-r border-white/5 flex flex-col p-12 bg-black/40 shrink-0">
        <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_#3b82f6]"></div>
              <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em]">R-QNT Deep Monitor</h3>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-6">
              Divergencia <br /> <span className="text-blue-500">Relacional</span>
            </h2>
            <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
              <div className="text-[8px] font-black text-blue-400 uppercase mb-2">Monitor Focalizado: IA2</div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono italic">
                Analizando el nudo borromeo de la simulación actual en busca de colapsos de Wheeler.
              </p>
            </div>
        </header>

        <nav className="flex flex-col gap-3 mb-12">
          {[
            { id: 'STABILITY', label: 'Campo de Estabilidad', icon: 'fa-microchip' },
            { id: 'ANOMALIES', label: 'Métricas Relativas', icon: 'fa-wave-square' },
            { id: 'GEOMETRY', label: 'Topología Borromea', icon: 'fa-draw-polygon' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-8 py-5 rounded-[1.5rem] transition-all border ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20 border-blue-400' : 'bg-transparent border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              <i className={`fas ${tab.icon} text-sm`}></i>
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={onClose}
          className="mt-auto py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 transition-all flex items-center justify-center gap-3"
        >
          <i className="fas fa-times text-[10px]"></i>
          Cerrar Monitor Focalizado
        </button>
      </div>

      {/* Área de Visualización Focalizada */}
      <div className="flex-1 p-20 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03)_0%,transparent_70%)]">
        {activeTab === 'STABILITY' && (
          <div className="space-y-16 animate-in fade-in duration-700">
            <div className="flex flex-col items-center">
                <div className="relative w-[450px] h-[450px] flex items-center justify-center">
                    <div className="absolute inset-0 border-[20px] border-white/[0.02] rounded-full"></div>
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle 
                            cx="225" cy="225" r="200" stroke="currentColor" strokeWidth="10" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 200}
                            strokeDashoffset={2 * Math.PI * 200 * (1 - stabilityScore / 100)}
                            className="text-blue-500 transition-all duration-2000 ease-out"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="text-center z-10">
                        <div className="text-9xl font-black text-white tracking-tighter leading-none">{stabilityScore}</div>
                        <div className="text-[12px] font-bold text-blue-400 uppercase tracking-[0.5em] mt-4">Sync Level</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-10 max-w-5xl mx-auto">
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Procesamiento de IA2</h4>
                    <div className="font-mono text-[11px] text-blue-300/80 leading-relaxed bg-black/40 p-8 rounded-3xl border border-white/5 h-48 overflow-y-auto custom-scrollbar shadow-inner">
                        {ia2Data?.output || "// El implementador está esperando directivas de Wheeler..."}
                    </div>
                </div>
                <div className="p-10 bg-blue-500/5 border border-blue-500/20 rounded-[3rem] flex flex-col justify-center items-center text-center">
                    <div className="relative mb-8">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute inset-0"></div>
                        <i className="fas fa-atom text-5xl text-blue-500 relative"></i>
                    </div>
                    <h4 className="text-sm font-black text-white uppercase mb-3 tracking-widest">Coherencia Wheeler</h4>
                    <p className="text-[10px] text-slate-500 italic max-w-xs leading-relaxed">"La curvatura local en la escala de Planck {simulationData.parameters.scale} se mantiene dentro de los márgenes de la Triada ABC."</p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'GEOMETRY' && (
            <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-700">
                <div className="relative w-[500px] h-[500px]">
                    <div className="absolute inset-0 border-2 border-blue-500/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
                    <div className="absolute inset-12 border-2 border-purple-500/10 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-24 border-2 border-emerald-500/10 rounded-full animate-[spin_40s_linear_infinite]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-slate-900/40 backdrop-blur-2xl p-16 rounded-full border border-white/10 shadow-3xl">
                            <i className="fas fa-link text-7xl text-blue-500 mb-8 opacity-60"></i>
                            <div className="text-[14px] font-black text-white uppercase tracking-[0.8em] ml-3">Triada ABC</div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'ANOMALIES' && (
            <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-right-10 duration-700">
                <div className="flex items-baseline gap-4 mb-12">
                    <h3 className="text-5xl font-black text-white uppercase tracking-tighter">Divergencias</h3>
                    <span className="text-blue-500 font-mono text-2xl opacity-50">v2.1.0</span>
                </div>
                {layers.filter(l => (l.confidenceIndex || 100) < 75).length > 0 ? (
                    layers.map(l => (l.confidenceIndex || 100) < 75 && (
                        <div key={l.id} className="p-12 bg-red-500/5 border border-red-500/20 rounded-[3rem] flex items-center gap-12 group hover:bg-red-500/10 transition-all">
                            <div className="w-24 h-24 rounded-[2rem] bg-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)] shrink-0">
                                <i className="fas fa-bolt-lightning text-4xl"></i>
                            </div>
                            <div className="flex-1">
                                <h5 className="text-2xl font-bold text-white uppercase mb-2 tracking-tight">{l.name}: {l.role}</h5>
                                <p className="text-[10px] text-red-400/70 font-mono uppercase tracking-widest mb-6">Confianza Crítica: {l.confidenceIndex}%</p>
                                <div className="flex gap-4">
                                    <button className="text-[9px] font-black text-white bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl uppercase tracking-widest transition-all">Aislar Nodo ABC</button>
                                    <button className="text-[9px] font-black text-slate-400 border border-white/10 px-6 py-3 rounded-xl uppercase tracking-widest hover:text-white transition-all">Recalibrar Invariancia</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-40 opacity-20">
                         <i className="fas fa-shield-check text-[12rem] mb-12 text-emerald-500/40"></i>
                         <div className="text-2xl font-black uppercase tracking-[1em] text-white">Estado Nominal</div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default RQNTDeepObserver;
