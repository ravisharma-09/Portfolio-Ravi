// Phone view: fill the whole landscape screen and zoom/follow the player.
// Loaded after Phaser and before main.js. Desktop is untouched.

(function () {
  const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  if (!isTouch) return;

  const BASE_H = 720;
  const ROOM_ZOOM = 1.4; // how close the camera sits to the player in the room

  // Width that matches the phone's landscape shape (16:9 minimum, so desktop layouts still fit)
  function landscapeWidth() {
    const long = Math.max(window.innerWidth, window.innerHeight);
    const short = Math.min(window.innerWidth, window.innerHeight);
    const aspect = Phaser.Math.Clamp(long / short, 16 / 9, 2.4);
    return Math.round(BASE_H * aspect);
  }

  // Swap in the phone-shaped width before main.js creates the game
  const OriginalGame = Phaser.Game;
  Phaser.Game = class extends OriginalGame {
    constructor(config) {
      if (config && config.width === 1280 && config.height === BASE_H) {
        config.width = landscapeWidth();
      }
      super(config);
      window.addEventListener("orientationchange", () => setTimeout(() => this.mvReshape(), 300));
      this.events.on("prerender", () => {
        this.mvRoomCamera();
        this.mvProjectsLayout();
      });
    }

    // Projects screen was drawn for 1280 wide: stretch its backdrop, keep "Exit" clear of the fullscreen button
    mvProjectsLayout() {
      const scene = this.scene.getScene("ProjectScene");
      if (!scene || !scene.sys.isActive() || scene.mvLaidOut) return;
      scene.mvLaidOut = true;
      const w = this.scale.width;
      if (scene.bg && scene.bg.setSize) {
        scene.bg.setSize(w, scene.bg.height).setPosition(w / 2, scene.bg.y);
      }
      scene.children.list.forEach(obj => {
        if (obj.type === "Text" && (obj.text === "Exit" || obj.text === "Press -> ESC")) {
          obj.setX(obj.x - 80);
        }
      });
    }

    // Phone rotated after load: only reshape on the title screen, so nothing mid-game jumps
    mvReshape() {
      const w = landscapeWidth();
      if (w === this.scale.width) return;
      const start = this.scene.getScene("StartScene");
      if (start && start.sys.isActive()) {
        this.scale.setGameSize(w, BASE_H);
        start.scene.restart();
      }
    }

    mvRoomCamera() {
      const scene = this.scene.getScene("GameScene");
      if (!scene || !scene.sys.isActive() || !scene.cameras) return;

      const main = scene.cameras.main;
      const w = this.scale.width;
      const h = this.scale.height;

      // A second, unzoomed camera draws everything pinned to the screen (panels, bubble, buttons)
      if (!scene.mvUiCam || !scene.cameras.cameras.includes(scene.mvUiCam)) {
        scene.mvUiCam = scene.cameras.add(0, 0, w, h);
        scene.mvUiCam.setScroll(0, 0);
      }
      const ui = scene.mvUiCam;

      main.setZoom(ROOM_ZOOM);

      scene.children.list.forEach(obj => {
        if (obj.scrollFactorX === 0) main.ignore(obj);
        else ui.ignore(obj);
      });

      // The speech bubble is placed in unzoomed screen space; map it onto the zoomed player
      const cx = w / 2;
      const cy = h / 2;
      [scene.bubble, scene.bubbleText].forEach(o => {
        if (!o || !o.visible) return;
        if (o.x === o.mvOutX && o.y === o.mvOutY) return; // not moved by the game this frame
        o.mvOutX = (o.x - cx) * ROOM_ZOOM + cx;
        o.mvOutY = (o.y - cy) * ROOM_ZOOM + cy;
        o.setPosition(o.mvOutX, o.mvOutY);
      });

      // Keep screen-corner UI clear of the on-screen controls
      if (typeof terminalContainer !== "undefined" && terminalContainer && !terminalContainer.mvMoved) {
        terminalContainer.mvMoved = true;
        terminalContainer.setPosition(16, 16).setScale(0.8);
      }
      if (scene.speakerBtn && !scene.speakerBtn.mvMoved) {
        scene.speakerBtn.mvMoved = true;
        scene.speakerBtn.setX(w - 120);
      }
    }
  };
})();
