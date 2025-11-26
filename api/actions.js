// /api/actions.js
// Commander-Locked Action Processor for NoSa + Nova

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { command, context } = req.body;

  let nosaReply = "";
  let novaReply = "";
  let mode = "";
  let currentObject = "";
  let preparedPatch = null;

  try {

    switch (command) {

      // ---------------------------------------------------------
      // APPROVE
      // ---------------------------------------------------------
      case "approve":
        nosaReply = "NoSa: Approval received, Commander. Action validated.";
        novaReply = "Nova: Ready to continue whenever you are.";
        mode = "Idle — Awaiting Next Directive";
        break;

      // ---------------------------------------------------------
      // IMPLEMENT
      // ---------------------------------------------------------
      case "implement":
        nosaReply = "NoSa: Implementation initialized. Processing...";
        novaReply = "Nova: Commander, implementation is underway.";
        mode = "Build Mode — Implementing Current Object";
        currentObject = context || "New Implementation";
        break;

      // ---------------------------------------------------------
      // APPLY CHANGE
      // ---------------------------------------------------------
      case "apply":
        nosaReply = "NoSa: Change acknowledged and applied.";
        novaReply = "Nova: Commander, the requested modification is complete.";
        mode = "Build Mode — Update Applied";
        break;

      // ---------------------------------------------------------
      // PREPARE PATCH
      // ---------------------------------------------------------
      case "prepare_patch":
        nosaReply = "NoSa: Draft patch created and ready for review.";
        novaReply = "Nova: Patch is standing by, Commander.";
        preparedPatch = true;
        mode = "Patch Preparation Mode";
        break;

      // ---------------------------------------------------------
      // DECLINE
      // ---------------------------------------------------------
      case "decline":
        nosaReply = "NoSa: Action declined per Commander authority.";
        novaReply = "Nova: Standing by.";
        mode = "Idle — Standing By";
        break;

      // ---------------------------------------------------------
      // UNKNOWN COMMAND
      // ---------------------------------------------------------
      default:
        nosaReply = "NoSa: Commander, I did not recognize that command.";
        novaReply = "Nova: Please clarify your intention.";
        mode = "Unknown";
        break;
    }

    return res.status(200).json({
      nosa: nosaReply,
      nova: novaReply,
      mode,
      currentObject,
      preparedPatch
    });

  } catch (err) {
    return res.status(500).json({
      nosa: "NoSa: Commander, an internal issue occurred.",
      nova: "Nova: I am ready to retry when you are.",
      mode: "Error"
    });
  }
}
