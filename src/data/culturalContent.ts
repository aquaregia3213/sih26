import { Language, MemoryPhotoItem, SequenceStep, ReminderItem, IndigenousCareArticle, CognitiveDataPoint, GardenElement } from '../types';

export interface LanguageInfo {
  id: Language;
  name: string;
  nativeScript: string;
  region: string;
  greeting: string;
  phoneticGreeting: string;
  culturalEmblem: string;
  description: string;
  audioSampleText: string;
}

export const REGIONAL_LANGUAGES: LanguageInfo[] = [
  {
    id: 'Assamese',
    name: 'Assamese',
    nativeScript: 'অসমীয়া',
    region: 'Brahmaputra Valley, Assam',
    greeting: 'নমস্কাৰ, আপোনাৰ দিনটো শুভ হওক',
    phoneticGreeting: 'Namaskar, aponar dinto shubho houk',
    culturalEmblem: '🌸 Gamusa & Jappi',
    description: 'Warm, melodious greetings rooted in Assam’s verdant tea gardens and Bihu rhythms.',
    audioSampleText: 'Namaskar! Apunar dinto shubho houk. Vanika loi aadoroni janalo.'
  },
  {
    id: 'Bodo',
    name: 'Bodo',
    nativeScript: 'बड़ो',
    region: 'Bodoland, Western Assam',
    greeting: 'खुलुमबाय, नोंथांनि सानखौ मोजां जाथों',
    phoneticGreeting: 'Khulumbai, nongthangni sankhou mojom jathong',
    culturalEmblem: '🌿 Aronai & Dokhona',
    description: 'Traditional Bodoland warmth reflecting nature, loom weaves, and peaceful courtyard rituals.',
    audioSampleText: 'Khulumbai! Nongthangni sankhou mojom jathong. Vanika ao aadoroni.'
  },
  {
    id: 'Khasi',
    name: 'Khasi',
    nativeScript: 'Khasi',
    region: 'Khasi Hills, Meghalaya',
    greeting: 'Khublei shibun, to ka sngi jong phi kan long kaba suk',
    phoneticGreeting: 'Khublei shibun, to ka sngi jong phi...',
    culturalEmblem: '🌲 Pine Valleys & Living Bridges',
    description: 'Gentle, matrilineal respect and pine-fresh mountain kindness from the abode of clouds.',
    audioSampleText: 'Khublei shibun! To ka sngi jong phi kan long kaba suk bad kaba kmen.'
  },
  {
    id: 'Mizo',
    name: 'Mizo',
    nativeScript: 'Mizo ṭawng',
    region: 'Mizoram Hills',
    greeting: 'Chibai, vawiin ni chu i tan ni hlimawm tak ni rawh se',
    phoneticGreeting: 'Chibai, vawiin ni chu i tan...',
    culturalEmblem: '🎋 Puan Weaves & Cheraw Bamboo',
    description: 'Reverent highland camaraderie embodying the spirit of Tlawmngaihna (selfless care).',
    audioSampleText: 'Chibai! Vawiin ni chu i tan ni hlimawm tak ni rawh se. Vanika ah kan lo lawm a che.'
  },
  {
    id: 'Nagamese',
    name: 'Nagamese',
    nativeScript: 'Nagamese',
    region: 'Nagaland & Border Valleys',
    greeting: 'Bhal asey na? Aji laga din bhal thakibi',
    phoneticGreeting: 'Bhal asey na? Aji laga din...',
    culturalEmblem: '🪶 Hornbill Feather & Morung Wood',
    description: 'Vibrant communal lingua franca carrying ancestral respect and storytelling warmth.',
    audioSampleText: 'Bhal asey na? Aji laga din bhal thakibi. Vanika te apuni ke swagat ase.'
  },
  {
    id: 'English',
    name: 'English (NER Friendly)',
    nativeScript: 'English',
    region: 'All North Eastern Regions',
    greeting: 'Good morning, may peace and joy be with you today',
    phoneticGreeting: 'Good morning, warm welcome to Vanika',
    culturalEmblem: '🕊️ Courtyard & Hill Sunlight',
    description: 'Clear, compassionate voice assistance with gentle Indian pacing and familiar phrasing.',
    audioSampleText: 'Good morning! Welcome to Vanika. Let us take a gentle breath and enjoy our memory courtyard.'
  }
];

