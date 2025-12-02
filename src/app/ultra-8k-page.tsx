'use client';

import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text3D, 
  Environment, 
  Float, 
  Sparkles,
  MeshReflectorMaterial,
  useTexture,
  Stars,
  Cloud,
  Lightformer
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration,
  Vignette,
  Glitch,
  Noise,
  DepthOfField
} from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import { useState, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { BlendFunction } from 'postprocessing';

// 3D Floating Logo Component
function FloatingLogo() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 3, -2]}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshPhysicalMaterial
          color="#6366f1"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          reflectivity={1}
          envMapIntensity={2}
          transmission={0.8}
          thickness={0.5}
        />
      </mesh>
    </Float>
  );
}

// 3D Text with Glass Material
function GlassText({ text, position = [0, 0, 0], size = 1 }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.envMapIntensity = 
        2 + Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <Text3D
      ref={meshRef}
      font="/fonts/helvetiker_bold.typeface.json"
      size={size}
      height={0.5}
      curveSegments={32}
      position={position}
    >
      {text}
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0}
        roughness={0}
        transmission={0.98}
        thickness={0.5}
        envMapIntensity={2}
        clearcoat={1}
        clearcoatRoughness={0}
        ior={1.5}
        reflectivity={0.9}
      />
    </Text3D>
  );
}

// Holographic Grid Floor
function HolographicFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100, 100, 100]} />
      <MeshReflectorMaterial
        blur={[300, 30]}
        resolution={2048}
        mixBlur={1}
        mixStrength={80}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0e27"
        metalness={0.8}
      />
    </mesh>
  );
}

// Neural Network Visualization
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const nodes = [];
  const connections = [];
  
  // Create nodes
  for (let i = 0; i < 20; i++) {
    const theta = (i / 20) * Math.PI * 2;
    const radius = 5 + Math.random() * 3;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const y = (Math.random() - 0.5) * 4;
    
    nodes.push(
      <mesh key={`node-${i}`} position={[x, y, z]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 1, 0.5)}
          emissive={new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 1, 0.3)}
          emissiveIntensity={2}
        />
      </mesh>
    );
  }
  
  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {nodes}
    </group>
  );
}

