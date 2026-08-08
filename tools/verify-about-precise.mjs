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

await page.goto("http://localhost:5173/?v=" + Date.now(), { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForFunction(() => typeof window.__scene !== "undefined", null, { timeout: 20000 });
await page.waitForTimeout(20000);

await page.evaluate(() => {
    const p = document.querySelector(".preloader");
    if (p) p.style.setProperty("display","none","important");
    document.body.style.overflow = "auto";
});

// Mark entered then teleport to about — the teleport path uses proper door click animation
await page.evaluate(() => window.__scene.markEntered());
await page.waitForTimeout(2500);
await page.evaluate(() => window.__scene.teleportTo("about"));
// Wait for: paper close (2.5s) + door fly-in (1.5s) + paper open (1.5s) + content render
await page.waitForTimeout(12000);
// Force-hide any remaining preloader/paper
await page.evaluate(() => {
    document.querySelectorAll(".preloader, .paper-transition, [class*=paper]").forEach((el) => {
        el.style.setProperty("display","none","important");
    });
});
await page.waitForTimeout(2000);
await page.screenshot({ path: ".tmp/Y1-about-after-teleport.png" });
console.log("step1: after teleport to about");

// Scroll within room to see different milestones
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(150); }
await page.waitForTimeout(3000);
await page.screenshot({ path: ".tmp/Y2-about-milestone2.png" });
console.log("step2: at milestone 2");

// Continue scrolling
for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(150); }
await page.waitForTimeout(3000);
await page.screenshot({ path: ".tmp/Y3-about-deeper.png" });
console.log("step3: deeper in room");

await browser.close();
console.log("\nERRORS:", errs.length);
errs.forEach((e) => console.log("  -", e.substring(0, 200)));
