
import React, { useState } from 'react';
import { ExternalIntegrationService, ExternalAppData } from '../services/ExternalIntegrationService';

interface DataLinkPanelProps {
  onDataImported: (data: ExternalAppData) => void;
  addNarrative: (msg: string) => void;
}

const DataLinkPanel: React.FC<DataLinkPanelProps> = ({ onDataImported, addNarrative }) => {
  const [url, setUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [importedData, setImportedData] = useState<ExternalAppData | null>(null);

  const handleSync = async () => {
    if (!url.includes('google') && !url.includes('ai')) {
      addNarrative("⚠️ IA5: El link no parece ser una fuente válida de Google AI.");
      return;
    }

    setIsSyncing(true);
    addNarrative(`🌐 IA3: Iniciando puente cuántico con fuente externa...`);
    
    try {
      const data = await ExternalIntegrationService.validateAndImportLink(url);
      setImportedData(data);
      onDataImported(data);
      addNarrative(`✅ IA3: Sincronización exitosa con ${data.appName}. Confiabilidad: ${data.reliabilityScore}%`);
    } catch (error) {
      addNarrative("❌ IA7: Error en la vinculación de datos externos.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-slate-950/60 border border-blue-500/20 rounded-[2.5rem] p-6 backdrop-blur-xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
          <i className="fas fa-link"></i>
        </div>
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-tighter">Google AI Data Link</h3>
          <p className="text-[9px] text-slate-500 uppercase">Sincronización de Ecosistema</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://google-ai-app-reference.com/..."
          className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-mono text-blue-300 outline-none focus:border-blue-500/40"
        />
        <button 
          onClick={handleSync}
          disabled={isSyncing || !url}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl transition-all"
        >
          {isSyncing ? <i className="fas fa-sync fa-spin"></i> : 'Sincronizar'}
        </button>
      </div>

      {importedData && (
        <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-emerald-400">{importedData.appName}</span>
            <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">Verified</span>
          </div>
          <p className="text-[9px] text-slate-400 italic mb-2">{importedData.summary}</p>
          <div className="flex gap-2">
            {importedData.extractedParameters.constants?.map((c: string, i: number) => (
              <span key={i} className="text-[8px] font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/10">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataLinkPanel;
