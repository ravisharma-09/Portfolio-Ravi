// arcade.js: "COIN RUSH", the game inside the hallway's arcade machine.
// Collect real coins for 30 seconds; fake coins look almost the same but have a tell
// (greener colour + glitchy wobble) that gets subtler on harder levels. 3 lives, combos.
// Scene key stays "MiniGameScene" so the hallway, touch controls and leaderboard keep working.
// Loaded after world.js (uses setSpawn / OUTLINE) and before main.js (which lists the scene).

const COIN_RUSH = {
  ROUND_SECONDS: 30,
  LIVES: 3,
  LEVELS: [
    { name: "Easy", emoji: "🫢", real: 6, fake: 2, fakeColor: 0xa9d64a, glitchEvery: 900, glitchMs: 700 },
    { name: "Medium", emoji: "😎", real: 5, fake: 4, fakeColor: 0xd2d04a, glitchEvery: 1800, glitchMs: 450 },
    { name: "Hard", emoji: "🫡", real: 4, fake: 6, fakeColor: 0xf0c83a, glitchEvery: 2600, glitchMs: 260 },
  ],
  REAL_COLOR: 0xffc933,
};

class MiniGameScene extends Phaser.Scene {
  constructor() { super("MiniGameScene"); }

  preload() {
    if (!this.textures.exists("player")) this.load.image("player", "assets/player.png");
    if (!this.cache.audio.exists("coin")) this.load.audio("coin", ["assets/sounds/coin.ogg", "assets/sounds/coin.mp3"]);
    if (!this.cache.audio.exists("gameover")) this.load.audio("gameover", ["assets/sounds/gameover.ogg", "assets/sounds/gameover.mp3"]);
    if (!this.cache.audio.exists("click")) this.load.audio("click", ["assets/sounds/click.ogg", "assets/sounds/click.mp3"]);
  }

  create() {
    this.W = this.scale.width;
    this.H = this.scale.height;
    this.arena = { x1: 70, y1: 120, x2: this.W - 70, y2: this.H - 50 };
    this.difficultySelected = false; // touch.js reads these two
    this.gameOver = false;
    this.cameras.main.fadeIn(300, 0, 0, 0);

    this.sfx = {
      coin: this.sound.add("coin", { volume: 0.35 }),
      over: this.sound.add("gameover", { volume: 0.4 }),
      click: this.sound.add("click", { volume: 0.35 }),
    };

    this.keys = this.input.keyboard.addKeys("W,A,S,D,ONE,TWO,THREE,R,ESC");
    this.cursors = this.input.keyboard.createCursorKeys();

    this.makeTextures();
    this.drawCabinetScreen();
    this.buildStartCard();
  }

