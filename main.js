/* ============================================================
   OASIS SUPERNOVA DASHBOARD — CLEAN MAIN_OASIS.JS
   - 🜁 NOVA = real Vercel deploy
   - Auto AFTER one confirmation
   - Status buttons are local-only
============================================================ */

console.log("Oasis Dashboard main_oasis.js loaded.");

let novaApproved = false;
let novaDeploying = false;

/* DOM */
const novaBtn          = document.getElementById("novaGlobalBtn");
const missionText      = document.getElementById("missionText");
const novaState        = document.getElementById("novaState");
const novaLog          = document.getElementById("novaLog");
const portalCount      = document.getElementById("portalCount");

const missionBanner    = document.getElementById("missionBanner");
const deployInfoPanel  = document.getElementById("deployInfoPanel");
const learnMoreBtn     = document.getElementById("learnMoreBtn");
const confirmDeployBtn = document.getElementById("confirmDeployBtn");
const clearLogBtn      = document.getElementById("clearLogBtn");

const deployCineBtn    = document.getElementById("deployCineBtn");
const deployGameBtn    = document.getElementById("deployGameBtn");
const deployVoiceBtn   = document.getElementById("deployVoiceBtn");
const deployAllBtn     = document.getElementById("deployAllBtn");

const oasisCard        = document.getElementById("oasisCard");

/* Your Vercel Deploy Hook */
const DEPLOY_HOOK =
  "https://api.vercel.com/v1/integrations/deploy/prj_Ah1cZl6Nd55ErrfHEWgwxX31wGl5/Ze97OaQJgI";

/* Utility: log lines */
function log(msg) {
  if (!novaLog) return;
  const row = document.createElement("div");
  row.className = "log-item";
  row.innerHTML = `
    <div>${msg}</div>
    <div class="log-time">${new Date().toLocaleTimeString()}</div>
  `;
  novaLog.prepend(row);
}

/* Real deploy */
async function runNovaDeploy(source = "NOVA") {
  if (novaDeploying) return;
  novaDeploying = true;

  log(`🜁 ${source}: Deployment started.`);
  if (novaState) novaState.textContent = "DEPLOYING";
  if (missionText) missionText.textContent = "Nova deployment running…";

  try {
    const res = await fetch(DEPLOY_HOOK, { method: "POST" });
    if (!res.ok) throw new Error("Deploy failed.");

    log("Nova → Vercel accepted deployment.");
    if (novaState) novaState.textContent = "WORKING";
    if (missionText) missionText.textContent = "Nova deployment triggered.";

  } catch (err) {
    console.error(err);
    log("❌ Deployment failed. Check Vercel.");
    if (novaState) novaState.textContent = "ERROR";
    if (missionText) missionText.textContent = "Deploy failed — see Nova Log.";
  } finally {
    setTimeout(() => (novaDeploying = false), 15000);
  }
}

/* Mission panel toggle */
missionBanner?.addEventListener("click", () => {
  deployInfoPanel?.classList.toggle("hidden");
  log("Deployment info panel toggled.");
});

/* Learn more */
learnMoreBtn?.addEventListener("click", () => {
  alert(
    "This deploy rebuilds the DASHBOARD + connected portals from main.\n" +
    "Vercel runs zero‑downtime builds and supports instant rollback.\n" +
    "Safe to proceed when you're ready."
  );
});

/* Confirm deploy (also enables auto mode) */
confirmDeployBtn?.addEventListener("click", () => {
  deployInfoPanel?.classList.add("hidden");
  novaApproved = true;
  log("Auto‑build enabled after your approval.");
  runNovaDeploy("CONFIRM");
});

/* NOVA button */
novaBtn?.addEventListener("click", () => {
  // If not approved yet, open panel instead of deploying.
  if (!novaApproved) {
    deployInfoPanel?.classList.remove("hidden");
    log("🜁 Nova pressed — review panel opened.");
    return;
  }
  runNovaDeploy("NOVA");
});

/* Status-only buttons */
function statusPulse(btn, label) {
  if (!btn) return;
  btn.classList.add("deploying");
  btn.textContent = `${label} — Checking…`;
  setTimeout(() => {
    btn.classList.remove("deploying");
    btn.classList.add("deployed");
    btn.textContent = `${label} — Ready`;
    setTimeout(() => btn.classList.remove("deployed"), 1200);
    log(`${label} status checked (no deploy).`);
  }, 700);
}

deployCineBtn?.addEventListener("click", () => statusPulse(deployCineBtn, "Cineverse"));
deployGameBtn?.addEventListener("click", () => statusPulse(deployGameBtn, "Game"));
deployVoiceBtn?.addEventListener("click", () => statusPulse(deployVoiceBtn, "Voice"));
deployAllBtn?.addEventListener("click", () => statusPulse(deployAllBtn, "Universe"));

/* Oasis card */
function openOasis() {
  log("Oasis opened (visual mode).");
  alert("Oasis Room loading… (next obstacle)");
}
oasisCard?.addEventListener("click", openOasis);
oasisCard?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openOasis();
});

/* Clear log */
clearLogBtn?.addEventListener("click", () => {
  if (!novaLog) return;
  novaLog.innerHTML = "";
  log("Nova Log cleared.");
});

/* Auto-flagging (called by Nova) */
window.novaPrepareBuild = function (taskName = "Unnamed Task") {
  log(`Nova prepared: ${taskName}`);
  localStorage.setItem("nova_update_flag", Date.now());
};

/* Auto-detect + auto-deploy every 30s after approval */
setInterval(() => {
  if (!novaApproved) return;
  if (novaDeploying) return;

  const last = localStorage.getItem("nova_last_build");
  const flag = localStorage.getItem("nova_update_flag");
  if (flag && flag !== last) {
    log("Nova detected updates → auto‑deploying.");
    localStorage.setItem("nova_last_build", flag);
    runNovaDeploy("AUTO");
  }
}, 30000);

/* Next obstacle suggestion */
window.novaSuggestNext = function () {
  const list = [
    "Routing Stabilization",
    "Voice Portal Skeleton",
    "Marketplace Module",
    "Add‑Ons System",
    "Financial Panel",
    "Gamification Engine"
  ];
  const last = localStorage.getItem("nova_last_step") || list[0];
  const idx = (list.indexOf(last) + 1) % list.length;
  const next = list[idx];
  localStorage.setItem("nova_last_step", next);
  log(`Next recommended obstacle: ${next}`);
  return next;
};

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  if (portalCount) portalCount.textContent = "2";
  log("Oasis dashboard online. Standing by.");
});
