(async()=>{
  try {
    const r = await fetch("http://localhost:5173/");
    console.log("vite:", r.status, "len:", (await r.text()).length);
    const r2 = await fetch("http://localhost:17493/health");
    console.log("voicebox:", r2.status, await r2.text());
  } catch(e) { console.log("err:", e.message); }
})();
