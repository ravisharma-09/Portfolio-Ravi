// logic.js: the game rules as plain functions, so they can be tested without Phaser.
// Loaded in the browser before arcade.js and main.js; `node --test` requires it in tests/.

const GameLogic = {
  // Spam guard: true when `limit` E presses land inside `windowMs`.
  // `presses` is the list of recent press times; it is trimmed in place.
  isSpamming(presses, now, limit = 5, windowMs = 2000) {
    presses.push(now);
    while (presses.length && now - presses[0] > windowMs) presses.shift();
    if (presses.length < limit) return false;
    presses.length = 0;
    return true;
  },

  // Coin Rush: a pickup within `comboMs` of the last one extends the streak.
  nextStreak(streak, lastPickup, now, comboMs = 1500) {
    return now - lastPickup < comboMs ? streak + 1 : 1;
  },

  // ×1, then ×2 after 3 quick pickups, capped at ×3.
  multiplier(streak) {
    return Math.min(3, 1 + Math.floor(streak / 3));
  },

  // Adds a score to the board and keeps the best `size`, highest first.
  topScores(scores, score, size = 5) {
    return [...scores, score].sort((a, b) => b - a).slice(0, size);
  },
};

if (typeof module !== "undefined") module.exports = GameLogic;
