/**
 * Screenshot every screen into /tmp/shots for visual review.
 *   node scripts/shots.mjs        (dev server must be running on :5177)
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://127.0.0.1:5177/";
const OUT = "/tmp/shots";
const seed = {
  profile: { country: "Vietnam", institution: "Can Tho University", field: "Finance",
             level: "Beginner", goal: "Move into a technical role", language: "Vietnamese" },
  weights: { relevance: 25, engagement: 25, density: 25, currency: 25 },
  onboarded: true, progress: {}, completed: [],
};

const b = await chromium.launch();
const errs = [];

async function page(w, h) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  p.on("pageerror", (e) => errs.push(`${w}px: ${e.message}`));
  await p.goto(BASE);
  await p.evaluate((s) => localStorage.setItem("ready-hub.v1", JSON.stringify(s)), seed);
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  return p;
}

// Onboarding (cleared storage)
const fresh = await b.newPage({ viewport: { width: 1440, height: 940 }, deviceScaleFactor: 2 });
await fresh.goto(BASE);
await fresh.evaluate(() => localStorage.clear());
await fresh.goto(BASE, { waitUntil: "networkidle" });
await fresh.waitForTimeout(1000);
await fresh.screenshot({ path: `${OUT}/onboarding.png` });

const p = await page(1440, 940);
await p.screenshot({ path: `${OUT}/catalogue.png` });

await p.locator("#w-engagement").fill("100");
await p.locator("#w-relevance").fill("0");
await p.waitForTimeout(900);
await p.screenshot({ path: `${OUT}/catalogue-reranked.png` });

const p2 = await page(1440, 940);
await p2.locator("article").first().getByRole("button", { name: /Why this score/ }).click();
await p2.waitForTimeout(1200);
await p2.screenshot({ path: `${OUT}/score-breakdown.png` });

await p2.getByRole("button", { name: /Start this course/ }).click();
await p2.waitForTimeout(2200);
await p2.screenshot({ path: `${OUT}/player.png` });

await p2.getByRole("button", { name: /Mark all lectures complete/ }).click();
await p2.waitForTimeout(400);
await p2.getByRole("button", { name: /Claim your certificate/ }).click();
await p2.waitForTimeout(1200);
await p2.screenshot({ path: `${OUT}/completion.png`, fullPage: true });

const m = await page(390, 844);
await m.screenshot({ path: `${OUT}/mobile.png` });

console.log(errs.length ? "PAGE ERRORS:\n" + errs.join("\n") : `✓ screenshots written to ${OUT}`);
await b.close();
