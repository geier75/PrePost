'use client';

import { useEffect, useRef } from 'react';

export default function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class for luxury effect
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      pulseSpeed: number;
      maxSize: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.maxSize = this.size * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        
        // Luxury color palette
        const colors = [
          '99, 102, 241', // Indigo
          '236, 72, 153', // Pink
          '139, 92, 246', // Purple
          '59, 130, 246', // Blue
          '251, 146, 60', // Orange
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Pulse effect
        this.size = this.maxSize / 2 + Math.sin(Date.now() * this.pulseSpeed) * this.maxSize / 2;
        
        // Wrap around screen
        if (this.x > canvasWidth) this.x = 0;
        if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) this.y = 0;
        if (this.y < 0) this.y = canvasHeight;
      }

      draw() {
        if (!ctx) return;
        
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(${this.color}, ${this.opacity})`;
        
        // Draw particle with gradient
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(${this.color}, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
      }
    }

    // Create particles
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle(canvas.width, canvas.height));
    }

    // Connection lines between particles
    const drawConnections = () => {
      if (!ctx) return;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.1;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(canvas.width, canvas.height);
        particle.draw();
      });
      
      // Draw connections
      drawConnections();
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        mixBlendMode: 'screen',
        opacity: 0.3,
      }}
    />
  );
}
