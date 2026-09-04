import React, { useState } from 'react';
import { Bot, Play, CheckCircle2, Cpu, Wrench, Shield, Volume2, X, Sparkles, Activity, Layers } from 'lucide-react';
import { Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { OjaAgenticWorkflowEngine, AgenticExecutionResult } from '../../utils/ojaAgenticEngine';
import { getTranslation } from '../../utils/translations';

interface OjaAgenticWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export const OjaAgenticWorkflowModal: React.FC<OjaAgenticWorkflowModalProps> = ({
  isOpen,
  onClose,
  currentLanguage
}) => {
  const t = getTranslation(currentLanguage);

  const [inputPrompt, setInputPrompt] = useState('I am feeling a bit confused about where I am today...');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<AgenticExecutionResult | null>(null);

  if (!isOpen) return null;

  const presetPrompts = [
    'I am feeling a bit confused about where I am today...',
    'Can you play some Rongali Bihu music and tell me a tea story?',
    'I am feeling anxious about taking my morning medicine...',
    'Namaskar Oja! I want to look at photos from Ward’s Lake.'
  ];

  const handleRunWorkflow = async (promptToRun?: string) => {
    const textToUse = promptToRun || inputPrompt;
    if (!textToUse.trim()) return;

    soundSynth.playGentleChime();
    setIsRunning(true);
    setExecutionResult(null);

    // Simulate multi-agent processing delay for real-time visualization
    setTimeout(async () => {
      const result = await OjaAgenticWorkflowEngine.runWorkflow(textToUse, currentLanguage);
      setExecutionResult(result);
      setIsRunning(false);

      // Synthesize final voice output
      const utterance = new SpeechSynthesisUtterance(result.finalResponseSpeech);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#FDFBF7] dark:bg-[#182E23] text-[#1E3A2F] dark:text-[#FDFBF7] border-2 border-[#D4AF37] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-[#1E3A2F] text-[#FDFBF7] flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center font-bold text-xl shadow-md">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#1E3A2F]">
                  Multi-Agent Autonomous AI
                </span>
                <span className="text-xs text-[#D4AF37] font-bold">Oja Core Engine</span>
              </div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#FDFBF7]">
                Oja Agentic AI Workflow & Tool Execution Visualizer
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundSynth.playSoftClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#2D4739] hover:bg-[#3E6250] text-[#FDFBF7] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Preset Elder Inputs */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-[#C66B44] dark:text-[#D4AF37]">
              Select Elder Voice Input / Prompt to Test Agentic Loop:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputPrompt(prompt);
                    handleRunWorkflow(prompt);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    inputPrompt === prompt
                      ? 'bg-[#1E3A2F] text-[#FDFBF7] border-[#D4AF37] shadow-sm'
                      : 'bg-white dark:bg-[#0F1E17] border-[#1E3A2F]/20 dark:border-[#D4AF37]/30 text-[#1E3A2F] dark:text-[#FDFBF7] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <span className="line-clamp-1">"{prompt}"</span>
                  <Play className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Enter custom elder voice prompt..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-white dark:bg-[#0F1E17] text-xs sm:text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <button
              onClick={() => handleRunWorkflow()}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer border border-[#D4AF37] shrink-0"
            >
              {isRunning ? (
                <Cpu className="w-4 h-4 text-[#D4AF37] animate-spin" />
              ) : (
                <Bot className="w-4 h-4 text-[#D4AF37]" />
              )}
              <span>{isRunning ? 'Running Agentic Loop...' : 'Run Agentic Loop'}</span>
            </button>
          </div>

          {/* Multi-Agent Execution Visualizer Pipeline */}
          {isRunning && (
            <div className="p-8 rounded-2xl bg-[#0F1E17] border-2 border-[#D4AF37] text-center space-y-3 shadow-xl animate-pulse">
              <Cpu className="w-10 h-10 text-[#D4AF37] animate-spin mx-auto" />
              <h3 className="font-heading font-extrabold text-base text-[#FDFBF7]">
                Autonomous Multi-Agent Loop In Progress...
              </h3>
              <p className="text-xs text-[#EAE2D2]/80">
                Perception Agent ➔ Memory Vault ➔ Goal Planner ➔ Tool Execution Engine ➔ Reflection Agent
              </p>
            </div>
          )}

          {/* Agentic Execution Results Display */}
          {executionResult && !isRunning && (
            <div className="space-y-5 animate-fadeIn">
              {/* Top Pipeline Status Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200">
                  <span className="text-[10px] font-black uppercase block tracking-wider text-emerald-400">
                    Detected Emotion
                  </span>
                  <span className="font-heading font-extrabold text-sm sm:text-base">
                    {executionResult.detectedEmotion}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200">
                  <span className="text-[10px] font-black uppercase block tracking-wider text-amber-400">
                    Detected Dialect
                  </span>
                  <span className="font-heading font-extrabold text-sm sm:text-base">
                    {executionResult.detectedDialect}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-200">
                  <span className="text-[10px] font-black uppercase block tracking-wider text-teal-400">
                    Tools Dispatched
                  </span>
                  <span className="font-heading font-extrabold text-sm sm:text-base">
                    {executionResult.toolCalls.length} Autonomous Tools
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200">
                  <span className="text-[10px] font-black uppercase block tracking-wider text-rose-400">
                    Caregiver Alert
                  </span>
                  <span className="font-heading font-extrabold text-sm sm:text-base">
                    Logged & Synced
                  </span>
                </div>
              </div>

              {/* 5-Agent Execution Pipeline Trace */}
              <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border-2 border-[#1E3A2F]/15 dark:border-[#D4AF37]/30 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44] dark:text-[#D4AF37]">
                  <Layers className="w-4 h-4" />
                  <span>5-Agent Execution Trace Log</span>
                </div>

                <div className="space-y-2.5">
                  {executionResult.agentSteps.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#FDFBF7] dark:bg-[#182E23] border border-[#1E3A2F]/10 dark:border-[#D4AF37]/20 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#1E3A2F] text-[#D4AF37] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-extrabold text-xs text-[#1E3A2F] dark:text-[#D4AF37]">
                            {step.agentName} • {step.action}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        </div>
                        <p className="text-xs text-[#2D4739] dark:text-[#EAE2D2] mt-0.5 font-medium">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool Execution Engine Trace */}
              <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border-2 border-[#1E3A2F]/15 dark:border-[#D4AF37]/30 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44] dark:text-[#D4AF37]">
                  <Wrench className="w-4 h-4" />
                  <span>Autonomous Tool Calls Executed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {executionResult.toolCalls.map((tool, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#152B23] border border-[#D4AF37]/30 text-[#FDFBF7]">
                      <span className="text-[10px] font-black uppercase text-[#D4AF37] block">
                        Tool: {tool.toolName}
                      </span>
                      <p className="text-xs font-semibold text-[#EAE2D2] mt-1">
                        {tool.result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Audio Response Banner */}
              <div className="p-4 rounded-2xl bg-[#1E3A2F] text-[#FDFBF7] border-2 border-[#D4AF37] flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-6 h-6 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block">
                      Synthesized Autonomous Elder Voice Response:
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#FDFBF7]">
                      "{executionResult.finalResponseSpeech}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(executionResult.finalResponseSpeech);
                    utterance.rate = 0.85;
                    window.speechSynthesis.speak(utterance);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C66B44] text-[#1E3A2F] hover:text-white font-extrabold text-xs transition-colors cursor-pointer shrink-0"
                >
                  Replay Voice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
