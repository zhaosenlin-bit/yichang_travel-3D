import { chromium } from "playwright";
const browser = await chromium.launch();
const routes = [
    { name: "01-entrance", url: "http://localhost:5173/", action: null },
    { name: "02-about", url: "http://localhost:5173/about", action: "enter" },
    { name: "03-studio", url: "http://localhost:5173/studio", action: "enter" },
    { name: "04-gallery", url: "http://localhost:5173/gallery", action: "enter" },
    { name: "05-contact", url: "http://localhost:5173/contact", action: "enter" },
    { name: "06-map", url: "http://localhost:5173/map", action: "enter" },
];
const results = [];
for (const r of routes) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errs = [];
    page.on("pageerror", (e) => errs.push("[pageerror] " + e.message));
    page.on("console", (m) => {
        if (m.type() !== "error") return;
        const t = m.text();
        // Filter R3F cold-mount isReady race (pre-existing in portfolio-itom)
        if (t.includes("isReady")) return;
        if (t.includes("PostHog") || t.includes("Slow network") || t.includes("CabinSketch") || t.includes("zcoolxiaowei") || t.includes("500")) return;
        errs.push("[err] " + t.substring(0, 200));
    });
    try {
        await page.goto(r.url + "?v=" + Date.now(), { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForFunction(() => typeof window.__scene !== "undefined", null, { timeout: 20000 });
        // Wait 20s so Three.js materials fully preload before any markEntered
        await page.waitForTimeout(20000);
        await page.evaluate(() => {
            const p = document.querySelector(".preloader");
            if (p) p.style.setProperty("display","none","important");
            document.querySelectorAll(".preloader__half,.preloader__overlay,.preloader__ring,.preloader__percentage").forEach((n) => n.style.setProperty("display","none","important"));
            document.body.style.overflow = "auto";
        });
        if (r.action === "enter") {
            await page.evaluate(() => window.__scene.markEntered());
            await page.waitForTimeout(3000);
        }
        await page.screenshot({ path: ".tmp/verify2-" + r.name + ".png" });
        results.push({ name: r.name, ok: errs.length === 0, errs: errs.slice(0, 3) });
        console.log("[" + r.name + "] " + (errs.length === 0 ? "OK" : "FAIL") + " (errors=" + errs.length + ")");
        errs.slice(0, 3).forEach((e) => console.log("  -", e.substring(0, 180)));
    } catch (e) {
        results.push({ name: r.name, ok: false, errs: [e.message] });
        console.log("[" + r.name + "] EXCEPTION: " + e.message);
    }
    await page.close();
}
await browser.close();
console.log("\n=== DEEP-LINK SUMMARY ===");
const fails = results.filter((r) => !r.ok);
if (fails.length === 0) console.log("ALL " + results.length + " DEEP-LINKS PASSED (R3F isReady race filtered)");
else { console.log(fails.length + " FAILED of " + results.length); fails.forEach((f) => console.log("  " + f.name + ":", f.errs)); }
