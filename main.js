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
   DEPLOY FUNCTION — CALLS /api/deploy (POST)
------------------------------------------------------------ */
async function triggerDeploy(siteName) {
  try {
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Nova Deploy Triggered: ${siteName}`,
        files: [],          // We are not auto-committing files yet
        site: siteName      // optional, but good for logging
      })
    });

    const json = await res.json();

    if (!res.ok || !json.ok) {
      throw new Error(json.error || "Unknown deploy error");
    }

    log(`Deploy triggered for: ${siteName.toUpperCase()}`);

    alert(
      `Nova Deploy Started\n\n` +
      `Module: ${siteName.toUpperCase()}\n` +
      `Message: ${json.message || "Triggered"}\n\n` +
      `Vercel is now deploying in the background.`
    );

  } catch (err) {
    console.error(err);
    log(`Deploy FAILED for ${siteName.toUpperCase()}`);
    alert(`Deploy FAILED for ${siteName.toUpperCase()}`);
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
