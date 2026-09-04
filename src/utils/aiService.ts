import { Language } from '../types';

export interface AIServiceConfig {
  apiKey?: string;
  provider: 'server-gateway' | 'gemini-header' | 'pollinations-free' | 'offline-vault';
}

const VANIKA_OJA_SYSTEM_PROMPT = `
You are "Oja / Aita", a warm, deeply empathetic AI Elder Companion trained specifically for North Eastern India (Assam, Meghalaya, Mizoram, Nagaland, Bodoland, Manipur, Tripura, Arunachal Pradesh).

Your Core Directives:
1. Tone & Demeanor: Speak with extreme warmth, respect, patience, and elder-friendly clarity. Use calm, gentle language (maximum 2-3 spoken sentences).
2. Regional Culture: Seamlessly reference North Eastern cultural heritage — Assam tea gardens, Rongali Bihu Dhol drums, Shillong Ward's Lake walks, Majuli island stories, and traditional verandah tea.
3. Language Awareness: Respect the user's selected language (Assamese, Bodo, Khasi, Mizo, Nagamese, English). Start with warm regional greetings like "Namaskar", "Khublei", or "Chibai".
4. Reminiscence & Cognitive Care: Gently stimulate nostalgic memory recall without forcing or testing. Ask cozy questions about family, past music, and tea harvesting.
5. Grounding Safety: If the elder expresses confusion or anxiety, provide immediate soothing reassurance: "You are safe at your home. All is well." Never give medical diagnoses.
`;

export class AIService {
  private static getStoredApiKey(): string {
    return localStorage.getItem('vanika_gemini_api_key') || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  }

  public static setStoredApiKey(key: string): void {
    localStorage.setItem('vanika_gemini_api_key', key);
  }

