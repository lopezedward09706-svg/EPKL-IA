
import { io, Socket } from "https://esm.sh/socket.io-client@^4.7.2";
import { LayerStatus } from '../types';

export interface PresenceState {
  userId: string;
  role: 'human' | 'ia';
  lastSeen: number;
  activeLayer?: number;
  color?: string;
}

export interface NetworkEvent {
  type: 'PRESENCE_UPDATE' | 'IA_COLLABORATION' | 'IA_SUGGESTION' | 'LAYER_STATE_SYNC' | 'SYSTEM_MESSAGE' | 'SECURITY_EVENT';
  payload: any;
  sender: string;
  timestamp: number;
}

/**
 * WebSocketService: The central nervous system for real-time collaboration.
 * Synchronizes EDPLIA layers across all connected research nodes.
 */
export class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private callbacks: ((data: NetworkEvent) => void)[] = [];
  private userId: string = `Researcher_${Math.floor(Math.random() * 1000)}`;
  private isConnected: boolean = false;
  private presenceMap: Map<string, PresenceState> = new Map();
  private heartbeatInterval: any = null;

  private constructor() {
    // Port 5000 as defined in orchestrator logic
    const backendUrl = 'http://localhost:5000';
    try {
      this.socket = io(backendUrl, {
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        timeout: 5000,
        transports: ['websocket', 'polling'],
        auth: { userId: this.userId }
      });

      this.setupListeners();
    } catch (e) {
      console.warn("📡 [EDPLIA] WebSocket link failed. Running in isolated core mode.");
    }
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log(`📡 [EDPLIA] Quantum Link Established: ${this.userId}`);
      
      // Start presence heartbeat
      this.startHeartbeat();
      
      this.updatePresence({
        userId: this.userId,
        role: 'human',
        lastSeen: Date.now(),
        color: 'bg-blue-600'
      });
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.stopHeartbeat();
      console.warn('📡 [EDPLIA] Quantum Link Severed');
    });

    const eventTypes: NetworkEvent['type'][] = [
      'PRESENCE_UPDATE', 
      'IA_COLLABORATION', 
      'IA_SUGGESTION', 
      'LAYER_STATE_SYNC', 
      'SYSTEM_MESSAGE', 
      'SECURITY_EVENT'
    ];

    eventTypes.forEach(type => {
      this.socket?.on(type, (data: any) => {
        const event: NetworkEvent = {
          type,
          payload: data.payload || data,
          sender: data.sender || 'system',
          timestamp: data.timestamp || Date.now()
        };
        
        if (type === 'PRESENCE_UPDATE') {
          this.handlePresenceUpdate(event.payload);
        }

        this.callbacks.forEach(cb => cb(event));
      });
    });
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.updatePresence({
          userId: this.userId,
          role: 'human',
          lastSeen: Date.now(),
          color: 'bg-blue-600'
        });
      }
    }, 10000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handlePresenceUpdate(payload: any) {
    if (Array.isArray(payload)) {
      payload.forEach(p => this.presenceMap.set(p.userId, p));
    } else if (payload.userId) {
      this.presenceMap.set(payload.userId, payload);
    }
    
    // Clean up stale users (older than 30 seconds)
    const now = Date.now();
    for (const [id, state] of this.presenceMap.entries()) {
      if (id !== this.userId && (now - state.lastSeen > 30000)) {
        this.presenceMap.delete(id);
      }
    }
  }

  public broadcast(type: NetworkEvent['type'], payload: any) {
    if (!this.isConnected || !this.socket) {
        // Fallback: If not connected, still trigger local callbacks for single-user mode consistency
        const localEvent: NetworkEvent = {
            type,
            payload,
            sender: this.userId,
            timestamp: Date.now()
        };
        this.callbacks.forEach(cb => cb(localEvent));
        return;
    }
    this.socket.emit(type, {
      payload,
      sender: this.userId,
      timestamp: Date.now()
    });
  }

  public onMessage(callback: (data: NetworkEvent) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  public syncLayerState(layerId: number, status: LayerStatus, output?: string) {
    this.broadcast('LAYER_STATE_SYNC', { layerId, status, output });
  }

  public updatePresence(state: PresenceState) {
    this.broadcast('PRESENCE_UPDATE', state);
  }

  public getMyUserId() { return this.userId; }
  public getStatus() { return this.isConnected; }
  public getPresenceList(): PresenceState[] {
    return Array.from(this.presenceMap.values());
  }

  public disconnect() {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
