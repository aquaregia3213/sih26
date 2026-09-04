import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  PatientProfile, 
  MemoryPhotoItem, 
  GardenElement, 
  ReminderItem, 
  CognitiveDataPoint 
} from '../../types';

export const supabaseSync = {
  /**
   * Syncs elder patient profile and onboarding answers to Supabase.
   */
  async syncUserProfile(userId: string, profile: PatientProfile): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;

    try {
      const payload = {
        id: userId,
        name: profile.name,
        age: profile.age,
        location: profile.location,
        primary_language: profile.primaryLanguage,
        memory_score: profile.memoryScore,
        attention_score: profile.attentionScore,
        mood_status: profile.moodStatus,
        streak_days: profile.streakDays,
        adherence_rate: profile.adherenceRate,
        weekly_sessions: profile.weeklySessions,
        caregiver_name: profile.caregiverName,
        caregiver_contact: profile.caregiverContact,
        relationship_to_patient: profile.relationshipToPatient,
        dementia_stage: profile.dementiaStage,
        hobbies_or_interests: profile.hobbiesOrInterests || [],
        hearing_or_vision_impairment: profile.hearingOrVisionImpairment || ['none'],
        emergency_contact: profile.emergencyContact,
        preferred_voice_tone: profile.preferredVoiceTone,
        wake_time: profile.wakeTime,
        activity_time: profile.activityTime,
        calibrated_difficulty: profile.calibratedDifficulty,
        consent_to_data_storage: profile.consentToDataStorage ?? true,
        consent_to_camera_use: profile.consentToCameraUse ?? true,
        consent_timestamp: profile.consentTimestamp || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('[SupabaseSync] Failed to sync profile:', error.message);
      }
    } catch (err) {
      console.warn('[SupabaseSync] Profile sync exception:', err);
    }
  },

  /**
   * Fetches the user profile from Supabase on login.
   */
  async fetchUserProfile(userId: string): Promise<PatientProfile | null> {
    if (!isSupabaseConfigured() || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.name,
        age: data.age,
        location: data.location,
        primaryLanguage: data.primary_language,
        memoryScore: data.memory_score,
        attentionScore: data.attention_score,
        moodStatus: data.mood_status,
        streakDays: data.streak_days,
        adherenceRate: data.adherence_rate,
        lastSynced: new Date().toISOString(),
        weeklySessions: data.weekly_sessions,
        caregiverName: data.caregiver_name,
        caregiverContact: data.caregiver_contact,
        relationshipToPatient: data.relationship_to_patient,
        dementiaStage: data.dementia_stage,
        hobbiesOrInterests: data.hobbies_or_interests || [],
        hearingOrVisionImpairment: data.hearing_or_vision_impairment || ['none'],
        emergencyContact: data.emergency_contact,
        consentToDataStorage: data.consent_to_data_storage,
        consentToCameraUse: data.consent_to_camera_use,
        consentTimestamp: data.consent_timestamp,
        preferredVoiceTone: data.preferred_voice_tone,
        wakeTime: data.wake_time,
        activityTime: data.activity_time,
        calibratedDifficulty: data.calibrated_difficulty
      };
    } catch (err) {
      console.warn('[SupabaseSync] Error fetching profile:', err);
      return null;
    }
  },

  /**
   * Saves a new or modified memory photo / family place to Supabase.
   */
  async saveMemoryPhoto(userId: string, photo: MemoryPhotoItem): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;

    try {
      const payload = {
        user_id: userId,
        title: photo.title,
        person_name: photo.personName,
        relationship: photo.relationship,
        year: photo.year,
        location: photo.location,
        image_url: photo.imageUrl,
        audio_prompt: photo.audioPrompt,
        options: photo.options || [],
        correct_answer: photo.correctAnswer,
        story_note: photo.storyNote
      };

      const { error } = await supabase
        .from('memory_photos')
        .insert(payload);

      if (error) {
        console.warn('[SupabaseSync] Error saving memory photo:', error.message);
      }
    } catch (err) {
      console.warn('[SupabaseSync] Memory photo save exception:', err);
    }
  },

  /**
   * Fetches user's custom uploaded memory photos and places.
   */
  async fetchMemoryPhotos(userId: string): Promise<MemoryPhotoItem[]> {
    if (!isSupabaseConfigured() || !userId) return [];

    try {
      const { data, error } = await supabase
        .from('memory_photos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((d: any) => ({
        id: d.id,
        title: d.title,
        personName: d.person_name || '',
        relationship: d.relationship || '',
        year: d.year || '',
        location: d.location || '',
        imageUrl: d.image_url,
        audioPrompt: d.audio_prompt || '',
        options: d.options || [],
        correctAnswer: d.correct_answer || '',
        storyNote: d.story_note || ''
      }));
    } catch (err) {
      console.warn('[SupabaseSync] Error fetching memory photos:', err);
      return [];
    }
  },

  /**
   * Syncs courtyard plant growth stages to Supabase.
   */
  async syncGardenElements(userId: string, elements: GardenElement[]): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;

    try {
      const rows = elements.map(el => ({
        id: el.id,
        user_id: userId,
        type: el.type,
        title: el.title,
        associated_activity: el.associatedActivity,
        growth_stage: el.growthStage,
        max_stage: el.maxStage,
        last_watered: el.lastWatered,
        color: el.color,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('garden_elements')
        .upsert(rows, { onConflict: 'id,user_id' });

      if (error) {
        console.warn('[SupabaseSync] Garden sync error:', error.message);
      }
    } catch (err) {
      console.warn('[SupabaseSync] Garden sync exception:', err);
    }
  },

  /**
   * Fetches garden elements for the logged-in user.
   */
  async fetchGardenElements(userId: string): Promise<GardenElement[]> {
    if (!isSupabaseConfigured() || !userId) return [];

    try {
      const { data, error } = await supabase
        .from('garden_elements')
        .select('*')
        .eq('user_id', userId);

      if (error || !data || data.length === 0) return [];

      return data.map((d: any) => ({
        id: d.id,
        type: d.type as any,
        title: d.title,
        associatedActivity: d.associated_activity,
        growthStage: d.growth_stage,
        maxStage: d.max_stage,
        lastWatered: d.last_watered,
        color: d.color
      }));
    } catch (err) {
      console.warn('[SupabaseSync] Error fetching garden elements:', err);
      return [];
    }
  },

  /**
   * Records a game score or cognitive session to cloud.
   */
  async recordCognitiveScore(userId: string, point: CognitiveDataPoint): Promise<void> {
    if (!isSupabaseConfigured() || !userId) return;

    try {
      await supabase.from('cognitive_history').insert({
        user_id: userId,
        date: point.date,
        day_name: point.dayName,
        memory_score: point.memoryScore,
        attention_score: point.attentionScore,
        mood_index: point.moodIndex,
        minutes_active: point.minutesActive
      });
    } catch (err) {
      console.warn('[SupabaseSync] Cognitive history save exception:', err);
    }
  }
};
