'use client';

import { useState } from 'react';
import { Check, X, Zap, Shield, Crown, Loader2 } from 'lucide-react';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Zap,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfekt zum Ausprobieren',
      color: 'rgba(107, 114, 128, 0.1)',
      borderColor: 'rgba(107, 114, 128, 0.3)',
      features: [
        { text: '10 Analysen pro Tag', included: true },
        { text: 'Basis-Risikoerkennung', included: true },
        { text: 'Standard Support', included: true },
        { text: 'SSL-Verschlüsselung', included: true },
        { text: 'DSGVO-konform', included: true },
        { text: 'Team-Funktionen', included: false },
        { text: 'API-Zugang', included: false },
        { text: 'Priority Support', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Shield,
      price: { monthly: 9.99, yearly: 99.99 },
      popular: true,
      description: 'Für professionelle Nutzer',
      color: 'rgba(139, 92, 246, 0.1)',
      borderColor: 'rgba(139, 92, 246, 0.5)',
      features: [
        { text: 'Unbegrenzte Analysen', included: true },
        { text: 'Erweiterte KI-Analyse', included: true },
        { text: 'Priority Support', included: true },
        { text: 'SSL-Verschlüsselung', included: true },
        { text: 'DSGVO-konform', included: true },
        { text: 'Export-Funktionen', included: true },
        { text: 'Analytics Dashboard', included: true },
        { text: 'API-Zugang', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      price: { monthly: 29.99, yearly: 299.99 },
      description: 'Für Teams & Unternehmen',
      color: 'rgba(251, 191, 36, 0.1)',
      borderColor: 'rgba(251, 191, 36, 0.3)',
      features: [
        { text: 'Alles aus Pro', included: true },
        { text: 'Team-Management', included: true },
        { text: 'API-Zugang', included: true },
        { text: 'Dedizierter Support', included: true },
        { text: 'Custom Branding', included: true },
        { text: 'Audit Logs', included: true },
        { text: 'SSO Integration', included: true },
        { text: 'SLA Garantie', included: true }
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    
    try {
      // Check if user is logged in
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        window.location.href = '/auth/login';
        return;
      }
      
      const user = JSON.parse(userStr);
      
      // TODO: Create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billingPeriod,
          userId: user.id,
          email: user.email,
          gdprConsent: true,
          timestamp: new Date().toISOString()
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert('Fehler beim Erstellen der Checkout-Session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Fehler beim Abonnieren');
    } finally {
      setLoading('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      padding: '4rem 2rem'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Wählen Sie Ihren Plan
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '2rem'
        }}>
          Starten Sie kostenlos und upgraden Sie jederzeit
        </p>
        
        {/* Billing Toggle */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '4px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={() => setBillingPeriod('monthly')}
            style={{
              padding: '0.5rem 1.5rem',
              background: billingPeriod === 'monthly' 
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Monatlich
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            style={{
              padding: '0.5rem 1.5rem',
              background: billingPeriod === 'yearly' 
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative'
            }}
          >
            Jährlich
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#10b981',
              color: 'white',
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '8px'
            }}>
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = plan.price[billingPeriod];
          
          return (
            <div
              key={plan.id}
              style={{
                background: plan.color,
                backdropFilter: 'blur(20px)',
                border: `2px solid ${plan.borderColor}`,
                borderRadius: '24px',
                padding: '2rem',
                position: 'relative',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                boxShadow: plan.popular ? '0 20px 60px rgba(139,92,246,0.3)' : 'none'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  BELIEBTESTE WAHL
                </div>
              )}
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <Icon size={32} style={{ color: '#8b5cf6' }} />
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {plan.name}
                </h3>
              </div>
              
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '1.5rem'
              }}>
                {plan.description}
              </p>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  €{price}
                </span>
                <span style={{
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.5)',
                  marginLeft: '0.5rem'
                }}>
                  /{billingPeriod === 'monthly' ? 'Monat' : 'Jahr'}
                </span>
              </div>
              
              {/* Features */}
              <ul style={{ marginBottom: '2rem' }}>
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                      color: feature.included 
                        ? 'rgba(255,255,255,0.9)' 
                        : 'rgba(255,255,255,0.4)'
                    }}
                  >
                    {feature.included ? (
                      <Check size={20} style={{ color: '#10b981' }} />
                    ) : (
                      <X size={20} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    )}
                    <span style={{
                      textDecoration: feature.included ? 'none' : 'line-through'
                    }}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              {/* Subscribe Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id || plan.id === 'free'}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: plan.id === 'free' 
                    ? 'rgba(255,255,255,0.1)'
                    : plan.popular
                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                      : 'rgba(255,255,255,0.05)',
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: plan.id === 'free' ? 'default' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Wird geladen...
                  </>
                ) : plan.id === 'free' ? (
                  'Aktueller Plan'
                ) : (
                  'Jetzt abonnieren'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div style={{
        marginTop: '4rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <span style={{
          padding: '8px 16px',
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '20px',
          fontSize: '0.875rem',
          color: '#10b981'
        }}>
          ✓ DSGVO konform
        </span>
        <span style={{
          padding: '8px 16px',
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '20px',
          fontSize: '0.875rem',
          color: '#8b5cf6'
        }}>
          ✓ SSL verschlüsselt
        </span>
        <span style={{
          padding: '8px 16px',
          background: 'rgba(251,191,36,0.1)',
          border: '1px solid rgba(251,191,36,0.3)',
          borderRadius: '20px',
          fontSize: '0.875rem',
          color: '#fbbf24'
        }}>
          ✓ Jederzeit kündbar
        </span>
      </div>

      {/* Back to Home */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <a
          href="/"
          style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          ← Zurück zur Startseite
        </a>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
