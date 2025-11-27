// Client helper for calling Nova Engine from the dashboard.
// Exposes window.NovaEngine with small helper functions.

async function callNovaRun(command) {
  const res = await fetch("/api/nova/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command }),
  });
  return await res.json();
}

async function callNovaDeploy() {
  const res = await fetch("/api/nova/deploy", {
    method: "POST"
  });
  return await res.json();
}

async function fetchNovaLogs() {
  const res = await fetch("/api/nova/logs", {
    method: "GET"
  });
  return await res.json();
}

window.NovaEngine = {
  run: callNovaRun,
  deploy: callNovaDeploy,
  logs: fetchNovaLogs,
};