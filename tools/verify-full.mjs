import { chromium } from "playwright";

const URL = "http://localhost:5173/";
const browser = await chromium.launch();
const results = [];

async function check(label, fn) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errs = [];
    page.on("pageerror", (e) => errs.push("[pageerror] " + e.message));
    page.on("console", (m) => {
        if (m.type() === "error") {
            const t = m.text();
            // Filter out portfolio-itom pre-existing noise
            if (t.includes("PostHog")) return;
            if (t.includes("Slow network")) return;
            if (t.includes("CabinSketch") || t.includes("zcoolxiaowei")) return;
            errs.push("[err] " + t.substring(0, 300));
        }
    });
    await page.goto(URL + "?v=" + Date.now(), { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForFunction(() => typeof window.__scene !== "undefined", null, { timeout: 20000 });
    await page.waitForTimeout(15000); // wait for preloader + Three.js preloads
    // Force-hide preloader so we can see the actual scene
    await page.evaluate(() => {
        document.querySelector(".preloader")?.style.setProperty("display","none","important");
        document.querySelectorAll(".preloader__half,.preloader__overlay,.preloader__ring,.preloader__percentage")
            .forEach((n) => n.style.setProperty("display","none","important"));
        document.body.style.overflow = "auto";
    });
    await fn(page);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `.tmp/verify-${label}.png` });
    await page.close();
    const ok = errs.length === 0;
    results.push({ label, ok, errors: errs.slice(0, 3) });
    console.log(`[${label}] ${ok ? "OK" : "FAIL"} (errors=${errs.length})`);
    errs.slice(0, 3).forEach((e) => console.log("  -", e.substring(0, 200)));
    return ok;
}

// Test 1: entrance page (without markEntered) ¡ª entrance decorations visible
await check("01-entrance", async () => {});

// Test 2: after markEntered ¡ª corridor visible, no errors
await check("02-corridor", async (page) => {
    await page.evaluate(() => window.__scene.markEntered());
    await page.waitForTimeout(2500);
});

// Test 3: scroll down corridor to see chinese door labels (no enterRoom)
await check("03-corridor-scroll", async (page) => {
    await page.evaluate(() => window.__scene.markEntered());
    await page.waitForTimeout(1500);
    for (let i = 0; i < 18; i++) {
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(100);
    }
    await page.waitForTimeout(1500);
});

// Test 4: scroll further to see all 5 doors
await check("04-corridor-deep", async (page) => {
    await page.evaluate(() => window.__scene.markEntered());
    await page.waitForTimeout(1500);
    for (let i = 0; i < 35; i++) {
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(80);
    }
    await page.waitForTimeout(1500);
});

await browser.close();
console.log("\n=== SUMMARY ===");
const fails = results.filter((r) => !r.ok);
if (fails.length === 0) {
    console.log("ALL " + results.length + " CHECKS PASSED (PostHog/network noise filtered)");
} else {
    console.log(`${fails.length} FAILED of ${results.length}`);
    fails.forEach((f) => console.log(`  ${f.label}:`, f.errors));
}
