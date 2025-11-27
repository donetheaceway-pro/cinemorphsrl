// Simple in-memory log store for Nova Engine v1
const _logs = [];

function logEvent(level, source, message) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    source,
    message,
  };
  _logs.push(entry);

  // Keep last 200 entries
  if (_logs.length > 200) {
    _logs.shift();
  }

  console.log(`[NOVA][${level}] (${source}) ${message}`);
}

function getLogs() {
  return _logs;
}

module.exports = {
  logEvent,
  getLogs,
};