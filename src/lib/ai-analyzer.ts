/**
 * Enhanced AI Analyzer with Country-Specific Legal Risk Assessment
 * Uses Claude AI for comprehensive content analysis
 */

import OpenAI from 'openai';
import { getCountryLegalProfile, detectRiskyKeywords } from './legal-database';
import { logger } from './logger';

export interface RiskScore {
  overall: number; // 0-100
  categories: {
    legal: number;
    career: number;
    reputation: number;
    cultural: number;
    privacy: number;
    misinformation: number;
  };
}

export interface AnalysisResult {
  riskScore: RiskScore;
  verdict: 'safe' | 'caution' | 'high-risk' | 'critical';
  legalRisks: Array<{
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    consequence: string;
  }>;
  suggestions: string[];
  improvedVersion: string;
  detectedIssues: string[];
  countrySpecificWarnings: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Analyze content with country-specific legal context
 */
export async function analyzeContent(
  content: string,
  platform: string,
  countryCode: string
): Promise<AnalysisResult> {
  const startTime = Date.now();

  try {
    // Get country legal profile
    const legalProfile = getCountryLegalProfile(countryCode);
    
    // Detect risky keywords
    const riskyKeywords = detectRiskyKeywords(content, countryCode);

    // Build comprehensive prompt for Claude
    const prompt = buildAnalysisPrompt(content, platform, legalProfile, riskyKeywords);

    // Call OpenAI API (using gemini-2.5-flash via Manus proxy)
    const completion = await openai.chat.completions.create({
      model: 'gemini-2.5-flash',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Parse response
    const responseText = completion.choices[0]?.message?.content || '';
    const result = parseAIResponse(responseText, legalProfile, riskyKeywords);

    const duration = Date.now() - startTime;
    logger.info('AI analysis completed', {
      country: countryCode,
      duration,
      riskScore: result.riskScore.overall,
      verdict: result.verdict
    });

    return result;

  } catch (error) {
    logger.error('AI analysis failed', error as Error, { countryCode, platform });
    
    // Fallback to keyword-based analysis
    return fallbackAnalysis(content, countryCode, riskyKeywords);
  }
}

/**
 * Build comprehensive analysis prompt
 */
function buildAnalysisPrompt(
  content: string,
  platform: string,
  legalProfile: any,
  riskyKeywords: string[]
): string {
  return `You are an expert legal and social media risk analyst. Analyze the following ${platform} post for a user in ${legalProfile.country}.

**LEGAL CONTEXT FOR ${legalProfile.country.toUpperCase()}:**
Freedom of Speech Score: ${legalProfile.freedomOfSpeechScore}/100
${legalProfile.risks.map((r: any) => `- ${r.category} (${r.severity}): ${r.description}`).join('\n')}

**CULTURAL NORMS:**
${legalProfile.culturalNorms.join('\n')}

**RED FLAGS DETECTED:**
${riskyKeywords.length > 0 ? riskyKeywords.join(', ') : 'None'}

**POST CONTENT:**
"${content}"

**ANALYSIS REQUIRED:**
Provide a comprehensive risk assessment in the following JSON format:

{
  "riskScore": {
    "overall": <0-100>,
    "legal": <0-100>,
    "career": <0-100>,
    "reputation": <0-100>,
    "cultural": <0-100>,
    "privacy": <0-100>,
    "misinformation": <0-100>
  },
  "verdict": "<safe|caution|high-risk|critical>",
  "legalRisks": [
    {
      "category": "<category name>",
      "severity": "<low|medium|high|critical>",
      "description": "<what is the risk>",
      "consequence": "<potential legal consequence>"
    }
  ],
  "suggestions": [
    "<specific improvement suggestion 1>",
    "<specific improvement suggestion 2>",
    "<specific improvement suggestion 3>"
  ],
  "improvedVersion": "<rewritten version of the post that is safe>",
  "detectedIssues": [
    "<issue 1>",
    "<issue 2>"
  ],
  "countrySpecificWarnings": [
    "<warning specific to ${legalProfile.country}>"
  ]
}

**SCORING GUIDELINES:**
- 0-25: CRITICAL - Likely illegal, severe consequences
- 26-50: HIGH RISK - Potentially illegal or very problematic
- 51-75: CAUTION - Some concerns, needs revision
- 76-100: SAFE - Low risk, acceptable

**IMPORTANT:**
- Consider ${legalProfile.country}-specific laws and penalties
- Be extremely cautious with detected red flags
- Provide actionable, specific suggestions
- The improved version must be completely safe while preserving the user's intent
- Consider career impact for professionals
- Account for cultural sensitivities

Return ONLY the JSON, no additional text.`;
}

/**
 * Parse AI response into structured result
 */
function parseAIResponse(
  responseText: string,
  legalProfile: any,
  riskyKeywords: string[]
): AnalysisResult {
  try {
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and return
    return {
      riskScore: parsed.riskScore || {
        overall: 50,
        categories: {
          legal: 50,
          career: 50,
          reputation: 50,
          cultural: 50,
          privacy: 50,
          misinformation: 50
        }
      },
      verdict: parsed.verdict || 'caution',
      legalRisks: parsed.legalRisks || [],
      suggestions: parsed.suggestions || [],
      improvedVersion: parsed.improvedVersion || '',
      detectedIssues: parsed.detectedIssues || [],
      countrySpecificWarnings: parsed.countrySpecificWarnings || []
    };

  } catch (error) {
    logger.error('Failed to parse AI response', error as Error);
    throw error;
  }
}

/**
 * Fallback analysis when AI fails
 */
function fallbackAnalysis(
  content: string,
  countryCode: string,
  riskyKeywords: string[]
): AnalysisResult {
  const legalProfile = getCountryLegalProfile(countryCode);
  
  // Calculate basic risk score
  let overallRisk = 50;
  
  if (riskyKeywords.length > 0) {
    overallRisk = Math.max(20, 50 - (riskyKeywords.length * 10));
  }

  // Adjust based on freedom score
  if (legalProfile.freedomOfSpeechScore < 30) {
    overallRisk = Math.min(overallRisk, 40);
  }

  return {
    riskScore: {
      overall: overallRisk,
      categories: {
        legal: overallRisk,
        career: 60,
        reputation: 60,
        cultural: 50,
        privacy: 70,
        misinformation: 60
      }
    },
    verdict: overallRisk < 40 ? 'critical' : overallRisk < 60 ? 'high-risk' : 'caution',
    legalRisks: riskyKeywords.map(keyword => ({
      category: 'Detected Red Flag',
      severity: 'high' as const,
      description: `Content contains "${keyword}" which is flagged in ${legalProfile.country}`,
      consequence: 'Potential legal action or penalties'
    })),
    suggestions: [
      'Remove sensitive keywords',
      'Rephrase to be more neutral',
      'Consider the legal context of your location'
    ],
    improvedVersion: '[AI service unavailable - please revise manually]',
    detectedIssues: riskyKeywords,
    countrySpecificWarnings: [
      `${legalProfile.country} has strict regulations on this type of content`,
      `Freedom of speech score: ${legalProfile.freedomOfSpeechScore}/100`
    ]
  };
}
