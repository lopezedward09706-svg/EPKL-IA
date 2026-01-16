
import { GoogleGenAI, Type } from "@google/genai";
import { MODEL_NAME, THINKING_BUDGET } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ExternalAppData {
  appName: string;
  contextType: string;
  reliabilityScore: number;
  extractedParameters: Record<string, any>;
  summary: string;
}

export class ExternalIntegrationService {
  /**
   * Valida y extrae datos de una URL de otra aplicación de Google AI
   * Simula el chequeo de aplicación cruzada.
   */
  static async validateAndImportLink(url: string): Promise<ExternalAppData> {
    const prompt = `
      Analiza esta referencia de aplicación externa de Google AI: ${url}.
      Extrae metadatos relevantes para el sistema EDPLIA (Teoría R-QNT).
      Determina si la fuente es confiable y qué parámetros matemáticos o físicos aporta.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "Eres el conector de ecosistema de EDPLIA. Tu función es validar links de otras IAs de Google y transformar su output en datos utilizables para la simulación de Edward PL.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appName: { type: Type.STRING },
            contextType: { type: Type.STRING },
            reliabilityScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            extractedParameters: {
              type: Type.OBJECT,
              properties: {
                constants: { type: Type.ARRAY, items: { type: Type.STRING } },
                formulaOverrides: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          required: ["appName", "contextType", "reliabilityScore", "summary"]
        },
        thinkingConfig: { thinkingBudget: 5000 }
      }
    });

    return JSON.parse(response.text || "{}");
  }
}
