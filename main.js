// SuperNova Dashboard — CinemorphSRL
// Plain JS, no build needed.

// Utility: formatted time like [18:42:35]
function getTimeStamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}]`;
}

function appendLog(line) {
  const logOutput = document.getElementById("logOutput");
  if (!logOutput) return;

  const atBottom =
    logOutput.scrollTop + logOutput.clientHeight >=
    logOutput.scrollHeight - 4;

  logOutput.textContent += line + "\n";

  if (atBottom) {
    logOutput.scrollTop = logOutput.scrollHeight;
  }
}

function setStatusOnline(message) {
  const pill = document.getElementById("systemStatus");
  if (!pill) return;

  pill.classList.remove("status-offline");
  const dot = pill.querySelector(".dot");
  const label = pill.querySelector(".label");
  if (dot) {
    dot.style.background = "#7fffb7";
    dot.style.boxShadow = "0 0 10px #7fffb7";
  }
  if (label && message) {
    label.textContent = message;
  }
}

function setStatusOffline(message) {
  const pill = document.getElementById("systemStatus");
  if (!pill) return;

  pill.classList.add("status-offline");
  const dot = pill.querySelector(".dot");
  const label = pill.querySelector(".label");
  if (dot) {
    dot.style.background = "#ff5573";
    dot.style.boxShadow = "0 0 10px #ff5573";
  }
  if (label && message) {
    label.textContent = message;
  }
}

function handleNovaPress() {
  appendLog(`${getTimeStamp()} [NOVA] Button pressed. Awaiting command…`);
  setStatusOnline("System: Listening");

  // Small visual pulse on press (handled via class toggle)
  const btn = document.getElementById("novaButton");
  if (!btn) return;

  btn.classList.add("nova-pressed");
  setTimeout(() => btn.classList.remove("nova-pressed"), 180);
}

function handleDeploymentAction(action) {
  switch (action) {
    case "local-preview":
      appendLog(
        `${getTimeStamp()} [DEPLOY] Local preview requested. (Open index.html in your browser to test.)`
      );
      break;
    case "vercel-deploy":
      appendLog(
        `${getTimeStamp()} [DEPLOY] Vercel deploy requested. (This is a visual log only — safe to press.)`
      );
      break;
    case "refresh-env":
      appendLog(
        `${getTimeStamp()} [DEPLOY] Work environment refresh requested.`
      );
      break;
    default:
      appendLog(`${getTimeStamp()} [DEPLOY] Unknown action: ${action}`);
      break;
  }
}

function handlePortalClick(tile) {
  const portal = tile.getAttribute("data-portal") || "#/unknown";
  const label = tile.querySelector("h3")?.textContent?.trim() || "Unknown portal";

  // Highlight active tile
  document
    .querySelectorAll(".portal-tile")
    .forEach((el) => el.classList.remove("active"));
  tile.classList.add("active");

  appendLog(
    `${getTimeStamp()} [DASH] Opening ${portal} (${label}) inside current view.`
  );
}

function initNovaDashboard() {
  appendLog(
    `${getTimeStamp()} [SYSTEM] INFO Samantha's SuperNova Dashboard initialized.`
  );
  appendLog(
    `${getTimeStamp()} [UNIVERSE] READY Visual core online. Waiting for portal selections.`
  );

  // Status pill to online
  setStatusOnline("System: Online");

  // Nova button
  const novaButton = document.getElementById("novaButton");
  if (novaButton) {
    novaButton.addEventListener("click", handleNovaPress);
  }

  // Deployment buttons
  document
    .querySelectorAll(".deployment-grid .btn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        handleDeploymentAction(action);
      });
    });

  // Portal tiles
  document.querySelectorAll(".portal-tile").forEach((tile) => {
    tile.addEventListener("click", () => handlePortalClick(tile));
  });

  // Clear log
  const clearLogButton = document.getElementById("clearLogButton");
  if (clearLogButton) {
    clearLogButton.addEventListener("click", () => {
      const logOutput = document.getElementById("logOutput");
      if (!logOutput) return;
      logOutput.textContent = "";
      appendLog(`${getTimeStamp()} [SYSTEM] Log cleared.`);
    });
  }
}

document.addEventListener("DOMContentLoaded", initNovaDashboard);
