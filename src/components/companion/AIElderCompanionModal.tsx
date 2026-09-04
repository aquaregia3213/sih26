import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, Smile, Meh, Frown, RefreshCw, Send, X, Coffee, BookOpen, Music, Shuffle } from 'lucide-react';
import { Language, EmotionState } from '../../types';
import { speechEngine } from '../../utils/speech';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceWaveform } from '../common/VoiceWaveform';
import { REGIONAL_LANGUAGES } from '../../data/culturalContent';
import { InbuiltPromptNavigator } from './InbuiltPromptNavigator';
import { INBUILT_PROMPTS } from '../../data/inbuiltPromptsAndSounds';

import { AIService } from '../../utils/aiService';
import { vanikaStorage } from '../../utils/storage';

interface AIElderCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenAgenticWorkflow?: () => void;
}

export const AIElderCompanionModal: React.FC<AIElderCompanionModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  onOpenAgenticWorkflow
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [emotionState, setEmotionState] = useState<EmotionState>('calm');
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptNavigator, setShowPromptNavigator] = useState(false);
  const [activeSoundName, setActiveSoundName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'companion'; text: string; time: string }>>([
    {
      sender: 'companion',
      text: 'Good morning, my dear friend. The morning breeze over the hills brings peace. Let us have a gentle sip of warm tea and talk.',
      time: 'Just now'
    }
  ]);

  const activeListenerRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      soundSynth.playGentleChime();
      // Speak initial greeting in selected language
      const langObj = REGIONAL_LANGUAGES.find(l => l.id === currentLanguage);
      if (langObj) {
        const welcome = langObj.greeting;
        setMessages([
          {
            sender: 'companion',
            text: `${welcome} — I am sitting right here with you. How is your heart and mind feeling today?`,
            time: 'Just now'
          }
        ]);
        speechEngine.speak(`${welcome}. Welcome to our peaceful courtyard.`, {
          language: currentLanguage,
          onEnd: () => setIsSpeaking(false)
        });
        setIsSpeaking(true);
      }
    } else {
      speechEngine.stop();
      if (activeListenerRef.current && activeListenerRef.current.abort) {
        activeListenerRef.current.abort();
      }
    }
  }, [isOpen, currentLanguage]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || userInput;
    if (!query.trim()) return;

    soundSynth.playSoftClick();
    const newMsg = { sender: 'user' as const, text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Call AIService for live Generative AI response with live encrypted vault profile
      const profile = vanikaStorage.getProfile();
      const reply = await AIService.generateCompanionResponse(query, currentLanguage, profile);

      setMessages(prev => [
        ...prev,
        {
          sender: 'companion',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      setIsSpeaking(true);
      speechEngine.speak(reply, {
        language: currentLanguage,
        onEnd: () => setIsSpeaking(false)
      });
    } catch (e) {
      const fallbackReply = "Peace be with you. Even if words take time, I am right here listening beside you.";
      setMessages(prev => [
        ...prev,
        {
          sender: 'companion',
          text: fallbackReply,
          time: 'Just now'
        }
      ]);
      speechEngine.speak(fallbackReply, {
        language: currentLanguage,
        onEnd: () => setIsSpeaking(false)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (activeListenerRef.current && activeListenerRef.current.abort) {
        activeListenerRef.current.abort();
      }
      setIsListening(false);
    } else {
      soundSynth.playSoftClick();
      setIsListening(true);
      activeListenerRef.current = speechEngine.startListening(
        (recognizedText) => {
          setIsListening(false);
          handleSendMessage(recognizedText);
        },
        (err) => {
          console.log('Voice recognition notice:', err);
          setIsListening(false);
        },
        () => setIsListening(false),
        currentLanguage
      );
    }
  };

  const handleProverbClick = (proverb: string) => {
    handleSendMessage(`Tell me more about this proverb: "${proverb}"`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1E3A2F]/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FDFBF7] border border-[#2D4739]/30 rounded-3xl max-w-2xl w-full h-[90vh] max-h-[780px] flex flex-col shadow-2xl overflow-hidden relative text-[#1E3A2F]">
        {/* Header */}
        <div className="bg-[#1E3A2F] text-[#FDFBF7] px-5 py-3.5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center font-bold text-xl shadow-xs animate-companion-breathe">
              👵🏽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#FDFBF7]">
                  Oja / Aita Companion
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#1E3A2F]">
                  Gentle Voice AI
                </span>
              </div>
              <p className="text-xs text-[#EAE2D2]/90 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Listening with warmth & patience • Regional Dialect Aware
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAgenticWorkflow && (
              <button
                onClick={() => {
                  soundSynth.playGentleChime();
                  onOpenAgenticWorkflow();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#C66B44] text-[#1E3A2F] hover:text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 cursor-pointer border border-[#1E3A2F]"
                title="Open Oja Multi-Agent AI Workflow Visualizer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Agentic AI Pipeline</span>
              </button>
            )}

            <button
              onClick={() => {
                soundSynth.playSoftClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#2D4739] hover:bg-[#3E6250] text-[#FDFBF7] transition-colors cursor-pointer"
              aria-label="Close voice companion window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Companion Avatar Showcase & Emotion State Adaptive Bar */}
        <div className="bg-[#F5EFE6] border-b border-[#2D4739]/15 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Avatar Animated Visual */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#2D4739] to-[#6A9B96] p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-[#FDFBF7] flex items-center justify-center text-3xl sm:text-4xl animate-companion-breathe overflow-hidden">
                  {emotionState === 'joy' ? '👵🏽' : emotionState === 'frustrated' ? '🫂' : '🧓🏽'}
                </div>
              </div>
              {isSpeaking && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#D4AF37]"></span>
                </span>
              )}
            </div>

            <div>
              <span className="text-xs font-bold text-[#2D4739] uppercase tracking-wider block">
                {isSpeaking ? 'Speaking softly...' : isListening ? 'Listening with care...' : 'Sitting quietly with you'}
              </span>
              <p className="text-xs text-[#52635D]">
                {emotionState === 'frustrated'
                  ? 'Soothing mode: extra gentle pacing & reassurance'
                  : emotionState === 'joy'
                  ? 'Celebratory mode: sharing warm memories & smiles'
                  : 'Calm & peaceful rhythm'}
              </p>
            </div>
          </div>

          {/* Emotion Simulation Buttons for Demos / Testing */}
          <div className="flex items-center gap-1.5 bg-[#EAE2D2] p-1.5 rounded-2xl border border-[#2D4739]/15">
            <span className="text-[10px] font-bold uppercase text-[#52635D] px-1 hidden sm:inline">
              Elder Mood:
            </span>
            <button
              onClick={() => {
                soundSynth.playCelebration();
                setEmotionState('joy');
              }}
              className={`p-1.5 rounded-xl text-xs flex items-center gap-1 font-bold transition-all cursor-pointer ${
                emotionState === 'joy' ? 'bg-[#D4AF37] text-[#1E3A2F] shadow-xs' : 'text-[#52635D] hover:bg-[#FDFBF7]'
              }`}
              title="Simulate Joyful Emotion"
            >
              <Smile className="w-4 h-4 text-emerald-800" />
              <span className="hidden md:inline">Joy</span>
            </button>
            <button
              onClick={() => {
                soundSynth.playSoftClick();
                setEmotionState('calm');
              }}
              className={`p-1.5 rounded-xl text-xs flex items-center gap-1 font-bold transition-all cursor-pointer ${
                emotionState === 'calm' ? 'bg-[#2D4739] text-[#FDFBF7] shadow-xs' : 'text-[#52635D] hover:bg-[#FDFBF7]'
              }`}
              title="Simulate Calm State"
            >
              <Meh className="w-4 h-4 text-[#6A9B96]" />
              <span className="hidden md:inline">Calm</span>
            </button>
            <button
              onClick={() => {
                soundSynth.playGentleChime();
                setEmotionState('frustrated');
              }}
              className={`p-1.5 rounded-xl text-xs flex items-center gap-1 font-bold transition-all cursor-pointer ${
                emotionState === 'frustrated' ? 'bg-[#C66B44] text-white shadow-xs' : 'text-[#52635D] hover:bg-[#FDFBF7]'
              }`}
              title="Simulate Frustrated/Confused Emotion"
            >
              <Frown className="w-4 h-4 text-amber-900" />
              <span className="hidden md:inline">Restless</span>
            </button>
          </div>
        </div>

        {/* Live Audio Waveform */}
        {(isListening || isSpeaking) && (
          <div className="bg-[#F5EFE6]/90 border-b border-[#2D4739]/10 px-4">
            <VoiceWaveform isActive={isListening} isSpeaking={isSpeaking} color="#2D4739" />
          </div>
        )}

        {/* Chat Messages Transcript */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-ner-weave">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-base sm:text-lg leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#2D4739] text-[#FDFBF7] rounded-tr-none'
                    : 'bg-white border border-[#D4AF37]/40 text-[#1E3A2F] rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-current/10 text-xs opacity-70">
                  <span>{msg.sender === 'user' ? 'You' : 'Oja Companion'}</span>
                  <span>{msg.time}</span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white/90 rounded-2xl max-w-xs border border-[#2D4739]/20 text-sm text-[#2D4739] font-semibold shadow-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
              <span>Oja is preparing gentle thoughts...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Acoustic Sounds & Inbuilt Prompts Toolbar */}
        <div className="bg-[#F5EFE6] border-t border-[#2D4739]/15 px-4 py-2 space-y-2">
          {/* Row 1: Inbuilt Voice & Nature Sounds */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
            <span className="text-[11px] font-black text-[#52635D] shrink-0 flex items-center gap-1 pr-1 border-r border-[#2D4739]/15">
              <Music className="w-3.5 h-3.5 text-[#C66B44]" /> Sounds:
            </span>

            {[
              { id: 'flute', name: 'Bamboo Flute', emoji: '🪈', fn: () => soundSynth.playAssamFluteMelody() },
              { id: 'dhol', name: 'Bihu Dhol', emoji: '🥁', fn: () => soundSynth.playBihuRhythm() },
              { id: 'bell', name: 'Temple Bell', emoji: '🔔', fn: () => soundSynth.playTempleBell() },
              { id: 'birds', name: 'Birdsong', emoji: '🐦', fn: () => soundSynth.playMorningBirdSong() },
              { id: 'rain', name: 'Rain on Tea', emoji: '🌧️', fn: () => soundSynth.playRainOnTeaLeaves() },
              { id: 'bowl', name: 'Singing Bowl', emoji: '🥣', fn: () => soundSynth.playSingingBowl() },
              { id: 'water', name: 'Water Spring', emoji: '💧', fn: () => soundSynth.playWaterDrop() }
            ].map(snd => {
              const isPlaying = activeSoundName === snd.id;
              return (
                <button
                  key={snd.id}
                  onClick={() => {
                    setActiveSoundName(snd.id);
                    snd.fn();
                    setTimeout(() => setActiveSoundName(null), 2500);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer shrink-0 flex items-center gap-1 font-bold ${
                    isPlaying
                      ? 'bg-[#D4AF37] text-[#1E3A2F] border-white shadow-xs scale-105'
                      : 'bg-white hover:bg-[#EAE2D2] border-[#2D4739]/15 text-[#1E3A2F]'
                  }`}
                  title={`Play ${snd.name}`}
                >
                  <span>{snd.emoji}</span>
                  <span className="text-[11px]">{snd.name}</span>
                  {isPlaying && <span className="text-[9px] animate-ping text-emerald-800">♪</span>}
                </button>
              );
            })}
          </div>

          {/* Row 2: Inbuilt Prompts Navigation & Quick Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
            {/* Prominent Browse Explorer Button */}
            <button
              onClick={() => {
                soundSynth.playGentleChime();
                setShowPromptNavigator(true);
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-[#1E3A2F] hover:bg-[#2D4739] text-[#D4AF37] font-extrabold shrink-0 cursor-pointer shadow-xs border border-[#D4AF37]/50 flex items-center gap-1.5 hover:scale-102 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Browse 35+ Inbuilt Prompts</span>
              <span className="bg-[#D4AF37] text-[#1E3A2F] text-[10px] px-1.5 py-0.2 rounded-full font-black">
                Explore ➔
              </span>
            </button>

            {/* Quick Prompt Chips */}
            {[
              { label: '☕ Morning Red Tea', text: 'Tell me about sitting on the bamboo verandah with a hot cup of Lal Saah in the morning.' },
              { label: '🌸 Bihu Dhol Rhythm', text: 'Can you tell me about the joyful sound of the Dhol drum and Pepa horn during Rongali Bihu?' },
              { label: '🫂 Reassure Me', text: 'I am feeling a little confused and unsure right now. Can you reassure me that I am safe at home?' },
              { label: '👧🏽 Anita & Family', text: 'Tell me about my granddaughter Anita and how much my family loves and cherishes me.' },
              { label: '🌿 Brahmi Leaves', text: 'What are the traditional benefits of fresh Manimuni and Brahmi leaves for memory clarity?' },
              { label: '🎲 Folk Riddle', text: 'Can you give me a fun, simple traditional folk riddle to guess? Make it lighthearted!' },
              { label: '🌲 Shillong Pines', text: 'Take me on an imaginary stroll around Ward’s Lake in Shillong among the tall pine trees.' }
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundSynth.playSoftClick();
                  handleSendMessage(p.text);
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#2D4739]/20 hover:bg-[#EAE2D2] font-semibold text-[#1E3A2F] shrink-0 cursor-pointer shadow-2xs whitespace-nowrap hover:border-[#D4AF37] transition-all"
              >
                {p.label}
              </button>
            ))}

            {/* Surprise Me Quick Button */}
            <button
              onClick={() => {
                soundSynth.playCelebration();
                const random = INBUILT_PROMPTS[Math.floor(Math.random() * INBUILT_PROMPTS.length)];
                handleSendMessage(random.promptText);
              }}
              className="text-xs px-2.5 py-1.5 rounded-full bg-[#D4AF37] hover:bg-[#C66B44] text-[#1E3A2F] hover:text-white font-bold shrink-0 cursor-pointer shadow-2xs flex items-center gap-1 transition-all"
              title="Pick a random nostalgic prompt"
            >
              <Shuffle className="w-3 h-3" />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>

        {/* Main Microphone & Voice-First Input Area */}
        <div className="bg-white border-t border-[#2D4739]/15 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3">
          {/* Huge Voice Microphone for Elderly Usability */}
          <button
            id="btn-companion-mic"
            onClick={toggleListening}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer focus-accessible ${
              isListening
                ? 'bg-[#C66B44] text-white animate-pulse ring-4 ring-[#C66B44]/30'
                : 'bg-[#2D4739] text-[#FDFBF7] hover:bg-[#1E3A2F]'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 text-[#FDFBF7]" />
                <span>Tap to Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 text-[#D4AF37]" />
                <span>🎙️ Tap to Speak</span>
              </>
            )}
          </button>

          {/* Text Input with Send */}
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Or type a question or thought here..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#FDFBF7] border border-[#2D4739]/20 text-base text-[#1E3A2F] placeholder:text-[#52635D]/70 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!userInput.trim()}
              className="p-3.5 rounded-2xl bg-[#D4AF37] text-[#1E3A2F] font-bold hover:bg-[#DFC25D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inbuilt Prompt & Soundscape Navigator Modal */}
        {showPromptNavigator && (
          <InbuiltPromptNavigator
            onSelectPrompt={(text) => {
              setShowPromptNavigator(false);
              handleSendMessage(text);
            }}
            onClose={() => setShowPromptNavigator(false)}
          />
        )}
      </div>
    </div>
  );
};
