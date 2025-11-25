// Synthetic AI — Configuration & Safety Rules
// Incremental-only mode. No full rewrites. No autonomous actions.

(function () {
  window.SYNTHETIC_AI_CONFIG = {
    version: "1.0.0",
    mode: "incremental-only",

    fences: {
      requireOptInAttribute: "data-sai",   // Only touch elements with data-sai
      allowedScopes: ["portal", "work-env", "layout"],
      protectedAttribute: "data-protected" // Never touch if this is present
    },

    ui: {
      logElementId: "syntheticAiLog",
      scanButtonId: "saiScanBtn",
      applyButtonId: "saiApplyBtn",
      quickFixButtonId: "saiQuickFixBtn"
    },

    rules: [
      {
        id: "normalize-portal-cards",
        label: "Normalize portal card sizes in the main portal column",
        scope: "portal"
      },
      {
        id: "normalize-work-env-cards",
        label: "Make work-environment tiles uniform and aligned",
        scope: "work-env"
      },
      {
        id: "tighten-layout-gaps",
        label: "Adjust spacing between columns and cards",
        scope: "layout"
      }
    ]
  };
})();

