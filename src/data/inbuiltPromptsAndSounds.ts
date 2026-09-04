import { soundSynth } from '../utils/audioSynth';

export interface InbuiltPromptCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface InbuiltPromptItem {
  id: string;
  categoryId: string;
  title: string;
  promptText: string;
  culturalContext: string;
  iconEmoji: string;
  tags: string[];
}

export interface InbuiltSoundscapeItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: 'music' | 'nature' | 'calm' | 'sacred';
  play: () => void;
}

export const INBUILT_PROMPT_CATEGORIES: InbuiltPromptCategory[] = [
  { id: 'all', name: 'All Prompts', emoji: '✨', description: 'Browse all 35+ therapeutic & memory prompts' },
  { id: 'tea_courtyard', name: 'Morning Tea & Verandah', emoji: '☕', description: 'Sipping Lal Saah and courtyard sunrise memories' },
  { id: 'bihu_music', name: 'Bihu Drums & Flutes', emoji: '🌸', description: 'Springtime dances, Pepa horns, and folk melodies' },
  { id: 'calm_reassurance', name: 'Peace & Anxiety Relief', emoji: '🧘', description: 'Immediate grounding, safety reassurance, and slow breaths' },
  { id: 'family_children', name: 'Family & Loved Ones', emoji: '🏡', description: 'Grandchildren, old weddings, and childhood stories' },
  { id: 'herbal_health', name: 'Herbs & Daily Routine', emoji: '🌿', description: 'Brahmi tonics, water reminders, and peaceful evenings' },
  { id: 'games_riddles', name: 'Memory & Word Puzzles', emoji: '🎲', description: 'Gentle riddles, cultural trivia, and bright mind play' },
  { id: 'nature_hills', name: 'Rivers & Pine Hills', emoji: '🌄', description: 'Brahmaputra boat rides, Shillong breezes, and monsoon rain' }
];

