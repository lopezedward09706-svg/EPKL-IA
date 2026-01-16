
import { Layer, LayerStatus } from './types';

export function generateSignature(prefix: string): string {
  const timestamp = Date.now().toString(16).toUpperCase();
  const random = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `0x${prefix}_${timestamp}_${random}`;
}

export const EDPLIA_SYSTEM_CONFIG = {
  author: "Edward PL",
  system_name: "EDPLIA",
  version: "2.0.definitive",
  description: "Sistema IA Generadora de Traducción Física y Análisis Matemático",
  security_level: "QUANTUM_ISOLATED_V2",
  human_interface: "MINIMAL_NOTIFICATION_URGENT_ONLY",
  max_concurrent_operations: 4,
  default_thinking_budget: 32768,
  disclaimer: `
    Sistema IA Generadora de Traducción Física y Análisis Matemático 
    de corrección y extensión, así como crítico y validaciones científicas.
    Edward explica relaciones matemáticas con precisión pero es autodidacta
    en notación vectorial avanzada. Su intuición e imaginación generan
    propuestas matemáticamente precisas mediante este sistema.
  `
};

export const INITIAL_LAYERS: Layer[] = [
  { id: 1, name: 'IA 1', role: 'Observador de Resultados', description: 'Analiza outputs y estructura base.', status: LayerStatus.IDLE, blockType: 'READ_ONLY', signature: generateSignature('IA1'), icon: 'fa-eye', confidenceIndex: 0 },
  { id: 2, name: 'IA 2', role: 'Implementador Comparador', description: 'Simulaciones y contraste de resultados.', status: LayerStatus.IDLE, blockType: 'NO_CONFIG_WRITE', signature: generateSignature('IA2'), icon: 'fa-vial', confidenceIndex: 0 },
  { id: 3, name: 'IA 3', role: 'Observador Cósmico', description: 'Datos NASA, CERN, arXiv.', status: LayerStatus.IDLE, blockType: 'OUTBOUND_ONLY', signature: generateSignature('IA3'), icon: 'fa-satellite-dish', confidenceIndex: 0 },
  { id: 4, name: 'IA 4', role: 'Matemático de Constantes', description: 'Patrones numéricos y unificación.', status: LayerStatus.IDLE, blockType: 'NO_STORAGE', signature: generateSignature('IA4'), icon: 'fa-infinity', confidenceIndex: 0 },
  { id: 5, name: 'IA 5', role: 'Navegador de Código', description: 'Gestión de scripts y lógica CORE.', status: LayerStatus.IDLE, blockType: 'SANDBOX_ISOLATED', signature: generateSignature('IA5'), icon: 'fa-folder-tree', confidenceIndex: 0 },
  { id: 6, name: 'IA 6', role: 'Matemático Escalador', description: 'Escalamiento fractal y leyes de potencia.', status: LayerStatus.IDLE, blockType: 'NO_CONFIG_WRITE', signature: generateSignature('IA6'), icon: 'fa-arrow-up-right-dots', confidenceIndex: 0 },
  { id: 7, name: 'IA 7', role: 'Detector de Fallos', description: 'Auditoría teórica y monitorización.', status: LayerStatus.IDLE, blockType: 'READ_ONLY', signature: generateSignature('IA7'), icon: 'fa-shield-heart', confidenceIndex: 0 },
  { id: 8, name: 'IA 8', role: 'Corrector de Fallos', description: 'Generación de parches y estabilización.', status: LayerStatus.IDLE, blockType: 'HUMAN_REQUIRED', signature: generateSignature('IA8'), icon: 'fa-hammer', confidenceIndex: 0 },
  { id: 9, name: 'IA 9', role: 'Narrador Humanizado', description: 'Voz de Edward PL y narrativa física.', status: LayerStatus.IDLE, blockType: 'NO_EXECUTION', signature: generateSignature('IA9'), icon: 'fa-comment-dots', confidenceIndex: 0 },
  { id: 10, name: 'IA 10', role: 'Intérprete Científico', description: 'Validación de rigor y confianza.', status: LayerStatus.IDLE, blockType: 'NO_EXECUTION', signature: generateSignature('IA10'), icon: 'fa-square-check', confidenceIndex: 0 },
  { id: 11, name: 'IA 11', role: 'Generador de Paper', description: 'Compilación LaTeX profesional.', status: LayerStatus.IDLE, blockType: 'NO_CONFIG_WRITE', signature: generateSignature('IA11'), icon: 'fa-file-export', confidenceIndex: 0 },
  { id: 12, name: 'IA 12', role: 'Publicador Automático', description: 'Gestión de envíos a revistas.', status: LayerStatus.IDLE, blockType: 'HUMAN_REQUIRED', signature: generateSignature('IA12'), icon: 'fa-paper-plane', confidenceIndex: 0 }
];

export const MODEL_NAME = 'gemini-3-pro-preview';
export const THINKING_BUDGET = 32768;
export const SIGNING_SECRET = 'EDPLIA_QUANTUM_SIGNATURE_2024';

export const API_CONFIG = {
  TIMEOUT_MS: 120000,
  MAX_RETRIES: 3,
  BACKOFF_BASE: 1000,
  MAX_TOKENS: { ANALYSIS: 4000, PAPER: 8000, VALIDATION: 2000 }
};

export function getLayerColor(layerId: number): string {
  const colors = [
    'from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600',
    'from-yellow-500 to-yellow-600', 'from-pink-500 to-pink-600', 'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600', 'from-teal-500 to-teal-600', 'from-orange-500 to-orange-600',
    'from-cyan-500 to-cyan-600', 'from-lime-500 to-lime-600', 'from-fuchsia-500 to-fuchsia-600'
  ];
  return colors[layerId % colors.length];
}
