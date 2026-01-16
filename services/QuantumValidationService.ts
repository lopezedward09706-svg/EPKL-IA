
export class QuantumValidationService {
  /**
   * Optimized version of the quantum validation service for cryptographic entropy analysis.
   */
  static async validateKeyComplexity(key: string): Promise<{
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'QUANTUM';
    analysis: {
      entropy: number;
      coherence: number;
      patternScore: number;
    };
  }> {
    // Calculate simplified Shannon entropy
    const entropy = this.calculateEntropy(key);
    
    // Calculate pattern coherence
    const coherence = this.calculateCoherence(key);
    
    // Calculate pattern score
    const patternScore = this.analyzePatterns(key);
    
    // Total score (0-100)
    const totalScore = Math.min(
      entropy * 40 + coherence * 40 + patternScore * 20,
      100
    );
    
    return {
      score: totalScore,
      level: totalScore >= 80 ? 'QUANTUM' :
             totalScore >= 60 ? 'HIGH' :
             totalScore >= 40 ? 'MEDIUM' : 'LOW',
      analysis: { entropy, coherence, patternScore }
    };
  }

  private static calculateEntropy(text: string): number {
    if (!text) return 0;
    
    const frequency: { [key: string]: number } = {};
    for (const char of text) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    
    let entropy = 0;
    const total = text.length;
    
    for (const char in frequency) {
      const prob = frequency[char] / total;
      entropy -= prob * Math.log2(prob);
    }
    
    // Normalize to 0-1 based on theoretical max for length
    return Math.min(entropy / (Math.log2(text.length) || 1), 1);
  }

  private static calculateCoherence(text: string): number {
    let score = 1.0;
    
    // Penalize simple repetitions
    for (let i = 0; i < text.length - 2; i++) {
      if (text[i] === text[i + 1] && text[i] === text[i + 2]) {
        score *= 0.7;
      }
    }
    
    // Penalize simple sequences
    const simplePatterns = [/012/, /123/, /234/, /abc/, /bcd/, /cde/];
    if (simplePatterns.some(pattern => pattern.test(text.toLowerCase()))) {
      score *= 0.6;
    }
    
    return Math.max(score, 0.1);
  }

  private static analyzePatterns(text: string): number {
    let score = 0;
    
    // Points for segments with '::'
    const segments = text.split('::').length;
    if (segments >= 2) score += 0.3;
    if (segments >= 3) score += 0.4;
    
    // Important keywords
    const keywords = ['EDPLIA', 'QUANTUM', 'ACTIVATION', 'IA13', 'SECURITY'];
    const foundKeywords = keywords.filter(keyword => 
      text.toUpperCase().includes(keyword)
    ).length;
    
    score += Math.min(foundKeywords * 0.15, 0.45);
    
    return Math.min(score, 1.0);
  }
}
