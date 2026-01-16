
import React from 'react';
import { Layer, LayerStatus, GlobalState } from '../types';

interface LayerDetailModalProps {
  layer: Layer;
  onClose: () => void;
  simulationData: GlobalState;
}

const LayerDetailModal: React.FC<LayerDetailModalProps> = ({ layer, onClose, simulationData }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-3xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl h-full max-h-[85vh] bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-500">
        <header className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <i className={`fas ${layer.icon} text-2xl text-blue-400`}></i>
            </div>
            <div>
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Cortex Deep Analysis</div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">{layer.name}: {layer.role}</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <i className="fas fa-times"></i>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Data & Logs */}
          <div className="space-y-8">
            <div className="bg-black/30 rounded-3xl p-8 border border-white/5">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Unidad Operacional</h3>
              <p className="text-slate-300 text-sm leading-relaxed italic font-mono mb-4">
                "{layer.description}"
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[8px] text-slate-500 uppercase mb-1">Status</div>
                  <div className="text-xs font-bold text-blue-400 uppercase">{layer.status}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[8px] text-slate-500 uppercase mb-1">Confidence</div>
                  <div className="text-xs font-bold text-emerald-400">{layer.confidenceIndex || 0}%</div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-3xl p-8 border border-white/5 h-64 overflow-hidden flex flex-col">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Output Stream</h3>
              <div className="flex-1 overflow-y-auto font-mono text-[11px] text-blue-300/80 leading-relaxed custom-scrollbar bg-black/40 p-6 rounded-2xl border border-white/5">
                {layer.output || "// Awaiting data transmission..."}
              </div>
            </div>
          </div>

          {/* Right Column: IA-Specific Visualization */}
          <div className="space-y-8">
            {layer.id === 2 ? (
              <div className="h-full flex flex-col gap-6">
                <div className="flex-1 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-[2.5rem] border border-blue-500/20 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <i className="fas fa-microchip text-6xl text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-700"></i>
                  <h4 className="text-lg font-black text-white uppercase tracking-widest mb-2">Simulador Comparador Cuántico</h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Analizando discrepancias entre la Relatividad General y la Tríada ABC en escala {simulationData.parameters.scale}.
                  </p>
                  
                  <div className="mt-8 w-full space-y-4">
                    <div className="flex justify-between text-[9px] uppercase font-bold text-slate-500">
                      <span>Standard Deviation</span>
                      <span className="text-blue-400">0.00042ζ</span>
                    </div>
                    <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Feedback</h5>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <i className="fas fa-check-double"></i>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      "La IA2 ha detectado una anomalía en el nudo borromeo central. Se recomienda recalibrar la masa de Wheeler."
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-black/20 rounded-[2.5rem] border border-dashed border-white/10 text-slate-700">
                <div className="text-center">
                  <i className="fas fa-project-diagram text-4xl mb-4 opacity-20"></i>
                  <div className="text-[10px] uppercase font-black tracking-widest">General Visualization Layer</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="px-10 py-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
          <div className="text-[9px] font-mono text-slate-600 uppercase">Signature: {layer.signature}</div>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
          >
            Acknowledge Analysis
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LayerDetailModal;
