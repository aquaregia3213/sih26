import { GameCardData, RoutineTask, AppNotification, WeeklyProgress, GameResult, ActiveView } from '../types';

// ─── Games Hub Data ───

export const GAME_CARDS: GameCardData[] = [
  // Memory
  {
    id: 'game-memory-match',
    name: 'Memory Match',
    description: 'Match pairs of cards by remembering their positions. A calming way to exercise your visual memory.',
    icon: '🃏',
    category: 'memory',
    estimatedTime: '5 min',
    difficulty: 'Easy',
    view: 'game-memory',
    color: '#C66B44',
  },
  {
    id: 'game-remember-objects',
    name: 'Remember the Objects',
    description: 'Look at a set of objects, then recall which ones you saw. Simple and satisfying.',
    icon: '🧸',
    category: 'memory',
    estimatedTime: '4 min',
    difficulty: 'Easy',
    view: 'game-memory',
    color: '#D4AF37',
  },
  {
    id: 'game-name-face',
    name: 'Name & Face',
    description: 'See familiar faces from family photos and recall their names with gentle hints.',
    icon: '👨‍👩‍👧',
    category: 'memory',
    estimatedTime: '6 min',
    difficulty: 'Medium',
    view: 'game-memory',
    color: '#6A9B96',
  },
  {
    id: 'game-sequence-recall',
    name: 'Sequence Recall',
    description: 'Remember a sequence of colours or sounds and repeat them back in order.',
    icon: '🎵',
    category: 'memory',
    estimatedTime: '5 min',
    difficulty: 'Medium',
    view: 'game-sequence',
    color: '#C66B44',
  },
  // Attention
  {
    id: 'game-find-difference',
    name: 'Find the Difference',
    description: 'Spot subtle differences between two peaceful village scenes. Take your time.',
    icon: '🔍',
    category: 'attention',
    estimatedTime: '5 min',
    difficulty: 'Easy',
    view: 'game-attention',
    color: '#2D4739',
  },
  {
    id: 'game-focus-object',
    name: 'Focus the Object',
    description: 'A single object appears among others — tap it before it fades away gently.',
    icon: '🎯',
    category: 'attention',
    estimatedTime: '3 min',
    difficulty: 'Easy',
    view: 'game-attention',
    color: '#6A9B96',
  },
  {
    id: 'game-number-hunt',
    name: 'Number Hunt',
    description: 'Find numbers hidden in a beautiful garden scene. No rush, just gentle searching.',
    icon: '🔢',
    category: 'attention',
    estimatedTime: '4 min',
    difficulty: 'Medium',
    view: 'game-attention',
    color: '#D4AF37',
  },
  // Pattern Recognition
  {
    id: 'game-complete-pattern',
    name: 'Complete the Pattern',
    description: 'Look at a sequence of shapes and pick the one that comes next. Relaxing logic exercise.',
    icon: '🔷',
    category: 'pattern',
    estimatedTime: '5 min',
    difficulty: 'Easy',
    view: 'game-sequence',
    color: '#C66B44',
  },
  {
    id: 'game-shape-sequence',
    name: 'Shape Sequence',
    description: 'Arrange colourful shapes in the correct repeating pattern. Beautiful and calming.',
    icon: '🟡',
    category: 'pattern',
    estimatedTime: '4 min',
    difficulty: 'Medium',
    view: 'game-sequence',
    color: '#2D4739',
  },
  {
    id: 'game-color-sequence',
    name: 'Cultural Patterns',
    description: 'Match traditional NE Indian textile patterns. Celebrate heritage through play.',
    icon: '🪡',
    category: 'pattern',
    estimatedTime: '5 min',
    difficulty: 'Medium',
    view: 'game-cultural',
    color: '#D4AF37',
  },
  // Daily Recall
  {
    id: 'game-today-routine',
    name: "Today's Routine",
    description: "Recall what you did today — breakfast, walks, visitors. A gentle daily reflection.",
    icon: '📋',
    category: 'daily-recall',
    estimatedTime: '3 min',
    difficulty: 'Easy',
    view: 'game-memory',
    color: '#6A9B96',
  },
  {
    id: 'game-what-did-you-do',
    name: 'What Did You Do?',
    description: 'Answer simple questions about your recent activities. No pressure, just remembering.',
    icon: '💭',
    category: 'daily-recall',
    estimatedTime: '4 min',
    difficulty: 'Easy',
    view: 'game-memory',
    color: '#C66B44',
  },
];

