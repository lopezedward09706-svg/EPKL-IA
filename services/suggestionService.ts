
import { Suggestion } from '../types';

/**
 * Port of Python SuggestionBox class
 */
export class SuggestionService {
  private static readonly PYTHON_TEMPLATE = `
# Sugerencia de {ia_name} - {timestamp}
# Problema: {problem}
# Solución propuesta: {solution}

def implement_suggestion():
    """
    {solution}
    """
    # Código Python para implementar
    {python_code}
    
if __name__ == "__main__":
    implement_suggestion()
`;

  public static createSuggestion(
    iaName: string,
    problem: string,
    solution: string,
    code: string,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
  ): Suggestion {
    const timestamp = new Date();
    const id = `suggestion_${iaName}_${timestamp.getTime()}`;
    const isCritical = priority === 'CRITICAL' || 
                       problem.toLowerCase().includes('crítico') || 
                       problem.toLowerCase().includes('fallo') || 
                       problem.toLowerCase().includes('error');

    return {
      id,
      iaName,
      source: iaName,
      title: problem.substring(0, 40),
      description: solution,
      problem,
      solution,
      timestamp: timestamp.toLocaleString(),
      pythonCode: code,
      codeSnippet: code,
      priority: isCritical ? 'CRITICAL' : priority,
      isCritical
    };
  }

  public static getPythonContent(s: Suggestion): string {
    return this.PYTHON_TEMPLATE
      .replace('{ia_name}', s.iaName)
      .replace('{timestamp}', s.timestamp)
      .replace('{problem}', s.problem || s.title)
      .replace('{solution}', s.solution || s.description)
      .replace('{python_code}', s.pythonCode || s.codeSnippet || '');
  }

  public static getTxtContent(s: Suggestion): string {
    return `IA: ${s.iaName}\nProblema: ${s.problem || s.title}\nSolución: ${s.solution || s.description}\nCódigo: Ver ${s.id}.py\n`;
  }
}
