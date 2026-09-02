/* GHL owns the widget UI. This only connects the site's existing AI triggers. */
(() => {
  let pendingOpen = false;
  let retryTimer;

  const launcherSelector = '[data-ghl-ai-launcher], [data-chat-widget] button, button[aria-label*="chat widget" i]';

  const findLauncherIn = (root) => {
    const launcher = root.querySelector(launcherSelector);
    if (launcher) return launcher;
    for (const element of root.querySelectorAll('*')) {
      if (element.shadowRoot) {
        const nestedLauncher = findLauncherIn(element.shadowRoot);
        if (nestedLauncher) return nestedLauncher;
      }
    }
    return null;
  };

  const findLauncher = () => findLauncherIn(document);

  const highlightLauncher = (launcher) => {
    if (typeof launcher.animate !== 'function') return;
    launcher.getAnimations().forEach((animation) => animation.cancel());
    launcher.animate([
      { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(14, 102, 116, 0)' },
      { transform: 'scale(2)', boxShadow: '0 0 0 12px rgba(14, 102, 116, 0.2)' },
      { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(14, 102, 116, 0)' }
    ], { duration: 1600, easing: 'ease-in-out', fill: 'none' });
  };

  const tryOpen = () => {
    const launcher = findLauncher();
    if (launcher instanceof HTMLElement) {
      pendingOpen = false;
      highlightLauncher(launcher);
      launcher.click();
      window.setTimeout(() => {
        const activeLauncher = findLauncher();
        if (activeLauncher instanceof HTMLElement) highlightLauncher(activeLauncher);
      }, 0);
      return true;
    }
    return false;
  };

  const waitForWidget = () => {
    if (!pendingOpen || tryOpen()) return;
    clearTimeout(retryTimer);
    retryTimer = window.setTimeout(waitForWidget, 250);
  };

  window.GHLIntegration = {
    openAIChat() {
      pendingOpen = true;
      waitForWidget();
    }
  };

  new MutationObserver(() => {
    if (pendingOpen) tryOpen();
  }).observe(document.body, { childList: true, subtree: true });
})();