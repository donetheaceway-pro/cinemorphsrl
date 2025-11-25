/* CinemorphSRL — Nova Deploy Pipeline (Dashboard Only)
   - Pipeline + Mission Status stay the same
   - Deploy buttons live ONLY on dashboard
   - Buttons call /api/deploy (Vercel function)
*/

const STORAGE_KEY = "cinemorph_pipeline_v2";
const MOTION_KEY  = "cinemorph_motion_v1";

const obstacles = [
  { title: "Dashboard routed & stable", status: "working" },
  { title: "Portals linked (Cineverse + Game)", status: "ready" },
  { title: "Nova Deploy Pipeline integrated", status: "ready" },
  { title: "Cineverse portal UI expansion", status: "next" },
  { title: "Game portal UI expansion", status: "pending" },
  { title: "Voice portal integration", status: "pending" },
  { title: "Universe navigation + marketplace tie-ins", status: "pending" }
];

const badgeText = s => s.toUpperCase();

const pipelineList  = document.getElementById("pipelineList");
const missionText   = document.getElementById("missionText");
const missionBanner = document.getElementById("missionBanner");
const novaLog       = document.getElementById("novaLog");
const novaState     = document.getElementById("novaState");
const deployNowTop  = document.getElementById("deployNowTop");
const motionToggle  = document.getElementById("motionToggle");

// New dashboard deploy panel buttons (must exist in index.html)
const deployCineBtn  = document.getElementById("deployCineBtn");
const deployGameBtn  = document.getElementById("deployGameBtn");
const deployVoiceBtn = document.getElementById("deployVoiceBtn");
const deployAllBtn   = document.getElementById("deployAllBtn");

let state = loadState();

// ---------- Motion Toggle ----------
initMotion();
function initMotion(){
  const saved = localStorage.getItem(MOTION_KEY);
  const motionOn = saved !== "off"; // default ON
  setMotion(motionOn);

  motionToggle?.addEventListener("click", () => {
    const nowOn = !document.body.classList.contains("animated");
    setMotion(nowOn);
  });
}
function setMotion(on){
  document.body.classList.toggle("animated", on);
  localStorage.setItem(MOTION_KEY, on ? "on" : "off");
  if (motionToggle) motionToggle.textContent = `Motion: ${on ? "ON" : "OFF"}`;
}

// ---------- State ----------
function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(saved && Array.isArray(saved.obstacles)) return saved;
  }catch(e){}
  return { obstacles: obstacles.map(o => ({...o})), log: [] };
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function log(msg){
  const time = new Date().toLocaleString();
  state.log.unshift({ msg, time });
  saveState();
  renderLog();
}

// ---------- Rendering ----------
renderAll();
function renderAll(){
  renderPipeline();
  renderMission();
  renderLog();
  wireDeployPanel();   // attach button events once the DOM is ready
}

function renderPipeline(){
  if (!pipelineList) return;
  pipelineList.innerHTML = "";

  state.obstacles.forEach((o, i) => {
    const row = document.createElement("div");
    row.className = "pipe-row";

    const badge = document.createElement("div");
    badge.className = `badge ${o.status}`;
    badge.textContent = badgeText(o.status);

    const title = document.createElement("div");
    title.className = "pipe-title";
    title.textContent = `${i+1}. ${o.title}`;

    const actions = document.createElement("div");
    actions.className = "pipe-actions";

    const launchBtn = document.createElement("button");
    launchBtn.className = "small-btn launch";
    launchBtn.textContent = "Launch";
    launchBtn.disabled = !(o.status === "ready" || o.status === "next");
    launchBtn.onclick = () => onLaunch(i);

    const completeBtn = document.createElement("button");
    completeBtn.className = "small-btn complete";
    completeBtn.textContent = "Complete";
    completeBtn.disabled = !(o.status === "working");
    completeBtn.onclick = () => onComplete(i);

    actions.appendChild(launchBtn);
    actions.appendChild(completeBtn);

    row.appendChild(badge);
    row.appendChild(title);
    row.appendChild(actions);

    pipelineList.appendChild(row);
  });
}

