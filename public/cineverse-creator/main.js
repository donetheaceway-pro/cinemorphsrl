console.log("CineVerse V7.2 loaded");

function now() {
  const d = new Date();
  return `[${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}]`;
}

const logBody = document.getElementById("logBody");

function log(level, tag, msg) {
  if (!logBody) return;
  const div = document.createElement("div");
  div.className = "log-line";
  div.innerHTML = `
    <span class="log-time">${now()}</span>
    <span>[${tag}]</span>
    <span>${level}</span>
    <span>${msg}</span>`;
  logBody.appendChild(div);
  logBody.scrollTop = logBody.scrollHeight;
}

log("READY", "CINEVERSE", "Portal online.");

// ---------- Back → Dashboard ----------
document.querySelector("[data-back]")?.addEventListener("click", () => {
  log("NAV", "PORTAL", "Back to Dashboard");
  location.href = "../public/index.html";
});

// ---------- Buttons ----------
document.getElementById("btnEnter")?.addEventListener("click", () => {
  log("OPEN", "STUDIO", "Opening CineVerse Studio");
  alert("CineVerse Studio placeholder.");
});

document.getElementById("btnRoadmap")?.addEventListener("click", () => {
  log("INFO", "ROADMAP", "Viewing roadmap");
  alert("Roadmap placeholder.");
});

// ---------- Deploy Simulation ----------
const novaDeploy = document.getElementById("novaDeployButton");
const statusEl = document.getElementById("portalStatus");

novaDeploy.onclick = () => {
  statusEl.textContent = "In progress";
  log("RUN", "NOVA", "CineVerse deploy simulation…");

  const steps = [
    "Checking movie assets…",
    "Validating metadata…",
    "Syncing Universe…",
    "Finalizing…"
  ];

  let i = 0;
  const t = setInterval(() => {
    log("SCAN", "NOVA", steps[i]);
    i++;
    if (i >= steps.length) {
      clearInterval(t);
      statusEl.textContent = "Deploy ready";
      log("DONE", "NOVA", "CineVerse ready.");
    }
  }, 600);
};

// ===============================
// REAL NOVA CHAT (wired to API)
// ===============================
const chatPanel = document.getElementById("novaChatPanel");
const chatToggle = document.getElementById("novaChatToggle");
const chatClose = document.getElementById("chatCloseBtn");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function addChatMessage(who, text) {
  const div = document.createElement("div");
  div.className = "chat-msg" + (who === "You" ? " me" : "");
  div.innerHTML = `<span class="who">${who}:</span><span>${text}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatToggle?.addEventListener("click", () => {
  chatPanel.classList.add("open");
  if (!chatMessages.hasChildNodes()) {
    addChatMessage("Nova", "CineVerse AI ready.");
  }
});

chatClose?.addEventListener("click", () => {
  chatPanel.classList.remove("open");
});

chatForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = chatInput.value.trim();
  if (!text) return;

  addChatMessage("You", text);
  chatInput.value = "";

  addChatMessage("Nova", "Typing…");

  try {
    const res = await fetch("/api/nova-chat.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    chatMessages.lastChild.remove();
    addChatMessage("Nova", data.reply || "No response.");

  } catch (err) {
    chatMessages.lastChild.remove();
    addChatMessage("Nova", "Error contacting AI backend.");
  }
});