export const GAME_CATEGORIES = [
  { id: 'all', label: 'All Activities', icon: '✨' },
  { id: 'memory', label: 'Memory', icon: '🧠' },
  { id: 'attention', label: 'Attention', icon: '👁️' },
  { id: 'pattern', label: 'Pattern Recognition', icon: '🔷' },
  { id: 'daily-recall', label: 'Daily Recall', icon: '📋' },
];

// ─── Daily Routine Data ───

export const DEFAULT_ROUTINE_TASKS: RoutineTask[] = [
  { id: 'r1', time: '6:30 AM', title: 'Wake up & stretch gently', icon: '🌅', period: 'morning', completed: false },
  { id: 'r2', time: '7:00 AM', title: 'Morning medicine', icon: '💊', period: 'morning', completed: false },
  { id: 'r3', time: '7:30 AM', title: 'Breakfast — lal saah & pitha', icon: '🍵', period: 'morning', completed: false },
  { id: 'r4', time: '8:00 AM', title: 'Morning walk in the garden', icon: '🚶', period: 'morning', completed: false },
  { id: 'r5', time: '9:00 AM', title: 'Cognitive activity session', icon: '🧩', period: 'morning', completed: false },
  { id: 'r6', time: '12:30 PM', title: 'Lunch', icon: '🍛', period: 'afternoon', completed: false },
  { id: 'r7', time: '1:30 PM', title: 'Short rest', icon: '😴', period: 'afternoon', completed: false },
  { id: 'r8', time: '3:00 PM', title: 'Afternoon cognitive activity', icon: '🎯', period: 'afternoon', completed: false },
  { id: 'r9', time: '4:00 PM', title: 'Evening tea & snacks', icon: '☕', period: 'afternoon', completed: false },
  { id: 'r10', time: '5:30 PM', title: 'Family video call', icon: '📞', period: 'evening', completed: false },
  { id: 'r11', time: '7:00 PM', title: 'Dinner', icon: '🍽️', period: 'evening', completed: false },
  { id: 'r12', time: '8:00 PM', title: 'Relaxation — listen to music', icon: '🎶', period: 'evening', completed: false },
  { id: 'r13', time: '9:00 PM', title: 'Evening medicine', icon: '💊', period: 'evening', completed: false },
  { id: 'r14', time: '9:30 PM', title: 'Bedtime', icon: '🌙', period: 'evening', completed: false },
];

// ─── Notifications Data ───

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'activity',
    title: 'Daily Activity Ready',
    message: 'Your morning cognitive session is waiting for you. It should only take 5 minutes!',
    timestamp: '2 minutes ago',
    read: false,
    icon: '🧩',
    actionView: 'games-hub',
  },
  {
    id: 'n2',
    type: 'achievement',
    title: 'Great Week!',
    message: 'You completed 5 activities this week. That is wonderful progress — keep it up!',
    timestamp: '1 hour ago',
    read: false,
    icon: '🏆',
    actionView: 'progress',
  },
  {
    id: 'n3',
    type: 'routine',
    title: 'Afternoon Routine',
    message: "It's time for your afternoon tea and a short rest. Take care of yourself.",
    timestamp: '3 hours ago',
    read: true,
    icon: '☕',
    actionView: 'daily-routine',
  },
  {
    id: 'n4',
    type: 'reminder',
    title: 'Medicine Reminder',
    message: 'Time for your afternoon medicine. Please take it with a glass of water.',
    timestamp: '5 hours ago',
    read: true,
    icon: '💊',
  },
  {
    id: 'n5',
    type: 'activity',
    title: 'New Activity Available',
    message: 'Try the new Cultural Patterns game — match beautiful NE Indian textile designs!',
    timestamp: '1 day ago',
    read: true,
    icon: '🪡',
    actionView: 'games-hub',
  },
  {
    id: 'n6',
    type: 'achievement',
    title: '7-Day Streak!',
    message: "You have been active for 7 days in a row! That's a beautiful streak of wellness.",
    timestamp: '2 days ago',
    read: true,
    icon: '🔥',
  },
];

// ─── Weekly Progress Data ───

