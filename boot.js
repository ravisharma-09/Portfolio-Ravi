// boot.js: loads the game scripts only when the game can actually be shown.
// Phones held upright see the "rotate your phone" screen, so loading Phaser (~1.2 MB)
// and starting the game there only slowed the page down. We wait until landscape instead.

(function () {
  const SCRIPTS = [
    "https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js",
    "mobile-view.js",
    "world.js",
    "arcade.js",
    "main.js",
    "touch.js",
  ];
  const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  const portrait = window.matchMedia("(orientation: portrait)");
  let started = false;

  function loadGame() {
    if (started) return;
    started = true;
    SCRIPTS.forEach(src => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false; // keep execution order: Phaser first, main.js after the scene files
      document.body.appendChild(s);
    });
  }

  if (!isTouch || !portrait.matches) {
    loadGame();
  } else {
    const onChange = () => { if (!portrait.matches) loadGame(); };
    if (portrait.addEventListener) portrait.addEventListener("change", onChange);
    else portrait.addListener(onChange);
    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", () => setTimeout(onChange, 200));
  }
})();
