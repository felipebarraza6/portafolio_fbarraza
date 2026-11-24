export type Paint = (x: number, y: number, u: number, v: number) => string | null;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export const checker = (x: number, y: number) => (x + y) % 2 === 0;
export const bayer = (x: number, y: number) => BAYER[(y % 4) * 4 + (x % 4)] / 16;

export const METAL = {
  ink: '#121314',
  deep: '#1d2021',
  dark: '#282828',
  base: '#3c3836',
  mid: '#504945',
  light: '#665c54',
  high: '#7c6f64',
  spec: '#a89984',
};

/** Low-res pixel buffer: shapes are rasterized by hand so edges stay crisp and outlined. */
export class Sprite {
  readonly w: number;
  readonly h: number;
  readonly px: (string | null)[];

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.px = new Array(w * h).fill(null);
  }

  set(x: number, y: number, c: string | null) {
    if (c === null || x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.px[y * this.w + x] = c;
  }

  get(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return this.px[y * this.w + x];
  }

  shape(
    inside: (x: number, y: number) => boolean,
    box: [number, number, number, number],
    paint: Paint,
    outline: string | null = METAL.ink,
  ) {
    const [x0, y0, x1, y1] = box;
    const mask = (x: number, y: number) => x >= x0 && x <= x1 && y >= y0 && y <= y1 && inside(x, y);
    for (let y = Math.floor(y0); y <= y1; y++) {
      for (let x = Math.floor(x0); x <= x1; x++) {
        if (!mask(x, y)) continue;
        const edge = !mask(x - 1, y) || !mask(x + 1, y) || !mask(x, y - 1) || !mask(x, y + 1);
        const u = (x - x0) / Math.max(1, x1 - x0);
        const v = (y - y0) / Math.max(1, y1 - y0);
        this.set(x, y, edge && outline ? outline : paint(x, y, u, v));
      }
    }
  }

  rrect(x: number, y: number, w: number, h: number, r: number, paint: Paint, outline: string | null = METAL.ink) {
    const x1 = x + w - 1;
    const y1 = y + h - 1;
    const inside = (px: number, py: number) => {
      const cx = px < x + r ? x + r : px > x1 - r ? x1 - r : px;
      const cy = py < y + r ? y + r : py > y1 - r ? y1 - r : py;
      return (px - cx) ** 2 + (py - cy) ** 2 <= r * r + r * 0.6;
    };
    this.shape(inside, [x, y, x1, y1], paint, outline);
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, paint: Paint, outline: string | null = METAL.ink) {
    const inside = (x: number, y: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.05;
    this.shape(inside, [Math.floor(cx - rx), Math.floor(cy - ry), Math.ceil(cx + rx), Math.ceil(cy + ry)], paint, outline);
  }

  line(x0: number, y0: number, x1: number, y1: number, c: string) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= steps; i++) {
      const t = steps ? i / steps : 0;
      this.set(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), c);
    }
  }

  /** Ordered-dither fade toward transparency below `from`, like a sprite dissolving into the floor. */
  fadeBelow(from: number) {
    for (let y = from; y < this.h; y++) {
      const t = (y - from) / Math.max(1, this.h - from);
      for (let x = 0; x < this.w; x++) if (bayer(x, y) < t) this.px[y * this.w + x] = null;
    }
  }

  toCanvas() {
    const c = document.createElement('canvas');
    c.width = this.w;
    c.height = this.h;
    const ctx = c.getContext('2d');
    if (!ctx) return c;
    const img = ctx.createImageData(this.w, this.h);
    this.px.forEach((col, i) => {
      if (!col) return;
      const n = parseInt(col.slice(1), 16);
      img.data[i * 4] = (n >> 16) & 255;
      img.data[i * 4 + 1] = (n >> 8) & 255;
      img.data[i * 4 + 2] = n & 255;
      img.data[i * 4 + 3] = 255;
    });
    ctx.putImageData(img, 0, 0);
    return c;
  }
}

/** Brushed-metal shading: lit top-left, shadowed and dithered toward the bottom-right. */
export const metal: Paint = (x, y, u, v) => {
  if (v < 0.07) return METAL.high;
  if (v < 0.16) return checker(x, y) ? METAL.light : METAL.mid;
  if (u < 0.05) return METAL.mid;
  if (u > 0.94 || v > 0.86) return METAL.dark;
  if (v > 0.7) return checker(x, y) ? METAL.dark : METAL.base;
  if (v < 0.3) return METAL.mid;
  return u > 0.82 && checker(x, y) ? METAL.dark : METAL.base;
};

/** Sphere-like shading for knobs and antenna balls. */
export const ball: Paint = (x, y, u, v) => {
  const d = u + v;
  if (d < 0.55) return METAL.spec;
  if (d < 0.9) return METAL.light;
  if (d < 1.3) return checker(x, y) ? METAL.mid : METAL.base;
  return METAL.dark;
};

export const solid =
  (c: string): Paint =>
  () =>
    c;

/** Draws an ASCII bitmap: each char maps to a color, '.' stays transparent. */
export function bitmap(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  ox: number,
  oy: number,
  colors: Record<string, string>,
) {
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = colors[row[x]];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
  });
}
