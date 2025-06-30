const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Google API setup
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Not allowed"));
    }
  }
}));

app.use(express.json());

app.post("/search", async (req, res) => {
  const { query, page } = req.body;
  console.log(`Received search query: ${query} | Page: ${page}`);

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: "Missing search query" });
  }

  const startIndex = (page - 1) * 10 + 1; // Calculate the start index for pagination

  try {
    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query,
        num: 10,
        start: startIndex
      }
    });

    const results = (response.data.items || []).map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));

    res.json({ results });
  } catch (err) {
    console.error("Google Search Error:", err.message);
    res.status(500).json({ error: "Search failed", message: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
