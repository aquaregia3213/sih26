import { runAuthTests } from './auth.test';
import { runGameCatalogTests } from './gameCatalog.test';
import { runGameSessionTests } from './gameSession.test';
import { runProgressAnalyticsTests } from './progressAnalytics.test';
import { runRecommendationTests } from './recommendation.test';
import { runCaregiverTests } from './caregiver.test';
import { runRoutineTests } from './routine.test';
import { runNotificationTests } from './notification.test';
import { runAITests } from './ai.test';
import { runI18nTests } from './i18n.test';
import { runVoiceTests } from './voice.test';
import { runOfflineTests } from './offline.test';
import { runSecurityAuditTests } from './securityAudit.test';

async function main() {
  console.log('====================================================');
  console.log('  VANIKA COGNITIVE CARE — FULL BACKEND TEST RUNNER  ');
  console.log('====================================================');

  const results = [];

  results.push(await runAuthTests());
  results.push(await runGameCatalogTests());
  results.push(await runGameSessionTests());
  results.push(await runProgressAnalyticsTests());
  results.push(await runRecommendationTests());
  results.push(await runCaregiverTests());
  results.push(await runRoutineTests());
  results.push(await runNotificationTests());
  results.push(await runAITests());
  results.push(await runI18nTests());
  results.push(await runVoiceTests());
  results.push(await runOfflineTests());
  results.push(await runSecurityAuditTests());

  console.log('\n====================================================');
  console.log('                  TEST SUMMARY                      ');
  console.log('====================================================');

  let totalPassed = 0;
  let totalTests = 0;

  for (const r of results) {
    console.log(`${r.name}: ${r.passed}/${r.total} PASS`);
    totalPassed += r.passed;
    totalTests += r.total;
  }

  console.log('----------------------------------------------------');
  console.log(`TOTAL RESULT: ${totalPassed}/${totalTests} TESTS PASSED`);
  console.log('====================================================\n');

  if (totalPassed < totalTests) {
    console.error('FAILED: Some test suites did not achieve 100% pass rate.');
    process.exit(1);
  } else {
    console.log('SUCCESS: All test suites passed cleanly with 100% pass rate! 🎉');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
