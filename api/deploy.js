// api/deploy.js
// Vercel Serverless Function: creates a GitHub commit (optional) and triggers a Vercel redeploy.
// You control this by clicking Deploy Now on the dashboard.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "POST only" });
  }

  try {
    const {
      message = "Nova Deploy: manual trigger",
      // optional file updates: [{ path: "game-portal/main.js", content: "..." }, ...]
      files = [],
    } = req.body || {};

    const owner = process.env.GH_OWNER;          // "donetheaceway-pro"
    const repo = process.env.GH_REPO;            // "cinemorphsrl"
    const token = process.env.GH_TOKEN;          // GitHub PAT (repo scope)
    const vercelHook = process.env.VERCEL_HOOK;  // Vercel Deploy Hook URL (optional)

    if (!owner || !repo) {
      return res.status(500).json({ ok: false, error: "Missing GH_OWNER / GH_REPO env vars" });
    }

    // If you supplied files, we commit them to GitHub automatically.
    if (files.length > 0) {
      if (!token) {
        return res.status(500).json({ ok: false, error: "Missing GH_TOKEN for auto-commit" });
      }

      // 1) Get latest commit SHA on main
      const refResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
      });
      const refData = await refResp.json();
      const latestCommitSha = refData.object.sha;

      // 2) Get base tree SHA
      const commitResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
      });
      const commitData = await commitResp.json();
      const baseTreeSha = commitData.tree.sha;

      // 3) Create blobs for each file
      const blobShas = await Promise.all(
        files.map(async (f) => {
          const blobResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/vnd.github+json",
            },
            body: JSON.stringify({
              content: f.content,
              encoding: "utf-8",
            }),
          });
          const blobData = await blobResp.json();
          return { path: f.path, sha: blobData.sha };
        })
      );

      // 4) Create new tree
      const treeResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: blobShas.map((b) => ({
            path: b.path,
            mode: "100644",
            type: "blob",
            sha: b.sha,
          })),
        }),
      });
      const treeData = await treeResp.json();

      // 5) Create new commit
      const newCommitResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message,
          tree: treeData.sha,
          parents: [latestCommitSha],
        }),
      });
      const newCommitData = await newCommitResp.json();

      // 6) Move main ref to new commit
      await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          sha: newCommitData.sha,
          force: false,
        }),
      });
    }

    // Trigger Vercel redeploy (deploy hook), if provided.
    if (vercelHook) {
      await fetch(vercelHook, { method: "POST" });
    }

    return res.status(200).json({
      ok: true,
      note: files.length > 0 ? "Committed + deploy triggered" : "Deploy triggered",
      repo: `${owner}/${repo}`,
      message,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}
