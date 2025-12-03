'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Shield,
  Brain,
  Zap
} from 'lucide-react';

interface AnalysisResult {
  score: number;
  risk: string;
  safe: boolean;
  categories?: Array<{
    name: string;
    score: number;
    severity: string;
  }>;
  suggestions?: string[];
  platform?: string;
}

export default function ImprovedRiskAnalyzer() {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), platform: 'other' })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult(data.analysis);
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' };
      case 'medium': return { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' };
      default: return { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' };
    }
  };

  const getRiskIcon = (safe: boolean) => {
    if (safe) return <CheckCircle style={{ width: '3rem', height: '3rem', color: '#10b981' }} />;
    return <AlertTriangle style={{ width: '3rem', height: '3rem', color: '#ef4444' }} />;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '24px',
      padding: '2.5rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Brain style={{
            width: '4rem',
            height: '4rem',
            color: '#8b5cf6',
            margin: '0 auto 1rem'
          }} />
        </motion.div>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '900',
          color: 'white',
          marginBottom: '0.5rem'
        }}>
          AI Risk Analyzer
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
          Teste deinen Content in Echtzeit
        </p>
      </div>

      {/* Input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Schreibe hier deinen Post... (z.B. 'Das ist dumm' für High Risk)"
          disabled={isAnalyzing}
          style={{
            width: '100%',
            minHeight: '150px',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '16px',
            color: 'white',
            fontSize: '1rem',
            resize: 'vertical',
            outline: 'none',
            transition: 'all 0.3s',
            opacity: isAnalyzing ? 0.6 : 1
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.875rem'
        }}>
          <span>{content.length} / 5000</span>
          <span>{content.trim().split(/\s+/).filter(w => w).length} Wörter</span>
        </div>
      </div>

      {/* Analyze Button */}
      <motion.button
        onClick={handleAnalyze}
        disabled={!content.trim() || isAnalyzing}
        whileHover={{ scale: content.trim() && !isAnalyzing ? 1.02 : 1 }}
        whileTap={{ scale: content.trim() && !isAnalyzing ? 0.98 : 1 }}
        style={{
          width: '100%',
          padding: '1.25rem',
          background: isAnalyzing ? 'rgba(107,114,128,0.3)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          borderRadius: '16px',
          color: 'white',
          fontSize: '1.125rem',
          fontWeight: '700',
          cursor: isAnalyzing || !content.trim() ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          boxShadow: !isAnalyzing && content.trim() ? '0 10px 30px rgba(99,102,241,0.4)' : 'none',
          transition: 'all 0.3s'
        }}
      >
        {isAnalyzing ? (
          <>
            <Loader2 style={{ width: '1.5rem', height: '1.5rem', animation: 'spin 1s linear infinite' }} />
            Analysiere...
          </>
        ) : (
          <>
            <Sparkles style={{ width: '1.5rem', height: '1.5rem' }} />
            Mit KI analysieren
            <Zap style={{ width: '1.5rem', height: '1.5rem' }} />
          </>
        )}
      </motion.button>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ marginTop: '2rem' }}
          >
            {/* Risk Score Card */}
            <div style={{
              background: `linear-gradient(135deg, ${getRiskColor(result.risk).light}, rgba(0,0,0,0.2))`,
              border: `2px solid ${getRiskColor(result.risk).border}`,
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
              >
                {getRiskIcon(result.safe)}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: '4rem',
                  fontWeight: '900',
                  color: getRiskColor(result.risk).bg,
                  marginTop: '1rem',
                  marginBottom: '0.5rem'
                }}
              >
                {result.score}/100
              </motion.div>

              <div style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: getRiskColor(result.risk).bg,
                marginBottom: '0.5rem'
              }}>
                {result.safe ? '✓ Sicher zu posten' : '⚠️ Risiko erkannt'}
              </div>

              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.95rem'
              }}>
                {result.safe 
                  ? 'Dein Content ist sicher und kann bedenkenlos gepostet werden.'
                  : 'Dieser Content enthält potenziell problematische Elemente.'}
              </p>
            </div>

            {/* Categories */}
            {result.categories && result.categories.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <span>📊 Detaillierte Analyse</span>
                  <span style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                    ▼
                  </span>
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '1rem', paddingTop: '1.5rem' }}>
                        {result.categories.map((cat, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            style={{ marginBottom: '1rem' }}
                          >
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '0.5rem'
                            }}>
                              <span style={{ color: 'white', fontWeight: '600' }}>{cat.name}</span>
                              <span style={{ color: getRiskColor(cat.severity).bg, fontWeight: '700' }}>
                                {cat.score}%
                              </span>
                            </div>
                            <div style={{
                              width: '100%',
                              height: '8px',
                              background: 'rgba(255,255,255,0.1)',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${cat.score}%` }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                                style={{
                                  height: '100%',
                                  background: getRiskColor(cat.severity).bg,
                                  borderRadius: '4px'
                                }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <h3 style={{
                  color: '#a78bfa',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Shield style={{ width: '1.25rem', height: '1.25rem' }} />
                  Empfehlungen
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {result.suggestions.map((suggestion, i) => (
                    <motion.li
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '0.75rem',
                        lineHeight: 1.6
                      }}
                    >
                      {suggestion}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