export const INBUILT_PROMPTS: InbuiltPromptItem[] = [
  // ── Category 1: Morning Tea & Verandah ──
  {
    id: 'p-tea-1',
    categoryId: 'tea_courtyard',
    title: 'Verandah Red Tea Memories',
    promptText: 'Tell me about sitting on the bamboo verandah with a hot cup of Lal Saah in the morning.',
    culturalContext: 'Evokes peaceful sensory memories of morning red tea (Lal Saah) in Assam homes.',
    iconEmoji: '☕',
    tags: ['tea', 'morning', 'verandah', 'lal saah']
  },
  {
    id: 'p-tea-2',
    categoryId: 'tea_courtyard',
    title: 'Tea Garden Fresh Leaves',
    promptText: 'What does the tea garden smell like when the morning mist rises over the green tea bushes?',
    culturalContext: 'Stimulates olfactory and visual memory of tea estate mornings in Jorhat and Tezpur.',
    iconEmoji: '🍃',
    tags: ['tea', 'garden', 'mist', 'morning']
  },
  {
    id: 'p-tea-3',
    categoryId: 'tea_courtyard',
    title: 'Morning Breakfast & Pitha',
    promptText: 'What traditional morning snacks like steamed pitha or roasted rice do you remember enjoying?',
    culturalContext: 'Connects to comforting taste memories of traditional home cooking.',
    iconEmoji: '🥞',
    tags: ['food', 'pitha', 'breakfast']
  },
  {
    id: 'p-tea-4',
    categoryId: 'tea_courtyard',
    title: 'Courtyard Birdsong Walk',
    promptText: 'Describe a slow, quiet walk around the courtyard while listening to the morning songbirds.',
    culturalContext: 'Encourages light physical movement and sensory grounding in nature.',
    iconEmoji: '🐦',
    tags: ['walk', 'courtyard', 'birds']
  },
  {
    id: 'p-tea-5',
    categoryId: 'tea_courtyard',
    title: 'Warm Neighborly Greetings',
    promptText: 'How did neighbors used to call out "Namaskar" across the garden fence in the old days?',
    culturalContext: 'Re-activates community feeling and social connectedness.',
    iconEmoji: '🤝',
    tags: ['neighbors', 'greeting', 'namaskar']
  },

  // ── Category 2: Bihu Drums & Folk Music ──
  {
    id: 'p-bihu-1',
    categoryId: 'bihu_music',
    title: 'Rongali Bihu Dhol Beats',
    promptText: 'Can you tell me about the joyful sound of the Dhol drum and Pepa horn during Rongali Bihu?',
    culturalContext: 'High-valence positive emotional recall linked to North-Eastern spring festivals.',
    iconEmoji: '🥁',
    tags: ['bihu', 'dhol', 'pepa', 'music']
  },
  {
    id: 'p-bihu-2',
    categoryId: 'bihu_music',
    title: 'Banyan Tree Village Dance',
    promptText: 'Share a happy memory about dancing under the golden Banyan tree during spring celebrations.',
    culturalContext: 'Nostalgic folk memory of community Bihu dancing under the village tree.',
    iconEmoji: '🌳',
    tags: ['dance', 'banyan', 'spring']
  },
  {
    id: 'p-bihu-3',
    categoryId: 'bihu_music',
    title: 'Gentle Bihu Lullaby / Song',
    promptText: 'Can you recite a few gentle, soothing lines of a classic Bihu folk song for me?',
    culturalContext: 'Music and rhythmic poetry remain preserved even in moderate dementia stages.',
    iconEmoji: '🎶',
    tags: ['song', 'bihu', 'music', 'poem']
  },
  {
    id: 'p-bihu-4',
    categoryId: 'bihu_music',
    title: 'Traditional Gamusa & Jappi',
    promptText: 'What is the special meaning of receiving a red-and-white Gamusa cloth during the festival?',
    culturalContext: 'Reinforces cultural identity and tactile memory of woven textiles.',
    iconEmoji: '🧣',
    tags: ['gamusa', 'jappi', 'culture']
  },
  {
    id: 'p-bihu-5',
    categoryId: 'bihu_music',
    title: 'Cheraw & Khasi Flutes',
    promptText: 'Tell me about the gentle bamboo dance rhythms of Mizoram and pine flutes of Meghalaya.',
    culturalContext: 'Broadens cultural reminiscence across Meghalaya, Mizoram, and Nagaland.',
    iconEmoji: '🪈',
    tags: ['flute', 'mizoram', 'cheraw', 'khasi']
  },

  // ── Category 3: Peace & Anxiety Relief ──
  {
    id: 'p-calm-1',
    categoryId: 'calm_reassurance',
    title: 'Grounding Reassurance',
    promptText: 'I am feeling a little confused and unsure right now. Can you reassure me that I am safe at home?',
    culturalContext: 'Direct clinical validation: soothes disorientation with empathetic grounding.',
    iconEmoji: '🫂',
    tags: ['confused', 'safe', 'home', 'reassurance']
  },
  {
    id: 'p-calm-2',
    categoryId: 'calm_reassurance',
    title: '4-7-8 Breathing Together',
    promptText: 'Can we do a slow, calming breathing exercise together? Guide me through slow breaths.',
    culturalContext: 'Vagus nerve stimulation: lowers heart rate and reduces agitation without medication.',
    iconEmoji: '🌬️',
    tags: ['breathe', 'calm', 'exercise']
  },
  {
    id: 'p-calm-3',
    categoryId: 'calm_reassurance',
    title: 'Soothing Bamboo Flute Audio',
    promptText: 'Please play a soft, peaceful bamboo flute melody and tell me a gentle relaxing story.',
    culturalContext: 'Combines acoustic therapy with comforting narrative reassurance.',
    iconEmoji: '🪈',
    tags: ['flute', 'peace', 'relax']
  },
  {
    id: 'p-calm-4',
    categoryId: 'calm_reassurance',
    title: 'Comfort in the Present Moment',
    promptText: 'Remind me that there is no hurry today and everything is peaceful in our courtyard.',
    culturalContext: 'Eases time-pressure anxiety common in dementia patients.',
    iconEmoji: '🧘',
    tags: ['peace', 'no hurry', 'quiet']
  },
  {
    id: 'p-calm-5',
    categoryId: 'calm_reassurance',
    title: 'Sweet Evening Slumber',
    promptText: 'It is evening now. Give me a sweet bedtime blessing so I can sleep softly without worries.',
    culturalContext: 'Counteracts sundowning symptoms and promotes restful sleep.',
    iconEmoji: '🌙',
    tags: ['sleep', 'night', 'bedtime', 'evening']
  },

  // ── Category 4: Family & Loved Ones ──
  {
    id: 'p-fam-1',
    categoryId: 'family_children',
    title: 'Granddaughter Anita Love',
    promptText: 'Tell me about my granddaughter Anita and how much my family loves and cherishes me.',
    culturalContext: 'Affirms self-worth and familial security through personalized names.',
    iconEmoji: '👧🏽',
    tags: ['anita', 'granddaughter', 'family']
  },
  {
    id: 'p-fam-2',
    categoryId: 'family_children',
    title: 'Old Family Wedding Celebrations',
    promptText: 'What was it like gathering all the cousins and relatives for big family weddings in the past?',
    culturalContext: 'Taps into rich episodic long-term memory of joyful family reunions.',
    iconEmoji: '🎉',
    tags: ['wedding', 'family', 'celebration']
  },
  {
    id: 'p-fam-3',
    categoryId: 'family_children',
    title: 'Old School & Childhood Stories',
    promptText: 'Share a story about childhood friendships, walking to school, and playing in the rain.',
    culturalContext: 'Reminiscence therapy for earliest autobiographical memories.',
    iconEmoji: '🎒',
    tags: ['childhood', 'school', 'friends']
  },
  {
    id: 'p-fam-4',
    categoryId: 'family_children',
    title: 'Family Photo Album Walkthrough',
    promptText: 'Shall we look at our family photo album together? Who would you like to talk about today?',
    culturalContext: 'Triggers reminiscence photo-quizzes in the Memory House.',
    iconEmoji: '🖼️',
    tags: ['photos', 'album', 'reminiscence']
  },
  {
    id: 'p-fam-5',
    categoryId: 'family_children',
    title: 'Mother’s Lullabies & Comfort',
    promptText: 'Tell me about the sweet lullabies our mothers used to hum while rocking us to sleep.',
    culturalContext: 'Deep emotional resonance tied to early maternal affection.',
    iconEmoji: '🤱🏽',
    tags: ['mother', 'lullaby', 'comfort']
  },

  // ── Category 5: Traditional Herbs & Routine ──
  {
    id: 'p-herb-1',
    categoryId: 'herbal_health',
    title: 'Brahmi & Manimuni Memory Leaves',
    promptText: 'What are the traditional benefits of fresh Manimuni and Brahmi leaves for memory clarity?',
    culturalContext: 'Affirms traditional indigenous botanical knowledge common across North East India.',
    iconEmoji: '🌱',
    tags: ['brahmi', 'manimuni', 'herbs', 'health']
  },
  {
    id: 'p-herb-2',
    categoryId: 'herbal_health',
    title: 'Gentle Medicine & Hydration Check',
    promptText: 'Can you remind me gently about taking my morning medicine and drinking a warm glass of water?',
    culturalContext: 'Care compliance prompt without authoritative or clinical anxiety.',
    iconEmoji: '💧',
    tags: ['medicine', 'water', 'routine']
  },
  {
    id: 'p-herb-3',
    categoryId: 'herbal_health',
    title: 'Afternoon Red Tea Routine',
    promptText: 'Is it time for a quiet afternoon tea break on the verandah? How should we spend our afternoon?',
    culturalContext: 'Maintains daily temporal structure and anchors circadian rhythm.',
    iconEmoji: '🫖',
    tags: ['tea', 'afternoon', 'routine']
  },
  {
    id: 'p-herb-4',
    categoryId: 'herbal_health',
    title: 'Gentle Stretching in the Courtyard',
    promptText: 'What light, gentle arm stretches can I do while sitting comfortably in my bamboo chair?',
    culturalContext: 'Encourages safe mobility and joint circulation for sedentary elders.',
    iconEmoji: '🧘🏽‍♂️',
    tags: ['stretch', 'chair', 'exercise']
  },
  {
    id: 'p-herb-5',
    categoryId: 'herbal_health',
    title: 'Peaceful Nighttime Routine',
    promptText: 'How can I prepare my room and mind for a peaceful night of rest without restlessness?',
    culturalContext: 'Addresses evening wandering and anxiety through bedtime structuring.',
    iconEmoji: '🛌',
    tags: ['night', 'sleep', 'routine']
  },

  // ── Category 6: Memory & Word Puzzles ──
  {
    id: 'p-game-1',
    categoryId: 'games_riddles',
    title: 'Traditional Folk Riddle',
    promptText: 'Can you give me a fun, simple traditional folk riddle to guess? Make it lighthearted!',
    culturalContext: 'Stimulates executive function and deductive reasoning in a playful manner.',
    iconEmoji: '❓',
    tags: ['riddle', 'puzzle', 'game']
  },
  {
    id: 'p-game-2',
    categoryId: 'games_riddles',
    title: 'Regional Festivals Trivia',
    promptText: 'Ask me a gentle quiz question about famous North East festivals like Bihu, Hornbill, or Chapchar Kut.',
    culturalContext: 'Stimulates semantic memory retrieval with zero timer pressure.',
    iconEmoji: '🏛️',
    tags: ['quiz', 'festivals', 'hornbill', 'bihu']
  },
  {
    id: 'p-game-3',
    categoryId: 'games_riddles',
    title: 'Word Association Play',
    promptText: 'Let’s play a word association game! I will say a word like "Brahmaputra", and you say what comes to mind.',
    culturalContext: 'Verbal fluency stimulation widely used in cognitive rehabilitation.',
    iconEmoji: '💬',
    tags: ['words', 'association', 'game']
  },
  {
    id: 'p-game-4',
    categoryId: 'games_riddles',
    title: 'Color & Nature Identification',
    promptText: 'Can you name three flowers that bloom in North East gardens and describe their colors?',
    culturalContext: 'Visual imagery stimulation for occipital-temporal cognitive pathways.',
    iconEmoji: '🌺',
    tags: ['flowers', 'colors', 'nature']
  },
  {
    id: 'p-game-5',
    categoryId: 'games_riddles',
    title: 'Music Rhythm Echo',
    promptText: 'Tap a gentle drum pattern or rhythm for me, and let’s see if I can clap it back!',
    culturalContext: 'Audio-motor synchronization for fronto-parietal coordination.',
    iconEmoji: '👏',
    tags: ['rhythm', 'clap', 'music']
  },

  // ── Category 7: Rivers & Pine Hills ──
  {
    id: 'p-nat-1',
    categoryId: 'nature_hills',
    title: 'Mighty Brahmaputra Sunset',
    promptText: 'Describe the crimson and gold sunset reflecting over the wide waters of the Brahmaputra River.',
    culturalContext: 'Majestic natural imagery creates profound awe and peaceful grounding.',
    iconEmoji: '🌅',
    tags: ['brahmaputra', 'river', 'sunset']
  },
  {
    id: 'p-nat-2',
    categoryId: 'nature_hills',
    title: 'Shillong Pine Breeze & Ward’s Lake',
    promptText: 'Take me on an imaginary stroll around Ward’s Lake in Shillong among the tall pine trees.',
    culturalContext: 'Evokes memories of cool mountain air and peaceful pine scents in Meghalaya.',
    iconEmoji: '🌲',
    tags: ['shillong', 'lake', 'pines', 'breeze']
  },
  {
    id: 'p-nat-3',
    categoryId: 'nature_hills',
    title: 'Rain on Tin Roof in Monsoon',
    promptText: 'What does the sound of steady monsoon rain hitting the tin roof of an Assam home feel like?',
    culturalContext: 'Universal auditory memory in North East India associated with cozy shelter.',
    iconEmoji: '🌧️',
    tags: ['rain', 'monsoon', 'roof']
  },
  {
    id: 'p-nat-4',
    categoryId: 'nature_hills',
    title: 'Majuli River Island Lore',
    promptText: 'Tell me about the spiritual island of Majuli, the pottery craft, and the peaceful monasteries (Sattras).',
    culturalContext: 'Re-activates deep spiritual and geographical heritage of Assam.',
    iconEmoji: '🛶',
    tags: ['majuli', 'sattra', 'island']
  },
  {
    id: 'p-nat-5',
    categoryId: 'nature_hills',
    title: 'Wild Orchids & Bamboo Groves',
    promptText: 'Tell me about the wild foxtail orchids (Kopou Phool) blooming high up in the village trees.',
    culturalContext: 'Connects to springtime symbols and traditional ornamentation.',
    iconEmoji: '🌸',
    tags: ['orchids', 'kopou', 'bamboo']
  }
];

