import React from 'react';
import { ArrowLeft, Sparkles, Heart, Mic, ShieldCheck, Activity, Users, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { ActiveView } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

interface HowItWorksViewProps {
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigate, onOpenCompanion }) => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Life-Story & Cultural Personalization',
      subtitle: 'Setting up the Digital Courtyard',
      description: 'Family members or ASHA health workers configure the elder’s preferred North Eastern dialect and upload 3–5 treasured family photos with gentle relationship tags.',
      symbol: '🏡',
      points: [
        'Select from 6 regional languages (Assamese, Bodo, Khasi, Mizo, Nagamese, English)',
        'Private on-device storage of family wedding, festival, and childhood photos',
        'Automatic generation of personalized "Who is this?" recall activities'
      ]
    },
    {
      stepNumber: '02',
      title: 'Gentle Daily Voice & Play Routine',
      subtitle: '15 Minutes of Joyful Engagement',
      description: 'The elder receives enculturated audio reminders (morning red tea, courtyard strolls) and plays short, enjoyable games without any medical pressure.',
      symbol: '🎙️',
      points: [
        'Voice-first prompts spoken in familiar regional mother tongues',
        'Playful memory, sequence, visual attention, and folk wisdom games',
        'Encouraging feedback ("Let\'s look once more" — never alarming red X marks)'
      ]
    },
    {
      stepNumber: '03',
      title: 'On-Device Emotion-Adaptive AI',
      subtitle: 'Real-Time Confusion & Frustration Easing',
      description: 'Privacy-preserving on-device facial and voice pacing analysis senses user emotion. If restlessness or confusion is detected, difficulty eases and soothing tea-garden melodies play.',
      symbol: '👵🏽',
      points: [
        'Zero camera data leaves the device (100% private inference)',
        'Gentle shift to breathing exercises and regional folk proverbs when tired',
        'Celebratory positive reinforcement when happy and successful'
      ]
    },
    {
      stepNumber: '04',
      title: 'Compassionate Caregiver Insights',
      subtitle: 'Early Support Without Diagnostic Stigma',
      description: 'Caregivers receive unified 7-day and 30-day wellness trends and gentle advisories ("Spend 10 minutes looking at old Bihu photos with Raj today") rather than frightening clinical alarms.',
      symbol: '📊',
      points: [
        'Weekly cognitive scores across Memory, Attention, and Mood',
        'Indigenous herbal caregiving guidance (Manimuni, Morung storytelling)',
        'Offline opportunistic sync for remote rural health workers'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10" id="view-how-it-works">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D4739]/15">
        <button
          onClick={() => {
            soundSynth.playSoftClick();
            onNavigate('home');
          }}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#2D4739] hover:text-[#1E3A2F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => {
            soundSynth.playSoftClick();
            onNavigate('patient-app');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2D4739] text-[#FDFBF7] text-xs font-bold shadow-xs hover:bg-[#1E3A2F] transition-colors cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
          <span>Patient Courtyard</span>
        </button>
      </div>

      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#315C4C]/15 text-[#24483C] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
          Step-by-Step Overview
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#24483C]">
          How Vanika Works
        </h2>
        <p className="text-base sm:text-lg text-[#4A5B55] leading-relaxed">
          A harmonious bridge connecting family memories, cultural heritage, and modern on-device AI cognitive assistance.
        </p>
      </div>

      {/* 4 Steps Vertical Grid */}
      <div className="space-y-6">
        {steps.map((s, idx) => (
          <div
            key={s.stepNumber}
            className="bg-[#FDFBF7] border-3 border-[#315C4C]/25 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start gap-6"
          >
            {/* Step Number & Symbol */}
            <div className="flex md:flex-col items-center gap-3 shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-[#315C4C] text-[#D9A441] flex items-center justify-center font-heading font-extrabold text-2xl shadow-xs">
                {s.symbol}
              </div>
              <span className="font-heading font-extrabold text-xl text-[#C87552]">
                Step {s.stepNumber}
              </span>
            </div>

            {/* Step Details */}
            <div className="flex-1 space-y-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7EA9A5]">
                  {s.subtitle}
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-[#24483C] mt-0.5">
                  {s.title}
                </h3>
              </div>

              <p className="text-base text-[#4A5B55] leading-relaxed">
                {s.description}
              </p>

              <div className="pt-2 space-y-2">
                {s.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#24332E]">
                    <CheckCircle2 className="w-4 h-4 text-[#315C4C] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Launch Actions */}
      <div className="bg-[#24483C] text-[#F8F4EA] rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F8F4EA]">
          Ready to experience the digital courtyard?
        </h3>
        <p className="text-sm sm:text-base text-[#EDE5D2] max-w-xl mx-auto">
          Start exploring our interactive cognitive games or speak directly with the AI Elder Companion.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              soundSynth.playSoftClick();
              onNavigate('patient-app');
            }}
            className="py-3.5 px-6 rounded-2xl bg-[#D9A441] text-[#24483C] font-extrabold text-base hover:bg-[#E7BA5F] transition-colors cursor-pointer"
          >
            Enter Patient Courtyard
          </button>
          <button
            onClick={() => {
              soundSynth.playGentleChime();
              onOpenCompanion();
            }}
            className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-[#F8F4EA] font-bold text-base border border-[#F8F4EA]/30 transition-colors cursor-pointer"
          >
            Speak with Oja Voice
          </button>
        </div>
      </div>
    </div>
  );
};
