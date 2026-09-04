import { Language } from '../../types';

export type VoiceState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'ERROR'
  | 'PERMISSION_DENIED'
  | 'UNSUPPORTED';

export type VoiceIntent =
  | 'START_TODAYS_ACTIVITY'
  | 'OPEN_PROGRESS'
  | 'OPEN_ROUTINE'
  | 'OPEN_GAMES'
  | 'OPEN_PROFILE'
  | 'CHANGE_LANGUAGE'
  | 'HELP'
  | 'UNKNOWN';

export interface VoiceActionResult {
  intent: VoiceIntent;
  targetView?: string;
  message: string;
  success: boolean;
}

export interface VoiceServiceOptions {
  language: Language;
  voiceSpeed?: 'slow' | 'normal';
  voiceGuideEnabled?: boolean;
  onStateChange?: (state: VoiceState) => void;
  onResult?: (result: VoiceActionResult) => void;
  onError?: (errorMessage: string) => void;
}
