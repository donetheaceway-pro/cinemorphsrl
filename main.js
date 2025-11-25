/* ============================================================
   SAMANTHA'S SUPERNOVA DASHBOARD — LIVE DEPLOY SYSTEM
   This file now correctly:
   - Handles POST deploy triggers
   - Sends JSON to /api/deploy
   - Logs deploy events
   - Wires Cine/Game/Voice/All buttons
   ============================================================ */

console.log("Nova main.js loaded (live POST deploy enabled).");

/* ------------------------------------------------------------
   DOM REFERENCES
------------------------------------------------------------ */
const deployCineBtn  = document.getElementById("deployCineBtn");
const deployGameBtn  = document.getElementById("deployGameBtn");
const deployVoiceBtn = document.getElementById("deployVoiceBtn");
const deployAllBtn   = document.getElementById("deployAllBtn");
const deployNowTop   = document.getElementById("deployNowTop");

const missionText    = document.getElementById("missionText");
const missionBanner  = document.getElementById("missionBanner");
const novaLog        = document.getElementById("novaLog");
const novaState      = document.getElementById("novaState");

/* ------------------------------------------------------------
   LIVE DEPLOY FUNCTION — Calls /api/deploy (POST)
------------------------------------------------------------ */
async function triggerDeploy(siteName) {
  try {
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Nova Deploy Triggered: ${siteName}`,
        files: [] // leave empty (we aren't auto-committing updates yet)
      })
    });

    const json = await res.json();

    if (!json.ok) {
      throw new Error(json.error || "Deploy error");
    }

    log(`Deploy triggered → ${siteName}`);
    alert(
      `🚀 Deployment Triggered\n\n` +
      `Module: ${siteName}\n` +
      `Status: ${json.note || "Triggered"}\n\n` +
      `Vercel is rebuilding in the background.`
    );

  } catch (err) {
    log(`Deploy FAILED → ${siteName}`);
    alert(`❌ Deploy failed for ${siteName}\n\n${err}`);
  }
}

/* ------------------------------------------------------------
   WIRE BUTTONS
------------------------------------------------------------ */
function wireButtons() {
  if (wireButtons.done) return;
  wireButtons.done = true;

  deployCineBtn?.addEventListener("click", () => triggerDeploy("Cineverse Portal"));
  deployGameBtn?.addEventListener("click", () => triggerDeploy("Game Portal"));
  deployVoiceBtn?.addEventListener("click", () => triggerDeploy("Voice Portal"));
  deployAllBtn?.addEventListener("click", () => triggerDeploy("All Portals"));

  deployNowTop?.addEventListener("click", () => triggerDeploy("Cineverse Portal"));
}

wireButtons();

/* ------------------------------------------------------------
   LOG SYSTEM
------------------------------------------------------------ */
function log(text) {
  const time = new Date().toLocaleString();
  const item = document.createElement("div");
  item.className = "log-item";
  item.innerHTML = `
    <div>${text}</div>
    <div class="log-time">${time}</div>
  `;
  novaLog.prepend(item);
}

/* ------------------------------------------------------------
   SIMPLE MISSION DISPLAY
------------------------------------------------------------ */
function updateMission() {
  missionText.textContent = `"Cineverse Portal UI expansion" is ready to deploy.`;
  missionBanner.classList.add("blink-ready");
  novaState.textContent = "WORKING";
}

updateMission();

console.log("Nova main.js fully wired and ready.");