export const MOCK_WEEKLY_PROGRESS: WeeklyProgress[] = [
  { day: 'Mon', activitiesCompleted: 3, minutesActive: 18, memoryScore: 72, attentionScore: 68, patternScore: 65 },
  { day: 'Tue', activitiesCompleted: 2, minutesActive: 12, memoryScore: 75, attentionScore: 70, patternScore: 68 },
  { day: 'Wed', activitiesCompleted: 4, minutesActive: 22, memoryScore: 78, attentionScore: 74, patternScore: 72 },
  { day: 'Thu', activitiesCompleted: 3, minutesActive: 16, memoryScore: 76, attentionScore: 72, patternScore: 70 },
  { day: 'Fri', activitiesCompleted: 5, minutesActive: 28, memoryScore: 82, attentionScore: 78, patternScore: 75 },
  { day: 'Sat', activitiesCompleted: 2, minutesActive: 10, memoryScore: 80, attentionScore: 76, patternScore: 73 },
  { day: 'Sun', activitiesCompleted: 4, minutesActive: 20, memoryScore: 84, attentionScore: 80, patternScore: 78 },
];

// ─── Default Game Result ───

export const DEFAULT_GAME_RESULT: GameResult = {
  gameId: 'game-memory-match',
  gameName: 'Memory Match',
  gameIcon: '🃏',
  score: 4,
  totalQuestions: 5,
  accuracy: 80,
  timeSpent: 245,
  difficulty: 'Easy',
  improvements: [
    'Response time improved by 12% from last session',
    'Consistency across rounds was excellent',
  ],
  strengths: [
    'You remembered 4 out of 5 objects correctly',
    'Your visual pattern recognition is getting stronger',
  ],
  nextRecommendation: {
    name: 'Find the Difference',
    category: 'Attention',
    icon: '🔍',
    view: 'game-attention',
  },
};

// ─── Caregiver Multi-User Data ───

export const CAREGIVER_USERS = [
  {
    id: 'u1',
    name: 'Bhaben Hazarika',
    age: 72,
    avatar: '👴🏽',
    lastActivity: '2 hours ago',
    streak: 7,
    weeklyActivities: 14,
    memoryScore: 78,
    attentionScore: 82,
    areasPracticed: ['Memory', 'Attention', 'Cultural'],
    trend: 'up' as const,
  },
  {
    id: 'u2',
    name: 'Renu Devi',
    age: 68,
    avatar: '👵🏽',
    lastActivity: '5 hours ago',
    streak: 3,
    weeklyActivities: 8,
    memoryScore: 65,
    attentionScore: 70,
    areasPracticed: ['Memory', 'Daily Recall'],
    trend: 'stable' as const,
  },
  {
    id: 'u3',
    name: 'Mohan Das Borah',
    age: 76,
    avatar: '👴🏽',
    lastActivity: '1 day ago',
    streak: 12,
    weeklyActivities: 18,
    memoryScore: 85,
    attentionScore: 88,
    areasPracticed: ['Memory', 'Attention', 'Pattern', 'Cultural'],
    trend: 'up' as const,
  },
];

// ─── NER Languages for Language Selector ───

export const NER_LANGUAGES = [
  { id: 'English', name: 'English', nativeScript: 'English', region: 'Universal' },
  { id: 'Assamese', name: 'Assamese', nativeScript: 'অসমীয়া', region: 'Assam' },
  { id: 'Bodo', name: 'Bodo', nativeScript: 'बड़ो', region: 'Assam (Bodoland)' },
  { id: 'Khasi', name: 'Khasi', nativeScript: 'Ka Ktien Khasi', region: 'Meghalaya' },
  { id: 'Mizo', name: 'Mizo', nativeScript: 'Mizo ṭawng', region: 'Mizoram' },
  { id: 'Nagamese', name: 'Nagamese', nativeScript: 'Nagamese Creole', region: 'Nagaland' },
  { id: 'Hindi', name: 'Hindi', nativeScript: 'हिन्दी', region: 'Pan-India' },
  { id: 'Bengali', name: 'Bengali', nativeScript: 'বাংলা', region: 'Tripura' },
  { id: 'Nepali', name: 'Nepali', nativeScript: 'नेपाली', region: 'Sikkim' },
  { id: 'Manipuri', name: 'Manipuri', nativeScript: 'মণিপুরী', region: 'Manipur' },
];
