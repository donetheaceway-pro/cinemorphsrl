document.getElementById("novaButton").addEventListener("click", async () => {
  const res = await fetch("/api/nova/run");
  const data = await res.json();
  console.log("Nova:", data);
  alert("Nova Engine Activated");
});
