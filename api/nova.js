// /api/nova.js
// Commander-Locked Nova Backend

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Nova: No message received, Commander." });
  }

  try {
    // --- Basic Nova intelligence stub ---
    // You can expand this later if you want richer replies.

    let reply = "";

    if (message.toLowerCase().includes("status")) {
      reply = "Nova: All front-end systems are green, Commander.";
    } else if (message.toLowerCase().includes("hello")) {
      reply = "Nova: Online and synced, Commander.";
    } else if (message.toLowerCase().includes("object")) {
      reply = "Nova: This object is registered and ready for processing.";
    } else {
      reply = `Nova: Commander, your message has been received — "${message}".`;
    }

    return res.status(200).json({
      reply,
      context: reply
    });

  } catch (err) {
    return res.status(500).json({
      reply: "Nova: Commander, I encountered an issue processing that."
    });
  }
}
