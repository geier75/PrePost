/**
 * PREPOST AI Service - Vollständige KI-Integration
 * DSGVO & EU AI Act konform
 */

import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'crypto';

// Initialize Anthropic Client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Risk Categories mit DSGVO & ISO 27001 Compliance
export const RISK_CATEGORIES = {
  HATE_SPEECH: { weight: 1.0, legal: 'StGB §130', gdpr: 'Art. 6' },
  DISCRIMINATION: { weight: 0.9, legal: 'AGG §3', gdpr: 'Art. 9' },
  VIOLENCE: { weight: 1.0, legal: 'StGB §131', gdpr: 'Art. 6' },
  SEXUAL_CONTENT: { weight: 0.8, legal: 'StGB §184', gdpr: 'Art. 8' },
  PERSONAL_INFO: { weight: 1.0, legal: 'DSGVO', gdpr: 'Art. 4' },
  MISINFORMATION: { weight: 0.7, legal: 'NetzDG', gdpr: 'Art. 5' },
  COPYRIGHT: { weight: 0.8, legal: 'UrhG', gdpr: 'N/A' },
  DEFAMATION: { weight: 0.9, legal: 'StGB §186', gdpr: 'Art. 6' },
  INSIDER_INFO: { weight: 1.0, legal: 'WpHG §14', gdpr: 'Art. 32' },
  POLITICAL_RISK: { weight: 0.8, legal: 'PartG', gdpr: 'Art. 9' },
};

// User Context Types
export type UserContext = 
  | 'politician'
  | 'executive'
  | 'influencer'
  | 'journalist'
  | 'corporate'
  | 'private'
  | 'student';

// Analysis Result Interface
export interface AnalysisResult {
  riskScore: number;
  risks: RiskItem[];
  suggestions: string[];
  safeVersion?: string;
  legalWarnings: LegalWarning[];
  gdprCompliance: GDPRCheck;
  timestamp: string;
  auditId: string;
}

export interface RiskItem {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  legalReference?: string;
  gdprArticle?: string;
}

export interface LegalWarning {
  law: string;
  article: string;
  description: string;
  consequence: string;
  preventionTip: string;
}

export interface GDPRCheck {
  compliant: boolean;
  issues: string[];
  dataTypes: string[];
  consentRequired: boolean;
  retentionPeriod: string;
}

/**
 * Haupt-Analyse-Funktion mit KI
 * ISO 27001 konform mit Audit Logging
 */
export async function analyzeContent(
  content: string,
  context: UserContext = 'private',
  platform?: string,
  options: {
    language?: string;
    sensitivity?: 'low' | 'medium' | 'high' | 'maximum';
    includeAlternative?: boolean;
  } = {}
): Promise<AnalysisResult> {
  const startTime = Date.now();
  const auditId = generateAuditId();
  
  try {
    // DSGVO: Pseudonymisierung der Daten
    const hashedContent = hashForAudit(content);
    
    // Log für ISO 27001 Compliance
    await logAuditEntry({
      action: 'CONTENT_ANALYSIS_START',
      auditId,
      userContext: context,
      platform,
      contentHash: hashedContent,
      timestamp: new Date().toISOString(),
    });

    // Claude AI Analyse
    const aiResponse = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      temperature: 0.3,
      system: getSystemPrompt(context, options.sensitivity || 'high'),
      messages: [{
        role: 'user',
        content: buildAnalysisPrompt(content, platform, context, options)
      }]
    });

    // Parse AI Response
    const analysisText = aiResponse.content[0].type === 'text' 
      ? aiResponse.content[0].text 
      : '';
    
    const result = parseAIResponse(analysisText, content, context);
    
    // GDPR Compliance Check
    result.gdprCompliance = await checkGDPRCompliance(content);
    
    // Legal Risk Assessment
    result.legalWarnings = await assessLegalRisks(content, context);
    
    // Generate Safe Alternative if needed
    if (options.includeAlternative && result.riskScore > 0.3) {
      result.safeVersion = await generateSafeAlternative(content, result.risks, context);
    }
    
    // Audit Log für ISO 27001
    await logAuditEntry({
      action: 'CONTENT_ANALYSIS_COMPLETE',
      auditId,
      riskScore: result.riskScore,
      processingTime: Date.now() - startTime,
      risksDetected: result.risks.length,
      gdprCompliant: result.gdprCompliance.compliant,
    });
    
    return result;
  } catch (error) {
    // Error Logging für ISO 27001
    await logAuditEntry({
      action: 'CONTENT_ANALYSIS_ERROR',
      auditId,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    
    throw error;
  }
}

/**
 * Spezialisierte Analyse für Politiker
 * Besondere Sensibilität für politische Risiken
 */
export async function analyzePoliticalContent(
  content: string,
  politicalParty?: string,
  upcomingElection?: boolean
): Promise<AnalysisResult & { mediaSpinRisk: number; oppositionAttackVectors: string[] }> {
  const baseResult = await analyzeContent(content, 'politician', undefined, {
    sensitivity: 'maximum',
    includeAlternative: true,
  });
  
  // Zusätzliche politische Analyse
  const politicalAnalysis = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    temperature: 0.2,
    system: `You are a political risk analyst specializing in German politics. 
             Analyze for: media spin potential, opposition attack vectors, 
             voter sentiment impact, coalition dynamics.`,
    messages: [{
      role: 'user',
      content: `Analyze this political content for risks:
                Content: "${content}"
                Party: ${politicalParty || 'Unknown'}
                Election Coming: ${upcomingElection ? 'Yes' : 'No'}
                
                Provide:
                1. Media spin risk (0-1)
                2. Opposition attack vectors (list)
                3. Recommended alternatives`
    }]
  });
  
  const politicalText = politicalAnalysis.content[0].type === 'text' 
    ? politicalAnalysis.content[0].text 
    : '';
  
  // Parse political risks
  const mediaSpinRisk = extractMediaSpinRisk(politicalText);
  const oppositionAttackVectors = extractAttackVectors(politicalText);
  
  return {
    ...baseResult,
    mediaSpinRisk,
    oppositionAttackVectors,
  };
}

