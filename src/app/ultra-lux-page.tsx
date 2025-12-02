'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UltraLuxePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // WebGL Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsAuthenticated(true);
      setShowLogin(false);
      setIsLoading(false);
      // Redirect to Expert Lounge after login
      router.push('/expert-lounge');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{
      background: 'radial-gradient(ellipse at center, #0a0e27 0%, #000000 100%)',
    }}>
      {/* Ultra Luxury Video Background */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at ${50 + mousePos.x * 10}% ${50 + mousePos.y * 10}%, 
              rgba(99, 102, 241, 0.3) 0%, 
              transparent 40%
            ),
            radial-gradient(circle at ${50 - mousePos.x * 10}% ${50 - mousePos.y * 10}%, 
              rgba(236, 72, 153, 0.3) 0%, 
              transparent 40%
            ),
            radial-gradient(circle at 50% 50%, 
              rgba(139, 92, 246, 0.2) 0%, 
              transparent 60%
            )
          `,
          animation: 'pulse 10s ease-in-out infinite',
          filter: 'blur(40px)',
        }} />
        
        {/* WebGL Canvas for particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: 'screen', opacity: 0.5 }}
        />
        
        {/* Glossy overlay effect */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(180deg, 
              transparent 0%, 
              rgba(255,255,255,0.01) 50%, 
              transparent 100%
            )
          `,
          animation: 'shimmer 8s linear infinite',
        }} />
      </div>

      {/* Premium Glass Navigation */}
      <header className="relative z-50" style={{
        background: 'rgba(10, 14, 39, 0.3)',
        backdropFilter: 'blur(20px) saturate(200%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 50px rgba(0,0,0,0.5)',
      }}>
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 20px 40px rgba(99,102,241,0.4)',
              animation: 'float 3s ease-in-out infinite',
            }}>
              🛡️
            </div>
            <div>
              <h1 className="text-white text-3xl font-black tracking-tight">
                PREPOST
              </h1>
              <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold">
                Elite Protection System
              </p>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={() => setShowLogin(true)}
            className="relative group"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 3rem',
              borderRadius: '100px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 20px 40px rgba(99,102,241,0.4)',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(99,102,241,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.4)';
            }}
          >
            <span className="relative z-10">Elite Access</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 min-h-[calc(100vh-120px)] flex items-center justify-center px-8">
        <div className="text-center max-w-5xl">
          {/* Elite Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8" style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm font-bold tracking-wider">
              33 ELITE GENERALS ACTIVE • MILITARY GRADE PROTECTION
            </span>
          </div>

          {/* Main Title with 8K Ultra Glossy Effect */}
          <h1 className="mb-8" style={{
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            fontWeight: '900',
            lineHeight: '0.9',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            textShadow: `
              0 0 40px rgba(99,102,241,0.5),
              0 0 80px rgba(99,102,241,0.3),
              0 10px 40px rgba(0,0,0,0.5)
            `,
          }}>
            <span className="block text-white">Protect You</span>
            <span className="block mt-4" style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 25%, #6366f1 50%, #ec4899 75%, #6366f1 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 3s linear infinite',
            }}>
              From Social Media
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-xl mb-12 font-light tracking-wide">
            Our AI analyzes your posts in{' '}
            <span className="text-yellow-400 font-bold">real-time</span>
            {' '}to prevent career-ending mistakes
            <br />
            before they happen.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center">
            <button
              className="group relative px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                boxShadow: '0 20px 40px rgba(99,102,241,0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(99,102,241,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.4)';
              }}
            >
              Start Elite Trial →
            </button>
            
            <button
              className="px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              Watch Demo
            </button>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-8" style={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)',
        }}>
          <div className="relative w-full max-w-md" style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(20, 25, 55, 0.95) 100%)',
            backdropFilter: 'blur(20px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '32px',
            padding: '3rem',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>

            <h2 className="text-3xl font-black text-white mb-2">Elite Access</h2>
            <p className="text-white/60 mb-8">Enter your credentials to access the command center</p>

            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-bold mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                    placeholder="elite@prepost.ai"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-bold mb-2 uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all duration-500"
                style={{
                  background: isLoading 
                    ? 'rgba(99, 102, 241, 0.5)' 
                    : 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  color: 'white',
                  boxShadow: '0 20px 40px rgba(99,102,241,0.4)',
                  cursor: isLoading ? 'wait' : 'pointer',
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  'Access Command Center'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        
        @keyframes shimmer {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
