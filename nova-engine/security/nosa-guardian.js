// Nosa Guardian — safety + rule checks
// Nosa is fully mutable and always under Sam's control.

const rules = require("./rules.json");

function validateCommand(command) {
  const text = String(command || "").toLowerCase().trim();

  // Basic "no-go" patterns
  const blockedPatterns = rules.blockedPatterns || [];
  for (const rule of blockedPatterns) {
    try {
      const re = new RegExp(rule.pattern, "i");
      if (re.test(text)) {
        return {
          allowed: false,
          reason: rule.reason || "Blocked by safety policy.",
        };
      }
    } catch (e) {
      // ignore bad regex
    }
  }

  return { allowed: true, reason: "OK" };
}

module.exports = {
  validateCommand,
};