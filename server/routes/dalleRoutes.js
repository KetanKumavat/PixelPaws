import express from "express";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from Hugging Face!" });
});

router.route("/").post(async (req, res) => {
  console.log(req.body);
  console.log("Generating Image...");
  try {
    const { prompt } = req.body;

    // Call the Hugging Face API to generate the image
    const response = await fetch(
      "https://api-inference.huggingface.co/models/XLabs-AI/flux-RealismLora",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const result = await response.blob();
    console.log(response);

    // Convert the binary data to a base64 string
    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const image = buffer.toString("base64");

    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || "Something went wrong");
  }
});

export default router;
