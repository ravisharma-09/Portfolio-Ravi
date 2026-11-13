// world.js: the places behind the room's door.
//   HallwayScene : hub with doors to the Archive, the Journey map, the arcade, and back to the room
//   ArchiveScene : find 3 resume pages, print them on the copier, download the resume (Q skips)
//   JourneyScene : walk a map of milestones from Chandigarh to Yogyakarta
// Hallway/Archive backgrounds in assets/world/ were generated using assets/room.png as the style reference.
// Loaded before main.js because main.js lists these scenes in its game config.
// Screen width can be wider than 1280 on phones (see mobile-view.js), so fixed UI uses this.scale.width.

// Where the player should appear when a scene starts, keyed by scene name.
const WORLD_SPAWN = {};
function setSpawn(sceneKey, x, y) { WORLD_SPAWN[sceneKey] = { x, y }; }
function takeSpawn(sceneKey, fallback) {
  const s = WORLD_SPAWN[sceneKey];
  delete WORLD_SPAWN[sceneKey];
  return s || fallback;
}

const RESUME_URL = "assets/Ravi_Sharma_Resume.pdf";
const OUTLINE = 0x5a3a22; // dark brown used for outlines in the room art

// Shared movement, prompts, toasts and transitions for the walkable scenes.
class WorldScene extends Phaser.Scene {
  preload() {
    if (!this.textures.exists("player")) this.load.image("player", "assets/player.png");
    if (!this.cache.audio.exists("click")) this.load.audio("click", "assets/sounds/click.ogg");
    if (!this.cache.audio.exists("notify")) this.load.audio("notify", "assets/sounds/notify.ogg");
    if (!this.cache.audio.exists("coin")) this.load.audio("coin", ["assets/sounds/coin.ogg", "assets/sounds/coin.mp3"]);
    if (!this.cache.audio.exists("type")) this.load.audio("type", ["assets/sounds/type.ogg", "assets/sounds/type.mp3"]);
    // painted backgrounds (generated with room.png as the style reference) + the copier sprite
    if (!this.textures.exists("w_hallway")) this.load.image("w_hallway", "assets/world/hallway_bg.jpg");
    if (!this.textures.exists("w_archive")) this.load.image("w_archive", "assets/world/archive_bg.jpg");
    if (!this.textures.exists("w_copier")) this.load.image("w_copier", "assets/world/copier.png");
  }

  get sw() { return this.scale.width; }
  get sh() { return this.scale.height; }

