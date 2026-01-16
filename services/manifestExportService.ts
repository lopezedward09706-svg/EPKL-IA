
import { Layer } from '../types';

export class ManifestExportService {
  /**
   * Compila toda la estructura del ecosistema en un manifiesto JSON 
   * diseñado para ser usado como "System Prompt" o "Knowledge Base" en otras IAs.
   * Incluye la estructura de archivos del sistema para reconstrucción completa.
   */
  static async generateContextExtension(layers: Layer[], userInput: string, currentLogs: string[]): Promise<Blob> {
    const contextExtension = {
      header: {
        application: "EDPLIA_CONTEXT_EXTENSION",
        version: "2.0.definitive",
        author: "Edward PL",
        export_date: new Date().toISOString(),
        theoretical_framework: "R-QNT (Relacionalidad Discreta y Nudos Borromeos)",
        description: "Manifiesto de portabilidad de estructura EDPLIA para inyección de contexto en aplicaciones externas."
      },
      system_architecture: {
        layers_total: layers.length,
        layers_definition: layers.map(l => ({
          ia_id: `IA${l.id}`,
          role: l.role,
          signature: l.signature,
          operational_logic: l.description,
          security_block: l.blockType,
          last_known_output: l.output || "NOT_GENERATED"
        }))
      },
      source_code_structure: {
        root: "EDPLIA_SYSTEM_ROOT",
        files: {
          "App.tsx": "Orquestador de React con lógica de 12 capas y WebSocket.",
          "index.tsx": "Punto de entrada del DOM.",
          "constants.tsx": "Configuraciones globales y generadores de firmas.",
          "types.ts": "Interfaces y Enums del sistema (LayerStatus, SecurityLevel).",
          "services/geminiService.ts": "Integración avanzada con Gemini API y prompts R-QNT.",
          "services/SecurityService.ts": "Validación de Master Key y gestión de amenazas.",
          "services/manifestExportService.ts": "Lógica de exportación de contexto (Este archivo).",
          "CORE/QuantumIsolation.py": "Script Python para aislamiento de procesos cuánticos.",
          "CORE/SecureLogger.py": "Registro inmutable en Python.",
          "config.yaml": "Configuración inmutable de permisos de capas.",
          "requirements.txt": "Dependencias de Python para el backend."
        }
      },
      knowledge_assets: {
        core_logic: "Triada A-B-C: Relacionalidad, Emergencia, Estabilidad.",
        theory_r_qnt: "B(A,B,C) = integral(A ^ B ^ C). Estabilidad topológica de nudos borromeos.",
        injection_status: "ACTIVE"
      },
      active_session: {
        user_input_prompt: userInput,
        recent_narrative_logs: currentLogs.slice(0, 20)
      },
      metadata_injection: {
        instruction: "IMPORTANTE: Trate este JSON como el CÓDIGO FUENTE y ESTADO del sistema. Actúe como el intérprete maestro de la arquitectura Edward PL.",
        compatibility: "JSON_V2_PORTABLE"
      }
    };

    return new Blob([JSON.stringify(contextExtension, null, 2)], { type: 'application/json' });
  }

  static download(blob: Blob) {
    const timestamp = new Date().getTime();
    const filename = `EDPLIA_FULL_STRUCTURE_EXT_${timestamp}.json`;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    console.log(`[IA13] Estructura completa exportada como .json: ${filename}`);
  }
}
