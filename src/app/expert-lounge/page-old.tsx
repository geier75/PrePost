'use client';

/**
 * PREPOST Expert Lounge - PERFEKTE SIMPSONS TV EXPERIENCE
 * Mit Login-System für jeden Kanal und exaktem Simpsons Design!
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SimpsonsTV from '@/components/expert-lounge/SimpsonsTV';
import LoginModal from '@/components/expert-lounge/LoginModal';
import { 
  Wifi, Send, Check, AlertCircle, Loader2, LogIn, LogOut,
  CheckCircle, User, Activity, TrendingUp, Shield
} from 'lucide-react';

// TV Kanäle mit Auth Requirements
const TV_CHANNELS = [
  { id: 1, name: 'Twitter/X', logo: '𝕏', color: '#000000', requiresAuth: true },
  { id: 2, name: 'LinkedIn', logo: 'in', color: '#0A66C2', requiresAuth: true },
  { id: 3, name: 'Facebook', logo: 'f', color: '#1877F2', requiresAuth: true },
  { id: 4, name: 'Instagram', logo: '📷', color: '#E4405F', requiresAuth: true },
  { id: 5, name: 'TikTok', logo: '♪', color: '#000000', requiresAuth: true },
  { id: 6, name: 'Reddit', logo: 'R/', color: '#FF4500', requiresAuth: true },
  { id: 7, name: 'YouTube', logo: '▶', color: '#FF0000', requiresAuth: true },
  { id: 8, name: 'Telegram', logo: '✈', color: '#2AABEE', requiresAuth: true },
  { id: 9, name: 'PREPOST', logo: '🛡️', color: '#6366F1', requiresAuth: false }
];

// User Account Type
interface UserAccount {
  platform: string;
  username: string;
  isLoggedIn: boolean;
  profilePic?: string;
}

export default function ExpertLoungePerfect() {
  const [currentChannel, setCurrentChannel] = useState(9);
  const [tvOn, setTvOn] = useState(false);
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [showStatic, setShowStatic] = useState(false);
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);
  const [postText, setPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  // Authentication State
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const currentChannelData = TV_CHANNELS[currentChannel - 1];
  const currentAccount = userAccounts.find(acc => acc.platform === currentChannelData?.name);

  // Simpsons Familie
  const simpsonsFamily = [
    { name: 'Homer', emoji: '👨', speech: 'Mmm... Social Media!', color: '#FFD700' },
    { name: 'Marge', emoji: '👩', speech: 'Oh my!', color: '#0066CC' },
    { name: 'Bart', emoji: '👦', speech: 'Ay, caramba!', color: '#FF6B35' },
    { name: 'Lisa', emoji: '👧', speech: 'Actually...', color: '#FF69B4' },
    { name: 'Maggie', emoji: '👶', speech: '*suck*', color: '#87CEEB' },
  ];

  // Handle TV Power
  const handleTvPower = () => {
    if (!tvOn) {
      setShowStatic(true);
      setTimeout(() => {
        setTvOn(true);
        setShowStatic(false);
      }, 500);
    } else {
      setTvOn(false);
    }
  };

  // Handle Login
  const handleLogin = (username: string, password: string) => {
    const newAccount: UserAccount = {
      platform: currentChannelData.name,
      username,
      isLoggedIn: true,
      profilePic: '👤'
    };
    
    setUserAccounts(prev => [
      ...prev.filter(acc => acc.platform !== currentChannelData.name),
      newAccount
    ]);
    
    setShowLoginModal(false);
  };

  // Handle Logout
  const handleLogout = () => {
    setUserAccounts(prev => 
      prev.filter(acc => acc.platform !== currentChannelData.name)
    );
  };

  // Post analysieren
  const analyzePost = async () => {
    if (!postText) return;
    
    setIsPosting(true);
    setAnalysisResult(null);
    
    // Simuliere AI Analyse
    setTimeout(() => {
      const riskScore = Math.random() * 100;
      const isSafe = riskScore < 30;
      
      setAnalysisResult({
        safe: isSafe,
        risk: Math.floor(riskScore),
        suggestion: isSafe 
          ? 'Dieser Post sieht gut aus!' 
          : 'Überdenke die Formulierung - könnte missverstanden werden.'
      });
      setIsPosting(false);
    }, 1500);
  };

  // Post senden
  const sendPost = async () => {
    if (!postText) return;
    
    setIsPosting(true);
    
    // Simuliere Post
    setTimeout(() => {
      setPostSuccess(true);
      setIsPosting(false);
      
      // Reset nach 2 Sekunden
      setTimeout(() => {
        setPostText('');
        setPostSuccess(false);
        setAnalysisResult(null);
      }, 2000);
    }, 1000);
  };

  const changeChannel = (direction: 'up' | 'down' | number) => {
    setShowStatic(true);
    setPostText('');
    setAnalysisResult(null);
    setPostSuccess(false);
    
    setTimeout(() => {
      if (typeof direction === 'number') {
        setCurrentChannel(direction);
      } else {
        setCurrentChannel(prev => {
          if (direction === 'up') return prev === 9 ? 1 : prev + 1;
          return prev === 1 ? 9 : prev - 1;
        });
      }
      setShowStatic(false);
    }, 200);
  };

  const currentChannelData = TV_CHANNELS[currentChannel - 1];

  return (
    <div 
      className="min-h-screen overflow-hidden relative"
      style={{
        background: `linear-gradient(to bottom, 
          #FFD700 0%, 
          #FFA500 30%, 
          #FF8C00 60%, 
          #8B4513 100%
        )`,
      }}
    >
      {/* WOHNZIMMER WÄNDE */}
      <div className="absolute inset-0">
        {/* Rückwand mit Tapete */}
        <div 
          className="absolute top-0 left-0 right-0 h-3/4"
          style={{
            background: `
              repeating-linear-gradient(
                90deg,
                #FFD700,
                #FFD700 50px,
                #FFA500 50px,
                #FFA500 100px
              )
            `,
            borderBottom: '10px solid #8B4513',
          }}
        >
          {/* Bilder an der Wand */}
          <div className="absolute top-10 left-10 flex gap-6">
            {['🖼️', '🏆', '🎨'].map((item, i) => (
              <motion.div
                key={i}
                className="bg-amber-800 p-3 rounded-lg shadow-2xl"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                style={{ transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)` }}
              >
                <div className="bg-white p-6 rounded">
                  <span className="text-5xl">{item}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* DUFF Bier Poster */}
          <div className="absolute top-10 right-10">
            <motion.div
              className="bg-red-600 text-white p-8 rounded-xl shadow-2xl font-bold text-4xl"
              animate={{ rotate: [0, -2, 2, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              DUFF 🍺
            </motion.div>
          </div>

          {/* Uhr */}
          <div className="absolute top-1/2 right-10 -translate-y-1/2">
            <div className="bg-white rounded-full w-24 h-24 shadow-2xl flex items-center justify-center">
              <span className="text-3xl">🕐</span>
            </div>
          </div>
        </div>

        {/* FUSSBODEN */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/4"
          style={{
            background: `linear-gradient(to bottom, #8B4513, #654321)`,
            borderTop: '2px solid #5D4037',
          }}
        >
          {/* Teppich */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full"
            style={{
              background: `
                repeating-linear-gradient(
                  45deg,
                  #DC143C,
                  #DC143C 20px,
                  #8B0000 20px,
                  #8B0000 40px
                )
              `,
              opacity: 0.6,
              borderRadius: '50% / 20%',
            }}
          />
        </div>
      </div>

      {/* HAUPTMÖBEL */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        
        {/* DER GROSSE RÖHRENFERNSEHER */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 1 }}
        >
          {/* TV Gehäuse */}
          <div 
            className="relative"
            style={{
              width: '650px',
              height: '520px',
              background: 'linear-gradient(135deg, #4a4a4a, #2a2a2a, #1a1a1a)',
              borderRadius: '30px',
              boxShadow: `
                0 20px 60px rgba(0,0,0,0.8),
                inset 0 -10px 30px rgba(0,0,0,0.5),
                inset 0 10px 20px rgba(255,255,255,0.1)
              `,
            }}
          >
            {/* TV Rahmen Dekoration */}
            <div className="absolute -top-4 -left-4 -right-4 -bottom-4 border-8 border-gray-700 rounded-3xl opacity-50" />
            
            {/* Lautsprecher-Gitter */}
            <div className="absolute bottom-4 left-4 right-4 h-8">
              <div 
                className="h-full rounded-lg"
                style={{
                  background: `repeating-linear-gradient(
                    90deg,
                    #333 0px,
                    #333 2px,
                    #111 2px,
                    #111 4px
                  )`,
                }}
              />
            </div>

            {/* BILDSCHIRM - SIMPSONS STYLE */}
            <div 
              className="absolute top-6 left-6 right-6"
              style={{
                height: '420px',
                background: tvOn 
                  ? `linear-gradient(180deg, #1a1a2e 0%, #000 100%)`
                  : '#333',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: `
                  inset 0 0 50px rgba(0,0,0,0.9),
                  inset 0 0 100px rgba(99,102,241,0.1)
                `,
                border: '3px solid #222',
              }}
            >
              {/* CRT Scanlines Effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.3) 2px,
                    rgba(0,0,0,0.3) 4px
                  )`,
                  opacity: 0.4,
                }}
              />
              
              {/* Bildröhren-Krümmung */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(
                    ellipse at center,
                    transparent 0%,
                    rgba(0,0,0,0.2) 70%,
                    rgba(0,0,0,0.5) 100%
                  )`,
                }}
              />

              {tvOn && (
                <>
                  {/* TV Static */}
                  {showStatic && (
                    <motion.div
                      className="absolute inset-0 z-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        background: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                      }}
                    />
                  )}

                  {/* TV INHALT - POSTING INTERFACE */}
                  <div 
                    className="absolute inset-0 flex flex-col text-white"
                    style={{ 
                      backgroundColor: currentChannelData.color + '15',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    {/* TV Kanal Header - Simpsons Style */}
                    <div 
                      className="p-4 border-b-4 border-black"
                      style={{
                        background: `linear-gradient(90deg, 
                          ${currentChannelData.color}CC 0%, 
                          ${currentChannelData.color}99 100%
                        )`,
                        boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <motion.span 
                            className="text-5xl"
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {currentChannelData.logo}
                          </motion.span>
                          <div>
                            <h2 className="text-2xl font-bold drop-shadow-lg">
                              {currentChannelData.name}
                            </h2>
                            <p className="text-xs opacity-90">CH-{currentChannel}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse">
                            <Wifi className="w-5 h-5 text-green-400" />
                          </div>
                          <span className="text-green-400 font-bold animate-pulse">● LIVE</span>
                        </div>
                      </div>
                    </div>

                    {/* HAUPTBEREICH - POST ERSTELLEN */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      {currentChannel === 9 ? (
                        // PREPOST Command Center
                        <div className="h-full flex flex-col justify-center">
                          <motion.div 
                            className="bg-gradient-to-br from-indigo-600/80 to-purple-600/80 rounded-xl p-6 shadow-2xl"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h3 className="text-2xl font-bold mb-4 text-center">
                              🛡️ PREPOST COMMAND CENTER
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-black/30 rounded-lg p-3">
                                <Activity className="w-6 h-6 mb-1" />
                                <div className="text-2xl font-bold">5.5M</div>
                                <div className="text-xs">Analyzed</div>
                              </div>
                              <div className="bg-black/30 rounded-lg p-3">
                                <AlertTriangle className="w-6 h-6 mb-1" />
                                <div className="text-2xl font-bold">14.5K</div>
                                <div className="text-xs">Risks</div>
                              </div>
                              <div className="bg-black/30 rounded-lg p-3">
                                <TrendingUp className="w-6 h-6 mb-1" />
                                <div className="text-2xl font-bold">289</div>
                                <div className="text-xs">Alerts</div>
                              </div>
                              <div className="bg-black/30 rounded-lg p-3">
                                <Radio className="w-6 h-6 mb-1" />
                                <div className="text-2xl font-bold">99.7%</div>
                                <div className="text-xs">Safe</div>
                              </div>
                            </div>
                            <p className="text-sm mt-4 text-center opacity-90">
                              Wähle einen Kanal (1-8) um zu posten!
                            </p>
                          </motion.div>
                        </div>
                      ) : (
                        // POST INTERFACE FÜR PLATTFORM
                        <div className="h-full flex flex-col">
                          {/* Post Eingabebereich */}
                          <div className="flex-1">
                            <div className="bg-black/40 backdrop-blur rounded-xl p-4 h-full flex flex-col">
                              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <Send className="w-5 h-5" />
                                Post auf {currentChannelData.name}
                              </h3>
                              
                              {/* Textarea */}
                              <textarea
                                ref={textareaRef}
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                placeholder={`Was möchtest du auf ${currentChannelData.name} posten?`}
                                className="flex-1 bg-white/10 text-white rounded-lg p-3 resize-none
                                         placeholder-white/50 border-2 border-white/20 
                                         focus:border-white/50 focus:outline-none"
                                maxLength={280}
                              />
                              
                              {/* Character Count */}
                              <div className="mt-2 text-xs text-right opacity-75">
                                {postText.length}/280 Zeichen
                              </div>

                              {/* Analyse Ergebnis */}
                              {analysisResult && (
                                <motion.div 
                                  className={`mt-3 p-3 rounded-lg ${
                                    analysisResult.safe 
                                      ? 'bg-green-600/50' 
                                      : 'bg-red-600/50'
                                  }`}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                >
                                  <div className="flex items-center gap-2">
                                    {analysisResult.safe ? (
                                      <><Check className="w-5 h-5" /> Sicher zu posten!</>
                                    ) : (
                                      <><AlertCircle className="w-5 h-5" /> Riskant! {analysisResult.risk}% Risiko</>
                                    )}
                                  </div>
                                  {analysisResult.suggestion && (
                                    <p className="text-sm mt-1 opacity-90">
                                      💡 {analysisResult.suggestion}
                                    </p>
                                  )}
                                </motion.div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex gap-3 mt-3">
                                <button
                                  onClick={analyzePost}
                                  disabled={!postText || isPosting}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                                           disabled:opacity-50 rounded-lg py-2 px-4 font-bold 
                                           transition-all flex items-center justify-center gap-2"
                                >
                                  {isPosting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Analysiere...</>
                                  ) : (
                                    <>🔍 Analysieren</>
                                  )}
                                </button>
                                
                                <button
                                  onClick={sendPost}
                                  disabled={!postText || isPosting || (analysisResult && !analysisResult.safe)}
                                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 
                                           disabled:opacity-50 rounded-lg py-2 px-4 font-bold 
                                           transition-all flex items-center justify-center gap-2"
                                >
                                  {postSuccess ? (
                                    <><Check className="w-4 h-4" /> Gepostet!</>
                                  ) : (
                                    <><Send className="w-4 h-4" /> Posten</>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* TV Bottom Status Bar */}
                    <div className="bg-black/80 px-4 py-2 flex justify-between items-center border-t-2 border-black">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          {volume}
                        </span>
                        <span className="text-yellow-400">●</span>
                        <span>STEREO</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-green-400">⚡ PREPOST ACTIVE</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded">CH {currentChannel}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!tvOn && (
                <div className="flex items-center justify-center h-full">
                  <Power className="w-20 h-20 text-gray-600" />
                </div>
              )}
            </div>

            {/* TV Control Knobs */}
            <div className="absolute bottom-12 right-6 flex gap-3">
              <button
                onClick={() => setTvOn(!tvOn)}
                className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 shadow-lg flex items-center justify-center"
              >
                <Power className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => changeChannel('down')}
                className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 shadow-lg flex items-center justify-center"
              >
                <ChevronDown className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => changeChannel('up')}
                className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 shadow-lg flex items-center justify-center"
              >
                <ChevronUp className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* TV Stand */}
            <div 
              className="absolute -bottom-8 left-1/2 -translate-x-1/2"
              style={{
                width: '200px',
                height: '40px',
                background: 'linear-gradient(to bottom, #333, #111)',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        </motion.div>

        {/* DAS LEGENDÄRE SIMPSONS SOFA */}
        <motion.div
          className="relative"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          style={{ width: '900px' }}
        >
          {/* Sofa Schatten */}
          <div 
            className="absolute -bottom-4 left-1/2 -translate-x-1/2"
            style={{
              width: '95%',
              height: '30px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '50%',
              filter: 'blur(20px)',
            }}
          />

          {/* Sofa Rückenlehne */}
          <div 
            className="relative"
            style={{
              height: '180px',
              background: `linear-gradient(to bottom, 
                #FF8C00 0%, 
                #FF7F50 50%, 
                #FF6347 100%
              )`,
              borderRadius: '20px 20px 0 0',
              boxShadow: `
                inset 0 10px 30px rgba(255,255,255,0.3),
                inset 0 -10px 30px rgba(0,0,0,0.2),
                0 10px 40px rgba(0,0,0,0.3)
              `,
            }}
          >
            {/* Kissen-Nähte */}
            <div className="absolute inset-0 flex justify-around items-center">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="h-full border-l-2 border-orange-700 opacity-30"
                  style={{ width: '1px' }}
                />
              ))}
            </div>
          </div>

          {/* Sofa Sitzfläche */}
          <div 
            style={{
              height: '100px',
              background: `linear-gradient(to bottom, 
                #FF6347 0%, 
                #FF4500 100%
              )`,
              borderRadius: '0 0 20px 20px',
              position: 'relative',
              boxShadow: `
                inset 0 -5px 20px rgba(0,0,0,0.3),
                0 5px 20px rgba(0,0,0,0.2)
              `,
            }}
          >
            {/* Simpsons Familie auf dem Sofa */}
            <div className="absolute -top-20 left-0 right-0 flex justify-around items-end px-12">
              {simpsonsFamily.map((character, i) => (
                <motion.div
                  key={i}
                  className="relative cursor-pointer"
                  whileHover={{ scale: 1.1, y: -10 }}
                  onHoverStart={() => setHoveredCharacter(character.name)}
                  onHoverEnd={() => setHoveredCharacter(null)}
                >
                  <span className="text-7xl">{character.emoji}</span>
                  
                  {/* Sprechblase */}
                  <AnimatePresence>
                    {hoveredCharacter === character.name && (
                      <motion.div
                        className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-xl p-3 shadow-xl whitespace-nowrap"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <p className="text-black text-sm font-bold">{character.speech}</p>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
                          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Sofa Füße */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-20">
              {[0, 1].map(i => (
                <div
                  key={i}
                  className="w-12 h-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-lg"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Fernbedienung auf dem Beistelltisch */}
        <motion.div
          className="absolute bottom-10 right-10"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-amber-800 p-4 rounded-lg shadow-2xl">
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-white text-xs mb-2 text-center">REMOTE</p>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <button
                    key={num}
                    onClick={() => changeChannel(num)}
                    className="w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-bold"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
