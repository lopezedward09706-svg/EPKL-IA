
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LayerStatus, GlobalState } from './types';
import { useEDPLIAState } from './hooks/useEDPLIAState';
import { analyzeWithLayer } from './services/geminiService';
import { WebSocketService, NetworkEvent } from './services/websocketService';
import { fetchOrcidProfile } from './services/journalService';
import LayersContainer from './components/LayersContainer';
import SimulationPanel from './components/SimulationPanel';
import ResultsPanel from './components/ResultsPanel';
import SystemTree from './components/SystemTree';
import GatewayIA13 from './components/GatewayIA13';
import DataLinkPanel from './components/DataLinkPanel';
import RQNTDeepObserver from './components/RQNTDeepObserver';
import LayerDetailModal from './components/LayerDetailModal';
import QuantumFoamSimulation from './components/QuantumFoamSimulation';

type ViewMode = 'CONTROL' | 'SIMULATION' | 'OBSERVER';

const App: React.FC = () => {
  const { 
    state, updateLayer, addNarrative, addLog, 
    unlock, toggleExplorer, setProcessing, updateInput,
    systemHealth
  } = useEDPLIAState();
  
  const [viewMode, setViewMode] = useState<ViewMode>('CONTROL');
  const [selectedLayerForDetail, setSelectedLayerForDetail] = useState<number | null>(null);
  const ws = WebSocketService.getInstance();

  const simulationStateRef = useRef<GlobalState>({
    nodes: [],
    quarks: [],
    parameters: {
      scale: 8,
      n_abc: 200,
      centralMass: 0.5,
      timeSpeed: 1.0,
      evolutionRate: 0.1,
      density: 2.0,
      strongEnergy: 2.0
    }
  });

  useEffect(() => {
    const cleanup = ws.onMessage((event: NetworkEvent) => {
      if (event.type === 'IA_COLLABORATION') addNarrative(`[NET] ${event.payload.source}: ${event.payload.message}`);
    });
    fetchOrcidProfile().then(profile => addNarrative(`👤 Perfil Activo: ${profile.fullName}`));
    return () => { cleanup(); ws.disconnect(); };
  }, []);

  const iaStatesMap = useMemo(() => {
    return state.layers.reduce((acc, layer) => {
      acc[layer.id] = {
        running: layer.status === LayerStatus.PROCESSING,
        confidence: (layer.confidenceIndex || 0) / 100,
        lastResponse: layer.output || ''
      };
      return acc;
    }, {} as Record<number, any>);
  }, [state.layers]);

  const handleLayerSelection = (id: number) => {
    const layer = state.layers.find(l => l.id === id);
    if (id === 2 || (layer?.confidenceIndex && layer.confidenceIndex < 75)) {
      setViewMode('OBSERVER');
    } else {
      setSelectedLayerForDetail(id);
    }
  };

  const handleSimulationFlow = async () => {
    if (state.isSystemLocked || state.isProcessing) return;
    setProcessing(true);
    addNarrative("🚀 INICIANDO ANÁLISIS R-QNT MULTI-CAPA...");
    
    let accumulated = "";
    for (const layer of state.layers) {
      if (layer.id > 12) continue;
      updateLayer(layer.id, { status: LayerStatus.PROCESSING });
      try {
        const res = await analyzeWithLayer(layer, state.userInput, accumulated);
        accumulated += `\nIA${layer.id}: ${res.text}\n`;
        updateLayer(layer.id, { 
            status: LayerStatus.COMPLETED, 
            output: res.text, 
            confidenceIndex: res.confidence 
        });
        addLog(layer.id, `Análisis exitoso`, 'success');
      } catch (error) {
        updateLayer(layer.id, { status: LayerStatus.ERROR });
        setProcessing(false);
        return;
      }
    }
    setProcessing(false);
  };

  return (
    <div className="h-screen w-full bg-[#020408] text-slate-200 font-inter flex overflow-hidden relative">
      
      <div className={`fixed inset-0 transition-all duration-1000 ${viewMode === 'SIMULATION' ? 'opacity-100 z-40' : 'opacity-10 z-0'}`}>
         <QuantumFoamSimulation params={simulationStateRef.current.parameters} onBack={() => setViewMode('CONTROL')} />
      </div>

      <aside className={`h-full bg-slate-950/98 border-r border-white/5 transition-all duration-500 overflow-hidden shrink-0 ${state.isExplorerOpen ? 'w-80 opacity-100 z-50' : 'w-0 opacity-0 z-0'}`}>
        <SystemTree />
      </aside>

      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        <header className="h-20 px-10 flex items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl z-50 shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-blue-500 tracking-tighter uppercase leading-none">EDPLIA CORTEX</h1>
              <span className="text-[8px] font-mono text-slate-500 mt-1 tracking-[0.3em]">QUANTUM_RESEARCH_V2</span>
            </div>
            
            <nav className="flex bg-black/60 p-1.5 rounded-2xl border border-white/5 ml-4">
                {[
                    { id: 'CONTROL', label: 'Dashboard', icon: 'fa-th-large' },
                    { id: 'SIMULATION', label: 'Planck Foam', icon: 'fa-atom' },
                    { id: 'OBSERVER', label: 'Deep Monitor', icon: 'fa-radar' }
                ].map(item => (
                    <button 
                        key={item.id}
                        onClick={() => setViewMode(item.id as ViewMode)}
                        className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <i className={`fas ${item.icon} text-[10px]`}></i>
                        <span className="hidden lg:inline">{item.label}</span>
                    </button>
                ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-5">
            <button onClick={handleSimulationFlow} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
              {state.isProcessing ? 'Sincronizando...' : 'Iniciar Flujo'}
            </button>
            <button onClick={toggleExplorer} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                <i className={`fas ${state.isExplorerOpen ? 'fa-indent' : 'fa-outdent'}`} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-slate-950/20">
          {viewMode === 'CONTROL' && (
            <main className="p-10 space-y-12 max-w-[1900px] mx-auto w-full animate-in fade-in duration-500">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full lg:h-[600px]">
                <div className="lg:col-span-8 flex flex-col gap-8 h-full">
                    <div className="flex-1 min-h-[400px]">
                      <SimulationPanel metrics={systemHealth} simulationStateRef={simulationStateRef} />
                    </div>
                    <div className="h-44 shrink-0 relative group">
                      <div className="absolute top-4 left-8 text-[8px] font-black text-blue-500 uppercase opacity-60 z-10 font-mono tracking-widest group-focus-within:opacity-100 transition-opacity">Neural Stream Terminal</div>
                      <textarea 
                          value={state.userInput} 
                          onChange={(e) => updateInput(e.target.value)} 
                          className="bg-black/40 backdrop-blur-xl text-xs font-mono text-blue-400 w-full h-full outline-none p-10 pt-12 rounded-[2.5rem] border border-white/5 focus:border-blue-500/30 transition-all resize-none shadow-2xl custom-scrollbar"
                          placeholder="Ingrese directivas teóricas ABC..."
                      />
                    </div>
                </div>

                <div className="lg:col-span-4 h-full">
                    <ResultsPanel 
                        iaStates={iaStatesMap} 
                        globalConsensus={state.layers.reduce((acc,l) => acc + (l.confidenceIndex || 0), 0) / (state.layers.length * 100)}
                        notifications={state.narrativeLog.slice(0, 15)}
                        onExport={() => {}}
                        currentState={simulationStateRef.current}
                    />
                </div>
              </div>

              <div className="space-y-8">
                  <div className="flex items-center gap-6 px-4">
                      <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] whitespace-nowrap">Neural Ecosystem Core</h2>
                      <div className="h-[1px] flex-1 bg-white/5"></div>
                  </div>
                  <div className="bg-black/20 p-10 rounded-[4rem] border border-white/5 shadow-inner">
                    <LayersContainer 
                        layers={state.layers} 
                        activeLayerId={state.currentLayer} 
                        onLayerSelect={handleLayerSelection} 
                    />
                  </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-16">
                <DataLinkPanel onDataImported={() => {}} addNarrative={addNarrative} />
                <div className="lg:col-span-2">
                    <GatewayIA13 isSystemLocked={state.isSystemLocked} onUnlock={unlock} addNarrative={addNarrative} />
                </div>
              </div>
            </main>
          )}

          {viewMode === 'OBSERVER' && (
            <div className="h-full w-full bg-slate-950/40 backdrop-blur-3xl animate-in zoom-in-95 duration-500 overflow-hidden">
              <RQNTDeepObserver 
                  layers={state.layers}
                  simulationData={simulationStateRef.current}
                  onClose={() => setViewMode('CONTROL')}
              />
            </div>
          )}
        </div>
      </div>

      {selectedLayerForDetail && (
        <LayerDetailModal 
          layer={state.layers.find(l => l.id === selectedLayerForDetail)!}
          onClose={() => setSelectedLayerForDetail(null)}
          simulationData={simulationStateRef.current}
        />
      )}
    </div>
  );
};

export default App;
