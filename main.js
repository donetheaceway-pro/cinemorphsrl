// AUTO MODE: when true, deploy runs immediately with no confirm panel
const AUTO_CONFIRM_DEPLOY = false; // set true when you want hands-off runs
let novaDeploying = false;

/* ============================================================
   SUPERNOVA DASHBOARD — DEPLOY ENABLED
   - 🜁 NOVA button = real deploy
   - Control panel buttons = status only
   - Logs + mission state
============================================================ */

console.log("SuperNova Dashboard main.js loaded.");

/* ------------------------------------------------------------
   DOM
------------------------------------------------------------ */
const novaBtn      = document.getElementById("novaGlobalBtn");
const missionText  = document.getElementById("missionText");
const novaState    = document.getElementById("novaState");
const novaLog      = document.getElementById("novaLog");

/* ------------------------------------------------------------
   REAL DEPLOY HOOK (Your Vercel Deploy URL)
------------------------------------------------------------ */
const DEPLOY_HOOK = "https://api.vercel.com/v1/integrations/deploy/prj_Ah1cZl6Nd55ErrfHEWgwxX31wGl5/Ze97OaQJgI";

/* ------------------------------------------------------------
   DEPLOY FUNCTION (NOVA)
------------------------------------------------------------ */
async function runNovaDeploy() {
  log("🜁 NOVA: Deployment initialized…");
  novaState.textContent = "DEPLOYING";

  try {
    const res = await fetch(DEPLOY_HOOK, { method: "POST" });
    log("Nova sent deploy request to Vercel…");

    if (!res.ok) throw new Error("Deploy failed.");

    log("Vercel accepted the deploy. Build starting.");
    missionText.textContent = "Nova deployment triggered — system updating.";
    novaState.textContent = "WORKING";

  } catch (err) {
    log("❌ Deploy Failed — check Vercel.");
    novaState.textContent = "ERROR";
  }
}

/* ------------------------------------------------------------
   NOVA BUTTON (Dashboard)
------------------------------------------------------------ */
novaBtn.addEventListener("click", () => {
  log("🜁 NOVA button pressed.");
  runNovaDeploy();
});

/* ------------------------------------------------------------
   LOG FUNCTION
------------------------------------------------------------ */
function log(msg) {
  const row = document.createElement("div");
  row.className = "log-item";
  row.innerHTML = `
    <div>${msg}</div>
    <div class="log-time">${new Date().toLocaleTimeString()}</div>
  `;
  novaLog.prepend(row);
}

/* ------------------------------------------------------------
   NEW — Deployment Panel Logic
------------------------------------------------------------ */

/* Toggle deployment info panel */
const missionBanner = document.getElementById("missionBanner");
const deployInfoPanel = document.getElementById("deployInfoPanel");

missionBanner.addEventListener("click", () => {
  deployInfoPanel.classList.toggle("hidden");
  log("Mission panel opened for deployment review.");
});

/* Learn More */
document.getElementById("learnMoreBtn").addEventListener("click", () => {
  alert("Nova deployments update your Universe codebase, recompile the UI, refresh portal routes, and rebuild the dashboard. Risks are minimal with Vercel: zero-downtime builds and automatic rollbacks.");
});

/* Confirm Deployment */
document.getElementById("confirmDeployBtn").addEventListener("click", () => {
  log("🜁 Confirmed — launching Nova deployment.");
  deployInfoPanel.classList.add("hidden");
  runNovaDeploy();
});

/* ============================================================
   SUPERNOVA — AUTO BUILD AFTER CONFIRMATION
   Mode B: Auto ONLY after you approve once.
============================================================ */

let novaApproved = false;      // you approve once → auto mode starts
let novaDeploying = false;     // prevents double-deploys
const AUTO_CONFIRM_DEPLOY = true; // Mode B active

/* When you press "Confirm Deployment" */
document.getElementById("confirmDeployBtn")?.addEventListener("click", () => {
  novaApproved = true;
  log("Nova auto-build enabled (after your approval).");
});

/* Nova Change Detector — checks every 30s */
setInterval(() => {
  if (!AUTO_CONFIRM_DEPLOY) return;       // safety: mode can be turned off
  if (!novaApproved) return;              // waits for your approval
  if (novaDeploying) return;              // prevents overlap

  // Basic change check — fast + safe
  const lastBuild = localStorage.getItem("nova_last_build");
  const currentFlag = localStorage.getItem("nova_update_flag");

  if (currentFlag && currentFlag !== lastBuild) {
    novaDeploying = true;
    log("Change detected — Nova auto-deploy starting.");
    runNovaDeploy();
    localStorage.setItem("nova_last_build", currentFlag);

    setTimeout(() => { novaDeploying = false; }, 15000);
  }

}, 30000); // every 30 seconds

/* ============================================================
   SUPERNOVA — FULL AUTOMATION UPGRADE
   Mode B: Auto AFTER your confirmation
   Includes:
   - Auto-Flagging
   - Auto-Detection
   - Auto-Build Queue
   - Next-Obstacle Suggestions
============================================================ */

/* GLOBAL STATE */
let novaApproved = false;
let novaDeploying = false;

/* Detect changes via Nova-generated flags */
function novaFlagChange() {
  localStorage.setItem("nova_update_flag", Date.now());
  log("Nova flagged a new update.");
}

/* Auto-Flagging: whenever Nova prepares code (triggered by your requests) */
window.novaPrepareBuild = function(taskName = "Unnamed Task") {
  log(`Nova prepared: ${taskName}`);
  novaFlagChange();
};

/* Listen for your confirm button */
document.getElementById("confirmDeployBtn")?.addEventListener("click", () => {
  novaApproved = true;
  log("Auto-build enabled after your confirmation.");
});

/* Auto-Detection + Auto-Deploy Loop */
setInterval(() => {
  if (!novaApproved) return;
  if (novaDeploying) return;

  const lastBuild = localStorage.getItem("nova_last_build");
  const currentFlag = localStorage.getItem("nova_update_flag");

  if (currentFlag && currentFlag !== lastBuild) {
    novaDeploying = true;
    log("Nova detected updates — launching auto-build.");
    runNovaDeploy();
    localStorage.setItem("nova_last_build", currentFlag);

    setTimeout(() => { novaDeploying = false; }, 15000);
  }

}, 30000);

/* Next-Obstacle Suggestions (simple version) */
window.novaSuggestNext = function() {
  const order = [
    "Routing Stabilization",
    "Voice Portal Skeleton",
    "Marketplace Module",
    "Add-Ons System",
    "Financial Panel",
    "Gamification Engine"
  ];

  const last = localStorage.getItem("nova_last_step") || order[0];
  const nextIndex = (order.indexOf(last) + 1) % order.length;
  const next = order[nextIndex];

  localStorage.setItem("nova_last_step", next);
  log(`Next recommended obstacle: ${next}`);

  return next;
};