  setupWorld(width, height, bounds, spawn, playerScale = 0.1) {
    this.worldW = width;
    this.worldH = height;
    this.walk = bounds; // {x1,y1,x2,y2}
    // If the screen is wider/taller than the art, centre the art instead of showing empty space on one side
    const padX = Math.max(0, (this.sw - width) / 2);
    const padY = Math.max(0, (this.sh - height) / 2);
    this.cameras.main.setBounds(-padX, -padY, width + padX * 2, height + padY * 2);
    this.cameras.main.fadeIn(400, 0, 0, 0);

    this.hero = this.add.sprite(spawn.x, spawn.y, "player").setScale(playerScale);
    this.cameras.main.startFollow(this.hero, true, 0.1, 0.1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D");
    this.keyE = this.input.keyboard.addKey("E");
    this.keyEsc = this.input.keyboard.addKey("ESC");
    this.keyQ = this.input.keyboard.addKey("Q");
    this.frozen = false;
    this.leaving = false;

    this.prompt = this.add.text(0, 0, "", {
      fontSize: "24px", fill: "#ffe9b8", backgroundColor: "rgba(60,36,18,0.9)", padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setDepth(5000).setVisible(false);
    this.tweens.add({ targets: this.prompt, y: "+=6", duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    // on phones the bottom corners hold the touch buttons, so messages go near the top
    const toastY = document.body.classList.contains("touch") ? 100 : this.sh - 60;
    this.toastBox = this.add.text(this.sw / 2, toastY, "", {
      fontSize: "22px", fill: "#ffffff", backgroundColor: "rgba(40,24,12,0.85)",
      padding: { x: 14, y: 8 }, align: "center"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(9000).setVisible(false);

    this.sfx = {
      click: this.sound.add("click", { volume: 0.2 }),
      notify: this.sound.add("notify", { volume: 0.05 }),
      coin: this.sound.add("coin", { volume: 0.2 }),
      type: this.sound.add("type", { volume: 0.25 }),
    };
  }

  moveHero(speed) {
    if (this.frozen || this.leaving) return;
    const dt = this.game.loop.delta / 1000;
    const c = this.cursors, k = this.wasd, h = this.hero;
    if (c.left.isDown || k.A.isDown) { h.x -= speed * dt; h.setFlipX(true); }
    if (c.right.isDown || k.D.isDown) { h.x += speed * dt; h.setFlipX(false); }
    if (c.up.isDown || k.W.isDown) h.y -= speed * dt;
    if (c.down.isDown || k.S.isDown) h.y += speed * dt;
    h.x = Phaser.Math.Clamp(h.x, this.walk.x1, this.walk.x2);
    h.y = Phaser.Math.Clamp(h.y, this.walk.y1, this.walk.y2);
    h.setDepth(h.y);
  }

  // Call once at the top of update(): true only on the frame E was pressed.
  // (Phaser keeps a press "fresh" until someone reads it, so reading it in only one branch
  // let an old press fire later when the player walked up to a door or the copier.)
  readKeys() {
    this.pressE = Phaser.Input.Keyboard.JustDown(this.keyE);
    this.pressEsc = Phaser.Input.Keyboard.JustDown(this.keyEsc);
    this.pressQ = Phaser.Input.Keyboard.JustDown(this.keyQ);
  }

  near(obj, range) {
    return Phaser.Math.Distance.Between(this.hero.x, this.hero.y, obj.x, obj.y) < range;
  }

  // Prompt sits on the object (door, copier...) when an anchor is given, else above the player.
  // It shrinks to fit narrow phone screens and always stays inside the visible area.
  showPrompt(text, anchor) {
    const view = this.cameras.main.worldView;
    this.prompt.setText(text).setVisible(true).setScale(1);
    const maxW = view.width - 20;
    if (this.prompt.width > maxW) this.prompt.setScale(maxW / this.prompt.width);
    const half = this.prompt.displayWidth / 2 + 10;
    const x = Phaser.Math.Clamp(anchor ? anchor.x : this.hero.x, view.x + half, view.right - half);
    const y = Phaser.Math.Clamp(anchor ? anchor.y : this.hero.y - 95, view.y + 30, view.bottom - 30);
    this.prompt.setPosition(x, y);
  }

  toast(msg, ms = 2600) {
    this.toastBox.setText(msg).setVisible(true).setAlpha(1);
    if (this.toastTimer) this.toastTimer.remove();
    this.toastTimer = this.time.delayedCall(ms, () => {
      this.tweens.add({ targets: this.toastBox, alpha: 0, duration: 300, onComplete: () => this.toastBox.setVisible(false) });
    });
  }

  hud(x, y, text, originX = 0) {
    return this.add.text(x, y, text, {
      fontSize: "22px", fill: "#ffe9b8", backgroundColor: "rgba(40,24,12,0.8)", padding: { x: 10, y: 6 }
    }).setOrigin(originX, 0).setScrollFactor(0).setDepth(9000);
  }

  prop(key, x, y) {
    return this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y);
  }

  goTo(sceneKey, spawnScene, spawnX, spawnY) {
    if (this.leaving) return;
    this.leaving = true;
    this.sfx.click.play();
    if (spawnScene) setSpawn(spawnScene, spawnX, spawnY);
    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start(sceneKey));
  }
}

// ---------------------------------------------------------------------------
class HallwayScene extends WorldScene {
  constructor() { super("HallwayScene"); }

  create() {
    // hallway_bg.jpg is 1776x896: doors at x 295 / 745 / 1204, arcade at x 1592, floor y 455..770
    this.add.image(0, 0, "w_hallway").setOrigin(0).setDepth(-20);
    this.setupWorld(1776, 896, { x1: 40, y1: 480, x2: 1736, y2: 760 },
      takeSpawn("HallwayScene", { x: 295, y: 520 }));

    // names on the blank wooden plates above each door
    const plate = (x, text) => this.add.text(x, 179, text, {
      fontSize: "15px", fill: "#fff1d0", fontStyle: "bold"
    }).setOrigin(0.5).setDepth(-10);
    plate(295, "MY ROOM");
    plate(745, "ARCHIVE");
    plate(1204, "JOURNEY");
    this.add.text(1592, 205, "🕹️ ARCADE", {
      fontSize: "16px", fill: "#fff1d0", fontStyle: "bold", backgroundColor: "#7a4a24", padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(-10);

    this.spots = [
      { x: 295, y: 500, at: { x: 295, y: 330 }, label: "Press E to enter", go: () => this.goTo("GameScene", "GameScene", 1130, 330) },
      { x: 745, y: 500, at: { x: 745, y: 330 }, label: "Press E to enter", go: () => this.goTo("ArchiveScene") },
      { x: 1204, y: 500, at: { x: 1204, y: 330 }, label: "Press E to enter", go: () => this.goTo("JourneyScene") },
      { x: 1592, y: 520, at: { x: 1592, y: 360 }, label: "Press E to play", go: () => this.goTo("MiniGameScene", "HallwayScene", 1592, 560) },
    ];

    if (!this.registry.get("hallwayHintShown")) {
      this.registry.set("hallwayHintShown", true);
      this.time.delayedCall(500, () =>
        this.toast("🗄️ ARCHIVE has my resume  ·  🗺️ JOURNEY has my story  ·  🕹️ the arcade has a game", 4500));
    }
  }

  update() {
    this.readKeys();
    this.moveHero(380);
    this.prompt.setVisible(false);
    for (const s of this.spots) {
      if (this.near(s, 110)) {
        this.showPrompt(s.label, s.at);
        if (this.pressE) s.go();
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
class ArchiveScene extends WorldScene {
  constructor() { super("ArchiveScene"); }

  create() {
    // archive_bg.jpg is 1536x1024, same room shape as room.png: door at x 1160, cabinets left, box stacks right
    this.add.image(0, 0, "w_archive").setOrigin(0).setDepth(-20);
    this.setupWorld(1536, 1024, { x1: 110, y1: 380, x2: 1430, y2: 850 },
      takeSpawn("ArchiveScene", { x: 1160, y: 420 }));

    this.hud(this.sw / 2, 16, "🗄️ THE ARCHIVE", 0.5);

    // sticky note with the skip hint, on the wall next to the door
    const note = this.add.graphics().setDepth(-10);
    note.fillStyle(0xfff38a).fillRect(1236, 150, 86, 86).lineStyle(3, OUTLINE).strokeRect(1236, 150, 86, 86);
    this.add.text(1279, 193, "In a hurry?\nPress Q\nto skip!", {
      fontSize: "13px", fill: "#32201a", align: "center"
    }).setOrigin(0.5).setDepth(-9);

    this.exitDoor = { x: 1160, y: 390 };

    // the copier is the "printer", in the middle of the room
    this.copier = this.prop("w_copier", 760, 560);
    this.printer = { x: 760, y: 580 };

    this.makePageTexture();
    const pageData = [
      { x: 255, y: 430, name: "Education", tease: "B.E. CSE @ Newton School of Technology · CGPA 8.17" },
      { x: 1395, y: 440, name: "Projects", tease: "LessonLingo, Setu, Pathglass & this very game" },
      { x: 330, y: 820, name: "Achievements", tease: "AIR 17 Turing Cup 2k26 · ICPC Asia Amritapuri 2025" },
    ];
    // Progress lives in the game registry so leaving and coming back keeps it (until the page reloads)
    this.state = this.registry.get("archive") || { found: [], printed: false };
    this.registry.set("archive", this.state);

    this.pages = pageData.map(p => {
      if (this.state.found.includes(p.name)) return { ...p, found: true };
      const sprite = this.add.image(p.x, p.y, "resume_page").setDepth(p.y - 40).setAngle(Phaser.Math.Between(-20, 20));
      const glow = this.add.circle(p.x, p.y, 34, 0xfff38a, 0.35).setDepth(p.y - 41);
      this.tweens.add({ targets: glow, scale: 1.4, alpha: 0.1, duration: 900, yoyo: true, repeat: -1 });
      return { ...p, sprite, glow, found: false };
    });
    this.counter = this.hud(20, 16, "");
    this.updateCounter();

    this.buildDownloadPanel();
    const welcome = this.state.printed ? "Welcome back! The 🖨️ copier still has my resume."
      : this.found === 3 ? "All pages found. Take them to the 🖨️ copier!"
      : this.found > 0 ? `Welcome back! ${3 - this.found} page${this.found === 2 ? "" : "s"} still hiding…`
      : "My resume pages blew everywhere! Find all 3 and bring them to the 🖨️ copier.";
    this.time.delayedCall(450, () => this.toast(welcome, 4200));
  }

  get found() { return this.state.found.length; }
  get printed() { return this.state.printed; }

  updateCounter() {
    this.counter.setText(this.printed ? "📄 Resume printed ✓" : `📄 Pages ${this.found}/3`);
  }

  makePageTexture() {
    if (this.textures.exists("resume_page")) return;
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff).fillRect(0, 0, 36, 46);
    g.lineStyle(2, 0x9aa5b1);
    for (let y = 10; y < 42; y += 7) g.lineBetween(6, y, 30, y);
    g.lineStyle(3, OUTLINE).strokeRect(0, 0, 36, 46);
    g.generateTexture("resume_page", 36, 46);
    g.destroy();
  }

  buildDownloadPanel() {
    this.panel = this.add.container(this.sw / 2, this.sh / 2).setScrollFactor(0).setDepth(9500).setVisible(false);
    const bg = this.add.rectangle(0, 0, 620, 340, 0xfbe7c4).setStrokeStyle(8, OUTLINE);
    const title = this.add.text(0, -120, "🖨️ Resume printed!", { fontSize: "32px", fill: "#5a3a22", fontStyle: "bold" }).setOrigin(0.5);
    const body = this.add.text(0, -55, "Education · Projects · Achievements\nall in one page.", {
      fontSize: "20px", fill: "#3a2a12", align: "center"
    }).setOrigin(0.5);
    const hint = this.add.text(0, 140, "ESC to close", { fontSize: "16px", fill: "#9a8a6a" }).setOrigin(0.5);
    this.panel.add([bg, title, body, hint]);

    // A real link (not canvas) so browsers allow the download / new tab on click or tap.
    const a = document.createElement("a");
    a.id = "resume-download";
    a.href = RESUME_URL;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "📄 Download Resume";
    a.style.display = "none";
    document.body.appendChild(a);
    this.downloadLink = a;
    this.placeLink = () => {
      const r = this.game.canvas.getBoundingClientRect();
      a.style.left = `${r.left + r.width / 2}px`;
      a.style.top = `${r.top + r.height * ((this.sh / 2 + 60) / this.sh)}px`;
    };
    window.addEventListener("resize", this.placeLink);
    this.events.once("shutdown", () => {
      window.removeEventListener("resize", this.placeLink);
      a.remove();
    });
  }

  openDownload(viaSkip) {
    this.frozen = true;
    this.panelOpen = true;
    this.prompt.setVisible(false);
    this.panel.setVisible(true).setScale(0.85).setAlpha(0);
    this.tweens.add({ targets: this.panel, scale: 1, alpha: 1, duration: 400, ease: "Back.out" });
    this.placeLink();
    this.downloadLink.style.display = "block";
    if (viaSkip) this.toast("Skipped the quest. No judgement 😄", 2200);
  }

  closeDownload() {
    this.panelOpen = false;
    this.frozen = false;
    this.panel.setVisible(false);
    this.downloadLink.style.display = "none";
  }

  // Synthesised "brrrt-brrrt" printer noise (Web Audio), no extra sound file needed
  audioCtx() {
    const ctx = this.sound.context;
    if (!ctx || this.sound.mute) return null;
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Stepper-motor "tk-tk-tk-zzzt" while the page feeds out
  feedSound(ms) {
    const ctx = this.audioCtx();
    if (!ctx) return;
    const rate = ctx.sampleRate, len = Math.floor(rate * ms / 1000);
    const buf = ctx.createBuffer(1, len, rate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / rate;
      const step = (t * 22) % 1;                                   // 22 ticks per second
      const tick = step < 0.18 ? (Math.random() * 2 - 1) * (1 - step / 0.18) : 0;
      const whine = Math.sign(Math.sin(2 * Math.PI * (420 + 260 * (t / (ms / 1000))) * t)) * 0.18;
      d[i] = tick * 0.8 + whine * (0.6 + 0.4 * Math.sin(t * 40));
    }
    const src = ctx.createBufferSource(); src.buffer = buf;
    const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 2600;
    const gain = ctx.createGain(); gain.gain.value = 0.13;
    src.connect(filter); filter.connect(gain); gain.connect(this.sound.masterVolumeNode || ctx.destination);
    src.start();
  }

  // Little "ding!" when the page is done
  ding() {
    const ctx = this.audioCtx();
    if (!ctx) return;
    [1320, 1760].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      const t0 = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
      o.connect(g); g.connect(this.sound.masterVolumeNode || ctx.destination);
      o.start(t0); o.stop(t0 + 0.65);
    });
  }

  printerNoise(ms) {
    const ctx = this.audioCtx();
    if (!ctx) return;
    const rate = ctx.sampleRate, len = Math.floor(rate * ms / 1000);
    const buf = ctx.createBuffer(1, len, rate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / rate;
      const chop = Math.floor(t * 16) % 2 ? 1 : 0.2;            // stutter
      const motor = Math.sin(2 * Math.PI * (80 + 40 * Math.sin(t * 9)) * t);
      d[i] = ((Math.random() * 2 - 1) * 0.6 + motor * 0.4) * chop;
    }
    const src = ctx.createBufferSource(); src.buffer = buf;
    const filter = ctx.createBiquadFilter(); filter.type = "bandpass"; filter.frequency.value = 900; filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.18, ctx.currentTime + ms / 1000 - 0.15);
    gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + ms / 1000);
    src.connect(filter); filter.connect(gain); gain.connect(this.sound.masterVolumeNode || ctx.destination);
    src.start();
  }

  printResume() {
    this.frozen = true;
    this.printing = true;
    this.prompt.setVisible(false);
    const cx = this.copier.x, cy = this.copier.y;
    const mouth = { x: cx, y: cy - 200 };

    // 1. the three pages fly from the player into the copier
    for (let i = 0; i < 3; i++) {
      const sheet = this.add.image(this.hero.x, this.hero.y - 30, "resume_page").setDepth(3000);
      this.tweens.add({
        targets: sheet, x: mouth.x, y: mouth.y, angle: 360, scale: 0.6,
        delay: i * 160, duration: 450, ease: "Quad.in",
        onComplete: () => { sheet.destroy(); this.sfx.click.play(); }
      });
    }

    // 2. the copier goes wild
    const SHAKE_MS = 2400;
    this.time.delayedCall(800, () => {
      this.printerNoise(SHAKE_MS);
      this.cameras.main.shake(SHAKE_MS, 0.006);
      const words = ["BRRRT!", "KA-CHUNK!", "beep beep", "WHIRR!", "*paper noises*", "BZZZT!"];
      const jitter = this.time.addEvent({
        delay: 35, loop: true, callback: () => {
          this.copier.setPosition(cx + Phaser.Math.Between(-11, 11), cy + Phaser.Math.Between(-8, 3));
          this.copier.setAngle(Phaser.Math.FloatBetween(-5, 5));
          this.copier.setScale(1 + Phaser.Math.FloatBetween(-0.03, 0.05));
        }
      });
      const blink = this.time.addEvent({
        delay: 110, loop: true, callback: () => {
          if (this.copier.isTinted) this.copier.clearTint(); else this.copier.setTint(0xffb3b3);
        }
      });
      const clatter = this.time.addEvent({
        delay: 120, loop: true, callback: () => {
          this.sfx.type.play({ rate: Phaser.Math.FloatBetween(0.7, 1.6) });
        }
      });
      const shout = this.time.addEvent({
        delay: 380, loop: true, callback: () => {
          const side = Math.random() < 0.5 ? -1 : 1;
          const w = this.add.text(cx + side * Phaser.Math.Between(150, 230), cy - Phaser.Math.Between(70, 210),
            Phaser.Utils.Array.GetRandom(words), {
              fontSize: "28px", fill: "#ffe9b8", fontStyle: "bold", stroke: "#5a3a22", strokeThickness: 6
            }).setOrigin(0.5).setDepth(3000).setAngle(Phaser.Math.Between(-15, 15));
          this.tweens.add({ targets: w, y: "-=70", alpha: 0, scale: 1.4, duration: 700, onComplete: () => w.destroy() });
        }
      });

      // 3. shaking stops, then the printed resume slowly feeds out of the paper slot
      this.time.delayedCall(SHAKE_MS, () => {
        [jitter, blink, clatter, shout].forEach(e => e.remove());
        this.copier.clearTint().setPosition(cx, cy).setAngle(0).setScale(1);
        this.tweens.add({ targets: this.copier, scaleY: 0.94, duration: 90, yoyo: true });

        const FEED_MS = 1700;
        const slotY = cy - 92;                    // output slot on the copier's front
        const page = this.add.image(cx, slotY, "resume_page").setOrigin(0.5, 0).setScale(1.8).setDepth(cy + 1);
        page.setCrop(0, 0, 36, 0);
        const feed = { h: 0 };
        this.feedSound(FEED_MS);
        const ticks = this.time.addEvent({ delay: 140, loop: true, callback: () => this.sfx.type.play({ rate: 1.4, volume: 0.15 }) });
        const hum = this.time.addEvent({
          delay: 45, loop: true, callback: () => this.copier.setPosition(cx + Phaser.Math.Between(-1, 1), cy)
        });
        this.tweens.add({
          targets: feed, h: 46, duration: FEED_MS, ease: "Linear",
          onUpdate: () => page.setCrop(0, 0, 36, Math.round(feed.h)),
          onComplete: () => {
            ticks.remove(); hum.remove();
            this.copier.setPosition(cx, cy);
            this.ding();
            // 4. pull the page out and show it
            this.tweens.add({
              targets: page, y: slotY - 150, scale: 2.6, duration: 500, ease: "Back.out",
              onComplete: () => {
                this.time.delayedCall(350, () => {
                  page.destroy();
                  this.state.printed = true;
                  this.printing = false;
                  this.updateCounter();
                  this.openDownload(false);
                });
              }
            });
          }
        });
      });
    });
  }

  update() {
    this.readKeys();
    if (this.panelOpen) {
      if (this.pressEsc || this.pressE) this.closeDownload();
      return;
    }
    if (this.printing) return;
    this.moveHero(330);
    this.prompt.setVisible(false);

    if (this.pressQ && !this.frozen) { this.openDownload(true); return; }

    for (const p of this.pages) {
      if (!p.found && this.near(p, 55)) {
        p.found = true;
        this.state.found.push(p.name);
        this.sfx.coin.play();
        this.tweens.add({ targets: [p.sprite, p.glow], y: "-=60", alpha: 0, duration: 400, onComplete: () => { p.sprite.destroy(); p.glow.destroy(); } });
        this.updateCounter();
        this.toast(`📄 ${p.name} page found! (${this.found}/3)\n${p.tease}`, 3000);
        if (this.found === 3) this.time.delayedCall(3100, () => this.toast("All pages found! Take them to the 🖨️ copier.", 3000));
      }
    }

    if (this.near(this.printer, 140)) {
      const onCopier = { x: this.printer.x, y: this.printer.y - 150 };
      if (this.printed) this.showPrompt("Press E to print again", onCopier);
      else if (this.found < 3) this.showPrompt(`Needs 3 pages (${this.found}/3)`, onCopier);
      else this.showPrompt("Press E to print", onCopier);
      if (this.pressE && !this.frozen) {
        // every print runs the full shake + feed, not just the first one
        if (this.printed || this.found === 3) this.printResume();
        else this.toast(`Still missing ${3 - this.found} page${3 - this.found === 1 ? "" : "s"}. Look behind the clutter 👀`);
      }
    } else if (this.near(this.exitDoor, 110)) {
      this.showPrompt("Press E to exit", { x: 1160, y: 230 });
      if (this.pressE) this.goTo("HallwayScene", "HallwayScene", 745, 520);
    }
  }
}

// ---------------------------------------------------------------------------
// Map projection for the journey: degrees -> world pixels.
const MAP_SCALE = 48, MAP_LON0 = 66, MAP_LAT0 = 36, MAP_PAD = 80;
const geo = (lon, lat) => ({ x: (lon - MAP_LON0) * MAP_SCALE + MAP_PAD, y: (MAP_LAT0 - lat) * MAP_SCALE + MAP_PAD });

const JOURNEY = [
  { emoji: "🏫", title: "Army Public School", place: "Chandimandir", date: "2022 – 2023",
    text: "Finished Class X (Matriculation) with 81.86%.", at: geo(76.88, 30.73) },
  { emoji: "🏫", title: "Shri Guru Harkrishan Sr. Sec. School", place: "Chandigarh", date: "2024 – 2025",
    text: "Finished Class XII with 72%.", at: geo(76.78, 30.73), off: [-90, 80] },
  { emoji: "🎓", title: "Newton School of Technology", place: "Bengaluru", date: "2025",
    text: "Started B.E. Computer Science (2025 – 2029). Current CGPA: 8.17 / 10.", at: geo(77.59, 12.97) },
  { emoji: "💻", title: "ICPC Asia Amritapuri Regional", place: "Amritapuri, Kerala", date: "Dec 2025",
    text: "Competed in the ICPC Asia Amritapuri regional contest.", at: geo(76.49, 9.09) },
  { emoji: "🏆", title: "Turing Cup 2k26", place: "Online · by Turing Hut", date: "Mar 2026",
    text: "Secured All India Rank 17 in this competitive programming contest.", at: geo(79.5, 4.5), island: true },
  { emoji: "🔍", title: "Pathglass", place: "Built at Newton", date: "Jul 2026",
    text: "Built a graph query engine from scratch, plus a visual app with a query-plan panel and step-by-step replay.", at: geo(84.5, 2.5), island: true },
  { emoji: "🛠️", title: "DevForge Lead", place: "Newton School of Technology", date: "Jul – Oct 2026",
    text: "Led the college developer club: coordinated club leads and organised technical events.", at: geo(89.5, 0.5), island: true },
  { emoji: "🤟", title: "Setu · Smart India Hackathon 2026", place: "Team project", date: "Sep 2026",
    text: "Sign language bridge: full-body + face sign recognition, offline MediaPipe, and a 2D signer.", at: geo(94.5, -1.5), island: true },
  { emoji: "🌏", title: "openSUSE.Asia Summit 2026", place: "Yogyakarta, Indonesia", date: "Oct 2026",
    text: "Attended at Universitas Gadjah Mada. Part of the openSUSE community since Oct 2026.", at: geo(110.36, -7.8) },
];
const JOURNEY_END = { emoji: "🚩", title: "To be continued…", place: "Next stop: ?", date: "2027 →",
  text: "Wherever the next project takes me. Want to be part of it? The mailbox in my room has my contacts.", at: geo(113.5, -2.5) };

class JourneyScene extends WorldScene {
  constructor() { super("JourneyScene"); }

  create() {
    const W = (118 - MAP_LON0) * MAP_SCALE + MAP_PAD * 2;
    const H = (MAP_LAT0 + 11) * MAP_SCALE + MAP_PAD * 2;
    const stops = JOURNEY.map(m => ({ ...m, x: m.at.x + (m.off ? m.off[0] : 0), y: m.at.y + (m.off ? m.off[1] : 0) }));
    const end = { ...JOURNEY_END, x: JOURNEY_END.at.x, y: JOURNEY_END.at.y, isEnd: true };
    const start = { x: stops[0].x + 100, y: stops[0].y - 30 };

    this.setupWorld(W, H, { x1: 40, y1: 40, x2: W - 40, y2: H - 40 }, takeSpawn("JourneyScene", start), 0.07);
    this.drawMap(W, H);
    this.drawPath([...stops, end]);
    this.makeFlagTextures();

    this.stops = [...stops, end].map((s, i) => {
      const flag = this.add.image(s.x, s.y, "flag_off").setOrigin(0.15, 1).setDepth(s.y);
      this.add.text(s.x, s.y + 14, s.isEnd ? "?" : String(i + 1), {
        fontSize: "18px", fill: "#ffe9b8", fontStyle: "bold", backgroundColor: "#5a3a22", padding: { x: 6, y: 2 }
      }).setOrigin(0.5).setDepth(s.y + 1);
      this.add.text(s.x + 22, s.y - 70, `${s.emoji} ${s.title}`, {
        fontSize: "16px", fill: "#3a2a12", backgroundColor: "rgba(251,231,196,0.9)", padding: { x: 5, y: 2 }
      }).setDepth(s.y + 1);
      return { ...s, flag, visited: false };
    });
    this.visited = 0;

    this.counter = this.hud(20, 16, "");
    this.updateCounter();
    this.hud(20, 62, "ESC: back to hallway").setFontSize(16);

    this.buildCard();
    this.time.delayedCall(450, () => this.toast("Follow the dotted path · step on a flag to open its postcard", 3800));
  }

  drawMap(W, H) {
    const g = this.add.graphics().setDepth(-20);
    g.fillStyle(0x86c5d8).fillRect(-1000, -1000, W + 2000, H + 2000);
    g.lineStyle(3, 0xffffff, 0.3);
    for (let y = 60; y < H; y += 90) for (let x = (y / 90 % 2) * 60; x < W; x += 160) {
      g.beginPath(); g.arc(x, y, 14, Math.PI * 1.1, Math.PI * 1.9); g.strokePath();
    }
    const poly = (pts, fill) => {
      const p = pts.map(([lon, lat]) => geo(lon, lat));
      g.fillStyle(fill).fillPoints(p, true);
      g.lineStyle(6, OUTLINE, 1).strokePoints(p, true);
    };
    const LAND = 0xe3cfa0, INDIA = 0xf7d9a0;
    // neighbouring land (drawn first, India goes on top)
    poly([[60,36],[118,36],[118,22],[108.5,16],[109.3,12],[106.5,9.5],[104.8,8.6],[105,10.5],[102.5,12],[100.8,13.5],
      [100,12],[99.3,10],[100.3,7],[102.2,6.2],[103.4,4],[104.2,1.4],[103.5,1.3],[101.3,2.8],[100.1,6.4],[98.3,8.3],
      [98.4,10.5],[97.8,14.5],[97.6,16.5],[94.4,16],[94.3,18.8],[92.3,20.7],[91.8,22.3],[90.5,22],[89,21.9],[75,22],
      [68.2,23.7],[66.5,25.4],[61.6,25.2],[60,25.3]], LAND);
    // India (simplified)
    poly([[68.2,23.7],[70,20.8],[72.8,19],[73.5,15.5],[74.8,12.9],[76.2,9.9],[77.5,8.1],[78.2,8.9],[79.8,10.3],[80.3,13.1],
      [80.1,15.9],[82.3,16.6],[84.9,19.3],[86.9,21],[88.2,21.7],[89,21.9],[89.2,24.5],[88.2,26.5],[89.8,26.7],[92,26.8],
      [95.2,27.9],[97.2,28.3],[96.1,27.2],[95,25.8],[94,23.9],[93.2,22.6],[92.3,23.5],[91.5,24.1],[90,25.3],[88,27.9],
      [84.1,28.6],[81,30.2],[79,31.3],[78.3,32.5],[79.5,34.5],[77.8,35.5],[74.5,34.7],[73.9,33],[74.6,32],[74.4,30.9],
      [73.4,29.9],[71,27.9],[70.3,26.8],[69.5,25]], INDIA);
    // Sri Lanka, Sumatra, Java, Borneo
    poly([[79.9,9.8],[80.9,9],[81.9,7.4],[81.4,6.1],[80.1,6.1],[79.8,7.9]], LAND);
    poly([[95.3,5.6],[97.5,5.2],[100.4,2.3],[103.8,-1],[106,-3.3],[105.9,-5.8],[104.5,-5.9],[102.3,-4],[100.3,-1],[98.6,1.7],[95.9,4]], LAND);
    poly([[105.2,-6.6],[106.8,-6.1],[108.5,-6.7],[110.4,-6.9],[112.7,-6.9],[114.4,-7.8],[114.6,-8.6],[112,-8.4],[110.4,-8.1],[108.2,-7.8],[106,-7.5],[105.3,-6.9]], INDIA);
    poly([[109,1.5],[109.6,-1],[110.5,-3],[114.5,-3.8],[116.5,-3],[117.5,0],[117.8,4],[116,6.9],[113,3.2],[111,1.6]], LAND);

    // the 2026 milestones happened online / on campus, so they sit on a chain of small islands
    for (const m of JOURNEY.filter(j => j.island)) {
      g.fillStyle(0xf7d9a0).fillEllipse(m.at.x + 10, m.at.y - 4, 150, 70);
      g.lineStyle(5, OUTLINE, 1).strokeEllipse(m.at.x + 10, m.at.y - 4, 150, 70);
    }
    const chain = JOURNEY.filter(j => j.island);
    const mid = chain[Math.floor(chain.length / 2) - 1].at;
    this.add.text(mid.x + 120, mid.y - 120, "~ 2026: the building year ~", {
      fontSize: "26px", fill: "#ffffff", fontStyle: "italic"
    }).setOrigin(0.5).setDepth(-15).setAlpha(0.9);

    const label = (t, lon, lat, size, color, style = "bold") => {
      const p = geo(lon, lat);
      this.add.text(p.x, p.y, t, { fontSize: size, fill: color, fontStyle: style }).setOrigin(0.5).setDepth(-15).setAlpha(0.85);
    };
    label("I N D I A", 79, 22.5, "56px", "#a0652e");
    label("Arabian Sea", 68, 14, "30px", "#ffffff", "italic");
    label("Bay of Bengal", 88, 14.5, "30px", "#ffffff", "italic");
    label("Indian Ocean", 82, -7, "34px", "#ffffff", "italic");
    label("INDONESIA", 109, -10, "34px", "#a0652e");
    label("Chandigarh", 75.2, 31.8, "18px", "#5a3a22");
    label("Bengaluru", 76.3, 13.6, "18px", "#5a3a22");
    label("Kerala", 75.3, 10.3, "18px", "#5a3a22");
    label("Yogyakarta", 110.4, -9.1, "18px", "#5a3a22");
  }

  drawPath(points) {
    const g = this.add.graphics().setDepth(-12);
    g.fillStyle(OUTLINE, 0.9);
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      const d = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
      for (let t = 0; t < d; t += 22) {
        const k = t / d;
        g.fillCircle(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, 5);
      }
    }
    // a little plane over the sea between the hackathon and Indonesia
    const a = points[7], b = points[8];
    const plane = this.add.text((a.x + b.x) / 2, (a.y + b.y) / 2, "✈️", { fontSize: "44px" }).setOrigin(0.5).setDepth(-11)
      .setRotation(Math.atan2(b.y - a.y, b.x - a.x));
    this.tweens.add({ targets: plane, y: "-=12", duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  makeFlagTextures() {
    if (this.textures.exists("flag_off")) return;
    const mk = (key, color) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x000000, 0.25).fillEllipse(9, 72, 24, 8);
      g.fillStyle(0x32201a).fillRect(5, 0, 7, 72);
      g.fillStyle(0x32201a).fillTriangle(9, 0, 54, 15, 9, 31);
      g.fillStyle(color).fillTriangle(12, 4, 46, 15, 12, 26);
      g.generateTexture(key, 56, 78);
      g.destroy();
    };
    mk("flag_off", 0xb8a98a);
    mk("flag_on", 0xff4d6d);
  }

  buildCard() {
    this.card = this.add.container(this.sw / 2, this.sh / 2).setScrollFactor(0).setDepth(9500).setVisible(false);
    const bg = this.add.rectangle(0, 0, 660, 330, 0xfbe7c4).setStrokeStyle(8, OUTLINE);
    const stamp = this.add.rectangle(270, -115, 70, 80, 0xffffff).setStrokeStyle(3, 0xff4d6d);
    this.cardEmoji = this.add.text(270, -115, "", { fontSize: "38px" }).setOrigin(0.5);
    this.cardTitle = this.add.text(-300, -130, "", { fontSize: "28px", fill: "#3a2a12", fontStyle: "bold", wordWrap: { width: 520 } });
    this.cardMeta = this.add.text(-300, -60, "", { fontSize: "18px", fill: "#9a6b2f" });
    this.cardText = this.add.text(-300, -20, "", { fontSize: "21px", fill: "#2b2b2b", wordWrap: { width: 600 }, lineSpacing: 6 });
    const hint = this.add.text(0, 140, "E or ESC to close", { fontSize: "16px", fill: "#9a8a6a" }).setOrigin(0.5);
    this.card.add([bg, stamp, this.cardEmoji, this.cardTitle, this.cardMeta, this.cardText, hint]);
  }

  openCard(s) {
    this.cardOpen = true;
    this.frozen = true;
    this.prompt.setVisible(false);
    this.cardEmoji.setText(s.emoji);
    this.cardTitle.setText(s.title);
    this.cardMeta.setText(`📍 ${s.place}   ·   🗓️ ${s.date}`);
    this.cardText.setText(s.text);
    this.card.setVisible(true).setScale(0.85).setAlpha(0);
    this.tweens.add({ targets: this.card, scale: 1, alpha: 1, duration: 350, ease: "Back.out" });
  }

  closeCard() {
    this.cardOpen = false;
    this.frozen = false;
    this.card.setVisible(false);
  }

  updateCounter() {
    this.counter.setText(`🚩 Milestones ${this.visited}/${JOURNEY.length}`);
  }

  update() {
    this.readKeys();
    if (this.cardOpen) {
      if (this.pressEsc || this.pressE) this.closeCard();
      return;
    }
    if (this.pressEsc) { this.goTo("HallwayScene", "HallwayScene", 1204, 520); return; }

    this.moveHero(420);
    this.prompt.setVisible(false);

    for (const s of this.stops) {
      if (!this.near(s, 60)) continue;
      if (!s.visited) {
        s.visited = true;
        s.flag.setTexture("flag_on");
        this.tweens.add({ targets: s.flag, scaleY: { from: 0.6, to: 1 }, duration: 400, ease: "Back.out" });
        if (!s.isEnd) {
          this.visited++;
          this.updateCounter();
          if (this.visited === JOURNEY.length) {
            this.time.delayedCall(400, () => this.toast("Journey complete! 🎉 One more flag out at sea…", 3500));
          }
        }
        this.sfx.notify.play();
        this.openCard(s);
        return;
      }
      this.showPrompt("Press E to read", { x: s.x + 10, y: s.y - 105 });
      if (this.pressE) this.openCard(s);
      break;
    }
  }
}
