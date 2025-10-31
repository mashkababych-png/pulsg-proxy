// app.js
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// базовий маршрут
app.get("/", (req, res) => {
  res.send("PULS G Proxy is active ⚡");
});

// тест OpenAI
app.get("/test", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });
    const data = await response.json();
    res.json({ status: "✅ Connected to OpenAI", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 головний чат-ендпоінт
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