function renderMission(){
  if (!missionText || !missionBanner || !deployNowTop || !novaState) return;

  const nextIdx = state.obstacles.findIndex(o => o.status === "next");
  const readyIdxs = state.obstacles
    .map((o, i) => o.status === "ready" ? i : -1)
    .filter(i => i >= 0);

  let focusIdx = nextIdx >= 0 ? nextIdx : readyIdxs[0];

  if(focusIdx == null){
    missionText.textContent = "No obstacles are deploy ready yet.";
    missionBanner.classList.remove("blink-ready");
    deployNowTop.disabled = true;
    novaState.textContent = "IDLE";
    novaState.classList.remove("working");
    return;
  }

  const focus = state.obstacles[focusIdx];
  missionText.textContent = `“${focus.title}” is ready to deploy.`;

  missionBanner.classList.add("blink-ready");
  deployNowTop.disabled = false;

  novaState.textContent = "WORKING";
  novaState.classList.add("working");
}

function renderLog(){
  if (!novaLog) return;
  novaLog.innerHTML = "";
  if(state.log.length === 0){
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "No log entries yet.";
    novaLog.appendChild(empty);
    return;
  }

  state.log.slice(0, 8).forEach(entry => {
    const item = document.createElement("div");
    item.className = "log-item";
    item.innerHTML = `
      <div>${entry.msg}</div>
      <div class="log-time">${entry.time}</div>
    `;
    novaLog.appendChild(item);
  });
}

// ---------- Pipeline Actions ----------
function onLaunch(i){
  state.obstacles = state.obstacles.map((o, idx) => {
    if(idx === i) return {...o, status:"working"};
    if(o.status === "working") return {...o, status:"ready"};
    return o;
  });

  advanceNext();
  log(`Launched: ${state.obstacles[i].title}`);
  saveState();
  renderAll();
}

function onComplete(i){
  state.obstacles[i].status = "ready";
  advanceNext(true);
  log(`Completed: ${state.obstacles[i].title}`);
  saveState();
  renderAll();
}

function advanceNext(force=false){
  if(!force && state.obstacles.some(o => o.status === "next")) return;
  const idx = state.obstacles.findIndex(o => o.status === "pending");
  if(idx >= 0){
    state.obstacles[idx].status = "next";
  }
}

// ---------- Real Deploy (Dashboard Buttons) ----------
async function deployModule(moduleName, buttonEl){
  try{
    if (buttonEl){
      buttonEl.disabled = true;
      buttonEl.dataset.prev = buttonEl.textContent;
      buttonEl.textContent = "Deploying…";
      buttonEl.classList.add("deploying");
    }

    const message = `Nova Deploy: ${moduleName} — ${new Date().toISOString()}`;

    const resp = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, files: [] }) // files optional for future auto-placement
    });

    const data = await resp.json();

    if(!resp.ok || !data.ok){
      throw new Error(data.error || "Deploy failed");
    }

    log(`Deployed: ${moduleName}`);
    if (buttonEl){
      buttonEl.textContent = "Deployed ✓";
      buttonEl.classList.remove("deploying");
      buttonEl.classList.add("deployed");
      setTimeout(() => {
        buttonEl.textContent = buttonEl.dataset.prev || "Deploy";
        buttonEl.disabled = false;
        buttonEl.classList.remove("deployed");
      }, 1800);
    }
  }catch(err){
    log(`Deploy error (${moduleName}): ${err.message}`);
    if (buttonEl){
      buttonEl.textContent = "Error — retry";
      buttonEl.classList.remove("deploying");
      buttonEl.classList.add("error");
      setTimeout(() => {
        buttonEl.textContent = buttonEl.dataset.prev || "Deploy";
        buttonEl.disabled = false;
        buttonEl.classList.remove("error");
      }, 2200);
    }
  }
}

function wireDeployPanel(){
  // only wire once
  if (wireDeployPanel.done) return;
  wireDeployPanel.done = true;

  deployCineBtn?.addEventListener("click", () => deployModule("Cineverse Portal", deployCineBtn));
  deployGameBtn?.addEventListener("click", () => deployModule("Game Portal", deployGameBtn));
  deployVoiceBtn?.addEventListener("click", () => deployModule("Voice Portal", deployVoiceBtn));
  deployAllBtn?.addEventListener("click", () => deployModule("Deploy All Portals", deployAllBtn));

  // Top mission button deploys whatever is currently NEXT/READY
  deployNowTop?.addEventListener("click", () => {
    const idx = state.obstacles.findIndex(o => o.status === "next");
    const focusIdx = idx >= 0 ? idx : state.obstacles.findIndex(o => o.status === "ready");
    if (focusIdx < 0){
      alert("No obstacle is deploy ready yet.");
      return;
    }
    const focusName = state.obstacles[focusIdx].title;
    deployModule(focusName, deployNowTop);
  });
}
