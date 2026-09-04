import { VoiceIntent, VoiceActionResult } from './voiceTypes';

export class VoiceIntentService {
  /**
    Parses a recognized speech transcript and maps it to a safe, controlled VoiceIntent.
    STRICT SECURITY GATE: Rejects privileged operations (password changes, role escalation, data deletion).
   */
  public static parseIntent(transcript: string): VoiceActionResult {
    if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
      return {
        intent: 'UNKNOWN',
        message: "I didn't catch that. Please try speaking again.",
        success: false,
      };
    }

    const lower = transcript.toLowerCase().trim();

    // Security Gatekeeper: Disallowed actions
    const forbiddenKeywords = ['password', 'admin', 'role', 'delete account', 'change score', 'modify score', 'auth token'];
    if (forbiddenKeywords.some((keyword) => lower.includes(keyword))) {
      return {
        intent: 'UNKNOWN',
        message: 'That operation cannot be executed by voice commands for security reasons.',
        success: false,
      };
    }

    // 1. START_TODAYS_ACTIVITY
    if (
      lower.includes('start') ||
      lower.includes('play') ||
      lower.includes('today') ||
      lower.includes('खेल') ||
      lower.includes('আৰম্ভ') ||
      lower.includes('খেলক')
    ) {
      return {
        intent: 'START_TODAYS_ACTIVITY',
        targetView: 'patient-app',
        message: "Opening Today's Cognitive Activity Courtyard.",
        success: true,
      };
    }

    // 2. OPEN_PROGRESS
    if (
      lower.includes('progress') ||
      lower.includes('score') ||
      lower.includes('analytics') ||
      lower.includes('प्रगति') ||
      lower.includes('অগ্রগতি')
    ) {
      return {
        intent: 'OPEN_PROGRESS',
        targetView: 'progress',
        message: 'Opening Cognitive Progress & Performance Analytics.',
        success: true,
      };
    }

    // 3. OPEN_ROUTINE
    if (
      lower.includes('routine') ||
      lower.includes('task') ||
      lower.includes('reminder') ||
      lower.includes('दिनचर्या') ||
      lower.includes('দিনচৰ্যা')
    ) {
      return {
        intent: 'OPEN_ROUTINE',
        targetView: 'daily-routine',
        message: "Opening Daily Routine & Care Reminders.",
        success: true,
      };
    }

    // 4. OPEN_GAMES
    if (
      lower.includes('all games') ||
      lower.includes('games hub') ||
      lower.includes('activities') ||
      lower.includes('गतिविधि')
    ) {
      return {
        intent: 'OPEN_GAMES',
        targetView: 'games-hub',
        message: 'Opening Cognitive Games Hub.',
        success: true,
      };
    }

    // 5. OPEN_PROFILE
    if (
      lower.includes('profile') ||
      lower.includes('account') ||
      lower.includes('setting') ||
      lower.includes('प्रोफ़ाइल')
    ) {
      return {
        intent: 'OPEN_PROFILE',
        targetView: 'settings',
        message: 'Opening Account & Accessibility Settings.',
        success: true,
      };
    }

    // 6. CHANGE_LANGUAGE
    if (
      lower.includes('language') ||
      lower.includes('bhasha') ||
      lower.includes('भाषा') ||
      lower.includes('ভাষা')
    ) {
      return {
        intent: 'CHANGE_LANGUAGE',
        targetView: 'settings',
        message: 'Opening Language & Regional Preferences.',
        success: true,
      };
    }

    // 7. HELP
    if (
      lower.includes('help') ||
      lower.includes('madad') ||
      lower.includes('सहाय') ||
      lower.includes('সাহায্য')
    ) {
      return {
        intent: 'HELP',
        message: 'Supported voice commands: Start activity, View progress, Open routine, All games, Settings, Language.',
        success: true,
      };
    }

    // Default Unknown Command
    return {
      intent: 'UNKNOWN',
      message: "I didn't understand that command. Say 'Help' for supported options.",
      success: false,
    };
  }
}