export const SAMPLE_MEMORY_PHOTOS: MemoryPhotoItem[] = [
  {
    id: 'mem-1',
    title: 'Family Gathering at Umananda Ghat',
    personName: 'Ravi (Son)',
    relationship: 'Son & Daughter-in-law',
    year: '1998 — Rongali Bihu',
    location: 'Guwahati, Assam',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    audioPrompt: 'Can you remember who is wearing the golden Muga silk shawl in this photo?',
    options: ['Your son Ravi', 'Uncle Mohan', 'Neighbour Barua', 'Dr. Sharma'],
    correctAnswer: 'Your son Ravi',
    storyNote: 'Ravi brought the brass Xorai home that morning during Rongali Bihu. You had prepared sweet Til Pitha together.'
  },
  {
    id: 'mem-2',
    title: 'Granddaughter Anita’s First Day of School',
    personName: 'Anita',
    relationship: 'Granddaughter',
    year: '2012',
    location: 'Shillong, Meghalaya',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    audioPrompt: 'Do you remember who held your hand while walking near Ward’s Lake?',
    options: ['Anita (Granddaughter)', 'Sister Maya', 'Teacher Mary', 'Aunt Rita'],
    correctAnswer: 'Anita (Granddaughter)',
    storyNote: 'Anita loved watching the yellow leaves float on the water while holding her favorite wooden pencil.'
  },
  {
    id: 'mem-3',
    title: 'Morning Walk at Durgasarobar Temple',
    personName: 'Pranab (Younger Brother)',
    relationship: 'Brother',
    year: '2005',
    location: 'Kamakhya Foothills',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    audioPrompt: 'Look at the gentle smile in this courtyard photo. Who is this?',
    options: ['Pranab (Brother)', 'Mr. Das', 'Cousin Bikash', 'Postman Deka'],
    correctAnswer: 'Pranab (Brother)',
    storyNote: 'Pranab would always bring hot Lal Saah (red tea) in the brass flask after the morning hill breeze.'
  },
  {
    id: 'mem-4',
    title: 'Majuli River Island Sunset Boating',
    personName: 'Uncle Dipankar Baruah',
    relationship: 'Family Elder / Uncle',
    year: '2008',
    location: 'Majuli Island, Assam',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    audioPrompt: 'Who sang the boatman folk song on the Brahmaputra ferry?',
    options: ['Uncle Dipankar', 'Nephew Biren', 'Captain Gogoi', 'Brother Pranab'],
    correctAnswer: 'Uncle Dipankar',
    storyNote: 'Uncle Dipankar knew every traditional river ballad by heart and guided the afternoon ferry.'
  },
  {
    id: 'mem-5',
    title: 'Shillong Pine Valley Family Picnic',
    personName: 'Daughter Sunita',
    relationship: 'Daughter',
    year: '2016',
    location: 'Elephant Falls, Meghalaya',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    audioPrompt: 'Who arranged the picnic bamboo basket under the pine shade?',
    options: ['Daughter Sunita', 'Granddaughter Anita', 'Neighbor Mrs. Roy', 'Aunt Rita'],
    correctAnswer: 'Daughter Sunita',
    storyNote: 'Sunita brought fresh ginger biscuits and local pine-honey tea for everyone during the autumn walk.'
  },
  {
    id: 'mem-6',
    title: 'Aizawl Highland Handloom Weaving Day',
    personName: 'Aunt Lalthanpuii',
    relationship: 'Maternal Aunt',
    year: '2001',
    location: 'Aizawl, Mizoram',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    audioPrompt: 'Who wove the vibrant traditional Puan shawl on the wooden loom?',
    options: ['Aunt Lalthanpuii', 'Sister Maya', 'Granddaughter Anita', 'Cousin Mary'],
    correctAnswer: 'Aunt Lalthanpuii',
    storyNote: 'Aunt Lalthanpuii was renowned across the village for her master precision in Puan handloom patterns.'
  }
];

