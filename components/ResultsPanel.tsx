
import React, { useState, useMemo } from 'react';
import { ExportService } from '../services/ExportService';

export interface IAState {
    running: boolean;
    confidence: number;
    lastResponse: string;
}

const IA_COLORS = {
    ia1: '#FF4444', ia2: '#4444FF', ia3: '#44FF44', ia4: '#FF44FF',
    ia5: '#FFFF44', ia6: '#44FFFF', ia7: '#FF8844', ia8: '#00FF9D',
    ia9: '#F59E0B', ia10: '#10B981', ia11: '#6366F1', ia12: '#EC4899'
};

interface ResultsPanelProps {
    iaStates: Record<number, IAState>;
    globalConsensus: number;
    notifications: string[];
    onExport: () => void;
    currentState: any;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ iaStates, globalConsensus, notifications, onExport, currentState }) => {
    const [expandedIA, setExpandedIA] = useState<number | null>(null);

    return (
        <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 flex flex-col h-full shadow-2xl relative overflow-hidden">
            <header className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Status</h3>
                    <div className="text-xl font-bold text-white tracking-tight">Cortex Sync</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <i className="fas fa-microchip"></i>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                 {/* Consensus Module */}
                 <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confidence</span>
                        <span className="text-lg font-black text-emerald-400">{(globalConsensus * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${globalConsensus * 100}%` }} />
                    </div>
                 </div>

                 {/* List of IAs */}
                 <div className="space-y-2">
                    {Object.entries(iaStates).map(([key, state]) => {
                        const id = parseInt(key);
                        const s = state as IAState;
                        const color = (IA_COLORS as any)[`ia${id}`] || '#fff';
                        return (
                            <div key={key} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}></div>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">IA-{id}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500">{(s.confidence * 100).toFixed(0)}%</span>
                            </div>
                        );
                    })}
                 </div>
            </div>
            
            <footer className="mt-6 pt-6 border-t border-white/5 shrink-0">
                <div className="h-24 overflow-y-auto text-[9px] font-mono text-slate-500 custom-scrollbar mb-6 bg-black/40 p-4 rounded-2xl border border-white/5">
                    {notifications.map((n, i) => <div key={i} className="mb-2"> <span className="text-blue-500">[{i}]</span> {n}</div>)}
                </div>
                <button 
                    onClick={() => ExportService.exportToJSON(currentState, iaStates, notifications)}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                >
                    Export Córtex State
                </button>
            </footer>
        </div>
    );
};

export default ResultsPanel;
