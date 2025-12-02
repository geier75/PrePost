'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react';

export default function Dashboard() {
  const [animatedStats, setAnimatedStats] = useState({
    analyzed: 0,
    prevented: 0,
    accuracy: 0,
    users: 0
  });

  useEffect(() => {
    // Animate numbers on mount
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        analyzed: Math.min(prev.analyzed + 50, 2487),
        prevented: Math.min(prev.prevented + 3, 147),
        accuracy: Math.min(prev.accuracy + 1, 99),
        users: Math.min(prev.users + 100, 50000)
      }));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '2rem',
      border: '1px solid rgba(255,255,255,0.1)',
      marginTop: '3rem'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <Activity size={32} style={{ color: '#fbbf24' }} />
        Live Analytics Dashboard
      </h2>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {[
          {
            label: 'Posts Analyzed Today',
            value: animatedStats.analyzed,
            icon: <BarChart3 />,
            color: '#3b82f6',
            suffix: ''
          },
          {
            label: 'Risks Prevented',
            value: animatedStats.prevented,
            icon: <Shield />,
            color: '#10b981',
            suffix: ''
          },
          {
            label: 'Accuracy Rate',
            value: animatedStats.accuracy,
            icon: <TrendingUp />,
            color: '#8b5cf6',
            suffix: '%'
          },
          {
            label: 'Active Users',
            value: animatedStats.users.toLocaleString(),
            icon: <Users />,
            color: '#ec4899',
            suffix: '+'
          }
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <span style={{
                color: stat.color,
                background: `${stat.color}20`,
                padding: '0.5rem',
                borderRadius: '12px',
                display: 'flex'
              }}>
                {stat.icon}
              </span>
              <Clock size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
            </div>
            
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.25rem'
            }}>
              {stat.value}{stat.suffix}
            </div>
            
            <div style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.6)'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Risk Categories */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem'
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
          <PieChart size={20} style={{ color: '#f59e0b' }} />
          Risk Categories Detected
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { category: 'Career Impact', percentage: 34, color: '#ef4444' },
            { category: 'Legal Issues', percentage: 22, color: '#f59e0b' },
            { category: 'Brand Damage', percentage: 18, color: '#8b5cf6' },
            { category: 'Privacy Breach', percentage: 15, color: '#3b82f6' },
            { category: 'Misinformation', percentage: 11, color: '#10b981' }
          ].map((risk, i) => (
            <div key={i}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.25rem'
              }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                  {risk.category}
                </span>
                <span style={{ color: risk.color, fontSize: '0.875rem', fontWeight: 'bold' }}>
                  {risk.percentage}%
                </span>
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${risk.percentage}%`,
                  background: risk.color,
                  borderRadius: '4px',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        padding: '1.5rem'
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
          <AlertTriangle size={20} style={{ color: '#ef4444' }} />
          Recent Risk Alerts
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { time: '2 min ago', platform: 'LinkedIn', risk: 'High', message: 'Post contains potentially career-damaging opinion' },
            { time: '15 min ago', platform: 'Twitter', risk: 'Medium', message: 'Tweet may violate company policy' },
            { time: '1 hour ago', platform: 'Facebook', risk: 'Low', message: 'Personal information exposure detected' }
          ].map((alert, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: alert.risk === 'High' ? '#ef4444' : alert.risk === 'Medium' ? '#f59e0b' : '#10b981',
                flexShrink: 0
              }} />
              
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.25rem'
                }}>
                  <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600' }}>
                    {alert.platform}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                    {alert.time}
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  {alert.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
