import { Language } from '../types';

export interface UITranslationKey {
  home: string;
  howItWorks: string;
  features: string;
  neRoots: string;
  caregivers: string;
  privacy: string;
  patientCourtyard: string;
  caregiverPortal: string;
  talkToOja: string;
  heroHeadline: string;
  heroTagline: string;
  heroDesc: string;
  startExploring: string;
  memoryHouse: string;
  memoryGarden: string;
  whoIsThis: string;
  bihuSequencing: string;
  visualAttention: string;
  culturalWisdom: string;
  darkMode: string;
  lightMode: string;
  textSize: string;
  highContrast: string;
  voicePace: string;
}

export const TRANSLATIONS: Record<Language, UITranslationKey> = {
  English: {
    home: "Home",
    howItWorks: "How It Works",
    features: "Features",
    neRoots: "Northeast Roots",
    caregivers: "For Caregivers",
    privacy: "Privacy",
    patientCourtyard: "Patient Courtyard",
    caregiverPortal: "Caregiver Portal",
    talkToOja: "Talk to Oja",
    heroHeadline: "Vanika",
    heroTagline: "Remember. Play. Connect.",
    heroDesc: "AI-powered cognitive assistance designed around the people, languages, folklore and tranquil tea garden traditions of North Eastern India.",
    startExploring: "Start Exploring",
    memoryHouse: "Memory House",
    memoryGarden: "Memory Garden",
    whoIsThis: "Who is this?",
    bihuSequencing: "Bihu Sequencing",
    visualAttention: "Visual Attention",
    culturalWisdom: "Cultural Wisdom",
    darkMode: "Night Mode",
    lightMode: "Day Mode",
    textSize: "Text Size",
    highContrast: "High Contrast",
    voicePace: "Voice Pace"
  },
  Assamese: {
    home: "মুখ্য পৃষ্ঠা (Home)",
    howItWorks: "কিদৰে কাম কৰে",
    features: "বৈশিষ্ট্যসমূহ",
    neRoots: "উত্তৰ-পূবৰ শিপা",
    caregivers: "সেৱাকৰ্মীৰ বাবে",
    privacy: "গোপনীয়তা",
    patientCourtyard: "স্মৃতি চৰা (Courtyard)",
    caregiverPortal: "সেৱাকৰ্মী পৰ্টেল",
    talkToOja: "ওজাৰ সৈতে কথা পাতক",
    heroHeadline: "বনিকা (Vanika)",
    heroTagline: "মনত পেলাওক। খেলক। সংযোগ কৰক।",
    heroDesc: "উত্তৰ-পূব ভাৰতৰ লোকসংস্কৃতি, ভাষা আৰু চাহ বাগিচাৰ ঐতিহ্যৰে সমৃদ্ধ এআই স্মৃতি সহায়ক।",
    startExploring: "আৰম্ভ কৰক",
    memoryHouse: "স্মৃতি ঘৰ",
    memoryGarden: "স্মৃতি বাগান",
    whoIsThis: "ইওঁ কোন?",
    bihuSequencing: "বিহু ক্ৰম খেল",
    visualAttention: "দৃষ্টি মনোযোগ",
    culturalWisdom: "সাংস্কৃতিক জ্ঞান",
    darkMode: "ৰাতিৰ মড",
    lightMode: "দিনৰ মড",
    textSize: "আখৰৰ আকাৰ",
    highContrast: "উচ্চ বৈষম্য",
    voicePace: "কথাৰ গতি"
  },
  Bodo: {
    home: "गुबै निहाइ (Home)",
    howItWorks: "माब्रै मावनाय जायो",
    features: "अंगफोर",
    neRoots: "सा-सानजा रोदा",
    caregivers: "सावथ्रिगिरिफोरनि थाखाय",
    privacy: "गोपनीयता",
    patientCourtyard: "स्मृति प्रांगण",
    caregiverPortal: "सावथ्रिगिरि पोर्टेल",
    talkToOja: "ओजानि लोगोसे रायलाय",
    heroHeadline: "बनिका (Vanika)",
    heroTagline: "गोसोखां। गेले। सोमोन्दो ला।",
    heroDesc: "सा-सानजा भारतनि हारिमु, राव आरो सोगांनि सोमोन्दोजों दाजानाय एआई गोसोखांथाइ हेफाबगिरि।",
    startExploring: "जायगा नागिरनाय",
    memoryHouse: "गोसोखां न",
    memoryGarden: "गोसोखां बारि",
    whoIsThis: "बे सोर?",
    bihuSequencing: "बिहु बाहागो",
    visualAttention: "नोजोर होनाय",
    culturalWisdom: "हारिमु गियान",
    darkMode: "हरनि मड",
    lightMode: "साननि मड",
    textSize: "फंनि महर",
    highContrast: "गोजोन महर",
    voicePace: "राव गोख्रैनाय"
  },
  Khasi: {
    home: "Shynrong (Home)",
    howItWorks: "Kumno ka treikam",
    features: "Ki jingkyrpang",
    neRoots: "Tynrai Mihngi",
    caregivers: "Nongsumar",
    privacy: "Jingshngiam",
    patientCourtyard: "Rynsan Kynmaw",
    caregiverPortal: "Portal Nongsumar",
    talkToOja: "Kren bad u Oja",
    heroHeadline: "Vanika",
    heroTagline: "Kynmaw. Pynbyrngei. Iasoh.",
    heroDesc: "Jingsumar pynkynmaw jingmut AI bakhraw ba thaw kyrpang na bynta ki langbrot u lum mihngi India.",
    startExploring: "Sdang pynbyrngei",
    memoryHouse: "Ing Kynmaw",
    memoryGarden: "Kper Kynmaw",
    whoIsThis: "Uei une?",
    bihuSequencing: "Jingpynbeit Bihu",
    visualAttention: "Jingkhmih Bniah",
    culturalWisdom: "Jingstad Tynrai",
    darkMode: "Mode Mynmiet",
    lightMode: "Mode Mynsngi",
    textSize: "Jingseid Dak",
    highContrast: "Phyrnai Bniah",
    voicePace: "Stet Kren"
  },
  Mizo: {
    home: "Inpui (Home)",
    howItWorks: "Kalhmang",
    features: "A tha zualte",
    neRoots: "Chhimchak Zoram",
    caregivers: "Rawnvawttu tan",
    privacy: "Rukneuhna",
    patientCourtyard: "Hrethu Tualtuang",
    caregiverPortal: "Rawnvawttu Portal",
    talkToOja: "Oja be rawh",
    heroHeadline: "Vanika",
    heroTagline: "Hrereng. Tiah. Inzawm.",
    heroDesc: "Chhimchak tlangram mihuam leh zohnahthlak tlawmngaihna nena duan AI hmanga rilru chawmtu.",
    startExploring: "Tan rawh",
    memoryHouse: "Hriatna In",
    memoryGarden: "Hriatna Huani",
    whoIsThis: "Tuh nge a nih?",
    bihuSequencing: "Kut lam ruahmanna",
    visualAttention: "Mitthla entirna",
    culturalWisdom: "Hnam Hriatna",
    darkMode: "Zan Zanfir",
    lightMode: "Chhun Chawp",
    textSize: "Hawrawp Saiz",
    highContrast: "Enna Hmuh",
    voicePace: "Tawng Chak"
  },
  Nagamese: {
    home: "Ghar (Home)",
    howItWorks: "Kene kaam kore",
    features: "Niyaamaan",
    neRoots: "Pahar Laga Shor",
    caregivers: "Chowkidar nimite",
    privacy: "Gupit katha",
    patientCourtyard: "Yaad Kuri Courtyard",
    caregiverPortal: "Caregiver Portal",
    talkToOja: "Oja logote kotha kobi",
    heroHeadline: "Vanika",
    heroTagline: "Yaad kuru. Khelu. Log pou.",
    heroDesc: "North East pahari manuh, bhasha aru parampara nimite banai thaka AI dimag madad engine.",
    startExploring: "Start Kuru",
    memoryHouse: "Yaad Ghar",
    memoryGarden: "Yaad Garden",
    whoIsThis: "Etu kun ase?",
    bihuSequencing: "Bihu Niyam",
    visualAttention: "Sai Thaki",
    culturalWisdom: "Parampara Gyan",
    darkMode: "Rati Mode",
    lightMode: "Din Mode",
    textSize: "Tia Akharr",
    highContrast: "Saaf Dekhi",
    voicePace: "Kotha Speed"
  }
};

export function getTranslation(lang: Language): UITranslationKey {
  return TRANSLATIONS[lang] || TRANSLATIONS['English'];
}
