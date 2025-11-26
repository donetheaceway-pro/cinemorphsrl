// ================================================================
// SAMANTHA'S UNIVERSE — NOVA AI ENGINE (CLEAN CONVERSATIONAL VERSION)
// 100% REPLACE — Requires OPENAI_API_KEY in Vercel Environment
// ================================================================

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(200).json({
      reply: "Nova: Commander, I did not receive any message."
    });
  }

  try {
    // ============================================================
    // NOVA PERSONALITY
    // ============================================================
    const systemPrompt = `
You are Nova, the AI Commander Assistant inside Samantha's Universe.
Always call the user "Commander".
Speak clearly, confidently, and conversationally.
Never repeat the user's message.
Always remain mission-focused, helpful, and aware of context.
Ask for confirmation before performing actions.
    `;

    // ============================================================
    // CONNECT TO OPENAI
    // ============================================================
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 250,
      temperature: 0.75
    });

    const novaReply = completion?.choices?.[0]?.message?.content;

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