/**
 * Executive/CEO Analyse mit Insider Trading Detection
 */
export async function analyzeExecutiveContent(
  content: string,
  companyTicker?: string,
  isBlackoutPeriod?: boolean
): Promise<AnalysisResult & { insiderRisk: number; stockImpact: number }> {
  const baseResult = await analyzeContent(content, 'executive', undefined, {
    sensitivity: 'maximum',
    includeAlternative: true,
  });
  
  // Insider Trading & Compliance Check
  const complianceCheck = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    temperature: 0.1,
    system: `You are a financial compliance expert. Check for:
             - Insider trading risks (MAR, WpHG)
             - Material non-public information
             - Stock price impact
             - Regulatory violations (MiFID II, SOX)`,
    messages: [{
      role: 'user',
      content: `Analyze for insider trading and compliance:
                Content: "${content}"
                Company: ${companyTicker || 'Unknown'}
                Blackout Period: ${isBlackoutPeriod ? 'YES - CRITICAL' : 'No'}
                
                Return:
                1. Insider risk score (0-1)
                2. Potential stock impact (-100% to +100%)
                3. Specific violations`
    }]
  });
  
  const complianceText = complianceCheck.content[0].type === 'text'
    ? complianceCheck.content[0].text
    : '';
  
  const insiderRisk = extractInsiderRisk(complianceText);
  const stockImpact = extractStockImpact(complianceText);
  
  // Add compliance warnings if blackout period
  if (isBlackoutPeriod && insiderRisk > 0.1) {
    baseResult.legalWarnings.push({
      law: 'WpHG',
      article: '§14 Verbot von Insidergeschäften',
      description: 'Posting during blackout period detected',
      consequence: 'Bis zu 5 Jahre Haft oder Geldstrafe',
      preventionTip: 'Warten Sie bis nach Earnings Release',
    });
  }
  
  return {
    ...baseResult,
    insiderRisk,
    stockImpact,
  };
}

/**
 * GDPR Compliance Check
 */
