const { getLogs } = require("../../nova-engine/core");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "GET only" });
  }

  const logs = getLogs();
  return res.status(200).json({ ok: true, logs });
};