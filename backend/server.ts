
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { SecurityService } from './SecurityService';

dotenv.config();

class EDPLIAServer {
  private app: express.Application;
  private httpServer: any;
  private io: Server;
  private activeUsers: Map<string, any> = new Map();

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app as any);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
  }

  async initialize() {
    this.setupMiddleware();
    await this.initializeServices();
    this.setupRoutes();
    this.setupWebSocket();
  }

  private setupMiddleware() {
    this.app.use(helmet({
      contentSecurityPolicy: false // Allow esm.sh imports in dev
    }));
    this.app.use(cors());
    this.app.use(express.json() as any);
    
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      message: 'Too many requests from this IP'
    });
    this.app.use('/api/', limiter as any);
  }

  private async initializeServices() {
    await SecurityService.initialize();
  }

  private setupRoutes() {
    this.app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'nominal', 
        version: '2.0.definitive', 
        author: 'Edward PL',
        connections: this.activeUsers.size
      });
    });

    this.app.post('/api/security/validate', async (req, res) => {
      const { key } = req.body;
      const ip = req.ip || 'unknown';
      const result = await SecurityService.getInstance().validateMasterKey(key, ip);
      res.json(result);
    });
  }

  private setupWebSocket() {
    const security = SecurityService.getInstance();
    
    this.io.on('connection', (socket) => {
      const userId = socket.handshake.auth.userId || `Unknown_${socket.id}`;
      console.log(`📡 [SYSTEM] Connection established: ${userId} (${socket.id})`);
      
      this.activeUsers.set(socket.id, { userId, socket });

      // Relay all tactical events to other nodes
      const eventTypes = [
        'PRESENCE_UPDATE',
        'IA_COLLABORATION',
        'IA_SUGGESTION',
        'LAYER_STATE_SYNC',
        'SYSTEM_MESSAGE',
        'SECURITY_EVENT'
      ];

      eventTypes.forEach(type => {
        socket.on(type, (data) => {
          // If security event, log it in the backend
          if (type === 'SECURITY_EVENT') {
            security.logSecurityEvent(data);
          }
          // Broadcast to everyone else
          socket.broadcast.emit(type, data);
        });
      });

      socket.on('disconnect', () => {
        console.log(`📡 [SYSTEM] Connection lost: ${userId}`);
        this.activeUsers.delete(socket.id);
        
        // Notify others about the departure
        this.io.emit('PRESENCE_UPDATE', {
          userId,
          status: 'offline',
          timestamp: Date.now()
        });
      });
    });
  }

  start(port: number = 5000) {
    this.httpServer.listen(port, () => {
      console.log(`
      ███████╗██████╗ ██████╗ ██╗     ██╗ █████╗ 
      ██╔════╝██╔══██╗██╔══██╗██║     ██║██╔══██╗
      █████╗  ██║  ██║██████╔╝██║     ██║███████║
      ██╔══╝  ██║  ██║██╔═══╝ ██║     ██║██╔══██║
      ███████╗██████╔╝██║     ███████╗██║██║  ██║
      ╚══════╝╚═════╝ ╚═╝     ╚══════╝╚═╝╚═╝  ╚═╝
      
      🚀 EDPLIA Backend Server Started
      📍 Port: ${port}
      🌐 Role: Orchestrator / Real-time Sync
      🔐 Security: Quantum Isolated V2
      `);
    });
  }
}

const server = new EDPLIAServer();
server.initialize().then(() => server.start());
