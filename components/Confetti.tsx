import React, { useEffect, useRef } from 'react';

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = 200;
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];

    class Particle {
      x: number;
      y: number;
      w: number;
      h: number;
      vx: number;
      vy: number;
      angle: number;
      color: string;
      rotation: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.w = Math.random() * 10 + 5;
        this.h = Math.random() * 10 + 5;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = Math.random() * 5 + 2;
        this.angle = 0;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 10 - 5;
        this.opacity = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.rotation;
        if (this.y > height) {
          this.opacity -= 0.02;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle * Math.PI / 180);
        context.fillStyle = this.color;
        context.globalAlpha = this.opacity;
        context.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        context.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      let activeParticles = false;
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
        if (p.opacity > 0) {
            activeParticles = true;
        }
      });
      
      if(activeParticles) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, pointerEvents: 'none' }} />;
};

export default Confetti;
