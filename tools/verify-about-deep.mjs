import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
page.on("pageerror", (e) => errs.push("[pageerror] " + e.message));
page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (t.includes("isReady")) return;
    if (t.includes("PostHog") || t.includes("Slow network") || t.includes("CabinSketch") || t.includes("zcoolxiaowei") || t.includes("500")) return;
    errs.push("[err] " + t.substring(0, 200));
});

// Land on home, mark entered, scroll a LOT to pass all 5 doors
await page.goto("http://localhost:5173/?v=" + Date.now(), { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForFunction(() => typeof window.__scene !== "undefined", null, { timeout: 20000 });
await page.waitForTimeout(18000);

await page.evaluate(() => {
    const p = document.querySelector(".preloader");
    if (p) p.style.setProperty("display","none","important");
    document.body.style.overflow = "auto";
});
await page.evaluate(() => window.__scene.markEntered());
await page.waitForTimeout(2500);

// Scroll deep into the corridor (about is the 3rd door, at z=-48, segment starts at z=10)
for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(50); }
await page.waitForTimeout(2000);
await page.screenshot({ path: ".tmp/A1-corridor-mid.png" });
console.log("step1: corridor middle");

// Continue scrolling to reach about door area
for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(60); }
await page.waitForTimeout(2000);
await page.screenshot({ path: ".tmp/A2-corridor-about.png" });
console.log("step2: near about door");

// Now click on the left wall where the about door should be (3rd door, left)
const canvas = await page.locator("canvas").first();
const box = await canvas.boundingBox();
if (box) {
    await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.45);
    console.log("clicked left-middle of canvas");
}
await page.waitForTimeout(8000);
await page.screenshot({ path: ".tmp/A3-after-click.png" });
console.log("step3: after click");

await browser.close();
console.log("\nERRORS:", errs.length);
errs.forEach((e) => console.log("  -", e.substring(0, 200)));
