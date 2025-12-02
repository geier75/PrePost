'use client';

import { 
  Sparkles,
  Bot,
  Globe,
  Brain,
  Rocket,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Bell,
  MessageSquare,
  Calendar
} from 'lucide-react';

export default function NextFeatures() {
  const comingSoon = [
    {
      icon: <Bot size={24} />,
      title: 'AI Content Writer',
      description: 'Generate optimized posts with our AI assistant',
      status: 'In Development',
      progress: 75,
      releaseDate: 'Q1 2025'
    },
    {
      icon: <Globe size={24} />,
      title: 'Multi-Language Support',
      description: 'Analyze posts in 50+ languages',
      status: 'Beta Testing',
      progress: 90,
      releaseDate: 'Dec 2024'
    },
    {
      icon: <Users size={24} />,
      title: 'Team Collaboration',
      description: 'Manage social media safety for your entire team',
      status: 'Planning',
      progress: 30,
      releaseDate: 'Q2 2025'
    },
    {
      icon: <Bell size={24} />,
      title: 'Smart Notifications',
      description: 'Real-time alerts for trending risky topics',
      status: 'In Development',
      progress: 60,
      releaseDate: 'Jan 2025'
    },
    {
      icon: <MessageSquare size={24} />,
      title: 'Comment Analyzer',
      description: 'Scan comments before replying',
      status: 'Research',
      progress: 15,
      releaseDate: 'Q3 2025'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Content Calendar',
      description: 'Schedule safe posts in advance',
      status: 'In Development',
      progress: 50,
      releaseDate: 'Feb 2025'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Beta Testing': return '#10b981';
      case 'In Development': return '#6366f1';
      case 'Planning': return '#f59e0b';
      case 'Research': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <section style={{
      padding: '6rem 2rem',
      background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05))',
      position: 'relative'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
            borderRadius: '9999px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(99,102,241,0.2)'
          }}>
            <Rocket size={16} style={{ color: '#8b5cf6' }} />
            <span style={{ 
              color: '#8b5cf6', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Roadmap 2025
            </span>
          </div>
          
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            Next Generation Features
          </h2>
          
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            We're constantly innovating to keep you safer on social media
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '2rem'
        }}>
          {comingSoon.map((feature, i) => (
            <div key={i} style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: `linear-gradient(135deg, ${getStatusColor(feature.status)}20, ${getStatusColor(feature.status)}10)`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getStatusColor(feature.status),
                    flexShrink: 0
                  }}>
                    {feature.icon}
                  </div>
                  
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '0.25rem'
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255,255,255,0.6)',
                      lineHeight: 1.5
                    }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div style={{
                  padding: '4px 10px',
                  background: `${getStatusColor(feature.status)}15`,
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  color: getStatusColor(feature.status),
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  border: `1px solid ${getStatusColor(feature.status)}30`
                }}>
                  {feature.status}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Progress
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    color: getStatusColor(feature.status),
                    fontWeight: '600'
                  }}>
                    {feature.progress}%
                  </span>
                </div>
                
                <div style={{
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${feature.progress}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${getStatusColor(feature.status)}, ${getStatusColor(feature.status)}CC)`,
                    borderRadius: '3px',
                    transition: 'width 1s ease-in-out',
                    boxShadow: `0 0 10px ${getStatusColor(feature.status)}40`
                  }} />
                </div>
              </div>
              
              {/* Release Date */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.875rem'
              }}>
                <Calendar size={14} />
                <span>Expected: {feature.releaseDate}</span>
              </div>
              
              {/* Decorative gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${getStatusColor(feature.status)}, transparent)`,
                opacity: 0.5
              }} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '4rem'
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '1.5rem',
            fontSize: '1.125rem'
          }}>
            Want to influence our roadmap?
          </p>
          
          <button style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
            color: '#8b5cf6',
            border: '1px solid rgba(99,102,241,0.3)',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))';
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))';
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
            e.currentTarget.style.transform = 'scale(1)';
          }}>
            <MessageSquare size={18} />
            Request a Feature
          </button>
        </div>
      </div>
    </section>
  );
}