// 3D Scene Component
function Scene3D() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
      />
      
      {/* Environment */}
      <Environment preset="city" background blur={0.5}>
        <Lightformer
          form="rect"
          intensity={2}
          position={[0, 10, -10]}
          scale={[20, 20, 1]}
          color="#6366f1"
        />
      </Environment>
      
      {/* 3D Elements */}
      <FloatingLogo />
      <HolographicFloor />
      <NeuralNetwork />
      
      {/* Particles */}
      <Sparkles
        count={10000}
        size={2}
        speed={0.5}
        opacity={0.5}
        scale={[50, 20, 50]}
        color="#6366f1"
      />
      
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={2}
          radius={0.8}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.001, 0.001]}
        />
        <Vignette
          eskil={false}
          offset={0.1}
          darkness={0.5}
        />
        <DepthOfField
          focusDistance={0.01}
          focalLength={0.1}
          bokehScale={3}
        />
      </EffectComposer>
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Main Ultra 8K Page Component
export default function Ultra8KPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsAuthenticated(true);
      setShowLogin(false);
      setIsLoading(false);
      router.push('/expert-lounge');
    }, 2000);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Glass UI Overlay */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Premium Navigation */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative"
          style={{
            background: 'rgba(10, 14, 39, 0.2)',
            backdropFilter: 'blur(20px) saturate(200%)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: '0 10px 50px rgba(99, 102, 241, 0.2)',
          }}
        >
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            {/* Holographic Logo */}
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
                  <span className="text-3xl filter drop-shadow-lg">🛡️</span>
                </div>
              </div>
              <div>
                <h1 className="text-white text-3xl font-black tracking-tight">
                  PREPOST
                </h1>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-xs uppercase tracking-[0.3em] font-bold">
                  8K ULTRA EDITION
                </p>
              </div>
            </motion.div>

            {/* Holographic Login Button */}
            <motion.button
              onClick={() => setShowLogin(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden rounded-full"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 75%, #764ba2 100%)',
                backgroundSize: '300% 300%',
                animation: 'holographic 4s ease infinite',
                padding: '1rem 3rem',
                boxShadow: '0 0 40px rgba(102, 126, 234, 0.5), inset 0 0 20px rgba(255,255,255,0.2)',
              }}
            >
              <span className="relative z-10 font-bold text-white text-lg tracking-wider">
                ELITE ACCESS
              </span>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-500" />
            </motion.button>
          </div>
        </motion.header>

        {/* Hero Content */}
        <main className="flex-1 flex items-center justify-center px-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: "spring" }}
            className="text-center max-w-6xl"
          >
            {/* Holographic Badge */}
            <motion.div 
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="inline-block mb-8 px-8 py-4 rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.2) 50%, rgba(99,102,241,0.2) 100%)',
                border: '2px solid transparent',
                borderImage: 'linear-gradient(90deg, #6366f1, #ec4899, #6366f1) 1',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 30px rgba(99,102,241,0.3)',
              }}
            >
              <span className="text-white text-sm font-bold tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                33 ELITE GENERALS PROTECTING YOUR POSTS
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
              </span>
            </motion.div>

            {/* 3D Title */}
            <h1 className="mb-8">
              <motion.div
                animate={{
                  textShadow: [
                    '0 0 20px rgba(99,102,241,0.8), 0 0 40px rgba(99,102,241,0.6), 0 0 60px rgba(99,102,241,0.4)',
                    '0 0 30px rgba(236,72,153,0.8), 0 0 50px rgba(236,72,153,0.6), 0 0 70px rgba(236,72,153,0.4)',
                    '0 0 20px rgba(99,102,241,0.8), 0 0 40px rgba(99,102,241,0.6), 0 0 60px rgba(99,102,241,0.4)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl font-black text-white uppercase tracking-tight mb-4"
                style={{
                  transform: 'perspective(500px) rotateX(15deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                Protect You
              </motion.div>
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-8xl font-black uppercase tracking-tight"
                style={{
                  background: 'linear-gradient(90deg, #6366f1, #ec4899, #6366f1, #ec4899)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transform: 'perspective(500px) rotateX(15deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                From Social Media
              </motion.div>
            </h1>

            {/* Holographic CTA Buttons */}
            <div className="flex gap-6 justify-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-6 rounded-2xl font-bold text-xl overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4), inset 0 0 20px rgba(255,255,255,0.1)',
                }}
              >
                <span className="relative z-10 text-white">Start Elite Trial</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 rounded-2xl font-bold text-xl"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                }}
              >
                Watch 8K Demo
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-8"
          style={{
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className="relative w-full max-w-md"
            style={{
              background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(99, 102, 241, 0.1) 100%)',
              backdropFilter: 'blur(20px) saturate(200%)',
              border: '2px solid rgba(99, 102, 241, 0.5)',
              borderRadius: '32px',
              padding: '3rem',
              boxShadow: '0 0 100px rgba(99, 102, 241, 0.5), inset 0 0 50px rgba(99, 102, 241, 0.1)',
            }}
          >
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>

            <h2 className="text-4xl font-black text-white mb-2">ELITE ACCESS</h2>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-8">
              Enter the command center
            </p>

            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <input
                  type="email"
                  placeholder="elite@prepost.ai"
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
                
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-8 py-4 rounded-2xl font-bold text-lg"
                style={{
                  background: isLoading 
                    ? 'rgba(99, 102, 241, 0.5)' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 20px 40px rgba(99,102,241,0.4)',
                  cursor: isLoading ? 'wait' : 'pointer',
                }}
              >
                {isLoading ? 'AUTHENTICATING...' : 'ACCESS COMMAND CENTER'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes holographic {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
