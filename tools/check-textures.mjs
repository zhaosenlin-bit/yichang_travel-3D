import fs from "node:fs";
import path from "node:path";
const txt = fs.readFileSync("src/config/texturePreloadList.js", "utf8");
const refs = [...txt.matchAll(/(['"])(\/[^\1''" ]+\.webp)\1/g)].map((m) => m[2]);
const publicDir = "public";
const missing = [];
for (const r of refs) {
    const p = path.join(publicDir, r);
    if (!fs.existsSync(p)) missing.push(r);
}
console.log("Total refs:", refs.length);
console.log("Missing:", missing.length);
if (missing.length > 0) {
    console.log(missing.slice(0, 20).join("\n"));
}
