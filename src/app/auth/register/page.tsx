'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    setPasswordStrength(strength);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.firstName || !formData.lastName) {
      setError('Bitte geben Sie Ihren vollständigen Namen ein');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Sie müssen die AGB und Datenschutzerklärung akzeptieren');
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with Clerk registration
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          gdprConsent: true,
          consentTimestamp: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse.');
        
        // Store initial user data
        localStorage.setItem('pendingVerification', JSON.stringify({
          email: formData.email,
          timestamp: new Date().toISOString()
        }));
        
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        setError(data.error || 'Registrierung fehlgeschlagen');
      }
    } catch (err) {
      setError('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '540px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '3rem',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Konto erstellen
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Starten Sie kostenlos mit PREPOST
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister}>
          {/* Name Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
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
                Vorname *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.4)'
                }} />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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

            <div>
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
                Nachname *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
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
              E-Mail Adresse *
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

          {/* Company Field (Optional) */}
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
              Unternehmen (optional)
            </label>
            <div style={{ position: 'relative' }}>
              <Building size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.4)'
              }} />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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

          {/* Password Field */}
          <div style={{ marginBottom: '1rem' }}>
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
              Passwort *
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
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  checkPasswordStrength(e.target.value);
                }}
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.25rem',
                  marginBottom: '0.25rem'
                }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        height: '3px',
                        borderRadius: '2px',
                        background: level <= passwordStrength
                          ? passwordStrength <= 2 ? '#ef4444'
                            : passwordStrength <= 3 ? '#f59e0b'
                            : '#10b981'
                          : 'rgba(255,255,255,0.1)'
                      }}
                    />
                  ))}
                </div>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: passwordStrength <= 2 ? '#fca5a5'
                    : passwordStrength <= 3 ? '#fcd34d'
                    : '#86efac'
                }}>
                  {passwordStrength === 0 ? 'Sehr schwach' :
                   passwordStrength === 1 ? 'Schwach' :
                   passwordStrength === 2 ? 'Mittel' :
                   passwordStrength === 3 ? 'Stark' :
                   passwordStrength === 4 ? 'Sehr stark' :
                   'Exzellent'}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
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
              Passwort bestätigen *
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
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

          {/* Terms & Newsletter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              marginBottom: '0.75rem'
            }}>
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                style={{ marginRight: '0.5rem', marginTop: '2px' }}
              />
              <span>
                Ich akzeptiere die <a href="/terms" style={{ color: '#8b5cf6' }}>AGB</a> und{' '}
                <a href="/privacy" style={{ color: '#8b5cf6' }}>Datenschutzerklärung</a> *
              </span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={formData.newsletter}
                onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                style={{ marginRight: '0.5rem' }}
              />
              Ich möchte Updates und Newsletter erhalten
            </label>
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

          {/* Register Button */}
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
                Konto wird erstellt...
              </>
            ) : (
              'Kostenlos registrieren'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.9rem'
        }}>
          Bereits ein Konto?{' '}
          <a
            href="/auth/login"
            style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Jetzt anmelden
          </a>
        </p>

        {/* GDPR Badge */}
        <div style={{
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            padding: '4px 12px',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '20px',
            fontSize: '0.7rem',
            color: '#10b981'
          }}>
            DSGVO konform
          </span>
          <span style={{
            padding: '4px 12px',
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '20px',
            fontSize: '0.7rem',
            color: '#8b5cf6'
          }}>
            SSL verschlüsselt
          </span>
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