async function checkGDPRCompliance(content: string): Promise<GDPRCheck> {
  const personalDataPatterns = [
    /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Names
    /\b\d{1,2}\.\d{1,2}\.\d{4}\b/g, // Dates
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Emails
    /\b\d{4,}\b/g, // Numbers (could be IDs)
    /\b(Straße|Str\.|Weg|Platz|Allee)\s+\d+\b/gi, // Addresses
  ];
  
  const dataTypes: string[] = [];
  let hasPersonalData = false;
  
  for (const pattern of personalDataPatterns) {
    if (pattern.test(content)) {
      hasPersonalData = true;
      if (pattern.toString().includes('email')) dataTypes.push('email');
      if (pattern.toString().includes('Straße')) dataTypes.push('address');
      if (pattern.toString().includes('A-Z][a-z]+')) dataTypes.push('name');
    }
  }
  
  const issues: string[] = [];
  if (hasPersonalData) {
    issues.push('Enthält möglicherweise personenbezogene Daten');
    issues.push('Einwilligung der betroffenen Person erforderlich');
  }
  
  return {
    compliant: !hasPersonalData,
    issues,
    dataTypes,
    consentRequired: hasPersonalData,
    retentionPeriod: hasPersonalData ? '30 days' : 'unlimited',
  };
}

/**
 * Legal Risk Assessment
 */
async function assessLegalRisks(
  content: string,
  context: UserContext
): Promise<LegalWarning[]> {
  const warnings: LegalWarning[] = [];
  
  // Check for hate speech (§130 StGB)
  const hateKeywords = ['hass', 'vernichten', 'ausrotten', 'töten'];
  if (hateKeywords.some(word => content.toLowerCase().includes(word))) {
    warnings.push({
      law: 'StGB',
      article: '§130 Volksverhetzung',
      description: 'Mögliche Volksverhetzung erkannt',
      consequence: 'Bis zu 5 Jahre Freiheitsstrafe',
      preventionTip: 'Formulieren Sie sachlich und respektvoll',
    });
  }
  
  // Check for defamation (§186 StGB)
  if (content.includes('Lügner') || content.includes('Betrüger')) {
    warnings.push({
      law: 'StGB',
      article: '§186 Üble Nachrede',
      description: 'Mögliche üble Nachrede',
      consequence: 'Bis zu 2 Jahre Freiheitsstrafe',
      preventionTip: 'Vermeiden Sie unbewiesene Anschuldigungen',
    });
  }
  
  // NetzDG Compliance
  if (context === 'politician' || context === 'journalist') {
    warnings.push({
      law: 'NetzDG',
      article: '§3 Compliance',
      description: 'Erhöhte Sorgfaltspflicht als öffentliche Person',
      consequence: 'Bis zu 5 Mio EUR Bußgeld',
      preventionTip: 'Prüfen Sie Fakten vor Veröffentlichung',
    });
  }
  
  return warnings;
}

/**
 * Generate Safe Alternative Content
 */
async function generateSafeAlternative(
  originalContent: string,
  risks: RiskItem[],
  context: UserContext
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 500,
    temperature: 0.7,
    system: `You are a communication expert helping ${context}s communicate safely.
             Rewrite content to remove risks while maintaining the core message.
             Be professional, clear, and appropriate for German social media.`,
    messages: [{
      role: 'user',
      content: `Original: "${originalContent}"
                Risks to remove: ${risks.map(r => r.category).join(', ')}
                
                Provide a safe alternative that:
                1. Removes all legal risks
                2. Maintains the key message
                3. Sounds natural in German
                4. Is appropriate for ${context}`
    }]
  });
  
  const safeText = response.content[0].type === 'text'
    ? response.content[0].text
    : originalContent;
  
  return safeText;
}

/**
 * Helper Functions
 */
function getSystemPrompt(context: UserContext, sensitivity: string): string {
  const basePrompt = `You are an AI content safety analyst specializing in German law and EU regulations.
                      Your role is to protect ${context}s from legal, reputational, and career risks.
                      
                      Apply these laws: StGB, DSGVO, NetzDG, AGG, UrhG, TMG, EU AI Act.
                      Sensitivity level: ${sensitivity}
                      
                      Check for:
                      1. Legal violations (criminal, civil)
                      2. GDPR/DSGVO violations
                      3. Hate speech, discrimination
                      4. Misinformation, defamation
                      5. Copyright infringement
                      6. Professional misconduct
                      7. Reputational risks`;
  
  const contextSpecific = {
    politician: '\nExtra focus on: Political scandals, media spin, opposition attacks, voter alienation',
    executive: '\nExtra focus on: Insider trading, compliance, shareholder impact, regulatory violations',
    influencer: '\nExtra focus on: Cancel culture, brand damage, sponsor conflicts, copyright',
    journalist: '\nExtra focus on: Source protection, fact-checking, press law, impartiality',
    corporate: '\nExtra focus on: Trade secrets, compliance, PR disasters, competitor information',
    private: '\nExtra focus on: Employment risks, privacy, family safety, cyberbullying',
    student: '\nExtra focus on: University policies, future employment, academic integrity',
  };
  
  return basePrompt + (contextSpecific[context] || '');
}

