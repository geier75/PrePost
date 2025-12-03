'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Story Timeline
const STORY_TIMELINE = {
  day1: {
    time: "Monday, 18:47",
    location: "At Home",
    mood: "😤 Frustrated",
    action: "Posts on LinkedIn"
  },
  day2: {
    time: "Tuesday, 09:15",
    location: "Office",
    mood: "😱 Shocked",
    consequence: "Called to HR"
  }
};

export default function ConsequenceSimulator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState<'intro' | 'posting' | 'next-day' | 'consequences' | 'with-prepost'>('intro');
  const [showNotification, setShowNotification] = useState(false);

  const startSimulation = () => {
    setIsPlaying(true);
    setCurrentScene('posting');
    runStory();
  };

  const runStory = async () => {
    // Scene 1: Posting
    setCurrentScene('posting');
    await delay(4000);
    
    // Scene 2: Next Day
    setCurrentScene('next-day');
    setShowNotification(true);
    await delay(4000);
    
    // Scene 3: Consequences
    setCurrentScene('consequences');
    await delay(5000);
    
    // Scene 4: With PREPOST
    setCurrentScene('with-prepost');
    await delay(5000);
    
    // Reset
    setIsPlaying(false);
    setCurrentScene('intro');
    setShowNotification(false);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      borderRadius: '24px',
      border: '2px solid rgba(99,102,241,0.3)',
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: '600px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <AnimatePresence mode="wait">
        {/* INTRO SCENE */}
        {currentScene === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '500px',
              textAlign: 'center'
            }}
          >
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              ⚠️ Real Story Simulation
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '3rem',
              maxWidth: '600px'
            }}>
              Watch what happens when Sarah posts about her boss without thinking...
            </p>
            
            <button
              onClick={startSimulation}
              style={{
                padding: '1.5rem 3rem',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none',
                borderRadius: '100px',
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 20px 40px rgba(239,68,68,0.4)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ▶️ Watch Sarah's Story
            </button>
          </motion.div>
        )}

        {/* SCENE 1: POSTING */}
        {currentScene === 'posting' && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            {/* Day 1 Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              padding: '1rem',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px'
            }}>
              <div>
                <h3 style={{ color: 'white', margin: 0 }}>📅 {STORY_TIMELINE.day1.time}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                  📍 {STORY_TIMELINE.day1.location} • {STORY_TIMELINE.day1.mood}
                </p>
              </div>
            </div>

            {/* Sarah's Profile */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                👩
              </div>
              <div>
                <h4 style={{ color: 'white', margin: 0 }}>Sarah Miller</h4>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Marketing Manager at TechCorp</p>
              </div>
            </div>

            {/* LinkedIn Post */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '1.5rem', color: '#0A66C2' }}>in</span>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>LinkedIn • Now</span>
              </div>
              
              {/* The Dangerous Post */}
              <div style={{
                color: '#000',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                marginBottom: '1rem'
              }}>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Had enough! My boss is completely incompetent and has no idea what he's doing. 
                  This company is a joke - they just lost a major client because of his stupid decisions. 
                  Can't wait to leave this toxic place! 🤮
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  style={{ marginTop: '1rem' }}
                >
                  #BadManagement #ToxicWorkplace #LookingForNewOpportunities
                </motion.p>
              </div>

              {/* Post Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                style={{
                  display: 'flex',
                  gap: '2rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e5e5'
                }}
              >
                <span style={{ color: '#666' }}>👍 0</span>
                <span style={{ color: '#666' }}>💬 0</span>
                <span style={{ color: '#666' }}>🔄 0</span>
              </motion.div>
            </div>

            {/* Sarah's Thought */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(139,92,246,0.1)',
                borderRadius: '12px',
                borderLeft: '4px solid #8b5cf6'
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                💭 "That felt good to get off my chest..."
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 2: NEXT DAY */}
        {currentScene === 'next-day' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Day 2 Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              padding: '1rem',
              background: 'rgba(239,68,68,0.1)',
              border: '2px solid rgba(239,68,68,0.3)',
              borderRadius: '12px'
            }}>
              <div>
                <h3 style={{ color: '#ef4444', margin: 0 }}>📅 {STORY_TIMELINE.day2.time}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                  📍 {STORY_TIMELINE.day2.location} • {STORY_TIMELINE.day2.mood}
                </p>
              </div>
            </div>

            {/* Phone Notification */}
            {showNotification && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring" }}
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                  borderRadius: '20px',
                  padding: '1rem',
                  width: '350px',
                  margin: '0 auto 2rem',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{
                  background: 'rgba(239,68,68,0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid rgba(239,68,68,0.3)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>📧</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'white', fontWeight: 'bold' }}>HR Department</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Just now</div>
                    </div>
                  </div>
                  <p style={{ color: 'white', margin: 0 }}>
                    "Please come to HR immediately. This is urgent."
                  </p>
                </div>

                {/* More notifications */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                >
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0 }}>
                    💼 Boss: "We need to talk."
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                >
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0 }}>
                    👥 LinkedIn: "Your post has 487 views"
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Sarah's Realization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              style={{
                textAlign: 'center',
                padding: '2rem',
                background: 'rgba(239,68,68,0.1)',
                borderRadius: '16px',
                border: '2px solid rgba(239,68,68,0.3)'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😰</div>
              <h3 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                "Oh no... what have I done?"
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                The entire company has seen the post. The CEO knows. HR is waiting.
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 3: CONSEQUENCES */}
        {currentScene === 'consequences' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center' }}
          >
            <h2 style={{
              color: '#ef4444',
              fontSize: '2.5rem',
              marginBottom: '2rem',
              textShadow: '0 4px 20px rgba(239,68,68,0.4)'
            }}>
              ⚠️ The Consequences
            </h2>

            {/* Consequence Cards */}
            <div style={{
              display: 'grid',
              gap: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {[
                { icon: '🚪', title: 'IMMEDIATE TERMINATION', desc: 'Fired for gross misconduct' },
                { icon: '💼', title: 'CAREER DAMAGE', desc: 'Blacklisted in the industry' },
                { icon: '⚖️', title: 'LEGAL ACTION', desc: 'Sued for defamation - €50,000' },
                { icon: '🔍', title: 'GOOGLE FOREVER', desc: 'Post screenshot lives online forever' },
                { icon: '💸', title: 'FINANCIAL RUIN', desc: 'No income, legal fees, no references' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'rgba(239,68,68,0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(239,68,68,0.3)'
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ color: '#ef4444', margin: 0 }}>{item.title}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total Impact */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))',
                borderRadius: '16px',
                border: '2px solid #ef4444'
              }}
            >
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>
                📊 Total Life Impact
              </h3>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#ef4444'
              }}>
                One angry post = Career destroyed in 24 hours
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 4: WITH PREPOST */}
        {currentScene === 'with-prepost' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <h2 style={{
              color: '#10b981',
              fontSize: '2.5rem',
              marginBottom: '2rem',
              textShadow: '0 4px 20px rgba(16,185,129,0.4)'
            }}>
              ✅ With PREPOST Protection
            </h2>

            {/* Alternative Timeline */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))',
              borderRadius: '16px',
              padding: '2rem',
              border: '2px solid #10b981',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              {/* PREPOST Alert */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(239,68,68,0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '2px solid #ef4444',
                  marginBottom: '1.5rem'
                }}
              >
                <h3 style={{ color: '#ef4444', margin: '0 0 0.5rem 0' }}>
                  🚨 PREPOST AI ALERT
                </h3>
                <p style={{ color: 'white', margin: '0 0 0.5rem 0' }}>
                  "This post contains career-ending content!"
                </p>
                <div style={{ fontSize: '2rem', color: '#fbbf24', fontWeight: 'bold' }}>
                  Risk Score: 96/100
                </div>
              </motion.div>

              {/* Safe Alternative */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  background: 'rgba(16,185,129,0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '2px solid #10b981'
                }}
              >
                <h4 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>
                  ✅ Safe Alternative Suggested:
                </h4>
                <p style={{ color: 'white', fontStyle: 'italic' }}>
                  "Reflecting on workplace dynamics and looking forward to constructive conversations 
                  about improving our processes. Open to new professional opportunities that align 
                  with my values. #GrowthMindset #ProfessionalDevelopment"
                </p>
              </motion.div>

              {/* Happy Ending */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px'
                }}
              >
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>
                  📅 Next Day Result:
                </h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2rem',
                  flexWrap: 'wrap'
                }}
              >
                  <span style={{ color: '#10b981' }}>✅ Job Secure</span>
                  <span style={{ color: '#10b981' }}>✅ Reputation Intact</span>
                  <span style={{ color: '#10b981' }}>✅ New Opportunities</span>
                </div>
              </motion.div>
            </div>

            {/* Final Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{
                marginTop: '2rem',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              🛡️ PREPOST - Your Career's Guardian Angel
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      {isPlaying && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem'
        }}>
          {['posting', 'next-day', 'consequences', 'with-prepost'].map(scene => (
            <div
              key={scene}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: currentScene === scene ? '#6366f1' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