export const INBUILT_SOUNDSCAPES: InbuiltSoundscapeItem[] = [
  {
    id: 'snd-flute',
    name: 'Bamboo Flute Melody',
    emoji: '🪈',
    description: 'Pentatonic folk phrasing simulating traditional Assam flute',
    category: 'music',
    play: () => soundSynth.playAssamFluteMelody()
  },
  {
    id: 'snd-dhol',
    name: 'Bihu Dhol Rhythm',
    emoji: '🥁',
    description: 'Authentic Dum-tak dum-dum-tak folk dance cadence',
    category: 'music',
    play: () => soundSynth.playBihuRhythm()
  },
  {
    id: 'snd-bell',
    name: 'Sacred Temple Bell',
    emoji: '🔔',
    description: '432 Hz resonant bronze bell with shimmering overtones',
    category: 'sacred',
    play: () => soundSynth.playTempleBell()
  },
  {
    id: 'snd-birds',
    name: 'Morning Birdsong',
    emoji: '🐦',
    description: 'Sunrise tea garden mountain birds chirping gently',
    category: 'nature',
    play: () => soundSynth.playMorningBirdSong()
  },
  {
    id: 'snd-rain',
    name: 'Monsoon Tea Leaves',
    emoji: '🌧️',
    description: 'Soft gentle rain shower over lush green bushes',
    category: 'nature',
    play: () => soundSynth.playRainOnTeaLeaves()
  },
  {
    id: 'snd-bowl',
    name: 'Singing Bowl Drone',
    emoji: '🥣',
    description: 'Meditative 2 Hz pulsating acoustic binaural resonance',
    category: 'calm',
    play: () => soundSynth.playSingingBowl()
  },
  {
    id: 'snd-water',
    name: 'Bamboo Water Spring',
    emoji: '💧',
    description: 'Soothing mountain spring water drop in the garden',
    category: 'nature',
    play: () => soundSynth.playWaterDrop()
  },
  {
    id: 'snd-celebration',
    name: 'Celebratory Harp',
    emoji: '🎶',
    description: 'Uplifting pentatonic chime for memory achievements',
    category: 'calm',
    play: () => soundSynth.playCelebration()
  }
];
