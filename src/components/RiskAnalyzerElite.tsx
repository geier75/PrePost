'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Die 33 Elite Generals
const ELITE_GENERALS = [
  { id: 1, name: 'Gen. Sterling', role: 'Supreme Commander', expertise: 'Strategy', avatar: '⚔️' },
  { id: 2, name: 'Gen. Nakamura', role: 'Cyber Operations', expertise: 'Security', avatar: '🛡️' },
  { id: 3, name: 'Gen. Volkov', role: 'AI Intelligence', expertise: 'Neural Networks', avatar: '🧠' },
  { id: 4, name: 'Gen. Chen', role: 'Visual Operations', expertise: 'UI/UX', avatar: '🎨' },
  { id: 5, name: 'Gen. Romano', role: 'Creative Director', expertise: 'Design', avatar: '💎' },
  { id: 6, name: 'Gen. Thompson', role: 'Backend Operations', expertise: 'Infrastructure', avatar: '⚙️' },
  { id: 7, name: 'Dr. Schmidt', role: 'Legal Expert', expertise: 'German Law', avatar: '⚖️' },
  { id: 8, name: 'Dr. Mueller', role: 'DSGVO Specialist', expertise: 'Data Protection', avatar: '🔐' },
  { id: 9, name: 'Dr. Weber', role: 'Criminal Law', expertise: 'StGB Expert', avatar: '📖' },
];

// Social Media Platforms
const PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: '#0A66C2' },
  { id: 'facebook', name: 'Facebook', icon: 'f', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F' },
];

