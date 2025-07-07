import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  console.log("⛔ Invalid method:", req.method);

  try {
    const { prompt } = req.body;
    console.log("📨 Received prompt:", prompt);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert email assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const email = completion.choices[0].message.content;
    console.log("✅ GPT generated email:", email);

    res.json({ email });
  } catch (err) {
    console.error("GPT Error:", err);
    res.status(500).json({ error: "Failed to generate email" });
  }
}
