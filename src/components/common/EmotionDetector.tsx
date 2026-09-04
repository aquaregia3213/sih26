import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Smile, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { EmotionEngine, EmotionState, EmotionAnalysisResult } from '../../utils/emotionEngine';

interface EmotionDetectorProps {
  onEmotionChange?: (emotion: EmotionState) => void;
}

export const EmotionDetector: React.FC<EmotionDetectorProps> = ({ onEmotionChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionAnalysisResult>({
    emotion: 'calm',
    confidence: 0.9,
    guidance: 'On-device Privacy Engine Active'
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsActive(true);
    } catch (err) {
      console.warn('Camera access not granted or unavailable:', err);
      setErrorMsg('Camera permission not active. Engine running in voice-only sentiment mode.');
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    let interval: any = null;

    if (isActive) {
      interval = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = 160;
            canvas.height = 120;
            ctx.drawImage(video, 0, 0, 160, 120);

            const result = EmotionEngine.analyzeVideoFrame(canvas);
            setCurrentEmotion(result);
            onEmotionChange?.(result.emotion);
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, onEmotionChange]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getEmotionBadge = () => {
    switch (currentEmotion.emotion) {
      case 'joyful':
        return { emoji: '😊', label: 'Joyful & Focused', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'hesitant':
        return { emoji: '🤔', label: 'Mild Hesitation', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'confused':
        return { emoji: '💙', label: 'Seeking Reassurance', color: 'bg-sky-100 text-sky-800 border-sky-300' };
      default:
        return { emoji: '🧘🏽‍♂️', label: 'Calm & Peaceful', color: 'bg-[#2D4739]/10 text-[#2D4739] border-[#2D4739]/20' };
    }
  };

  const badge = getEmotionBadge();

  return (
    <div className="bg-white border border-[#2D4739]/20 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <div>
            <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1E3A2F]">
              Visual & Motion Engagement Engine
            </h4>
            <p className="text-[10px] text-[#52635D]">On-Device Optical Differential (Zero Video Telemetry)</p>
          </div>
        </div>

        <button
          onClick={isActive ? stopCamera : startCamera}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isActive
              ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
              : 'bg-[#2D4739] text-[#FDFBF7] hover:bg-[#1E3A2F]'
          }`}
        >
          {isActive ? (
            <>
              <CameraOff className="w-3.5 h-3.5" />
              <span>Disable Sensor</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Enable Engagement Sensor</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <div className={`px-3 py-1 rounded-full border font-bold flex items-center gap-1.5 ${badge.color}`}>
          <span>{badge.emoji}</span>
          <span>{badge.label}</span>
        </div>

        <div className="flex items-center gap-2">
          {currentEmotion.metricDetails && (
            <span className="text-[10px] text-[#2D4739] bg-[#F0EAD8] px-2 py-0.5 rounded-md font-mono">
              Δmotion: {currentEmotion.metricDetails.avgMotion}
            </span>
          )}
          <span className="text-[11px] text-[#52635D] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            DPDP 2023 Local
          </span>
        </div>
      </div>

      {errorMsg && (
        <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
          {errorMsg}
        </p>
      )}

      {/* Hidden elements for processing */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
