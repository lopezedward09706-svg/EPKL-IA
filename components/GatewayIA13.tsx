
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SecurityService } from '../services/SecurityService';
import { WebSocketService } from '../services/websocketService';
import { QuantumValidationService } from '../services/QuantumValidationService';

interface GatewayIA13Props {
  onUnlock: () => void;
  isSystemLocked: boolean;
  addNarrative: (message: string) => void;
}

type ValidationPhase = 'IDLE' | 'ANALYZING' | 'QUANTUM_CHECK' | 'VALIDATING' | 'SUCCESS' | 'READY_TO_START' | 'INITIALIZING' | 'ERROR' | 'LOCKED';

const GatewayIA13: React.FC<GatewayIA13Props> = ({ 
  onUnlock, 
  isSystemLocked, 
  addNarrative 
}) => {
  const [inputKey, setInputKey] = useState('');
  const [validationPhase, setValidationPhase] = useState<ValidationPhase>('IDLE');
  const [validationMessage, setValidationMessage] = useState(
    '🔐 IA13 QUANTUM GATEWAY - AWAITING MASTER KEY'
  );
  
  const [securityStatus, setSecurityStatus] = useState(SecurityService.getSecurityStatus());
  const [entropyMetrics, setEntropyMetrics] = useState({ score: 0, level: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH' | 'QUANTUM' });
  const [dynamicEntropy, setDynamicEntropy] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number>(0);
  const ws = WebSocketService.getInstance();

  useEffect(() => {
    if (isSystemLocked && inputRef.current && validationPhase === 'IDLE') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isSystemLocked, validationPhase]);

  useEffect(() => {
    const updateMetrics = async () => {
      if (inputKey) {
        const result = await QuantumValidationService.validateKeyComplexity(inputKey);
        setEntropyMetrics({ score: result.score, level: result.level });
      } else {
        setEntropyMetrics({ score: 0, level: 'LOW' });
      }
    };
    updateMetrics();
  }, [inputKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      const status = SecurityService.getSecurityStatus();
      setSecurityStatus(status);
      if (status.isLocked) {
        setValidationPhase('LOCKED');
        setValidationMessage(`⏳ SYSTEM TEMPORARILY LOCKED UNTIL ${status.lockUntil}`);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isSystemLocked) return;
    const animate = () => {
      setDynamicEntropy(prev => (prev + 0.5) % 100);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isSystemLocked]);

  const handleUnlock = async () => {
    if (!inputKey.trim() || validationPhase !== 'IDLE') return;
    
    setValidationPhase('ANALYZING');
    setValidationMessage('⚛️ ANALYZING QUANTUM ENTROPY...');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setValidationPhase('QUANTUM_CHECK');
    setValidationMessage('🛰️ CHECKING SYMBOLIC COHERENCE...');
    await new Promise(resolve => setTimeout(resolve, 600));
    setValidationPhase('VALIDATING');
    setValidationMessage('🔗 VERIFYING MULTI-LAYER SIGNATURES...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = await SecurityService.validateMasterKey(inputKey);
    
    if (result.isValid) {
      setValidationPhase('SUCCESS');
      setValidationMessage('✅ VALIDATION SUCCESSFUL');
      addNarrative('🔓 IA13: VALIDACIÓN EXITOSA - CANAL ABIERTO');
      
      ws.broadcast('SECURITY_EVENT', {
        type: 'SYSTEM_VERIFIED',
        agent: 'Edward_PL',
        timestamp: new Date().toISOString(),
        entropyLevel: entropyMetrics.level
      });
      
      setTimeout(() => {
        setValidationPhase('READY_TO_START');
        setValidationMessage('🚀 SISTEMA PREPARADO PARA INICIALIZACIÓN');
      }, 1000);
    } else {
      setValidationPhase('ERROR');
      setValidationMessage(`❌ ${result.message}`);
      setSecurityStatus(SecurityService.getSecurityStatus());
      
      if (result.remainingAttempts !== undefined) {
        addNarrative(`⚠️ IA13: ${result.remainingAttempts} intentos restantes.`);
      }
      
      setTimeout(() => {
        setValidationPhase('IDLE');
        setValidationMessage('🔐 AWAITING MASTER KEY');
        inputRef.current?.focus();
      }, 2500);
    }
  };

  const startSequence = async () => {
    setValidationPhase('INITIALIZING');
    setValidationMessage('⚡ INICIALIZANDO NÚCLEOS IA...');
    
    const layers = ["OBSERVER", "IMPLEMENTER", "COSMIC", "MATH_CONST", "NAVIGATOR", "SCALER", "FAULT_DET", "CORRECTOR", "NARRATOR", "SCIENTIFIC", "PAPER_GEN", "PUBLISHER"];
    
    for (let i = 0; i < layers.length; i++) {
      addNarrative(`⚙️ BOOT: Capa ${i+1} (${layers[i]}) Online...`);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    addNarrative('🚀 IA13: PROTOCOLO DE INICIO COMPLETADO');
    onUnlock();
    setInputKey('');
    setValidationPhase('IDLE');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && validationPhase === 'IDLE') {
      handleUnlock();
    }
  };

  const getPhaseStyles = () => {
    switch (validationPhase) {
      case 'SUCCESS': 
      case 'READY_TO_START': return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
      case 'INITIALIZING': return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 animate-pulse';
      case 'ERROR': return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'LOCKED': return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
      case 'ANALYZING':
      case 'QUANTUM_CHECK':
      case 'VALIDATING': return 'border-blue-500/30 bg-blue-500/10 text-blue-400 animate-pulse';
      default: return 'border-white/5 bg-black/40 text-slate-400';
    }
  };

  return (
    <div className="relative bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/10 shadow-3xl backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" style={{ transform: `translateX(${dynamicEntropy}%)` }}></div>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 ${isSystemLocked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <i className={`fas ${validationPhase === 'SUCCESS' || validationPhase === 'READY_TO_START' ? 'fa-check' : 'fa-microchip'} text-xl`}></i>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">IA13 Quantum Gateway</h3>
              <h2 className="text-xl font-bold text-white">Seguridad de Acceso</h2>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${securityStatus.isLocked ? 'border-red-500/30 text-red-400' : 'border-emerald-500/30 text-emerald-400'}`}>
            {securityStatus.isLocked ? 'Bloqueado' : 'Nominal'}
          </div>
        </div>

        <div className="space-y-4">
          {(validationPhase === 'IDLE' || validationPhase === 'ERROR') && (
            <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Quantum Signature Key</span>
                {inputKey && (
                  <span className={`text-[8px] font-black uppercase tracking-widest ${entropyMetrics.score > 70 ? 'text-cyan-400' : 'text-slate-500'}`}>
                    Entropía: {entropyMetrics.score.toFixed(0)}%
                  </span>
                )}
              </div>
              <input
                ref={inputRef}
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="••••••••••••••••"
                className="w-full bg-black/60 border-2 border-white/5 focus:border-blue-500/40 rounded-3xl px-6 py-5 text-center text-white font-mono text-xl tracking-[0.4em] transition-all outline-none"
              />
            </div>
          )}

          <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${getPhaseStyles()}`}>
            <i className={`fas ${validationPhase === 'ERROR' ? 'fa-circle-xmark' : 'fa-shield-halved'} text-sm shrink-0`}></i>
            <span className="text-[11px] font-bold tracking-wide">{validationMessage}</span>
          </div>

          {validationPhase === 'READY_TO_START' ? (
            <button
              onClick={startSequence}
              className="w-full py-6 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 animate-in zoom-in-95 duration-300 flex items-center justify-center gap-3"
            >
              <i className="fas fa-power-off"></i>
              INICIAR SISTEMA NEURAL
            </button>
          ) : (
            <button
              onClick={handleUnlock}
              disabled={!inputKey || validationPhase !== 'IDLE' || securityStatus.isLocked}
              className="w-full py-5 rounded-3xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10 active:scale-95"
            >
              {validationPhase === 'IDLE' ? 'Validar Firma Cuántica' : 'Procesando...'}
            </button>
          )}

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Intentos</div>
              <div className="text-xs font-mono font-bold text-slate-400">{securityStatus.attempts} / {securityStatus.maxAttempts}</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Amenaza</div>
              <div className={`text-xs font-mono font-bold ${securityStatus.threatLevel === 'CRITICAL' ? 'text-red-500' : 'text-slate-400'}`}>{securityStatus.threatLevel}</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Uptime</div>
              <div className="text-xs font-mono font-bold text-blue-500">99.9%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatewayIA13;
