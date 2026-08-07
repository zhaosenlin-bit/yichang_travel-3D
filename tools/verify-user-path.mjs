import { chromium } from "playwright";
// Real user path: open entrance, click door, scroll corridor, click each chinese door
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
page.on("pageerror", (e) => errs.push("[" + Date.now() + " pageerror] " + e.message + "\n" + (e.stack || "").split("\n").slice(0, 3).join(" | ")));
page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (t.includes("PostHog") || t.includes("Slow network") || t.includes("CabinSketch") || t.includes("zcoolxiaowei") || t.includes("500")) return;
    errs.push("[" + Date.now() + " err] " + t.substring(0, 250));
});

await page.goto("http://localhost:5173/?v=" + Date.now(), { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForFunction(() => typeof window.__scene !== "undefined", null, { timeout: 20000 });
await page.waitForTimeout(15000);

// Step 1: hide preloader (real users see it for 1-2s)
await page.evaluate(() => {
    const p = document.querySelector(".preloader");
    if (p) p.style.setProperty("display","none","important");
    document.body.style.overflow = "auto";
});
await page.waitForTimeout(1000);
await page.screenshot({ path: ".tmp/user-01-entrance.png" });
console.log("01-entrance captured");

// Step 2: enter the scene (real user clicks the door)
await page.evaluate(() => window.__scene.markEntered());
await page.waitForTimeout(3000);
await page.screenshot({ path: ".tmp/user-02-corridor-entry.png" });
console.log("02-corridor-entry captured");

// Step 3: scroll into corridor
for (let i = 0; i < 25; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(80); }
await page.waitForTimeout(2000);
await page.screenshot({ path: ".tmp/user-03-corridor-doors.png" });
console.log("03-corridor-doors captured");

// Step 4: scroll more, see all 5 doors
for (let i = 0; i < 25; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(80); }
await page.waitForTimeout(2000);
await page.screenshot({ path: ".tmp/user-04-corridor-end.png" });
console.log("04-corridor-end captured");

// Step 5: try to find a clickable door and click (real user path)
const door = await page.$("canvas");
console.log("canvas element:", door ? "present" : "missing");

await browser.close();
console.log("\n=== ERRORS ===");
if (errs.length === 0) console.log("ZERO ERRORS — user path is clean");
else { errs.forEach((e) => console.log("---", e)); }
