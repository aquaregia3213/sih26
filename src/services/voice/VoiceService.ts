import { Language } from '../../types';
import { VoiceState, VoiceServiceOptions, VoiceActionResult } from './voiceTypes';
import { VoiceIntentService } from './VoiceIntentService';

export class VoiceService {
  private static activeRecognition: any = null;
  private static currentState: VoiceState = 'IDLE';
  private static listeners: Array<(state: VoiceState) => void> = [];
  private static timeoutTimer: any = null;

  // BCP-47 language tag mapping
  private static BCP47_MAP: Record<string, string> = {
    English: 'en-IN',
    Hindi: 'hi-IN',
    Assamese: 'as-IN',
    Bengali: 'bn-IN',
    Nepali: 'ne-NP',
    Manipuri: 'mni-IN',
    Bodo: 'hi-IN',
    Khasi: 'en-IN',
    Mizo: 'en-IN',
    Nagamese: 'en-IN',
  };

  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  public static getState(): VoiceState {
    return this.currentState;
  }

  public static setState(state: VoiceState): void {
    this.currentState = state;
    this.listeners.forEach((l) => l(state));
  }

  public static subscribeState(listener: (state: VoiceState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
    Starts speech recognition session cleanly with timeout and permission error handling.
   */
  public static startListening(options: VoiceServiceOptions): any {
    if (!this.isSpeechRecognitionSupported()) {
      this.setState('UNSUPPORTED');
      options.onError?.('Speech recognition is not supported in this browser.');
      return null;
    }

    // Cancel any running listening session to avoid duplicate listeners
    this.stopListening();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = this.BCP47_MAP[options.language] || 'en-IN';

    this.activeRecognition = recognition;
    this.setState('LISTENING');

    // 15-second bounded timeout to auto-stop hanging sessions on mobile devices
    this.timeoutTimer = setTimeout(() => {
      this.stopListening();
      this.setState('IDLE');
    }, 15000);

    recognition.onresult = (event: any) => {
      this.clearTimer();
      this.setState('PROCESSING');

      const transcript = event.results?.[0]?.[0]?.transcript || '';
      const actionResult = VoiceIntentService.parseIntent(transcript);

      if (actionResult.success) {
        this.setState('SUCCESS');
        options.onResult?.(actionResult);
      } else {
        this.setState('ERROR');
        options.onError?.(actionResult.message);
      }
    };

    recognition.onerror = (event: any) => {
      this.clearTimer();
      const errType = event.error || 'unknown_error';

      if (errType === 'not-allowed' || errType === 'permission-denied') {
        this.setState('PERMISSION_DENIED');
        options.onError?.('Microphone permission is required to use voice commands.');
      } else {
        this.setState('ERROR');
        options.onError?.(`Speech recognition error: ${errType}`);
      }
    };

    recognition.onend = () => {
      this.clearTimer();
      this.activeRecognition = null;
      if (this.currentState === 'LISTENING') {
        this.setState('IDLE');
      }
    };

    try {
      recognition.start();
    } catch (err) {
      this.clearTimer();
      this.setState('ERROR');
      options.onError?.('Failed to start speech recognition listener.');
    }

    return recognition;
  }

  public static stopListening(): void {
    this.clearTimer();
    if (this.activeRecognition) {
      try {
        this.activeRecognition.abort();
      } catch {}
      this.activeRecognition = null;
    }
    if (this.currentState === 'LISTENING' || this.currentState === 'PROCESSING') {
      this.setState('IDLE');
    }
  }

  /**
    Speech synthesis API with accessibility controls (voiceSpeed & voiceGuideEnabled).
   */
  public static speak(text: string, options: { language: Language; voiceSpeed?: 'slow' | 'normal'; voiceGuideEnabled?: boolean }): Promise<void> {
    return new Promise((resolve) => {
      if (options.voiceGuideEnabled === false) {
        return resolve(); // Honor voiceGuideEnabled = false preference
      }

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return resolve();
      }

      // Cancel ongoing TTS speech
      window.speechSynthesis.cancel();

      const spokenText = text.replace(/\([^)]*\)/g, '').trim() || text;
      const utterance = new SpeechSynthesisUtterance(spokenText);

      utterance.lang = this.BCP47_MAP[options.language] || 'en-IN';
      utterance.rate = options.voiceSpeed === 'slow' ? 0.85 : 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  public static cancelSpeech(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  private static clearTimer(): void {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }
}