export const BIHU_SEQUENCE_STEPS: SequenceStep[] = [
  {
    id: 'seq-1',
    stepNumber: 1,
    title: '1. Wake up to Morning Birdsong',
    description: 'Listen to the cuckoo singing over the green bamboo grove at dawn.',
    iconName: 'Sun',
    culturalNote: 'Early morning tranquility in the courtyard'
  },
  {
    id: 'seq-2',
    stepNumber: 2,
    title: '2. Mah-Halodhi Herbal Wash',
    description: 'Apply soothing turmeric and raw black gram paste before the ritual wash.',
    iconName: 'Sparkles',
    culturalNote: 'Traditional cleansing with natural healing herbs'
  },
  {
    id: 'seq-3',
    stepNumber: 3,
    title: '3. Don the Red & White Gamusa',
    description: 'Receive and wear the auspicious hand-woven Gamusa with floral motifs.',
    iconName: 'Heart',
    culturalNote: 'Symbol of respect, affection, and elder blessing'
  },
  {
    id: 'seq-4',
    stepNumber: 4,
    title: '4. Respect Elders & Seek Blessings',
    description: 'Touch the feet of respected elders and offer traditional Gamusa gift.',
    iconName: 'Award',
    culturalNote: 'Honoring ancestral wisdom and intergenerational bond'
  },
  {
    id: 'seq-5',
    stepNumber: 5,
    title: '5. Offer Jalpan & Fresh Til Pitha',
    description: 'Share soft Bora rice, sweet jaggery (Gur), curd, and sesame rolls with family.',
    iconName: 'Coffee',
    culturalNote: 'Nutrient-rich traditional morning feast'
  },
  {
    id: 'seq-6',
    stepNumber: 6,
    title: '6. Light the Brass Courtyard Diya',
    description: 'Light the sacred mustard oil lamp at the base of the Banyan or Tulsi altar.',
    iconName: 'Sun',
    culturalNote: 'Dispelling darkness and inviting prosperity'
  },
  {
    id: 'seq-7',
    stepNumber: 7,
    title: '7. Resounding Dhol & Pepa Rhythm',
    description: 'Join the courtyard circle as the buffalo horn pipe and drum celebrate spring harvest.',
    iconName: 'Music',
    culturalNote: 'Community joy and rhythmic acoustic connection'
  },
  {
    id: 'seq-8',
    stepNumber: 8,
    title: '8. Evening Bihu Husori Songs',
    description: 'Listen to the youth singing traditional Husori blessings under the twilight sky.',
    iconName: 'Music',
    culturalNote: 'Peaceful evening harmonic conclusion'
  }
];

export const TEA_PLUCKING_SEQUENCE_STEPS: SequenceStep[] = [
  {
    id: 't-1',
    stepNumber: 1,
    title: '1. Step into the Morning Mist',
    description: 'Walk through the dew-draped green tea avenues as the sun touches the hills.',
    iconName: 'Sun',
    culturalNote: 'Refreshing morning sensory stimulation'
  },
  {
    id: 't-2',
    stepNumber: 2,
    title: '2. Fasten the Tukuri Bamboo Basket',
    description: 'Place the woven cane basket securely around the headstrap with soft cotton cloth.',
    iconName: 'ShoppingBag',
    culturalNote: 'Ergonomic balance passed down generations'
  },
  {
    id: 't-3',
    stepNumber: 3,
    title: '3. Select "Two Leaves and a Bud"',
    description: 'Gently identify the tender golden-green top tip with index and thumb.',
    iconName: 'Leaf',
    culturalNote: 'Mindful touch and tactile observation'
  },
  {
    id: 't-4',
    stepNumber: 4,
    title: '4. Drop into the Shaded Basket',
    description: 'Release the crisp leaf rhythmically over the shoulder into the cool basket.',
    iconName: 'MoveDown',
    culturalNote: 'Continuous soothing motor rhythm'
  },
  {
    id: 't-5',
    stepNumber: 5,
    title: '5. Mid-Morning Weighing Session',
    description: 'Bring the fresh basket to the courtyard shade scale with tea garden friends.',
    iconName: 'CheckCircle2',
    culturalNote: 'Friendly community gathering'
  },
  {
    id: 't-6',
    stepNumber: 6,
    title: '6. Afternoon Rest under Shade Trees',
    description: 'Sit on the green grass mound, enjoy warm red tea, and listen to songbirds.',
    iconName: 'Coffee',
    culturalNote: 'Hydration and gentle relaxation'
  },
  {
    id: 't-7',
    stepNumber: 7,
    title: '7. Gentle Hand Drying & Rolling',
    description: 'Watch the fresh green leaves wither lightly under cool bamboo trays.',
    iconName: 'Sparkles',
    culturalNote: 'Natural aroma release and peaceful tactile feel'
  },
  {
    id: 't-8',
    stepNumber: 8,
    title: '8. Savor Freshly Brewed Tea',
    description: 'Pour the first cup of fragrant red Assam tea on the home verandah.',
    iconName: 'Coffee',
    culturalNote: 'Warm evening contentment'
  }
];


