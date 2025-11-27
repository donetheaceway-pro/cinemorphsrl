// ================================
// Samantha’s Universe — NOVA AI Backend
// 100% FINAL WORKING VERSION
// ================================

import OpenAI from "openai";

// Connect to Vercel Environment Variable
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { message } = req.body;

  // If someone sent nothing
  if (!message) {
    return res.status(200).json({
      reply: "Nova: Commander, I did not receive any message."
    });
  }

  try {
    // NOVA's personality
    const systemPrompt = `
You are Nova, the AI Commander Assistant inside Samantha’s Universe.
Always call the user “Commander.”
Keep replies short, helpful, confident, and mission-focused.
Never repeat the user’s input.
Never act without Commander approval.
Stay aware of previous context when responding.
    `;

    // OpenAI model call
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 200,
      temperature: 0.75
    });

    // Extract Nova's reply
    const novaReply = completion.choices?.[0]?.message?.content;

    return res.status(200).json({
      reply: novaReply || "Nova: Commander, I am online."
    });

  } catch (err) {
    console.error("NOVA BACKEND ERROR:", err);

    return res.status(500).json({
      reply: "Nova: Commander, I encountered a backend issue."
    });
  }
}

