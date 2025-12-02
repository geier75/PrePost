'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          timestamp: new Date().toISOString(),
          gdprConsent: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        
        // Log for GDPR compliance
        console.log('Password reset requested for:', email.substring(0, 3) + '***');
      } else {
        // Don't reveal if email exists (security best practice)
        setSuccess(true);
      }
    } catch (err) {
      setError('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '3rem',
          border: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.5rem',
            background: 'rgba(16,185,129,0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle size={32} style={{ color: '#10b981' }} />
          </div>
          
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            E-Mail gesendet!
          </h2>
          
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Falls ein Konto mit der E-Mail-Adresse <strong>{email}</strong> existiert, 
            haben wir Ihnen einen Link zum Zurücksetzen Ihres Passworts gesendet.
          </p>
          
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.875rem',
            marginBottom: '2rem'
          }}>
            Der Link ist aus Sicherheitsgründen nur 60 Minuten gültig.
          </p>
          
          <a
            href="/auth/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#8b5cf6',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={16} />
            Zurück zur Anmeldung
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '3rem',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem'
          }}>
            Passwort zurücksetzen
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleReset}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              E-Mail Adresse
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.4)'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '0.75rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '12px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} style={{ color: '#ef4444' }} />
              <span style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                E-Mail wird gesendet...
              </>
            ) : (
              'Link senden'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <a
            href="/auth/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#8b5cf6',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={16} />
            Zurück zur Anmeldung
          </a>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '2rem',
          padding: '0.75rem',
          background: 'rgba(99,102,241,0.05)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center'
        }}>
          Aus Sicherheitsgründen bestätigen wir nicht, ob eine E-Mail-Adresse 
          in unserem System registriert ist.
        </div>
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