export const SAMPLE_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    time: '07:30 AM',
    title: 'Morning Lal Saah & Blood Pressure Medicine',
    culturalWrapper: 'A warm sip of morning ginger tea with your green tablet, just like the elders do.',
    type: 'medication',
    completed: true,
    audioPrompt: 'Good morning Raj. Have you taken your morning warm tea and blood pressure tablet?'
  },
  {
    id: 'rem-2',
    time: '10:15 AM',
    title: 'Memory Garden Walk & 5-Min Game',
    culturalWrapper: 'Water the jasmine bush in your digital courtyard and recall familiar faces.',
    type: 'memory',
    completed: true,
    audioPrompt: 'The morning flowers are open. Let us play a gentle 5-minute memory game.'
  },
  {
    id: 'rem-3',
    time: '01:00 PM',
    title: 'Hydration & Post-Lunch Rest',
    culturalWrapper: 'A cool copper cup of fresh spring water before your afternoon quiet nap.',
    type: 'hydration',
    completed: false,
    audioPrompt: 'Time for a fresh cup of cool water and a peaceful rest.'
  },
  {
    id: 'rem-4',
    time: '05:30 PM',
    title: 'Courtyard Breath & Family Call',
    culturalWrapper: 'Breathe the evening pine air and hear granddaughter Anita’s voice.',
    type: 'activity',
    completed: false,
    audioPrompt: 'The evening lamps are lit. Let us practice 3 deep breaths and call Anita.'
  }
];

export const INITIAL_GARDEN_ELEMENTS: GardenElement[] = [
  {
    id: 'g-tree',
    type: 'tree',
    title: 'Banyan of Long-Term Memory',
    associatedActivity: 'Who is this? Photo Recall',
    growthStage: 3,
    maxStage: 4,
    lastWatered: 'Today, 8:40 AM',
    color: '#315C4C'
  },
  {
    id: 'g-fern',
    type: 'fern',
    title: 'Tea Bush of Focused Attention',
    associatedActivity: 'Spot the Difference & Visual Scan',
    growthStage: 4,
    maxStage: 4,
    lastWatered: 'Today, 10:12 AM',
    color: '#7EA9A5'
  },
  {
    id: 'g-flower',
    type: 'flower',
    title: 'Kopou Orchid of Cultural Lore',
    associatedActivity: 'Bihu & Folk Instrument Sequences',
    growthStage: 3,
    maxStage: 4,
    lastWatered: 'Yesterday, 4:30 PM',
    color: '#DE8F6E'
  },
  {
    id: 'g-sunflower',
    type: 'sunflower',
    title: 'Sunflower of Daily Routine',
    associatedActivity: 'Medication & Breath Consistency',
    growthStage: 4,
    maxStage: 4,
    lastWatered: 'Today, 7:35 AM',
    color: '#D9A441'
  }
];

