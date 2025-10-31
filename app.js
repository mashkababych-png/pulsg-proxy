// app.js
import express from "express";
import fetch from "node-fetch";

const app = express();

// головний маршрут
app.get("/", (req, res) => {
  res.send("PULS G Proxy is active ⚡");
});

// тестовий маршрут для перевірки зв'язку з OpenAI
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

// Render надає порт через змінну середовища PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
