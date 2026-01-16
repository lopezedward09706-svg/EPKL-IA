
import { GoogleGenAI, Type } from "@google/genai";
import { MODEL_NAME, THINKING_BUDGET } from "../constants";
import { PaperStructure } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface SubmissionPackage {
  targetJournal: string;
  coverLetter: string;
  formattingCheck: string[];
  submissionStatus: 'READY' | 'PENDING_APPROVAL' | 'SUBMITTED';
  recommendedReviewers: Array<{ name: string; affiliation: string; reason: string }>;
  automatedJournalSelection: {
    matchScore: number;
    reasoning: string;
  };
}

export class SubmissionService {
  private static journalRequirements: Record<string, string[]> = {
    "Physical Review Letters": [
      "Abstract limit: 600 characters",
      "Total length: 3750 words",
      "RevTeX 4.2 formatting required",
      "Significance statement mandatory"
    ],
    "Nature Physics": [
      "Abstract: 150 words unreferenced",
      "Main text: 2000-3000 words",
      "References limit: 30-50",
      "Two-column format for final version"
    ],
    "JHEP": [
      "Standard JHEP LaTeX class",
      "Open Access metadata compliant",
      "No strictly enforced length limit"
    ]
  };

  private static journals = [
    { name: "Physical Review Letters", focus: "Fundamental Physics & R-QNT", impact: "High" },
    { name: "Nature Physics", focus: "Emergent Quantum Phenomena", impact: "High" },
    { name: "Journal of High Energy Physics (JHEP)", focus: "Mathematical Physics", impact: "Medium-High" }
  ];

  static async prepareSubmission(paper: string | PaperStructure): Promise<SubmissionPackage> {
    const paperContent = typeof paper === 'string' ? paper : JSON.stringify(paper);
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Perform an automated submission analysis for the following R-QNT paper:
      
      PAPER CONTENT:
      ${paperContent.substring(0, 8000)}...`,
      config: {
        systemInstruction: `You are IA12: Publicador Automático. 
        Analyze the paper content to:
        1. Select the most appropriate journal from: ${this.journals.map(j => j.name).join(', ')}.
        2. Draft a formal Cover Letter emphasizing the 'Triada A-B-C' and 'Relacionalidad Discreta'.
        3. Suggest 3 reviewers with their affiliations and why they fit.
        4. Provide a match score (0-100) and reasoning.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetJournal: { type: Type.STRING },
            coverLetter: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            reviewers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  affiliation: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            }
          },
          required: ["targetJournal", "coverLetter", "matchScore", "reasoning", "reviewers"]
        },
        thinkingConfig: { thinkingBudget: THINKING_BUDGET }
      }
    });

    const result = JSON.parse(response.text || "{}");
    const selectedJournal = result.targetJournal || this.journals[0].name;

    return {
      targetJournal: selectedJournal,
      coverLetter: result.coverLetter,
      formattingCheck: this.journalRequirements[selectedJournal] || ["Standard LaTeX"],
      submissionStatus: 'PENDING_APPROVAL',
      recommendedReviewers: result.reviewers || [],
      automatedJournalSelection: {
        matchScore: result.matchScore || 85,
        reasoning: result.reasoning || "Analysis based on keywords and theoretical framework."
      }
    };
  }

  static async executeAutomatedSubmission(pkg: SubmissionPackage): Promise<boolean> {
    // Logic to interact with journal APIs or simulate API calls
    await new Promise(resolve => setTimeout(resolve, 3500));
    return true;
  }
}
