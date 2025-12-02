'use client';

import { useState } from 'react';
import { 
  Brain,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  Shield,
  TrendingUp
} from 'lucide-react';

export default function RiskAnalyzer() {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeContent = () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        overallRisk: 'Medium',
        score: 67,
        categories: [
          { name: 'Professional Impact', risk: 'High', score: 85 },
          { name: 'Legal Compliance', risk: 'Low', score: 15 },
          { name: 'Brand Safety', risk: 'Medium', score: 60 },
          { name: 'Privacy Concerns', risk: 'Low', score: 20 }
        ],
        suggestions: [
          'Consider removing specific company names',
          'Tone down emotional language',
          'Add context to avoid misinterpretation'
        ]
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '2rem',
      border: '1px solid rgba(255,255,255,0.2)',
      marginTop: '3rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Brain size={28} color="white" />
        </div>
        <div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'white',
            margin: 0
          }}>
            AI Risk Analyzer
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.875rem',
            margin: 0
          }}>
            Test your content before posting
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste or type your social media post here..."
          style={{
            width: '100%',
            minHeight: '120px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '1rem',
            color: 'white',
            fontSize: '1rem',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(139,92,246,0.5)';
            e.target.style.background = 'rgba(255,255,255,0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
            e.target.style.background = 'rgba(255,255,255,0.05)';
          }}
        />
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map(platform => (
              <button
                key={platform}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
              >
                {platform}
              </button>
            ))}
          </div>
          
          <button
            onClick={analyzeContent}
            disabled={!content.trim() || isAnalyzing}
            style={{
              padding: '0.75rem 2rem',
              background: isAnalyzing 
                ? 'rgba(139,92,246,0.3)'
                : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: content.trim() && !isAnalyzing ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              opacity: content.trim() && !isAnalyzing ? 1 : 0.5
            }}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send size={20} />
                Analyze Risk
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div style={{
          animation: 'slideIn 0.5s ease'
        }}>
          {/* Overall Score */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>
                  Overall Risk Score
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <span style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: getRiskColor(analysis.overallRisk)
                  }}>
                    {analysis.score}
                  </span>
                  <span style={{
                    padding: '0.5rem 1rem',
                    background: `${getRiskColor(analysis.overallRisk)}20`,
                    color: getRiskColor(analysis.overallRisk),
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }}>
                    {analysis.overallRisk} Risk
                  </span>
                </div>
              </div>
              
              <div style={{
                width: '120px',
                height: '120px',
                background: `conic-gradient(${getRiskColor(analysis.overallRisk)} ${analysis.score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Shield size={40} color={getRiskColor(analysis.overallRisk)} />
                </div>
              </div>
            </div>
          </div>

          {/* Risk Categories */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {analysis.categories.map((cat: any, i: number) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.875rem'
                  }}>
                    {cat.name}
                  </span>
                  {cat.risk === 'High' ? (
                    <XCircle size={20} color="#ef4444" />
                  ) : cat.risk === 'Medium' ? (
                    <AlertCircle size={20} color="#f59e0b" />
                  ) : (
                    <CheckCircle size={20} color="#10b981" />
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    flex: 1,
                    height: '6px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${cat.score}%`,
                      height: '100%',
                      background: getRiskColor(cat.risk),
                      borderRadius: '3px'
                    }} />
                  </div>
                  <span style={{
                    color: getRiskColor(cat.risk),
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {cat.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div style={{
            background: 'rgba(16,185,129,0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(16,185,129,0.2)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <TrendingUp size={20} style={{ color: '#10b981' }} />
              AI Recommendations
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {analysis.suggestions.map((suggestion: string, i: number) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  <CheckCircle size={16} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem' }}>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
