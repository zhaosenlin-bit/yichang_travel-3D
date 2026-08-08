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

await page.goto("http://localhost:5173/about?v=" + Date.now(), { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForFunction(() => typeof window.__scene !== "undefined", null, { timeout: 20000 });
await page.waitForTimeout(20000);

await page.evaluate(() => {
    const p = document.querySelector(".preloader");
    if (p) p.style.setProperty("display","none","important");
    document.body.style.overflow = "auto";
    if (window.__scene && !window.__scene.hasEntered) window.__scene.markEntered();
});
await page.waitForTimeout(2000);

// Scroll into the about room (corridor wheel scrolls toward the rooms)
for (let i = 0; i < 14; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(80); }
await page.waitForTimeout(3000);
await page.screenshot({ path: ".tmp/E1-about-entry.png" });
console.log("step1: entered corridor, approaching about door");

// Continue scroll to enter the about room
for (let i = 0; i < 15; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(120); }
await page.waitForTimeout(5000);
await page.screenshot({ path: ".tmp/E2-about-room.png" });
console.log("step2: in about room");

// Scroll within room to see different milestones
for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(200); }
await page.waitForTimeout(3000);
await page.screenshot({ path: ".tmp/E3-about-milestone2.png" });
console.log("step3: at milestone 2");

for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(200); }
await page.waitForTimeout(3000);
await page.screenshot({ path: ".tmp/E4-about-deeper.png" });
console.log("step4: deeper in room");

await browser.close();
console.log("\nERRORS:", errs.length);
errs.forEach((e) => console.log("  -", e.substring(0, 200)));
