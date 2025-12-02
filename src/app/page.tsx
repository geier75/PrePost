'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const Dashboard = dynamic(() => import('../components/Dashboard'), {
  ssr: false,
  loading: () => <div style={{ height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px' }} />
});

const RiskAnalyzer = dynamic(() => import('../components/ImprovedRiskAnalyzer'), {
  ssr: false,
  loading: () => <div style={{ height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px' }} />
});


const CookieConsent = dynamic(() => import('../components/CookieConsent'), {
  ssr: false
});

export default function WorkingPage() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative'
    }}>
      {/* LAVA LAMP ULTRA GLOSSY BACKGROUND */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes lavaFlow {
          0% {
            background-position: 0% 50%, 100% 50%, 50% 50%;
          }
          33% {
            background-position: 100% 30%, 0% 60%, 50% 100%;
          }
          66% {
            background-position: 0% 60%, 100% 40%, 100% 0%;
          }
          100% {
            background-position: 0% 50%, 100% 50%, 50% 50%;
          }
        }
        @keyframes glossMove {
          0% { transform: translateX(-100%) scale(1); }
          50% { transform: translateX(50%) scale(1.2); }
          100% { transform: translateX(200%) scale(1); }
        }
      `}} />
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse 600px 400px at 20% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 40%),
          radial-gradient(ellipse 500px 350px at 80% 30%, rgba(236, 72, 153, 0.3) 0%, transparent 40%),
          radial-gradient(ellipse 700px 500px at 50% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 40%),
          radial-gradient(ellipse 400px 600px at 30% 20%, rgba(251, 191, 36, 0.2) 0%, transparent 40%)
        `,
        backgroundSize: '200% 200%, 150% 150%, 180% 180%, 170% 170%',
        animation: 'lavaFlow 20s ease-in-out infinite',
        filter: 'blur(40px) contrast(1.2)',
        pointerEvents: 'none'
      }} />
      
      {/* Glossy overlay blob */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '-50%',
        width: '80%',
        height: '60%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 60%)',
        filter: 'blur(60px)',
        animation: 'glossMove 15s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 2
      }} />
      
      {/* Second glossy blob */}
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '-50%',
        width: '70%',
        height: '50%',
        background: 'radial-gradient(ellipse, rgba(147, 51, 234, 0.2) 0%, transparent 60%)',
        filter: 'blur(80px)',
        animation: 'glossMove 18s ease-in-out infinite reverse',
        pointerEvents: 'none',
        zIndex: 2
      }} />
      {/* Navigation Header */}
      <header style={{
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 10px 25px rgba(99,102,241,0.3)'
            }}>
              🛡️
            </div>
            <div>
              <h1 style={{ 
                color: 'white',
                fontSize: '1.75rem', 
                fontWeight: '900',
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                PREPOST
              </h1>
              <p style={{ 
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem',
                margin: 0,
                fontWeight: '600'
              }}>
                AI-Powered Protection
              </p>
            </div>
          </div>
          
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <button style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 10px 25px rgba(99,102,241,0.3)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(99,102,241,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(99,102,241,0.3)';
            }}
            onClick={() => window.location.href = '/auth/login'}>
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '8rem 2rem 6rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Premium background pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.02) 10px,
            rgba(255,255,255,0.02) 20px
          )`,
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1024px', margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '9999px',
            padding: '0.5rem 1.5rem',
            marginBottom: '2rem'
          }}>
            <span style={{ 
              color: 'white', 
              fontSize: '0.875rem',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              PREPOST • Trusted by 50,000+ professionals
            </span>
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            fontWeight: '900',
            color: 'white',
            lineHeight: '1.1',
            marginBottom: '1.5rem',
            textShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            Protect You
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block'
            }}>
              From Social Media
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.5rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem'
          }}>
            Our AI analyzes your posts in <strong style={{ color: '#fbbf24' }}>real-time</strong> to prevent 
            career-ending mistakes before they happen.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '1.25rem 3rem',
              borderRadius: '100px',
              fontSize: '1.125rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 14px 0 rgba(99,102,241,0.35), 0 1px 3px 0 rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => window.location.href = '/auth/register'}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(99,102,241,0.45), 0 2px 4px 0 rgba(0,0,0,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(99,102,241,0.35), 0 1px 3px 0 rgba(0,0,0,0.1)';
            }}>
              Start Free Trial
              <span style={{ fontSize: '1.25rem' }}>→</span>
            </button>
            
            <button style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s'
            }}
            onClick={() => window.location.href = '/expert-lounge'}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* ULTRA 8K GLOSSY 5D ADVERTISING BANNER */}
      <section style={{ 
        padding: '0',
        background: `
          linear-gradient(90deg, 
            #6366f1 0%, #8b5cf6 20%, #ec4899 40%, 
            #fbbf24 60%, #8b5cf6 80%, #6366f1 100%
          )`,
        backgroundSize: '300% 100%',
        animation: 'gradientShift 15s ease infinite',
        overflow: 'hidden',
        position: 'relative',
        height: '100px',
        boxShadow: `
          0 0 50px rgba(139, 92, 246, 0.8),
          0 0 100px rgba(236, 72, 153, 0.6),
          inset 0 0 50px rgba(255,255,255,0.1)
        `,
        borderTop: '2px solid rgba(255,255,255,0.3)',
        borderBottom: '2px solid rgba(255,255,255,0.3)'
      }}>
        {/* Glossy Overlay Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3
        }} />
        
        {/* Animated Light Beam */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation: 'lightBeam 5s linear infinite',
          pointerEvents: 'none',
          zIndex: 4
        }} />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          position: 'relative',
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}>
          {/* Scrolling Text Container */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes scrollLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes lightBeam {
              0% { left: -100%; }
              100% { left: 200%; }
            }
          `}} />
          <div style={{
            display: 'flex',
            animation: 'scrollLeft 40s linear infinite',
            whiteSpace: 'nowrap',
            willChange: 'transform'
          }}>
            {/* Duplicate the content for seamless scrolling */}
            {[...Array(4)].map((_, index) => (
              <div key={index} style={{
                display: 'flex',
                paddingRight: '4rem',
                alignItems: 'center',
                gap: '4rem'
              }}>
                <span style={{
                  fontSize: '2rem',
                  fontWeight: '900',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  padding: '0 2rem'
                }}>
                  ⚡ PROTECT BEFORE YOU POST
                </span>
                <span style={{
                  fontSize: '1.75rem',
                  color: '#fbbf24',
                  fontWeight: 'bold',
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  letterSpacing: '1px',
                  padding: '0 2rem'
                }}>
                  • LIMITED TIME: 50% OFF •
                </span>
                <span style={{
                  fontSize: '2rem',
                  fontWeight: '900',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  padding: '0 2rem'
                }}>
                  🛡️ AI-POWERED PROTECTION
                </span>
                <span style={{
                  fontSize: '1.75rem',
                  color: '#10b981',
                  fontWeight: 'bold',
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  letterSpacing: '1px',
                  padding: '0 2rem'
                }}>
                  • LAUNCHING NOW •
                </span>
                <span style={{
                  fontSize: '2rem',
                  fontWeight: '900',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  padding: '0 2rem'
                }}>
                  ✨ THINK BEFORE YOU POST
                </span>
                <span style={{
                  fontSize: '1.75rem',
                  color: '#ef4444',
                  fontWeight: 'bold',
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  letterSpacing: '1px',
                  padding: '0 2rem'
                }}>
                  • FREE TRIAL AVAILABLE •
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section style={{ 
        padding: '4rem 2rem',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            Try It Live
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.125rem',
            marginBottom: '2rem'
          }}>
            Experience the power of our AI in action
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '3rem'
          }}>
            <button
              onClick={() => {
                setShowAnalyzer(true);
                setShowDashboard(false);
              }}
              style={{
                padding: '1rem 2rem',
                background: showAnalyzer 
                  ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' 
                  : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🧠 Risk Analyzer
            </button>
            
            <button
              onClick={() => {
                setShowDashboard(true);
                setShowAnalyzer(false);
              }}
              style={{
                padding: '1rem 2rem',
                background: showDashboard 
                  ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' 
                  : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              📊 Live Dashboard
            </button>
          </div>
          
          {showAnalyzer && <RiskAnalyzer />}
          {showDashboard && <Dashboard />}
        </div>
      </section>


      {/* Features Grid */}
      <section id="features" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Enterprise-Grade Features
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                emoji: '🧠',
                title: 'AI Risk Analysis',
                description: 'Advanced neural networks scan your content across 12 risk categories',
                color: '#8b5cf6',
                imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop&q=90'
              },
              {
                emoji: '🛡️',
                title: 'Real-Time Protection',
                description: 'Instant warnings before you post something potentially damaging',
                color: '#ec4899',
                imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop&q=90'
              },
              {
                emoji: '⚡',
                title: 'Lightning Fast',
                description: 'Sub-100ms analysis powered by edge computing worldwide',
                color: '#f59e0b',
                imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop&q=90'
              },
              {
                emoji: '🔒',
                title: 'Zero-Knowledge Privacy',
                description: 'Your data is encrypted end-to-end with quantum-resistant algorithms',
                color: '#10b981',
                imageUrl: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&h=400&fit=crop&q=90'
              },
              {
                emoji: '🌍',
                title: 'Multi-Platform',
                description: 'Works with Facebook, Instagram, Twitter, LinkedIn, and more',
                color: '#3b82f6',
                imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=400&fit=crop&q=90'
              },
              {
                emoji: '📊',
                title: 'Risk Analytics',
                description: 'Track your posting patterns and improve over time',
                color: '#ef4444',
                imageUrl: 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=800&h=400&fit=crop&q=90'
              }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '24px',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))';
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(99,102,241,0.15), 0 15px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}>
                {/* Visual Header with Real Image */}
                <div style={{
                  height: '220px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#000'
                }}>
                  {/* Background Image */}
                  <img 
                    src={feature.imageUrl}
                    alt={feature.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.85,
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s',
                      transform: 'scale(1.05)'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'scale(1.15)';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.opacity = '0.85';
                    }}
                  />
                  
                  {/* Premium gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, 
                      transparent 0%, 
                      rgba(0,0,0,0.1) 50%, 
                      rgba(0,0,0,0.6) 85%, 
                      rgba(0,0,0,0.8) 100%)`,
                    pointerEvents: 'none'
                  }} />
                  
                  
                  {/* Category badge */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    Premium
                  </div>
                </div>
                
                <div style={{ padding: '0 2rem 2rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '0.75rem'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}>
                    {feature.description}
                  </p>
                  
                  {/* Learn More Button */}
                  <button style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '12px',
                    color: '#a5b4fc',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    width: '100%'
                  }}
                  onClick={() => window.location.href = '/analyze'}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                    e.currentTarget.style.color = '#a5b4fc';
                  }}>
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{
        padding: '6rem 2rem',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Simple, Transparent Pricing
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                name: 'Free',
                price: '€0',
                features: ['10 analyses/month', 'Basic risk detection', '2 social platforms'],
                color: '#6b7280'
              },
              {
                name: 'Pro',
                price: '€9.99',
                features: ['Unlimited analyses', 'Advanced AI', 'All platforms', 'Priority support'],
                color: '#8b5cf6',
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Team management', 'API access', 'Custom training', 'SLA guarantee'],
                color: '#ec4899'
              }
            ].map((plan, i) => (
              <div key={i} style={{
                background: plan.popular ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: plan.popular ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1rem',
                padding: '2rem',
                position: 'relative',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    MOST POPULAR
                  </div>
                )}
                
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: plan.color,
                  marginBottom: '0.5rem'
                }}>
                  {plan.name}
                </h3>
                
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '1.5rem'
                }}>
                  {plan.price}
                  {plan.price !== 'Custom' && <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>/month</span>}
                </div>
                
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                  {plan.features.map((feature, j) => (
                    <li key={j} style={{
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button style={{
                  width: '100%',
                  background: plan.popular 
                    ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' 
                    : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => window.location.href = '/auth/register'}
                onMouseEnter={e => {
                  if (!plan.popular) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  }
                }}
                onMouseLeave={e => {
                  if (!plan.popular) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {/* Legal Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <a href="/impressum" style={{ 
              color: 'rgba(255,255,255,0.7)', 
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
              Impressum
            </a>
            <a href="/privacy" style={{ 
              color: 'rgba(255,255,255,0.7)', 
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
              Datenschutz
            </a>
            <a href="/terms" style={{ 
              color: 'rgba(255,255,255,0.7)', 
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
              AGB
            </a>
            <button 
              onClick={() => {
                localStorage.removeItem('cookieConsent');
                window.location.reload();
              }}
              style={{ 
                color: 'rgba(255,255,255,0.7)', 
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
              Cookie-Einstellungen
            </button>
          </div>
          
          {/* Compliance Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              padding: '4px 12px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: '#10b981'
            }}>
              DSGVO Compliant
            </span>
            <span style={{
              padding: '4px 12px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: '#6366f1'
            }}>
              EU AI Act
            </span>
            <span style={{
              padding: '4px 12px',
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: '#8b5cf6'
            }}>
              ISO 27001
            </span>
          </div>
          
          {/* Copyright */}
          <p style={{ 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: '0.875rem',
            textAlign: 'center',
            margin: 0
          }}>
            © 2024 PREPOST GmbH. Alle Rechte vorbehalten. Made with ❤️ in Berlin.
          </p>
        </div>
      </footer>
      
      {/* Cookie Consent */}
      <CookieConsent />
      
      {/* CSS Animations */}
      <style jsx>{``}</style>
    </div>
  );
}
