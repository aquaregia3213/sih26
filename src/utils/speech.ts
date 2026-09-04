import { Language } from '../types';

export interface SpeechSynthOptions {
  language: Language;
  rate?: number; // default 0.85 (calm pacing)
  pitch?: number;
  onEnd?: () => void;
}

// BCF-47 language tag mapping for browser TTS engines
const LANGUAGE_BCP47: Record<Language, string> = {
  English: 'en-IN',
  Assamese: 'as-IN',
  Bodo: 'hi-IN',     // Fallback for Bodo using hi-IN or en-IN with Indian accent
  Khasi: 'en-IN',    // Fallback for Khasi using en-IN
  Mizo: 'en-IN',     // Fallback for Mizo using en-IN
  Nagamese: 'en-IN'  // Fallback for Nagamese using en-IN
};

let activeRecognition: any = null;
let recognitionTimeoutTimer: any = null;

export const speechEngine = {
  speak(text: string, options: SpeechSynthOptions): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis is not supported in this browser.');
      options.onEnd?.();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text of parenthetical notes if present (e.g. "(Namaskar! May your day be wonderful)")
    const spokenText = text.replace(/\([^)]*\)/g, '').trim() || text;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = LANGUAGE_BCP47[options.language] || 'en-IN';
    utterance.rate = options.rate ?? 0.85; // Slow, calm pacing for elderly care
    utterance.pitch = options.pitch ?? 1.0;

    if (options.onEnd) {
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = () => options.onEnd?.();
    }

    // Try to find an Indian accent voice if available
    const voices = window.speechSynthesis.getVoices();
    const IndianVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India'));
    if (IndianVoice) {
      utterance.voice = IndianVoice;
    }

    window.speechSynthesis.speak(utterance);
  },

  stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeechRecognitionAvailable(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  },

  stopListening(): void {
    if (recognitionTimeoutTimer) {
      clearTimeout(recognitionTimeoutTimer);
      recognitionTimeoutTimer = null;
    }
    if (activeRecognition) {
      try {
        activeRecognition.abort();
      } catch (e) {
        // ignore abort error if already stopped
      }
      activeRecognition = null;
    }
  },

  startListening(
    onResult: (transcript: string) => void,
    onError?: (err: any) => void,
    onEnd?: () => void,
    language: Language = 'English'
  ): any {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError?.('Speech recognition is not supported in this browser.');
      return null;
    }

    // Cancel any active running recognition to avoid duplicate listening sessions
    this.stopListening();

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = LANGUAGE_BCP47[language] || 'en-IN';

    activeRecognition = recognition;

    // Set a safety timeout of 15s to auto-stop hanging sessions on mobile browsers
    recognitionTimeoutTimer = setTimeout(() => {
      console.log('[SpeechEngine] Recognition 15s timeout reached, closing listener cleanly.');
      this.stopListening();
      onEnd?.();
    }, 15000);

    recognition.onresult = (event: any) => {
      if (recognitionTimeoutTimer) {
        clearTimeout(recognitionTimeoutTimer);
        recognitionTimeoutTimer = null;
      }
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      if (recognitionTimeoutTimer) {
        clearTimeout(recognitionTimeoutTimer);
        recognitionTimeoutTimer = null;
      }
      console.warn('[SpeechEngine] Recognition error:', event.error);
      onError?.(event.error);
    };

    recognition.onend = () => {
      if (recognitionTimeoutTimer) {
        clearTimeout(recognitionTimeoutTimer);
        recognitionTimeoutTimer = null;
      }
      activeRecognition = null;
      onEnd?.();
    };

    try {
      recognition.start();
    } catch (err) {
      console.warn('[SpeechEngine] Failed to start speech recognition:', err);
      onError?.(err);
      activeRecognition = null;
    }

    return recognition;
  }
};


export const VoiceAssistant = {
  speak(text: string, language: Language = 'English', speed: 'slow' | 'normal' = 'slow'): Promise<void> {
    return new Promise((resolve) => {
      speechEngine.speak(text, {
        language,
        rate: speed === 'slow' ? 0.85 : 1.0,
        onEnd: resolve
      });
    });
  },
  stopSpeaking(): void {
    speechEngine.stop();
  },
  startListening(onResult: (text: string) => void, onError?: (err: any) => void, language: Language = 'English'): any {
    return speechEngine.startListening(onResult, onError, undefined, language);
  }
};

