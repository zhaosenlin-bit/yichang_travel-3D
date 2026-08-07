import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:5173/";
const out = process.argv[3] || ".tmp/snap.png";
const wait = parseInt(process.argv[4] || "8000", 10);
const skipPre = process.argv[5] === "1";
const room = process.argv[6] || "";

const ROOM_DOOR_Z = {
  about: -36,    // THE ABOUT door in segment 0
  studio: -20,   // THE STUDIO
  gallery: -6,   // THE GALLERY
  contact: -50,  // LET'S CONNECT
  map: -63,      // 手绘地图
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
page.on("pageerror", (e) => errs.push("[pageerror] " + e.message));
page.on("console", (m) => { if (m.type() === "error") errs.push("[err] " + m.text().substring(0, 220)); });

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForFunction(() => typeof window.__scene !== "undefined", null, { timeout: 20000 });

if (skipPre) {
  await page.evaluate(() => {
    const el = document.querySelector(".preloader");
    if (el) el.style.display = "none";
    document.querySelectorAll(".preloader__half, .preloader__overlay, .preloader__ring, .preloader__percentage")
      .forEach(n => n.style.display = "none");
    document.body.style.overflow = "auto";
  });
}

if (room) {
  const doorZ = ROOM_DOOR_Z[room] || -36;
  // Place camera at door Z - 5 so user looks INTO the room
  await page.evaluate(({ doorZ }) => {
    // Find the threejs canvas and grab its camera via window.__three camera
    const canvas = document.querySelector(".canvas-wrapper canvas");
    if (!canvas) return;
    // Force mark entered + enter room + teleport camera
    window.__scene.markEntered();
    // hack camera: dispatch a fake scroll event so useInfiniteCamera moves to doorZ
    // Instead: directly set camera position via the camera reference if accessible.
    // Fall back: just enterRoom (DoorSection deep-link hook will setShouldRenderRoom=true)
    window.__scene.enterRoom("__placeholder__"); // clear current
    setTimeout(() => window.__scene.enterRoom(roomArg => {
      // resolve
    }), 50);
  }, { doorZ });
  // real flow:
  await page.evaluate((r) => { window.__scene.enterRoom(r); }, room);
  // hack: also try to directly move camera via injected helper
  await page.evaluate((z) => {
    // The camera lives in threejs renderer; access via window.__r3f if exposed. We don't have it.
    // Instead, scroll the window to drive useInfiniteCamera. scrollPosition needs to be at doorZ.
    // Scroll-driven: just set window.scrollTo is irrelevant for 3D; useInfiniteCamera uses wheel events.
    // No-op fallback: keep camera as-is.
  }, doorZ);
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    const el = document.querySelector(".preloader");
    if (el) el.style.display = "none";
    document.querySelectorAll(".preloader__half, .preloader__overlay, .preloader__ring, .preloader__percentage")
      .forEach(n => n.style.display = "none");
    document.body.style.overflow = "auto";
  });
  await page.waitForTimeout(1000);
} else {
  await page.waitForTimeout(wait);
}

await page.screenshot({ path: out });
console.log("[snap]", url, "->", out, "errs=" + errs.length);
errs.slice(0, 6).forEach((e) => console.log("  -", e));
await browser.close();
