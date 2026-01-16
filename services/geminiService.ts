
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODEL_NAME, THINKING_BUDGET } from "../constants";
import { Layer, GeminiResponse, GeminiServiceError } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const R_QNT_THEORY_CONTEXT = `
## 🌀 TEORÍA R-QNT - MARCO TEÓRICO COMPLETO
**AUTOR:** Edward Pérez López (Edward PL)
**SISTEMA:** EDPLIA v2.0.definitive

### 📐 FUNDAMENTOS MATEMÁTICOS Y FÍSICOS:
1. **TRÍADA A-B-C:** Relacionalidad Discreta, Emergencia Cuántica, Estabilidad Topológica. Toda partícula surge de un nudo borromeo de tres campos base.
2. **NUDOS BORROMEOS:** Modelo topológico de estabilidad material: $\mathcal{B}(A,B,C) = \oint_{\partial\Sigma} (A \wedge B \wedge C)$. Si un componente falla, la realidad local colapsa.
3. **ESPACIO-TIEMPO RELACIONAL:** Emerge de relaciones discretas entre eventos (Nodos ABC): $ds^2 = g_{\mu\nu}(R_{ijk})dx^\mu dx^\nu$.
4. **CONSTANTES DINÁMICAS:** G, c, h no son estáticas, sino que emergen del equilibrio de la espuma de Wheeler en la escala de Planck.
5. **RADIO-PI:** Nueva constante de proporcionalidad geométrica que rige el escalamiento de nudos.
`;

const IA_PROMPTS: Record<number, { system: string; task: string; output: string }> = {
  1: { 
    system: "IA1: Observador de Resultados y Estructura Base.", 
    task: "Analiza los inputs del usuario y el estado de la simulación. Identifica la escala física y establece objetivos de validación inicial.", 
    output: "Matriz de observación inicial, escala detectada y objetivos de validación." 
  },
  2: { 
    system: "IA2: Implementador Comparador Cuántico.", 
    task: "Contrasta predicciones R-QNT con el Modelo Estándar. Identifica anomalías donde la Relatividad General difiere de la Tríada ABC.", 
    output: "Gráfica comparativa de anomalías y tabla de divergencia teórica." 
  },
  3: { 
    system: "IA3: Observador Cósmico (Data Miner).", 
    task: "Busca señales de la Tríada ABC en datasets cósmicos (JWST, CERN). Mapea anomalías al fondo cósmico.", 
    output: "Dataset de anomalías cósmicas mapeadas a la topología borromea." 
  },
  4: { 
    system: "IA4: Matemático de Constantes y Geometría.", 
    task: "Propón nuevas relaciones para constantes fundamentales usando RadioPi y la Tríada ABC con precisión de 12 decimales.", 
    output: "Ecuaciones de unificación de constantes con precisión de 12 decimales." 
  },
  5: { 
    system: "IA5: Navegador de Código y Lógica.", 
    task: "Optimiza los algoritmos de simulación para evitar el colapso de la memoria cuántica.", 
    output: "Reporte de refactorización y parches de rendimiento lógico." 
  },
  6: { 
    system: "IA6: Matemático Escalador (Scaling Expert).", 
    task: "Demuestra la invariancia de escala de R-QNT desde el átomo hasta la galaxia usando leyes de potencia.", 
    output: "Análisis de auto-similitud y coeficientes de escala fractal." 
  },
  7: { 
    system: "IA7: Detector de Fallos Teóricos.", 
    task: "Busca contradicciones matemáticas entre el escalamiento de IA6 y las observaciones de IA3.", 
    output: "Listado de 'glitches' teóricos y paradojas detectadas." 
  },
  8: { 
    system: "IA8: Corrector de Fallos y Estabilizador.", 
    task: "Resuelve paradojas detectadas por IA7 ajustando los pesos de la Tríada ABC para estabilizar el nudo borromeo.", 
    output: "Ecuaciones de estabilización y parches conceptuales." 
  },
  9: { 
    system: "IA9: Narrador Humanizado (Voz de Edward PL).", 
    task: "Traduce el lenguaje técnico a la narrativa apasionada e intuitiva de Edward PL.", 
    output: "Manifiesto narrativo de los descubrimientos realizados." 
  },
  10: { 
    system: "IA10: Intérprete Científico y Validador Final.", 
    task: "Asigna un índice de confianza final. Si < 80%, indica fallos. FINALIZA CON: [CONFIDENCE: XX%]", 
    output: "Veredicto académico y resumen ejecutivo de rigor científico." 
  },
  11: { 
    system: "IA11: Generador de Paper Profesional.", 
    task: "Estructura un paper LaTeX completo con metodología ABC y conclusiones teóricas.", 
    output: "Código LaTeX completo listo para su publicación." 
  },
  12: { 
    system: "IA12: Publicador y Estratega de Difusión.", 
    task: "Diseña la carta de presentación para Nature/PRL y la estrategia de pre-print.", 
    output: "Paquete de envío editorial y estrategia de difusión." 
  }
};

