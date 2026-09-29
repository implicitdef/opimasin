declare global {
  interface Window {
    goatcounter?: { count?: (vars: { path: string }) => void };
  }
}

/** Sends a page view to GoatCounter, waiting for count.js if it hasn't loaded yet. */
export function countPageview(path: string) {
  const count = () => {
    console.log(`[goatcounter] page view: ${path}`);
    window.goatcounter?.count?.({ path });
  };
  if (window.goatcounter?.count) {
    count();
    return;
  }
  // count.js loads async; if it's blocked (e.g. ad blocker), this never fires.
  document
    .querySelector("script[data-goatcounter]")
    ?.addEventListener("load", count, { once: true });
}
