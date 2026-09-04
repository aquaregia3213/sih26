import { GoogleGenAI } from '@google/genai';
import { AIRecommendationRequest, RawAIRecommendationOutput, CompanionChatInput, CompanionChatResponse } from './aiTypes';
import { AIPromptBuilder } from './aiPromptBuilder';
import { AIResponseParser } from './aiResponseParser';

export class GeminiService {
  private static client: any = null;
  private static mockClient: any = null;
  private static DEFAULT_MODEL = 'gemini-2.5-flash';
  private static TIMEOUT_MS = 5000;

  /**
    Allows setting a mock client for automated testing without calling external APIs or wasting quota.
   */
  public static setMockClient(mock: any): void {
    this.mockClient = mock;
  }

  /**
    Lazy client initialization using process.env.GEMINI_API_KEY.
   */
  public static getClient(): any {
    if (this.mockClient) {
      return this.mockClient;
    }
    if (!this.client && process.env.GEMINI_API_KEY) {
      try {
        this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } catch (err) {
        console.error('[GeminiService] Failed to initialize GoogleGenAI client:', err);
        this.client = null;
      }
    }
    return this.client;
  }

  /**
    Generates a structured activity recommendation using Gemini.
    IDEMPOTENT & RESILIENT: Returns null on timeout/error/missing key so caller falls back to RuleBasedEngine.
   */
  public static async generateStructuredRecommendation(
    request: AIRecommendationRequest
  ): Promise<RawAIRecommendationOutput | null> {
    const ai = this.getClient();
    if (!ai) {
      return null; // Key missing or unconfigured
    }

    try {
      const promptText = AIPromptBuilder.buildRecommendationPrompt(request);

      const apiCall = ai.models.generateContent({
        model: this.DEFAULT_MODEL,
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }],
          },
        ],
      });

      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), this.TIMEOUT_MS);
      });

      const response: any = await Promise.race([apiCall, timeoutPromise]);

      if (!response || !response.text) {
        console.warn('[GeminiService] AI recommendation request timed out or returned empty response. Falling back.');
        return null;
      }

      return AIResponseParser.parseRecommendationResponse(response.text, request.eligibleGames);
    } catch (error) {
      console.warn('[GeminiService] AI recommendation generation failed. Activating rule-based fallback.');
      return null;
    }
  }

  /**
    Generates companion chat response using Gemini with regional prompts and fallback responses.
   */
  public static async generateCompanionChat(input: CompanionChatInput): Promise<CompanionChatResponse> {
    const ai = this.getClient();
    const language = input.language || 'English';
    const emotionState = input.emotionState || 'calm';

    if (ai) {
      try {
        const { userMessage } = AIPromptBuilder.buildCompanionPrompt(input);

        const apiCall = ai.models.generateContent({
          model: this.DEFAULT_MODEL,
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }],
            },
          ],
        });

        const timeoutPromise = new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), this.TIMEOUT_MS);
        });

        const response: any = await Promise.race([apiCall, timeoutPromise]);

        if (response && response.text && response.text.trim()) {
          return {
            reply: response.text.trim(),
            source: 'gemini-ai',
            emotionGuidance: emotionState === 'frustrated' ? 'soothing' : 'joyful',
          };
        }
      } catch (err) {
        console.warn('[GeminiService] Companion chat API call failed. Using local companion response.');
      }
    }

    // High quality culturally authentic fallback when API key is unconfigured or call fails
    const fallbackResponses: Record<string, string[]> = {
      English: [
        'Good morning, my dear friend. The morning sun over the green hills brings peace. Let us have a gentle sip of tea and remember a happy moment together.',
        'You are doing wonderfully today. Take your time, there is no hurry in our digital courtyard. Shall we look at some family photographs?',
        'Listen to the soft birds chirping outside. Breathe in slowly... and breathe out with ease. You are safe and loved.',
        'Well remembered! Your mind is like a clear mountain stream in Shillong. Let us play a little memory game together.',
      ],
      Assamese: [
        'নমস্কাৰ! আপোনাৰ দিনটো বৰ সুন্দৰ হওক। আহক, অলপ সময় লৈ কথা পাতোঁ।',
        'আপুনি বৰ সুন্দৰকৈ মনত পেলালে! মনটো শান্ত ৰাখক, সকলো ঠিকেই আছে।',
      ],
      Khasi: [
        'Khublei shibun! Nga don hangne bad phi. To ngin pynleit jingmut lang mynta.',
      ],
      Mizo: [
        'Chibai! Vawiin chu ni nuam tak a ni e. Hahdam deuhin awm rawh.',
      ],
    };

    const list = fallbackResponses[language] || fallbackResponses['English'];
    const fallbackReply = list[Math.floor(Math.random() * list.length)];

    return {
      reply: fallbackReply,
      source: 'local-companion',
      emotionGuidance: 'soothing',
    };
  }
}