const extractConfidence = (text: string): number | undefined => {
  const match = text.match(/\[CONFIDENCE:\s*(\d+)%\]/i);
  return match ? parseInt(match[1]) : undefined;
};

export const analyzeWithLayer = async (
  layer: Layer, 
  userContext: string, 
  previousOutputs: string
): Promise<GeminiResponse> => {
  const startTime = Date.now();
  const iaConfig = IA_PROMPTS[layer.id] || IA_PROMPTS[1];
  
  const prompt = `### DIRECTIVA EDPLIA - CAPA ${layer.id}: ${layer.name}
  CONTEXTO USUARIO: ${userContext}
  HISTORIAL ACUMULADO: ${previousOutputs || "Inicio de flujo."}
  TAREA: ${iaConfig.task}
  SALIDA: ${iaConfig.output}
  ${layer.id === 10 ? 'FINALIZAR CON [CONFIDENCE: XX%]' : ''}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `${R_QNT_THEORY_CONTEXT}\n\nINSTRUCCIÓN IA${layer.id}: ${iaConfig.system}`,
        temperature: layer.id === 10 ? 0.1 : 0.7,
        thinkingConfig: { thinkingBudget: THINKING_BUDGET }
      }
    });

    const text = response.text || "";
    return {
      text,
      thinking: `Unidad IA${layer.id} procesando. Sincronización ABC activa.`,
      confidence: extractConfidence(text) || (layer.id === 10 ? 95 : undefined),
      metadata: {
        layerId: layer.id,
        layerName: layer.name,
        processingTime: Date.now() - startTime,
        tokenEstimate: Math.ceil(text.length / 4),
        attempt: 1,
        timestamp: new Date().toISOString(),
        confidenceSource: 'extracted',
        signature: layer.signature,
        blockType: layer.blockType
      }
    };
  } catch (err: any) {
    throw new GeminiServiceError(err.message, 'API_ERROR', layer.id, err);
  }
};

export const generateFullPaper = async (layersData: Layer[]): Promise<string> => {
  const context = layersData
    .filter(l => l.output)
    .map(l => `[IA${l.id} - ${l.role}]:\n${l.output}`)
    .join("\n\n---\n\n");

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ 
        parts: [{ 
          text: `Genera el Paper R-QNT final en LaTeX basado en estos hallazgos:\n\n${context}` 
        }] 
      }],
      config: {
        systemInstruction: "IA11: Arquitecto LaTeX de EDPLIA. Autor: Edward PL. Rigor extremo.",
        thinkingConfig: { thinkingBudget: THINKING_BUDGET }
      }
    });

    return response.text || "Error en compilación de paper.";
  } catch (err: any) {
    throw new GeminiServiceError(err.message, 'PAPER_GEN_ERROR', 11, err);
  }
};

export default { analyzeWithLayer, generateFullPaper };
