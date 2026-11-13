// Touch controls for phones/tablets.
// Each on-screen button sends the same keyboard event the desktop game already
// listens for, so the scenes in main.js need no touch-specific logic.

(function () {
  const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  if (!isTouch) return;

  document.body.classList.add("touch");

  const KEYS = {
    up: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
    down: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
    left: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
    right: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
    e: { key: "e", code: "KeyE", keyCode: 69 },
    enter: { key: "Enter", code: "Enter", keyCode: 13 },
    esc: { key: "Escape", code: "Escape", keyCode: 27 },
    r: { key: "r", code: "KeyR", keyCode: 82 },
    1: { key: "1", code: "Digit1", keyCode: 49 },
    2: { key: "2", code: "Digit2", keyCode: 50 },
    3: { key: "3", code: "Digit3", keyCode: 51 },
  };

  function send(type, name) {
    const k = KEYS[name];
    const ev = new KeyboardEvent(type, { key: k.key, code: k.code, bubbles: true, cancelable: true });
    // Phaser reads keyCode/which, which the constructor does not set
    Object.defineProperty(ev, "keyCode", { get: () => k.keyCode });
    Object.defineProperty(ev, "which", { get: () => k.keyCode });
    window.dispatchEvent(ev);
  }

  const root = document.createElement("div");
  root.id = "touch-controls";
  root.innerHTML = `
    <div class="dpad">
      <button data-key="up" class="up" aria-label="Up">▲</button>
      <button data-key="left" class="left" aria-label="Left">◀</button>
      <button data-key="right" class="right" aria-label="Right">▶</button>
      <button data-key="down" class="down" aria-label="Down">▼</button>
    </div>
    <div class="actions">
      <div class="row extra">
        <button data-key="1">1</button>
        <button data-key="2">2</button>
        <button data-key="3">3</button>
        <button data-key="r">R</button>
      </div>
      <div class="row main">
        <button data-key="esc" class="esc">ESC</button>
        <button data-key="enter" class="primary">START</button>
        <button data-key="e" class="primary">E</button>
      </div>
    </div>
    <button class="fullscreen" aria-label="Fullscreen">⛶</button>
  `;
  document.body.appendChild(root);

  root.querySelectorAll("button[data-key]").forEach(btn => {
    const name = btn.dataset.key;
    let held = false;
    const down = e => {
      e.preventDefault();
      if (held) return;
      held = true;
      btn.classList.add("pressed");
      send("keydown", name);
    };
    const up = e => {
      e.preventDefault();
      if (!held) return;
      held = false;
      btn.classList.remove("pressed");
      send("keyup", name);
    };
    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);
    btn.addEventListener("pointerleave", up);
    btn.addEventListener("contextmenu", e => e.preventDefault());
  });

  const fs = root.querySelector(".fullscreen");
  const el = document.documentElement;
  if (!el.requestFullscreen) {
    fs.style.display = "none";
  } else {
    fs.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else el.requestFullscreen().then(() => {
        if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(() => {});
      }).catch(() => {});
    });
  }

  // Show only the buttons the current scene listens to.
  const btn = name => root.querySelector(`[data-key="${name}"]`);
  const show = (name, on) => btn(name).classList.toggle("hidden", !on);

  function sync() {
    if (typeof game === "undefined" || !game.scene) return;
    const active = game.scene.getScenes(true).map(s => s.scene.key);
    const scene = active[active.length - 1];
    const s = scene ? game.scene.getScene(scene) : null;

    const inStart = scene === "StartScene";
    const inRoom = scene === "GameScene";
    const inProjects = scene === "ProjectScene";
    const inMini = scene === "MiniGameScene";
    const doorOpen = inRoom && typeof doorPanel !== "undefined" && doorPanel && doorPanel.visible;
    const pickingLevel = inMini && s && !s.difficultySelected;
    const miniOver = inMini && s && s.gameOver;

    root.querySelector(".dpad").classList.toggle("hidden", inStart || doorOpen || pickingLevel);
    show("e", inRoom && !doorOpen);
    show("enter", inStart || inProjects);
    btn("enter").textContent = inStart ? "START" : "OPEN";
    show("esc", !inStart);
    show("1", doorOpen || pickingLevel);
    show("2", doorOpen || pickingLevel);
    show("3", pickingLevel);
    show("r", inProjects || miniOver);
  }
  setInterval(sync, 150);
  sync();
})();
