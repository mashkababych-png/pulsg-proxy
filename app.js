// app.js
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// головний маршрут
app.get("/", (req, res) => {
  res.send("PULS G Proxy is active ⚡");
});

// тестовий маршрут
app.get("/test", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    res.json({ status: "✅ Connected to OpenAI", data });
  } catch (error) {
    console.error("Error connecting to OpenAI:", error);
    res.status(500).json({ status: "❌ Connection failed", error: error.message });
  }
});

// endpoint для чату
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Render порт
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
