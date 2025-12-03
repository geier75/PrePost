// src/services/ai/content-analyzer.ts
import Anthropic from '@anthropic-ai/sdk';

export type RiskLevel = 'none' | 'low' | 'medium' | 'high';

export interface RiskCategory {
  name: string;
  level: RiskLevel;
  score: number;
  explanation: string;
  examples?: string[];
}

export interface AnalysisResult {
  id: string;
  content: string;
  platform?: string;
  overallRisk: RiskLevel;
  riskScore: number;
  categories: {
    hateSpeech: RiskCategory;
    careerRisk: RiskCategory;
    legalIssues: RiskCategory;
    reputationDamage: RiskCategory;
    personalSafety: RiskCategory;
    misinformation: RiskCategory;
  };
  recommendation: 'safe' | 'revise' | 'danger';
  suggestions: string[];
  improvedVersion?: string;
  confidence: number;
  timestamp: Date;
}

export class ContentAnalyzer {
  private anthropic: Anthropic;
  
  constructor(apiKey: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey,
    });
  }

  async analyzeContent(
    content: string,
    platform?: string,
    userContext?: {
      profession?: string;
      industry?: string;
      country?: string;
    }
  ): Promise<AnalysisResult> {
    const systemPrompt = `You are an expert AI content safety analyzer specializing in social media risk assessment. 
    Your task is to analyze content for potential risks across multiple categories and provide actionable recommendations.
    
    Consider the following context:
    - Platform: ${platform || 'general social media'}
    - User profession: ${userContext?.profession || 'not specified'}
    - Industry: ${userContext?.industry || 'not specified'}
    - Country: ${userContext?.country || 'Germany'}
    
    Analyze the content for these risk categories:
    1. Hate Speech/Offensive Content - discriminatory, insulting, or hateful language
    2. Career Risk - content that could harm professional reputation or job prospects
    3. Legal Issues - potential defamation, copyright violations, threats, or illegal content
    4. Reputation Damage - content that could harm personal reputation long-term
    5. Personal Safety - revealing personal information that could compromise safety
    6. Misinformation - spreading false or misleading information
    
    For each category, provide:
    - Risk level: none, low, medium, or high
    - Score: 0-100 (0 = no risk, 100 = extreme risk)
    - Explanation: Why this level was assigned
    - Examples: Specific problematic phrases (if any)
    
    Also provide:
    - Overall risk assessment
    - Recommendation: safe (post it), revise (needs changes), or danger (do not post)
    - Specific suggestions for improvement
    - An improved version of the content (if needed)
    - Confidence level in the analysis (0-100)
    
    Respond in JSON format.`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Please analyze this content for risks:\n\n"${content}"
            
            Provide a detailed risk analysis in JSON format with the structure:
            {
              "overallRisk": "none|low|medium|high",
              "riskScore": number,
              "categories": {
                "hateSpeech": { "level": "...", "score": number, "explanation": "...", "examples": [] },
                "careerRisk": { "level": "...", "score": number, "explanation": "...", "examples": [] },
                "legalIssues": { "level": "...", "score": number, "explanation": "...", "examples": [] },
                "reputationDamage": { "level": "...", "score": number, "explanation": "...", "examples": [] },
                "personalSafety": { "level": "...", "score": number, "explanation": "...", "examples": [] },
                "misinformation": { "level": "...", "score": number, "explanation": "...", "examples": [] }
              },
              "recommendation": "safe|revise|danger",
              "suggestions": ["suggestion1", "suggestion2", ...],
              "improvedVersion": "improved content text or null",
              "confidence": number
            }`,
          },
        ],
      });

      const analysisData = JSON.parse(response.content[0].text);
      
      return {
        id: this.generateAnalysisId(),
        content,
        platform,
        ...analysisData,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error analyzing content:', error);
      throw new Error('Failed to analyze content. Please try again.');
    }
  }

  async generateSuggestions(
    content: string,
    riskCategories: AnalysisResult['categories']
  ): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Analyze each category and generate specific suggestions
    Object.entries(riskCategories).forEach(([category, data]) => {
      if (data.score > 30) {
        suggestions.push(this.getSuggestionForCategory(category, data));
      }
    });
    
    return suggestions;
  }

  private getSuggestionForCategory(category: string, data: RiskCategory): string {
    const suggestionMap: Record<string, (data: RiskCategory) => string> = {
      hateSpeech: (d) => `Consider using more inclusive and respectful language. ${d.explanation}`,
      careerRisk: (d) => `This content could impact your professional image. ${d.explanation}`,
      legalIssues: (d) => `Be aware of potential legal implications. ${d.explanation}`,
      reputationDamage: (d) => `Think about long-term impact on your reputation. ${d.explanation}`,
      personalSafety: (d) => `Avoid sharing sensitive personal information. ${d.explanation}`,
      misinformation: (d) => `Verify facts before sharing. ${d.explanation}`,
    };
    
    return suggestionMap[category]?.(data) || 'Consider revising this content.';
  }

  private generateAnalysisId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  calculateOverallRisk(categories: AnalysisResult['categories']): RiskLevel {
    const scores = Object.values(categories).map(c => c.score);
    const maxScore = Math.max(...scores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Use weighted calculation
    const weightedScore = maxScore * 0.7 + avgScore * 0.3;
    
    if (weightedScore >= 75) return 'high';
    if (weightedScore >= 50) return 'medium';
    if (weightedScore >= 25) return 'low';
    return 'none';
  }
}