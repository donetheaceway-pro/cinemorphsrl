/* ============================================================
   SUPERNOVA DASHBOARD — CLEAN MAIN.JS
   One-Click System™ — Auto AFTER confirmation
============================================================ */

console.log("SuperNova Dashboard main.js loaded.");

let novaApproved = false;
let novaDeploying = false;

/* ------------------------------------------------------------
   DOM
------------------------------------------------------------ */
const novaBtn      = document.getElementById("novaGlobalBtn");
const missionText  = document.getElementById("missionText");
const novaState    = document.getElementById("novaState");
const novaLog      = document.getElementById("novaLog");

const missionBanner   = document.getElementById("missionBanner");
const deployInfoPanel = document.getElementById("deployInfoPanel");

const learnMoreBtn    = document.getElementById("learnMoreBtn");
const confirmDeployBtn = document.getElementById("confirmDeployBtn");

/* ------------------------------------------------------------
   REAL DEPLOY URL
------------------------------------------------------------ */
const DEPLOY_HOOK =
  "https://api.vercel.com/v1/integrations/deploy/prj_Ah1cZl6Nd55ErrfHEWgwxX31wGl5/Ze97OaQJgI";

/* ------------------------------------------------------------
   DEPLOY FUNCTION
------------------------------------------------------------ */
async function runNovaDeploy() {
  log("🜁 Nova: Deployment started.");
  novaState.textContent = "DEPLOYING";

  try {
    const res = await fetch(DEPLOY_HOOK, { method: "POST" });

    if (!res.ok) throw new Error("Deploy failed.");

    log("Nova → Vercel accepted deployment.");
    missionText.textContent = "Nova deployment triggered.";
    novaState.textContent = "WORKING";

  } catch (err) {
    log("❌ Deployment failed.");
    novaState.textContent = "ERROR";
  }
}

/* ------------------------------------------------------------
   BUTTON EVENTS
------------------------------------------------------------ */
novaBtn?.addEventListener("click", () => {
  log("🜁 Nova button pressed.");
  runNovaDeploy();
});

missionBanner?.addEventListener("click", () => {
  deployInfoPanel?.classList.toggle("hidden");
  log("Deployment info panel toggled.");
});

learnMoreBtn?.addEventListener("click", () => {
  alert("Nova deployments refresh your Universe with zero downtime and auto rollback.");
});

/* APPROVAL → enables auto-build system */
confirmDeployBtn?.addEventListener("click", () => {
  deployInfoPanel?.classList.add("hidden");
  novaApproved = true;
  log("Auto-build enabled after your approval.");
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
   AUTO-FLAGGING
------------------------------------------------------------ */
window.novaPrepareBuild = function (taskName = "Unnamed Task") {
  log(`Nova prepared: ${taskName}`);
  localStorage.setItem("nova_update_flag", Date.now());
};

/* ------------------------------------------------------------
   AUTO-DETECT + AUTO-DEPLOY LOOP
   Runs ONLY after your confirmation
------------------------------------------------------------ */
setInterval(() => {
  if (!novaApproved) return;
  if (novaDeploying) return;

  const last = localStorage.getItem("nova_last_build");
  const flag = localStorage.getItem("nova_update_flag");

  if (flag && flag !== last) {
    novaDeploying = true;
    log("Nova detected updates → auto-deploying.");
    runNovaDeploy();
    localStorage.setItem("nova_last_build", flag);

    setTimeout(() => (novaDeploying = false), 15000);
  }
}, 30000);

/* ------------------------------------------------------------
   NEXT OBSTACLE SUGGESTION
------------------------------------------------------------ */
window.novaSuggestNext = function () {
  const list = [
    "Routing Stabilization",
    "Voice Portal Skeleton",
    "Marketplace Module",
    "Add-Ons System",
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
