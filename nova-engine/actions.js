export function novaActions(action) {
  switch (action) {
    case "deploy":
      return "Deployment started.";
    case "check":
      return "System check complete.";
    default:
      return "Unknown Nova action.";
  }
}
