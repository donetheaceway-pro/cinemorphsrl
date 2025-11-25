/* CinemorphSRL — Nova Deploy Pipeline
   Static site logic (no real deploy from browser).
   "Deploy Now" = marks next obstacle deploy ready + reminds you to commit.
*/

const STORAGE_KEY = "cinemorph_pipeline_v1";
const MOTION_KEY = "cinemorph_motion_v1";

const obstacles = [
  { title: "Dashboard routed & stable", status: "working" },
  { title: "Portals linked (Cineverse + Game)", status: "ready" },
  { title: "Nova Deploy Pipeline integrated", status: "ready" },
  { title: "Cineverse portal UI expansion", status: "next" },
  { title: "Game portal UI expansion", status: "pending" },
  { title: "Universe navigation + marketplace tie-ins", status: "pending" }
];

const statusOrder = ["working", "ready", "next", "pending"];
const badgeText = s => s.toUpperCase();

const pipelineList = document.getElementById("pipelineList");
const missionText = document.getElementById("missionText");
const missionBanner = document.getElementById("missionBanner");
const novaLog = document.getElementById("novaLog");
const novaState = document.getElementById("novaState");
const deployNowTop = document.getElementById("deployNowTop");
const motionToggle = document.getElementById("motionToggle");

let state = loadState();

// ---------- Motion Toggle ----------
initMotion();

function initMotion(){
  const saved = localStorage.getItem(MOTION_KEY);
  const motionOn = saved !== "off"; // default ON
  setMotion(motionOn);

  motionToggle.addEventListener("click", () => {
    const nowOn = !document.body.classList.contains("animated");
    setMotion(nowOn);
  });
}

function setMotion(on){
  document.body.classList.toggle("animated", on);
  localStorage.setItem(MOTION_KEY, on ? "on" : "off");
  motionToggle.textContent = `Motion: ${on ? "ON" : "OFF"}`;
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

function getNextDeployReady(){
  // first "next", else first "ready" after working, else null
  return state.obstacles.findIndex(o => o.status === "next")
      ?? state.obstacles.findIndex(o => o.status === "ready");
}

// ---------- Rendering ----------
renderAll();

function renderAll(){
  renderPipeline();
  renderMission();
  renderLog();
}

function renderPipeline(){
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

// ---------- Actions ----------
function onLaunch(i){
  // set launched item to working
  state.obstacles = state.obstacles.map((o, idx) => {
    if(idx === i) return {...o, status:"working"};
    if(o.status === "working") return {...o, status:"ready"};
    return o;
  });

  // if it was "next", slide a "next" down if needed
  advanceNext();
  log(`Launched: ${state.obstacles[i].title}`);
  saveState();
  renderAll();
}

function onComplete(i){
  // mark current working as ready-complete and move next up
  state.obstacles[i].status = "ready"; // stays green to show done-ready
  // after completion, push a true next item
  advanceNext(true);
  log(`Completed: ${state.obstacles[i].title}`);
  saveState();
  renderAll();
}

function advanceNext(force=false){
  // If there is already a "next" and not forcing, keep it.
  if(!force && state.obstacles.some(o => o.status === "next")) return;

  // find first pending after last ready/working
  const idx = state.obstacles.findIndex(o => o.status === "pending");
  if(idx >= 0){
    state.obstacles[idx].status = "next";
  }
}

// Deploy Now (top mission button)
deployNowTop.addEventListener("click", () => {
  const idx = state.obstacles.findIndex(o => o.status === "next");
  if(idx < 0){
    alert("Nothing is marked NEXT. Use Launch on the next obstacle first.");
    return;
  }
  log(`Deploy ready: ${state.obstacles[idx].title}`);
  alert(
    `Deploy ready: "${state.obstacles[idx].title}".\n\nNext move: commit/push to GitHub to trigger Vercel auto-deploy.`
  );
  saveState();
  renderAll();
});
