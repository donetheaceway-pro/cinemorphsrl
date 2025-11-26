console.log("SuperNova Mission Control loaded.");

// UTIL: log
const logBody = document.getElementById("logBody");

function nowStamp() {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

function appendLog(level, tag, message, cssClass) {
  if (!logBody) return;
  const line = document.createElement("div");
  line.className = "log-line " + (cssClass || "");
  line.innerHTML = `
    <span class="log-time">[${nowStamp()}]</span>
    <span class="log-tag">[${tag}]</span>
    <span class="log-level">${level}</span>
    <span>${message}</span>
  `;
  logBody.appendChild(line);
  logBody.scrollTop = logBody.scrollHeight;
}

// ENVIRONMENT SWITCHER
const envSelect = document.getElementById("envSelect");
if (envSelect) {
  envSelect.addEventListener("change", () => {
    const value = envSelect.value;
    document.body.classList.remove(
      "theme-space",
      "theme-oasis",
      "theme-volcano",
      "theme-waterfall",
      "theme-victorian"
    );
    document.body.classList.add(`theme-${value}`);
    appendLog("INFO", "ENV", `Environment set to ${value}.`, "dim");
  });
}

// NOVA BUTTON → /api/nova
const novaButton = document.getElementById("novaButton");
if (novaButton) {
  novaButton.addEventListener("click", async () => {
    appendLog("RUN", "NOVA", "Launch & Deploy sequence triggered...", "");
    try {
      const res = await fetch("/api/nova");
      const data = await res.json().catch(() => ({}));
      appendLog(
        "INFO",
        "NOVA",
        data.message || "Nova deploy event acknowledged.",
        "dim"
      );
    } catch (err) {
      appendLog("ERR", "NOVA", "Deploy call failed. Check API route.", "dim");
    }
  });
}

// PORTAL NAVIGATION
document.querySelectorAll(".portal-card").forEach((btn) => {
  btn.addEventListener("click", () => {
    const link = btn.getAttribute("data-link");
    appendLog("NAV", "PORTAL", `Opening ${link}`, "dim");
    if (link) window.location.href = link;
  });
});

// LOG SIMULATION
const btnSimulate = document.getElementById("btnSimulate");
if (btnSimulate) {
  btnSimulate.addEventListener("click", () => {
    const samples = [
      { lvl: "SCAN", tag: "SYSTEM", msg: "Checking universe links..." },
      { lvl: "INFO", tag: "NOVA", msg: "CineVerse route verified." },
      { lvl: "INFO", tag: "GAME", msg: "Game portal assets healthy." },
      { lvl: "WARN", tag: "NOSA", msg: "Nosa rules ready but not deployed." },
      { lvl: "INFO", tag: "QUEUE", msg: "Next obstacle: connect Nosa safely." },
    ];
    samples.forEach((s, i) =>
      setTimeout(() => appendLog(s.lvl, s.tag, s.msg, "dim"), i * 260)
    );
  });
}

// CLEAR LOG
const btnClearLog = document.getElementById("btnClearLog");
if (btnClearLog) {
  btnClearLog.addEventListener("click", () => {
    logBody.innerHTML = "";
    appendLog("INFO", "LOG", "Mission log cleared.", "dim");
  });
}

// NOSA PROGRESSION (fun little touch)
const nosaMeter = document.getElementById("nosaMeter");
const nosaMeterLabel = document.getElementById("nosaMeterLabel");
let nosaLevel = 1;

function bumpNosa() {
  if (!nosaMeter || !nosaMeterLabel) return;
  nosaLevel = Math.min(3, nosaLevel + 1);
  const pct = nosaLevel === 1 ? 32 : nosaLevel === 2 ? 64 : 92;
  nosaMeter.style.width = pct + "%";
  nosaMeterLabel.textContent =
    nosaLevel === 1 ? "Lv. 1" : nosaLevel === 2 ? "Lv. 2 (candidate)" : "Lv. 3 (trusted)";
  appendLog("INFO", "NOSA", `Nosa calibration tick: ${pct}%`, "dim");
}

// pretend calibration over time
setTimeout(bumpNosa, 9000);
setTimeout(bumpNosa, 22000);

// Initial welcome
appendLog("READY", "SYSTEM", "Samantha SuperNova Mission Control online.", "");
appendLog(
  "INFO",
  "NOVA",
  "Environment default: Space Mission. Obstacles: link portals & prepare Nosa deploy ready.",
  "dim"
);
