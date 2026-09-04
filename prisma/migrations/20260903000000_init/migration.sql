-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ELDER', 'CAREGIVER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AppLanguage" AS ENUM ('ENGLISH', 'ASSAMESE', 'BODO', 'KHASI', 'MIZO', 'NAGAMESE', 'HINDI', 'BENGALI', 'NEPALI', 'MANIPURI');

-- CreateEnum
CREATE TYPE "FontScale" AS ENUM ('NORMAL', 'LARGE', 'EXTRA_LARGE');

-- CreateEnum
CREATE TYPE "VoicePace" AS ENUM ('SLOW', 'NORMAL');

-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('PENDING', 'ACTIVE', 'REVOKED', 'DECLINED');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('PHOTO_RECALL', 'CARD_MATCH', 'SEQUENCE_ORDER', 'SPOT_DIFFERENCE', 'HERITAGE_QUIZ', 'PATTERN_COMPLETE');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'PAUSED');

-- CreateEnum
CREATE TYPE "RoutinePeriod" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- CreateEnum
CREATE TYPE "RoutineCategory" AS ENUM ('MEDICATION', 'HYDRATION', 'COGNITIVE_ACTIVITY', 'MEAL', 'WALK', 'REST', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ACTIVITY_REMINDER', 'MEDICATION_REMINDER', 'ACHIEVEMENT', 'CAREGIVER_ALERT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationSeverity" AS ENUM ('INFO', 'ADVISORY', 'URGENT');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(32),
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ELDER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "full_name" VARCHAR(128) NOT NULL,
    "nickname" VARCHAR(64),
    "date_of_birth" DATE,
    "gender" VARCHAR(32),
    "primary_language" "AppLanguage" NOT NULL DEFAULT 'ENGLISH',
    "location" VARCHAR(128) NOT NULL DEFAULT 'Guwahati, Assam',
    "emergency_phone" VARCHAR(32),
    "reminiscence_topic" TEXT,
    "notes" TEXT,
    "avatar_url" VARCHAR(512),
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessibility_settings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "font_size" "FontScale" NOT NULL DEFAULT 'NORMAL',
    "high_contrast" BOOLEAN NOT NULL DEFAULT false,
    "dark_mode" BOOLEAN NOT NULL DEFAULT false,
    "reduced_motion" BOOLEAN NOT NULL DEFAULT false,
    "voice_speed" "VoicePace" NOT NULL DEFAULT 'SLOW',
    "voice_guide_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "accessibility_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "daily_activity_goal" INTEGER NOT NULL DEFAULT 2,
    "preferred_practice_areas" VARCHAR(64)[] DEFAULT ARRAY['memory', 'attention']::VARCHAR(64)[],
    "audio_feedback_enabled" BOOLEAN NOT NULL DEFAULT true,
    "offline_sync_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_relationships" (
    "id" UUID NOT NULL,
    "elder_user_id" UUID NOT NULL,
    "caregiver_user_id" UUID NOT NULL,
    "relationship_type" VARCHAR(64) NOT NULL,
    "status" "RelationshipStatus" NOT NULL DEFAULT 'PENDING',
    "can_view_analytics" BOOLEAN NOT NULL DEFAULT true,
    "can_manage_routines" BOOLEAN NOT NULL DEFAULT true,
    "can_upload_memories" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "caregiver_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_categories" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(64) NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "game_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(64) NOT NULL,
    "game_type" "GameType" NOT NULL,
    "base_difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
    "estimated_duration_seconds" INTEGER NOT NULL DEFAULT 300,
    "config_schema" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_content_items" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "owner_user_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "prompt_text" TEXT NOT NULL,
    "audio_prompt_url" VARCHAR(512),
    "media_url" VARCHAR(512),
    "secondary_media_url" VARCHAR(512),
    "difficulty_level" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
    "cultural_region" VARCHAR(64) DEFAULT 'Universal',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "game_content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_options" (
    "id" UUID NOT NULL,
    "content_item_id" UUID NOT NULL,
    "option_text" TEXT NOT NULL,
    "option_media_url" VARCHAR(512),
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "explanation" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "session_status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "difficulty_used" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ,
    "duration_seconds" INTEGER,
    "offline_synced" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submitted_answers" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "content_item_id" UUID NOT NULL,
    "selected_option_id" UUID,
    "voice_input_transcript" TEXT,
    "is_correct" BOOLEAN NOT NULL,
    "response_time_ms" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submitted_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_results" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "score_obtained" INTEGER NOT NULL,
    "total_possible_score" INTEGER NOT NULL,
    "accuracy_percentage" DECIMAL(5,2) NOT NULL,
    "memory_domain_score" INTEGER NOT NULL DEFAULT 0,
    "attention_domain_score" INTEGER NOT NULL DEFAULT 0,
    "pattern_domain_score" INTEGER NOT NULL DEFAULT 0,
    "strengths_summary" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "improvements_summary" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_progress_summaries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "summary_date" DATE NOT NULL,
    "total_activities_completed" INTEGER NOT NULL DEFAULT 0,
    "total_active_seconds" INTEGER NOT NULL DEFAULT 0,
    "avg_memory_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "avg_attention_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "avg_pattern_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "streak_count" INTEGER NOT NULL DEFAULT 0,
    "adherence_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "daily_progress_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "difficulty_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "previous_difficulty" "DifficultyLevel" NOT NULL,
    "new_difficulty" "DifficultyLevel" NOT NULL,
    "trigger_reason" VARCHAR(255) NOT NULL,
    "adjusted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "difficulty_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_recommendations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "recommended_game_id" UUID NOT NULL,
    "reason_code" VARCHAR(64) NOT NULL,
    "recommendation_text" TEXT NOT NULL,
    "priority_score" DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    "is_dismissed" BOOLEAN NOT NULL DEFAULT false,
    "generated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ,

    CONSTRAINT "activity_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_tasks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "icon" VARCHAR(32) NOT NULL DEFAULT '📋',
    "scheduled_time" TIME NOT NULL,
    "period" "RoutinePeriod" NOT NULL,
    "category" "RoutineCategory" NOT NULL DEFAULT 'OTHER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "routine_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_task_logs" (
    "id" UUID NOT NULL,
    "routine_task_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "scheduled_date" DATE NOT NULL,
    "completed_at" TIMESTAMPTZ,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_by_user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "routine_task_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "severity" "NotificationSeverity" NOT NULL DEFAULT 'INFO',
    "title" VARCHAR(128) NOT NULL,
    "message" TEXT NOT NULL,
    "icon" VARCHAR(32) NOT NULL DEFAULT '🔔',
    "action_url" VARCHAR(255),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "profiles_user_id_idx" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "profiles_primary_language_idx" ON "profiles"("primary_language");

-- CreateIndex
CREATE UNIQUE INDEX "accessibility_settings_user_id_key" ON "accessibility_settings"("user_id");

-- CreateIndex
CREATE INDEX "accessibility_settings_user_id_idx" ON "accessibility_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "user_preferences_user_id_idx" ON "user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "caregiver_relationships_elder_user_id_idx" ON "caregiver_relationships"("elder_user_id");

-- CreateIndex
CREATE INDEX "caregiver_relationships_caregiver_user_id_idx" ON "caregiver_relationships"("caregiver_user_id");

-- CreateIndex
CREATE INDEX "caregiver_relationships_status_idx" ON "caregiver_relationships"("status");

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_relationships_elder_user_id_caregiver_user_id_key" ON "caregiver_relationships"("elder_user_id", "caregiver_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_categories_slug_key" ON "game_categories"("slug");

-- CreateIndex
CREATE INDEX "game_categories_slug_idx" ON "game_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");

-- CreateIndex
CREATE INDEX "games_category_id_idx" ON "games"("category_id");

-- CreateIndex
CREATE INDEX "games_slug_idx" ON "games"("slug");

-- CreateIndex
CREATE INDEX "games_game_type_idx" ON "games"("game_type");

-- CreateIndex
CREATE INDEX "game_content_items_game_id_idx" ON "game_content_items"("game_id");

-- CreateIndex
CREATE INDEX "game_content_items_owner_user_id_idx" ON "game_content_items"("owner_user_id");

-- CreateIndex
CREATE INDEX "game_content_items_difficulty_level_idx" ON "game_content_items"("difficulty_level");

-- CreateIndex
CREATE INDEX "game_options_content_item_id_idx" ON "game_options"("content_item_id");

-- CreateIndex
CREATE INDEX "game_sessions_user_id_idx" ON "game_sessions"("user_id");

-- CreateIndex
CREATE INDEX "game_sessions_game_id_idx" ON "game_sessions"("game_id");

-- CreateIndex
CREATE INDEX "game_sessions_user_id_started_at_idx" ON "game_sessions"("user_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "submitted_answers_session_id_idx" ON "submitted_answers"("session_id");

-- CreateIndex
CREATE INDEX "submitted_answers_content_item_id_idx" ON "submitted_answers"("content_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_results_session_id_key" ON "game_results"("session_id");

-- CreateIndex
CREATE INDEX "game_results_user_id_idx" ON "game_results"("user_id");

-- CreateIndex
CREATE INDEX "game_results_game_id_idx" ON "game_results"("game_id");

-- CreateIndex
CREATE INDEX "game_results_user_id_created_at_idx" ON "game_results"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "daily_progress_summaries_user_id_summary_date_idx" ON "daily_progress_summaries"("user_id", "summary_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "daily_progress_summaries_user_id_summary_date_key" ON "daily_progress_summaries"("user_id", "summary_date");

-- CreateIndex
CREATE INDEX "difficulty_history_user_id_game_id_idx" ON "difficulty_history"("user_id", "game_id");

-- CreateIndex
CREATE INDEX "activity_recommendations_user_id_is_dismissed_priority_scor_idx" ON "activity_recommendations"("user_id", "is_dismissed", "priority_score" DESC);

-- CreateIndex
CREATE INDEX "routine_tasks_user_id_period_idx" ON "routine_tasks"("user_id", "period");

-- CreateIndex
CREATE INDEX "routine_task_logs_user_id_scheduled_date_idx" ON "routine_task_logs"("user_id", "scheduled_date");

-- CreateIndex
CREATE UNIQUE INDEX "routine_task_logs_routine_task_id_scheduled_date_key" ON "routine_task_logs"("routine_task_id", "scheduled_date");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_created_at_idx" ON "notifications"("user_id", "is_read", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessibility_settings" ADD CONSTRAINT "accessibility_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_relationships" ADD CONSTRAINT "caregiver_relationships_elder_user_id_fkey" FOREIGN KEY ("elder_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_relationships" ADD CONSTRAINT "caregiver_relationships_caregiver_user_id_fkey" FOREIGN KEY ("caregiver_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "game_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_content_items" ADD CONSTRAINT "game_content_items_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_content_items" ADD CONSTRAINT "game_content_items_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_options" ADD CONSTRAINT "game_options_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "game_content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submitted_answers" ADD CONSTRAINT "submitted_answers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submitted_answers" ADD CONSTRAINT "submitted_answers_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "game_content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submitted_answers" ADD CONSTRAINT "submitted_answers_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "game_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_results" ADD CONSTRAINT "game_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_results" ADD CONSTRAINT "game_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_results" ADD CONSTRAINT "game_results_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_progress_summaries" ADD CONSTRAINT "daily_progress_summaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "difficulty_history" ADD CONSTRAINT "difficulty_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "difficulty_history" ADD CONSTRAINT "difficulty_history_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_recommendations" ADD CONSTRAINT "activity_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_recommendations" ADD CONSTRAINT "activity_recommendations_recommended_game_id_fkey" FOREIGN KEY ("recommended_game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_tasks" ADD CONSTRAINT "routine_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_task_logs" ADD CONSTRAINT "routine_task_logs_routine_task_id_fkey" FOREIGN KEY ("routine_task_id") REFERENCES "routine_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_task_logs" ADD CONSTRAINT "routine_task_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_task_logs" ADD CONSTRAINT "routine_task_logs_completed_by_user_id_fkey" FOREIGN KEY ("completed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;