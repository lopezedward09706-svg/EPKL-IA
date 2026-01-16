
import React, { useState } from 'react';
import { ZipService } from '../services/zipService';
import { ContextExportService } from '../services/contextExportService';
import { ManifestService } from '../services/manifestService';
import { ManifestExportService } from '../services/manifestExportService';
import { Layer } from '../types';

interface QuantumBridgeHubProps {
  layers: Layer[];
  paperOutput?: string;
  userInput: string;
  addNarrative: (msg: string) => void;
  currentLogs?: string[];
}

const EXTERNAL_APPS = [
  { id: 'app-1', name: 'R-QNT Visualizer Pro', icon: 'fa-project-diagram', url: 'https://rqnt-visualizer.ai' },
  { id: 'app-2', name: 'CERN Data Extractor', icon: 'fa-microchip', url: 'https://cern-bridge.ai' }
];

const QuantumBridgeHub: React.FC<QuantumBridgeHubProps> = ({ layers, paperOutput, userInput, addNarrative, currentLogs = [] }) => {
  const [isPacking, setIsPacking] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const handleDownloadBundle = async () => {
    if (!paperOutput) {
      addNarrative("⚠️ IA11: El paper aún no ha sido generado para empaquetar.");
      return;
    }
    setIsPacking(true);
    addNarrative("📦 IA11: Iniciando compilación de paquete ZIP para Edward PL...");
    
    try {
      const blob = await ZipService.generateProjectBundle(layers, paperOutput);
      setTimeout(() => {
        ZipService.downloadBlob(blob, `EDPLIA_BUNDLE_${Date.now()}.zip`);
        addNarrative("✅ IA11: Paquete descargado con éxito.");
        setIsPacking(false);
      }, 2000);
    } catch (e) {
      addNarrative("❌ IA7: Error crítico en la serialización del bundle.");
      setIsPacking(false);
    }
  };

  const handleExportFullCodeStructure = async () => {
    setIsExtending(true);
    addNarrative("🧬 IA13: Exportando Estructura de Código y Contexto (.json)...");
    
    try {
      const blob = await ManifestExportService.generateContextExtension(layers, userInput, currentLogs);
      setTimeout(() => {
        ManifestExportService.download(blob);
        addNarrative("✅ IA13: Estructura exportada. Lista para usar como extensión de conocimiento.");
        setIsExtending(false);
      }, 1500);
    } catch (e) {
      addNarrative("❌ IA7: Fallo en la exportación de la estructura.");
      setIsExtending(false);
    }
  };

  const handleExportCortex = async () => {
    setIsExporting(true);
    addNarrative("🧠 IA13: Generando Córtex del Sistema (.edplia)...");
    
    try {
      const blob = await ContextExportService.exportSystemCortex(layers, userInput);
      setTimeout(() => {
        ContextExportService.downloadCortex(blob);
        addNarrative("✅ IA13: Córtex del Sistema exportado.");
        setIsExporting(false);
      }, 1500);
    } catch (e) {
      addNarrative("❌ IA7: Fallo en la exportación del córtex.");
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-950/40 border border-purple-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <i className="fas fa-network-wired text-xl"></i>
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">Quantum Bridge Hub</h3>
            <p className="text-[9px] text-slate-500 uppercase font-mono">Multichannel Data Expansion</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportFullCodeStructure}
            disabled={isExtending}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl transition-all flex items-center gap-2 border border-blue-400/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
            title="Exportar toda la estructura de código como extensión JSON"
          >
            {isExtending ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-code"></i>}
            Full Structure (.json)
          </button>
          <button 
            onClick={handleExportCortex}
            disabled={isExporting}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl transition-all flex items-center gap-2 border border-indigo-400/30"
          >
            {isExporting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-brain"></i>}
            Cortex (.edplia)
          </button>
          <button 
            onClick={handleDownloadBundle}
            disabled={isPacking}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl transition-all flex items-center gap-2 border border-white/5"
          >
            {isPacking ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-archive"></i>}
            Pack (.zip)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {EXTERNAL_APPS.map(app => (
          <a 
            key={app.id}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => addNarrative(`🚀 IA5: Abriendo canal externo hacia ${app.name}...`)}
            className="group p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-purple-500/40 transition-all flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-slate-400 group-hover:text-purple-400 transition-colors">
              <i className={`fas ${app.icon}`}></i>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-[10px] font-bold text-slate-300 group-hover:text-white truncate uppercase">{app.name}</div>
              <div className="text-[8px] text-slate-600 font-mono truncate">{app.url}</div>
            </div>
            <i className="fas fa-external-link-alt text-[8px] text-slate-700 group-hover:text-purple-400"></i>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuantumBridgeHub;
