(function () {
  const config = window.SYNTHETIC_AI_CONFIG;
  const ui = config.ui;

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

  function normalizePortal() {
    const cards = [...document.querySelectorAll("[data-sai='portal']")];
    if (!cards.length) return null;
    return {
      label: "Normalize portal cards",
      apply() {
        cards.forEach(c => {
          c.style.display = "flex";
          c.style.alignItems = "center";
          c.style.justifyContent = "space-between";
          c.style.minWidth = "220px";
          c.style.maxWidth = "220px";
        });
      }
    };
  }

  function normalizeWorkEnv() {
    const cards = [...document.querySelectorAll("[data-sai='work-env']")];
    if (!cards.length) return null;
    return {
      label: "Normalize work environment",
      apply() {
        cards.forEach(c => {
          c.style.display = "flex";
          c.style.alignItems = "center";
          c.style.justifyContent = "space-between";
        });
      }
    };
  }

  function tightenGaps() {
    const areas = [...document.querySelectorAll("[data-sai='layout']")];
    if (!areas.length) return null;
    return {
      label: "Tighten layout gaps",
      apply() {
        areas.forEach(a => {
          a.style.display = "flex";
          a.style.flexDirection = "column";
          a.style.rowGap = "0.35rem";
        });
      }
    };
  }

  function collect() {
    return [normalizePortal(), normalizeWorkEnv(), tightenGaps()].filter(Boolean);
  }

  const SAI = {
    scan() {
      log("Scan requested.");
      const fixes = collect();
      fixes.forEach(f => log("Found: " + f.label));
      return fixes;
    },
    applyAll() {
      const fixes = this.scan();
      fixes.forEach(f => f.apply());
      log("Done.");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById(ui.scanButtonId).onclick = () => SAI.scan();
    document.getElementById(ui.applyButtonId).onclick = () => SAI.applyAll();
    document.getElementById(ui.quickFixButtonId).onclick = () => SAI.applyAll();
    log("Synthetic AI ready.");
  });
})();

