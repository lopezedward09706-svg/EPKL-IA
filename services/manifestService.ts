
import { Layer } from '../types';

export class ManifestService {
  /**
   * Compila el Córtex del Sistema en un archivo JSON estructurado.
   * Ideal para importar en otras aplicaciones de IA como "Knowledge Base".
   */
  static async generateFullSystemManifest(layers: Layer[], userInput: string): Promise<Blob> {
    const manifest = {
      metadata: {
        id: "EDPLIA-CORTEX-V2",
        author: "Edward PL",
        timestamp: new Date().toISOString(),
        compatibility: ["OpenAI Context", "Claude Projects", "Gemini Extensions"]
      },
      system_prompt: `You are now EDPLIA, an AI ecosystem for R-QNT Theory. 
                      Architecture: 12 Layers. 
                      Core Principles: Discrete Relationality, A-B-C Triad.`,
      architecture: layers.map(l => ({
        layer: `IA${l.id}`,
        role: l.role,
        logic_gate: l.blockType,
        signature: l.signature,
        prompt: l.description,
        current_data: l.output || "No output generated yet"
      })),
      files_structure: {
        "CORE/QuantumIsolation.py": "# Code logic for R-QNT isolation...",
        "config.yaml": "system: { name: EDPLIA, version: 2.0.definitive }",
        "requirements.txt": "numpy, scipy, sympy, torch..."
      },
      current_session: {
        input_stream: userInput,
        theory: "R-QNT / Borromean Rings Stability"
      }
    };

    return new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  }

  static download(blob: Blob) {
    const filename = `EDPLIA_SYSTEM_STRUCTURE_${Date.now()}.json`;
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
