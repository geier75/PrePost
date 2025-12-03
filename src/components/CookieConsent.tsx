'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart, Settings } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if consent was already given
    const storedConsent = localStorage.getItem('cookieConsent');
    if (!storedConsent) {
      setShowBanner(true);
    } else {
      setConsent(JSON.parse(storedConsent));
    }
  }, []);

  const acceptAll = () => {
    const fullConsent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookieConsent', JSON.stringify(fullConsent));
    setConsent(fullConsent);
    setShowBanner(false);
    
    // Log consent for DSGVO compliance
    logConsent(fullConsent);
  };

  const acceptSelected = () => {
    const selectedConsent = {
      ...consent,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookieConsent', JSON.stringify(selectedConsent));
    setShowBanner(false);
    
    // Log consent for DSGVO compliance
    logConsent(selectedConsent);
  };

  const rejectAll = () => {
    const minimalConsent = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookieConsent', JSON.stringify(minimalConsent));
    setConsent(minimalConsent);
    setShowBanner(false);
    
    // Log consent for DSGVO compliance
    logConsent(minimalConsent);
  };

  const logConsent = async (consentData: any) => {
    // Send to backend for DSGVO documentation
    try {
      await fetch('/api/privacy/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent: consentData,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log consent:', error);
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Dark overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 9998
      }} />

      {/* Cookie Banner */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '800px',
        background: 'linear-gradient(135deg, rgba(26,26,46,0.98), rgba(22,33,62,0.98))',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)',
        zIndex: 9999,
        color: 'white'
      }}>
        {!showDetails ? (
          // Simple view
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
              <Cookie size={32} style={{ color: '#8b5cf6', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Cookie-Einstellungen
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                  Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Gemäß DSGVO haben Sie die 
                  volle Kontrolle über Ihre Daten. Technisch notwendige Cookies sind für den Betrieb 
                  der Website erforderlich.
                </p>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={() => setShowDetails(true)}
                style={{
                  background: 'transparent',
                  color: '#8b5cf6',
                  border: '1px solid #8b5cf6',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(139,92,246,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Settings size={16} />
                Einstellungen
              </button>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={rejectAll}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                >
                  Nur Notwendige
                </button>
                
                <button
                  onClick={acceptAll}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 25px rgba(99,102,241,0.3)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Alle Akzeptieren
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Detailed view
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Cookie-Einstellungen im Detail
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Cookie Categories */}
            <div style={{ marginBottom: '2rem' }}>
              {/* Necessary Cookies */}
              <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Shield size={20} style={{ color: '#10b981' }} />
                      <h4 style={{ fontWeight: '600' }}>Notwendige Cookies</h4>
                      <span style={{
                        background: '#10b981',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: '600'
                      }}>
                        IMMER AKTIV
                      </span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Erforderlich für Grundfunktionen der Website. Diese können nicht deaktiviert werden.
                    </p>
                    <ul style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                      <li>Session-Cookies</li>
                      <li>Sicherheits-Tokens</li>
                      <li>Spracheinstellungen</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Settings size={20} style={{ color: '#f59e0b' }} />
                      <h4 style={{ fontWeight: '600' }}>Funktionale Cookies</h4>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Verbessern die Benutzererfahrung durch erweiterte Funktionen.
                    </p>
                    <ul style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                      <li>Benutzereinstellungen speichern</li>
                      <li>Personalisierte Inhalte</li>
                    </ul>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                    <input
                      type="checkbox"
                      checked={consent.functional}
                      onChange={(e) => setConsent({ ...consent, functional: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: consent.functional ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                      borderRadius: '26px',
                      transition: '0.3s'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '20px',
                        width: '20px',
                        left: consent.functional ? '26px' : '3px',
                        bottom: '3px',
                        background: 'white',
                        borderRadius: '50%',
                        transition: '0.3s'
                      }} />
                    </span>
                  </label>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <BarChart size={20} style={{ color: '#3b82f6' }} />
                      <h4 style={{ fontWeight: '600' }}>Analyse-Cookies</h4>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Helfen uns zu verstehen, wie Besucher mit der Website interagieren.
                    </p>
                    <ul style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                      <li>PostHog Analytics (DSGVO-konform)</li>
                      <li>Anonymisierte Nutzungsstatistiken</li>
                    </ul>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                    <input
                      type="checkbox"
                      checked={consent.analytics}
                      onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: consent.analytics ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                      borderRadius: '26px',
                      transition: '0.3s'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '20px',
                        width: '20px',
                        left: consent.analytics ? '26px' : '3px',
                        bottom: '3px',
                        background: 'white',
                        borderRadius: '50%',
                        transition: '0.3s'
                      }} />
                    </span>
                  </label>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <BarChart size={20} style={{ color: '#ec4899' }} />
                      <h4 style={{ fontWeight: '600' }}>Marketing-Cookies</h4>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Werden verwendet, um Werbung relevanter zu gestalten.
                    </p>
                    <ul style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                      <li>Personalisierte Werbung</li>
                      <li>Conversion-Tracking</li>
                    </ul>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                    <input
                      type="checkbox"
                      checked={consent.marketing}
                      onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: consent.marketing ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                      borderRadius: '26px',
                      transition: '0.3s'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '20px',
                        width: '20px',
                        left: consent.marketing ? '26px' : '3px',
                        bottom: '3px',
                        background: 'white',
                        borderRadius: '50%',
                        transition: '0.3s'
                      }} />
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={rejectAll}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                Alle Ablehnen
              </button>
              
              <button
                onClick={acceptSelected}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                Auswahl Speichern
              </button>
            </div>

            {/* Legal Links */}
            <div style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center'
            }}>
              <a href="/privacy" style={{ color: '#8b5cf6', marginRight: '1rem' }}>Datenschutzerklärung</a>
              <a href="/impressum" style={{ color: '#8b5cf6' }}>Impressum</a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
