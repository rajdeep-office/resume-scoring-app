export interface ResumeAnalysis {
  overallScore: number;
  scores: {
    formatting: number;
    keywords: number;
    grammar: number;
    readability: number;
  };
  suggestions: string[];
  matchedKeywords: string[];
  wordCount: number;
  readingLevel: string;
}

export class ResumeAnalyzer {
  private static commonKeywords = [
    // Technical Skills
    'javascript', 'python', 'react', 'nodejs', 'html', 'css', 'sql', 'git', 'aws',
    'docker', 'kubernetes', 'typescript', 'angular', 'vue', 'mongodb', 'postgresql',
    
    // Soft Skills
    'leadership', 'teamwork', 'communication', 'problem-solving', 'analytical',
    'creative', 'innovative', 'collaborative', 'adaptable', 'detail-oriented',
    
    // Business Skills
    'project management', 'agile', 'scrum', 'data analysis', 'strategic planning',
    'customer service', 'sales', 'marketing', 'business development', 'consulting',
    
    // Action Words
    'achieved', 'improved', 'developed', 'managed', 'led', 'created', 'implemented',
    'optimized', 'increased', 'reduced', 'designed', 'built', 'streamlined',
    'collaborated', 'delivered', 'executed', 'organized', 'supervised'
  ];

  static analyzeResume(text: string): ResumeAnalysis {
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Calculate individual scores
    const formattingScore = this.calculateFormattingScore(text);
    const keywordScore = this.calculateKeywordScore(cleanText);
    const grammarScore = this.calculateGrammarScore(text);
    const readabilityScore = this.calculateReadabilityScore(words, text);

    // Calculate overall score
    const overallScore = Math.round(
      (formattingScore * 0.2 + keywordScore * 0.3 + grammarScore * 0.25 + readabilityScore * 0.25)
    );

    // Find matched keywords
    const matchedKeywords = this.findMatchedKeywords(cleanText);

    // Generate suggestions
    const suggestions = this.generateSuggestions({
      formatting: formattingScore,
      keywords: keywordScore,
      grammar: grammarScore,
      readability: readabilityScore,
      wordCount,
      matchedKeywords
    });

    // Determine reading level
    const readingLevel = this.determineReadingLevel(readabilityScore);

    return {
      overallScore,
      scores: {
        formatting: formattingScore,
        keywords: keywordScore,
        grammar: grammarScore,
        readability: readabilityScore
      },
      suggestions,
      matchedKeywords,
      wordCount,
      readingLevel
    };
  }

  private static calculateFormattingScore(text: string): number {
    let score = 60; // Base score

    // Check for section headers
    const sectionHeaders = ['experience', 'education', 'skills', 'summary', 'objective'];
    const foundHeaders = sectionHeaders.filter(header => 
      text.toLowerCase().includes(header)
    );
    score += foundHeaders.length * 8;

    // Check for bullet points or structured formatting
    if (text.includes('•') || text.includes('-') || text.includes('*')) {
      score += 10;
    }

    // Check for email and phone patterns
    if (text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)) {
      score += 5;
    }
    if (text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/)) {
      score += 5;
    }

    // Check for dates (employment history)
    if (text.match(/\b(19|20)\d{2}\b/) || text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i)) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  private static calculateKeywordScore(text: string): number {
    const matchedKeywords = this.findMatchedKeywords(text);
    const keywordDensity = matchedKeywords.length / this.commonKeywords.length;
    
    // Score based on keyword density and variety
    let score = Math.min(keywordDensity * 300, 80);
    
    // Bonus for having keywords from different categories
    const technicalKeywords = matchedKeywords.filter(k => 
      ['javascript', 'python', 'react', 'nodejs', 'html', 'css', 'sql'].includes(k)
    );
    const softSkillKeywords = matchedKeywords.filter(k => 
      ['leadership', 'teamwork', 'communication', 'problem-solving'].includes(k)
    );
    const actionWords = matchedKeywords.filter(k => 
      ['achieved', 'improved', 'developed', 'managed', 'led'].includes(k)
    );

    if (technicalKeywords.length > 0) score += 5;
    if (softSkillKeywords.length > 0) score += 5;
    if (actionWords.length > 0) score += 10;

    return Math.min(score, 100);
  }

  private static calculateGrammarScore(text: string): number {
    let score = 85; // Start with good score

    // Basic grammar checks
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Check for common grammar issues
    const commonErrors = [
      /\bi\s/g, // Lowercase 'i'
      /\s{2,}/g, // Multiple spaces
      /[.!?]{2,}/g, // Multiple punctuation
      /^\s*[a-z]/gm // Sentences not starting with capital
    ];

    commonErrors.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        score -= matches.length * 2;
      }
    });

    // Check for sentence variety
    const avgSentenceLength = text.length / sentences.length;
    if (avgSentenceLength < 10 || avgSentenceLength > 30) {
      score -= 5;
    }

    return Math.max(score, 30);
  }

  private static calculateReadabilityScore(words: string[], text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Simple readability based on sentence length and word complexity
    let score = 70;

    // Optimal sentence length (10-20 words)
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 20) {
      score += 15;
    } else if (avgWordsPerSentence > 25) {
      score -= 10;
    }

    // Check for variety in word length
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    if (avgWordLength >= 4 && avgWordLength <= 6) {
      score += 10;
    }

    // Check for transition words
    const transitionWords = ['however', 'therefore', 'additionally', 'furthermore', 'moreover'];
    const hasTransitions = transitionWords.some(word => text.toLowerCase().includes(word));
    if (hasTransitions) score += 5;

    return Math.min(score, 100);
  }

  private static findMatchedKeywords(text: string): string[] {
    return this.commonKeywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );
  }

  private static generateSuggestions(analysis: any): string[] {
    const suggestions: string[] = [];

    if (analysis.formatting < 70) {
      suggestions.push("Add clear section headers like 'Experience', 'Education', and 'Skills'");
      suggestions.push("Use bullet points to organize your achievements and responsibilities");
      suggestions.push("Include your contact information (email and phone number)");
    }

    if (analysis.keywords < 60) {
      suggestions.push("Include more relevant industry keywords and technical skills");
      suggestions.push("Use action verbs like 'achieved', 'improved', 'developed', 'managed'");
      suggestions.push("Add specific technologies, tools, or methodologies you've used");
    }

    if (analysis.grammar < 80) {
      suggestions.push("Review for grammar and spelling errors");
      suggestions.push("Ensure proper capitalization and punctuation");
      suggestions.push("Vary your sentence structure and length");
    }

    if (analysis.readability < 70) {
      suggestions.push("Keep sentences concise and clear (10-20 words per sentence)");
      suggestions.push("Use simple, professional language");
      suggestions.push("Break up long paragraphs into shorter, scannable sections");
    }

    if (analysis.wordCount < 200) {
      suggestions.push("Expand your resume with more detailed descriptions of your experience");
    } else if (analysis.wordCount > 800) {
      suggestions.push("Consider condensing your resume to focus on the most relevant information");
    }

    if (analysis.matchedKeywords.length < 5) {
      suggestions.push("Research job descriptions in your field and include relevant keywords");
    }

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }

  private static determineReadingLevel(score: number): string {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  }
}