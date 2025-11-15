// index.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

const app = express();


app.use(cors());
app.use(express.json()); 

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY is missing. Set it in .env or environment variables.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Cloud AI API is running" });
});


app.post("/api/ask-ai", async (req, res) => {
  try {
    const { textToAi, wordToCheck } = req.body;

   
    if (!textToAi || !wordToCheck) {
      return res.status(400).json({
        error: "Both 'textToAi' and 'wordToCheck' parameters are required"
      });
    }

    
   const completion = await openai.chat.completions.create({
  model: "llama-3.3-70b-versatile", 
  messages: [
    { role: "user", content: textToAi }
  ]
});

    const aiResponse =
      completion.choices?.[0]?.message?.content?.trim() || "";

   


const caseSensitiveMatch = aiResponse.includes(wordToCheck);

const caseInsensitiveMatch =
  aiResponse.toLowerCase().includes(wordToCheck.toLowerCase());


res.json({
  aiResponse,
  wordToCheck,
  caseSensitiveMatch,
  caseInsensitiveMatch
});

  } catch (err) {
    console.error("Error in /api/ask-ai:", err);

    res.status(500).json({
      error: "Internal server error",
      details: err?.message || "Unknown error"
    });
  }
});


const PORT = process.env.PORT || 8080; 

app.listen(PORT, () => {
  console.log(`Cloud AI API is running on port ${PORT}`);
});



