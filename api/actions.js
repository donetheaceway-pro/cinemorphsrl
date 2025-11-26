// /api/actions.js — NoSa Action Router (stubbed for now)
// This receives Approve / Implement / Apply change / Decline from the dashboard.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  const { command, context } = req.body || {};

  if (!command) {
    res.status(400).json({ error: "No command provided" });
    return;
  }

  let summary = "";
  let mode = "Build Mode";
  let currentObject = "Final Rebuild";

  if (command === "approve") {
    summary =
      "NoSa: Commander approval recorded. This object is now marked as deploy ready once the technical path is connected.";
  } else if (command === "implement") {
    summary =
      "NoSa: Implementation requested. I will treat this object as if it's being applied; once wired to actual deployment, this will run changes.";
  } else if (command === "apply") {
    summary =
      "NoSa: 'Apply change' logged. This will become a real config or file update action when connected to your repository.";
  } else if (command === "decline") {
    summary = "NoSa: Understood. This object is declined and will not be applied.";
    mode = "Idle / Review Mode";
  } else {
    summary = "NoSa: Command received and logged.";
  }

  // In the future this is where we'd:
  // - call GitHub / Vercel / config update APIs
  // - update persistent logs / DB
  // For now it's a safe stub.

  res.status(200).json({
    ok: true,
    summary,
    mode,
    currentObject,
    receivedContext: context || null,
  });
}