export default function RiskAnalyzerElite() {
  const [postText, setPostText] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<number | null>(null);
  const [messages, setMessages] = useState<Array<{id: number, text: string, severity: string}>>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  // Example risky posts
  const examplePosts = [
    "Diese Politiker sind alle korrupt! Ich habe Beweise, dass sie Geld unterschlagen!",
    "Mein Chef ist so inkompetent. Morgen kündige ich und erzähle allen was hier wirklich läuft.",
    "Insider-Info: Unsere Firma wird nächste Woche massive Verluste bekannt geben. Verkauft eure Aktien!",
    "Diese Person ist ein Betrüger! Hier ihre private Adresse und Telefonnummer..."
  ];

  const analyzePost = async () => {
    if (!postText) return;
    
    setIsAnalyzing(true);
    setShowResults(false);
    setMessages([]);
    setShowVideo(true);
    
    // Simulate expert discussion
    const expertAnalysis = [
      { 
        delay: 500, 
        speaker: 6,
        text: "ACHTUNG! Ich detektiere potenzielle rechtliche Risiken!",
        severity: 'high'
      },
      {
        delay: 1500,
        speaker: 7,
        text: "§ 186 StGB - Üble Nachrede! Das könnte bis zu 2 Jahre Gefängnis bedeuten!",
        severity: 'critical'
      },
      {
        delay: 2500,
        speaker: 8,
        text: "DSGVO Artikel 5 - Personenbezogene Daten ohne Einwilligung! Bußgeld bis 20 Mio €!",
        severity: 'critical'
      },
      {
        delay: 3500,
        speaker: 2,
        text: "Cyber-Security Alert: Dieser Post könnte als Cybermobbing klassifiziert werden!",
        severity: 'high'
      },
      {
        delay: 4500,
        speaker: 1,
        text: "STRATEGISCHE EMPFEHLUNG: Post NICHT veröffentlichen! Umformulieren dringend empfohlen!",
        severity: 'warning'
      },
      {
        delay: 5500,
        speaker: 3,
        text: "KI-Analyse: 87% Wahrscheinlichkeit für rechtliche Konsequenzen. Alternative wird generiert...",
        severity: 'info'
      }
    ];

    // Calculate risk score
    const calculateRiskScore = () => {
      let score = 0;
      const riskWords = ['korrupt', 'Betrüger', 'inkompetent', 'Insider', 'private', 'Adresse', 'kündige', 'Geld', 'Verluste'];
      riskWords.forEach(word => {
        if (postText.toLowerCase().includes(word.toLowerCase())) {
          score += 15;
        }
      });
      return Math.min(score, 95);
    };

    // Play expert messages sequentially
    for (const analysis of expertAnalysis) {
      await new Promise(resolve => setTimeout(resolve, analysis.delay));
      setCurrentSpeaker(analysis.speaker);
      setMessages(prev => [...prev, {
        id: analysis.speaker,
        text: analysis.text,
        severity: analysis.severity
      }]);
    }

    const finalScore = calculateRiskScore();
    setRiskScore(finalScore);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      setCurrentSpeaker(null);
    }, 6500);
  };

  return (
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
      borderRadius: '24px',
      border: '1px solid rgba(255,255,255,0.1)',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '0.5rem'
        }}>
          🎖️ Elite Risk Analyzer
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>
          33 Elite Generals analyze your post in real-time
        </p>
      </div>

      {/* Platform Selection */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        justifyContent: 'center'
      }}>
        {PLATFORMS.map(platform => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            style={{
              padding: '1rem 2rem',
              background: selectedPlatform === platform.id 
                ? platform.color 
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{platform.icon}</span>
            <span style={{ fontSize: '1rem' }}>{platform.name}</span>
          </button>
        ))}
      </div>

      {/* Text Input */}
      <div style={{ marginBottom: '2rem' }}>
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Enter your post text here... (or choose an example below)"
          style={{
            width: '100%',
            minHeight: '150px',
            padding: '1rem',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1.1rem',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
        
        {/* Example Posts */}
        <div style={{ marginTop: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
            Try a risky example:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {examplePosts.map((example, i) => (
              <button
                key={i}
                onClick={() => setPostText(example)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(239,68,68,0.2)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
                }}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyzePost}
        disabled={!postText || isAnalyzing}
        style={{
          width: '100%',
          padding: '1.5rem',
          background: postText && !isAnalyzing
            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            : 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          cursor: postText && !isAnalyzing ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s',
          marginBottom: '2rem'
        }}
      >
        {isAnalyzing ? '🔄 Analyzing...' : '🚀 Simulate Post & Analyze Risks'}
      </button>

      {/* Video Simulation Area */}
      {showVideo && (
        <div style={{
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '2px solid rgba(99,102,241,0.3)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>
            📹 Live Simulation: Posting to {PLATFORMS.find(p => p.id === selectedPlatform)?.name}
          </h3>
          
          {/* Mock Social Media Post */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#000'
          }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                👤
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>John Doe</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>@johndoe · now</div>
              </div>
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{postText}</div>
          </div>

          {/* Expert Analysis Panel */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            padding: '1rem',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>
              🎖️ Elite Generals Discussion:
            </h4>
            <AnimatePresence>
              {messages.map((message, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: message.severity === 'critical' 
                      ? 'rgba(239,68,68,0.2)'
                      : message.severity === 'high'
                      ? 'rgba(251,191,36,0.2)'
                      : message.severity === 'warning'
                      ? 'rgba(251,146,60,0.2)'
                      : 'rgba(99,102,241,0.2)',
                    borderRadius: '8px',
                    border: `1px solid ${
                      message.severity === 'critical' 
                        ? 'rgba(239,68,68,0.3)'
                        : message.severity === 'high'
                        ? 'rgba(251,191,36,0.3)'
                        : 'rgba(99,102,241,0.3)'
                    }`
                  }}
                >
                  <div style={{ fontSize: '1.5rem' }}>
                    {ELITE_GENERALS[message.id - 1]?.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: '#8b5cf6',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      marginBottom: '0.25rem'
                    }}>
                      {ELITE_GENERALS[message.id - 1]?.name} - {ELITE_GENERALS[message.id - 1]?.role}
                    </div>
                    <div style={{ color: 'white' }}>
                      {message.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '2px solid rgba(239,68,68,0.3)',
            borderRadius: '16px',
            padding: '2rem'
          }}
        >
          <h3 style={{ 
            color: '#ef4444', 
            fontSize: '2rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            ⚠️ RISK ASSESSMENT COMPLETE
          </h3>
          
          {/* Risk Score */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: riskScore > 70 ? '#ef4444' : riskScore > 40 ? '#f59e0b' : '#10b981'
            }}>
              {riskScore}%
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>
              Legal Risk Score
            </div>
          </div>

          {/* Legal Consequences */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>
              ⚖️ Potential Legal Consequences:
            </h4>
            <ul style={{ color: 'rgba(255,255,255,0.8)', paddingLeft: '1.5rem' }}>
              <li>Criminal charges under § 186 StGB (Defamation)</li>
              <li>Civil lawsuit for damages</li>
              <li>GDPR violation fines up to €20 million</li>
              <li>Permanent criminal record</li>
              <li>Job termination and career damage</li>
            </ul>
          </div>

          {/* Safe Alternative */}
          <div style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '0.5rem' }}>
              ✅ Suggested Safe Alternative:
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              "I have concerns about certain practices I've observed. I believe in transparency 
              and would appreciate an open discussion about how we can improve together."
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
