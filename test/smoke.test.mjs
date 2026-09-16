import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const OrbitTime = require(join(root, "orbit-time.js"));

function localDate(hours, minutes, seconds, milliseconds = 0) {
  return new Date(2026, 8, 16, hours, minutes, seconds, milliseconds);
}

test("anglesFromDate maps 12:00:00 to the top of every orbit", () => {
  const map = OrbitTime.anglesFromDate(localDate(12, 0, 0, 0));
  assert.equal(map.hoursDeg, 0);
  assert.equal(map.minutesDeg, 0);
  assert.equal(map.secondsDeg, 0);
  assert.equal(map.digital, "12:00:00");
});

test("anglesFromDate maps cardinal hours on a 12-hour analog circle", () => {
  assert.equal(OrbitTime.anglesFromDate(localDate(3, 0, 0, 0)).hoursDeg, 90);
  assert.equal(OrbitTime.anglesFromDate(localDate(6, 0, 0, 0)).hoursDeg, 180);
  assert.equal(OrbitTime.anglesFromDate(localDate(9, 0, 0, 0)).hoursDeg, 270);
  assert.equal(OrbitTime.anglesFromDate(localDate(0, 0, 0, 0)).hoursDeg, 0);
});

test("anglesFromDate maps minutes and seconds onto 60-tick orbits", () => {
  const quarter = OrbitTime.anglesFromDate(localDate(0, 15, 30, 0));
  assert.equal(quarter.minutesDeg, 15.5 * 6);
  assert.equal(quarter.secondsDeg, 180);
  assert.equal(OrbitTime.anglesFromDate(localDate(0, 0, 15, 0)).secondsDeg, 90);
});

test("hour hand includes minute and second contribution", () => {
  const map = OrbitTime.anglesFromDate(localDate(4, 30, 0, 0));
  assert.equal(map.hoursDeg, 135);
});

test("invalid dates are rejected", () => {
  assert.throws(() => OrbitTime.anglesFromDate(new Date("not-a-date")), TypeError);
  assert.throws(() => OrbitTime.anglesFromDate("12:00"), TypeError);
});

test("index.html is a self-contained orbital clock without CDN assets", () => {
  const html = readFileSync(join(root, "index.html"), "utf8");

  assert.match(html, /data-orbit="hours"/);
  assert.match(html, /data-orbit="minutes"/);
  assert.match(html, /data-orbit="seconds"/);
  assert.match(html, /class="sun"/);
  assert.match(html, /class="planet planet-hours"/);
  assert.match(html, /class="planet planet-minutes"/);
  assert.match(html, /class="planet planet-seconds"/);
  assert.match(html, /<script src="orbit-time\.js"><\/script>/);
  assert.doesNotMatch(html, /https?:\/\/cdn\./i);
  assert.doesNotMatch(html, /googleapis|cloudflare|unpkg|jsdelivr|fontawesome/i);
});

test("license and readme are portfolio-ready", () => {
  const license = readFileSync(join(root, "LICENSE"), "utf8");
  const readme = readFileSync(join(root, "README.md"), "utf8");
  assert.match(license, /MIT License/);
  assert.match(license, /78tacos/);
  assert.match(readme, /index\.html/);
  assert.match(readme, /GitHub Pages/i);
  assert.match(readme, /MIT/);
});
