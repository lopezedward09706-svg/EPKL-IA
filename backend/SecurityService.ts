import crypto from 'crypto';
import bcrypt from 'https://esm.sh/bcryptjs@^2.4.3';
import { EventEmitter } from 'node:events';

interface SecurityEvent {
  type: 'UNAUTHORIZED_ACCESS' | 'MASTER_KEY_VALIDATION' | 'SYSTEM_UNLOCK' | 'THREAT_DETECTED';
  timestamp: Date;
  userId?: string;
  ip?: string;
  details: any;
}

interface MasterKeyValidation {
  isValid: boolean;
  message: string;
  remainingAttempts: number;
  threatLevel: 'NOMINAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  lockUntil?: Date;
}

interface SecurityStatus {
  isLocked: boolean;
  attempts: number;
  maxAttempts: number;
  threatLevel: string;
  lockUntil?: Date;
  lastEvent?: SecurityEvent;
}

export class SecurityService extends EventEmitter {
  private static instance: SecurityService;
  private masterKeyHash: string = '';
  private failedAttempts: Map<string, number> = new Map();
  private securityLog: SecurityEvent[] = [];
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_DURATION = 15 * 60 * 1000;
  
  private constructor() {
    // Correctly initialize EventEmitter
    super();
  }
  
  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }
  
  static async initialize() {
    const instance = SecurityService.getInstance();
    await instance.setupDefaultKeys();
    console.log('✅ [BACKEND] Security Service Initialized');
  }
  
  private async setupDefaultKeys() {
    const envKey = (typeof process !== 'undefined' && process.env.MASTER_KEY) || 'EDPLIA_QUANTUM_2024';
    this.masterKeyHash = await bcrypt.hash(envKey, 10);
  }
  
  async validateMasterKey(inputKey: string, ip: string = 'unknown'): Promise<MasterKeyValidation> {
    const ipAttempts = this.failedAttempts.get(ip) || 0;
    
    if (ipAttempts >= this.MAX_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + this.LOCK_DURATION);
      this.logSecurityEvent({
        type: 'UNAUTHORIZED_ACCESS',
        timestamp: new Date(),
        ip,
        details: { reason: 'Too many failed attempts', lockUntil }
      });
      
      return {
        isValid: false,
        message: 'System temporarily locked. Too many failed attempts.',
        remainingAttempts: 0,
        threatLevel: 'CRITICAL',
        lockUntil
      };
    }
    
    const isValid = await bcrypt.compare(inputKey, this.masterKeyHash);
    
    if (isValid) {
      this.failedAttempts.delete(ip);
      this.logSecurityEvent({
        type: 'MASTER_KEY_VALIDATION',
        timestamp: new Date(),
        ip,
        details: { result: 'SUCCESS' }
      });
      
      return {
        isValid: true,
        message: 'Validation successful. System unlocked.',
        remainingAttempts: this.MAX_ATTEMPTS,
        threatLevel: 'NOMINAL'
      };
    } else {
      const newAttempts = ipAttempts + 1;
      this.failedAttempts.set(ip, newAttempts);
      const remaining = this.MAX_ATTEMPTS - newAttempts;
      let threatLevel: 'NOMINAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL' = 'NOMINAL';
      
      if (remaining <= 1) threatLevel = 'CRITICAL';
      else if (remaining <= 2) threatLevel = 'HIGH';
      else if (remaining <= 3) threatLevel = 'ELEVATED';
      
      this.logSecurityEvent({
        type: 'MASTER_KEY_VALIDATION',
        timestamp: new Date(),
        ip,
        details: { result: 'FAILED', remainingAttempts: remaining }
      });
      
      return {
        isValid: false,
        message: `Invalid master key. ${remaining} attempts remaining.`,
        remainingAttempts: remaining,
        threatLevel
      };
    }
  }

  getSecurityStatus(ip?: string): SecurityStatus {
    const ipAttempts = ip ? this.failedAttempts.get(ip) || 0 : 0;
    const isLocked = ipAttempts >= this.MAX_ATTEMPTS;
    
    let threatLevel = 'NOMINAL';
    if (ipAttempts >= this.MAX_ATTEMPTS) threatLevel = 'CRITICAL';
    else if (ipAttempts >= this.MAX_ATTEMPTS - 1) threatLevel = 'HIGH';
    else if (ipAttempts >= this.MAX_ATTEMPTS - 2) threatLevel = 'ELEVATED';
    
    const status: SecurityStatus = {
      isLocked,
      attempts: ipAttempts,
      maxAttempts: this.MAX_ATTEMPTS,
      threatLevel,
      lastEvent: this.securityLog[0]
    };
    
    if (isLocked && ip) {
      status.lockUntil = new Date(Date.now() + this.LOCK_DURATION);
    }
    
    return status;
  }
  
  // Explicitly using super.emit to resolve any ambiguity in the method resolution
  logSecurityEvent(event: SecurityEvent) {
    this.securityLog.unshift(event);
    if (this.securityLog.length > 1000) this.securityLog = this.securityLog.slice(0, 1000);
    super.emit('SECURITY_EVENT', event);
  }
}