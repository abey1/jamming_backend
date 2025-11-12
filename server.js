import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Loads SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET

const app = express();
app.use(cors());
app.use(express.json());

app.get("/spotify/token", async (req, res) => {
  const authHeader = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error("Error requesting Spotify token:", error.response?.data);
    res.status(500).json({ error: "Failed to fetch Spotify token" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
});
