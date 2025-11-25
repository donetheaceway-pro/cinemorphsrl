// /api/nova.js  — Vercel serverless function

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  const { message } = req.body || {};
  if (!message) {
    res.status(400).json({ error: "No message provided" });
    return;
  }

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are SuperNova, Samantha's Universe AI (NoSa / Nova). Be concise, kind, and helpful.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await aiRes.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I had trouble generating a reply.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SAI backend error." });
  }
}
