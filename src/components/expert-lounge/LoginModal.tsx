'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, LogIn, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

interface LoginModalProps {
  channel: {
    id: number;
    name: string;
    logo: string;
    color: string;
  };
  onLogin: (username: string, password: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function LoginModal({ channel, onLogin, onClose, isOpen }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Bitte alle Felder ausfüllen');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simuliere Login-Prozess
    setTimeout(() => {
      onLogin(username, password);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* TV-Style Login Box */}
            <div 
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(145deg, #2d3748, #1a202c)',
                border: '4px solid #000',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              }}
            >
              {/* Header mit Channel Info */}
              <div 
                className="p-6 text-white"
                style={{
                  background: `linear-gradient(135deg, ${channel.color}DD, ${channel.color}99)`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{channel.logo}</span>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {channel.name} Login
                    </h2>
                    <p className="text-sm opacity-90">
                      Verbinde dich mit deinem Account
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Username Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Benutzername
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder={`${channel.name} Username`}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Passwort
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-600/20 border border-red-600 rounded-lg text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verbinde...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Anmelden
                      </>
                    )}
                  </button>
                </div>

                {/* Help Text */}
                <p className="text-xs text-gray-500 text-center pt-2">
                  Deine Anmeldedaten werden sicher verschlüsselt übertragen
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
