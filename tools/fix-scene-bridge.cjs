const fs = require("fs");
const p = "src/context/SceneContext.jsx";
let s = fs.readFileSync(p, "utf8");
const crlf = s.includes("\r\n"); s = s.replace(/\r\n/g, "\n");

// Replace the debug bridge: do NOT delete window.__scene on cleanup (causes race condition
// when consumers read window.__scene.enterRoom during the cleanup/re-set window).
const old = `    // === DEBUG BRIDGE (for Playwright / manual testing) ===
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.__scene = {
                enterRoom,
                exitRoom,
                markEntered,
                teleportTo,
                hasEntered,
                currentRoom,
            };
        }
        return () => {
            if (typeof window !== 'undefined' && window.__scene) {
                delete window.__scene;
            }
        };
    }, [enterRoom, exitRoom, markEntered, teleportTo, hasEntered, currentRoom]);`;

const fix = `    // === DEBUG BRIDGE (for Playwright / manual testing) ===
    // We use a ref to expose the latest values WITHOUT triggering re-renders.
    // The bridge itself only mounts once; values are updated via ref assignment,
    // so consumers can read window.__scene.enterRoom() at any time without race.
    const bridgeRef = useRef({});
    useEffect(() => {
        bridgeRef.current.enterRoom = enterRoom;
        bridgeRef.current.exitRoom = exitRoom;
        bridgeRef.current.markEntered = markEntered;
        bridgeRef.current.teleportTo = teleportTo;
    }, [enterRoom, exitRoom, markEntered, teleportTo]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.__scene = {
                enterRoom: (...a) => bridgeRef.current.enterRoom?.(...a),
                exitRoom: (...a) => bridgeRef.current.exitRoom?.(...a),
                markEntered: () => bridgeRef.current.markEntered?.(),
                teleportTo: (...a) => bridgeRef.current.teleportTo?.(...a),
                get hasEntered() { return hasEntered; },
                get currentRoom() { return currentRoom; },
            };
        }
    }, [hasEntered, currentRoom]);`;

if (s.includes(old)) {
  s = s.replace(old, fix);
  console.log("ok: SceneContext debug bridge fixed");
} else {
  console.log("err: bridge not matched");
  process.exit(1);
}

if (crlf) s = s.replace(/\n/g, "\r\n");
fs.writeFileSync(p, s);
console.log("done");
