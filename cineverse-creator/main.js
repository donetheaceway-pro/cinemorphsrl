console.log("Cineverse Creator v8 loaded.");

function log(msg) {
  const body = document.getElementById("logBody");
  const line = document.createElement("div");
  line.className = "log-line";
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

document.getElementById("runCreator").addEventListener("click", () => {
  log("Studio loaded. Ready for scene creation.");
});

document.getElementById("renderTest").addEventListener("click", () => {
  log("Render Engine: Simulating frames...");
  setTimeout(() => log("Render Complete."), 1500);
});

