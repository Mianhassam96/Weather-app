const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();  // Load environment variables

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.get("/weather", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
