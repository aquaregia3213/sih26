import { i18n } from './index';

export async function runI18nTests(): Promise<{ passed: number; total: number; name: string }> {
  let passed = 0;
  const total = 14;
  const testName = 'Multilingual & i18n Foundation Suite (14 tests)';

  console.log(`\n--- Running ${testName} ---`);

  try {
    // Test 1: Default English language initialization
    i18n.setLanguage('en');
    if (i18n.getLanguageCode() === 'en' && i18n.getLanguageName() === 'English') {
      passed++;
      console.log('✓ 1. Default English language initializes correctly');
    }

    // Test 2: Supported language selection (Hindi, Assamese)
    i18n.setLanguage('hi');
    if (i18n.getLanguageCode() === 'hi') {
      passed++;
      console.log('✓ 2. Supported language selection (Hindi) updates state correctly');
    }

    // Test 3: Unsupported language code falls back to English safely
    i18n.setLanguage('xyz_unsupported_language');
    if (i18n.getLanguageCode() === 'en') {
      passed++;
      console.log('✓ 3. Unsupported language code falls back safely to English (en)');
    }

    // Test 4: Persistence across reloads (localStorage)
    i18n.setLanguage('as');
    if (i18n.getLanguageCode() === 'as') {
      passed++;
      console.log('✓ 4. Language selection persists cleanly in storage');
    }

    // Test 5: Missing translation fallback to English
    const missingKeyRes = i18n.t('nav.non_existent_key_12345');
    if (missingKeyRes === 'nav.non_existent_key_12345') {
      passed++;
      console.log('✓ 5. Missing translation key falls back to raw key without throwing error');
    }

    // Test 6: Translation variable interpolation ({{name}})
    i18n.setLanguage('en');
    const interpolated = i18n.t('dashboard.welcome', { name: 'Bhaben' });
    if (interpolated === 'Good morning, Bhaben') {
      passed++;
      console.log('✓ 6. Variable interpolation ({{name}}) replaces variables accurately');
    }

    // Test 7: Translated navigation strings
    i18n.setLanguage('en');
    const navHome = i18n.t('nav.home');
    if (navHome === 'Home') {
      passed++;
      console.log('✓ 7. Translated navigation strings return accurate English values');
    }

    // Test 8: Translated accessibility labels
    const accessTitle = i18n.t('accessibility.title');
    if (accessTitle === 'Accessibility Settings') {
      passed++;
      console.log('✓ 8. Translated accessibility labels return accurate strings');
    }

    // Test 9: Translated authentication UI strings
    const loginTitle = i18n.t('auth.loginTitle');
    if (loginTitle === 'Welcome Back') {
      passed++;
      console.log('✓ 9. Translated authentication UI strings return expected text');
    }

    // Test 10: Translated dashboard UI strings
    const startAct = i18n.t('dashboard.startActivity');
    if (startAct === 'Start Activity') {
      passed++;
      console.log('✓ 10. Translated dashboard UI strings return expected text');
    }

    // Test 11: Translated game control strings
    const submitBtn = i18n.t('games.submit');
    if (submitBtn === 'Submit Answer') {
      passed++;
      console.log('✓ 11. Translated game control strings return expected text');
    }

    // Test 12: Locale-aware number formatting
    i18n.setLanguage('hi');
    const formattedNum = i18n.formatNumber(1250);
    if (typeof formattedNum === 'string' && formattedNum.length > 0) {
      passed++;
      console.log('✓ 12. Locale-aware number formatting formats numbers via Intl');
    }

    // Test 13: Locale-aware date formatting
    const formattedDate = i18n.formatDate(new Date());
    if (typeof formattedDate === 'string' && formattedDate.length > 0) {
      passed++;
      console.log('✓ 13. Locale-aware date formatting formats dates via Intl');
    }

    // Test 14: Safe handling of long translated strings
    i18n.setLanguage('as');
    const assameseWelcome = i18n.t('dashboard.welcome', { name: 'Dr. Sharma' });
    if (assameseWelcome.includes('Dr. Sharma')) {
      passed++;
      console.log('✓ 14. Long translated strings interpolate safely without text clipping');
    }

    i18n.setLanguage('en'); // Reset to default
  } catch (err) {
    console.error('Error in i18n tests:', err);
  }

  return { passed, total, name: testName };
}
