import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('--- Testing Supabase Backend Connection ---');
console.log('Project URL:', url);
console.log('Anon Key Present:', !!anonKey);

if (!url || !anonKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

async function testBackend() {
  const tables = ['profiles', 'memory_photos', 'garden_elements', 'reminders', 'cognitive_history'];
  for (const table of tables) {
    try {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`❌ Table [${table}]:`, error.message);
      } else {
        console.log(`✅ Table [${table}]: Accessible (Row count: ${count})`);
      }
    } catch (e) {
      console.log(`❌ Table [${table}]: Exception`, e.message);
    }
  }

  console.log('\n--- Testing Storage Buckets ---');
  try {
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    if (bErr) {
      console.log('Storage listBuckets error:', bErr.message);
    } else {
      console.log('Found buckets:', buckets?.map(b => `${b.name} (${b.public ? 'public' : 'private'})`));
    }
  } catch (e) {
    console.log('Storage exception:', e.message);
  }

  console.log('\n--- Testing Auth Sign In / Up ---');
  const testEmail = `verify.${Date.now()}@example.com`;
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: testEmail,
    password: 'TemporaryTestPassword123!',
    options: {
      data: { name: 'Automated Tester', role: 'Caregiver' }
    }
  });

  if (authErr) {
    console.log('Auth signUp test:', authErr.message);
  } else {
    console.log('✅ Auth signUp succeeded! User ID:', authData.user?.id);
    if (authData.session) {
      console.log('✅ Session active immediately (email confirmation disabled)');
      
      // Test Storage upload with authenticated session
      console.log('\n--- Testing Authenticated Storage Upload ---');
      const testFileContent = Buffer.from('Vanika automated test verification payload');
      const testPath = `${authData.user.id}/test_ping_${Date.now()}.txt`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('family-photos')
        .upload(testPath, testFileContent, { contentType: 'text/plain', upsert: true });

      if (uploadErr) {
        console.log('❌ Authenticated upload failed:', uploadErr.message);
      } else {
        console.log('✅ Authenticated upload succeeded! Path:', uploadData?.path);
        const { data: publicUrlData } = supabase.storage.from('family-photos').getPublicUrl(uploadData.path);
        console.log('✅ Public URL generated:', publicUrlData?.publicUrl);
      }
    } else {
      console.log('ℹ️ User created; confirmation email required.');
    }
  }
}

testBackend();
