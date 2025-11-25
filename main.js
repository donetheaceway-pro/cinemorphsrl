// CinemorphSRL — SuperNova Dashboard (Cinematic Pipeline)
(() => {
  const LS_KEY = "cinemorphsrl_pipeline_v1";

  const defaultPipeline = [
    { id: "dash", title: "Dashboard routed & stable", status: "ready" },
    { id: "portals", title: "Portals linked (Cineverse + Game)", status: "ready" },
    { id: "nova", title: "Nova Deploy Pipeline integrated", status: "working" },
    { id: "cine_ui", title: "Cineverse portal UI expansion", status: "next" },
    { id: "game_ui", title: "Game portal UI expansion", status: "pending" },
    { id: "universe_nav", title: "Universe navigation + marketplace tie-ins", status: "pending" },
  ];

  let autopilot = false;

  const loadPipeline = () => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultPipeline;
  };

  const savePipeline = (p) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch {}
  };

  const statusClass = (s) =>
    s === "ready" ? "status-ready" :
    s === "working" ? "status-working" :
    s === "next" ? "status-next" : "status-pending";

  const renderPipeline = (pipeline) => {
    const wrap = document.getElementById("pipeline");
    if (!wrap) return;

    wrap.innerHTML = pipeline.map((row, i) => {
      const canLaunch = row.status === "ready" || row.status === "next";
      const canComplete = row.status === "working";
      return `
        <div class="pipe-row" data-id="${row.id}">
          <div class="pipe-status ${statusClass(row.status)}">${row.status.toUpperCase()}</div>
          <div class="pipe-title">${i+1}. ${row.title}</div>
          <div class="pipe-actions">
            <button class="btn btn-mini" data-action="launch" ${canLaunch ? "" : "disabled"}>Launch</button>
            <button class="btn btn-mini" data-action="complete" ${canComplete ? "" : "disabled"}>Complete</button>
          </div>
        </div>
      `;
    }).join("");

    wrap.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const rowEl = btn.closest(".pipe-row");
        const id = rowEl.getAttribute("data-id");
        const action = btn.getAttribute("data-action");
        if (action === "launch") launchObstacle(id);
        if (action === "complete") completeObstacle(id);
      });
    });
  };

  const pushLog = (msg) => {
    const log = document.getElementById("log");
    if(!log) return;
    const time = new Date().toLocaleString();
    const div = document.createElement("div");
    div.className = "log-item";
    div.innerHTML = `<div>${msg}</div><div class="log-time">${time}</div>`;
    log.prepend(div);
  };

  const showBlink = (msg) => {
    const banner = document.getElementById("blinkBanner");
    const text = document.getElementById("blinkText");
    if (!banner || !text) return;
    text.textContent = msg;
    banner.classList.remove("hidden");
  };
  const hideBlink = () => document.getElementById("blinkBanner")?.classList.add("hidden");

  const normalize = (pipeline) => {
    if (!pipeline.some(r => r.status === "working")) {
      const first = pipeline.find(r => r.status === "ready" || r.status === "next");
      if (first) first.status = "working";
    }
    if (!pipeline.some(r => r.status === "next")) {
      const firstPending = pipeline.find(r => r.status === "pending");
      if (firstPending) firstPending.status = "next";
    }
    return pipeline;
  };

  const launchObstacle = (id) => {
    let p = loadPipeline();
    const row = p.find(r => r.id === id);
    if(!row) return;

    p.forEach(r => { if (r.status === "working") r.status = "ready"; });
    row.status = "working";

    p = normalize(p);
    savePipeline(p);
    renderPipeline(p);

    hideBlink();
    pushLog(`Launched: ${row.title}`);
    document.getElementById("novaState").textContent = "WORKING";

    if (autopilot) setTimeout(() => completeObstacle(id), 900);
  };

  const completeObstacle = (id) => {
    let p = loadPipeline();
    const idx = p.findIndex(r => r.id === id);
    if(idx === -1) return;

    p[idx].status = "ready";

    const next = p.find((r, i) => i > idx && (r.status === "next" || r.status === "pending" || r.status === "ready"));
    if (next) next.status = "next";

    p = normalize(p);
    savePipeline(p);
    renderPipeline(p);

    pushLog(`Completed: ${p[idx].title}`);
    showBlink(`Completed “${p[idx].title}”. Next obstacle is ready to deploy.`);
    document.getElementById("novaState").textContent = "READY";

    if (autopilot) {
      const working = p.find(r => r.status === "working");
      if (working) setTimeout(() => completeObstacle(working.id), 1100);
    }
  };

  const deployNow = () => {
    const next = loadPipeline().find(r => r.status === "next");
    if(next){
      showBlink(`“${next.title}” is ready to deploy. Click Launch when you’re ready.`);
      pushLog(`Deploy ready: ${next.title}`);
    } else {
      showBlink("No next obstacle found. Everything looks complete.");
    }
  };

  const toggleAutopilot = () => {
    autopilot = !autopilot;
    const btn = document.getElementById("autopilotToggle");
    if(btn){
      btn.textContent = `Autopilot: ${autopilot ? "ON" : "OFF"}`;
      btn.setAttribute("aria-pressed", autopilot ? "true" : "false");
    }
    pushLog(`Autopilot switched ${autopilot ? "ON" : "OFF"}.`);
    if (autopilot){
      const working = loadPipeline().find(r => r.status === "working");
      if (working) setTimeout(() => completeObstacle(working.id), 900);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const p = normalize(loadPipeline());
    savePipeline(p);
    renderPipeline(p);

    document.getElementById("deployNow")?.addEventListener("click", deployNow);
    document.getElementById("autopilotToggle")?.addEventListener("click", toggleAutopilot);

    document.getElementById("novaButton")?.addEventListener("click", (e) => {
      e.currentTarget.classList.add("pulse");
      setTimeout(() => e.currentTarget.classList.remove("pulse"), 650);
    });

    pushLog("Cinematic dashboard online.");
  });
})();
