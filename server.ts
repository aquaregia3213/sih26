import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;


app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Lazy-initialized Gemini API client
// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (key && key !== "MY_GEMINI_API_KEY" && key.length > 10) {
    if (!aiClient) {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
    return aiClient;
  }
  return null;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  const key = process.env.GEMINI_API_KEY?.trim();
  res.json({
    status: "ok",
    app: "Vanika - AI Cognitive Care for North East India",
    geminiConfigured: !!(key && key !== "MY_GEMINI_API_KEY" && key.length > 10),
    timestamp: new Date().toISOString()
  });
});

// Opportunistic Background Sync Endpoint for Caregiver/ASHA Uploads
app.post("/api/sync", (req, res) => {
  try {
    const { queue, patientId, clientTimestamp } = req.body;
    console.log(`[SyncServer] Received ${queue?.length || 0} offline sync items for patient ${patientId} at ${clientTimestamp}`);
    res.json({
      status: "synced",
      itemsProcessed: queue?.length || 0,
      syncedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("[SyncServer] Sync upload failed:", err);
    res.status(500).json({ error: "Failed to process offline sync upload" });
  }
});

// Daily Routine Management Endpoints
interface RoutineItem {
  id: string;
  time: string;
  title: string;
  icon: string;
  period: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
}

let inMemoryRoutines: RoutineItem[] = [
  { id: 'r1', time: '6:30 AM', title: 'Wake up & stretch gently', icon: '🌅', period: 'morning', completed: true },
  { id: 'r2', time: '7:00 AM', title: 'Morning medicine', icon: '💊', period: 'morning', completed: true },
  { id: 'r3', time: '7:30 AM', title: 'Breakfast — lal saah & pitha', icon: '🍵', period: 'morning', completed: false },
  { id: 'r4', time: '8:00 AM', title: 'Morning walk in the garden', icon: '🚶', period: 'morning', completed: false },
  { id: 'r5', time: '9:00 AM', title: 'Cognitive activity session', icon: '🧩', period: 'morning', completed: false },
  { id: 'r6', time: '12:30 PM', title: 'Lunch — fresh seasonal rice & herbs', icon: '🍛', period: 'afternoon', completed: false },
  { id: 'r7', time: '2:00 PM', title: 'Afternoon rest & quiet time', icon: '😴', period: 'afternoon', completed: false },
  { id: 'r8', time: '4:30 PM', title: 'Evening tea & family courtyard chat', icon: '☕', period: 'evening', completed: false },
  { id: 'r9', time: '6:00 PM', title: 'Evening memory photo stroll', icon: '🎯', period: 'evening', completed: false },
  { id: 'r10', time: '8:00 PM', title: 'Dinner & evening medication', icon: '🍽️', period: 'evening', completed: false },
  { id: 'r11', time: '9:30 PM', title: 'Bedtime relaxation & peaceful sleep', icon: '🌙', period: 'evening', completed: false }
];

app.get("/api/routines", (_req, res) => {
  res.json({
    success: true,
    message: "Routines retrieved successfully",
    data: inMemoryRoutines
  });
});

app.post("/api/routines", (req, res) => {
  try {
    const { title, time, period, icon } = req.body;
    const newTask: RoutineItem = {
      id: `r-${Date.now()}`,
      title: title || 'New Routine Task',
      time: time || '12:00 PM',
      period: (period ? String(period).toLowerCase() : 'morning') as any,
      icon: icon || '📋',
      completed: false
    };
    inMemoryRoutines.push(newTask);
    res.status(201).json({
      success: true,
      message: "Routine task created",
      data: newTask
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/routines/:id/complete", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const task = inMemoryRoutines.find(t => t.id === id);
  if (task) {
    task.completed = completed !== undefined ? !!completed : !task.completed;
    res.json({
      success: true,
      message: "Routine completion status updated",
      data: task
    });
  } else {
    res.status(404).json({ success: false, message: "Routine task not found" });
  }
});

app.patch("/api/routines/:id", (req, res) => {
  const { id } = req.params;
  const { title, time, period, icon } = req.body;
  const task = inMemoryRoutines.find(t => t.id === id);
  if (task) {
    if (title) task.title = title;
    if (time) task.time = time;
    if (period) task.period = String(period).toLowerCase() as any;
    if (icon) task.icon = icon;
    res.json({
      success: true,
      message: "Routine task updated",
      data: task
    });
  } else {
    res.status(404).json({ success: false, message: "Routine task not found" });
  }
});

app.delete("/api/routines/:id", (req, res) => {
  const { id } = req.params;
  inMemoryRoutines = inMemoryRoutines.filter(t => t.id !== id);
  res.json({
    success: true,
    message: "Routine task deleted"
  });
});



// AI Companion Chat endpoint
app.post("/api/companion/chat", async (req, res) => {
  try {
    const { message, language = "English", emotionState = "calm", userContext } = req.body;

    const regionalPrompts: Record<string, string> = {
      Assamese: "You are 'Oja / Aita' (Wise respected Elder in Assam), an affectionate, soothing AI companion for an elderly person. Use simple, gentle words in Assamese (or Assamese-English hybrid if helpful) with warm cultural touch like 'Bhal pale? Khuwa-buwa hol ne? Morom logil.' Speak slowly, reassuringly, reminding them of peaceful things like tea gardens, Bihu memories, and family love.",
      Bodo: "You are a loving Elder Companion from Bodoland, speaking warmly with gentle affection, referencing peaceful village memories, traditional weavers, and quiet joy.",
      Khasi: "You are 'Mei-ieid / Pa-ieid' (Beloved Grandmother/Grandfather in Meghalaya), speaking with soothing pine-breeze warmth, gentle respect, and calm encouragement.",
      Mizo: "You are a beloved 'Pi/Pu' (Respected Elder in Mizoram), speaking with gentle mountain warmth, peace, and loving encouragement.",
      Nagamese: "You are a warm tribal village elder speaking simple Nagamese/English with immense kindness, storytelling warmth, and reassurance.",
      English: "You are 'Vanika', a warm, gentle, respected Elder Companion designed for elderly people in North Eastern India. You speak with deep kindness, calm pacing, simple sentences (maximum 2-3 short sentences), reassuring tone, and gentle cultural references like morning red tea (Lal Saah), quiet hills, soft breeze, and family affection. Never sound medical, robotic, or diagnostic. If the elder is feeling confused or tired, offer peace, deep breaths, and love."
    };

    const systemInstruction = regionalPrompts[language] || regionalPrompts["English"];

    const ai = getAIClient();

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemInstruction}\n\nCurrent Elder Emotion state: ${emotionState}.\nElder said: "${message || "Good morning"}"\n\nRespond warmly in 1-3 short, spoken sentences that feel like a loving elder sitting beside them:`
              }
            ]
          }
        ]
      });

      const replyText = response.text?.trim() || "Good morning, dear one. May your day be as peaceful as the morning mist over the Brahmaputra hills. How are you feeling today?";
      
      return res.json({
        reply: replyText,
        source: "gemini-ai",
        emotionGuidance: emotionState === "frustrated" ? "soothing" : "joyful"
      });
    }

    // High quality culturally authentic fallback when API key is not yet set or offline
    const fallbackResponses: Record<string, string[]> = {
      English: [
        "Good morning, my dear friend. The morning sun over the green hills brings peace. Let us have a gentle sip of tea and remember a happy moment together.",
        "You are doing wonderfully today. Take your time, there is no hurry in our digital courtyard. Shall we look at some family photographs?",
        "Listen to the soft birds chirping outside. Breathe in slowly... and breathe out with ease. You are safe and loved.",
        "Well remembered! Your mind is like a clear mountain stream in Shillong. Let us play a little memory game together."
      ],
      Assamese: [
        "নমস্কাৰ! আপোনাৰ দিনটো বৰ সুন্দৰ হওক। আহক, অলপ সময় লৈ কথা পাতোঁ। (Namaskar! May your day be wonderful. Come, let us sit and talk gently.)",
        "আপুনি বৰ সুন্দৰকৈ মনত পেলালে! মনটো শান্ত ৰাখক, সকলো ঠিকেই আছে। (You remembered so well! Keep your mind calm, everything is well.)"
      ],
      Khasi: [
        "Khublei shibun! Nga don hangne bad phi. To ngin pynleit jingmut lang mynta. (Greetings! I am right here with you. Let us share a calm thought together.)"
      ],
      Mizo: [
        "Chibai! Vawiin chu ni nuam tak a ni e. Hahdam deuhin awm rawh. (Hello! Today is a beautiful peaceful day. Rest easily.)"
      ]
    };

    const list = fallbackResponses[language] || fallbackResponses["English"];
    const fallbackReply = list[Math.floor(Math.random() * list.length)];

    return res.json({
      reply: fallbackReply,
      source: "local-companion",
      emotionGuidance: "soothing"
    });
  } catch (error: any) {
    console.error("AI Companion chat error:", error);
    res.json({
      reply: "Good morning, dear friend. Take a gentle breath. I am always right here with you in our quiet courtyard.",
      source: "resilient-fallback"
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  function listenOnPort(portToTry: number, maxRetries = 5) {
    const serverInstance = app.listen(portToTry, "0.0.0.0", () => {
      console.log(`Vanika Server running on http://localhost:${portToTry} (or http://127.0.0.1:${portToTry})`);
    });

    serverInstance.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`[Vanika Server] Port ${portToTry} is already in use.`);
        if (maxRetries > 0) {
          const nextPort = portToTry + 1;
          console.log(`[Vanika Server] Retrying on next available port http://localhost:${nextPort}...`);
          listenOnPort(nextPort, maxRetries - 1);
        } else {
          console.error(`[Vanika Server] Could not bind to an open port after multiple attempts.`);
        }
      } else {
        console.error("[Vanika Server] Listen error:", err);
      }
    });
  }

  listenOnPort(PORT);
}

startServer();