export const SAMPLE_7DAY_COGNITIVE_DATA: CognitiveDataPoint[] = [
  { date: '2026-08-21', dayName: 'Fri', memoryScore: 78, attentionScore: 72, moodIndex: 7.8, minutesActive: 16 },
  { date: '2026-08-22', dayName: 'Sat', memoryScore: 80, attentionScore: 75, moodIndex: 8.2, minutesActive: 18 },
  { date: '2026-08-23', dayName: 'Sun', memoryScore: 84, attentionScore: 78, moodIndex: 8.5, minutesActive: 22 },
  { date: '2026-08-24', dayName: 'Mon', memoryScore: 81, attentionScore: 74, moodIndex: 7.9, minutesActive: 15 },
  { date: '2026-08-25', dayName: 'Tue', memoryScore: 74, attentionScore: 71, moodIndex: 7.1, minutesActive: 12 },
  { date: '2026-08-26', dayName: 'Wed', memoryScore: 68, attentionScore: 69, moodIndex: 6.8, minutesActive: 10 },
  { date: '2026-08-27', dayName: 'Today', memoryScore: 82, attentionScore: 76, moodIndex: 8.0, minutesActive: 19 }
];

export const SAMPLE_30DAY_COGNITIVE_DATA: CognitiveDataPoint[] = [
  { date: 'Week 1', dayName: 'W1', memoryScore: 74, attentionScore: 70, moodIndex: 7.2, minutesActive: 85 },
  { date: 'Week 2', dayName: 'W2', memoryScore: 77, attentionScore: 73, moodIndex: 7.6, minutesActive: 98 },
  { date: 'Week 3', dayName: 'W3', memoryScore: 82, attentionScore: 77, moodIndex: 8.1, minutesActive: 115 },
  { date: 'Week 4', dayName: 'W4', memoryScore: 81, attentionScore: 76, moodIndex: 8.0, minutesActive: 110 }
];

export const INDIGENOUS_CARE_ARTICLES: IndigenousCareArticle[] = [
  {
    id: 'care-1',
    title: 'Manimuni & Brahmi Herbs for Gentle Cognitive Vitality',
    region: 'Assam & Meghalaya Tribal Traditions',
    category: 'diet',
    summary: 'Centella asiatica (Manimuni) leaves gently steamed with mashed potato or fish soup is traditionally served to elders to nourish mental clarity.',
    details: 'Practiced for centuries in rural Brahmaputra valley. The leaves are rich in triterpenoids. Steaming lightly preserves their aromatic oils and avoids digestive strain in older adults.',
    recommendedActivity: 'Offer warm Manimuni broth with a pinch of black pepper during lunch.'
  },
  {
    id: 'care-2',
    title: 'The Morung Courtyard Storytelling Ritual',
    region: 'Nagaland & Arunachal Pradesh',
    category: 'storytelling',
    summary: 'Engaging the elder in recounting youth adventures using old clan shawls or wood carvings creates strong episodic memory sparks.',
    details: 'In traditional Naga Morungs, knowledge was transmitted orally by elders. Asking open-ended prompts like "Tell me about the river festival when you were young" stimulates hippocampus pathways without creating test anxiety.',
    recommendedActivity: 'Show a familiar wooden artefact or woven shawl and listen patiently without correcting small date slips.'
  },
  {
    id: 'care-3',
    title: 'Tlawmngaihna & Quiet Community Walks',
    region: 'Mizoram',
    category: 'routine',
    summary: 'Short morning walks accompanied by a neighbor or grandchild along shaded hill tracks foster emotional security and reduce dusk restlessness.',
    details: 'Sunlight exposure between 8:00 AM and 9:30 AM anchors circadian rhythm, stabilizing melatonin production to prevent twilight confusion (sundowning).',
    recommendedActivity: '15-minute slow stroll near flowering shrubs, pointing out bird songs.'
  },
  {
    id: 'care-4',
    title: 'Soothing Bamboo Flute & Soft Dhol Rhythms',
    region: 'All NER States',
    category: 'community',
    summary: 'Slow pentatonic melodies activate auditory cortex regions that remain intact even in moderate dementia.',
    details: 'Music therapy using local instruments (Pepa, bamboo flute, Gogona) evokes deep nostalgic emotional resonance, instantly lowering heart rate variability and agitation.',
    recommendedActivity: 'Play 10 minutes of gentle Bihu flute melodies before evening bedtime.'
  }
];
