console.log("Game Portal v8 loaded.");

function log(msg) {
  const body = document.getElementById("logBody");
  const line = document.createElement("div");
  line.className = "log-line";
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

document.getElementById("enterStudio").addEventListener("click", () => {
  log("Game Studio opened.");
});

document.getElementById("viewRoadmap").addEventListener("click", () => {
  log("Roadmap opened.");
});

