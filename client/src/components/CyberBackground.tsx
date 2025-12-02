import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState } from 'react';
import { Group } from 'three';

function Stars(props: any) {
  const ref = useRef<Group>(null);
  
  const sphere = useMemo(() => {
    const count = 2000; // Further reduced for energy efficiency
    const radius = 1.5;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Very slow rotation for minimal GPU usage
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 40;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.0015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
        />
      </Points>
    </group>
  );
}

export default function CyberBackground() {
  const [isVisible, setIsVisible] = useState(true);

  // Green IT: Pause rendering when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (!isVisible) return <div className="fixed inset-0 z-[-1] bg-background" />;

  return (
    <div className="fixed inset-0 z-[-1] bg-background">
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        frameloop="demand" // Only render when needed (Green IT)
        dpr={[1, 1.5]} // Cap pixel ratio for battery saving
      >
        <Stars />
      </Canvas>
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-background/80 pointer-events-none" />
    </div>
  );
}
