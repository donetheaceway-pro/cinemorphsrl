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
