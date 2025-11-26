// ===================== MAIN.JS — FULL SYSTEM =====================
document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------------------------------------
  // ELEMENTS
  // ------------------------------------------------------------
  const novaBtn = document.getElementById("novaButton");
  const panel = document.getElementById("novaChatPanel");
  const closeBtn = document.getElementById("closeNovaChat");
  const form = document.getElementById("novaChatForm");
  const input = document.getElementById("novaChatText");
  const messages = document.getElementById("novaChatMessages");
  const cmdButtons = document.querySelectorAll(".cmd-btn");
  const systemLog = document.getElementById("systemLog");
  const currentObjectEl = document.getElementById("currentObject");
  const currentModeEl = document.getElementById("currentMode");
  const voiceToggle = document.getElementById("voiceModeToggle");
  const talkBtn = document.getElementById("talkToNovaBtn");
  const alertBadge = document.getElementById("alertBadge");
  const alertBanner = document.getElementById("alertBanner");
  const initialGreeting = document.getElementById("initialGreeting");

  let lastContext = "";
  let recognition;
  let isListening = false;

  // ------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------
  function appendMessage(text, who = "nova") {
    const div = document.createElement("div");
    div.className = `nova-msg nova-msg-${who}`;
    div.innerHTML = `<p>${text}</p>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    lastContext = text;
  }

  function logTask(text) {
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.textContent = "• " + text;
    systemLog.appendChild(entry);
    systemLog.scrollTop = systemLog.scrollHeight;
  }

  function speak(text, who = "nova") {
    if (!voiceToggle || !voiceToggle.checked) return;
    if (!("speechSynthesis" in window)) return;

    const u = new SpeechSynthesisUtterance(text);
    u.rate = who === "nova" ? 1.05 : 0.95;
    u.pitch = who === "nova" ? 1.1 : 0.9;
    speechSynthesis.speak(u);
  }

  function updateAlerts(color, message) {
    alertBadge.className = `alert-badge ${color}`;
    alertBadge.textContent = message;

    alertBanner.className = `alert-banner ${color}`;
    alertBanner.textContent = `System Status: ${message}`;
  }

  // ------------------------------------------------------------
  // CHAT PANEL
  // ------------------------------------------------------------
  novaBtn.addEventListener("click", () => panel.classList.add("open"));
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));

  // ------------------------------------------------------------
  // NOVA — REAL AI CALL (CHAT)
  // ------------------------------------------------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    logTask("Commander: " + text);
    input.value = "";

    const loading = document.createElement("div");
    loading.className = "nova-msg nova-msg-nova";
    loading.innerHTML = "<p>Connecting to Nova…</p>";
    messages.appendChild(loading);

    try {
      const res = await fetch("/api/nova", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: lastContext || ""
        })
      });

      const data = await res.json();
      loading.remove();

      if (data.reply) {
        appendMessage(data.reply, "nova");
        speak(data.reply, "nova");
        lastContext = data.context || data.reply;
      } else {
        appendMessage("Nova: No response received.", "nova");
      }

    } catch (err) {
      console.error(err);
      loading.remove();
      appendMessage("Problem talking to SAI backend.", "nova");
      logTask("ERROR — Nova backend unreachable");
    }
  });

  // ------------------------------------------------------------
  // END-OF-DAY DETECTION
  // ------------------------------------------------------------
  function isNightPhrase(t) {
    t = t.toLowerCase();
    return (
      t.includes("nova goodnight") ||
      t.includes("nova night") ||
      t.includes("heading to bed") ||
      t.includes("end of day") ||
      t.includes("end of shift")
    );
  }

  async function runNightMode() {
    appendMessage(
      "Commander, Nova initiating end-of-day shutdown protocol.",
      "nova"
    );

    appendMessage(
      "• All tasks logged\n• Objects stored\n• Night Mode activated\n• NoSa on quiet standby",
      "nova"
    );

    appendMessage("NoSa: Daily log saved, Commander.", "nosa");

    logTask("Night Mode Triggered");
    localStorage.setItem("conciseMode", "true");
  }

  input.addEventListener("input", () => {
    const t = input.value.trim();
    if (t && isNightPhrase(t)) runNightMode();
  });

  // ------------------------------------------------------------
  // VOICE INPUT
  // ------------------------------------------------------------
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let t = "";
      for (let i = 0; i < event.results.length; i++) {
        t += event.results[i][0].transcript;
      }
      input.value = t;

      if (event.results[0].isFinal) {
        form.dispatchEvent(new Event("submit"));
      }
    };

    recognition.onerror = () => {
      appendMessage("Nova: Voice system encountered an issue.", "nova");
    };
  }

  talkBtn.addEventListener("click", () => {
    if (!recognition) {
      appendMessage("Voice not supported on this device.", "nova");
      return;
    }

    if (!isListening) {
      isListening = true;
      talkBtn.textContent = "🟢 Listening…";
      appendMessage("Nova: Listening, Commander.", "nova");
      recognition.start();
    } else {
      isListening = false;
      talkBtn.textContent = "🎤 Talk to Nova";
      recognition.stop();
    }
  });

  // ------------------------------------------------------------
  // ROTATING GREETING
  // ------------------------------------------------------------
  function getGreeting() {
    const g = [
      "Nova online, Commander.",
      "Systems green. Nova active.",
      "Commander, Nova reporting.",
      "All systems synced and standing by."
    ];
    return g[Math.floor(Math.random() * g.length)];
  }
  initialGreeting.innerHTML = `<p>${getGreeting()}</p>`;

  // ------------------------------------------------------------
  // ACTION COMMANDS → NoSa (BUTTONS)
  // ------------------------------------------------------------
  cmdButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const cmd = btn.getAttribute("data-cmd");

      appendMessage("Command: " + cmd, "user");
      logTask("Commander issued: " + cmd);

      try {
        const res = await fetch("/api/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            command: cmd,
            context: lastContext || ""
          })
        });

        const data = await res.json();

        if (data.nosa) {
          appendMessage(data.nosa, "nosa");
          speak(data.nosa, "nosa");
        }

        if (data.nova) {
          appendMessage(data.nova, "nova");
          speak(data.nova, "nova");
        }

        if (data.currentObject) {
          currentObjectEl.textContent = data.currentObject;
        }

        if (data.mode) {
          currentModeEl.textContent = data.mode;

          const m = data.mode.toLowerCase();
          if (m.includes("deploy")) updateAlerts("purple", "COMMAND — Deploy Mode");
          else if (m.includes("idle")) updateAlerts("blue", "Idle");
          else updateAlerts("green", "READY");
        }

        if (data.preparedPatch) {
          logTask("NoSa: Draft patch prepared and stored.");
        }

      } catch (err) {
        console.error(err);
        appendMessage("NoSa: Action system error.", "nosa");
        logTask("ERROR — NoSa failed");
      }
    });
  });

  // ------------------------------------------------------------
  // INITIAL STATE
  // ------------------------------------------------------------
  updateAlerts("green", "READY — Build State Active");

  if (localStorage.getItem("conciseMode") === "true") {
    appendMessage("Nova: I will keep responses concise.", "nova");
    localStorage.removeItem("conciseMode");
  }

});
