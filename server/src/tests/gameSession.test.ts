import { ScoringService } from '../services/scoringService';
import { GameService } from '../services/gameService';
import { SessionService } from '../services/sessionService';

export async function runGameSessionTests(): Promise<{ passed: number; total: number; name: string }> {
  let passed = 0;
  const total = 20;
  const testName = 'Game Session & Scoring Suite (20 tests)';

  console.log(`\n--- Running ${testName} ---`);

  try {
    // Test 1: Scoring logic - Perfect score with speed bonus
    const perfectAnswers = [
      { id: '1', contentItemId: 'q1', isCorrect: true, responseTimeMs: 2000 },
      { id: '2', contentItemId: 'q2', isCorrect: true, responseTimeMs: 3000 },
    ];
    const score1 = ScoringService.calculateSessionScore('CARD_MATCH', 2, perfectAnswers);
    if (score1.scoreObtained === 240 && score1.accuracyPercentage === 100) {
      passed++;
      console.log('✓ 1. Perfect score calculation with speed bonus equals 240 pts / 100%');
    }

    // Test 2: Scoring logic - Partial correct without speed bonus
    const slowAnswers = [
      { id: '1', contentItemId: 'q1', isCorrect: true, responseTimeMs: 6000 },
      { id: '2', contentItemId: 'q2', isCorrect: false, responseTimeMs: 4000 },
    ];
    const score2 = ScoringService.calculateSessionScore('CARD_MATCH', 2, slowAnswers);
    if (score2.scoreObtained === 100 && score2.accuracyPercentage === 50) {
      passed++;
      console.log('✓ 2. Partial correct answer without speed bonus calculates 100 pts / 50%');
    }

    // Test 3: Zero correct answers
    const zeroAnswers = [
      { id: '1', contentItemId: 'q1', isCorrect: false, responseTimeMs: 2000 },
    ];
    const score3 = ScoringService.calculateSessionScore('HERITAGE_QUIZ', 1, zeroAnswers);
    if (score3.scoreObtained === 0 && score3.accuracyPercentage === 0) {
      passed++;
      console.log('✓ 3. Zero correct answers yields 0 pts / 0% accuracy');
    }

    // Test 4: Domain scores - Memory domain assignment
    const memoryScore = ScoringService.calculateSessionScore('PHOTO_RECALL', 1, perfectAnswers.slice(0, 1));
    if (memoryScore.memoryDomainScore === 100 && memoryScore.attentionDomainScore === 70) {
      passed++;
      console.log('✓ 4. Memory domain game assigns memory 100 & attention 70');
    }

    // Test 5: Domain scores - Pattern domain assignment
    const patternScore = ScoringService.calculateSessionScore('PATTERN_COMPLETE', 1, perfectAnswers.slice(0, 1));
    if (patternScore.patternDomainScore === 100 && patternScore.memoryDomainScore === 70) {
      passed++;
      console.log('✓ 5. Pattern domain game assigns pattern 100 & memory 70');
    }

    // Test 6: Domain scores - Spot difference attention assignment
    const spotScore = ScoringService.calculateSessionScore('SPOT_DIFFERENCE', 1, perfectAnswers.slice(0, 1));
    if (spotScore.attentionDomainScore === 100 && spotScore.patternDomainScore === 80) {
      passed++;
      console.log('✓ 6. Spot difference game assigns attention 100 & pattern 80');
    }

    // Test 7: Strengths summary for high accuracy
    if (score1.strengthsSummary.length > 0 && score1.strengthsSummary[0].includes('High accuracy')) {
      passed++;
      console.log('✓ 7. High accuracy generates positive strengths summary');
    }

    // Test 8: Improvements summary for low accuracy
    if (score3.improvementsSummary.length > 0) {
      passed++;
      console.log('✓ 8. Low accuracy generates supportive improvements summary');
    }

    // Test 9: Create session requires gameId or gameSlug
    let missingGameIdCaught = false;
    try {
      await SessionService.createSession('user-1', {} as any);
    } catch (err: any) {
      if (err.statusCode === 400) missingGameIdCaught = true;
    }
    if (missingGameIdCaught) {
      passed++;
      console.log('✓ 9. SessionService.createSession rejects missing gameId/gameSlug');
    }

    // Test 10: Create session with invalid game throws 404
    let invalidGameCaught = false;
    try {
      await SessionService.createSession('user-1', { gameSlug: 'non-existent-game-99' });
    } catch (err: any) {
      if (err.statusCode === 404) invalidGameCaught = true;
    }
    if (invalidGameCaught) {
      passed++;
      console.log('✓ 10. Session creation for non-existent game throws 404');
    }

    // Test 11: Get session with invalid ID throws 404
    let notFoundSessionCaught = false;
    try {
      await SessionService.getSessionById('user-1', '00000000-0000-0000-0000-000000000000');
    } catch (err: any) {
      if (err.statusCode === 404) notFoundSessionCaught = true;
    }
    if (notFoundSessionCaught) {
      passed++;
      console.log('✓ 11. Fetching non-existent session ID throws 404');
    }

    // Test 12: Submit answer with invalid session ID throws 404
    let badSubmitCaught = false;
    try {
      await SessionService.submitAnswer('user-1', '00000000-0000-0000-0000-000000000000', { contentItemId: 'q1' });
    } catch (err: any) {
      if (err.statusCode === 404) badSubmitCaught = true;
    }
    if (badSubmitCaught) {
      passed++;
      console.log('✓ 12. Submitting answer for non-existent session throws 404');
    }

    // Test 13: Complete session with invalid session ID throws 404
    let badCompleteCaught = false;
    try {
      await SessionService.completeSession('user-1', '00000000-0000-0000-0000-000000000000');
    } catch (err: any) {
      if (err.statusCode === 404) badCompleteCaught = true;
    }
    if (badCompleteCaught) {
      passed++;
      console.log('✓ 13. Completing non-existent session throws 404');
    }

    // Test 14: Total questions calculation handles zero gracefully
    const zeroQScore = ScoringService.calculateSessionScore('PHOTO_RECALL', 0, []);
    if (zeroQScore.totalPossibleScore === 100) {
      passed++;
      console.log('✓ 14. ScoringService handles 0 total questions safely (fallback 1)');
    }

    // Test 15: Accuracy calculation rounds to 2 decimal places
    const floatScore = ScoringService.calculateSessionScore('PHOTO_RECALL', 3, [
      { id: '1', contentItemId: 'q1', isCorrect: true, responseTimeMs: 1000 },
    ]);
    if (floatScore.accuracyPercentage === 33.33) {
      passed++;
      console.log('✓ 15. Accuracy percentage rounds correctly to 2 decimal places (33.33%)');
    }

    // Test 16: Response latency lower bound check
    const fastScore = ScoringService.calculateSessionScore('CARD_MATCH', 1, [
      { id: '1', contentItemId: 'q1', isCorrect: true, responseTimeMs: 50 },
    ]);
    if (fastScore.scoreObtained === 120) {
      passed++;
      console.log('✓ 16. Fast answer (<5000ms) awards full speed bonus (+20 pts)');
    }

    // Test 17: Response latency upper bound threshold check
    const slowScore = ScoringService.calculateSessionScore('CARD_MATCH', 1, [
      { id: '1', contentItemId: 'q1', isCorrect: true, responseTimeMs: 5001 },
    ]);
    if (slowScore.scoreObtained === 100) {
      passed++;
      console.log('✓ 17. Answer >= 5000ms receives base points without speed bonus');
    }

    // Test 18: Negative response time fallback check
    const negScore = ScoringService.calculateSessionScore('CARD_MATCH', 1, [
      { id: '1', contentItemId: 'q1', isCorrect: true, responseTimeMs: -100 },
    ]);
    if (negScore.scoreObtained === 100) {
      passed++;
      console.log('✓ 18. Negative response time is safely ignored for speed bonus');
    }

    // Test 19: Incorrect answers count calculation
    if (score2.incorrectCount === 1 && score2.correctCount === 1) {
      passed++;
      console.log('✓ 19. Correct and incorrect counts add up to total answered questions');
    }

    // Test 20: Scoring result contains non-negative domain scores
    if (score1.memoryDomainScore >= 0 && score1.attentionDomainScore >= 0 && score1.patternDomainScore >= 0) {
      passed++;
      console.log('✓ 20. All cognitive domain scores are non-negative integers');
    }
  } catch (error) {
    console.error('Error in Game Session Tests:', error);
  }

  return { passed, total, name: testName };
}
