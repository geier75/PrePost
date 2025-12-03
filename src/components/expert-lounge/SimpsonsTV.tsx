'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Power, ChevronUp, ChevronDown, Volume2, VolumeX, Wifi } from 'lucide-react';

interface SimpsonsTVProps {
  tvOn: boolean;
  currentChannel: number;
  volume: number;
  muted: boolean;
  onPowerToggle: () => void;
  onChannelChange: (direction: 'up' | 'down') => void;
  onVolumeToggle: () => void;
  children: React.ReactNode;
}

export default function SimpsonsTV({
  tvOn,
  currentChannel,
  volume,
  muted,
  onPowerToggle,
  onChannelChange,
  onVolumeToggle,
  children
}: SimpsonsTVProps) {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', duration: 1, bounce: 0.4 }}
    >
      {/* TV Schatten für 3D-Effekt */}
      <div 
        className="absolute -bottom-8 left-1/2 -translate-x-1/2"
        style={{
          width: '85%',
          height: '50px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
          filter: 'blur(25px)',
        }}
      />
      
      {/* TV GEHÄUSE - Exakte Form wie im Simpsons TV */}
      {/* TV - MEGA GROß! */}
      <div 
        className="relative"
        style={{
          width: '1200px',
          height: '800px',
          background: `linear-gradient(145deg, 
            #4a5568 0%, 
            #2d3748 25%, 
            #1a202c 75%, 
            #0f172a 100%
          )`,
          borderRadius: '35px',
          boxShadow: `
            0 30px 80px rgba(0,0,0,0.7),
            inset 0 3px 6px rgba(255,255,255,0.15),
            inset 0 -3px 6px rgba(0,0,0,0.6)
          `,
          border: '5px solid #0f172a',
          transform: 'perspective(1000px) rotateX(2deg)',
        }}
      >
        {/* TV Antennen */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-10">
          <motion.div 
            className="relative"
            animate={{ rotate: [0, -2, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <div 
              className="absolute w-2 h-32 bg-gradient-to-t from-gray-600 to-gray-400 rounded-full shadow-lg"
              style={{ 
                transform: 'rotate(-25deg) translateX(-25px)',
                transformOrigin: 'bottom',
              }}
            />
            <div 
              className="absolute w-2 h-32 bg-gradient-to-t from-gray-600 to-gray-400 rounded-full shadow-lg"
              style={{ 
                transform: 'rotate(25deg) translateX(25px)',
                transformOrigin: 'bottom',
              }}
            />
            <div className="w-10 h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-xl" />
          </motion.div>
        </div>

        {/* TV BILDSCHIRM */}
        <div 
          className="absolute top-8 left-8 right-8"
          style={{
            height: '380px',
            background: tvOn 
              ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(180deg, #374151 0%, #1f2937 100%)',
            borderRadius: '25px',
            overflow: 'hidden',
            border: '10px solid #0f172a',
            boxShadow: `
              inset 0 0 80px rgba(0,0,0,0.9),
              inset 0 0 120px rgba(59,130,246,0.05)
            `,
          }}
        >
          {/* Bildröhren-Krümmung (CRT Effect) */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(
                ellipse 120% 100% at center,
                transparent 30%,
                rgba(0,0,0,0.15) 70%,
                rgba(0,0,0,0.4) 100%
              )`,
            }}
          />
          
          {/* Scan Lines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.4) 2px,
                rgba(0, 0, 0, 0.4) 4px
              )`,
              animation: 'scanlines 8s linear infinite',
            }}
          />
          
          {/* Screen Glare */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                135deg,
                transparent 40%,
                rgba(255,255,255,0.03) 50%,
                transparent 60%
              )`,
            }}
          />

          {/* Content */}
          {children}
        </div>

        {/* TV STEUERUNG - Große runde Knöpfe */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
          {/* Power Button */}
          <motion.button
            onClick={onPowerToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-16 h-16 rounded-full shadow-xl transition-all ${
              tvOn 
                ? 'bg-gradient-to-b from-red-500 to-red-700' 
                : 'bg-gradient-to-b from-green-500 to-green-700'
            }`}
            style={{
              boxShadow: `
                0 4px 15px rgba(0,0,0,0.5),
                inset 0 2px 4px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.3)
              `,
            }}
          >
            <Power className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.button>

          {/* Channel Down */}
          <motion.button
            onClick={() => onChannelChange('down')}
            disabled={!tvOn}
            whileHover={{ scale: tvOn ? 1.1 : 1 }}
            whileTap={{ scale: tvOn ? 0.95 : 1 }}
            className="relative w-16 h-16 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 shadow-xl disabled:opacity-50 transition-all"
            style={{
              boxShadow: `
                0 4px 15px rgba(0,0,0,0.5),
                inset 0 2px 4px rgba(255,255,255,0.2),
                inset 0 -2px 4px rgba(0,0,0,0.3)
              `,
            }}
          >
            <ChevronDown className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.button>

          {/* Channel Display */}
          <div 
            className="flex items-center justify-center w-20 h-16 rounded-lg bg-gradient-to-b from-gray-900 to-black"
            style={{
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)',
              border: '2px solid #1a202c',
            }}
          >
            <span className="text-green-400 text-2xl font-mono font-bold">
              {tvOn ? currentChannel.toString().padStart(2, '0') : '--'}
            </span>
          </div>

          {/* Channel Up */}
          <motion.button
            onClick={() => onChannelChange('up')}
            disabled={!tvOn}
            whileHover={{ scale: tvOn ? 1.1 : 1 }}
            whileTap={{ scale: tvOn ? 0.95 : 1 }}
            className="relative w-16 h-16 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 shadow-xl disabled:opacity-50 transition-all"
            style={{
              boxShadow: `
                0 4px 15px rgba(0,0,0,0.5),
                inset 0 2px 4px rgba(255,255,255,0.2),
                inset 0 -2px 4px rgba(0,0,0,0.3)
              `,
            }}
          >
            <ChevronUp className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.button>

          {/* Volume */}
          <motion.button
            onClick={onVolumeToggle}
            disabled={!tvOn}
            whileHover={{ scale: tvOn ? 1.1 : 1 }}
            whileTap={{ scale: tvOn ? 0.95 : 1 }}
            className="relative w-16 h-16 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 shadow-xl disabled:opacity-50 transition-all"
            style={{
              boxShadow: `
                0 4px 15px rgba(0,0,0,0.5),
                inset 0 2px 4px rgba(255,255,255,0.2),
                inset 0 -2px 4px rgba(0,0,0,0.3)
              `,
            }}
          >
            {muted ? (
              <VolumeX className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            ) : (
              <Volume2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}
          </motion.button>
        </div>

        {/* Lautsprecher-Gitter unten */}
        <div className="absolute bottom-2 left-12 right-12 h-4">
          <div 
            className="h-full rounded"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                #1a202c 0px,
                #1a202c 4px,
                #0f172a 4px,
                #0f172a 8px
              )`,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        </div>

        {/* Marken-Logo */}
        <div className="absolute top-4 right-12 text-gray-600 text-xs font-bold tracking-wider">
          SIMPSONS™
        </div>
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
      `}</style>
    </motion.div>
  );
}
