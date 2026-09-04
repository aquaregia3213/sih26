import { GameCategory, Game, GameType, DifficultyLevel } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorMiddleware';

export interface GameFilterDto {
  category?: string;
  difficulty?: string;
  gameType?: string;
}

export interface SafeGameOption {
  id: string;
  contentItemId: string;
  optionText: string;
  optionMediaUrl?: string | null;
  displayOrder: number;
  isCorrect?: boolean;
  explanation?: string | null;
}

export interface SafeGameQuestion {
  id: string;
  gameId: string;
  title: string;
  promptText: string;
  audioPromptUrl?: string | null;
  mediaUrl?: string | null;
  secondaryMediaUrl?: string | null;
  difficultyLevel: DifficultyLevel;
  culturalRegion?: string | null;
  metadata: any;
  options: SafeGameOption[];
}

export class GameService {
  /**
    Retrieves all game categories ordered by display order.
   */
  public static async getCategories(): Promise<any[]> {
    const categories = await prisma.gameCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: {
            games: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      displayOrder: cat.displayOrder,
      activeGamesCount: cat._count.games,
    }));
  }

  /**
    Retrieves active games with optional category, difficulty, or gameType filtering.
   */
  public static async getGames(filters: GameFilterDto = {}): Promise<any[]> {
    const whereClause: any = { isActive: true };

    if (filters.category) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(filters.category);
      const cat = await prisma.gameCategory.findFirst({
        where: {
          OR: [
            { slug: filters.category.toLowerCase() },
            ...(isUuid ? [{ id: filters.category }] : []),
          ],
        },
      });
      if (cat) {
        whereClause.categoryId = cat.id;
      } else {
        return [];
      }
    }

    if (filters.difficulty) {
      whereClause.baseDifficulty = filters.difficulty.toUpperCase() as DifficultyLevel;
    }

    if (filters.gameType) {
      whereClause.gameType = filters.gameType.toUpperCase() as GameType;
    }

    const games = await prisma.game.findMany({
      where: whereClause,
      include: {
        category: {
          select: { id: true, slug: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return games;
  }

  /**
    Retrieves a single active game by UUID or slug.
   */
  public static async getGameById(idOrSlug: string): Promise<any> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const game = await prisma.game.findFirst({
      where: {
        AND: [
          { isActive: true },
          isUuid ? { id: idOrSlug } : { slug: idOrSlug },
        ],
      },
      include: {
        category: true,
      },
    });

    if (!game) {
      throw new AppError('Game not found or currently inactive', 404);
    }

    return game;
  }

  /**
    Retrieves content items (questions) for a game.
    CRITICAL SECURITY GUARANTEE: Strips isCorrect and explanation unless includeAnswers is true (Admin only).
   */
  public static async getGameQuestions(
    idOrSlug: string,
    includeAnswers: boolean = false
  ): Promise<SafeGameQuestion[]> {
    const game = await this.getGameById(idOrSlug);

    const contentItems = await prisma.gameContentItem.findMany({
      where: { gameId: game.id },
      include: {
        options: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return contentItems.map((item) => ({
      id: item.id,
      gameId: item.gameId,
      title: item.title,
      promptText: item.promptText,
      audioPromptUrl: item.audioPromptUrl,
      mediaUrl: item.mediaUrl,
      secondaryMediaUrl: item.secondaryMediaUrl,
      difficultyLevel: item.difficultyLevel,
      culturalRegion: item.culturalRegion,
      metadata: item.metadata,
      options: item.options.map((opt) => {
        const optionData: SafeGameOption = {
          id: opt.id,
          contentItemId: opt.contentItemId,
          optionText: opt.optionText,
          optionMediaUrl: opt.optionMediaUrl,
          displayOrder: opt.displayOrder,
        };

        // Server-side answer key protection: Only return answer key if explicitly authorized
        if (includeAnswers) {
          optionData.isCorrect = opt.isCorrect;
          optionData.explanation = opt.explanation;
        }

        return optionData;
      }),
    }));
  }

  /**
    Admin-only: Creates a new game.
   */
  public static async createGame(dto: any): Promise<Game> {
    const category = await prisma.gameCategory.findFirst({
      where: {
        OR: [{ id: dto.categoryId }, { slug: dto.categoryId }],
      },
    });

    if (!category) {
      throw new AppError('Invalid category ID or slug', 400);
    }

    const existingSlug = await prisma.game.findUnique({
      where: { slug: dto.slug.toLowerCase().trim() },
    });
    if (existingSlug) {
      throw new AppError('A game with this slug already exists', 409);
    }

    const newGame = await prisma.game.create({
      data: {
        categoryId: category.id,
        slug: dto.slug.toLowerCase().trim(),
        title: dto.title.trim(),
        description: dto.description.trim(),
        icon: dto.icon || 'Brain',
        gameType: dto.gameType.toUpperCase() as GameType,
        baseDifficulty: (dto.baseDifficulty || 'EASY').toUpperCase() as DifficultyLevel,
        estimatedDurationSeconds: dto.estimatedDurationSeconds || 300,
        configSchema: dto.configSchema || {},
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });

    return newGame;
  }

  /**
    Admin-only: Updates an existing game.
   */
  public static async updateGame(id: string, dto: any): Promise<Game> {
    const existingGame = await prisma.game.findUnique({ where: { id } });
    if (!existingGame) {
      throw new AppError('Game not found', 404);
    }

    const updated = await prisma.game.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title.trim() }),
        ...(dto.description && { description: dto.description.trim() }),
        ...(dto.icon && { icon: dto.icon }),
        ...(dto.baseDifficulty && { baseDifficulty: dto.baseDifficulty.toUpperCase() as DifficultyLevel }),
        ...(dto.estimatedDurationSeconds && { estimatedDurationSeconds: dto.estimatedDurationSeconds }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    return updated;
  }

  /**
    Admin-only: Soft deletes (deactivates) a game.
   */
  public static async deleteGame(id: string): Promise<Game> {
    const existingGame = await prisma.game.findUnique({ where: { id } });
    if (!existingGame) {
      throw new AppError('Game not found', 404);
    }

    return prisma.game.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
    Seeds realistic North-East cultural cognitive games and content items into the database.
   */
  public static async seedInitialGameContent(): Promise<void> {
    const categoriesCount = await prisma.gameCategory.count();
    if (categoriesCount > 0) {
      return; // Already seeded
    }

    const categoriesData = [
      {
        slug: 'memory',
        name: 'Memory & Reminiscence',
        description: 'Culturally resonant visual and auditory memory exercises tailored for North-East India.',
        icon: 'Brain',
        displayOrder: 1,
      },
      {
        slug: 'attention',
        name: 'Attention & Focus',
        description: 'Visual tracking and speed exercises using traditional motifs and landmark icons.',
        icon: 'Eye',
        displayOrder: 2,
      },
      {
        slug: 'pattern',
        name: 'Pattern Recognition',
        description: 'Traditional textile pattern matching and spatial reasoning challenges.',
        icon: 'Grid',
        displayOrder: 3,
      },
      {
        slug: 'recall',
        name: 'Story & Event Recall',
        description: 'Short narrative comprehension and chronological event ordering activities.',
        icon: 'BookOpen',
        displayOrder: 4,
      },
      {
        slug: 'object-recognition',
        name: 'Object & Animal Recognition',
        description: 'Identifying regional wildlife, household artifacts, and flora of the North-East.',
        icon: 'Smile',
        displayOrder: 5,
      },
    ];

    for (const catData of categoriesData) {
      const category = await prisma.gameCategory.create({
        data: catData,
      });

      if (catData.slug === 'memory') {
        const game = await prisma.game.create({
          data: {
            categoryId: category.id,
            slug: 'memory-match-assam',
            title: 'Assam Cultural Memory Match',
            description: 'Pair matching traditional symbols of Assam including Japi, Gamosa, and Tea Leaves.',
            icon: 'Layers',
            gameType: 'CARD_MATCH',
            baseDifficulty: 'EASY',
            estimatedDurationSeconds: 180,
          },
        });

        const item = await prisma.gameContentItem.create({
          data: {
            gameId: game.id,
            title: 'Traditional Symbols Pair Matching',
            promptText: 'Identify the matching pair for the traditional Assamese Japi (conical hat).',
            culturalRegion: 'Assam',
            difficultyLevel: 'EASY',
          },
        });

        await prisma.gameOption.createMany({
          data: [
            { contentItemId: item.id, optionText: 'Traditional Conical Bamboo Japi', isCorrect: true, displayOrder: 1, explanation: 'Correct! The Japi is a traditional conical bamboo hat of Assam.' },
            { contentItemId: item.id, optionText: 'Handwoven Red Gamosa Towel', isCorrect: false, displayOrder: 2 },
            { contentItemId: item.id, optionText: 'Clay Tea Cup (Kullad)', isCorrect: false, displayOrder: 3 },
          ],
        });
      } else if (catData.slug === 'attention') {
        const game = await prisma.game.create({
          data: {
            categoryId: category.id,
            slug: 'spot-difference-guwahati',
            title: 'Brahmaputra River Bank Spot',
            description: 'Find the differences in vibrant scenes of the Guwahati Brahmaputra riverfront.',
            icon: 'Sparkles',
            gameType: 'SPOT_DIFFERENCE',
            baseDifficulty: 'EASY',
            estimatedDurationSeconds: 240,
          },
        });

        const item = await prisma.gameContentItem.create({
          data: {
            gameId: game.id,
            title: 'River Ferry Difference Detection',
            promptText: 'Which element is altered in the evening river ferry scene?',
            culturalRegion: 'Assam',
            difficultyLevel: 'EASY',
          },
        });

        await prisma.gameOption.createMany({
          data: [
            { contentItemId: item.id, optionText: 'Ferry searchlight beam angle', isCorrect: true, displayOrder: 1, explanation: 'Spot on! The searchlight beam angle has shifted.' },
            { contentItemId: item.id, optionText: 'Number of flying egrets', isCorrect: false, displayOrder: 2 },
            { contentItemId: item.id, optionText: 'Riverbank coconut tree height', isCorrect: false, displayOrder: 3 },
          ],
        });
      } else if (catData.slug === 'pattern') {
        const game = await prisma.game.create({
          data: {
            categoryId: category.id,
            slug: 'pattern-complete-weaving',
            title: 'Muga Silk Pattern Complete',
            description: 'Complete geometric weaving motifs from traditional Muga silk handlooms.',
            icon: 'Grid',
            gameType: 'PATTERN_COMPLETE',
            baseDifficulty: 'MEDIUM',
            estimatedDurationSeconds: 300,
          },
        });

        const item = await prisma.gameContentItem.create({
          data: {
            gameId: game.id,
            title: 'Kaziranga Peacock Motif Completion',
            promptText: 'Select the missing diamond tile to complete the peacock border motif.',
            culturalRegion: 'North-East',
            difficultyLevel: 'MEDIUM',
          },
        });

        await prisma.gameOption.createMany({
          data: [
            { contentItemId: item.id, optionText: 'Emerald & Gold Diamond Tile', isCorrect: true, displayOrder: 1, explanation: 'Correct! The emerald and gold tile matches the symmetrical loom pattern.' },
            { contentItemId: item.id, optionText: 'Plain Red Border Tile', isCorrect: false, displayOrder: 2 },
            { contentItemId: item.id, optionText: 'Blue Floral Round Tile', isCorrect: false, displayOrder: 3 },
          ],
        });
      } else if (catData.slug === 'recall') {
        const game = await prisma.game.create({
          data: {
            categoryId: category.id,
            slug: 'heritage-quiz-bihu',
            title: 'Rongali Bihu Festival Recall',
            description: 'Test recall of spring festival traditions, songs, and culinary delicacies.',
            icon: 'BookOpen',
            gameType: 'HERITAGE_QUIZ',
            baseDifficulty: 'EASY',
            estimatedDurationSeconds: 200,
          },
        });

        const item = await prisma.gameContentItem.create({
          data: {
            gameId: game.id,
            title: 'Bihu Delicacy Identification',
            promptText: 'What is the traditional rice cake wrapped in banana leaves prepared during Bihu?',
            culturalRegion: 'Assam',
            difficultyLevel: 'EASY',
          },
        });

        await prisma.gameOption.createMany({
          data: [
            { contentItemId: item.id, optionText: 'Pitha (Sunga Pitha / Til Pitha)', isCorrect: true, displayOrder: 1, explanation: 'Correct! Pitha is the cherished rice cake delicacy of Bihu.' },
            { contentItemId: item.id, optionText: 'Rasgulla', isCorrect: false, displayOrder: 2 },
            { contentItemId: item.id, optionText: 'Jalebi', isCorrect: false, displayOrder: 3 },
          ],
        });
      } else if (catData.slug === 'object-recognition') {
        const game = await prisma.game.create({
          data: {
            categoryId: category.id,
            slug: 'fauna-recognition-ner',
            title: 'North-East Wildlife Recognition',
            description: 'Identify iconic animals of the Eastern Himalayas and Kaziranga Sanctuary.',
            icon: 'Smile',
            gameType: 'PHOTO_RECALL',
            baseDifficulty: 'EASY',
            estimatedDurationSeconds: 180,
          },
        });

        const item = await prisma.gameContentItem.create({
          data: {
            gameId: game.id,
            title: 'One-Horned Rhinoceros Recognition',
            promptText: 'Identify the state animal of Assam found in Kaziranga National Park.',
            culturalRegion: 'Assam',
            difficultyLevel: 'EASY',
          },
        });

        await prisma.gameOption.createMany({
          data: [
            { contentItemId: item.id, optionText: 'Great Indian One-Horned Rhinoceros', isCorrect: true, displayOrder: 1, explanation: 'Correct! The One-Horned Rhino is the pride of Kaziranga.' },
            { contentItemId: item.id, optionText: 'Bengal Tiger', isCorrect: false, displayOrder: 2 },
            { contentItemId: item.id, optionText: 'Snow Leopard', isCorrect: false, displayOrder: 3 },
          ],
        });
      }
    }
  }
}
