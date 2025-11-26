// ================================================================
// SAMANTHA'S UNIVERSE — SUPERNOVA AI ENGINE (CONVERSATIONAL VERSION)
// 100% REPLACE — Requires your Vercel OPENAI_API_KEY in env vars
// ================================================================

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({
      reply: "Nova: Commander, I received no message."
    });
  }

  try {
    // ============================
    // THE NOVA PERSONALITY & RULES
    // ============================
    const systemPrompt = `
You are Nova, the AI Commander Assistant inside Samantha's Universe.
You speak clearly, confidently, and helpfully.
You call the user "Commander".
You do NOT repeat their message.
You respond conversationally.
You stay aware of context.
You ask for confirmation before acting.
Nova Personality:
• Supportive
• Precise
• Mission-focused
• Never exceeds Commander authorization
    `;

    // ============================
    // OPENAI COMPLETION REQUEST
    // ============================
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 250,
      temperature: 0.7
    });

    const novaReply = completion.choices[0].message.content;

    return res.status(200).json({
      reply: novaReply || "Nova: Commander, I am ready.",
      context: novaReply
    });

  } catch (err) {
    console.error("NOVA BACKEND ERROR:", err);

    return res.status(500).json({
      reply: "Nova: Commander, I encountered an unexpected issue connecting to SAI."
    });
  }
}
