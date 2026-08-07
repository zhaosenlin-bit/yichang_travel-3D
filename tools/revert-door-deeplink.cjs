const fs = require("fs");
const p = "src/components/canvas/corridor/DoorSection.jsx";
let s = fs.readFileSync(p, "utf8");
const crlf = s.includes("\r\n"); s = s.replace(/\r\n/g, "\n");

// 1. Remove hasEntered from useScene destructure
const old1 = `        currentRoom, // We need to know if the global room changed (teleportation)
        hasEntered,  // [DEEP LINK] Did the user enter the corridor?
        exitRequested,`;
const fix1 = `        currentRoom, // We need to know if the global room changed (teleportation)
        exitRequested,`;
if (s.includes(old1)) {
  s = s.replace(old1, fix1);
  console.log("ok: removed hasEntered from destructure");
}

// 2. Remove the entire deep-link hook block
const old2 = `    }, [pendingDoorClick, doorId, segmentIndex, isOpen, isAnimating]);
    // === DEEP LINK AUTO-SHOW ===
    // When the global currentRoom matches this door (e.g. via URL deeplink or programmatic enterRoom),
    // and we're on segment 0, force the room to render and set isInsideRoom=true
    // so the deep-link flow works without the camera-teleport dance.
    useEffect(() => {
        if (currentRoom === doorId && segmentIndex === 0 && hasEntered && !shouldRenderRoom) {
            setShouldRenderRoom(true);
            setIsInsideRoom(true);
        }
        // If user navigates away, also reset isInsideRoom if not currently the active door
        if (currentRoom !== doorId && isInsideRoom && segmentIndex === 0) {
            setIsInsideRoom(false);
        }
    }, [currentRoom, doorId, hasEntered, shouldRenderRoom, isInsideRoom, segmentIndex]);


    // --- SILENT RESET FOR TELEPORTATION ---`;
const fix2 = `    }, [pendingDoorClick, doorId, segmentIndex, isOpen, isAnimating]);

    // --- SILENT RESET FOR TELEPORTATION ---`;
if (s.includes(old2)) {
  s = s.replace(old2, fix2);
  console.log("ok: removed deep-link auto-show hook");
} else {
  console.log("warn: deep-link hook block not matched, skipping");
}

if (crlf) s = s.replace(/\n/g, "\r\n");
fs.writeFileSync(p, s);
console.log("done");
