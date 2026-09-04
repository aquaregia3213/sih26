import React, { useState } from 'react';
import { Sun, Heart, Volume2, Music, Moon, Coffee, Sparkles } from 'lucide-react';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant } from '../../utils/speech';
import { Language } from '../../types';

interface DayTimelineProps {
  currentLanguage?: Language;
  onOpenCompanion?: () => void;
}

export const DayTimeline: React.FC<DayTimelineProps> = ({
  currentLanguage = 'English',
  onOpenCompanion
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const timelineSteps = [
    {
      time: '07:30 AM',
      title: 'Morning Awakening & Warm Tea',
      tagline: 'Gentle sunrise greeting, orientation, and hydration reminder',
      symbol: '🌅',
      audioText: 'Good morning! The sun is rising over the tea hills. Have a warm cup of red tea and take your prescribed morning medicine.',
      description: 'The companion offers an affectionate greeting in Assamese or Hindi, gently grounding the elder with date, time, and morning tea routine.'
    },
    {
      time: '10:00 AM',
      title: 'Memory Courtyard & Photos',
      tagline: 'Light episodic recall with cherished family moments',
      symbol: '🖼️',
      audioText: 'Let us open our family album together and look at our loved ones during the Bihu festival.',
      description: 'A 5-minute photo recall session ("Who is this in the picture?") stimulating hippocampus pathways without fatigue.'
    },
    {
      time: '02:00 PM',
      title: 'Procedural Sequencing & Rituals',
      tagline: 'Engaging sequential memory through traditional craft and rhythms',
      symbol: '🪘',
      audioText: 'Let us arrange the morning tea-plucking steps and enjoy the steady rhythm of the Dhol.',
      description: 'Step-by-step sequencing puzzles based on tea processing, weaving, and traditional recipes to reinforce cognitive order.'
    },
    {
      time: '05:00 PM',
      title: 'Memory Garden Sanctuary',
      tagline: 'Calm botanical breathing to alleviate late afternoon restlessness',
      symbol: '🌿',
      audioText: 'The evening lamps are lit. Let us take three slow, gentle breaths and tend the jasmine blossoms in our courtyard.',
      description: 'Guided breathing and sensory water droplet visualizations specifically timed to prevent late-afternoon sundowning anxiety.'
    },
    {
      time: '08:00 PM',
      title: 'Evening Reflection & Affirmation',
      tagline: 'Peaceful closure and reassuring lullaby tones',
      symbol: '🌙',
      audioText: 'You did so well today. Rest peacefully under the quiet hills knowing you are deeply loved.',
      description: 'Gentle positive affirmations and soothing low-frequency tones designed to ease sleep onset and promote emotional stability.'
    }
  ];

  const handleStepClick = (index: number) => {
    soundSynth.playSoftClick();
    setActiveStepIndex(index);
  };

  const handleHearStep = (text: string) => {
    soundSynth.playGentleChime();
    VoiceAssistant.speak(text, currentLanguage as Language, 'slow');
  };

  const activeStep = timelineSteps[activeStepIndex];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] dark:bg-[#111A15] border-b border-[#1C382B]/10 dark:border-white/10" id="section-timeline">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C382B]/06 dark:bg-white/10 text-[#1C382B] dark:text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C99738]" />
            <span>Circadian Structure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#162620] dark:text-[#FAF7F2] tracking-tight">
            A Day Structured for Emotional Peace
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#4A5852] dark:text-[#9DB0A7] leading-relaxed">
            Predictable rhythms and gentle auditory cues reduce disorientation, helping elderly individuals stay oriented throughout the day.
          </p>
        </div>

        {/* Chronological Step Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {timelineSteps.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.time}
                onClick={() => handleStepClick(idx)}
                className={`p-4 text-left transition-all rounded-xl border cursor-pointer flex flex-col justify-between focus-accessible ${
                  isActive
                    ? 'bg-[#1C382B] text-white border-[#1C382B] shadow-xs'
                    : 'bg-white dark:bg-[#1A2620] border-[#1C382B]/10 dark:border-white/10 text-[#162620] dark:text-[#FAF7F2] hover:border-[#1C382B]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-[#C99738] text-[#13271E]' : 'bg-[#F3ECE2] dark:bg-white/10 text-[#4A5852] dark:text-[#9DB0A7]'
                  }`}>
                    {step.time}
                  </span>
                  <span className="text-xl">{step.symbol}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm leading-snug">
                  {step.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Active Time Highlight Box */}
        <div className="card-editorial p-6 sm:p-8 bg-white dark:bg-[#1A2620]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-14 h-14 rounded-xl bg-[#F3ECE2] dark:bg-white/10 flex items-center justify-center text-3xl mb-3">
                {activeStep.symbol}
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B3532D]">
                {activeStep.time} Ritual
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#162620] dark:text-[#FAF7F2] mt-1">
                {activeStep.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5852] dark:text-[#9DB0A7] mt-2 leading-relaxed">
                {activeStep.tagline}
              </p>
            </div>

            <div className="md:col-span-8 p-5 rounded-xl bg-[#FAF7F2] dark:bg-[#111A15] border border-[#1C382B]/10 dark:border-white/10 space-y-3">
              <span className="text-[11px] font-bold text-[#1C382B] dark:text-[#C99738] uppercase tracking-wider block">
                Auditory Cue Spoken by Oja:
              </span>
              
              <blockquote className="text-sm sm:text-base text-[#162620] dark:text-[#FAF7F2] font-medium leading-relaxed italic bg-white dark:bg-[#1A2620] p-4 rounded-lg border-l-3 border-[#C99738]">
                "{activeStep.audioText}"
              </blockquote>

              <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7] leading-relaxed">
                {activeStep.description}
              </p>

              <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={() => handleHearStep(activeStep.audioText)}
                  className="py-2 px-4 rounded-lg bg-[#1C382B] dark:bg-[#2E5240] hover:bg-[#2A4B3C] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer focus-accessible"
                >
                  <Volume2 className="w-4 h-4 text-[#C99738]" />
                  <span>Listen to Routine Prompt</span>
                </button>

                <span className="text-xs text-[#72807A]">
                  Step {activeStepIndex + 1} of 5 in Daily Rhythm
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
