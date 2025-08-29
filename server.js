import express from "express";
import bodyParser from "body-parser";
import Groq from "groq-sdk";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // ✅ loads .env

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY   // now it works
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message.toLowerCase().startsWith("add expense") &&
      !message.toLowerCase().startsWith("delete expense") &&
      message.toLowerCase() !== "show expenses") {
    try {
      const response = await client.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: message }]
      });
      const reply = response.choices[0].message.content;
      return res.json({ reply });
    } catch (err) {
      console.error(err);
      return res.json({ reply: "⚠️ Error: " + err.message });
    }
  }

  return res.json({ local: true });
});

app.listen(5000, () => console.log("✅ Chat backend listening on port 5000"));
