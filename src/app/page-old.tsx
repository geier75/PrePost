'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Sparkles,
  Zap,
  Brain,
  Lock,
  ArrowRight,
  Star,
  Globe2,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function UltraPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #fda085 75%, #f6d365 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        pointerEvents: 'none',
        transition: 'background 0.3s ease'
      }} />

      {/* Floating Orbs */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${200 + i * 50}px`,
            height: `${200 + i * 50}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,255,255,${0.1 - i * 0.01}) 0%, transparent 70%)`,
            left: `${i * 20}%`,
            top: `${i * 15}%`,
            animation: `float ${10 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '20px 40px',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea, #f093fb)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <Shield size={28} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>ThinkBeforePost</h1>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0
              }}>AI-Powered Protection</p>
            </div>
          </div>

          <button style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #f093fb, #f6d365)',
            border: 'none',
            borderRadius: '30px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
            opacity: isLoaded ? 1 : 0,
            transition: 'all 0.5s ease'
          }}>
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '100px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '30px',
            marginBottom: '30px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            opacity: isLoaded ? 1 : 0,
            transition: 'all 0.6s ease'
          }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
              🚀 50,000+ Professionals Trust Us Daily
            </span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: '900',
            color: 'white',
            marginBottom: '20px',
            lineHeight: 1.1,
            textShadow: '0 10px 40px rgba(0,0,0,0.3)',
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            opacity: isLoaded ? 1 : 0,
            transition: 'all 0.7s ease 0.1s'
          }}>
            Stop Career-Ending
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #f6d365 0%, #fda085 50%, #f093fb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Social Media Posts
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '800px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            opacity: isLoaded ? 1 : 0,
            transition: 'all 0.7s ease 0.2s'
          }}>
            AI analyzes your posts in <strong>87ms</strong> across <strong>12 risk dimensions</strong> 
            before they destroy your career. One click protection.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            opacity: isLoaded ? 1 : 0,
            transition: 'all 0.7s ease 0.3s'
          }}>
            <button style={{
              padding: '18px 40px',
              background: 'white',
              border: 'none',
              borderRadius: '60px',
              color: '#667eea',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              Start Free Trial
              <ArrowRight size={20} />
            </button>

            <button style={{
              padding: '18px 40px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              borderRadius: '60px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{
        padding: '80px 20px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {[
            {
              icon: <Brain size={32} />,
              title: 'Quantum AI Analysis',
              description: 'Neural networks analyze your content across 12 risk dimensions in real-time',
              gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
            },
            {
              icon: <Shield size={32} />,
              title: 'Risk Shield™',
              description: 'Military-grade protection against career-ending posts and PR disasters',
              gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
            },
            {
              icon: <Zap size={32} />,
              title: 'Lightning Fast',
              description: 'Sub-100ms analysis powered by edge computing and global CDN',
              gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
            },
            {
              icon: <Lock size={32} />,
              title: 'Privacy Vault',
              description: 'Zero-knowledge architecture with quantum-resistant encryption',
              gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)'
            },
            {
              icon: <Globe2 size={32} />,
              title: 'Multi-Platform',
              description: 'Works seamlessly across all major social media platforms',
              gradient: 'linear-gradient(135deg, #fa709a, #fee140)'
            },
            {
              icon: <Activity size={32} />,
              title: 'Risk Analytics',
              description: 'Track your risk profile over time with detailed insights',
              gradient: 'linear-gradient(135deg, #30cfd0, #330867)'
            }
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
                opacity: isLoaded ? 1 : 0,
                animationDelay: `${i * 0.1}s`
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: feature.gradient,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '12px'
              }}>{feature.title}</h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6
              }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '80px 20px',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          textAlign: 'center'
        }}>
          {[
            { value: '50K+', label: 'Active Users' },
            { value: '2M+', label: 'Posts Analyzed' },
            { value: '99.7%', label: 'Accuracy Rate' },
            { value: '<100ms', label: 'Response Time' }
          ].map((stat, i) => (
            <div key={i} style={{
              transform: isLoaded ? 'scale(1)' : 'scale(0.8)',
              opacity: isLoaded ? 1 : 0,
              transition: `all 0.5s ease ${i * 0.1}s`
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #f6d365, #fda085)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '10px'
              }}>{stat.value}</div>
              <div style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-50px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
