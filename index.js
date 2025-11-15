// index.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json()); // כדי לקרוא JSON מה-body

// ===== OpenAI Client =====
if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY is missing. Set it in .env or environment variables.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
// ===== Health check =====
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Cloud AI API is running" });
});

// ===== Main API endpoint =====
// POST /api/ask-ai
// Body:
// {
//   "textToAi": "some question or text",
//   "wordToCheck": "hello"
// }
app.post("/api/ask-ai", async (req, res) => {
  try {
    const { textToAi, wordToCheck } = req.body;

    // ולידציה בסיסית
    if (!textToAi || !wordToCheck) {
      return res.status(400).json({
        error: "Both 'textToAi' and 'wordToCheck' parameters are required"
      });
    }

    // ===== שליחת הטקסט ל-AI =====
   const completion = await openai.chat.completions.create({
  model: "llama-3.3-70b-versatile", // מודל חינמי חזק של Groq
  messages: [
    { role: "user", content: textToAi }
  ]
});

    const aiResponse =
      completion.choices?.[0]?.message?.content?.trim() || "";

    // ===== בדיקה אם המילה מופיעה בתשובה =====
    const normalizedResponse = aiResponse.toLowerCase();
    const normalizedWord = String(wordToCheck).toLowerCase().trim();

    const containsWord = normalizedResponse.includes(normalizedWord);

    // ===== החזרת תשובה ללקוח =====
    // לפי הדרישה: "The Api should be public and response the Ai response"
    res.json({
      aiResponse,
      wordToCheck,
      containsWord
    });
  } catch (err) {
    console.error("Error in /api/ask-ai:", err);

    res.status(500).json({
      error: "Internal server error",
      details: err?.message || "Unknown error"
    });
  }
});

// ===== Start server =====
const PORT = process.env.PORT || 8080; // Render ישתמש ב-PORT מהסביבה

app.listen(PORT, () => {
  console.log(`Cloud AI API is running on port ${PORT}`);
});
