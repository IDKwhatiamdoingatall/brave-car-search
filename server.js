const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
const BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

const allowedDomains = [
  "dupontregistry.com", "exoticcartrader.com", "bringatrailer.com", "earthmotorcars.com",
  "goluxuryauto.com", "tacticalfleet.com", "vegasautogallery.com", "luxuryautocollection.com",
  "westcoastexoticcars.com", "cargurus.com", "autotrader.com", "cars.com", "carvana.com",
  "ebay.com", "facebook.com/marketplace", "copart.com", "iaai.com", "manheim.com",
  "barrett-jackson.com", "mecum.com", "rmsothebys.com", "goodingco.com", "bonhams.com",
  "thedrive.com", "auto-tempest.com", "autolist.com", "carfax.com", "autocheck.com", "rodo.com",
  "hagerty.com", "carsandbids.com", "classiccars.com", "jalopnik.com", "autobytel.com",
  "hemmings.com", "forsuperrich.com", "supercars.net", "luxurycarclassifieds.com",
  "autoblog.com", "sportscarmarket.com", "classiccarauction.us", "collectorcars.com",
  "specialtysales.com", "legendarymotorcar.com", "europeanautotrader.com", "ultimatecarpage.com",
  "vclassics.com", "pistonheads.com", "luxurysportscars.com", "dubizzle.com", "driven.net",
  "modernclassics.com", "pristineauction.com", "rmauctions.com", "chiefautomotive.com",
  "automobilegallery.com", "exotics-on-hand.com", "exoticarsales.com", "marlinclassic.com",
  "copartautoauction.com", "highline-autosport.com", "automotiveconnection.com",
  "eleganceimports.com", "gothamluxuryautos.com", "russellmotorsport.com",
  "penskeautomotive.com", "luxurylineautos.com", "lamborghinidallas.com", "ferraridallas.com",
  "bmwexotics.com", "audiusa.com", "mercedes-benzusa.com", "porsche.com", "lucidautomotive.com",
  "knightlymotorsports.com", "lexusofsandiego.com", "acuraknoxville.com", "napletonexotics.com",
  "parkplace.com", "dealerrater.com", "tradeclassics.com", "proxibid.com", "adesa.com",
  "autovendorspecialties.com", "classicautocarsonline.com", "classiccars.org", "historicalcar.com",
  "motorcarauctions.com", "raucca.com", "visionaryautos.com", "avantluxautocredit.com",
  "avantgardeimportsofdallas.com", "20thcentury-classics.com", "roadschowroom.com",
  "transsens.com", "used-luxury-cars.com", "vocars.com"
];

// Allow all Vercel preview URLs and production
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
  const { query } = req.body;
  console.log("Received search query:", query);  // Log the incoming query

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const response = await axios.get(BRAVE_SEARCH_URL, {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": BRAVE_API_KEY,
      },
      params: { q: query, count: 30 }
    });

    console.log("Brave API raw response:", JSON.stringify(response.data, null, 2));  // Log the raw Brave API response

    const results = (response.data.web?.results || []).filter(item => {
      try {
        const url = new URL(item.url);
        return allowedDomains.some(domain => url.hostname.includes(domain));
      } catch {
        return false;
      }
    }).map(item => ({
      title: item.title,
      link: item.url,
      snippet: item.description
    }));

    res.json({ results });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Search failed", message: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
