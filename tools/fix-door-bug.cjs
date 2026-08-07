const fs = require("fs");
const p = "src/components/canvas/corridor/DoorSection.jsx";
let s = fs.readFileSync(p, "utf8");
const crlf = s.includes("\r\n"); s = s.replace(/\r\n/g, "\n");

// Fix: deep-link hook uses undefined `isSegment0` variable
// Replace condition to use `segmentIndex === 0` directly (no need for local isSegment0)
const old = `    useEffect(() => {
        if (currentRoom === doorId && segmentIndex === 0 && hasEntered && !shouldRenderRoom) {
            setShouldRenderRoom(true);
            setIsInsideRoom(true);
        }
        // If user navigates away, also reset isInsideRoom if not currently the active door
        if (currentRoom !== doorId && isInsideRoom && isSegment0) {
            setIsInsideRoom(false);
        }
    }, [currentRoom, doorId, hasEntered, shouldRenderRoom, isInsideRoom, segmentIndex]);`;
const fix = `    useEffect(() => {
        if (currentRoom === doorId && segmentIndex === 0 && hasEntered && !shouldRenderRoom) {
            setShouldRenderRoom(true);
            setIsInsideRoom(true);
        }
        // If user navigates away, also reset isInsideRoom if not currently the active door
        if (currentRoom !== doorId && isInsideRoom && segmentIndex === 0) {
            setIsInsideRoom(false);
        }
    }, [currentRoom, doorId, hasEntered, shouldRenderRoom, isInsideRoom, segmentIndex]);`;

if (s.includes(old)) {
  s = s.replace(old, fix);
  console.log("ok: fixed undefined isSegment0 in deep-link hook");
} else {
  console.log("err: pattern not found");
  // try direct replacement
  s = s.replace("&& isInsideRoom && isSegment0", "&& isInsideRoom && segmentIndex === 0");
}

if (crlf) s = s.replace(/\n/g, "\r\n");
fs.writeFileSync(p, s);
console.log("done");
