// Bridge Communications Engine — Layout Micro-Fixes + Command Bridge Chat
(function () {
  const config = window.SYNTHETIC_AI_CONFIG;
  if (!config) return;

  const ui = config.ui || {};

  // ---------- Basic log to Bridge Communications log box ----------
  function log(msg) {
    console.log(msg);
    const el = document.getElementById(ui.logElementId);
    if (el) {
      const d = document.createElement("div");
      d.textContent = msg;
      el.appendChild(d);
      el.scrollTop = el.scrollHeight;
    }
  }

  // ---------- Layout micro-fix rules ----------
  function normalizePortal() {
    const cards = [...document.querySelectorAll("[data-sai='portal']")];
    if (!cards.length) return null;

    return {
      label: "Normalize portal cards",
      apply() {
        cards.forEach((c) => {
          c.style.display = "flex";
          c.style.alignItems = "center";
          c.style.justifyContent = "space-between";
          c.style.minWidth = "220px";
          c.style.maxWidth = "220px";
        });
      },
    };
  }

  function normalizeWorkEnv() {
    const cards = [...document.querySelectorAll("[data-sai='work-env']")];
    if (!cards.length) return null;

    return {
      label: "Normalize work environment",
      apply() {
        cards.forEach((c) => {
          c.style.display = "flex";
          c.style.alignItems = "center";
          c.style.justifyContent = "space-between";
        });
      },
    };
  }

  function tightenGaps() {
    const areas = [...document.querySelectorAll("[data-sai='layout']")];
    if (!areas.length) return null;

    return {
      label: "Tighten layout gaps",
      apply() {
        areas.forEach((a) => {
          a.style.display = "flex";
          a.style.flexDirection = "column";
          a.style.rowGap = "0.35rem";
        });
      },
    };
  }

  function collectFixes() {
    return [normalizePortal(), normalizeWorkEnv(), tightenGaps()].filter(Boolean);
  }

  const SAI = {
    scan() {
      log("Scan requested.");
      const fixes = collectFixes();
      if (!fixes.length) {
        log("No layout micro-fixes needed.");
        return [];
      }
      fixes.forEach((f) => log("Found: " + f.label));
      return fixes;
    },

    applyAll() {
      if (config.mode !== "incremental-only") {
        log("Blocked: not in incremental-only mode.");
        return;
      }
      const fixes = this.scan();
      if (!fixes.length) return;
      log("Applying layout micro-fixes…");
      fixes.forEach((f) => f.apply());
      log("Done.");
    },
  };

  window.SyntheticAI = SAI;

  // ---------- Command Bridge Chat (Nova ↔ SAI) ----------
  const MIN_DELAY = 3000;
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  function addChat(sender, text, typing = false) {
    const box = document.getElementById("cbMessages");
    if (!box) return null;
    const msg = document.createElement("div");
    msg.classList.add("cb-msg");
    if (sender === "nova") msg.classList.add("cb-msg-nova");
    if (sender === "sai") msg.classList.add("cb-msg-sai");
    if (typing) msg.classList.add("cb-msg-typing");
    msg.textContent = text;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
    return msg;
  }

  async function novaSays(text) {
    addChat("nova", text);
    await wait(MIN_DELAY);
  }

  async function saiSays(text) {
    const typing = addChat("sai", "SAI is processing…", true);
    await wait(MIN_DELAY);
    if (typing) typing.remove();
    addChat("sai", text);
  }

  async function greetBridgeIfEmpty() {
    const box = document.getElementById("cbMessages");
    if (!box || box.childElementCount > 0) return;
    await novaSays("Hi Sam, Command Bridge is online.");
    await saiSays("SAI here — ready to support Bridge Communications layout micro-fixes.");
  }

  async function handleBridgeInput(text) {
    if (!text || !text.trim()) return;
    const cleaned = text.trim();
    addChat("nova", cleaned);

    const lower = cleaned.toLowerCase();
    let reply = "Acknowledged. I am ready when you approve fixes.";

    if (lower.includes("scan")) {
      reply = "Use the layout scan or quick fix buttons — I will prepare results.";
    } else if (lower.includes("fix")) {
      reply = "I can apply micro-fixes when you click the approval button.";
    } else if (lower.includes("nova")) {
      reply = "Nova is your strategic intelligence. I execute safe, incremental micro-fix tasks.";
    } else if (lower.includes("hello") || lower.includes("hi")) {
      reply = "Hello Sam — SAI is active on the Command Bridge.";
    }

    await saiSays(reply);
  }

  function openBridgePanel() {
    const panel = document.getElementById("commandBridgePanel");
    if (!panel) return;
    panel.classList.remove("cb-panel-hidden");
    panel.classList.add("cb-panel-visible");
    greetBridgeIfEmpty();
  }

  function closeBridgePanel() {
    const panel = document.getElementById("commandBridgePanel");
    if (!panel) return;
    panel.classList.remove("cb-panel-visible");
    panel.classList.add("cb-panel-hidden");
  }

  // ---------- DOM Bindings ----------
  document.addEventListener("DOMContentLoaded", () => {
    // Bridge Communications buttons
    const scanBtn = document.getElementById(ui.scanButtonId);
    const applyBtn = document.getElementById(ui.applyButtonId);
    const quickBtn = document.getElementById(ui.quickFixButtonId);

    if (scanBtn) scanBtn.onclick = () => SAI.scan();
    if (applyBtn) applyBtn.onclick = () => SAI.applyAll();
    if (quickBtn) quickBtn.onclick = () => SAI.applyAll();

    log("Bridge Communications engine ready.");

    // Command Bridge controls
    const toggle = document.getElementById("commandBridgeToggle");
    const closeBtn = document.getElementById("cbClose");
    const sendBtn = document.getElementById("cbSend");
    const input = document.getElementById("cbInput");
    const applyFixBtn = document.getElementById("cbApplyFixes");

    if (toggle) toggle.onclick = openBridgePanel;
    if (closeBtn) closeBtn.onclick = closeBridgePanel;

    function sendFromInput() {
      if (!input) return;
      const value = input.value;
      input.value = "";
      handleBridgeInput(value);
    }

    if (sendBtn) sendBtn.onclick = sendFromInput;
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendFromInput();
        }
      });
    }

    if (applyFixBtn) {
      applyFixBtn.onclick = async () => {
        await novaSays("Nova: Requesting SAI to apply layout micro-fixes.");
        await saiSays("SAI: Applying micro-fixes now within incremental-only safety mode.");
        SAI.applyAll();
      };
    }
  });
})();
