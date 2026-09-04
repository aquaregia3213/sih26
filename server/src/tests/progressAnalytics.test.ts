import { ProgressService } from '../services/progressService';

export async function runProgressAnalyticsTests(): Promise<{ passed: number; total: number; name: string }> {
  let passed = 0;
  const total = 18;
  const testName = 'Progress & Analytics Suite (18 tests)';

  console.log(`\n--- Running ${testName} ---`);

  try {
    // Test 1: Empty streak calculation
    const emptyStreak = ProgressService.calculateStreaks([]);
    if (emptyStreak.currentStreak === 0 && emptyStreak.longestStreak === 0) {
      passed++;
      console.log('✓ 1. Empty dates array returns 0 current and 0 longest streak');
    }

    // Test 2: Single date streak
    const singleStreak = ProgressService.calculateStreaks(['2026-09-01']);
    if (singleStreak.longestStreak === 1) {
      passed++;
      console.log('✓ 2. Single active date gives longest streak of 1');
    }

    // Test 3: Multiple sessions on same calendar day count as 1
    const sameDayStreak = ProgressService.calculateStreaks(['2026-09-01', '2026-09-01', '2026-09-01']);
    if (sameDayStreak.longestStreak === 1) {
      passed++;
      console.log('✓ 3. Duplicate dates on same day count as 1 active day');
    }

    // Test 4: Consecutive 3-day streak
    const consecutiveStreak = ProgressService.calculateStreaks(['2026-09-01', '2026-09-02', '2026-09-03']);
    if (consecutiveStreak.longestStreak === 3) {
      passed++;
      console.log('✓ 4. 3 consecutive active days produce longest streak of 3');
    }

    // Test 5: Broken streak with gap
    const brokenStreak = ProgressService.calculateStreaks(['2026-09-01', '2026-09-02', '2026-09-05', '2026-09-06']);
    if (brokenStreak.longestStreak === 2) {
      passed++;
      console.log('✓ 5. Streak broken by day gap correctly limits longest streak to max segment');
    }

    // Test 6: Current streak ending today
    const todayStr = new Date().toISOString().split('T')[0];
    const todayStreak = ProgressService.calculateStreaks([todayStr]);
    if (todayStreak.currentStreak === 1) {
      passed++;
      console.log('✓ 6. Active day today yields current streak of 1');
    }

    // Test 7: Current streak ending yesterday
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
    const yesterdayStreak = ProgressService.calculateStreaks([yesterdayStr]);
    if (yesterdayStreak.currentStreak === 1) {
      passed++;
      console.log('✓ 7. Active day yesterday preserves current streak of 1');
    }

    // Test 8: Current streak 0 if last session was 3 days ago
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 3);
    const oldStr = oldDate.toISOString().split('T')[0];
    const oldStreak = ProgressService.calculateStreaks([oldStr]);
    if (oldStreak.currentStreak === 0 && oldStreak.longestStreak === 1) {
      passed++;
      console.log('✓ 8. Session 3 days ago resets current streak to 0 while keeping longest streak');
    }

    // Test 9: Get Progress Summary for user with zero sessions
    const emptySummary = await ProgressService.getProgressSummary('00000000-0000-0000-0000-000000000000');
    if (emptySummary.totalCompletedSessions === 0 && emptySummary.averageAccuracy === 0) {
      passed++;
      console.log('✓ 9. Empty user progress summary returns zeroed metrics safely');
    }

    // Test 10: Empty summary contains empty recentActivity array
    if (Array.isArray(emptySummary.recentActivity) && emptySummary.recentActivity.length === 0) {
      passed++;
      console.log('✓ 10. Empty summary contains empty recentActivity list');
    }

    // Test 11: Empty summary contains categoryPerformance array
    if (Array.isArray(emptySummary.categoryPerformance)) {
      passed++;
      console.log('✓ 11. Empty summary contains categoryPerformance list for categories');
    }

    // Test 12: Activity history pagination default parameters
    const defaultHistory = await ProgressService.getActivityHistory('00000000-0000-0000-0000-000000000000');
    if (defaultHistory.pagination.page === 1 && defaultHistory.pagination.limit === 20) {
      passed++;
      console.log('✓ 12. Activity history defaults to page 1 and limit 20');
    }

    // Test 13: Activity history pagination total is 0 for new user
    if (defaultHistory.pagination.total === 0 && defaultHistory.history.length === 0) {
      passed++;
      console.log('✓ 13. Activity history for non-existent user returns 0 total');
    }

    // Test 14: Category performance returns all active categories
    const catPerf = await ProgressService.getCategoryPerformance('00000000-0000-0000-0000-000000000000');
    if (Array.isArray(catPerf) && catPerf.length > 0) {
      passed++;
      console.log('✓ 14. Category performance retrieves all active categories');
    }

    // Test 15: Category performance gamesCompleted is 0 for empty user
    if (catPerf.every((c: any) => c.gamesCompleted === 0 && c.averageAccuracy === 0)) {
      passed++;
      console.log('✓ 15. Unplayed categories report 0 games completed and 0 accuracy');
    }

    // Test 16: Performance trends for 7d period returns 7 data points
    const trends7d = await ProgressService.getPerformanceTrends('00000000-0000-0000-0000-000000000000', '7d');
    if (trends7d.dataPoints.length === 7) {
      passed++;
      console.log('✓ 16. Performance trends for 7d returns exactly 7 daily data points');
    }

    // Test 17: Performance trends for 30d period returns 30 data points
    const trends30d = await ProgressService.getPerformanceTrends('00000000-0000-0000-0000-000000000000', '30d');
    if (trends30d.dataPoints.length === 30) {
      passed++;
      console.log('✓ 17. Performance trends for 30d returns exactly 30 daily data points');
    }

    // Test 18: Performance trends for invalid period defaults to 7d
    const trendsInvalid = await ProgressService.getPerformanceTrends('00000000-0000-0000-0000-000000000000', 'invalid_period');
    if (trendsInvalid.dataPoints.length === 7) {
      passed++;
      console.log('✓ 18. Invalid trend period parameter safely defaults to 7d window');
    }
  } catch (error) {
    console.error('Error in Progress Analytics Tests:', error);
  }

  return { passed, total, name: testName };
}
