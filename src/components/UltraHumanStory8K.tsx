'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Ultra realistic human emotions
const EMOTIONS = {
  frustration: { color: '#fbbf24' },
  anger: { color: '#ef4444' },
  anxiety: { color: '#f59e0b' },
  regret: { color: '#8b5cf6' },
  relief: { color: '#10b981' }
};

export default function UltraHumanStory8K() {
  const [scene, setScene] = useState<'intro' | 'day1' | 'post' | 'morning' | 'meeting' | 'saved'>('intro');
  const [emotion, setEmotion] = useState(EMOTIONS.frustration);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 8K Cinematic particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = 600;
    
    const particles: any[] = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 14, 39, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${p.opacity})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const startStory = async () => {
    setIsPlaying(true);
    
    // Scene progression with optimal timing
    const scenes: Array<{ scene: any, emotion: any, duration: number }> = [
      { scene: 'day1', emotion: EMOTIONS.frustration, duration: 5500 },
      { scene: 'post', emotion: EMOTIONS.anger, duration: 6000 },
      { scene: 'morning', emotion: EMOTIONS.anxiety, duration: 5500 },
      { scene: 'meeting', emotion: EMOTIONS.regret, duration: 6000 },
      { scene: 'saved', emotion: EMOTIONS.relief, duration: 5500 }
    ];
    
    for (const { scene, emotion, duration } of scenes) {
      setScene(scene);
      setEmotion(emotion);
      await new Promise(resolve => setTimeout(resolve, duration));
    }
    
    setIsPlaying(false);
    setScene('intro');
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '600px',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      borderRadius: '32px',
      overflow: 'hidden',
      boxShadow: '0 50px 150px rgba(0,0,0,0.8), inset 0 0 120px rgba(99,102,241,0.1)'
    }}>
      {/* 8K Background */}
      <canvas ref={canvasRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.6
      }} />
      
      {/* Cinematic Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none'
      }} />
      
      {/* Film Grain */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
        pointerEvents: 'none',
        mixBlendMode: 'overlay'
      }} />


      <div style={{ position: 'relative', zIndex: 5, padding: '3rem' }}>
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {scene === 'intro' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >

              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                color: 'white',
                marginBottom: '1rem',
                textShadow: '0 20px 60px rgba(99,102,241,0.4)'
              }}>
                The Real Story of Sarah
              </h1>
              <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                How a moment of frustration almost cost everything - Based on true events
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startStory}
                style={{
                  padding: '1.5rem 3rem',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: '100px',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 30px 60px rgba(99,102,241,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                ▶ Experience Her Story
              </motion.button>
            </motion.div>
          )}

          {/* DAY 1 - Bad Day */}
          {scene === 'day1' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                Monday, 6:47 PM - After Work
              </h2>
              <div style={{
                background: 'rgba(251,191,36,0.1)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(251,191,36,0.3)',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Today's Reality:</h3>
                <ul style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 2 }}>
                  <li>Budget cuts: Marketing lost 30% funding</li>
                  <li>Team meeting: Tense discussion about priorities</li>
                  <li>Email from boss: "We need better results"</li>
                  <li>Colleague got the lead on new project</li>
                </ul>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1rem', fontStyle: 'italic' }}>
                  Sarah feels undervalued after 5 years of dedication...
                </p>
              </div>
            </motion.div>
          )}

          {/* THE POST */}
          {scene === 'post' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                7:23 PM - Writing on LinkedIn
              </h2>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '650px',
                margin: '0 auto',
                boxShadow: '0 30px 80px rgba(0,0,0,0.4)'
              }}>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  style={{ color: '#000', fontSize: '1.1rem', lineHeight: 1.8 }}
                >
                  "When leadership fails to recognize talent and makes decisions based on politics 
                  rather than merit, it's no wonder projects fail. Some of us actually care about 
                  the work, not just playing games. #OpenToOpportunities"
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  style={{ marginTop: '1.5rem', textAlign: 'right' }}
                >
                  <button style={{
                    background: '#0A66C2',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '24px',
                    fontWeight: 'bold'
                  }}>
                    Post
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* MORNING REALIZATION */}
          {scene === 'morning' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                Tuesday Morning - The Notifications
              </h2>
              <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                {[
                  { from: 'LinkedIn', text: '47 people viewed your post', icon: '👁️' },
                  { from: 'Tom (Colleague)', text: 'Hey, everything OK?', icon: '💬' },
                  { from: 'HR', text: 'Can we have a quick chat this morning?', icon: '📧' }
                ].map((notif, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.5, duration: 0.5 }}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      gap: '1rem'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{notif.icon}</span>
                    <div>
                      <div style={{ color: 'white', fontWeight: 'bold' }}>{notif.from}</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)' }}>{notif.text}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* THE MEETING */}
          {scene === 'meeting' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ color: '#fbbf24', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                The Realistic Consequences
              </h2>
              <div style={{
                background: 'rgba(251,191,36,0.1)',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>What Actually Happened:</h3>
                <ul style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 2 }}>
                  <li>📝 Written warning from HR for unprofessional conduct</li>
                  <li>😔 Awkward relationship with boss and team</li>
                  <li>🚫 Removed from new project opportunities</li>
                  <li>📉 Performance review affected</li>
                  <li>💭 Reputation as "difficult" in the company</li>
                </ul>
                <p style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '1rem',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  <strong>Result:</strong> Sarah's career at TechCorp is effectively over. 
                  She'll need to find a new job with this incident on her record.
                </p>
              </div>
            </motion.div>
          )}

          {/* WITH PREPOST */}
          {scene === 'saved' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                If Sarah Had Used PREPOST
              </h2>
              <div style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))',
                borderRadius: '16px',
                padding: '2rem',
                border: '2px solid #10b981',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  style={{
                    background: 'rgba(239,68,68,0.2)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}
                >
                  <h4 style={{ color: '#ef4444' }}>🚨 PREPOST Alert</h4>
                  <p style={{ color: 'white' }}>
                    "This post could damage professional relationships. Risk: 78/100"
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    background: 'rgba(16,185,129,0.2)',
                    borderRadius: '12px',
                    padding: '1rem'
                  }}
                >
                  <h4 style={{ color: '#10b981' }}>✅ Safe Alternative:</h4>
                  <p style={{ color: 'white', fontStyle: 'italic' }}>
                    "Excited to explore new challenges and bring my 5 years of marketing expertise 
                    to innovative projects. Open to connecting with forward-thinking teams! 
                    #MarketingProfessional #OpenToOpportunities"
                  </p>
                </motion.div>

                <div style={{ marginTop: '1.5rem', color: 'white' }}>
                  <strong>Real Outcome:</strong> Three recruiters reached out, 
                  Sarah negotiated a promotion to stay, relationship with boss improved through honest conversation.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
