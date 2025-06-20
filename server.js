// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow all Vercel frontend URLs (including preview)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
const BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

app.post("/search", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const response = await axios.get(BRAVE_SEARCH_URL, {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": BRAVE_API_KEY,
      },
      params: {
        q: query,
        count: 10
      }
    });

    const results = (response.data.web?.results || []).map((item) => ({
      title: item.title,
      link: item.url,
      snippet: item.description,
    }));

    res.json({ results });
  } catch (err) {
    console.error("Brave Search Error:", err.message);
    res.status(500).json({ error: "Search failed", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
