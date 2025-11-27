const path = require("path");
const { validateCommand } = require("../../nova-engine/security/nosa-guardian");
const { logEvent } = require("../../nova-engine/core");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "POST only" });
  }

  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });

  await new Promise(resolve => req.on("end", resolve));

  let data = {};
  try {
    data = JSON.parse(body || "{}");
  } catch (e) {
    // ignore parse error, keep default {}
  }

  const command = data.command || "nova-test";
  const check = validateCommand(command);

  if (!check.allowed) {
    logEvent("BLOCK", "Nosa", `Blocked command: ${command} — ${check.reason}`);
    return res.status(400).json({
      ok: false,
      source: "nosa",
      message: "Command blocked by Nosa guardian.",
      reason: check.reason,
    });
  }

  const resultMsg = `Nova Engine received command: "${command}" and is ready to act.`;
  logEvent("RUN", "Nova", resultMsg);

  return res.status(200).json({
    ok: true,
    source: "nova",
    message: resultMsg,
    timestamp: new Date().toISOString(),
  });
};