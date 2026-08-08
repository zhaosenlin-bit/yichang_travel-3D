import fs from "node:fs";
const path = "src/components/canvas/rooms/About/InfiniteSkyManager.jsx";
let txt = fs.readFileSync(path, "utf8");

const REPL = [
    [">\r\n                JOURNEY\r\n            </Text>", ">\r\n                \u5b9c\u660c\u4e1c\u7ad9\r\n            </Text>"],
    [">\r\n                My path so far...\r\n            </Text>", ">\r\n                \u4e07\u91cc\u957f\u6c5f\u00b7\u5165\u5ddd\u7b2c\u4e00\u7ad9\r\n            </Text>"],
    [">\r\n                    2025-NOW\r\n                </Text>", ">\r\n                    2025 \u00b7 \u667a\u80fd\u9ad8\u94c1\r\n                </Text>"],
    [">\r\n                    2023-NOW\r\n                </Text>", ">\r\n                    2012 \u00b7 \u901a\u8f66\u8fd0\u8425\r\n                </Text>"],
];

let n = 0;
for (const [from, to] of REPL) {
    if (txt.includes(from)) {
        txt = txt.replace(from, to);
        n++;
        console.log("REPLACED:", from.replace(/\r?\n/g, " ").substring(0, 60));
    } else {
        console.log("MISS:", from.replace(/\r?\n/g, " ").substring(0, 60));
    }
}
fs.writeFileSync(path, txt, "utf8");
console.log("Total replacements:", n);
