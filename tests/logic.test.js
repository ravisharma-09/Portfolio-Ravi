// Run with: node --test
const test = require("node:test");
const assert = require("node:assert/strict");
const { isSpamming, nextStreak, multiplier, topScores } = require("../logic.js");

test("five slow, normal interactions are never treated as spam", () => {
  const presses = [];
  for (let i = 0; i < 10; i++) assert.equal(isSpamming(presses, i * 3000), false);
});

test("five E presses inside two seconds trigger the spam guard, then it resets", () => {
  const presses = [];
  for (let t of [0, 200, 400, 600]) assert.equal(isSpamming(presses, t), false);
  assert.equal(isSpamming(presses, 800), true);
  assert.equal(isSpamming(presses, 1000), false);
});

test("old presses drop out of the window", () => {
  const presses = [];
  [0, 100, 200, 300].forEach(t => isSpamming(presses, t));
  assert.equal(isSpamming(presses, 2500), false);
  assert.deepEqual(presses, [2500]);
});

test("quick pickups extend the streak, slow ones restart it", () => {
  assert.equal(nextStreak(2, 1000, 2000), 3);
  assert.equal(nextStreak(2, 1000, 2500), 1);
});

test("combo multiplier goes x1, x2 after 3, x3 after 6, and caps at x3", () => {
  assert.deepEqual([0, 1, 2, 3, 5, 6, 20].map(multiplier), [1, 1, 1, 2, 2, 3, 3]);
});

test("score board keeps the best five, highest first, without changing the input", () => {
  const old = [50, 40, 30, 20, 10];
  assert.deepEqual(topScores(old, 35), [50, 40, 35, 30, 20]);
  assert.deepEqual(topScores(old, 5), old);
  assert.deepEqual(old, [50, 40, 30, 20, 10]);
  assert.deepEqual(topScores([], 7), [7]);
});
