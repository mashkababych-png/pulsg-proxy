// app.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// дозволяємо JSON і зовнішні запити
app.use(express.json());
app.use(cors());

// 🟢 базовий маршрут
app.get("/", (req, res) => {
  res.send("PULS G Proxy is active ⚡");
});

// 🧠 тест підключення до OpenAI
app.get("/test", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json({ status: "✅ Connected to OpenAI", data });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔥 головний чат-ендпоінт
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid or missing 'messages' array" });
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🟣 порт Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