  public static async generateCompanionResponse(
    userPrompt: string,
    currentLanguage: Language = 'English',
    elderProfile: any = null
  ): Promise<string> {
    const elderName = elderProfile?.name || elderProfile?.elderName || 'Dipankar Baruah';
    const nickname = elderProfile?.elderNickname || elderName.split(' ')[0] || 'Kaka';

    // Route 1: Secure Server-Side Backend Gateway (Express /api/companion/chat)
    // Prevents API key exposure on client, complies with DPDP Act 2023 & OWASP
    try {
      const response = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          language: currentLanguage,
          userContext: { elderName, nickname }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.reply && typeof data.reply === 'string' && data.reply.trim().length > 5) {
          return data.reply.trim();
        }
      }
    } catch (err) {
      // Backend not running or in offline/static hosting mode, proceed to client fallback
    }

    const contextualUserMessage = `
[Elder Profile Context: Name: ${elderName}, Nickname: ${nickname}, Preferred Language: ${currentLanguage}]
Elder User Message: "${userPrompt}"
    `.trim();

    // Route 2: Client-side Gemini API with header authorization (Only if user supplied private key)
    const apiKey = this.getStoredApiKey();
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey.trim()
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: VANIKA_OJA_SYSTEM_PROMPT },
                    { text: contextualUserMessage }
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) return generatedText.trim();
        }
      } catch (err) {
        console.warn('[AIService] Direct Gemini client route failed, proceeding to open fallback:', err);
      }
    }

    // Route 3: Free Open AI route (Pollinations AI - zero client key required)
    try {
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: VANIKA_OJA_SYSTEM_PROMPT },
            { role: 'user', content: contextualUserMessage }
          ],
          model: 'openai'
        })
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().length > 5) {
          return text.trim();
        }
      }
    } catch (err) {
      console.warn('[AIService] Open AI route unavailable, activating 100% offline regional vault:', err);
    }

    // Route 4: 100% Offline Regional Intent Engine across all 6 NER Languages
    return this.generateOfflineFallback(userPrompt, currentLanguage, nickname);
  }

  /**
   * Comprehensive, culturally grounded offline intent-matching response matrix.
   * Covers 12+ emotional and cultural intents across Assamese, Bodo, Khasi, Mizo, Nagamese, and English.
   */
  public static generateOfflineFallback(prompt: string, lang: Language, nickname: string): string {
    const lower = prompt.toLowerCase();

    // Determine Intent Category
    let category = 'default';
    if (lower.includes('confused') || lower.includes('where am i') || lower.includes('lost') || lower.includes('scared') || lower.includes('fear') || lower.includes('worry') || lower.includes('forget')) {
      category = 'anxiety_grounding';
    } else if (lower.includes('tea') || lower.includes('saah') || lower.includes('morning') || lower.includes('breakfast') || lower.includes('cup')) {
      category = 'tea_morning';
    } else if (lower.includes('bihu') || lower.includes('music') || lower.includes('song') || lower.includes('dance') || lower.includes('pepa') || lower.includes('dhol') || lower.includes('festival')) {
      category = 'bihu_music';
    } else if (lower.includes('son') || lower.includes('daughter') || lower.includes('granddaughter') || lower.includes('grandson') || lower.includes('family') || lower.includes('child') || lower.includes('anita')) {
      category = 'family';
    } else if (lower.includes('river') || lower.includes('brahmaputra') || lower.includes('hill') || lower.includes('shillong') || lower.includes('lake') || lower.includes('breeze') || lower.includes('mountain')) {
      category = 'nature_hills';
    } else if (lower.includes('health') || lower.includes('medicine') || lower.includes('tonic') || lower.includes('herb') || lower.includes('brahmi') || lower.includes('manimuni') || lower.includes('doctor')) {
      category = 'health_tonics';
    } else if (lower.includes('sleep') || lower.includes('tired') || lower.includes('night') || lower.includes('evening') || lower.includes('rest') || lower.includes('bed')) {
      category = 'sleep_rest';
    } else if (lower.includes('rain') || lower.includes('sun') || lower.includes('weather') || lower.includes('monsoon') || lower.includes('cloud')) {
      category = 'weather';
    } else if (lower.includes('game') || lower.includes('puzzle') || lower.includes('play') || lower.includes('score') || lower.includes('card')) {
      category = 'games';
    } else if (lower.includes('sad') || lower.includes('lonely') || lower.includes('alone') || lower.includes('miss')) {
      category = 'loneliness';
    } else if (lower.includes('food') || lower.includes('eat') || lower.includes('rice') || lower.includes('fish') || lower.includes('pitha') || lower.includes('tenga')) {
      category = 'food';
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('namaskar') || lower.includes('khublei') || lower.includes('chibai')) {
      category = 'greeting';
    } else if (lower.includes('thank') || lower.includes('dhanyabad') || lower.includes('khublei shibun')) {
      category = 'gratitude';
    }

    // Regional Dialect Fallback Matrices
    switch (lang) {
      case 'Assamese':
        switch (category) {
          case 'anxiety_grounding':
            return `নমস্কাৰ ${nickname}! আপুনি নিজৰ ঘৰতেই সুৰক্ষিত হৈ আছে। কোনো ভয় নকৰিব। অলপ দীঘলকৈ উশাহ লওক, মই আপোনাৰ লগতেই আছোঁ।`;
          case 'tea_morning':
            return `নমস্কাৰ ${nickname}! পুৱাৰ ৰঙা চাহ (লাল চাহ) খোৱা হ'লনে? বাৰাণ্ডাত বহি চাহৰ কাপটো হাতত ল'লে মনটো কিমান শান্ত লাগে নহয়নে?`;
          case 'bihu_music':
            return `নমস্কাৰ ${nickname}! ব'হাগ বিহুৰ পেঁপা আৰু ঢোলৰ মাত শুনিলে মনটো আনন্দৰে ভৰি পৰে। আপোনাৰ বিহুলৈ মনত পৰিছে নেকি?`;
          case 'family':
            return `নমস্কাৰ ${nickname}! আপোনাৰ পৰিয়ালে আপোনাক বহুত মৰম কৰে। নাতি-নাতিনীহঁতে আপোনাৰ কথাই কৈ থাকে। আমি ফটো এলবামখন চাওঁ আহক।`;
          case 'nature_hills':
            return `নমস্কাৰ ${nickname}! লুইতৰ পাৰৰ শীতল বতাহজাকৰ কথা ভাবকচোন। ব্ৰহ্মপুত্ৰৰ শান্ত ঢৌবোৰে মনলৈ গভীৰ প্ৰশান্তি আনে।`;
          case 'health_tonics':
            return `নমস্কাৰ ${nickname}! পুৱাৰ ঔষধ আৰু মণিমুনি-ব্ৰাহ্মীৰ ৰস খোৱাৰ সময় হ'ল। নিজৰ যত্ন লওক, স্বাস্থ্যই আমাৰ পৰম ধন।`;
          case 'sleep_rest':
            return `নমস্কাৰ ${nickname}! গধূলি নামি আহিল। এতিয়া জিৰণি লোৱাৰ সময়। মনটো শান্ত কৰি শুই পৰক, শুভ ৰাত্ৰি।`;
          case 'weather':
            return `নমস্কাৰ ${nickname}! টিনৰ চালত বৰষুণৰ টোপাল পৰিলে মনটো বৰ ভাল লাগে। বতৰটো শান্ত আৰু স্নিগ্ধ হৈ পৰিছে।`;
          case 'games':
            return `নমস্কাৰ ${nickname}! মগজু সতেজ ৰাখিবলৈ স্মৃতি খেল খেলিলে বহুত ভাল ফল পোৱা যায়। আজি এখন সৰু খেল খেলো আহক!`;
          case 'loneliness':
            return `নমস্কাৰ ${nickname}! আপুনি অকলে নাই। মই আপোনাৰ ওচৰতেই আছোঁ। মনৰ কথা কওক, মই শুনিবলৈ ৰৈ আছোঁ।`;
          case 'food':
            return `নমস্কাৰ ${nickname}! তিল পিঠা, ঘিলা পিঠা আৰু গৰম ভাতৰ সোৱাদ সঁচাকৈ অতুলনীয়। আজি কিবা ভাল বস্তু খালে নে?`;
          case 'greeting':
            return `নমস্কাৰ ${nickname}! আপোনাক পাই মোৰ মনটো আনন্দিত হ'ল। আজি আপোনাৰ দিনটো কেনে গৈছে কওক?`;
          case 'gratitude':
            return `নমস্কাৰ ${nickname}! আপোনাক ধন্যবাদ দিয়াৰ কোনো প্ৰয়োজন নাই, আপোনাৰ লগত কথা পাতি মোৰো বৰ ভাল লাগে।`;
          default:
            return `নমস্কাৰ ${nickname}! আপোনাৰ মাতটো শুনি মন জুৰ পৰিল। চাহ বাগিচা বা পুৰণি দিনৰ কিবা এটা ধুনীয়া সাধু কওকচোন।`;
        }

      case 'Bodo':
        switch (category) {
          case 'anxiety_grounding':
            return `खुलुमबाय ${nickname}! नोंथाङा नोंनि गावनि न'आवनो साफा आरो रैखाथि गोनांयै दं। गिनाङा, आं नोंथांनि सेरावनो दं।`;
          case 'tea_morning':
            return `खुलुमबाय ${nickname}! फुंनि साहा लोंखांबाय नामा? साहा लोंनानै जिरायनाया गोसोखौ गोजोन खालामो।`;
          case 'bihu_music':
            return `खulumbay ${nickname}! बैसागुनि सिफुं आरो बाखामुलिनि मोसाया गोसोखौ रंजाखां होयो। नोंथांनि बैसागु सानफोरखौ गोसोखांफाबो नामा?`;
          case 'family':
            return `खुलुमबाय ${nickname}! नोंथांनि नखरनि मानसिफोरा नोंथांखौ जोबोर अनसायो। बिसोर सानफ्रोमबो नोंखौ गोसोखाङो।`;
          case 'nature_hills':
            return `खुलुमबाय ${nickname}! बार बारनाय आरो मिथिंगानि गोजोन थासारिया गोसोखौ शान्ति होयो।`;
          case 'health_tonics':
            return `खulumbay ${nickname}! गावनि देहाखौ मोजाङै लाखि, फुंनि मुलि आरो दै लोङाबा दाबाव।`;
          case 'sleep_rest':
            return `खुलुमबाय ${nickname}! मोनाबाय, एबार जिरायदो। गोसोखौ शान्ति लाखिनानै उन्दुदो, गोजोन हर।`;
          default:
            return `खुलुमबाय ${nickname}! नोंथांनि रावखौ खोनानानै आं जोबोर गोजोनबाय। नोंनि सानस्रिया माबोरै थांदों?`;
        }

      case 'Khasi':
        switch (category) {
          case 'anxiety_grounding':
            return `Khublei ${nickname}! Phi don ha la ka iing kaba shngain. Wat sheptieng eiei, nga don lang bad phi ban pyntngen ia phi.`;
          case 'tea_morning':
            return `Khublei ${nickname}! Lah dih sha step aiu phi? Ka sha saw kaba syaid ha ka step kaba pyngngad ka pynsngewbha shibun ia ka dohnud.`;
          case 'bihu_music':
          case 'nature_hills':
            return `Khublei ${nickname}! Kynmaw ia ka lyer pyngngad jong ki lum Shillong bad ka nan Ward's Lake. Ka pynkyndit kynmaw ia ki por kiba kmen.`;
          case 'family':
            return `Khublei ${nickname}! Ka kynhun iing jong phi ka ieid eh ia phi. Phi don ha ka mynsiem kaba kmen bad kaba shngain.`;
          case 'health_tonics':
            return `Khublei ${nickname}! Kynmaw ban dih dawai bad dih um syaid. Sumar bha ia ka met ka phad jong phi.`;
          case 'sleep_rest':
            return `Khublei ${nickname}! Ka janmiet kaba suk ka la wan. Thiah suk mynta ka miet, wat khuslai eiei.`;
          case 'greeting':
            return `Khublei ${nickname}! Ka long ka jingkyrkhu ban iakren bad phi mynta ka sngi. Kumno ka sngi jong phi?`;
          default:
            return `Khublei shibun ${nickname}! Ka sngewtynnad eh ban iohsngew ia ka sur ktien jong phi. Iathuh lem ia ki jingkynmaw ba thiang jong phi.`;
        }

      case 'Mizo':
        switch (category) {
          case 'anxiety_grounding':
            return `Chibai ${nickname}! I in ngeiah him takin i awm e. Hlau suh, i kiangah ka awm tlat e. Thawk la la vang vang rawh le.`;
          case 'tea_morning':
            return `Chibai ${nickname}! Zing thingpui hang tui tak i in tawh em? Veranda a thingpui in chu a thlamuanthlak hle mai.`;
          case 'nature_hills':
            return `Chibai ${nickname}! Kan Mizoram tlang mawi tak leh thli vawt nuam tak chu ngaihtuah la, rilru a tihahdam sawng sawng thin.`;
          case 'family':
            return `Chibai ${nickname}! I chhungte hian an ngaina em em che a, i tan an awm reng e. I thlalak hlui te en dun ang hmiang.`;
          case 'health_tonics':
            return `Chibai ${nickname}! I damdawi ei theihnghilh suh aw. Hriselna hi kan rohlu ber a ni si a.`;
          case 'sleep_rest':
            return `Chibai ${nickname}! Zan a lo thleng ta, hahchawl tawh rawh le. Mut tha la, tui takin mu rawh aw.`;
          case 'greeting':
            return `Chibai ${nickname}! Vawiin i hmuh chu a va lawmawm em! I vawiin hun hman a nuam em?`;
          default:
            return `Chibai ${nickname}! I aw ngaihthlak chu a va nuam em. Hmanlai thawnthu leh hla mawi tak tak te min hrilh ve rawh le.`;
        }

      case 'Nagamese':
        switch (category) {
          case 'anxiety_grounding':
            return `Namaskar ${nickname}! Apuni nijor ghor te ase, pura safe ase. Eku chinta nakoribi, moi apuni logot te aase. Lamba saas lobi.`;
          case 'tea_morning':
            return `Namaskar ${nickname}! Pua laga Lal Cha khana hoise na? Verandah te bohi kene cha khale mon laga bhal lage.`;
          case 'nature_hills':
          case 'bihu_music':
            return `Namaskar ${nickname}! Pahar laga thanda batash aru gaon laga giti mon te anile mon bishi khushi lage.`;
          case 'family':
            return `Namaskar ${nickname}! Apuni laga bacha aru ghor manu sob apuni ke bishi morom kore. Photo album sabo aaha na?`;
          case 'health_tonics':
            return `Namaskar ${nickname}! Pua laga dowa khan time te lobi. Nijor ga bhal thakibo lage.`;
          case 'sleep_rest':
            return `Namaskar ${nickname}! Rati aahise, aji laga din te bishi kotha patise. Aram koribi aru bhal pora ghumabi.`;
          case 'greeting':
            return `Namaskar ${nickname}! Aji apuni logot kotha patibo pai kene bishi bhal lagise. Din kineka jase?`;
          default:
            return `Namaskar ${nickname}! Apuni laga awaj suni kene mon jur paishe. Puran din laga bhal kahani sob kobi sun.`;
        }

      case 'English':
      default:
        switch (category) {
          case 'anxiety_grounding':
            return `Namaskar ${nickname}! Please take a gentle, deep breath. You are completely safe in your peaceful home. Your family loves you deeply, and I am sitting right here with you. Shall we look at cozy tea garden photos together?`;
          case 'tea_morning':
            return `Namaskar ${nickname}! A fresh cup of hot red tea (Lal Saah) on the bamboo verandah is the best way to welcome the sunrise. How are you enjoying your morning today?`;
          case 'bihu_music':
            return `Namaskar ${nickname}! Ah, the joyful sound of the Dhol drum and Pepa flute under the golden Banyan tree brings back fond memories. I can almost feel the festive warmth!`;
          case 'family':
            return `Namaskar ${nickname}! Your family holds you dearly in their hearts. Anita and your loved ones are always keeping you in their warm thoughts. Shall we check your memory album?`;
          case 'nature_hills':
            return `Namaskar ${nickname}! Picture the cool mountain breeze coming over Ward's Lake or the serene water flowing down the Brahmaputra. Nature brings soothing calm to our spirit.`;
          case 'health_tonics':
            return `Namaskar ${nickname}! Health is our sacred treasure. Remember to take a slow sip of warm water and your morning tonics. Your mind is calm and well-cared for.`;
          case 'sleep_rest':
            return `Namaskar ${nickname}! Rest softly now. Let the gentle evening sounds settle your thoughts into quiet peace. You have done so well today. May your sleep be sweet and undisturbed.`;
          case 'weather':
            return `Namaskar ${nickname}! The fresh rain on green tea leaves fills the verandah with such a peaceful fragrance. It is a lovely moment to sit comfortably and rest.`;
          case 'games':
            return `Namaskar ${nickname}! Engaging in memory games keeps our spirit bright like a morning star. Would you like to try the Photo Recall or Cultural Sequence game today?`;
          case 'loneliness':
            return `Namaskar ${nickname}! You are never alone. I am sitting right here beside you, and your home is filled with warmth and precious memories. Tell me what is on your mind.`;
          case 'food':
            return `Namaskar ${nickname}! Traditional warm meals like homemade pitha, steaming rice, and fresh fish broth bring so much comfort. Have you had your nourishing meal today?`;
          case 'greeting':
            return `Namaskar ${nickname}! What a joyful blessing to greet you today! I hope your morning is peaceful and bright. How may I keep you company?`;
          case 'gratitude':
            return `Namaskar ${nickname}! You are most warmly welcome. It brings me immense joy to sit and share these quiet moments with you.`;
          default:
            return `Namaskar ${nickname}! It is so comforting to hear your voice. Tell me more about your favorite memories of the green Brahmaputra hills or your morning tea.`;
        }
    }
  }
}
