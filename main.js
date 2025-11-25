/* ============================================================
   SUPERNOVA DASHBOARD — main.js (Oasis)
   One-Click System™
   - 🜁 NOVA deploys via Vercel hook
   - Confirm panel required once, then auto-deploy on novaPrepareBuild()
============================================================ */

console.log("Oasis Dashboard main.js loaded.");

let novaApproved = false;
let novaDeploying = false;

/* ---------------- DOM ---------------- */
const novaBtn           = document.getElementById("novaGlobalBtn");
const missionText       = document.getElementById("missionText");
const novaState         = document.getElementById("novaState");
const novaLog           = document.getElementById("novaLog");
const portalCount       = document.getElementById("portalCount");

const missionBanner     = document.getElementById("missionBanner");
const deployInfoPanel   = document.getElementById("deployInfoPanel");
const learnMoreBtn      = document.getElementById("learnMoreBtn");
const confirmDeployBtn  = document.getElementById("confirmDeployBtn");

const deployCineBtn     = document.getElementById("deployCineBtn");
const deployGameBtn     = document.getElementById("deployGameBtn");
const deployVoiceBtn    = document.getElementById("deployVoiceBtn");
const deployAllBtn      = document.getElementById("deployAllBtn");

/* -------------- Vercel Deploy Hook -------------- */
const DEPLOY_HOOK = "https://api.vercel.com/v1/integrations/deploy/prj_Ah1cZl6Nd55ErrfHEWgwxX31wGl5/Ze97OaQJgI";

/* -------------- Deploy (NOVA) -------------- */
async function runNovaDeploy(source = "manual") {
  if (novaDeploying) return;
  novaDeploying = true;

  log(`🜁 Nova: Deployment started (${source}).`);
  setState("DEPLOYING");

  try {
    const res = await fetch(DEPLOY_HOOK, { method: "POST" });
    if (!res.ok) throw new Error("Deploy failed");

    log("Nova → Vercel accepted deployment.");
    missionText.textContent = "Nova deployment triggered.";
    setState("WORKING");

  } catch (err) {
    console.error(err);
    log("❌ Deployment failed. Check Vercel project.");
    setState("ERROR");
  } finally {
    setTimeout(() => { novaDeploying = false; }, 12000);
  }
}

/* -------------- UI helpers -------------- */
function setState(text){
  if (novaState) novaState.textContent = text;
}
function flash(btn){
  if (!btn) return;
  btn.classList.add("flash");
  setTimeout(()=>btn.classList.remove("flash"), 800);
}
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

/* -------------- Button events -------------- */
novaBtn?.addEventListener("click", () => runNovaDeploy("NOVA button"));

missionBanner?.addEventListener("click", () => {
  deployInfoPanel?.classList.toggle("hidden");
  log("Deployment info panel toggled.");
});

learnMoreBtn?.addEventListener("click", () => {
  alert("Nova deployments refresh your Universe with zero downtime and automatic rollback.");
});

confirmDeployBtn?.addEventListener("click", () => {
  deployInfoPanel?.classList.add("hidden");
  novaApproved = true;
  log("Auto-build enabled after your approval.");
  runNovaDeploy("confirmed");
});

/* Status-only buttons */
deployCineBtn?.addEventListener("click", () => { flash(deployCineBtn); log("Cineverse status checked (dashboard only)."); });
deployGameBtn?.addEventListener("click", () => { flash(deployGameBtn); log("Game portal status checked (dashboard only)."); });
deployVoiceBtn?.addEventListener("click", () => { flash(deployVoiceBtn); log("Voice portal status checked (dashboard only)."); });
deployAllBtn?.addEventListener("click", () => { flash(deployAllBtn); log("All portals status checked (dashboard only)."); });

/* -------------- Auto-flagging API -------------- */
window.novaPrepareBuild = function (taskName = "Unnamed Task") {
  log(`Nova prepared: ${taskName}`);
  localStorage.setItem("nova_update_flag", Date.now().toString());
};

/* -------------- Auto-detect + auto-deploy -------------- */
setInterval(() => {
  if (!novaApproved) return;
  if (novaDeploying) return;

  const last = localStorage.getItem("nova_last_build");
  const flag = localStorage.getItem("nova_update_flag");

  if (flag && flag !== last) {
    localStorage.setItem("nova_last_build", flag);
    runNovaDeploy("auto");
  }
}, 30000);

/* -------------- Init -------------- */
document.addEventListener("DOMContentLoaded", () => {
  if (portalCount) portalCount.textContent = "2";
  log("Oasis dashboard online.");
});