function buildAnalysisPrompt(
  content: string,
  platform?: string,
  context?: UserContext,
  options?: any
): string {
  return `Analyze this content for risks:
          
          Content: "${content}"
          Platform: ${platform || 'Unknown'}
          User Type: ${context || 'private'}
          Language: ${options?.language || 'German'}
          
          Provide detailed analysis with:
          1. Risk score (0.0-1.0)
          2. Specific risks found
          3. Legal references (German law)
          4. GDPR compliance issues
          5. Improvement suggestions
          6. Professional assessment`;
}

function parseAIResponse(
  aiText: string,
  originalContent: string,
  context: UserContext
): AnalysisResult {
  // Parse AI response into structured format
  // This is a simplified version - real implementation would be more sophisticated
  
  const riskScore = extractRiskScore(aiText) || 0.3;
  const risks = extractRisks(aiText);
  const suggestions = extractSuggestions(aiText);
  
  return {
    riskScore,
    risks,
    suggestions,
    legalWarnings: [],
    gdprCompliance: {
      compliant: true,
      issues: [],
      dataTypes: [],
      consentRequired: false,
      retentionPeriod: '30 days',
    },
    timestamp: new Date().toISOString(),
    auditId: generateAuditId(),
  };
}

function extractRiskScore(text: string): number {
  const match = text.match(/risk\s+score:?\s*([\d.]+)/i);
  return match ? parseFloat(match[1]) : 0.3;
}

function extractRisks(text: string): RiskItem[] {
  // Extract risks from AI response
  const risks: RiskItem[] = [];
  
  if (text.toLowerCase().includes('hate')) {
    risks.push({
      category: 'HATE_SPEECH',
      severity: 'high',
      explanation: 'Potential hate speech detected',
      legalReference: 'StGB §130',
      gdprArticle: 'Art. 6',
    });
  }
  
  if (text.toLowerCase().includes('personal') || text.toLowerCase().includes('data')) {
    risks.push({
      category: 'PERSONAL_INFO',
      severity: 'medium',
      explanation: 'Personal information exposure risk',
      legalReference: 'DSGVO',
      gdprArticle: 'Art. 4',
    });
  }
  
  return risks;
}

function extractSuggestions(text: string): string[] {
  // Extract suggestions from AI response
  const suggestions: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.includes('suggest') || line.includes('recommend')) {
      suggestions.push(line.trim());
    }
  }
  
  return suggestions.length > 0 ? suggestions : [
    'Review content for factual accuracy',
    'Consider potential misinterpretations',
    'Ensure compliance with platform guidelines',
  ];
}

function extractMediaSpinRisk(text: string): number {
  const match = text.match(/media\s+spin\s+risk:?\s*([\d.]+)/i);
  return match ? parseFloat(match[1]) : 0.5;
}

function extractAttackVectors(text: string): string[] {
  const vectors: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.includes('attack') || line.includes('opposition')) {
      vectors.push(line.trim());
    }
  }
  
  return vectors;
}

function extractInsiderRisk(text: string): number {
  const match = text.match(/insider\s+risk:?\s*([\d.]+)/i);
  return match ? parseFloat(match[1]) : 0.0;
}

function extractStockImpact(text: string): number {
  const match = text.match(/stock\s+impact:?\s*([-\d.]+)/i);
  return match ? parseFloat(match[1]) : 0.0;
}

function hashForAudit(content: string): string {
  return createHash('sha256').update(content).digest('hex').substring(0, 16);
}

function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

async function logAuditEntry(entry: any): Promise<void> {
  // In production, this would write to database
  console.log('[AUDIT]', entry);
  
  // TODO: Write to Supabase audit table
  // await supabase.from('audit_logs').insert(entry);
}

/**
 * Export main service functions
 */
export default {
  analyzeContent,
  analyzePoliticalContent,
  analyzeExecutiveContent,
  checkGDPRCompliance,
  assessLegalRisks,
  generateSafeAlternative,
};
