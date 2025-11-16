Cloud AI API (Groq-based)

This project provides a simple cloud API that sends text to an AI model (Groq LLM) and checks whether a specific word appears in the AI response.
The API is publicly deployed on Render and exposes one main endpoint.

Features

Send a text prompt to Groq LLM models
Receive the AI-generated response
Validate whether the response contains a specific word
Case-sensitive check
Case-insensitive check
Unified JSON response format
Fully deployed and publicly accessible

Public Endpoint: https://cloud-ai-openai-api.onrender.com/api/ask

Example Request:

{
  "textToAi": "Explain quantum computing in simple terms.",
  "wordToCheck": "compute"
}

Example Response:

{
  "aiResponse": "...",
  WorsToCheck": "....."
   "containsCaseSensitive": false,
  "containsCaseInsensitive": true
  "'םרגTCH
 
}

Tech Stack

Node.js + Express
Groq Llama/Mixtral models
Render cloud deployment
