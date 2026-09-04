import { GameService } from '../services/gameService';

export async function runGameCatalogTests(): Promise<{ passed: number; total: number; name: string }> {
  let passed = 0;
  const total = 10;
  const testName = 'Game Catalog Suite (10 tests)';

  console.log(`\n--- Running ${testName} ---`);

  try {
    // Seed initial content if needed
    await GameService.seedInitialGameContent();

    // Test 1: Get Categories returns array
    const categories = await GameService.getCategories();
    if (Array.isArray(categories) && categories.length > 0) {
      passed++;
      console.log('✓ 1. GameService.getCategories returns list of categories');
    }

    // Test 2: Categories include required fields
    const firstCat = categories[0];
    if (firstCat.id && firstCat.slug && firstCat.name && firstCat.displayOrder !== undefined) {
      passed++;
      console.log('✓ 2. Category objects contain id, slug, name, and displayOrder');
    }

    // Test 3: Get active games
    const games = await GameService.getGames();
    if (Array.isArray(games) && games.length > 0) {
      passed++;
      console.log('✓ 3. GameService.getGames returns list of active games');
    }

    // Test 4: Filter games by category slug
    const memoryGames = await GameService.getGames({ category: 'memory' });
    if (Array.isArray(memoryGames) && memoryGames.every((g) => g.category.slug === 'memory')) {
      passed++;
      console.log('✓ 4. Filtering games by category slug returns matching games');
    }

    // Test 5: Filter games by difficulty
    const easyGames = await GameService.getGames({ difficulty: 'EASY' });
    if (Array.isArray(easyGames) && easyGames.every((g) => g.baseDifficulty === 'EASY')) {
      passed++;
      console.log('✓ 5. Filtering games by difficulty EASY returns easy games');
    }

    // Test 6: Filter games by invalid category returns empty array
    const emptyGames = await GameService.getGames({ category: 'non-existent-cat-99' });
    if (Array.isArray(emptyGames) && emptyGames.length === 0) {
      passed++;
      console.log('✓ 6. Filtering by non-existent category returns empty array safely');
    }

    // Test 7: Get Game by slug
    const targetGame = games[0];
    const gameBySlug = await GameService.getGameById(targetGame.slug);
    if (gameBySlug && gameBySlug.id === targetGame.id) {
      passed++;
      console.log('✓ 7. GameService.getGameById works with game slug');
    }

    // Test 8: Get Game by UUID
    const gameById = await GameService.getGameById(targetGame.id);
    if (gameById && gameById.slug === targetGame.slug) {
      passed++;
      console.log('✓ 8. GameService.getGameById works with UUID');
    }

    // Test 9: Answer key security stripping
    const questionsPublic = await GameService.getGameQuestions(targetGame.id, false);
    const answersStripped = questionsPublic.every((q) =>
      q.options.every((opt) => opt.isCorrect === undefined && opt.explanation === undefined)
    );
    if (answersStripped) {
      passed++;
      console.log('✓ 9. Answer key is strictly stripped from questions in client mode');
    }

    // Test 10: Answer key preserved in admin mode
    const questionsAdmin = await GameService.getGameQuestions(targetGame.id, true);
    const answersPreserved = questionsAdmin.some((q) =>
      q.options.some((opt) => opt.isCorrect !== undefined)
    );
    if (answersPreserved) {
      passed++;
      console.log('✓ 10. Answer key is included when explicitly requested in admin mode');
    }
  } catch (error) {
    console.error('Error in Game Catalog Tests:', error);
  }

  return { passed, total, name: testName };
}
