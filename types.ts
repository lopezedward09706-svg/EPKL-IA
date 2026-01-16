
// ==================== ENUMS ====================
export enum LayerStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
  WAITING = 'WAITING',
  PENDING = 'PENDING',
  WARNING = 'WARNING',
  QUARANTINED = 'QUARANTINED',
  OPTIMIZING = 'OPTIMIZING',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  LOCKED = 'LOCKED'
}

export enum SecurityLevel {
  NOMINAL = 'NOMINAL',
  ELEVATED = 'ELEVATED',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  QUANTUM = 'QUANTUM',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM'
}

export enum IAType {
  OBSERVER = 'OBSERVER',
  IMPLEMENTER = 'IMPLEMENTER',
  COSMIC = 'COSMIC',
  MATH_CONSTANTS = 'MATH_CONSTANTS',
  CODE_NAVIGATOR = 'CODE_NAVIGATOR',
  MATH_SCALER = 'MATH_SCALER',
  FAULT_DETECTOR = 'FAULT_DETECTOR',
  FAULT_CORRECTOR = 'FAULT_CORRECTOR',
  NARRATOR = 'NARRATOR',
  SCIENTIFIC = 'SCIENTIFIC',
  PAPER_GENERATOR = 'PAPER_GENERATOR',
  PUBLISHER = 'PUBLISHER',
  GATEWAY = 'GATEWAY',
  UNKNOWN = 'UNKNOWN'
}

export interface LayerPerformance {
  cpu?: number;
  memory?: number;
  successRate?: number;
  latency?: number;
}

export interface AppNotification {
  id: string;
  category: string;
  message: string;
  priority: 'low' | 'normal' | 'urgent';
  timestamp: Date;
}

export interface SecureLogEntry {
  id: string;
  timestamp_ns: string;
  source: string;
  target: string;
  data_hash: string;
  action: string;
  human_verified: boolean;
  blockchain_hash: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  layerId: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface CollaborativeSession {
  sessionId: string;
  participants: string[];
  startTime: number;
  isActive: boolean;
}

// ==================== SIMULATION INTERFACES ====================
export interface SimulationParameters {
  evolutionRate: number;
  timeSpeed: number;
  n_abc: number;
  density: number;
  centralMass: number;
  strongEnergy: number;
  scale: number;
  velocity?: number;
  radioPi?: number;
}

export interface SimNode {
    id: number;
    x: number;
    y: number;
    zeta: number;
    superposition: number;
    isCollapsed: boolean;
    vecA: {x:number, y:number, z:number};
    vecB: {x:number, y:number, z:number};
    vecC: {x:number, y:number, z:number};
}

export interface SimQuark {
    x: number;
    y: number;
    color: string;
    position?: {x:number, y:number};
}

export interface GlobalState {
    nodes: SimNode[];
    quarks: SimQuark[];
    parameters: SimulationParameters;
}

// ==================== GEMINI INTERFACES ====================

export interface GeminiResponse {
  text: string;
  thinking: string;
  confidence?: number;
  metadata?: {
    layerId: number;
    layerName: string;
    processingTime: number;
    tokenEstimate: number;
    attempt: number;
    timestamp: string;
    confidenceSource: 'extracted' | 'estimated' | 'calculated';
    signature: string;
    blockType: string;
  };
  rawResponse?: any;
}

export interface PaperStructure {
  title: string;
  abstract: string;
  introduction: any;
  methodology: any;
  mathematical_framework: any;
  simulation_data: any;
  constants_discovered?: Array<{
    name: string;
    value: string | number;
    uncertainty?: string | number;
    significance?: string;
    formula?: string;
  }>;
  error_analysis: any;
  results: any;
  discussion: any;
  conclusions: any;
  references: Array<{
    id?: string;
    authors: string;
    title: string;
    journal?: string;
    year?: number;
    doi?: string;
    relevance?: string;
  }>;
  metadata?: {
    generated_by?: string;
    timestamp?: string;
    system_version?: string;
    confidence_score?: number;
    generationTime?: number;
    layersUsed?: Array<{ id: number; name: string; confidence?: number }>;
    totalLength?: number;
    hash?: string;
    error?: string;
    fallback?: boolean;
    validation?: {
      structure_valid: boolean;
      completeness_score: number;
      reference_count: number;
    };
  };
}

export class GeminiServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public layerId?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

// ==================== INTERFACES PRINCIPALES ====================
export interface Layer {
  id: number;
  name: string;
  role: string;
  description: string;
  status: LayerStatus;
  blockType: string;
  signature: string;
  icon: string;
  type?: IAType;
  securityLevel?: SecurityLevel;
  confidenceIndex?: number;
  output?: string;
  lastUpdated?: string;
  processedAt?: string;
  lastActivity?: string | number;
  progress?: number;
  errorCount?: number;
  suggestionCount?: number;
  communicationCount?: number;
  isCritical?: boolean;
  performance?: LayerPerformance;
  errorDetails?: any;
}

export interface Suggestion {
  id: string;
  iaName: string;
  source: string;
  title: string;
  description: string;
  problem?: string;
  solution?: string;
  pythonCode?: string;
  codeSnippet?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isCritical?: boolean;
  timestamp: string;
}

export interface AnalysisState {
  currentLayer: number;
  layers: Layer[];
  isThinking: boolean;
  userInput: string;
  isSystemLocked: boolean;
  isProcessing: boolean;
  isScalingMode: boolean;
  isExplorerOpen: boolean;
  notifications: AppNotification[];
  security: any;
  narrativeLog: string[];
  cosmicDataSynced: boolean;
  paperState: any;
  publicationState: any;
  suggestions: Suggestion[];
  isolationLevel: string;
  quantumShield: boolean;
  terminalHistory: string[];
  terminalInteractive: {
    isWaiting: boolean;
    prompt: string;
  };
  neuralMemory: any[];
  activeCollaborations: any[];
  author?: string;
  version?: string;
  systemName?: string;
}

export interface SystemHealth {
  cpu: number;
  memory: number;
  networkLatency: number;
  activeConnections: number;
  lastUpdate: Date;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  description?: string;
  children?: FileNode[];
}
