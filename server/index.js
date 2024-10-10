import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import axios from "axios";

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
const PORT = process.env.PORT || 5000;

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Server is up and running!",
  });
});

cron.schedule("*/12 * * * *", async () => {
  try {
    await axios.get("https://pixelpaws-wp-project.onrender.com");
    console.log("Server woke up successfully");
  } catch (error) {
    console.log("Failed to wake up server");
  }
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => console.log("Server started on port", PORT));
  } catch (error) {
    console.log(error);
  }
};

startServer();
