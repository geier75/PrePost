'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, ArrowLeft, CheckCircle, AlertTriangle, Shield, Instagram, Linkedin, Twitter, Facebook, Globe, MessageCircle } from 'lucide-react';
import Link from 'next/link';

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'reddit' | 'other';

const platforms = {
  facebook: { icon: Facebook, name: 'Facebook', color: '#1877f2' },
  instagram: { icon: Instagram, name: 'Instagram', color: '#e4405f' },
  twitter: { icon: Twitter, name: 'Twitter / X', color: '#000000' },
  linkedin: { icon: Linkedin, name: 'LinkedIn', color: '#0a66c2' },
  tiktok: { icon: MessageCircle, name: 'TikTok', color: '#000000' },
  reddit: { icon: MessageCircle, name: 'Reddit', color: '#ff4500' },
  other: { icon: Globe, name: 'Andere', color: '#6366f1' }
};

export default function AnalyzePage() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<Platform>('other');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          platform
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult(data.analysis);
      } else {
        console.error('Analysis failed:', data.error);
        setResult({
          score: 0,
          risk: 'error',
          safe: false,
          error: data.error || 'Analyse fehlgeschlagen'
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setResult({
        score: 0,
        risk: 'error',
        safe: false,
        error: 'Verbindungsfehler. Bitte versuchen Sie es erneut.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const PlatformIcon = platforms[platform].icon;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      position: 'relative'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes lavaFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
      
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse 600px 400px at 20% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 40%),
          radial-gradient(ellipse 500px 350px at 80% 30%, rgba(236, 72, 153, 0.3) 0%, transparent 40%),
          radial-gradient(ellipse 700px 500px at 50% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 40%)
        `,
        animation: 'lavaFlow 20s ease-in-out infinite',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

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
              fontSize: '2rem'
            }}>
              🛡️
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: '900', margin: 0 }}>PREPOST</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0 }}>AI-Powered Protection</p>
            </div>
          </Link>
          <Link href="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
            Dashboard
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', marginBottom: '1rem' }}>
              Content Analyse
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem' }}>
              KI-gestützte Risikoanalyse für {platforms[platform].name}
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '1.5rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', display: 'block' }}>
                Plattform wählen
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
                {(Object.keys(platforms) as Platform[]).map((p) => {
                  const Icon = platforms[p].icon;
                  return (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      style={{
                        padding: '0.75rem',
                        background: platform === p ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))' : 'rgba(255,255,255,0.05)',
                        border: platform === p ? '2px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Icon style={{ width: '1.5rem', height: '1.5rem' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{platforms[p].name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Schreibe deinen ${platforms[platform].name} Post hier...`}
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1.5rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '1rem',
                color: 'white',
                fontSize: '1rem',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '1.5rem'
              }}
            />

            <button
              onClick={handleAnalyze}
              disabled={!content.trim() || isAnalyzing}
              style={{
                width: '100%',
                padding: '1.25rem',
                background: isAnalyzing ? 'rgba(107,114,128,0.3)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '700',
                cursor: isAnalyzing || !content.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: !isAnalyzing && content.trim() ? '0 10px 30px rgba(99,102,241,0.4)' : 'none'
              }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 style={{ width: '1.5rem', height: '1.5rem', animation: 'spin 1s linear infinite' }} />
                  Analysiere Content...
                </>
              ) : (
                <>
                  <Sparkles style={{ width: '1.5rem', height: '1.5rem' }} />
                  Mit KI analysieren
                </>
              )}
            </button>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${result.risk === 'high' ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.5)'}`,
                borderRadius: '1.5rem',
                padding: '2rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'white' }}>Risiko-Bewertung</h2>
                <div style={{
                  textAlign: 'center',
                  padding: '1.5rem 2rem',
                  background: result.risk === 'high' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
                  borderRadius: '1rem',
                  border: `1px solid ${result.risk === 'high' ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`
                }}>
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: result.risk === 'high' ? '#ef4444' : '#10b981' }}>
                    {result.score}/100
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: result.risk === 'high' ? '#ef4444' : '#10b981' }}>
                    {result.risk === 'high' ? 'Hohes Risiko' : 'Niedriges Risiko'}
                  </div>
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                background: result.safe ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                borderRadius: '1rem',
                border: `1px solid ${result.safe ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                display: 'flex',
                alignItems: 'start',
                gap: '1rem'
              }}>
                {result.safe ? (
                  <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#10b981', flexShrink: 0 }} />
                ) : (
                  <AlertTriangle style={{ width: '1.5rem', height: '1.5rem', color: '#ef4444', flexShrink: 0 }} />
                )}
                <div>
                  <h3 style={{ fontWeight: '700', marginBottom: '0.5rem', color: result.safe ? '#10b981' : '#ef4444' }}>
                    {result.safe ? '✓ Sicher zu posten' : '🚨 Nicht empfohlen'}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', margin: 0 }}>
                    {result.safe 
                      ? 'Dein Content ist sicher. Du kannst ihn bedenkenlos posten.'
                      : 'Dieser Content birgt Risiken. Bitte überarbeiten oder nicht posten.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
