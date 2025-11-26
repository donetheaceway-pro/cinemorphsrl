// =====================================================================
// SAMANTHA’S UNIVERSE — SUPERNOVA / NOSA MASTER FRONT-END ENGINE
// FULL 100% REPLACE VERSION — CLEAN + CORRECT + CONTINUOUS VOICE MODE
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // ELEMENT HOOKS
  // ==========================
  const novaBtn = document.getElementById("novaButton");
  const panel = document.getElementById("novaChatPanel");
  const closeBtn = document.getElementById("closeNovaChat");
  const form = document.getElementById("novaChatForm");
  const input = document.getElementById("novaChatText");
  const messages = document.getElementById("novaChatMessages");
  const cmdButtons = document.querySelectorAll(".cmd-btn");
  const voiceToggle = document.getElementById("voiceModeToggle");
  const talkBtn = document.getElementById("talkToNovaBtn");
  const systemLog = document.getElementById("systemLog");

  let lastContext = "";
  let isListening = false;
  let recognition = null;

  // ==========================
  // HELPERS
  // ==========================
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
    entry.textContent = `• ${text}`;
    systemLog.appendChild(entry);
    systemLog.scrollTop = systemLog.scrollHeight;
  }

  // ==========================
  // PANEL CONTROLS
  // ==========================
  novaBtn.addEventListener("click", () => panel.classList.add("open"));
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));

  // ==========================
  // CHAT SUBMIT
  // ==========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";

    const loadingMsg = document.createElement("div");
    loadingMsg.className = "nova-msg nova-msg-nova";
    loadingMsg.innerHTML = "<p>Connecting to Nova…</p>";
    messages.appendChild(loadingMsg);
    messages.scrollTop = messages.scrollHeight;

    try {
      const res = await fetch("/api/nova", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      loadingMsg.remove();

      appendMessage(data.reply || "Nova: No response received.", "nova");
      speak(data.reply, "nova");

    } catch (err) {
      loadingMsg.remove();
      appendMessage("Problem talking to SAI backend.", "nova");
      logTask("Error: SAI backend unreachable.");
    }
  });

  // =====================================================================
  // NIGHT MODE — END-OF-DAY
  // =====================================================================

  function checkEndOfDayPhrases(t) {
    const x = t.toLowerCase();
    return (
      x.includes("nova goodnight") ||
      x.includes("night nova") ||
      x.includes("nova night") ||
      x.includes("heading to bed") ||
      x.includes("end of day") ||
      x.includes("end of shift")
    );
  }

  async function runEndOfDayProtocol() {
    appendMessage(
      "Commander, Nova reporting. End-of-day protocol initiated.",
      "nova"
    );

    appendMessage(
      `• Tasks logged.
       • Objects saved.
       • Night Mode active.
       • NoSa standing by.`,
      "nova"
    );

    appendMessage(
      "NoSa: Daily log saved. Systems in night mode, Commander.",
      "nosa"
    );

    logTask("Night protocol executed.");
    localStorage.setItem("conciseMode", "true");
  }

  input.addEventListener("input", () => {
    const text = input.value.trim();
    if (text && checkEndOfDayPhrases(text)) runEndOfDayProtocol();
  });

  // =====================================================================
  // CONTINUOUS VOICE MODE — FULLY AUTOMATED LISTENING
  // =====================================================================

  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      input.value = transcript;

      if (event.results[0].isFinal) {
        form.dispatchEvent(new Event("submit"));
      }
    };

    recognition.onerror = () => {
      appendMessage("Nova: Voice input issue detected, Commander.", "nova");
      if (isListening) recognition.start();
    };

    recognition.onend = () => {
      if (isListening) recognition.start();
    };
  }

  talkBtn.addEventListener("click", () => {
    if (!recognition) {
      appendMessage("Nova: Voice not supported on this device.", "nova");
      return;
    }

    if (!isListening) {
      isListening = true;
      talkBtn.classList.add("listening");
      talkBtn.textContent = "🟢 Listening…";
      appendMessage("Nova: Listening, Commander.", "nova");
      recognition.start();
    } else {
      isListening = false;
      talkBtn.classList.remove("listening");
      talkBtn.textContent = "🎤 Talk to Nova";
      recognition.stop();
    }
  });

  // =====================================================================
  // NOVA + NOSA SPEECH OUTPUT
  // =====================================================================
  function speak(text, who = "nova") {
    if (!("speechSynthesis" in window)) return;
    if (!voiceToggle || !voiceToggle.checked) return;
    if (!text) return;

    const u = new SpeechSynthesisUtterance(text);
    u.rate = who === "nova" ? 1.05 : 0.95;
    u.pitch = who === "nova" ? 1.1 : 0.8;

    window.speechSynthesis.speak(u);
  }

  // =====================================================================
  // COMMAND BUTTONS → BACKEND /api/actions
  // =====================================================================

  cmdButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const cmd = btn.dataset.cmd;

      appendMessage(`Command: ${cmd}`, "user");
      logTask(`Commander issued ${cmd}`);

      try {
        const res = await fetch("/api/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            command: cmd,
            context: lastContext
          })
        });

        const data = await res.json();

        if (data.nosa) {
          appendMessage(data.nosa, "nosa");
          logTask(`NoSa: ${data.nosa}`);
          speak(data.nosa, "nosa");
        }

        if (data.nova) {
          appendMessage(data.nova, "nova");
          logTask(`Nova: ${data.nova}`);
          speak(data.nova, "nova");
        }

      } catch (err) {
        appendMessage("NoSa: Commander, action failed.", "nosa");
      }
    });
  });

  // =====================================================================
  // GREETING
  // =====================================================================

  const greetList = [
    "Nova online, Commander.",
    "Systems green. Nova active.",
    "Nova reporting — fully synced.",
    "Commander, Nova ready.",
    "Operational. Standing by, Commander."
  ];

  const initialGreeting = document.getElementById("initialGreeting");
  if (initialGreeting) {
    initialGreeting.innerHTML = `<p>${greetList[Math.floor(Math.random() * greetList.length)]}</p>`;
  }

}); // END DOM LOADED
