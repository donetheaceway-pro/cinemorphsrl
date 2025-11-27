export default async function handler(req, res) {
  try {
    const deployHook = process.env.VERCEL_DEPLOY_HOOK;
    const githubToken = process.env.GITHUB_PAT;

    if (!deployHook) {
      return res.status(500).json({
        error: "Missing VERCEL_DEPLOY_HOOK env variable."
      });
    }

    // Trigger Vercel Deploy
    const vercelRes = await fetch(deployHook, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    let githubStatus = "skipped";

    // Optional GitHub workflow trigger
    if (githubToken) {
      await fetch(
        "https://api.github.com/repos/Samantha-s-SuperNova/cinemorphsrl/actions/workflows/main.yml/dispatches",
        {
          method: "POST",
          headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${githubToken}`
          },
          body: JSON.stringify({ ref: "main" })
        }
      );

      githubStatus = "triggered";
    }

    return res.status(200).json({
      message: "Nova Engine deployment triggered.",
      vercel_status: vercelRes.status,
      github_workflow: githubStatus
    });

  } catch (err) {
    console.error("Nova Engine ERROR:", err);
    return res.status(500).json({
      error: "Nova Engine failed.",
      details: err.message
    });
  }
}
