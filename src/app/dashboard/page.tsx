'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus,
  ArrowRight,
  Sparkles,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

// Social Media Platforms
const platforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: '#1877f2',
    connected: true,
    posts: 42
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: Twitter,
    color: '#000000',
    connected: true,
    posts: 156
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: '#e4405f',
    connected: true,
    posts: 89
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0a66c2',
    connected: true,
    posts: 34
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: MessageCircle,
    color: '#000000',
    connected: false,
    posts: 0
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: MessageCircle,
    color: '#ff4500',
    connected: false,
    posts: 0
  }
];

const mockRecentAnalyses = [
  {
    id: '1',
    content: 'Excited to announce our new product launch! 🚀',
    risk: 'none',
    platform: 'LinkedIn',
    platformColor: '#0a66c2',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2', 
    content: 'My thoughts on the new government policy...',
    risk: 'medium',
    platform: 'Twitter',
    platformColor: '#000000',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    content: 'Beautiful sunset today! 🌅 #nature',
    risk: 'none',
    platform: 'Instagram',
    platformColor: '#e4405f',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  }
];

export default function Dashboard() {
  const [user, setUser] = useState({ name: 'Max Mustermann', tier: 'pro' });
  const [timeOfDay, setTimeOfDay] = useState('');
  const [stats, setStats] = useState({
    weeklyAnalyses: 0,
    risksAvoided: 0,
    riskScore: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Guten Morgen');
    else if (hour < 18) setTimeOfDay('Guten Tag');
    else setTimeOfDay('Guten Abend');
    
    // Load stats from API
    const loadStats = async () => {
      try {
        const response = await fetch('/api/stats', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.stats) {
            setStats(data.stats);
            if (data.user) {
              setUser(data.user);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    loadStats();
  }, []);

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 1000 / 60);
    if (minutes < 60) return `vor ${minutes} Min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `vor ${hours}h`;
    const days = Math.floor(hours / 24);
    return `vor ${days}d`;
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative'
    }}>
      {/* LAVA LAMP BACKGROUND */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes lavaFlow {
          0% { background-position: 0% 50%, 100% 50%, 50% 50%; }
          33% { background-position: 100% 30%, 0% 60%, 50% 100%; }
          66% { background-position: 0% 60%, 100% 40%, 100% 0%; }
          100% { background-position: 0% 50%, 100% 50%, 50% 50%; }
        }
        @keyframes glossMove {
          0% { transform: translateX(-100%) scale(1); }
          50% { transform: translateX(50%) scale(1.2); }
          100% { transform: translateX(200%) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
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

      {/* Header */}
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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
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
          </Link>
          
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ color: '#a5b4fc', fontWeight: '600', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link href="/analyze" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Analysieren
            </Link>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>
                MM
              </div>
              <div>
                <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600' }}>{user.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                  {user.tier.toUpperCase()}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '3rem 2rem',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '3rem' }}
        >
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '900',
            color: 'white',
            marginBottom: '0.5rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            {timeOfDay}, {user.name.split(' ')[0]}! 👋
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.25rem'
          }}>
            Verwalte deine Social Media Posts sicher und effizient
          </p>
        </motion.div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {[
            { label: 'Analysen diese Woche', value: statsLoading ? '...' : stats.weeklyAnalyses, icon: '📊', color: '#3b82f6' },
            { label: 'Risiken vermieden', value: statsLoading ? '...' : stats.risksAvoided, icon: '🛡️', color: '#10b981' },
            { label: 'Dein Risiko-Score', value: statsLoading ? '...' : `${stats.riskScore}/100`, icon: '⚡', color: '#a855f7' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '1.5rem',
                padding: '2rem',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: stat.color
              }}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Media Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: '3rem' }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: 'white',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              Deine Social Media Kanäle
            </h2>
            <button style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '9999px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              transition: 'all 0.3s'
            }}>
              <Plus className="h-5 w-5" />
              Kanal hinzufügen
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {platforms.map((platform, i) => {
              const Icon = platform.icon;
              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  style={{
                    background: platform.connected 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                    backdropFilter: 'blur(20px)',
                    border: platform.connected 
                      ? '2px solid rgba(255,255,255,0.3)'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1.5rem',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    background: `${platform.color}33`,
                    opacity: 0.3,
                    filter: 'blur(20px)'
                  }} />
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        background: platform.color,
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 10px 25px ${platform.color}40`
                      }}>
                        <Icon style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
                      </div>
                      
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        background: platform.connected 
                          ? 'rgba(16,185,129,0.2)'
                          : 'rgba(107,114,128,0.2)',
                        border: platform.connected
                          ? '1px solid rgba(16,185,129,0.4)'
                          : '1px solid rgba(107,114,128,0.4)',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        color: platform.connected ? '#10b981' : '#9ca3af',
                        fontWeight: '600'
                      }}>
                        {platform.connected ? '✓ Verbunden' : 'Nicht verbunden'}
                      </div>
                    </div>
                    
                    <h3 style={{
                      color: 'white',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem'
                    }}>
                      {platform.name}
                    </h3>
                    
                    {platform.connected ? (
                      <div>
                        <p style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.875rem',
                          marginBottom: '1rem'
                        }}>
                          {platform.posts} Posts analysiert
                        </p>
                        <button style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          border: 'none',
                          borderRadius: '0.75rem',
                          color: 'white',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.3s'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/analyze?platform=${platform.id}`;
                        }}>
                          Post analysieren
                          <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>
                    ) : (
                      <button style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '0.75rem',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`${platform.name} verbinden - Coming soon!`);
                      }}>
                        Kanal verbinden
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(139,92,246,0.3)',
            borderRadius: '2rem',
            padding: '3rem',
            textAlign: 'center',
            marginBottom: '3rem'
          }}
        >
          <Sparkles style={{ width: '4rem', height: '4rem', color: '#a78bfa', margin: '0 auto 1rem', animation: 'float 3s ease-in-out infinite' }} />
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: 'white',
            marginBottom: '1rem'
          }}>
            Bereit für eine neue Analyse?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.125rem',
            marginBottom: '2rem'
          }}>
            Schütze deine Reputation mit KI-gestützter Risikoanalyse
          </p>
          <button style={{
            padding: '1.25rem 3rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '9999px',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s'
          }}
          onClick={() => window.location.href = '/analyze'}>
            <Plus style={{ width: '1.5rem', height: '1.5rem' }} />
            Neuen Post analysieren
            <ArrowRight style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </motion.div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: 'white',
            marginBottom: '1.5rem'
          }}>
            Letzte Analysen
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockRecentAnalyses.map((analysis, i) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '1.25rem',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => window.location.href = `/analyze/${analysis.id}`}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: analysis.platformColor,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  {analysis.platform === 'LinkedIn' ? '💼' : 
                   analysis.platform === 'Twitter' ? '🐦' : '📷'}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: analysis.risk === 'none' ? 'rgba(16,185,129,0.2)' : 'rgba(251,146,60,0.2)',
                      border: analysis.risk === 'none' ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(251,146,60,0.4)',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: analysis.risk === 'none' ? '#10b981' : '#fb923c'
                    }}>
                      {analysis.risk === 'none' ? '✓ Sicher' : '⚠️ Mittel'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                      {analysis.platform}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
                      {formatTimeAgo(analysis.timestamp)}
                    </span>
                  </div>
                  <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1rem',
                    margin: 0
                  }}>
                    {analysis.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
