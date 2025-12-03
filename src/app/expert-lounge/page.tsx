'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginModal from '@/components/expert-lounge/LoginModal';
import { 
  Wifi, Send, LogIn, LogOut, Power, ChevronUp, ChevronDown,
  CheckCircle, User, Volume2, VolumeX
} from 'lucide-react';

const CHANNELS = [
  { id: 1, name: 'Twitter/X', logo: '𝕏', color: '#000000' },
  { id: 2, name: 'LinkedIn', logo: 'in', color: '#0A66C2' },
  { id: 3, name: 'Facebook', logo: 'f', color: '#1877F2' },
  { id: 4, name: 'Instagram', logo: '📷', color: '#E4405F' },
  { id: 5, name: 'TikTok', logo: '♪', color: '#000000' },
  { id: 6, name: 'Reddit', logo: 'R/', color: '#FF4500' },
  { id: 7, name: 'YouTube', logo: '▶', color: '#FF0000' },
  { id: 8, name: 'Telegram', logo: '✈', color: '#2AABEE' },
  { id: 9, name: 'PREPOST', logo: '🛡️', color: '#6366F1' }
];

export default function ExpertLoungeExact() {
  const [channel, setChannel] = useState(9);
  const [tvOn, setTvOn] = useState(true);
  const [muted, setMuted] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [postText, setPostText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  
  const currentCh = CHANNELS[channel - 1];
  const currentAcc = accounts.find(a => a.platform === currentCh.name);

  const handleLogin = (user: string, pass: string) => {
    setAccounts(prev => [...prev.filter(a => a.platform !== currentCh.name), 
      { platform: currentCh.name, username: user }
    ]);
    setShowLogin(false);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #F5F5F5 0%, #E0E0E0 100%)',
      }}
    >
      <div className="relative">
        {/* FERNSEHER - EXAKT WIE IM BILD */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mx-auto"
          style={{
            width: '500px',
            height: '350px',
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            borderRadius: '25px',
            padding: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* BILDSCHIRM */}
          <div 
            style={{
              width: '100%',
              height: '260px',
              background: tvOn ? '#000' : '#222',
              borderRadius: '15px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {tvOn && (
              <div className="h-full flex flex-col">
                {/* Channel Header */}
                <div 
                  className="p-3 border-b border-gray-800"
                  style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7))' }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentCh.logo}</span>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{currentCh.name}</h3>
                        {currentAcc ? (
                          <span className="text-xs text-green-400">@{currentAcc.username}</span>
                        ) : channel !== 9 && (
                          <span className="text-xs text-yellow-400">Login required</span>
                        )}
                      </div>
                    </div>
                    
                    {channel !== 9 && (
                      currentAcc ? (
                        <button
                          onClick={() => setAccounts(prev => prev.filter(a => a.platform !== currentCh.name))}
                          className="bg-red-600/80 hover:bg-red-600 px-2 py-1 rounded text-white text-xs"
                        >
                          Logout
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowLogin(true)}
                          className="bg-green-600/80 hover:bg-green-600 px-2 py-1 rounded text-white text-xs"
                        >
                          Login
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-3 text-white">
                  {channel === 9 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="bg-indigo-600/20 rounded-lg p-4 text-center">
                        <h3 className="text-sm font-bold mb-1">🛡️ PREPOST CENTER</h3>
                        <p className="text-xs opacity-80">Select channel 1-8 to post</p>
                      </div>
                    </div>
                  ) : !currentAcc ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="bg-black/50 rounded-lg p-4 text-center">
                        <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">Please login to {currentCh.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder="Write your post..."
                        className="flex-1 bg-white/10 text-white rounded p-2 text-xs resize-none
                                 placeholder-white/40 border border-white/20"
                        maxLength={280}
                      />
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => {
                            if (postText) {
                              setTimeout(() => {
                                setAnalysis({ safe: Math.random() > 0.3 });
                              }, 300);
                            }
                          }}
                          className="flex-1 bg-blue-600/80 hover:bg-blue-600 rounded py-1 text-xs"
                        >
                          Analyze
                        </button>
                        <button className="flex-1 bg-green-600/80 hover:bg-green-600 rounded py-1 text-xs">
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* TV KONTROLLEN */}
          <div className="flex justify-center gap-3 mt-3">
            <button
              onClick={() => setTvOn(!tvOn)}
              className={`w-10 h-10 rounded-full ${
                tvOn ? 'bg-red-600' : 'bg-green-600'
              } flex items-center justify-center`}
            >
              <Power className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={() => setChannel(prev => prev === 1 ? 9 : prev - 1)}
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
            
            <div className="px-3 py-2 bg-black rounded flex items-center">
              <span className="text-green-400 text-sm font-mono">CH {channel}</span>
            </div>
            
            <button
              onClick={() => setChannel(prev => prev === 9 ? 1 : prev + 1)}
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={() => setMuted(!muted)}
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"
            >
              {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>
          </div>
        </motion.div>

        {/* SOFA - EXAKT WIE IM BILD */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mx-auto mt-1"
          style={{
            width: '520px',
            height: '140px',
          }}
        >
          {/* Sofa Hauptteil */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '80px',
              background: 'linear-gradient(180deg, #FF8C00 0%, #E55100 100%)',
              borderRadius: '15px 15px 20px 20px',
              boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
            }}
          />
          
          {/* Sofa Rückenlehne */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              height: '80px',
              background: 'linear-gradient(180deg, #FFA500 0%, #FF8C00 100%)',
              borderRadius: '20px 20px 0 0',
            }}
          />
          
          {/* Sofa Kissen - 3 Stück nebeneinander */}
          <div className="absolute top-0 left-0 right-0 flex justify-center gap-1 px-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  width: '160px',
                  height: '75px',
                  background: 'linear-gradient(180deg, #FFB347 0%, #FFA500 100%)',
                  borderRadius: '15px',
                  marginTop: '5px',
                  boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.1)',
                }}
              />
            ))}
          </div>
          
          {/* Simpsons Familie */}
          <div className="absolute -top-2 left-0 right-0 flex justify-center gap-8">
            {['👨‍🦲', '👩‍🦱', '👦', '👧', '👶'].map((emoji, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -3 }}
                className="cursor-pointer"
              >
                <span className="text-4xl">{emoji}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Kleine Fernbedienung */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute -right-24 top-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-lg shadow-xl"
        >
          <p className="text-white text-xs mb-2 text-center">REMOTE</p>
          <div className="grid grid-cols-3 gap-1">
            {[1,2,3,4,5,6,7,8,9].map(num => (
              <button
                key={num}
                onClick={() => setChannel(num)}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
              >
                {num}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Login Modal */}
      <LoginModal
        channel={currentCh}
        onLogin={handleLogin}
        onClose={() => setShowLogin(false)}
        isOpen={showLogin}
      />
    </div>
  );
}
