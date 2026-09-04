import React, { useEffect, useRef } from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  isSpeaking?: boolean;
  color?: string;
  barCount?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isActive,
  isSpeaking = false,
  color = '#315C4C',
  barCount = 18
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const barWidth = width / barCount - 3;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 3);
        let amplitude = 4;

        if (isActive || isSpeaking) {
          const freq = (i / barCount) * Math.PI * 2;
          const speed = isSpeaking ? 0.08 : 0.05;
          const dynamicMod = Math.sin(phase + freq * 3) * Math.cos(phase * 0.7 + i);
          amplitude = Math.max(4, Math.abs(dynamicMod) * (height * 0.42));
        }

        const gradient = ctx.createLinearGradient(0, centerY - amplitude, 0, centerY + amplitude);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#D9A441');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        const top = centerY - amplitude / 2;
        const barH = Math.max(3, amplitude);
        const radius = barWidth / 2;
        
        ctx.roundRect(x, top, Math.max(2, barWidth), barH, radius);
        ctx.fill();
      }

      phase += 0.07;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isSpeaking, color, barCount]);

  return (
    <div className="w-full flex items-center justify-center py-2" id="voice-waveform-container">
      <canvas
        ref={canvasRef}
        width={240}
        height={48}
        className="w-full max-w-[240px] h-12"
      />
    </div>
  );
};
