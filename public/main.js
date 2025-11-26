console.log("Dashboard V7.2 loaded");

// ---------- Helpers ----------
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
  div.innerHTML = `<span class="log-time">${now()}</span><span>[${tag}]</span><span>${level}</span><span>${msg}</span>`;
  logBody.appendChild(div);
  logBody.scrollTop = logBody.scrollHeight;
}

log("READY", "DASH", "Dashboard online.");

// ---------- Routing to Portals ----------
document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.onclick = () => {
    const dest = btn.getAttribute("data-open");
    log("NAV", "ROUTER", "Opening " + dest);
    location.href = dest;
  };
});

// ---------- Nova Launch & Deploy (visual only) ----------

const novaDeploy = document.getElementById("novaDeployButton");
const statusEl = document.getElementById("portalStatus");

novaDeploy.onclick = () => {
  if (!statusEl) return;
  statusEl.textContent = "In progress";
  log("RUN", "NOVA", "Launch & Deploy pressed (clean mode).");

  const steps = [
    "Validating Universe routes…",
    "Checking CineVerse portal…",
    "Checking Game portal…",
    "Preparing bundle…"
  ];

  let i = 0;
  const t = setInterval(() => {
    log("SCAN", "NOVA", steps[i]);
    i++;
    if (i >= steps.length) {
      clearInterval(t);
      statusEl.textContent = "Deploy ready";
      log("DONE", "NOVA", "Scan complete. (No remote deploy triggered yet.)");
    }
  }, 600);
};

// ===============================
// Nova Chat Panel (Dashboard)
// ===============================

const chatPanel = document.getElementById("novaChatPanel");
const chatToggle = document.getElementById("novaChatToggle");
const chatClose = document.getElementById("chatCloseBtn");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function addChatMessage(who, text) {
  if (!chatMessages) return;
  const div = document.createElement("div");
  div.className = "chat-msg" + (who === "You" ? " me" : "");
  div.innerHTML = `<span class="who">${who}:</span><span>${text}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function openChat() {
  if (!chatPanel) return;
  chatPanel.classList.add("open");
  if (chatMessages && !chatMessages.hasChildNodes()) {
    addChatMessage(
      "Nova",
      "I’m in local dashboard mode. Ask anything about your portals, and I’ll guide you."
    );
  }
}

function closeChat() {
  if (!chatPanel) return;
  chatPanel.classList.remove("open");
}

chatToggle?.addEventListener("click", openChat);
chatClose?.addEventListener("click", closeChat);

chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = (chatInput?.value || "").trim();
  if (!text) return;
  addChatMessage("You", text);
  if (chatInput) chatInput.value = "";

  // Simple canned response for now
  addChatMessage(
    "Nova",
    "Got it. In this offline preview I can’t call the real AI API, " +
      "but this is exactly where your live Nova assistant will answer on the deployed site."
  );
});
