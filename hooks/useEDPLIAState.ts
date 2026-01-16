
import { useState, useReducer, useEffect } from 'react';
import { AnalysisState, LayerStatus, Suggestion, Layer, SystemHealth, LogEntry } from '../types';
import { INITIAL_LAYERS } from '../constants';
import { WebSocketService } from '../services/websocketService';
import { apiService } from '../services/apiService';

type EDPLIAAction = 
  | { type: 'UPDATE_LAYER'; payload: { id: number; updates: Partial<Layer> } }
  | { type: 'ADD_NARRATIVE'; payload: string }
  | { type: 'ADD_LOG'; payload: LogEntry }
  | { type: 'ADD_SUGGESTION'; payload: Suggestion }
  | { type: 'UNLOCK_SYSTEM' }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'TOGGLE_EXPLORER' }
  | { type: 'UPDATE_USER_INPUT'; payload: string };

const getInitialState = (): AnalysisState & { logs: LogEntry[] } => ({
  currentLayer: 0,
  layers: INITIAL_LAYERS,
  isThinking: false,
  userInput: '/* PROTOCOLO EDPLIA 2.0 ACTIVADO */\nANALIZAR: ConstANTES R-QNT Y ESTABILIDAD TOPOLÓGICA',
  isSystemLocked: true,
  isProcessing: false,
  isScalingMode: false,
  isExplorerOpen: true,
  notifications: [],
  security: { masterKey: '', isMasterKeySet: false, auditLogs: [] },
  narrativeLog: [`🌟 ECOSISTEMA EDPLIA 2.0: ONLINE`, `🛡️ Seguridad: Aislamiento Cuántico Nominal`],
  logs: [],
  cosmicDataSynced: false,
  paperState: { isGenerating: false, progress: 0, sections: {} },
  publicationState: { isSearching: false, researchers: [] },
  suggestions: [],
  isolationLevel: 'NOMINAL',
  quantumShield: true,
  terminalHistory: [],
  terminalInteractive: { isWaiting: false, prompt: '' },
  neuralMemory: [],
  activeCollaborations: [],
  systemName: 'EDPLIA'
});

function edpliaReducer(state: AnalysisState & { logs: LogEntry[] }, action: EDPLIAAction): AnalysisState & { logs: LogEntry[] } {
  const timestamp = new Date().toLocaleTimeString();
  switch (action.type) {
    case 'UPDATE_LAYER':
      return { 
        ...state, 
        layers: state.layers.map(l => l.id === action.payload.id ? { ...l, ...action.payload.updates } : l),
        // If updating output, we ensure currentLayer moves forward if appropriate
        currentLayer: action.payload.updates.output ? action.payload.id : state.currentLayer
      };
    case 'ADD_NARRATIVE':
      return { ...state, narrativeLog: [`[${timestamp}] ${action.payload}`, ...state.narrativeLog].slice(0, 100) };
    case 'ADD_LOG':
      return { ...state, logs: [action.payload, ...state.logs].slice(0, 50) };
    case 'ADD_SUGGESTION':
      return { ...state, suggestions: [action.payload, ...state.suggestions].slice(0, 50) };
    case 'UNLOCK_SYSTEM': return { ...state, isSystemLocked: false };
    case 'SET_PROCESSING': return { ...state, isProcessing: action.payload };
    case 'TOGGLE_EXPLORER': return { ...state, isExplorerOpen: !state.isExplorerOpen };
    case 'UPDATE_USER_INPUT': return { ...state, userInput: action.payload };
    default: return state;
  }
}

export const useEDPLIAState = () => {
  const [state, dispatch] = useReducer(edpliaReducer, getInitialState());
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    cpu: 24.5, 
    memory: 63.2, 
    networkLatency: 12, 
    activeConnections: 1, 
    lastUpdate: new Date()
  });

  const ws = WebSocketService.getInstance();

  useEffect(() => {
    const pollHealth = async () => {
      try {
        const health = await apiService.getSystemHealth();
        setSystemHealth(health);
      } catch (error) {
        setSystemHealth(prev => ({
          ...prev,
          cpu: 15 + Math.random() * 15,
          memory: 60 + Math.random() * 5,
          networkLatency: ws.getStatus() ? 10 + Math.random() * 5 : 0,
          activeConnections: ws.getPresenceList().length || 1,
          lastUpdate: new Date()
        }));
      }
    };
    const timer = setInterval(pollHealth, 5000);
    return () => clearInterval(timer);
  }, [ws]);

  const updateLayer = (id: number, updates: Partial<Layer>) => {
    dispatch({ type: 'UPDATE_LAYER', payload: { id, updates } });
    if (updates.status || updates.output !== undefined) {
      ws.syncLayerState(id, updates.status || LayerStatus.IDLE, updates.output);
    }
  };

  const addNarrative = (msg: string) => {
    dispatch({ type: 'ADD_NARRATIVE', payload: msg });
    if (!msg.startsWith('[NET]')) {
      ws.broadcast('IA_COLLABORATION', { 
        source: 'Researcher', 
        message: msg, 
        userId: ws.getMyUserId() 
      });
    }
  };

  const addLog = (layerId: number, message: string, type: LogEntry['type'] = 'info') => {
    dispatch({ 
      type: 'ADD_LOG', 
      payload: { 
        id: Math.random().toString(36).substr(2, 9), 
        timestamp: new Date().toLocaleTimeString(), 
        layerId, 
        message, 
        type 
      } 
    });
  };

  return {
    state, 
    systemHealth, 
    updateLayer, 
    addNarrative, 
    addLog,
    unlock: () => dispatch({ type: 'UNLOCK_SYSTEM' }),
    toggleExplorer: () => dispatch({ type: 'TOGGLE_EXPLORER' }),
    setProcessing: (p: boolean) => dispatch({ type: 'SET_PROCESSING', payload: p }),
    updateInput: (i: string) => dispatch({ type: 'UPDATE_USER_INPUT', payload: i }),
    wsStatus: ws.getStatus(), 
    presence: ws.getPresenceList()
  };
};
