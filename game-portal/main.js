/* ============================================================
   Game Portal — SuperNova Full main.js (Version done)
   - Alive Nova UI
   - Local logging + status
   - No PAT / no remote deploy yet
   - Matches Samantha’s Universe flow
============================================================ */

console.log("Game Portal main.js loaded");

// -------------------------------
//  TIME + LOG SUPPORT
// -------------------------------
function nowTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `[${hh}:${mm}:${ss}]`;
}

let logBody = document.getElementById("logBody");

function ensureMiniLog() {
  if (logBody) return;

  const mini = document.createElement("div");
  mini.id = "novaMiniLog";
  mini.style.cssText = `
    position: fixed; right: 16px; bottom: 16px; width: 320px; max-height: 220px;
    background: rgba(3,7,18,.92); color: #e5e7eb; border: 1px solid rgba(148,163,184,.5);
    border-radius: 12px; padding: 10px; font-size: 12px; z-index: 9999;
    box-shadow: 0 10px 30px rgba(0,0,0,.6); overflow: hidden;
  `;

  const title = document.createElement("div");
  title.textContent = "Nova Log — Game Portal";
  title.style.cssText = "font-weight:700; letter-spacing:.08em; margin-bottom:6px; opacity:.9;";
  mini.appendChild(title);

  logBody = document.createElement("div");
  logBody.id = "logBody";
  logBody.style.cssText = "max-height:180px; overflow:auto; display:flex; flex-direction:column; gap:4px;";
  mini.appendChild(logBody);

  document.body.appendChild(mini);
}

ensureMiniLog();

function appendLog(level, tag, message, cls) {
  if (!logBody) return;
  const line = document.createElement("div");
  line.className = "log-line " + (cls || "");
  line.style.cssText = `
    display:flex; gap:6px; align-items:flex-start; line-height:1.2;
    opacity:${cls === "dim" ? 0.7 : 1};
  `;
  line.innerHTML = `
    <span style="opacity:.7;">${nowTime()}</span>
    <span style="font-weight:700;">[${tag}]</span>
    <span style="opacity:.9;">${level}</span>
    <span>${message}</span>
  `;
  logBody.appendChild(line);
  logBody.scrollTop = logBody.scrollHeight;
}

// -------------------------------
//  PORTAL STATUS SUPPORT
// -------------------------------
const STATUS_KEY = "game_portal_status";
const statusEl = document.getElementById("portalStatus");

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
  localStorage.setItem(STATUS_KEY, text);
  appendLog("INFO", "STATUS", `Portal status set to "${text}".`, "dim");
}

function loadStatus() {
  const saved = localStorage.getItem(STATUS_KEY);
  if (saved) {
    if (statusEl) statusEl.textContent = saved;
    appendLog("INFO", "STATUS", `Loaded saved status "${saved}".`, "dim");
  } else {
    appendLog("INFO", "STATUS", "No saved status found. Default: Deploy ready.", "dim");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  appendLog("READY", "GAME", "Game portal online. Universe link stable.", "");
  loadStatus();
});

// -------------------------------
//  NOVA BUTTON (CLEAN MODE)
// -------------------------------
const novaButton = document.getElementById("novaButton");
if (novaButton) {
  novaButton.addEventListener("click", () => {
    appendLog("RUN", "NOVA", "Launch & Deploy pressed (clean mode).", "");
    pulseButton(novaButton);
    simulateBuildSequence();
  });
}

function simulateBuildSequence() {
  appendLog("INFO", "NOVA", "Scanning game build objects…", "dim");

  const phases = [
    "Checking game project folders…",
    "Validating assets & sprites…",
    "Preparing playable demo bundle…",
    "Syncing Universe routes…",
    "Marking deploy ready bundle…"
  ];

  let i = 0;
  const tick = setInterval(() => {
    appendLog("INFO", "SCAN", phases[i], "dim");
    i++;
    if (i >= phases.length) {
      clearInterval(tick);
      appendLog("DONE", "NOVA", "Game scan complete. Remote deploy not triggered yet.", "");
    }
  }, 650);
}

function pulseButton(btn) {
  btn.classList.add("nova-pulse");
  btn.style.boxShadow = "0 0 18px rgba(37,99,235,.9)";
  setTimeout(() => {
    btn.classList.remove("nova-pulse");
    btn.style.boxShadow = "";
  }, 1200);
}

// -------------------------------
//  ENTER / ROADMAP HOOKS (if present)
// -------------------------------
document.getElementById("btnEnter")?.addEventListener("click", () => {
  setStatus("In progress");
  appendLog("OPEN", "HUB", "Entering Game Hub.", "");
});

document.getElementById("btnRoadmap")?.addEventListener("click", () => {
  appendLog("INFO", "ROADMAP", "Next obstacles: Marketplace publishing + Add-Ons unlocks.", "dim");
  alert("Roadmap loaded. Next obstacles are queued in your Universe.");
});

// -------------------------------
//  SAFE ROUTING BACK
// -------------------------------
document.querySelectorAll("[data-back='dashboard']").forEach(el => {
  el.addEventListener("click", () => {
    appendLog("NAV", "PORTAL", "Returning to Dashboard.", "dim");
    window.location.href = "/";
  });
});
