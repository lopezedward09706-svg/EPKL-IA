
import { SecureLogEntry } from '../types';

/**
 * SecureLogger: Registro inmutable de cada interacción entre IAs.
 * Ported from SecureLogger class implementation.
 */
export class SecureLogger {
  private static async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static async generateBlockchainHash(entry: Partial<SecureLogEntry>): Promise<string> {
    const base = JSON.stringify(entry) + Math.random().toString();
    return await this.sha256(base);
  }

  /**
   * Logs an interaction between IAs with immutable tracking
   */
  public static async logInteraction(
    source: string,
    target: string,
    data: string,
    action: string,
    humanVerified: boolean = false
  ): Promise<SecureLogEntry> {
    const timestamp_ns = (Date.now() * 1000000).toString(); // Simulated nanoseconds
    const data_hash = await this.sha256(data);
    
    const entryData = {
      timestamp_ns,
      source,
      target,
      data_hash,
      action,
      human_verified: humanVerified
    };

    const blockchain_hash = await this.generateBlockchainHash(entryData);
    
    const entry: SecureLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      ...entryData,
      blockchain_hash
    };

    // Simulated saving to multiple locations
    console.debug(`[SecureLogger] Immutable log entry created: ${entry.blockchain_hash}`);
    
    return entry;
  }
}
