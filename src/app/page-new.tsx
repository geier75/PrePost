'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('linkedin');
  const [country, setCountry] = useState('DE');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platform,
          countryCode: country,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 76) return 'text-green-600';
    if (score >= 51) return 'text-yellow-600';
    if (score >= 26) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 76) return 'bg-green-100 border-green-500';
    if (score >= 51) return 'bg-yellow-100 border-yellow-500';
    if (score >= 26) return 'bg-orange-100 border-orange-500';
    return 'bg-red-100 border-red-500';
  };

  const getVerdictEmoji = (verdict: string) => {
    switch (verdict) {
      case 'safe': return '✅';
      case 'caution': return '⚠️';
      case 'high-risk': return '🚨';
      case 'critical': return '🔴';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PREPOST</h1>
              <p className="text-sm text-gray-600 mt-1">Think Before You Post - AI-Powered Legal Risk Analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Protected by AI</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Post</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Location</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DE">🇩🇪 Germany</option>
                  <option value="US">🇺🇸 United States</option>
                  <option value="GB">🇬🇧 United Kingdom</option>
                  <option value="CN">🇨🇳 China</option>
                  <option value="RU">🇷🇺 Russia</option>
                  <option value="AE">🇦🇪 UAE</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content to Analyze
                  <span className="float-right text-gray-500">{charCount}/5000</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your post content here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={10}
                  maxLength={5000}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !content.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>🔍 Analyze Post</>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2">🛡️ How It Works</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ AI analyzes your post for legal risks in your country</li>
                <li>✓ Detects violations of local laws and regulations</li>
                <li>✓ Provides risk score across 6 categories</li>
                <li>✓ Suggests safer alternatives</li>
                <li>✓ Protects your career and freedom</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            {result ? (
              <>
                <div className={`bg-white rounded-xl shadow-lg p-6 border-2 ${getRiskBgColor(result.riskScore.overall)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Risk Assessment</h2>
                    <span className="text-3xl">{getVerdictEmoji(result.verdict)}</span>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className={`text-6xl font-bold ${getRiskColor(result.riskScore.overall)}`}>
                      {result.riskScore.overall}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Overall Risk Score</div>
                    <div className="text-lg font-semibold text-gray-800 mt-1 uppercase">
                      {result.verdict}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(result.riskScore.categories).map(([category, score]: [string, any]) => (
                      <div key={category} className="bg-white rounded-lg p-3 border">
                        <div className="text-xs text-gray-600 uppercase mb-1">{category}</div>
                        <div className={`text-2xl font-bold ${getRiskColor(score)}`}>{score}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {result.legalRisks && result.legalRisks.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚖️ Legal Risks Detected</h3>
                    <div className="space-y-3">
                      {result.legalRisks.map((risk: any, index: number) => (
                        <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                          <div className="flex items-start justify-between">
                            <div className="font-semibold text-red-900">{risk.category}</div>
                            <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded uppercase">
                              {risk.severity}
                            </span>
                          </div>
                          <p className="text-sm text-red-800 mt-2">{risk.description}</p>
                          <p className="text-xs text-red-700 mt-2 font-medium">
                            ⚠️ {risk.consequence}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Suggestions</h3>
                    <ul className="space-y-2">
                      {result.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-600 font-bold">✓</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.improvedVersion && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">✨ Safer Alternative</h3>
                    <div className="bg-white rounded-lg p-4 border border-green-300">
                      <p className="text-gray-800 whitespace-pre-wrap">{result.improvedVersion}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Analyze</h3>
                <p className="text-gray-600">
                  Enter your post content and click "Analyze Post" to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
