const { chromium } = require("playwright");
const rooms = [
  ["yichang-station", "station"],
  ["museum", "museum"],
  ["three-gorges-dam", "dam"],
  ["three-gorges-family", "family"],
  ["map", "map"],
];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  for (const [slug, nick] of rooms) {
    const errs = [];
    page.removeAllListeners("pageerror");
    page.removeAllListeners("console");
    page.on("pageerror", (e) => errs.push("[pageerror] " + e.message));
    page.on("console", (m) => { if (m.type() === "error") errs.push("[console.error] " + m.text().substring(0, 200)); });
    await page.goto("http://localhost:5173/room/" + slug, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(7000);
    await page.screenshot({ path: ".tmp/" + nick + ".png" });
    console.log("[" + nick + "] errs:", errs.length);
    errs.slice(0, 5).forEach((e) => console.log("  -", e));
  }
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
