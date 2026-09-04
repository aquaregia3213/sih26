-- ==============================================================================
-- Vanika Cognitive Care — Supabase Schema & Storage Configuration
-- ==============================================================================
-- Run this script in your Supabase project's SQL Editor (Dashboard > SQL Editor)
-- to create all tables, indexes, Row Level Security (RLS) policies, and storage.
-- ==============================================================================

-- 1. PROFILES TABLE (Stores Onboarding Wizard, Elder & Caregiver Details)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Elder',
  age INTEGER DEFAULT 72,
  location TEXT DEFAULT 'Guwahati, Assam',
  primary_language TEXT DEFAULT 'Assamese',
  memory_score INTEGER DEFAULT 78,
  attention_score INTEGER DEFAULT 82,
  mood_status TEXT DEFAULT 'Calm',
  streak_days INTEGER DEFAULT 1,
  adherence_rate INTEGER DEFAULT 85,
  weekly_sessions INTEGER DEFAULT 7,
  caregiver_name TEXT,
  caregiver_contact TEXT,
  relationship_to_patient TEXT DEFAULT 'family',
  dementia_stage TEXT DEFAULT 'early',
  hobbies_or_interests TEXT[] DEFAULT ARRAY['Tea gardening', 'Bihu folk music', 'Courtyard walks'],
  hearing_or_vision_impairment TEXT[] DEFAULT ARRAY['none'],
  emergency_contact TEXT,
  preferred_voice_tone TEXT DEFAULT 'gentle-female',
  wake_time TEXT DEFAULT '06:30 AM',
  activity_time TEXT DEFAULT '10:00 AM',
  calibrated_difficulty TEXT DEFAULT 'standard',
  consent_to_data_storage BOOLEAN DEFAULT TRUE,
  consent_to_camera_use BOOLEAN DEFAULT TRUE,
  consent_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MEMORY PHOTOS & PLACES (Family Photos, Hometowns, Questions & Stories)
CREATE TABLE IF NOT EXISTS public.memory_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  person_name TEXT,
  relationship TEXT,
  year TEXT,
  location TEXT, -- Hometown / Memorable Place
  image_url TEXT NOT NULL,
  audio_prompt TEXT,
  options TEXT[] DEFAULT '{}',
  correct_answer TEXT,
  story_note TEXT, -- Personal reminiscence & story for AI Oja
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GARDEN ELEMENTS (Memory Garden Courtyard Growth Stages)
CREATE TABLE IF NOT EXISTS public.garden_elements (
  id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  associated_activity TEXT,
  growth_stage INTEGER DEFAULT 1,
  max_stage INTEGER DEFAULT 4,
  last_watered TEXT DEFAULT 'Today',
  color TEXT DEFAULT '#15803D',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, user_id)
);

-- 4. REMINDERS & DAILY ROUTINE
CREATE TABLE IF NOT EXISTS public.reminders (
  id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  cultural_wrapper TEXT,
  type TEXT DEFAULT 'activity',
  completed BOOLEAN DEFAULT FALSE,
  audio_prompt TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, user_id)
);

-- 5. COGNITIVE HISTORY (Memory & Attention Game Scores)
CREATE TABLE IF NOT EXISTS public.cognitive_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL,
  day_name TEXT NOT NULL,
  memory_score INTEGER NOT NULL,
  attention_score INTEGER NOT NULL,
  mood_index INTEGER DEFAULT 8,
  minutes_active INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Ensure each user can only read, insert, and update their own data.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garden_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cognitive_history ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Memory Photos Policies
CREATE POLICY "Users can read their own memory photos"
  ON public.memory_photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memory photos"
  ON public.memory_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory photos"
  ON public.memory_photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory photos"
  ON public.memory_photos FOR DELETE
  USING (auth.uid() = user_id);

-- Garden Elements Policies
CREATE POLICY "Users can read their garden elements"
  ON public.garden_elements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their garden elements"
  ON public.garden_elements FOR ALL
  USING (auth.uid() = user_id);

-- Reminders Policies
CREATE POLICY "Users can read their reminders"
  ON public.reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their reminders"
  ON public.reminders FOR ALL
  USING (auth.uid() = user_id);

-- Cognitive History Policies
CREATE POLICY "Users can read their cognitive history"
  ON public.cognitive_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their cognitive history"
  ON public.cognitive_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- STORAGE BUCKET: family-photos (For elder portraits & memorable places)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('family-photos', 'family-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public read access for family photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'family-photos');

CREATE POLICY "Authenticated users can upload family photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'family-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their uploaded photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'family-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their uploaded photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'family-photos' 
    AND auth.role() = 'authenticated'
  );
