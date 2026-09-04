import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables provided in .env (or Vite environment)
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    supabaseUrl.startsWith('https://') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    supabaseAnonKey !== 'your-anon-public-key'
  );
};

// Create client conditionally; provide dummy client fallback to prevent crashes if credentials are not yet entered
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Uploads a local photo file (JPEG/PNG/WebP) to the Supabase 'family-photos' bucket.
 * Returns the public CDN URL to display in Memory Room and games.
 */
export async function uploadFamilyPhoto(file: File, userId: string): Promise<string> {
  if (!isSupabaseConfigured()) {
    // If Supabase is not configured yet, convert file to base64 data URL for local offline resilience
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `user_uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from('family-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.warn('[SupabaseStorage] Direct storage upload error, falling back to data URL:', error.message);
    // Graceful fallback to data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('family-photos')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
