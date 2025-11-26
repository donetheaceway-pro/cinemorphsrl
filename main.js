console.log("Dashboard v8 loaded");

// Append log messages
function log(msg) {
  const el = document.getElementById("logBody");
  const line = document.createElement("div");
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

// Nova deploy button handler
document.getElementById("novaButton").addEventListener("click", async () => {
  log("NOVA: Triggering deployment...");

  try {
    const res = await fetch("/api/nova");
    const data = await res.json();
    log(`NOVA: ${data.message}`);
  } catch (err) {
    log("NOVA ERROR: Unable to trigger deployment.");
  }
});

