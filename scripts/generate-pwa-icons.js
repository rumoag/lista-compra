// Script de un solo uso para generar los iconos PWA (icons/icon-*.png) sin dependencias
// externas: dibuja una bolsa de la compra sobre fondo azul píxel a píxel y codifica PNG
// a mano (IHDR/IDAT/IEND) usando zlib.deflateSync, que ya viene en Node. Ver
// aidlc-docs/construction/pwa/.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const PRIMARY = [80, 102, 40, 255]; // #506628 (--md-sys-color-primary, css/tokens.css)
const WHITE = [255, 255, 255, 255]; // #ffffff (--md-sys-color-on-primary)

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(pixels, size) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 4);
    raw[rowStart] = 0; // sin filtro
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixels[y * size + x];
      const off = rowStart + 1 + x * 4;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
      raw[off + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // profundidad de bit
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Geometría del icono: fondo azul + bolsa de la compra blanca ---

function pointInConvexQuad(px, py, quad) {
  let sign = 0;
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = quad[i];
    const [bx, by] = quad[(i + 1) % 4];
    const cross = (bx - ax) * (py - ay) - (by - ay) * (px - ax);
    const s = Math.sign(cross);
    if (s === 0) continue;
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return true;
}

function distToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * abx + (py - ay) * aby) / (abx * abx + aby * aby)));
  const cx = ax + t * abx;
  const cy = ay + t * aby;
  return Math.hypot(px - cx, py - cy);
}

function drawIcon(size, { maskable = false } = {}) {
  const pixels = new Array(size * size);
  // Zona segura para iconos "maskable": el contenido debe caber en el 80% central.
  const pad = maskable ? size * 0.14 : 0;
  const cornerRadius = maskable ? 0 : size * 0.22;

  const cx = size / 2;
  const bagTop = pad + size * 0.36 * (1 - pad / size === 1 ? 1 : 1);
  const scale = (size - 2 * pad) / size;
  const S = (v) => pad + v * scale;

  const bagQuad = [
    [S(size * 0.32), S(size * 0.4)],
    [S(size * 0.68), S(size * 0.4)],
    [S(size * 0.76), S(size * 0.82)],
    [S(size * 0.24), S(size * 0.82)],
  ];
  const handleLeft = { cx: S(size * 0.4), cy: S(size * 0.32), rOuter: size * 0.09 * scale, rInner: size * 0.06 * scale };
  const handleRight = { cx: S(size * 0.6), cy: S(size * 0.32), rOuter: size * 0.09 * scale, rInner: size * 0.06 * scale };
  const checkThickness = size * 0.045 * scale;
  const checkA = [S(size * 0.4), S(size * 0.6)];
  const checkB = [S(size * 0.48), S(size * 0.68)];
  const checkC = [S(size * 0.62), S(size * 0.5)];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let color = PRIMARY;

      if (!maskable) {
        // Recorta esquinas redondeadas del fondo.
        const rx = cornerRadius;
        const nearestX = x < rx ? rx : x > size - rx ? size - rx : x;
        const nearestY = y < rx ? rx : y > size - rx ? size - rx : y;
        const inCornerZone = (x < rx || x > size - rx) && (y < rx || y > size - rx);
        if (inCornerZone && Math.hypot(x - nearestX, y - nearestY) > rx) {
          pixels[y * size + x] = [0, 0, 0, 0];
          continue;
        }
      }

      if (pointInConvexQuad(x + 0.5, y + 0.5, bagQuad)) {
        color = WHITE;
      }

      for (const h of [handleLeft, handleRight]) {
        const d = Math.hypot(x + 0.5 - h.cx, y + 0.5 - h.cy);
        if (d <= h.rOuter && d >= h.rInner && y + 0.5 < h.cy + h.rOuter * 0.35) {
          color = WHITE;
        }
      }

      if (
        distToSegment(x + 0.5, y + 0.5, ...checkA, ...checkB) <= checkThickness ||
        distToSegment(x + 0.5, y + 0.5, ...checkB, ...checkC) <= checkThickness
      ) {
        if (pointInConvexQuad(x + 0.5, y + 0.5, bagQuad)) color = PRIMARY;
      }

      pixels[y * size + x] = color;
    }
  }

  return pixels;
}

mkdirSync('icons', { recursive: true });

const targets = [
  { file: 'icons/icon-192.png', size: 192, maskable: false },
  { file: 'icons/icon-512.png', size: 512, maskable: false },
  { file: 'icons/icon-maskable-512.png', size: 512, maskable: true },
  { file: 'icons/apple-touch-icon.png', size: 180, maskable: false },
];

for (const { file, size, maskable } of targets) {
  const pixels = drawIcon(size, { maskable });
  const png = encodePng(pixels, size);
  writeFileSync(file, png);
  console.log(`Generado ${file} (${size}x${size})`);
}
