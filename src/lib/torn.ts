// Deterministic "torn paper" edges, generated as SVG so they are crisp at any size.

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Jagged horizontal edge path in a 1000×H box; the paper fills everything below the tear. */
export function tornStripPath(seed = 7, h = 40, depth = 22) {
  const r = rng(seed);
  let d = `M0 ${h} L0 ${depth * r()}`;
  for (let x = 0; x <= 1000; x += 3 + r() * 6) {
    const wave = (Math.sin(x / 40) * 0.5 + 0.5) * depth * 0.55 + (Math.sin(x / 13) * 0.5 + 0.5) * depth * 0.2;
    d += ` L${x.toFixed(1)} ${(wave + r() * depth * 0.2).toFixed(1)}`;
  }
  return `${d} L1000 ${depth * r()} L1000 ${h} Z`;
}

/** CSS mask (data URL) for a photo whose left and bottom edges look torn. */
export function tornPhotoMask(seed = 3) {
  const r = rng(seed);
  const pts: string[] = ["1000,0", "1000,960"];
  // bottom edge, right → left: soft wave + fine fibres
  for (let x = 1000; x >= 40; x -= 4 + r() * 7) {
    const wave = Math.sin(x / 55) * 6 + Math.sin(x / 17) * 2.5;
    pts.push(`${x.toFixed(1)},${(968 + wave + r() * 5).toFixed(1)}`);
  }
  // left edge, bottom → top: slants inwards lower down, organic wave + fibres
  for (let y = 985; y >= 0; y -= 4 + r() * 7) {
    const slant = 18 + (y / 1000) * 70;
    const wave = Math.sin(y / 60) * 10 + Math.sin(y / 23 + 1) * 5;
    pts.push(`${(slant + wave + r() * 6).toFixed(1)},${y.toFixed(1)}`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none"><polygon fill="#000" points="${pts.join(" ")}"/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}