  // ---------- art ----------
  makeTextures() {
    const coin = (key, fill) => {
      if (this.textures.exists(key)) this.textures.remove(key);
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x000000, 0.25).fillEllipse(20, 38, 26, 7);              // shadow
      g.fillStyle(0x5a3a22).fillCircle(20, 19, 18);                         // outline
      g.fillStyle(fill).fillCircle(20, 19, 15);
      g.fillStyle(0xffffff, 0.18).fillCircle(20, 19, 11);                   // inner rim
      g.fillStyle(fill).fillCircle(20, 19, 9);
      g.fillStyle(0xffffff, 0.85).fillEllipse(14, 12, 6, 4);                // shine
      g.fillStyle(0x5a3a22, 0.55).fillRect(18, 13, 4, 12);                  // mark
      g.generateTexture(key, 40, 42);
      g.destroy();
    };
    coin("coin_real", COIN_RUSH.REAL_COLOR);
    COIN_RUSH.LEVELS.forEach((lv, i) => coin("coin_fake_" + i, lv.fakeColor));
  }

  drawCabinetScreen() {
    const { W, H } = this;
    const g = this.add.graphics().setDepth(-10);
    g.fillStyle(0x3b1f5c).fillRoundedRect(8, 8, W - 16, H - 16, 26);       // purple cabinet
    g.lineStyle(8, 0x5a3a22).strokeRoundedRect(8, 8, W - 16, H - 16, 26);
    g.fillStyle(0x140f24).fillRoundedRect(40, 100, W - 80, H - 130, 18);   // screen
    g.lineStyle(6, 0x5a3a22).strokeRoundedRect(40, 100, W - 80, H - 130, 18);
    g.fillStyle(0x31e981, 0.07);
    for (let x = 60; x < W - 50; x += 40) for (let y = 120; y < H - 40; y += 40) g.fillRect(x, y, 3, 3);
    g.fillStyle(0x000000, 0.18);
    for (let y = 102; y < H - 32; y += 6) g.fillRect(42, y, W - 84, 2);      // scanlines

    this.add.text(W / 2, 52, "🪙 COIN RUSH", {
      fontSize: "38px", fill: "#ffd23f", fontStyle: "bold", stroke: "#5a3a22", strokeThickness: 8
    }).setOrigin(0.5);
    // phones have an on-screen ESC button (and the fullscreen button sits in this corner)
    if (!document.body.classList.contains("touch")) {
      this.add.text(W - 40, 52, "ESC: hallway", { fontSize: "16px", fill: "#c9b6e8" }).setOrigin(1, 0.5);
    }
  }

  // ---------- start card ----------
  buildStartCard() {
    const { W, H } = this;
    const c = this.add.container(W / 2, H / 2 + 30).setDepth(50);
    const bg = this.add.rectangle(0, 0, 760, 470, 0xfbe7c4).setStrokeStyle(8, 0x5a3a22);
    const rule = this.add.text(0, -190, "Collect REAL coins for 30 seconds.\nAvoid FAKES: each one costs a ❤️ (you have 3).", {
      fontSize: "22px", fill: "#3a2a12", align: "center", fontStyle: "bold", lineSpacing: 6
    }).setOrigin(0.5);

    const real = this.add.image(-170, -85, "coin_real").setScale(2);
    const realL = this.add.text(-170, -30, "REAL\ngolden & steady", { fontSize: "18px", fill: "#3a2a12", align: "center" }).setOrigin(0.5, 0);
    const fake = this.add.image(170, -85, "coin_fake_0").setScale(2);
    this.tweens.add({ targets: fake, angle: { from: -14, to: 14 }, duration: 120, yoyo: true, repeat: -1 });
    const fakeL = this.add.text(170, -30, "FAKE\ngreener & glitchy", { fontSize: "18px", fill: "#9b2c2c", align: "center" }).setOrigin(0.5, 0);
    const vs = this.add.text(0, -85, "vs", { fontSize: "26px", fill: "#9a6b2f", fontStyle: "italic" }).setOrigin(0.5);
    const combo = this.add.text(0, 40, "Grab coins quickly in a row for ×2 and ×3 combos!", { fontSize: "17px", fill: "#5a3a22" }).setOrigin(0.5);
    c.add([bg, rule, real, realL, fake, fakeL, vs, combo]);

    COIN_RUSH.LEVELS.forEach((lv, i) => {
      const x = (i - 1) * 230, y = 140;
      const btn = this.add.rectangle(x, y, 200, 86, 0x5a3a22).setStrokeStyle(4, 0x32201a)
        .setInteractive({ useHandCursor: true });
      const label = this.add.text(x, y - 12, `${lv.emoji} ${lv.name}`, { fontSize: "24px", fill: "#ffe9b8", fontStyle: "bold" }).setOrigin(0.5);
      const key = this.add.text(x, y + 22, `press ${i + 1}`, { fontSize: "15px", fill: "#e8c99a" }).setOrigin(0.5);
      btn.on("pointerover", () => btn.setFillStyle(0x7a4a24));
      btn.on("pointerout", () => btn.setFillStyle(0x5a3a22));
      btn.on("pointerdown", () => this.startRound(i));
      c.add([btn, label, key]);
    });
    const tip = this.add.text(0, 205, "Hard: fakes look almost golden and only glitch for a moment.", { fontSize: "15px", fill: "#9a6b2f" }).setOrigin(0.5);
    c.add(tip);
    this.startCard = c;
  }

  // ---------- round ----------
  startRound(levelIndex) {
    if (this.difficultySelected) return;
    this.sfx.click.play();
    this.level = COIN_RUSH.LEVELS[levelIndex];
    this.levelIndex = levelIndex;
    this.difficultySelected = true;
    this.startCard.destroy();

    this.score = 0;
    this.lives = COIN_RUSH.LIVES;
    this.streak = 0;
    this.lastPickup = 0;
    this.timeLeft = COIN_RUSH.ROUND_SECONDS * 1000;
    this.invulnerableUntil = 0;

    this.player = this.add.sprite(this.W / 2, (this.arena.y1 + this.arena.y2) / 2, "player").setScale(0.075).setDepth(20);

    this.coins = [];
    for (let i = 0; i < this.level.real; i++) this.coins.push(this.spawnCoin(false));
    for (let i = 0; i < this.level.fake; i++) this.coins.push(this.spawnCoin(true));

    // fakes give themselves away with a short glitch every so often
    this.glitchTimer = this.time.addEvent({
      delay: this.level.glitchEvery, loop: true, callback: () => {
        const fakes = this.coins.filter(c => c.fake);
        const n = Math.max(1, Math.ceil(fakes.length / 2));
        Phaser.Utils.Array.Shuffle(fakes).slice(0, n).forEach(f => this.glitch(f));
      }
    });

    this.buildHud();
  }

  spawnCoin(fake, coin) {
    const a = this.arena;
    let x, y, tries = 0;
    do {
      x = Phaser.Math.Between(a.x1 + 20, a.x2 - 20);
      y = Phaser.Math.Between(a.y1 + 20, a.y2 - 20);
      tries++;
    } while (tries < 60 && (
      (this.player && Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 160) ||
      (this.coins || []).some(c => c !== coin && Phaser.Math.Distance.Between(x, y, c.x, c.y) < 70)
    ));
    if (!coin) {
      coin = this.add.image(x, y, fake ? "coin_fake_" + this.levelIndex : "coin_real").setDepth(10);
      coin.fake = fake;
      coin.bob = this.tweens.add({ targets: coin, y: y - 8, duration: 800, yoyo: true, repeat: -1, ease: "Sine.easeInOut", delay: Phaser.Math.Between(0, 600) });
    } else {
      coin.bob.stop();
      coin.setPosition(x, y).setAngle(0).setScale(1).setAlpha(1);
      coin.bob = this.tweens.add({ targets: coin, y: y - 8, duration: 800, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    }
    coin.setScale(0);
    this.tweens.add({ targets: coin, scale: 1, duration: 250, ease: "Back.out" });
    return coin;
  }

  glitch(coin) {
    if (!coin.active) return;
    this.tweens.add({
      targets: coin, angle: { from: -18, to: 18 }, duration: 60, yoyo: true,
      repeat: Math.max(1, Math.round(this.level.glitchMs / 120)), onComplete: () => coin.setAngle(0)
    });
    coin.setTint(0x9dff7a);
    this.time.delayedCall(this.level.glitchMs, () => coin.active && coin.clearTint());
  }

  buildHud() {
    const { W } = this;
    const style = { fontSize: "24px", fill: "#ffe9b8", fontStyle: "bold", stroke: "#140f24", strokeThickness: 5 };
    this.scoreText = this.add.text(60, 110, "", style).setDepth(40);
    this.livesText = this.add.text(W - 60, 110, "", style).setOrigin(1, 0).setDepth(40);
    this.comboText = this.add.text(W / 2, 110, "", { ...style, fill: "#31e981" }).setOrigin(0.5, 0).setDepth(40);
    this.timeBarBg = this.add.rectangle(W / 2, 88, W - 300, 12, 0x2a1d40).setStrokeStyle(2, 0x5a3a22).setDepth(40);
    this.timeBar = this.add.rectangle(150, 88, W - 300, 12, 0x31e981).setOrigin(0, 0.5).setDepth(41);
    this.timeText = this.add.text(W - 140, 88, "", { fontSize: "16px", fill: "#ffe9b8" }).setOrigin(0, 0.5).setDepth(41);
    this.refreshHud();
  }

  refreshHud() {
    this.scoreText.setText(`Score ${this.score}`);
    this.livesText.setText("❤️".repeat(this.lives) + "🖤".repeat(COIN_RUSH.LIVES - this.lives));
    const mult = this.multiplier();
    this.comboText.setText(mult > 1 ? `COMBO ×${mult}` : "");
    const frac = Math.max(0, this.timeLeft / (COIN_RUSH.ROUND_SECONDS * 1000));
    this.timeBar.width = (this.W - 300) * frac;
    this.timeBar.fillColor = frac > 0.33 ? 0x31e981 : 0xff4d6d;
    this.timeText.setText(`${Math.ceil(this.timeLeft / 1000)}s`);
  }

  multiplier() { return Math.min(3, 1 + Math.floor(this.streak / 3)); }

  floatText(x, y, text, color) {
    const t = this.add.text(x, y, text, {
      fontSize: "26px", fill: color, fontStyle: "bold", stroke: "#140f24", strokeThickness: 5
    }).setOrigin(0.5).setDepth(45);
    this.tweens.add({ targets: t, y: y - 60, alpha: 0, duration: 650, onComplete: () => t.destroy() });
  }

  collect(coin) {
    const now = this.time.now;
    this.streak = now - this.lastPickup < 1500 ? this.streak + 1 : 1;
    this.lastPickup = now;
    const gain = this.multiplier();
    this.score += gain;
    this.sfx.coin.play({ rate: 1 + Math.min(0.5, this.streak * 0.05) });
    this.floatText(coin.x, coin.y, gain > 1 ? `+${gain} ×${gain}` : "+1", "#ffd23f");
    this.spawnCoin(false, coin);
  }

  hitFake(coin) {
    if (this.time.now < this.invulnerableUntil) return;
    this.lives--;
    this.streak = 0;
    this.invulnerableUntil = this.time.now + 1000;
    this.sfx.click.play({ rate: 0.5 });
    this.cameras.main.shake(250, 0.012);
    this.cameras.main.flash(150, 255, 60, 60);
    this.floatText(coin.x, coin.y, "-1 ❤️ FAKE!", "#ff4d6d");
    this.tweens.add({ targets: this.player, alpha: 0.3, duration: 100, yoyo: true, repeat: 4, onComplete: () => this.player.setAlpha(1) });
    this.spawnCoin(true, coin);
    if (this.lives <= 0) this.endRound("OUT OF LIVES");
  }

  endRound(reason) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.glitchTimer.remove();
    this.player.setVisible(false);
    this.coins.forEach(c => c.setVisible(false));
    this.sfx.over.play();

    let scores = [];
    try { scores = JSON.parse(localStorage.getItem("miniScores") || "[]"); } catch (e) {}
    scores.push(this.score);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 5);
    try { localStorage.setItem("miniScores", JSON.stringify(scores)); } catch (e) {}
    const newBest = scores[0] === this.score && this.score > 0;

    const { W, H } = this;
    const c = this.add.container(W / 2, H / 2 + 30).setDepth(60);
    const bg = this.add.rectangle(0, 0, 620, 430, 0xfbe7c4).setStrokeStyle(8, 0x5a3a22);
    const title = this.add.text(0, -170, reason === "TIME" ? "⏰ TIME'S UP!" : "💔 OUT OF LIVES", {
      fontSize: "36px", fill: "#5a3a22", fontStyle: "bold"
    }).setOrigin(0.5);
    const score = this.add.text(0, -110, newBest ? `🎉 New best: ${this.score}!` : `Score: ${this.score}`, {
      fontSize: "28px", fill: newBest ? "#1f8a4c" : "#3a2a12", fontStyle: "bold"
    }).setOrigin(0.5);
    const lvl = this.add.text(0, -75, `${this.level.emoji} ${this.level.name}`, { fontSize: "18px", fill: "#9a6b2f" }).setOrigin(0.5);
    const board = this.add.text(0, 10, "🏆 Best scores\n" + scores.map((s, i) => `${i + 1}.  ${s}`).join("\n"), {
      fontSize: "20px", fill: "#3a2a12", align: "center", lineSpacing: 4
    }).setOrigin(0.5);
    c.add([bg, title, score, lvl, board]);

    const button = (x, text, onTap) => {
      const b = this.add.rectangle(x, 160, 230, 60, 0x5a3a22).setStrokeStyle(4, 0x32201a).setInteractive({ useHandCursor: true });
      const t = this.add.text(x, 160, text, { fontSize: "20px", fill: "#ffe9b8", fontStyle: "bold" }).setOrigin(0.5);
      b.on("pointerover", () => b.setFillStyle(0x7a4a24));
      b.on("pointerout", () => b.setFillStyle(0x5a3a22));
      b.on("pointerdown", onTap);
      c.add([b, t]);
    };
    button(-130, "🔁 Play again (R)", () => this.scene.restart());
    button(130, "🚪 Hallway (ESC)", () => this.leave());
  }

  leave() {
    if (this.leaving) return;
    this.leaving = true;
    if (typeof setSpawn === "function") setSpawn("HallwayScene", 1592, 560);
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("HallwayScene"));
  }

  update(time, delta) {
    const k = this.keys, J = Phaser.Input.Keyboard.JustDown;
    if (J(k.ESC)) { this.leave(); return; }

    if (!this.difficultySelected) {
      if (J(k.ONE)) this.startRound(0);
      else if (J(k.TWO)) this.startRound(1);
      else if (J(k.THREE)) this.startRound(2);
      return;
    }
    if (this.gameOver) {
      if (J(k.R)) this.scene.restart();
      return;
    }

    const dt = delta / 1000, speed = 360, c = this.cursors, p = this.player;
    if (c.left.isDown || k.A.isDown) { p.x -= speed * dt; p.setFlipX(true); }
    if (c.right.isDown || k.D.isDown) { p.x += speed * dt; p.setFlipX(false); }
    if (c.up.isDown || k.W.isDown) p.y -= speed * dt;
    if (c.down.isDown || k.S.isDown) p.y += speed * dt;
    p.x = Phaser.Math.Clamp(p.x, this.arena.x1, this.arena.x2);
    p.y = Phaser.Math.Clamp(p.y, this.arena.y1, this.arena.y2);

    for (const coin of this.coins) {
      if (coin.scale < 0.8) continue; // still popping in
      if (Phaser.Math.Distance.Between(p.x, p.y, coin.x, coin.y) < 34) {
        if (coin.fake) this.hitFake(coin); else this.collect(coin);
        if (this.gameOver) return;
      }
    }

    if (this.multiplier() > 1 && time - this.lastPickup > 1500) this.streak = 0;
    this.timeLeft -= delta;
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.refreshHud(); this.endRound("TIME"); return; }
    this.refreshHud();
  }
}
