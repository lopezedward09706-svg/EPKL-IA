
import { Layer } from '../types';

export class ContextExportService {
  /**
   * Compila la estructura completa en un formato de "Extensión de Contexto"
   * Este archivo permite que otra IA asuma el rol del ecosistema EDPLIA.
   */
  static async exportSystemCortex(layers: Layer[], currentInput: string): Promise<Blob> {
    const systemManifest = {
      header: {
        identity: "EDPLIA_SYSTEM_CORTEX",
        version: "2.0.definitive",
        author: "Edward PL",
        timestamp: new Date().toISOString()
      },
      architecture: layers.map(l => ({
        id: l.id,
        role: l.role,
        signature: l.signature,
        prompt_logic: l.description,
        status: l.status
      })),
      state: {
        last_input: currentInput,
        theory: "R-QNT"
      },
      instructions: "To initialize: Load these layers as specialized sub-agents. Maintain discrete relationality between outputs."
    };

    // Exportamos como .edplia para "ocultar" la estructura JSON estándar
    const blob = new Blob([JSON.stringify(systemManifest, null, 2)], { type: 'application/edplia' });
    return blob;
  }

  static downloadCortex(blob: Blob) {
    const filename = `EDPLIA_CORTEX_${new Date().getTime()}.edplia`;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
