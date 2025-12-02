'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 3 Different Demo Scenarios (7 seconds each = ~20 seconds total)
const DEMO_SCENARIOS = [
  {
    id: 1,
    title: "Career Killer Post",
    platform: "LinkedIn",
    icon: "💼",
    originalPost: "My boss is the worst! This company is going down anyway...",
    riskScore: 92,
    consequences: "Job Loss Risk: 95%",
    safeVersion: "Looking forward to new professional challenges and growth opportunities.",
    color: "#0A66C2",
    result: "BLOCKED - Career Saved! ✅"
  },
  {
    id: 2,
    title: "Legal Disaster Tweet",
    platform: "Twitter/X",
    icon: "🐦",
    originalPost: "BREAKING: Inside info - our CEO is stealing money! Proof coming...",
    riskScore: 98,
    consequences: "Lawsuit Risk: €500,000",
    safeVersion: "Transparency and ethical business practices are important values.",
    color: "#1DA1F2", 
    result: "PREVENTED - €500K Saved! 💰"
  },
  {
    id: 3,
    title: "Reputation Destroyer",
    platform: "Instagram",
    icon: "📸",
    originalPost: "Check out this idiot at the party last night [photo]",
    riskScore: 87,
    consequences: "Criminal Charges Possible",
    safeVersion: "Great memories from last night\'s event! 🎉",
    color: "#E4405F",
    result: "STOPPED - Reputation Safe! 🛡️"
  }
];

export default function RiskAnalyzerDemo() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-play demo
  const startDemo = () => {
    setIsPlaying(true);
    setCurrentScenario(0);
    playScenario(0);
  };

  const playScenario = (index: number) => {
    if (index >= DEMO_SCENARIOS.length) {
      // Demo complete - restart
      setTimeout(() => {
        setIsPlaying(false);
        setShowResult(false);
        setProgress(0);
      }, 2000);
      return;
    }

    setCurrentScenario(index);
    setIsAnalyzing(true);
    setShowResult(false);
    
    // Show analyzing for 2 seconds
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2000);

    // Move to next scenario after 6.5 seconds
    setTimeout(() => {
      setShowResult(false);
      playScenario(index + 1);
    }, 6500);
  };

  // Progress bar animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + (100 / 200); // 20 seconds = 200 updates at 100ms
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const scenario = DEMO_SCENARIOS[currentScenario];

  return (
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,40,0.9))',
      borderRadius: '24px',
      border: '2px solid rgba(99,102,241,0.3)',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '500px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Animation */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, ${scenario?.color}20 0%, transparent 70%)`,
        animation: 'pulse 3s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '0.5rem',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          ⚡ AI Protection Demo
        </h2>
        <p style={{ 
          color: 'rgba(255,255,255,0.7)',
          fontSize: '1.1rem'
        }}>
          Watch how PREPOST saves you from disaster
        </p>
      </div>

      {!isPlaying ? (
        /* Start Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px'
          }}
        >
          <button
            onClick={startDemo}
            style={{
              padding: '2rem 4rem',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              border: 'none',
              borderRadius: '100px',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 20px 40px rgba(99,102,241,0.4)',
              transition: 'all 0.3s',
              animation: 'pulse 2s ease-in-out infinite'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ▶️ Start 20-Second Demo
          </button>
          
          <p style={{
            marginTop: '2rem',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.9rem'
          }}>
            See 3 real scenarios where PREPOST saves the day
          </p>
        </motion.div>
      ) : (
        /* Demo Playing */
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            style={{
              position: 'relative',
              zIndex: 10
            }}
          >
            {/* Scenario Title */}
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 2rem',
                background: scenario.color + '20',
                border: `2px solid ${scenario.color}`,
                borderRadius: '100px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{scenario.icon}</span>
                <span style={{ 
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  {scenario.platform}
                </span>
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  animation: 'blink 1s ease-in-out infinite'
                }}>
                  DANGER
                </span>
              </div>
            </div>

            {/* Post Display */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.6
              }}>
                "{scenario.originalPost}"
              </div>
            </div>

            {/* Analysis Animation */}
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '3rem'
                }}
              >
                <div style={{
                  display: 'inline-block',
                  width: '80px',
                  height: '80px',
                  border: '4px solid rgba(255,255,255,0.1)',
                  borderTop: `4px solid ${scenario.color}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{
                  marginTop: '1rem',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  🤖 AI Analyzing...
                </p>
              </motion.div>
            )}

            {/* Results */}
            {showResult && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                {/* Risk Score */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    background: 'rgba(239,68,68,0.2)',
                    borderRadius: '16px',
                    border: '2px solid #ef4444',
                    flex: 1,
                    marginRight: '1rem'
                  }}>
                    <div style={{
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      color: '#ef4444'
                    }}>
                      {scenario.riskScore}%
                    </div>
                    <div style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.9rem'
                    }}>
                      RISK LEVEL
                    </div>
                  </div>
                  
                  <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    background: 'rgba(239,68,68,0.1)',
                    borderRadius: '16px',
                    border: '1px solid rgba(239,68,68,0.3)',
                    flex: 1.5
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#fbbf24'
                    }}>
                      ⚠️ WARNING
                    </div>
                    <div style={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '1rem',
                      marginTop: '0.5rem'
                    }}>
                      {scenario.consequences}
                    </div>
                  </div>
                </div>

                {/* Safe Alternative */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '2px solid #10b981',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <span style={{
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      Safe Alternative Generated:
                    </span>
                  </div>
                  <div style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontStyle: 'italic'
                  }}>
                    "{scenario.safeVersion}"
                  </div>
                </div>

                {/* Result Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  style={{
                    textAlign: 'center',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(16,185,129,0.3)'
                  }}
                >
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    {scenario.result}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Progress Bar */}
      {isPlaying && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'rgba(255,255,255,0.1)'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #6366f1, #ec4899)',
            transition: 'width 0.1s linear'
          }} />
        </div>
      )}

      {/* Scenario Indicators */}
      {isPlaying && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem'
        }}>
          {DEMO_SCENARIOS.map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: i === currentScenario 
                  ? '#6366f1'
                  : i < currentScenario
                  ? 'rgba(99,102,241,0.5)'
                  : 'rgba(255,255,255,0.2)'
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
