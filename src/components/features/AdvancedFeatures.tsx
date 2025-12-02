'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Shield,
  Zap,
  Globe2,
  Lock,
  Activity,
  Sparkles,
  Eye,
  Layers,
  Cpu,
  Database,
  Cloud
} from 'lucide-react';

const features = [
  {
    id: 'quantum-ai',
    icon: Brain,
    title: 'Quantum AI Analysis',
    subtitle: 'Neural Network 3.0',
    description: 'Multi-dimensional risk analysis using quantum computing principles',
    stats: {
      speed: '87ms',
      accuracy: '99.7%',
      dimensions: '12'
    },
    gradient: 'from-purple-600 to-pink-600',
    visual: (
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-48 h-48 border-2 border-purple-500/30 rounded-full animate-pulse"
              style={{
                width: `${(i + 1) * 100}px`,
                height: `${(i + 1) * 100}px`,
                animationDelay: `${i * 0.3}s`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'risk-shield',
    icon: Shield,
    title: 'Risk Shield™',
    subtitle: 'Military-Grade Protection',
    description: 'Real-time threat detection across all major social platforms',
    stats: {
      threats: '2.4M',
      prevented: '98%',
      platforms: '15+'
    },
    gradient: 'from-cyan-600 to-blue-600',
    visual: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <Shield className="w-24 h-24 text-cyan-500/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-cyan-500/30 rounded-full animate-ping" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'instant-analysis',
    icon: Zap,
    title: 'Lightning Fast',
    subtitle: 'Edge Computing',
    description: 'Sub-100ms analysis powered by global edge network',
    stats: {
      latency: '<100ms',
      uptime: '99.99%',
      nodes: '180+'
    },
    gradient: 'from-yellow-600 to-orange-600',
    visual: (
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-yellow-500 to-transparent"
            style={{
              width: '100%',
              transform: `translateY(${(i - 2) * 20}px)`,
              animation: 'lightning 2s infinite',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    )
  },
  {
    id: 'privacy-vault',
    icon: Lock,
    title: 'Privacy Vault',
    subtitle: 'Zero-Knowledge Architecture',
    description: 'Quantum-resistant encryption with end-to-end privacy',
    stats: {
      encryption: 'AES-512',
      compliance: 'GDPR+',
      audits: 'SOC2'
    },
    gradient: 'from-green-600 to-emerald-600',
    visual: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-4 border-green-500/30 rounded-lg animate-pulse" />
          <div className="absolute inset-2 border-4 border-green-500/20 rounded-lg animate-pulse animation-delay-200" />
          <div className="absolute inset-4 border-4 border-green-500/10 rounded-lg animate-pulse animation-delay-400" />
        </div>
      </div>
    )
  }
];

export default function AdvancedFeatures() {
  const [activeFeature, setActiveFeature] = useState(features[0]);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'grid 20s linear infinite',
            transform: 'perspective(1000px) rotateX(60deg)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="inline-block px-4 py-2 mb-6 text-sm font-mono bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full border border-purple-500/30"
            whileHover={{ scale: 1.05 }}
          >
            ⚡ NEXT-GEN TECHNOLOGY STACK
          </motion.span>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Beyond State-of-the-Art
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Powered by quantum computing, neural networks, and edge technology 
            that's 10 years ahead of the competition
          </p>
        </motion.div>

        {/* Feature selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feature) => (
            <motion.button
              key={feature.id}
              onClick={() => setActiveFeature(feature)}
              className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                activeFeature.id === feature.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-800 bg-black/50 hover:border-purple-500/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <feature.icon className={`w-8 h-8 mb-3 ${
                activeFeature.id === feature.id ? 'text-purple-400' : 'text-gray-500'
              }`} />
              <h3 className="font-bold text-white">{feature.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{feature.subtitle}</p>
              
              {activeFeature.id === feature.id && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20"
                  layoutId="activeFeature"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Active feature display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Feature details */}
              <div>
                <motion.div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${activeFeature.gradient} mb-6`}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <activeFeature.icon className="w-12 h-12 text-white" />
                </motion.div>
                
                <h3 className="text-4xl font-bold text-white mb-4">
                  {activeFeature.title}
                </h3>
                
                <p className="text-xl text-gray-400 mb-8">
                  {activeFeature.description}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(activeFeature.stats).map(([key, value]) => (
                    <motion.div
                      key={key}
                      className="p-4 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800"
                      whileHover={{ scale: 1.05, borderColor: 'rgba(168, 85, 247, 0.5)' }}
                      onHoverStart={() => setHoveredStat(key)}
                      onHoverEnd={() => setHoveredStat(null)}
                    >
                      <div className="text-2xl font-bold text-white mb-1">{value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{key}</div>
                      
                      {hoveredStat === key && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-purple-500/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Visual representation */}
              <div className="relative h-[400px] rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 overflow-hidden">
                {activeFeature.visual}
                
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes grid {
          0% {
            transform: perspective(1000px) rotateX(60deg) translateY(0);
          }
          100% {
            transform: perspective(1000px) rotateX(60deg) translateY(50px);
          }
        }
        
        @keyframes lightning {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scaleX(0);
          }
          50% {
            opacity: 1;
            transform: translateY(0) scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}
