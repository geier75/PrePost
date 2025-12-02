'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          router.push('/dashboard');
        }
      } catch (err) {
        // Not authenticated, stay on login page
      }
    };
    checkAuth();
  }, [router]);

  // Real-time email validation
  const validateEmail = (value: string) => {
    setEmail(value);
    setEmailError('');
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Ungültige E-Mail-Adresse');
    }
  };

  // Real-time password validation
  const validatePassword = (value: string) => {
    setPassword(value);
    setPasswordError('');
    if (value && value.length > 0 && value.length < 8) {
      setPasswordError('Mindestens 8 Zeichen erforderlich');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    let hasError = false;

    if (!email.trim()) {
      setEmailError('E-Mail ist erforderlich');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ungültige E-Mail-Adresse');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Passwort ist erforderlich');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Passwort muss mindestens 8 Zeichen lang sein');
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password,
          rememberMe 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('✓ Login erfolgreich! Weiterleitung zum Dashboard...');
        
        // Store user data in localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Store remember me preference
          if (rememberMe) {
            localStorage.setItem('rememberEmail', email.trim().toLowerCase());
          } else {
            localStorage.removeItem('rememberEmail');
          }
        }
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1000);
      } else {
        // Handle specific error cases
        if (response.status === 401) {
          setError('Ungültige E-Mail oder Passwort');
        } else if (response.status === 429) {
          setError('Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.');
        } else {
          setError(data.error || 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.');
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

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
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            PREPOST
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Willkommen zurück
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.875rem',
              fontWeight: '600',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
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
                onChange={(e) => validateEmail(e.target.value)}
                placeholder="ihre@email.de"
                autoComplete="email"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${emailError ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  outline: 'none',
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  if (!emailError) {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                  }
                }}
                onBlur={(e) => {
                  if (!emailError) {
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
              />
            </div>
            {emailError && (
              <p style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.875rem',
              fontWeight: '600',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Passwort
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.4)'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => validatePassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem 3rem 0.75rem 3rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${passwordError ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  outline: 'none',
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  if (!passwordError) {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                  }
                }}
                onBlur={(e) => {
                  if (!passwordError) {
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  color: 'rgba(255,255,255,0.4)',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {passwordError}
              </p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                style={{ marginRight: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer' }}
              />
              Angemeldet bleiben
            </label>
            <a
              href="/auth/reset"
              style={{
                color: '#8b5cf6',
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'opacity 0.3s',
                pointerEvents: loading ? 'none' : 'auto',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
            >
              Passwort vergessen?
            </a>
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

          {/* Success Message */}
          {success && (
            <div style={{
              padding: '0.75rem',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '12px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={18} style={{ color: '#10b981' }} />
              <span style={{ color: '#86efac', fontSize: '0.875rem' }}>{success}</span>
            </div>
          )}

          {/* Login Button */}
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
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Anmeldung läuft...
              </>
            ) : (
              'Anmelden'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '2rem 0',
          gap: '1rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>oder</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Register Link */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.9rem',
          marginBottom: '1.5rem'
        }}>
          Noch kein Konto?{' '}
          <a
            href="/auth/register"
            style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Jetzt registrieren
          </a>
        </p>

        {/* GDPR Notice */}
        <div style={{
          padding: '1rem',
          background: 'rgba(99,102,241,0.05)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.75rem',
            lineHeight: 1.6,
            margin: 0
          }}>
            Mit der Anmeldung akzeptieren Sie unsere{' '}
            <a href="/terms" style={{ color: '#8b5cf6', textDecoration: 'none' }}>AGB</a>
            {' '}und{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'none' }}>Datenschutzerklärung</a>
          </p>
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
