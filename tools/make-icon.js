'use strict';
// Generates build/icon.ico (multi-size, PNG-compressed entries) + build/icon.png (256px).
// Design: dark rounded square, cyan ">" prompt chevron, green underscore.
// Zero dependencies: manual PNG encoding (zlib) + ICO assembly.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---------- PNG encoding ----------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length);
  return out;
}

function encodePng(rgba, w, h) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- drawing (SDF + supersampling) ----------

function capsule(px, py, x1, y1, x2, y2, r) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy || 1)));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy) - r;
}

function roundedRect(px, py, c, half, rad) {
  const qx = Math.abs(px - c) - (half - rad);
  const qy = Math.abs(py - c) - (half - rad);
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - rad;
}

const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const TOP = hex('#3b4252');
const BOTTOM = hex('#1b1e27');
const CHEVRON = hex('#88c0d0');
const UNDERSCORE = hex('#a3be8c');

function draw(size) {
  const SS = 4; // supersample factor
  const N = size * SS;
  const rgba = Buffer.alloc(size * size * 4);
  const c = N / 2;
  const half = N * 0.5;
  const rad = N * 0.22;
  const stroke = N * 0.085; // capsule radius for chevron arms

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let rSum = 0, gSum = 0, bSum = 0, aSum = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x * SS + sx + 0.5;
          const py = y * SS + sy + 0.5;
          if (roundedRect(px, py, c, half, rad) > 0) continue; // transparent corner
          const t = py / N;
          let r = TOP[0] + (BOTTOM[0] - TOP[0]) * t;
          let g = TOP[1] + (BOTTOM[1] - TOP[1]) * t;
          let b = TOP[2] + (BOTTOM[2] - TOP[2]) * t;
          // ">" chevron: upper arm (0.26,0.26)->(0.58,0.5), lower arm (0.58,0.5)->(0.26,0.74)
          const dUpper = capsule(px, py, 0.26 * N, 0.26 * N, 0.58 * N, 0.50 * N, stroke);
          const dLower = capsule(px, py, 0.58 * N, 0.50 * N, 0.26 * N, 0.74 * N, stroke);
          const dChev = Math.min(dUpper, dLower);
          // "_" underscore: (0.64,0.74)->(0.84,0.74)
          const dUnder = capsule(px, py, 0.64 * N, 0.74 * N, 0.84 * N, 0.74 * N, stroke);
          const d = Math.min(dChev, dUnder);
          if (d < 0) {
            const col = dUnder < dChev ? UNDERSCORE : CHEVRON;
            r = col[0]; g = col[1]; b = col[2];
          }
          rSum += r; gSum += g; bSum += b; aSum += 255;
        }
      }
      const n = SS * SS;
      const i = (y * size + x) * 4;
      rgba[i] = Math.round(rSum / n);
      rgba[i + 1] = Math.round(gSum / n);
      rgba[i + 2] = Math.round(bSum / n);
      rgba[i + 3] = Math.round(aSum / n);
    }
  }
  return rgba;
}

// ---------- ICO assembly (PNG-compressed entries) ----------

function buildIco(pngs) {
  // pngs: [{size, buf}] sorted largest first
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // icon
  header.writeUInt16LE(count, 4);
  const entries = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  pngs.forEach((p, i) => {
    const e = 16 * i;
    entries[e] = p.size >= 256 ? 0 : p.size;      // width
    entries[e + 1] = p.size >= 256 ? 0 : p.size;  // height
    entries[e + 2] = 0;  // palette
    entries[e + 3] = 0;  // reserved
    entries.writeUInt16LE(1, e + 4);       // planes
    entries.writeUInt16LE(32, e + 6);      // bpp
    entries.writeUInt32LE(p.buf.length, e + 8);
    entries.writeUInt32LE(offset, e + 12);
    offset += p.buf.length;
  });
  return Buffer.concat([header, entries, ...pngs.map((p) => p.buf)]);
}

// ---------- run ----------

const SIZES = [256, 128, 64, 48, 32, 24, 16];
const pngs = SIZES.map((size) => ({ size, buf: encodePng(draw(size), size, size) }));

const outDir = path.join(__dirname, '..', 'build');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'icon.ico'), buildIco(pngs));
fs.writeFileSync(path.join(outDir, 'icon.png'), pngs[0].buf);
console.log(`build/icon.ico (${pngs.length} sizes: ${SIZES.join(',')}) + build/icon.png written`);
