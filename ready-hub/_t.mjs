import { chromium } from "playwright";
const B = "http://127.0.0.1:5177/";
const b = await chromium.launch();
const errs = [];
const p = await b.newPage({ viewport: { width: 1440, height: 940 }, deviceScaleFactor: 2 });
p.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
p.on("console", m => m.type() === "error" && errs.push("console: " + m.text()));

await p.goto(B); await p.evaluate(() => localStorage.clear());
await p.goto(B, { waitUntil: "networkidle" }); await p.waitForTimeout(1000);
await p.getByRole("button", { name: /Get started/ }).first().click(); await p.waitForTimeout(600);
await p.getByRole("button", { name: "Vietnam", exact: true }).click(); await p.waitForTimeout(500);
await p.locator("text=VinUniversity").click(); await p.waitForTimeout(250);

// multi-select languages
// exact match: "Lao" is the language, "Laos" is the country
await p.getByRole("button", { name: "Lao", exact: true }).click();
await p.getByRole("button", { name: "Khmer", exact: true }).click();
await p.waitForTimeout(300);
const picked = await p.locator('button[aria-pressed="true"]').count();
console.log("1. languages selected:", picked);
await p.screenshot({ path: "/tmp/w1-langs.png" });

await p.getByRole("button", { name: /Continue/ }).click(); await p.waitForTimeout(600);
const fields = await p.locator('h2, label').filter({ hasText: /Field of study/ }).count();
console.log("2. 'Field of study' label present:", fields > 0);
await p.getByRole("button", { name: "Arts & Humanities", exact: true }).click();
await p.locator('input[aria-label="Your major"]').fill("Applied Linguistics");
await p.getByRole("button", { name: /Start something of my own/ }).click();
await p.screenshot({ path: "/tmp/w2-field.png", fullPage: true });
await p.getByRole("button", { name: /See my courses/ }).click(); await p.waitForTimeout(1100);
console.log("3. dashboard top:", (await p.locator("article h3").allInnerTexts())[0]);

await p.locator("article").first().getByRole("button", { name: /Open / }).click(); await p.waitForTimeout(1700);
await p.getByRole("button", { name: /Mark all lectures complete/ }).click(); await p.waitForTimeout(300);
await p.getByRole("button", { name: /Claim your certificate/ }).click(); await p.waitForTimeout(800);
const cta = await p.getByRole("button", { name: /Start the project|Take the assessment/ }).innerText();
console.log("4. assessment type for Arts student:", cta.trim());
console.log(errs.length ? "ERRORS:\n" + errs.join("\n") : "no errors");
await b.close();
