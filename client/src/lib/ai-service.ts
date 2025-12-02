import { getCountryProfile } from './legal-db';

// Since this is a static web app, we'll simulate the AI response logic 
// but powered by the structured legal database we just created.
// In a full server environment, this would call the Gemini API.

export interface AnalysisResult {
  riskScore: number;
  verdict: 'SAFE' | 'CAUTION' | 'HIGH RISK' | 'CRITICAL';
  categories: {
    legal: number;
    career: number;
    reputation: number;
    cultural: number;
    privacy: number;
    misinformation: number;
  };
  legalRisks: {
    risk: string;
    penalty: string;
  }[];
  suggestions: string[];
  countrySpecificWarnings: string[];
}

export const analyzeContent = async (content: string, countryCode: string): Promise<AnalysisResult> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500));

  const country = getCountryProfile(countryCode);
  const lowerContent = content.toLowerCase();
  
  // Basic keyword analysis logic (Simulating AI)
  let riskScore = 100; // Start at 100 (Safe)
  const detectedRisks: { risk: string; penalty: string }[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // 1. Check against country specific risks
  country.risks.forEach(risk => {
    const keywords = risk.category.toLowerCase().split(' ');
    const matches = keywords.some(k => lowerContent.includes(k) && k.length > 3);
    
    if (matches) {
      const penalty = risk.severity === 'critical' ? 40 : risk.severity === 'high' ? 25 : 10;
      riskScore -= penalty;
      detectedRisks.push({
        risk: risk.category,
        penalty: risk.penalty
      });
      warnings.push(`Potential violation of ${risk.category} laws in ${country.name}.`);
    }
  });

  // 2. General Sentiment/Aggression Check (Simple Heuristic)
  const aggressiveWords = ['hate', 'stupid', 'idiot', 'kill', 'attack', 'destroy', 'liar'];
  const aggressionCount = aggressiveWords.filter(w => lowerContent.includes(w)).length;
  if (aggressionCount > 0) {
    riskScore -= aggressionCount * 10;
    suggestions.push("Consider removing aggressive language to maintain professionalism.");
  }

  // 3. Privacy Check
  const privacyPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email
    /\b\d{10,}\b/ // Phone/ID
  ];
  if (privacyPatterns.some(p => p.test(content))) {
    riskScore -= 30;
    detectedRisks.push({ risk: 'Privacy Violation', penalty: 'Data breach potential' });
    suggestions.push("Remove personal identifiable information (PII).");
  }

  // Normalize Score
  riskScore = Math.max(0, Math.min(100, riskScore));

  // Determine Verdict
  let verdict: AnalysisResult['verdict'] = 'SAFE';
  if (riskScore <= 25) verdict = 'CRITICAL';
  else if (riskScore <= 50) verdict = 'HIGH RISK';
  else if (riskScore <= 75) verdict = 'CAUTION';

  // Generate Categories based on findings
  const categories = {
    legal: Math.max(0, 100 - (detectedRisks.length * 20)),
    career: Math.max(0, 100 - (aggressionCount * 15)),
    reputation: Math.max(0, 100 - (aggressionCount * 10) - (detectedRisks.length * 10)),
    cultural: country.freedomScore, // Base on country freedom
    privacy: privacyPatterns.some(p => p.test(content)) ? 20 : 100,
    misinformation: 100 // Placeholder as we can't fact check statically easily
  };

  // Default suggestions if none
  if (suggestions.length === 0) {
    if (riskScore < 100) {
      suggestions.push("Review the tone to ensure it aligns with local cultural norms.");
    } else {
      suggestions.push("Content appears safe. Good to go!");
    }
  }

  return {
    riskScore,
    verdict,
    categories,
    legalRisks: detectedRisks,
    suggestions,
    countrySpecificWarnings: warnings
  };
};
